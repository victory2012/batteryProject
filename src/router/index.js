import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/home',
    component: resolve => require(['../components/common/Home.vue'], resolve),
    meta: { title: '自述文件' },
    children: [
      {
        path: '/home',
        component: resolve => require(['../components/page/battery.vue'], resolve),
        meta: { title: '电池总览' }
      },
      {
        path: '/position',
        component: resolve => require(['../components/page/position.vue'], resolve),
        meta: { title: '实时位置' }
      },
      {
        path: '/history',
        component: resolve => require(['../components/page/history.vue'], resolve),
        meta: { title: '历史轨迹' }
      },
      {
        path: '/alarmdata',
        component: resolve => require(['../components/page/alarmdata.vue'], resolve),
        meta: { title: '告警数据' }
      },
      {
        path: '/city',
        component: resolve => require(['../components/page/cityPage.vue'], resolve),
        meta: { title: '告警数据' }
      }
    ]
  }, {
    path: '/login',
    component: resolve => require(['../components/page/Login.vue'], resolve)
  }]
})