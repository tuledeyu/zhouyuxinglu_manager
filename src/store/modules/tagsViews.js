const tagsView = {
    state: {
        visitedViews: []
    },

    mutations: {
        ADD_VISITED_VIEW(state, view) {
            if (state.visitedViews.some(v => v.path === view.fullPath)) return
            state.visitedViews.push({
                path: view.fullPath,
                name: view.name,
                title: view.meta.title || '暂无'
            })
        },

        DEL_VISITED_VIEW(state, view) {
            state.visitedViews.forEach((v, i) => {
                if (view.path === v.path) {
                    state.visitedViews.splice(i, 1)
                }
            })
        },

        DEL_ALL_VIEWS(state) {
            state.visitedViews = []
        },

        DEL_OTHER_VIEWS(state, view) {
            state.visitedViews.forEach((v, i) => {
                if (view.path === v.path) {
                    state.visitedViews = state.visitedViews.slice(i, i + 1)
                }
            })
        }
    },

    actions: {
        addVisitedView({
            commit
        }, view) {
            commit('ADD_VISITED_VIEW', view)
        },

        delVisitedView({
            commit,
            state
        }, view) {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEW', view)
                resolve([...state.visitedViews])
            })
        },

        delOthersViews({
            commit,
            state
        }, view) {
            return new Promise((resolve) => {
                commit('DEL_OTHER_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },

        delAllViews({
            commit,
            state
        }) {
            return new Promise((resolve) => {
                commit('DEL_ALL_VIEWS')
                resolve([...state.visitedViews])
            })
        }
    }
}

export default tagsView