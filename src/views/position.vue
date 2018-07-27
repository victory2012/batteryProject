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
          <li v-for="(item, index) in pointerArr" :class="[ devicelabel == item.deviceId ? 'selected': '', item.onlineStatus === 0? 'off': '', devicelabel == item.batteryId ? 'selected': '' ]" :key="item.deviceId" @click="checkItem(item, index)">
            <p>{{index + 1}}、{{deviceShow? item.deviceId : item.batteryId}}</p>
            <el-badge :value="item.onLine" class="item">
              <el-button @click.prevent.stop="HistoryTrack(item.batteryId)" size="mini">历史轨迹</el-button>
            </el-badge>
          </li>
        </ul>
      </div>
      <div class="page">
        <el-pagination @current-change="pageChange" :current-page.sync="pageNum" small layout="prev, pager, next" :total="total">
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
.list_warp li.off {
  cursor: not-allowed;
}
.off .el-badge__content {
  background: #f0f0f0;
  color: #b3b2b2;
}
.list_warp .el-badge__content.is-fixed {
  top: 13px;
  right: 12px;
}
.list_warp li .item {
  position: absolute;
  top: 0;
  right: 34px;
}
.list_warp li p {
  width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
import { timeFormats, trakTimeformat } from "../utils/transition.js";
import { onError, onTimeOut } from "../utils/callback";
let map;
let infoWindow;
let ponterIndex;
let batteryIdArr = {};
let pointerObj = {};
export default {
  data() {
    return {
      pointerArr: [],
      lnglat: "",
      devicelabel: "",
      active: true,
      activeName: 1,
      pageNum: 1,
      total: 10,
      markers: [],
      onLineData: [],
      titles: "电池列表",
      deviceShow: false,
      pathParams: "" // url 中设备id 参数
    };
  },
  methods: {
    pageChange() {
      this.over();
      this.markers && map.remove(this.markers);
      this.getListData();
    },
    init() {
      map = new AMap.Map("positions", {
        resizeEnable: true,
        center: [121.533669, 31.225885],
        zoom: 15
      });
      this.getListData();
      // console.log(this.$router);
    },
    getListData() {
      let pageObj = {
        pageNum: this.pageNum,
        pageSize: 10
      };
      if (this.deviceShow) {
        pageObj.bindingStatus = "";
      } else {
        pageObj.bindingStatus = 1;
      }
      GetDeviceList(pageObj).then(res => {
        console.log(res.data);
        if (res.data.code === 1) {
          onTimeOut(this.$router);
        }
        if (res.data.code === 0) {
          this.pointerArr = [];
          let result = res.data.data.data;
          this.total = res.data.data.total;
          let sendData = { api: "bind", param: [] };
          pointerObj = {};
          if (result.length > 0) {
            if (this.pathParams) {
              result.forEach((key, index) => {
                pointerObj[key.deviceId] = `${key.longitude},${
                  key.latitude
                },${timeFormats(new Date())},${key.batteryId},${
                  key.onlineStatus
                }`;
                if (key.onlineStatus === 1) {
                  key.onLine = "在线";
                  if (key.deviceId) {
                    sendData.param.push(key.deviceId);
                  }
                  if (key.batteryId) {
                    batteryIdArr[key.deviceId] = key.batteryId; // 制作电池id 字典。以设备id作为key，电池id作为value。
                  }
                  // pathParams 路由传参。为设备id
                  if (this.pathParams === key.deviceId) {
                    console.log("pathParams", this.pathParams);
                    this.checkItem({ deviceId: this.pathParams }, index);
                  }
                } else {
                  key.onLine = "离线";
                }
                this.pointerArr.push(key);
              });
              this.sockets(JSON.stringify(sendData));
            } else {
              this.mapInit(result);
            }
          } else {
            onError("暂无设备, 请先注册设备");
          }
        }
        if (res.data.code === -1) {
          onError(res.data.msg);
        }
      });
    },
    // websockets 请求
    sockets(data) {
      websockets(ws => {
        ws.onopen = () => {
          console.log("open....");
          ws.send(data);
        };
        ws.onmessage = evt => {
          let data = JSON.parse(evt.data);
          console.log(data);
          if (data.code === 2) {
            // code 为 1时 既绑定成功，2时为 收到了数据
            if (this.markers.length > 0) {
              // 收到websocket推送过来的数据时，如果地图上有mark点 就先清除掉。
              map.remove(this.markers);
            }
            let obj = data.data.split(",");
            let battery = batteryIdArr[obj[0]]; // 从电池id 字典中获取电池id，obj[0] 为设备id。
            obj.forEach(() => {
              pointerObj[obj[0]] = `${obj[2]},${
                obj[1]
              },${new Date()},${battery},1`; // pointerObj 对象。其key为设备id（唯一性），value为字符串、依次顺序为经度、纬度、时间、电池id。以逗号隔开
            });
            if (this.deviceId || this.pathParams) {
              let keys = Object.keys(pointerObj);
              let nextObj = {};
              keys.forEach((item, index) => {
                if (item === this.deviceId || item === this.pathParams) {
                  nextObj[item] = pointerObj[item];
                }
              });
              this.GaoDeMap(nextObj, "fromClick");
            } else {
              this.GaoDeMap(pointerObj, "fromWs");
            }
          }
        };
        ws.onerror = () => {
          console.log("onerror...");
          onError("服务器繁忙，请稍后重试。");
          this.over();
        };
        ws.onclose = () => {
          console.log("closed...");
        };
        this.over = () => {
          ws.close();
        };
      });
    },
    /*
     @params batteryIdArr 为电池ID对象 key为设备id，value为电池id
     @params pointerObj 电池坐标点对象，key为设备id，value为一个字符串，依次顺序为经度、纬度、时间、电池id。以逗号隔开
     */
    mapInit(data) {
      pointerObj = {};
      let sendData = { api: "bind", param: [] };
      data.forEach((key, index) => {
        pointerObj[key.deviceId] = `${key.longitude},${
          key.latitude
        },${trakTimeformat(key.pushTime)},${key.batteryId},${key.onlineStatus}`;
        if (key.onlineStatus === 1) {
          key.onLine = "在线";
          if (key.batteryId) {
            // onlineStatus 判断是否在线的标识。1 在线。0 离线；
            sendData.param.push(key.deviceId);
            batteryIdArr[key.deviceId] = key.batteryId; // 制作电池id 字典。以设备id作为key，电池id作为value。
          }
        } else {
          key.onLine = "离线";
        }
        this.pointerArr.push(key);
      });
      this.sockets(JSON.stringify(sendData));
      this.GaoDeMap(pointerObj);
    },
    GaoDeMap(data, fromWs) {
      this.markers && map.remove(this.markers);
      let allmarkerArr = Object.values(data);
      let markerkeys = Object.keys(data);
      for (let i = 0; i < allmarkerArr.length; i++) {
        var lngs = allmarkerArr[i].toString().split(",");
        if (lngs[0].length > 6 && lngs[1].length > 6 && lngs[4] === "1") {
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
          this.markers.push(marker);
        }
      }
      if (this.markers.length > 0) {
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
        });
      }
      // map.setFitView(); // 自适应地图
    },
    /*
    * @params deviceId 电池列表 获取的设备id。
    * @params index 为列表的索引。这里取这个索引是为了让地图的mark点 显示点的是第几个。
     */
    checkItem(item, index) {
      if (item.onlineStatus === 0) return;
      this.devicelabel = item.deviceId;
      this.deviceId = item.deviceId;
      ponterIndex = index + 1;
      infoWindow && infoWindow.close(); // infoWindow 高德地图 数据展示框。
      if (this.deviceId && this.deviceId.toString().length > 5 && pointerObj) {
        let keys = Object.keys(pointerObj);
        // let nextObj = {};
        if (this.markers.length > 0) {
          map.remove(this.markers);
        }
        let selectObj = {};
        keys.forEach(items => {
          if (items === this.deviceId) {
            selectObj[this.deviceId] = pointerObj[items];
          }
        });
        this.GaoDeMap(selectObj, "fromClick");
      }
    },
    // 查看所有点
    showAllPionter() {
      this.devicelabel = null;
      this.deviceId = null;
      this.GaoDeMap(pointerObj, "fromWs");
    },
    // 查看历史轨迹。路由传参 设备id
    HistoryTrack(batteryId) {
      this.$router.push({
        path: "history",
        query: { batteryId: batteryId }
      });
    }
  },
  /*
  * 用beforeRouteEnter 这个路由钩子函数 来判断是从哪个路由跳转过来的
  * 以此来处理列表显示内容
  */
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === "device" && vm.pathParams) {
        vm.titles = "设备列表";
        vm.deviceShow = true;
      }
      if (from.name === "batteryList" && vm.pathParams) {
        vm.titles = "在线电池列表";
        vm.deviceShow = false;
      }
    });
  },
  mounted() {
    this.init();
  },
  created() {
    this.pathParams = this.$route.query.deviceId; // 路由参数
  },
  beforeDestroy() {
    map.destroy();
    this.over();
  }
};
</script>
