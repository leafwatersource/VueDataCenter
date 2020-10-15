import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import cookie from 'vue-cookie'
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';
import http from './util/http'
import Fun from './util/publicFun'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$http=http;
Vue.prototype.$Fun = Fun;
Vue.use(VXETable);
Vue.use(ElementUI);
Vue.prototype.$cookie = cookie; //配置时候prototype.$这里的名字自己定义不是固定是cookie
Vue.config.productionTip = false;
router.beforeEach((to,from,next)=>{
    if (to.meta.title){
        document.title = to.meta.title;
    }
    next();
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
