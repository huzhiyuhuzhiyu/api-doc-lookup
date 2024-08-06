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
      // { prop: "partnerCategoryIdText", label: "上级仓库", value: "", type: 'custom', customComponent: "ComSelect-list" },
      { prop: "type", label: "仓库类型", value: "normal", type: "select", options: [{ label: "正常仓库", value: "normal" }, { label: "中转仓库", value: "temp" }, { label: "不良品仓库", value: "unqualified" }, { label: "报废", value: "scrap" }, { label: "虚拟仓库", value: "virtually" }] },
      { prop: "code", label: "仓库编码", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: formValidate('enCode'), trigger: 'blur' }], render: true },
      { prop: "name", label: "仓库名称", value: "", type: 'input', maxlength: 100, itemRules: [{ required: true, trigger: "blur" }], },
      { prop: "position", label: "位置", value: "", type: 'input', maxlength: 100 },
      { prop: "sort", label: "排序值", value: "", type: 'input', maxlength: 100 },
      { prop: "remark", label: "备注", value: "", type: "textarea", sm: 24 },
    ],
  },

]