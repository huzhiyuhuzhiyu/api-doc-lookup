/*
 * 正则库
 */
/**
 * 内置规则
 * @param {String} type - {pattern}中预定义正则名称 or 自定义正则
 * @param {String} msg - 正则校验不通过提示
 * @param {function} callbackMethod - 校验不通过的回调方法[errMsg, index]
 * ==================================================
 *
 * 用法
 * 1、{ validator: this.formValidate('fullName', '用户名由字母、数字、下划线以及短横线组成', () => { 回调方法 }), trigger: 'blur' }
 * 2、{ validator: this.formValidate('^(?!.*\\\\)(?!.*\\^)', '图号不能含有反斜杠和"^"', () => { 回调方法 }), trigger: 'blur' }
 * 3、{ validator: this.formValidate({ type: 'decimal', params: [10, 6, "请输入正确的数字", () => { 回调方法 }] }), trigger: 'blur' } // 携带参数的校验规则
**/
const regularList = {
  'iphone': {
    rule: /^1[3456789]\d{9}$/,
    msg: '请正确输入您的手机号'
  },
  'password': {
    rule: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
    msg: '6-16位字符的密码（数字和字母组成）'
  },
  'idCard': {
    rule: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/,
    msg: '请正确输入您的身份证号码'
  },
  'email': {
    rule: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
    msg: '请正确输入您的邮箱地址'
  },
  'plateNumber': {
    rule: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
    msg: '请正确输入您的车牌号'
  },
  'chinese': {
    rule: /^[\u4e00-\u9fa5]+$/,
    msg: '请正确输入中文'
  },
  'enCode': { // 编码校验
    rule: /^[a-zA-Z0-9_-]+$/,
    msg: '编码只能输入字母、数字、下划线和英文横线'
  },
  'userAccount': { // 岗位编码
    rule: /^[A-Za-z0-9]+$/,
    msg: '只能输入数字英文'
  },
  'fullName': { // 名称
    rule: /^([\u4e00-\u9fa5]|[a-zA-Z0-9])+$/,
    msg: '名称不能含有特殊符号'
  },
  'number': { // 整数（不含负数）
    rule: /^([0-9]+)$/,
    msg: '请输入正确的整数'
  },
  'bigInt': { // 正整数
    rule: /^[1-9]*[1-9][0-9]*$/,
    msg: '请输入正整数'
  },
  'positiveNumber': { // 正数
    rule: /^(0*[1-9]\d*(\.\d+)?|0+\.\d*[1-9]\d*)$/,
    msg: '输入的值必须大于0'
  },
  'nonnegative': { // 非负数
    rule: /^\d+(\.\d+)?$/,
    msg: '输入不小于0的值'
  },
  'noZero': { // 非零
    rule: /^(?!0+(?:\.0+)?$).*$/,
    msg: '请输入一个有效的数字（非零）'
  },
  'noSpace': { // 开头或结尾不能有空格
    rule: /^\S.*\S$|(^\S{0,1}\S$)/,
    msg: '开头和结尾不能有空格'
  },
  'filterSpecial': { // 过滤 \ 和 ^（服务器不能解析的特殊字符）
    rule: /^(?!.*\\)(?!.*\^)/,
    msg: '不能含有 \\ 和 ^'
  },
  'allDate': { //判断请假时间和小时是否为0.5的倍数
    rule: /^[1-9]\d*\.[5]$|0\.[5]$|\.[0]$|^[1-9]\d*$/,
    msg: '时间只能是整数和0.5的倍数'
  },
  'bankAccount': { // 银行账号（支持对公账户和对私账户）
    rule: /^[1-9]\d{9,29}$/, // 10-30位数字，不能以0开头
    msg: '请输入正确的银行账号（10-30位数字）'
  },
  // 数值校验
  decimal(a, b, msg, callbackMethod) { // params:[参数1,参数2,错误msg,回调方法]
    // 示例：{ validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('数量：' + errMsg) }] }), trigger: 'blur' },
    return (rule, value, callback) => {
      const index = getIndex(rule)
      let reg = new RegExp(`^(0|[1-9](\\d{0,${a - b - 1}}))((\\.\\d{1,${b}})?)$`);
      msg = msg || `请输入正确的数字，整数不能超过${a - b}位，小数不能超过${b}位`
      if (!value || reg.test(value) || value === '0') { callback() }
      else {
        if (callbackMethod) { callbackMethod(msg, index) }
        callback(new Error(msg));
      }
    };
  },
  // 数值校验 可为负数
  decimal2(a, b, msg, callbackMethod) { // params:[参数1,参数2,错误msg,回调方法]
    // 示例：{ validator: this.formValidate({ type: 'decimal2', params: [10, 2, "", (errMsg) => { this.$message.error('数量：' + errMsg) }] }), trigger: 'blur' },
    return (rule, value, callback) => {
      const index = getIndex(rule)
      let reg = new RegExp(`^-?(0|[1-9](\\d{0,${a - b - 1}}))((\\.\\d{1,${b}})?)$`);
      msg = msg || `请输入正确的数字，整数不能超过${a - b}位，小数不能超过${b}位`
      if (!value || reg.test(value) || value === '0') { callback() }
      else {
        if (callbackMethod) { callbackMethod(msg, index) }
        callback(new Error(msg));
      }
    };
  },
  // 自定义逻辑校验
  calc(calcMethod, msg, callbackMethod) { // params:[计算方法,错误msg,回调方法]
    // 示例：{ validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => this.linesList[rowIndex].num_1 <= this.linesList[rowIndex].num_2, "不能超过对应数量_2", (errMsg) => { this.$message.error('数量_1：' + errMsg) }] }), trigger: 'blur' }
    // 注意：数学式逻辑判断 请确保其字段类型正确
    return (rule, value, callback) => {
      const index = getIndex(rule)
      msg = msg || `不符合calc校验规则`
      if (!value) { callback() }
      else {
        let flag = !calcMethod(index, value)
        if (flag) {
          if (callbackMethod) { callbackMethod(msg, index) }
          callback(new Error(msg));
        } else { callback() }
      }
    };
  },
  // 带回调方法的非空校验
  noEmtry(msg, callbackMethod) { // params:[错误msg,回调方法]
    // 示例：{ validator: this.formValidate({ type: 'noEmtry', params: ["xxx不能为空", (errMsg) => { this.$message.error('数量：' + errMsg) }] }), trigger: 'blur' }
    return (rule, value, callback) => {
      const index = getIndex(rule)
      msg = msg || `不能为空`
      if (value === '' || value === null || value === undefined) {
        if (callbackMethod) { callbackMethod(msg, index) }
        callback(new Error(msg));
      } else {
        callback()
      }
    };
  },
}


const formValidate = (type, msg, callbackMethod) => {
  if (typeof type === "string") {
    return (rule, value, callback) => {
      let reg = regularList[type] && regularList[type].rule ? regularList[type].rule : type
      const index = getIndex(rule)
      if (typeof reg === "string") reg = RegExp(reg)
      msg = msg ? msg : (regularList[type] && regularList[type].msg) ? regularList[type].msg : ''
      if (value === '' || value === null || value === undefined) { callback() }
      else if (!reg.test(value)) {
        if (callbackMethod) { callbackMethod(msg, index) }
        callback(new Error(msg))
      } else { callback() }
    }
  } else {
    let { type: method, params } = type
    return regularList[method](...params)
  }
}

function getIndex(rule) {
  let temp = rule.field.match(/\d+/)
  return temp ? Number(temp[0]) : undefined
}

export default formValidate
