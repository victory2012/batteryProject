<template>
  <div id="outer-box">
    <div id="positions" class="positioned"></div>
    <div id="panel">
      <div class="panelTop">
        <div id="intro" class="intro">
          <h3>设备列表</h3>
        </div>
        <ul class="list_warp">
          <li v-for="item in pointerArr" :class="[ devicelabel == item.deviceId ? 'selected': '' ]" :key="item.deviceId" @click="checkItem(item.deviceId)">
            <span style="margin-right:5px;">{{item.deviceId}}</span>
            <el-button @click="HistoryTrack(item.deviceId)" size="mini">历史轨迹</el-button>
          </li>
        </ul>
      </div>
      <div>
        <!-- <el-pagination small layout="prev, pager, next" :total="500">
        </el-pagination> -->
      </div>
    </div>
  </div>
</template>
<style>
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
.list_warp .selected {
  background: green;
  color: #fff;
}
.positioned {
  width: 100%;
  height: calc(100vh - 110px);
}
.deviceList {
  font-size: 14px;
  max-height: 600px;
  overflow-y: auto;
}

.intro h3 {
  padding-left: 8px;
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 10px;
}
#outer-box {
  height: 100%;
  padding-right: 220px;
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
</style>

<script>
import AMap from "AMap";
import AMapUI from "AMapUI";
import { websockets, GetDeviceList } from "../api/index.js";
import { timeFormats } from "../utils/transition.js";
let map;
let infoWindow;
// let marker;
let pointerObj = {};
export default {
  data() {
    return {
      pointerArr: [],
      lnglat: "",
      devicelabel: "",
      active: true,
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
            let result = res.data.data;
            let sendData = {
              api: "bind",
              param: []
            };
            this.pointerArr = result;
            let pathParams = this.$route.query.deviceId;
            if (result.length > 0) {
              result.forEach(key => {
                if (key.longitude && key.latitude) {
                  sendData.param.push(key.deviceId);
                  pointerObj[key.deviceId] = `${key.longitude},${key.latitude}`;
                }
              });
              if (pathParams) {
                this.checkItem(pathParams);
              } else {
                this.mapInit(result);
              }
              setTimeout(() => {
                ws.send(JSON.stringify(sendData));
              }, 1200);
            } else {
              this.$message({
                message: "暂无设备, 请先注册设备",
                type: "warning"
              });
            }
          }
          if (res.data.code === -1) {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
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
          this.narmleHttp(ws);
        };
        ws.onmessage = evt => {
          let data = JSON.parse(evt.data);
          console.log(data);
          if (data.code === 1) {
            this.onLine = data.data;
          }
          if (data.code === 2) {
            // code 为 1时 既绑定成功，2时为 收到了数据
            if (this.markers.length > 0) {
              map.remove(this.markers);
            }
            let obj = data.data.split(",");
            obj.forEach(() => {
              pointerObj[obj[0]] = `${obj[2]},${obj[1]},${new Date()}`;
            });
            if (this.deviceId && this.deviceId.toString().length > 5) {
              let keys = Object.keys(pointerObj);
              let nextObj = {};
              keys.forEach((item, index) => {
                if (item === this.deviceId) {
                  nextObj[this.deviceId] = pointerObj[item];
                }
              });
              this.mapInit(nextObj, "fromWs");
            } else {
              this.mapInit(pointerObj, "fromWs");
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
    mapInit(data, fromWs) {
      let allmarkerArr;
      let markerkeys;
      if (!fromWs) {
        data.forEach(key => {
          if (key.longitude && key.latitude) {
            pointerObj[key.deviceId] = `${key.longitude},${key.latitude},${new Date()}`;
          }
        });
        allmarkerArr = Object.values(pointerObj);
        markerkeys = Object.keys(pointerObj);
      } else {
        allmarkerArr = Object.values(data);
        markerkeys = Object.keys(data);
      }
      for (let i = 0; i < allmarkerArr.length; i++) {
        var lngs = allmarkerArr[i].toString().split(",");
        var marker = new AMap.Marker({
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: [lngs[0], lngs[1]],
          offset: new AMap.Pixel(-12, -12),
          zIndex: 101,
          extData: {
            position: `${lngs[0]},${lngs[1]}`,
            times: lngs[2]
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
              this.markers.forEach(item => {
                item.setIcon(
                  "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"
                );
              });
              key.setIcon(
                "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png"
              );
              let label = key.getLabel().content.split("：")[1];
              this.devicelabel = label;
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
      this.devicelabel = deviceId;
      this.deviceId = deviceId;
      if (this.deviceId && this.deviceId.toString().length > 5 && pointerObj) {
        let keys = Object.keys(pointerObj);
        let nextObj = {};
        if (this.markers.length > 0) {
          map.remove(this.markers);
        }
        keys.forEach((item, index) => {
          if (item === this.deviceId) {
            nextObj[this.deviceId] = pointerObj[item];
          }
        });
        this.mapInit(nextObj, "fromWs");
      }
    },
    HistoryTrack(deviceId) {
      console.log(deviceId);
      this.$router.push({
        path: "history",
        query: { deviceId: deviceId }
      });
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