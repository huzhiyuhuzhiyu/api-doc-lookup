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
    exportType: '1018',
    exportName: '包装任务进度',
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
      prop: "orderDate",
      label: "单据日期",
      minWidth: 160,
    },
    {
      prop: "businessType",
      label: "业务类型",
      minWidth: 120,
      slot: true,
      dictType: 'warehouseBusinessType',
    },
    {
      prop: "orderNo",
      label: "单号",
      minWidth: 180,
      slot: true,
    },
    {
      prop: "sourceNo",
      label: "来源单号",
      minWidth: 180,
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
      prop: "drawingNo",
      label: "产品型号",
      minWidth: 220
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 80
    },
    {
      prop: "batchNumber",
      label: "批次号",
      minWidth: 160
    },
    {
      prop: "num",
      label: "数量",
      minWidth: 160
    },
    {
      prop: "waitSplitQuantity",
      label: "可分卡数量",
      minWidth: 160
    },
    {
      prop: "warehouseName",
      label: "仓库名称",
      minWidth: 160,
    },
    {
      prop: "shelfSpaceName",
      label: "库位",
      minWidth: 160,
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
