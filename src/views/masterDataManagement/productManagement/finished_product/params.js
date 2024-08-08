/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-05 15:44:05
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-28 11:15:10
 * @FilePath: \os-web-zgt4.0\src\views\basicData\materialFiles\accessories\params.js
 * @Description: 成品的表单字段
 */
import formValidate from "@/utils/formValidate";

export default () => [
  {
    tabCode: "basicInfo",
    tabName: "基本信息",
    tabContent: [
      { prop: "productCategoryName", label: "产品分类", value: "", type: 'custom', customComponent: "ComSelect-list", itemRules: [{ required: true, message: "请选择产品分类", trigger: "no" }] },
      { prop: "code", label: "产品编码", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: formValidate('enCode'), trigger: 'blur' }], render: true,  },
      { prop: "drawingNo", label: "品名规格", value: "", type: "input", maxlength: "1000",  },
      { prop: "name", label: "产品名称", value: "", type: 'input', maxlength: 100,itemDisabled:true },
      { prop: "mainUnit", label: "主单位", value: "", type: 'select', itemRules: [{ required: true, trigger: "blur" }], options: [] },
      { prop: "deputyUnit", label: "副单位", value: "", type: 'select', itemRules: [{ required: true, trigger: "blur" }], options: [] },
      { prop: "ratio", label: "转换系数", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: formValidate({ type: 'decimal', params: [10, 6] }), trigger: 'blur' }, { validator: formValidate('positiveNumber'), trigger: "blur" }] },
      { prop: "calculationDirection", label: "计算方向", value: "", type: "select", options: [{ label: "乘", value: "multiplication" }, { label: "除", value: "division" }], itemRules: [{ required: true, trigger: "change" }] },
      { prop: "productSource", label: "产品来源", value: "", type: "select", options: [{ label: "组装", value: "assemble" }, { label: "自制", value: "produce" }, { label: "采购", value: "purchase" }, { label: "外协", value: "out" }],  itemRules: [{ required: true, trigger: "change" }], },
      { prop: "productStatus", label: "产品状态", value: "enable", type: "select", options: [{ label: "启用", value: "enable" }, { label: "禁用", value: "disabled" }], itemRules: [{ required: true, trigger: "change" }] },

      //  一下全部都是 custom，组件选择
      { prop: "brand", label: "品牌", value: "", typeCode: 'pa011', type: 'select', options: [] },
      // 选择型号 带出 密封盖 结构 打字 结构类型 游隙 钢球厂家 油脂 噪音 保持架
      { prop: "model", label: "型号", value: "", type: 'custom', customComponent: 'ComSelect-list', itemRules: [{ required: true, trigger: "change" }], itemDisabled: false },
      { prop: "sealingCoverStructure", label: "密封盖-结构", typeCode: 'pa012', value: "", type: "select", itemRules: [{ required: true, trigger: "change" }], itemDisabled: false, options: [] },
      { prop: "sealingCoverTyping", label: "密封盖-打字", value: "", type: "select", typeCode: 'pa007', options: [] },
      { prop: "structureType", label: "结构类型", value: "", typeCode: 'pa013', type: "select", itemRules: [{ required: true, trigger: "change" }], itemDisabled: false, options: [] },
      { prop: "clearance", label: "游隙", value: "", type: "select", typeCode: 'pa001', itemRules: [{ required: true, trigger: "change" }], itemDisabled: false, options: [] },
      { prop: "steelBallManufacturer", label: "钢球厂家", value: "", type: "custom", customComponent: 'ComSelect-page', itemRules: [{ required: true, trigger: "change" }], itemDisabled: false },
      { prop: "oil", label: "油脂", value: "", typeCode: 'pa002', type: "select", itemRules: [{ required: true, trigger: "change" }], itemDisabled: false, options: [] },
      { prop: "oilQuantity", label: "油脂量", value: "", typeCode: 'pa003', type: "select", options: [] },
      { prop: "noise", label: "噪音", value: "", typeCode: 'pa014', type: "select", itemRules: [{ required: true, trigger: "change" }], itemDisabled: false, options: [] },
      { prop: "holder", label: "保持架", value: "", typeCode: 'pa004', type: "select", itemRules: [{ required: true, trigger: "change" }], itemDisabled: false, options: [] },
      { prop: "vibrationLevel", label: "振动等级", value: "", type: "select", typeCode: 'pa005', options: [] },
      { prop: "accuracyLevel", label: "精度等级", value: "", type: "select", typeCode: 'pa006', options: [] },
      { prop: "colour", label: "颜色", value: "", type: "select", typeCode: 'pa010', options: [] },
      { prop: "aperture", label: "孔径", value: "", type: "select", typeCode: 'pa009', options: [] },


      { prop: "remark", label: "备注", value: "", type: "textarea", sm: 24 },
    ],
  },
]