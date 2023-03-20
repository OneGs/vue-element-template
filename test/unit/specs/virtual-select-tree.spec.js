import { createTest, destroyVM } from '../util';
import VirtualSelectTree from 'packages/virtual-select-tree';

describe('VirtualSelectTree', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(VirtualSelectTree, true);
    expect(vm.$el).to.exist;
  });
});

