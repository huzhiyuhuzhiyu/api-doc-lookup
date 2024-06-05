export default {
  // 入库来源类型
  inboundList: [
    { label: "采购收货入库", value: "inbound_purchase" },
    { label: "外协收货入库", value: "inbound_external" },
    { label: "销售退货入库", value: "inbound_sale_return" },
    { label: "外协退料入库", value: "inbound_external_return" },
    { label: "生产入库", value: "inbound_production" },
    { label: "生产入库", value: "inbound_order_production" },
    { label: "生产入库", value: "inbound_production_batch" },
    { label: "生产入库", value: "inbound_order_production_batch" },
    { label: "生产退料入库", value: "inbound_return_materials" },
    { label: "调拨入库", value: "inbound_transfer" },
    { label: "报废入库", value: "inbound_scrap" },
    { label: "移库入库", value: "inbound_move" },
    { label: "组装入库", value: "inbound_merge" },
    { label: "拆卸入库", value: "inbound_split" },
    { label: "盘盈入库", value: "inbound_profit" },
    { label: "形态转换入库", value: "inbound_shift" },
    { label: "销售备货入库", value: "inbound_stock_up" },
    { label: "其他", value: "io_other" }
  ],
  // 出库来源类型
  outboundList: [
    { label: "采购退货出库", value: "outbound_purchase" },
    { label: "外协退货出库", value: "outbound_external" },
    { label: "销售发货出库", value: "outbound_sale_send" },
    { label: "外协发料出库", value: "outbound_external_send" },
    { label: "生产领料出库", value: "outbound_pick_out" },
    { label: "调拨出库", value: "outbound_transfer" },
    { label: "报废出库", value: "outbound_scrap" },
    { label: "移库出库", value: "outbound_move" },
    { label: "组装出库", value: "outbound_merge" },
    { label: "拆卸出库", value: "outbound_split" },
    { label: "盘亏出库", value: "outbound_loss" },
    { label: "形态转换出库", value: "outbound_shift" },
    { label: "销售备货出库", value: "outbound_stock_up" },
    { label: "销售备货出库", value: "inbound_stock_up" }, // 查看备货出库详情，接口会返回inbound_stock_up类型
    { label: "其他", value: "io_other" }
  ]
} 