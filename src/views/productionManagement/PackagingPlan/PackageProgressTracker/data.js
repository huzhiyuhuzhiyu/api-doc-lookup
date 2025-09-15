/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'export',
    permission: 'btn_export',
    exportType: '1018',
    exportName: '包装任务进度',
    tableRef: 'dataTable',
    disabled: false
  }
]

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "订单号",
      minWidth: 220,
      align: "left"
    },
    {
      prop: "orderType",
      label: "类型",
      minWidth: 120,
      slot: true,
      dictType: "orderType"
    },
    {
      prop: "arrivalDate",
      label: "来货日期",
      minWidth: 160
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "category",
      label: "类型",
      minWidth: 120,
      align: "left"
    },
    {
      prop: "customer",
      label: "客户",
      minWidth: 160,
      align: "left"
    },
    {
      prop: "factoryNo",
      label: "工号",
      minWidth: 120
    },
    {
      prop: "batchNo",
      label: "批次号",
      minWidth: 160
    },
    {
      prop: "arrivalQuantity",
      label: "来货数量",
      minWidth: 120
    },
    {
      prop: "isInspected",
      label: "是否已检",
      minWidth: 120
    },
    {
      prop: "actualInspectionDate",
      label: "实际检验日期",
      minWidth: 160
    },
    {
      prop: "qualifiedQuantity",
      label: "合格数",
      minWidth: 120
    },
    {
      prop: "temporaryUninspectedQuantity",
      label: "暂不检数",
      minWidth: 120
    },
    {
      prop: "unqualifiedQuantity",
      label: "不合格数",
      minWidth: 120
    },
    {
      prop: "typingDate",
      label: "打字日期",
      minWidth: 160
    },
    {
      prop: "typedQuantity",
      label: "已打字数量",
      minWidth: 120
    },
    {
      prop: "remainingUntypedQuantity",
      label: "剩余未打字数",
      minWidth: 140
    },
    {
      prop: "packagingDate",
      label: "包装日期",
      minWidth: 160
    },
    {
      prop: "packagedQuantity",
      label: "包装数量",
      minWidth: 120
    },
    {
      prop: "unpackagedQuantity",
      label: "未包装数量",
      minWidth: 120
    },
    {
      prop: "warehousingDate",
      label: "入库日期",
      minWidth: 160
    },
    {
      prop: "warehousedQuantity",
      label: "入库数量",
      minWidth: 120
    },
    {
      prop: "unwarehousedQuantity",
      label: "未入库数量",
      minWidth: 120
    },
    {
      prop: "remainingQualifiedQuantity",
      label: "合格品剩余数量",
      minWidth: 180
    }
  ]
}
