<template>
  <div>
    <div id="container" class="mapWarrp"></div>
  </div>
</template>
<script>
import google from "google";
import { onError } from "../../utils/callback.js";
let map;
// let polygons = [];
// let district;
export default {
  props: ["propData"],
  data() {
    return {
      markers: [],
      hasSet: false
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
    init() {
      try {
        map = new google.maps.Map(document.getElementById("container"), {
          center: {
            lat: 0,
            lng: 0
          },
          zoom: 10
        });
      } catch (err) {
        console.log(err);
        onError("地图加载失败，请检查网络连接");
      }
    },
    mapInit(obj, type) {
      if (this.markers.length > 0) {
        this.markers.forEach(key => {
          key.setMap(null);
        });
        this.markers = [];
      }
      let allmarkerArr = Object.values(obj);
      let labelIndex = 1;
      allmarkerArr.forEach(key => {
        var lngs = key.toString().split(",");
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lngs[1], lngs[0]),
          label: `${labelIndex++}`,
          map: map
        });
        this.markers.push(marker);
      });
      if (type === "http") {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
          bounds.extend(this.markers[i].getPosition());
        }
        map.fitBounds(bounds);
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
.mapWarrp {
  width: 100%;
  height: calc(100vh - 232px);
}
</style>
