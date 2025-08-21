/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "包装计划单号",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 180,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "processName",
      label: "工序名称",
      minWidth: 160,
      sortable: 'custom',
    },
    {
      prop: "batchNumber",
      label: "批次号",
      minWidth: 160,
      sortable: 'custom',
    },
    {
      prop: "qualifiedQuantity",
      label: "合格数量",
      minWidth: 160,
      sortable: 'custom',
    },
    {
      prop: "unqualifiedQuantity",
      label: "不合格数量",
      minWidth: 160,
      sortable: 'custom',
    },
    {
      prop: "workGroupName",
      label: "包装班组",
      minWidth: 160,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "packagingMethod",
      label: "包装方式",
      minWidth: 120,
      slot: true,
      dictType: 'packaging',
      sortable: 'custom',
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "reportingTime",
      label: "报工时间",
      minWidth: 220,
      sortable: 'custom',
    },
  ]
}
