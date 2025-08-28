/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'drawConf',
    permission: 'btn_drawConf',
    icon: '',
    text: '图纸确认'
  }
]

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "purchaseOrderNo",
      label: "采购单号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "purchaser",
      label: "采购员",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "cooperativePartnerName",
      label: "供应商名称",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "cooperativePartnerCode",
      label: "供应商编码",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "cooperativePartnerPhone",
      label: "联系电话",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "cooperativePartnerFax",
      label: "传真",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "cooperativePartnerContacts",
      label: "联系人",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "cooperativePartnerMobilePhone",
      label: "手机",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "cooperativePartnerEmail",
      label: "电子邮箱",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "drawingNo",
      label: "型号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "productName",
      label: "名称",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "customerProductDrawingNo",
      label: "客户型号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "orderDate",
      label: "订单日期",
      value: "",
      type: "date",
      sm: 12,
      disabled: true,
    },
    {
      prop: "deliveryDate",
      label: "确认日期",
      value: "",
      type: "date",
      sm: 12,
      disabled: true,
    },
    {
      prop: "sizeReportFlag",
      label: "尺寸报告",
      value: "",
      type: 'switch',
      appearance: 'checkbox',
    },
    {
      prop: "heatTreatmentReportFlag",
      label: "热处理报告",
      value: "",
      type: 'switch',
      appearance: 'checkbox',
    },
    {
      prop: "materialReportFlag",
      label: "材料报告",
      value: "",
      type: 'switch',
      appearance: 'checkbox',
    },
    {
      prop: "paralympicReportFlag",
      label: "残奥报告",
      value: "",
      type: 'switch',
      appearance: 'checkbox',
    },
    {
      prop: "ultrasonicDetectionReportFlag",
      label: "超声波探伤报告",
      value: "",
      type: 'switch',
      appearance: 'checkbox',
    },
    {
      prop: "annealingSpectrumFlag",
      label: "退火图谱",
      value: "",
      type: 'switch',
      appearance: 'checkbox',
    },
    {
      prop: "quenchingPatternFlag",
      label: "淬火图谱",
      value: "",
      type: 'switch',
      appearance: 'checkbox',
    },
    {
      prop: "ppapFlag",
      label: "PPAP文件",
      value: "",
      type: 'switch',
      appearance: 'checkbox',
    },
    {
      prop: "paymentTerms",
      label: "付款条约",
      value: "",
      type: "textarea",
      sm: 24,
      disabled: true,
    },
    {
      prop: "qualityRequirements",
      label: "质量要求",
      value: "",
      type: "textarea",
      sm: 24,
      disabled: true,
    },
    {
      prop: "sealingCoverTyping",
      label: "打字要求",
      value: "",
      type: "textarea",
      sm: 24,
      disabled: true,
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
      sm: 24,
      disabled: true,
    },
  ]
}

export function getColumns() {
  return [
    // {
    //   prop: 'purchaseOrderNo',
    //   label: '采购单号',
    //   minWidth: 120,
    //   align: "left",
    // },
    {
      prop: 'purchaseOrderNo',
      label: '订单号',
      minWidth: 120,
      align: "left",
    },
    {
      prop: 'productName',
      label: '产品名称',
      minWidth: 220,
      align: "left",
    },
    {
      prop: 'productCode',
      label: '产品编码',
      minWidth: 220,
      align: "left",
    },
    {
      prop: 'drawingNo',
      label: '产品型号',
      minWidth: 220,
      align: "left",
    },
    {
      prop: 'customerProductDrawingNo',
      label: '客户产品型号',
      minWidth: 150,
      align: "left",
    },
    {
      prop: 'purchaseQuantity',
      label: '数量',
      minWidth: 120,
    },
    {
      prop: 'cooperativePartnerCode',
      label: '客户编码',
      minWidth: 120,
      align: "left",
    },
    {
      prop: 'cooperativePartnerName',
      label: '客户名称',
      minWidth: 120,
      align: "left",
    },
    {
      prop: 'orderDate',
      label: '下单日期',
      minWidth: 120,
    },
    {
      prop: 'deliveryDate',
      label: '确认日期',
      minWidth: 120,
    },
    {
      prop: 'status',
      label: '状态',
      minWidth: 180,
      slot: true,
      dictType: "drawConfStatus"
    },
    {
      prop: 'createTime',
      label: '创建时间',
      minWidth: 180
    },
  ]
}
