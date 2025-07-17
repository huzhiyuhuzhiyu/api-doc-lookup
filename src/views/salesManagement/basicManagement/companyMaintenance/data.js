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
  },
  {
    buttonType: 'primary',
    type: 'binding',
    permission: 'btn_customer_binding',
    icon: 'el-icon-user',
    text: '客户绑定'
  }
]

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "name",
      label: "公司抬头",
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
      prop: "address",
      label: "地址",
      value: "",
      type: "input",
      sm: 12
    },
    {
      prop: "fax",
      label: "传真",
      value: "",
      type: "input",
      sm: 12
    },
    {
      prop: "taxNumber",
      label: "信用代码",
      value: "",
      type: "input",
      sm: 12
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "input",
      sm: 12
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "name",
      label: "公司抬头",
      minWidth: 200,
      sortable:'custom',
    },
    {
      prop: "address",
      label: "地址",
      minWidth: 200,
      align: "left",
      sortable:'custom',
    },
    {
      prop: "contactNumber",
      label: "联系电话",
      minWidth: 120,
    },
    {
      prop: "fax",
      label: "传真",
      minWidth: 120,
    },
    {
      prop: "taxNumber",
      label: "信用代码",
      minWidth: 120,
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
    },
  ]
}
