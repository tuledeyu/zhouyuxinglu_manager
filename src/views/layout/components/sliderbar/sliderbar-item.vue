<template>
  <div class="sm-sliderbar-item">
    <template v-for="item in routes">
      <router-link
        :key="item.name"
        :to="item.path+'/'+item.children[0].path"
        v-if="hasOneShowingChildren(item.children) && !item.children[0].children"
      >
        <el-menu-item :index="item.path+'/'+item.children[0].path" class="submenu-title-noDropdown">
          <i
            class="iconfont"
            :class="item.children[0].meta&&item.children[0].meta.icon"
            v-if="item.children[0].meta.icon"
          ></i>
          <span
            v-if="item.children[0].meta&&item.children[0].meta.title"
            slot="title"
          >{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>
      <el-submenu v-else :key="item.name" :index="item.name||item.path">
        <template slot="title">
          <i class="iconfont" :class="item.meta.icon" v-if="item.meta&&item.meta.icon"></i>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>
        <template v-for="child in item.children">
          <sm-sliderbar-item
            :routes="child"
            :key="child.name"
            v-if="child.children && child.children.length > 0"
          ></sm-sliderbar-item>

          <router-link :key="child.name" :to="item.path+'/'+child.path" v-else>
            <el-menu-item :index="item.path+'/'+child.path">
              <i
                class="iconfont"
                :class="child.meta&&child.meta.icon"
                v-if="child.meta&&child.meta.icon"
              ></i>
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
export default {
  name: 'SmSliderItem',

  props: {
    routes: {
      type: Array
    }
  },

  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>


