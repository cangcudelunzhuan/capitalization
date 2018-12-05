// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import store from './vuex/store'
import { sync } from 'vuex-router-sync'
// 导入国际化
import VueI18n from 'vue-i18n'
// 导入element的组件库
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css'
// 导入iconfont.css
import './assets/iconfont/iconfont.css'
import './assets/style/app.css'
import './assets/style/zhanglina.css'
import './assets/style/liuxinling.css'
import '@/assets/css/basic.css'
// 兼容ie浏览器
import 'babel-polyfill'
import '@/filters'
import { initCountly, countlyUserDetail } from '@/util/access'
Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(ElementUI)
Vue.use(Vuex)
sync(store, router)
// 切换语言直接修改locale的值即可
const i18n = new VueI18n({
  locale: 'CN',
  messages: {
    'EN': require('@/locales/EN.js'),
    'CN': require('@/locales/CN.js')
  }
})

router.beforeEach((to, from, next) => {
  let h =  window.innerHeight
  store.commit('CONTENTH', {contentH: h})
  if (to.meta.needLogin) {
    next({path: '/login'})
  } else {
    let userinfo = store.getters.userinfo
    if (userinfo) {
      initCountly()
      let info = {
        'name': userinfo.nickName,
        'username': userinfo.nameDisplay,
        'email': userinfo.email,
        'organization': userinfo.tenantOrgs[0].orgName,
        'phone': userinfo.phone,
        'picture': userinfo.job,
        'gender': userinfo.gender,
        'custom': {
          '工号': '#' + userinfo.empNo,
          '职位': userinfo.position,
          'userId': userinfo.userId
        }
      }
      countlyUserDetail(info)
    }
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  i18n,
  components: { App, i18n },
  template: '<App/>'
})
