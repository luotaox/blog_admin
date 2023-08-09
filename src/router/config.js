const UserAdd = () => import('@/views/user/UserAdd.vue')
const UserList = () => import('@/views/user/UserList.vue')
const Home = () => import('@/views/home/Home.vue')
const Centent = () => import('@/views/centent/Centent.vue')
const SiteInfo = () => import('@/views/site/SiteInfo.vue')
const Footer = () => import('@/views/site/Footer.vue')
const Focus = () => import('@/views/essay/Focus.vue')
const EssayList = () => import('@/views/essay/EssayList')
const Cate = () => import('@/views/essay/Cate.vue')
const EssayAdd = () => import('@/views/essay/EssayAdd')
const EditEssay = () => import('@/views/essay/EditEssay')
const Friend = () => import('@/views/about/Friend')
const Blog = () => import('@/views/about/Blog')


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
    path: '/home',
    component: Home,
  },
  {
    path: '/centent',
    component: Centent
  },
  {
    path: '/editessay/:id',
    component: EditEssay
  },
  {
    path: '/siteinfo',
    component: SiteInfo
  },
  {
    path: '/footer',
    component: Footer
  },
  {
    path: '/focus',
    component: Focus
  },
  {
    path: '/essay/list',
    component: EssayList
  },
  {
    path: '/categories',
    component: Cate
  },
  {
    path: '/essay',
    component: EssayAdd
  }, {
    path: '/friend',
    component: Friend
  }, {
    path: '/blog',
    component: Blog
  }
]

export default routes