<template>
  <div class="">
    <div class="sort-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
        <el-form-item :label="$t('policy.title')" prop="voltage">
          <el-input v-model="ruleForm.voltage" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">{{$t('policy.btns')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { updatePolicy, getPolicy } from "@/api/index.js";
import { onSuccess } from "@/utils/callback";

export default {
  name: "Password",
  data() {
    return {
      ruleForm: {},
      rules: {
        voltage: [
          {
            required: true,
            message: this.$t("policy.placeholder"),
            trigger: "change"
          },
          {
            pattern: /^[0-9]*$/,
            message: this.$t("policy.voltageCheck"),
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.getTemp();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let userObj = {
            voltage: this.ruleForm.voltage
          };
          updatePolicy(userObj).then(res => {
            console.log(res);
            if (res.data && res.data.code === 0) {
              // this.ruleForm = {};
              onSuccess(`${this.$t("policy.success")}`);
              this.getTemp();
            }
          });
        }
      });
    },
    getTemp() {
      getPolicy().then(res => {
        console.log(res);
        let result = res.data;
        if (result && result.code === 0) {
          if (result.data) {
            this.$set(this.ruleForm, "voltage", Number(result.data.voltage));
            // this.ruleForm.voltage = result.data.voltage;
          }
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
