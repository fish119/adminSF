import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import login from '@/pages/login'
import main from '@/pages/main'

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
    }]
  }, {
    path: '/*',
    redirect: '/'
  }]
})
