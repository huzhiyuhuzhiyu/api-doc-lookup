/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'orderPrinting',
    permission: 'btn_order_printing', // btn_order_printing
    icon: 'el-icon-printer',
    text: '订单打印'
  },
  {
    buttonType: 'primary',
    type: 'contractPrinting',
    permission: 'btn_contract_printing', // btn_contract_printing
    icon: 'el-icon-printer',
    text: '合同打印'
  },
]

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "订单号",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "contractNo",
      label: "客户合同号",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "cooperativePartnerCode",
      label: "客户编码",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "cooperativePartnerName",
      label: "客户名称",
      minWidth: 180,
      align: "left",
    },
    {
      prop: "orderType",
      label: "订单类型",
      minWidth: 120,
      slot: true,
      dictType: 'salesOrderType',
    },
    {
      prop: "orderDate",
      label: "订单日期",
      minWidth: 120,
    },
    {
      prop: "deliveryStatus",
      label: "交期状态",
      minWidth: 120,
      slot: true,
      dictType: 'deliveryStatus',
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
