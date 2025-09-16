/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns(isDetail = false) {
  const baseColumns = [
    {
      prop: "orderNo",
      label: "请购单号",
      minWidth: 220,
      align: "left",
      slot: true,
      fixed: 'left'
    },
    {
      prop: "applicationReason",
      label: "申请理由",
      minWidth: 220,
      align: "left"
    },
    {
      prop: "reasonRejection",
      label: "驳回理由",
      minWidth: 220,
      align: "left"
    },
    {
      prop: "approvalCompletionDate",
      label: "审批完成时间",
      minWidth: 180,
      align: "left"
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
      prop: "createTime",
      label: "创建时间",
      minWidth: 180
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 140
    }
  ];

  const detailColumns = [
    {
      prop: "productCode",
      label: "产品编码",
      minWidth: 220,
      align: "left"
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 220,
      align: "left"
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 220,
      align: "left"
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      minWidth: 200
    },
    {
      prop: "planQuantity",
      label: "采购数量",
      minWidth: 120
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 90
    },
    {
      prop: "deliveryDate",
      label: "交货日期",
      minWidth: 120
    },
  ];

  return isDetail ? [...detailColumns, ...baseColumns] : baseColumns;
}
