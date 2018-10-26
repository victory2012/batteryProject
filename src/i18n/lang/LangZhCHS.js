module.exports = {
  platform: '平台',
  manufacturer: '生产商',
  customer: '客户',
  adminIden: '客户',
  internetErr: '服务器请求超时，请稍后重试',
  mapError: '地图加载失败，请检查网络连接',
  connectErr: '服务器繁忙，请稍后重试。',
  responseCode: {
    timeOut: '登录超时，请重新登录',
    // timeOut: 'Login time out, please try again later.',
    sessionOut: '会话过期', // 1
    accountExists: "账号已存在", // 1001
    accountNotExist: "账号不存在", // 1002
    accountOperation: "账号操作失败", // 1003
    UnableDevice: '设备操作失败', // 4003
    hasdevice: '设备已存在', // 4001
    notFindDevice: '设备未找到', // 4002
    hasHost: '宿主已存在', // 5001
    noHost: '宿主未找到', // 5002
    UnableBattery: '宿主操作失败', // 5003
    UnableGecfence: '电子围栏操作失败' // 6023
  },
  loginMsg: {
    userNameMsg: '请输入用户名',
    password: '请输入密码',
    projectName: '电池后台管理系统',
    subProjectName: '后台管理系统',
    RMaccount: '记住账户',
    RMpassword: '记住密码',
    accountPlace: '用户名',
    passwordPlace: '密码',
    loginBtn: '登录',
    errorMsg: {
      account: '账户不能为空',
      password: '密码不能为空'
    },
    tips: '提示',
    sortage: '请关闭无痕模式后，在访问'
  },
  userInfo: {
    userMsg: '个人信息',
    pasword: '修改密码',
    logOut: '退出登录'
  },
  menu: { // 菜单列表
    overview: '电池总览',
    realposition: '实时位置',
    history: '历史轨迹',
    fence: '地理围栏',
    batteryManage: '电池管理',
    batteryList: '电池列表',
    alarm: '告警数据',
    userManage: "用户管理",
    device: '设备管理'
  },
  overview: {
    total: '全部',
    online: '本月',
    offLine: '有效',
    invalid: '无效'
  },
  positions: {
    title1: '设备列表',
    title2: '在线电池列表',
    lookAll: '查看全部',
    track: '历史轨迹',
    onLine: '在线',
    offline: '离线',
    batteryCode: '电池编号',
    deviceCode: '设备编号',
    updateTime: '更新时间',
    intersection: '路口',
    latLng: '坐标',
    address: '地址',
    getAdressErr: "地址获取失败"
  },
  history: {
    startTime: '选择开始时间',
    endTime: '选择结束时间',
    start: '开始',
    pause: '暂停',
    continue: '继续',
    stop: '停止',
    heatActive: '活动热区',
    TrackReplay: '轨迹回放',
    times: '时间',
    batteryList: '电池列表',

    online: '上线',
    offLine: '下线',
    checkErr: '开始时间应小于结束时间',
    noData: "此设备当前时间段内，暂无数据",
    noDevice: '暂无设备, 请先注册设备',
    latLng: '坐标',
    address: '地址'
  },
  pageBtn: {
    previous: '上一页',
    next: '下一页'
  },
  toggleTip: {
    open: "展开",
    close: '收起'
  },
  timeBtn: {
    cancle: "取消",
    sure: '确定'
  },
  fence: {
    cancelSeting: '取消设置',
    sureSeting: '确定设置',
    back: '返回',
    addBtn: '添加围栏',
    delBtn: '删除围栏',
    tipMsg: {
      addSuccess: '添加成功',
      delSuccess: '删除成功',
      addPointer: '请选区围栏点',
      selectToDel: '请点击要删除的围栏',
      morePointer: '最多选区10个点'
    }
  },
  batteryList: {
    serial: '序号',
    batteryCode: '电池编号',
    binding: '绑定状态',
    running: '运行状态',
    detail: '查看',
    online: '在线',
    offline: '离线',
    noBind: '未绑定',
    hasBind: '已绑定',
    batteryDetail: '电池详情',
    batteryNumber: '电池编号',
    model: '电池型号',
    specif: '电池组规格',
    customer: '客户企业名称',
    deviceCode: '设备编号',
    bindStatus: '绑定状态',
    onlineStatus: '在线状态',
    view: '查看',
    batteryAddBtn: '电池登记',
    enterprise: '生产商',
    customerCom: '客户企业',
    createDate: '生产日期',
    manufactureDate: '出厂日期',
    warrantyDate: '质保期',
    cancel: '取 消',
    sure: '确 认',
    warn: {
      enterprise: '请填写生产商',
      customerCom: '请选择客户企业',
      batteryCode: '请输入电池编号',
      model: '请输入型号',
      specif: '请输入规格',
      createDate: '请选择生产日期',
      manufactureDate: '请选择出厂日期',
      warrantyDate: '请选择质保期',
      deviceId: '请选择设备编号'
    },
    success: "创建成功",
    delSuccess: "删除成功"
  },
  alarmList: {
    serial: '序号',
    time: '告警时间',
    batteryCode: '电池编号',
    content: '告警内容',
    handle: '操作',
    detail: '详情',
    batteryDetail: '电池详情',
    batteryNumber: '电池编号',
    specif: '电池组规格',
    customer: '客户企业名称',
    deviceCode: '监测设备编号',
    grid: '设备坐标',
    position: '查看位置',
    location: '查看告警位置'
  },
  useMsg: {
    serial: '序号',
    name: '用户名',
    accountIdentity: '账户身份',
    companyIdentity: '企业身份',
    detail: '详情',
    administrator: '管理员',
    superAdministrator: '超级管理员',
    userDetail: '用户详情',
    userName: '用户名',
    accountRole: '账户身份',
    enterpriseRole: '企业身份',
    enterpriseName: '企业名称',
    phone: '手机号',
    email: '邮箱',

    add: {
      china: '国内',
      international: '国际',
      userName: '用户名',
      password: '登陆密码',
      phone: '手机号码',
      email: '邮箱（选填）',
      enterpriseName: '企业名称',
      nature: '企业性质',
      manufacturer: '创建生产企业管理员',
      customer: '添加客户企业管理员',
      manuProduct: '添加生产企业普通管理员',
      cusNoraml: '添加普通管理员',
      cancel: '取 消',
      sure: '确 认'
    },
    warn: {
      userName: '请输入用户名',
      nameLimit: '用户名至少4位',
      password: '请输入密码',
      passwordLimit: '密码至少6位',
      phone: '请输入手机号码',
      phoneCheck: '手机号格式错误',
      enterprise: '请输入企业名称',
      nature: '请选择企业性质'
    },
    success: '创建成功！',
    no: '无'
  },
  device: {
    serial: '序号',
    deviceCode: '设备编号',
    bindStatus: '绑定状态',
    runStatus: '在线状态',
    detail: '详情',
    deviceDetail: '设备详情',
    manufacturerName: '企业名称',
    createTime: '创建时间',
    batteryCode: '电池编号',
    onlineStatus: '在线状态',
    device: '监测设备',
    location: '查看告警位置',
    addDevice: '添加设备',
    nobind: '未绑定',
    hasbind: '已绑定',
    online: '在线',
    offline: '离线'
  },
  addDevice: {
    title: '添加设备',
    back: '取消',
    deviceCode: '设备编号',
    manufacturer: '生产商',
    Customer: '客户',
    createBtn: '确认',
    noData: '暂无数据',
    errorTip: "请填写设备编号",
    manufacturerErr: '请选择生产商',
    success: '创建成功'
  },
  user: {
    edit: '编辑',
    save: '保存',
    cancel: '取消',
    userName: '用户名',
    userRole: '账户身份',
    enterpriseRole: '企业身份',
    enterpriseName: '企业名称',
    phone: '手机号码',
    email: '邮箱',
    no: '无',
    seccess: '修改成功',
    userInfo: '个人信息编辑',
    nameErr: '请输入用户名',
    phoneErr: '请输入手机号码',
    phoneCheck: '手机号格式错误'
  },
  password: {
    new: '新密码',
    placeholder: '请输入新密码',
    changeBtn: '修改密码',
    error: '请输入新密码',
    success: '修改成功',
    passwordLimit: '长度在 3 到 10 个字符'
  },
  googleAbno: {
    return: '返回',
    title: '查看设备当前位置',
    OUT: 'OUT',
    Geofence: '超出围栏点',
    nowPosition: '当前实时位置'
  }
};
