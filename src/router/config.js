const UserAdd = () => import('@/views/user/UserAdd.vue')
const UserList = () => import('@/views/user/UserList.vue')
const ProductAdd = () => import('@/views/product/ProductAdd')
const ProductList = () => import('@/views/product/ProductList.vue')
const NewsAdd = () => import('@/views/news/NewsAdd.vue')
const NewsList = () => import('@/views/news/NewsList.vue')
const Home = () => import('@/views/home/Home.vue')
const Centent = () => import('@/views/centent/Centent.vue')


const routes = [
  {
    path: '/useradd',
    component: UserAdd,
    requireAdmin: true
  },
  {
    path: '/userlist',
    component: UserList,
    requireAdmin: true
  },
  {
    path: '/productadd',
    component: ProductAdd
  },
  {
    path: '/productlist',
    component: ProductList
  },
  {
    path: '/newsadd',
    component: NewsAdd
  },
  {
    path: '/newslist',
    component: NewsList
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/centent',
    component: Centent
  }
]

export default routes