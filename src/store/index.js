import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        NavShow: true,
        UserMessage: {}
    },
    mutations: {
        formateTime(time) {
            if (time) {
                var datetime = new Date(time);
                var year = datetime.getFullYear();
                var month = datetime.getMonth() + 1;
                var date = datetime.getDate();
                var hour = datetime.getHours() > 9 ? datetime.getHours() : '0' + datetime.getHours();
                var min = datetime.getMinutes() > 9 ? datetime.getMinutes() : '0' + datetime.getMinutes();
                return year + '/' + month + '/' + date + ' ' + hour + ':' + min;
            }
        },
        foramateDate(time) {
            console.log(time)
            if (time) {
                var datetime = new Date(time);
                var year = datetime.getFullYear();
                var month = datetime.getMonth() + 1;
                var date = datetime.getDate();
                return year + '/' + month + '/' + date;
            }
        }
    },
    actions: {},
    modules: {}
});
