<template>
  <div class="table-wapper">
    <!-- <el-scrollbar class="page-comonent_scroll"> -->
    <el-table size="medium" :data="tableData" style="width: 100%">
      <el-table-column align="center" type="index" width="100" label="序号">
      </el-table-column>
      <el-table-column prop="startTime" align="center" width="160" label="告警发生时间">
      </el-table-column>
      <!-- <el-table-column prop="project" align="center" label="告警项目">
      </el-table-column> -->
      <el-table-column prop="batteryId" align="center" width="160" label="电池编号">
      </el-table-column>
      <el-table-column prop="deviceId" align="center" width="160" label="设备编号">
      </el-table-column>
      <el-table-column prop="content" align="center" label="告警内容">
      </el-table-column>
      <el-table-column prop="grid" align="center" label="设备坐标">
      </el-table-column>
      <!-- <el-table-column prop="level" align="center" label="告警级别">
      </el-table-column> -->
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button @click.native.prevent="checkPosition(scope.$index, tableData)" type="text" size="small">
            查看位置
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="handleSizeData" :page-size="handleSize" layout="sizes, prev, pager, next" :total="totalNum">
      </el-pagination>
    </div>
  </div>
</template>
<style scoped>
.table-wapper {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
.block {
  text-align: right;
  padding-top: 20px;
}
.markMap {
  width: 100%;
  height: 600px;
}
</style>
<script>
import { alarmList } from "../api/index.js";
import { timeFormat, sortGps } from "../utils/transition.js";
import { onTimeOut, onError } from "../utils/callback.js";
export default {
  data() {
    return {
      currentPage2: 1,
      handleSize: 10,
      handleSizeData: [10, 20, 30, 40, 50],
      tableData: [],
      totalNum: 0
    };
  },
  methods: {
    init() {
      let alarmdataPage = localStorage.getItem("alarmdataPage");
      if (alarmdataPage) {
        this.currentPage2 = alarmdataPage;
      }
      let pageObj = {
        pageNum: this.currentPage2,
        pageSize: this.handleSize
      };
      this.getData(pageObj);
    },
    getData(pageObj) {
      alarmList(pageObj)
        .then(res => {
          console.log(res);
          if (res.data.code === 1) {
            onTimeOut(this.$router)
          }
          if (res.data.code === 0) {
            let result = res.data.data;
            this.totalNum = result.total;
            this.tableData = [];
            if (result.data.length > 0) {
              result.data.forEach(key => {
                var obj = {};
                obj.startTime = timeFormat(key.alarmedTime);
                obj.batteryId = key.batteryId; // 电池id
                obj.deviceId = key.deviceId; // 设备id
                obj.content = key.msg; // 告警内容
                obj.level = key.level; // 告警级别
                obj.grid = sortGps(key.longitude) + ";" + sortGps(key.latitude);
                this.tableData.push(obj);
              });
            }
          }
          if (res.data.code === -1) {
            onError(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          onError("服务器请求超时，请稍后重试");
        });
    },
    checkPosition(index, data) {
      // 查看位置
      this.$router.push({
        path: "abnormal",
        query: { grid: data[index].grid, deviceId: data[index].deviceId }
      });
    },
    handleSizeChange(index) {
      // index为选中的页数
      this.handleSize = index;
      let pageObj = {
        pageNum: this.currentPage2,
        pageSize: this.handleSize
      };
      this.getData(pageObj);
    },
    handleCurrentChange(index) {
      // currentPage2 为选中的页数
      console.log(index);
      this.currentPage2 = index;
      let pageObj = {
        pageNum: this.currentPage2,
        pageSize: this.handleSize
      };
      this.getData(pageObj);
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // localStorage.removeItem("alarmdataPage");
  }
};
</script>
