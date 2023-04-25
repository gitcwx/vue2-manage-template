import Vue from 'vue'
import App from '@/views/layout/index.vue'
import { router } from '@/router/index.js'
import Axios from 'axios'
import store from '@/store/index.js'
import NProgress from 'nprogress'
import globalComponents from '@/components'
import { api } from '@/api'
import { getToken, setToken } from '@/util/cookies.js'

import '@/assets/css/normalize.css'
import '@/assets/css/common.scss'
import '@/assets/fonts/iconfont/iconfont.css'
import '@/assets/fonts/digital-7/digital-7.css'
import 'nprogress/nprogress.css'
import 'driver.js/dist/driver.min.css'

import {
  Pagination,
  Dialog,
  Button,
  Backtop,
  Drawer,
  Switch,
  Tooltip,
  Radio,
  RadioGroup,
  RadioButton,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  InputNumber,
  MessageBox,
  Message,
  Table,
  TableColumn,
  Menu,
  Submenu,
  MenuItem,
  Loading
} from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Backtop)
Vue.use(Drawer)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(InputNumber)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Loading)

// Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

Vue.use(globalComponents)

Vue.config.productionTip = false

process.env.NODE_ENV === 'devmock' && require('../mock')

Axios.defaults.baseURL = process.env.VUE_APP_axiosDefaultsBaseURL
Axios.defaults.timeout = 60000
// 将cookie的令牌添加到请求头
Axios.interceptors.request.use(config => {
  const token = getToken()
  if (typeof token !== 'undefined') {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, error => {
  return Promise.reject(error)
})

Axios.interceptors.response.use(response => {
  const Authorization = response.headers.Authorization
  if (Authorization) {
    const token = Authorization.split(' ')[1]
    token && setToken(token)
  }
  return response
}, error => {
  if (error.response) {
    store.commit('SET_IS_LOADING', { isLoading: false })
    if (error.response.data && error.response.data.msg) {
      Message.warning(error.response.data.msg)
    } else {
      Message.warning(error.response.statusText)
    }
    if (error.response.status === 401 || error.response.status === 405) {
      router.push({ name: 'login' })
    }
    return new Promise(() => {
    })
  }
  return Promise.reject(error)
})

Vue.prototype.$axios = Axios
Vue.prototype.$api = api

router.beforeEach((to, from, next) => {
  // 无需登陆的页面
  if (to.meta.free) {
    next(); return
  }
  // 需登陆的页面
  const token = getToken()
  if (!token) {
    router.push({ name: 'login' })
    return
  }
  // 页面加载进度条
  NProgress.start();
  // 需登陆&需鉴权的页面
  (async () => {
    if (store.state.user.permission.length === 0) {
      await store.dispatch('getPermission')
    }
    // 不放前面是因为初次加载需要获取菜单列表
    // 需登陆&不需鉴权的页面
    if (to.meta.allow) {
      next(); return
    }
    const permission = store.state.user.permission
    if (permission.some(v => v.name === to.name)) {
      next(); return
    }
    next({ name: '403' })
  })()
})

router.afterEach(() => {
  NProgress.done()
})

new Vue({
  render: h => h(App),
  router: router,
  store: store
}).$mount('#app')
