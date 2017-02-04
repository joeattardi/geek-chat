import Vuex from 'vuex';
import Vue from 'vue';

import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  state: {
    user: {
      fullName: ''
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },

    clearUser(state) {
      delete state.user;
    }
  }
});
