<template>
    <el-dialog :visible.sync="visible" width="400px" title="修改密码">
        <el-form ref="user-password-form" :model="formData" label-width="90px">
            <el-form-item label="登陆名">
                <el-input v-model="formData.username" disabled />
            </el-form-item>
            <el-form-item
                label="新密码"
                prop="password"
                :rules="{ required: true, pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{6,16}$/, message: '6-16位字母数字部分特殊符号' }"
            >
                <el-input v-model="formData.password" placeholder="请输入新密码" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogClose">取消</el-button>
                <el-button type="primary" @click="dialogConfirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
    export default {
        name: 'manage-user-list-password',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            chooseData: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                formData: {
                    id: '',
                    username: '',
                    password: ''
                }
            }
        },
        watch: {
            visible: {
                handler (newVal) {
                    if (newVal) {
                        this.formData.id = this.chooseData.id
                        this.formData.username = this.chooseData.username
                    }
                }
            }
        },
        methods: {
            dialogClose () {
                this.$refs['user-password-form'].resetFields()
                this.$emit('update:visible', false)
            },
            dialogConfirm () {
                this.$refs['user-password-form'].validate(valid => {
                    if (!valid) { return false }
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.$api.user.password,
                        method: 'post',
                        data: {
                            id: this.formData.id,
                            password: this.$md5(this.formData.password)
                        }
                    }).then(res => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === 200) {
                            this.$message.success(res.data.msg)
                            this.$refs['user-password-form'].resetFields()
                            this.$emit('update:visible', false)
                        } else {
                            this.$message.warning(res.data.msg)
                        }
                    })
                })
            }
        }
    }
</script>
