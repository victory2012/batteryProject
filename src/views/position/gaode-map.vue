<template>
  <div>
    <div id="positions"
      class="positioned"></div>
  </div>
</template>
<script>
import AMap from "AMap";
// import AMapUI from "AMapUI";
let map;
let infoWindow;
let geocoder;
export default {
  props: ["mapData", "test", "testaa"],
  data () {
    return {
      markers: []
    };
  },
  watch: {
    mapData: {
      handler: function (val, oldVal) {
        this.MapInit(val.data, val.type);
      },
      deep: true
    },
    testaa: {
      handler: function (val) {
        console.log("val", val);
        console.log("testtesttest", this.test);
      }
    }
  },
  methods: {
    init () {
      const lang = sessionStorage.getItem("locale") === "en" ? "en" : "zh_cn";
      map = new AMap.Map("positions", {
        resizeEnable: true,
        zoom: 15,
        lang: lang
      });
      geocoder = new AMap.Geocoder({
        city: "", // 城市设为北京，默认：“全国”
        lang: "en",
        batch: false,
        radius: 500 // 范围，默认：500
      });
      // map.on("click", e => {
      //   if (!geocoder) {
      //     geocoder = new AMap.Geocoder({
      //       lang: "en",
      //       radius: 1000 // 范围，默认：500
      //     });
      //   }
      //   console.log(geocoder);
      //   geocoder.getAddress(e.lnglat, function(status, result) {
      //     console.log(result);
      //   });
      // });
    },
    // setMapCenter(center) {
    //   if (typeof center === "object") {
    //     map && map.setCenter(center);
    //   }
    // },
    MapInit (data, type) {
      // console.log("watch ===>>>", data);
      this.markers && map.remove(this.markers);
      let allmarkerArr = Object.values(data);
      let markerkeys = Object.keys(data);
      for (let i = 0; i < allmarkerArr.length; i++) {
        var lngs = allmarkerArr[i].toString().split(",");
        if (lngs[0].length > 6 && lngs[1].length > 6 && lngs[4] === "1") {
          var marker = new AMap.Marker({
            position: [lngs[0], lngs[1]],
            offset: new AMap.Pixel(-12, -12),
            zIndex: 101,
            extData: {
              position: `${lngs[0]},${lngs[1]}`,
              center: new AMap.LngLat(lngs[0], lngs[1]),
              times: lngs[2]
            },
            map: map
          });
          if (lngs[5] === "0") {
            marker.setIcon("../../../static/img/gray.png");
          } else {
            marker.setIcon(
              `http://webapi.amap.com/theme/v1.3/markers/n/mark_b${i + 1}.png`
            );
          }
          console.log("lngs[7]", lngs);
          if (type === "fromClick") {
            map.setCenter(new AMap.LngLat(lngs[0], lngs[1]));
            marker.setIcon(
              `http://webapi.amap.com/theme/v1.3/markers/n/mark_r${lngs[6]}.png`
            );
          }
          let voltage = lngs[7];
          let content;
          if (voltage === "null") {
            content = `${this.$t("positions.batteryCode")}：${
              lngs[3]
            }<br/>${this.$t("positions.deviceCode")}：${markerkeys[i]}`;
          } else {
            content = `${this.$t(
              "positions.voltage"
            )}：${voltage}<br/>${this.$t("positions.batteryCode")}：${
              lngs[3]
            }<br/>${this.$t("positions.deviceCode")}：${markerkeys[i]}`;
          }
          marker.setLabel({
            offset: new AMap.Pixel(15, 20),
            content: content
          });
          this.markers.push(marker);
        }
      }
      if (type === "http") {
        map.setFitView(); // 自适应地图
      }
      if (this.markers.length > 0) {
        this.markers.forEach((key, index) => {
          key.on("click", () => {
            let pointerData = key.getExtData();
            // console.log(key);
            const self = this;
            geocoder.getAddress(pointerData.center, function (status, result) {
              if (status === "complete" && result.regeocode) {
                let address = result.regeocode.formattedAddress;
                console.log(result);
                var info = [];
                info.push(
                  `<div><div>${self.$t("positions.updateTime")}：${
                    pointerData.times
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
      }
      map.on("click", () => {
        infoWindow && infoWindow.close();
      });
      //   // infoWindow && infoWindow.close();
      // map.on("click", e => {
      //   // infoWindow && infoWindow.close();
      //   // let pointerData = key.getExtData();
      //   //     console.log(key);
      //   //     const self = this;
      //   geocoder = new AMap.Geocoder({
      //     city: "", // 城市设为北京，默认：“全国”
      //     lang: "en",
      //     batch: false,
      //     radius: 500 // 范围，默认：500
      //   });
      //   // pointerData.center
      //   geocoder.getAddress(["121.605167", "31.128314"], function(
      //     status,
      //     result
      //   ) {
      //     if (status === "complete" && result.regeocode) {
      //       // let address = result.regeocode.formattedAddress;
      //       console.log(result);
      //       // var info = [];
      //       // info.push(
      //       //   `<div><div>${self.$t("positions.updateTime")}：${
      //       //     pointerData.times
      //       //   }</div>`
      //       // );
      //       // info.push(
      //       //   `<div style="font-size:14px;">${self.$t(
      //       //     "positions.address"
      //       //   )} :${address}</div></div>`
      //       // );
      //       // infoWindow = new AMap.InfoWindow({
      //       //   content: info.join("<br/>"), // 使用默认信息窗体框样式，显示信息内容
      //       //   autoMove: false,
      //       //   offset: new AMap.Pixel(0, -10)
      //       // });
      //       // infoWindow.open(map, pointerData.center);
      //     }
      //   });
      // });
      // AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
      //   let positionPicker = new PositionPicker({
      //     mode: "dragMarker",
      //     map: map,
      //     iconStyle: {
      //       url: "../../static/img/iocna.png",
      //       size: [1, 1],
      //       ancher: [1, 1]
      //     }
      //   });
      // this.markers.forEach((key, index) => {
      //   key.on("click", e => {
      //     let pointerData = key.getExtData();
      //     console.log(pointerData);
      //     let point = pointerData.position.split(",");
      //     let position = new AMap.LngLat(point[0], point[1]);
      //     positionPicker.start(position);
      //     positionPicker.on("success", result => {
      //       var info = [];
      //       info.push(
      //         `<div><div>${this.$t("positions.updateTime")}：${
      //           pointerData.times
      //         }</div>`
      //       );
      //       info.push(
      //         `<div style="font-size:14px;">${this.$t(
      //           "positions.intersection"
      //         )} :${result.nearestJunction}</div>`
      //       );
      //       info.push(
      //         `<div style="font-size:14px;">${this.$t(
      //           "positions.address"
      //         )} :${result.address}</div></div>`
      //       );
      //       infoWindow = new AMap.InfoWindow({
      //         content: info.join("<br/>"), // 使用默认信息窗体框样式，显示信息内容
      //         autoMove: false,
      //         offset: new AMap.Pixel(0, -10)
      //       });
      //       infoWindow.open(map, position);
      //     });
      //   });
      //   map.on("click", () => {
      //     infoWindow && infoWindow.close();
      //   });
      // });
      // });
    }
  },
  mounted () {
    console.log("testtesttesttesttesttest", this.test);
    this.init();
  }
};
</script>
<style lang="less" scoped>
.positioned {
  width: 100%;
  height: calc(100vh - 110px);
}
</style>
