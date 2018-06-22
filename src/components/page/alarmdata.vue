<template>
  <div class="table-wapper">
    <el-table size="medium" :data="tableData3" style="width: 100%">
      <el-table-column align="center" type="index" width="100" label="序号">
      </el-table-column>
      <el-table-column prop="startTime" align="center" width="160" label="告警发生时间">
      </el-table-column>
      <el-table-column prop="project" align="center" label="告警项目">
      </el-table-column>
      <el-table-column prop="serial" align="center" label="电池编号">
      </el-table-column>
      <el-table-column prop="serialGroup" align="center" label="电池组编号">
      </el-table-column>
      <el-table-column prop="content" align="center" label="告警内容">
      </el-table-column>
      <el-table-column prop="hierarchy" align="center" label="告警层级">
      </el-table-column>
      <el-table-column prop="level" align="center" label="告警级别">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="checkItem(scope.$index, tableData3)" type="text" size="small">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="handleSizeData" :page-size="handleSize" layout="sizes, prev, pager, next" :total="100">
      </el-pagination>
    </div>
    <v-detail :alarmDetail=details></v-detail>
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
import Detail from "../pageComponent/alarmDetail";
import { transLatLng } from "../../utils/transition.js"; // 硬件位置坐标 转高德坐标
export default {
  components: {
    "v-detail": Detail
  },
  data() {
    return {
      currentPage2: 1,
      handleSize: 10,
      handleSizeData: [10, 20, 30, 40, 50],
      tableData3: [
        {
          startTime: "2018-05-05 12:12:10",
          project: "电流",
          serial: "-",
          serialGroup: "x007",
          content: "放电温度过高",
          hierarchy: "整组",
          level: "高"
        }
      ],
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
      let data = transLatLng(31.225388, 121.531416);
      console.log(data);
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
