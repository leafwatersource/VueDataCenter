import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import DataCenter from '../views/DataCenter.vue'
import History from '../views/History.vue'
import Implementation from '../views/Implementation.vue'
import Select from '../views/Select.vue'
import NotFound from '../views/NotFound.vue'
import Error from '../views/Error'
Vue.use(VueRouter);

const routes = [{
        path: '/',
        name: 'Login',
        meta: { navShow: false,title:'登录' },
        component: Login,
    },
    {
        path: '/Select',
        name: 'Select',
        component: Select,
        meta: {
            title:'功能选择'
        }
    },
    {
        path: '/DataCenter',
        name: 'DataCenter',
        component: DataCenter,
        meta: {
            title:'订单列表'
        }
    },
    {
        path: '/Implementation',
        name: 'Implementation',
        component: Implementation,
        meta: {
            title:'计划列表'
        }

    },
    {
        path: '/History',
        name: 'History',
        component: History,
        meta: {
            title:'历史数据'
        }
    },
    {
        path:'/Error',
        name:'Error',
        component:Error
    },
    {
        path: '*',
        name: 'NotFound',
        component: NotFound
    }

];

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    // if (to.name !== 'Login' && !store.state.LoginStatus) next({ name: 'Login' })
    // else next()
    next()
});

export default router
