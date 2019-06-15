import router from './router'
import store from '../store'

/*
 * https://github.com/rstacruz/nprogress
 * Progress 进度条
 */

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
    Message
} from 'element-ui'
import {
    getToken
} from '@/utils/auth'
import {
    setTitle
} from '@/utils/dom'



const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
    NProgress.start()
    //存在Token
    if (getToken()) {
        const browserHeaderTitle = to.name
        store.commit('SET_BROWSERHEADERTITLE', {
            browserHeaderTitle
        })
        if (!store.getters.addRouters) {
            store.dispatch('GetInfo').then(res => { // 拉取用户信息
                const backRouterMap = res.router
                store.dispatch('GenerateRoutes', {
                    backRouterMap
                }).then(() => { // 根据roles权限生成可访问的路由表

                    router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                    next({
                        ...to,
                        replace: true
                    }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                })
            }).catch((err) => {
                store.dispatch('FedLogOut').then(() => {
                    Message.error(err || 'Verification failed, please login again')
                    next({
                        path: '/'
                    })
                })
            })
        } else {
            next()
        }


    } else {
        // 设置浏览器头部标题
        const browserHeaderTitle = to.name
        store.commit('SET_BROWSERHEADERTITLE', {
            browserHeaderTitle
        })
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
    setTimeout(() => {
        const browserHeaderTitle = store.getters.browserHeaderTitle
        setTitle(browserHeaderTitle)
    }, 0)
})

export default router