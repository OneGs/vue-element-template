<script>
import ElSelectMenu from './select-dropdown.vue';
import ElScrollbar from 'element-ui/packages/scrollbar';
import Emitter from 'element-ui/src/mixins/emitter';
import Option from './Option';

export default {
  name: 'vue-treeselect--menu',

  inject: ['instance'],

  mixins: [Emitter],

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
          v-show={instance.menu.isOpen}
          appendToBody={false}
        >
          <el-scrollbar
            tag="ul"
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list"
            ref="scrollbar">
            <div
              ref="menu"
              className="el-select-tree__inner-menu"
              onMouseDown={instance.handleMouseDown}
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
        <span className="el-select-tree__tip-text">
          {instance.loadingText}
        </span>
      );
    },

    renderLoadingRootOptionsErrorTip() {
      const { instance } = this;

      return (
        <span className="el-select-tree__tip-text">
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
      this.broadcast('ElSelectDropdown', 'updatePopper');
    },

    onMenuClose() {
      this.broadcast('ElSelectDropdown', 'destroyPopper');
    },

    handleMousedownEnterOption() {
      const { instance } = this;

      this.$nextTick(() => instance.focusInput());
    }
  },

  render() {
    return (
      <div
        ref="menu-container"
        class="el-select-tree__menu"
        onMousedown={this.handleMousedownEnterOption}
      >
        <transition name="el-zoom-in-top">
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
