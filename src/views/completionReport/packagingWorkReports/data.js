/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'export',
    permission: 'btn_export',
    exportType: '1020',
    exportName: '包装报工单',
    tableRef: 'dataTable',
    disabled: false
  }
]

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "包装计划单号",
      minWidth: 220,
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 220,
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 180,
    },
    {
      prop: "processName",
      label: "工序名称",
      minWidth: 160,
    },
    {
      prop: "batchNumber",
      label: "批次号",
      minWidth: 160,
    },
    {
      prop: "qualifiedQuantity",
      label: "合格数量",
      minWidth: 160,
    },
    {
      prop: "unqualifiedQuantity",
      label: "不合格数量",
      minWidth: 160,
    },
    {
      prop: "workGroupName",
      label: "包装班组",
      minWidth: 160,
    },
    {
      prop: "packagingMethod",
      label: "包装方式",
      minWidth: 120,
      slot: true,
      dictType: 'packaging',
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 220,
    },
    {
      prop: "reportingTime",
      label: "报工时间",
      minWidth: 220,
    },
  ]
}
