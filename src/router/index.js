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
        path: '/homea',
        component: resolve => require(['../views/battery.vue'], resolve),
        meta: { title: '电池总览' }
      },
      {
        path: '/position',
        component: resolve => require(['../views/position.vue'], resolve),
        meta: { title: '实时位置' }
      },
      {
        path: '/history',
        component: resolve => require(['../views/history.vue'], resolve),
        meta: { title: '历史轨迹' }
      },
      {
        path: '/alarmdata',
        component: resolve => require(['../views/alarmdata.vue'], resolve),
        meta: { title: '告警数据' }
      },
      {
        path: '/home',
        component: resolve => require(['../views/cityPage.vue'], resolve),
        meta: { title: '省份' }
      },
      {
        path: '/fence',
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
        meta: { title: '修改秘密' }
      }
    ]
  }, {
    path: '/login',
    component: resolve => require(['../views/Login.vue'], resolve)
  }]
})