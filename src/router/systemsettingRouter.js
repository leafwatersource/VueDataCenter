// 系统设置的路由
import datacenterConfig from '../views/systemsetting/index'
import implementationConfig from '../views/systemsetting/implementationConfig'
import historyEventConfig from '../views/systemsetting/historyEventConfig'
import userSetting from '../views/systemsetting/userSetting'
let routes = [
  {
    path:'/datacenterConfig',
    name:'datacenterConfig',
    component:datacenterConfig,
    meta:{
      title:'订单查询配置'
    }
  },
  {
    path:'/implementationConfig',
    name:'implementationConfig',
    component:implementationConfig,
    meta:{
      title:'执行计划配置'
    }
  },
  {
    path:'/historyEventConfig',
    name:'historyEventConfig',
    component:historyEventConfig,
    meta:{
      title:'事件记录配置'
    }
  },
  {
    path:'/userSetting',
    name:'userSetting',
    component:userSetting,
    meta:{
      title:"用户账号配置"
    }
  }
];
export default routes
