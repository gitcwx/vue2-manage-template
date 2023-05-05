<template>
    <div class="manage-drawer">
        <div
            id="setting-switch"
            class="setting-switch"
            @click="settingDrawer = !settingDrawer"
            :class="{'setting-switch-open': settingDrawer}"
        >
            <div class="setting-switch-inner">
                <i class="manage-icon icon-close" v-if="settingDrawer"></i>
                <i class="manage-icon icon-setting" v-else></i>
            </div>
        </div>
        <el-drawer :visible.sync="settingDrawer" :with-header="false" :size="360" :close-on-click-modal="false" :modal-append-to-body="false">
            <div class="setting-wrap">
                <div class="setting-title">系统参数配置</div>
                <div class="setting-item">
                    <label>顶部时间</label>
                    <el-switch v-model="setting.showTimer" />
                </div>
                <div class="setting-item">
                    <label>多页签栏</label>
                    <el-switch v-model="setting.showTags" />
                </div>
                <div class="setting-item">
                    <label>
                        菜单默认状态
                        <el-tooltip placement="bottom" content="刷新进入页面时菜单栏默认状态" trigger="hover">
                            <i class="manage-icon icon-question-circle-fill text-primary"></i>
                        </el-tooltip>
                    </label>
                    <el-radio-group v-model="setting.collapse" size="mini">
                        <el-radio-button label="auto">自动</el-radio-button>
                        <el-radio-button :label="false">展开</el-radio-button>
                        <el-radio-button :label="true">折叠</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    export default {
        name: 'manage-drawer',
        data () {
            return {
                settingDrawer: false,
                isLinked: true,
                setting: {
                    showTimer: true,
                    showTags: true,
                    collapse: 'auto'
                }
            }
        },
        watch: {
            setting: {
                deep: true,
                handler (newVal) {
                    this.$store.commit('SET_SETTING', newVal)
                }
            }
        },
        created () {
            const setting = this.$store.state.common.setting || {}
            for (const key in setting) {
                this.setting[key] = setting[key]
            }
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
.manage-drawer {
    .setting-switch {
        position: fixed;
        bottom: 90px;
        right: 40px;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 9999;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(0, 128, 255, 0.9);
        text-align: center;
        line-height: 40px;
        transition: transform 0.3s ease 1ms;

        .setting-switch-inner {
            height: 100%;
            width: 100%;
            background-color: $color-primary;
            box-shadow: 0 0 6px rgba(0, 128, 255, 0.9);
            color: #fff;
            text-align: center;
            line-height: 40px;
            border-radius: 4px;

            .manage-icon {
                font-size: 20px;
            }
        }

        &.setting-switch-open {
            transform: translateX(-320px);
        }
    }

    .setting-wrap {
        padding: 40px 30px;

        .setting-title {
            font-weight: bold;
            margin-bottom: 30px;
        }

        .setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            margin-bottom: 5px;
            position: relative;
            font-size: 14px;
        }
    }
}
</style>
