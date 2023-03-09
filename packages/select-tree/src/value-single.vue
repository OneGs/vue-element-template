<script>
import Input from './input.vue';

export default {
  name: 'vue-treeselect--single-value',

  inject: ['instance'],

  components: {
    Input
  },

  render() {
    return (
      <Input ref="input">
        { this.$slots.default }
      </Input>
    );
  }
};
</script>
