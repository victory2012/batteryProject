// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import Vuex from 'vuex'
import App from './App'
import jquery from 'jquery'
import router from './router'
import ElementUI from 'element-ui';
import DatePicker from "./components/datepicker/index";
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import '../static/icon/iconfont.css'
// import createStore from "./store/store"

// Vue.use(Vuex)
Vue.prototype.$ = jquery;
Vue.use(DatePicker);
Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: 'small'
});
/* eslint-disable no-new */

// const store = createStore()
new Vue({
  el: '#app',
  router,
  // store,
  components: {
    App
  },
  template: '<App/>'
});
