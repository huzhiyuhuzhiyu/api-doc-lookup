/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "来源单号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "productCode",
      label: "产品编码",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      minWidth: 200,
      sortable: 'custom',
    },
    {
      prop: "planQuantity",
      label: "采购数量",
      minWidth: 120,
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 90,
    },
    {
      prop: "deliveryDate",
      label: "交货日期",
      minWidth: 120,
    },
    {
      prop: "num",
      label: "申请人",
      minWidth: 120,
    },
    {
      prop: "feedbackDeliveryDate",
      label: "申请部门",
      minWidth: 120,
    },
    {
      prop: "createTime",
      label: "申请时间",
      minWidth: 180,
    },
    {
      prop: "applicationReason",
      label: "申请理由",
      minWidth: 160,
      align: "left",
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 160,
      align: "left",
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: "documentStatusList",
    },
    {
      prop: "approvalStatus",
      label: "审批状态",
      minWidth: 120,
      slot: true,
      dictType: "approvalStateList",
    }
  ]
}
