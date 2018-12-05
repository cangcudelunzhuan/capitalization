import Vue from 'vue'
import Router from 'vue-router'
import salesIndex from '@/components/sales/index'
import prices from '@/components/prices/index'
import home from '@/components/home/index'
import table from '@/components/home/table'
import iframe from '@/components/home/iframe'
import hello from '@/components/home/hello'
Vue.use(Router)

const router = new Router({
  scrollBehavior: () => ({ // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
    y: 0
  }),
  routes: [
    {
      path: '/index',
      name: 'index',
      component: () => import('@/components/index')
    },
    {
      path: '/sales/index',
      name: 'sales',
      component: salesIndex
    }, {
      path: '/prices/index',
      name: 'prices',
      component: prices
    },
    {
      path: '/',
      name: 'home',
      component: home,
      redirect:'/home/index',
      children: [
        {
          path: '/home/index',
          name: 'hello',
          component: hello
        },
        {
          path: '/home/table/:id',
          name: 'table',
          component: table
        },
        {
          path: '/home/iframe',
          name: 'iframe',
          component: iframe,
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  switch (to.path) {
    case '/sales/index':
      document.title = '销量对比分析'
      break
    case '/sales/index2':
      document.title = '销量趋势分析'
      break
    case '/prices/index':
      document.title = '价格对比分析'
      break
    default:
      document.title = '分析'
      break
  }
  next()
})

export default router
