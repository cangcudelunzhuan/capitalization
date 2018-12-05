/**
 * Created by lina.zhang on 2018/7/30.
 */
import * as types from '../types'

const state = {
  pageType: 'contrast',
  groupName: 'NICK_NAME'
}

const actions = {
  pageType ({commit}, status) {
    commit(types.PAGETYPE, status)
  },
  groupName ({commit}, status) {
    commit(types.GROUPNAME, status)
  }
}

const getters = {
  pageType: state => state.pageType,
  groupName: state => state.groupName
}

const mutations = {
  [types.PAGETYPE] (state, status) {
    state.pageType = status
  },
  [types.GROUPNAME] (state, status) {
    state.groupName = status
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
