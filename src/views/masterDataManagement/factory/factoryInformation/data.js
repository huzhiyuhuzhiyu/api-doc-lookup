/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'add',
    permission: 'btn_add',
    icon: 'el-icon-plus',
    text: '新增'
  }
]

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "name",
      label: "公司名称",
      value: "",
      type: "input",
      maxlength: 100,
      itemRules: [{required: true, trigger: "blur"}],
      sm: 12
    },
    {
      prop: "contacts",
      label: "联系人",
      value: "",
      type: "input",
      maxlength: 100,
      itemRules: [{required: true, trigger: "blur"}],
      sm: 12
    },
    {
      prop: "contactNumber",
      label: "联系电话",
      value: "",
      type: "input",
      itemRules: [
        {required: true, trigger: "blur"},
        {
          validator: context.formValidate('iphone', '联系电话格式错误', () => {
          }),
          trigger: 'change'
        }
      ],
      sm: 12
    },
    {
      prop: "taxNumber",
      label: "税号",
      value: "",
      type: "input",
      sm: 12
    },
    {
      prop: "address",
      label: "地址",
      value: "",
      type: "input",
      sm: 12
    },
    {
      prop: "defaultFlag",
      label: "是否默认地址",
      value: true,
      type: "switch",
      activeValue: true,
      inactiveValue: false,
      sm: 12
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "name",
      label: "公司名称",
      minWidth: 200,
      showOverflowTooltip: true,
    },
    {
      prop: "contacts",
      label: "联系人",
      minWidth: 200,
      showOverflowTooltip: true,
    },
    {
      prop: "contactNumber",
      label: "联系电话",
      minWidth: 200,
      showOverflowTooltip: true,
    },
    {
      prop: "taxNumber",
      label: "税号",
      minWidth: 200,
      showOverflowTooltip: true,
    },
    {
      prop: "address",
      label: "地址",
      minWidth: 200,
      align: "left",
      showOverflowTooltip: true,
    },
    {
      prop: "defaultFlag",
      label: "是否默认地址",
      minWidth: 90,
      slot: true,
      dictType: 'booleanOptions'
    },
  ]
}
