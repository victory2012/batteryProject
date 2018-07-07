import Vue from "vue";
import VueI18n from "vue-i18n";
import Chinese from "./langs/cn";
import English from "./langs/en"
Vue.use(VueI18n);

export default new VueI18n({
  locale: 'CN',
  fallbackLocale: 'EN',
  messages: {
    CN: Chinese,
    EN: English
  }
})
