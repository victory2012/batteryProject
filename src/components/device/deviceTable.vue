<template>
  <div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%" max-height="750">
      <el-table-column prop="batteryId" align="center" label="设备编号">
      </el-table-column>
      <el-table-column prop="manufacturerId" align="center" label="企业名称">
      </el-table-column>
      <el-table-column align="center" prop="manufacturerName" label="设备注册状态">
      </el-table-column>
      <el-table-column prop="customerId" align="center" label="电池绑定状态">
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
          <el-button @click.native.prevent="addBlack(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].status" size="small">
            拉黑
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
            删除
          </el-button>
          <el-button @click.native.prevent="unBind(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].bindingStatus" size="small">
            设备升级
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="handleSizeData" :page-size="handleSize" layout="sizes, prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { deviceList } from "../../api/index.js";
export default {
  name: "TableList",
  data() {
    return {
      totalPage: 1, // 总页数
      currentPage: 1, // 当前页
      handleSize: 10, // 每页显示条数
      handleSizeData: [10, 20, 30, 40, 50],
      tableData: [],
      loading: false
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
      deviceList(pageObj)
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
                key.status = key.status === 0 ? true : false;
                this.tableData.push(key);
              });
            }
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
          this.$message.error("服务器请求超时，请稍后重试");
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
  }
};
</script>
<style scoped>
.block {
  text-align: right;
  padding-top: 20px;
}
</style>
