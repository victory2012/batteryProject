<template>
  <div>
    <div>
      <el-row :gutter="20" class="mgb20">
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-1">
              <i class="grid-con-icon iconfont">&#xe644;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.total}}</div>
                <div>{{$t('overview.total')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-2">
              <i class="grid-con-icon iconfont">&#xe656;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.monthTotal}}</div>
                <div>{{$t('overview.online')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-3">
              <i class="grid-con-icon iconfont">&#xe6a8;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.availableTotal}}</div>
                <div>{{$t('overview.offLine')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-4">
              <i class="grid-con-icon iconfont">&#xe6f5;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.invalid}}</div>
                <div>{{$t('overview.invalid')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="warrp">
      <div id="tip">
        选择省：
        <el-select v-model="defaultOption" id='province' placeholder="请选择" @change="selectChange">
          <el-option v-for="item in selectArr" :key="item.adcode" :label="item.name" :value="item.adcode">
          </el-option>
        </el-select>
      </div>
      <div id="container" class="mapWarrp"></div>
    </div> -->
    <div id="container" class="mapWarrp"></div>
  </div>
</template>
<script>
import google from "google";
import { websockets, GetDeviceList } from "../../api/index.js";
import { onError, onWarn } from "../../utils/callback.js";
let map;
let pointerObj = {};
export default {
  name: "battery",
  data() {
    return {
      lnglats: [],
      onLine: 0,
      allDevice: 0,
      limit: false,
      offLine: 0,
      markers: [],
      hasSet: false,
      sendData: { api: "bind", param: [] }
    };
  },
  methods: {
    mapInit(obj, type) {
      let allmarkerArr = Object.values(obj);
      let labelIndex = 1;
      allmarkerArr.forEach(key => {
        var lngs = key.toString().split(",");
        console.log(lngs);
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lngs[0], lngs[1]),
          label: `${labelIndex++}`,
          map: map
        });
        this.markers.push(marker);
        // marker.addListener("click", e => {
        //   var latLngData =
        //     e.latLng.lat().toFixed(6) + "," + e.latLng.lng().toFixed(6);
        //   this.$.ajax({
        //     type: "post",
        //     url:
        //       "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        //       latLngData +
        //       "&key=AIzaSyC8IXpNgfA7uD-Xb0jEqhkEdB7j3gbgOiE",
        //     async: true,
        //     success: function(data) {
        //       console.log(data);
        //       var site =
        //         "坐标：" +
        //         latLngData +
        //         "<br />" +
        //         "地址：" +
        //         data.results[0].formatted_address;
        //       var infowindow = new google.maps.InfoWindow({
        //         content: site
        //       });
        //       infowindow.open(map, marker); // 弹出信息提示窗口
        //       map.addListener("click", () => {
        //         infowindow.close();
        //       });
        //     }
        //   });
        // });
      });
      if (type) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
          bounds.extend(this.markers[i].getPosition());
        }
        map.fitBounds(bounds);
      }
    },
    /*
      http请求 获取全部电池设备
     */
    narmleHttp() {
      // let loginData = JSON.parse(sessionStorage.getItem("loginData"));
      let pageObj = {
        pageNum: 1,
        pageSize: 999999999,
        bindingStatus: ""
      };
      GetDeviceList(pageObj).then(res => {
        // console.log(res);

        if (res.data.code === 0) {
          let result = res.data.data.data;
          this.allDevice = result.length;
          this.sendData = { api: "bind", param: [] };
          pointerObj = {};
          if (result.length > 0) {
            result.forEach(key => {
              if (key.longitude && key.latitude && key.onlineStatus === 1) {
                pointerObj[key.deviceId] = `${key.latitude},${key.longitude}`;
                // if (!this.hasSet) {
                //   this.hasSet = true;
                //   map.setCenter(
                //     new google.maps.LatLng(key.latitude, key.longitude)
                //   );
                // }
                this.sendData.param.push(key.deviceId);
              }
            });
            this.mapInit(pointerObj, "http");
            this.sockets(); // websocket 请求
          } else {
            onWarn("暂无设备, 请先注册设备");
          }
        }
      });
    },
    /*
      websockets 请求
     */
    sockets() {
      websockets(ws => {
        ws.onopen = () => {
          console.log("open....");
          ws.send(JSON.stringify(this.sendData));
        };
        ws.onmessage = evt => {
          let data = JSON.parse(evt.data);
          // console.log(data);
          if (data.code === 1) {
            this.onLine = data.data;
            if (Number(this.allDevice) < Number(this.onLine)) {
              this.onLine = this.allDevice;
            }
            this.offLine = this.allDevice - this.onLine;
          }
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
              pointerObj[obj[0]] = `${obj[1]},${obj[2]}`;
            });
            this.mapInit(pointerObj);
          }
        };
        ws.onerror = () => {
          onError("服务器繁忙，请稍后重试");
          this.over();
        };
        ws.onclose = () => {
          console.log("closed......");
        };
        this.over = () => {
          ws.close();
        };
      });
    },
    initMap() {
      try {
        map = new google.maps.Map(document.getElementById("container"), {
          center: {
            lat: 0,
            lng: 0
          },
          zoom: 15
        });
        this.hasSet = false;
        this.narmleHttp();
      } catch (err) {
        onError("地图加载失败，请检查网络连接");
      }
    }
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy() {
    if (typeof this.over === "function") {
      this.over();
    }
  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
#tip {
  background-color: #fff;
  padding: 0 10px;
  border: 1px solid silver;
  box-shadow: 3px 4px 3px 0px silver;
  position: absolute;
  font-size: 12px;
  right: 30px;
  top: 153px;
  border-radius: 3px;
  line-height: 36px;
  z-index: 999;
}
.mapWarrp {
  width: 100%;
  height: calc(100vh - 232px);
}
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}
.grid-con-4 .grid-con-icon {
  background: #e6a23c;
}
.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
  position: absolute;
}

#mapContainer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.button-group {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  padding: 10px;
}

.button-group .button {
  height: 28px;
  line-height: 28px;
  background-color: #97a564;
  color: #fff;
  border: 0;
  outline: none;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  margin-bottom: 4px;
  cursor: pointer;
}

.amap-info-content {
  font-size: 12px;
}
</style>
