export const buttonList = [
  {
    buttonType: 'primary',
    type: 'procurementRequirement',
    permission: 'btn_purchase_order',
    icon: '',
    text: '生成采购单'
  }
]

export function getColumns() {
  return [
    {
      prop: "incomingDate",
      label: "来料日期",
      minWidth: 150,
    },
    {
      prop: "personInCharge",
      label: "负责人",
      minWidth: 120,
    },
    {
      prop: "supplierCode",
      label: "供应商编号",
      minWidth: 180,
    },
    {
      prop: "supplierName",
      label: "供应商名称",
      minWidth: 180,
    },
    {
      prop: "productCode",
      label: "产品编号",
      minWidth: 180,
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 180,
    },
    {
      prop: "productModel",
      label: "产品型号",
      minWidth: 220,
    },
    {
      prop: "productTypeName",
      label: "产品分类",
      minWidth: 160,
    },
    {
      prop: "inspectionDate",
      label: "检验日期",
      minWidth: 150,
    },
    {
      prop: "inspectionQuantity",
      label: "检验数量",
      minWidth: 160,
    },
    {
      prop: "qualifiedQuantity",
      label: "合格数量",
      minWidth: 160,
    },
    {
      prop: "reworkQuantity",
      label: "工费数量",
      minWidth: 160,
    },
    {
      prop: "inspectionResults",
      label: "检验结果",
      minWidth: 120,
      slot: true,
      dictType: "inspectionResultsType",
    },
    {
      prop: "defectReason",
      label: "不良原因",
      minWidth: 160,
    },
  ]
}
