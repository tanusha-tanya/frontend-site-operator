const actions = {
  startGlobalPreloader({ commit }) {
    commit('START_GLOBAL_PRELOADER')
  },
  stopGlobalPreloader({ commit }) {
    commit('STOP_GLOBAL_PRELOADER')
  },
}

export default actions
