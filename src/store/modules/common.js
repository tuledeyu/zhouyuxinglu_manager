import website from '@/utils/website'
import $cookies from 'js-cookie'
const common = {

    state: {
        website: website,
        sidebar: {
            opened: !!+$cookies.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop'
    },

    mutations: {
        /*
         *  sidebarStatus
         *  0：收起菜单
         *  1：打开菜单
         */
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                $cookies.set('sidebarStatus', 0)
            } else {
                $cookies.set('sidebarStatus', 1)
            }

            state.sidebar.opened = !state.sidebar.opened
            state.sidebar.withoutAnimation = false
        },

        //  收起菜单
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            $cookies.set('sidebarStatus', 0)
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
            console.log(state)
        },

        //切换设备
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        }
    },

    actions: {
        ToggleSideBar: ({
            commit
        }) => {
            commit('TOGGLE_SIDEBAR')
        },

        CloseSideBar({
            commit
        }, {
            withoutAnimation
        }) {
            commit('CLOSE_SIDEBAR', withoutAnimation)
        },

        ToggleDevice({
            commit
        }, device) {
            commit('TOGGLE_DEVICE', device)
        }
    }

}
export default common