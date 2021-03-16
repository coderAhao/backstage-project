import Vue from 'vue'
import { 
  Button, 
  Form, 
  FormItem, 
  Input, 
  Message, 
  Container, 
  Header, 
  Aside, 
  Main, 
  Menu, 
  Submenu, 
  MenuItem,
  Breadcrumb,
  BreadcrumbItem, 
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'

// 导入弹框组件 此组件与其他不同需挂载到Vue原型上以供全局使用
// import { Message } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

// 导入弹框Message组件 此组件与其他不同需挂载到Vue原型上以供全局使用
// $message上有一系列方法可供使用
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm