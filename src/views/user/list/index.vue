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
                <el-form-item label="身份证号">
                    <ui-input-idcard v-model="searchData.idcard" placeholder="请输入"  />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reloadTableData" >查询</el-button>
                    <el-button type="success" @click="addUserDialogVisible = true">新增用户</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" :border="true" stripe>
            <el-table-column prop="username" label="登录名" width="150" />
            <el-table-column prop="nickname" label="昵称" width="150" />
            <el-table-column label="性别" width="80">
                <template #default="scope">
                    <span>{{ $dic(scope.row.gender, 'gender') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="账户状态" width="120">
                <template #default="scope">
                    <span>{{ $dic(scope.row.status, 'userStatus') }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号码" width="150" />
            <el-table-column prop="idcard" label="身份证号" width="200" />
            <el-table-column prop="lastLoginAt" label="上次登录时间" min-width="180"/>
            <el-table-column label="操作" width="180" :align="'center'" fixed="right">
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
        <dialog-user-add :visible.sync="addUserDialogVisible" />
        <!-- 修改密码弹框 -->
        <dialog-user-password :visible.sync="passwordDialogVisible" :chooseData="chooseData" />
    </div>
</template>
<script>
    import { userStatus, gender } from '@/global/dictionary'
    import dialogUserAdd from './add.vue'
    import dialogUserPassword from './password.vue'
    export default {
        name: 'manage-user-list',
        components: {
            dialogUserAdd,
            dialogUserPassword
        },
        data () {
            return {
                userStatusList: userStatus,
                genderList: gender,
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
                    status: '',
                    idcard: ''
                },
                // 表格数据
                tableData: [],
                // 用户信息弹框可见性
                addUserDialogVisible: false,
                // 修改密码弹框可见性
                passwordDialogVisible: false,
                // 当前选中栏
                chooseData: {}
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
                this.chooseData = item
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
            }
        }
    }
</script>
