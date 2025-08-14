export const buttonList = []

export function getColumns() {
  return [
    // {
    //   prop: "name",
    //   label: "来源",
    //   minWidth: 220,
    //   sortable: 'custom',
    //   align: "left",
    // },
    {
      prop: "saleOrderNo",
      label: "销售单号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "purchaseOrderNo",
      label: "采购单号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "batchNumber",
      label: "批次",
      minWidth: 220,
      sortable: 'custom',
    },
    {
      prop: "customerCode",
      label: "客户编号",
      minWidth: 160,
      sortable: 'custom',
    },
    {
      prop: "maxLoad",
      label: "供应商编号",
      minWidth: 180,
      sortable: 'custom',
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 180,
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
      prop: "processName",
      label: "工序名称",
      minWidth: 220,
      sortable: 'custom',
    },
    {
      prop: "inspectionQuantity",
      label: "本批数量",
      minWidth: 160,
      sortable: 'custom',
    },
    {
      prop: "samplingQuantity",
      label: "检验数量",
      minWidth: 160,
      sortable: 'custom',
    },
    {
      prop: "inspectionDate",
      label: "检验日期",
      minWidth: 150,
      sortable: 'custom',
    },
    {
      prop: "inspectionResults",
      label: "检验结果",
      minWidth: 120,
      sortable: 'custom',
      slot: true,
      dictType: "inspectionResultsType",
    },
    {
      prop: "status",
      label: "状态",
      minWidth: 120,
      sortable: 'custom',
      slot: true,
      dictType: "workReportInspection",
    }
  ]
}
