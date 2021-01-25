// 登录
import Login from '../views/datacenter/login'
// 权限选项
import Select from '../views/datacenter/select'
// 数据中心的路由
import DataCenter from '../views/datacenter/datacenter'
import implementation from '../views/datacenter/implementation'
import History from '../views/datacenter/historyEvent'
import  ResStatistics from '../views/datacenter/resStatistics'
import  Statistics  from '../views/datacenter/statistics'
var router = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta:{
      title:'登录'
    }
  },
  {
    path: '/select',
    name: 'Select',
    component: Select,
    meta:{
      title:'权限选项'
    }
  },
  {
    path: '/datacenter',
    name: 'DataCenter',
    component: DataCenter,
    meta:{
      title:'订单查询'
    }
  },
  {
    path: '/implementation/:name',
    name: 'Implementation',
    component: implementation,
    meta: {
      title: '计划列表'
    }

  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: {
      title: '事件记录'
    }
  },
  {
    path: '/resStatistics',
    name: 'ResStatistics',
    component: ResStatistics,
    meta: {
      title: '产能分析'
    }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    meta: {
      title: '设备统计'
    }
  },
];
export default router;
