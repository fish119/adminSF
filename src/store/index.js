import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isShowSnackbar: false,
    snackMsg:''
  },
  mutations: {
    showSnackbar(state,newMsg){
      state.snackMsg = newMsg?newMsg:'';
      state.isShowSnackbar = !state.isShowSnackbar
    }
  }
})

export default store