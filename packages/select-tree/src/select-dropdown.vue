<template>
  <div
    class="el-select-dropdown el-popper"
    :class="[{ 'is-multiple': $parent.multiple }, popperClass]"
    :style="{ minWidth: minWidth }">
    <slot></slot>
  </div>
</template>

<script type="text/babel">
  import Popper from 'element-ui/src/utils/vue-popper';

  export default {
    name: 'ElSelectDropdown',

    componentName: 'ElSelectDropdown',

    inject: ['instance'],

    mixins: [Popper],

    props: {
      placement: {
        default: 'bottom-start'
      },

      boundariesPadding: {
        default: 0
      },

      popperOptions: {
        default() {
          return {
            gpuAcceleration: false
          };
        }
      },

      visibleArrow: {
        default: true
      },

      appendToBody: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        minWidth: ''
      };
    },

    computed: {
      popperClass() {
        return this.$parent.popperClass;
      }
    },

    watch: {
      '$parent.inputWidth'() {
        this.minWidth = this.getInputComponent().$el.getBoundingClientRect().width + 'px';
      }
    },

    methods: {
      getInputComponent() {
        return this.$parent.$parent.$refs.control.$refs['value-container'];
      }
    },

    mounted() {
      const { instance } = this;
      this.referenceElm = this.getInputComponent().$el;
      this.$parent.popperElm = this.popperElm = this.$el;
      this.minWidth = this.getInputComponent().$el.getBoundingClientRect().width + 'px';

      this.$on('updatePopper', () => instance.menu.isOpen && this.updatePopper());
      this.$on('destroyPopper', this.destroyPopper);
    }
  };
</script>

<!--
下拉框，通过PoperJs计算位置信息
-->
