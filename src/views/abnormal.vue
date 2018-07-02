<template>
  <div class="outer-box">
    <div id="AddContainer" class="fenceContainer"></div>
    <div class="HandleBtn">
      <el-button @click="goBack" type="primary">返回</el-button>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import { getFence } from "../api/index.js";
let map;
let polygonArr = [];
export default {
  data() {
    return {
      json: "",
      fenceId: "",
      polygon: null
    };
  },
  methods: {
    // 已经添加了围栏，根据围栏坐标 画出围栏
    hasFence(gpsList, id) {
      let poi = gpsList.split(";");
      let allPointers = [];
      poi.forEach(res => {
        let item = res.split(",");
        let arr = [item[0], item[1]];
        allPointers.push(arr);
      });
      /** 画多边形 */
      var polygons = new AMap.Polygon({
        map: map,
        strokeColor: "#0000ff",
        strokeWeight: 2,
        fillColor: "#f5deb3",
        fillOpacity: 0.6,
        extData: id,
        cursor: "pointer"
      });
      polygons.setPath(allPointers);
      polygonArr.push(polygons);
      polygons.on("click", e => {
        console.log("e", e);
        if (polygonArr.length > 0) {
          polygonArr.forEach(key => {
            // console.log("key", key);
            key.setOptions({
              strokeColor: "#0000ff",
              fillColor: "#f5deb3",
              fillOpacity: 0.6,
              cursor: "pointer"
            });
            if (e.target.getExtData() === key.G.extData) {
              this.polygon = key;
            }
          });
        }
        e.target.setOptions({
          strokeColor: "#0000ff",
          fillColor: "red",
          fillOpacity: 0.6
        });
        this.fenceId = e.target.getExtData();
        console.log(e.target.getExtData());
        // console.log(e.target.getPath());
      });
      map.setFitView(); // 地图自适应
    },
    /* goBack 返回 */
    goBack() {
      this.$router.push({
        path: "alarmdata"
      });
    },
    getData() {
      getFence().then(res => {
        // console.log(res);
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
          if (res.data.data.length > 0) {
            let result = res.data.data;
            result.forEach(key => {
              // console.log("key", key);
              let gpsList = key.gpsList;
              let id = key.id;
              this.hasFence(gpsList, id);
            });
          }
        }
        if (res.data.code === -1) {
          this.$message.error(res.data.msg);
        }
      });
    },
    init() {
      let grid = this.$route.query.grid;
      if (grid) {
        let point = grid.split(";");
        map = new AMap.Map("AddContainer", {
          center: [point[0], point[1]],
          resizeEnable: true,
          zoom: 5
        });
        console.log(point);
        new AMap.Marker({
          map: map,
          position: new AMap.LngLat(point[0], point[1]),
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
        });
      } else {
        map = new AMap.Map("AddContainer", {
          resizeEnable: true,
          zoom: 5
        });
      }
      this.getData();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.outer-box {
  position: relative;
  height: 100%;
  // padding-right: 320px;
}
.Tiptext {
  color: red;
  font-size: 14px;
  padding-right: 10px;
}
.fenceContainer {
  height: 100%;
  width: 100%;
  border-radius: 5px;
}
.forms {
  width: 300px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 5px;
}
.HandleBtn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  border-radius: 3px;
  background: #ffffff;
}
</style>