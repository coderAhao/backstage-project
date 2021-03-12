import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/css/global.css'

import './plugins/element.js'

import Axios from 'axios'
// 配置请求的根路径
// 老师提供的接口,但出现了跨域问题
// Axios.defaults.baseURL = 'http://127.0.0.1:8081/api/private/v1'
// 评论区找的接口,允许跨域 
Axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
Vue.prototype.$http = Axios



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
