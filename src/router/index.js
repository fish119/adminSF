import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import login from '@/pages/login'
import main from '@/pages/main'
import pagenotfound from '@/pages/404'
import users from '@/pages/settings/users'
import menus from '@/pages/settings/menus'
import authorities from '@/pages/settings/authorities'
import roles from '@/pages/settings/roles'
import departments from '@/pages/settings/departments'
import profile from '@/pages/profile/profile'
import dbmonitor from '@/pages/monitor/db'
import statemonitor from '@/pages/monitor/spa'
import loggings from '@/pages/monitor/loggings'
import article_category from '@/pages/article/category'
import article from '@/pages/article/article'


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
        path: '/404',
        name: '404',
        component: pagenotfound
      }, {
        path: '/settings/users',
        name: '/settings/users',
        component: users
      }, {
        path: '/settings/menus',
        name: '/settings/menus',
        component: menus
      }, {
        path: '/settings/authorities',
        name: '/settings/authorities',
        component: authorities
      }, {
        path: '/settings/roles',
        name: '/settings/roles',
        component: roles
      }, {
        path: '/settings/departments',
        name: '/settings/departments',
        component: departments
      }, {
        path: '/profile/profile',
        name: '/profile/profile',
        component: profile
      }, {
        path: '/monitor/dbmonitor',
        name: '/monitor/dbmonitor',
        component: dbmonitor
      },
      {
        path: '/monitor/loggings',
        name: '/monitor/loggings',
        component: loggings
      },
      {
        path: '/monitor/statemonitor',
        name: '/monitor/statemonitor',
        component: statemonitor
      },
      {
        path: '/article/category',
        name: '/article/category',
        component: article_category
      },
      {
        path: '/article/article',
        name: '/article/article',
        component: article
      }
    ]
  }, {
    path: '/*',
    redirect: '/404'
  }]
})
