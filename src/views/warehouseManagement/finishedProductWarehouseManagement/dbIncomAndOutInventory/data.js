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
      {
        buttonType: 'primary',
        type: 'print',
        permission: 'btn_print',
        icon: 'el-icon-printer',
        text: '打印'
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
  const defaultSearch = [
    {
      prop: 'orderNo',
      symbol: 'like',
    },
  ];

  // 定义各业务类型的列配置
  const searchConfig = {
    // 生产领料出库
    outbound_pick_out: [
      ...defaultSearch,
      {
        prop: 'productionOrderNo',
        symbol: 'like',
      }
    ],
    // 生产产品入库
    inbound_order_production: [
      ...defaultSearch,
    ],
    // 销售发货
    outbound_sale_send: [
      ...defaultSearch,
      {
        prop: 'partnerName',
        symbol: 'like',
      },
      {
        prop: 'deliveryStatus',
        symbol: '==',
      },
    ],
    // 销售退货
    inbound_sale_return: [
      ...defaultSearch,
      {
        prop: 'partnerName',
        symbol: 'like',
      },
    ],
    // 成品拣货
    finished_product_picking_send: [
      ...defaultSearch,
      {
        prop: 'partnerName',
        symbol: 'like',
      },
    ],
    // 成品包装
    inbound_finished_package: [
      ...defaultSearch,
    ],
    // 采购收货
    inbound_purchase: [
      ...defaultSearch,
      {
        prop: 'partnerName',
        symbol: 'like',
      },
    ],
    // 采购退货
    outbound_purchase: [
      ...defaultSearch,
      {
        prop: 'partnerName',
        symbol: 'like',
      },
    ],
    default: defaultSearch
  };

  return searchConfig[type] || searchConfig.default;
}

export function getSystemSearchView(type = 'default') {
  const searchConditions = getSearchList(type);
  return [{
    matchLogic: "AND",
    fullName: "默认视图",
    conditionJson: {
      condition: searchConditions.map(item => ({
        prop: item.prop,
        symbol: item.symbol,
        fixed: item.fixed || true
      })) || [],
      pageSize: 20,
      orderItems: [
        {
          asc: false,
          column: 'createTime'
        }
      ]
    },
  }];
}

export function getColumns(type = 'default') {
  // 默认列配置
  const createColumns = [
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 140,
    }
  ]
  const defaultColumns = [...createColumns];

  // 定义各业务类型的列配置
  const columnsConfig = {
    // 生产领料出库
    outbound_pick_out: [
      {
        prop: "orderNo",
        label: "领料单号",
        minWidth: 220,
        slot: true,
      },
      {
        prop: "productionOrderNo",
        label: "生产任务单号",
        minWidth: 220,
      },
      {
        prop: "receiveType",
        label: "领料类型",
        minWidth: 160,
        formatter: (row) => {
          return row.receiveType === 'order' ? '任务物料' : '工序物料';
        }
      },
      {
        prop: 'productsCode',
        label: '产品编码',
        minWidth: 220,
      },
      {
        prop: 'productsName',
        label: '产品名称',
        minWidth: 220,
      },
      {
        prop: 'productsDrawingNo',
        label: '产品型号',
        minWidth: 220,
      },
      // {
      //   prop: 'personId',
      //   label: '领料人',
      //   minWidth: 140,
      // },
      ...createColumns
    ],
    // 生产产品入库
    inbound_order_production: [
      {
        prop: "orderNo",
        label: "任务单号",
        minWidth: 220,
        slot: true,
      },
      {
        prop: "orderType",
        label: "任务类型",
        minWidth: 160,
        slot: true,
        dictType: 'orderType',
      },
      {
        prop: 'productCode',
        label: '产品编码',
        minWidth: 220,
      },
      {
        prop: 'productName',
        label: '产品名称',
        minWidth: 220,
      },
      {
        prop: 'productDrawingNo',
        label: '产品型号',
        minWidth: 220,
      },
      {
        prop: 'mainUnit',
        label: '单位',
        minWidth: 80,
      },
      {
        prop: 'productionQuantity',
        label: '生产数量',
        minWidth: 120,
      },
      {
        prop: 'completedQuantity',
        label: '已完成数量',
        minWidth: 140,
      },
      {
        prop: 'waitReceivedQuantity',
        label: '待入库数量',
        minWidth: 160,
      },
      ...createColumns
    ],

    // 销售发货出库
    outbound_sale_send: [
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        slot: true
      },
      {
        prop: "ordersNo",
        label: "来源单号",
        minWidth: 220,
      },
      {
        prop: "partnerCode",
        label: "客户编码",
        minWidth: 180,
      },
      {
        prop: "partnerName",
        label: "客户名称",
        minWidth: 180,
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
        prop: "exchangeGoodsFlag",
        label: "发货标识",
        minWidth: 120,
        formatter: (row) => {
          return row.exchangeGoodsFlag ? '换货发货' : '正常发货';
        }
      },
      {
        prop: "logisticsCompany",
        label: "发货方式",
        minWidth: 120,
        slot: true,
        dictType: 'logisticsCompany',
      },
      {
        prop: "priority",
        label: "优先级",
        minWidth: 120,
        slot: true,
        dictType: 'shippingPriority',
      },
      {
        prop: "deliveryStatus",
        label: "状态",
        minWidth: 120,
        slot: true,
        dictType: 'shippingStatus',
      },
      ...createColumns,
    ],
    // 销售退货入库
    inbound_sale_return: [
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        slot: true
      },
      {
        prop: "ordersNo",
        label: "来源单号",
        minWidth: 220,
      },
      {
        prop: "partnerCode",
        label: "客户编码",
        minWidth: 180,
      },
      {
        prop: "partnerName",
        label: "客户名称",
        minWidth: 180,
      },
      {
        prop: "deliverDate",
        label: "退货日期",
        minWidth: 120,
      },
      {
        prop: "exchangeGoodsFlag",
        label: "退货标识",
        minWidth: 120,
        formatter: (row) => {
          return row.exchangeGoodsFlag ? '换货' : '退货';
        }
      },
      ...createColumns,
    ],

    // 成品拣货出库
    finished_product_picking_send: [
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        slot: true
      },
      {
        prop: "sourceOrderNo",
        label: "来源单号",
        minWidth: 220,
      },
      {
        prop: "cooperativePartnerCode",
        label: "客户编码",
        minWidth: 180,
      },
      {
        prop: "cooperativePartnerName",
        label: "客户名称",
        minWidth: 180,
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
        dictType: 'shippingPriority',
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

    // 成品包装入库
    inbound_finished_package: [
      {
        prop: "orderNo",
        label: "来源单号",
        minWidth: 220,
        slot: true
      },
      // {
      //   prop: "cooperativePartnerCode",
      //   label: "客户编码",
      //   minWidth: 180,
      //
      //
      // },
      // {
      //   prop: "cooperativePartnerName",
      //   label: "客户名称",
      //   minWidth: 180,
      // },
      {
        prop: "remark",
        label: "入库明细",
        minWidth: 220,
        align: 'left',
      },
      ...createColumns,
    ],

    // 采购收货入库
    inbound_purchase: [
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
      },
      {
        prop: "salesman",
        label: "操作员",
        minWidth: 160,
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
      },
      ...createColumns
    ],
    // 采购退货出库
    outbound_purchase: [
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
      },
      {
        prop: "salesman",
        label: "操作员",
        minWidth: 140,
      },
      {
        prop: "deliverDate",
        label: "退货日期",
        minWidth: 180,
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: 220,
      },
      ...createColumns
    ],

    // 外协发料出库
    outbound_external_send: [
      {
        prop: "orderNo",
        label: "通知单号",
        minWidth: 220,
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
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
        dictType: 'logisticsCompany',
      },
      ...createColumns
    ],
    // 外协退料入库
    inbound_external_return: [
      {
        prop: "orderNo",
        label: "单号",
        minWidth: 220,
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
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
        slot: true
      },
      {
        prop: "partnerCode",
        label: "供应商编码",
        minWidth: 220,
      },
      {
        prop: "partnerName",
        label: "供应商名称",
        minWidth: 180,
      },
      {
        prop: "salesman",
        label: "操作员",
        minWidth: 180,
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

      },
      ...createColumns
    ],
    // 外协退货出库
    outbound_external: [
      {
        prop: 'orderNo',
        label: '通知单号',
        minWidth: 180,
        slot: true
      },
      {
        prop: 'partnerName',
        label: '外协供应商名称',
        minWidth: 160,
      },
      {
        prop: 'partnerCode',
        label: '供应商编码',
        minWidth: 120,
      },
      {
        prop: 'deliverDate',
        label: '退货日期',
        minWidth: 160,
      },
      {
        prop: 'remark',
        label: '备注',
        minWidth: 220,
      },
      ...createColumns
    ],
    // 外协退货出库
    inbound_dake_receive: [
      {
        prop: 'orderNo',
        label: '内贸出库单号',
        minWidth: 180,
        slot: true
      },
      // {
      //   prop: 'partnerName',
      //   label: '供应商名称',
      //   minWidth: 160,
      // },
      // {
      //   prop: 'partnerCode',
      //   label: '供应商编码',
      //   minWidth: 120,
      // },
      // {
      //   prop: 'deliverDate',
      //   label: '退货日期',
      //   minWidth: 160,
      // },
      {
        prop: 'remark',
        label: '备注',
        minWidth: 220,
      },
      ...createColumns
    ],

    default: defaultColumns
  };

  return columnsConfig[type] || columnsConfig.default;
}
