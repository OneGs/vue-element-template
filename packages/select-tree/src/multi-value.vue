<script>
// eslint-disable-next-line no-unused-vars
import ElInput from 'element-ui/packages/input';

export default {
  name: 'vue-treeselect--multi-value',

  inject: ['instance'],

  methods: {
    renderSingleValueLabel() {
      const { instance } = this;
      const node = instance.selectedNodes[0];

      const customValueLabelRenderer = instance.$scopedSlots['value-label'];
      return customValueLabelRenderer
        ? customValueLabelRenderer({ node })
        : node.label;
    }
  },

  render() {
    const {
      instance,
      $parent: { renderValueContainer }
    } = this;

    const shouldShowValue = instance.hasValue && !instance.trigger.searchQuery;

    return renderValueContainer([
      shouldShowValue && (
        <div class="vue-treeselect__single-value">
          {this.renderSingleValueLabel()}
        </div>
      ),
      <ElInput ref="input" />
    ]);
  }
};
</script>
