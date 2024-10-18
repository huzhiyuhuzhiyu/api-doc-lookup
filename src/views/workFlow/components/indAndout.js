/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-10-18 14:03:34
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-10-18 16:43:21
 * @FilePath: \os-web-zgt4.0\src\views\workFlow\components\indAndout.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 销售 采购 外协 都有两个页面 需要区分 value 订单  value2 通知单
export const indAndoutTypeList = [
  { label: 'outbound_sale_send', value: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/saleOutboundForm',value2:'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/outboundSaleSendForm' },     // 订单
  { label: 'inbound_sale_return', value2: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundSaleReturnForm' },
  { label: 'inbound_purchase', value: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/purchaseOrderInboundForm',value2:'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundPurchaseForm' }, // 订单
  // { label: 'inbound_purchase', value: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundPurchaseForm' },      // 通知单
  { label: 'outbound_purchase', value2: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/outboundPurchaseForm' },
  { label: 'outbound_external_send', value: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/externalMaterialsForm' ,value2:'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/outboundExternalSendForm'},    // 订单
  { label: 'inbound_external', value: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/externalInboundForm',value2:'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundExternalForm' }, // 订单
  { label: 'outbound_pick_out', value2: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/outboundPickOutForm' },
  { label: 'inbound_return_materials', value2: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundReturnMaterialsForm' },
  { label: 'inbound_production', value2: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/productInboundForm' },
  { label: 'inbound_order_production', value2: 'warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/workInboundForm' },
]