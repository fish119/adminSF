import axios from 'axios'
import router from '../router/'
import NProgress from './utils'
import store from '../store/'
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://localhost:9999/';
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;

//TODO; http request 拦截器，设置header中的token，参数名为Authorization
axios.interceptors.request.use(
  config => {
    //发起请求时，取消掉当前正在进行的相同请求
    if (promiseArr[config.url]) {
      promiseArr[config.url]('操作取消')
      promiseArr[config.url] = cancel
    } else {
      promiseArr[config.url] = cancel
    }

    NProgress.start();
    if (window.localStorage.getItem("token")) {
      config.headers.Authorization = window.localStorage.getItem("token");
    }
    return config;
  },
  err => {
    NProgress.done();
    store.commit('showSnackbar', {
      msg: '网络异常，请稍后重试'
    })
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
        store.commit('showSnackbar', {
          msg: '请求的页面或地址不存在'
        });
        break;
      case 405:
        store.commit('showSnackbar', {
          msg: '权限不足，该方法不允许执行'
        });
        break;
      case 504:
        store.commit('showSnackbar', {
          msg: '请求的页面或地址不存在'
        });
        break;
      case 403:
        store.commit('showSnackbar', {
          msg: error.response.data.message
        });
        break;
      case 401:
        if (error.response.data.path === '/auth') {
          store.commit('showSnackbar', {
            msg: '用户名密码错误，请确认后重试'
          });
        } else {
          store.commit('showSnackbar', {
            msg: error.response.data.message
          });
          if (error.response.data.message === {
              msg: '认证超时，请重新登录。'
            }) {
            window.localStorage.removeItem('token');
            router.push('/login');
          }
        }
        break;
      case 500:
        store.commit('showSnackbar', {
          msg: error.response.data.message
        });
        break;
    }
    return Promise.resolve(error.response);
  } else {
    store.commit('showSnackbar', {
      msg: '网络异常，请稍后重试'
    });
    return Promise.resolve(error);
  }
  // return Promise.resolve(error);
});

export default {
  get(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  post(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  put(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url,
        data: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  delete(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url,
        data: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  }
}