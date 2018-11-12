module.exports = {
  platform: 'Platform',
  manufacturer: 'Manufacturer',
  customer: 'Customer',
  adminIden: 'Customer',
  internetErr: 'Service request time out, please try again later.',
  mapError: 'Map failed to load, please check network connection.',
  connectErr: 'Service request time out, please try again later.',
  responseCode: {
    timeOut: 'Login time out, please try again later.',
    sessionOut: 'Current session has expired.', // 会话过期
    accountExists: 'This user account already exists.', // 账号已存在
    accountNotExist: 'This user account does not exist.', // 账号不存在
    accountPwdErr: 'Account or password error', // 1004
    accountOperation: 'Operation cannot be performed by current user account.', // 账号操作失败
    UnableDevice: 'Unable to operate on this device.', // 设备操作失败
    hasdevice: 'This device already exists.', // 设备已存在
    notFindDevice: 'This device was not found.', // 设备未找到
    hasHost: 'This battery already exists.', // 宿主已存在
    noHost: 'This battery was not found.', // 宿主未找到
    UnableBattery: 'Unable to operate on this battery.', // 宿主操作失败
    UnableGecfence: 'Unable to set up this geofence.' // 电子围栏操作失败
  },
  loginMsg: {
    userNameMsg: 'Please enter user id.',
    password: 'Please enter password.',
    projectName: 'Battery Tracking Management System',
    subProjectName: 'Battery Tracking Management System',
    RMaccount: 'Remember the account',
    RMpassword: 'Remember the password',
    accountPlace: 'User Id',
    passwordPlace: 'Password',
    loginBtn: 'Login',
    errorMsg: {
      account: 'Please enter user id.',
      password: 'Please enter password.'
    }
  },
  userInfo: {
    userMsg: 'User Profile',
    pasword: 'Change Password',
    logOut: 'Logout'
  },
  menu: {
    // 菜单列表
    overview: 'Overview',
    realposition: 'Real Location',
    history: 'Motion Track',
    fence: 'Geofence',
    batteryManage: 'Battery Management',
    batteryList: 'Battery Profiles',
    alarm: 'Battery Alarms',
    userManage: 'User Management',
    device: 'Device Management',
    policy: 'Voltage Threshold'
  },
  overview: {
    total: 'All',
    online: 'This Month',
    offLine: 'Valid',
    invalid: 'Invalid'
  },
  positions: {
    title1: 'Device Profiles',
    title2: 'Online Battery List',
    lookAll: 'View All',
    track: 'Motion Track',
    onLine: 'Online',
    offline: 'Offline',
    batteryCode: 'Battery Id',
    deviceCode: 'Device Id',
    updateTime: 'Time',
    intersection: 'Road junction',
    latLng: 'Coordinate',
    address: 'Address',
    getAdressErr: 'Address acquisition failed.',
    voltage: 'Voltage'
  },
  history: {
    startTime: 'Please enter start time.',
    endTime: 'Please enter end time.',
    start: 'Start',
    pause: 'Pause',
    continue: 'continue',
    stop: 'Stop',
    heatActive: 'Hot Zone',
    TrackReplay: 'Playback',
    times: 'Time',
    batteryList: 'Battery Profiles',

    online: 'Online',
    offLine: 'Offline',
    checkErr: 'Start time must before end time.',
    noData: 'This device has no data during the current time period.',
    noDevice: 'There is no corresponding device, please register first.',
    latLng: 'Coordinate',
    address: 'Address',
    No: 'No',
    point: 'point',
    junction: 'Road junction',
    track: 'Track'
  },
  timeBtn: {
    cancle: 'Cancel',
    sure: 'Submit'
  },
  fence: {
    cancelSeting: 'Cancel',
    sureSeting: 'Submit',
    back: 'Quit',
    addBtn: 'Add geofence on map.',
    delBtn: 'Remove geofence on map.',
    tipMsg: {
      addSuccess: 'Added Successfully.',
      delSuccess: 'Removed Successfully.',
      addPointer: 'Please select the geofence point on map.',
      selectToDel: 'Please choose the geofence you want remove on map.',
      morePointer: 'Select 10 points at most.',
      less: 'Select 3 points at least.'
    }
  },
  batteryList: {
    serial: 'No.',
    batteryCode: 'Battery Id',
    binding: 'Binding Status',
    running: 'Operating Satus',
    detail: 'Action',
    online: 'Online',
    offline: 'Offline',
    noBind: 'Unbound',
    hasBind: 'Bound',
    batteryDetail: 'Battery Detail',
    batteryNumber: 'Battery Id',
    model: 'Model',
    specif: 'Specification',
    customer: 'Customer',
    deviceCode: 'Device Id',
    bindStatus: 'Binding Status',
    onlineStatus: 'Online Status',

    view: 'View',
    batteryAddBtn: 'Battery Registration',
    enterprise: 'Manufacturer',
    customerCom: 'Customer',
    createDate: 'Date of production.',
    manufactureDate: 'Date of manufacture.',
    warrantyDate: 'Warranty',
    cancel: 'Cancel',
    sure: 'Confirm',
    warn: {
      enterprise: 'Please enter manufacturer id.',
      customerCom: 'Please enter Customer id.',
      batteryCode: 'Please enter battery id.',
      model: 'Please enter battery model.',
      specif: 'Please enter battery specification.',
      createDate: 'Date of production',
      manufactureDate: 'Date of manufacture',
      warrantyDate: 'Warranty',
      deviceId: 'Please enter device id.'
    },
    success: 'Created Successfully.',
    delSuccess: 'Deleted Successfully.'
  },
  alarmList: {
    serial: 'No.',
    time: 'Alarm Time',
    batteryCode: 'Battery Id',
    content: 'Alarm Description',
    handle: 'Action',
    detail: 'Detail',
    batteryDetail: 'Battery Detail',
    batteryNumber: 'Battery Id',
    specif: 'Specification',
    customer: 'Customer',
    deviceCode: 'Device Id',
    grid: 'Coordinate Position',
    position: 'Location',
    location: 'View'
  },
  useMsg: {
    serial: 'No.',
    name: 'User Id',
    accountIdentity: 'Account Type',
    companyIdentity: 'Company Type',
    detail: 'Detail',
    administrator: 'Administrator',
    superAdministrator: 'Super Administrator',
    userDetail: 'User Profile',
    userName: 'User Id',
    accountRole: 'Account Type',
    enterpriseRole: 'Company Type',
    enterpriseName: 'Company Name',
    phone: 'Mobile',
    email: 'Email',

    add: {
      china: 'In China',
      international: 'Abroad',
      userName: 'User Id',
      password: 'Password',
      phone: 'Mobile',
      email: 'Email(optional)',
      enterpriseName: 'Company Name',
      nature: 'Region',
      manufacturer: 'New Manufacturer Administrator.',
      customer: 'New Customer Administrator.',
      manuProduct: 'New Manufacturer User.',
      cusNoraml: 'New User',
      cancel: 'Cancel',
      sure: 'Submit'
    },
    warn: {
      userName: 'Please enter user id.',
      nameLimit: 'The user id at least 4 characters.',
      password: 'Please enter password.',
      passwordLimit: 'The password at least 6 characters.',
      phone: 'Please enter mobile number.',
      phoneCheck: 'Wrong format of mobile number entered.',
      enterprise: 'Please eneter name of company.',
      nature: 'Region.'
    },
    success: 'Created Successfully.',
    no: 'No Data'
  },
  device: {
    serial: 'No.',
    deviceCode: 'Devicd Id',
    bindStatus: 'Binding Status',
    runStatus: 'Online Status',
    detail: 'Detail',
    deviceDetail: 'Device Detail',
    manufacturerName: 'Company Name',
    createTime: 'Create time',
    batteryCode: '',
    onlineStatus: 'Online Status',
    device: 'Device',
    location: 'View',
    addDevice: 'Device Registration',
    nobind: 'Unbound',
    hasbind: 'Bound',
    online: 'Online',
    offline: 'Offline'
  },
  addDevice: {
    title: 'Device Registration',
    back: 'Cancel',
    deviceCode: 'Devicd Id',
    manufacturer: 'Manufacturer',
    Customer: 'Customer',
    createBtn: 'Submit',
    noData: 'No Data',
    errorTip: 'Please enter devicd id.',
    manufacturerErr: 'Please choose Manufacturer',
    success: 'Created successfully.'
  },
  user: {
    edit: 'Edit',
    save: 'Submit',
    cancel: 'Cancel',
    userName: 'User Id',
    userRole: 'Account Type',
    enterpriseRole: 'Company Type',
    enterpriseName: 'Company Name',
    phone: 'Mobile',
    email: 'Email',
    no: 'No Data',
    seccess: 'Changed Successfully.',
    userInfo: 'Personal information editing',
    nameErr: 'Please enter the user id.',
    phoneErr: 'Please enter the mobile phone number.',
    phoneCheck: 'Wrong format of mobile phone number.'
  },
  password: {
    new: 'new password',
    placeholder: 'Please enter password.',
    changeBtn: 'Change Password',
    error: 'Please enter password.',
    success: 'Changed Successfully.',
    passwordLimit: 'Password length is 3 to 10 characters.'
  },
  googleAbno: {
    return: 'Back',
    title: 'View the current location.',
    OUT: 'OUT',
    Geofence: 'Out of the Geofence.',
    nowPosition: 'Current Location'
  },
  policy: {
    title: 'Voltage alarm value',
    btns: 'Changed Threshold',
    placeholder: 'Please enter voltage.',
    success: 'Changed Successfully',
    voltageCheck: 'Please enter number.'
  }
};
