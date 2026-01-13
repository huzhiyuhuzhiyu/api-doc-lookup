/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'print',
    permission: 'btn_print',
    icon: 'el-icon-printer',
    text: '打印'
  },
  {
    buttonType: 'primary',
    type: 'export',
    permission: 'btn_export',
    exportType: '1073',
    exportName: '配件流转卡',
    tableRef: 'dataTable',
  }
]

export function getColumns() {
  return [
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
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
      prop: "mainUnit",
      label: "单位",
      minWidth: 80
    },
    {
      prop: 'partnerCode',
      label: '供应商编码',
      minWidth: 160,
    },
    {
      prop: 'partnerName',
      label: '供应商名称',
      minWidth: 160,
    },
    {
      prop: "purchaseQuantity",
      label: "数量",
      minWidth: 160,
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
    },
  ]
}
