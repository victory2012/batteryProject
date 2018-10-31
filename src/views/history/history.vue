<template>
  <div class="all">
    <div class="mapcontainer">
      <div class="control">
        <div class="date">
          <vue-datepicker-local v-model="starts" clearable :placeholder="$t('history.startTime')" format="YYYY-MM-DD HH:mm:ss" show-buttons @confirm="selectedDate" />
          <vue-datepicker-local v-model="endtime" format="YYYY-MM-DD HH:mm:ss" clearable :placeholder="$t('history.endTime')" show-buttons @confirm="selectedDate" />
          <el-button v-show="trajectory" size="mini" plain @click="startOnclick" :title="$t('history.start')">
            <i class="iconfont icon-ic_song_next"></i>
          </el-button>
          <el-button v-show="trajectory" size="mini" plain @click="pauseOnclick" :title="$t('history.pause')">
            <i class="iconfont icon-artboard25copy"></i>
          </el-button>
          <el-button v-show="trajectory" size="mini" plain @click="resumeOnclick" :title="$t('history.continue')">
            <i class="iconfont icon-icons-resume_button"></i>
          </el-button>
          <el-button v-show="trajectory" size="mini" plain @click="stopOnclick" :title="$t('history.stop')">
            <i class="iconfont icon-stop"></i>
          </el-button>
          <el-button v-show="trajectory" type="danger" size="small" @click="heatmap">{{$t('history.heatActive')}}</el-button>
          <el-button v-show="active" type="primary" size="mini" @click="track">{{$t('history.TrackReplay')}}</el-button>
        </div>
      </div>
      <div class="timeRange" v-show="trajectory">
        <span>{{$t('history.times')}}(s)</span>
        <el-slider v-model="timeSeconds" @change="speedChange" vertical height="200px">
        </el-slider>
      </div>
      <div id="mapcontainer" class="map"></div>
    </div>
    <div class="panels">
      <h2>{{$t('history.batteryList')}}</h2>
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
import AMap from "AMap";
import AMapUI from "AMapUI";
import { GetTrajectory, GetDeviceList, timeList } from "../../api/index.js";
import {
  timeFormatSort,
  trakTimeformat,
  timeFormats,
  timeFormat,
  yesTody,
  getTime
} from "../../utils/transition.js";
import { onWarn } from "../../utils/callback.js";
var map, navg, heatmap, pathSimplifierIns;
let infoWindow;
let pointArr = [];
export default {
  data() {
    return {
      activeName: "list",
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
      queryDevice: null,
      blockArr: [],
      activePointer: [],
      showTimeDetail: false
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
        startTime: timeFormat(this.starts),
        endTime: timeFormat(this.endtime)
      };
      timeList(param).then(res => {
        const result = res.data;
        console.log(result);
        if (result && result.code === 0) {
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
              key.onlineStatus =
                key.status === 0
                  ? this.$t("history.offLine")
                  : this.$t("history.online");
              // key.onlineStatus = key.status === 0 ? "下线" : "上线";
              pointArr.push(key);
            });
            let bgColor = this.swichFun(pointArr[0].status);
            // let bgColor = pointArr[0].status === 0 ? 'green' : 'gray'
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
              if (
                this.onlineStatus !== null &&
                this.onlineStatus !== undefined
              ) {
                console.log(this.onlineStatus);
                arrs[i].bgColor =
                  Number(this.onlineStatus) === 0 ? "gray" : "green";
              }
              pointArr.forEach(key => {
                if (
                  arrs[i].endTime - key.createTime > 0 &&
                  key.createTime - arrs[i].startTime > 0
                ) {
                  arrs[i].bgColor = "yellow";
                  // console.log(key.status);
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
    // switch color
    swichFun(key) {
      switch (key) {
        case 0:
          return "green";
        case 1:
          return "gray";
        case 2:
          return "green";
        default:
          break;
      }
    },
    pageChange() {
      this.blockArr = [];
      let pageObj = {
        pageNum: this.pageNum,
        pageSize: 10
      };
      this.getHisData(pageObj);
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
        onWarn(`${this.$t("history.startTime")}`);
        return;
      }
      if (!this.endtime) {
        onWarn(`${this.$t("history.endTime")}`);
        return;
      }
      if (Number(this.starts) > Number(this.endtime)) {
        onWarn(`${this.$t("history.checkErr")}`);
        return;
      }
      let opts = {
        pushDateStart: timeFormatSort(this.starts),
        pushDateEnd: timeFormatSort(this.endtime)
      };
      opts.batteryId = this.devicelabel;
      this.getTimeList(this.queryDevice);
      this.getData(opts);
    },
    /* 获取数据 */
    getData(params) {
      GetTrajectory(params).then(res => {
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          this.gridData = [];
          this.lineArr = [];
          this.alldistance = 0; // 运动的总距离（米）
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              var key = result[i];
              var distance, p1, p2;
              if (i < result.length - 1) {
                p1 = new AMap.LngLat(key.longitude, key.latitude);
                p2 = new AMap.LngLat(
                  result[i + 1].longitude,
                  result[i + 1].latitude
                );
                distance = Math.round(p1.distance(p2));
              }
              this.alldistance += distance;
              var obj = {};
              obj.lng = key.longitude;
              obj.lat = key.latitude;
              obj.pushTime = key.pushTime;
              obj.count = 150;
              this.lineArr.push([obj.lng, obj.lat, obj.pushTime]);
              this.gridData.push(obj);
            }
            if (this.trajectory && pathSimplifierIns) {
              pathSimplifierIns.setData();
              this.track();
            }
            if (this.active) {
              this.heatmap();
            }
          } else {
            if (pathSimplifierIns) {
              pathSimplifierIns.setData();
              this.track();
            }
            onWarn(`${this.$t("history.noData")}`);
            heatmap.hide();
          }
        }
      });
    },
    heatmap() {
      if (this.markerArr.length > 0) {
        map.remove(this.markerArr);
      }
      this.trajectory = false;
      this.active = true;
      if (this.gridData.length > 0) {
        map.setCenter([this.gridData[0].lng, this.gridData[0].lat]);
        heatmap.setDataSet({
          data: this.gridData // 热力图数据
        });
        heatmap.show();
        pathSimplifierIns && pathSimplifierIns.hide();
      }
    },
    init() {
      const lang = sessionStorage.getItem("locale") === "en" ? "en" : "zh_cn";
      map = new AMap.Map("mapcontainer", {
        resizeEnable: true,
        lang: lang,
        zoom: 15
      });
      AMap.plugin(["AMap.Heatmap"], () => {
        // 初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
          radius: 12, // 给定半径
          opacity: [0, 1] // 透明度
        });
      });
      this.getHisData();
    },
    // 获取列表数据
    getHisData() {
      let pageObj = {
        pageNum: this.pageNum,
        pageSize: 10,
        bindingStatus: "1"
      };
      GetDeviceList(pageObj).then(res => {
        console.log("GetDeviceList", res);

        if (res.data && res.data.code === 0) {
          let result = res.data.data.data;
          this.total = res.data.data.total;
          this.pointerArr = [];
          if (result.length > 0) {
            this.batteryId = this.$route.query.batteryId; // 路由参数
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
            onWarn(`${this.$t("history.noDevice")}`);
          }
        }
      });
    },
    // 历史轨迹 轨迹配置
    track() {
      this.trajectory = true;
      this.active = false;
      heatmap && heatmap.hide();
      if (this.markerArr.length > 0) {
        map.remove(this.markerArr);
      }
      if (this.lineArr.length < 1) {
        return;
      }
      const self = this;
      AMapUI.load(["ui/misc/PathSimplifier"], PathSimplifier => {
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
                return `${self.$t("history.No")} ${pointIndex} ${self.$t(
                  "history.point"
                )}`;
              }
            },
            getPath: function(pathData, pathIndex) {
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
              info.push(
                `<div><div>${self.$t("history.times")}：${trakTimeformat(
                  point[2]
                )}</div>`
              );
              info.push(
                `<div style="font-size:14px;">${self.$t("history.junction")} :${
                  result.nearestJunction
                }</div>`
              );
              info.push(
                `<div style="font-size:14px;">${self.$t("history.address")} :${
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
              name: this.$t("history.track"),
              path: this.lineArr
            }
          ]);
          let distance = Number(this.alldistance) / 1000; // 米转成千米
          let times = Number(this.timeSeconds) / 3600; // 秒转成小时
          let speeds = Math.ceil(distance / times); // 最终得到的速度是 km/h
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
                "../../../../static/img/car.png"
              )
            }
          });
        });
        let startPot = this.lineArr[0];
        let endPot = this.lineArr[this.lineArr.length - 1];
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
    // 列表点击事件
    checkItem(item) {
      this.activePointer = [];
      this.blockArr = [];
      let params = {
        pushDateStart: timeFormatSort(this.starts),
        pushDateEnd: timeFormatSort(this.endtime)
      };
      params.batteryId = item.batteryId;
      this.devicelabel = item.batteryId;
      this.queryDevice = item.deviceId;
      this.getData(params);
      this.getTimeList(this.queryDevice);
    },
    // 开始运动
    startOnclick() {
      navg && navg.start();
    },
    // 暂停运动
    pauseOnclick() {
      navg && navg.pause();
    },
    // 继续运动
    resumeOnclick() {
      navg && navg.resume();
    },
    // 停止运动
    stopOnclick() {
      navg && navg.stop();
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
  },
  beforeDestroy() {
    map.destroy();
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
  .panels {
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
