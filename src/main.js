// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css'
import http from './util/http'
import cookie from 'vue-cookie'
import store from './store'
import Fun from './util/publicFun'
Vue.use(Element);
Vue.prototype.$http=http;
Vue.prototype.$Fun=Fun;
Vue.prototype.$cookie = cookie; //配置时候prototype.$这里的名字自己定义不是固定是cookie
Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
