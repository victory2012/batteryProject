<template>
  <div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%" max-height="750">
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
      <el-table-column align="center" label="运行状态">
        <template slot-scope="scope">
          <el-button @click.native.prevent="examine(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].bindingStatus" size="small">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <!-- <el-button @click.native.prevent="bind(scope.$index, tableData)" type="text" :disabled="tableData[scope.$index].bindingStatus" size="small">
            绑定
          </el-button>
          <el-button @click.native.prevent="unBind(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].bindingStatus" size="small">
            解绑
          </el-button>
          <el-button @click.native.prevent="addBlack(scope.$index, tableData)" type="text" :disabled="!tableData[scope.$index].status" size="small">
            拉黑
          </el-button> -->
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
            删除
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
import { GetList, deleteBattery } from "../../api/index.js";
export default {
  name: "TableList",
  data() {
    return {
      totalPage: 1, // 总页数
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
      GetList(pageObj).then(res => {
        this.loading = false;
        console.log(res);
        let result = res.data;

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
    deleteRow(index, tableData) {
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
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getData();
        }
      });
    },
    /*
     * 查看运行状态
     */
    examine(index, tableData) {
      let deviceId = tableData[index];
      console.log();
      this.$router.push({
        path: "position",
        query: { deviceId: deviceId.deviceId }
      });
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
