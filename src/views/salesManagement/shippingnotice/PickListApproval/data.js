/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'success',
    type: 'approve',
    permission: 'btn_batch_approve',
    icon: 'el-icon-check',
    text: '批量批准'
  },
  {
    buttonType: 'danger',
    type: 'reject',
    permission: 'btn_batch_reject',
    icon: 'el-icon-close',
    text: '批量拒绝'
  },
  {
    buttonType: 'primary',
    type: 'printPackingList',
    permission: 'btn_print_packing',
    icon: 'el-icon-printer',
    text: '装箱单打印'
  },
  {
    buttonType: 'info',
    type: 'deliveryConfirm',
    permission: 'btn_delivery_confirm',
    icon: 'el-icon-finished',
    text: '送货单确认' // 已核对
  },
  {
    buttonType: 'success',
    type: 'export',
    permission: 'btn_export',
    exportType: '1060',
    exportName: '销售退货通知单',
    tableRef: 'dataTable'
  }
]

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "单号",
      minWidth: 220,
      slot: true
    },
    {
      prop: "partnerCode",
      label: "客户编码",
      minWidth: 220,
    },
    {
      prop: "partnerName",
      label: "客户名称",
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
      label: "发货方式",
      minWidth: 120,
      slot: true,
      dictType: 'logisticsCompany',
    },
    {
      prop: "countryName",
      label: "国家",
      minWidth: 160,
    },
    {
      prop: "provinceName",
      label: "省",
      minWidth: 120,
    },
    {
      prop: "cityName",
      label: "市",
      minWidth: 120,
    },
    {
      prop: "areaName",
      label: "区",
      minWidth: 120,
    },
    {
      prop: "address",
      label: "地址",
      minWidth: 280,
    },
    {
      prop: "deliveryStatus",
      label: "发货状态",
      minWidth: 120,
      slot: true,
      dictType: 'shippingStatus',
    },
    {
      prop: "priority",
      label: "发货优先级",
      minWidth: 120,
      slot: true,
      dictType: 'shippingPriority',
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
    }
  ]
}
