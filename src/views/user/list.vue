<template>
    <div class="manage manage-user-list">
        <div class="table-search">
            <el-form :inline="true" :model="searchData">
                <el-form-item label="登录名">
                    <el-input v-model="searchData.username" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="searchData.nickname" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="searchData.phone" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchData.status" placeholder="请选择" clearable>
                        <el-option
                            v-for="(item, index) in userStatusList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reloadTableData" >查询</el-button>
                    <el-button type="success" @click="addUserDialogVisible = true">新增用户</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border stripe>
            <el-table-column prop="username" label="登录名" width="150" />
            <el-table-column prop="nickname" label="昵称" width="150" />
            <el-table-column label="性别" width="80">
                <template #default="scope">
                    <span>{{ valueToLabel(scope.row.gender, genderList) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="账户状态" width="120">
                <template #default="scope">
                    <span>{{ valueToLabel(scope.row.status, userStatusList) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号码" width="150" />
            <el-table-column prop="lastLoginAt" label="上次登录时间" min-width="180"/>
            <el-table-column label="操作" width="180" align="center" fixed="right">
                <template #default="scope">
                    <el-button size="mini" type="warning" @click="editPassword(scope.row)">改密</el-button>
                    <el-button size="mini" type="danger" @click="deleteItem(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="total, sizes, pager, jumper"
            :currentPage="searchData.page"
            :page-size="searchData.limit"
            :total="paginationData.total"
            @size-change="sizeChange"
            @current-change="getTableData"
        />

        <!-- 用户信息弹框 -->
        <el-dialog
            title="新增用户"
            :visible.sync="addUserDialogVisible"
            width="400px"
            label-width="90px"
        >
            <el-form ref="add-user-form" :model="addUserFormData" :rules="addUserFormRules" label-width="90px">
                <el-form-item label="登录名" prop="username">
                    <el-input v-model="addUserFormData.username" placeholder="请输入登录账号名"/>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="addUserFormData.nickname" placeholder="请输入昵称"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserFormData.password" placeholder="请输入账户密码" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="addUserFormData.gender" placeholder="请选择性别" style="width: 100%;">
                        <el-option
                            v-for="(item, index) in genderList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="addUserFormData.phone" :maxlength="11" placeholder="请输入手机号"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addUserDialogClose">取消</el-button>
                    <el-button type="primary" @click="addUserDialogSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 修改密码弹框 -->
        <el-dialog
            :visible.sync="passwordDialogVisible"
            width="400px"
            title="修改密码"
        >
            <el-form ref="password-form" :model="passwordFormData" label-width="90px">
                <el-form-item label="登陆名">
                    <el-input v-model="passwordFormData.username" disabled />
                </el-form-item>
                <el-form-item
                    label="新密码"
                    prop="newPassword"
                    :rules="{ required: true, pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{6,16}$/, message: '6-16位字母数字部分特殊符号' }"
                >
                    <el-input v-model="passwordFormData.newPassword" placeholder="请输入新密码" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="passwordDialogClose">取消</el-button>
                    <el-button type="primary" @click="passwordDialogSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'manage-user-list',
        data () {
            return {
                userStatusList: [
                    { label: '正常', value: 1 },
                    { label: '冻结', value: 2 }
                ],
                genderList: [
                    { label: '男', value: 1 },
                    { label: '女', value: 2 }
                ],
                // 分页数据
                paginationData: {
                    total: 0
                },
                // 表格渲染条件
                searchData: {
                    page: 1,
                    limit: 10,
                    username: '',
                    nickname: '',
                    phone: '',
                    status: ''
                },
                // 表格数据
                tableData: [],
                // 用户信息弹框可见性
                addUserDialogVisible: false,
                // 用户信息弹框参数默认值缓存
                defaultUserFormData: {},
                // 用户信息弹框参数
                addUserFormData: {
                    username: '',
                    nickname: '',
                    password: '',
                    gender: '',
                    phone: ''
                },
                // 用户信息弹框表单校验规则
                addUserFormRules: {
                    username: { required: true, pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/, message: '2-16位中英文数字下划线' },
                    nickname: { required: true, pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/, message: '2-16位中英文数字下划线' },
                    password: { required: true, pattern: /^[a-zA-Z0-9~!@#$%^&*()+=|{}\-_]{6,16}$/, message: '6-16位字母数字部分特殊符号' },
                    gender: { required: true, message: '请选择性别' },
                    phone: { required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                },
                // 修改密码弹框可见性
                passwordDialogVisible: false,
                // 修改密码弹框参数
                passwordFormData: {
                    id: '',
                    username: '',
                    newPassword: ''
                }
            }
        },
        created () {
            // 获取表格数据
            this.getTableData()
        },
        methods: {
            // 获取用户列表
            getTableData () {
                this.$store.commit('SET_IS_LOADING', { isLoading: true })
                this.$axios({
                    url: this.$api.user.list,
                    method: 'post',
                    data: this.searchData
                }).then(res => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: false })
                    if (res.data.code === 200) {
                        this.tableData = res.data.data
                        this.paginationData.total = res.data.total
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                })
            },
            reloadTableData () {
                this.searchData.page = 1
                this.getTableData()
            },
            // 切换每页显示条数
            sizeChange () {
                if (this.searchData.page === 1) {
                    this.getTableData()
                }
                // else
                // sizeChange 会联动 currentChange
            },
            // 修改密码
            editPassword (item) {
                this.passwordFormData.id = item.id
                this.passwordFormData.username = item.username
                this.passwordFormData.newPassword = ''
                this.passwordDialogVisible = true
            },
            // 删除用户
            deleteItem (item) {
                this.$confirm('是否确认删除？').then(() => {
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.$api.user.del,
                        method: 'post',
                        data: {
                            id: item.id
                        }
                    }).then(res => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === 200) {
                            this.$message.success(res.data.msg)
                            this.getTableData()
                        } else {
                            this.$message.warning(res.data.msg)
                        }
                    })
                })
            },
            addUserDialogClose () {
                this.$refs['add-user-form'].resetFields()
                this.addUserDialogVisible = false
            },
            addUserDialogSubmit () {
                this.$refs['add-user-form'].validate(valid => {
                    if (!valid) { return false }
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.$api.user.add,
                        method: 'post',
                        data: {
                            ...this.addUserFormData,
                            password: this.$md5(this.addUserFormData.password)
                        }
                    }).then(res => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === 200) {
                            this.$message.success(res.data.msg)
                            this.$refs['add-user-form'].resetFields()
                            this.addUserDialogVisible = false
                            this.getTableData()
                        } else {
                            this.$message.warning(res.data.msg)
                        }
                    })
                })
            },
            passwordDialogClose () {
                this.$refs['password-form'].resetFields()
                this.passwordDialogVisible = false
            },
            passwordDialogSubmit () {
                this.$refs['password-form'].validate(valid => {
                    if (!valid) { return false }
                    this.$store.commit('SET_IS_LOADING', { isLoading: true })
                    this.$axios({
                        url: this.$api.user.password,
                        method: 'post',
                        data: {
                            id: this.passwordFormData.id,
                            newPassword: this.$md5(this.passwordFormData.newPassword)
                        }
                    }).then(res => {
                        this.$store.commit('SET_IS_LOADING', { isLoading: false })
                        if (res.data.code === 200) {
                            this.$message.success(res.data.msg)
                            this.$refs['password-form'].resetFields()
                            this.passwordDialogVisible = false
                        } else {
                            this.$message.warning(res.data.msg)
                        }
                    })
                })
            },
            valueToLabel (value, list) {
                const item = list.find(v => v.value === value)
                return item ? item.label : '-'
            }
        }
    }
</script>
