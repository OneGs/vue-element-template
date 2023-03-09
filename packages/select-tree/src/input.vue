<script>
import ElInput from 'element-ui/packages/input';
import {debounce, includes} from './utils';
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
  name: 'IInput',

  inject: ['instance'],

  components: {
    ElInput
  },

  data() {
    return {
      initialInputHeight: 0,
      currentPlaceholder: null,
      selectedLabel: null
    };
  },

  computed: {
    shouldShowValue() {
      const { instance } = this;

      return instance.hasValue && !instance.trigger.searchQuery;
    },

    readonly() {
      const { instance } = this;

      return !instance.menu.isOpen;
    }
  },

  watch: {
    'instance.forest.selectedNodeIds.length': {
      handler() {
        if (this.instance.multiple) {this.$nextTick(() => {this.resetInputHeight();});}
      }
    },

    'instance.forest.selectedNodeIds': {
      handler(val) {
        const { instance } = this;

        if (!val.length) this.currentPlaceholder = instance.placeholder;
        this.selectedLabel = (this.shouldShowValue && this.renderSingleValueLabel()) || null;
      }
    },

    'instance.valueConsistsOf': {
      handler() {
        if (this.instance.multiple) this.$nextTick(() => {this.resetInputHeight();});
      }
    },

    'instance.menu.isOpen': {
      handler(val) {
        const { instance } = this;

        if (val) {
          this.currentPlaceholder = this.selectedLabel || instance.placeholder;
          this.selectedLabel = null;
        } else {
          if (this.getSelectedLabel()) {
            this.selectedLabel = this.getSelectedLabel();
            this.currentPlaceholder = null;
          } else {
            this.currentPlaceholder = instance.placeholder;
            this.selectedLabel = null;
          }
        }
      }
    }
  },

  methods: {
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
          if (instance.deleteRemoves && !this.selectedLabel) {
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

    onInput(searchQuery) {
      this.selectedLabel = searchQuery;
      if (searchQuery) {
        this.debouncedCallback(searchQuery);
      } else {
        this.updateSearchQuery(searchQuery);
      }
    },

    resetInputHeight() {
      const input = this.$refs.input;
      if (!input) return;

      const inputEle = input.$el.querySelector('input');
      const tags = this.$parent.$refs.tags;
      const tagsHeight = tags ? tags.getBoundingClientRect().height || 40 : 0;
      const height = tagsHeight > this.initialInputHeight ? tagsHeight + 6 : tagsHeight;
      inputEle.style.height = Math.max(height, this.initialInputHeight) + 'px';
    },

    updateSearchQuery(searchQuery) {
      const { instance } = this;
      instance.trigger.searchQuery = searchQuery;
    },

    renderSingleValueLabel() {
      const { instance } = this;
      const node = instance.selectedNodes[0];

      const customValueLabelRenderer = instance.$scopedSlots['value-label'];
      return customValueLabelRenderer
        ? customValueLabelRenderer({ node })
        : node.label;
    },

    getSelectedLabel() {
      const { instance } = this;
      if (instance.multiple) return;

      return (this.shouldShowValue && this.renderSingleValueLabel()) || null;
    }
  },

  created() {
    const { instance } = this;
    this.currentPlaceholder = instance.placeholder;
    this.selectedLabel = this.getSelectedLabel();

    this.debouncedCallback = debounce(
      INPUT_DEBOUNCE_DELAY,
      (val) => this.updateSearchQuery(val)
    );
  },

  mounted() {
    const { instance } = this;

    this.$nextTick(() => {
      const reference = this.$refs.input;

      if (reference && reference.$el) {
        // init Width
        instance.inputWidth = reference.$el.getBoundingClientRect().width;

        // init Height
        const inputElm = reference.$el.querySelector('input');
        this.initialInputHeight = inputElm.getBoundingClientRect().height || 40;
        this.resetInputHeight();
      }
    });
  },

  render() {
    const { instance } = this;

    return (
      <ElInput
        ref="input"
        type="text"
        placeholder={ this.currentPlaceholder }
        disabled={ instance.disabled }
        nativeOnKeydown={this.onKeyDown}
        readonly={this.readonly}
        onInput={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        validate-event={false}
        value={ this.selectedLabel }>
        <template slot="suffix">
          { this.$slots.default }
        </template>
      </ElInput>
    );
  }
};
</script>
