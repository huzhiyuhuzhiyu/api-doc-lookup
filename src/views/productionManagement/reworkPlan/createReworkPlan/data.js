/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'reworkTask',
    permission: 'btn_reworkTask',
    icon: 'el-icon-plus',
    text: '返工任务'
  },
  {
    buttonType: 'primary',
    type: 'transferCardPrint',
    permission: 'btn_transferCard_print',
    icon: 'el-icon-print',
    text: '流转卡打印'
  }
]

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "生产任务单号",
      minWidth: 180
    },
    {
      prop: "orderType",
      label: "任务类型",
      minWidth: 160,
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
      prop: "pairingModeName",
      label: "配对方式",
      minWidth: 120
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 80
    },
    {
      prop: "productionQuantity",
      label: "总生产数量",
      minWidth: 160
    },
    {
      prop: "completedQuantity",
      label: "已完成数量",
      minWidth: 160
    },
    {
      prop: "prodSchedule",
      label: "完成进度",
      minWidth: 180,
      slot: true,
      sortProp: null,
    },
    {
      prop: "routingName",
      label: "工艺路线名称",
      minWidth: 160
    },
    {
      prop: "routingCode",
      label: "工艺路线编码",
      minWidth: 160
    },
    {
      prop: "taskMethod",
      label: "编排任务方式",
      minWidth: 160,
      slot: true,
      dictType: 'taskMethodStatus',
    },
    {
      prop: "productionLineName",
      label: "产线",
      minWidth: 120
    },
    {
      prop: "planStartDate",
      label: "计划开始日期",
      minWidth: 160
    },
    {
      prop: "planEndDate",
      label: "计划结束日期",
      minWidth: 160
    },
    {
      prop: "urgentFlag",
      label: "是否紧急",
      minWidth: 160,
      slot: true,
      dictType: 'booleanOptions',
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
