<template>
  <el-form class="sm-sign-form" status-icon :model="loginForm" ref="loginForm" :rules="loginRules">
    <el-form-item prop="userName">
      <el-input
        placeholder="请输入用户名"
        v-model.trim="loginForm.userName"
        @keyup.enter.native="handleLogin"
        autocomplete="off"
      >
        <i class="el-icon-user" slot="prefix"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        placeholder="请输入密码"
        :type="passwordType"
        autocomplete="new-password"
        v-model="loginForm.pwd"
        @keyup.enter.native="handleLogin"
        @focus="passwordType = 'password'"
      >
        <i class="el-icon-lock" slot="prefix"></i>
        <i
          class="el-icon-view"
          slot="suffix"
          @click="handleClick"
          :class="['is-hover',{'is-show': !passwordType}]"
        ></i>
      </el-input>
    </el-form-item>
    <div class="sm-sign-form__check">
      <el-checkbox v-model="isChecked">记住账号</el-checkbox>
      <span class="sm-sign-form__check--size" @click="forgetPassword">忘记密码？</span>
    </div>
    <el-form-item>
      <el-button type="primary" class="sm-sign-form__login" @click.native.prevent="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { validateSpecial } from '@/utils/validate'
import { setToken } from '@/utils/auth'
export default {
  name: 'SmSignForm',

  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }

    return {
      passwordType: 'text',
      loginForm: {
        userName: '',
        pwd: '',
        type: '0'
      },
      isChecked: false,
      loginRules: {
        userName: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    handleClick() {
      this.passwordType
        ? (this.passwordType = null)
        : (this.passwordType = 'password')
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        console.log(this.loginForm)
        if (valid) {
          this.$store.dispatch('Login', this.loginForm).then(res => {
            this.$router.push({ path: '/home/home' })
          })
        }
      })
    },

    forgetPassword() {}
  }
}
</script>

