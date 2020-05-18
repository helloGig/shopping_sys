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
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')