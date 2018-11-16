<template>
  <div class="userMsg">
    <div class="editorBtn">
      <el-button type="primary"
        @click="doEditor"
        class="editorContent">{{$t('user.edit')}}</el-button>
    </div>
    <div class="center">
      <el-row type="flex"
        class="row-bg"
        justify="space-around">
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <p class="tips">{{$t('user.userName')}}</p>
              <p class="gridInput">{{userArr.userName}}</p>
              <!-- <el-input v-model="userArr.userName" disabled class="gridInput"></el-input> -->
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <p class="tips">{{$t('user.userRole')}}</p>
              <p class="gridInput">{{userArr.userRole}}</p>
              <!-- <el-input v-model="userArr.userRole" disabled class="gridInput"></el-input> -->
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <p class="tips">{{$t('user.enterpriseRole')}}</p>
              <p class="gridInput">{{userArr.enterpriseRole}}</p>
              <!-- <el-input v-model="userArr.enterpriseRole" disabled class="gridInput"></el-input> -->
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row type="flex"
        class="row-bg"
        justify="space-around">
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <p class="tips">{{$t('user.enterpriseName')}}</p>
              <p class="gridInput">{{userArr.enterpriseName}}</p>
              <!-- <el-input v-model="userArr.enterpriseName" disabled class="gridInput"></el-input> -->
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <p class="tips">{{$t('user.phone')}}</p>
              <p class="gridInput">{{userArr.phoneNumber}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="sort-content">
              <p class="tips">{{$t('user.email')}}</p>
              <p class="gridInput">{{userArr.email}}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <transition name="el-fade-in-linear">
        <div v-show="userMsgBox"
          class="transition-box">
          <div class="box">
            <div class="box-head">
              <h3>{{$t('user.userInfo')}}</h3>
              <i @click="closeMsgBox('ruleForm')"
                class="el-icon-close"></i>
            </div>
            <div class="formWarrp">
              <el-form :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="210px"
                class="demo-ruleForm">

                <el-form-item :label="$t('user.phone')"
                  prop="phoneNum">
                  <el-input v-model="ruleForm.phoneNum"
                    type="tel"
                    style="width:200px;"></el-input>
                </el-form-item>
                <!-- <el-form-item label="用户名" prop="userName">
                  <el-input v-model="ruleForm.userName" style="width:200px;"></el-input>
                </el-form-item> -->
                <el-form-item :label="$t('user.email')"
                  prop="email">
                  <el-input v-model.trim="ruleForm.email"
                    style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"
                    @click="submitForm('ruleForm')">{{$t('user.save')}}</el-button>
                  <el-button @click="resetForm('ruleForm')">{{$t('user.cancel')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { getUserInfo, changeUserInfo } from "../../api/index.js";
import { onSuccess } from "../../utils/callback";
export default {
  data () {
    return {
      userMsgBox: false,
      userArr: [],
      ruleForm: {},
      emailsError: '',
      email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      rules: {
        email: [
          { required: false, message: this.$t("user.nameErr"), trigger: "blur" },
          { type: 'email', message: this.$t('useMsg.warn.emailCheck'), trigger: ['blur', 'change'] }
        ],
        phoneNum: [
          {
            required: true,
            message: this.$t("user.phoneErr"),
            trigger: "change"
          },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: this.$t("user.phoneCheck"),
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    getData () {
      getUserInfo().then(res => {
        console.log(res.data);
        if (res.data.code === 0) {
          let result = res.data.data;
          this.userArr = result;
          this.userArr.userRole = this.userRole(result.userRole);
          this.userArr.enterpriseRole = this.companyRole(result.enterpriseRole);
        }
      });
    },
    companyRole (str) {
      switch (str) {
        case "platform":
          return `${this.$t("platform")}`;
        case "manufacturer":
          return `${this.$t("manufacturer")}`;
        case "customer":
          return `${this.$t("customer")}`;
        default:
          return "";
      }
    },
    userRole (str) {
      switch (str) {
        case "plat_super_admin":
          return this.$t("useMsg.superAdministrator");
        case "super_admin":
          return this.$t("useMsg.superAdministrator");
        case "admin":
          return this.$t("useMsg.administrator");
        case "customer_super_admin":
          return this.$t("useMsg.administrator");
        case "manufacturer_super_admin":
          return this.$t("useMsg.administrator");
        default:
          return "";
      }
    },
    doEditor () {
      this.userMsgBox = true;
    },
    closeMsgBox (formName) {
      this.userMsgBox = false;
      this.ruleForm = {};
      this.$refs[formName].resetFields();
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.ruleForm.email && !this.email.test(this.ruleForm.email)) {
          //   this.emailsError = this.$t('useMsg.warn.emailCheck'); // "邮箱格式有误";
          //   return;
          // }
          let userObj = {
            email: this.ruleForm.email,
            phoneNumber: this.ruleForm.phoneNum
          };
          changeUserInfo(userObj).then(res => {
            console.log(res);
            if (res.data.code === 0) {
              this.userMsgBox = false;
              this.ruleForm = {};
              onSuccess(`${this.$t("user.seccess")}`);
              this.getData();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted () {
    this.getData();
  }
};
</script>
<style lang="less" scoped>
.userMsg {
  padding: 20px 20px 30px;
  border-radius: 5px;
  background: #ffffff;
}
.transition-box {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 89;
}
.center {
  padding: 10px 0 30px;
}
.sort-content {
  width: 200px;
  margin: 0 auto;
}
.tips {
  color: #484848;
  font-size: 14px;
}
.editorBtn {
  text-align: right;
}
.gridInput {
  background-color: #f2f2f2;
  color: #484848;
  width: 200px;
  height: 32px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 32px;
  text-indent: 8px;
  cursor: not-allowed;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.box {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 600px;
  height: auto;
  padding-bottom: 5px;
  border-radius: 4px;
  background-color: #ffffff;
  transform: translate(-50%, -50%);
  z-index: 98;
}
.box-head {
  overflow: hidden;
  line-height: 40px;
  height: 40px;
  border-bottom: 1px solid #cccccc;
}
.box-head h3 {
  float: left;
  margin-left: 11px;
  color: #606266;
  font-weight: 400;
  font-size: 16px;
}
.box-head i {
  float: right;
  display: block;
  font-size: 18px;
  margin-top: 11px;
  margin-right: 11px;
  cursor: pointer;
}
.formWarrp {
  padding-top: 30px;
}
.el-form-item--small.el-form-item {
  margin-bottom: 30px;
}
</style>
