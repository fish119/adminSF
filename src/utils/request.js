import axios from 'axios'
import NProgress from './utils'
import store from '../store/'
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://localhost:9999/';

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
    return Promise.resolve(err);
  });

// http response 拦截器

axios.interceptors.response.use(data => {
  NProgress.done();
  return data;
}, error => {
  NProgress.done();
  console.log(error.response.data.path)
  if (error.response) {
    switch (error.response.status) {
      case 404:
        store.commit('showSnackbar', '请求的页面或地址不存在');
        break;
      case 504:
        store.commit('showSnackbar', '请求的页面或地址不存在');
        break;
      case 403:
        store.commit('showSnackbar', '权限不足，请联系管理员');
        break;
      case 401:
        if (error.response.data.path === '/auth') {
          store.commit('showSnackbar', '用户名密码错误，请确认后重试');
        } else {
          store.commit('showSnackbar', '权限不足，请联系管理员');
        }
        break;
    }
  } else {
    store.commit('showSnackbar', '网络异常，请稍后重试');
  }
  // return Promise.resolve(error);
  return Promise.resolve(error);
});

export default axios;
