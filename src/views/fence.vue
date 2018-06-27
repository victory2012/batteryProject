<template>
  <div class="outer-box">
    <div id="AddContainer" class="fenceContainer"></div>
    <div class="HandleBtn" v-if="addFence">
      <span class="Tiptext">Tip：选择区域后，鼠标右键结束选区</span>
      <el-button @click="cancelSetings" type="info">取消设置</el-button>
      <el-button @click="doAddFence" type="primary">确定设置</el-button>
      <p></p>
    </div>
    <div class="HandleBtn" v-else>
      <el-button @click="ToAddFence" type="primary">添加围栏</el-button>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import { getFence, addFence } from "../api/index.js";
let map;
let marker;
let markers = [];
let polygon;
let allPointers = [];
export default {
  data() {
    return {
      addFence: false,
      json: "",
      mouseTool: null
    };
  },
  methods: {
    // 没有设置过围栏
    buildFence() {
      this.addFence = true;
      map.plugin(["AMap.MouseTool"], () => {
        this.mouseTool = new AMap.MouseTool(map);
        this.mouseTool.polygon();
        // this.mouseTool.close(true); // 移除 画多边形的功能
      });
      map.setDefaultCursor("pointer"); // 手势
      map.on("click", this.callBackFn); // 地图的点击事件
      /*
      * 鼠标右击事件 右击后 要移除地图的点击事件 和画多边形的事件
      */
      map.on("rightclick", e => {
        map.setDefaultCursor(); // 手势
        map.off("click", this.callBackFn); // 移除地图点击事件
        this.mouseTool.close(false); // 移除 画多边形的功能
      });
    },
    callBackFn(e) {
      if (markers.length === 9) {
        this.mouseTool.close(false); // 移除 画多边形的功能
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
    hasFence(gpsList) {
      this.addFence = false;
      let poi = gpsList.split(";");
      poi.forEach(res => {
        let item = res.split(",");
        let arr = [item[0], item[1]];
        allPointers.push(arr);
      });
      /*
      * 画多边形
      */
      polygon = new AMap.Polygon({
        map: map,
        strokeColor: "#0000ff",
        strokeWeight: 2,
        fillColor: "#f5deb3",
        fillOpacity: 0.3
      });
      polygon.setPath(allPointers);
      // map.setFitView(); // 地图自适应
    },
    // 确认设置 添加围栏
    doAddFence() {
      let gpsObj = {
        gpsList: this.json.substring(0, this.json.length - 1)
      };
      addFence(gpsObj)
        .then(res => {
          console.log(res);
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
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.cancelSetings();
            this.getData();
          }
          if (res.data.code === -1) {
            this.$message.error(res.data.msg);
          }
        })
        .catch(() => {
          this.$message.error("服务器请求超时，请稍后重试");
        });
    },
    /*
      取消设置
    */
    cancelSetings() {
      this.json = "";
      markers && map.remove(markers); // 清除marker点
      this.mouseTool.close(true); // 清除多边形
      markers = [];
      /*
      * 点击取消设置后 需要恢复地图的点击事件 和 “AMap.MouseTool”画多边形事件
      * 所以 在执行一下 buildFence（）方法 即可解决
      */
      this.buildFence();
    },
    getData() {
      getFence().then(res => {
        console.log(res);
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
            // result.forEach(key => {
            //   console.log("key", key);
            //   let gpsList = key.gpsList;
            //   this.hasFence(gpsList);
            // });
            this.hasFence(result[0].gpsList);
          } else {
            this.buildFence();
          }
          // this.buildFence();
        }
        if (res.data.code === -1) {
          this.$message.error(res.data.msg);
        }
      });
    },
    ToAddFence() {
      this.addFence = true;
      polygon.hide();
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