<template>
    <el-dialog title="新增用户" :visible.sync="visible" width="400px" label-width="90px">
        <el-form ref="user-add-form" :model="formData" :rules="rules" label-width="90px">
            <el-form-item label="登录名" prop="username">
                <el-input v-model="formData.username" placeholder="请输入登录账号名" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="formData.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formData.password" placeholder="请输入账户密码" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-select v-model="formData.gender" placeholder="请选择性别" style="width: 100%;">
                    <el-option
                        v-for="(item, index) in genderList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="formData.phone" :maxlength="11" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="身份证号" prop="idcard">
                <el-input v-model="formData.idcard" placeholder="请输入身份证号" />
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
    import checkIdCard from '@/util/checkIdCard.js'
    import { gender } from '@/global/dictionary.js'
    export default {
        name: 'manage-user-list-add',
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                genderList: gender,
                formData: {
                    username: '',
                    nickname: '',
                    password: '',
                    gender: '',
                    phone: ''
                },
                rules: {
                    username: { required: true, pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/, message: '2-16位中英文数字下划线' },
                    nickname: { required: true, pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/, message: '2-16位中英文数字下划线' },
                    password: { required: true, pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{6,16}$/, message: '6-16位字母数字部分特殊符号' },
                    gender: { required: true, message: '请选择性别' },
                    phone: { required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
                    idcard: {
                        required: true,
                        message: '请输入身份证号',
                        validator: (rule, value, callback) => {
                            const result = checkIdCard(value)
                            console.log(result.status)
                            if (result.status) {
                                callback()
                            } else {
                                callback(new Error(result.msg))
                            }
                        }
                    }
                }
            }
        },
        methods: {
            dialogClose () {
                this.$refs['user-add-form'].resetFields()
                this.$emit('update:visible', false)
            },
            dialogConfirm () {
                this.$refs['user-add-form'].validate(valid => {
                    if (!valid) { return false }
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.$api.user.add,
                        method: 'post',
                        data: {
                            ...this.formData,
                            password: this.$md5(this.formData.password)
                        }
                    }).then(res => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === 200) {
                            this.$message.success(res.data.msg)
                            this.$refs['user-add-form'].resetFields()
                            this.$emit('update:visible', false)
                            this.$parent.getTableData()
                        } else {
                            this.$message.warning(res.data.msg)
                        }
                    })
                })
            }
        }
    }
</script>
