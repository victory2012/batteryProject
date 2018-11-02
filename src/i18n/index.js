import Vue from "vue";
import VueI18n from "vue-i18n";
import zh from './lang/LangZhCHS'
import en from './lang/LangEn'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'

Vue.use(VueI18n);

const messages = {
  zh: Object.assign(zh, zhLocale),
  en: Object.assign(en, enLocale)
}

const i18n = new VueI18n({
  // locale: 'zh',
  locale: sessionStorage.getItem('locale') || 'zh',
  // fallbackLocale: 'CN',
  messages
})
ElementLocale.i18n((key, value) => {
  return i18n.t(key, value)
})
export default i18n;
