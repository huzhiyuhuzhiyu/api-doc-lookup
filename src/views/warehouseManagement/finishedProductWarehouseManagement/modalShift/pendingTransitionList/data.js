/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "转换单号",
      minWidth: 220,
      slot: true,
    },
    {
      prop: "warehouseName",
      label: "仓库名称",
      minWidth: 180,
    },
    {
      prop: "shelfSpaceName",
      label: "库位",
      minWidth: 120,
    },
    {
      prop: "approvalCompletionDate",
      label: "审批完成时间",
      minWidth: 160,
    },
    {
      prop: "submitDate",
      label: "提交时间",
      minWidth: 160,
    },
    {
      prop: "reasonRejection",
      label: "驳回理由",
      minWidth: 180,
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
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
