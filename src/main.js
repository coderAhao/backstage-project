import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式表
import './assets/css/global.css'
// 导入element插件
import './plugins/element.js'

// 安装vue-table-with-tree-grid插件后引入并将其注册为全局组件
// 在cate.vue文件中用此插件做家电的树状展开结构
import TreeTable from 'vue-table-with-tree-grid'

// 安装vue-quill-editor富文本编辑器后并导入且全局注册使用 也可局部注册
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import axios from 'axios'
// 配置请求的根路径
// 老师提供的接口,但出现了跨域问题
// axios.defaults.baseURL = 'http://127.0.0.1:8081/api/private/v1'
// 评论区找的接口,允许跨域 
axios.defaults.baseURL = 'https://daili.ahao.work/api/private/v1/'


// axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
// 进行反向代理之后用这个接口
// https://oh.ahao.work/api/private/v1/'



axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})


Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

Vue.use(VueQuillEditor)
// 创建一个时间过滤器 全局注册,供List.vue文件使用
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal * 1000);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
