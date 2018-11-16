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
import AMap from "AMap";
import {
  // getFence,
  addFence,
  delFence,
  GetDeviceList,
  getFenceById
} from "../../api/index.js";
import { onError, onWarn, onSuccess } from "../../utils/callback.js";
let map;
let marker;
let markers = [];
let mouseTool;
let mouseToolArr = [];
let polygonArr = [];
// let allPointers = [];
export default {
  data () {
    return {
      chooseId: "",
      total: 0,
      pageNum: 1,
      loading: false,
      addFence: false,
      pointerArr: [],
      json: "",
      fenceId: "",
      polygon: null,
      selectPonter: []
    };
  },
  methods: {
    init () {
      const lang = sessionStorage.getItem("locale") === "en" ? "en" : "zh_cn";
      map = new AMap.Map("AddContainer", {
        resizeEnable: true,
        lang: lang,
        zoom: 5
      });
      this.getListData();
    },
    pageChange (val) {
      this.pageNum = val;
      this.getListData();
    },
    checkItem (item) {
      this.clickItme = item;
      this.addFence = false;
      this.chooseId = this.clickItme.batteryId;
      this.cancelSetings();
      this.getFenceData({
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
            this.getFenceData({
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
      map.plugin(["AMap.MouseTool"], () => {
        mouseTool = new AMap.MouseTool(map);
        mouseTool.polygon();
        // this.mouseTool.close(true); // 移除 画多边形的功能
        mouseToolArr.push(mouseTool);
      });
      map.setDefaultCursor("pointer"); // 手势
      map.on("click", this.callBackFn); // 地图的点击事件
      /*
      * 鼠标右击事件 右击后 要移除地图的点击事件 和画多边形的事件
      */
      map.on("rightclick", e => {
        map.setDefaultCursor(); // 手势
        map.off("click", this.callBackFn); // 移除地图点击事件
        mouseTool.close(false); // 移除 画多边形的功能
      });
    },
    callBackFn (e) {
      if (markers.length === 9) {
        mouseTool.close(false); // 移除 画多边形的功能
      }
      if (markers.length > 9) {
        map.setDefaultCursor(); // 手势
        map.off("click", this.callBackFn); // 移除地图点击事件
        // mouseTool.close(false); // 移除 画多边形的功能
      } else {
        this.selectPonter.push(`${e.lnglat.getLng()},${e.lnglat.getLat()}`);
        // this.json += `${e.lnglat.getLng()},${e.lnglat.getLat()};`; // 获取地图点击的jps坐标位置 集合
        marker = new AMap.Marker({
          map: map,
          position: [e.lnglat.getLng(), e.lnglat.getLat()]
        });
        markers.push(marker);
      }
    },
    // 已经添加了围栏，根据围栏坐标 画出围栏
    hasFence (gpsList, id) {
      this.addFence = false;
      let poi = gpsList.split(";");
      let allPointers = [];
      poi.forEach(res => {
        let item = res.split(",");
        let arr = [item[0], item[1]];
        allPointers.push(arr);
      });
      /** 画多边形 */
      var polygons = new AMap.Polygon({
        map: map,
        strokeColor: "#0000ff",
        strokeWeight: 2,
        fillColor: "#f5deb3",
        fillOpacity: 0.6,
        extData: id,
        cursor: "pointer"
      });
      polygons.setPath(allPointers);
      polygonArr.push(polygons);
      polygons.on("click", e => {
        if (polygonArr.length > 0) {
          polygonArr.forEach(key => {
            key.setOptions({
              strokeColor: "#0000ff",
              fillColor: "#f5deb3",
              fillOpacity: 0.6,
              cursor: "pointer"
            });
            if (e.target.getExtData() === key.G.extData) {
              this.polygon = key;
            }
          });
        }
        e.target.setOptions({
          strokeColor: "#0000ff",
          fillColor: "red",
          fillOpacity: 0.6
        });
        this.fenceId = e.target.getExtData();
      });
      map.setFitView(); // 地图自适应
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
      console.log("gpsList", gpsList);
      let gpsObj = {
        deviceId: this.clickItme.deviceId,
        batteryId: this.clickItme.batteryId,
        gpsList: gpsList
      };
      addFence(gpsObj).then(res => {
        // console.log(res);

        if (res.data.code === 0) {
          onSuccess(`${this.$t("fence.tipMsg.addSuccess")}`);
          this.cancelSetings();
          this.getFenceData({
            batteryId: this.clickItme.batteryId,
            deviceId: this.clickItme.deviceId
          });
        }
      });
    },
    unique (arr) {
      return Array.from(new Set(arr))
    },
    /* 取消设置 */
    cancelSetings () {
      this.selectPonter = [];
      markers && map.remove(markers); // 清除marker点
      mouseTool && mouseTool.close(true); // 清除多边形
      markers = [];
      mouseTool = null;
      /*
      * 点击取消设置后 需要恢复地图的点击事件 和 “AMap.MouseTool”画多边形事件
      * 所以 在执行一下 buildFence（）方法 即可解决
      */
      this.buildFence();
    },
    /* 删除围栏 */
    ToDeleteFence () {
      if (!this.fenceId) {
        onWarn(`${this.$t("fence.tipMsg.selectToDel")}`);
        return;
      }
      delFence(this.fenceId).then(res => {
        if (res.data.code === 0) {
          this.hasFenced = false;
          this.selectPonter = [];
          onSuccess(`${this.$t("fence.tipMsg.delSuccess")}`);
          this.polygon.setMap(null);
        }
      });
    },
    /* goBack 返回 */
    goBack () {
      this.cancelSetings();
      this.addFence = false;
      map.setDefaultCursor(); // 手势
      map.off("click", this.callBackFn); // 移除地图点击事件
      mouseTool.close(false); // 移除 画多边形的功能
      this.getFenceData({
        batteryId: this.clickItme.batteryId,
        deviceId: this.clickItme.deviceId
      });
    },
    /*
      参数 data {"batteryId":1,"deviceId":2}
     */
    getFenceData (data) {
      getFenceById(data).then(res => {
        console.log("getFenceById", res);
        if (res.data.code === 0) {
          this.selectPonter = [];
          map.clearMap();
          let result = res.data.data;
          if (result) {
            map.setDefaultCursor(); // 手势
            map.off("click", this.callBackFn); // 移除地图点击事件
            mouseTool && mouseTool.close(false); // 移除 画多边形的功能
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
      if (this.hasFenced) return;
      this.addFence = true;
      markers = [];
      // console.log(mouseToolArr);
      if (mouseToolArr.length > 0) {
        mouseToolArr.forEach(key => {
          key.close(false);
        });
      }
      mouseTool = null;
      // console.log(polygonArr);
      if (polygonArr.length > 0) {
        polygonArr.forEach(key => {
          key.hide();
        });
      }
      mouseToolArr = [];
      polygonArr = [];
      this.buildFence();
    }
  },
  mounted () {
    this.init();
  },
  beforeDestroy () {
    map.destroy();
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
