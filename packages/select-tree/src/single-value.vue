<script>
import ElInput from 'element-ui/packages/input';
import {isPromise, onLeftClick} from './utils';

export default {
  name: 'vue-treeselect--single-value',

  inject: ['instance'],

  components: {
    ElInput
  },

  methods: {
    renderSingleValueLabel() {
      const { instance } = this;
      const node = instance.selectedNodes[0];

      const customValueLabelRenderer = instance.$scopedSlots['value-label'];
      return customValueLabelRenderer
        ? customValueLabelRenderer({ node })
        : node.label;
    },

    handleMouseDownOnX: onLeftClick(function handleMouseDownOnX(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      const { instance } = this;
      const result = instance.beforeClearAll();
      const handler = (shouldClear) => {
        if (shouldClear) instance.clear();
      };

      if (isPromise(result)) {
        result.then(handler);
      } else {
        setTimeout(() => handler(result), 0);
      }
    }),

    renderX() {
      return <i class="el-select-tree__caret el-input__icon el-icon-circle-close" onMousedown={this.handleMouseDownOnX} />;
    },

    renderArrow() {
      const { instance } = this;

      const expandClasses = {
        'el-select-tree__caret': true,
        'el-icon-arrow-up': true,
        'el-input__icon': true,
        'is-reverse': instance.menu.isOpen
      };

      return <i v-show={!instance.showClose} class={expandClasses}/>;
    }
  },

  render() {
    const { instance } = this;
    const shouldShowValue = instance.hasValue && !instance.trigger.searchQuery;
    const setInputHovering = (status) => {
      instance.inputHovering = status;
    };

    return (
      <ElInput
        ref="input"
        placeholder="请选择"
        nativeOnMouseenter={() => setInputHovering(true)}
        nativeOnMouseleave={() => setInputHovering(false)}
        value={ (shouldShowValue && this.renderSingleValueLabel()) || null }>
        <template slot="suffix">
          { instance.showClose && this.renderX()}
          {this.renderArrow()}
        </template>
      </ElInput>
    );
  }
};
</script>
