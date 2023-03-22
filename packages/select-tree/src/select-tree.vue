<script>
import Clickoutside from 'element-ui/src/utils/clickoutside';
import treeselectMixin from './mixins/treeselectMixin';
import Control from './control.vue';
import Menu from './menu';

export default {
  name: 'el-select-tree',

  mixins: [treeselectMixin],

  components: { Control, Menu },

  directives: { Clickoutside },

  computed: {
    wrapperClass() {
      return {
        'el-select-tree': true
      };
    }
  },

  render() {
    const directives = [
      { name: 'Clickoutside', value: this.handleClickOutside }
    ];

    return (
      <div ref="wrapper" class={this.wrapperClass} {...{ directives }}>
        <Control ref="control" />
        <Menu ref="menu" />
      </div>
    );
  }
};
</script>

<!--
主要负责子组件安排、调度，核心包括了Control、Menu组件
1. treeselectMixin包含了主要核心功能，以及子组件调度的能力
2. Control渲染Input和对应选择值（显示相关）
3. Menu渲染下来菜单（选择相关）
4. 点击外部清空数据，移除下拉框
5. internalValue对数据进行输出，经过各种操作后的
// TODO 存在的问题
1. 滚动内部，外部也滚动
2. 同el-form配合使用存在样式错误
3. menu的位置无法实时更新，当tag变化无法更新
-->
