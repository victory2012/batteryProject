import { Message } from 'element-ui';
export function onWarn (route) {
  Message.warning({
    message: "登录超时，请重新登录"
  });
  route.push({
    path: "/login"
  });
  localStorage.getItem('loginData') && localStorage.removeItem('loginData');
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
