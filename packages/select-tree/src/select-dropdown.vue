<template>
  <div
    class="el-select-dropdown el-popper"
    :class="[popperClass]"
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
      },

      'instance.multiple': {
        handler() {
          this.updatesReferenceElm();
        }
      }
    },

    methods: {
      getInputComponent() {
        const { instance } = this;

        return instance.$refs.control.$refs['value-container'];
      },

      updatesReferenceElm() {
        this.doDestroy(true);
      }
    },

    mounted() {
      const { instance } = this;
      instance.popperElm = this.popperElm = this.$el;

      this.$on('updatePopper', () => {
        this.referenceElm = this.getInputComponent().$el;
        this.minWidth = this.referenceElm.getBoundingClientRect().width + 'px';
        instance.menu.isOpen && this.updatePopper();
      });

      this.$on('destroyPopper', this.destroyPopper);
    }
  };
</script>

<!--
下拉框，通过PoperJs计算位置信息
-->
