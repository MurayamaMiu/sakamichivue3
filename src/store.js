// store.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    showNavbar: true, // 初始为显示状态
  },
  mutations: {
    setShowNavbar(state, value) {
      state.showNavbar = value
    },
  },
  actions: {
    toggleNavbar({ commit }, value) {
      commit('setShowNavbar', value)
    },
  },
})
