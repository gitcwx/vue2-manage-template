<template>
    <component class="layout" :is="layoutName" />
</template>

<script>
    import layoutPage from './page'
    import layoutManage from './manage'

    export default {
        name: 'page-layout',
        components: {
            layoutPage,
            layoutManage
        },
        computed: {
            layoutName () {
                if (this.$route.path !== '/' && !this.$route.meta.fullscreen) {
                    return 'layout-manage'
                } else {
                    return 'layout-page'
                }
            }
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
.layout {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
