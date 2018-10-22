<template>
  <div class="warrp">
    <div id="tip">
      选择省：
      <el-select v-model="defaultOption" id='province' placeholder="请选择" @change="selectChange">
        <el-option v-for="item in selectArr" :key="item.adcode" :label="item.name" :value="item.adcode">
        </el-option>
      </el-select>
    </div>
    <div id="container" class="mapWarrp"></div>
  </div>
</template>
<script>
import AMap from "AMap";
// import {
//   mapState
// } from 'vuex'
let map;
let polygons = [];
let district;
// let markerArr = {};
export default {
  props: ["propData"],
  data() {
    return {
      markers: [],
      defaultOption: "全国",
      selectArr: [
        {
          adcode: "all",
          name: "全国"
        }
      ]
    };
  },
  // computed: {
  //   ...mapState(['mapData'])
  // },
  watch: {
    propData: {
      handler: function(val, oldVal) {
        this.mapInit(val.data, val.type);
      },
      deep: true
    }
  },
  methods: {
    getCityData(data) {
      let bounds = data.boundaries;
      if (bounds) {
        for (let i = 0, l = bounds.length; i < l; i++) {
          let polygon = new AMap.Polygon({
            map: map,
            strokeWeight: 1,
            strokeColor: "#0048ff",
            fillColor: "#99fbd2",
            fillOpacity: 0.5,
            path: bounds[i]
          });
          polygons.push(polygon);
        }
        map.setFitView(); // 地图自适应
      }
      let subList = data.districtList;
      if (data.level === "country") {
        // this.selectArr = subList;
        subList.forEach(key => {
          this.selectArr.push(key);
        });
      }
      if (this.limit) {
        setTimeout(() => {
          map.setLimitBounds(map.getBounds());
        }, 300);
      }
      // map.setFitView(); // 地图自适应
    },
    // 检查是否已经设置了区域设置
    getLimitBounds() {
      let limitBounds = map.getLimitBounds();
      if (limitBounds) {
        return true;
      } else {
        return false;
      }
    },
    selectChange() {
      this.limit = true;
      // 先获取一下是否已经设置了区域限制，如果设置了 就先清除掉
      if (this.getLimitBounds()) {
        map.clearLimitBounds();
      }
      for (var i = 0, l = polygons.length; i < l; i++) {
        polygons[i].setMap(null);
      }
      district.setLevel("province");
      district.setExtensions("all");
      district.search(this.defaultOption, (status, result) => {
        if (status === "complete") {
          this.getCityData(result.districtList[0]);
        }
      });
    },
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
      map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 10
      });
      AMap.service("AMap.DistrictSearch", () => {
        district = new AMap.DistrictSearch({
          subdistrict: 1,
          showbiz: false,
          level: "province"
        });
        district.search("中国", (status, result) => {
          if (status === "complete") {
            let data = result.districtList[0];
            this.getCityData(data);
          }
        });
      });
      // setTimeout(() => {
      //   console.log(this.$store.state.mapData);
      // }, 5000)
      // console.log('mapData', this.mapData);
      // console.log(this.propData);
      // console.log(this.propData.data);
      // this.mapInit(this.prop.data, this.prop.type);
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
