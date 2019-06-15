<template>
  <section class="sm-section">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'SmSection',
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>



