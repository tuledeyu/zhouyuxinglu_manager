<template>
  <router-link class="sm-tag" :to="route.path" tag="span">
    <slot></slot>
    <i class="el-icon-close" @click.prevent.stop="handleClose"></i>
  </router-link>
</template>
<script>
export default {
  name: 'SmTag',

  props: {
    route: {
      type: Object,
      required: true
    }
  },

  methods: {
    handleClose() {
      this.$emit('close', this)
    }
  }
}
</script>


