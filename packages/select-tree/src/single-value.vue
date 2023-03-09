<script>
import ElInput from 'element-ui/packages/input';

export default {
  name: 'vue-treeselect--single-value',

  inject: ['instance'],

  components: {
    ElInput
  },

  computed: {
    readonly() {
      const { instance } = this;

      return !instance.filterable;
    }
  },

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
    const { instance } = this;
    const shouldShowValue = instance.hasValue && !instance.trigger.searchQuery;

    return (
      <ElInput
        ref="input"
        placeholder={ instance.placeholder }
        disabled={ instance.disabled }
        { ...{ on: this.$listeners } }
        readonly={this.readonly}
        value={ (shouldShowValue && this.renderSingleValueLabel()) || null }>
        <template slot="suffix">
          { this.$slots.default }
        </template>
      </ElInput>
    );
  }
};
</script>
