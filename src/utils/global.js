// 全局常量配置
import moment from 'moment'
import store from '@/store'

const global = {
  // 单据状态
  documentStatusList: [
    { label: '草稿', value: 'draft', type: 'warning' },
    { label: '提交', value: 'submit', type: 'success' },
    { label: '撤回', value: 'back', type: "danger" },
    { label: '关单', value: 'close', type: "danger" },
  ],

  // 审批状态
  approvalStateList: [
    { label: "审批中", value: "ing", type: "processing" },
    { label: "审批通过", value: "ok", type: "success" },
    { label: "审批拒绝", value: "rebut", type: "danger" },
    { label: "审批撤回", value: "withdrawn", type: "warning" }
  ],

  // 布尔值选项
  booleanOptions: [
    { label: "是", value: true },
    { label: "否", value: false },
  ],

  currencyType: [
    { label: "美元", value: "USD" },
    { label: "欧元", value: "EUR" },
    { label: "英镑", value: "GBP" },
    { label: "日元", value: "JPY" },
    { label: "人民币", value: "CNY" },
    { label: "德克", value: "DEM" },
    { label: "瑞士法郎", value: "CHF" },
    { label: "法国法郎", value: "FRF" },
    { label: "意大利里拉", value: "ITL" },
    { label: "荷兰盾", value: "NLG" },
    { label: "比利时法郎", value: "BEU" },
    { label: "丹麦克朗", value: "DKR" },
    { label: "瑞典克朗", value: "SKR" },
    { label: "挪威克朗", value: "NKR" },
    { label: "利先令", value: "ATS" },
    { label: "港币", value: "HKD" },
    { label: "加拿大元", value: "CAD" },
    { label: "澳大利亚元", value: "AUD" },
    { label: "新西兰元", value: "NZD" },
    { label: "新加坡元", value: "SGD" },
  ],

  // 公共状态 示例：未完成 已完成 已取消
  publicState: [
    { label: "确认", value: "confirm", type: "success" },
    { label: "未完成", value: "not_finished", type: "processing" },
    { label: "已完成", value: "finished", type: "success" },
    { label: "已取消", value: "canceled", type: "danger" },
    { label: "已停止", value: "stopped", type: "danger" },
    { label: "已撤回", value: "back", type: "warning" },
  ],

  // 产品来源
  productSource: [
    { label: "组装", value: "assemble", type: "processing" },
    { label: "生产", value: "produce", type: "success" },
    { label: "采购", value: "purchase", type: "danger" },
    { label: "外协", value: "out", type: "danger" },
    { label: "虚拟组装", value: "virtual_assemble", type: "processing" },
  ],

  // 产品类型
  productClassType: [
    { label: '钢管', value: 'steel_pipe' },
    { label: '包装物', value: 'packaging' },
    { label: '内圈毛坯', value: 'inner_ring_blank' },
    { label: '外圈毛坯', value: 'outer_ring_blank' },
    { label: '内圈', value: 'inner_ring' },
    { label: '外圈', value: 'outer_ring' },
    { label: '磨料', value: 'abrasive' },
    { label: '油料', value: 'oil' },
    { label: '配件', value: 'accessory' },
    { label: '周转箱', value: 'turnover_box' },
    { label: '保持架', value: 'holder' },
    { label: '密封盖', value: 'sealing_cap' },
    { label: '密封盖', value: 'sealing_cap' },
    { label: '锻车件', value: 'forged_turning_parts' },
    { label: '消耗品', value: 'consumables' },
    { label: '机器设备', value: 'machinery_equipment' },
  ],

  // 工艺类型
  craftType: [
    { label: '生产', value: 'production', },
    { label: '包装', value: 'packaging', }
  ],

  // 工艺类型
  processType: [
    { label: '正常工序', value: 'normal' },
    { label: '抽检工序', value: 'random' },
    { label: '全检工序', value: 'full' },
    { label: '打字工序', value: 'typing' },
    { label: '包装工序', value: 'packing' },
  ],

  // 销售订单状态
  salesOrderState: [
    { label: '草稿', value: 'draft', type: 'warning' },
    { label: '进行中', value: 'normal', type: 'warning' },
    { label: '暂停', value: 'suspend', type: 'danger' },
    { label: '关闭', value: 'closed', type: 'danger' },
    { label: '未完成', value: 'not_finish', type: 'info' },
    { label: '部分完成', value: 'part_finish', type: 'info' },
    { label: '已完成', value: 'finish', type: 'success' },
    { label: '已停止', value: 'stopped', type: 'danger' },
  ],

  // 销售订单类型
  salesOrderType: [
    { label: '客户订单', value: 'normal', type: 'warning' },
    { label: '预测订单', value: 'prediction', type: 'success' }
  ],

  returnIndication: [
    { label: '退货', value: false, type: 'info' },
    { label: '换货', value: true, type: 'info' }
  ],

  // 发货优先级
  shippingPriority: [
    { label: '高', value: 1, type: 'danger' },
    { label: '中', value: 2, type: 'warning' },
    { label: '低', value: 3, type: 'success' }
  ],

  // 销售订单行确认状态
  orderConfirmedStatus: [
    { label: '已有库存', value: 'existing_inventory' },
    { label: '无需采购', value: 'no_need_purchase' },
    { label: '需要采购', value: 'need_purchase' },
    { label: '无需生产', value: 'no_need_produce' },
    { label: '需要生产', value: 'need_produce' },
  ],

  // 交期状态
  deliveryStatus: [
    { label: '待回复', value: 'pending_reply', type: 'warning' },
    { label: '已回复', value: 'replied', type: 'info' },
    { label: '已完成', value: 'finished', type: 'success' },
  ],

  // 状态
  shippingStatus: [
    { label: '等待', value: 'waiting', type: 'warning' },
    { label: '就绪', value: 'ready', type: 'primary' },
    { label: '已安排', value: 'arranged', type: 'success' },
    { label: '已拣货', value: 'picked', type: 'primary' },
    { label: '已核对', value: 'verified', type: 'primary' },
    { label: '未确认', value: 'not_confirm', type: 'danger' },
    { label: '已确认', value: 'confirmed', type: 'success' },
    { label: "未完成", value: "not_finished", type: "danger" },
    { label: '已完成', value: 'finished', type: 'success' },
    { label: '已取消', value: 'canceled', type: 'danger' }
  ],

  // 图纸确认状态
  drawConfStatus: [
    { label: '按上次已确认的图纸', value: 'last_confirmed', type: 'warning' },
    { label: '已确认', value: 'confirmed', type: 'success' },
  ],

  // 报价状态
  quotationStatus: [
    { label: '已反馈', value: 'feedback_received', type: 'primary' },
    { label: '完成', value: 'finished', type: 'success' },
    { label: '未提交', value: 'not_submit', type: 'danger' },
    { label: '待反馈', value: 'pending_feedback', type: 'warning' },
  ],

  // 报价类型
  quotationType: [
    { label: '采购报价', value: 'purchase_quotation', type: 'primary' },
    { label: '直接报价', value: 'directly_quotation', type: 'success' },
  ],

  // 编排任务方式
  taskMethodStatus: [
    { label: '指定加工对象', value: 'appoint', type: 'warning' },
    { label: '不指定加工对象', value: 'not_appoint', type: 'info' },
  ],

  // 加工类型
  processingType: [
    { label: '自制', value: 'self_produced', type: 'info' },
    { label: '外协', value: 'external_production', type: 'info' },
  ],

  // 包装物料用于类型
  packagingType: [
    { label: '包装管理', value: 'packing_manage', type: 'info' },
    { label: '仓库管理', value: 'warehouse_manage', type: 'info' },
  ],

  // 不良类型
  defectType: [
    { label: '责废', value: 'responsibility_fee', type: 'danger' },
    { label: '料废', value: 'material_fee', type: 'warning' },
    { label: '来料', value: 'incoming', type: 'info' },
    { label: '返工', value: 'rework', type: 'warning' },
  ],

  // 检验状态
  workReportInspection: [
    { label: '待确认', value: 'wait_confirmed', type: 'warning' },
    { label: '完成', value: 'confirmed', type: 'success' },
  ],

  // 检验方式
  inspectionMethod: [
    { label: '全检', value: 'all', type: 'primary' },
    { label: '抽检', value: 'spot_check', type: 'warning' },
    { label: '免检', value: 'exempt', type: 'success' }
  ],

  // 检验结果
  inspectionResultsType: [
    { label: '合格', value: 'qualified', type: 'success' },
    { label: '不合格', value: 'unqualified', type: 'danger' },
    { label: '全检', value: 'full_inspection', type: 'info' },
    { label: '退货', value: 'back', type: 'warning' },
  ],

  // 检验 处理状态
  processingStatusType: [
    { label: '未处理', value: 'untreated', type: 'info' },
    { label: '处理中', value: 'processing', type: 'warning' },
    { label: '已处理', value: 'processed', type: 'success' },
  ],

  // 处理方式
  treatmentResults: [
    { label: '合格', value: 'qualified', type: 'success' },
    { label: '不合格', value: 'unqualified', type: 'danger' },
    { label: '让步接收', value: 'concessive_acceptance', type: 'warning' },
    { label: '报废', value: 'discard', type: 'info' },
    { label: '返工返修', value: 'repair', type: 'primary' },
    { label: '报废和返修', value: 'discard_repair', type: 'danger' },
    { label: '退货', value: 'back', type: 'danger' },
  ],

  // 类型
  inspectionSource: [
    { label: '正常', value: 'normal', type: 'primary' },
    { label: '包装', value: 'packaging', type: 'success' },
    { label: '退货重检', value: 'return_inspection', type: 'warning' },
    { label: '在库重检', value: 'stock_inspection', type: 'info' },
  ],

// 任务类型
  orderType: [
    { label: '正常任务', value: 'normal', type: 'warning' },
    { label: '返工任务', value: 'rework', type: 'info' },
    { label: '翻库任务', value: 'flipping', type: 'success' },
    { label: '新建任务', value: 'manually', type: 'primary' },
    { label: '换包装任务', value: 'change_packaging', type: 'danger' },
    { label: '包装任务', value: 'packaging', type: 'success' },
  ],
  // 任务状态
  orderStatus: [
    { label: '已完成', value: 'finish', type: 'success' },
    { label: '进行中', value: 'normal', type: 'warning' },
    { label: '已暂停', value: 'suspend', type: 'info' },
    { label: '已关单', value: 'closed', type: 'danger' },
    { label: '强制中止', value: 'force_abort', type: 'danger' },
    { label: '外协中', value: 'outsourced', type: 'primary' },
    { label: '采购中', value: 'procurement', type: 'primary' },
    { label: '撤回', value: 'back', type: 'info' },
  ],

  // 银行维护类型
  bankMaintenanceType: [
    { label: '银行存款', value: 'bank_deposit' },
    { label: '应收票据', value: 'notes_receivable' },
    { label: '应付票据', value: 'notes_payable' },
    { label: '库存现金', value: 'cash_on_hand' },
    { label: '保证金', value: 'cash_deposit' },
  ],

  // 付款方式
  paymentMethodType: [
    { label: '转账', value: 'transfer_accounts' },
    { label: '汇票', value: 'draft' },
  ],

  // 来源类型
  sourceType: [
    { label: '订单', value: 'order', type: 'primary' },
    { label: '通知单', value: 'notice', type: 'success' },
    { label: '直接出入库', value: 'direct', type: 'warning' },
    { label: '其他', value: 'io_other', type: 'info' },
    { label: '复制', value: 'copy', type: 'info' },
  ],

  // 指标目标比较符
  targetComparatorList: [
    { label: "大于", value: "gt", type: "primary" },
    { label: "小于", value: "lt", type: "warning" },
    { label: "小于等于", value: "le", type: "warning" },
    { label: "大于等于", value: "ge", type: "primary" }
  ],
  targetColorList: [
    { label: "绿色", value: "green", type: "success" },
    { label: "黄色", value: "yellow", type: "warning" },
    { label: "红色", value: "red", type: "danger" }
  ],
  // 字典数据映射方法
  getDictLabelGlobal(dictType, enCode, options = {}) {
    // 先从本地获取字典
    let targetList = this[dictType]

    // 本地不存在字典时，从store获取
    if (!Array.isArray(targetList)) {
      try {
        const data = store.getters.dictionaryMap[dictType][enCode]
        return data || this.handleFallback(enCode, options);
      } catch ( e ) {
        return this.handleFallback(enCode, options)
      }
    }

    // 空值处理逻辑
    if (enCode == null || enCode === '') {
      return options.withType ? { label: '', type: '' } : '--';
    }

    // 精确匹配字典项
    const matchedItem = targetList.find(item =>
      String(item.value) === String(enCode)
    );

    // 返回匹配结果或兜底数据
    return matchedItem
      ? this.formatResult(matchedItem, options)
      : this.handleFallback(enCode, options);
  },

  // 统一处理兜底数据
  handleFallback(enCode, options) {
    return options.withType
      ? { label: enCode || '--', type: 'default' }
      : enCode || '--';
  },

  // 统一格式化成功结果
  formatResult(item, options) {
    return options.withType
      ? { label: item.label, type: item.type }
      : item.label;
  },
  timePicker: { // 日期/时间选择器通用选项（禁用未发生的时间）
    // disabledDate(time) {
    //   return time.getTime() > Date.now();
    // },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '三天前',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
        picker.$emit('pick', date);
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    }]
  },
  timePickerOptionsArr: { // 日期/时间区间选择器通用选项）

    shortcuts: [{ // 调用时使用 global.timePickerOptions.shortcuts 不设置日期/时间选择限制
      text: '近3天',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 3)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '近7天',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '近30天',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },]
  },
  timePickerOptions: { // 日期/时间区间选择器通用选项（禁用未发生的日期）
    // disabledDate(time) {
    //   const currentDate = new Date();
    //   const selectedDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    //   return selectedDate.getTime() > currentDate.getTime()
    // },
    shortcuts: [{ // 调用时使用 global.timePickerOptions.shortcuts 不设置日期/时间选择限制
      text: '最近一周',
      onClick(picker) {
        const start = moment().subtract(6, 'days').startOf('day');
        const end = moment().endOf('day');
        picker.$emit('pick', [start.toDate(), end.toDate()]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const start = moment().subtract(30, 'days').startOf('day');
        const end = moment().endOf('day');
        picker.$emit('pick', [start.toDate(), end.toDate()]);
      }
    }, {
      text: '上个月',
      onClick(picker) {
        const start = moment().subtract(1, 'months').startOf('month');
        const end = moment().subtract(1, 'months').endOf('month');
        picker.$emit('pick', [start.toDate(), end.toDate()]);
      }
    }]
  },
}

export default global
