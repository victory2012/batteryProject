module.exports = {
  platform: 'platform',
  manufacturer: 'manufacturer',
  customer: 'customer',
  adminIden: 'customer',
  internetErr: '服务器请求超时，请稍后重试',
  mapError: '地图加载失败，请检查网络连接',
  responseCode: {
    timeOut: 'time Out',
    hasdevice: 'has device',
    notFindDevice: 'not Find Device',
    hasHost: 'has Host',
    noHost: 'no Host'
  },
  loginMsg: {
    userNameMsg: 'enter user name', // 登录-- 账户错误提示信息
    password: 'enter password', // 登录-- 密码错误提示信息
    projectName: 'admin', // 项目名称
    subProjectName: 'backend manage',
    RMaccount: 'account', // 记住账户
    RMpassword: 'password', // 记住密码
    accountPlace: 'account', // placeholder
    passwordPlace: 'password', // placeholder
    loginBtn: 'login', // 登录按钮
    errorMsg: {
      account: 'place enter account',
      password: 'place enter password'
    },
    tips: 'tips',
    sortage: 'place close incognito mode'
  },
  userInfo: {
    userMsg: 'user',
    pasword: 'Password',
    logOut: 'sign out'
  },
  menu: { // 菜单列表
    overview: 'all battery',
    realposition: 'postions',
    history: 'history track',
    fence: 'fences',
    batteryManage: 'battery-manage',
    batteryList: 'battery',
    alarm: 'alarm',
    userManage: "user",
    device: 'device'
  },
  overview: {
    total: 'total',
    online: 'mounth',
    offLine: 'valid',
    invalid: 'invalid'
  },
  positions: {
    title1: 'device list',
    title2: 'online battery list',
    lookAll: 'look all',
    track: 'history',
    onLine: 'onLine',
    offline: 'offline',
    batteryCode: 'batteryCode',
    deviceCode: 'deviceCode',
    updateTime: 'update time',
    intersection: 'intersection',
    latLng: 'coordinate',
    address: 'address',
    getAdressErr: "adress error"
  },
  history: {
    startTime: 'select start time',
    endTime: 'select end time',
    start: 'start',
    pause: 'pause',
    continue: 'continue',
    stop: 'stop',
    heatActive: 'heat',
    TrackReplay: 'replay',
    times: 'times',
    batteryList: 'battery list',

    online: 'up line',
    offLine: 'offLine',
    checkErr: 'startTime < end time',
    noData: "now no data in this device",
    noDevice: 'no device,place register device'
  },
  pageBtn: {
    previous: 'previous',
    next: 'next'
  },
  toggleTip: {
    open: "open",
    close: 'close'
  },
  timeBtn: {
    cancle: "cancel",
    sure: 'Sure'
  },
  fence: {
    cancelSeting: 'cancel',
    sureSeting: 'Seting',
    back: 'back',
    addBtn: 'add Fence',
    delBtn: 'del Fence',
    tipMsg: {
      addSuccess: 'add seccess',
      delSuccess: 'delete seccess',
      addPointer: 'place add pointer',
      selectToDel: 'place click your want to delete',
      morePointer: 'less then ten pointer'
    }
  },
  batteryList: {
    serial: 'serial',
    batteryCode: 'Code',
    binding: 'bind',
    running: 'run',
    detail: 'detail',
    online: 'online',
    offline: 'offline',
    noBind: 'noBind',
    hasBind: 'hasBind',
    batteryDetail: 'battery Detail',
    batteryNumber: 'Number',
    model: 'model',
    specif: 'Specifications',
    customer: 'Customer',
    deviceCode: 'device Code',
    bindStatus: 'bind Status',
    onlineStatus: 'online Status'
  },
  alarmList: {
    serial: 'serial',
    time: 'alarm time',
    batteryCode: 'battery Code',
    content: 'content',
    handle: 'handle',
    detail: 'detail',
    batteryDetail: 'battery Detail',
    batteryNumber: 'Number',
    specif: 'Specifications',
    customer: 'customer',
    deviceCode: 'device Code',
    grid: 'coordinate',
    position: 'position',
    location: 'See location'
  },
  useMsg: {
    serial: 'serial',
    name: 'user Name',
    accountIdentity: 'Identity',
    companyIdentity: 'company',
    detail: 'detail',
    administrator: 'admin',
    superAdministrator: 'super Admin',
    userDetail: 'user Detail',
    userName: 'user Name',
    accountRole: 'account Role',
    enterpriseRole: 'enterprise Role',
    enterpriseName: 'enterprise Name',
    phone: 'phone',
    email: 'email'
  },
  device: {
    serial: 'serial',
    deviceCode: 'device Code',
    bindStatus: 'bind Status',
    runStatus: 'run Status',
    detail: 'detail',
    deviceDetail: 'device Detail',
    manufacturerName: 'manufacturer Name',
    createTime: 'createTime',
    batteryCode: 'battery Code',
    onlineStatus: 'online Status',
    device: 'device',
    location: 'See location',
    addDevice: 'Add',
    nobind: 'no bind',
    hasbind: 'has bind',
    online: 'online',
    offline: 'offline'
  },
  addDevice: {
    title: 'add device',
    back: 'back',
    deviceCode: 'device Code',
    manufacturer: 'manufacturer',
    Customer: 'Customer',
    createBtn: 'create device',
    noData: 'No data',
    errorTip: "place enter device code",
    success: 'success'
  },
  user: {
    edit: 'edit',
    save: 'save',
    cancel: 'cancel',
    userName: 'user Name',
    userRole: 'user Role',
    enterpriseRole: 'enterprise Role',
    enterpriseName: 'enterprise Name',
    phone: 'phone',
    email: 'email',
    no: 'no',
    seccess: 'seccess'
  },
  password: {
    new: 'New password',
    placeholder: 'place enter password',
    changeBtn: 'change password',
    error: 'place enter password',
    success: 'success'
  }
};
