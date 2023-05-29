import { createStore } from 'vuex'
// 持久化
import createPersistedState from 'vuex-persistedstate'
export default createStore({
  state: {
    // 访问权限
    isGettterRouter: false,
    // menu展开事件
    isCollapsed: false
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
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({
    //决定谁持久化
    paths: ['isCollapsed']
  })]
})
