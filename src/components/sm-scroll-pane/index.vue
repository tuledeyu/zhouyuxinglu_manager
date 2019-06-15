<template>
  <div class="sm-scroll-pane" @wheel.prevent="handleScroll" ref="scrollPane">
    <div class="sm-scroll-pane--wrapper" :style="{left: left + 'px'}" ref="scrollWrapper">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SmScrollPane',

  data() {
    return {
      left: 0
    }
  },

  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY - 20
      const $scrollPane = this.$refs.scrollPane.offsetWidth
      const $scrollWrapper = this.$refs.scrollWrapper.offsetWidth

      if (eventDelta > 0) {
        this.left = Math.min(0, this.left + eventDelta)
      } else {
        if ($scrollPane < $scrollWrapper) {
          if (this.left < -($scrollWrapper - $scrollPane)) {
            this.left = this.left
          } else {
            this.left = Math.max(
              this.left + eventDelta,
              $scrollPane - $scrollWrapper
            )
          }
        } else {
          this.left = 0
        }
      }
    }
  }
}
</script>


