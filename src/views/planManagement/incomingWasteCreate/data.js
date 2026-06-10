export const buttonList = [
  {
    buttonType: 'primary',
    type: 'purchaseOrder',
    permission: 'btn_purchase_order',
    icon: '',
    text: '生成采购单'
  }
]

const SCRAP_CONFIG = {
  process: {
    label: '工废',
    quantityProp: 'processScrapQty'
  },
  material: {
    label: '料废',
    quantityProp: 'materialWasteQuantity'
  },
  responsibility: {
    label: '责废',
    quantityProp: 'responsibilityWasteQuantity'
  }
};

export function getColumns(type) {

  const { label, quantityProp } = SCRAP_CONFIG[type];
  const scrapLabel = `${ label }数量`;

  return [
    // {
    //   prop: "incomingDate",
    //   label: "来料日期",
    //   minWidth: 150,
    // },
    {
      prop: "inspectorName",
      label: "负责人",
      minWidth: 120,
    },
    // {
    //   prop: "supplierCode",
    //   label: "供应商编号",
    //   minWidth: 180,
    // },
    // {
    //   prop: "supplierName",
    //   label: "供应商名称",
    //   minWidth: 180,
    // },
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
      prop: "productDrawingNo",
      label: "型号",
      minWidth: 220,
    },
    {
      prop: "productCategoryName",
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
    // {
    //   prop: "qualifiedQuantity",
    //   label: "合格数量",
    //   minWidth: 160,
    // },
    {
      prop: quantityProp,
      label: scrapLabel,
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
