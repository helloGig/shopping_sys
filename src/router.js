import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/home.vue'

Vue.use(Router)

const router = new Router({
        routes: [
            /* {path:'/',redirect:'/login'},定向地址 */
            { path: '/login', component: login },
            { path: '/home', component: home }
        ]
    })
    //挂在路由导航守卫
router.beforeEach((to, from, next) => {
    //to: 将要访问的路径
    // from 代表从哪个路径跳转而来
    //next() 放行  next(路径)强制要跳转的路径
    if (to.path === '/login') return next()
    const token = window.sessionStorage.getItem('Token')
    if (!token) return next('/login')
    next()
})
export default router