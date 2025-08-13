/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "单号",
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
    },
    {
      prop: "productCode",
      label: "产品编码",
      minWidth: 180,
      align: "left",
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 180,
      align: "left",
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 180,
      align: "left",
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      minWidth: 180,
      align: "left",
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 90,
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
    },
    {
      prop: "deliveryStatus",
      label: "退货状态",
      minWidth: 120,
      slot: true,
      dictType: 'shippingStatus',
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
    }
  ]
}
