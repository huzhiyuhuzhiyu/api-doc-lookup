/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: 'purchaseOrderNo',
      label: '采购单号',
      minWidth: 120,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: 'purchaseOrderNo',
      label: '订单号',
      minWidth: 120,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: 'productName',
      label: '产品名称',
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: 'productCode',
      label: '产品编码',
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: 'drawingNo',
      label: '产品型号',
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: 'customerProductDrawingNo',
      label: '客户型号',
      minWidth: 120,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: 'purchaseQuantity',
      label: '数量',
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: 'cooperativePartnerCode',
      label: '客户编码',
      minWidth: 120,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: 'cooperativePartnerName',
      label: '客户名称',
      minWidth: 120,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: 'orderDate',
      label: '下单日期',
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: 'deliveryDate',
      label: '确认日期',
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: 'status',
      label: '状态',
      minWidth: 180,
      sortable: 'custom',
      slot: true,
      dictType: "drawConfStatus"
    },
  ]
}
