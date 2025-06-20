// AttributeColumns - 渲染函数组件，用于生成属性字典列

import { getDictDataSync } from '@/utils'
import store from '@/store'

export default {
  name: 'AttributeColumns',
  functional: true,
  props: {
    // 是否显示可编辑的下拉框
    isSlot: {
      type: Boolean,
      default: true
    },
    // 要排除的属性代码
    attributeCode: {
      type: Array,
      default: () => []
    },
    // 模块配置名称（用于控制列显示）
    moduleConfig: {
      type: String,
      default: 'sale'
    },
    // 按钮类型（'look' 为查看模式）
    btnType: {
      type: String,
      default: ''
    },
    // 产品数据数组
    productData: {
      type: Array,
      default: () => []
    },
  },

  render(h, { props, parent }) {
    const bimProductAttributesList = store.getters.bimProductAttributesList
    const dictData = getDictDataSync('productAttributes') || [];
    // 获取属性数据
    const attrDictionaryData = dictData.filter(item=>!props.attributeCode.includes(item.enCode)).map(item=>{
        return {
            ...item,
            prop:item.description,
            label:store.getters[item.description] || item.fullName,
            options:item.list,
            render:store.getters.configData[props.moduleConfig][item.description],
            list:bimProductAttributesList[item.enCode].map(item=>{
                return {
                    label:item.name,
                    value:item.name,
                }
            })
        }
    })
    if (!attrDictionaryData.length) {
      return [];
    }
    const isView = props.btnType === 'look';

    // 生成 el-table-column 数组
    return attrDictionaryData
      .filter(item => item.render) // 只渲染配置为显示的列
      .map(item => {
        return h('el-table-column', {
          props: {
            prop: item.prop,
            label: item.label,
            minWidth: 150,
            showOverflowTooltip: true
          },
          key: item.prop,
          scopedSlots: {
            default: (scope) => {
              if (props.isSlot && !isView) {
                // 可编辑模式：显示下拉选择框
                return h('el-select', {
                  props: {
                    value: scope.row[item.prop] || '',
                    placeholder: item.label,
                    disabled: isView
                  },
                  style: {
                    width: '100%'
                  },
                  on: {
                    input: (value) => {
                      // 使用 $set 确保响应性
                      parent.$set(scope.row, item.prop, value);
                    }
                  }
                }, item.list.map(option => {
                  return h('el-option', {
                    props: {
                      label: option.label,
                      value: option.value
                    },
                    key: option.value
                  });
                }));
              } else {
                // 只读模式：显示文本
                return h('span', scope.row[item.prop] || '-');
              }
            }
          }
        });
      });
  }
};
