<template>
  <el-scrollbar wrapClass="scrollbar-wrapper" class="sm-layout__sliderbar">
    <sm-logo :isCollapse="isCollapse"></sm-logo>
    <el-menu
      mode="vertical"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#1F3240"
      text-color="white"
      active-text-color="#42b983"
    >
      <sm-sidebar-item :routes="permission_routers"></sm-sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from 'vuex'
import SmSidebarItem from './sliderbar-item'
import SmLogo from './logo'
export default {
  name: 'SmSliderbar',

  components: { SmSidebarItem, SmLogo },

  computed: {
    ...mapGetters(['sidebar', 'permission_routers']),

    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>



