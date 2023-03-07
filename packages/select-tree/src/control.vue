<script>
import SingleValue from './single-value.vue';
import MultiValue from './multi-value.vue';
import {debounce, includes, isPromise, onLeftClick} from './utils';
import {INPUT_DEBOUNCE_DELAY, KEY_CODES} from './constants';

const keysThatRequireMenuBeingOpen = [
  KEY_CODES.ENTER,
  KEY_CODES.END,
  KEY_CODES.HOME,
  KEY_CODES.ARROW_LEFT,
  KEY_CODES.ARROW_UP,
  KEY_CODES.ARROW_RIGHT,
  KEY_CODES.ARROW_DOWN
];

export default {
  name: 'el-select-tree-control',

  inject: ['instance'],

  data() {
    return {
      inputHovering: false,
      initialInputHeight: 0
    };
  },

  computed: {
    showClose() {
      const { instance } = this;

      return instance.clearable && instance.hasValue && this.inputHovering;
    }
  },

  watch: {
    'instance.forest.selectedNodeIds.length': {
      handler() {
        if (this.instance.multiple) this.$nextTick(() => {this.resetInputHeight();});
      }
    },

    'instance.valueConsistsOf': {
      handler() {
        if (this.instance.multiple) this.$nextTick(() => {this.resetInputHeight();});
      }
    }
  },

  created() {
    this.debouncedCallback = debounce(
      this.updateSearchQuery,
      INPUT_DEBOUNCE_DELAY,
      { leading: true, trailing: true }
    );
  },

  mounted() {
    const { instance } = this;

    this.$nextTick(() => {
      const reference = this.$refs['value-container'].$refs.input;

      // init Width
      if (reference && reference.$el) {
        instance.inputWidth = reference.$el.getBoundingClientRect().width;
      }

      // init Height
      const input = reference.$el.querySelector('input');
      this.initialInputHeight = input.getBoundingClientRect().height || 40;
      this.resetInputHeight();
    });
  },

  methods: {
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
      return (
        <i
          class="el-select-tree__caret el-input__icon el-icon-circle-close"
          onMousedown={this.handleMouseDownOnX}/>
      );
    },

    renderArrow() {
      const { instance } = this;
      const expandClasses = {
        'el-select-tree__caret': true,
        'el-icon-arrow-up': true,
        'el-input__icon': true,
        'is-reverse': instance.menu.isOpen
      };

      return <i v-show={!this.showClose} class={expandClasses} />;
    },

    resetInputHeight() {
      const input = this.$refs['value-container'].$refs.input;
      if (!input) return;
      const inputEle = input.$el.querySelector('input');

      const tags = this.$refs['value-container'].$refs.tags;
      const tagsHeight = tags ? tags.getBoundingClientRect().height || 40 : 0;
      const height = tagsHeight > this.initialInputHeight ? tagsHeight + 6 : tagsHeight;
      inputEle.style.height = Math.max(height, this.initialInputHeight) + 'px';
    },

    onKeyDown(evt) {
      const { instance } = this;
      // https://css-tricks.com/snippets/javascript/javascript-keycodes/
      // https://stackoverflow.com/questions/4471582/javascript-keycode-vs-which
      const key =
          'which' in evt ? evt.which : /* istanbul ignore next */ evt.keyCode;

      if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) return;

      if (
        !instance.menu.isOpen &&
          includes(keysThatRequireMenuBeingOpen, key)
      ) {
        evt.preventDefault();
        return instance.openMenu();
      }

      switch (key) {
        case KEY_CODES.BACKSPACE: {
          if (instance.backspaceRemoves) {
            instance.removeLastValue();
          }
          break;
        }
        case KEY_CODES.ENTER: {
          evt.preventDefault();
          if (instance.menu.current === null) return;
          const current = instance.getNode(instance.menu.current);
          if (current.isBranch && instance.disableBranchNodes) return;
          instance.select(current);
          break;
        }
        case KEY_CODES.ESCAPE: {
          if (instance.menu.isOpen) {
            instance.closeMenu();
          }
          break;
        }
        case KEY_CODES.END: {
          evt.preventDefault();
          instance.highlightLastOption();
          break;
        }
        case KEY_CODES.HOME: {
          evt.preventDefault();
          instance.highlightFirstOption();
          break;
        }
        case KEY_CODES.ARROW_LEFT: {
          const current = instance.getNode(instance.menu.current);
          if (current.isBranch && instance.shouldExpand(current)) {
            evt.preventDefault();
            instance.toggleExpanded(current);
          } else if (
            !current.isRootNode &&
              (current.isLeaf ||
                  (current.isBranch && !instance.shouldExpand(current)))
          ) {
            evt.preventDefault();
            instance.setCurrentHighlightedOption(current.parentNode);
          }
          break;
        }
        case KEY_CODES.ARROW_UP: {
          evt.preventDefault();
          instance.highlightPrevOption();
          break;
        }
        case KEY_CODES.ARROW_RIGHT: {
          const current = instance.getNode(instance.menu.current);
          if (current.isBranch && !instance.shouldExpand(current)) {
            evt.preventDefault();
            instance.toggleExpanded(current);
          }
          break;
        }
        case KEY_CODES.ARROW_DOWN: {
          evt.preventDefault();
          instance.highlightNextOption();
          break;
        }
        case KEY_CODES.DELETE: {
          if (instance.deleteRemoves && !this.value.length) {
            instance.removeLastValue();
          }
          break;
        }
        default: {
          // istanbul ignore else
          instance.openMenu();
        }
      }
    },

    onFocus() {
      const { instance } = this;

      instance.trigger.isFocused = true;
      if (instance.openOnFocus) instance.openMenu();
    },

    onBlur() {
      const { instance } = this;

      instance.trigger.isFocused = false;
    },

    onInput(evt) {
      const { value } = evt.target;

      this.value = value;

      if (value) {
        this.debouncedCallback();
      } else {
        this.debouncedCallback.cancel();
        this.updateSearchQuery();
      }
    },

    updateSearchQuery() {}
  },

  render() {
    const setInputHovering = (status) => {
      this.inputHovering = status;
    };

    const { instance } = this;
    // eslint-disable-next-line no-unused-vars
    const ValueContainer = instance.single ? SingleValue : MultiValue;

    return (
      <div
        class="el-select-tree__control"
        onMousedown={instance.handleMouseDown}
        onMouseenter={() => setInputHovering(true)}
        onMouseleave={() => setInputHovering(false)}>
        <ValueContainer
          ref="value-container"
          nativeOnKeydown={this.onKeyDown}
          onFocus={this.onFocus}
          onBlur={this.onBlur}>
          { this.showClose && this.renderX()}
          { this.renderArrow() }
        </ValueContainer>
      </div>
    );
  }
};
</script>

<!--
渲染选中文本，单选 or 多选，以及多文本的处理。以及负责触发menu的展开
1. 内容主要输出在input上
2. 点击展开menu
3. 单选、多选的策略选择
-->

