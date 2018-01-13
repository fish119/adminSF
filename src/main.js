import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import './utils/utils'
import store from './store'
import axios from './utils/request'
import 'babel-polyfill'  //IE11 & Safari 9 support

Vue.config.productionTip = false
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    "primary": "#00BCD4",
    "secondary": "#00ACC1",
    "accent": "#FF4081",
    "error": "#F44336",
    "warning": "#ffeb3b",
    "info": "#2196F3",
    "success": "#4CAF50"
  }
})

Vue.prototype.axios = axios;
Vue.prototype.store = store;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
