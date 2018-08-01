<template>
  <div class="all">

    <div class="mapcontainer">
      <div class="control">
        <div class="date">
          <vue-datepicker-local v-model="starts" clearable placeholder="选择开始时间" format="YYYY-MM-DD HH:mm:ss" show-buttons @confirm="selectedDate" />
          <vue-datepicker-local v-model="endtime" format="YYYY-MM-DD HH:mm:ss" clearable placeholder="选择结束时间" show-buttons @confirm="selectedDate" />
          <el-button v-show="trajectory" size="mini" plain @click="startMove" title="开始">
            <i class="iconfont icon-ic_song_next"></i>
          </el-button>
          <el-button v-show="trajectory" type="danger" size="small" @click="heatmap">活动热区</el-button>
          <el-button v-show="active" type="primary" size="mini" @click="track">轨迹回放</el-button>
        </div>
      </div>
      <div class="timeRange" v-show="trajectory">
        <span>时间(s)</span>
        <el-slider :max='max' :min="min" v-model="timeSeconds" @change="speedChange" vertical height="200px">
        </el-slider>
      </div>
      <div id="mapcontainer" class="map"></div>
    </div>
    <div class="panel">
      <h2>电池列表</h2>
      <div class="panelTop">
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
      <div class="checkTime">
        <ul>
          <li v-for="(key, index) in blockArr" @click="showThisData(key, index, $event)" :class="[{'yollew': key.bgColor === 'yellow'},{'gray': key.bgColor === 'gray'},{'green': key.bgColor === 'green'}]" :key="key.id"></li>
        </ul>
        <div v-show="showTimeDetail" class="blockInfo">
          <div class="blockInfo_warp">
            <div v-for="item in activePointer" :key="item.createTime">{{item.dateFormat}}: {{item.onlineStatus}}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import google from "google";
import { GetTrajectory, GetDeviceList, timeList } from "../../api/index.js";
import {
  timeFormatSort,
  timeFormats,
  getTime,
  yesTody
} from "../../utils/transition.js";
import { onWarn, onTimeOut, onError } from "../../utils/callback.js";
var map;
let heatmapData;
let line;
let animate1;
let pointArr = [];
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
      max: 100,
      min: 1,
      pageNum: 1,
      total: 10,
      localMakerArr: [],
      markerPointer: {
        sdPointer: [],
        mapPointer: []
      },
      blockArr: [],
      queryDevice: null,
      showTimeDetail: false,
      activePointer: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /* 点击小格子 事件 */
    showThisData(key, index, event) {
      // console.log(this.$refs.blockInfo)
      this.activePointer = [];
      pointArr.forEach(key => {
        if (key.index === index + 1) {
          this.showTimeDetail = true;
          this.activePointer.push(key);
        }
      });
    },
    // 通过设备id 来查看对应的上下线时间数据
    getTimeList(id) {
      let param = {
        deviceId: id,
        startTime: new Date(this.starts),
        endTime: new Date(this.endtime)
      };
      timeList(param).then(res => {
        const result = res.data;
        console.log(result);
        if (result.code === 0) {
          /* getTime
            // 返回开始时间到结束时间的毫秒数 getTime第一个参数:开始时间  第二个:结束时间；
            // {100000} 是毫秒数1000 * 100个格子。代表每个小格子代表的时间区间,单位是 秒；向上取整；
            最终返回的是 每个格子所代表的时间段；
          */
          let perBlock = getTime(this.starts, this.endtime);
          let arrs = [];
          this.blockArr = [];
          pointArr = [];
          if (result.data.length > 0) {
            result.data.forEach(key => {
              key.createTime = new Date(key.createTime).getTime();
              key.dateFormat = timeFormats(key.createTime);
              key.pre = new Date(key.createTime) - new Date(this.starts);
              key.index = Math.ceil(key.pre / perBlock); // 得出此时间是处于第几个格子； 向上取整；
              key.onlineStatus = key.status === 0 ? "下线" : "上线";
              pointArr.push(key);
            });
            let bgColor = pointArr[0].status === 0 ? "green" : "gray";
            this.onlineStatus = null;
            /* {100} 是要循环100个小格子  */
            for (let i = 0; i < 100; i++) {
              let obj = {};
              obj.bgColor = bgColor;
              obj.startTime = new Date(this.starts).getTime() + perBlock * i;
              obj.endTime =
                new Date(this.starts).getTime() + perBlock * (i + 1);
              obj.id = i;
              arrs.push(obj);
              if (this.onlineStatus && this.onlineStatus != null) {
                arrs[i].bgColor = this.onlineStatus === "0" ? "gray" : "green";
              }
              pointArr.forEach(key => {
                if (
                  arrs[i].endTime - key.createTime > 0 &&
                  key.createTime - arrs[i].startTime > 0
                ) {
                  arrs[i].bgColor = "yellow";
                  this.onlineStatus = key.status;
                }
              });
            }
          } else {
            for (let i = 0; i < 100; i++) {
              let obj = {};
              obj.bgColor = "gray";
              obj.startTime = new Date(this.starts).getTime() + perBlock * i;
              obj.endTime =
                new Date(this.starts).getTime() + perBlock * (i + 1);
              obj.id = i;
              obj.dateFormat = timeFormats(obj.endTime);
              arrs.push(obj);
            }
          }
          this.blockArr = arrs;
        }
      });
    },
    speedChange() {
      let speed = this.gridData.length / this.timeSeconds;
      this.haomiao = 1000 / speed;
      this.animateCircle(this.haomiao);
    },
    pageChange() {
      this.blockArr = [];
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
      this.getTimeList(this.queryDevice);
      this.clearMap();
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
            this.total = res.data.data.total;
            this.batteryId = this.$route.query.batteryId;
            this.pointerArr = [];
            if (result.length > 0) {
              result.forEach(key => {
                if (key.batteryId) {
                  if (this.batteryId && this.batteryId === key.batteryId) {
                    this.queryDevice = key.deviceId; // 根据路由参数中的电池id 获取对应的设备id；
                  }
                  this.pointerArr.push(key);
                }
              });
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
                this.queryDevice = result[0].deviceId;
                this.getData(params);
              }
              this.getTimeList(this.queryDevice);
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
    startMove() {
      this.animateCircle(this.timeSeconds);
    },
    animateCircle(times) {
      let seconds = times || 10;
      var count = 0;
      animate1 && clearInterval(animate1);
      animate1 = window.setInterval(() => {
        count = count + 5;
        // console.log(count)
        var icons = line.get("icons");
        icons[0].offset = count / this.gridData.length * 100 + "%";
        line.set("icons", icons);
        console.log(count, icons[0].offset);
        // // //终点停车
        if (count >= this.gridData.length) {
          clearInterval(animate1);
        }
      }, seconds);
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
      let TimerMax = Math.ceil(this.gridData.length * 0.01);
      if (TimerMax > this.max) {
        this.max = Math.ceil(TimerMax * 2);
      }
      this.min = TimerMax;
      this.timeSeconds = TimerMax;
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
      animate1 && clearInterval(animate1);
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
      this.activePointer = [];
      this.blockArr = [];
      animate1 && clearInterval(animate1);
      this.clearMap();
      let params = {
        pushDateStart: timeFormatSort(this.starts),
        pushDateEnd: timeFormatSort(this.endtime)
      };
      params.batteryId = item.batteryId;
      this.devicelabel = item.batteryId;
      this.queryDevice = item.deviceId;
      this.getData(params);
      this.getTimeList(this.queryDevice);
    }
  },
  beforeDestroy() {
    animate1 && clearInterval(animate1);
  }
};
</script>
<style lang="scss" scoped>
.all {
  position: relative;
  height: calc(100vh - 110px);
  width: 100%;
  display: flex;
  .mapcontainer {
    position: relative;
    // top: 0;
    // bottom: 0;
    flex: 1;
    .map {
      height: 100%;
      width: 100%;
    }
    .control {
      position: absolute;
      top: 5px;
      right: 5px;
      padding: 5px 10px;
      border-radius: 3px;
      box-shadow: 0 0 15px #000000;
      background: #ffffff;
      line-height: 16px;
      z-index: 999;
      .date {
        font-size: 16px;
      }
    }
    .timeRange {
      position: absolute;
      top: 70px;
      right: 8px;
      z-index: 1000;
      padding: 5px 4px 15px;
      box-shadow: 0 0 15px #000000;
      background: #ffffff;
      text-align: center;
      border-radius: 3px;
      span {
        font-size: 12px;
      }
    }
  }
  .panel {
    flex: 0 0 270px;
    box-sizing: border-box;
    padding: 10px 0;
    height: calc(100vh - 110px);
    background: #ffffff;
    border-left: 1px solid #f0f0f0;
    z-index: 999;
    h2 {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #409eff;
      font-size: 14px;
      font-weight: 500;
      border-bottom: 1px solid #409eff;
    }
    .panelTop {
      min-height: 412px;
      padding: 0 5px;
      overflow-x: hidden;
      background: #ffffff;
      .list_warp {
        li {
          height: 40px;
          border-bottom: 1px solid #f0f0f0;
          line-height: 40px;
          font-size: 14px;
          color: #303133;
          cursor: pointer;
          padding-left: 10px;
          &.selected {
            background: green;
            color: #fff;
          }
        }
      }
    }
    .page {
      padding-top: 20px;
      text-align: right;
    }
    .checkTime {
      position: relative;
      margin: 0 auto;
      width: 260px;
      height: auto;
      ul {
        display: flex;
        width: 100%;
        border-top: 1px solid #f0f0f0;
        border-left: 1px solid #f0f0f0;
        flex-wrap: wrap;
        li {
          flex: 0 0 25px;
          height: 15px;
          border: 1px solid #f0f0f0;
          border-top: none;
          border-left: none;
          list-style: none;
          cursor: pointer;
          &.gray {
            background: gray;
          }
          &.green {
            background: green;
          }
          &.yollew {
            background: rgb(226, 213, 26);
          }
        }
      }
      .blockInfo {
        position: absolute;
        width: 240px;
        left: 10px;
        top: -10px;
        height: auto;
        max-height: 150px;
        overflow-y: auto;
        overflow-x: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
        .blockInfo_warp {
          border-radius: 3px;
          overflow: hidden;
          div {
            box-sizing: border-box;
            width: 100%;
            font-size: 14px;
            line-height: 30px;
            list-style: none;
            padding-left: 10px;
            background: #ffffff;
          }
        }
      }
    }
  }
}
</style>
