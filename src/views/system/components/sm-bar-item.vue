<template>
  <li
    class="sm-bar-item"
    @click.prevent.stop="handleClick"
    @mouseenter="onMouseEnter"
    @focus="onMouseEnter"
    @blur="onMouseLeave"
    @mouseleave="onMouseLeave"
  >
    <slot></slot>

    <div class="sm-bar-item__icon" ref="icon">
      <slot name="icon" v-if="$slots.icon"></slot>
      <template v-else>
        <i class="el-icon-edit" @click.prevent.stop="handleEditor"></i>
        <i class="el-icon-remove-outline" @click.prevent.stop="handleDelete"></i>
      </template>
    </div>
  </li>
</template>
<script>
export default {
  name: 'SmBarItem',

  props: {
    show: Boolean
  },

  computed: {},

  mounted() {
    if (this.show) {
      this.$refs.icon.style.visibility = 'visible'
    }
  },

  methods: {
    onMouseEnter() {
      if (!this.show) {
        this.$refs.icon.style.visibility = 'visible'
      }
    },

    onMouseLeave() {
      if (!this.show) {
        this.$refs.icon.style.visibility = 'hidden'
      }
    },

    handleClick() {
      this.$el.style.borderRight = `4px solid rgb(16, 142, 233)`
      this.$el.style.background = `rgb(230, 247, 255)`
      this.$emit('click', this)
    },

    handleEditor() {
      this.$emit('handleEditor', this)
    },

    handleDelete() {
      this.$emit('handleDelete', this)
    }
  }
}
</script>

<style lang="scss" scoped>
.sm-bar-item {
  width: 210px;
  height: 45px;
  padding: 15px 20px 15px 60px;
  display: inline-block;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  &:hover {
    background: rgb(230, 247, 255);
    color: rgb(16, 142, 233);
    border-right: 2px solid rgb(16, 142, 233);
  }
  .sm-bar-item__icon {
    white-space: nowrap;
    float: right;
    visibility: hidden;
    i {
      margin-left: 10px;
    }
  }
}
</style>

