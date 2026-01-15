/**
 * @description 按钮权限列表
 */
export const buttonList = [
  // {
  //   buttonType: 'primary',
  //   type: 'add',
  //   permission: 'btn_add',
  //   icon: 'el-icon-plus',
  //   text: '新建'
  // },
  {
    buttonType: 'primary',
    type: 'addRules',
    permission: 'btn_add_rules',
    icon: 'el-icon-plus',
    text: '新建指标规则'
  }
]

/**
 * @description 主表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "orderNo",
      label: "指标编码",
      value: "",
      type: "input",
      itemRules: [{ required: true, trigger: "blur" }],
      get disabled() {
        return context.isOrderNoEditable
      },
      sm: 24,
    },
    {
      prop: "name",
      label: "指标中文名称",
      value: "",
      type: "input",
      itemRules: [{ required: true, message: "请输入指标中文名称", trigger: ["blur"] }],
      sm: 24,
    },
    {
      prop: "enName",
      label: "指标英文名称",
      value: "",
      type: "input",
      itemRules: [{ required: true, message: "请输入指标英文名称", trigger: ["blur"] }],
      sm: 24,
    },
    {
      prop: "calculationFormula",
      label: "计算公式",
      value: "",
      type: "input",
      itemRules: [{ required: true, message: "请输入计算公式", trigger: ["blur"] }],
      sm: 24,
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "指标编码",
      minWidth: 120,
    },
    {
      prop: "name",
      label: "指标中文名称",
      minWidth: 140,
    },
    {
      prop: "enName",
      label: "指标英文名称",
      minWidth: 140,
    },
    {
      prop: "calculationFormula",
      label: "计算公式",
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
