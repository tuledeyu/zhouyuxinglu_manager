<template>
  <div class="sm-tagsbar">
    <sm-scroll-pane class="sm-tagsbar__pane">
      <sm-tag
        :class="{'sm-tag--is-active':isActive(route)}"
        v-for="route in visitedViews"
        :route="route"
        :key="route.path"
        @close="handleClose(route)"
        @contextmenu.prevent.native="handleOpenMenu(route,$event)"
      >{{route.title}}</sm-tag>
    </sm-scroll-pane>
    <el-card class="sm-tagsbar__menu" :style="{left:left+'px',top:top+'px'}" v-show="selectedTag">
      <p @click="handleClose(selectedTag)">关闭</p>
      <p @click="handleCloseOther">关闭其它</p>
      <p @click="handleCloseAll">关闭所有</p>
    </el-card>
  </div>
</template>
<script>
import SmScrollPane from '@/components/sm-scroll-pane'
import SmTag from '@/components/sm-tag'
export default {
  name: 'SmTagsbar',

  components: {
    SmScrollPane,
    SmTag
  },

  data() {
    return {
      left: 0,
      top: 0,
      selectedTag: null
    }
  },

  computed: {
    visitedViews() {
      return this.$store.state.tagsViews.visitedViews
    }
  },

  watch: {
    $route() {
      this.addViewTag()
    },

    selectedTag(value) {
      if (value) {
        document.body.addEventListener('click', this.handleCloseMenu)
      } else {
        document.body.removeEventListener('click', this.handleCloseMenu)
      }
    }
  },

  mounted() {
    this.addViewTag()
  },

  methods: {
    handleOpenMenu(tag, e) {
      this.selectedTag = tag
      this.left = e.clientX
      this.top = e.clientY
    },

    handleCloseMenu() {
      this.selectedTag = null
    },

    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },

    addViewTag() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedView', route)
    },

    handleClose(route) {
      this.$store.dispatch('delVisitedView', route).then(views => {
        if (this.isActive(route)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
    },

    handleCloseOther() {
      this.$router.push(this.selectedTag.path)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
     
      })
    },

    handleCloseAll() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },

    isActive(route) {
      return route.path === this.$route.fullPath
    }
  }
}
</script>

