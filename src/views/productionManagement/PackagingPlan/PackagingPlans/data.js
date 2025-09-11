/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'print',
    permission: 'btn_print',
    icon: 'el-icon-printer',
    text: '打印'
  },
  {
    buttonType: 'primary',
    type: 'import',
    permission: 'btn_import',
    icon: 'el-icon-upload2',
    text: '导入'
  },
]

export function getColumns() {
  return [
    {
      prop: "productionPlanNo",
      label: "包装计划单号",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "ordersNo",
      label: "销售单号",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "purchaseOrderNo",
      label: "采购单号",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "productsCode",
      label: "产品编码",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "productsName",
      label: "产品名称",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "productsDrawingNo",
      label: "产品型号",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      minWidth: 160,
      align: "left",
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 80
    },
    {
      prop: "planProductionQuantity",
      label: "计划生产数量",
      minWidth: 160
    },
    {
      prop: "availableArrangeQuantity",
      label: "可编排数量",
      minWidth: 160
    },
    {
      prop: "arrangeOrderNum",
      label: "生产订单/已编排数",
      minWidth: 220
    },
    {
      prop: "urgentFlag",
      label: "是否紧急",
      minWidth: 120,
      slot: true,
      dictType: 'booleanOptions'
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
      align: "left"
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
