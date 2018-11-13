<template>
  <div class="batterylist">
    <div class="headerBtn">
      <el-button size="medium"
        v-show="limeted"
        @click="doCreatBattery"
        type="primary">{{$t('batteryList.batteryAddBtn')}}
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
      <el-table v-loading="loading"
        :data="tableData"
        style="width: 100%"
        max-height="750">
        <el-table-column type="index"
          width="80"
          align="center"
          :label="$t('batteryList.serial')"></el-table-column>
        <el-table-column prop="batteryId"
          align="center"
          :label="$t('batteryList.batteryCode')">
        </el-table-column>
        <el-table-column prop="model"
          align="center"
          :label="$t('batteryList.model')">
        </el-table-column>
        <el-table-column prop="specification"
          align="center"
          :label="$t('batteryList.specif')">
        </el-table-column>
        <el-table-column prop="customerName"
          align="center"
          :label="$t('batteryList.customer')">
        </el-table-column>
        <el-table-column prop="deviceId"
          align="center"
          :label="$t('batteryList.deviceCode')">
        </el-table-column>
        <el-table-column prop="bindingName"
          align="center"
          :label="$t('batteryList.bindStatus')">
        </el-table-column>
        <el-table-column prop="online"
          align="center"
          :label="$t('batteryList.onlineStatus')">
        </el-table-column>
        <el-table-column align="center"
          :label="$t('batteryList.running')">
          <template slot-scope="scope">
            <el-button @click.native.prevent="examine(scope.$index, tableData)"
              type="text"
              :disabled="!tableData[scope.$index].OLS"
              size="small">
              {{$t('batteryList.view')}}
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
        <el-pagination @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="handleSizeData"
          :page-size="handleSize"
          layout="sizes, prev, pager, next"
          :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="$t('batteryList.batteryAddBtn')"
        :visible.sync="creatBattery"
        width="600px">
        <el-form :model="BatteryForm"
          :rules="BatteryRules"
          ref="BatteryForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('batteryList.enterprise')"
                prop="enterpriseName">
                <el-input v-model="BatteryForm.enterpriseName"
                  disabled
                  auto-complete="off"
                  :placeholder="$t('batteryList.warn.enterprise')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('batteryList.customerCom')"
                prop="customer">
                <el-select v-model="BatteryForm.customer"
                  style="width:238px">
                  <el-option v-for="item in customerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <!-- <el-input v-model="BatteryForm.customerId" auto-complete="off"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('batteryList.batteryNumber')"
                prop="batteryId">
                <el-input v-model.trim="BatteryForm.batteryId"
                  auto-complete="off"
                  :placeholder="$t('batteryList.batteryNumber')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('batteryList.model')"
                prop="model">
                <el-input v-model.trim="BatteryForm.model"
                  auto-complete="off"
                  :placeholder="$t('batteryList.warn.model')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('batteryList.specif')"
                prop="specification">
                <el-input v-model.trim="BatteryForm.specification"
                  auto-complete="off"
                  :placeholder="$t('batteryList.warn.specif')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('batteryList.deviceCode')"
                prop="deviceId">
                <el-select v-model="BatteryForm.deviceId"
                  style="width:238px">
                  <el-option v-for="item in deviceIdList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <!-- <el-input v-model="BatteryForm.deviceId" auto-complete="off" placeholder="请填设备编号"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('batteryList.createDate')"
                prop="createDate">
                <el-date-picker v-model="BatteryForm.createDate"
                  style="width:238px"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="formatCreatDate"
                  :placeholder="$t('batteryList.createDate')">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('batteryList.manufactureDate')"
                :error="manufactureDateError"
                prop="manufactureDate">
                <el-date-picker v-model="BatteryForm.manufactureDate"
                  style="width:238px"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('batteryList.manufactureDate')">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('batteryList.warrantyDate')"
                :error="warrantyDateError"
                prop="warrantyDate">
                <el-date-picker v-model="BatteryForm.warrantyDate"
                  style="width:238px"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('batteryList.warrantyDate')">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer"
          class="dialog-footer">
          <el-button @click="resetBatteryForm('BatteryForm')">{{$t('batteryList.cancel')}}</el-button>
          <el-button @click="regBattery('BatteryForm')"
            :loading="SureReg"
            type="primary">{{$t('batteryList.sure')}}</el-button>
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
import { onSuccess } from "../../utils/callback.js";
export default {
  data () {
    return {
      warrantyDateError: '',
      manufactureDateError: '',
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
          {
            required: true,
            message: this.$t("batteryList.warn.batteryCode"),
            trigger: "change"
          }
        ],
        model: [
          {
            required: true,
            message: this.$t("batteryList.warn.model"),
            trigger: "change"
          }
        ],
        specification: [
          {
            required: true,
            message: this.$t("batteryList.warn.specif"),
            trigger: "change"
          }
        ],
        manufactureDate: [
          {
            required: true,
            message: this.$t("batteryList.warn.manufactureDate"),
            trigger: "change"
          }
        ],
        createDate: [
          {
            required: true,
            message: this.$t("batteryList.warn.createDate"),
            trigger: "change"
          }
        ],
        warrantyDate: [
          {
            required: true,
            message: this.$t("batteryList.warn.warrantyDate"),
            trigger: "change"
          }
        ],
        deviceId: [
          {
            required: true,
            message: this.$t("batteryList.warn.deviceId"),
            trigger: "change"
          }
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
    limeted () {
      let loginData = JSON.parse(sessionStorage.getItem("loginData"));
      return loginData.userRole !== "plat_super_admin";
    }
  },
  mounted () {
    this.getData();
  },
  methods: {
    batteryReg () {
      this.regForm = true;
    },
    renew () {
      this.$router.push({
        path: "/blacklist"
      });
    },
    formatCreatDate (date) {
      this.CreatDatefirst = date;
    },
    doCreatBattery () {
      let loginData = JSON.parse(sessionStorage.getItem("loginData"));
      this.creatBattery = true;
      this.customerList = loginData.customer;
      this.BatteryForm.enterpriseName = loginData.enterpriseName;
      this.getDeviceListOnly();
      // this.getCustomerList();
    },
    getTime (date) {
      return new Date(date).getTime();
    },
    regBattery (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let loginData = JSON.parse(sessionStorage.getItem("loginData"));
          // if (loginData.customer.length > 0) {
          //   this.BatteryForm.customerId = loginData.customer.customerId;
          //   this.BatteryForm.customerName = loginData.customer.customerName;
          // }
          if (this.getTime(this.BatteryForm.manufactureDate) < this.getTime(this.BatteryForm.createDate)) {
            this.manufactureDateError = this.$t('batteryList.warn.CheckmanufactureDate')
            return
          }
          if (this.getTime(this.BatteryForm.warrantyDate) < this.getTime(this.BatteryForm.manufactureDate)) {
            this.warrantyDateError = this.$t('batteryList.warn.CheckWarrantyDate')
            return
          }
          this.BatteryForm.customerId = "";
          this.BatteryForm.customerName = "";
          this.BatteryForm.manufacturerName = loginData.enterpriseName;
          this.BatteryForm.manufacturerId = loginData.enterpriseId;
          console.log("BatteryForm", this.BatteryForm);
          addBattery(this.BatteryForm).then(res => {
            console.log(res);
            if (res.data.code === 0) {
              onSuccess(`${this.$t("batteryList.success")}`);
              this.creatBattery = false;
              this.resetBatteryForm(form);
              this.getData();
            }
          });
        }
      });
    },
    resetBatteryForm (form) {
      this.$refs[form].resetFields();
    },
    getDeviceListOnly () {
      deviceListOnly().then(res => {
        console.log(res);
        if (res.data.code === 0) {
          this.deviceIdList = res.data.data;
        }
      });
    },
    /* 获取电池列表数据 */
    getData () {
      let pageObj = {
        pageSize: this.handleSize,
        pageNum: this.currentPage
      };
      GetList(pageObj).then(res => {
        this.loading = false;
        console.log(res);
        let result = res.data;

        if (result.code === 0) {
          if (result.data.data) {
            let tableObj = result.data.data;
            this.totalPage = result.data.total;
            this.tableData = [];
            tableObj.forEach(key => {
              if (key.onlineStatus === 1) {
                key.online = this.$t("batteryList.online");
                key.OLS = true;
              } else {
                key.online = this.$t("batteryList.offline");
                key.OLS = false;
              }
              key.bindingName =
                key.bindingStatus === 0
                  ? this.$t("batteryList.noBind")
                  : this.$t("batteryList.hasBind");
              // key.online = key.onlineStatus === 1 ? "离线" : "在线";
              key.status = key.status === 0 ? false : true;
              this.tableData.push(key);
            });
          }
        }
      });
    },
    /*
    * 删除
    */
    deleteRow (index, tableData) {
      // console.log("index", index);
      console.log("data", tableData);
      this.loading = true;
      let params = {
        manufacturer: tableData[index].manufacturerId,
        customer: tableData[index].customerId,
        batteryId: tableData[index].batteryId
      };
      deleteBattery(params).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          onSuccess(`${this.$t("batteryList.delSuccess")}`);
          this.getData();
        }
      });
    },
    /*
     * 查看运行状态
     */
    examine (index, tableData) {
      let userData = JSON.parse(sessionStorage.getItem("loginData"));
      let deviceId = tableData[index];
      // this.$router.push({
      //   path: "googlePos",
      //   query: { deviceId: deviceId.deviceId }
      // });
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
    handleSizeChange (index) {
      // index为选中的页数
      this.handleSize = index;
      this.getData();
    },
    /*
    * 显示第几页
    */
    handleCurrentChange () {
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
