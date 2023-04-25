<template>
    <div class="layout-manage">
        <!-- 顶部 -->
        <manage-header />
        <!-- 菜单 -->
        <manage-menu />
        <!-- 主体 -->
        <div class="manage-body" :class="{ 'is-menu-collapse': collapse }">
            <!-- 标签栏 -->
            <manage-tags v-if="setting.showTags" />
            <!-- 视图 -->
            <div
                id="manage-view"
                class="manage-view"
                v-loading="isLoading"
                :element-loading-text="loadingText"
                :element-loading-spinner="loadingSpinner"
                :element-loading-background="loadingBackground"
            >
                <transition name="body-move">
                    <keep-alive :include="aliveTags">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
            <!-- 返回顶部 -->
            <el-backtop target="#manage-view">
                <div class="el-backtop-inner">UP</div>
            </el-backtop>
            <!-- 右边setting侧栏 -->
            <manage-drawer />
        </div>
    </div>
</template>

<script>
    import startDriver from '@/util/driver.js'
    import manageHeader from './header.vue'
    import manageMenu from './menu.vue'
    import manageTags from './tags.vue'
    import manageDrawer from './drawer.vue'
    export default {
        name: 'layout-manage',
        components: {
            manageHeader,
            manageMenu,
            manageTags,
            manageDrawer
        },
        provide () {
            return {
                closeCurrentPage: this.closeCurrentPage
            }
        },
        data () {
            return {}
        },
        computed: {
            collapse () {
                return this.$store.state.common.collapse
            },
            setting () {
                return this.$store.state.common.setting
            },
            aliveTags () {
                const tagsList = this.$store.state.common.tagsList
                const tagsNameArray = []
                for (let i = 0, len = tagsList.length; i < len; i++) {
                    tagsList[i].name && tagsNameArray.push(tagsList[i].name)
                }
                return tagsNameArray
            },
            isLoading () {
                return this.$store.state.common.isLoading
            },
            loadingText () {
                return this.$store.state.common.loadingText
            },
            loadingSpinner () {
                return this.$store.state.common.loadingSpinner
            },
            loadingBackground () {
                return this.$store.state.common.loadingBackground
            }
        },
        beforeCreate () {
            let setting = localStorage.getItem('setting')
            if (setting) {
                try {
                    setting = JSON.parse(setting)
                    const storeSetting = this.$store.state.common.setting
                    if (Object.keys(storeSetting).length !== Object.keys(setting).length) {
                        setting = null
                    }
                } catch (err) {
                    setting = null
                }
            }

            if (!setting) {
                setting = {
                    // 显示头部日期时间
                    showTimer: false,
                    // 默认是否显示标签栏
                    showTags: true,
                    // 菜单栏默认是否折叠
                    collapse: 'auto'
                }
            }
            this.$store.commit('SET_SETTING', setting)
        },
        created () {
            // 菜单栏是否折叠
            if (this.setting.collapse === 'auto') {
                this.$store.commit('SET_COLLAPSE', document.body.clientWidth < 1500)
            } else {
                this.$store.commit('SET_COLLAPSE', this.setting.collapse)
            }
            // 获取用户信息
            this.$store.dispatch('getUserInfo').then(() => {
                // 弹出导航引导
                if (!localStorage.getItem('driverReaded')) {
                    startDriver()
                }
            })
        },
        mounted () {
            // 键盘关闭标签事件
            document.addEventListener('keydown', this.keydownFn)
        },
        beforeDestroy () {
            document.removeEventListener('keydown', this.keydownFn)
        },
        methods: {
            keydownFn (event) {
                if (event.altKey && event.keyCode === 87) {
                    this.closeCurrentPage()
                }
            },
            closeCurrentPage (nextPath) {
                const tagsList = this.$store.state.common.tagsList
                // 移除当前项
                const currentIndex = tagsList.findIndex(v => v.path === this.$route.path)
                tagsList.splice(currentIndex, 1)
                this.$store.commit('SET_TAGSLIST', tagsList)

                // 指定跳转
                if (nextPath) {
                    if (typeof nextPath === 'number') {
                        this.$router.go(nextPath)
                    } else {
                        this.$router.push(nextPath)
                    }
                    return
                }

                // 跳转相邻项
                const nextTag = tagsList[currentIndex] ? tagsList[currentIndex] : tagsList[currentIndex - 1]
                if (nextTag) {
                    this.$router.push(nextTag.fullPath)
                } else {
                    this.$router.push('/')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.layout-manage {
    .manage-body {
        position: absolute;
        left: 250px;
        right: 0;
        top: 70px;
        bottom: 0;
        transition: left 0.3s ease-in-out;
        background: #f0f0f0;
        display: flex;
        flex-direction: column;

        &.is-menu-collapse {
            left: 65px;
        }

        .manage-view {
            width: auto;
            flex: 1;
            padding: 10px 0 10px 10px;
            overflow: hidden;

            .manage {
                background: #fff;
                height: 100%;
                padding: 20px;
                overflow-y: scroll;

                .table-search {
                    .el-form-item__label {
                        min-width: 80px;
                    }
                    .el-input,
                    .el-select {
                        width: 200px;
                    }
                }
            }

            .body-move-enter-active,
            .body-move-leave {
                opacity: 1;
                transform: translateX(0);
                transition: all 0.5s ease-in-out;
            }

            .body-move-enter {
                opacity: 0;
                transform: translateX(-50px);
            }
            .body-move-leave-to {
                opacity: 0;
                transform: translateX(50px);
            }
        }

        .el-backtop-inner {
            height: 100%;
            width: 100%;
            background-color: #f2f5f6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: $color-primary;
        }
    }
}
</style>
