/**
 * Created by lina.zhang on 2018/7/30.
 */
import * as types from '../types'

const state = {
  salesQueryInfo: {}
}

const actions = {
  salesQueryInfo ({commit}, status) {
    commit(types.SALESQUERYINFO, status)
  }
}

const getters = {
  salesQueryInfo: state => state.salesQueryInfo
}

const mutations = {
  [types.SALESQUERYINFO] (state, status) {
    state.salesQueryInfo = status
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
