import $http from "../util/http";

export default {
  state: {
    NavShow: false,
    UserMessage: {},
    ImplementationResGroup:[],//执行计划设备组
    ImplementationResView:[],//执行计划的设备组下的所有的设备
    CurImplementationResGroup:'',
    NavTitle:'订单查询',//菜单栏点击了哪一个
    switchVal:false,//换模计划按钮是否显示
  },
  mutations: {
    //设置用户的信息
    setUserMessage(state,value){
      state.UserMessage = value;
    },
    //设置设备组，当设备发生改变
    ChangeImplementationResGroup(state,value){
      state.ImplementationResGroup = value;
    },
    ChangeCurImplementationResGroup(state,value){
      state.CurImplementationResGroup = value;
    },
    ChangeNavShow(state,value){
      console.log(value);
      state.NavShow = value;
    },
    //修改点击后的菜单按钮
    ChangeNavTitle(state,value){
      state.NavTitle = value;
    },
    GetImplementationResView(state,value){
      state.CurImplementationResGroup = value;
    },
    //获取设备组的视图
    GetImplementationData(state) {
      $http({
        url: "ViewGroup"
      }).then(res => {
        if (res.status == 1) {
          res.groupList = JSON.parse(res.groupList);
        }
        state.ImplementationResGroup = res.groupList;
      });
    },
    setSwitchVal(state,val){
      state.switchVal = val;
    }
  },
  actions: {},
  modules: {}
}
