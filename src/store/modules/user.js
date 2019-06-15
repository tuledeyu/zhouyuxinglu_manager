import {
    getStore,
} from '@/utils/storge'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import API from '@/http/api/login'

const user = {
    state: {
        token: getToken(),
        browserHeaderTitle: getStore({
            name: 'browserHeaderTitle'
        }) || 'YuXing'
    },

    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
        },

        SET_BROWSERHEADERTITLE(state, action) {
            state.browserHeaderTitle = action.browserHeaderTitle
        }

    },

    actions: {
        // 登录
        Login({
            commit
        }, userInfo) {
            return new Promise((resolve, reject) => {
                API.loginPwd(userInfo).then(response => {
                    const data = response
                    console.log(data, 11111)
                    setToken(data.userToken)
                    commit('SET_TOKEN', data.userToken)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                API.getInfo(state.token).then(response => {
                    const data = response
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({
            commit
        }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },
    }

}

export default user