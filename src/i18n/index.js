import Vue from "vue";
import VueI18n from "vue-i18n";
import zh from './lang/LangZhCHS'
import en from './lang/LangEn'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale';

Vue.use(VueI18n);

const messages = {
  CN: Object.assign(zh, enLocale),
  EN: Object.assign(en, zhLocale)
}

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'CN',
  fallbackLocale: 'CN',
  messages
})
locale.i18n((key, value) => i18n.t(key, value)) // 为了实现element插件的多语言切换
export default i18n;
