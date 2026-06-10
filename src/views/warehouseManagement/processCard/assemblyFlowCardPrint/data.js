/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'print',
    permission: 'btn_print',
    icon: 'el-icon-printer',
    text: '打印'
  },
  {
    buttonType: 'primary',
    type: 'export',
    permission: 'btn_export',
    exportType: '1017',
    exportName: '装配流转卡',
    tableRef: 'dataTable',
  }
]

export function getColumns() {
  return [
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
    },
    {
      prop: "productionPlanNo",
      label: "生产计划单号",
      minWidth: 180,
    },
    {
      prop: "orderNo",
      label: "生产任务单号",
      minWidth: 180,
    },
    {
      prop: "orderType",
      label: "任务类型",
      minWidth: 120,
      slot: true,
      dictType: 'orderType',
    },
    {
      prop: "productCode",
      label: "产品编码",
      minWidth: 220
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 220
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 220
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      minWidth: 160
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 80
    },
    {
      prop: "planEndDate",
      label: "订单交期",
      minWidth: 160
    },
    {
      prop: "productionQuantity",
      label: "总生产数量",
      minWidth: 160,
    },
    {
      prop: "completedQuantity",
      label: "已完成数量",
      minWidth: 160,
    },
    {
      prop: "routingCode",
      label: "工艺路线编码",
      minWidth: 160,
    },
    {
      prop: "routingName",
      label: "工艺路线名称",
      minWidth: 160,
    },
    {
      prop: "sealingCoverTyping",
      label: "打字",
      minWidth: 180,
    },
    {
      prop: "specialRequire",
      label: "要求",
      minWidth: 180,
    }
  ]
}
