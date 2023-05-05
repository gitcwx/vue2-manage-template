<template>
    <div class="manage-menu">
        <div class="menu-wrap">
            <el-menu
                :default-active="onRoutes"
                :collapse="collapse"
                background-color="#324157"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"
                unique-opened
                router
            >
                <template v-for="firstLevel in menuList">
                    <template v-if="firstLevel.children">
                        <el-submenu :index="nameToPath(firstLevel.name)" :key="firstLevel.id">
                            <template #title>
                                <i class="manage-icon" :class="firstLevel.icon"></i>
                                <span class="menu-text">{{ firstLevel.text }}</span>
                            </template>
                            <template v-for="secondLevel in firstLevel.children">
                                <el-sub-menu v-if="secondLevel.children" :index="nameToPath(secondLevel.name)" :key="secondLevel.id + 1">
                                    <template #title>
                                        <i class="manage-icon" :class="secondLevel.icon"></i>
                                        <span class="menu-text">{{ secondLevel.text }}</span>
                                    </template>
                                </el-sub-menu>
                                <el-menu-item v-else-if="secondLevel.isMenu" :index="nameToPath(secondLevel.name)" :key="secondLevel.id">
                                    <i class="manage-icon" :class="secondLevel.icon"></i>
                                    <span class="menu-text">{{ secondLevel.text }}</span>
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                    <template v-else-if="firstLevel.isMenu">
                        <el-menu-item :index="nameToPath(firstLevel.name)" :key="firstLevel.id">
                            <i class="manage-icon" :class="firstLevel.icon"></i>
                            <span class="menu-text">{{ firstLevel.text }}</span>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </div>

        <!-- 折叠按钮 -->
        <div class="collapse-btn-wrap" :class="{'is-collapse': collapse}">
            <div class="run-time" v-show="!collapse">
                本次运行：
                <ui-timer type="counter" size="16" color="#20a0ff" :value="runTime" @onStep="onStep" :autoRun="true"/>
            </div>
            <div id="collapse-btn" class="collapse-btn" @click="changeCollapse">
                <i v-if="collapse" class="manage-icon icon-indent"></i>
                <i v-else class="manage-icon icon-outdent"></i>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'manage-menu',
        data () {
            return {
                runTime: 0,
                menuList: []
            }
        },
        computed: {
            collapse () {
                return this.$store.state.common.collapse
            },
            routerList () {
                return this.$store.state.user.routerList
            },
            onRoutes () {
                return this.$route.path
            }
        },
        watch: {
            routerList: {
                deep: true,
                immediate: true,
                handler (newVal) {
                    if (newVal && newVal.length) {
                        this.menuList = this.treeByPid(JSON.parse(JSON.stringify(newVal)), '')
                    }
                }
            }
        },
        created () {
            this.runTime = sessionStorage.getItem('runTime') || 0
        },
        methods: {
            // 权限列表转换成树形菜单结构
            treeByPid (arr, parentMenuId) {
                const result = []
                const next = []
                arr.forEach(item => {
                    if (item.parentMenuId === parentMenuId) {
                        result.push(item)
                    } else {
                        next.push(item)
                    }
                })
                if (next.length) {
                    result.forEach(item => {
                        const children = this.treeByPid(next, item.id)
                        if (children.length) {
                            item.children = children
                        }
                    })
                }
                return result
            },
            nameToPath (name) {
                return '/' + name.replace(/\./g, '/')
            },
            // 侧边栏折叠
            changeCollapse () {
                this.$store.commit('SET_COLLAPSE', !this.collapse)
            },
            onStep (time) {
                sessionStorage.setItem('runTime', time)
            }
        }
    }
</script>

<style lang="scss" scoped>
.manage-menu {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    width: 250px;
    display: flex;
    flex-direction: column;

    .menu-wrap {
        overflow-y: scroll;
        flex: 1;

        .menu-text {
            margin-left: 10px;
        }

        & > .el-menu {
            min-height: 100%;
        }

        &::-webkit-scrollbar {
            width: 0;
        }
    }

    .collapse-btn-wrap {
        height: 70px;
        line-height: 70px;
        background: #242f42;
        border-right: 1px solid #e6e6e6;
        transition: width .3s ease-in-out;
        width: 250px;
        position: relative;

        .run-time {
            padding-left: 15px;
            color: #fff;
            height: 100%;
            overflow: hidden;
            font-size: 14px;
        }

        .collapse-btn {
            cursor: pointer;
            color: #fff;
            text-align: center;
            width: 63px;
            height: 70px;
            transition: background-color .3s ease-in-out;
            position: absolute;
            right: 0;
            top: 0;
            overflow: hidden;

            .manage-icon {
                font-size: 22px;
            }

            &:hover {
                background: #48576f;
            }
        }

        &.is-collapse {
            width: 64px;
        }
    }
}
</style>
