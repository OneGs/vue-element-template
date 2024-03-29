<script>
import ElSelectMenu from './select-dropdown.vue';
import ElScrollbar from 'element-ui/packages/scrollbar';
import Option from './Option';

export default {
  name: 'vue-treeselect--menu',

  inject: ['instance'],

  components: {ElSelectMenu, ElScrollbar, Option},

  watch: {
    'instance.menu.isOpen'(newValue) {
      if (newValue) {
        this.$nextTick(this.onMenuOpen);
      } else {
        this.onMenuClose();
      }
    }
  },

  mounted() {
    const { instance } = this;

    if (instance.menu.isOpen) this.$nextTick(this.onMenuOpen);
  },

  methods: {
    renderMenu() {
      const { instance } = this;

      return (
        <el-select-menu
          ref="popper"
          v-show={instance.menu.isOpen}
          appendToBody={instance.appendToBody}
        >
          <el-scrollbar
            tag="ul"
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list"
            ref="scrollbar">
            <div
              ref="menu"
              className="el-select-tree__inner-menu"
              onMousedown={instance.handleMouseDown}
            >
              {instance.async
                ? this.renderAsyncSearchMenuInner()
                : instance.localSearch.active
                  ? this.renderLocalSearchMenuInner()
                  : this.renderNormalMenuInner()}
            </div>
          </el-scrollbar>
        </el-select-menu>
      );
    },

    renderAsyncSearchMenuInner() {
      const { instance } = this;
      const entry = instance.getRemoteSearchEntry();
      const shouldShowSearchPromptTip =
          instance.trigger.searchQuery === '' && !instance.defaultOptions;

      const shouldShowNoResultsTip = shouldShowSearchPromptTip
        ? false
        : entry.isLoaded && entry.options.length === 0;

      if (shouldShowSearchPromptTip) {
        return this.renderSearchPromptTip();
      } else if (entry.isLoading) {
        return this.renderLoadingOptionsTip();
      } else if (entry.loadingError) {
        return this.renderAsyncSearchLoadingErrorTip();
      } else if (shouldShowNoResultsTip) {
        return this.renderNoResultsTip();
      } else {
        return this.renderOptionList();
      }
    },

    renderLocalSearchMenuInner() {
      const { instance } = this;

      if (instance.rootOptionsStates.isLoading) {
        return this.renderLoadingOptionsTip();
      } else if (instance.rootOptionsStates.loadingError) {
        return this.renderLoadingRootOptionsErrorTip();
      } else if (
        instance.rootOptionsStates.isLoaded &&
          instance.forest.normalizedOptions.length === 0
      ) {
        return this.renderNoAvailableOptionsTip();
      } else if (instance.localSearch.noResults) {
        return this.renderNoResultsTip();
      } else {
        return this.renderOptionList();
      }
    },

    renderNormalMenuInner() {
      const { instance } = this;

      if (instance.rootOptionsStates.isLoading) {
        return this.renderLoadingOptionsTip();
      } else if (instance.rootOptionsStates.loadingError) {
        return this.renderLoadingRootOptionsErrorTip();
      } else if (
        instance.rootOptionsStates.isLoaded &&
        instance.forest.normalizedOptions.length === 0
      ) {
        return this.renderNoAvailableOptionsTip();
      } else {
        return this.renderOptionList();
      }
    },

    renderOptionList() {
      const { instance } = this;

      return (
        <div class="el-select-tree__list">
          {instance.forest.normalizedOptions.map((rootNode) => (
            <Option node={rootNode} key={rootNode.id} />
          ))}
        </div>
      );
    },

    renderNoResultsTip() {
      const { instance } = this;

      return (
        <span class="el-select-tree__tip-text">
          {instance.noResultsText}
        </span>
      );
    },

    renderSearchPromptTip() {
      const { instance } = this;

      return (
        <span class="el-select-tree__tip-text">
          {instance.searchPromptText}
        </span>
      );
    },

    renderAsyncSearchLoadingErrorTip() {
      const { instance } = this;
      return (
        <span class="el-select-tree__tip-text">
          {instance.retryText}
        </span>
      );
    },

    renderLoadingOptionsTip() {
      const { instance } = this;
      return (
        <span class="el-select-tree__tip-text">
          {instance.loadingText}
        </span>
      );
    },

    renderLoadingRootOptionsErrorTip() {
      const { instance } = this;

      return (
        <span class="el-select-tree__tip-text is-left">
          {instance.errorText}
        </span>
      );
    },

    renderNoAvailableOptionsTip() {
      const { instance } = this;

      return (
        <span class="el-select-tree__tip-text">
          { instance.noOptionsText }
        </span>
      );
    },

    onMenuOpen() {
      const { instance } = this;

      instance.broadcast('ElSelectDropdown', 'updatePopper');
    },

    onMenuClose() {
      const { instance } = this;

      instance.broadcast('ElSelectDropdown', 'destroyPopper');
    },

    handleMousedownEnterOption() {
      const { instance } = this;

      this.$nextTick(() => instance.focusInput());
    },

    watch2UpdateMenuPopper() {
      const needWatch = [
        'instance.forest.selectedNodeIds.length',
        'instance.selectSize'
      ];
      const handler = () => {
        if (this.instance.multiple) {
          this.$nextTick(() => {
            this.onMenuOpen();
          });
        }
      };

      needWatch.map((watch) => {
        this.$watch(watch, handler);
      });
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    }
  },

  created() {
    this.watch2UpdateMenuPopper();
  },

  render() {
    return (
      <div
        ref="menu-container"
        class="el-select-tree__menu"
        onMousedown={this.handleMousedownEnterOption}
      >
        <transition
          name="el-zoom-in-top"
          on-after-leave={this.doDestroy}
        >
          {this.renderMenu()}
        </transition>
      </div>
    );
  }
};
</script>

<!--
渲染整个tree，对tree做整体调度
1. 各式各样的tree功能，包括过滤、选择模式等等
2. 监听isOpen：通知dropDown动态计算位置并显示
-->
