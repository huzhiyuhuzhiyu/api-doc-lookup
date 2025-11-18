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
      prop: "moldName",
      label: "转换单号",
      value: "",
      type: "input",
      itemRules: [{ required: true, trigger: "blur" }],
      get disabled() {
        return context.isOrderNoEditable
      }
    },
    {
      prop: "applicationDate",
      label: "申请日期",
      value: "",
      type: "date",
      itemRules: [{ required: true, trigger: "blur" }],
    },
    {
      prop: "requestCompletionDate",
      label: "需求完成日期",
      value: "",
      type: "date",
      itemRules: [{ required: true, trigger: "blur" }],
    },
    {
      prop: "repairReason",
      label: "维修原因及维修内容",
      value: "",
      type: "textarea",
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "通知单号",
      minWidth: 220,
    },
    {
      prop: "warehouseName",
      label: "仓库名称",
      minWidth: 180,
    },
    {
      prop: "shelfSpaceName",
      label: "库位",
      minWidth: 120,
    },
    {
      prop: "priority",
      label: "优先级",
      minWidth: 120,
      slot: true,
      dictType: 'shippingPriority',
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
