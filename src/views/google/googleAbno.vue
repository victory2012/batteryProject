<template>
  <div class="outer-box">
    <div id="AddContainer"
      class="fenceContainer"></div>
    <div class="HandleBtn">
      <el-button @click="goBack"
        type="primary">{{$t('googleAbno.return')}}</el-button>
    </div>
    <div class="localPosition"
      @click="singleDevice"
      :title="$t('googleAbno.title')">
      <img src="../../../static/img/local_normal.png"
        alt="">
    </div>
  </div>
</template>
<script>
import google from "google";
import { getFence, websockets, singleDeviceId } from "../../api/index.js";
import { onError } from "../../utils/callback.js";
let map;
let pointerObj = {};
export default {
  data () {
    return {
      json: "",
      grid: "",
      efence: "",
      fenceId: "",
      polygon: null,
      sendData: { api: "bind", param: [] },
      markers: []
    };
  },
  methods: {
    init () {
      try {
        map = new google.maps.Map(document.getElementById("AddContainer"), {
          center: {
            lat: 0,
            lng: 0
          },
          zoom: 15
        });
        if (this.grid) {
          let point = this.grid.split(";");
          let outPointer = new google.maps.LatLng(point[1], point[0]);
          map.setCenter(outPointer);
          let marker = new google.maps.Marker({
            position: outPointer,
            label: "out",
            title: `${this.$t("googleAbno.Geofence")}`,
            map: map
          });
          this.markers.push(marker);
        }
        if (this.efence) {
          this.hasFence(this.efence);
        }
      } catch (err) {
        onError(`${this.$t("mapError")}`);
      }
    },
    // 已经添加了围栏，根据围栏坐标 画出围栏
    hasFence (gpsList) {
      let poi = gpsList.substring(0, gpsList.length - 1).split(";");
      let allPointers = [];
      poi.forEach((res, index) => {
        let item = res.split(",");
        let arr = new google.maps.LatLng(item[1], item[0]);
        let marker = new google.maps.Marker({
          position: arr,
          // label: `${index + 1}`,
          map: map
        });
        this.markers.push(marker);
        allPointers.push(arr);
      });
      let bermudaTriangle = new google.maps.Polygon({
        paths: [...allPointers],
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "#FFC107",
        fillOpacity: 0.6
      });
      bermudaTriangle.setMap(map);
      let bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < this.markers.length; i++) {
        bounds.extend(this.markers[i].getPosition());
      }
      map.fitBounds(bounds);
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
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lngs[1], lngs[0]),
          title: `${this.$t("googleAbno.nowPosition")}`,
          label: "now",
          map: map
        });
        this.markers.push(marker);
      });
    },
    localPosition (data) {
      this.WX = websockets();
      this.WX.onopen = () => {
        console.log("open....");
        this.WX.send(data);
      };
      this.WX.onmessage = evt => {
        let data = JSON.parse(evt.data);
        console.log(data);
        if (data.code === 2) {
          if (this.markers.length > 0) {
            this.markers.forEach(key => {
              key.setMap(null);
            });
            this.markers = [];
          }
          // code 为 1时 既绑定成功，2时为 收到了数据
          let obj = data.data.split(",");
          obj.forEach(() => {
            pointerObj[obj[0]] = `${obj[2]},${obj[1]}`;
          });
          this.mapInit(pointerObj);
        }
      };
      this.WX.onerror = () => {
        console.log("onerror...");
        onError(`${this.$t("connectErr")}`);
        this.over();
      };
    },
    over () {
      this.WX.close();
    },
    singleDevice () {
      let NowDeviceId = this.$route.query.deviceId;
      singleDeviceId(NowDeviceId).then(res => {
        if (res.data.code === 0) {
          let result = res.data.data;
          console.log(result);
          if (this.markers.length > 0) {
            this.markers.forEach(key => {
              key.setMap(null);
            });
            this.markers = [];
          }
          if (result) {
            pointerObj[result.deviceId] = `${result.longitude},${
              result.latitude
            }`;
            this.sendData.param.push(result.deviceId);
            this.mapInit(pointerObj);
            this.localPosition(JSON.stringify(this.sendData));
          }
        }
      });
    }
  },
  mounted () {
    this.grid = this.$route.query.grid;
    this.efence = this.$route.query.efence;
    this.init();
  },
  beforeDestroy () {
    if (typeof this.over === "function") {
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
