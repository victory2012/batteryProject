<template>
  <div class="login_page fillcontain">
    <div class="login-head">
      <el-dropdown class="user-name" @command="handleCommand">
          <span class="el-dropdown-link">
            {{localLanguge}}
            <i class="el-icon-caret-bottom"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="cn">
            <i class="iconfont icon-user"></i>中文</el-dropdown-item>
          <el-dropdown-item divided command="en">
            <i class="el-icon-setting"></i>English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>{{$t("projectName")}}</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" size="small" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <!-- <input type="text" placeholder="密码" v-model="loginForm.password" @keyup.enter="submitForm('loginForm')"> -->
            <el-input type="password" placeholder="密码" size="small" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-form-item prop="checkBox">
            <el-checkbox style="float:left" v-model="account">{{$t("account")}}</el-checkbox>
            <el-checkbox style="float:right" v-model="pwd">{{$t("password")}}</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" :loading="isLogin" class="submit_btn">{{$t("login")}}</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import { getAdminInfo } from "../api/index.js";
let currentLang;
export default {
  data() {
    return {
      account: false,
      pwd: false,
      isLogin: false,
      localLanguge: "",
      // projectName: "",
      loginForm: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      showLogin: false
    };
  },
  created() {
    currentLang = navigator.language; // 判断除IE外其他浏览器使用语言
    if (!currentLang) { // 判断IE浏览器使用语言
      currentLang = navigator.browserLanguage;
    }
    // 自动设置语言
    // const navLang = navigator.language;
    // const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
    // const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';
    this.localLanguge = currentLang === "zh-CN" ? "语言" : "languge";
    // // this.$i18n.locale = currentLang === "zh-CN" ? "CN" : "EN"
    // console.log(lang)
    // const locales = Locales;
    // const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
    // const mergeEN = Object.assign(enLocale, locales['en-US']);
    // Vue.locale = () => {};
    // const i18n = new VueI18n({
    //   locale: 'en-US',    // 语言标识
    //   messages: {
    //     'zh-CN': mergeZH,   // 中文语言包
    //     'en-US': mergeEN    // 英文语言包
    //   },
    // })
  },
  methods: {
    handleCommand(cammand) {
      if (cammand === "cn") {
        this.localLanguge = "中文";
        this.$i18n.locale = "CN";
      }
      if (cammand === "en") {
        this.localLanguge = "English";
        this.$i18n.locale = "EN";
      }
    },
    submitForm(params) {
      this.$refs[params].validate(valid => {
        if (valid) {
          this.isLogin = true;
          getAdminInfo(this.loginForm)
            .then(res => {
              this.isLogin = false;
              console.log(res);
              if (res.data.code === 0) {
                localStorage.setItem(
                  "loginData",
                  JSON.stringify(res.data.data)
                );
                localStorage.setItem("account", this.loginForm.userName);
                localStorage.setItem("password", this.loginForm.password);
                this.$router.push("/home");
              } else {
                this.$notify.error({
                  title: "错误",
                  message: "请输入正确的用户名密码",
                  offset: 100
                });
              }
            })
            .catch(error => {
              console.log(error);
              this.isLogin = false;
              this.$message.error("服务器请求超时，请稍后重试");
            });
        }
      });
    },
    init() {
      let account = localStorage.getItem("account");
      let pwd = localStorage.getItem("password");
      if (account) {
        this.loginForm.userName = account;
        this.pwd = true;
      }
      if (pwd) {
        this.loginForm.password = pwd;
        this.account = true;
      }
      setTimeout(() => {
        this.showLogin = true;
      }, 300);
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
// @import "../../style/mixin";
.login_page {
  position: relative;
  height: 100%;
  background-color: #324057;
  .login-head {
    position: absolute;
    height: 70px;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #242f42;
    color: #ffffff;
    line-height: 70px;
    text-align: right;
    padding-right: 70px;
  }
}
.el-dropdown {
  color: #ffffff;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.el-form-item__content {
  display: flex;
  justify-content: space-between;
}
.form_contianer {
  width: 350px;
  height: 190px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -95px;
  margin-left: -160px;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
