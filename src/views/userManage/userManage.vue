<template>
  <div class="user">
    <div class="userBtn"
      v-if="adminRole">
      <!-- <div @click="creatUser = true">
        <img src="../../static/img/add-user.png" alt="">
        <p>创建企业用户</p>
      </div> -->
      <div v-if="manufacturer"
        @click="creatAdminClick">
        <img src="../../../static/img/add-admin.png"
          alt="">
        <p>{{$t('useMsg.add.manufacturer')}}</p>
      </div>
      <div v-else-if="customer"
        @click="customerClick">
        <img src="../../../static/img/add-user.png"
          alt="">
        <p>{{$t('useMsg.add.customer')}}</p>
      </div>
      <div v-if="manufacturerAdmin"
        @click="manAdminClick">
        <img src="../../../static/img/add-user.png"
          alt="">
        <p>{{$t('useMsg.add.manuProduct')}}</p>
      </div>
      <div v-if="customerAdmin"
        @click="creatCustormAdminClick">
        <img src="../../../static/img/add-user.png"
          alt="">
        <p>{{$t('useMsg.add.cusNoraml')}}</p>
      </div>
    </div>
    <div v-if="manufacturer">
      <el-dialog :title="$t('useMsg.add.manufacturer')"
        :visible.sync="creatAdmin"
        width="600px">
        <el-form :model="adminForm"
          :rules="customerRules"
          ref="adminForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.userName')"
                :error="nameErr"
                prop="userName">
                <el-input v-model.trim="adminForm.userName"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.password')"
                prop="password">
                <el-input v-model.trim="adminForm.password"
                  type="password"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.phone')"
                prop="phoneNumber">
                <el-input v-model.trim="adminForm.phoneNumber"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.email')"
                prop="email">
                <el-input v-model.trim="adminForm.email"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.enterpriseName')"
                prop="enterpriseName">
                <el-input v-model.trim="adminForm.enterpriseName"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.nature')"
                prop="nature">
                <el-select v-model.trim="adminForm.nature"
                  :placeholder="$t('useMsg.add.nature')"
                  style="width:240px;">
                  <el-option v-for="item in natureOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer"
          class="dialog-footer">
          <el-button @click="resetAdmin('adminForm')">{{$t('useMsg.add.cancel')}}</el-button>
          <el-button @click="submitAdmin('adminForm')"
            type="primary">{{$t('useMsg.add.sure')}}</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="customer">
      <el-dialog :title="$t('useMsg.add.customer')"
        :visible.sync="creatCustorm"
        width="600px">
        <el-form :model="customerForm"
          :rules="customerRules"
          ref="customerForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.userName')"
                :error="nameErr"
                prop="userName">
                <el-input v-model.trim="customerForm.userName"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.password')"
                prop="password">
                <el-input v-model.trim="customerForm.password"
                  type="password"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.phone')"
                prop="phoneNumber">
                <el-input v-model.trim="customerForm.phoneNumber"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.enterpriseName')"
                prop="enterpriseName">
                <el-input v-model.trim="customerForm.enterpriseName"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.email')"
                prop="email">
                <el-input v-model.trim="customerForm.email"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.nature')"
                prop="nature">
                <el-select v-model.trim="customerForm.nature"
                  :placeholder="$t('useMsg.add.nature')"
                  style="width:240px;">
                  <el-option v-for="item in natureOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer"
          class="dialog-footer">
          <el-button @click="resetCustomer('customerForm')">{{$t('useMsg.add.cancel')}}</el-button>
          <el-button @click="submitCustomer('customerForm')"
            type="primary">{{$t('useMsg.add.sure')}}</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="manufacturerAdmin">
      <el-dialog :title="$t('useMsg.add.manuProduct')"
        :visible.sync="manAdmin"
        width="600px">
        <el-form :model="manAdminForm"
          :rules="customerRules"
          ref="manAdminForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.userName')"
                :error="nameErr"
                prop="userName">
                <el-input v-model.trim="manAdminForm.userName"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.password')"
                prop="password">
                <el-input v-model.trim="manAdminForm.password"
                  type="password"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.phone')"
                prop="phoneNumber">
                <el-input v-model.trim="manAdminForm.phoneNumber"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.nature')"
                prop="nature">
                <el-select v-model="manAdminForm.nature"
                  :placeholder="$t('useMsg.add.nature')"
                  style="width:240px;">
                  <el-option v-for="item in natureOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.enterpriseName')" prop="enterpriseName">
                <el-input v-model="manAdminForm.enterpriseName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.email')"
                prop="email">
                <el-input v-model.trim="manAdminForm.email"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer"
          class="dialog-footer">
          <el-button @click="resetManufacturer('manAdminForm')">{{$t('useMsg.add.cancel')}}</el-button>
          <el-button @click="submitManufacturerAdmin('manAdminForm')"
            type="primary">{{$t('useMsg.add.sure')}}</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="customerAdmin">
      <el-dialog :title="$t('useMsg.add.cusNoraml')"
        :visible.sync="creatCustormAdmin"
        width="600px">
        <el-form :model="CustormAdminForm"
          :rules="customerRules"
          ref="CustormAdminForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.userName')"
                :error="nameErr"
                prop="userName">
                <el-input v-model.trim="CustormAdminForm.userName"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.password')"
                prop="password">
                <el-input v-model.trim="CustormAdminForm.password"
                  type="password"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.phone')"
                prop="phoneNumber">
                <el-input v-model.trim="CustormAdminForm.phoneNumber"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.nature')"
                prop="nature">
                <el-select v-model.trim="CustormAdminForm.nature"
                  :placeholder="$t('useMsg.add.nature')"
                  style="width:240px;">
                  <el-option v-for="item in natureOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.enterpriseName')" prop="enterpriseName">
                <el-input v-model="CustormAdminForm.enterpriseName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item :label="$t('useMsg.add.email')"
                prop="email">
                <el-input v-model.trim="CustormAdminForm.email"
                  auto-complete="off"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
        <div slot="footer"
          class="dialog-footer">
          <el-button @click="resetCustormAdmin('CustormAdminForm')">{{$t('useMsg.add.cancel')}}</el-button>
          <el-button @click="submitCustormAdmin('CustormAdminForm')"
            type="primary">{{$t('useMsg.add.sure')}}</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-table v-loading="loading"
        :data="tableData"
        max-height="750">
        <el-table-column type="index"
          width="80"
          align="center"
          :label="$t('useMsg.serial')"></el-table-column>
        <el-table-column prop="userName"
          align="center"
          :label="$t('useMsg.name')">
        </el-table-column>
        <el-table-column prop="accountRole"
          align="center"
          :label="$t('useMsg.accountIdentity')">
        </el-table-column>
        <el-table-column prop="enterpriseRole"
          align="center"
          :label="$t('useMsg.companyIdentity')">
        </el-table-column>
        <el-table-column prop="enterpriseName"
          align="center"
          :label="$t('useMsg.enterpriseName')">
        </el-table-column>
        <el-table-column prop="phoneNumber"
          align="center"
          :label="$t('useMsg.phone')">
        </el-table-column>
        <el-table-column prop="email"
          align="center"
          :label="$t('useMsg.email')">
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
} from "../../api/index.js";
// import { userRole, companyRole } from "../../utils/transition.js";
import { onSuccess } from "../../utils/callback";
export default {
  name: "userTable",
  data () {
    return {
      nameErr: '',
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
          label: this.$t("useMsg.add.china"),
          value: "0"
        },
        {
          label: this.$t("useMsg.add.international"),
          value: "1"
        }
      ],
      customerRules: {
        userName: [
          {
            required: true,
            message: this.$t("useMsg.warn.userName"),
            trigger: "change"
          },
          // {
          //   pattern: false,
          //   // pattern: !(/[\s""]/g),
          //   message: this.$t("useMsg.warn.phoneCheck"),
          //   trigger: "change"
          // },
          {
            min: 4,
            message: this.$t("useMsg.warn.nameLimit"),
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("useMsg.warn.password"),
            trigger: "change"
          },
          {
            min: 6,
            message: this.$t("useMsg.warn.passwordLimit"),
            trigger: "change"
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: this.$t("useMsg.warn.phone"),
            trigger: "change"
          },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: this.$t("useMsg.warn.phoneCheck"),
            trigger: "change"
          }
        ],
        enterpriseName: [
          {
            required: true,
            message: this.$t("useMsg.warn.enterprise"),
            trigger: "change"
          }
        ],
        nature: [
          {
            required: true,
            message: this.$t("useMsg.warn.nature"),
            trigger: "change"
          }
        ],
        email: [
          { required: false, message: '', trigger: 'blur' },
          { type: 'email', message: this.$t('useMsg.warn.emailCheck'), trigger: ['blur', 'change'] }
        ]
      },
      email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      creatAdmin: false,
      creatCustorm: false,
      customerAdmin: false,
      formLabelWidth: "120px",
      space: /[\s""]/g
    };
  },
  created () {
    this.userData = JSON.parse(sessionStorage.getItem("loginData"));
    if (this.userData.userRole === "plat_super_admin") {
      this.manufacturer = true;
      this.customer = false;
      this.manufacturerAdmin = false;
      this.customerAdmin = false;
    } else if (this.userData.userRole === "manufacturer_super_admin") {
      this.manufacturer = false;
      this.customer = true;
      this.manufacturerAdmin = true;
      this.customerAdmin = false;
    } else if (this.userData.userRole === "customer_super_admin") {
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
    creatAdminClick () {
      this.creatAdmin = true;
      this.nameErr = "";
    },
    customerClick () {
      this.creatCustorm = true;
      this.nameErr = "";
    },
    manAdminClick () {
      this.manAdmin = true;
      this.nameErr = "";
    },
    creatCustormAdminClick () {
      this.creatCustormAdmin = true;
      this.nameErr = "";
    },
    // 添加客户企业管理员
    submitCustomer (formName) {
      if (this.space.test(this.customerForm.userName)) {
        this.nameErr = "用户名不能有空格"
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsAdmin = {
            userName: this.customerForm.userName,
            password: this.customerForm.password,
            phoneNumber: this.customerForm.phoneNumber,
            email: this.customerForm.email || "",
            enterpriseName: this.customerForm.enterpriseName,
            // mapType: "1"
            mapType: this.customerForm.nature
          };

          addCustomer(paramsAdmin).then(res => {
            console.log(res.data);
            let result = res.data;
            if (result.code === 0) {
              onSuccess(`${this.$t("useMsg.success")}`);
              this.creatCustorm = false;
              this.resetCustomer(this.customerForm);
              this.getData();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 创建生产企业超级管理员
    submitAdmin (formName) {
      if (this.space.test(this.adminForm.userName)) {
        this.nameErr = "用户名不能有空格"
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsAdmin = {
            userName: this.adminForm.userName,
            password: this.adminForm.password,
            phoneNumber: this.adminForm.phoneNumber,
            enterpriseName: this.adminForm.enterpriseName,
            email: this.adminForm.email || "",
            // mapType: "1"
            mapType: this.adminForm.nature
          };
          console.log(paramsAdmin);

          // 添加生产企业超级管理员
          addManufacturer(paramsAdmin).then(res => {
            console.log(res.data);
            let result = res.data;
            if (result.code === 0) {
              onSuccess(`${this.$t("useMsg.success")}`);
              this.resetAdmin("adminForm");
              this.getData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 添加生产企业普通管理员
    submitManufacturerAdmin (formName) {
      if (this.space.test(this.manAdminForm.userName)) {
        this.nameErr = "用户名不能有空格"
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsAdmin = {
            userName: this.manAdminForm.userName,
            password: this.manAdminForm.password,
            phoneNumber: this.manAdminForm.phoneNumber,
            enterpriseName: this.userData.enterpriseName,
            email: this.manAdminForm.email || "",
            // mapType: "1"
            mapType: this.manAdminForm.nature
          };

          // 添加生产企业普通管理员
          addManufacturerAdmin(paramsAdmin).then(res => {
            console.log(res.data);
            let result = res.data;
            if (result.code === 0) {
              onSuccess(`${this.$t("useMsg.success")}`);
              this.getData();
              this.resetManufacturer("manAdminForm");
            }
          });
        }
      });
    },
    submitCustormAdmin (formName) {
      if (this.space.test(this.CustormAdminForm.userName)) {
        this.nameErr = "用户名不能有空格"
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsAdmin = {
            userName: this.CustormAdminForm.userName,
            password: this.CustormAdminForm.password,
            phoneNumber: this.CustormAdminForm.phoneNumber,
            enterpriseName: this.userData.enterpriseName,
            email: this.CustormAdminForm.email || "",
            // mapType: "1"
            mapType: this.CustormAdminForm.nature
          };
          addCustomerAdmin(paramsAdmin).then(res => {
            console.log(res.data);
            let result = res.data;

            if (result.code === 0) {
              onSuccess(`${this.$t("useMsg.success")}`);
              this.resetCustormAdmin("CustormAdminForm");
              this.getData();
            }
          });
        }
      });
    },
    resetCustormAdmin (formName) {
      this.creatCustormAdmin = false;
      this.CustormAdminForm = {};
      this.$refs[formName].resetFields();
    },
    resetCustomer (formName) {
      this.creatUser = false;
      this.UserForm = {};
      this.$refs[formName].resetFields();
    },
    resetManufacturer (formName) {
      this.manAdmin = false;
      this.manAdminForm = {};
      this.$refs[formName].resetFields();
    },
    resetAdmin (formName) {
      this.adminForm = {};
      this.creatAdmin = false;
      this.$refs[formName].resetFields();
    },
    /*
    *  获取数据
    *  pageObj：入参分页配置 json格式
    */
    getData () {
      let pageObj = {
        pageSize: this.handleSize,
        pageNum: this.currentPage
      };
      this.getManufacturer(pageObj);
    },
    getManufacturer (pageObj) {
      manufacturerList(pageObj).then(res => {
        this.loading = false;
        console.log(res);
        let result = res.data;
        if (result.code === 0) {
          if (result.data.data) {
            let tableObj = result.data.data;
            this.totalPage = result.data.total;
            this.tableData = [];
            tableObj.forEach(key => {
              key.accountRole = this.userRole(key.userRole);
              key.status = key.status === 0 ? false : true;
              key.email = key.email;
              key.enterpriseRole = this.companyRole(key.enterpriseRole);
              this.tableData.push(key);
            });
          }
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
    /*
    * 删除
    */
    deleteRow (index, tableData) {
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
    handleSizeChange (index) {
      // index为选中的页数
      this.loading = true;
      this.handleSize = index;
      this.getData();
    },
    /*
    * 显示第几页
    */
    handleCurrentChange () {
      this.loading = true;
      // console.log("handleCurrentChange", this.currentPage);
      this.getData();
    },
    /*
    * 拉黑
    */
    addBlack (index, tableData) {
      this.loading = true;
      let params = {
        manufacturer: tableData[index].manufacturerId,
        customer: tableData[index].customerId,
        deviceId: tableData[index].deviceId
      };
      console.log(params);
    }
  },
  mounted () {
    this.getData();
  }
};
</script>
