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
        <el-button v-show="trajectory" type="danger" size="small" @click="heatmap">活动热区</el-button>
        <el-button v-show="active" type="primary" size="mini" @click="track">轨迹回放</el-button>
      </div>
    </div>
    <div class="">
      <div id="mapcontainer"></div>
    </div>
    <div id="panel">
      <el-tabs :stretch="true" v-model="activeName">
        <el-tab-pane label="电池列表" name="list">
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
        </el-tab-pane>
        <el-tab-pane label="电池状态" name="block">
          <div class="checkTime">
            <ul>
              <li v-for="(key, index) in blockArr" :class="[{'yollew': key.bgColor === 'yellow'},{'gray': key.bgColor === 'gray'},{'green': key.bgColor === 'green'}]" :key="key.id">{{index}}</li>
            </ul>
            <!-- <div class="blockInfo">
              data is here
            </div> -->
          </div>
        </el-tab-pane>
      </el-tabs>
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
import { GetTrajectory, GetDeviceList, timeList } from "../api/index.js";
import {
  timeFormatSort,
  trakTimeformat,
  yesTody,
  getTime
} from "../utils/transition.js";
import { onWarn, onTimeOut, onError } from "../utils/callback.js";
var map, navg, heatmap, pathSimplifierIns;
let infoWindow;
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
      blockArr: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // handleClick(tab) {
    //   console.log(tab.name);
    //   if (tab.name === 'block') {
    //     this.getTimeList(id)
    //   }
    // },
    // mouseOverFun(key, event) {
    //   console.log(key);
    //   console.log(event);
    //   let pageX = event.pageX;
    //   let pageY = event.pageY;
    // },
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
          // console.log(perBlock);
          let arrs = [];
          let pointArr = [];
          // let pointObj = [];
          if (result.data.length > 0) {
            result.data.forEach(key => {
              key.createTime = new Date(key.createTime).getTime();
              key.pre = new Date(key.createTime) - new Date(this.starts);
              key.index = Math.ceil(key.pre / perBlock);
              pointArr.push(key);
            });
            console.log(pointArr);
            let pointArrindex = 0;
            let bgColor = pointArr[0].status === 0 ? "green" : "gray";
            let len = pointArr.length;
            this.onlineStatus = null;
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
              let diff = arrs[i].endTime - pointArr[pointArrindex].createTime;
              if (diff >= 0 && pointArrindex < len) {
                pointArrindex++;
                console.log(pointArrindex);
                // if (pointArrindex === 2) {
                //   this.onlineStatus = pointArr[pointArrindex + 1].status;
                // } else {
                //   this.onlineStatus = pointArr[pointArrindex].status;
                // }
                this.onlineStatus = pointArr[pointArrindex].status;
                arrs[i].bgColor = "yellow";
                // console.log(this.onlineStatus);
              }
            }
            this.blockArr = arrs;
            // console.log(this.arrs);
            // for (let i = 0; i < result.data.length; i++) {
            //   let key = result.data[i];
            //   let obj = {};
            //   let aroseTime =
            //     (new Date(key.createTime) - new Date(this.starts)) / 1000; // 发生时间距离开始时间的 秒数
            //   let aroseBlock = Math.ceil(aroseTime / perBlock); // 得出发生上下线时间 属于第几个格子；
            // obj.index = aroseBlock;
            // obj.status = key.status;
            // pointObj[aroseBlock] = key.status;
            // pointArr.push(obj);
            // this.arrs[aroseBlock - 1].bgColor = "yellow";
            // this.arrs[aroseBlock].bgColor = "green";
            // }
            // let len = result.data.length - 1;
            // let lastPointerTime = result.data[len].createTime;
            // let lastProbTime =
            //   (new Date(lastPointerTime) - new Date(this.starts)) / 1000; // 得到数组中最后一项中的时间是属于第几个格子；
            // let lastProbIndex = Math.ceil(lastProbTime / perBlock);
            // let upDown = result.data[len].status;
            // let keys = Object.keys(pointObj);
            // let values = Object.values(pointObj);
            // let firstPointer = values[0];
            // this.arrs.forEach((item, index) => {
            //   if (firstPointer === 0) {
            //     item.bgColor = "green";
            //   } else {
            //     item.bgColor = "gray";
            //   }
            //   if (index >= lastProbIndex) {
            //     this.arrs[index].bgColor = upDown === 0 ? "gray" : "green";
            //   }
            // });
          }
        }
      });
    },
    pageChange() {
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
      this.getData(opts);
    },
    /* 获取数据 */
    getData(params) {
      GetTrajectory(params)
        .then(res => {
          // console.log(res);
          if (res.data.code === 1) {
            onTimeOut(this.$router);
          }
          if (res.data.code === 0) {
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
                // obj.distance = key.distance;
                // obj.distance = distance;
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
              onWarn("此设备当前时间段内，暂无数据");
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
    heatmap() {
      if (this.markerArr.length > 0) {
        map.remove(this.markerArr);
      }
      this.trajectory = false;
      this.active = true;
      map.setCenter([this.gridData[0].lng, this.gridData[0].lat]);
      heatmap.setDataSet({
        data: this.gridData // 热力图数据
      });
      heatmap.show();
      pathSimplifierIns && pathSimplifierIns.hide();
    },
    init() {
      map = new AMap.Map("mapcontainer", {
        resizeEnable: true,
        // mapStyle: 'amap://styles/macaron',
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
    // 历史轨迹 轨迹配置
    track() {
      this.trajectory = true;
      this.active = false;
      heatmap && heatmap.hide();
      if (this.markerArr.length > 0) {
        map.remove(this.markerArr);
      }
      // let lineArr = [];
      // for (var i = 0; i < this.gridData.length; i++) {
      //   var lngX = this.gridData[i].lng;
      //   var latY = this.gridData[i].lat;
      //   var timer = this.gridData[i].pushTime;
      //   if (this.gridData[i].distance) {
      //     this.alldistance += this.gridData[i].distance;
      //   }
      //   lineArr.push([lngX, latY, timer]);
      // }
      console.log("总距离", this.alldistance);
      if (this.lineArr.length < 1) {
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
                "../../../static/img/car.png"
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
      console.log(item);
      let params = {
        pushDateStart: timeFormatSort(this.starts),
        pushDateEnd: timeFormatSort(this.endtime)
      };
      params.batteryId = item.batteryId;
      this.devicelabel = item.batteryId;
      this.queryDevice = item.deviceId;
      this.getData(params);
      this.getTimeList(this.queryDevice);
      // if (this.deviceId && this.pageNum === 1) {
      //   this.devicelabel = item.deviceId;
      //   params.deviceId = item.deviceId;
      //   this.getData(params);
      // } else {
      //   params.batteryId = item.batteryId;
      //   this.devicelabel = item.batteryId;
      //   this.getData(params);
      // }
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
/* .intro h3 {
  padding-left: 8px;
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 10px;
} */
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
.checkTime {
  position: relative;
  margin: 0 auto;
  width: 260px;
  height: auto;
}
.blockInfo {
  position: absolute;
  width: 80%;
  height: auto;
  top: 10px;
  left: 10px;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
}
.checkTime ul {
  display: flex;
  width: 100%;
  border-top: 1px solid #f0f0f0;
  border-left: 1px solid #f0f0f0;
  flex-wrap: wrap;
}
.checkTime ul li {
  flex: 0 0 25px;
  height: 25px;
  border: 1px solid #f0f0f0;
  border-top: none;
  border-left: none;
  list-style: none;
}
.checkTime ul li.yollew {
  background: rgb(226, 213, 26);
}
.checkTime ul li.green {
  background: green;
}
.checkTime ul li.gray {
  background: gray;
}
</style>
