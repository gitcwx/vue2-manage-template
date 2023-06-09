<template>
    <div class="manage-tags" v-show="tagsList.length">
        <ul class="tags-list" id="tags-list">
            <li class="tags-item" v-for="(item,index) in tagsList" :class="{'is-active': isActive(item.path)}" :key="index">
                <router-link :to="item.fullPath" class="tags-item-title">
                    {{item.title}}
                </router-link>
                <el-tooltip
                    effect="dark"
                    content="ALT + W 快捷关闭"
                    placement="bottom"
                >
                    <span class="tags-item-icon" @click="closeTags(index)"><i class="manage-icon icon-close"></i></span>
                </el-tooltip>
            </li>
        </ul>
        <div class="tags-close-box" id="tags-close-box">
            <el-dropdown @command="handleTags" placement="bottom-end">
                <div class="tags-close-button">
                    标签选项<i class="manage-icon icon-down"></i>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="other">关闭其它</el-dropdown-item>
                        <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'manage-tags',
        data () {
            return {
                tagsList: []
            }
        },
        watch: {
            $route: {
                immediate: true,
                handler (newValue, oldValue) {
                    // onHide事件
                    if (oldValue && oldValue.matched && oldValue.matched.length) {
                        const oldPage = oldValue.matched[0].components.default
                        if (oldPage.onHide) {
                            oldPage.onHide.call(oldValue.matched[0].components.default)
                        }
                    }
                    // onShow事件
                    if (newValue && newValue.matched && newValue.matched.length) {
                        this.setTags(newValue)
                    }
                }
            }
        },
        methods: {
            isActive (path) {
                return path === this.$route.path
            },
            // 关闭单个标签
            closeTags (index) {
                const currentItem = this.tagsList.splice(index, 1)[0]
                // 移除对应页面的keep-alive
                this.$store.commit('SET_TAGSLIST', this.tagsList)
                // 关闭项为当前激活页面
                if (currentItem.path === this.$route.path) {
                    // 是否有相邻项
                    const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1]
                    if (item) {
                        this.$router.push(item.fullPath)
                    } else {
                        this.$router.push('/')
                    }
                }
            },
            // 关闭全部标签
            closeAll () {
                this.tagsList = []
                this.$router.push('/')
                this.$store.commit('SET_TAGSLIST', this.tagsList)
            },
            // 关闭其他标签
            closeOther () {
                this.tagsList = this.tagsList.filter(item => {
                    return item.path === this.$route.path
                })
                this.$store.commit('SET_TAGSLIST', this.tagsList)
            },
            // [新增标签 | 切换标签]
            setTags (route) {
                const isExist = this.tagsList.some(item => {
                    return item.path === route.path
                })
                if (isExist) {
                    // 切换到已存在tag时 模拟生命周期 onShow
                    const currentPage = route.matched[0].components.default
                    if (currentPage.onShow) {
                        this.$nextTick(() => {
                            currentPage.onShow.call(route.matched[0].instances.default)
                        })
                    }
                } else {
                    if (this.tagsList.length >= 8) {
                        this.tagsList.shift()
                    }
                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.path,
                        fullPath: route.fullPath,
                        // name 必要 keep-alive include
                        name: route.matched[0].components.default.name
                    })
                    this.$store.commit('SET_TAGSLIST', this.tagsList)
                }
            },
            handleTags (command) {
                command === 'other' ? this.closeOther() : this.closeAll()
            }
        }
    }

</script>

<style lang="scss" scoped>
.manage-tags {
    position: relative;
    background: #fff;
    padding-right: 120px;
    box-shadow: 0 5px 10px #ddd;
    z-index: 99;

    .tags-list {
        display: flex;
        align-items: center;
        padding: 4px;
        background: #fff;

        .tags-item {
            margin-right: 5px;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            border: 1px solid #e9eaec;
            background: #fff;
            padding: 2px 5px 2px 12px;
            color: #666;
            white-space: nowrap;

            .icon-close {
                font-size: 12px;
            }
            &.is-active {
                color: #fff;
                border-color: $color-primary;
                background-color: $color-primary;

                .tags-item-title {
                    color: #fff;
                }
            }

            &:not(.is-active):hover {
                background: #f8f8f8;
            }

            .tags-item-title {
                display: inline-block;
                max-width: 80px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-right: 5px;
                color: #666;
                vertical-align: bottom;
            }
        }
    }

    .tags-close-box {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        text-align: center;
        width: 110px;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;

        .tags-close-button {
            padding: 4px 6px 4px 12px;
            cursor: pointer;
            background-color: $color-primary;
            color: #fff;
            font-size: 12px;
            border-radius: 2px;
            margin-top: 3px;

            .icon-down {
                margin-left: 6px;
                font-size: 12px;
            }
        }
    }
}
</style>
