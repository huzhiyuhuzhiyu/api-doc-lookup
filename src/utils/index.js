import moment from "moment";
import { Message } from "element-ui";
import store from '@/store'


/**
 * 等待改变
 * @description 这个函数会一直等待，直到fn函数的返回值发生变化
 * @param fn 每隔 gapTime 次执行一次此函数，直至此函数返回 true 或函数运行时间已超maxTime
 * @param maxTime 最大等待时间 默认10s
 * @param gapTime  每次执行fn函数的间隔时间 默认 0.3s
 * @returns {Promise<void>}
 */
export function waitChange(fn, maxTime = 10000, gapTime = 300) {
  const { promise, resolve, reject } = getPromise()
  const timer = setInterval(() => {
    let hasChange = fn()
    if (hasChange) {
      timer && clearInterval(timer)
      return resolve()
    }
  }, gapTime)

  setTimeout(() => {
    timer && clearInterval(timer)
    reject && reject()
  }, maxTime)
  return promise
}

/**
 *
 * @returns {{resolve, reject, promise: Promise<unknown>}}
 */
export function getPromise() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej
  })
  return {
    promise,
    resolve,
    reject
  }
}

export const elFullScreen = ((() => {
  const arr = ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullScreen']
  const fullScreenFnName = arr.find(item => document.documentElement[item]) || 'requestFullscreen'
  return (el) => {
    el[fullScreenFnName] && el[fullScreenFnName]()
  };
})());


/** * 获取字典数据
 * @param dictType 字典类型
 * @returns {Array} 返回字典数据数组
 */
export const getDictDataSync = (dictType) => {
  const dict = store.getters.dictionaryList.length ? store.getters.dictionaryList.filter(o => o.enCode === dictType) : []
  if (!dict || !dict.length) {
    return [];
  }
  return (dict[0].dictionaryList || []).map((dict) => ({ ...dict, label: dict.fullName, value: dict.enCode }))
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if ((typeof time === 'string')) {
    if ((/^[0-9]+$/.test(time))) {
      // support "1548221490638"
      time = parseInt(time)
    } else {
      // support safari
      // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
      time = time.replace(new RegExp(/-/gm), '/')
    }
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function getLabel(list, id, value, label) {
  if (id != '' && Array.isArray(list) && list.length != 0) {
    return !list.find(item => item[value] == id) ? id : list.find(item => item[value] == id)[label]
  } else {
    return id
  }
}

/**
 * 去除左右两边的空格
 * @param {any} obj
 * @returns {*}
 * @example trim('  abc  ') => 'abc'
 * @example trim({a: '  abc  '}) => {a: 'abc'}
 * @example trim({a: '  abc  ', b: {c: '  abc  '}, c: [' abc ']}) => {a: 'abc', b: {c: 'abc'}, c: ['abc']}
 */
export function trim(obj) {
  if (obj === null || obj === undefined) return obj
  const objType = typeof obj
  if (objType === 'string') {
    return obj.trim()
  }
  if (objType !== 'object') return obj
  const keys = Object.keys(obj)
  for (let key of keys) {
    const type = typeof obj[key]
    if (type === 'string') {
      obj[key] = obj[key].trim()
    } else if (type === 'object') {
      obj[key] = trim(obj[key])
    }
  }
  return obj
}

/**
 * 判断一个值是否为空,如果是对象,对象没有属性也认为是空
 * @param {any} val
 * @returns {boolean}
 * @example isEmpty('') => true
 * @example isEmpty({}) => true
 * @example isEmpty([]) => true
 */
export function isEmpty(val) {
  if (val === null || val === undefined) return true
  const type = typeof val
  if (type === 'string' && val.trim() === '') return true
  return type === 'object' && Object.keys(val).length === 0;
}

/**
 * 判断一个值是否不为空
 * @param val
 * @returns {boolean}
 * @see isEmpty
 */
export function notEmpty(val) {
  return !isEmpty(val)
}

/**
 * map中如果有值则插入值的数组中，没有则插入一个数组 包含值
 * @param { Map } map
 * @param  { String } key
 * @param { any } value
 * @returns {*}
 */
export function mapIfNonePutArr(map, key, value) {
  const has = map.has(key)
  if (has) {
    return map.get(key).push(value)
  }
  return map.set(key, [value])
}

/**
 * 格式化时间
 * @param time
 * @param format
 * @returns {string}
 */
export function formatDate(time = new Date(), format = "YYYY-MM-DD HH:mm:ss") {
  return moment(new Date(time)).format(format)
}

export function getWeekFirstDay(format = "YYYY-MM-DD 00:00:00") {
  return moment().startOf('week').format(format)
}

export function getMonthFirstDay(format = "YYYY-MM-DD 00:00:00") {
  return moment().startOf('month').format(format)
}

/**
 * 生成uuid
 * @returns {string}
 */
export function createUUID() {
  let dt = new Date().getTime();
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * 获取近一个月的时间
 * @returns {string[]}
 */
export function nearMonth() {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
  return [moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
}

/**
 * 获取询问提示框
 * @param { Vue } vm
 * @param tip
 * @returns {Promise<MessageBoxData>}
 */
export function getQueryConfirm(vm, tip = "") {
  return vm.$confirm(tip || vm.$t('common.delTip'), vm.$t('common.tipTitle'), {
    type: 'warning'
  })
}

/**
 * 排序方法封装
 * @param item 排序字段，el-table-column的传入值
 * @param snakeCaseFieldList 需要转下划线的字段
 * @param createByConvert
 * @returns {{asc: boolean, column: (string|*)}}
 */
export function getSortField(item, snakeCaseFieldList = [], createByConvert = true) {
  const { prop, order } = item
  let newProp = ''
  if (!snakeCaseFieldList.includes(prop)) {
    if (prop === 'createByName') {
      newProp = 'create_by'
    } else {
      newProp = prop
    }
  } else {
    newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
  }
  return {
    asc: order === 'ascending',
    column: order === null ? '' : newProp
  }
}

export function getSuccessInfo(tip = "操作成功") {
  return Message.success(tip)
}

/**
 * 数组转换为Map
 * @param {any[]} arr 数组
 * @param key 键名
 * @returns {Map<any, any>}
 */
export function array2Map(arr, key) {
  const map = new Map()
  arr.forEach(item => map.set(item[key], item))
  return map
}


/**
 * 数字增长动画
 * @param obj 对象
 * @param valueField 需改变的字段
 * @param targetValue 目标值
 * @param duration 动画时长
 */
export function increaseNumber(obj, valueField, targetValue, duration = 500) {
  const current = obj[valueField]
  const startTime = performance.now();
  const difference = targetValue - current;

  function animate(time) {
    const elapsedTime = time - startTime;
    const progress = Math.min(elapsedTime / duration, 1); // 计算动画进度（范围为0到1）

    const newValue = current + difference * progress; // 根据进度计算当前值
    obj[valueField] = Math.floor(newValue);
    if (progress < 1) {
      requestAnimationFrame(animate); // 继续动画
    }
  }

  requestAnimationFrame(animate);
}


/**
 * 延时执行
 * @param time
 * @returns {Promise<unknown>}
 */
export function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

/**
 * 优化数组push
 * 实际上使用此方法会使总渲染时长边长，但是会减少首屏渲染时长
 * @param { Array } arr
 * @param { Array } target
 * @param { Number | Function } gap 如果传入的是数字，则每隔gap个元素push一次，如果传入的是函数，则每次调用函数返回true时push一次
 */
export function optimizeArrayPush(arr, target, gap = 5) {

  const gapIsFn = typeof gap === 'function'
  let index = gapIsFn ? 0 : Math.max(0, gap)
  let run = null

  if (gapIsFn) {
    run = (() => {
      index++
      requestAnimationFrame(() => {
        if (gap(index, target.length - arr.length)) {
          arr.push(target[arr.length])
        }
        arr.length < target.length && run()
      })
    })
  } else {
    run = (() => {
      index++
      requestAnimationFrame(() => {
        if ((index % gap === 0)) {
          arr.push(target[arr.length])
        }
        arr.length < target.length && run()
      })
    })
  }
  run()
}

/**
 * 格式化列表查询请求
 * @param { Object } queryConfigData
 * @returns { Object }
 */
export function formatListQuery(queryConfigData) {
  queryConfigData = structuredClone(queryConfigData)

  // 高级查询处理
  queryConfigData.superQuery.condition = queryConfigData.superQuery.condition.filter(item => item.symbol === 'empty' || !isEmpty(item.fieldValue))
  queryConfigData.superQuery.condition = queryConfigData.superQuery.condition.map(item => {
    if (item.symbol === 'empty') {
      if (item.fieldValue) {
        item.symbol = '=='
        item.fieldValue = ''
      } else {
        item.symbol = '<>'
        item.fieldValue = ''
      }
    }
    if (Array.isArray(item.fieldValue)) item.fieldValue = item.fieldValue.join(',')
    if (typeof item.fieldValue === 'boolean') item.fieldValue = item.fieldValue ? 1 : 0
    if (['in', 'notIn'].includes(item.symbol)) item.fieldValue = item.fieldValue.replace('，', ',')
    return { // 只保留有用内容，便于阅读
      field: item.field,
      symbol: item.symbol,
      fieldValue: item.fieldValue,
      label: item.label
    }
  })
  // if (queryConfigData.superQuery.condition.every(item => item.symbol !== 'between')) {
  //   throw new Error('webIntercept:请至少使用一个日期/时间范围参与查询！')
  // }
  // delete queryConfigData.superQuery.tableQueryFlag

  // 处理 keywordQuery
  const keywordQuery = queryConfigData.keywordQuery;
  if (keywordQuery) {
    const { keywordFlag, keyword, fieldList } = keywordQuery;

    // 如果 keywordQuery 无效，则直接忽略
    if (!keywordFlag || isEmpty(keyword) || !Array.isArray(fieldList) || fieldList.length === 0) {
      delete queryConfigData.keywordQuery;
    } else {
      delete keywordQuery.keywordFlag;
      queryConfigData.superQuery.keywordQuery = keywordQuery;
      delete queryConfigData.keywordQuery;
    }
  }

  return queryConfigData
}

/**
 * 获取表格合计行数据
 * @param {Object} param - table 的 summary 方法参数，包含columns和data
 * @param {Object} context - 上下文对象，包含汇总配置和数据
 * @returns {Array} 合计行数据数组
 */
export function getSummaries(param, context) {
  const { columns } = param;
  const sums = [];

  if (!context || !context.apiTotalData) {
    return sums;
  }

  let totalLabelIndex = 0;

  const hasSelection = columns.some(col => col.type === 'selection');
  if (hasSelection) {
    totalLabelIndex = 1;
  }
  columns.forEach((column, index) => {
    if (column.type === 'selection' || column.property === 'action' || column.property === 'operate' || column.property === 'handle' || column.property === 'options') {
      sums[index] = '';
      return;
    }

    if (column.width === 0 || column.minWidth === 0 || column.hidden === true) {
      sums[index] = '';
      return;
    }

    if (index === totalLabelIndex) {
      sums[index] = '合计';
      return;
    }

    // 获取映射后的汇总值
    sums[index] = getMappedSummaryValue(column.property, context);
  });

  return sums;
}

/**
 * 获取映射后的接口汇总值
 */
export function getMappedSummaryValue(displayProp, context) {
  if (!displayProp) return '';

  const { summaryMapping = {}, apiTotalData = {} } = context;

  try {
    const dataProp = summaryMapping[displayProp] || displayProp;
    const value = dataProp.includes('.')
      ? dataProp.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), apiTotalData)
      : apiTotalData[dataProp];

    if (value !== undefined) {
      if (typeof value === 'number') {
        return value;
      }
      return value;
    }
    return '';
  } catch (error) {
    console.warn('获取汇总数据失败:', displayProp, error);
    return '';
  }
}

/**
 * 数据字段标准化处理器
 * @param {Object|Array} data - 要处理的数据
 * @param {Object|Function} rules - 处理规则，可以是配置对象或处理函数
 * @param {Object} options - 选项配置
 * @returns {Object|Array} - 处理后的数据
 *
 * @example
 * // 方式1：简单字段映射
 * const result1 = standardizeFields(data, {
 *   productName: ['name', 'product_name']
 * });
 *
 * // 方式2：复杂转换规则
 * const result2 = standardizeFields(data, {
 *   productName: {
 *     from: ['name', 'product_name'],
 *     transform: (value) => value?.trim(),
 *     default: '未命名产品'
 *   },
 *   price: {
 *     from: 'price',
 *     transform: (value) => parseFloat(value) || 0,
 *     default: 0
 *   },
 *   fullName: {
 *     compute: (item) => `${item.firstName} ${item.lastName}`
 *   }
 * });
 *
 * // 方式3：使用处理函数
 * const result3 = standardizeFields(data, (item) => ({
 *   ...item,
 *   normalizedField: item.rawField?.toUpperCase()
 * }));
 *
 * // 方式4：链式处理
 * const result4 = standardizeFields(data, [
 *   { productName: ['name', 'product_name'] },
 *   { price: { from: 'price', transform: parseFloat } },
 *   (item) => ({ ...item, processed: true })
 * ]);
 */
export function standardizeFields(data, rules = {}, options = {}) {
  if (Array.isArray(data)) {
    return data.map(item => standardizeFields(item, rules, options));
  }

  if (!data || typeof data !== 'object') {
    return data;
  }

  const defaultOptions = {
    keepOriginal: true,      // 是否保留原始字段
    removeSource: false,     // 是否移除源字段
    strictMode: false        // 未找到字段时抛出错误
  };

  const mergedOptions = { ...defaultOptions, ...options };
  let result = mergedOptions.keepOriginal ? { ...data } : {};

  // 处理规则可以是函数、数组或对象
  const processRule = (rule, currentData) => {
    // 规则为函数
    if (typeof rule === 'function') {
      return { ...currentData, ...rule(currentData) };
    }

    // 规则为数组（链式处理）
    if (Array.isArray(rule)) {
      return rule.reduce((acc, r) => processRule(r, acc), currentData);
    }

    // 规则为对象
    const processed = { ...currentData };
    Object.keys(rule).forEach(targetField => {
      const ruleConfig = rule[targetField];

      // 简写形式：数组表示可能的源字段
      if (Array.isArray(ruleConfig)) {
        const foundField = ruleConfig.find(field => processed[field] !== undefined);
        if (foundField) {
          processed[targetField] = processed[foundField];
          if (mergedOptions.removeSource && foundField !== targetField) {
            delete processed[foundField];
          }
        } else if (mergedOptions.strictMode) {
          throw new Error(`字段映射失败：${ targetField } 的源字段 ${ ruleConfig.join(', ') } 均未找到`);
        }
      }

      // 详细配置形式
      else if (ruleConfig && typeof ruleConfig === 'object') {
        const config = ruleConfig;

        // 从指定字段计算
        if (config.compute) {
          processed[targetField] = config.compute(processed);
        }

        // 固定值
        else if (config.hasOwnProperty('value')) {
          processed[targetField] = config.value;
        }

        // 从指定字段复制
        else if (config.from) {
          const sourceFields = Array.isArray(config.from) ? config.from : [config.from];
          const foundField = sourceFields.find(field => processed[field] !== undefined);

          if (foundField) {
            let value = processed[foundField];

            // 应用转换函数
            if (config.transform) {
              value = config.transform(value, processed);
            }

            // 设置默认值（如果值为 undefined 或 null）
            if (value === undefined || value === null) {
              if (config.hasOwnProperty('default')) {
                value = config.default;
              }
            }

            processed[targetField] = value;

            // 移除源字段
            if (config.removeSource && foundField !== targetField) {
              delete processed[foundField];
            }
          } else if (config.hasOwnProperty('default')) {
            processed[targetField] = config.default;
          } else if (mergedOptions.strictMode) {
            throw new Error(`字段映射失败：${ targetField } 的源字段 ${ sourceFields.join(', ') } 均未找到`);
          }
        }

        // 字段别名映射
        else if (config.alias) {
          const foundField = config.alias.find(field => processed[field] !== undefined);
          if (foundField) {
            processed[targetField] = processed[foundField];
            if (config.removeSource && foundField !== targetField) {
              delete processed[foundField];
            }
          } else if (config.hasOwnProperty('default')) {
            processed[targetField] = config.default;
          }
        }
      }
    });

    return processed;
  };

  return processRule(rules, result);
}

/**
 * 根据字段列表创建空对象
 * @param {Array} propList - 字段列表，可以是字符串数组或对象数组
 * @param {any} defaultValue - 默认值，默认为空字符串
 * @returns {Object} 包含所有字段的空对象
 */
export function createEmptyObject(propList, defaultValue = '') {
  if (!Array.isArray(propList)) return {};

  return propList.reduce((acc, item) => {
    const prop = typeof item === 'string' ? item : item.prop;
    if (prop) {
      acc[prop] = defaultValue;
    }
    return acc;
  }, {});
}
