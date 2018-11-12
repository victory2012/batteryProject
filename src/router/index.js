import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/home',
    component: resolve => require(['../layout/Home.vue'], resolve),
    meta: {
      title: '自述文件'
    },
    /* eslint-disable */
    children: [{
        path: '/position',
        name: 'position',
        component: resolve => require(['../views/position/position.vue'], resolve),
        meta: {
          title: '实时位置'
        }
      },
      {
        path: '/history',
        name: 'history',
        component: resolve => require(['../views/history/history.vue'], resolve),
        meta: {
          title: '历史轨迹'
        }
      },
      {
        path: '/alarmdata',
        name: 'alarmdata',
        component: resolve => require(['../views/alarm/alarmdata.vue'], resolve),
        meta: {
          title: '告警数据'
        }
      },
      {
        path: '/home',
        name: 'home',
        component: resolve => require(['../views/allBattery/batterys.vue'], resolve),
        meta: {
          title: '省份'
        }
      },
      {
        path: '/fence',
        name: "fence",
        component: resolve => require(['../views/fence/fence.vue'], resolve),
        meta: {
          title: '地理围栏'
        }
      },
      {
        path: '/user',
        component: resolve => require(['../views/user/user.vue'], resolve),
        meta: {
          title: '用户信息'
        }
      },
      {
        path: '/password',
        component: resolve => require(['../views/user/password.vue'], resolve),
        meta: {
          title: '修改密码'
        }
      },
      {
        path: '/abnormal',
        name: 'abnormal',
        component: resolve => require(['../views/abnormal/abnormal.vue'], resolve),
        meta: {
          title: '报警数据'
        }
      },
      {
        path: '/batteryList',
        name: 'batteryList',
        component: resolve => require(['../views/batteryList/batteryList.vue'], resolve),
        meta: {
          title: '电池列表'
        }
      }, {
        path: '/userManage',
        component: resolve => require(['../views/userManage/userManage.vue'], resolve),
        meta: {
          title: '用户管理'
        }
      }, {
        path: '/device',
        name: "device",
        component: resolve => require(['../views/device/device.vue'], resolve),
        meta: {
          title: '设备管理'
        }
      }, {
        path: '/googleAll',
        name: "googleAll",
        component: resolve => require(['../views/google/allBattery.vue'], resolve)
      }, {
        path: '/googlePos',
        name: "googlePos",
        component: resolve => require(['../views/google/googlePsition.vue'], resolve)
      }, {
        path: '/googleAbno',
        name: "googleAbno",
        component: resolve => require(['../views/google/googleAbno.vue'], resolve)
      }, {
        path: '/googleFence',
        name: "googleFence",
        component: resolve => require(['../views/google/googleFence.vue'], resolve)
      }, {
        path: '/googleHis',
        name: "googleHis",
        component: resolve => require(['../views/google/googleHistory.vue'], resolve)
      }, {
        path: '/policy',
        name: "policy",
        component: resolve => require(['../views/policy/index.vue'], resolve)
      }, {
        path: '/test',
        component: resolve => require(['../views/realPosition/index.vue'], resolve)
      }
    ]
  }, {
    path: '/login',
    component: resolve => require(['../views/Login/Login.vue'], resolve)
  }]
})
