<template>
  <div class="batterylist">
    <div class="headerBtn">
      <el-button size="medium" @click="doCreatBattery" type="primary">电池登记
        <i class="el-icon-circle-plus-outline"></i>
      </el-button>
      <!-- <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" multiple :on-exceed="handleExceed">
        <el-button size="medium" type="primary">点击上传
          <i class="el-icon-upload "></i>
        </el-button>
      </el-upload>
      <el-button size="medium" @click="renew" type="primary">恢复拉黑设备
        <i class="el-icon-refresh "></i>
      </el-button> -->
      <!-- <el-input placeholder="请输入内容" v-model="input10" size="medium" style="width:10%;margin-left:10px;" clearable></el-input>
      <el-select v-model="value" placeholder="电池型号" style="margin-left:10px;width:10%;">
        <el-option v-for="item in options" size="medium" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value" placeholder="客户企业名称" style="margin-left:10px;width:10%;">
        <el-option v-for="item in options" size="medium" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value" placeholder="绑定状态" style="margin-left:10px;width:10%;">
        <el-option v-for="item in options" :key="item.value" :label="item.label" size="medium" :value="item.value">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" style="width:74px;" :loading="search">查询</el-button>
      <el-button size="small">清空</el-button> -->
    </div>
    <div class="table">
      <table-list></table-list>
    </div>
    <div>
      <el-dialog title="电池登记" :visible.sync="creatBattery" width="600px">
        <el-form :model="BatteryForm" :rules="BatteryRules" ref="BatteryForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="生产商id" prop="manufacturerId">
                <el-input v-model="BatteryForm.manufacturerId" disabled auto-complete="off" placeholder="请填写生产商id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户id" prop="customerId">
                <el-input v-model="BatteryForm.customerId" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="电池id" prop="batteryId">
                <el-input v-model="BatteryForm.batteryId" auto-complete="off" placeholder="请填写电池id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="型号" prop="model">
                <el-input v-model="BatteryForm.model" auto-complete="off" placeholder="请填写型号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="规格" prop="specification">
                <el-input v-model="BatteryForm.specification" auto-complete="off" placeholder="请填规格"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编号" prop="deviceId">
                <el-select v-model="BatteryForm.deviceId">
                  <el-option v-for="item in deviceIdList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
                <!-- <el-input v-model="BatteryForm.deviceId" auto-complete="off" placeholder="请填设备编号"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="生产日期" prop="createDate">
                <el-date-picker v-model="BatteryForm.createDate" type="date" value-format="yyyy-MM-dd" @change="formatCreatDate" placeholder="生产日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出厂日期" prop="manufactureDate">
                <el-date-picker v-model="BatteryForm.manufactureDate" type="date" value-format="yyyy-MM-dd" placeholder="出厂日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="质保期" prop="warrantyDate">
                <el-date-picker v-model="BatteryForm.warrantyDate" type="date" value-format="yyyy-MM-dd" placeholder="质保期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetBatteryForm('BatteryForm')">取 消</el-button>
          <el-button @click="regBattery('BatteryForm')" :loading="SureReg" type="primary">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import TableList from "../components/battery/batteryTable";
import { addBattery, deviceListOnly } from "../api/index.js";
export default {
  components: {
    "table-list": TableList
  },
  name: "BatteryList",
  data() {
    return {
      formLabelWidth: "120px",
      SureReg: false,
      BatteryForm: {},
      deviceIdList: [],
      deviceId: "",
      BatteryRules: {
        manufacturerId: [{ required: true, message: "生产商id不能为空" }],
        batteryId: [
          { required: true, message: "请输入电池id", trigger: "blur" }
        ],
        model: [{ required: true, message: "请输入型号", trigger: "blur" }],
        specification: [
          { required: true, message: "请输入规格", trigger: "blur" }
        ],
        manufactureDate: [
          { required: true, message: "请输入出厂日期", trigger: "change" }
        ],
        createDate: [
          { required: true, message: "请输入生产日期", trigger: "change" }
        ],
        warrantyDate: [
          { required: true, message: "请输入质保期", trigger: "change" }
        ],
        deviceId: [
          { required: true, message: "请选择设备编号", trigger: "change" }
        ]
      },
      regForm: false,
      search: false,
      input10: "",
      creatBattery: false,
      form: {},
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      CreatDatefirst: "",
      value: ""
    };
  },
  mounted() {
    this.getDeviceListOnly();
  },
  methods: {
    handleExceed(files, fileList) {
      console.log(files);
    },
    batteryReg() {
      this.regForm = true;
    },
    renew() {
      this.$router.push({
        path: "/blacklist"
      });
    },
    formatCreatDate(date) {
      this.CreatDatefirst = date;
      console.log(this.BatteryForm.createDate);
    },
    doCreatBattery() {
      this.creatBattery = true;
      this.BatteryForm.manufacturerId = JSON.parse(
        localStorage.getItem("loginData")
      ).enterpriseId;
    },
    regBattery(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log(this.BatteryForm);
          addBattery(this.BatteryForm)
            .then(res => {
              console.log(res);
              if (res.data.code === 0) {
                this.$message({
                  message: "创建成功",
                  type: "success"
                });
              }
            })
            .catch();
        } else {
          console.log("error submit!!");
          return false;
          // addBattery();
        }
      });
    },
    resetBatteryForm(form) {
      this.$refs[form].resetFields();
    },
    getDeviceListOnly() {
      deviceListOnly()
        .then(res => {
          console.log(res);
          if (res.data.code === 0) {
            this.deviceIdList = res.data.data;
          }
        })
        .catch();
    }
  }
};
</script>
<style scoped>
.el-form {
  padding: 0 20px;
}
.batterylist {
  box-sizing: border-box;
  width: 100%;
  background: #ffffff;
  border-radius: 5px;
  padding: 10px 15px;
}
.flex {
  display: flex;
  justify-content: space-between;
}
.table {
  padding-top: 30px;
}
</style>
