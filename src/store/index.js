import { createStore } from 'vuex'

export default createStore({
  state: {
    isGettterRouter: false
  },
  getters: {
  },
  mutations: {
    changeRouter(state, value) {
      state.isGettterRouter = value
    }
  },
  actions: {
  },
  modules: {
  }
})
