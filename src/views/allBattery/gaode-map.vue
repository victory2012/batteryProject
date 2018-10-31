<template>
  <div class="warrp">
    <!-- <div id="tip">
      选择省：
      <el-select v-model="defaultOption" id='province' placeholder="请选择" @change="selectChange">
        <el-option v-for="item in selectArr" :key="item.adcode" :label="item.name" :value="item.adcode">
        </el-option>
      </el-select>
    </div> -->
    <div id="container" class="mapWarrp"></div>
  </div>
</template>
<script>
import AMap from "AMap";
// import {
//   mapState
// } from 'vuex'
let map;
// let polygons = [];
// let district;
// let markerArr = {};
export default {
  props: ["propData"],
  data() {
    return {
      markers: []
    };
  },

  watch: {
    propData: {
      handler: function(val, oldVal) {
        this.mapInit(val.data, val.type);
      },
      deep: true
    }
  },
  methods: {
    mapInit(obj, type) {
      console.log(obj);
      if (this.markers.length > 0) {
        map.remove(this.markers);
        this.markers = [];
      }
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
          clickable: true,
          map: map
        });
        this.markers.push(marker);
      });
      if (type === "http") {
        map.setFitView(); // 地图自适应
      }
    },
    init() {
      const lang = sessionStorage.getItem("locale") === "en" ? "en" : "zh_cn";
      map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 10,
        lang: lang
      });
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    map.destroy();
  }
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
#tip {
  background-color: #fff;
  padding: 0 10px;
  border: 1px solid silver;
  box-shadow: 3px 4px 3px 0px silver;
  position: absolute;
  font-size: 12px;
  right: 30px;
  top: 153px;
  border-radius: 3px;
  line-height: 36px;
  z-index: 999;
}
.mapWarrp {
  width: 100%;
  height: calc(100vh - 232px);
}
</style>
