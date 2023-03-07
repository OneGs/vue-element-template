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

  computed: {
    menuStyle() {
      const { instance } = this;

      return {
        maxHeight: instance.maxHeight + 'px'
      };
    }
  },

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

      if (!instance.menu.isOpen) return null;

      return (
        <el-select-menu visibleArrow={true} appendToBody={false}>
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
              {this.renderNormalMenuInner()}
            </div>
          </el-scrollbar>
        </el-select-menu>
      );
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

    renderLoadingOptionsTip() {
      // const { instance } = this;

      return (
        <span>loading</span>
        // <Tip type="loading" icon="loader">
        //   {instance.loadingText}
        // </Tip>
      );
    },

    renderLoadingRootOptionsErrorTip() {
      // const { instance } = this;

      return (
        <span>error</span>
        // <Tip type="error" icon="error">
        //   {instance.rootOptionsStates.loadingError}
        //   <a
        //     class="vue-treeselect__retry"
        //     onClick={instance.loadRootOptions}
        //     title={instance.retryTitle}>
        //     {instance.retryText}
        //   </a>
        // </Tip>
      );
    },

    renderNoAvailableOptionsTip() {
      const { instance } = this;

      return (
        <span class="el-select-tree__tip-text">{ instance.noOptionsText }</span>
      );
    },

    onMenuOpen() {
      this.broadcast('ElSelectDropdown', 'updatePopper');
    },

    onMenuClose() {
      this.broadcast('ElSelectDropdown', 'destroyPopper');
    }
  },

  render() {
    return (
      <div
        ref="menu-container"
        class="el-select-tree__menu"
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
