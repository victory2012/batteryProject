import Axios from "axios";
let BaseUrl = "192.168.0.190:8180";
let socketUrl = 'ws://192.168.1.190:8180/ws';
Axios.defaults.withCredentials = true; // 让ajax携带cookie

let instance = Axios.create({
  headers: {
    "Content-Type": "application/json"
  },
  baseURL: BaseUrl,
  timeout: 100000,
  withCredentials: true
});

/*
 * 获取电池列表数据
 * params入参 包含pageSize pageNum 两个字段
 */
export function GetList(params) {
  return instance.post('/battery/list', params)
};

/*
 * 添加电池黑名单
 * params.manufacturer
 * params.customer
 * params.deviceId
 */
export function addBlacklist(params) {
  return instance.post(`/device/${params.manufacturer}/${params.customer}/${params.deviceId}/add_blacklist`)
};

/*
 * 删除电池
 * params.manufacturer
 * params.customer
 * params.batteryId
 */
export function deleteBattery(params) {
  return instance.post(`/battery/${params.manufacturer}/${params.customer}/${params.batteryId}/delete`)
};

/*
 * 电池登记
 * params.manufacturer
 * params.customer
 * params.deviceId
 */
export function addBattery(params) {
  return instance.post(`/battery/${params.manufacturer}/${params.customer}/${params.batteryId}/delete`)
};

/*
 * 删除设备
 * params.manufacturer
 * params.customer
 * params.deviceId
 */
export function deleteDevice(params) {
  return instance.post(`/device/${params.manufacturer}/${params.customer}/${params.deviceId}/delete`)
};

/*
 * 登录
 * params
 */
export function getAdminInfo(params) {
  return instance.post('/login/submit', params)
};

/*
 * 退出登录
 */
export function doLogOut() {
  return instance.post('/login/logout')
};

/*
 * 拉黑设备列表
 * params {
 *  pageSize
 *  pageNum
 * }
 */
export function getBlackList(params) {
  return instance.post('/device/black_list', params)
};

/*
 * 恢复拉黑设备
 * params {
 *    manufacturerId 生产商id(平台管理员不传)
 *    customerId 客户id(平台管理员不传)
 *    deviceId
 *  }
 */
export function recoveBattery(params) {
  return instance.post(`/device/${params.manufacturer}/${params.customer}/${params.deviceId}/recover`)
};

/*
 * 获取设备列表
 * params入参 包含pageSize pageNum 两个字段
 */
export function GetDeviceList(params) {
  return instance.post('/device/list', params)
};

/*
 * 获取生产企业列表
 */
export function ManufacturerList() {
  return instance.post('/enterprise/manufacturer/list')
};

/*
 * 获取个人信息
 */
export function getUserInfo() {
  return instance.post('/user/info')
};

/*
 * 修改个人信息
 * params入参 包含pageSize pageNum 两个字段
 */
export function changeUserInfo(params) {
  return instance.post('/user/info/modify', params)
};

/*
 * 获取生产企业列表
 * params入参 包含pageSize pageNum 两个字段
 */
export function getEnterprise(params) {
  return instance.post('/user/manufacturer/list', params)
};

/*
 * 添加客户
 */
export function addCustomerAdmin(params) {
  return instance.post('/user/customer/add', params)
};

/*
 * 添加企业管理员
 */
export function addManufacturerAdmin(params) {
  return instance.post('/user/manufacturer_admin/add', params)
};

/*
 * websocket 请求
 */
export function websockets(params, cb) {
  var ws = new WebSocket(socketUrl);
  if (ws.readyState === 1) {
    ws.onopen = function () {
      ws.send(params)
    }
    ws.onmessage = function (evt) {
      cb(evt, ws)
    };
  } else {
    cb(ws.readyState, ws)
  }
  // switch (ws.readyState) {
  //   case 0:
  //     cb(CONNECTING)
  //     break;
  //   case 1:
  //     ws.onopen = function () {
  //       ws.send(params)
  //     }
  //     ws.onmessage = function (evt) {
  //       cb(evt, ws)
  //     };
  //     break;
  //   case 2:
  //     break;
  //   case 3:
  //     cb(CLOSED)
  //     break;
  //   default:
  // }
  // ws.onclose = function (evt) {
  //   cb(evt, ws);
  // };
};
