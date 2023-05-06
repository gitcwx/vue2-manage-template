import axios from 'axios'
import api from '@/global/api.js'

const user = {
    state: {
        token: '',
        routerList: [],
        info: {}
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ROUTER_LIST: (state, routerList) => {
            state.routerList = routerList
        },
        SET_USER_INFO: (state, info) => {
            state.info = info
        }
    },
    actions: {
        getRouter ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios({
                    url: api.router.list,
                    method: 'post'
                }).then(res => {
                    if (res.data && res.data.code === 200) {
                        commit('SET_ROUTER_LIST', res.data.data)
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getUserInfo ({ commit }, params) {
            return new Promise((resolve, reject) => {
                axios.post(api.user.info).then(res => {
                    if (res.data && res.data.code === 200) {
                        commit('SET_USER_INFO', res.data.data)
                        resolve(res)
                    } else {
                        reject(res)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default user
