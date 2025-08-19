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
      label: "供应商编码",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "partnerName",
      label: "供应商名称",
      minWidth: 180,
      align: "left",
      sortable: 'custom'
    },
    {
      prop: "deliverDate",
      label: "退货日期",
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: "unqualifiedQuantity",
      label: "退货数量",
      minWidth: 120,
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
