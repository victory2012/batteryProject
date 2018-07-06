<template>
  <div class="all">
    <div class="control">
      <div class="date">
        <vue-datepicker-local v-model="starts" clearable placeholder="选择开始时间" format="YYYY-MM-DD HH:mm:ss" show-buttons @confirm="selectedDate" />
        <vue-datepicker-local v-model="endtime" format="YYYY-MM-DD HH:mm:ss" clearable placeholder="选择结束时间" show-buttons @confirm="selectedDate" />
        <el-button v-show="trajectory" size="mini" plain @click="startOnclick" title="开始">
          <i class="iconfont icon-ic_song_next"></i>
        </el-button>
        <el-button v-show="trajectory" size="mini" plain @click="pauseOnclick" title="暂停">
          <i class="iconfont icon-artboard25copy"></i>
        </el-button>
        <el-button v-show="trajectory" size="mini" plain @click="resumeOnclick" title="继续">
          <i class="iconfont icon-icons-resume_button"></i>
        </el-button>
        <el-button v-show="trajectory" size="mini" plain @click="stopOnclick" title="停止">
          <i class="iconfont icon-stop"></i>
        </el-button>
        <el-button v-show="trajectory" type="danger" size="small" @click="heatmapFirst">活动热区</el-button>
        <el-button v-show="active" type="primary" size="mini" @click="historyTrajectory">轨迹回放</el-button>
      </div>
    </div>
    <div class="">
      <div id="mapcontainer"></div>
    </div>
    <div id="panel">
      <div class="panelTop">
        <div id="intro" class="intro">
          <h3>设备列表</h3>
        </div>
        <ul class="list_warp">
          <li v-for="item in pointerArr" :class="[ devicelabel == item.deviceId ? 'selected': '' ]" :key="item.deviceId" @click="checkItem(item.deviceId)">
            <span style="margin-right:5px;">{{item.deviceId}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="timeRange" v-show="trajectory">
      <span>时间</span>
      <el-slider v-model="timeSeconds" @change="speedChange" vertical height="200px">
      </el-slider>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import AMapUI from "AMapUI";
import { trajectory, GetDeviceList } from "../api/index.js";
import {
  timeFormatSort,
  trakTimeformat,
  yesTody
} from "../utils/transition.js";
var map, navg, heatmap, pathSimplifierIns;
let infoWindow;
export default {
  data() {
    return {
      trajectory: false,
      active: true,
      navg: null,
      map: null,
      devicelabel: "",
      starts: yesTody(),
      endtime: new Date(),
      chooseTime: [],
      pointerArr: [],
      gridData: [],
      markerArr: [],
      alldistance: 0,
      timeSeconds: 50
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    speedChange() {
      if (this.timeSeconds < 1) {
        this.timeSeconds = 1;
      }
      let speeds = Number(this.alldistance) / this.timeSeconds;
      console.log(speeds);
      navg.setSpeed(speeds);
    },
    /* 时间确认按钮 */
    selectedDate(date) {
      if (!this.starts) {
        this.$message({
          message: "请选择开始时间",
          type: "warning"
        });
        return;
      }
      if (!this.endtime) {
        this.$message({
          message: "请选择结束时间",
          type: "warning"
        });
        return;
      }
      if (Number(this.starts) > Number(this.endtime)) {
        this.$message({
          message: "开始时间应小于结束时间",
          type: "warning"
        });
        return;
      }
      let opts = {
        pushDateStart: timeFormatSort(this.starts),
        pushDateEnd: timeFormatSort(this.endtime),
        deviceId: this.devicelabel
      };
      console.log(opts);
      this.getData(opts);
    },
    /* 获取数据 */
    getData(params) {
      trajectory(params)
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
            let result = res.data.data;
            this.gridData = [];
            if (result.length > 0) {
              result.forEach(key => {
                var obj = {};
                obj.lng = key.longitude;
                obj.lat = key.latitude;
                obj.pushTime = key.pushTime;
                obj.distance = key.distance;
                obj.count = 150;
                this.gridData.push(obj);
              });
              map.setCenter([this.gridData[0].lng, this.gridData[0].lat]);
              heatmap.setDataSet({
                data: this.gridData // 热力图数据
              });
              if (this.trajectory && pathSimplifierIns) {
                pathSimplifierIns.setData();
                this.track();
              }
            } else {
              this.$message({
                message: "暂无数据",
                type: "warning"
              });
            }
          }
          if (res.data.code === -1) {
            this.$message.error(res.data.msg);
          }
        })
        .catch(() => {
          this.$message.error("服务器请求超时，请稍后重试");
        });
    },
    heatmapFirst() {
      if (this.markerArr.length > 0) {
        map.remove(this.markerArr);
      }
      this.selectByTime();
      this.trajectory = false;
      this.active = true;
      pathSimplifierIns.hide();
    },
    init() {
      map = new AMap.Map("mapcontainer", {
        resizeEnable: true,
        zoom: 15
      });
      this.selectByTime();
    },
    selectByTime() {
      AMap.plugin(["AMap.Heatmap"], () => {
        // 初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
          radius: 12, // 给定半径
          opacity: [0, 1] // 透明度
        });
      });
      this.narmleHttp();
    },
    narmleHttp() {
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      let pageObj = {
        pageNum: 1,
        pageSize: 999999999,
        manufacturerId: loginData.enterpriseId
      };
      GetDeviceList(pageObj)
        .then(res => {
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
            if (result.length > 0) {
              this.pointerArr = result;
              console.log(result);
              let deviceId = this.$route.query.deviceId;
              let params = {
                pushDateStart: timeFormatSort(this.starts),
                pushDateEnd: timeFormatSort(this.endtime)
              };
              if (deviceId) {
                this.devicelabel = deviceId;
                params.deviceId = deviceId;
                this.getData(params);
              } else if (this.devicelabel) {
                params.deviceId = this.devicelabel;
                this.getData(params);
              } else {
                this.devicelabel = result[0].deviceId;
                params.deviceId = result[0].deviceId;
                this.getData(params);
              }
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
        .catch(() => {
          this.$message.error("服务器请求超时，请稍后重试");
        });
    },
    // 历史轨迹
    historyTrajectory() {
      this.trajectory = true;
      this.active = false;
      map = new AMap.Map("mapcontainer", {
        // center: [121.52710487067272, 31.22889232359548],
        resizeEnable: false,
        zoom: 15
      });
      AMap.plugin(["AMap.Geolocation"], () => {});
      this.track();
    },
    track() {
      if (this.markerArr.length > 0) {
        map.remove(this.markerArr);
      }
      let lineArr = [];
      this.alldistance = 0;
      for (var i = 0; i < this.gridData.length; i++) {
        var lngX = this.gridData[i].lng;
        var latY = this.gridData[i].lat;
        var timer = this.gridData[i].pushTime;
        if (this.gridData[i].distance) {
          this.alldistance += this.gridData[i].distance;
        }
        lineArr.push([lngX, latY, timer]);
      }
      AMapUI.load(["ui/misc/PathSimplifier"], PathSimplifier => {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
          return;
        }
        AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
          let positionPicker = new PositionPicker({
            mode: "dragMarker",
            map: map
          });
          console.log(positionPicker);
          pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: map,
            getHoverTitle: function(pathData, pathIndex, pointIndex) {
              if (pointIndex >= 0) {
                return "第" + pointIndex + "个点";
              }
            },
            getPath: function(pathData, pathIndex) {
              console.log("pathData", pathData);
              console.log("pathIndex", pathIndex);
              return pathData.path;
            },
            renderOptions: {
              pathLineStyle: {
                strokeStyle: "rgb(193,21,52)",
                lineWidth: 6,
                dirArrowStyle: true
              },
              keyPointTolerance: 10,
              keyPointStyle: {
                radius: 3,
                fillStyle: "#20acff"
              }
            }
          });
          pathSimplifierIns.on("pointClick", function(e, info) {
            let pointIndex = info.pointIndex;
            let pathData = info.pathData;
            let point = pathData.path[pointIndex];
            let position = new AMap.LngLat(point[0], point[1]);
            positionPicker.start(position);
            positionPicker.on("success", result => {
              var info = [];
              info.push(`<div><div>时间：${trakTimeformat(point[2])}</div>`);
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
                content: info.join("<br/>") // 使用默认信息窗体框样式，显示信息内容
              });
              infoWindow.open(map, position);
              map.on("click", () => {
                infoWindow.close();
              });
            });
          });
          window.pathSimplifierIns = pathSimplifierIns;
          pathSimplifierIns.setData([
            {
              name: "轨迹",
              path: lineArr
            }
          ]);
          let speeds = Number(this.alldistance) / this.timeSeconds;
          navg = pathSimplifierIns.createPathNavigator(0, {
            loop: true,
            speed: speeds,
            pathNavigatorStyle: {
              width: 12,
              height: 18,
              strokeStyle: null,
              fillStyle: null,
              // 使用图片
              content: PathSimplifier.Render.Canvas.getImageContent(
                "../../../static/img/car.png"
              )
            }
          });
        });
        let startPot = lineArr[0];
        let endPot = lineArr[lineArr.length - 1];
        let start = new AMap.Marker({
          map: map,
          position: [startPot[0], startPot[1]], // 基点位置  开始位置
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
          zIndex: 50
        });
        let end = new AMap.Marker({
          map: map,
          position: [endPot[0], endPot[1]], // 基点位置  结束位置
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
          zIndex: 10
        });
        this.markerArr.push(start);
        this.markerArr.push(end);
      });
    },
    checkItem(deviceId) {
      if (!deviceId) return;
      let params = {
        pushDateStart: timeFormatSort(this.starts),
        pushDateEnd: timeFormatSort(this.endtime),
        deviceId: deviceId
      };
      this.devicelabel = deviceId;
      this.getData(params);
    },
    startOnclick() {
      this.historyShow();
      navg.start();
    },
    pauseOnclick() {
      this.historyShow();
      navg.pause();
      console.log(
        "当前为止走过的距离" +
          parseInt(navg.getMovedDistance() / 1000) +
          "KM,回放速度为:" +
          parseInt(navg.getSpeed()) +
          "Km/h"
      );
    },
    resumeOnclick() {
      this.historyShow();
      navg.resume();
    },

    stopOnclick() {
      this.historyShow();
      navg.stop();
      // map.clearMap();
    },
    /*
    * heatmap：hide()          ---- 隐藏热力图
    *          show()          ---- 显示热力图
    * pathSimplifierIns： hide() ---- 隐藏轨迹
    *                     show() ---- 显示轨迹
    */
    historyShow() {
      pathSimplifierIns.show();
      heatmap.hide();
    },
    heatShow() {
      pathSimplifierIns.hide();
      heatmap.show();
    }
  }
};
</script>
<style scoped>
.all {
  position: relative;
  height: 100%;
  padding-right: 220px;
}
.info {
  position: absolute;
  top: 35px;
  left: 350px;
  font-size: 12px;
}
.date {
  font-size: 16px;
}
.intro h3 {
  padding-left: 8px;
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 10px;
}
#speed {
  vertical-align: middle;
  width: 60px;
  height: 23px;
}
.control {
  position: absolute;
  top: 5px;
  right: 225px;
  padding: 5px 10px;
  border-radius: 3px;
  box-shadow: 0 0 15px #000000;
  background: #ffffff;
  line-height: 16px;
  z-index: 999;
}
#mapcontainer {
  height: calc(100vh - 110px);
}

#tip {
  position: absolute;
  top: 5px;
  right: 30px;
  padding: 0 5px;
  border-radius: 3px;
  border: 1px solid #000;
  background: #ffffff;
  line-height: 16px;
}

#tip input[type="text"] {
  border: none;
  background: #fff;
}
#panel {
  position: absolute;
  top: 0;
  right: 0;
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
.timeRange {
  position: absolute;
  top: 70px;
  right: 220px;
  z-index: 1000;
  padding: 5px 2px 15px;
  box-shadow: 0 0 15px #000000;
  background: #ffffff;
  text-align: center;
  border-radius: 3px;
}
.timeRange span {
  font-size: 12px;
}
</style>
