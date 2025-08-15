/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'add',
    permission: 'btn_add',
    icon: 'el-icon-plus',
    text: '新建任务'
  },
  {
    buttonType: 'primary',
    type: 'assemblePrinter',
    permission: 'btn_assemble_printer',
    icon: 'el-icon-printer',
    text: '打印装配单'
  },
  {
    buttonType: 'primary',
    type: 'flowPrinter',
    permission: 'btn_flow_printer',
    icon: 'el-icon-printer',
    text: '打印流转卡'
  },
  {
    buttonType: 'danger',
    type: 'close',
    permission: 'btn_close',
    icon: 'el-icon-close',
    text: '关单'
  },
]

export function getColumns() {
  return [
    {
      prop: "productionPlanNo",
      label: "包装计划单号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "batchNumber",
      label: "批次号",
      minWidth: 160,
    },
    {
      prop: "orderNo",
      label: "包装任务单号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "productCode",
      label: "产品编码",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      minWidth: 160,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 80
    },
    {
      prop: "productionQuantity",
      label: "总生产数量",
      minWidth: 160,
      sortable: 'custom'
    },
    {
      prop: "completedQuantity",
      label: "已完成数量",
      minWidth: 160,
      sortable: 'custom'
    },
    {
      prop: "prodSchedule",
      label: "完成进度",
      minWidth: 160,
      sortable: 'custom',
      slot: true,
    },
    {
      prop: "routingName",
      label: "工艺路线名称",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "routingCode",
      label: "工艺路线编码",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "productionLineName",
      label: "产线",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "urgentFlag",
      label: "是否紧急",
      minWidth: 120,
      slot: true,
      dictType: 'booleanOptions'
    },
    {
      prop: "planStartDate",
      label: "计划开始日期",
      minWidth: 160,
      sortable: 'custom'
    },
    {
      prop: "planEndDate",
      label: "计划结束日期",
      minWidth: 160,
      sortable: 'custom'
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
      sortable: 'custom'
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
      sortable: 'custom'
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 140,
      sortable: 'custom'
    }
  ]
}
