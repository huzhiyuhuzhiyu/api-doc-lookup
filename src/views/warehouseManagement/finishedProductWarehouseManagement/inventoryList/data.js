/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'add',
    permission: 'btn_withdraw',
    icon: 'iconfont-menu icon-chehui',
    text: '撤回'
  },
  {
    buttonType: 'primary',
    type: 'export',
    permission: 'btn_export',
    exportType: '1012',
    exportName: '导出',
    tableRef: 'dataTable',
    disabled: false
  },
]

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "单号",
      minWidth: 220,
      slot: true,
    },
    {
      prop: "businessType",
      label: "业务类型",
      minWidth: 180,
      slot: true,
      dictType: "warehouseBusinessType"
    },
    {
      prop: "sourceType",
      label: "来源类型",
      minWidth: 180,
      slot: true,
      dictType: "sourceType"
    },
    {
      prop: "supplierPartnerName",
      label: "供应商",
      minWidth: 160,
    },
    {
      prop: "supplierPartnerCode",
      label: "供应商编码",
      minWidth: 160,
    },
    {
      prop: "cooperativePartnerName",
      label: "客户",
      minWidth: 160,
    },
    {
      prop: "cooperativePartnerCode",
      label: "客户编码",
      minWidth: 160,
    },
    {
      prop: "inspectionResults",
      label: "检验标志",
      minWidth: 120,
      slot: true,
      dictType: 'inspectionResultsType'
    },
    {
      prop: "orderDate",
      label: "单据日期",
      minWidth: 120,
    },
    {
      prop: 'documentStatus',
      label: '单据状态',
      minWidth: 120,
      slot: true,
      dictType: "documentStatusList"
    },
    {
      prop: 'approvalStatus',
      label: '审批状态',
      minWidth: 120,
      slot: true,
      dictType: "approvalStateList"
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 140
    }
  ]
}
