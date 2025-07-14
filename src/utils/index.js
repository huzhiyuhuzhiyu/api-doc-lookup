import moment from "moment";
import {deleteBimFileUpload} from "@/api/esop/fileUpload/workinginstruction";
import {Message, MessageBox} from "element-ui";
import store from '@/store'
/**
 *
 * @returns {{resolve, reject, promise: Promise<unknown>}}
 */
export function getPromise(){
    let resolve, reject;
    const promise = new Promise((res, rej)=>{
        resolve =res;
        reject =rej
    })
    return {
        promise,
        resolve,
        reject
    }
}

export const elFullScreen = ((() => {
    const  arr = ['requestFullscreen','mozRequestFullScreen','webkitRequestFullscreen','msRequestFullScreen']
    const fullScreenFnName = arr.find(item=>document.documentElement[item]) || 'requestFullscreen'
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
    return (dict[0].dictionaryList || []).map((dict) => ({...dict, label: dict.fullName, value: dict.enCode}))
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
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
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
  if (id != '' && Array.isArray(list) && list.length != 0){
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
export function trim(obj){
    if(obj === null || obj === undefined) return obj
    const objType =typeof obj
    if(objType === 'string'){
        return obj.trim()
    }
    if(objType !== 'object') return obj
    const keys =Object.keys(obj)
    for (let key of keys) {
        const type =typeof obj[key]
        if(type === 'string'){
            obj[key] = obj[key].trim()
        }else if(type ==='object'){
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
export function isEmpty(val){
    if(val === null || val === undefined) return true
    const type =typeof val
    if(type=== 'string' && val.trim() === '') return true
    return type === 'object' && Object.keys(val).length === 0;
}

/**
 * 判断一个值是否不为空
 * @param val
 * @returns {boolean}
 * @see isEmpty
 */
export function notEmpty(val){
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
export function formatDate(time=new Date(), format ="YYYY-MM-DD HH:mm:ss") {
  return moment(new Date(time)).format(format)
}

export function getWeekFirstDay(format="YYYY-MM-DD 00:00:00"){
    return moment().startOf('week').format(format)
}
export function getMonthFirstDay(format="YYYY-MM-DD 00:00:00"){
    return moment().startOf('month').format(format)
}
/**
 * 生成uuid
 * @returns {string}
 */
export function createUUID() {
    let dt = new Date().getTime();
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
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
export function getQueryConfirm(vm,tip=""){
    return vm.$confirm( tip || vm.$t('common.delTip'), vm.$t('common.tipTitle'), {
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
export function getSortField(item,snakeCaseFieldList=[],createByConvert=true){
    const {prop,order} = item
    let newProp = ''
    if (!snakeCaseFieldList.includes(prop)) {
        if (prop === 'createByName') {
            newProp = 'create_by'
        }else{
            newProp = prop
        }
    } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
    }
    return {
        asc: order === 'ascending',
        column:order === null ? '' : newProp
    }
}

export function getSuccessInfo(tip="操作成功"){
    return  Message.success(tip)
}

/**
 * 数组转换为Map
 * @param {any[]} arr 数组
 * @param key 键名
 * @returns {Map<any, any>}
 */
export function array2Map(arr,key){
    const map = new Map()
    arr.forEach(item=> map.set(item[key],item))
    return map
}


/**
 * 数字增长动画
 * @param obj 对象
 * @param valueField 需改变的字段
 * @param targetValue 目标值
 * @param duration 动画时长
 */
export function increaseNumber(obj,valueField, targetValue, duration=500) {
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
export function sleep(time){
    return new Promise(resolve=>setTimeout(resolve,time))
}

/**
 * 优化数组push
 * 实际上使用此方法会使总渲染时长边长，但是会减少首屏渲染时长
 * @param { Array } arr
 * @param { Array } target
 * @param { Number | Function } gap 如果传入的是数字，则每隔gap个元素push一次，如果传入的是函数，则每次调用函数返回true时push一次
 */
export function optimizeArrayPush(arr,target,gap=5){

    const gapIsFn = typeof gap === 'function'
    let index = gapIsFn ? 0 : Math.max(0,gap)
    let run =null

      if(gapIsFn){
          run = (()=>{
              index++
              requestAnimationFrame(()=>{
                  if(gap(index,target.length - arr.length)){
                      arr.push(target[arr.length])
                  }
                  arr.length < target.length && run()
              })
          })
      }else{
          run = (()=>{
              index++
              requestAnimationFrame(()=>{
                  if((index % gap === 0)){
                      arr.push(target[arr.length])
                  }
                  arr.length < target.length && run()
              })
          })
      }
    run()
}

