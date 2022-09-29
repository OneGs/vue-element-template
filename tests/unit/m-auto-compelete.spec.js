import {createElementMount, triggerClick, triggerFocus, wait, waitImmediate} from '../utils/index.js';

describe('Auto', () => {
  it('focus', async function() {
    const wrapper = createElementMount({
      template: `
        <div>
            <el-input @focus="focus"></el-input>
            <span v-show="visible">10</span>
        </div>
      `,
      data() {
        return {
          visible: false
        };
      },
      methods: {
        focus() {
          this.visible = true;
        }
      }
    });

    expect(wrapper.find('span').element.style.display).toEqual('none');

    triggerFocus(wrapper.find('input').element);
    await waitImmediate();
    expect(wrapper.find('span').element.style.display).not.toEqual('none');
  });

  it('create', async function() {
    const wrapper = createElementMount({
      template: `
        <div>
          <button class="btn">a</button>
          <el-autocomplete
              ref="autocomplete"
              v-model="state"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容autocomplete1"
              @blur="blur"
          />
        </div>
      `,
      data() {
        return {
          restaurants: [],
          state: ''
        };
      },
      methods: {
        querySearch(queryString, cb) {
          var restaurants = this.restaurants;
          var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          cb(results);
        },
        createFilter(queryString) {
          return (restaurant) => {
            return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
          };
        },
        loadAll() {
          return [
            { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
            { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' },
            { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113' },
            { 'value': '泷千家(天山西路店)', 'address': '天山西路438号' }
          ];
        },
        blur() {
          console.log('blur');
        }
      },
      mounted() {
        this.restaurants = this.loadAll();
      }
    });

    const inputWrapper = wrapper.find('input');
    expect(inputWrapper.element.getAttribute('placeholder')).toEqual('请输入内容autocomplete1');

    const suggestions = wrapper.vm.$refs.autocomplete.$refs.suggestions.$el;
    expect(suggestions.children[0].style.display).toEqual('none');

    triggerFocus(inputWrapper.element);
    await wait(500);
    expect(suggestions.children[0].style.display).not.toEqual('none');
    expect(suggestions.querySelectorAll('.el-autocomplete-suggestion__list li').length).toEqual(4);

    triggerClick(document);
    await wait(500);
    expect(suggestions.children[0].style.display).toEqual('none');
  });

  it('select', async function() {
    const wrapper = createElementMount({
      template: `
          <el-autocomplete
              ref="autocomplete"
              v-model="state"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容autocomplete2"
              @blur="blur"
          />
      `,
      data() {
        return {
          restaurants: [],
          state: ''
        };
      },
      methods: {
        querySearch(queryString, cb) {
          var restaurants = this.restaurants;
          var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          cb(results);
        },
        createFilter(queryString) {
          return (restaurant) => {
            return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
          };
        },
        loadAll() {
          return [
            { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
            { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' },
            { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113' },
            { 'value': '泷千家(天山西路店)', 'address': '天山西路438号' }
          ];
        },
        blur() {
          console.log('blur');
        }
      },
      mounted() {
        this.restaurants = this.loadAll();
      }
    });

    const inputElm = wrapper.find('input').element;
    const autocomplete = wrapper.getComponent({ ref: 'autocomplete' });
    const suggestions = autocomplete.getComponent({ ref: 'suggestions' });
    const spy = jest.fn();
    autocomplete.vm.$on('select', spy);

    triggerFocus(inputElm);
    await wait(500);
    const suggestionList = suggestions.vm.$el.querySelectorAll('.el-autocomplete-suggestion__list li');
    suggestionList[1].click();
    await wait(500);
    expect(inputElm.value).toEqual('Hot honey 首尔炸鸡（仙霞路）');
    expect(wrapper.vm.state).toEqual('Hot honey 首尔炸鸡（仙霞路）');
    expect(spy.mock.calls).toHaveLength(1);
    expect(suggestions.vm.$el.children[0].style.display).toEqual('none');
  });

  it('input', async function() {
    const wrapper = createElementMount({
      template: `
        <el-autocomplete
          ref="autocomplete"
          v-model="state"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearch"
        ></el-autocomplete>
      `,
      data() {
        return {
          restaurants: [],
          state: ''
        };
      },
      methods: {
        querySearch(queryString, cb) {
          var restaurants = this.restaurants;
          var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          cb(results);
        },
        createFilter(queryString) {
          return (restaurant) => {
            return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
          };
        },
        loadAll() {
          return [
            { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
            { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' },
            { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113' },
            { 'value': '泷千家(天山西路店)', 'address': '天山西路438号' }
          ];
        }
      },
      mounted() {
        this.restaurants = this.loadAll();
      }
    });

    const inputElm = wrapper.find('input').element;
    const autocomplete = wrapper.getComponent({ ref: 'autocomplete' });
    const input = autocomplete.getComponent({ ref: 'input' });
    const suggestions = autocomplete.getComponent({ ref: 'suggestions' });

    input.vm.$emit('input', '三');
    await wait(500);
    expect(inputElm.value).toEqual('三');
    expect(wrapper.vm.state).toEqual('三');
    expect(autocomplete.vm.suggestions[0].value).toEqual('三全鲜食（北新泾店）');
    expect(suggestions.vm.$el.querySelectorAll('.el-autocomplete-suggestion__list li').length).toEqual(1);

    input.vm.$emit('input', '');
    await wait(500);
    expect(wrapper.vm.state).toEqual('');
    expect(autocomplete.vm.suggestions.length).toEqual(0);
  });
});
