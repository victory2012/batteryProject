const menuList = [
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
  }
];
const loginData = JSON.parse(localStorage.getItem('loginData'));
if (loginData.userRole === 'plat_super_admin') {
  menuList.push({
    icon: "el-icon-setting",
    index: "device",
    title: "设备管理"
  });
  menuList.push({
    icon: "el-icon-tickets",
    index: "userManage",
    title: "用户管理"
  })
}
console.log(loginData);
export {menuList}