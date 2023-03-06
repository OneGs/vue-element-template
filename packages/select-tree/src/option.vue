<script>
import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition';
import { UNCHECKED, INDETERMINATE, CHECKED } from './constants';
import { onLeftClick } from './utils';

let arrowPlaceholder, checkMark, minusMark;

const Option = {
  name: 'vue-treeselect--option',

  components: { ElCollapseTransition },

  inject: ['instance'],

  props: {
    node: {
      type: Object,
      required: true
    }
  },

  computed: {
    shouldExpand() {
      const { instance, node } = this;

      return node.isBranch && instance.shouldExpand(node);
    },

    shouldShow() {
      const { instance, node } = this;

      return instance.shouldShowOptionInMenu(node);
    }
  },

  methods: {
    renderOption(listItemStyles) {
      const { instance, node } = this;
      const optionClass = {
        'el-select-tree__option': true,
        'el-select-tree__option--disabled': node.isDisabled,
        'el-select-tree__option--selected': instance.isSelected(node),
        'el-select-tree__option--highlight': node.isHighlighted,
        'el-select-tree__option--matched':
          instance.localSearch.active && node.isMatched,
        'el-select-tree__option--hide': !this.shouldShow
      };

      return (
        <div
          class={optionClass}
          style={listItemStyles}
          onMouseenter={this.handleMouseEnterOption}
          data-id={node.id}>
          {this.renderArrow()}
          {this.renderLabelContainer([
            this.renderCheckboxContainer([this.renderCheckbox()]),
            this.renderLabel()
          ])}
        </div>
      );
    },

    renderSubOptionsList() {
      if (!this.shouldExpand) return null;

      return (
        <div class="el-select-tree__list">
          {this.renderSubOptions()}
          {this.renderNoChildrenTip()}
          {this.renderLoadingChildrenTip()}
          {this.renderLoadingChildrenErrorTip()}
        </div>
      );
    },

    renderArrow() {
      const { instance, node } = this;

      if (instance.shouldFlattenOptions && this.shouldShow) return null;

      if (node.isBranch) {
        const arrowClass = {
          'el-icon-caret-right': true,
          'el-select-tree__icon-item': true,
          'el-select-tree__option-arrow--rotated': this.shouldExpand
        };

        return (
          <div
            class="el-select-tree__option-arrow-container"
            onMousedown={this.handleMouseDownOnArrow}>
            <i class={arrowClass} />
          </div>
        );
      }

      // For leaf nodes, we render a placeholder to keep its label aligned to
      // branch nodes. Unless there is no branch nodes at all (a normal
      // non-tree select).
      if (/* node.isLeaf && */ instance.hasBranchNodes) {
        if (!arrowPlaceholder) {
          arrowPlaceholder = (
            <div class="el-select-tree__option-arrow-placeholder">&nbsp;</div>
          );
        }

        return arrowPlaceholder;
      }

      return null;
    },

    renderLabelContainer(children) {
      return (
        <div
          class="el-select-tree__label-container"
          onMousedown={this.handleMouseDownOnLabelContainer}>
          {children}
        </div>
      );
    },

    renderCheckboxContainer(children) {
      const { instance, node } = this;

      if (instance.single) return null;
      if (instance.disableBranchNodes && node.isBranch) return null;

      return <div class="el-select-tree__checkbox-container">{children}</div>;
    },

    renderCheckbox() {
      const { instance, node } = this;
      const checkedState = instance.forest.checkedStateMap[node.id];
      const checkboxClass = {
        'el-select-tree__checkbox': true,
        'el-select-tree__checkbox--checked': checkedState === CHECKED,
        'el-select-tree__checkbox--indeterminate':
          checkedState === INDETERMINATE,
        'el-select-tree__checkbox--unchecked': checkedState === UNCHECKED,
        'el-select-tree__checkbox--disabled': node.isDisabled
      };

      if (!checkMark) checkMark = <span class="el-select-tree__check-mark" />;
      if (!minusMark) minusMark = <span class="el-select-tree__minus-mark" />;

      return (
        <span class={checkboxClass}>
          {checkMark}
          {minusMark}
        </span>
      );
    },

    renderLabel() {
      const { instance, node } = this;
      const shouldShowCount =
        node.isBranch &&
        (instance.localSearch.active
          ? instance.showCountOnSearchComputed
          : instance.showCount);

      const count = shouldShowCount
        ? instance.localSearch.active
          ? instance.localSearch.countMap[node.id][instance.showCountOf]
          : node.count[instance.showCountOf]
        : NaN;

      const labelClassName = 'el-select-tree__label';
      const countClassName = 'el-select-tree__count';
      const customLabelRenderer = instance.$scopedSlots['option-label'];

      if (customLabelRenderer) {
        return customLabelRenderer({
          node,
          shouldShowCount,
          count,
          labelClassName,
          countClassName
        });
      }

      return (
        <label class={labelClassName}>
          {node.label}
          {shouldShowCount && <span class={countClassName}>({count})</span>}
        </label>
      );
    },

    renderSubOptions() {
      const { node } = this;

      if (!node.childrenStates.isLoaded) return null;

      return node.children.map((childNode) => (
        <Option node={childNode} key={childNode.id} />
      ));
    },

    renderNoChildrenTip() {
      const { instance, node } = this;

      if (!node.childrenStates.isLoaded || node.children.length) return null;

      return (
        <span type="no-children" icon="warning">
          {instance.noChildrenText}
        </span>
      );
    },

    renderLoadingChildrenTip() {
      const { instance, node } = this;

      if (!node.childrenStates.isLoading) return null;

      return (
        <span type="loading" icon="loader">
          {instance.loadingText}
        </span>
      );
    },

    renderLoadingChildrenErrorTip() {
      const { instance, node } = this;

      if (!node.childrenStates.loadingError) return null;

      return (
        <span type="error" icon="error">
          {node.childrenStates.loadingError}
          <a
            class="el-select-tree__retry"
            title={instance.retryTitle}
            onMousedown={this.handleMouseDownOnRetry}>
            {instance.retryText}
          </a>
        </span>
      );
    },

    handleMouseEnterOption(evt) {
      const { instance, node } = this;

      if (evt.target !== evt.currentTarget) return;

      instance.setCurrentHighlightedOption(node, false);
    },

    handleMouseDownOnArrow: onLeftClick(
      function handleMouseDownOnOptionArrow() {
        const { instance, node } = this;

        instance.toggleExpanded(node);
      }),

    handleMouseDownOnLabelContainer: onLeftClick(
      function handleMouseDownOnLabelContainer() {
        const { instance, node } = this;

        if (node.isBranch && instance.disableBranchNodes) {
          instance.toggleExpanded(node);
        } else {
          instance.select(node);
        }
      }
    ),

    handleMouseDownOnRetry: onLeftClick(function handleMouseDownOnRetry() {
      const { instance, node } = this;

      instance.loadChildrenOptions(node);
    })
  },

  render() {
    const { node } = this;
    const indentLevel = this.instance.shouldFlattenOptions ? 0 : node.level;
    const listItemClass = {
      'el-select-tree__list-item': true,
      [`el-select-tree__indent-level-${indentLevel}`]: true
    };
    const listItemStyles = {
      paddingLeft: indentLevel * 20 + 'px'
    };

    return (
      <div class={listItemClass}>
        {this.renderOption(listItemStyles)}
        {node.isBranch && (
          <ElCollapseTransition>
            {this.renderSubOptionsList()}
          </ElCollapseTransition>
        )}
      </div>
    );
  }
};

export default Option;
</script>
