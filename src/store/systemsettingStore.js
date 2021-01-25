export default {
  state: {
    systemDefaultActive:'',
    navTitle:''
  },
  mutations: {
    //设置路由的默认值
    setSystemDefaultActive(state,value){
      state.systemDefaultActive = value;
    },
    //设置路由的名称
    setNavTitle(state,value){
      state.navTitle = value;
    }
  }
}
