import { createRouter, createWebHistory } from 'vue-router'
const Login = () => import('@/components/login/Login.vue')
const MainBox = () => import('@/components/mainbox/MainBox.vue')
import RoutesConfig from '@/router/config.js'
import store from '@/store'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/mainbox',
    name: 'mainbox',
    component: MainBox
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// const ConfigRouter = () => {
// 权限匹配
RoutesConfig.forEach((item) => {
  router.addRoute('mainbox', item)
})
// state.commit('changeRouter', true)
// }

// 路由守卫
// router.beforeEach(to, from, next => {
//   if (to === 'login') return next();
//   const tokenStr = sessionStorage.getItem('token');
//   if (!tokenStr) return next('/login');
//   if (!state.isGettterRouter) {
//     ConfigRouter();
//     next({
//       path: to.fullPath
//     })
//   } else next();
// })
export default router
