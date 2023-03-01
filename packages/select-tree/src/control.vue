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
        class="vue-treeselect__control"
        onMousedown={instance.handleMouseDown}>
        <ValueContainer ref="value-container" />
      </div>
    );
  }
};
</script>
