import Vue from 'vue'
import Router from 'vue-router'
import verifyList from './verify'

Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return routerPush.call(this, location).catch(error => error)
}

// 用于区分页面展现形势
//   fullscreen: { true: 全屏页面, false|undefined: 后台页面 }
// 用于权限控制
//         free: { true: 不需登陆, false|undefined: 需登陆 }
//        allow: { true: 需登陆&不需鉴权, false|undefined: 需登陆&需鉴权 }
const routerList = [
    {
        path: '/',
        redirect: { name: 'dashboard' }
    },

    // 全屏页面
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { title: '登陆', fullscreen: true, free: true }
    },

    // 需要校验权限的页面
    ...verifyList,

    // allow
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/errors/403.vue'),
        meta: { title: '访问受限', allow: true }
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/errors/404.vue'),
        meta: { title: '页面不存在', allow: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: '404' }
    }
]

const router = new Router({
    routes: routerList
})

export { router }
