<template>
  <div class="user">
    <div class="userBtn">
      <!-- <div @click="creatUser = true">
        <img src="../../static/img/add-user.png" alt="">
        <p>创建企业用户</p>
      </div> -->
      <div v-show="manufacturer" @click="creatAdmin = true">
        <img src="../../static/img/add-admin.png" alt="">
        <p>创建生产企业管理员</p>
      </div>
      <!-- <div @click="creatUser = true">
        <img src="../../assets/add-user.png" alt="">
        <p>创建采购企业用户</p>
      </div> -->
    </div>
    <div>
      <el-dialog title="创建生产企业管理员" :visible.sync="creatAdmin" width="600px">
        <el-form :model="adminForm" :rules="adminRules" ref="adminForm">
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
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetAdmin('adminForm')">取 消</el-button>
          <el-button @click="submitAdmin('adminForm')" type="primary">确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="创建生产企业用户" :visible.sync="creatUser" width="600px">
        <el-form :model="UserForm" :rules="userRules" ref="UserForm">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="UserForm.userName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登陆密码" prop="password">
                <el-input v-model="UserForm.password" type="password" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phoneNumber">
                <el-input v-model="UserForm.phoneNumber" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱（选填）" prop="email">
                <el-input v-model="UserForm.email" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="企业名称" prop="enterpriseName">
                <el-input v-model="UserForm.enterpriseName" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetUser('UserForm')">取 消</el-button>
          <el-button @click="submitUser('UserForm')" type="primary">确认并发送账号密码</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <Table></Table>
    </div>
  </div>
</template>
<style lang="less" scoped>
.el-form {
  padding: 0 20px;
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
      width: 150px;
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
import { addCustomerAdmin, addManufacturerAdmin } from "../api/index.js";
import Table from "../components/userManege/userTable";
export default {
  name: "userTable",
  components: {
    Table
  },
  data() {
    return {
      manufacturer: false,
      adminForm: {},
      UserForm: {},
      userRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, message: "用户名至少4位", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码至少6位", trigger: "change" }
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "手机号格式错误",
            trigger: "change"
          }
        ],
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ]
      },
      adminRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, message: "用户名至少4位", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码至少6位", trigger: "change" }
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "手机号格式错误",
            trigger: "change"
          }
        ],
        enterpriseName: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ]
      },
      creatAdmin: false,
      creatUser: false,
      formLabelWidth: "120px"
    };
  },
  created() {
    let userData = JSON.parse(localStorage.getItem("loginData"));
    if (userData.userRole === "plat_super_admin") {
      this.manufacturer = true;
    }
  },
  methods: {
    // 创建用户
    submitUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let paramsAdmin = {
            userName: this.UserForm.userName,
            password: this.UserForm.password,
            phoneNumber: this.UserForm.phoneNumber,
            email: this.UserForm.email || "",
            enterpriseName: this.UserForm.enterpriseName
          };
          addCustomerAdmin(paramsAdmin)
            .then(res => {
              console.log(res.data);
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
              if (result.code === -1) {
                this.$message.error(`创建失败，原因${result.msg}`);
              }
              if (result.code === 0) {
                this.$message({
                  message: "创建成功！",
                  type: "success"
                });
              }
            })
            .catch(() => {
              this.$message.error("服务器请求超时，请稍后重试");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 创建生产企业管理员
    submitAdmin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.adminForm);
          let paramsAdmin = {
            userName: this.adminForm.userName,
            password: this.adminForm.password,
            phoneNumber: this.adminForm.phoneNumber,
            enterpriseName: this.adminForm.enterpriseName,
            email: this.adminForm.email || ""
          };
          addManufacturerAdmin(paramsAdmin)
            .then(res => {
              console.log(res.data);
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
              if (result.code === -1) {
                this.$message.error(`创建失败，原因${result.msg}`);
              }
              if (result.code === 0) {
                this.$message({
                  message: "创建成功！",
                  type: "success"
                });
                this.resetAdmin("adminForm");
              }
            })
            .catch(() => {
              this.$message.error("服务器请求超时，请稍后重试");
            });
        } else {
          return false;
        }
      });
    },
    resetUser(formName) {
      this.creatUser = false;
      this.UserForm = {};
      this.$refs[formName].resetFields();
    },
    resetAdmin(formName) {
      this.creatAdmin = false;
      this.adminForm = {};
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    // this.log();
  }
};
</script>