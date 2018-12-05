import * as types from '../types'

const state = {
  pricesQueryInfo: {}
}

const actions = {
  pricesQueryInfo ({commit}, status) {
    commit(types.PRICESQUERYINFO, status)
  }
}

const getters = {
  pricesQueryInfo: state => state.pricesQueryInfo
}

const mutations = {
  [types.PRICESQUERYINFO] (state, status) {
    state.pricesQueryInfo = status
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
