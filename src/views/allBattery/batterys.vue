<template>
  <div>
    <div>
      <el-row :gutter="20"
        class="mgb20">
        <el-col :span="6">
          <el-card shadow="hover"
            :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-1">
              <i class="grid-con-icon iconfont">&#xe644;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.total}}</div>
                <div>{{$t('overview.total')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover"
            :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-2">
              <i class="grid-con-icon iconfont">&#xe656;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.monthTotal}}</div>
                <div>{{$t('overview.online')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover"
            :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-3">
              <i class="grid-con-icon iconfont">&#xe6a8;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.availableTotal}}</div>
                <div>{{$t('overview.offLine')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover"
            :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-4">
              <i class="grid-con-icon iconfont">&#xe6f5;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.invalid}}</div>
                <div>{{$t('overview.invalid')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- <component :is="mapType" :propData="propData"></component> -->
    <amaps v-if="amapsType"
      :propData="propData"></amaps>
    <googlemaps v-if="googlemapsType"
      :propData="propData"></googlemaps>
  </div>
</template>
<script>
// import AMap from "AMap";
import { mapState } from "vuex";
import { websockets, GetDeviceList, GetCount } from "../../api/index.js";
import { onWarn } from "../../utils/callback.js";
import GaodeMap from "./gaode-map";
import GoogleMap from "./google-map";
let pointerObj = {};
export default {
  // components: {
  //   amaps: import("./gaode-map"),
  //   googlemaps: import("./google-map")
  // },
  components: {
    amaps: GaodeMap,
    googlemaps: GoogleMap
  },
  name: "battery",
  data () {
    return {
      count: {},
      // onLine: 0,
      // allDevice: 0,
      limit: false,
      // offLine: 0,
      markers: [],
      sendData: { api: "bind", param: [] },
      // selectArr: [
      //   {
      //     adcode: "all",
      //     name: "全国"
      //   }
      // ],
      googlemapsType: false,
      amapsType: false,
      // defaultOption: "全国",
      propData: {
        data: "",
        type: ""
      }
    };
  },
  methods: {
    init () {
      this.getTocalsData();
      this.narmleHttp();
    },
    /* 获取统计数据 */
    getTocalsData () {
      GetCount().then(res => {
        console.log("GetCount", res);
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          this.count = result;
          this.count.invalid =
            Number(result.total) - Number(result.availableTotal);
        }
      });
    },
    /*
      http请求 获取全部电池设备
     */
    narmleHttp () {
      let pageObj = {
        pageNum: 1,
        pageSize: 999999999,
        bindingStatus: ""
      };
      GetDeviceList(pageObj).then(res => {
        console.log(res);

        if (res.data.code === 0) {
          let result = res.data.data.data;
          this.allDevice = result.length;
          pointerObj = {};
          if (result.length > 0) {
            result.forEach(key => {
              if (key.longitude && key.latitude && Number(key.longitude) > 0 && Number(key.latitude) > 0 && key.onlineStatus === 1) {
                pointerObj[key.deviceId] = `${key.longitude},${key.latitude}`;
                this.sendData.param.push(key.deviceId);
              }
            });
            console.log(pointerObj);
            this.propData.data = pointerObj;
            // this.mapInit(pointerObj);
            this.propData.type = "http";
            this.sockets(this.sendData);
          } else {
            onWarn(this.$t("history.noDevice"));
          }
        }
      });
    },
    /*
      websockets 请求
     */
    sockets (result) {
      this.WX = websockets();
      this.WX.onopen = () => {
        console.log("open....");
        this.WX.send(JSON.stringify(result));
      };
      this.WX.onmessage = evt => {
        let data = JSON.parse(evt.data);
        if (data.code === 1) {
          this.onLine = data.data;
          if (Number(this.allDevice) < Number(this.onLine)) {
            this.onLine = this.allDevice;
          }
          this.offLine = this.allDevice - this.onLine;
        }
        if (data.code === 2) {
          // if (this.markers.length > 0) {
          //   map.remove(this.markers);
          // }
          // code 为 1时 既绑定成功，2时为 收到了数据
          let obj = data.data.split(",");
          if (Number(obj[2]) > 0 && Number(obj[1]) > 0) {
            pointerObj[obj[0]] = `${obj[2]},${obj[1]}`;
            this.propData.data = pointerObj;
            this.propData.type = "ws";
          }
        }
      };
      this.WX.onerror = () => {
        this.over();
      };
    },
    over () {
      this.WX.close();
    }
  },
  mounted () {
    let batteryMap = sessionStorage.mapType;
    console.log(batteryMap);
    if (batteryMap.toString() === "0") {
      this.amapsType = true;
      this.googlemapsType = false;
    } else {
      this.amapsType = false;
      this.googlemapsType = true;
    }
    this.$store.commit("SET_USER_DATA", sessionStorage.loginData);
    this.$store.commit("SET_MAP_TYPE", sessionStorage.mapType);
    this.init();
  },
  computed: {
    // ...mapState(["mapType"]),
    ...mapState(["loginData"])
  },
  beforeDestroy () {
    if (typeof this.WX.close === 'object') {
      this.over();
    }
  }
};
</script>

<style scoped>
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
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}
.grid-con-4 .grid-con-icon {
  background: #e6a23c;
}
.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
  position: absolute;
}

#mapContainer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.button-group {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  padding: 10px;
}

.button-group .button {
  height: 28px;
  line-height: 28px;
  background-color: #97a564;
  color: #fff;
  border: 0;
  outline: none;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  margin-bottom: 4px;
  cursor: pointer;
}

.amap-info-content {
  font-size: 12px;
}
</style>
<template>
  <div>
    <div>
      <el-row :gutter="20"
        class="mgb20">
        <el-col :span="6">
          <el-card shadow="hover"
            :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-1">
              <i class="grid-con-icon iconfont">&#xe644;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.total}}</div>
                <div>{{$t('overview.total')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover"
            :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-2">
              <i class="grid-con-icon iconfont">&#xe656;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.monthTotal}}</div>
                <div>{{$t('overview.online')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover"
            :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-3">
              <i class="grid-con-icon iconfont">&#xe6a8;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.availableTotal}}</div>
                <div>{{$t('overview.offLine')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover"
            :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-4">
              <i class="grid-con-icon iconfont">&#xe6f5;</i>
              <div class="grid-cont-right">
                <div class="grid-num">{{count.invalid}}</div>
                <div>{{$t('overview.invalid')}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- <component :is="mapType" :propData="propData"></component> -->
    <amaps v-if="amapsType"
      :propData="propData"></amaps>
    <googlemaps v-if="googlemapsType"
      :propData="propData"></googlemaps>
  </div>
</template>
<script>
// import AMap from "AMap";
import { mapState } from "vuex";
import { websockets, GetDeviceList, GetCount } from "../../api/index.js";
import { onWarn } from "../../utils/callback.js";
import GaodeMap from "./gaode-map";
import GoogleMap from "./google-map";
let pointerObj = {};
export default {
  // components: {
  //   amaps: import("./gaode-map"),
  //   googlemaps: import("./google-map")
  // },
  components: {
    amaps: GaodeMap,
    googlemaps: GoogleMap
  },
  name: "battery",
  data () {
    return {
      count: {},
      // onLine: 0,
      // allDevice: 0,
      limit: false,
      // offLine: 0,
      markers: [],
      sendData: { api: "bind", param: [] },
      // selectArr: [
      //   {
      //     adcode: "all",
      //     name: "全国"
      //   }
      // ],
      googlemapsType: false,
      amapsType: false,
      // defaultOption: "全国",
      propData: {
        data: "",
        type: ""
      }
    };
  },
  methods: {
    init () {
      this.getTocalsData();
      this.narmleHttp();
    },
    /* 获取统计数据 */
    getTocalsData () {
      GetCount().then(res => {
        console.log("GetCount", res);
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          this.count = result;
          this.count.invalid =
            Number(result.total) - Number(result.availableTotal);
        }
      });
    },
    /*
      http请求 获取全部电池设备
     */
    narmleHttp () {
      let pageObj = {
        pageNum: 1,
        pageSize: 999999999,
        bindingStatus: ""
      };
      GetDeviceList(pageObj).then(res => {
        console.log(res);

        if (res.data.code === 0) {
          let result = res.data.data.data;
          this.allDevice = result.length;
          pointerObj = {};
          if (result.length > 0) {
            result.forEach(key => {
              if (key.longitude && key.latitude && Number(key.longitude) > 0 && Number(key.latitude) > 0 && key.onlineStatus === 1) {
                pointerObj[key.deviceId] = `${key.longitude},${key.latitude}`;
                this.sendData.param.push(key.deviceId);
              }
            });
            console.log(pointerObj);
            this.propData.data = pointerObj;
            // this.mapInit(pointerObj);
            this.propData.type = "http";
            this.sockets(this.sendData);
          } else {
            onWarn(this.$t("history.noDevice"));
          }
        }
      });
    },
    /*
      websockets 请求
     */
    sockets (result) {
      websockets(ws => {
        ws.onopen = () => {
          console.log("open....");
          ws.send(JSON.stringify(result));
        };
        ws.onmessage = evt => {
          let data = JSON.parse(evt.data);
          if (data.code === 1) {
            this.onLine = data.data;
            if (Number(this.allDevice) < Number(this.onLine)) {
              this.onLine = this.allDevice;
            }
            this.offLine = this.allDevice - this.onLine;
          }
          if (data.code === 2) {
            // if (this.markers.length > 0) {
            //   map.remove(this.markers);
            // }
            // code 为 1时 既绑定成功，2时为 收到了数据
            let obj = data.data.split(",");
            if (Number(obj[2]) > 0 && Number(obj[1]) > 0) {
              pointerObj[obj[0]] = `${obj[2]},${obj[1]}`;
              this.propData.data = pointerObj;
              this.propData.type = "ws";
            }
            // obj.forEach(() => {
            //   pointerObj[obj[0]] = `${obj[2]},${obj[1]}`;
            // });

            // this.mapInit(pointerObj);

            // this.$store.commit("GET_MAP_DATA", {
            //   data: pointerObj,
            //   type: "ws"
            // });
            // this.mapInit(pointerObj);
          }
        };
        ws.onerror = () => {
          this.over();
        };
        this.over = () => {
          console.log('close');
          ws.close();
        };
      });
    }
  },
  mounted () {
    let batteryMap = sessionStorage.mapType;
    console.log(batteryMap);
    if (batteryMap.toString() === "0") {
      this.amapsType = true;
      this.googlemapsType = false;
    } else {
      this.amapsType = false;
      this.googlemapsType = true;
    }
    this.$store.commit("SET_USER_DATA", sessionStorage.loginData);
    this.$store.commit("SET_MAP_TYPE", sessionStorage.mapType);
    this.init();
  },
  computed: {
    // ...mapState(["mapType"]),
    ...mapState(["loginData"])
  },
  beforeDestroy () {
    if (typeof this.WX === 'object') {
      this.over();
    }
  }
};
</script>

<style scoped>
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
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}
.grid-con-4 .grid-con-icon {
  background: #e6a23c;
}
.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
  position: absolute;
}

#mapContainer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.button-group {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  padding: 10px;
}

.button-group .button {
  height: 28px;
  line-height: 28px;
  background-color: #97a564;
  color: #fff;
  border: 0;
  outline: none;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  margin-bottom: 4px;
  cursor: pointer;
}

.amap-info-content {
  font-size: 12px;
}
</style>
