export const inspectionTypeList = [
  { label: '采购收货', value: 'procure' },
  { label: '外协收货', value: 'external' },
  { label: '生产退料', value: 'produce' },
  { label: '销售退货', value: 'sale_back' },
  { label: '外协退料', value: 'back_material' },
  { label: '生产巡检', value: 'process' },
  { label: '生产成品', value: 'finished' },
  { label: '包装报工', value: 'work_report' },
  { label: '库存重检', value: 'library' }
]
export const documentStatusList = [
  { label: "草稿", value: "draft" },
  { label: "提交", value: "submit" }
]
export const approvalStatusList = [
  { label: "审批中", value: "ing" },
  { label: "审批通过", value: "ok" },
  { label: "审批拒绝", value: "rebut" }
]
export const inspectionResultsList = [
  { label: '合格', value: 'qualified' },
  { label: '不合格', value: 'unqualified' },
  { label: '让步接收', value: 'concessive_acceptance' },
  { label: '报废', value: 'discard' },
  { label: '挑选', value: 'select' },
  { label: '返工返修', value: 'repair' },
  { label: '报废和返修', value: 'discard_repair' },
]
export const inspectionMethodList = [
  { label: "免检", value: "exempt" },
  { label: "抽检", value: "spot_check" },
  { label: "全检", value: "all" }
]

export default {
  inspectionTypeList,
  documentStatusList,
  approvalStatusList,
  inspectionResultsList,
  inspectionMethodList
}
