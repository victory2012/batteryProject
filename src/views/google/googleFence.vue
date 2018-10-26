<template>
  <div class="outer-box">
    <div id="AddContainer" class="fenceContainer"></div>
    <div class="HandleBtn" v-if="addFence">
      <span class="Tiptext">Tips：{{$t('fence.tipMsg.morePointer')}}</span>
      <el-button @click="cancelSetings" type="info">{{$t('fence.cancelSeting')}}</el-button>
      <el-button @click="doAddFence" type="primary">{{$t('fence.sureSeting')}}</el-button>
      <el-button @click="goBack" type="warning">{{$t('fence.back')}}</el-button>
      <p></p>
    </div>
    <div class="HandleBtn" v-else>
      <el-button @click="ToAddFence" type="primary">{{$t('fence.addBtn')}}</el-button>
      <el-button @click="ToDeleteFence" type="danger">{{$t('fence.delBtn')}}</el-button>
    </div>
  </div>
</template>
<script>
import google from "google";
import { getFence, addFence, delFence } from "../../api/index.js";
import { onError, onWarn, onSuccess } from "../../utils/callback.js";
let map;
let markers = [];
// let mouseTool;
let bermudaTriangleArr = [];
// let drawingManager = null;
let label = 1;
export default {
  data() {
    return {
      addFence: false,
      fenceId: "",
      markers: [],
      polygon: null,
      fencePonter: ""
    };
  },
  methods: {
    // 没有设置过围栏
    buildFence() {
      this.addFence = true;
      label = 1;
      markers = [];
      this.fencePonter = "";
      google.maps.event.addListener(map, "click", event => {
        console.log(event.latLng);
        console.log(event);
        var marker = new google.maps.Marker({
          position: event.latLng,
          label: `${label++}`,
          map: map
        });
        this.fencePonter += `${event.latLng
          .lng()
          .toFixed(6)},${event.latLng.lat().toFixed(6)};`;
        // str += `${event.latLng}`
        console.log(this.fencePonter);
        markers.push(marker);
        if (label > 10) {
          google.maps.event.clearListeners(map, "click");
        }
      });
      // drawingManager = new google.maps.drawing.DrawingManager({
      //   drawingMode: google.maps.drawing.OverlayType.MARKER,
      //   drawingControl: false,
      //   drawingControlOptions: {
      //     position: google.maps.ControlPosition.TOP_CENTER,
      //     drawingModes: ["marker"]
      //   }
      // });
      // drawingManager.setMap(map);
      // let str = "";
      // google.maps.event.addListener(
      //   drawingManager,
      //   "overlaycomplete",
      //   event => {
      //     // drawingManager.setDrawingMode(null); // 禁止点击
      //     console.log(event);
      //     if (event.type === "marker") {
      //       str += `${event.overlay.position.lng()},${event.overlay.position.lat()};`;
      //     }
      //     console.log(str);
      //     this.fencePonter = str;
      //     // this.fencePonter = polygon.getPath().getArray(); // 获取在地图上多边形顶点的坐标
      //   }
      // );
    },
    // 已经添加了围栏，根据围栏坐标 画出围栏
    hasFence(gpsList, id) {
      this.addFence = false;
      let poi = gpsList.substring(0, gpsList.length - 1).split(";");
      let allPointers = [];
      let bounds = new google.maps.LatLngBounds();
      poi.forEach((res, index) => {
        let item = res.split(",");
        let arr = new google.maps.LatLng(item[1], item[0]);
        bounds.extend(arr);
        allPointers.push(arr);
      });
      map.fitBounds(bounds); // 自适应显示
      var bermudaTriangle = new google.maps.Polygon({
        paths: [allPointers],
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "#FFC107",
        fillOpacity: 0.6
      });
      bermudaTriangleArr.push(bermudaTriangle);
      bermudaTriangle.setMap(map);
      bermudaTriangle.addListener("click", e => {
        console.log("围栏id", id);
        this.fenceId = id;
        bermudaTriangleArr.forEach(key => {
          key.setOptions({
            fillColor: "#FFC107"
          });
        });
        bermudaTriangle.setOptions({
          fillColor: "#FF0000",
          fillOpacity: 0.8
        });
      });
    },
    // 确认设置 添加围栏
    doAddFence() {
      let gpsObj = {};
      // let str = "";
      console.log(this.fencePonter);
      if (this.fencePonter.length > 0) {
        gpsObj.gpsList = this.fencePonter.substring(
          0,
          this.fencePonter.length - 1
        );
        addFence(gpsObj).then(res => {
          console.log(res);

          if (res.data.code === 0) {
            google.maps.event.clearListeners(map, "click");
            if (markers.length > 0) {
              markers.forEach(key => {
                key.setMap(null);
              });
              markers = [];
            }
            // drawingManager.setDrawingMode(null);
            onSuccess(`${this.$t("fence.tipMsg.addSuccess")}`);
            this.getData();
          }
        });
      } else {
        onError(`${this.$t("fence.tipMsg.addPointer")}`);
      }
    },
    /* 取消设置 */
    cancelSetings() {
      this.addFence = true;
      this.fencePonter = "";
      if (markers.length > 0) {
        markers.forEach(key => {
          key.setMap(null);
        });
        markers = [];
      }
      this.buildFence();
    },
    /* 删除围栏 */
    ToDeleteFence() {
      if (!this.fenceId) {
        onWarn(`${this.$t("fence.tipMsg.selectToDel")}`);
        return;
      }
      delFence(this.fenceId).then(res => {
        console.log(res);

        if (res.data.code === 0) {
          onSuccess(`${this.$t("fence.tipMsg.delSuccess")}`);
          this.getData();
        }
      });
    },
    /* goBack 返回 */
    goBack() {
      this.addFence = false;
      this.fencePonter = "";
      if (markers.length > 0) {
        markers.forEach(key => {
          key.setMap(null);
        });
        markers = [];
      }
      label = 1;
      google.maps.event.clearListeners(map, "click");
    },
    getData() {
      getFence().then(res => {
        console.log(res);

        if (res.data.code === 0) {
          if (bermudaTriangleArr.length > 0) {
            bermudaTriangleArr.forEach(key => {
              key.setMap(null);
            });
          }
          if (res.data.data.length > 0) {
            let result = res.data.data;
            result.forEach(key => {
              let gpsList = key.gpsList;
              let id = key.id;
              this.hasFence(gpsList, id);
            });
          } else {
            this.buildFence();
          }
        }
      });
    },
    ToAddFence() {
      this.addFence = true;
      this.buildFence();
    },
    init() {
      try {
        map = new google.maps.Map(document.getElementById("AddContainer"), {
          center: {
            lat: 0,
            lng: 0
          },
          zoom: 18
        });
        this.getData();
      } catch (err) {
        onError(`${this.$t("mapError")}`);
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
.outer-box {
  position: relative;
  height: 100%;
  // padding-right: 320px;
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
  padding: 5px 10px;
  border-radius: 3px;
  border: 1px solid #000;
  background: #ffffff;
}
</style>
