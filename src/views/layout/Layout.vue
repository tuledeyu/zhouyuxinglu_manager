<template>
  <div class="sm-layout" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <slider-bar></slider-bar>
    <div class="sm-layout__container">
      <sm-navbar></sm-navbar>
      <sm-tagsbar></sm-tagsbar>
      <sm-section></sm-section>
    </div>
  </div>
</template>
<script>
import SliderBar from './components/sliderbar'
import SmNavbar from './components/navbar/navbar'
import SmTagsbar from './components/navbar/tagsbar'
import SmSection from './components/section'
import ResizeMixin from './mixins/ResizeHandler'

export default {
  name: 'SmLayout',

  components: {
    SliderBar,
    SmNavbar,
    SmTagsbar,
    SmSection
  },

  mixins: [ResizeMixin],

  computed: {
    sidebar() {
      return this.$store.state.common.sidebar
    },

    device() {
      console.log(this.$store.state.common.device)
      return this.$store.state.common.device
    },

    classObj() {
      return {
        'is-hideSidebar': !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },

  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>


