import 'babel-polyfill';
import promise from 'es6-promise';
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import jquery from 'jquery';
import router from './router';
import ElementUI from 'element-ui';
import i18n from './i18n';
import DatePicker from './components/datepicker/index';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import '../static/icon/iconfont.css';
import createStore from './store/store';

promise.polyfill();
Vue.use(Vuex);

Vue.prototype.$ = jquery;
Vue.use(DatePicker);
Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: 'small'
});
/* eslint-disable no-new */
const store = createStore();
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {
    App
  },
  template: '<App/>',
  mounted() {
    if (!sessionStorage.getItem('loginData')) {
      router.push('/login');
    }
  }
});
