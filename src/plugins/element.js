import Vue from 'vue'
import { Button, Form, FormItem, Input } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'

// 导入弹框组件 此组件与其他不同需挂载到Vue原型上以供全局使用
import { Message } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// $message上有一系列方法可供使用
Vue.prototype.$message = Message