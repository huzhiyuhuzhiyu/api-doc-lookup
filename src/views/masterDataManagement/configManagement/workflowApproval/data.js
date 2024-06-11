export const inspectionTypeList = [
  { label: 'b003', value: 'procure' },
  { label: 'b004', value: 'external' },
  { label: 'b008', value: 'produce' },
  { label: 'b006', value: 'sale_back' },
  { label: 'b007', value: 'back_material' },
  { label: 'b005', value: 'process' },
  { label: 'b022', value: 'finished' },
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
  { label: '挑选', value: 'select' }
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