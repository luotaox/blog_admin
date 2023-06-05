import { createRouter, createWebHistory } from 'vue-router'
const Login = () => import('@/components/login/Login.vue')
const MainBox = () => import('@/components/mainbox/MainBox.vue')
import RoutesConfig from '@/router/config.js'
import store from '@/store/index'
const NotFound = () => import('@/views/notfound/NotFound.vue')

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
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


const ConfigRouter = () => {
  if (!router.hasRoute('mainBox')) {
    router.addRoute(
      {
        path: '/mainbox',
        name: 'mainbox',
        component: MainBox
      }
    )
  }
  // 权限匹配
  RoutesConfig.forEach((item) => {
    checkPermission(item) && router.addRoute('mainbox', item)
  })
  store.commit('changeRouter', true)
}

const checkPermission = (item) => {
  if (item.requireAdmin) {
    return store.state.userInfo.role === 1;
  }
  return true
}

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.name === 'login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  if (!store.state.isGettterRouter) {
    // 删除所有嵌套路由
    router.removeRoute('mainBox')
    ConfigRouter();
    next({
      path: to.fullPath
    })
  } else
    next();
})
export default router
