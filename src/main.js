import Vue from 'vue'
import App from '@/views/layout/index.vue'
import { router } from '@/router/index.js'
import Axios from 'axios'
import store from '@/store/index.js'
import NProgress from 'nprogress'
import md5 from 'md5'
import components from '@/components'
import api from '@/global/api.js'
import { dictionary } from '@/global/dictionary.js'
import funs from '@/global/function.js'
import { getToken, setToken } from '@/util/storage.js'

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
// 阻止默认关闭事件，避免{ props:visible }冲突
Dialog.props.showClose.default = false
Dialog.props.closeOnClickModal.default = false
Dialog.props.closeOnPressEscape.default = false
// 为了与Dialog保持一致性
MessageBox.setDefaults({
  showClose: false,
  closeOnClickModal: false,
  closeOnPressEscape: false
})

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
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Vue.prototype.$md5 = md5
Vue.prototype.$dic = dictionary
Vue.prototype.$api = api
Vue.use(components)
Vue.use(funs)

process.env.NODE_ENV === 'devmock' && require('../mock')

Axios.defaults.baseURL = process.env.VUE_APP_axiosDefaultsBaseURL
Axios.defaults.timeout = 60000
// 将token添加到请求头
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
  store.commit('SET_IS_LOADING', { isLoading: false })
  if (error.response) {
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
  } else {
    Message.warning('未知错误，请稍后重试！')
    return Promise.reject(error)
  }
})

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
    if (store.state.user.routerList.length === 0) {
      await store.dispatch('getRouter')
    }
    // 不放前面是因为初次加载需要获取菜单列表
    // 需登陆&不需鉴权的页面
    if (to.meta.allow) {
      next(); return
    }
    const routerList = store.state.user.routerList
    if (routerList.some(v => v.name === to.name)) {
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
