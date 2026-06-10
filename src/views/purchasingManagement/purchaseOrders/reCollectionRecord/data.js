/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "重收单号",
      minWidth: 220,
      slot: true
    },
    {
      prop: "cooperativePartnerCode",
      label: "供应商编码",
      minWidth: 220,
    },
    {
      prop: "cooperativePartnerName",
      label: "供应商名称",
      minWidth: 220,
    },
    {
      prop: "orderDate",
      label: "订单日期",
      minWidth: 120,
    },
    {
      prop: "deliveryDate",
      label: "确认交期",
      minWidth: 120,
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
