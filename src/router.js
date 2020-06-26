import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/home.vue'
import welcome from './components/welcome.vue'
import users from './components/user/users.vue'
import rights from './components/power/rights.vue'
import roles from './components/power/roles.vue'
import cate from './components/goods/cate.vue'
import params from './components/goods/params.vue'
import list from './components/goods/list.vue'
import add from './components/goods/add.vue'
import order from './components/order/order.vue'
import report from './components/report/report.vue'
Vue.use(Router)

const router = new Router({
        routes: [
            /* {path:'/',redirect:'/login'},定向地址 */
            { path: '/login', component: login },
            {
                path: '/home',
                component: home,
                redirect: '/welcome',
                children: [
                    { path: '/welcome', component: welcome },
                    { path: '/users', component: users },
                    { path: '/rights', component: rights },
                    { path: '/roles', component: roles },
                    { path: '/categories', component: cate },
                    { path: '/params', component: params },
                    { path: '/goods', component: list },
                    { path: '/goods/add', component: add },
                    { path: '/orders', component: order },
                    { path: '/reports', component: report }
                ]
            },

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