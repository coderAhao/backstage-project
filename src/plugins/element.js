import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)



// 导入弹框Message组件 此组件与其他不同需挂载到Vue原型上以供全局使用
// $message上有一系列方法可供使用
Vue.prototype.$message = Message