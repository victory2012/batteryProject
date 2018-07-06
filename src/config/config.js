export function menuList() {
  return [
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
      icon: "el-icon- iconfont icon-electricfence",
      index: "fence",
      title: "地理围栏"
    },
    {
      icon: "el-icon-setting",
      index: "3",
      title: "电池管理",
      subs: [
        {
          icon: "el-icon-document",
          index: "batteryList",
          title: "电池列表"
        },
        {
          icon: "el-icon- iconfont icon-data",
          index: "alarmdata",
          title: "告警数据"
        }
      ]
    },
    {
      icon: "el-icon-tickets",
      index: "userManage",
      title: "用户管理"
    }
  ];
}
