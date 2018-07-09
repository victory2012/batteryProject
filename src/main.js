// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import i18n from './i18n/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import '../static/icon/iconfont.css'
import locale from 'element-ui/lib/locale/lang/en'
import DatePicker from "./components/datepicker/index";
Vue.use(DatePicker);
Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: 'small',
  locale
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: {
    App
  },
  template: '<App/>'
});
