/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'quickCreate',
    permission: 'btn_quickCreate',
    icon: 'el-icon-plus',
    text: '快速创建'
  },
  {
    buttonType: 'primary',
    type: 'transferCardPrint',
    permission: 'btn_transferCard_print',
    icon: 'el-icon-print',
    text: '流转卡打印'
  }
]

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "检验单号",
      minWidth: 180,
      slot: true
    },
    {
      prop: "docNo",
      label: "业务单号",
      minWidth: 180,
    },
    {
      prop: "inspectorName",
      label: "检验人",
      minWidth: 120,
    },
    {
      prop: "inspectionDate",
      label: "检验日期",
      minWidth: 140,
    },
    {
      prop: 'productCode',
      label: '产品编码',
      minWidth: 180,
    },
    {
      prop: 'productName',
      label: '产品名称',
      minWidth: 180,
    },
    {
      prop: 'productDrawingNo',
      label: '型号',
      minWidth: 180,
    },
    {
      prop: 'productCategoryName',
      label: '产品分类',
      minWidth: 150,
    },
    {
      prop: 'mainUnit',
      label: '单位',
      minWidth: 90,
    },
    {
      prop: 'waitSplitQuantity',
      label: '可返工数量',
      minWidth: 160,
    },
    {
      prop: 'inspectionQuantity',
      label: '报检数量',
      minWidth: 120,
    },
    {
      prop: 'inspectionMethod',
      label: '检验方式',
      minWidth: 120,
      slot: true,
      dictType: 'inspectionMethod'
    },
    {
      prop: 'samplingQuantity',
      label: '检验数量',
      minWidth: 120,
    },
    {
      prop: 'inspectionResults',
      label: '检验结果',
      minWidth: 120,
      slot: true,
      dictType: 'inspectionResultsType'
    },
    {
      prop: 'unqualifiedQuantity',
      label: '不合格数量',
      minWidth: 140,
    },
    {
      prop: 'responsibilityWasteQuantity',
      label: '责废数量',
      minWidth: 140,
    },
    {
      prop: 'materialWasteQuantity',
      label: '料废数量',
      minWidth: 140,
    },
    {
      prop: 'reworkQuantity',
      label: '返工数量',
      minWidth: 140,
    },
    {
      prop: 'lossQuantity',
      label: '散失数量',
      minWidth: 140,
    },
    {
      prop: 'processingStatus',
      label: '处理状态',
      minWidth: 120,
      slot: true,
      dictType: 'processingStatusType'
    },
    {
      prop: 'status',
      label: '检验确认状态',
      minWidth: 160,
      slot: true,
      dictType: 'workReportInspection'
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
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
