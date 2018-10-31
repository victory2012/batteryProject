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
        onError(this.$t("mapError"));
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
        // marker.addListener("click", e => {
        //   var latLngData =
        //     e.latLng.lat().toFixed(6) + "," + e.latLng.lng().toFixed(6);
        //   this.$.ajax({
        //     type: "post",
        //     url:
        //       "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        //       latLngData +
        //       "&key=AIzaSyC8IXpNgfA7uD-Xb0jEqhkEdB7j3gbgOiE&location_type=ROOFTOP",
        //     async: true,
        //     success: function(data) {
        //       console.log(data);
        //       var site =
        //         "坐标：" +
        //         latLngData +
        //         "<br />" +
        //         "地址：" +
        //         data.results[0].formatted_address;
        //       var infowindow = new google.maps.InfoWindow({
        //         content: site
        //       });
        //       infowindow.open(map, marker); // 弹出信息提示窗口
        //       map.addListener("click", () => {
        //         infowindow.close();
        //       });
        //     }
        //   });
        // });
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
