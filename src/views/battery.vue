<template>
  <div>
    <div>
      <el-row :gutter="20" class="mgb20">
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-1">
              <i class="grid-con-icon iconfont">&#xe644;</i>
              <div class="grid-cont-right">
                <div class="grid-num">1234</div>
                <div>电池总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-2">
              <i class="grid-con-icon iconfont">&#xe656;</i>
              <div class="grid-cont-right">
                <div class="grid-num">321</div>
                <div>在线电池</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-3">
              <i class="grid-con-icon iconfont">&#xe6a8;</i>
              <div class="grid-cont-right">
                <div class="grid-num">200</div>
                <div>离线电池</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" :body-style="{padding: '0px'}">
            <div class="grid-content grid-con-4">
              <i class="grid-con-icon iconfont">&#xe6f5;</i>
              <div class="grid-cont-right">
                <div class="grid-num">100</div>
                <div>无效电池</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="warrp">
      <div id="container" class="mapWarrp"></div>
    </div>
  </div>
</template>

<script>
import AMap from "AMap";
import { websockets } from "../api/index.js";
let map;
export default {
  name: "battery",
  data() {
    return {
      lnglats: [],
      ws: null,
      markers: [],
      jsonData: { api: "bind", param: ["123"] }
    };
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
  },
  methods: {
    init() {
      map = new AMap.Map("container", {
        resizeEnable: true,
        // center: [121.52710487067272, 31.22889232359548],
        zoom: 4
      });
      websockets(ws => {
        ws.onopen = () => {
          console.log("onopen...");
          ws.send(JSON.stringify(this.jsonData));
        };
        ws.onmessage = evt => {
          // this.markers && map.remove(this.markers);
          // console.log("onmessage...", evt);
          let data = JSON.parse(evt.data);
          this.mapInit(data.data);
        };
        ws.onerror = () => {
          console.log("onerror...");
          this.$message({
            message: "服务器繁忙，请稍后重试。",
            type: "error"
          });
        };
        this.over = () => {
          ws.close();
        };
      });
    },
    mapInit(data) {
      console.log(data);
      data.forEach(key => {
        // 地图配置
        let lnglats = key.gps.split(",");
        let lnglatsArr = [lnglats[0], lnglats[1]];
        let marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: `http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png`,
            size: new AMap.Size(20, 35)
          }),
          position: lnglatsArr,
          offset: new AMap.Pixel(-12, -12),
          zIndex: 101,
          clickable: true,
          map: map
        });
        this.markers.push(marker);
      });
      // map.setFitView(); // 自适应地图
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
.el-row {
  margin-bottom: 20px;
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
</style>
