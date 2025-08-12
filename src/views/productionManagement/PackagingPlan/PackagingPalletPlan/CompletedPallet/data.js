/**
 * @description 按钮权限列表
 */
export const buttonList = []

// 表格列配置
export function getColumns() {
  return [
    {
      prop: "productsDrawingNo",
      label: "型号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "productsName",
      label: "产品名称",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "singleWeight",
      label: "产品单重（KG）",
      minWidth: 260,
      sortable: 'custom',
    },
    // {
    //   prop: "customer",
    //   label: "客户",
    //   minWidth: 150,
    //   sortable: 'custom',
    //   align: "left"
    // },
    {
      prop: "batchNumber",
      label: "批次",
      minWidth: 100,
      sortable: 'custom'
    },
    {
      prop: "packagingMethod",
      label: "包装方式",
      minWidth: 100,
      slot: true,
      dictType: 'packaging'
    },
    {
      prop: "num",
      label: "数量/箱",
      minWidth: 160,
      sortable: 'custom'
    }
  ]
}
