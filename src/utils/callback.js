import { Message } from 'element-ui';
export function onTimeOut (route) {
  Message.warning({
    message: "登录超时，请重新登录"
  });
  route.push({
    path: "/login"
  });
  sessionStorage.removeItem('loginData');
  sessionStorage.removeItem('projectTit');
}
export function onError(msg) {
  return Message.error({
    message: msg
  })
}

export function onSuccess(msg) {
  return Message.success({
    message: msg
  })
}
export function onWarn (msg) {
  Message.warning({
    message: msg
  });
}
