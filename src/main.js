import Vue from 'vue'
import App from './App.vue'
import router from './router/permission'
import store from './store'
// import Element from 'element-ui'
import '@/assets/css/normalize.css'
import '@/assets/scss/index.scss'
import '@/assets/font/iconfont.css'

// Vue.use(Element)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')