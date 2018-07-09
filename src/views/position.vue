<template>
  <div id="outer-box">
    <div id="positions" class="positioned"></div>
    <div id="panel">
      <div class="panelTop">
        <div id="intro" class="intro">
          <h3>
            <span>{{titles}}</span>
            <el-button @click="showAllPionter" type="text" mini>查看全部</el-button>
          </h3>
        </div>
        <ul class="list_warp">
          <li v-for="(item, index) in pointerArr" :class="[ devicelabel == item.deviceId ? 'selected': '' ]" :key="item.deviceId" @click="checkItem(item.deviceId, index)">
            <span style="margin-right:5px;">{{index + 1}}、{{deviceShow? item.deviceId : item.batteryId}}</span>
            <el-button @click="HistoryTrack(item.deviceId)" size="mini">历史轨迹</el-button>
          </li>
        </ul>
      </div>
      <div class="page">
        <el-pagination small layout="prev, pager, next" :total="10">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<style>
.list_warp {
  border-top: 1px solid #f0f0f0;
}
.list_warp li {
  position: relative;
  height: 50px;
  border-bottom: 1px solid #f0f0f0;
  line-height: 50px;
  font-size: 14px;
  color: #303133;
  cursor: pointer;
  padding-left: 10px;
}
.list_warp li button {
  position: absolute;
  top: 12px;
  right: 5px;
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
  position: relative;
  padding-left: 8px;
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 10px;
  height: 30px;
  line-height: 30px;
}
.intro h3 button {
  position: absolute;
  top: 0;
  right: 20px;
}
#outer-box {
  height: 100%;
  padding-right: 270px;
}
#panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 270px;
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
.page {
  padding-top: 20px;
  text-align: right;
}
</style>
<script>
import AMap from "AMap";
import AMapUI from "AMapUI";
import { websockets, GetDeviceList } from "../api/index.js";
import { timeFormats } from "../utils/transition.js";
import { onError, onTimeOut } from "../utils/callback";
let map;
let infoWindow;
let ponterIndex;
let batteryIdArr = {};
let pathParams; // url 中设备id 参数
let pointerObj = {};
export default {
  data() {
    return {
      pointerArr: [],
      lnglat: "",
      devicelabel: "",
      active: true,
      activeName: 1,
      markers: [],
      titles: "在线电池列表",
      deviceShow: false
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
      // console.log(this.$router);
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
            onTimeOut(this.$router);
          }
          if (res.data.code === 0) {
            let result = res.data.data;
            let sendData = {
              api: "bind",
              param: []
            };
            if (result.length > 0) {
              result.forEach(key => {
                if (key.longitude && key.latitude && key.onlineStatus === 1) {
                  // let batt = key.batteryId ? key.batteryId : "未绑定";
                  sendData.param.push(key.deviceId);
                  // batteryIdArr[key.deviceId] = batt;
                  if (key.batteryId) {
                    this.pointerArr.push(key);
                    pointerObj[key.deviceId] = `${key.longitude},${
                      key.latitude
                    },${new Date()},${key.batteryId}`;
                    batteryIdArr[key.deviceId] = key.batteryId;
                  }
                }
              });
              if (pathParams) {
                this.pointerArr.forEach((key, index) => {
                  if (key.deviceId === pathParams) {
                    this.checkItem(pathParams, index);
                  }
                });
              } else {
                this.mapInit(result);
              }
              setTimeout(() => {
                if (ws && ws.readyState === 1) {
                  ws.send(JSON.stringify(sendData));
                }
              }, 1000);
            } else {
              onError("暂无设备, 请先注册设备");
            }
          }
          if (res.data.code === -1) {
            onError(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          onError("服务器请求超时，请稍后重试");
        });
    },
    /*
      websockets 请求
     */
    sockets() {
      websockets(ws => {
        ws.onopen = () => {
          console.log("open....");
          this.narmleHttp(ws);
        };
        ws.onmessage = evt => {
          let data = JSON.parse(evt.data);
          console.log(data);
          if (data.code === 2) {
            // code 为 1时 既绑定成功，2时为 收到了数据
            if (this.markers.length > 0) {
              map.remove(this.markers);
            }
            let obj = data.data.split(",");
            let battery = batteryIdArr[obj[0]];
            obj.forEach(() => {
              pointerObj[obj[0]] = `${obj[2]},${
                obj[1]
              },${new Date()},${battery}`;
            });
            if (this.deviceId && this.deviceId.toString().length > 5) {
              let keys = Object.keys(pointerObj);
              let nextObj = {};
              keys.forEach((item, index) => {
                if (item === this.deviceId) {
                  nextObj[this.deviceId] = pointerObj[item];
                }
              });
              this.mapInit(nextObj, "fromClick");
            } else {
              this.mapInit(pointerObj, "fromWs");
            }
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
    mapInit(data, fromWs) {
      let allmarkerArr;
      let markerkeys;
      if (!fromWs) {
        let battObj;
        data.forEach(key => {
          battObj = key.batteryId ? key.batteryId : "未绑定";
          if (key.longitude && key.latitude && key.batteryId) {
            pointerObj[key.deviceId] = `${key.longitude},${
              key.latitude
            },${new Date()},${battObj}`;
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
          icon: `http://webapi.amap.com/theme/v1.3/markers/n/mark_b${i +
            1}.png`,
          position: [lngs[0], lngs[1]],
          offset: new AMap.Pixel(-12, -12),
          zIndex: 101,
          extData: {
            position: `${lngs[0]},${lngs[1]}`,
            times: lngs[2]
          },
          map: map
        });
        if (fromWs === "fromClick") {
          marker.setIcon(
            `http://webapi.amap.com/theme/v1.3/markers/n/mark_r${ponterIndex}.png`
          );
        }
        marker.setLabel({
          offset: new AMap.Pixel(15, 20),
          content: `电池编号：${lngs[3]}<br/>设备编号：${markerkeys[i]}`
        });
        // marker.setPosition([lngs[0], lngs[1]]);
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
          this.markers.forEach((key, index) => {
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
    checkItem(deviceId, index) {
      this.devicelabel = deviceId;
      this.deviceId = deviceId;
      ponterIndex = index + 1;
      infoWindow && infoWindow.close();
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
        this.mapInit(nextObj, "fromClick");
      }
    },
    showAllPionter() {
      this.devicelabel = null;
      this.deviceId = null;
      this.mapInit(pointerObj, "fromWs");
    },
    HistoryTrack(deviceId) {
      console.log(deviceId);
      this.$router.push({
        path: "history",
        query: { deviceId: deviceId }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === "device") {
        vm.titles = "设备列表";
        vm.deviceShow = true;
      }
      if (from.name === "batteryList") {
        vm.titles = "在线电池列表";
        vm.deviceShow = false;
      }
    });
  },
  mounted() {
    this.init();
  },
  created() {
    pathParams = this.$route.query.deviceId;
  },
  beforeDestroy() {
    this.over();
  }
};
</script>
