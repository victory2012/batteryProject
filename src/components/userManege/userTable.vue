<template>
  <div>
    <el-table v-loading="loading" :data="tableData" max-height="750">
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
</template>
<script>
import { manufacturerList } from "../../api/index.js";
export default {
  data() {
    return {
      totalPage: 50, // 总页数
      currentPage: 1, // 当前页
      handleSize: 10, // 每页显示条数
      handleSizeData: [10, 20, 30, 40, 50],
      tableData: [],
      loading: true
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
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
            this.$message({
              message: "登录超时，请重新登录",
              type: "warning"
            });
            this.$router.push({
              path: "/login"
            });
          }
          if (result.code === -1) {
            this.$message.error(result.msg);
          }
          if (result.code === 0) {
            if (result.data.data) {
              let tableObj = result.data.data;
              this.tableData = [];
              tableObj.forEach(key => {
                key.accountRole = this.userRole(key.userRole);
                key.status = key.status === 0 ? false : true;
                key.email = key.email || "无";
                key.enterpriseRole = this.companyRole(key.enterpriseRole);
                this.tableData.push(key);
              });
            }
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("服务器请求超时，请稍后重试");
        });
    },
    userRole(str) {
      switch (str) {
        case "plat_super_admin":
          return "平台管理员";
        case "super_admin":
          return "超级管理员";
        case "admin":
          return "管理员";
        default:
          return "";
      }
    },
    companyRole(str) {
      switch (str) {
        case "platform":
          return "平台";
        case "manufacturer":
          return "生产企业";
        case "customer":
          return "客户企业";
        case "admin":
          return "管理员";
        default:
          return "";
      }
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
      this.handleSize = index;
      this.getData();
    },
    /*
    * 显示第几页
    */
    handleCurrentChange() {
      console.log("handleCurrentChange", this.currentPage);
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
  }
};
</script>
<style scoped>
.block {
  text-align: right;
  padding-top: 20px;
}
</style>