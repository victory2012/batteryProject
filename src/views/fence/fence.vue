<template>
  <div class="outer-box">
    <div id="AddContainer" class="fenceContainer"></div>
    <div class="HandleBtn" v-if="addFence">
      <span class="Tiptext">Tip：选择区域后，鼠标右键结束选区</span>
      <el-button @click="cancelSetings" type="info">取消设置</el-button>
      <el-button @click="doAddFence" type="primary">确定设置</el-button>
      <el-button @click="goBack" type="warning">返回</el-button>
      <p></p>
    </div>
    <div class="HandleBtn" v-else>
      <el-button @click="ToAddFence" type="primary">添加围栏</el-button>
      <el-button @click="ToDeleteFence" type="danger">删除围栏</el-button>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import { getFence, addFence, delFence } from "../../api/index.js";
import { onError, onWarn, onSuccess } from "../../utils/callback.js";
let map;
let marker;
let markers = [];
let mouseTool;
let mouseToolArr = [];
let polygonArr = [];
// let allPointers = [];
export default {
  data() {
    return {
      addFence: false,
      json: "",
      fenceId: "",
      polygon: null
    };
  },
  methods: {
    // 没有设置过围栏
    buildFence(obj) {
      this.addFence = true;
      map.plugin(["AMap.MouseTool"], () => {
        mouseTool = new AMap.MouseTool(map);
        mouseTool.polygon();
        // this.mouseTool.close(true); // 移除 画多边形的功能
        mouseToolArr.push(mouseTool);
      });
      map.setDefaultCursor("pointer"); // 手势
      map.on("click", this.callBackFn); // 地图的点击事件
      /*
      * 鼠标右击事件 右击后 要移除地图的点击事件 和画多边形的事件
      */
      map.on("rightclick", e => {
        map.setDefaultCursor(); // 手势
        map.off("click", this.callBackFn); // 移除地图点击事件
        mouseTool.close(false); // 移除 画多边形的功能
      });
    },
    callBackFn(e) {
      if (markers.length === 9) {
        mouseTool.close(false); // 移除 画多边形的功能
      }
      if (markers.length > 9) {
        map.setDefaultCursor(); // 手势
        map.off("click", this.callBackFn); // 移除地图点击事件
        // mouseTool.close(false); // 移除 画多边形的功能
      } else {
        this.json += `${e.lnglat.getLng()},${e.lnglat.getLat()};`; // 获取地图点击的jps坐标位置 集合
        marker = new AMap.Marker({
          map: map,
          position: [e.lnglat.getLng(), e.lnglat.getLat()]
        });
        markers.push(marker);
      }
    },
    // 已经添加了围栏，根据围栏坐标 画出围栏
    hasFence(gpsList, id) {
      this.addFence = false;
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
        if (polygonArr.length > 0) {
          polygonArr.forEach(key => {
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
      });
      map.setFitView(); // 地图自适应
    },
    // 确认设置 添加围栏
    doAddFence() {
      let gpsObj = {
        gpsList: this.json.substring(0, this.json.length - 1)
      };
      if (!gpsObj.gpsList) {
        onError("请选区围栏点");
        return;
      }
      addFence(gpsObj).then(res => {
        // console.log(res);

        if (res.data.code === 0) {
          onSuccess("添加成功");
          this.cancelSetings();
          this.getData();
        }
      });
    },
    /* 取消设置 */
    cancelSetings() {
      this.json = "";
      markers && map.remove(markers); // 清除marker点
      mouseTool.close(true); // 清除多边形
      markers = [];
      mouseTool = null;
      /*
      * 点击取消设置后 需要恢复地图的点击事件 和 “AMap.MouseTool”画多边形事件
      * 所以 在执行一下 buildFence（）方法 即可解决
      */
      this.buildFence();
    },
    /* 删除围栏 */
    ToDeleteFence() {
      if (!this.fenceId) {
        onWarn("请先选择要删除的围栏");
        return;
      }
      delFence(this.fenceId).then(res => {
        if (res.data.code === 0) {
          onSuccess("删除成功");
          this.polygon.setMap(null);
        }
      });
    },
    /* goBack 返回 */
    goBack() {
      this.cancelSetings();
      this.addFence = false;
      map.setDefaultCursor(); // 手势
      map.off("click", this.callBackFn); // 移除地图点击事件
      mouseTool.close(false); // 移除 画多边形的功能
      this.getData();
    },
    getData() {
      getFence().then(res => {
        // console.log(res);

        if (res.data.code === 0) {
          if (res.data.data.length > 0) {
            let result = res.data.data;
            result.forEach(key => {
              let gpsList = key.gpsList;
              let id = key.id;
              this.hasFence(gpsList, id);
            });
          } else {
            this.buildFence();
          }
        }
      });
    },
    ToAddFence() {
      this.addFence = true;
      markers = [];
      // console.log(mouseToolArr);
      if (mouseToolArr.length > 0) {
        mouseToolArr.forEach(key => {
          key.close(false);
        });
      }
      mouseTool = null;
      // console.log(polygonArr);
      if (polygonArr.length > 0) {
        polygonArr.forEach(key => {
          key.hide();
        });
      }
      mouseToolArr = [];
      polygonArr = [];
      this.buildFence();
    },
    init() {
      map = new AMap.Map("AddContainer", {
        resizeEnable: true,
        zoom: 5
      });
      this.getData();
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    map.destroy();
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
  padding: 5px 10px;
  border-radius: 3px;
  border: 1px solid #000;
  background: #ffffff;
}
</style>
