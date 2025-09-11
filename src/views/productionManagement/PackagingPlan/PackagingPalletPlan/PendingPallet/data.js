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
      align: "left",
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
      prop: "boxNum",
      label: "箱数",
      minWidth: 90
    },
    {
      prop: "num",
      label: "数量/箱",
      minWidth: 160
    },
    {
      prop: "totalNum",
      label: "总数量",
      minWidth: 90
    },
    {
      prop: "totalGrossWeight",
      label: "总毛重",
      minWidth: 90,
    },
    {
      prop: "full",
      label: "整箱",
      minWidth: 90,
      slot: true,
      dictType: 'booleanOptions'
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
      align: "left",
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
      minWidth: 100,
    },
    {
      prop: "packagingMethod",
      label: "包装方式",
      minWidth: 120,
      slot: true,
      dictType: 'packaging'
    },
    {
      prop: "singleWeight",
      label: "重量(KG)",
      minWidth: 120,
    },
    {
      prop: "num",
      label: "数量",
      minWidth: 90,
    },
    {
      prop: "full",
      label: "整箱",
      minWidth: 90,
      slot: true,
      dictType: 'booleanOptions'
    }
  ]
}
