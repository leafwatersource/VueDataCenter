import Vue from 'vue'
import Router from 'vue-router'
import datacenterRouter from './datacenterRouter'
import systemsettingRouter from './systemsettingRouter'
Vue.use(Router);
export default new Router({
  mode: 'hash',
  routes: [
    ...datacenterRouter,
    ...systemsettingRouter
  ]
})
