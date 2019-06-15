// import Vue from 'vue'
import Router from 'vue-router'

// Vue.use(Router)

import Layout from '@/views/layout/Layout'

export const constantRouterMap = [{
        path: '',
        component: Layout,
        redirect: '/home/home'
    },
    {
        path: '/login',
        component: () => import('@/views/login'),
        name: '登录',
        hidden: true
    },
    {
        path: '/404',
        name: '权限不足',
        component: () => import('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        name: '网路不稳定',
        component: () => import('@/views/errorPage/401'),
        hidden: true
    },
    // 锁屏
    {
        path: '/lock',
        name: '锁屏页',
        component: () => import('@/views/common/lock'),
        hidden: true
    }
]


export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        y: 0 //期望滚动到哪个的位置
    }),
    routes: constantRouterMap
})

export const asyncRouterMap = [{
        path: '/home',
        component: Layout,
        meta: {
            title: '首页',
            icon: 'icon-ziyuan5'
        },
        children: [{
            path: 'home',
            name: 'home',
            component: () => import('@/views/home/Home'),
            meta: {
                title: '首页',
                icon: ''
            }
        }]
    },
    {
        path: '/system',
        component: Layout,
        name: 'system',
        redirect: '/system/DepartManage',
        meta: {
            title: '系统配置',
            icon: 'icon-ziyuan2'
        },
        children: [{
            path: 'DepartManage',
            name: 'DepartManage',
            component: () => import('@/views/system/DepartManage'),
            meta: {
                title: '组织管理',
                icon: ''
            }
        }, {
            path: 'UserManage',
            name: 'UserManage',
            component: () => import('@/views/system/UserManage'),
            meta: {
                title: '人员管理',
                icon: ''
            }
        }, {
            path: 'ResourceManage',
            name: 'ResourceManage',
            component: () => import('@/views/system/ResourceManage'),
            meta: {
                title: '资源管理',
                icon: ''
            }
        }, {
            path: 'FunManage',
            name: 'FunManage',
            component: () => import('@/views/system/FunManage'),
            meta: {
                title: '功能权限',
                icon: ''
            }
        }, {
            path: 'DataManage',
            name: 'DataManage',
            component: () => import('@/views/system/DataManage'),
            meta: {
                title: '数据权限',
                icon: ''
            }
        }]
    },
    {
        path: '/log',
        component: Layout,
        name: 'log',
        redirect: '/log/SecurityLog',
        meta: {
            title: '日志管理',
            icon: 'icon-rizhi'
        },
        children: [{
                path: 'SecurityLog',
                name: 'SecurityLog',
                component: () => import('@/views/log/SecurityLog.vue'),
                meta: {
                    title: '登录日志',
                    icon: ''
                }
            },
            {
                path: 'ExceptionLog',
                name: 'ExceptionLog',
                component: () => import('@/views/log/ExceptionLog.vue'),
                meta: {
                    title: '异常登录',
                    icon: ''
                }
            },
            {
                path: 'OperationLog',
                name: 'OperationLog',
                component: () => import('@/views/log/OperationLog.vue'),
                meta: {
                    title: '操作日志',
                    icon: ''
                }
            }
        ]
    }
]