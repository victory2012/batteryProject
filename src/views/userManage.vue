<template>
  <div class="user">
    <div class="userBtn" v-if="adminRole">
      <!-- <div @click="creatUser = true">
        <img src="../../static/img/add-user.png" alt="">
        <p>创建企业用户</p>
      </div> -->
      <div v-if="manufacturer" @click="creatAdmin = true">
        <img src="../../static/img/add-admin.png" alt="">
        <p>添加生产企业管理员</p>
      </div>
      <div v-else-if="customer" @click="creatCustorm = true">
        <img src="../../static/img/add-user.png" alt="">
        <p>添加客户企业管理员</p>
      </div>
      <div v-if="manufacturerAdmin" @click="manAdmin = true">
        <img src="../../static/img/add-user.png" alt="">
        <p>添加生产企业普通管理员</p>
      </div>
      <div v-if="customerAdmin" @click="creatCustormAdmin = true">
        <img src="../../static/img/add-user.png" alt="">
        <p>添加普通管理员</p>
      </div>
    </div>
    <div v-if="manufacturer">
      <el-dialog title="创建生产企业管理员" :visible.sync="creatAdmin" width="600px">
        <el-form :model="adminForm" :rules="customerRules" ref="adminForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="adminForm.userName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登陆密码" prop="password">
                <el-input v-model="adminForm.password" type="password" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phoneNumber">
                <el-input v-model="adminForm.phoneNumber" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱（选填）" prop="email">
                <el-input v-model="adminForm.email" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="企业名称" prop="enterpriseName">
                <el-input v-model="adminForm.enterpriseName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业性质" prop="nature">
                <el-select v-model="adminForm.nature" placeholder="企业性质" style="width:240px;">
                  <el-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetAdmin('adminForm')">取 消</el-button>
          <el-button @click="submitAdmin('adminForm')" type="primary">确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="customer">
      <el-dialog title="添加客户企业管理员" :visible.sync="creatCustorm" width="600px">
        <el-form :model="customerForm" :rules="customerRules" ref="customerForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="customerForm.userName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登陆密码" prop="password">
                <el-input v-model="customerForm.password" type="password" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phoneNumber">
                <el-input v-model="customerForm.phoneNumber" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称" prop="enterpriseName">
                <el-input v-model="customerForm.enterpriseName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="邮箱（选填）" prop="email">
                <el-input v-model="customerForm.email" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业性质" prop="nature">
                <el-select v-model="customerForm.nature" placeholder="企业性质" style="width:240px;">
                  <el-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetCustomer('customerForm')">取 消</el-button>
          <el-button @click="submitCustomer('customerForm')" type="primary">确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="manufacturerAdmin">
      <el-dialog title="添加生产企业普通管理员" :visible.sync="manAdmin" width="600px">
        <el-form :model="manAdminForm" :rules="customerRules" ref="manAdminForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="manAdminForm.userName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登陆密码" prop="password">
                <el-input v-model="manAdminForm.password" type="password" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phoneNumber">
                <el-input v-model="manAdminForm.phoneNumber" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称" prop="enterpriseName">
                <el-input v-model="manAdminForm.enterpriseName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="邮箱（选填）" prop="email">
                <el-input v-model="manAdminForm.email" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业性质" prop="nature">
                <el-select v-model="manAdminForm.nature" placeholder="企业性质" style="width:240px;">
                  <el-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetManufacturer('manAdminForm')">取 消</el-button>
          <el-button @click="submitManufacturerAdmin('manAdminForm')" type="primary">确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="customerAdmin">
      <el-dialog title="添加普通管理员" :visible.sync="creatCustormAdmin" width="600px">
        <el-form :model="CustormAdminForm" :rules="customerRules" ref="CustormAdminForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="CustormAdminForm.userName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登陆密码" prop="password">
                <el-input v-model="CustormAdminForm.password" type="password" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phoneNumber">
                <el-input v-model="CustormAdminForm.phoneNumber" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称" prop="enterpriseName">
                <el-input v-model="CustormAdminForm.enterpriseName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="邮箱（选填）" prop="email">
                <el-input v-model="CustormAdminForm.email" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业性质" prop="nature">
                <el-select v-model="CustormAdminForm.nature" placeholder="企业性质" style="width:240px;">
                  <el-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetCustormAdmin('CustormAdminForm')">取 消</el-button>
          <el-button @click="submitCustormAdmin('CustormAdminForm')" type="primary">确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-table v-loading="loading" :data="tableData" max-height="750">
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column prop="userName" align="center" label="用户名">
        </el-table-column>
        <el-table-column prop="accountRole" align="center" label="账户身份">
        </el-table-column>
        <el-table-column prop="enterpriseRole" align="center" label="企业身份">
        </el-table-column>
        <el-table-column prop="enterpriseName" align="center" label="企业名称">
        </el-table-column>
        <el-table-column prop="phoneNumber" align="center" label="手机号码">
        </el-table-column>
        <el-table-column prop="email" align="center" label="邮箱">
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="bind(scope.$index, tableData)" type="text" :disabled="tableData[scope.$index].bindingStatus" size="small">
            修改权限
          </el-button>
          <el-button @click.native.prevent="unBind(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].bindingStatus" size="small">
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
  </div>
</template>
<style lang="less" scoped>
.el-form {
  padding: 0 20px;
}
.block {
  text-align: right;
  padding-top: 20px;
}
.user {
  background-color: #ffffff;
  border-radius: 5px;
  padding: 20px;
  .userBtn {
    height: 80px;
    margin-bottom: 30px;
    & div {
      float: left;
      width: 160px;
      height: 70px;
      text-align: center;
      border-radius: 5px;
      margin-right: 10px;
      color: #71bfdb;
      font-size: 14px;
      cursor: pointer;
      padding-top: 10px;
      & img {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<script>
import {
  addManufacturer, // 添加生产企业超级管理员
  addManufacturerAdmin, // 添加生产企业普通管理员
  manufacturerList, // 用户列表
  addCustomerAdmin, // 添加生产企业普通管理员
  addCustomer // 添加客户超级管理员
} from "../api/index.js";
import { userRole, companyRole } from "../utils/transition.js";
import { onTimeOut, onSuccess, onError } from "../utils/callback"
export default {
  name: "userTable",
  data() {
    return {
      totalPage: 0, // 总页数
      currentPage: 1, // 当前页
      handleSize: 10, // 每页显示条数
      handleSizeData: [10, 20, 30, 40, 50],
      tableData: [],
      loading: true,
      creatCustormAdmin: false,
      customer: false,
      manufacturer: false,
      manufacturerAdmin: false,
      manAdmin: false,
      adminRole: true,
      adminForm: {},
      customerForm: {},
      manAdminForm: {},
      CustormAdminForm: {},
      natureOptions: [
        {
          label: '国内',
          value: '0'
        },
        {
          label: '国际',
          value: '1'
        }
      ],
      customerRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "change" },
          { min: 4, message: "用户名至少4位", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 6, message: "密码至少6位", trigger: "change" }
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "change" },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "手机号格式错误",
            trigger: "change"
          }
        ],
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "change" }
        ],
        nature: [
          { required: true, message: "请选择企业性质", trigger: "change" }
        ]
      },
      creatAdmin: false,
      creatCustorm: false,
      customerAdmin: false,
      formLabelWidth: "120px"
    };
  },
  created() {
    let userData = JSON.parse(localStorage.getItem("loginData"));
    if (userData.userRole === "plat_super_admin") {
      this.manufacturer = true;
      this.customer = false;
      this.manufacturerAdmin = false;
      this.customerAdmin = false;
    } else if (userData.userRole === "super_admin") {
      this.manufacturer = false;
      this.customer = true;
      this.manufacturerAdmin = true;
      this.customerAdmin = false;
    } else if (userData.userRole === "customer_super_admin") {
      this.manufacturer = false;
      this.customer = false;
      this.customerAdmin = true;
      this.manufacturerAdmin = false;
    } else {
      this.manufacturer = false;
      this.customer = false;
      this.customerAdmin = false;
      this.manufacturerAdmin = false;
      this.adminRole = false;
    }
  },
  methods: {
    // 添加客户企业管理员
    submitCustomer(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsAdmin = {
            userName: this.customerForm.userName,
            password: this.customerForm.password,
            phoneNumber: this.customerForm.phoneNumber,
            email: this.customerForm.email || "",
            enterpriseName: this.customerForm.enterpriseName,
            mapType: this.customerForm.nature
          };
          console.log(paramsAdmin);
          addCustomer(paramsAdmin)
            .then(res => {
              console.log(res.data);
              let result = res.data;
              if (result.code === 1) {
                onTimeOut(this.$router);
              }
              if (result.code === -1) {
                onError(`创建失败，原因${result.msg}`);
              }
              if (result.code === 0) {
                onSuccess("创建成功！");
                this.creatCustorm = false;
                this.resetCustomer(this.customerForm);
                this.getData();
              }
            })
            .catch(() => {
              onError("服务器请求超时，请稍后重试");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 创建生产企业超级管理员
    submitAdmin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsAdmin = {
            userName: this.adminForm.userName,
            password: this.adminForm.password,
            phoneNumber: this.adminForm.phoneNumber,
            enterpriseName: this.adminForm.enterpriseName,
            email: this.adminForm.email || "",
            mapType: this.adminForm.nature
          };
          console.log(paramsAdmin);
          // 添加生产企业超级管理员
          addManufacturer(paramsAdmin)
            .then(res => {
              console.log(res.data);
              let result = res.data;
              if (result.code === 1) {
                onTimeOut(this.$router);
              }
              if (result.code === -1) {
                onError(`创建失败，原因${result.msg}`);
              }
              if (result.code === 0) {
                onSuccess("创建成功！");
                this.resetAdmin("adminForm");
                this.getData();
              }
            })
            .catch(() => {
              onError("服务器请求超时，请稍后重试");
            });
        } else {
          return false;
        }
      });
    },
    // 添加生产企业普通管理员
    submitManufacturerAdmin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsAdmin = {
            userName: this.manAdminForm.userName,
            password: this.manAdminForm.password,
            phoneNumber: this.manAdminForm.phoneNumber,
            enterpriseName: this.manAdminForm.enterpriseName,
            email: this.manAdminForm.email || "",
            mapType: this.manAdminForm.nature
          };
          console.log(paramsAdmin);
          // 添加生产企业普通管理员
          addManufacturerAdmin(paramsAdmin)
            .then(res => {
              console.log(res.data);
              let result = res.data;
              if (result.code === 1) {
                onTimeOut(this.$router);
              }
              if (result.code === -1) {
                onError(`创建失败，原因${result.msg}`);
              }
              if (result.code === 0) {
                onSuccess("创建成功！");
                this.getData();
                this.resetManufacturer("manAdminForm");
              }
            })
            .catch(() => {
              onError("服务器请求超时，请稍后重试");
            });
        } else {
          return false;
        }
      });
    },
    submitCustormAdmin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsAdmin = {
            userName: this.CustormAdminForm.userName,
            password: this.CustormAdminForm.password,
            phoneNumber: this.CustormAdminForm.phoneNumber,
            enterpriseName: this.CustormAdminForm.enterpriseName,
            email: this.CustormAdminForm.email || "",
            mapType: this.CustormAdminForm.nature
          };
          console.log(paramsAdmin);
          addCustomerAdmin(paramsAdmin)
            .then(res => {
              console.log(res.data);
              let result = res.data;
              if (result.code === 1) {
                onTimeOut(this.$router);
              }
              if (result.code === -1) {
                onError(`创建失败，原因${result.msg}`);
              }
              if (result.code === 0) {
                onSuccess("创建成功！");
                this.resetCustormAdmin("CustormAdminForm");
                this.getData();
              }
            })
            .catch(() => {
              onError("服务器请求超时，请稍后重试");
            });
        }
      });
    },
    resetCustormAdmin(formName) {
      this.creatCustormAdmin = false;
      this.CustormAdminForm = {};
      this.$refs[formName].resetFields();
    },
    resetCustomer(formName) {
      this.creatUser = false;
      this.UserForm = {};
      this.$refs[formName].resetFields();
    },
    resetManufacturer(formName) {
      this.manAdmin = false;
      this.manAdminForm = {};
      this.$refs[formName].resetFields();
    },
    resetAdmin(formName) {
      this.adminForm = {};
      this.creatAdmin = false;
      this.$refs[formName].resetFields();
    },
    /*
    *  获取数据
    *  pageObj：入参分页配置 json格式
    */
    getData() {
      let pageObj = {
        pageSize: this.handleSize,
        pageNum: this.currentPage
      };
      this.getManufacturer(pageObj);
    },
    getManufacturer(pageObj) {
      manufacturerList(pageObj)
        .then(res => {
          this.loading = false;
          console.log(res);
          let result = res.data;
          if (result.code === 1) {
            onTimeOut(this.$router);
          }
          if (result.code === -1) {
            onError(result.msg);
          }
          if (result.code === 0) {
            if (result.data.data) {
              let tableObj = result.data.data;
              this.totalPage = result.data.total;
              this.tableData = [];
              tableObj.forEach(key => {
                key.accountRole = userRole(key.userRole);
                key.status = key.status === 0 ? false : true;
                key.email = key.email || "无";
                key.enterpriseRole = companyRole(key.enterpriseRole);
                this.tableData.push(key);
              });
            }
          }
        })
        .catch(() => {
          this.loading = false;
          onError("服务器请求超时，请稍后重试");
        });
    },
    /*
    * 删除
    */
    deleteRow(index, tableData) {
      this.loading = true;
      let params = {
        manufacturer: tableData[index].manufacturerId,
        customer: tableData[index].customerId,
        deviceId: tableData[index].deviceId
      };
      console.log(params);
    },

    /*
    *  改变每页显示的条数
    */
    handleSizeChange(index) {
      // index为选中的页数
      this.loading = true;
      this.handleSize = index;
      this.getData();
    },
    /*
    * 显示第几页
    */
    handleCurrentChange() {
      this.loading = true;
      // console.log("handleCurrentChange", this.currentPage);
      this.getData();
    },
    /*
    * 拉黑
    */
    addBlack(index, tableData) {
      this.loading = true;
      let params = {
        manufacturer: tableData[index].manufacturerId,
        customer: tableData[index].customerId,
        deviceId: tableData[index].deviceId
      };
      console.log(params);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
