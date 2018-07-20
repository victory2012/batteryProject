<template>
  <div class="outer-box">
    <div id="AddContainer" class="fenceContainer"></div>
    <div class="HandleBtn">
      <el-button @click="goBack" type="primary">返回</el-button>
    </div>
    <div class="localPosition" @click="singleDevice" title="查看设备当前位置">
      <img src="../../../static/img/local_normal.png" alt="">
    </div>
  </div>
</template>
<script>
import google from "google";
import { getFence, websockets, singleDeviceId } from "../../api/index.js";
import { onTimeOut, onError } from "../../utils/callback.js";
let map;
let grid;
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
      let poi = gpsList.substring(0, gpsList.length - 1).split(";");
      let allPointers = [];
      poi.forEach(res => {
        let item = res.split(",");
        let arr = new google.maps.LatLng(item[1], item[0]);
        allPointers.push(arr);
      });
      var bermudaTriangle = new google.maps.Polygon({
        paths: [allPointers],
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "#FFC107",
        fillOpacity: 0.6
      });
      bermudaTriangle.setMap(map);
    },
    /* goBack 返回 */
    goBack() {
      this.$router.push({
        path: "alarmdata"
      });
    },
    getData() {
      getFence().then(res => {
        if (res.data.code === 1) {
          onTimeOut(this.$router);
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
          onError(res.data.msg);
        }
      });
    },
    init() {
      try {
        map = new google.maps.Map(document.getElementById("AddContainer"), {
          center: {
            lat: 31.232803,
            lng: 121.475101
          },
          zoom: 15
        });
        if (grid) {
          let point = grid.split(";");
          let outPointer = new google.maps.LatLng(point[1], point[0]);
          map.setCenter(outPointer);
          new google.maps.Marker({
            position: outPointer,
            label: "OUT",
            title: `超出围栏点`,
            map: map
          });
        }
        this.getData();
      } catch (err) {
        onError("地图加载失败，请检查网络连接");
      }
    },
    mapInit(obj) {
      let allmarkerArr = Object.values(obj);
      allmarkerArr.forEach(key => {
        var lngs = key.toString().split(",");
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lngs[1], lngs[0]),
          title: `当前实时位置`,
          label: "NOW",
          map: map
        });
        this.markers.push(marker);
      });
    },
    localPosition(data) {
      websockets(ws => {
        ws.onopen = () => {
          console.log("open....");
          ws.send(data);
        };
        ws.onmessage = evt => {
          let data = JSON.parse(evt.data);
          console.log(data);
          if (data.code === 2) {
            if (this.markers.length > 0) {
              this.markers.forEach(key => {
                key.setMap(null);
              });
              this.markers = [];
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
    singleDevice() {
      let NowDeviceId = this.$route.query.deviceId;
      singleDeviceId(NowDeviceId)
        .then(res => {
          if (res.data.code === 1) {
            onTimeOut(this.$router);
          }
          if (res.data.code === 0) {
            let result = res.data.data;
            console.log(result);
            if (this.markers.length > 0) {
              this.markers.forEach(key => {
                key.setMap(null);
              });
              this.markers = [];
            }
            if (result) {
              pointerObj[result.deviceId] = `${result.longitude},${
                result.latitude
              }`;
              this.sendData.param.push(result.deviceId);
              this.mapInit(pointerObj);
              this.localPosition(JSON.stringify(this.sendData));
            }
          }
          if (res.data.code === -1) {
            onError(res.data.msg);
          }
        })
        .catch(() => {
          onError("服务器请求超时，请稍后重试");
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
