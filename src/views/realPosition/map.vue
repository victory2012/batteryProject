<template>
  <div>
    <div :id="mapWarpId" class="positioned"></div>
  </div>
</template>

<script>
import AMap from "AMap";
import google from "google";
import { onError } from "../../utils/callback";

let map;
let infoWindow;
let geocoder;
export default {
  name: "",
  props: {
    mapData: {
      type: Object,
      default: () => []
    },
    // mapType: {
    //   type: Number,
    //   default: () => ""
    // },
    // center: {
    //   type: Object,
    //   default: () => ({})
    // },
    lang: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      markerTime: [],
      markers: [],
      firstRender: true,
      mapWarpId: `map${Math.random()}`
    };
  },

  watch: {
    mapData: {
      handler: function(val) {
        this.getData(val);
      },
      deep: true
    }
  },

  mounted() {
    this.mapType = Number(sessionStorage.getItem("mapType"));
    this.mapInit();
  },

  methods: {
    getData(data) {
      if (this.mapType === 1) {
        this.GoogleGetData(data);
      } else {
        this.gaodeGetData(data);
      }
    },
    mapInit() {
      if (this.mapType === 0) {
        // const lang = sessionStorage.getItem("locale") === "en" ? "en" : "zh_cn";
        map = new AMap.Map(this.mapWarpId, {
          resizeEnable: true,
          zoom: 15,
          lang: this.lang
        });
        geocoder = new AMap.Geocoder({
          city: "", // 城市设为北京，默认：“全国”
          lang: this.lang,
          batch: false,
          radius: 1000 // 范围，默认：500
        });
        this.gaodeGetData(this.mapData.data);
      } else {
        try {
          map = new google.maps.Map(document.getElementById(this.mapWarpId), {
            center: {
              lat: 0,
              lng: 0
            },
            zoom: 15
          });
          this.GoogleGetData(this.mapData.data);
        } catch (err) {
          onError(this.$t("mapError"));
        }
      }
    },
    gaodeGetData(result) {
      let data = result.data;
      if (!data) return;
      console.log("data", result);
      this.markers && map.remove(this.markers);

      data.forEach(key => {
        if (!key.lngs || !key.lat) return;
        let content;
        let position = new AMap.LngLat(key.lngs, key.lat);
        let voltage = key.voltage;
        let marker = new AMap.Marker({
          position: position,
          offset: new AMap.Pixel(-12, -12),
          zIndex: 101,
          extData: {
            position: `${key.lngs},${key.lat}`,
            center: position,
            time: key.time
          },
          map: map
        });
        if (key.onlineStatus === 0) {
          marker.setIcon("../../../static/img/gray.png");
        } else {
          marker.setIcon(
            `http://webapi.amap.com/theme/v1.3/markers/n/mark_b${key.index}.png`
          );
        }
        if (voltage !== "null") {
          content = `${this.$t("positions.batteryCode")}：${
            key.batteryId
          }<br/>${this.$t("positions.deviceCode")}：${key.deviceId}`;
        } else {
          content = `${this.$t("positions.voltage")}：${voltage}<br/>${this.$t(
            "positions.batteryCode"
          )}：${key.batteryId}<br/>${this.$t("positions.deviceCode")}：${
            key.deviceId
          }`;
        }
        marker.setLabel({
          offset: new AMap.Pixel(15, 20),
          content: content
        });
        this.markers.push(marker);
      });
      if (result.type === "normal" && this.firstRender) {
        this.firstRender = !this.firstRender;
        map.setFitView();
      } else {
        // map.setCenter(new AMap.LngLat(data[0].lngs, data[0].lat));
      }
      this.markers.forEach((key, index) => {
        key.on("click", () => {
          let pointerData = key.getExtData();
          console.log("pointerData", pointerData);
          const self = this;
          geocoder.getAddress(pointerData.center, function(status, result) {
            if (status === "complete" && result.regeocode) {
              let address = result.regeocode.formattedAddress;
              console.log(result);
              var info = [];
              info.push(
                `<div><div>${self.$t("positions.updateTime")}：${
                  pointerData.time
                }</div>`
              );
              info.push(
                `<div style="font-size:14px;">${self.$t(
                  "positions.address"
                )} :${address}</div></div>`
              );
              infoWindow = new AMap.InfoWindow({
                content: info.join("<br/>"), // 信息窗体框，显示信息内容
                autoMove: false,
                offset: new AMap.Pixel(0, -10)
              });
              infoWindow.open(map, pointerData.center);
            }
          });
        });
      });

      map.on("click", () => {
        infoWindow && infoWindow.close();
      });
    },
    GoogleGetData(result) {
      let data = result.data;
      if (!data) return;
      if (this.markers.length > 0) {
        this.markers.forEach(key => {
          key.setMap(null);
        });
        this.markers = [];
      }
      this.markerTime = [];
      data.forEach(key => {
        let obj = {};
        let content;
        if (!key.lngs || !key.lat) return;
        let latLng = new google.maps.LatLng(key.lat, key.lngs);
        let voltage = key.voltage;
        if (voltage) {
          content = `${this.$t("positions.batteryCode")}：${
            key.batteryId
          }\n${this.$t("positions.deviceCode")}：${key.deviceId}\n${this.$t(
            "positions.voltage"
          )}：${voltage}`;
        } else {
          content = `${this.$t("positions.batteryCode")}：${
            key.batteryId
          }\n${this.$t("positions.deviceCode")}：${key.deviceId}`;
        }
        let marker = new google.maps.Marker({
          position: latLng,
          label: `${key.index}`,
          title: content,
          map: map
        });
        obj.pointer = marker;
        obj.data = key;
        this.markerTime.push(obj);
        this.markers.push(marker);
      });
      this.markerTime.forEach(key => {
        const self = this;
        let voltage = key.data.voltage;
        key.pointer.addListener("click", e => {
          let latLngData =
            e.latLng.lat().toFixed(6) + "," + e.latLng.lng().toFixed(6);
          let site;
          if (key.voltage) {
            site = `${self.$t("positions.updateTime")}：${
              key.data.time
            }<br />${self.$t("positions.latLng")}：${latLngData}<br />${self.$t(
              "positions.voltage"
            )}：${voltage}`;
          } else {
            site = `${self.$t("positions.updateTime")}：${
              key.data.time
            }<br />${self.$t("positions.latLng")}：${latLngData}`;
          }
          this.infowindow = new google.maps.InfoWindow({
            content: site
          });
          this.infowindow.open(map, key.pointer); // 弹出信息提示窗口
          map.addListener("click", () => {
            this.infowindow.close();
          });
        });
      });
      if (this.markers.length > 1) {
        if (!this.firstRender) return;
        this.firstRender = !this.firstRender;
        let bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
          bounds.extend(this.markers[i].getPosition());
        }
        map.fitBounds(bounds);
      } else {
        map.setCenter(
          new google.maps.LatLng(
            this.markers[0].latitude,
            this.markers[0].longitude
          )
        );
      }
    }
  }
};
</script>
<style lang='' scoped>
.positioned {
  width: 100%;
  height: calc(100vh - 110px);
}
</style>
