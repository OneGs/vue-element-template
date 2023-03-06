<script>
import SingleValue from './single-value.vue';
import MultiValue from './multi-value.vue';
import {isPromise, onLeftClick} from './utils';

export default {
  name: 'el-select-tree-control',

  inject: ['instance'],

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

      return <i v-show={!instance.showClose} class={expandClasses} />;
    }
  },

  render() {
    const setInputHovering = (status) => {
      instance.inputHovering = status;
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
        <ValueContainer ref="value-container" >
          { instance.showClose && this.renderX()}
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

