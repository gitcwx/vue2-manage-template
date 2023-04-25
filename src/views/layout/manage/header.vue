<template>
    <div class="manage-header">
        <div class="logo">后台管理系统</div>

        <div class="manage-header-center" v-if="setting.showTimer">
            <ui-timer type="dateTime" color="#20a0ff" size="20" />
        </div>

        <div class="manage-header-right">
            <!-- 全屏显示 -->
            <el-tooltip
                effect="dark"
                :content="fullscreen ? '取消全屏' : '全屏'"
                placement="bottom"
            >
                <div class="btn-fullscreen" @click="handleFullScreen" id="btn-fullscreen">
                    <i v-if="fullscreen" class="manage-icon icon-fullscreen-exit"></i>
                    <i v-else class="manage-icon icon-fullscreen"></i>
                </div>
            </el-tooltip>
            <!-- 用户名下拉菜单 -->
            <el-dropdown trigger="hover" @command="handleCommand" size="medium">
                <!-- 用户头像 -->
                <div class="user-avatar">
                    <img v-if="userInfo.avatar" :src="imgPrefix + userInfo.avatar" />
                    <img v-else :src="require('@/assets/images/default-avatar.png')" />
                    {{userInfo.nickname}}
                    <i class="manage-icon icon-caret-down"></i>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="user.password">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import { removeToken } from '@/util/cookies.js'
    export default {
        name: 'manage-header',
        data () {
            return {
                fullscreen: false,
                imgPrefix: process.env.VUE_APP_imgPrefix
            }
        },
        computed: {
            setting () {
                return this.$store.state.common.setting
            },
            userInfo () {
                return this.$store.state.user.info
            }
        },
        created () {},
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand (command) {
                if (command === 'logout') {
                    removeToken()
                    sessionStorage.removeItem('runTime')
                    this.$router.push({ name: 'login' })
                } else {
                    this.$router.push({ name: command })
                }
            },
            // 全屏事件
            handleFullScreen () {
                const element = document.documentElement
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen()
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen()
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen()
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen()
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen()
                    }
                }
                this.fullscreen = !this.fullscreen
            }
        }
    }
</script>
<style lang="scss" scoped>
.manage-header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    color: #fff;
    background-color: #242f42;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
        width: 250px;
        line-height: 70px;
        font-size: 22px;
        margin-left: 20px;
    }

    .manage-header-right {
        float: right;
        padding-right: 20px;
        display: flex;
        align-items: center;

        .btn-fullscreen {
            width: 40px;
            text-align: center;
            cursor: pointer;
            font-size: 22px;
            .manage-icon {
                font-weight: bold;
                font-size: 20px;
            }
        }

        .user-avatar {
            margin-left: 10px;
            color: #fff;
            cursor: pointer;
            height: 40px;
            line-height: 40px;

            img {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                box-shadow: 0 0 8px 0 #666;
                background: #fff;
                vertical-align: middle;
                margin-right: 5px;
            }
        }
    }
}
</style>
