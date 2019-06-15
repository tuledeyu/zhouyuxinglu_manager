<template>
  <div id="app">
    <transition name="sm-rotate">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>

<style lang="scss" scoped>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>


