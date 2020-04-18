import Vue from 'vue'
import { Message, Button, Form, FormItem, Input } from 'element-ui' //弹框提示,需要全局挂载

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message //通过this访问