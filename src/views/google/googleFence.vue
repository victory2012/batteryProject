<template>
  <div class="outer-box">
    <div class="mapCenter">
      <div id="AddContainer"
        class="fenceContainer"></div>
      <div class="HandleBtn"
        v-if="addFence">
        <span class="Tiptext">Tips：{{$t('fence.tipMsg.morePointer')}}</span>
        <el-button @click="cancelSetings"
          type="info">{{$t('fence.cancelSeting')}}</el-button>
        <el-button @click="doAddFence"
          type="primary">{{$t('fence.sureSeting')}}</el-button>
        <el-button @click="goBack"
          type="warning">{{$t('fence.back')}}</el-button>
        <p></p>
      </div>
      <div class="HandleBtn"
        v-else>
        <el-button @click="ToAddFence"
          type="primary">{{$t('fence.addBtn')}}</el-button>
        <el-button @click="ToDeleteFence"
          type="danger">{{$t('fence.delBtn')}}</el-button>
      </div>
    </div>
    <div class="listCenter">
      <div id="panel">
        <div class="panelTop"
          v-loading="loading">
          <div id="intro"
            class="intro">
            <h3>
              <span>{{$t("history.batteryList")}}</span>
              <!-- <el-button type="text" mini>{{$t('positions.lookAll')}}</el-button> -->
            </h3>
          </div>
          <ul class="list_warp">
            <li v-for="(item, index) in pointerArr"
              :class="{'selected': chooseId === item.batteryId }"
              :key="item.deviceId"
              @click="checkItem(item)">
              <p>{{index + 1}}、{{item.batteryId}}</p>
              <!-- <el-badge :value="item.onLine" class="item">
                <el-button @click.prevent.stop="HistoryTrack(item.batteryId)" size="mini">{{$t('positions.track')}}</el-button>
              </el-badge> -->
            </li>
          </ul>
        </div>
        <div class="page">
          <el-pagination @current-change="pageChange"
            :current-page.sync="pageNum"
            small
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import google from "google";
import {
  getFenceById,
  addFence,
  delFence,
  GetDeviceList
} from "../../api/index.js";
import { onError, onWarn, onSuccess } from "../../utils/callback.js";
let map;
// let mouseTool;
let bermudaTriangleArr = [];
// let drawingManager = null;

export default {
  data () {
    return {
      chooseId: "",
      total: 0,
      label: 1,
      pageNum: 1,
      loading: false,
      addFence: false,
      pointerArr: [],
      fenceId: "",
      markers: [],
      polygon: null,
      fencePonter: "",
      selectPonter: []
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
          zoom: 18
        });
        this.getListData();
      } catch (err) {
        onError(`${this.$t("mapError")}`);
      }
    },
    pageChange (val) {
      this.pageNum = val;
      this.getListData();
    },
    checkItem (item) {
      this.label = 1;
      this.clickItme = item;
      this.addFence = false;
      this.chooseId = this.clickItme.batteryId;
      this.cancelSetings();
      this.goBack();
      this.getData({
        batteryId: this.clickItme.batteryId,
        deviceId: this.clickItme.deviceId
      });
    },
    // 获取列表数据
    getListData () {
      let pageObj = {
        pageNum: this.pageNum,
        pageSize: 10,
        bindingStatus: 1
      };
      this.loading = true;
      GetDeviceList(pageObj).then(res => {
        console.log(res.data);
        this.loading = false;
        if (res.data.code === 0) {
          this.pointerArr = [];
          let result = res.data.data;
          this.total = result.total;
          this.pointerArr = [...result.data];
          if (this.pointerArr.length > 0) {
            this.clickItme = this.pointerArr[0];
            this.chooseId = this.clickItme.batteryId;
            this.getData({
              batteryId: this.clickItme.batteryId,
              deviceId: this.clickItme.deviceId
            });
          }
        }
      });
    },
    // 没有设置过围栏
    buildFence () {
      this.addFence = true;
      this.label = 1;
      this.markers = [];
      this.selectPonter = [];
      google.maps.event.addListener(map, "click", event => {
        var marker = new google.maps.Marker({
          position: event.latLng,
          label: `${this.label++}`,
          map: map
        });
        // this.fencePonter += `${event.latLng
        //   .lng()
        //   .toFixed(6)},${event.latLng.lat().toFixed(6)};`;
        this.selectPonter.push(`${event.latLng
          .lng()
          .toFixed(6)},${event.latLng.lat().toFixed(6)}`);
        console.log(this.fencePonter);
        this.markers.push(marker);
        if (this.label > 10) {
          google.maps.event.clearListeners(map, "click");
        }
      });
    },
    // 已经添加了围栏，根据围栏坐标 画出围栏
    hasFence (gpsList, id) {
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
    unique (arr) {
      return Array.from(new Set(arr))
    },
    // 确认设置 添加围栏
    doAddFence () {
      let pointer = this.unique(this.selectPonter);
      if (pointer.length === 0) {
        onError(`${this.$t("fence.tipMsg.addPointer")}`);
        return;
      }
      if (pointer.length < 3) {
        onError(`${this.$t("fence.tipMsg.less")}`);
        return;
      }
      let gpsList = '';
      pointer.forEach(key => {
        gpsList += key + ';'
      })
      let gpsObj = {
        deviceId: this.clickItme.deviceId,
        batteryId: this.clickItme.batteryId,
        gpsList: gpsList
      };
      addFence(gpsObj).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          google.maps.event.clearListeners(map, "click");
          if (this.markers.length > 0) {
            this.markers.forEach(key => {
              key.setMap(null);
            });
            this.markers = [];
          }
          // drawingManager.setDrawingMode(null);
          onSuccess(`${this.$t("fence.tipMsg.addSuccess")}`);
          this.getData({
            batteryId: this.clickItme.batteryId,
            deviceId: this.clickItme.deviceId
          });
        }
      });
    },
    /* 取消设置 */
    cancelSetings () {
      this.addFence = true;
      this.selectPonter = [];
      this.label = 1;
      google.maps.event.clearListeners(map, "click");
      if (this.markers.length > 0) {
        this.markers.forEach(key => {
          key.setMap(null);
        });
        this.markers = [];
      }
      this.buildFence();
    },
    /* 删除围栏 */
    ToDeleteFence () {
      if (!this.fenceId) {
        onWarn(`${this.$t("fence.tipMsg.selectToDel")}`);
        return;
      }
      delFence(this.fenceId).then(res => {
        console.log(res);

        if (res.data.code === 0) {
          onSuccess(`${this.$t("fence.tipMsg.delSuccess")}`);
          this.selectPonter = [];
          this.getData({
            batteryId: this.clickItme.batteryId,
            deviceId: this.clickItme.deviceId
          });
        }
      });
    },
    /* goBack 返回 */
    goBack () {
      this.addFence = false;
      this.selectPonter = [];
      if (this.markers.length > 0) {
        this.markers.forEach(key => {
          key.setMap(null);
        });
        this.markers = [];
      }
      this.label = 1;
      google.maps.event.clearListeners(map, "click");
      this.getData({
        batteryId: this.clickItme.batteryId,
        deviceId: this.clickItme.deviceId
      });
    },
    getData (data) {
      getFenceById(data).then(res => {
        console.log(res);
        this.selectPonter = [];
        if (res.data.code === 0) {
          if (bermudaTriangleArr.length > 0) {
            bermudaTriangleArr.forEach(key => {
              key.setMap(null);
            });
          }
          let result = res.data.data;
          if (result) {
            this.hasFenced = true;
            let gpsList = result.gpsList.substring(0, result.gpsList.length - 1);
            let id = result.id;
            this.hasFence(gpsList, id);
          } else {
            this.hasFenced = false;
            // this.buildFence();
          }
        }
      });
    },
    ToAddFence () {
      this.addFence = true;
      this.buildFence();
    }
  },
  mounted () {
    this.init();
  }
};
</script>

<style lang="less" scoped>
.outer-box {
  display: flex;
  height: 100%;
  // padding-right: 320px;
}

.mapCenter {
  position: relative;
  flex: 1;
}
.listCenter {
  flex: 0 0 270px;
  background: #fff;
}
.list_warp {
  border-top: 1px solid #f0f0f0;
  min-height: 510px;
}
.list_warp li {
  position: relative;
  height: 50px;
  border-bottom: 1px solid #f0f0f0;
  line-height: 50px;
  font-size: 14px;
  color: #303133;
  cursor: pointer;
  padding-left: 10px;
}
.list_warp li.off {
  cursor: not-allowed;
}
.off .el-badge__content {
  background: #f0f0f0;
  color: #b3b2b2;
}
.list_warp .el-badge__content.is-fixed {
  top: 13px;
  right: 12px;
}
.list_warp li .item {
  position: absolute;
  top: 0;
  right: 34px;
}
.list_warp li p {
  width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.list_warp .selected {
  background: rgb(112, 191, 255);
  color: #fff;
}
.intro h3 {
  position: relative;
  text-align: center;
  font-weight: normal;
  font-size: 16px;
  margin: 10px 0;
  height: 30px;
  line-height: 30px;
}
.page {
  padding-top: 20px;
  text-align: right;
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
