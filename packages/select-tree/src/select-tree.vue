<script>
import treeselectMixin from './mixins/treeselectMixin';
// eslint-disable-next-line no-unused-vars
import Control from './control.vue';

export default {
  name: 'el-select-tree',

  mixins: [treeselectMixin],

  computed: {
    wrapperClass() {
      return {
        'vue-treeselect': true,
        'vue-treeselect--single': this.single,
        'vue-treeselect--multi': this.multiple,
        'vue-treeselect--searchable': this.searchable,
        'vue-treeselect--disabled': this.disabled,
        'vue-treeselect--focused': this.trigger.isFocused,
        'vue-treeselect--has-value': this.hasValue,
        'vue-treeselect--open': this.menu.isOpen,
        'vue-treeselect--open-above': this.menu.placement === 'top',
        'vue-treeselect--open-below': this.menu.placement === 'bottom',
        'vue-treeselect--branch-nodes-disabled': this.disableBranchNodes,
        'vue-treeselect--append-to-body': this.appendToBody
      };
    }
  },

  render() {
    return (
      <div ref="wrapper" class={this.wrapperClass}>
        <Control ref="control" />
      </div>
    );
  }
};
</script>
