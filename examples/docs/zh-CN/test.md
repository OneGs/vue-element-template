# 这是测试项

自定义关闭按钮为文字或其他符号。

:::demo 在 Alert 组件中，你可以设置是否可关闭，关闭按钮的文本以及关闭时的回调函数。`closable`属性决定是否可关闭，接受`boolean`，默认为`true`。你可以设置`close-text`属性来代替右侧的关闭图标，注意：`close-text`必须为文本。设置`close`事件来设置关闭时的回调。
```html
<template>
        <div>
            <div style="margin-bottom: 1rem">value: {{ value }}</div>
            <el-select-tree :options="options"  v-model="value" />
        </div>
</template>

<script>
    export default {
        data() {
            return {
                value: [],
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
                    }, {
                        id: 'pear',
                        label: 'Pear 🍐',
                    }, {
                        id: 'strawberry',
                        label: 'Strawberry 🍓',
                    }, {
                        id: 'watermelon',
                        label: 'Watermelon 🍉',
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
