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
      prop: "type",
      label: "类型",
      minWidth: 120,
      sortable: "custom",
      align: "left"
    },
    {
      prop: "arrivalDate",
      label: "来货日期",
      minWidth: 160,
      sortable: "custom"
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 150,
      align: "left",
      sortable: "custom",
    },
    {
      prop: "orderNo",
      label: "订单号",
      minWidth: 160,
      sortable: "custom",
      align: "left"
    },
    {
      prop: "category",
      label: "类型",
      minWidth: 120,
      sortable: "custom",
      align: "left"
    },
    {
      prop: "customer",
      label: "客户",
      minWidth: 160,
      sortable: "custom",
      align: "left"
    },
    {
      prop: "factoryNo",
      label: "工号",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "batchNo",
      label: "批次号",
      minWidth: 160,
      sortable: "custom"
    },
    {
      prop: "arrivalQuantity",
      label: "来货数量",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "isInspected",
      label: "是否已检",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "actualInspectionDate",
      label: "实际检验日期",
      minWidth: 160,
      sortable: "custom"
    },
    {
      prop: "qualifiedQuantity",
      label: "合格数",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "temporaryUninspectedQuantity",
      label: "暂不检数",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "unqualifiedQuantity",
      label: "不合格数",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "typingDate",
      label: "打字日期",
      minWidth: 160,
      sortable: "custom"
    },
    {
      prop: "typedQuantity",
      label: "已打字数量",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "remainingUntypedQuantity",
      label: "剩余未打字数",
      minWidth: 140,
      sortable: "custom"
    },
    {
      prop: "packagingDate",
      label: "包装日期",
      minWidth: 160,
      sortable: "custom"
    },
    {
      prop: "packagedQuantity",
      label: "包装数量",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "unpackagedQuantity",
      label: "未包装数量",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "warehousingDate",
      label: "入库日期",
      minWidth: 160,
      sortable: "custom"
    },
    {
      prop: "warehousedQuantity",
      label: "入库数量",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "unwarehousedQuantity",
      label: "未入库数量",
      minWidth: 120,
      sortable: "custom"
    },
    {
      prop: "remainingQualifiedQuantity",
      label: "合格品剩余数量",
      minWidth: 180,
      sortable: "custom"
    }
  ]
}
