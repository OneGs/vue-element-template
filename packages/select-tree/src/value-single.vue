<script>
import IInput from './input.vue';

export default {
  name: 'vue-treeselect--single-value',

  inject: ['instance'],

  components: {
    IInput
  },

  render() {
    return (
      <IInput ref="input">
        { this.$slots.default }
      </IInput>
    );
  }
};
</script>
