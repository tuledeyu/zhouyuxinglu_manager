import {
    asyncRouterMap,
    constantRouterMap
} from '@/router/router'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param backRouterMap
 */
export function filterAsyncRouter(asyncRouter = [], backRouter = []) {
    let accessedRouters = []
    asyncRouter.forEach(x => {
        backRouter.forEach(v => {
            if (x.path === v.path) {
                if (v.children && v.children.length) {
                    x.children = filterAsyncRouter(x.children, v.children)
                }

                accessedRouters.push(x)
            }
        })
    })
    return accessedRouters
}


const permission = {
    state: {
        addRouters: null,
        sliderbarMenus: null
    },

    mutations: {
        SET_ROUTERS(state, routers) {
            state.sliderbarMenus = routers
            state.addRouters = constantRouterMap.concat(routers)
        }
    },

    actions: {
        GenerateRoutes({
            commit
        }, data) {
            return new Promise(resolve => {
                const {
                    backRouterMap
                } = data
                let accessedRouters = filterAsyncRouter(asyncRouterMap, backRouterMap)
                commit('SET_ROUTERS', accessedRouters)
                resolve()
            })
        }
    }
}

export default permission