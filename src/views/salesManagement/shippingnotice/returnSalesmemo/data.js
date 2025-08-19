/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'danger',
    type: 'closeReturn',
    permission: 'btn_close_return',
    icon: 'el-icon-close',
    text: '取消退货'
  },
]

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
      prop: "deliverDate",
      label: "退货日期",
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: "exchangeGoodsFlag",
      label: "退货标识",
      minWidth: 120,
      slot: true,
      dictType: 'returnIndication',
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
      prop: "approvalStatus",
      label: "审批状态",
      minWidth: 120,
      slot: true,
      dictType: 'approvalStateList',
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
