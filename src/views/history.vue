<template>
  <div class="all">
    <div class="control">
      <div class="date" v-show="trajectory">
        <el-date-picker @change="timeChanged" :editable="false" v-model="chooseTime" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
        </el-date-picker>
        <!-- <el-date-picker type="date" v-model="timeChanged" placeholder="选择一个或多个日期"></el-date-picker>
        <el-date-picker type="dates" v-model="timeChanged" placeholder="选择一个或多个日期"></el-date-picker> -->
        <el-button size="mini" plain @click="startOnclick">
          <i class="iconfont icon-ic_song_next"></i>
        </el-button>
        <el-button size="mini" plain @click="pauseOnclick">
          <i class="iconfont icon-artboard25copy"></i>
        </el-button>
        <el-button size="mini" plain @click="resumeOnclick">
          <i class="iconfont icon-icons-resume_button"></i>
        </el-button>
        <el-button size="mini" plain @click="stopOnclick">
          <i class="iconfont icon-stop"></i>
        </el-button>
        <el-button type="danger" size="small" @click="heatmapFirst">活动热区</el-button>
      </div>
      <div class="date" v-show="active">
        <el-button type="primary" size="mini" @click="historyTrajectory">轨迹回放</el-button>
      </div>
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
import { timeFormatSort } from "../utils/transition.js";
var map, navg, heatmap, pathSimplifierIns;
export default {
  data() {
    return {
      trajectory: false,
      active: true,
      navg: null,
      map: null,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        disabledDate: time => {
          return time.getTime() < new Date(2018, 1, 1);
        }
      },
      chooseTime: [],
      gridData: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    timeChanged() {
      let opts = {
        pushDateStart: timeFormatSort(this.chooseTime[0]),
        pushDateEnd: timeFormatSort(this.chooseTime[1]),
        deviceId: "2B85ACC19D5E"
      };
      console.log(opts);
      this.getData(opts);
    },
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
            if (result.length > 0) {
              result.forEach(key => {
                var obj = {};
                obj.lng = key.longitude;
                obj.lat = key.latitude;
                obj.count = 150;
                this.gridData.push(obj);
              });
              map = new AMap.Map("mapcontainer", {
                center: [this.gridData[0].lng, this.gridData[0].lat],
                resizeEnable: false,
                zoom: 17
              });
              AMap.plugin(["AMap.Heatmap"], () => {
                // 初始化heatmap对象
                heatmap = new AMap.Heatmap(map, {
                  radius: 12, // 给定半径
                  opacity: [0, 1] // 透明度
                });
              });
              heatmap.setDataSet({
                data: this.gridData, // 热力图数据
                max: 100
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
      let start = new Date();
      let starts = start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
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
      let tra = [];
      for (var i = 0; i < this.gridData.length; i++) {
        var lngX = this.gridData[i].lng;
        var latY = this.gridData[i].lat;
        lineArr.push([lngX, latY]);
        tra.push(this.gridData[i]);
      }
      AMapUI.load(["ui/misc/PathSimplifier"], function(PathSimplifier) {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
          return;
        }
        var defaultRenderOptions = {
          pathNavigatorStyle: {
            width: 16,
            height: 16,
            autoRotate: true,
            lineJoin: "round",
            content: "defaultPathNavigtor",
            fillStyle: "#ff0000",
            strokeStyle: "#ff0000",
            lineWidth: 1,
            pathLinePassedStyle: {
              lineWidth: 2,
              strokeStyle: "rgba(0, 160, 220, 0.8)",
              borderWidth: 1,
              borderStyle: "#eee",
              dirArrowStyle: false
            }
          }
        };
        pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: map,
          getPath: function(pathData, pathIndex) {
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            // 返回鼠标悬停时显示的信息
            if (pointIndex >= 0) {
              // 鼠标悬停在某个轨迹节点上
              return (
                pathData.name +
                "，点:" +
                pointIndex +
                "/" +
                pathData.path.length
              );
            }
            // 鼠标悬停在节点之间的连线上
            return pathData.name + "，点数量" + pathData.path.length;
          },
          renderOptions: defaultRenderOptions
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
              "../../../static/img/car.png",
              () => console.log("load"),
              error => console.log(error)
            )
          }
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
