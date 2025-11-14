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
      prop: "code",
      label: "编码",
      value: "",
      type: "input",
      itemRules: [{ required: true, trigger: "blur" }],
    },
    {
      prop: "name",
      label: "名称",
      value: "",
      type: "input",
      itemRules: [{ required: true, trigger: "blur" }],
    },
    {
      prop: "accountPeriod",
      label: "默认账期",
      value: "",
      type: "date",
      itemRules: [{ required: true, trigger: "blur" }],
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
      prop: "code",
      label: "编码",
      minWidth: 120,
    },
    {
      prop: "name",
      label: "名称",
      minWidth: 120,
    },
    {
      prop: "accountPeriod",
      label: "默认账期",
      minWidth: 120,
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
