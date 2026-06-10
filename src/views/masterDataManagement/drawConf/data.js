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
];

/** 产品通用字段 */
const COMMON_PRODUCT_FIELDS = [
  { prop: 'drawingNo', label: '型号', type: 'input', /* disabled: true, */ disabled: false },
  { prop: 'productName', label: '名称', type: 'input', /* disabled: true, */ disabled: false },
  { prop: 'customerProductDrawingNo', label: '客户型号', type: 'input', /* disabled: true, */ disabled: false }
];

/** 报告类开关字段 */
const REPORT_FIELDS = [
  { prop: 'sizeReportFlag', label: '尺寸报告', type: 'switch', appearance: 'checkbox' },
  { prop: 'heatTreatmentReportFlag', label: '热处理报告', type: 'switch', appearance: 'checkbox' },
  { prop: 'materialReportFlag', label: '材料报告', type: 'switch', appearance: 'checkbox' },
  { prop: 'paralympicReportFlag', label: '残奥报告', type: 'switch', appearance: 'checkbox' },
  { prop: 'ultrasonicDetectionReportFlag', label: '超声波探伤报告', type: 'switch', appearance: 'checkbox' },
  { prop: 'annealingSpectrumFlag', label: '退火图谱', type: 'switch', appearance: 'checkbox' },
  { prop: 'quenchingPatternFlag', label: '淬火图谱', type: 'switch', appearance: 'checkbox' },
  { prop: 'ppapFlag', label: 'PPAP文件', type: 'switch', appearance: 'checkbox' }
];

/** 获取日期字段（根据类型动态 label） */
function getDateFields(type) {
  return [
    {
      prop: 'orderDate',
      label: type === 'purchase' ? '订单日期' : '计划开始日期',
      type: 'date',
      sm: 12,
      // disabled: true,
      disabled: false
    },
    { prop: 'confirmDate', label: '确认日期', type: 'date', sm: 12, /* disabled: true, */ disabled: false }
  ];
}

/** 获取合作方表单字段（供应商/客户） */
function getPartnerFormFields(role) {
  const isSupplier = role === 'supplier';
  return [
    { prop: 'cooperativePartnerName', label: isSupplier ? '供应商名称' : '客户名称', type: 'input', /* disabled: true, */ disabled: false },
    { prop: 'cooperativePartnerCode', label: isSupplier ? '供应商编码' : '客户编码', type: 'input', /* disabled: true, */ disabled: false }
  ];
}

/** 获取合作方表格列 */
function getPartnerColumns(role) {
  const isSupplier = role === 'supplier';
  return [
    { prop: 'cooperativePartnerCode', label: isSupplier ? '供应商编码' : '客户编码', minWidth: 180 },
    { prop: 'cooperativePartnerName', label: isSupplier ? '供应商名称' : '客户名称', minWidth: 180 }
  ];
}

const TYPE_CONFIG = {
  purchase: {
    role: 'supplier',
    orderProp: 'purchaseOrderNo',
    orderLabel: '采购单号',
    quantityProp: 'purchaseQuantity',
    quantityLabel: '数量',
    extraFormFields: [
      { prop: 'purchaser', label: '采购员', type: 'input', /* disabled: true, */ disabled: false },
      { prop: 'cooperativePartnerPhone', label: '联系电话', type: 'input', /* disabled: true, */ disabled: false },
      { prop: 'cooperativePartnerFax', label: '传真', type: 'input', /* disabled: true, */ disabled: false },
      { prop: 'cooperativePartnerContacts', label: '联系人', type: 'input', /* disabled: true, */ disabled: false },
      { prop: 'cooperativePartnerMobilePhone', label: '手机', type: 'input', /* disabled: true, */ disabled: false },
      { prop: 'cooperativePartnerEmail', label: '电子邮箱', type: 'input', /* disabled: true, */ disabled: false },
      { prop: 'paymentTerms', label: '付款条约', type: 'textarea', sm: 24, /* disabled: true, */ disabled: false },
      { prop: 'qualityRequirements', label: '质量要求', type: 'textarea', sm: 24, /* disabled: true, */ disabled: false },
      { prop: 'sealingCoverTyping', label: '打字要求', type: 'textarea', sm: 24, /* disabled: true, */ disabled: false }
    ],
    extraColumns: []
  },
  produce: {
    role: 'customer',
    orderProp: 'productionOrderNo',
    orderLabel: '生产任务单号',
    quantityProp: 'productionQuantity',
    quantityLabel: '数量',
    extraFormFields: [
      { prop: 'routingName', label: '工艺路线名称', type: 'input', /* disabled: true, */ disabled: false },
      { prop: 'productionLineName', label: '产线', type: 'input', /* disabled: true, */ disabled: false }
    ],
    extraColumns: [
      { prop: 'routingName', label: '工艺路线名称', minWidth: 180 },
      { prop: 'productionLineName', label: '产线', minWidth: 150 }
    ]
  }
};

/**
 * @description 获取表单字段配置
 * @param {Object} dataFormRef - 表单引用
 * @param {{ type?: 'purchase' | 'produce' }} context
 * @returns {Array}
 */
export function getBasicFormSchema(dataFormRef, context) {
  const { type = 'purchase' } = context;
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.purchase;

  return [
    { prop: config.orderProp, label: config.orderLabel, type: 'input', /* disabled: true, */ disabled: false },
    ...getPartnerFormFields(config.role),
    ...COMMON_PRODUCT_FIELDS,
    ...(config.extraFormFields || []),
    ...getDateFields(type),
    ...REPORT_FIELDS,
    { prop: 'remark', label: '备注', type: 'textarea', sm: 24, /* disabled: true, */ disabled: false }
  ];
}

/**
 * 获取表格列配置
 * @param {string} type - 'purchase' | 'produce'
 * @returns {Array}
 */
export function getColumns(type = 'purchase') {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.purchase;

  return [
    { prop: config.orderProp, label: config.orderLabel, minWidth: 180 },
    { prop: 'productName', label: '产品名称', minWidth: 220 },
    { prop: 'productCode', label: '产品编码', minWidth: 220 },
    { prop: 'drawingNo', label: '型号', minWidth: 220 },
    { prop: 'customerProductDrawingNo', label: '客户产品型号', minWidth: 230 },
    { prop: config.quantityProp, label: config.quantityLabel, minWidth: 120 },
    ...getPartnerColumns(config.role),
    { prop: 'orderDate', label: type === 'purchase' ? '下单日期' : '计划开始日期', minWidth: 120 },
    ...(config.extraColumns || []),
    { prop: 'status', label: '状态', minWidth: 180, slot: true, dictType: 'drawConfStatus' },
    { prop: 'createTime', label: '创建时间', minWidth: 180 },
  ];
}
