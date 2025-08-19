/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'support',
    permission: 'btn_support',
    icon: '',
    text: '装托'
  },
]

// 整批表格列配置
export function getBatchColumns() {
  return [
    {
      prop: "productsDrawingNo",
      label: "型号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
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
      dictType: 'packaging',
      sortable: "custom",
    },
    {
      prop: "boxNum",
      label: "箱数",
      minWidth: 90,
      sortable: 'custom'
    },
    {
      prop: "num",
      label: "数量/箱",
      minWidth: 160,
      sortable: 'custom'
    },
    {
      prop: "totalNum",
      label: "总数量",
      minWidth: 90,
      sortable: 'custom'
    },
    {
      prop: "totalGrossWeight",
      label: "总毛重",
      minWidth: 90,
      sortable: 'custom',
    },
    {
      prop: "full",
      label: "整箱",
      minWidth: 90,
      slot: true,
      dictType: 'booleanOptions',
      sortable: "custom",
    }
  ]
}

// 单箱表格列配置
export function getSingleBoxColumns() {
  return [
    {
      prop: "productsDrawingNo",
      label: "型号",
      minWidth: 220,
      sortable: 'custom',
      align: "left",
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
      sortable: 'custom',
    },
    {
      prop: "packagingMethod",
      label: "包装方式",
      minWidth: 100,
      slot: true,
      dictType: 'packaging',
      sortable: "custom",
    },
    {
      prop: "singleWeight",
      label: "重量(KG)",
      minWidth: 120,
      sortable: 'custom',
    },
    {
      prop: "num",
      label: "数量",
      minWidth: 90,
      sortable: 'custom',
    },
    {
      prop: "full",
      label: "整箱",
      minWidth: 90,
      slot: true,
      dictType: 'booleanOptions',
      sortable: "custom",
    }
  ]
}
