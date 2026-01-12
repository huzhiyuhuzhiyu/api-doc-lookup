/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: 'purchaseOrderNo',
      label: '采购单号',
      minWidth: 220,
    },
    {
      prop: 'productName',
      label: '产品名称',
      minWidth: 220,
    },
    {
      prop: 'productCode',
      label: '产品编码',
      minWidth: 220,
    },
    {
      prop: 'drawingNo',
      label: '产品型号',
      minWidth: 220,
    },
    {
      prop: 'customerProductDrawingNo',
      label: '客户产品型号',
      minWidth: 220,
    },
    {
      prop: 'purchaseQuantity',
      label: '数量',
      minWidth: 120,
    },
    {
      prop: 'cooperativePartnerCode',
      label: '供应商编码',
      minWidth: 120,
    },
    {
      prop: 'cooperativePartnerName',
      label: '供应商名称',
      minWidth: 120,
    },
    {
      prop: 'customerCode',
      label: '客户编码',
      minWidth: 120,
    },
    {
      prop: 'customerName',
      label: '客户名称',
      minWidth: 120,
    },
    {
      prop: 'orderDate',
      label: '下单日期',
      minWidth: 120,
    },
    {
      prop: 'deliveryDate',
      label: '确认日期',
      minWidth: 120,
    },
    {
      prop: 'status',
      label: '状态',
      minWidth: 180,
      slot: true,
      dictType: "drawConfStatus"
    },
    {
      prop: 'createTime',
      label: '创建时间',
      minWidth: 180
    },
  ]
}
