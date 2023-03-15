import { createTest, destroyVM } from '../util';
import VirtualScroller from 'packages/virtual-scroller';

describe('VirtualScroller', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(VirtualScroller, true);
    expect(vm.$el).to.exist;
  });
});

