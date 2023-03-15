import VirtualScroller from './src/components/RecycleScroller.vue';

/* istanbul ignore next */
VirtualScroller.install = function(Vue) {
  Vue.component(VirtualScroller.name, VirtualScroller);
};

export default VirtualScroller;
