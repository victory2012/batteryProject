<template>
  <div class="all">
    <div class="control">
      <div class="date" v-show="trajectory">
        <el-button type="primary" size="mini" plain @click="startOnclick">开始运动</el-button>
        <el-button type="primary" size="mini" plain @click="pauseOnclick">暂停运动</el-button>
        <el-button type="primary" size="mini" plain @click="resumeOnclick">继续运动</el-button>
        <el-button type="primary" size="mini" plain @click="stopOnclick">停止运动</el-button>
        <el-button type="danger" size="mini" @click="heatmapFirst">活动热区</el-button>
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
const json = {
  name: "张三",
  track: [
    {
      lng: 121.515152,
      lat: 31.233275,
      count: 150
    },
    {
      lng: 121.51469,
      lat: 31.233422,
      count: 150
    },
    {
      lng: 121.514401,
      lat: 31.233522,
      count: 150
    },
    {
      lng: 121.514197,
      lat: 31.233568,
      count: 150
    },
    {
      lng: 121.513993,
      lat: 31.233669,
      count: 150
    },
    {
      lng: 121.513778,
      lat: 31.233724,
      count: 150
    },
    {
      lng: 121.513542,
      lat: 31.233825,
      count: 150
    },
    {
      lng: 121.513403,
      lat: 31.233853,
      count: 150
    },
    {
      lng: 121.512705,
      lat: 31.234064,
      count: 150
    },
    {
      lng: 121.511504,
      lat: 31.234394,
      count: 150
    },
    {
      lng: 121.510442,
      lat: 31.234743,
      count: 150
    },
    {
      lng: 121.509208,
      lat: 31.235109,
      count: 150
    },
    {
      lng: 121.508725,
      lat: 31.235247,
      count: 150
    },
    {
      lng: 121.507212,
      lat: 31.235742,
      count: 150
    },
    {
      lng: 121.506805,
      lat: 31.235871,
      count: 150
    },
    {
      lng: 121.506011,
      lat: 31.236219,
      count: 150
    },
    {
      lng: 121.505496,
      lat: 31.236339,
      count: 150
    },
    {
      lng: 121.504949,
      lat: 31.236531,
      count: 150
    },
    {
      lng: 121.503232,
      lat: 31.237201,
      count: 150
    },
    {
      lng: 121.502202,
      lat: 31.237641,
      count: 150
    }
  ]
};
var map, navg, heatmap, pathSimplifierIns;
export default {
  data() {
    return {
      trajectory: false,
      active: true,
      navg: null,
      map: null
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    heatmapFirst() {
      this.getData();
      this.trajectory = false;
      this.active = true;
      pathSimplifierIns.hide();
    },
    getData() {
      map = new AMap.Map("mapcontainer", {
        center: [json.track[0].lng, json.track[0].lat],
        resizeEnable: false,
        zoom: 15
      });
      AMap.plugin(["AMap.Heatmap"], () => {
        // 初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
          radius: 12, // 给定半径
          opacity: [0, 1] // 透明度
        });
        heatmap.setDataSet({
          data: json.track, // 热力图数据
          max: 100
        });
      });
      // let lnglat1 = new AMap.LngLat(json.track[0].lng, json.track[0].lat);
      // let lnglat2 = new AMap.LngLat(json.track[1].lng, json.track[1].lat);
      /* eslint-disable */
      // AMap.GeometryUtil.distance(lnglat1, lnglat2)
      // new AMap.Text({
      //   text: "两点相距" + Math.round(lnglat1.distance(lnglat2)) + "米",
      //   position: lnglat1.divideBy(2).add(lnglat2.divideBy(2)),
      //   map: map,
      //   style: {
      //     "background-color": "#ccccff",
      //     "border-color": "green",
      //     "font-size": "12px"
      //   }
      // });
      // let lnglat1 = new AMap.LngLat(json.track[0].lng, json.track[0].lat);
      // let lnglat2 = new AMap.LngLat(json.track[1].lng, json.track[1].lat);
      /* eslint-disable */
      // let mapText = new AMap.Text({
      //   text: "两点相距" + Math.round(lnglat1.distance(lnglat2)) + "米",
      //   position: lnglat1.divideBy(2).add(lnglat2.divideBy(2)),
      //   map: map,
      //   style: {
      //     "background-color": "#ccccff",
      //     "border-color": "green",
      //     "font-size": "12px"
      //   }
      // });
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
      for (var i = 0; i < json.track.length; i++) {
        var lngX = json.track[i].lng;
        var latY = json.track[i].lat;
        lineArr.push([lngX, latY]);
        tra.push(json.track[i]);
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
        /* eslint-disable */
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
