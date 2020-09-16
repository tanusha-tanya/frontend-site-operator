const mutations = {
  START_GLOBAL_PRELOADER(state) {
    state.showloader = true
  },
  STOP_GLOBAL_PRELOADER(state) {
    state.showloader = false
  },
}

export default mutations
