<template>
  <div class="batterylist">
    <div class="headerBtn flex">
      <el-button size="medium" @click="addBox=true" type="primary">设备注册
        <i class="el-icon-circle-plus-outline"></i>
      </el-button>
      <!-- <el-input placeholder="设备编号" v-model="input10" style="width:10%;margin-left:10px;height:32px;" clearable></el-input>
      <el-select v-model="value" placeholder="注册状态" style="margin-left:10px;width:10%;">
        <el-option v-for="item in options" size="medium" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value" placeholder="绑定状态" style="margin-left:10px;width:10%;">
        <el-option v-for="item in options" size="medium" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div>
        <el-button size="small" type="primary" style="width:74px;" :loading="search">查询</el-button>
        <el-button size="small">清空</el-button>
      </div> -->
    </div>
    <div class="table">
      <el-table v-loading="loading" :data="tableData" style="width: 100%" max-height="750">
        <el-table-column prop="deviceId" align="center" label="设备编号">
        </el-table-column>
        <el-table-column prop="manufacturerName" align="center" label="企业名称">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="bindingName" align="center" label="电池绑定状态">
        </el-table-column>
        <el-table-column align="center" label="监测设备">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].bindingStatus" size="small">
              查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button @click.native.prevent="addBlack(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].status" size="small">
              拉黑
            </el-button> -->
            <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
              删除
            </el-button>
            <!-- <el-button @click.native.prevent="unBind(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].bindingStatus" size="small">
              设备升级
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="handleSizeData" :page-size="handleSize" layout="sizes, prev, pager, next" :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <div>
      <transition name="el-fade-in-linear">
        <div v-show="addBox" class="transition-box">
          <div class="box">
            <div class="box-head">
              <h3>设备注册</h3>
              <i @click="closeBox" class="el-icon-close"></i>
            </div>
            <div class="formWarrp">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
                <el-form-item label="设备编号" prop="deviceId">
                  <el-input v-model="ruleForm.deviceId" style="width:200px;" placeholder="设备编号"></el-input>
                </el-form-item>
                <el-form-item label="生产商id" prop="manufacturerId">
                  <el-select v-model="ruleForm.manufacturerId" placeholder="生产商id" style="width:200px;">
                    <el-option v-for="item in manufacturerOptions" :key="item.id" :label="item.name" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="客户id" prop="customerId">
                  <el-select v-model="ruleForm.customerId" placeholder="客户id" style="width:200px;">
                    <el-option v-for="item in customerOptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
                  <el-button @click="resetForm('ruleForm')">取消</el-button>
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
import {
  deviceList,
  createDeviceList,
  enterpriseList,
  enterpriseCustomer
} from "../api/index.js";
import { timeFormats } from "../utils/transition.js";
export default {
  data() {
    return {
      addBox: false,
      formLabelWidth: "120px",
      regForm: false,
      tableData: [],
      totalPage: 1, // 总页数
      currentPage: 1, // 当前页
      handleSize: 10, // 每页显示条数
      handleSizeData: [10, 20, 30, 40, 50],
      loading: false,
      search: false,
      ruleForm: {
        deviceId: "",
        customerId: "",
        manufacturerId: "",
        manufacturerName: "",
        customerName: ""
      },
      rules: {
        deviceId: [
          { required: true, message: "请输入生产商id", trigger: "blur" }
        ]
      },
      options: [],
      manufacturerOptions: [],
      customerOptions: [],
      value: ""
    };
  },
  methods: {
    init() {
      let pageObj = {
        pageNum: this.totalPage,
        pageSize: this.handleSize
      };
      deviceList(pageObj).then(res => {
        this.loading = false;
        console.log(res);
        let result = res.data;
        if (result.code === 1) {
          this.$message({
            message: "登录超时，请重新登录",
            type: "warning"
          });
          this.$router.push({
            path: "/login"
          });
        }
        if (result.code === 0) {
          if (result.data.data) {
            let tableObj = result.data.data;
            this.tableData = [];
            tableObj.forEach(key => {
              if (key.bindingStatus === 0) {
                key.bindingName = "未绑定";
                key.bindingStatus = false;
              } else {
                key.bindingName = "已绑定";
                key.bindingStatus = true;
              }
              key.createTime = timeFormats(key.createTime);
              key.status = key.status === 0 ? true : false;
              this.tableData.push(key);
            });
          }
        }
      });
    },
    batteryReg() {
      this.regForm = true;
    },
    renew() {
      this.$router.push({
        path: "/blacklist"
      });
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          let params = {
            manufacturerId: this.ruleForm.manufacturerId.id,
            customerId: this.ruleForm.customerId,
            deviceId: this.ruleForm.deviceId,
            manufacturerName: this.ruleForm.manufacturerId.name,
            customerName: this.ruleForm.customerName
          };
          createDeviceList(params)
            .then(res => {
              console.log(res);
              if (res.data.code === 1) {
                this.$message({
                  message: "登录超时，请重新登录",
                  type: "warning"
                });
                this.$router.push({
                  path: "/login"
                });
              }
              if (res.data.code === 0) {
                this.$message({
                  message: "创建成功",
                  type: "success"
                });
                this.closeBox();
                this.init();
              }
              if (res.data.code === -1) {
                this.$message.error(res.data.msg);
              }
            })
            .catch();
        } else {
          return false;
        }
      });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    closeBox() {
      this.ruleForm = {};
      this.addBox = false;
    },
    getAddData() {
      // 生产企业列表
      enterpriseList().then(res => {
        if (res.data.code === 0) {
          let result = res.data.data;
          result.forEach(key => {
            this.manufacturerOptions.push(key);
          });
        }
      });
      enterpriseCustomer()
        // 客户企业列表
        .then(res => {
          if (res.data.code === 0) {
            let data = res.data.data;
            data.forEach(key => {
              this.customerOptions.push(key);
            });
          }
        });
    },
    /*
    *  改变每页显示的条数
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
      console.log("handleCurrentChange", this.currentPage);
    }
  },
  mounted() {
    this.init();
    this.getAddData();
  }
};
</script>
<style scoped>
.batterylist {
  box-sizing: border-box;
  width: 100%;
  background: #ffffff;
  border-radius: 5px;
  padding: 10px 15px;
}
.flex {
  display: flex;
}
.table {
  padding-top: 30px;
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
.block {
  text-align: right;
  padding-top: 20px;
}
</style>
