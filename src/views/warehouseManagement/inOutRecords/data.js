/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'export',
    permission: 'btn_export',
    exportType: '1013',
    exportName: '出入库明细',
    tableRef: 'dataTable',
  },
]

export function getColumns() {
  return [
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
    },
    {
      prop: "orderNo",
      label: "单号",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "businessType",
      label: "业务类型",
      minWidth: 180,
      slot: true,
      dictType: "warehouseBusinessType"
    },
    {
      prop: "partnerName",
      label: "客户/供应商",
      minWidth: 160,
    },
    {
      prop: "partnerCode",
      label: "客户/供应商编码",
      minWidth: 160,
    },
    {
      prop: "productCode",
      label: "产品编码",
      minWidth: 180,
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 180,
    },
    {
      prop: "drawingNo",
      label: "品名规格",
      minWidth: 180,
    },
    {
      prop: "productSourceName",
      label: "产品来源",
      minWidth: 160,
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      minWidth: 160,
    },
    {
      prop: "warehouseName",
      label: "仓库名称",
      minWidth: 160,
    },
    {
      prop: "batchNumber",
      label: "批次号",
      minWidth: 160,
    },
    {
      prop: "shelfSpaceName",
      label: "库位",
      minWidth: 160,
    },
    {
      prop: "mainUnit",
      label: '单位',
      minWidth: 120,
    },
    {
      prop: "num",
      label: '数量',
      minWidth: 120,
    },
    {
      prop: "costPrice",
      label: '单价(含税)',
      minWidth: 160,
    },
    {
      prop: "totalAmount",
      label: '总金额(含税)',
      minWidth: 160,
    },
    {
      prop: "taxRate",
      label: '税率',
      minWidth: 120,
      formatter: (row) => {
        return row.taxRate ? row.taxRate + '%' : ''
      },
    },
    {
      prop: "excludingTaxCostPrice",
      label: '单价(不含税)',
      minWidth: 160,
    },
    {
      prop: "taxAmount",
      label: '税额',
      minWidth: 160,
    },
    {
      prop: "excludingTaxTotalAmount",
      label: '总金额(不含税)',
      minWidth: 160,
    },
    {
      prop: "orderDate",
      label: "单据日期",
      minWidth: 160,
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
    },
    {
      prop: "approvalStatus",
      label: "审批状态",
      minWidth: 120,
      slot: true,
      dictType: 'approvalStateList',
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
    },
  ]
}
