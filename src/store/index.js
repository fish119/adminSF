import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isShowSnackbar: false,
    snackMsg: '',
    snackbarColor: 'error',
    menus: []
  },
  mutations: {
    showSnackbar(state, option) {
      if (option) {
        state.snackMsg = option.msg ? option.msg : '';
        state.snackbarColor = option.color ? option.color : 'error';
      }
      state.isShowSnackbar = !state.isShowSnackbar;
    },
    setSnackbarColor(state, color) {
      state.snackbarColor = color ? color : 'error';
    },
    setMenus(state, value) {
      state.menus = value;
    }
  }
})

export default store
