<template>
  <div class="sm-logo">
    <img :src="website.logo" height="64px">
    <h2 v-if="!isCollapse" class="sm-logo__title">{{website.title}}</h2>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SmLogo',

  props: ['isCollapse'],

  computed: {
    ...mapGetters(['website']),

    type(val) {
      return this.website.logo.indexOf('static') !== -1
    }
  }
}
</script>


