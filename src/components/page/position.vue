<template>
  <div>
    <div id="positions" class="positions"></div>
  </div>
</template>
<script>
import AMap from "AMap";
let map;
let marker = null;
let index = 0;
let timer = null;
let mapData = [
  {
    lng: 121.515152,
    lat: 31.233275,
    count: 150
  },
  {
    lng: 121.51469,
    lat: 31.233422,
    count: 150
  },
  {
    lng: 121.514401,
    lat: 31.233522,
    count: 150
  },
  {
    lng: 121.514197,
    lat: 31.233568,
    count: 150
  },
  {
    lng: 121.513993,
    lat: 31.233669,
    count: 150
  },
  {
    lng: 121.513778,
    lat: 31.233724,
    count: 150
  },
  {
    lng: 121.513542,
    lat: 31.233825,
    count: 150
  },
  {
    lng: 121.513403,
    lat: 31.233853,
    count: 150
  },
  {
    lng: 121.512705,
    lat: 31.234064,
    count: 150
  },
  {
    lng: 121.511504,
    lat: 31.234394,
    count: 150
  },
  {
    lng: 121.510442,
    lat: 31.234743,
    count: 150
  },
  {
    lng: 121.509208,
    lat: 31.235109,
    count: 150
  },
  {
    lng: 121.508725,
    lat: 31.235247,
    count: 150
  },
  {
    lng: 121.507212,
    lat: 31.235742,
    count: 150
  },
  {
    lng: 121.506805,
    lat: 31.235871,
    count: 150
  },
  {
    lng: 121.506011,
    lat: 31.236219,
    count: 150
  },
  {
    lng: 121.505496,
    lat: 31.236339,
    count: 150
  },
  {
    lng: 121.504949,
    lat: 31.236531,
    count: 150
  },
  {
    lng: 121.503232,
    lat: 31.237201,
    count: 150
  },
  {
    lng: 121.502202,
    lat: 31.237641,
    count: 150
  }
];
// let lnglat;
export default {
  data() {
    return {
      lnglats: [
        {
          id: "a",
          position: [116.020764, 39.904989],
          desc: "数据_1"
        },
        {
          id: "b",
          position: [116.405285, 39.904989],
          desc: "数据_2"
        },
        {
          id: "c",
          position: [116.789806, 39.904989],
          desc: "数据_3"
        },
        {
          id: "e",
          position: [114.020711, 38.904911],
          desc: "数据_12"
        },
        {
          id: "f",
          position: [115.405111, 37.904111],
          desc: "数据_22"
        },
        {
          id: "g",
          position: [115.789555, 36.904555],
          desc: "数据_13"
        },
        {
          id: "aa",
          position: [116.920711, 39.104911],
          desc: "数据_12"
        },
        {
          id: "bb",
          position: [116.205111, 39.304111],
          desc: "数据_22"
        },
        {
          id: "cc",
          position: [116.289555, 39.704555],
          desc: "数据_13"
        },
        {
          id: "aba",
          position: [116.330711, 39.994911],
          desc: "数据_12"
        },
        {
          id: "cbb",
          position: [116.445111, 39.664111],
          desc: "数据_22"
        },
        {
          id: "cfc",
          position: [116.669555, 39.114555],
          desc: "数据_13"
        },
        {
          id: "abqa",
          position: [114.330711, 39.294911],
          desc: "数据_12"
        },
        {
          id: "cbbd",
          position: [115.445111, 39.364111],
          desc: "数据_22"
        },
        {
          id: "cfwc",
          position: [117.669555, 39.614555],
          desc: "数据_13"
        }
      ],
      lnglat: ""
    };
  },
  methods: {
    init() {
      map = new AMap.Map("positions", {
        resizeEnable: true,
        // center: [116.397428, 39.90923],
        zoom: 10
      });
      timer = setInterval(() => {
        // marker.setMap(null);
        // marker = null;
        marker.setAnimation();
        index++;
        if (index > mapData.length) {
          clearInterval(timer);
        }
        console.log(mapData[index]);
        this.lnglat = [mapData[index].lng, mapData[index].lat];
        marker = new AMap.Marker({
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: this.lnglat
        });
        marker.setMap(map);
        marker.setAnimation('AMAP_ANIMATION_BOUNCE');
      }, 5000);
      this.lnglat = [mapData[0].lng, mapData[0].lat];
      marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: this.lnglat
      });
      marker.setMap(map);
      marker.setAnimation('AMAP_ANIMATION_BOUNCE');
      // this.lnglat = [mapData[0].lng, mapData[0].lat];

      // for (var i = 0; i < mapData.length; i++) {
      //   var marker = new AMap.Marker({
      //     icon: new AMap.Icon({
      //       image: `http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png`,
      //       size: new AMap.Size(20, 35)
      //     }),
      //     // position: this.lnglats[i].position,
      //     position: [mapData[i].lng, mapData[i].lat],
      //     offset: new AMap.Pixel(-12, -12),
      //     zIndex: 101,
      //     clickable: true,
      //     map: map
      //   });
      //   var content = i + 1;

      //   marker.emit("dblclick", { target: marker });
      // }
      // var marker = new AMap.Marker({
      //   icon: new AMap.Icon({
      //     image: `http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png`,
      //     size: new AMap.Size(20, 35)
      //   }),
      //   position: this.lnglat,
      //   // position: [mapData[i].lng, mapData[i].lat],
      //   offset: new AMap.Pixel(-12, -12),
      //   zIndex: 101,
      //   clickable: true,
      //   map: map
      // });
      // AMap.event.addListener(marker, "click", e => {
      //   console.log(e);
      //   console.log("1231321");
      //   // this.$router.push({ name: "map2" });
      // });
      map.setFitView();
    }
    // getData() {
    //   api.GetList().then(res => {
    //     console.log(res.data.data);
    //     // this.lnglats = res.data.data;
    //     this.init();
    //   });
    // }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    clearInterval(timer);
  }
};
</script>
<style scoped>
.positions {
  width: 100%;
  height: calc(100vh - 110px);
}
</style>
