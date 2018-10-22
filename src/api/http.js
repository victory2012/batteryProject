import Axios from "axios";
import {
  Message
} from 'element-ui';
let BaseUrl = "http://47.98.232.46:8181";
// let BaseUrl = "http://192.168.1.183:8181";

Axios.defaults.withCredentials = true; // 让ajax携带cookie

Axios.interceptors.request.use(config => {
  // 这里的config包含每次请求的内容
  // config.headers['Access-Control-Allow-Headers'] = '*';
  let token = sessionStorage.getItem('token')
  if (token) {
    config.headers.token = `${token}`;
  }
  config.withCredentials = true;
  return config;
}, err => {
  return Promise.reject(err);
});

Axios.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.resolve(error.response);
});

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据

  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    if (response.data.code === 1) {
      // code = 1时 登录超时
      return {
        status: 300,
        msg: response.data.msg
      };
    } else if (response.data.code === -1) {
      // code = -1时 请求失败
      // Message.error(response.data.msg);
      return {
        status: 404,
        msg: response.data.msg
      };
    } else if (response.data.code === 0 || response.data.code === 2) {
      // code = 0时 请求正常，正常返回
      return response;
    }
  } else {
    // 异常状态下，把错误信息返回去
    Message.error('网络异常');
    return {
      status: 500,
      msg: '网络异常'
    };
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === 404) {
    Message.error(res.msg);
  }
  if (res.status === 300) {
    Message.warning(res.msg);
    setTimeout(() => {
      window.location.href = '#/login';
      sessionStorage.clear();
    }, 1000);
  }
  return res;
}
const timeout = 30000; // 超时时间
export default {
  post(url, data) { //  post
    return Axios({
      method: 'post',
      baseURL: BaseUrl,
      url,
      data: JSON.stringify(data),
      timeout: timeout,
      headers: {
        'Content-Type': "application/json"
      }
    }).then((response) => {
      return checkStatus(response);
    }).then((res) => {
      return checkCode(res);
    });
  }
};
