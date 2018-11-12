<template>
  <div class="table-wapper">
    <!-- <el-scrollbar class="page-comonent_scroll"> -->
    <el-table size="medium" :data="tableData" style="width: 100%">
      <el-table-column align="center" type="index" width="100" :label="$t('alarmList.serial')">
      </el-table-column>
      <el-table-column prop="startTime" align="center" width="160" :label="$t('alarmList.time')">
      </el-table-column>
      <!-- <el-table-column prop="project" align="center" label="告警项目">
      </el-table-column> -->
      <el-table-column prop="batteryId" align="center" width="160" :label="$t('alarmList.batteryCode')">
      </el-table-column>
      <el-table-column prop="deviceId" align="center" width="160" :label="$t('alarmList.deviceCode')">
      </el-table-column>
      <el-table-column prop="content" align="center" :label="$t('alarmList.content')">
      </el-table-column>
      <el-table-column prop="grid" align="center" :label="$t('alarmList.grid')">
      </el-table-column>
      <!-- <el-table-column prop="level" align="center" label="告警级别">
      </el-table-column> -->
      <el-table-column align="center" :label="$t('alarmList.handle')" width="160">
        <template slot-scope="scope">
          <el-button @click.native.prevent="checkPosition(scope.row, tableData)" type="text" size="small">
            {{$t('alarmList.position')}}
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
import { alarmList } from "../../api/index.js";
import { sortGps } from "../../utils/transition.js";

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
      let alarmdataPage = sessionStorage.getItem("alarmdataPage");
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
      alarmList(pageObj).then(res => {
        console.log("alarmdataPage", res);

        if (res.data.code === 0) {
          let result = res.data.data;
          this.totalNum = result.total;
          this.tableData = [];
          if (result.data.length > 0) {
            result.data.forEach(key => {
              var obj = {};
              obj.efence = key.efence;
              obj.startTime = key.alarmedTime;
              obj.batteryId = key.batteryId; // 电池id
              obj.deviceId = key.deviceId; // 设备id
              obj.content = key.msg; // 告警内容
              obj.level = key.level; // 告警级别
              obj.grid = sortGps(key.longitude) + ";" + sortGps(key.latitude);
              this.tableData.push(obj);
            });
          }
        }
      });
    },
    checkPosition(data) {
      console.log(data);
      // 查看位置
      let deviceId = data.deviceId;
      let efence = data.efence;
      let userData = JSON.parse(sessionStorage.getItem("loginData"));
      if (userData.mapType === 0) {
        this.$router.push({
          path: "abnormal",
          query: { grid: data.grid, deviceId: deviceId, efence }
        });
      }
      if (userData.mapType === 1) {
        this.$router.push({
          path: "googleAbno",
          query: { grid: data.grid, deviceId: deviceId, efence }
        });
      }
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
    // sessionStorage.removeItem("alarmdataPage");
  }
};
</script>
