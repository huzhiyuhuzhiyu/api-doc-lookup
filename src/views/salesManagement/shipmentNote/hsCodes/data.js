import store from "@/store";
import {getcategoryTree} from "@/api/basicData/materialSettings";

/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'confirm',
    permission: 'btn_confirm',
    icon: '',
    text: '确认'
  }
]

/**
 * @description 海关产品分类表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "code",
      label: "HS编码",
      value: "",
      type: "input",
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "name",
      label: "商品名称",
      value: "",
      type: "input",
      // itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "drawingNo",
      label: "规格型号",
      value: "",
      type: "input",
      // itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "tradeName",
      label: "贸易名称",
      value: "",
      type: "input",
      // itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "purpose",
      label: "用途",
      value: "",
      type: "input",
      // itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "type",
      label: "类型",
      value: "",
      type: "input",
      // itemRules: [{required: true, trigger: "change"}],
      options: [],
    },
    {
      prop: "brand",
      label: "品牌",
      value: "",
      type: "input",
      // itemRules: [{required: true, trigger: "change"}],
      options: [],
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
      sm: 24
    }
  ]
}
