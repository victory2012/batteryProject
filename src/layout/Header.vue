<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">{{$t('loginMsg.subProjectName')}}</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <!-- <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div> -->
        <!-- 用户头像 -->
        <div class="user-avator"><img src="static/img/user.jpg"></div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu class="dropdown" slot="dropdown">
            <el-dropdown-item command="userMsg">
              <i class="iconfont icons icon-user"></i>{{$t('userInfo.userMsg')}}</el-dropdown-item>
            <el-dropdown-item divided command="userPwd">
              <i class="icons el-icon-setting"></i>{{$t('userInfo.pasword')}}</el-dropdown-item>
            <el-dropdown-item divided command="loginout">
              <i class="iconfont icons icon-logout"></i>{{$t('userInfo.logOut')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from "../utils/bus";
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      projectTit: "后台管理系统"
    };
  },
  computed: {
    username() {
      let userData = JSON.parse(sessionStorage.getItem("loginData"));
      return userData ? `${userData.enterpriseName}-${userData.userName}` : "";
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      console.log(command);
      if (command === "loginout") {
        sessionStorage.removeItem("loginData");
        this.$router.push("/login");
      }
      if (command === "userMsg") {
        this.$router.push("/user");
      }
      if (command === "userPwd") {
        this.$router.push("/password");
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  },
  mounted() {
    if (document.body.clientWidth < 1400) {
      this.collapseChage();
    }
  }
};
</script>
<style scoped>
.dropdown {
  width: 160px;
  text-align: left;
}
.dropdown .icons {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 350px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
</style>
