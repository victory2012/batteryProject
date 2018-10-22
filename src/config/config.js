/* eslint-disable */
export function menuList() {
  return [{
      icon: "el-icon-view",
      index: "home",
      title: "overview"
    },
    {
      icon: "el-icon-location",
      index: "position",
      title: "realposition"
    },
    {
      icon: "el-icon-tickets",
      index: "history",
      title: "history"
    },
    {
      icon: "el-icon- iconfont icon-electricfence",
      index: "fence",
      title: "fence"
    },
    {
      icon: "el-icon-setting",
      index: "3",
      title: "batteryManage",
      subs: [{
          icon: "el-icon-document",
          index: "batteryList",
          title: "batteryList"
        },
        {
          icon: "el-icon- iconfont icon-data",
          index: "alarmdata",
          title: "alarm"
        }
      ]
    },
    {
      icon: "el-icon-tickets",
      index: "userManage",
      title: "userManage"
    }
  ];
}
export function GoogleList() {
  return [{
      icon: "el-icon-view",
      index: "googleAll",
      title: "电池总览"
    },
    {
      icon: "el-icon-location",
      index: "googlePos",
      title: "实时位置"
    },
    {
      icon: "el-icon-tickets",
      index: "googleHis",
      title: "历史轨迹"
    },
    {
      icon: "el-icon- iconfont icon-electricfence",
      index: "googleFence",
      title: "地理围栏"
    },
    {
      icon: "el-icon-setting",
      index: "3",
      title: "电池管理",
      subs: [{
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
