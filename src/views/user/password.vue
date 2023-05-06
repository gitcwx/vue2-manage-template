<template>
    <div class="manage manage-user-password">
        <el-form ref="password-form" :model="formData" :rules="rules" label-width="80px" @keyup.enter="submitForm">
            <el-form-item label="原密码" prop="password">
                <el-input v-model="formData.password" type="password" placeholder="请输入原始密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="password1">
                <el-input v-model="formData.password1" type="password" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
                <el-input v-model="formData.password2" type="password" placeholder="请再次输入新密码" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'manage-user-password',
        data () {
            return {
                formData: {
                    password: '',
                    password1: '',
                    password2: ''
                },
                rules: {
                    password: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                        { pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{6,16}$/, message: '密码格式不正确', trigger: 'blur' }
                    ],
                    password1: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{6,16}$/, message: '密码格式不正确', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                if (this.formData.password2) {
                                    this.$refs['password-form'].validateField('password2')
                                }
                                callback()
                            }
                        }
                    ],
                    password2: [
                        { required: true, message: '请重复输入新密码', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                if (value !== this.formData.password1) {
                                    callback(new Error('两次输入密码不一致!'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            submitForm () {
                this.$refs['password-form'].validate(valid => {
                    if (!valid) { return false }
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.$api.user.password,
                        method: 'post',
                        data: {
                            password: this.$md5(this.formData.password),
                            password1: this.$md5(this.formData.password1),
                            password2: this.$md5(this.formData.password2)
                        }
                    }).then(res => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === 200) {
                            this.$message.success(res.data.msg)
                            this.$refs['password-form'].resetFields()
                        } else {
                            this.$message.warning(res.data.msg)
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.manage-user-password {
    .el-form {
        width: 600px;
        padding: 20px;
    }
}
</style>
