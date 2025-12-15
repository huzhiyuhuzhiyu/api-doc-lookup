/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'reInspection',
    permission: 'btn_reInspection',
    icon: 'el-icon-plus',
    text: '生成重检单'
  }
]

export function getColumns() {
  return [
    {
      prop: "storageDate",
      label: "入库日期",
      minWidth: 160
    },
    {
      prop: "productCode",
      label: "产品编码",
      minWidth: 220,
      align: "left"
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 220,
      align: "left"
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 220,
      align: "left"
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      minWidth: 160,
      align: "left"
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 80
    },
    {
      prop: "batchNumber",
      label: "批次号",
      minWidth: 160
    },
    {
      prop: "stockGoodsShelvesName",
      label: "库位",
      minWidth: 160
    },
    {
      prop: "inventoryQuantity",
      label: "数量",
      minWidth: 160
    },
    {
      prop: "stockDay",
      label: "在库天数",
      minWidth: 160
    }
  ]
}
