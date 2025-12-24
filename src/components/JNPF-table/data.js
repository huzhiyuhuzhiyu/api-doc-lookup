import global from '@/utils/global'
import store from '@/store'
import { getCooperativeData } from "@/api/basicData";

export const symbolOptions = Object.freeze([{
  label: '等于',
  value: '==',
  effectType: ['input', 'number', 'autocomplete', 'select', 'date', 'datetime', 'month']
}, {
  label: '不等于',
  value: '<>',
  effectType: ['input', 'number', 'autocomplete', 'select', 'date', 'datetime', 'month']
}, {
  label: '包含',
  value: 'like',
  effectType: ['input', 'autocomplete']
}, {
  label: '不包含',
  value: 'notLike',
  effectType: ['input', 'autocomplete']
}, {
  label: '存在于',
  value: 'in',
  effectType: ['select']
}, {
  label: '不存在于',
  value: 'notIn',
  effectType: ['select']
}, {
  label: '大于',
  value: '>',
  effectType: ['number', 'date', 'datetime', 'month']
}, {
  label: '小于',
  value: '<',
  effectType: ['number', 'date', 'datetime', 'month']
}, {
  label: '大于等于',
  value: '>=',
  effectType: ['number', 'date', 'datetime', 'month']
}, {
  label: '小于等于',
  value: '<=',
  effectType: ['number', 'date', 'datetime', 'month']
}, {
  label: '介于',
  value: 'between',
  effectType: ['date', 'datetime', 'month']
}, {
  label: '是否为空',
  value: 'empty',
  effectType: ['input', 'number', 'autocomplete', 'select']
}])

export const getQueryProps = (column, queryJson = []) => {
  let props = { type: 'input' }
  // const column = this.columnProps
  if (queryJson.some(item => item.prop === column.prop)) {
    props = queryJson.find(item => item.prop === column.prop)
  } else if (column.label === '客户名称') {
    props = {
      type: 'autocomplete',
      triggerOnFocus: false,
      fetchSuggestions: (queryString, cb) => {
        getCooperativeData({
          name: queryString,
          type: 'customer',
          salesPersonFlag: store.getters.configData.sale.salesPersonFlag
        }).then(res => {
          const result = res.data.records.map((item, index) => {
            return {
              value: item.name
            }
          })
          cb(result)
        })
        .catch(res => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          })
        })
      }
    }
  } else if (getLabelKeyword(column.label, ['起', '止']).endsWith('日期')) {
    props = {
      type: 'date',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: column.label + '开始',
      endPlaceholder: column.label + '结束',
      pickerOptions: global.timePicker,
      pickerOptionsRange: global.timePickerOptions,
      timeOffset: false
    }
  } else if (getLabelKeyword(column.label, ['起', '止']).endsWith('时间')) {
    props = {
      type: 'datetime',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      startPlaceholder: column.label + '开始',
      endPlaceholder: column.label + '结束',
      pickerOptions: global.timePicker,
      pickerOptionsRange: global.timePickerOptions,
      timeOffset: false
    }
  } else if (['月份', '年月', '年份'].some(keyword =>
    getLabelKeyword(column.label, ['起', '止']).endsWith(keyword)
  )) {
    props = {
      type: 'month',
      valueFormat: 'yyyy-MM',
      startPlaceholder: column.label + '开始',
      endPlaceholder: column.label + '结束',
      pickerOptions: global.monthPicker,
      pickerOptionsRange: global.monthPickerOptions,
      timeOffset: false
    }
  } else if (column.label === '单据状态') {
    props = {
      type: 'select',
      options: global.documentStatusList
    }
  } else if (column.label === '审批状态') {
    props = {
      type: 'select',
      options: global.approvalStateList
    }
  } else if (column.label === '结算货币') {
    props = {
      type: 'select',
      options: global.currencyCodeList
    }
  } else if (column.label === '税率') {
    props = {
      type: 'select',
      options: store.getters.dictionaryList.find(item => item.enCode === 'taxrate').dictionaryList.map(item => ({
        label: item.fullName,
        value: Number(item.enCode)
      }))
    }
  } else if (column.label === '类别属性') {
    props = {
      type: 'select',
      options: store.getters.dictionaryList.find(item => item.enCode === 'classAttribute').dictionaryList.map(item => ({
        label: item.fullName,
        value: item.enCode
      }))
    }
  } else if (column.label.includes('是否')) {
    props = {
      type: 'select',
      customEffectType: ['==', '<>'],
      options: global.booleanOptions
    }
  } else if (column.label === '产线') {
    props = {
      type: 'select',
      options: store.getters.productionLineList
    }
  } else if (['数量', '数', '价', '库存', '金额', '成本', '毛利', '合计', '率'].some(item => getLabelKeyword(column.label, ['(主)', '(副)', '(含税)', '(不含税)', '(件)']).endsWith(item))) {
    props = {
      type: 'number',
    }
  } else if ([
    '创建人',
    '修改人',
    '生产人',
  ].some(str => column.label.includes(str))) {
    props = {
      type: 'input',
      customEffectType: true // 指定可以使用的symbol(如['like'])；true代表允许全部symbol；设定后不允许列入关键词搜索。
    }
  } else if ([
    '请购人',
    '撤回人',
    '国家',
    '省',
    '市',
    '区',
    '进度',
  ].some(str => column.label.includes(str))) {
    props = {
      type: 'no'
    }
  }

  return {
    ...column,
    ...props
  }
}

/**
 * 获取排序字段
 * @param {Object} column - 列对象
 * @param {string} popoverColumn - 列名
 * @returns {string} 返回排序字段
 */
export const getSortProp = (column, popoverColumn, options = {}) => {
  if (column.hasOwnProperty('sortProp') && column.sortProp !== undefined) return column.sortProp
  if (['国家', '省', '市', '区'].includes(column.label)) return null // 通配
  if (['createByName', 'revokeByName'].includes(popoverColumn)) return popoverColumn.replace('ByName', 'By') // 通配
  if (options.tranToUnderline) {
    return popoverColumn.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase()) // 进行驼峰转下划线转换
  }
  return popoverColumn
}

/**
 * 从字符串末尾移除指定的后缀，并返回去除后的字符串
 * @param {string} label - 要处理的原始字符串
 * @param {string[]} ignoreStrs - 需要从字符串末尾尝试匹配并移除的后缀字符串数组
 * @returns {string} 返回移除了匹配后缀的新字符串；如果未匹配任何后缀，则返回原字符串
 */
function getLabelKeyword(label, ignoreStrs) {
  for (let i = 0; i < ignoreStrs.length; i++) {
    if (label.endsWith(ignoreStrs[i])) {
      return label.slice(0, -ignoreStrs[i].length)
    }
  }
  return label
}

export const getDateDiff = (targetDate) => {
  // 将输入的日期字符串或 Date 对象转换为时间戳
  const target = new Date(targetDate);
  const today = new Date();

  // 将时间归零（只比较日期，忽略时分秒）
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // 计算时间差（毫秒）
  const diffTime = target.getTime() - today.getTime();

  // 转换为天数
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // 判断是几天前、几天后，还是今天
  let result;
  if (diffDays === 0) {
    result = '当天';
  } else if (diffDays > 0) {
    result = `当天${diffDays}天后`;
  } else {
    result = `当天${Math.abs(diffDays)}天前`;
  }

  return {
    days: diffDays, // 可用于判断逻辑（正数为未来，负数为过去）
    text: result   // 可直接显示的文本
  };
}

/**
 * 生成查询条件的 tooltip 文案
 * @param {Object} queryProps - 查询属性
 * @returns {string} 提示文本
 */
export const genTooltip = (queryProps) => {
  // console.log('genTooltip', queryProps);

  const prefix = `更新视图后，下次默认查询：<br />${queryProps.label} ${symbolToText(queryProps.symbol)} `;


  // 辅助函数：获取日期相对描述
  const getDateText = (dateStr) => getDateDiff(dateStr).text;

  // 辅助函数：提取时间部分（时分秒）
  const getTimePart = (dateTimeStr) => {
    const timeMatch = dateTimeStr?.split(' ')[1];
    return timeMatch ? ` ${timeMatch}` : '';
  };

  const { type, tempFieldValue } = queryProps;

  // 处理空值或无效值
  if (Array.isArray(tempFieldValue) ? !tempFieldValue.length : !tempFieldValue) {
    return '根据方案更新时间随实际查询时刻偏移';
  }

  // 单个值处理
  const handleSingle = (tempFieldValue) => {
    const dateText = getDateText(tempFieldValue);
    return type === 'datetime' ? `${dateText}${getTimePart(tempFieldValue)}` : dateText;
  };

  // 范围值处理（数组）
  const handleRange = (range) => {
    const [start, end] = range;
    const startText = getDateText(start) + getTimePart(start);
    const endText = getDateText(end) + getTimePart(end);
    return `${startText} - ${endText}`;
  };

  // 根据类型和值类型分发处理
  if (type === 'date' || type === 'datetime') {
    if (Array.isArray(tempFieldValue) && tempFieldValue.length >= 2) {
      return `${prefix}${handleRange(tempFieldValue)}`;
    } else if (tempFieldValue) {
      return `${prefix}${handleSingle(tempFieldValue)}`;
    }
  }

  // 默认情况
  return null;
}

export const symbolToText = (symbol) => {
  return symbolOptions.find(item => item.value === symbol)?.label || symbol
}
