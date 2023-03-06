<script>
import ElInput from 'element-ui/packages/input';
import ElTag from 'element-ui/packages/tag';

export default {
  name: 'vue-treeselect--multi-value',

  components: { ElTag, ElInput},

  inject: ['instance'],

  computed: {
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.instance.size) > -1
        ? 'mini'
        : 'small';
    },

    selectedLimitNodes() {
      const { instance } = this;

      return instance.internalValue
        .slice(0, instance.limit)
        .map(instance.getNode);
    },

    showTag() {
      const { instance } = this;

      return instance.multiple && this.selectedLimitNodes.length;
    }
  },

  methods: {
    renderTags() {
      return (
        this.showTag
          ? (
            <div class="el-select-tree__tags">
              {this.renderMultiTags()}
              {this.renderExceedLimitTip()}
            </div>
          )
          : null

      );
    },

    renderMultiTags() {
      return (
        this.selectedLimitNodes.map(node =>
          <el-tag
            key={node.id}
            size={this.collapseTagSize}
            type="info"
            closable
            disable-transitions
            onClick={() => this.deleteNode(node)}
            onClose={() => this.deleteNode(node)}>
            <span>{ node.label }</span>
          </el-tag>
        )
      );
    },

    renderExceedLimitTip() {
      const { instance } = this;
      const count = instance.internalValue.length - instance.limit;

      if (count <= 0) return null;

      return (
        <el-tag
          closable={false}
          type="info"
          key="EXCEED"
          size={this.collapseTagSize}
          disable-transitions>
          <span>+{count}</span>
        </el-tag>
      );
    },

    renderSingleValueLabel() {
      const { instance } = this;
      const node = instance.selectedNodes[0];

      const customValueLabelRenderer = instance.$scopedSlots['value-label'];
      return customValueLabelRenderer
        ? customValueLabelRenderer({ node })
        : node.label;
    },

    deleteNode(node) {
      const { instance } = this;

      instance.select(node);
    }
  },

  render() {
    const { instance } = this;

    return (
      <div>
        { this.renderTags() }
        <ElInput
          ref="input"
          placeholder={ !instance.hasValue && instance.placeholder }
          disabled={ instance.disabled }
        >
          <template slot="suffix">
            { this.$slots.default }
          </template>
        </ElInput>
      </div>
    );
  }
};
</script>
