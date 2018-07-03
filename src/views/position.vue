<template>
  <div id="outer-box">
    <div id="positions" class="positions"></div>
    <div id="panel">
      <div class="panelTop">
        <div id="intro" class="intro">
          <h3>设备列表</h3>
        </div>
        <ul class="list_warp">
          <li v-for="item in pointerArr" :key="item.deviceId" @click="checkItem(item.deviceId)">{{item.deviceId}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import AMapUI from "AMapUI";
import { websockets, GetDeviceList } from "../api/index.js";
import { timeFormats } from "../utils/transition.js";
let map;
let infoWindow;
let pointerObj = {};
export default {
  data() {
    return {
      pointerArr: [],
      lnglat: "",
      activeName: 1,
      markers: []
    };
  },
  methods: {
    init() {
      map = new AMap.Map("positions", {
        resizeEnable: true,
        center: [121.533669, 31.225885],
        zoom: 15
      });
      this.sockets();
      // map.setFitView();
    },
    narmleHttp(ws) {
      let pageObj = {
        pageNum: 1,
        pageSize: 999999999
      };
      GetDeviceList(pageObj)
        .then(res => {
          console.log(res.data);
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
            let sendData = {
              api: "bind",
              param: []
            };
            this.pointerArr = [];
            let result = res.data.data;
            console.log(result);
            result.forEach(key => {
              sendData.param.push(key.deviceId);
              this.pointerArr.push(key);
            });
            ws.send(JSON.stringify(sendData));
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
      websockets 请求
     */
    sockets(item) {
      websockets(ws => {
        ws.onopen = () => {
          console.log("open....");
          // this.narmleHttp(ws);
          // console.log(this.$route);
          let deviceId = this.$route.query.deviceId;
          if (deviceId) {
            ws.send(JSON.stringify({ api: "bind", param: [deviceId] }));
          } else if (item) {
            ws.send(JSON.stringify({ api: "bind", param: [item] }));
          } else {
            this.narmleHttp(ws);
          }
        };
        ws.onmessage = evt => {
          this.markers && map.remove(this.markers);
          // console.log("onmessage...", evt);
          let data = JSON.parse(evt.data);
          console.log(data);
          if (data.code === 1) {
            this.onLine = data.data;
          }
          if (data.code === 2) {
            // code 为 1时 既绑定成功，2时为 收到了数据
            let obj = data.data.split(",");
            obj.forEach(() => {
              pointerObj[obj[0]] = `${obj[2]},${obj[1]}`;
            });
            if (this.deviceId && this.deviceId.toString().length > 5) {
              let keys = Object.keys(pointerObj);
              let nextObj = {};
              keys.forEach((item, index) => {
                if (item === this.deviceId) {
                  nextObj[this.deviceId] = pointerObj[item];
                }
              });
              this.mapInit(nextObj);
            } else {
              this.mapInit(pointerObj);
            }
          }
        };
        ws.onerror = () => {
          console.log("onerror...");
          this.$message({
            message: "服务器繁忙，请稍后重试。",
            type: "error"
          });
          this.over();
        };
        this.over = () => {
          ws.close();
        };
      });
    },
    mapInit(data) {
      let allmarkerArr = Object.values(data);
      let markerkeys = Object.keys(data);
      this.markers = [];
      for (let i = 0; i < allmarkerArr.length; i++) {
        var lngs = allmarkerArr[i].toString().split(",");
        var marker = new AMap.Marker({
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: [lngs[0], lngs[1]],
          offset: new AMap.Pixel(-12, -12),
          zIndex: 101,
          extData: {
            position: `${lngs[0]},${lngs[1]}`,
            times: new Date()
          },
          clickable: true,
          map: map
        });
        marker.setLabel({
          offset: new AMap.Pixel(15, 20),
          content: `设备编号：${markerkeys[i]}`
        });
        marker.setPosition([lngs[0], lngs[1]]);
        this.markers.push(marker);
      }
      // allmarkerArr.forEach(key => {});
      AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
        let positionPicker = new PositionPicker({
          mode: "dragMarker",
          map: map,
          iconStyle: {
            url: "../../static/img/iocna.png",
            size: [1, 1],
            ancher: [1, 1]
          }
        });
        if (this.markers.length > 0) {
          this.markers.forEach(key => {
            key.on("click", e => {
              let pointerData = key.getExtData();
              let point = pointerData.position.split(",");
              let position = new AMap.LngLat(point[0], point[1]);
              positionPicker.start(position);
              positionPicker.on("success", result => {
                var info = [];
                info.push(
                  `<div><div>更新时间：${timeFormats(pointerData.times)}</div>`
                );
                info.push(
                  `<div style="font-size:14px;">路口 :${
                    result.nearestJunction
                  }</div>`
                );
                info.push(
                  `<div style="font-size:14px;">地址 :${
                    result.address
                  }</div></div>`
                );
                infoWindow = new AMap.InfoWindow({
                  content: info.join("<br/>"), // 使用默认信息窗体框样式，显示信息内容
                  autoMove: false,
                  offset: new AMap.Pixel(0, -10)
                });
                infoWindow.open(map, position);
              });
            });
            map.on("click", () => {
              infoWindow && infoWindow.close();
            });
          });
        }
      });
      // map.setFitView(); // 自适应地图
    },
    checkItem(deviceId) {
      this.deviceId = deviceId;
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.over();
  }
};
</script>
<style scoped>
.list_warp {
  border-top: 1px solid #f0f0f0;
}
.list_warp li {
  height: 50px;
  border-bottom: 1px solid #f0f0f0;
  line-height: 50px;
  font-size: 14px;
  color: #303133;
  cursor: pointer;
  padding-left: 10px;
}
.positions {
  width: 100%;
  height: calc(100vh - 110px);
}
.deviceList {
  font-size: 14px;
  max-height: 600px;
  overflow-y: auto;
}
.deviceList h2 {
  font-weight: 600;
  font-size: 14px;
}
.deviceList li {
  cursor: pointer;
  padding: 5px;
}
.deviceList li:hover {
  background: #f0f0f0;
  border-left: 2px solid red;
}
.desc {
  padding-left: 20px;
}
.intro h3 {
  padding-left: 8px;
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 10px;
}
.amap-marker-label {
  display: none;
}
#outer-box {
  height: 100%;
  padding-right: 220px;
}
#container {
  height: 100%;
  width: 100%;
}
#panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 220px;
  box-sizing: border-box;
  padding: 10px 0;
  height: calc(100vh - 110px);
  background: #ffffff;
  border-left: 1px solid #f0f0f0;
  z-index: 999;
}
.panelTop {
  height: auto;
  padding: 0 5px;
  overflow-x: hidden;
  background: #ffffff;
}
.history {
  position: absolute;
  bottom: -50px;
  left: 0;
  z-index: 1000;
}
</style>
