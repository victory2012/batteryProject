<template>
  <div class="">
    <div class="sort-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item :label="$t('password.new')" prop="password">
          <el-input v-model="ruleForm.password" type="password" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">{{$t('password.changeBtn')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { changePassword } from "../../api/index.js";
import { onSuccess } from "../../utils/callback";

export default {
  name: "Password",
  data() {
    return {
      ruleForm: {
        password: ""
      },
      rules: {
        password: [
          {
            required: true,
            message: this.$t("password.placeholder"),
            trigger: "blur"
          },
          {
            min: 3,
            max: 16,
            message: this.$t("password.passwordLimit"),
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let userObj = {
            password: this.ruleForm.password
          };
          changePassword(userObj).then(res => {
            console.log(res);
            if (res.data.code === 0) {
              this.userMsgBox = false;
              this.ruleForm = {};
              onSuccess(`${this.$t("password.success")}`);
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.sort-content {
  font-size: 14px;
  margin: 0 auto;
  color: #484848;
  background: #ffffff;
  padding: 50px 0 20px 30px;
  border-radius: 5px;
  .tips {
    padding: 0 0 5px;
  }
  .gridInput {
    padding-bottom: 20px;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 40px;
  }
}
</style>
