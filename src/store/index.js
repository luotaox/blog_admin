import { createStore } from 'vuex'
// 持久化
import createPersistedState from 'vuex-persistedstate'
export default createStore({
  state: {
    // 访问权限
    isGettterRouter: false,
    // menu展开事件
    isCollapsed: false,
    // 用户信息
    userInfo: {}
  },
  getters: {
  },
  mutations: {
    // 访问权限change事件
    changeRouter(state, value) {
      state.isGettterRouter = value
    },
    // menu事件
    changeCollapsed(state) {
      state.isCollapsed = !state.isCollapsed
    },
    // 监听用户信息变化事件
    changeUserInfo(state, value) {
      state.userInfo = {
        ...state.userInfo,
        ...value
      }
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({
    //决定谁持久化
    paths: ['isCollapsed', 'userInfo']
  })]
})
