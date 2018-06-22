<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>电池后台管理系统</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" size="small" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" size="small" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item prop="checkBox">
            <el-checkbox style="float:left" v-model="account">记住账户</el-checkbox>
            <el-checkbox style="float:right" v-model="pwd">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" :loading="isLogin" class="submit_btn">登陆</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
// import { getAdminInfo } from "../../api/index.js";
// import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      account: false,
      pwd: false,
      isLogin: false,
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
  methods: {
    submitForm(params) {
      this.$refs[params].validate(valid => {
        if (valid) {
          this.$router.push('/home')
          // this.isLogin = true;
          // if (!this.loginForm.userName) {
          //   this.$notify.error({
          //     title: "错误",
          //     message: "请输入用户名",
          //     offset: 100
          //   });
          //   this.isLogin = false;
          //   // return;
          // }
          // if (!this.loginForm.password) {
          //   this.$notify.error({
          //     title: "错误",
          //     message: "请输入密码",
          //     offset: 100
          //   });
          //   this.isLogin = false;
          //   // return
          // }
          /* getAdminInfo(this.loginForm)
        .then(res => {
          this.isLogin = false;
          console.log(res);
          if (res.data.code === 0) {
            localStorage.setItem("loginData", JSON.stringify(res.data.data));
            localStorage.setItem("account", this.loginForm.userName);
            localStorage.setItem("password", this.loginForm.password);
            this.$router.push({
              path: "/battery"
            });
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
        }); */
        }
      });
    },
    checkBoxChange() {
      console.log(this.checkList);
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
  height: 100%;
  background-color: #324057;
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
  width: 320px;
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
