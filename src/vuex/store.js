/**
 * Created by JianBo.Wang on 2017/7/12.
 */
import Vue from 'vue'
import Vuex from 'vuex'

import msg from './modules/msg'
import sales from './modules/sales'
import prices from './modules/prices'
import publics from './public'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    msg,
    sales,
    prices,
    publics
  }
})
