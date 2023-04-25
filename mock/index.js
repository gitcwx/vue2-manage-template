import Mock from 'mockjs'

import user from './user/index.js'
import permission from './permission/index.js'
Mock.setup({
    timeout: 500
})

console.log('启动mock请求数据')
user(Mock)
permission(Mock)
