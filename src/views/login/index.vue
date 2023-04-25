<template>
    <div class="page-login">
        <canvas class="star-canvas" ref="star-canvas"></canvas>
        <div class="login-box">
            <div class="login-title">后台管理系统</div>
            <el-form
                :model="formData"
                :rules="rules"
                ref="login-form"
                label-width="0px"
                class="login-form"
                @keyup.enter="submitForm"
            >
                <el-form-item prop="username">
                    <el-input v-model="formData.username" placeholder="账号">
                        <template #prefix>
                            <i class="manage-icon icon-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="formData.password">
                        <template #prefix>
                            <i class="manage-icon icon-lock-fill"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </div>
                <p class="login-tips">Tips : [账号: admin, 密码: 123456]</p>
            </el-form>
        </div>
        <!-- 图形验证组件 -->
        <Vcode :show="vCodeShow" @success="onSuccess" @close="onClose" />
    </div>
</template>

<script>
    import { setToken } from '@/util/cookies.js'
    import { starMove } from '@/util/star'
    import Vcode from 'vue-puzzle-vcode'
    export default {
        name: 'login-page',
        components: {
            Vcode
        },
        data: function () {
            return {
                vCodeShow: false,
                formData: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'change' }]
                }
            }
        },
        mounted () {
            this.starMove(this.$refs['star-canvas'])
        },
        methods: {
            submitForm () {
                this.$refs['login-form'].validate((valid) => {
                    if (valid) {
                        this.vCodeShow = true
                    } else {
                        return false
                    }
                })
            },
            onSuccess () {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.$api.user.login,
                    method: 'post',
                    data: this.formData
                })
                    .then((res) => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === 's00') {
                            setToken(res.data.token)
                            this.$router.push({ name: 'dashboard' })
                        } else {
                            this.$message.warning(res.data.msg)
                        }
                    })
                    .catch(() => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        this.$message.error('未知错误，请稍后重试！')
                    })
            },
            onClose () {
                this.vCodeShow = false
            },
            starMove
        }
    }
</script>

<style lang="scss" scoped>
.page-login {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background: #333;
    overflow: hidden;

    .star-canvas {
        width: 100%;
        height: 100%;
    }

    .login-box {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
        z-index: 10;

        .login-title {
            width: 100%;
            line-height: 50px;
            text-align: center;
            font-size: 20px;
            color: #189fff;
            border-bottom: 1px solid #ddd;
        }

        .login-form {
            padding: 30px 30px;

            .el-form-item {
                margin-bottom: 18px;

                .el-button {
                    margin-left: -8px;
                }
            }

            .login-btn {
                text-align: center;

                button {
                    width: 100%;
                    height: 36px;
                    margin-bottom: 10px;
                }
            }

            .login-tips {
                font-size: 12px;
                line-height: 30px;
                color: #fff;
            }
        }
    }
}
</style>
