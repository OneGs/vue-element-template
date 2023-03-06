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
                    border-radius: 5px ">
                value: {{ value }}
            </div>
            <el-select-tree :options="options"  v-model="value" />
        </div>
</template>

<script>
    export default {
        data() {
            return {
                value: null,
                options: [ {
                    id: 'fruits 1',
                    label: 'Fruits',
                    children: [ {
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
                        children: [ {
                            id: 'corn1',
                            label: 'Corn 🌽',
                        }, {
                            id: 'carrot1',
                            label: 'Carrot 🥕',
                        }, {
                            id: 'eggplant1',
                            label: 'Eggplant 🍆',
                        }, {
                            id: 'tomato1',
                            label: 'Tomato 🍅',
                        } ],
                    } ],
                }, {
                    id: 'vegetables',
                    label: 'Vegetables',
                    children: [ {
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
                    } ],
                } ],
            }
        }
    }
</script>
```
:::
