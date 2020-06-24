import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入element插件
import './plugins/element.js'
//导入全局CSS样式
import './assets/css/global.css'
//导入阿里图标库
import './assets/fonts/iconfont.css'
//导入axios并且全局挂载
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //请求拦截器(添加token)
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('Token')
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
    //将富文本注册为全局
Vue.use(VueQuillEditor)
    //时间过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')
    /** 
     *  重写ElementUI的Message
     *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
     */
let messageInstance = null;
class DonMessage {
    success(options, single = true) {
        this[showMessage]('success', options, single)
    }
    warning(options, single = true) {
        this[showMessage]('warning', options, single)
    }
    info(options, single = true) {
        this[showMessage]('info', options, single)
    }
    error(options, single = true) {
            this[showMessage]('error', options, single)
        }
        [showMessage](type, options, single) {
            if (messageInstance && single) {
                messageInstance.close() //先把原来的关闭
            }
            messageInstance = Message[type](options) //再创建新的消息
        }
}
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')