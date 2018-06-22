<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
              <template>
                <i :class="subItem.icon"></i>
                <span slot="title">{{ subItem.title }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-view",
          index: "home",
          title: "设备总览"
        },
        {
          icon: "el-icon-location",
          index: "position",
          title: "实时位置"
        },
        {
          icon: "el-icon-tickets",
          index: "history",
          title: "历史轨迹"
        },
        {
          icon: "el-icon- iconfont icon-data",
          index: "alarmdata",
          title: "告警数据"
        },
        {
          icon: "el-icon- iconfont icon-data",
          index: "city",
          title: "显示城市"
        }
        // ,
        // {
        //   icon: "el-icon-warning",
        //   index: "aass",
        //   title: "告警通知",
        //   subs: [
        //     {
        //       icon: "el-icon- iconfont icon-c_inside",
        //       index: "inalarm",
        //       title: "告警接收人"
        //     },
        //     {
        //       icon: "el-icon- iconfont icon-collection_added",
        //       index: "hasalarm",
        //       title: "已添加接收人"
        //     },
        //     {
        //       icon: "el-icon- iconfont icon-c_outside",
        //       index: "outalarm",
        //       title: "外部告警接收人"
        //     }
        //   ]
        // }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 220px;
}
.sidebar > ul {
  height: 100%;
}
</style>
