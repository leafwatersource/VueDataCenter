import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        NavShow: true,
        UserMessage: {},
        ImplementationResGroup:[],//执行计划设备组
        ImplementationResView:[],//执行计划的设备组下的所有的设备
        CurImplementationResGroup:''
    },
    mutations: {
        //设置设备组，当设备发生改变
        ChangeImplementationResGroup(state,value){
            state.ImplementationResGroup = value;
        },
        ChangeCurImplementationResGroup(state,value){
            state.CurImplementationResGroup = value;
        }
    },
    actions: {},
    modules: {}
});
