<template>
  <div id="outer-box">
    <div id="positions"
      class="positioned"></div>
    <div id="panel">
      <div class="panelTop"
        v-loading="loading">
        <div id="intro"
          class="intro">
          <h3>
            <span>{{titles}}</span>
            <el-button @click="showAllPionter"
              type="text"
              mini>{{$t('positions.lookAll')}}</el-button>
          </h3>
        </div>
        <ul class="list_warp">
          <li v-for="(item, index) in pointerArr"
            :class="[ devicelabel == item.deviceId ? 'selected': '', item.onlineStatus === 0? 'off': '', devicelabel == item.batteryId ? 'selected': '' ]"
            :key="item.deviceId"
            @click="checkItem(item, index)">
            <p>{{index + 1}}、{{deviceShow? item.deviceId : item.batteryId}}</p>
            <el-badge :value="item.onLine"
              class="item">
              <el-button @click.prevent.stop="HistoryTrack(item.batteryId)"
                size="mini">{{$t('positions.track')}}</el-button>
            </el-badge>
          </li>
        </ul>
      </div>
      <div class="page">
        <el-pagination @current-change="pageChange"
          :current-page.sync="pageNum"
          small
          layout="prev, pager, next"
          :total="total">
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
  font-size: 12px;
}
.list_warp .selected {
  background: rgb(112, 191, 255);
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
import google from "google";
import { websockets, GetDeviceList } from "../../api/index.js";
import { trakTimeformat, nowDate } from "../../utils/transition.js";
import { onError } from "../../utils/callback";
let map;
let infoWindow;
let ponterIndex;
let batteryIdArr = {};
let pointerObj = {};
export default {
  data () {
    return {
      loading: false,
      pointerArr: [],
      lnglat: "",
      devicelabel: "",
      active: true,
      activeName: 1,
      pageNum: 1,
      total: 10,
      markers: [],
      markerTime: [],
      onLineData: [],
      titles: "",
      deviceShow: false,
      hasGet: false,
      bindingStatus: "",
      pathParams: "" // url 中设备id 参数
    };
  },
  methods: {
    pageChange () {
      this.over();
      if (this.markers.length > 0) {
        this.markers.forEach(key => {
          key.setMap(null);
        });
        this.markers = [];
      }
      this.getListData();
    },
    init () {
      try {
        map = new google.maps.Map(document.getElementById("positions"), {
          center: {
            lat: 0,
            lng: 0
          },
          zoom: 15
        });
        this.hasGet = false;
        this.getListData();
      } catch (err) {
        onError(this.$t("mapError"));
      }
    },
    getListData () {
      let pageObj = {
        pageNum: this.pageNum,
        pageSize: 10
        // bindingStatus: this.bindingStatus
      };
      if (this.deviceShow) {
        pageObj.bindingStatus = "";
      } else {
        pageObj.bindingStatus = 1;
      }
      this.loading = true;
      GetDeviceList(pageObj).then(res => {
        console.log(res.data);
        this.loading = false;
        if (res.data.code === 0) {
          this.pointerArr = [];
          let center = res.data.data;
          let result = center.data;
          this.total = center.total;
          let sendData = { api: "bind", param: [] };
          pointerObj = {};
          if (result.length > 0) {
            if (this.pathParams && this.pageNum === 1) {
              result.forEach((key, index) => {
                if (Number(key.latitude) > 0 && Number(key.longitude) > 0) {
                  pointerObj[key.deviceId] = `${key.latitude},${key.longitude},${trakTimeformat(key.pushTime)},${key.batteryId},${key.onlineStatus},0,${key.voltage}`;
                }
                if (key.onlineStatus === 1) {
                  key.onLine = this.$t("positions.onLine");
                  if (key.batteryId) {
                    batteryIdArr[key.deviceId] = key.batteryId; // 制作电池id 字典。以设备id作为key，电池id作为value。
                  }
                  if (!this.hasGet) {
                    this.hasGet = true;
                    map.setCenter(
                      new google.maps.LatLng(key.latitude, key.longitude)
                    );
                  }
                  if (key.deviceId) {
                    sendData.param.push(key.deviceId);
                  }
                  // pathParams 路由传参。为设备id
                } else {
                  key.onLine = this.$t("positions.offline");
                }
                if (this.pathParams === key.deviceId) {
                  this.checkItem(key, index);
                }
                this.pointerArr.push(key);
              });

              this.sockets(JSON.stringify(sendData));
            } else {
              this.mapInit(result);
            }
          }
        }
      });
    },
    // websockets 请求
    sockets (data) {
      this.WX = websockets();
      this.WX.onopen = () => {
        console.log("open....");
        this.WX.send(data);
      };
      this.WX.onmessage = evt => {
        let data = JSON.parse(evt.data);
        if (data.code === 2) {
          // code 为 1时 既绑定成功，2时为 收到了数据
          if (this.markers.length > 0) {
            // 收到websocket推送过来的数据时，如果地图上有mark点 就先清除掉。
            this.markers.forEach(key => {
              key.setMap(null);
            });
            this.markers = [];
          }
          let obj = data.data.split(",");
          let battery = batteryIdArr[obj[0]]; // 从电池id 字典中获取电池id，obj[0] 为设备id。
          let pointerObjKeys = Object.keys(pointerObj);
          let ponterIndexs = pointerObjKeys.indexOf(obj[0]);
          if (Number(obj[1]) > 0 && Number(obj[2]) > 0) {
            pointerObj[obj[0]] = `${obj[1]},${
              obj[2]
            },${nowDate()},${battery},1,1,${ponterIndexs + 1},${obj[3]}`;
            // pointerObj 对象。其key为设备id（唯一性），value为字符串、依次顺序为经度、纬度、时间、电池id、在线状态、推送数据标志
          }
          // obj.forEach(() => {
          //   pointerObj[obj[0]] = `${obj[1]},${
          //     obj[2]
          //   },${nowDate()},${battery},1,1,${ponterIndexs + 1},${obj[3]}`;
          //   // pointerObj 对象。其key为设备id（唯一性），value为字符串、依次顺序为经度、纬度、时间、电池id、在线状态、推送数据标志
          // });
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
      this.WX.onerror = () => {
        console.log("onerror...");
        onError(`${this.$t("positions.internetErr")}`);
        this.over();
      };
      this.WX.onclose = () => {
        console.log("closed...");
      };
    },
    over () {
      this.WX.close();
    },
    /*
     @params batteryIdArr 为电池ID对象 key为设备id，value为电池id
     @params pointerObj 电池坐标点对象，key为设备id，value为一个字符串，依次顺序为经度、纬度、时间、电池id。以逗号隔开
     */
    mapInit (data) {
      pointerObj = {};
      let sendData = { api: "bind", param: [] };
      // console.log(data);
      data.forEach((key, index) => {
        if (Number(key.latitude) > 0 && Number(key.longitude) > 0) {
          pointerObj[key.deviceId] = `${key.latitude},${key.longitude},${trakTimeformat(key.pushTime)},${key.batteryId},${key.onlineStatus},0,${key.voltage}`;
          // pointerObj 对象。其key为设备id（唯一性），value为字符串、依次顺序为经度、纬度、时间、电池id、在线状态、推送数据标志
        }
        if (key.onlineStatus === 1) {
          // onlineStatus 判断是否在线的标识。1 在线。0 离线；
          key.onLine = this.$t("positions.onLine");
          if (!this.hasGet) {
            this.hasGet = true;
            map.setCenter(new google.maps.LatLng(key.latitude, key.longitude));
          }
          if (key.batteryId) {
            sendData.param.push(key.deviceId);
            batteryIdArr[key.deviceId] = key.batteryId; // 制作电池id 字典。以设备id作为key，电池id作为value。
          }
        } else {
          key.onLine = this.$t("positions.offline");
        }
        this.pointerArr.push(key);
      });
      this.sockets(JSON.stringify(sendData));
      this.GaoDeMap(pointerObj);
    },
    GaoDeMap (data, fromWs) {
      if (this.markers.length > 0) {
        this.markers.forEach(key => {
          key.setMap(null);
        });
        this.markers = [];
      }
      let allmarkerArr = Object.values(data);
      let markerkeys = Object.keys(data);
      this.markerTime = [];
      for (let i = 0; i < allmarkerArr.length; i++) {
        var lngs = allmarkerArr[i].toString().split(",");
        if (lngs[0].length > 6 && lngs[1].length > 6 && lngs[4] === "1") {
          let obj = {};
          let content;
          var latLng = new google.maps.LatLng(lngs[0], lngs[1]);

          obj.voltage = lngs[7] || 0;
          if (obj.voltage) {
            content = `${this.$t("positions.batteryCode")}：${lngs[3]}\n${this.$t("positions.deviceCode")}：${markerkeys[i]}\n${this.$t("positions.voltage")}：${obj.voltage}`;
          } else {
            content = `${this.$t("positions.batteryCode")}：${lngs[3]}\n${this.$t("positions.deviceCode")}：${markerkeys[i]}`;
          }

          var marker = new google.maps.Marker({
            position: latLng,
            label: `${i + 1}`,
            title: content,
            map: map
          });
          if (fromWs === "fromClick") {
            marker.setLabel({
              text: `${ponterIndex}`
            });
          }
          obj.pointer = marker;
          obj.times = lngs[2];
          this.markerTime.push(obj);
          this.markers.push(marker);
        }
      }
      this.markerTime.forEach(key => {
        const self = this;
        let voltage = key.voltage;
        key.pointer.addListener("click", e => {
          let latLngData = e.latLng.lat().toFixed(6) + "," + e.latLng.lng().toFixed(6);
          let site;
          if (key.voltage) {
            site = `${self.$t("positions.updateTime")}：${key.times}<br />${self.$t("positions.latLng")}：${latLngData}<br />${self.$t("positions.voltage")}：${voltage}`;
          } else {
            site = `${self.$t("positions.updateTime")}：${key.times}<br />${self.$t("positions.latLng")}：${latLngData}`;
          }
          this.infowindow = new google.maps.InfoWindow({
            content: site
          });
          this.infowindow.open(map, key.pointer); // 弹出信息提示窗口
          map.addListener("click", () => {
            this.infowindow.close();
          });

          // this.$.ajax({
          //   type: "post",
          //   url:
          //     "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          //     latLngData +
          //     "&location_type=ROOFTOP&result_type=street_address&key=AIzaSyC8IXpNgfA7uD-Xb0jEqhkEdB7j3gbgOiE",
          //   async: true,
          //   success: function(data) {
          //     let address;
          //     if (data.status === "OK") {
          //       address = data.results[0].formatted_address;
          //     } else {
          //       address = `${self.$t("positions.getAdressErr")}`;
          //     }
          //     let site = `${self.$t("positions.updateTime")}：${
          //       key.times
          //     }<br />${self.$t(
          //       "positions.latLng"
          //     )}：${latLngData}<br />${self.$t(
          //       "positions.address"
          //     )}：${address}`;
          //     this.infowindow = new google.maps.InfoWindow({
          //       content: site
          //     });
          //     this.infowindow.open(map, key.pointer); // 弹出信息提示窗口
          //     map.addListener("click", () => {
          //       this.infowindow.close();
          //     });
          //   }
          // });
        });
      });
      // 只有从概览中获取marker点的时候 才需要自适应显示；
      if (!fromWs) {
        // 地图自适应显示所有点
        let bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
          bounds.extend(this.markers[i].getPosition());
        }
        map.fitBounds(bounds);
      }
    },
    /*
    * @params deviceId 电池列表 获取的设备id。
    * @params index 为列表的索引。这里取这个索引是为了让地图的mark点 显示点的是第几个。
     */
    checkItem (item, index) {
      if (item.onlineStatus === 0) return;
      if (item.latitude && item.longitude) {
        map.setCenter(new google.maps.LatLng(item.latitude, item.longitude));
      }
      this.devicelabel = item.deviceId;
      this.deviceId = item.deviceId;
      ponterIndex = index + 1;
      infoWindow && infoWindow.close(); // infoWindow 高德地图 数据展示框。
      if (this.deviceId && this.deviceId.toString().length > 5 && pointerObj) {
        let keys = Object.keys(pointerObj);
        // let nextObj = {};
        if (this.markers.length > 0) {
          this.markers.forEach(key => {
            key.setMap(null);
          });
          this.markers = [];
        }
        let selectObj = {};
        keys.forEach(items => {
          if (items === this.deviceId) {
            selectObj[this.deviceId] = pointerObj[items];
          }
        });
        console.log(selectObj);
        this.GaoDeMap(selectObj, "fromClick");
      }
    },
    // 查看所有点
    showAllPionter () {
      this.devicelabel = null;
      this.deviceId = null;
      this.GaoDeMap(pointerObj, "fromWs");
    },
    // 查看历史轨迹。路由传参 设备id
    HistoryTrack (batteryId) {
      // this.$router.push({
      //   path: "googleHis",
      //   query: { batteryId: batteryId }
      // });
      let userData = JSON.parse(sessionStorage.getItem("loginData"));
      if (userData.mapType === 0) {
        this.$router.push({
          path: "history",
          query: { batteryId: batteryId }
        });
      }
      if (userData.mapType === 1) {
        this.$router.push({
          path: "googleHis",
          query: { batteryId: batteryId }
        });
      }
    }
  },
  /*
  * 用beforeRouteEnter 这个路由钩子函数 来判断是从哪个路由跳转过来的
  * 以此来处理列表显示内容
  */
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === "device" && vm.pathParams) {
        vm.titles = vm.$t("positions.title1");
        vm.deviceShow = true;
        vm.bindingStatus = "";
      }
      if (from.name === "batteryList" && vm.pathParams) {
        vm.titles = vm.$t("positions.title2");
        vm.deviceShow = false;
        vm.bindingStatus = 1;
      }
    });
  },
  mounted () {
    this.pathParams = this.$route.query.deviceId;
    this.init();
  },
  beforeDestroy () {
    if (typeof this.over === "function") {
      this.over();
    }
  }
};
</script>
