/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'export',
    permission: 'btn_export',
    exportType: '1269',
    exportName: '包装任务进度',
    tableRef: 'dataTable',
    disabled: false
  }
]

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "生产单号",
      minWidth: 220,
    },
    {
      prop: "saleOrderNo",
      label: "销售订单号",
      minWidth: 220,
    },
    {
      prop: "productsDrawingNo",
      label: "型号",
      minWidth: 220,
    },
    {
      prop: "productsCode",
      label: "产品编码",
      minWidth: 180,
    },
    {
      prop: "productsName",
      label: "产品名称",
      minWidth: 200,
    },
    {
      prop: "customerCode",
      label: "客户编码",
      minWidth: 160,
    },
    {
      prop: "customerName",
      label: "客户名称",
      minWidth: 180,
    },
    {
      prop: "supplierCode",
      label: "供应商编码",
      minWidth: 160,
    },
    {
      prop: "supplierName",
      label: "供应商名称",
      minWidth: 180,
    },
    {
      prop: "batchNumber",
      label: "批次号",
      minWidth: 160,
    },
    {
      prop: "arrivalDate",
      label: "到货日期",
      minWidth: 160,
    },
    {
      prop: "planStartDate",
      label: "计划开始时间",
      minWidth: 160,
    },
    {
      prop: "planEndDate",
      label: "计划结束时间",
      minWidth: 160,
    },
    {
      prop: "productionQuantity",
      label: "来货数量",
      minWidth: 120,
    },
    {
      prop: "qualifiedQuantity",
      label: "合格数量",
      minWidth: 120,
    },
    {
      prop: "unqualifiedQuantity",
      label: "不合格数量",
      minWidth: 120,
    },
    {
      prop: "randomConfirmedStatus",
      label: "抽检确认状态",
      minWidth: 140,
      slot: true,
      dictType: "workReportInspection"
    },
    {
      prop: "randomTreatmentResults",
      label: "抽检处理结果",
      minWidth: 140,
      slot: true,
      dictType: "inspectionResultsType"
    },
    {
      prop: "fullConfirmedStatus",
      label: "全检确认状态",
      minWidth: 140,
      slot: true,
      dictType: "workReportInspection"
    },
    {
      prop: "fullTreatmentResults",
      label: "全检处理结果",
      minWidth: 140,
      slot: true,
      dictType: "inspectionResultsType"
    },
    {
      prop: "patrolInspectionDate",
      label: "全检日期",
      minWidth: 160,
    },
    {
      prop: "typingQualifiedQuantity",
      label: "已打字数量",
      minWidth: 120,
    },
    {
      prop: "waitTypingQuantity",
      label: "未打字数量",
      minWidth: 120,
    },
    {
      prop: "typingDate",
      label: "打字日期",
      minWidth: 160,
    },
    {
      prop: "packingQualifiedQuantity",
      label: "已包装数量",
      minWidth: 120,
    },
    {
      prop: "waitPackingQuantity",
      label: "未包装数量",
      minWidth: 120,
    },
    {
      prop: "packingDate",
      label: "包装日期",
      minWidth: 160,
    },
    {
      prop: "packQuantity",
      label: "装箱数量",
      minWidth: 120,
    },
    {
      prop: "waitPackQuantity",
      label: "未装箱数量",
      minWidth: 120,
    },
    {
      prop: "packDate",
      label: "装箱日期",
      minWidth: 160,
    },
  ];
}
