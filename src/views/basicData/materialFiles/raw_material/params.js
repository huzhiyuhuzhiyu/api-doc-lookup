/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-05 15:44:05
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-07 13:41:11
 * @FilePath: \os-web-zgt4.0\src\views\basicData\materialFiles\raw_material\params.js
 * @Description: 半成品、原材料、辅料 表单配置项
 */
import formValidate from "@/utils/formValidate";

export default () => [
  {
    tabCode: "basicInfo",
    tabName: "基本信息",
    tabContent: [
      { prop: "code", label: "产品编码", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: formValidate('enCode'), trigger: 'blur' }], },
      { prop: "drawingNo", label: "规格型号", value: "", type: 'input', maxlength: 1000,itemRules: [{ required: true, trigger: "blur" },] },
      { prop: "name", label: "产品名称", value: "", type: 'input', maxlength: 100, },
      { prop: "mainUnit", label: "主单位", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }] },
      { prop: "deputyUnit", label: "副单位", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }] },
      { prop: "ratio", label: "转换系数", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: formValidate({ type: 'decimal', params: [10, 6] }), trigger: 'blur' }, { validator: formValidate('positiveNumber'), trigger: "blur" }] },
      { prop: "calculationDirection", label: "计算方向", value: "", type: "select", options: [{ label: "乘", value: "multiplication" }, { label: "除", value: "division" }], itemRules: [{ required: true, trigger: "change" }] },
      { prop: "productSource", label: "产品来源", value: "", type: "select", options: [{ label: "自制", value: "produce" }, { label: "采购", value: "purchase" }, { label: "外协", value: "out" }], itemRules: [{ required: true, trigger: "change" }]},
      { prop: "productStatus", label: "产品状态", value: "enable", type: "select", options: [{ label: "启用", value: "enable" }, { label: "禁用", value: "disabled" }], itemRules: [{ required: true, trigger: "change" }] },
      { prop: "brand", label: "品牌", value: "", type: 'input', maxlength: 200 },
      { prop: "remark", label: "备注", value: "", type: 'textarea', sm: 24 },
    ],
  },
]