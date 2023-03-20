import VirtualSelectTree from './src/main';

/* istanbul ignore next */
VirtualSelectTree.install = function(Vue) {
  Vue.component(VirtualSelectTree.name, VirtualSelectTree);
};

export default VirtualSelectTree;
