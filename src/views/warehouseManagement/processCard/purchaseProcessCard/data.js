/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'splitCard',
    permission: 'btn_split_card',
    icon: 'el-icon-s-unfold',
    text: '分卡'
  },
  {
    buttonType: 'primary',
    type: 'export',
    permission: 'btn_export',
    exportType: '1073',
    exportName: '采购收货通知单明细',
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
      prop: "deliverDate",
      label: "收货日期",
      minWidth: 160,
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
      prop: "saleOrderNo",
      label: "批次号",
      minWidth: 160
    },
    {
      prop: "purchaseQuantity",
      label: "数量",
      minWidth: 160
    },
    {
      prop: "waitSplitQuantity",
      label: "可分卡数量",
      minWidth: 160
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
    },
    {
      prop: "approvalStatus",
      label: "审批状态",
      minWidth: 120,
      slot: true,
      dictType: 'approvalStateList',
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
    }
  ]
}
