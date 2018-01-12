import axios from 'axios'
import NProgress from './utils'

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
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    NProgress.done();
    return response;
  },
  error => {
    NProgress.done();
    // if (error.response) {
    //   switch (error.response.status) {
    //     case 401:
    //       // 401 清除token信息并跳转到登录页面
    //       store.commit(types.LOGOUT);
    //       router.replace({
    //         path: 'login',
    //         query: {
    //           redirect: router.currentRoute.fullPath
    //         }
    //       })
    //   }
    // }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error)
  });

export default axios;
