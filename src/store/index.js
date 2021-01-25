import Vue from 'vue'
import Vuex from 'vuex'
import  systemsettingStore from './systemsettingStore'
import datacenterStore from './datacenterStore'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {
  },
  actions: {},
  modules: {
    systemsettingStore,
    datacenterStore
  }
});
