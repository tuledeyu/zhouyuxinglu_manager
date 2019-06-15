<template>
  <el-breadcrumb class="sm-breadcrumb" separator="/">
    <el-breadcrumb-item v-for="(item,index) in crumbRoutes" :key="index">
      <span v-if="index===crumbRoutes.length-1">{{item.meta.title}}</span>
      <router-link :to="item.redirect||item.path" v-else>{{item.meta.title}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  name: 'SmBreadcrumb',

  data() {
    return {
      crumbRoutes: null
    }
  },

  created() {
    this.getBreadcrumb()
  },

  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },

  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'home') {
        matched = [{ path: '/home/home', meta: { title: '首页' } }].concat(
          matched
        )
      }
      this.crumbRoutes = matched
    }
  }
}
</script>

