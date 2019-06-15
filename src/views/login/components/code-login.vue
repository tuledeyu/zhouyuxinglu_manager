<template>
  <el-form class="sm-sign-form" status-icon :model="loginForm" ref="loginForm" :rules="loginRules">
    <el-form-item prop="mobile">
      <el-input
        placeholder="请输入手机号码"
        v-model.trim="loginForm.mobile"
        @keyup.enter.native="handleLogin"
        autocomplete="off"
      >
        <i class="el-icon-mobile-phone" slot="prefix"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        autocomplete="off"
        placeholder="请输入验证码"
        v-model.trim="loginForm.code"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="el-icon-position"></i>
        <template slot="append">
          <span @click="handleSend" :class="['sm-sign-form--send',{'is-active':msgKey}]">{{msgText}}</span>
        </template>
      </el-input>
    </el-form-item>
    <div class="sm-sign-form__check">
      <span></span>
      <span class="sm-sign-form__check--size">忘记密码？</span>
    </div>
    <el-form-item>
      <el-button type="primary" class="sm-sign-form__login" @click.native.prevent="handleLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { isvalidatemobile } from '@/utils/validate'

export default {
  name: 'SmSignForm',

  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('请输入4位数的验证码'))
      } else {
        callback()
      }
    }
    return {
      msgText: `发送验证码`,
      msgKey: false,
      msgTime: 60,
      loginForm: {
        mobile: '',
        code: ''
      },
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      }
    }
  },

  methods: {
    handleSend() {
      if (this.msgKey) return
      const time = setInterval(() => {
        this.msgKey = true
        this.msgTime--
        this.msgText = `${this.msgTime}秒后重发`
        if (this.msgTime === 0) {
          this.msgTime = 60
          this.msgText = `发送验证码`
          this.msgKey = false
          clearInterval(time)
        }
      }, 1000)
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$router.push({ path: '/Home' })
        }
      })
    }
  }
}
</script>
