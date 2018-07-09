import Vue from "vue";
import VueI18n from "vue-i18n";
import Chinese from "./langs/cn";
import English from "./langs/en"
// import enLocale from 'element-ui/lib/locale/lang/en'
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// import ElementLocale from 'element-ui/lib/locale'
Vue.use(VueI18n);

export default new VueI18n({
  locale: 'CN',
  fallbackLocale: 'EN',
  messages: {
    CN: Chinese,
    EN: English
  }
})
