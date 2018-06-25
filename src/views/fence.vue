<template>
  <div class="outer-box">
    <div id="AddContainer" class="fenceContainer"></div>
    <div class="HandleBtn" v-show="addFence">
      <el-button type="info">取消设置</el-button>
      <el-button type="primary">确定设置</el-button>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
// import * as api from "../api/index.js";
// let json = {
//   name: "测试围栏高德",
//   enable: "true",
//   points: "",
//   repeat: "Mon,Tues,Wed,Thur,Fri,Sat,Sun",
//   desc: "测试围栏描述",
//   alert_condition: "enter;leave"
// };
let map;
let marker;
let allPointers = [];
let pointers =
  "109.102039,41.467529;106.685046,40.938516;105.542468,39.935115;103.081531,38.60839;102.554187,36.447907;102.114734,34.588108;105.586414,33.970809;112.83739,33.751859;114.419421,36.377175;114.99071,40.170581;113.232898,41.795988;111.562976,42.382993";
export default {
  data() {
    return {
      addFence: false,
      json: {
        points: ""
      }
    };
  },
  methods: {
    buildFence() {
      this.addFence = true;
      map.setDefaultCursor("pointer");
      map.on("click", e => {
        if (!this.hasMarked) {
          this.json.points += `${e.lnglat.getLng()},${e.lnglat.getLat()};`;
          marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [e.lnglat.getLng(), e.lnglat.getLat()]
          });
          marker.setMap(map);
          console.log(this.json);
        }
      });
    },
    hasFence() {
      this.addFence = false;
      let poi = pointers.split(";");
      poi.forEach(res => {
        console.log(res);
        var item = res.split(",");
        var arr = [item[0], item[1]];
        allPointers.push(arr);
      });
      // console.log("allPointers", allPointers);
      var polygon = new AMap.Polygon({
        map: map,
        strokeColor: "#97EC71",
        strokeWeight: 2,
        fillColor: "#D1B3E3",
        fillOpacity: 0.7
      });
      polygon.setPath(allPointers);
      map.setFitView();
    },
    init() {
      // 数据请求 go here
      map = new AMap.Map("AddContainer", {
        resizeEnable: true,
        zoom: 5
      });
      this.buildFence();
      // this.hasFence();
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
  padding: 5px 10px;
  border-radius: 3px;
  border: 1px solid #000;
  background: #ffffff;
}
</style>