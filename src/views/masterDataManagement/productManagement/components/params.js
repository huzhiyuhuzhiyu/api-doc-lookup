/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-05 15:44:05
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-28 10:44:01
 * @FilePath: \os-web-zgt4.0\src\views\basicData\materialFiles\raw_material\params.js
 * @Description: 半成品、原材料、辅料 表单配置项
 */
import formValidate from "@/utils/formValidate";

export default () => [
  {
    tabCode: "basicInfo",
    tabName: "基本信息",
    tabContent: [
      { prop: "projectId", label: "所属项目", value: "", type: 'select', itemRules: [{ required: true, trigger: "blur" }],options: [], filterable: true, render: true, itemDisabled: false },
      { prop: "productCategoryName", label: "产品分类", value: "", type: 'custom', customComponent: "ComSelect-list", itemRules: [{ required: true, message: "请选择产品分类", trigger: "no" }], itemDisabled: false },
      { prop: "code", label: "产品编码", value: "",maxlength: 100, type: 'input', itemRules: [{ required: true, trigger: "blur" }], render: true, itemDisabled: false },
      { prop: "drawingNo", label: "品名规格", value: "", type: 'input', maxlength: 1000, itemRules: [{ required: true, trigger: "blur" },], itemDisabled: false },
      { prop: "name", label: "产品名称", value: "", type: 'input', maxlength: 100, itemDisabled: false },
      { prop: "material", label: "材质", value: "",typeCode: 'pa021', type: 'select', options: [],  filterable: true },
      { prop: "mainUnit", label: "主单位", value: "", type: 'select', options: [], itemRules: [{ required: true, trigger: "blur" }], filterable: true },
      { prop: "deputyUnit", label: "副单位", value: "", type: 'select', options: [], itemRules: [{ required: true, trigger: "blur" }], filterable: true },
      { prop: "ratio", label: "转换系数", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: formValidate({ type: 'decimal', params: [12, 6] }), trigger: 'blur' }, { validator: formValidate('positiveNumber'), trigger: "blur" }] },
      { prop: "calculationDirection", label: "计算方向", value: "", type: "select", options: [{ label: "乘", value: "multiplication" }, { label: "除", value: "division" }], itemRules: [{ required: true, trigger: "change" }] },
      { prop: "productSource", label: "产品来源", value: "", type: "select", options: [{ label: "生产", value: "produce" }, { label: "采购", value: "purchase" }, { label: "外协", value: "out" }], itemRules: [{ required: true, trigger: "change" }], itemDisabled: false },
      { prop: "productStatus", label: "产品状态", value: "enable", type: "select", options: [{ label: "启用", value: "enable" }, { label: "禁用", value: "disabled" }], itemRules: [{ required: true, trigger: "change" }] },
      { prop: "brand", label: "品牌", value: "", typeCode: 'pa011', type: 'select', options: [], maxlength: 200 },
      // { prop: "saleFlag", label: "是否可销售", value: true, type: "select",options: [{ label: "是", value: true }, { label: "否", value: false }],clearable:false,render:true},
      // { prop: "tradeFlag", label: "是否贸易件", value: false, type: "select",options: [{ label: "是", value: true }, { label: "否", value: false }],clearable:false,render:true},
      { prop: "remark", label: "备注", value: "", type: 'textarea', sm: 12 },
    ],
  },
]