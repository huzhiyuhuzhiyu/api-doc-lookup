import store from "@/store";

export const Headers = [
  {prop: "accountPeriod", label: "账期", minWidth: 160},
  {prop: "balanceState", label: "结存状态", minWidth: 160, slot: true, dictType: 'publicState'},
  {prop: "drawingNo", label: store.getters.productDrawingNo, minWidth: 160,align:'left', sortable: 'custom'},
  {prop: "productsName", label: '产品名称',align:'left', minWidth: 160, sortable: 'custom', show: () => store.getters.configData.product.enable_productName},
  {prop: "productsCode", label: '产品编码',align:'left', minWidth: 140, sortable: 'custom'},
  {prop: "processName", label: '工序名称',align:'left', minWidth: 140, sortable: 'custom'},
  {prop: "warehouseName", label: '仓库名称',align:'left', minWidth: 140, sortable: 'custom'},
  {prop: "warehouseCode", label: '仓库编码',align:'left', minWidth: 140, sortable: 'custom'},
  {prop: "mainUnit", label: '单位',align:'left', minWidth: 120},
  {prop: "initInventoryQuantity", label: '期初数量', minWidth: 120, sortable: 'custom'},
  {prop: "purchaseReceivedQuantity", label: '采购入库数量', minWidth: 140, sortable: 'custom'},
  {prop: "outsourcingReceivedQuantity", label: '委外入库数量', minWidth: 140, sortable: 'custom'},
  {prop: "inboundQuantity", label: '入库合计数量', minWidth: 140, sortable: 'custom'},
  {prop: "purchaseReturnQuantity", label: '采购退货数量', minWidth: 140, sortable: 'custom'},
  {prop: "outsourcingIssuedQuantity", label: '委外发料数量', minWidth: 140, sortable: 'custom'},
  {prop: "productionRequisitionQuantity", label: '生产领料数量', minWidth: 140, sortable: 'custom'},
  {prop: "outboundQuantity", label: '出库合计数量', minWidth: 140, sortable: 'custom'},
  {prop: "endInventoryQuantity", label: '期末数量', minWidth: 160, sortable: 'custom'},
];

export const productSetHeaders = [
  {prop: "productName", label: '产品名称',align:'left', minWidth: 160, sortable: 'custom', show: () => store.getters.configData.product.enable_productName},
  {prop: "drawingNo", label: store.getters.productDrawingNo,align:'left', minWidth: 160, sortable: 'custom'},
 
  // {prop: "productsCode", label: '产品编码',align:'left', minWidth: 140, sortable: 'custom'},
  {
    prop: "list", label: '工序', minWidth: 600, align: 'left', slot: true, processConfig: {
      list: 'list',
      nameField: 'processName',
      valueField: 'processNo',
      separator: ' => ',
      itemSeparator: ' ，'
    }
  }
];

export const orderProductSetHeaders = [
  {prop: "orderNo", label: '生产任务单号', align:'left', minWidth: 160, sortable: 'custom'},
  {prop: "orderStatus", label: '任务状态',align:'center', minWidth: 140, sortable: 'custom',slot: true,dictType:'orderStatus'},
  {prop: "productionQuantity", label: '生产数量',align:'center', minWidth: 120, sortable: 'custom'},
  {prop: "productName", label: '产品名称',align:'left', minWidth: 160, sortable: 'custom', show: () => store.getters.configData.product.enable_productName},
  {prop: "productDrawingNo",align:'left', label: store.getters.productDrawingNo, minWidth: 160, sortable: 'custom'},
  {
    prop: "list", label: '工序', minWidth: 600, align: 'left', slot: true, processConfig: {
      list: 'processWipCirculationList',
      nameField: 'processName',
      statusField:'status',
      sort: 'sort',
      valueField: 'num',
      separator: ' => ',
      itemSeparator: ' ，'
    }
  }
];
