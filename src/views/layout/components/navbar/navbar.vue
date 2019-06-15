<template>
  <div class="sm-navbar">
    <div class="is-center">
      <i
        class="el-icon-s-fold sm-navbar--size"
        :class="{'is-active':sidebar.opened}"
        @click.stop="toggleSideBar"
      ></i>
      <sm-breadcrumb></sm-breadcrumb>
    </div>

    <div class="sm-navbar--right">
      <el-tooltip effect="dark" content="转到Git hub" placement="bottom">
        <i class="iconfont icon-github1"></i>
      </el-tooltip>
      <el-tooltip effect="dark" content="疑问" placement="bottom">
        <i class="iconfont icon-yiwen"></i>
      </el-tooltip>
      <el-tooltip effect="dark" content="锁屏" placement="bottom">
        <i class="iconfont icon-weibiaoti559"></i>
      </el-tooltip>
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <i class="iconfont icon-quanping" @click="handleFull"></i>
      </el-tooltip>
      <el-tooltip effect="dark" content="主题" placement="bottom">
        <i class="iconfont icon-theme"></i>
      </el-tooltip>
      <sm-clock></sm-clock>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import screenfull from 'screenfull'
import SmBreadcrumb from '@/components/sm-breadcrumb'
import SmClock from '@/components/sm-clock'

export default {
  name: 'SmNavbar',

  components: {
    SmBreadcrumb,
    SmClock
  },

  data() {
    return {
      isFullscreen: false
    }
  },

  computed: {
    ...mapGetters(['sidebar'])
  },

  methods: {
    toggleSideBar() {
      console.log('SSSSS')
      this.$store.dispatch('ToggleSideBar')
    },

    handleFull() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>


