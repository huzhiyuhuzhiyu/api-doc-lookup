/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "通知单号",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
      slot: true
    },
    {
      prop: "partnerCode",
      label: "客户编码",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "partnerName",
      label: "客户名称",
      minWidth: 180,
      align: "left",
      sortable: 'custom'
    },
    {
      prop: "productCode",
      label: "产品编码",
      minWidth: 180,
      align: "left",
      sortable: 'custom'
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 180,
      align: "left",
      sortable: 'custom'
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 180,
      align: "left",
      sortable: 'custom'
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      minWidth: 180,
      align: "left",
      sortable: 'custom'
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 90,
      sortable: 'custom'
    },
    {
      prop: "ordersNo",
      label: "订单号",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "deliverDate",
      label: "退货日期",
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: "deliveryStatus",
      label: "退货状态",
      minWidth: 120,
      slot: true,
      dictType: 'shippingStatus',
      sortable: 'custom'
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
      sortable: 'custom'
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
      sortable: 'custom'
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
      sortable: 'custom'
    }
  ]
}
