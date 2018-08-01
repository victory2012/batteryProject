<template>
  <div class="batterylist">
    <div class="headerBtn">
      <el-button size="medium" v-show="limeted" @click="doCreatBattery" type="primary">电池登记
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
      <el-table v-loading="loading" :data="tableData" style="width: 100%" max-height="750">
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column prop="batteryId" align="center" label="电池编号">
        </el-table-column>
        <el-table-column prop="model" align="center" label="电池型号">
        </el-table-column>
        <el-table-column prop="specification" align="center" label="电池组规格">
        </el-table-column>
        <el-table-column prop="customerName" align="center" label="客户企业名称">
        </el-table-column>
        <el-table-column prop="deviceId" align="center" label="监测设备编号">
        </el-table-column>
        <el-table-column prop="bindingName" align="center" label="绑定状态">
        </el-table-column>
        <el-table-column prop="online" align="center" label="在线状态">
        </el-table-column>
        <el-table-column align="center" label="运行状态">
          <template slot-scope="scope">
            <el-button @click.native.prevent="examine(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].OLS" size="small">
              查看
            </el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button @click.native.prevent="bind(scope.$index, tableData)" type="text" :disabled="tableData[scope.$index].bindingStatus" size="small">
            绑定
          </el-button>
          <el-button @click.native.prevent="unBind(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].bindingStatus" size="small">
            解绑
          </el-button>
          <el-button @click.native.prevent="addBlack(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].status" size="small">
            拉黑
          </el-button>
            <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
              删除
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="handleSizeData" :page-size="handleSize" layout="sizes, prev, pager, next" :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog title="电池登记" :visible.sync="creatBattery" width="600px">
        <el-form :model="BatteryForm" :rules="BatteryRules" ref="BatteryForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="生产商id" prop="enterpriseName">
                <el-input v-model="BatteryForm.enterpriseName" disabled auto-complete="off" placeholder="请填写生产商id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户id" prop="customer">
                <el-select v-model="BatteryForm.customer" style="width:238px">
                  <el-option v-for="item in customerList" :key="item" :label="item.customerName" :value="item">
                  </el-option>
                </el-select>
                <!-- <el-input v-model="BatteryForm.customerId" auto-complete="off"></el-input> -->
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
                <el-select v-model="BatteryForm.deviceId" style="width:238px">
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
                <el-date-picker v-model="BatteryForm.createDate" style="width:238px" type="date" value-format="yyyy-MM-dd" @change="formatCreatDate" placeholder="生产日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出厂日期" prop="manufactureDate">
                <el-date-picker v-model="BatteryForm.manufactureDate" style="width:238px" type="date" value-format="yyyy-MM-dd" placeholder="出厂日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="质保期" prop="warrantyDate">
                <el-date-picker v-model="BatteryForm.warrantyDate" style="width:238px" type="date" value-format="yyyy-MM-dd" placeholder="质保期">
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
import {
  addBattery,
  deviceListOnly,
  GetList,
  deleteBattery
} from "../../api/index.js";
import { onTimeOut, onError, onSuccess } from "../../utils/callback.js";
export default {
  data() {
    return {
      totalPage: 1, // 总数
      currentPage: 1, // 当前页
      handleSize: 10, // 每页显示条数
      handleSizeData: [10, 20, 30, 40, 50],
      tableData: [],
      loading: true,
      formLabelWidth: "120px",
      SureReg: false,
      BatteryForm: {},
      deviceIdList: [],
      deviceId: "",
      BatteryRules: {
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
      customerList: [],
      CreatDatefirst: "",
      value: ""
    };
  },
  computed: {
    limeted() {
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      return loginData.userRole !== "plat_super_admin";
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
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
    },
    doCreatBattery() {
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      this.creatBattery = true;
      this.customerList = loginData.customer;
      this.BatteryForm.enterpriseName = loginData.enterpriseName;
      this.getDeviceListOnly();
      // this.getCustomerList();
    },
    regBattery(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let loginData = JSON.parse(localStorage.getItem("loginData"));
          if (loginData.customer.length > 0) {
            this.BatteryForm.customerId = loginData.customer.customerId;
            this.BatteryForm.customerName = loginData.customer.customerName;
          }
          this.BatteryForm.customerId = "";
          this.BatteryForm.customerName = "";
          this.BatteryForm.manufacturerName = loginData.enterpriseName;
          this.BatteryForm.manufacturerId = loginData.enterpriseId;
          console.log(this.BatteryForm);
          addBattery(this.BatteryForm).then(res => {
            console.log(res);
            if (res.data.code === 0) {
              onSuccess("创建成功");
              this.creatBattery = false;
              this.resetBatteryForm(form);
              this.getData();
            } else {
              onError("创建失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    resetBatteryForm(form) {
      this.$refs[form].resetFields();
    },
    getDeviceListOnly() {
      deviceListOnly().then(res => {
        console.log(res);
        if (res.data.code === 0) {
          this.deviceIdList = res.data.data;
        }
      });
    },
    /* 获取电池列表数据 */
    getData() {
      let pageObj = {
        pageSize: this.handleSize,
        pageNum: this.currentPage
      };
      GetList(pageObj)
        .then(res => {
          this.loading = false;
          console.log(res);
          let result = res.data;
          if (result.code === 1) {
            onTimeOut(this.$router);
          }
          if (result.code === 0) {
            if (result.data.data) {
              let tableObj = result.data.data;
              this.totalPage = result.data.total;
              this.tableData = [];
              tableObj.forEach(key => {
                if (key.onlineStatus === 1) {
                  key.online = "在线";
                  key.OLS = true;
                } else {
                  key.online = "离线";
                  key.OLS = false;
                }
                key.bindingName = key.bindingStatus === 0 ? "未绑定" : "已绑定";
                // key.online = key.onlineStatus === 1 ? "离线" : "在线";
                key.status = key.status === 0 ? false : true;
                this.tableData.push(key);
              });
            }
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
          onError("服务器请求超时，请稍后重试");
        });
    },
    /*
    * 删除
    */
    deleteRow(index, tableData) {
      // console.log("index", index);
      console.log("data", tableData);
      this.loading = true;
      let params = {
        manufacturer: tableData[index].manufacturerId,
        customer: tableData[index].customerId,
        batteryId: tableData[index].batteryId
      };
      deleteBattery(params)
        .then(res => {
          this.loading = false;
          if (res.data.code === 1) {
            onTimeOut(this.$router);
          }
          if (res.data.code === 0) {
            onSuccess("删除成功");
            this.getData();
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
          onError("服务器请求超时，请稍后重试");
        });
    },
    /*
     * 查看运行状态
     */
    examine(index, tableData) {
      let userData = JSON.parse(localStorage.getItem("loginData"));
      let deviceId = tableData[index];
      if (userData.mapType === 0) {
        this.$router.push({
          path: "position",
          query: { deviceId: deviceId.deviceId }
        });
      }
      if (userData.mapType === 1) {
        this.$router.push({
          path: "googlePos",
          query: { deviceId: deviceId.deviceId }
        });
      }
    },
    /*
    * 改变每页显示的条数
    */
    handleSizeChange(index) {
      // index为选中的页数
      this.handleSize = index;
      this.getData();
    },
    /*
    * 显示第几页
    */
    handleCurrentChange() {
      this.getData();
    }
  }
};
</script>
<style scoped>
.block {
  text-align: right;
  padding-top: 20px;
}
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
