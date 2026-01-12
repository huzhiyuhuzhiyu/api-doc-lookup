export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "source",
      label: "来源",
      minWidth: 220,
      slot: true,
      dictType: "inspectionSource",
    },
    {
      prop: "saleOrderNo",
      label: "销售单号",
      minWidth: 220,
    },
    {
      prop: "purchaseOrderNo",
      label: "采购单号",
      minWidth: 220,
    },
    {
      prop: "batchNumber",
      label: "批次",
      minWidth: 160,
    },
    {
      prop: "customerCode",
      label: "客户编号",
      minWidth: 160,
    },
    {
      prop: "supplierCode",
      label: "供应商编号",
      minWidth: 180,
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 180,
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 220,
    },
    {
      prop: "processName",
      label: "工序名称",
      minWidth: 160,
    },
    {
      prop: "inspectionQuantity",
      label: "本批数量",
      minWidth: 160,
    },
    {
      prop: "samplingQuantity",
      label: "检验数量",
      minWidth: 160,
    },
    {
      prop: "inspectionDate",
      label: "检验日期",
      minWidth: 150,
    },
    {
      prop: "inspectionResults",
      label: "检验结果",
      minWidth: 120,
      slot: true,
      dictType: "inspectionResultsType",
    },
    {
      prop: "status",
      label: "状态",
      slot: true,
      dictType: "workReportInspection",
      minWidth: 120,
    }
  ]
}
