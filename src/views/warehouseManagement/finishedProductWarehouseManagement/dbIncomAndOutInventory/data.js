import global from '@/utils/global';

/**
 * @description 按钮权限列表
 */

export function getButtonList(type = 'default') {
  // 定义各业务类型的按钮权限配置
  const buttonConfig = {
    // 销售发货
    outbound_sale_send: [
      {
        buttonType: 'primary',
        type: 'outboundSaleSendConfirm',
        permission: 'btn_outbound_sale_send_confirm',
        icon: '',
        text: '确认'
      },
    ],
    // 销售退货
    inbound_sale_return: [],
    // 采购收货
    inbound_purchase: [],
    // 采购退货
    outbound_purchase: [],
    default: []
  };

  return buttonConfig[type] || buttonConfig.default;
}

export function getSearchList(type = 'default') {
  // 默认列配置
  const defaultSearch = [];

  // 定义各业务类型的列配置
  const searchConfig = {
    // 销售发货
    outbound_sale_send: [
      ...defaultSearch,
      {
        fieldValue: '',
        field: 'orderNo',
        label: '通知单号',
        prop: 'orderNo',
        symbol: 'like',
        searchType: 'input'
      },
      {
        fieldValue: '',
        field: 'partnerName',
        label: '客户名称',
        prop: 'partnerName',
        symbol: 'like',
        searchType: 'input'
      },
      {
        fieldValue: 'ready',
        field: 'deliveryStatus',
        label: '状态',
        prop: 'deliveryStatus',
        symbol: '==',
        searchType: 'select',
        options: global.shippingStatus
      },
    ],
    // 销售退货
    inbound_sale_return: [
      ...defaultSearch,
      {
        fieldValue: '',
        field: 'orderNo',
        label: '通知单号',
        prop: 'orderNo',
        symbol: 'like',
        searchType: 'input'
      },
      {
        fieldValue: '',
        field: 'partnerName',
        label: '客户名称',
        prop: 'partnerName',
        symbol: 'like',
        searchType: 'input'
      },
    ],
    // 成品拣货
    finished_product_picking_send: [
      ...defaultSearch,
      {
        fieldValue: '',
        field: 'orderNo',
        label: '通知单号',
        prop: 'orderNo',
        symbol: 'like',
        searchType: 'input'
      },
      {
        fieldValue: '',
        field: 'partnerName',
        label: '客户名称',
        prop: 'partnerName',
        symbol: 'like',
        searchType: 'input'
      },
      // {
      //   fieldValue: 'ready',
      //   field: 'deliveryStatus',
      //   label: '状态',
      //   prop: 'deliveryStatus',
      //   symbol: '==',
      //   searchType: 'select',
      //   options: global.shippingStatus
      // },
    ],
    // 采购收货
    inbound_purchase: [
      ...defaultSearch,
      {
        fieldValue: '',
        field: 'orderNo',
        label: '订单号',
        prop: 'orderNo',
        symbol: 'like',
        searchType: 'input'
      },
      {
        fieldValue: '',
        field: 'partnerName',
        label: '客户名称',
        prop: 'partnerName',
        symbol: 'like',
        searchType: 'input'
      },
    ],
    // 采购退货
    outbound_purchase: [
      ...defaultSearch,
      {
        fieldValue: '',
        field: 'orderNo',
        label: '通知单号',
        prop: 'orderNo',
        symbol: 'like',
        searchType: 'input'
      },
      {
        fieldValue: '',
        field: 'partnerName',
        label: '客户名称',
        prop: 'partnerName',
        symbol: 'like',
        searchType: 'input'
      },
    ],
    default: defaultSearch
  };

  return searchConfig[type] || searchConfig.default;
}

export function getColumns(type = 'default') {
  // 默认列配置
  const defaultColumns = [];
  const createColumns = [
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
      align: "center",
      sortable: 'custom',
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 140,
      align: "center",
    }
  ]

  // 定义各业务类型的列配置
  const columnsConfig = {
    // 外协收货入库
    outbound_pick_out: [
      {
        prop: "orderNo",
        label: "收货单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
        align: "left",
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "salesman",
        label: "操作员",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "deliverDate",
        label: "收货日期",
        minWidth: 120,
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: 220,
        align: "left",
      },
      ...createColumns
    ],

    // 销售发货出库
    outbound_sale_send: [
      ...defaultColumns,
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
        slot: true
      },
      {
        prop: "ordersNo",
        label: "来源单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
      },
      {
        prop: "partnerCode",
        label: "客户编码",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "partnerName",
        label: "客户名称",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "deliverDate",
        label: "发货日期",
        minWidth: 120,
      },
      {
        prop: "recipient",
        label: "收件人",
        minWidth: 120,
      },
      {
        prop: "phone",
        label: "收件人电话",
        minWidth: 120,
      },
      {
        prop: "deliveryCompletionDate",
        label: "完成日期",
        minWidth: 120,
      },
      {
        prop: "hairExchangeGoodsFlag",
        label: "发货标识",
        minWidth: 120,
        slot: true,
      },
      {
        prop: "logisticsCompany",
        label: "发货方式",
        minWidth: 120,
        slot: true,
        dictType: 'logisticsCompany'
      },
      {
        prop: "priority",
        label: "优先级",
        minWidth: 120,
        slot: true,
        dictType: 'shippingPriority'
      },
      {
        prop: "deliveryStatus",
        label: "状态",
        minWidth: 120,
        slot: true,
        dictType: 'shippingStatus'
      },
      ...createColumns,
    ],
    // 销售退货入库
    inbound_sale_return: [
      ...defaultColumns,
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
        slot: true
      },
      {
        prop: "ordersNo",
        label: "来源单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
      },
      {
        prop: "partnerCode",
        label: "客户编码",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "partnerName",
        label: "客户名称",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "deliverDate",
        label: "退货日期",
        minWidth: 120,
      },
      {
        prop: "retreatExchangeGoodsFlag",
        label: "退货标识",
        minWidth: 120,
        slot: true,
      },
      ...createColumns,
    ],

    // 成品拣货出库
    finished_product_picking_send: [
      ...defaultColumns,
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
        slot: true
      },
      {
        prop: "sourceOrderNo",
        label: "来源单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
      },
      {
        prop: "cooperativePartnerCode",
        label: "客户编码",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "cooperativePartnerName",
        label: "客户名称",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "warehouseName",
        label: "仓库",
        minWidth: 160,
      },
      {
        prop: "shelfSpaceName",
        label: "库位",
        minWidth: 120,
      },
      {
        prop: "deliverDate",
        label: "预定日期",
        minWidth: 120,
      },
      // {
      //   prop: "abv",
      //   label: "完成日期",
      //   minWidth: 120,
      // },
      {
        prop: "priority",
        label: "优先级",
        minWidth: 120,
        slot: true,
        dictType: 'shippingPriority'
      },
      // {
      //   prop: "deliveryStatus",
      //   label: "状态",
      //   minWidth: 120,
      //   slot: true,
      //   dictType: 'shippingStatus'
      // },
      ...createColumns,
    ],

    // 采购收货入库
    inbound_purchase: [
      {
        prop: "orderNo",
        label: "订单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
        slot: true
      },
      {
        prop: "cooperativePartnerCode",
        label: "供应商编码",
        minWidth: 220,
        align: "left",
      },
      {
        prop: "cooperativePartnerName",
        label: "供应商名称",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "deliveryDate",
        label: "交货日期",
        minWidth: 120,
      },
      ...createColumns
    ],
    // 采购退货出库
    outbound_purchase: [
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
        align: "left",
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "salesman",
        label: "操作员",
        minWidth: 180,
        align: "left",
      },
      {
        prop: 'productName',
        label: '产品名称',
        minWidth: 220,
        sortable: 'custom',
        align: "left",
      },
      {
        prop: 'productCode',
        label: '产品编码',
        minWidth: 220,
        sortable: 'custom',
        align: "left",
      },
      {
        prop: 'drawingNo',
        label: '产品型号',
        minWidth: 220,
        sortable: 'custom',
        align: "left",
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: 220,
        align: "left",
      },
      ...createColumns
    ],

    // 外协发料出库
    outbound_external_send: [
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
        align: "left",
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "recipient",
        label: "收件人",
        minWidth: 120,
      },
      {
        prop: "phone",
        label: "收件人电话",
        minWidth: 120,
      },
      {
        prop: "logisticsCompany",
        label: "发料方式",
        minWidth: 120,
        slot: true,
        dictType: 'logisticsCompany'
      },
      ...createColumns
    ],
    // 外协退料入库
    inbound_external_return: [
      {
        prop: "orderNo",
        label: "单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
        align: "left",
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "deliverDate",
        label: "退料日期",
        minWidth: 120,
      },
      ...createColumns
    ],

    // 外协收货入库
    inbound_external: [
      {
        prop: "orderNo",
        label: "收货单号",
        minWidth: 220,
        align: "left",
        sortable: 'custom',
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
        align: "left",
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "salesman",
        label: "操作员",
        minWidth: 180,
        align: "left",
      },
      {
        prop: "deliverDate",
        label: "收货日期",
        minWidth: 120,
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: 220,
        align: "left",
      },
      ...createColumns
    ],
    // 外协退货出库
    outbound_external: [
      {
        prop: 'orderNo',
        label: '通知单号',
        minWidth: 180,
        sortable: 'custom',
        slot: true
      },
      {
        prop: 'partnerName',
        label: '外协供应商名称',
        minWidth: 160,
        sortable: 'custom'
      },
      {
        prop: 'partnerCode',
        label: '供应商编码',
        minWidth: 120,
        sortable: 'custom'
      },
      {
        prop: 'deliverDate',
        label: '退货日期',
        minWidth: 160,
        sortable: 'custom'
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: 220,
        align: "left",
      },
      ...createColumns
    ],

    default: defaultColumns
  };

  return columnsConfig[type] || columnsConfig.default;
}
