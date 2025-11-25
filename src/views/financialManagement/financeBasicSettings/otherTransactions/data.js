/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'add',
    permission: 'btn_add',
    icon: 'el-icon-plus',
    text: '新建'
  }
]

/**
 * @description 主表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "bankInfo",
      label: "银行账号",
      value: "",
      type: "input",
      itemRules: [
        { required: true, message: "银行账号不能为空", trigger: "blur" },
        { validator: context.formValidate('bankAccount', '请输入正确的银行账号（10-30位数字）'), trigger: 'blur' }
      ],
    },
    {
      prop: "balance",
      label: "余额",
      value: "",
      type: "input",
      itemRules: [
        { required: true, message: "余额不能为空", trigger: "blur" },
        { validator: context.formValidate({ type: 'decimal2', params: [15, 2, "请输入正确的余额（最多13位整数，2位小数）"] }), trigger: 'blur' }
      ],
    },
    {
      prop: "depositBank",
      label: "开户行",
      value: "",
      type: "input",
      itemRules: [
        { required: true, message: "开户行不能为空", trigger: "blur" },
      ],
    },
    {
      prop: "depositBankAddress",
      label: "开户行地址",
      value: "",
      type: "input",
      itemRules: [
        { required: true, message: "开户行地址不能为空", trigger: "blur" },
      ],
    },
    {
      prop: "initAmount",
      label: "期初金额",
      value: "",
      type: "input",
      itemRules: [
        { required: true, message: "期初金额不能为空", trigger: "blur" },
        { validator: context.formValidate({ type: 'decimal2', params: [15, 2, "请输入正确的期初金额（最多13位整数，2位小数）"] }), trigger: 'blur' }
      ],
    },
    {
      prop: "type",
      label: "分类",
      value: "",
      type: "select",
      options: context.global.bankMaintenanceType,
      itemRules: [{ required: true, trigger: "change" }],
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "bankInfo",
      label: "银行账号",
      minWidth: 180,
    },
    {
      prop: "balance",
      label: "余额",
      minWidth: 120,
    },
    {
      prop: "depositBank",
      label: "开户行",
      minWidth: 180,
    },
    {
      prop: "depositBankAddress",
      label: "开户行地址",
      minWidth: 120,
    },
    {
      prop: "initAmount",
      label: "期初金额",
      minWidth: 120,
    },
    {
      prop: "type",
      label: "分类",
      minWidth: 120,
      slot: true,
      dictType: 'bankMaintenanceType',
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
    }
  ]
}
