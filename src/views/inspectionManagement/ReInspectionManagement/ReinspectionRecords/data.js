/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "重检单号",
      minWidth: 180
    },
    {
      prop: "orderDate",
      label: "日期",
      minWidth: 160
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
      prop: "mainUnit",
      label: "单位",
      minWidth: 80
    },
    {
      prop: "packagingMethod",
      label: "包装方式",
      minWidth: 120,
      slot: true,
      dictType: 'packaging',
    },
    {
      prop: "num",
      label: "数量",
      minWidth: 160
    },
    {
      prop: "batchNumber",
      label: "批次号",
      minWidth: 160
    },
    {
      prop: "status",
      label: "状态",
      minWidth: 160,
      slot: true,
      dictType: 'shippingStatus',
    }
  ]
}
