/*
 * GPS坐标转换为高德地图坐标
 * 输入GPS坐标，单位度，数据类型double，参数一为Lat,参数二为Lng
 * 输出高德地图坐标，单位度，数据类型double[]，参数一为Lat,参数二为Lng
 *
 * */
let pi = Math.PI;

let a = 6378245.0;

let ee = 0.00669342162296594323;

export function transLatLng(wgLat, wgLng) {
  let ds = new Array(2);
  let dLat = transLat(wgLng - 105.0, wgLat - 35.0, pi);
  let dLng = transLng(wgLng - 105.0, wgLat - 35.0, pi);
  let radLat = (wgLat / 180.0) * pi;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  let sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * pi);
  dLng = (dLng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);
  ds[0] = wgLat + dLat;
  ds[1] = wgLng + dLng;
  return ds;
}

export function transLat(x, y, pi) {
  let ret;
  ret = -100.0 +
    2.0 * x +
    3.0 * y +
    0.2 * y * y +
    0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x));
  ret +=
    ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) / 3.0;
  ret +=
    ((160.0 * Math.sin((y / 12.0) * pi) + 320 * Math.sin((y * pi) / 30.0)) *
      2.0) /
    3.0;
  return ret;
}

export function transLng(x, y, pi) {
  let ret =
    300.0 +
    x +
    2.0 * y +
    0.1 * x * x +
    0.1 * x * y +
    0.1 * Math.sqrt(Math.abs(x));
  ret +=
    ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) / 3.0;
  ret +=
    ((150.0 * Math.sin((x / 12.0) * pi) + 300.0 * Math.sin((x / 30.0) * pi)) *
      2.0) /
    3.0;
  return ret;
}

export function timeFormat(time) {
  if (!time) return;
  let timeDate = new Date(time);
  let year = timeDate.getFullYear();
  let mounth = timeDate.getMonth() + 1;
  let day = timeDate.getDate();
  let hours = timeDate.getHours();
  let minute = timeDate.getMinutes();
  let second = timeDate.getSeconds();
  mounth = mounth < 10 ? "0" + mounth : mounth;
  day = day < 10 ? "0" + day : day;
  hours = hours < 10 ? "0" + hours : hours;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return `${year}-${mounth}-${day} ${hours}:${minute}:${second}`;
}

export function timeFormatSort(time) {
  if (!time) return;
  let timeDate = new Date(time);
  let year = timeDate
    .getFullYear()
    .toString()
    .substring(2, 4);
  let mounth = timeDate.getMonth() + 1;
  let day = timeDate.getDate();
  let hours = timeDate.getHours();
  let minute = timeDate.getMinutes();
  let second = timeDate.getSeconds();
  mounth = mounth < 10 ? "0" + mounth : mounth;
  day = day < 10 ? "0" + day : day;
  hours = hours < 10 ? "0" + hours : hours;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return year + "" + mounth + "" + day + "" + hours + "" + minute + "" + second;
}
export function timeFormats(time) {
  if (!time) return;
  let timeDate = new Date(time);
  let year = timeDate.getFullYear();
  let mounth = timeDate.getMonth() + 1;
  let day = timeDate.getDate();
  let hours = timeDate.getHours();
  let minute = timeDate.getMinutes();
  let second = timeDate.getSeconds();
  mounth = mounth < 10 ? "0" + mounth : mounth;
  day = day < 10 ? "0" + day : day;
  hours = hours < 10 ? "0" + hours : hours;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return (
    year + "-" + mounth + "-" + day + "  " + hours + ":" + minute + ":" + second
  );
}

export function nowDate() {
  let timeDate = new Date();
  let year = timeDate.getFullYear();
  let mounth = timeDate.getMonth() + 1;
  let day = timeDate.getDate();
  let hours = timeDate.getHours();
  let minute = timeDate.getMinutes();
  let second = timeDate.getSeconds();
  mounth = mounth < 10 ? "0" + mounth : mounth;
  day = day < 10 ? "0" + day : day;
  hours = hours < 10 ? "0" + hours : hours;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return (
    year + "-" + mounth + "-" + day + "  " + hours + ":" + minute + ":" + second
  );
}

export function userData() {
  let data = JSON.parse(sessionStorage.getItem("loginData"));
  if (data.userRole === "palt_super_admin") {
    return {};
  }
  if (data.userRole === "super_admin") {
    return {
      manufacturerId: data.enterpriseRole
    };
  }
}
export function trakTimeformat(str) {
  if (str) {
    let yy = str.substring(0, 2);
    let mm = str.substring(2, 4);
    let day = str.substring(4, 6);
    let hour = str.substring(6, 8);
    let minute = str.substring(8, 10);
    let seconds = str.substring(10, 12);
    return `20${yy}-${mm}-${day} ${hour}:${minute}:${seconds}`;
  }
}

export function getTime(start, end) {
  let startTim = new Date(start);
  let endTime = new Date(end);
  let result = endTime - startTim;
  let perBlock = Math.ceil(result / 100);
  return perBlock;
}

export function yesTody() {
  let yesDate = new Date().getTime();
  let result = yesDate - 86400000;
  return new Date(result);
}

export function userRole(str) {
  switch (str) {
    case "plat_super_admin":
      return "超级管理员";
    case "super_admin":
      return "超级管理员";
    case "admin":
      return "管理员";
    case "customer_super_admin":
      return "管理员";
    case "manufacturer_super_admin":
      return "管理员";
    default:
      return "";
  }
}
export function companyRole(str) {
  switch (str) {
    case "platform":
      return "平台";
    case "manufacturer":
      return "生产商";
    case "customer":
      return "客户";
    case "admin":
      return "客户";
    default:
      return "";
  }
}
export function sortGps(str) {
  if (!str) return;
  let pos = str.toString().split(".");
  let las = pos[1].substring(0, 6);
  return `${pos[0]}.${las}`;
}
