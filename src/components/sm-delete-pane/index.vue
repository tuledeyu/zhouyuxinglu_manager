<template>
  <div class="sm-delete-pane">
    <span>已选择</span>
    <span class="sm-delete-pane--total">{{total}}</span>
    <span class="sm-delete-pane--line">条</span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'SmDeletePane',

  props: ['total']
}
</script>

