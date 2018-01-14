import router from './../router/'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' //

NProgress.configure({
  showSpinner: false
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.path === '/login') {
    next();
  } else {
    if (window.localStorage.getItem('token')) {
      next();
    } else {
      next('login')
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default NProgress;
