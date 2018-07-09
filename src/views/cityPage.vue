<template>
  <div>
    <div>
      <el-row :gutter="20" class="mgb20">
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-1">
              <i class="grid-con-icon iconfont">&#xe644;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{allDevice}}</div>
                <div>电池总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-2">
              <i class="grid-con-icon iconfont">&#xe656;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{onLine}}</div>
                <div>在线电池</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-3">
              <i class="grid-con-icon iconfont">&#xe6a8;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{offLine}}</div>
                <div>离线电池</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-4">
              <i class="grid-con-icon iconfont">&#xe6f5;</i>
              <div class="grid-cont-right">
                <div class="grid-num">0</div>
                <div>无效电池</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="warrp">
      <div id="tip">
        选择省：
        <el-select v-model="defaultOption" id='province' placeholder="请选择" @change="selectChange">
          <el-option v-for="item in selectArr" :key="item.adcode" :label="item.name" :value="item.adcode">
          </el-option>
        </el-select>
      </div>
      <div id="container" class="mapWarrp"></div>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import { websockets, GetDeviceList } from "../api/index.js";
import { onTimeOut, onError, onWarn } from "../utils/callback.js";
let map;
let polygons = [];
let district;
// let markerArr = {};
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
      sendData: { api: "bind", param: [] },
      selectArr: [
        {
          adcode: "all",
          name: "全国"
        }
      ],
      defaultOption: "全国"
    };
  },
  methods: {
    getCityData(data) {
      let bounds = data.boundaries;
      if (bounds) {
        for (let i = 0, l = bounds.length; i < l; i++) {
          let polygon = new AMap.Polygon({
            map: map,
            strokeWeight: 1,
            strokeColor: "#0048ff",
            fillColor: "#99fbd2",
            fillOpacity: 0.5,
            path: bounds[i]
          });
          polygons.push(polygon);
        }
        map.setFitView(); // 地图自适应
      }
      let subList = data.districtList;
      if (data.level === "country") {
        // this.selectArr = subList;
        subList.forEach(key => {
          this.selectArr.push(key);
        });
      }
      if (this.limit) {
        setTimeout(() => {
          map.setLimitBounds(map.getBounds());
        }, 300);
      }
      // map.setFitView(); // 地图自适应
    },
    // 检查是否已经设置了区域设置
    getLimitBounds() {
      let limitBounds = map.getLimitBounds();
      if (limitBounds) {
        return true;
      } else {
        return false;
      }
    },
    selectChange() {
      this.limit = true;
      // 先获取一下是否已经设置了区域限制，如果设置了 就先清除掉
      if (this.getLimitBounds()) {
        map.clearLimitBounds();
      }
      for (var i = 0, l = polygons.length; i < l; i++) {
        polygons[i].setMap(null);
      }
      district.setLevel("province");
      district.setExtensions("all");
      district.search(this.defaultOption, (status, result) => {
        if (status === "complete") {
          this.getCityData(result.districtList[0]);
        }
      });
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
          clickable: true,
          map: map
        });
        this.markers.push(marker);
      });
    },
    /*
      http请求 获取全部电池设备
     */
    narmleHttp(ws) {
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      let pageObj = {
        pageNum: 1,
        pageSize: 999999999,
        manufacturerId: loginData.enterpriseId
      };
      GetDeviceList(pageObj)
        .then(res => {
          console.log(res);
          if (res.data.code === 1) {
            onTimeOut(this.$router);
          }
          if (res.data.code === 0) {
            let result = res.data.data;
            this.allDevice = result.length;
            if (result.length > 0) {
              result.forEach(key => {
                this.sendData.param.push(key.deviceId);
                if (key.longitude && key.latitude && key.onlineStatus === 1) {
                  pointerObj[key.deviceId] = `${key.longitude},${key.latitude}`;
                }
              });
              this.mapInit(pointerObj);
              setTimeout(() => {
                if (ws && ws.readyState === 1) {
                  ws.send(JSON.stringify(this.sendData));
                }
              }, 1000);
            } else {
              onWarn("暂无设备, 请先注册设备");
            }
          }
          if (res.data.code === -1) {
            onError(res.data.msg);
          }
        })
        .catch(() => {
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
          if (data.code === 1) {
            this.onLine = data.data;
            if (Number(this.allDevice) < Number(this.onLine)) {
              this.onLine = this.allDevice;
            }
            this.offLine = this.allDevice - this.onLine;
          }
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
          onError("服务器繁忙，请稍后重试");
          this.over();
        };
        this.over = () => {
          ws.close();
        };
      });
    },
    init() {
      map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 10
      });
      AMap.service("AMap.DistrictSearch", () => {
        district = new AMap.DistrictSearch({
          subdistrict: 1,
          showbiz: false,
          level: "province"
        });
        district.search("中国", (status, result) => {
          if (status === "complete") {
            let data = result.districtList[0];
            this.getCityData(data);
          }
        });
      });
      this.sockets();
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
