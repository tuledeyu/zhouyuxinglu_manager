import Vue from 'vue'
// import Vuex from 'vuex'
import user from './modules/user'
import permission from './modules/permission'
import tagsViews from './modules/tagsViews'
import common from './modules/common'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        permission,
        tagsViews,
        user,
        common
    },
    getters
})

export default store