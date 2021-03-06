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
    meta: { title: '自述文件' },
    children: [
      {
        path: '/position',
        name: 'position',
        component: resolve => require(['../views/position.vue'], resolve),
        meta: { title: '实时位置' }
      },
      {
        path: '/history',
        name: 'history',
        component: resolve => require(['../views/history.vue'], resolve),
        meta: { title: '历史轨迹' }
      },
      {
        path: '/alarmdata',
        name: 'alarmdata',
        component: resolve => require(['../views/alarmdata.vue'], resolve),
        meta: { title: '告警数据' }
      },
      {
        path: '/home',
        name: 'home',
        component: resolve => require(['../views/cityPage.vue'], resolve),
        meta: { title: '省份' }
      },
      {
        path: '/fence',
        name: "fence",
        component: resolve => require(['../views/fence.vue'], resolve),
        meta: { title: '地理围栏' }
      },
      {
        path: '/user',
        component: resolve => require(['../views/user.vue'], resolve),
        meta: { title: '用户信息' }
      },
      {
        path: '/password',
        component: resolve => require(['../views/password.vue'], resolve),
        meta: { title: '修改密码' }
      },
      {
        path: '/abnormal',
        name: 'abnormal',
        component: resolve => require(['../views/abnormal.vue'], resolve),
        meta: { title: '报警数据' }
      },
      {
        path: '/batteryList',
        name: 'batteryList',
        component: resolve => require(['../views/batteryList.vue'], resolve),
        meta: { title: '电池列表' }
      }, {
        path: '/userManage',
        component: resolve => require(['../views/userManage.vue'], resolve),
        meta: { title: '用户管理' }
      }, {
        path: '/device',
        name: "device",
        component: resolve => require(['../views/device.vue'], resolve),
        meta: { title: '设备管理' }
      }
    ]
  }, {
    path: '/login',
    component: resolve => require(['../views/Login.vue'], resolve)
  }]
})