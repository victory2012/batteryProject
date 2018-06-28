<template>
  <div class="table-wapper">
    <el-table size="medium" :data="tableData" style="width: 100%">
      <el-table-column align="center" type="index" width="100" label="序号">
      </el-table-column>
      <el-table-column prop="startTime" align="center" width="160" label="告警发生时间">
      </el-table-column>
      <!-- <el-table-column prop="project" align="center" label="告警项目">
      </el-table-column> -->
      <el-table-column prop="serial" align="center" label="电池编号">
      </el-table-column>
      <el-table-column prop="serialId" align="center" label="设备编号">
      </el-table-column>
      <el-table-column prop="content" align="center" label="告警内容">
      </el-table-column>
      <el-table-column prop="grid" align="center" label="设备坐标">
      </el-table-column>
      <el-table-column prop="level" align="center" label="告警级别">
      </el-table-column>
      <!-- <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="checkItem(scope.$index, tableData)" type="text" size="small">
            查看
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="handleSizeData" :page-size="handleSize" layout="sizes, prev, pager, next" :total="totalNum">
      </el-pagination>
    </div>
    <!-- <v-detail :alarmDetail=details></v-detail> -->
  </div>
</template>
<style scoped>
.table-wapper {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  margin-bottom: 20px;
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
import Detail from "../components/alarmdata/alarmDetail";
import { alarmList } from "../api/index.js";
import { timeFormat } from "../utils/transition.js";
export default {
  components: {
    "v-detail": Detail
  },
  data() {
    return {
      currentPage2: 1,
      handleSize: 10,
      handleSizeData: [10, 20, 30, 40, 50],
      tableData: [],
      totalNum: 0,
      details: {
        show: false,
        Form: {
          startTime: "2018-05-05 12:12:10",
          project: "电流",
          serial: "-",
          serialGroup: "x007",
          content: "放电温度过高",
          hierarchy: "整组",
          level: "高"
        }
      }
    };
  },
  methods: {
    init() {
      // let data = transLatLng(31.225388, 121.531416);
      // console.log(data);
      let pageObj = {
        pageNum: this.currentPage2,
        pageSize: this.handleSize
      };
      alarmList(pageObj)
        .then(res => {
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
            let result = res.data.data;
            console.log(result);
            this.totalNum = result.total;
            if (result.data.length > 0) {
              result.forEach(key => {
                var obj = {};
                obj.startTime = timeFormat(key.alarmedTime);
                obj.serial = key.batteryId; // 电池id
                obj.serialId = key.deviceId; // 设备id
                obj.content = key.msg; // 告警内容
                obj.level = key.level; // 告警级别
                obj.grid = key.longitude + "," + key.latitute;
                this.tableData.push(obj);
              });
            }
          }
          if (res.data.code === -1) {
            this.$message.error(res.data.msg);
          }
        })
        .catch(() => {
          this.$message.error("服务器请求超时，请稍后重试");
        });
    },
    checkItem(index, data) {
      console.log("index", index);
      console.log("data", data);
      this.details.show = true;
    },
    handleSizeChange(index) {
      // index为选中的页数
      console.log("index", index);
    },
    handleCurrentChange() {
      console.log("handleCurrentChange", this.currentPage2);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
