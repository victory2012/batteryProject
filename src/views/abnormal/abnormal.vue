<template>
  <div class="outer-box">
    <div id="AddContainer" class="fenceContainer"></div>
    <div class="HandleBtn">
      <el-button @click="goBack" type="primary">返回</el-button>
    </div>
    <div class="localPosition" @click="localPosition" title="查看设备当前位置">
      <img src="../../../static/img/local_normal.png" alt="">
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import { getFence, websockets, singleDeviceId } from "../../api/index.js";
import { onWarn, onError } from "../../utils/callback.js";
let map;
let grid;
let polygonArr = [];
let pointerObj = {};
export default {
  data() {
    return {
      json: "",
      fenceId: "",
      polygon: null,
      sendData: { api: "bind", param: [] },
      markers: []
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
      });
    },
    init() {
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
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
          label: {
            content: "超出围栏点",
            offset: new AMap.Pixel(20, 20)
          }
        });
      } else {
        map = new AMap.Map("AddContainer", {
          resizeEnable: true,
          zoom: 5
        });
      }
      this.getData();
    },
    mapInit(obj) {
      let allmarkerArr = Object.values(obj);
      allmarkerArr.forEach(key => {
        var lngs = key.toString().split(",");
        var marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: `http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png`,
            size: new AMap.Size(20, 35)
          }),
          position: [lngs[0], lngs[1]],
          offset: new AMap.Pixel(-12, -12),
          zIndex: 101,
          map: map
        });
        marker.setLabel({
          offset: new AMap.Pixel(20, 20),
          content: "当前实时位置"
        });
        this.markers.push(marker);
      });
    },
    localPosition() {
      websockets(ws => {
        ws.onopen = () => {
          console.log("open....");
          this.singleDevice(ws);
        };
        ws.onmessage = evt => {
          let data = JSON.parse(evt.data);
          console.log(data);
          if (data.code === 2) {
            if (this.markers.length > 0) {
              map.remove(this.markers);
            }
            // code 为 1时 既绑定成功，2时为 收到了数据
            let obj = data.data.split(",");
            obj.forEach(() => {
              pointerObj[obj[0]] = `${obj[2]},${obj[1]}`;
            });
            this.mapInit(pointerObj);
          }
        };
        ws.onerror = () => {
          console.log("onerror...");
          onError("服务器繁忙，请稍后重试。");
          this.over();
        };
        this.over = () => {
          ws.close();
        };
      });
    },
    singleDevice(ws) {
      let NowDeviceId = this.$route.query.deviceId;
      singleDeviceId(NowDeviceId).then(res => {
        if (res.data.code === 0) {
          let result = res.data.data;
          console.log(result);
          if (result) {
            pointerObj[result.deviceId] = `${result.longitude},${
              result.latitude
            }`;
            this.sendData.param.push(result.deviceId);
            this.mapInit(pointerObj);
            setTimeout(() => {
              ws.send(JSON.stringify(this.sendData));
            }, 1000);
          } else {
            onWarn("暂无设备, 请先注册设备");
          }
        }
      });
    }
  },
  mounted() {
    grid = this.$route.query.grid;
    this.init();
  },
  beforeDestroy() {
    if (typeof this.over === "function") {
      this.over();
    }
  }
};
</script>
<style lang="less" scoped>
.outer-box {
  position: relative;
  height: 100%;
  // padding-right: 320px;
}
.localPosition {
  position: absolute;
  width: 25px;
  height: 25px;
  padding: 5px;
  bottom: 30px;
  left: 20px;
  z-index: 1000;
  background: #ffffff;
  border-radius: 3px;
  cursor: pointer;
  box-shadow: 0px 0px 10px #333333;
}
.localPosition img {
  width: 25px;
  height: auto;
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
