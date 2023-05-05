// name字段需与接口返回的页面列表的name字段对应
// 用于控制权限
const verifyList = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '工作台' }
    },
    {
        path: '/user/list',
        name: 'user.list',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户列表' }
    },
    {
        path: '/user/password',
        name: 'user.password',
        component: () => import('@/views/user/password.vue'),
        meta: { title: '修改密码' }
    }
]

export default verifyList
