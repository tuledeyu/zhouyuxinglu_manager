const getters = {
    permission_routers: state => state.permission.sliderbarMenus,
    addRouters: state => state.permission.addRouters,
    browserHeaderTitle: state => state.user.browserHeaderTitle,
    website: state => state.common.website,
    sidebar: state => state.common.sidebar,
    device: state => state.common.device,
}
export default getters