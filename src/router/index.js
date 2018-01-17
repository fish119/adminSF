import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import login from '@/pages/login'
import main from '@/pages/main'
import user from '@/pages/settings/user'
import menu from '@/pages/settings/menu'
import authority from '@/pages/settings/authority'


Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/',
    name: 'index',
    component: index,
    redirect: '/main',
    children: [{
      path: '/main',
      name: 'main',
      component: main
    }, {
      path: '/settings/user',
      name: '/settings/user',
      component: user
    }, {
      path: '/settings/menu',
      name: '/settings/menu',
      component: menu
    }, {
      path: '/settings/authority',
      name: '/settings/authority',
      component: authority
    }]
  }, {
    path: '/*',
    redirect: '/'
  }]
})
