import formValidate from "@/utils/formValidate";

export default () => [
  {
    tabCode: "basicInfo",
    tabName: "基本信息",
    tabContent: [
      { prop: "warehouseName", label: "上级仓库", value: "", type: 'custom', customComponent: "ComSelect-list", render: true, itemRules: [{ required: true, trigger: "change" }] },
      { prop: "state", label: "状态", value: "", type: 'select', render: true, itemRules: [{ required: true, trigger: "change" }], options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }] },
    ],
  },

]