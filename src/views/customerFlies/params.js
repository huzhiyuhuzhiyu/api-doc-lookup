import formValidate from "@/utils/formValidate";

export default () => [
  {
    tabCode: "basicInfo",
    tabName: "基本信息",
    tabContent: [
      { prop: "partnerCategoryId", label: "所属分类", value: "", type: 'custom', customComponent: "ComSelect-list", itemRules: [{ required: true, message: "请选择所属分类", trigger: "no" }] },
      { prop: "code", label: "客户编码", value: "", type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: formValidate('enCode'), trigger: 'blur' }],render:true },
      { prop: "name", label: "客户名称", value: "", type: 'input', maxlength: 100, },
      { prop: "taxId", label: "税号", value: "", type: 'input', maxlength: 100,itemRules: [{ required: true, trigger: "blur" },] },
      { prop: "nameEn", label: "英文名称", value: "", type: 'input', maxlength: 100,itemRules: [{ required: true, trigger: "blur" },] },
    ],
  },
  // {
  //   tabCode: "lxr",
  //   tabName: "联系人信息",
  //   tabContent: [
  //     { prop: "name", label: "姓名", value: "", type: 'input', maxlength: 100, },
  //     { prop: "sex", label: "性别", value: "", type: "select", options: [{ label: "男", value: "男" }, { label: "女", value: "女" }]},
  //     { prop: "phone", label: "电话", value: "", type: 'input', maxlength: 100, },
  //   ],
  // },
]