<template>
  <div class="login_page fillcontain">
    <div class="login-head">
      <el-dropdown class="user-name"
        trigger="click"
        @command="handleCommand">
        <span class="el-dropdown-link">
          {{localLanguge}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">
            <i class="iconfont icon-user"></i>中文</el-dropdown-item>
          <el-dropdown-item divided
            command="en">
            <i class="el-icon-setting"></i>English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <transition name="form-fade"
      mode="in-out">
      <section class="form_contianer"
        v-show="showLogin">
        <div class="manage_tip">
          <p>{{$t("loginMsg.projectName")}}</p>
        </div>
        <el-form :model="loginForm"
          :rules="rules"
          ref="loginForm">
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName"
              size="small"
              :placeholder="$t('loginMsg.accountPlace')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password"
              :placeholder="$t('loginMsg.passwordPlace')"
              size="small"
              v-model="loginForm.password"
              @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-form-item prop="checkBox">
            <el-checkbox style="float:left"
              v-model="account">{{$t("loginMsg.RMaccount")}}</el-checkbox>
            <el-checkbox style="float:right"
              v-model="pwd">{{$t("loginMsg.RMpassword")}}</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              @click="submitForm('loginForm')"
              :loading="isLogin"
              class="submit_btn">{{$t("loginMsg.loginBtn")}}</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import { getAdminInfo } from "../../api/index.js";
export default {
  data () {
    return {
      account: false,
      pwd: false,
      localLanguge: "",
      isLogin: false,
      loginForm: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          {
            required: true,
            message: this.$t("loginMsg.userNameMsg"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("loginMsg.password"),
            trigger: "blur"
          }
        ]
      },
      showLogin: false
    };
  },
  methods: {
    handleCommand (cammand) {
      if (cammand === "zh") {
        this.localLanguge = "中文";
        this.$i18n.locale = "zh";
        sessionStorage.setItem("locale", "zh");
      }
      if (cammand === "en") {
        this.localLanguge = "English";
        this.$i18n.locale = "en";
        sessionStorage.setItem("locale", "en");
      }
      this.rules = {
        userName: [
          {
            required: true,
            message: this.$t("loginMsg.userNameMsg"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("loginMsg.password"),
            trigger: "blur"
          }
        ]
      };
    },
    submitForm (params) {
      // this.$i18n.locale = "en";
      this.$refs[params].validate(valid => {
        if (valid) {
          this.isLogin = true;
          getAdminInfo(this.loginForm).then(res => {
            this.isLogin = false;
            console.log(res);
            if (res.data && res.data.code === 0) {
              sessionStorage.setItem(
                "loginData",
                JSON.stringify(res.data.data)
              );
              this.$store.commit(
                "SET_USER_DATA",
                JSON.stringify(res.data.data)
              );
              this.$store.commit("SET_MAP_TYPE", res.data.data.mapType);
              sessionStorage.setItem("mapType", res.data.data.mapType);
              if (this.account) {
                localStorage.setItem("account", this.loginForm.userName);
              }
              if (this.pwd) {
                localStorage.setItem("password", this.loginForm.password);
              }

              this.$router.push("/home");
            }
          });
        }
      });
    },
    changLocalLang () {
      if (this.langs === "en") {
        this.$i18n.locale = "zh";
      } else {
        this.$i18n.locale = "en";
      }
    },
    init () {
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
  created () {
    let locallanguage = sessionStorage.getItem("locale");
    if (locallanguage) {
      this.localLanguge = locallanguage === "zh" ? "中文" : "English";
    } else {
      let currentLang = navigator.language; // 判断除IE外其他浏览器使用语言
      if (!currentLang) {
        // 判断浏览器使用语言
        currentLang = navigator.browserLanguage;
      }
      if (currentLang === "zh-CN") {
        this.localLanguge = "中文";
        sessionStorage.setItem("locale", "zh");
        this.$i18n.locale = "zh";
      } else {
        this.localLanguge = "English";
        sessionStorage.setItem("locale", "en");
        this.$i18n.locale = "en";
      }
    }
  },
  mounted () {
    console.log(this.$i18n.locale);
    this.init();
  }
};
</script>

<style lang="less" scoped>
// @import "../../style/mixin";
.el-dropdown-link {
  cursor: pointer;
}
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
    .user-name {
      margin-right: 50px;
    }
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
  width: 380px;
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
