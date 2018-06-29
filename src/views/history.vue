<template>
  <div class="all">
    <div class="control">
      <div class="date">
        <!-- <el-date-picker @change="timeChanged" :editable="false" v-model="chooseTime" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
        </el-date-picker> -->
        <!-- <el-date-picker type="date" v-model="timeChanged" placeholder="选择一个或多个日期"></el-date-picker>
        <el-date-picker type="dates" v-model="timeChanged" placeholder="选择一个或多个日期"></el-date-picker> -->
        <vue-datepicker-local style="cursor: pointer" v-model="chooseTime" format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDate" :local="local" show-buttons @confirm="selectedDate" />
        <el-button v-show="trajectory" size="mini" plain @click="startOnclick">
          <i class="iconfont icon-ic_song_next"></i>
        </el-button>
        <el-button v-show="trajectory" size="mini" plain @click="pauseOnclick">
          <i class="iconfont icon-artboard25copy"></i>
        </el-button>
        <el-button v-show="trajectory" size="mini" plain @click="resumeOnclick">
          <i class="iconfont icon-icons-resume_button"></i>
        </el-button>
        <el-button v-show="trajectory" size="mini" plain @click="stopOnclick">
          <i class="iconfont icon-stop"></i>
        </el-button>
        <el-button v-show="trajectory" type="danger" size="small" @click="heatmapFirst">活动热区</el-button>
        <el-button v-show="active" type="primary" size="mini" @click="historyTrajectory">轨迹回放</el-button>
      </div>
      <!-- <div class="date" v-show="active">
        <el-button type="primary" size="mini" @click="historyTrajectory">轨迹回放</el-button>
      </div> -->
    </div>
    <div class="">
      <div id="mapcontainer"></div>
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import AMapUI from "AMapUI";
import { trajectory } from "../api/index.js";
import { timeFormatSort, trakTimeformat } from "../utils/transition.js";
var map, navg, heatmap, pathSimplifierIns;
const min = new Date(2018, 5, 1, 0, 0, 0);
export default {
  data() {
    return {
      trajectory: false,
      active: true,
      navg: null,
      map: null,
      chooseTime: [],
      gridData: [],
      local: {
        dow: 1, // Monday is the first day of the week
        hourTip: '选择小时', // tip of select hour
        minuteTip: '选择分钟', // tip of select minute
        secondTip: '选择秒数', // tip of select second
        yearSuffix: '年', // format of head
        monthsHead: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'), // months of head
        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'), // months of panel
        weeks: '一_二_三_四_五_六_日'.split('_'), // weeks
        cancelTip: '取消', // default text for cancel button
        submitTip: '确定' // default text for submit button
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    disabledDate(time) {
      return time < min;
    },
    /* 时间确认按钮 */
    selectedDate(date) {
      let opts = {
        pushDateStart: timeFormatSort(date[0]),
        pushDateEnd: timeFormatSort(date[1]),
        deviceId: "2B85ACC19D5E"
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
                obj.count = 150;
                this.gridData.push(obj);
              });
              map.setCenter([this.gridData[0].lng, this.gridData[0].lat]);
              AMap.plugin(["AMap.Heatmap"], () => {
                // 初始化heatmap对象
                heatmap = new AMap.Heatmap(map, {
                  radius: 12, // 给定半径
                  opacity: [0, 1] // 透明度
                });
              });
              heatmap.setDataSet({
                data: this.gridData // 热力图数据
              });
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
      this.init();
      this.trajectory = false;
      this.active = true;
      pathSimplifierIns.hide();
    },
    init() {
      map = new AMap.Map("mapcontainer", {
        // center: [this.gridData[0].lng, this.gridData[0].lat],
        resizeEnable: true,
        zoom: 15
      });
      map.setFitView();
      let start = new Date();
      let starts = start.setTime(start.getTime() - 3600 * 1000 * 24);
      let params = {
        pushDateStart: timeFormatSort(starts),
        pushDateEnd: timeFormatSort(new Date()),
        deviceId: "2B85ACC19D5E"
      };
      this.chooseTime.push(starts);
      this.chooseTime.push(new Date());
      this.getData(params);
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
      let lineArr = [];
      // let tra = [];
      for (var i = 0; i < this.gridData.length; i++) {
        var lngX = this.gridData[i].lng;
        var latY = this.gridData[i].lat;
        var timer = this.gridData[i].pushTime;
        lineArr.push([lngX, latY, timer]);
        // tra.push(this.gridData[i]);
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
              }
            }
          });
          pathSimplifierIns.on("pointMouseover", function(e, info) {
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
              var infoWindow = new AMap.InfoWindow({
                content: info.join("<br/>") // 使用默认信息窗体框样式，显示信息内容
              });
              infoWindow.open(map, position);
            });
          });
          window.pathSimplifierIns = pathSimplifierIns;
          pathSimplifierIns.setData([
            {
              name: "轨迹",
              path: lineArr
            }
          ]);
          navg = pathSimplifierIns.createPathNavigator(0, {
            loop: true,
            speed: 100,
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
        /* eslint-disable */
        let stmarker = new AMap.Marker({
          map: map,
          position: [startPot[0], startPot[1]], // 基点位置  开始位置
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
          zIndex: 50
        });
        let endmarker = new AMap.Marker({
          map: map,
          position: [endPot[0], endPot[1]], // 基点位置  结束位置
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
          zIndex: 10
        });
      });
    },
    onchange() {
      navg.setSpeed(this.speed);
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
  width: 100%;
  height: 100%;
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
#speed {
  vertical-align: middle;
  width: 60px;
  height: 23px;
}
.control {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px 10px;
  border-radius: 3px;
  border: 1px solid #000;
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
</style>
