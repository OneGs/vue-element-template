<script>
import IInput from './input.vue';
import ElTag from 'element-ui/packages/tag';

export default {
  name: 'vue-treeselect--multi-value',

  components: { ElTag, IInput},

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
      const { instance } = this;

      return (
        this.showTag
          ? (
            <div
              ref="tags"
              class="el-select-tree__tags"
              style={{ 'max-width': instance.inputWidth - 32 + 'px', width: '100%' }}
            >
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
    // const { instance } = this;

    return (
      <div class="el-select-tree__value-multi">
        { this.renderTags() }
        <IInput ref="input">
          { this.$slots.default }
        </IInput>
      </div>
    );
  }
};
</script>
