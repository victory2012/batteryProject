<template>
  <div class="outer-box">
    <div id="AddContainer"
      class="fenceContainer"></div>
    <div class="HandleBtn">
      <el-button @click="goBack"
        type="primary">{{$t('googleAbno.return')}}</el-button>
    </div>
    <div class="localPosition"
      @click="localPosition"
      :title="$t('googleAbno.title')">
      <img src="../../../static/img/local_normal.png"
        alt="">
    </div>
  </div>
</template>
<script>
import AMap from "AMap";
import { getFence, websockets, singleDeviceId } from "../../api/index.js";
import { onWarn } from "../../utils/callback.js";
let map;
let polygonArr = [];
let pointerObj = {};
export default {
  data () {
    return {
      grid: "",
      json: "",
      fenceId: "",
      polygon: null,
      sendData: { api: "bind", param: [] },
      markers: []
    };
  },
  methods: {
    init () {
      if (this.grid) {
        let point = this.grid.split(";");
        const lang = sessionStorage.getItem("locale") === "en" ? "en" : "zh_cn";
        map = new AMap.Map("AddContainer", {
          center: [point[0], point[1]],
          resizeEnable: true,
          lang: lang,
          zoom: 5
        });
        console.log(point);
        new AMap.Marker({
          map: map,
          position: new AMap.LngLat(point[0], point[1]),
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
          label: {
            content: `${this.$t("googleAbno.Geofence")}`,
            offset: new AMap.Pixel(20, 20)
          }
        });
      } else {
        map = new AMap.Map("AddContainer", {
          resizeEnable: true,
          zoom: 5
        });
      }
      if (this.efence) {
        this.hasFence(this.efence);
      }
      // this.getData();
    },
    // 已经添加了围栏，根据围栏坐标 画出围栏
    hasFence (gpsList) {
      console.log('gpsList ===>>>', gpsList);
      let poi = gpsList.split(";");
      let allPointers = [];
      poi.forEach((res, index) => {
        let item = res.split(",");
        let arr = [item[0], item[1]];
        new AMap.Marker({
          icon: new AMap.Icon({
            image: `http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png`,
            size: new AMap.Size(20, 35)
          }),
          position: arr,
          zIndex: 101,
          clickable: true,
          map: map
        });
        allPointers.push(arr);
      });
      /** 画多边形 */
      var polygons = new AMap.Polygon({
        map: map,
        strokeColor: "#0000ff",
        strokeWeight: 2,
        fillColor: "#f5deb3",
        fillOpacity: 0.6,
        // extData: id,
        cursor: "pointer"
      });
      polygons.setPath(allPointers);
      polygonArr.push(polygons);
      map.setFitView(); // 地图自适应
    },
    /* goBack 返回 */
    goBack () {
      this.$router.push({
        path: "alarmdata"
      });
    },
    getData () {
      getFence().then(res => {
        if (res.data.code === 0) {
          if (res.data.data.length > 0) {
            let result = res.data.data;
            result.forEach(key => {
              // console.log("key", key);
              let gpsList = key.gpsList;
              let id = key.id;
              this.hasFence(gpsList, id);
            });
          }
        }
      });
    },
    mapInit (obj) {
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
          map: map
        });
        marker.setLabel({
          offset: new AMap.Pixel(20, 20),
          content: `${this.$t("googleAbno.nowPosition")}`
        });
        this.markers.push(marker);
      });
    },
    localPosition () {
      this.WS = websockets()
      this.WS.onopen = () => {
        console.log("open....");
        this.singleDevice(this.WS);
      };
      this.WS.onmessage = evt => {
        let data = JSON.parse(evt.data);
        console.log(data);
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
      this.WS.onerror = () => {
        console.log("onerror...");
        this.over();
      };
    },
    over () {
      this.WS.close();
    },
    singleDevice (ws) {
      let NowDeviceId = this.$route.query.deviceId;
      singleDeviceId(NowDeviceId).then(res => {
        if (res.data.code === 0) {
          let result = res.data.data;
          // console.log(result);
          if (result) {
            pointerObj[result.deviceId] = `${result.longitude},${
              result.latitude
            }`;
            this.sendData.param.push(result.deviceId);
            this.mapInit(pointerObj);
            setTimeout(() => {
              ws.send(JSON.stringify(this.sendData));
            }, 1000);
          } else {
            onWarn(`${this.$t("history.noDevice")}`);
          }
        }
      });
    }
  },
  mounted () {
    this.grid = this.$route.query.grid;
    this.efence = this.$route.query.efence; // 围栏
    this.init();
  },
  beforeDestroy () {
    if (typeof this.WS.close === "function") {
      this.over();
    }
  }
};
</script>
<style lang="less" scoped>
.outer-box {
  position: relative;
  height: 100%;
  // padding-right: 320px;
}
.localPosition {
  position: absolute;
  width: 25px;
  height: 25px;
  padding: 5px;
  bottom: 30px;
  left: 20px;
  z-index: 1000;
  background: #ffffff;
  border-radius: 3px;
  cursor: pointer;
  box-shadow: 0px 0px 10px #333333;
}
.localPosition img {
  width: 25px;
  height: auto;
}
.Tiptext {
  color: red;
  font-size: 14px;
  padding-right: 10px;
}
.fenceContainer {
  height: 100%;
  width: 100%;
  border-radius: 5px;
}
.forms {
  width: 300px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 5px;
}
.HandleBtn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  border-radius: 3px;
  background: #ffffff;
}
</style>
