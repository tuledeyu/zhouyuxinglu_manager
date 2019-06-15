<template>
  <div class="sm-login is-center">
    <canvas id="linear-particle"></canvas>

    <div class="sm-login__sign is-center">
      <h4 class="sm-login__sign--title is-center">登录</h4>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户密码" name="0">
          <user-login :key="+activeName"></user-login>
        </el-tab-pane>
        <el-tab-pane label="短信验证码" name="1">
          <code-login :key="+activeName"></code-login>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
 <script>
import UserLogin from './components/user-login'
import CodeLogin from './components/code-login'
import Particle from '@/utils/linear-particle.js'

export default {
  name: 'SmLogin',

  components: {
    UserLogin,
    CodeLogin,
    Particle
  },

  data() {
    return {
      activeName: '0'
    }
  },

  mounted() {
    Particle()
    window.onresize = () => {
      Particle()
    }
  }
}
</script>
<style lang="scss" scoped>
#linear-particle {
  position: absolute;
}
</style>

 
