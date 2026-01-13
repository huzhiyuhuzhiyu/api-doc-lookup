/**
 * @description 按钮权限列表
 */
export const buttonList = []

// 表格列配置
export function getColumns() {
  return [
    {
      prop: "palletTime",
      label: "装托时间",
      minWidth: 220,
    },
    {
      prop: "productsDrawingNo",
      label: "型号",
      minWidth: 220,
    },
    {
      prop: "productsName",
      label: "产品名称",
      minWidth: 220,
    },
    {
      prop: "singleWeight",
      label: "产品单重（KG）",
      minWidth: 260,
    },
    // {
    //   prop: "customer",
    //   label: "客户",
    //   minWidth: 150,
    //   align: "left"
    // },
    {
      prop: "batchNumber",
      label: "批次",
      minWidth: 100
    },
    {
      prop: "packagingMethod",
      label: "包装方式",
      minWidth: 120,
      slot: true,
      dictType: 'packaging'
    },
    {
      prop: "num",
      label: "数量/箱",
      minWidth: 160
    },
    {
      prop: "palletRemark",
      label: "每批数量合计",
      minWidth: 220
    }
  ]
}
