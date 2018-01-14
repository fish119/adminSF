import axios from 'axios'
import router from '../router/'
import NProgress from './utils'
import store from '../store/'
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://localhost:9999/';
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'

//TODO; http request 拦截器，设置header中的token，参数名为Authorization
axios.interceptors.request.use(
  config => {
    NProgress.start();
    if (window.localStorage.getItem("token")) {
      config.headers.Authorization = window.localStorage.getItem("token");
    }
    return config;
  },
  err => {
    NProgress.done();
    store.commit('showSnackbar', '网络异常，请稍后重试')
    return Promise.reject(err);
  });

// http response 拦截器

axios.interceptors.response.use(data => {
  NProgress.done();
  return data;
}, error => {
  NProgress.done();
  if (error.response) {
    switch (error.response.status) {
      case 404:
        store.commit('showSnackbar', '请求的页面或地址不存在');
        break;
      case 504:
        store.commit('showSnackbar', '请求的页面或地址不存在');
        break;
      case 403:
        store.commit('showSnackbar', error.response.data.message);
        break;
      case 401:
        if (error.response.data.path === '/auth') {
          store.commit('showSnackbar', '用户名密码错误，请确认后重试');
        } else {
          store.commit('showSnackbar', error.response.data.message);
          if( error.response.data.message === '认证超时，请重新登录。'){
            window.localStorage.removeItem('token');
            router.push('/login');
          }
        }
        break;
      case 500:
        console.log(error.response);
        store.commit('showSnackbar', error.response.data.message);
        break;
    }
    return Promise.resolve(error.response);
  } else {
    store.commit('showSnackbar', '网络异常，请稍后重试');
    return Promise.resolve(error);
  }
  // return Promise.resolve(error);
});

export default axios;
