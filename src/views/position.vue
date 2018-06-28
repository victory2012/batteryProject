<template>
  <div id="outer-box">
    <div id="positions" class="positions"></div>
    <!-- <div id="panel">
      <div class="panelTop">
        <div id="intro" class="intro">
          <h3>设备列表</h3>
        </div>
        <el-collapse v-model="activeName" :accordion="true" @change="collapseChange(activeName)">
          <el-collapse-item v-for="(item, index) in lnglats" :key="item.id" :title='item.id' :name='index + 1'>
            <div>{{item.desc}}</div>
            <div>{{item.position}}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div> -->
  </div>
</template>
<script>
import AMap from "AMap";
// import AMapUI from "AMapUI";
import { websockets, realTimeLocation, GetDeviceList } from "../api/index.js";
let map;
let marker;
// let index = 0;
// let timer = null;
// let mapData = [
//   {
//     lng: 121.53798361550186,
//     lat: 31.22376799858114,
//     count: 150
//   },
//   {
//     lng: 116.328911,
//     lat: 39.937229,
//     count: 150
//   }
// ];
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
        }
      ],
      lnglat: "",
      activeName: 1
    };
  },
  methods: {
    init() {
      map = new AMap.Map("positions", {
        resizeEnable: true,
        center: [121.533669, 31.225885],
        zoom: 15
      });
      this.sockets();
      // timer = setInterval(() => {
      //   marker.setAnimation();
      //   index++;
      //   if (index > mapData.length) {
      //     clearInterval(timer);
      //   }
      //   console.log(mapData[index]);
      //   this.lnglat = [mapData[index].lng, mapData[index].lat];
      //   marker = new AMap.Marker({
      //     icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      //     position: this.lnglat
      //   });
      //   marker.setMap(map);
      //   marker.setAnimation("AMAP_ANIMATION_BOUNCE");
      // }, 5000);

      // this.lnglat = [116.403322, 39.900255];
      // marker = new AMap.Marker({
      //   icon: "http://www.17sucai.com/static/i/loading.gif",
      //   position: this.lnglat
      // });
      // marker.setMap(map);

      // marker.setAnimation("AMAP_ANIMATION_BOUNCE");
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
      map.setFitView();
    },
    narmleHttp(ws) {
      let pageObj = {
        pageNum: 1,
        pageSize: 999999999
      };
      GetDeviceList(pageObj)
        .then(res => {
          console.log(res.data);
          if (res.data.code === 1) {
            this.$message({
              message: "登录超时，请重新登录",
              type: "warning"
            });
            this.$router.push({
              path: "/login"
            });
          }
          if (res.data.code === 0) {
            // let result = res.data.data;
            // console.log(this.sendData)
            // ws.send(JSON.stringify(this.sendData));
          }
          if (res.data.code === -1) {
            this.$message.error(res.data.msg);
          }
        })
        .catch(() => {
          this.$message.error("服务器请求超时，请稍后重试");
        });
    },
    /*
      websockets 请求
     */
    sockets() {
      websockets(ws => {
        ws.onopen = () => {
          console.log("open....");
          // this.narmleHttp(ws);
          ws.send(JSON.stringify({ api: "bind", param: ["2B85ACC19D5E"] }));
        };
        ws.onmessage = evt => {
          this.markers && map.remove(this.markers);
          console.log("onmessage...", evt);
          let data = JSON.parse(evt.data);
          console.log(data);
          if (data.code === 1) {
            this.onLine = data.data;
          }
          if (data.code === 2) {
            // code 为 1时 既绑定成功，2时为 收到了数据
            this.mapInit(data.data);
          }
        };
        ws.onerror = () => {
          console.log("onerror...");
          this.$message({
            message: "服务器繁忙，请稍后重试。",
            type: "error"
          });
          this.over();
        };
        this.over = () => {
          ws.close();
        };
      });
    },
    mapInit(data) {
      if (marker) {
        marker.setAnimation();
        marker.setMap(null);
      }
      var lnglats = data.toString().split(",");
      var lnglatsArr = [lnglats[1], lnglats[0]];
      marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: lnglatsArr
      });
      marker.setMap(map);
      // marker.setAnimation("AMAP_ANIMATION_BOUNCE");
      map.setFitView(); // 自适应地图
    },
    getData() {
      realTimeLocation().then(res => {
        console.log(res.data.data);
        // this.lnglats = res.data.data;
      });
    },
    collapseChange(activeName) {
      console.log(activeName);
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.over();
  }
};
</script>
<style scoped>
.positions {
  width: 100%;
  height: calc(100vh - 110px);
}
.deviceList {
  font-size: 14px;
  max-height: 600px;
  overflow-y: auto;
}
.deviceList h2 {
  font-weight: 600;
  font-size: 14px;
}
.deviceList li {
  cursor: pointer;
  padding: 5px;
}
.deviceList li:hover {
  background: #f0f0f0;
  border-left: 2px solid red;
}
.desc {
  padding-left: 20px;
}
.intro h3 {
  padding-left: 8px;
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 10px;
}
.amap-marker-label {
  display: none;
}
#outer-box {
  height: 100%;
  /* padding-right: 220px; */
}
#container {
  height: 100%;
  width: 100%;
}
#panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 220px;
  box-sizing: border-box;
  padding: 10px 0;
  height: calc(100vh - 110px);
  background: #ffffff;
  border-left: 1px solid #f0f0f0;
  z-index: 999;
}
.panelTop {
  height: auto;
  padding: 0 5px;
  overflow-x: hidden;
  background: #ffffff;
}
.history {
  position: absolute;
  bottom: -50px;
  left: 0;
  z-index: 1000;
}
</style>
