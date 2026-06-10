/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-05 15:44:05
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-07 13:23:29
 * @FilePath: \os-web-zgt4.0\src\views\basicData\materialFiles\accessories\params.js
 * @Description: 成品的表单字段
 */
import formValidate from "@/utils/formValidate";

export default () => [
  {
    tabCode: "basicInfo",
    tabName: "基本信息",
    tabContent: [
      { prop: "code", label: "产品编码", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: formValidate('enCode'), trigger: 'blur' }], itemReadOnly: true },
      { prop: "spec", label: "规格型号", value: "", type: "input", maxlength: "50" },
      { prop: "name", label: "产品名称", value: "", type: 'input', maxlength: 100, itemRules: [{ required: true, trigger: "blur" }], itemReadOnly: true },
      { prop: "mainUnit", label: "主单位", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }] },
      { prop: "deputyUnit", label: "副单位", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }] },
      { prop: "ratio", label: "转换系数", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: formValidate({ type: 'decimal', params: [10, 6] }), trigger: 'blur' }, { validator: formValidate('positiveNumber'), trigger: "blur" }] },
      { prop: "calculationDirection", label: "计算方向", value: "", type: "select", options: [{ label: "乘", value: "multiplication" }, { label: "除", value: "division" }], itemRules: [{ required: true, trigger: "change" }] },
      { prop: "productSource", label: "产品来源", value: "", type: "select", options: [{ label: "自制", value: "produce" }, { label: "采购", value: "purchase" }, { label: "外协", value: "out" }], itemRules: [{ required: true, trigger: "change" }], itemReadOnly: true },
      { prop: "productStatus", label: "产品状态", value: "enable", type: "select", options: [{ label: "启用", value: "enable" }, { label: "禁用", value: "disabled" }], itemRules: [{ required: true, trigger: "change" }] },

      //  一下全部都是 custom，组件选择
      { prop: "brand", label: "品牌", value: "", type: 'custom', customComponent: 'ComSelect-list',},
      { prop: "model", label: "型号", value: "", type: 'custom', customComponent: 'ComSelect-list',itemRules: [{ required: true, trigger: "change" }] },
      { prop: "sealingCoverStructure", label: "密封盖-结构", value: "", type: 'custom', customComponent: 'ComSelect-list', itemRules: [{ required: true, trigger: "change" }] },
      { prop: "sealingCoverTyping", label: "密封盖-打字", value: "", type: 'custom', customComponent: 'ComSelect-list', },
      { prop: "structureType", label: "结构类型", value: "", type: "custom",customComponent: 'ComSelect-list',itemRules: [{ required: true, trigger: "change" }]  },
      { prop: "clearance", label: "游隙", value: "", type: "custom",customComponent: 'ComSelect-list',itemRules: [{ required: true, trigger: "change" }]  },
      { prop: "steelBallManufacturer", label: "钢球厂家", value: "", type: "custom",customComponent: 'ComSelect-list',itemRules: [{ required: true, trigger: "change" }]  },
      { prop: "oil", label: "油脂", value: "", type: "custom",customComponent: 'ComSelect-list',itemRules: [{ required: true, trigger: "change" }]  },
      { prop: "oilQuantity", label: "油脂量", value: "", type: "custom",customComponent: 'ComSelect-list', },
      { prop: "noise", label: "噪音", value: "", type: "custom",customComponent: 'ComSelect-list', },
      { prop: "holder", label: "保持架", value: "", type: "custom",customComponent: 'ComSelect-list', },
      { prop: "vibrationLevel", label: "振动等级", value: "", type: "custom",customComponent: 'ComSelect-list', },
      { prop: "accuracyLevel", label: "精度等级", value: "", type: "custom",customComponent: 'ComSelect-list', },
      { prop: "colour", label: "颜色", value: "", type: "custom",customComponent: 'ComSelect-list', },
      { prop: "aperture", label: "孔径", value: "", type: "custom",customComponent: 'ComSelect-list', },

      { prop: "remark", label: "备注", value: "", type: "textarea", sm: 24 },
    ],
  },
]