## 树型选择器

### 基础用法

在select的基础上添加树形选择功能，并提供丰富的操作模式。

:::demo 通过options进行赋值，默认为单选模式。允许在data上设置`isDisabled`为true，禁用选项。通过设置`clearable`为true（默认），开启清空功能。defaultExpandLevel加载时应自动扩展多少级分支节点。设置 Infinity 为默认使所有分支节点扩展。

```html
<template>
    <div>
        <div style="
                    margin-bottom: 1rem; 
                    background-color: #F5F7FA; 
                    padding: 10px; 
                    border-radius: 5px">
            value: {{ value }}
        </div>
        <el-radio-group
                v-model="checked"
                style="padding: 1rem 0"
                v-for="index in checkedOptionsLen"
                :key="index"
        >
            <template v-for="jndex in 3">
                <el-radio
                        v-if="checkedOptionsKeys[(index - 1) * 3 + (jndex - 1)]"
                        :key="checkedOptionsKeys[(index - 1) * 3 + (jndex -1)]"
                        :label="checkedOptionsKeys[(index - 1) * 3 + (jndex -1)]">
                    {{ checkedOptionsValues[(index - 1) * 3 + (jndex -1)] }}
                </el-radio>
            </template>
        </el-radio-group>
        <el-select-tree
                :options="options"
                v-model="value"
                :multiple="showMultiple"
                :flat="checked === 'FLAT'"
                :always-open="checked === 'ALWAYS_OPEN'"
                :disabled="checked === 'DISABLED'"
                :disable-branch-nodes="checked === 'DISABLED_BRANCH_NODES'"
                :branch-nodes-first="checked === 'BRANCH_NODES_FIRST'"
                :limit="checked === 'LIMIT TWO' ? 2 : Infinity"
                :show-count="checked === 'SHOW_COUNT'"
                :searchable="checked !== 'NO_SEARCHABLE'"
                :backspace-removes="checked !== 'BACK_SPACE_REMOVES'"
                :clearable="checked !== 'CLEARABLE'"
                :clear-on-select="checked === 'CLEAR_ON_SELECT'"
                :close-on-select="checked !== 'CLOSE_ON_SELECT'"
                :flatten-search-results="checked === 'FLATTEN_SEARCH_RESULT'"
                :disable-fuzzy-matching="checked === 'DISABLED_FUZZY_MATCHING'"
                :search-nested="checked === 'SEARCH_NESTED'"
                :default-expand-level="1"
        />
    </div>
</template>

<script>
    const OPTIONS = [{
        id: 'fruits 1',
        label: 'Fruits',
        children: [{
            id: 'apple',
            label: 'This  Apple 🍎',
            isNew: true,
        }, {
            id: 'grapes',
            label: 'Grapes 🍇',
            isDisabled: true,
        }, {
            id: 'pear',
            label: 'Pear 🍐',
            isDisabled: true,
        }, {
            id: 'strawberry',
            label: 'Strawberry 🍓',
        }, {
            id: 'watermelon',
            label: 'Watermelon 🍉',
            children: [{
                id: 'corn2',
                label: 'Corn 🌽',
            }, {
                id: 'carrot2',
                label: 'Carrot 🥕',
                isDisabled: true,
            }, {
                id: 'eggplant2',
                label: 'Eggplant 🍆',
            }, {
                id: 'tomato2',
                label: 'Tomato 🍅',
            }],
        }],
    }, {
        id: 'vegetables 1',
        label: 'Vegetables',
        children: [{
            id: 'corn',
            label: 'This Corn 🌽',
        }, {
            id: 'carrot',
            label: 'Carrot 🥕',
            isDisabled: true,
        }, {
            id: 'eggplant',
            label: 'Eggplant 🍆',
        }, {
            id: 'tomato',
            label: 'Tomato 🍅',
        }],
    }]

    export default {
        data() {
            return {
                value: 'tomato',
                checked: null,
                checkedOptions: {
                    'DISABLED': '禁用操作',
                    'DISABLED_BRANCH_NODES': '禁用分支选项',
                    'ALWAYS_OPEN': '保持打开菜单',
                    'BRANCH_NODES_FIRST': '在叶节点之前显示分支节点',
                    'FLAT': '平铺模式（同联合模式相对）',
                    'LIMIT TWO': '限制显示长度模式为2（仅多选模式）',
                    'NO_OPTIONS': '不存在Options值时',
                    'SHOW_COUNT': '分支节点显示数量统计',
                    'CLEAR_ON_SELECT': '选择选项后是否清除搜索输入（仅多选模式）',
                    'NO_SEARCHABLE': '禁用搜索（默认开启）',
                    'BACK_SPACE_REMOVES': '没有输入时，不允许删除最后一项（默认允许）',
                    'CLEARABLE': '是否显示重置值的“×”按钮（默认显示）',
                    'CLOSE_ON_SELECT': '单选模式，选择不关闭menu',
                    'FLATTEN_SEARCH_RESULT': '搜索时是否展平树（仅同步）',
                    'DISABLED_FUZZY_MATCHING': '设置为true禁用默认情况下启用的模糊匹配功。',
                    'SEARCH_NESTED': '巢状搜索',
                },
                options: OPTIONS
            }
        },

        computed: {
            showMultiple() {
                return ['FLAT', 'LIMIT TWO', 'CLEAR_ON_SELECT'].includes(this.checked)
            },

            checkedOptionsKeys() {
                return Object.keys(this.checkedOptions)
            },

            checkedOptionsValues() {
                return Object.values(this.checkedOptions)
            },

            checkedOptionsLen() {
                const len = Math.floor(this.checkedOptionsKeys.length / 3)
                const isMode = this.checkedOptionsKeys.length % 3 === 0
                return !isMode ? len + 1 : len
            }
        },

        watch: {
            checked: {
                handler(val) {
                    if (val === 'NO_OPTIONS') this.options = []
                    else this.options = OPTIONS
                }
            }
        },
    }
</script>
```
:::