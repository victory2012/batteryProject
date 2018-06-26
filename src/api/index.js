import Axios from "axios";
let BaseUrl = "http://192.168.1.113:8181";
let socketUrl = 'ws://192.168.1.113:8081/gps';
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
 * 获取设备列表
 * params入参 包含pageSize pageNum 两个字段
 */
export function GetDeviceList(params) {
  return instance.post('/device/list', params)
};

/*
 * 添加电子围栏
 * params： gpsList 坐标点
 */
export function addFence(params) {
  return instance.post('/fence/add', params)
};

/*
 * 获取电子围栏
 */
export function getFence() {
  return instance.post('/fence/list')
};

/*
 * websocket 请求
 */
export function websockets(callBack) {
  let ws = new WebSocket(socketUrl);
  callBack(ws)
};

/*
 * 获取个人信息
 */
export function getUserInfo() {
  return instance.post('/user/info')
};

/*
 * 修改个人信息
 * params入参
 */
export function changeUserInfo(params) {
  return instance.post('/user/info/modify', params)
};

/*
 * 修改个人信息
 * params入参 包含password 字段
 */
export function changePassword(params) {
  return instance.post('/user/change_password', params)
};
