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
          <h3>电池列表</h3>
        </div>
        <ul class="list_warp">
          <li v-for="(item, index) in pointerArr" :class="[ devicelabel == item.batteryId ? 'selected': '',devicelabel == item.deviceId ? 'selected': '' ]" :key="item.deviceId" @click="checkItem(item)">
            <span style="margin-right:5px;">{{index+1}}、{{item.batteryId}}</span>
          </li>
        </ul>
      </div>
      <div class="page">
        <el-pagination @current-change="pageChange" :current-page.sync="pageNum" small layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="timeRange" v-show="trajectory">
      <span>时间(s)</span>
      <el-slider v-model="timeSeconds" @change="speedChange" vertical height="200px">
      </el-slider>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import AMapUI from "AMapUI";
import { GetTrajectory, GetDeviceList } from "../api/index.js";
import {
  timeFormatSort,
  trakTimeformat,
  yesTody
} from "../utils/transition.js";
import { onWarn, onTimeOut, onError } from "../utils/callback.js";
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
      timeSeconds: 50,
      pageNum: 1,
      total: 10
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    pageChange() {
      let pageObj = {
        pageNum: this.pageNum,
        pageSize: 10
      };
      this.getHisData(pageObj)
    },
    speedChange() {
      if (this.timeSeconds < 1) {
        this.timeSeconds = 1;
      }
      let distance = Number(this.alldistance) / 1000;
      let times = Number(this.timeSeconds) / 3600;
      let speeds = Math.ceil(distance / times);
      navg.setSpeed(speeds);
    },
    /* 时间确认按钮 */
    selectedDate(date) {
      if (!this.starts) {
        onWarn("请选择开始时间");
        return;
      }
      if (!this.endtime) {
        onWarn("请选择结束时间");
        return;
      }
      if (Number(this.starts) > Number(this.endtime)) {
        onWarn("开始时间应小于结束时间");
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
      GetTrajectory(params)
        .then(res => {
          console.log(res);
          if (res.data.code === 1) {
            onTimeOut(this.$router);
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
              if (this.active) {
                heatmap.show();
              }
            } else {
              if (pathSimplifierIns) {
                pathSimplifierIns.setData();
                this.track();
              }
              onWarn("此设备暂无历史数据");
              heatmap.hide();
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
    heatmapFirst() {
      if (this.markerArr.length > 0) {
        map.remove(this.markerArr);
      }
      // this.selectByTime();
      this.trajectory = false;
      this.active = true;
      heatmap.show();
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
      this.getHisData();
    },
    getHisData() {
      let pageObj = {
        pageNum: this.pageNum,
        pageSize: 10
      };
      GetDeviceList(pageObj)
        .then(res => {
          if (res.data.code === 1) {
            onTimeOut(this.$router);
          }
          if (res.data.code === 0) {
            let result = res.data.data.data;
            this.pointerArr = [];
            if (result.length > 0) {
              result.forEach(key => {
                if (key.batteryId) {
                  this.pointerArr.push(key);
                }
              });
              this.total = res.data.data.total;
              let deviceId = this.$route.query.deviceId;
              let params = {
                pushDateStart: timeFormatSort(this.starts),
                pushDateEnd: timeFormatSort(this.endtime)
              };
              if (deviceId && this.pageNum === 1) {
                this.devicelabel = deviceId;
                params.deviceId = deviceId;
                this.getData(params);
              } else {
                this.devicelabel = result[0].batteryId;
                params.batteryId = result[0].batteryId;
                this.getData(params);
              }
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
    // 历史轨迹
    historyTrajectory() {
      this.trajectory = true;
      this.active = false;
      this.track();
    },
    track() {
      heatmap.hide();
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
      if (lineArr.length < 1) {
        return;
      }
      AMapUI.load(["ui/misc/PathSimplifier"], PathSimplifier => {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
          return;
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
          let distance = Number(this.alldistance) / 1000;
          let times = Number(this.timeSeconds) / 3600;
          let speeds = Math.ceil(distance / times);
          // let speeds = Number(this.alldistance) / this.timeSeconds;
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
    checkItem(item) {
      let params = {
        pushDateStart: timeFormatSort(this.starts),
        pushDateEnd: timeFormatSort(this.endtime),
        batteryId: item.batteryId
      };
      this.devicelabel = item.batteryId;
      this.getData(params);
    },
    startOnclick() {
      this.historyShow();
      navg.start();
    },
    pauseOnclick() {
      this.historyShow();
      navg.pause();
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
  padding-right: 270px;
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
  right: 276px;
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
  right: 276px;
  z-index: 1000;
  padding: 5px 4px 15px;
  box-shadow: 0 0 15px #000000;
  background: #ffffff;
  text-align: center;
  border-radius: 3px;
}
.timeRange span {
  font-size: 12px;
}
.page {
  padding-top: 20px;
  text-align: right;
}
</style>
