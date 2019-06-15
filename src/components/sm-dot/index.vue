<template>
  <div class="sm-dot">
    <span class="sm-dot__raduis sm-dot--color" :style="{background:color}"></span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'SmDot',

  props: {
    color: [String]
  }
}
</script>

