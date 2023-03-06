## 树型选择器

### 基础用法

在select的基础上添加树形选择功能，并提供丰富的操作模式。

:::demo 通过options进行赋值，默认为单选模式。允许在data上设置`isDisabled`为true，禁用选项。通过设置`clearable`为true（默认），开启清空功能。

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
        <el-radio-group v-model="checked" style="padding: 1rem 0">
            <el-radio v-for="check in checkedOptions" :key="check" :label="check">{{ check }}</el-radio>
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
                :limit="checked === 'LIMIT TWO' ? 2 : null"
                :show-count="checked === 'SHOW_COUNT'"
        />
    </div>
</template>

<script>
    const OPTIONS = [{
        id: 'fruits 1',
        label: 'Fruits',
        children: [{
            id: 'apple',
            label: 'Apple 🍎',
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
        }],
    }, {
        id: 'vegetables 1',
        label: 'Vegetables',
        children: [{
            id: 'corn',
            label: 'Corn 🌽',
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
        computed: {
            showMultiple() {
                return ['FLAT', 'LIMIT TWO'].includes(this.checked)
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

        data() {
            return {
                value: null,
                checked: null,
                checkedOptions: [
                    'DISABLED',
                    'DISABLED_BRANCH_NODES',
                    'ALWAYS_OPEN',
                    'BRANCH_NODES_FIRST',
                    'FLAT',
                    'LIMIT TWO',
                    'NO_OPTIONS',
                    'SHOW_COUNT'
                ],
                options: OPTIONS
            }
        }
    }
</script>
```
:::

### 节点选择模式

对于非固定和多选模式，如果选中了分支节点及其所有后代，则vue-treeselect会将它们组合到值数组中的单个项目中，如以下示例所示。通过使用valueConsistsOf道具，您可以更改该行为。该道具有四个选项：

* "ALL" - 选中的所有节点都将包含在 value 数组中
* "BRANCH_PRIORITY"（默认）-如果选中了分支节点，则其所有后代将被排除在value 数组之外
* "LEAF_PRIORITY" - 如果选中了分支节点，则此节点本身及其分支后代将从value阵列中排除，但其叶后代将包括在内
* "ALL_WITH_INDETERMINATE" -选中的任何节点将包括在value 数组中，另外还有不确定的节点

:::demo 通过使用valueConsistsOf道具，来变更选择模式。
```html

<template>
    <div>
        <div style="
                    margin-bottom: 1rem; 
                    background-color: #F5F7FA; 
                    padding: 10px; 
                    border-radius: 5px ">
            value: {{ value }} 
        </div>
        <el-select-tree :options="options" :multiple="true" v-model="value"  :value-consists-of="checked" />
        <el-radio-group v-model="checked" style="padding: 1rem 0">
            <el-radio v-for="check in checkedOptions" :key="check" :label="check" >{{ check }}</el-radio>
        </el-radio-group>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: null,
                checked: 'BRANCH_PRIORITY',
                checkedOptions: [
                    'ALL',
                    'BRANCH_PRIORITY',
                    'LEAF_PRIORITY',
                    'ALL_WITH_INDETERMINATE'
                ],
                options: [{
                    id: 'fruits 1',
                    label: 'Fruits',
                    children: [{
                        id: 'apple',
                        label: 'Apple 🍎',
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
                    }],
                }, {
                    id: 'vegetables',
                    label: 'Vegetables',
                    children: [{
                        id: 'corn',
                        label: 'Corn 🌽',
                    }, {
                        id: 'carrot',
                        label: 'Carrot 🥕',
                    }, {
                        id: 'eggplant',
                        label: 'Eggplant 🍆',
                    }, {
                        id: 'tomato',
                        label: 'Tomato 🍅',
                    }],
                }],
            }
        }
    }
</script>
```
:::

### 平面模式和排序值

在前面的所有示例中，我们使用了默认的非平坦模式vue-treeselect，这意味着：
* 每当分支节点被检查时，其所有子节点也将被检查 
* 每当分支节点检查所有子节点时，分支节点本身也将被检查

有时我们不需要那种机制，并且希望分支节点和叶子节点不会相互影响。在这种情况下，应使用平面模式，如下所示。

如果要控制所选选项的显示顺序，请使用sortValueBy道具。该道具有三个选择：
* "ORDER_SELECTED" （默认）-选择订单
* "LEVEL" - 选择级别: C 🡒 BB 🡒 AAA
* "INDEX" - 选项索引: AAA 🡒 BB 🡒 C

:::demo  首先通过flat开启平面模式，再请使用sortValueBy道具，来变更排序模式。
```html

<template>
    <div>
        <div style="
                    margin-bottom: 1rem; 
                    background-color: #F5F7FA; 
                    padding: 10px; 
                    border-radius: 5px ">
            value: {{ sortedValue }}
        </div>
        <el-select-tree
                flat
                :options="options"
                :multiple="true"
                v-model="sortedValue"
                :sort-value-by="sorted"
        />
        <el-radio-group v-model="sorted" style="padding: 1rem 0">
            <el-radio v-for="check in sortedOptions" :key="check" :label="check">{{ check }}</el-radio>
        </el-radio-group>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                sorted: 'ORDER_SELECTED',
                sortedValue: ['C', 'AAA', 'BB'],
                sortedOptions: ['ORDER_SELECTED', 'LEVEL', 'INDEX'],
                options: [
                    {
                    id: 'A',
                    label: 'A',
                    children: [{
                        id: 'AA',
                        label: 'AA',
                    }, {
                        id: 'AB',
                        label: 'AB',
                    }, {
                        id: 'AC',
                        label: 'AC',
                        children: [
                            { id: 'AAA', label: 'AAA' }
                        ]
                    }, ],
                }, {
                    id: 'B',
                    label: 'B',
                    children: [{
                        id: 'BA',
                        label: 'BA',
                    },{
                        id: 'BB',
                        label: 'BB',
                    }],
                }, {
                        id: 'C',
                        label: 'C',
                        children: [{
                            id: 'CA',
                            label: 'CA',
                        }],
                    }],
            }
        }
    }
</script>
```
:::
