<script>
import SingleValue from './single-value.vue';
import MultiValue from './multi-value.vue';

export default {
  name: 'el-select-tree-control',

  inject: ['instance'],

  render() {
    const { instance } = this;
    // eslint-disable-next-line no-unused-vars
    const ValueContainer = instance.single ? SingleValue : MultiValue;

    return (
      <div
        class="el-select-tree__control"
        onMousedown={instance.handleMouseDown}>
        <ValueContainer ref="value-container" />
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

