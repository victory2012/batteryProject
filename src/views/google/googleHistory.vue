<template>
  <div class="all">
    <div class="control">
      <div class="date">
        <vue-datepicker-local v-model="starts" clearable placeholder="选择开始时间" format="YYYY-MM-DD HH:mm:ss" show-buttons @confirm="selectedDate" />
        <vue-datepicker-local v-model="endtime" format="YYYY-MM-DD HH:mm:ss" clearable placeholder="选择结束时间" show-buttons @confirm="selectedDate" />
        <el-button v-show="trajectory" size="mini" plain @click="animateCircle" title="开始">
          <i class="iconfont icon-ic_song_next"></i>
        </el-button>
        <!-- <el-button v-show="trajectory" size="mini" plain @click="pauseOnclick" title="暂停">
          <i class="iconfont icon-artboard25copy"></i>
        </el-button>
        <el-button v-show="trajectory" size="mini" plain @click="resumeOnclick" title="继续">
          <i class="iconfont icon-icons-resume_button"></i>
        </el-button>
        <el-button v-show="trajectory" size="mini" plain @click="stopOnclick" title="停止">
          <i class="iconfont icon-stop"></i>
        </el-button> -->
        <el-button v-show="trajectory" type="danger" size="small" @click="heatmap">活动热区</el-button>
        <el-button v-show="active" type="primary" size="mini" @click="track">轨迹回放</el-button>
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
    <!-- <div class="timeRange" v-show="trajectory">
      <span>时间(s)</span>
      <el-slider v-model="timeSeconds" @change="speedChange" vertical height="200px">
      </el-slider>
    </div> -->
  </div>
</template>
<script>
import google from "google";
import { GetTrajectory, GetDeviceList } from "../../api/index.js";
import {
  timeFormatSort,
  // trakTimeformat,
  yesTody
} from "../../utils/transition.js";
import { onWarn, onTimeOut, onError } from "../../utils/callback.js";
var map;
let heatmapData;
let line;
let animate1;
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
      total: 10,
      localMakerArr: [],
      markerPointer: {
        sdPointer: [],
        mapPointer: []
      }
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
      this.getHisData(pageObj);
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
        pushDateEnd: timeFormatSort(this.endtime)
      };
      opts.batteryId = this.devicelabel;
      this.clearMap();
      this.getData(opts);
      // if (this.deviceId && this.pageNum === 1) {
      //   opts.deviceId = this.devicelabel;
      //   this.getData(opts);
      // } else {
      //   opts.batteryId = this.devicelabel;
      //   this.getData(opts);
      // }
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
            // console.log(result);
            this.lineArr = [];
            if (result.length > 0) {
              this.gridData = [];
              for (let i = 0; i < result.length; i++) {
                var key = result[i];
                var obj = {};
                obj.pushTime = key.pushTime;
                obj.ponter = new google.maps.LatLng(
                  key.latitude,
                  key.longitude
                );
                this.lineArr.push(obj);
                this.gridData.push(
                  new google.maps.LatLng(key.latitude, key.longitude)
                );
              }
              map.setCenter(this.gridData[0]);
              if (this.active) {
                this.heatmap();
              } else {
                this.track();
              }
            } else {
              onWarn("此设备当前时间段内，暂无数据");
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
    heatmap() {
      this.trajectory = false;
      this.active = true;
      this.clearMap();
      heatmapData = new google.maps.visualization.HeatmapLayer({
        data: this.gridData,
        map: map,
        radius: 10,
        opacity: 1,
        maxIntensity: 15,
        dissipating: true,
        gradient: [
          "rgba(0, 0, 255, 0)",
          "rgba(55, 55, 255, 1)",
          "rgba(0, 255, 120, 1)",
          "rgba(18, 255, 0, 1)",
          "rgba(150, 255, 0, 1)",
          "rgba(210, 255, 0, 1)",
          "rgba(255, 228, 0, 1)",
          "rgba(255, 216, 0, 1)",
          "rgba(255, 132, 0, 1)",
          "rgba(255, 72, 0, 1)",
          "rgba(255, 48, 0, 1)",
          "rgba(234, 86, 61, 1)",
          "rgba(255, 36, 0, 1)",
          "rgba(255, 0, 0, 1)"
        ]
      });
      // heatmapData.set("gradient", gradient);
    },
    init() {
      try {
        map = new google.maps.Map(document.getElementById("mapcontainer"), {
          center: {
            lat: 31.232803,
            lng: 121.475101
          },
          zoom: 15
        });
        this.getHisData();
        map.addListener("click", e => {
          if (this.localMakerArr.length > 0) {
            this.localMakerArr.forEach(key => {
              key.setMap(null);
            });
          }
          var latLngData =
            e.latLng.lat().toFixed(6) + "," + e.latLng.lng().toFixed(6);
          var localMaker = new google.maps.Marker({
            position: e.latLng,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 3,
              strokeColor: "red"
            },
            map: map
          });
          this.localMakerArr.push(localMaker);
          this.$.ajax({
            type: "post",
            url:
              "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
              latLngData +
              "&key=AIzaSyC8IXpNgfA7uD-Xb0jEqhkEdB7j3gbgOiE&fields=formatted_address",
            async: true,
            success: function(data) {
              console.log(data);
              var site =
                "坐标：" +
                latLngData +
                "<br />" +
                "地址：" +
                data.results[0].formatted_address;
              var infowindow = new google.maps.InfoWindow({
                content: site
              });
              infowindow.open(map, localMaker); // 弹出信息提示窗口
              map.addListener("click", () => {
                infowindow.close();
              });
            }
          });
        });
      } catch (err) {
        onError("地图加载失败，请检查网络连接");
      }
    },
    // 获取列表数据
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
              this.batteryId = this.$route.query.batteryId;
              let params = {
                pushDateStart: timeFormatSort(this.starts),
                pushDateEnd: timeFormatSort(this.endtime)
              };
              if (this.batteryId && this.pageNum === 1) {
                this.devicelabel = this.batteryId;
                params.batteryId = this.batteryId;
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
    animateCircle() {
      var count = 0;
      animate1 && clearInterval(animate1);
      animate1 = window.setInterval(() => {
        count = count + 1;
        var icons = line.get("icons");
        icons[0].offset = count / this.gridData.length * 100 + "%";
        line.set("icons", icons);
        console.log(count, icons[0].offset);
        // //终点停车
        if (count === this.gridData.length) {
          clearInterval(animate1);
        }
      }, 100);
    },
    // 历史轨迹 轨迹配置
    track() {
      this.trajectory = true;
      this.active = false;
      this.clearMap();
      line = new google.maps.Polyline({
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 3,
              strokeColor: "#1200ff"
            },
            offset: "0%"
          }
        ],
        strokeColor: "#71253e",
        map: map
      });
      line.setPath(this.gridData);
      // this.lineArr.forEach(pointer => {
      //   let mapPointer = new google.maps.Marker({
      //     position: pointer.ponter,
      //     icon: {
      //       path: google.maps.SymbolPath.CIRCLE,
      //       scale: 3,
      //       strokeColor: "red"
      //     },
      //     map: map
      //   });
      //   this.markerPointer.mapPointer.push(mapPointer);
      //   mapPointer.addListener("click", e => {
      //     this.infowindow && this.infowindow.close();
      //     var latLngData =
      //       e.latLng.lat().toFixed(6) + "," + e.latLng.lng().toFixed(6);
      //     this.$.ajax({
      //       type: "post",
      //       url:
      //         "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      //         latLngData +
      //         "&location_type=ROOFTOP&result_type=street_address&key=AIzaSyC8IXpNgfA7uD-Xb0jEqhkEdB7j3gbgOiE",
      //       async: true,
      //       success: function(data) {
      //         console.log(data);
      //         let address;
      //         if (data.status === "OK") {
      //           address = data.results[0].formatted_address;
      //         } else {
      //           address = "地址获取失败";
      //         }
      //         var site =
      //           "时间：" +
      //           trakTimeformat(pointer.pushTime) +
      //           "<br />" +
      //           "坐标：" +
      //           latLngData +
      //           "<br />" +
      //           "地址：" +
      //           address;
      //         this.infowindow = new google.maps.InfoWindow({
      //           content: site
      //         });
      //         this.infowindow.open(map, mapPointer); // 弹出信息提示窗口
      //         map.addListener("click", () => {
      //           this.infowindow.close();
      //         });
      //       }
      //     });
      //   });
      // });
      let start = new google.maps.Marker({
        position: this.gridData[0],
        label: {
          color: "#FFF",
          text: "S"
        },
        map: map
      });
      let end = new google.maps.Marker({
        position: this.gridData[this.gridData.length - 1],
        label: {
          color: "#FFF",
          text: "E"
        },
        map: map
      });
      this.markerPointer.sdPointer.push(start);
      this.markerPointer.sdPointer.push(end);
    },
    // 清除地图上的覆盖物
    clearMap() {
      heatmapData && heatmapData.setMap(null);
      line && line.setMap(null);
      if (this.markerPointer.sdPointer.length > 0) {
        this.markerPointer.sdPointer.forEach(marker => {
          marker.setMap(null);
        });
        this.markerPointer.sdPointer = [];
      }
      if (this.markerPointer.mapPointer.length > 0) {
        this.markerPointer.mapPointer.forEach(marker => {
          marker.setMap(null);
        });
        this.markerPointer.mapPointer = [];
      }
      if (this.localMakerArr.length > 0) {
        this.localMakerArr.forEach(key => {
          key.setMap(null);
        });
      }
    },
    // 列表点击事件
    checkItem(item) {
      this.clearMap();
      let params = {
        pushDateStart: timeFormatSort(this.starts),
        pushDateEnd: timeFormatSort(this.endtime)
      };
      params.batteryId = item.batteryId;
      this.devicelabel = item.batteryId;
      this.getData(params);
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
