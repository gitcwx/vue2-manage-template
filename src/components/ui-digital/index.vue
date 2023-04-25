<template>
    <div
        class="ui-digital"
        :style="{
            '--digital-color': color,
            '--digital-shadow-color': shadowColor,
            'font-size': calcSize()
        }">
        <span
            v-for="(item, index) in String(value)"
            :key="index"
            :data-text="isCode(item) ? item : null"
        >{{isCode(item) ? 0 : item}}</span>
    </div>
</template>

<script>
    export default {
        name: 'ui-digital',
        props: {
            value: [String, Number],
            size: {
                type: [String, Number],
                default: 16
            },
            color: {
                type: String,
                default: '#409EFF'
            },
            shadowColor: {
                type: String,
                default: 'rgba(64,158,255,.1)'
            }
        },
        methods: {
            // 字体大小
            calcSize () {
                if (/^\d+(\.\d+)?$/.test(this.size)) {
                    return this.size + 'px'
                } else {
                    return this.size
                }
            },
            isCode (item) {
                return /[a-zA-Z0-9]/.test(item)
            }
        }
    }
</script>

<style lang="scss" scoped>
.ui-digital {
    display: inline-block;
    line-height: normal;
    vertical-align: text-bottom;
    letter-spacing: 2px;
    color: var(--digital-color);

    span {
        display: inline-block;
        font-style: normal;
        vertical-align: initial;
    }

    span[data-text] {
        position: relative;
        display: inline-block;
        font-family: 'digital-7', sans-serif;
        color: var(--digital-shadow-color);

        &::after {
            position: absolute;
            top: 0;
            right: 0;
            content: attr(data-text);
            color: var(--digital-color);
        }
    }
}
</style>
