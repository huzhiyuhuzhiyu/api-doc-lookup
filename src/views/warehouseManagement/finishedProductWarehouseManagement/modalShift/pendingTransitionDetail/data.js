import { getWarehouseList } from "@/api/basicData";

/**
 * @description 按钮权限列表
 */
export const buttonList = []

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "转换单号",
      minWidth: 220,
      slot: true,
    },
    {
      prop: "warehouseName",
      label: "仓库名称",
      minWidth: 180,
    },
    {
      prop: "shelfSpaceName",
      label: "库位",
      minWidth: 120,
    },
    {
      prop: "targetProductsCode",
      label: "目标产品编码",
      minWidth: 160,
    },
    {
      prop: "targetProductsName",
      label: "目标产品名称",
      minWidth: 160,
    },
    {
      prop: "targetProductDrawingNo",
      label: "目标型号",
      minWidth: 220,
    },
    {
      prop: "targetProductsMainUnit",
      label: "目标单位",
      minWidth: 80,
    },
    {
      prop: "targetPackagingMethod",
      label: "目标包装方式",
      minWidth: 160,
    },
    {
      prop: "num",
      label: "出库数量",
      minWidth: 160,
    },
    {
      prop: "unitConversionRatio",
      label: "单位换算比例",
      minWidth: 160,
    },
    {
      prop: "targetNum",
      label: "入库数量",
      minWidth: 160,
    },
    {
      prop: "productName",
      label: "源产品名称",
      minWidth: 160,
    },
    {
      prop: "productCode",
      label: "源产品编码",
      minWidth: 160,
    },
    {
      prop: "productDrawingNo",
      label: "源型号",
      minWidth: 160,
    },
    {
      prop: 'mainUnit',
      label: '源单位',
      minWidth: 80,
    },
    {
      prop: 'storageDate',
      label: '入库日期',
      minWidth: 160,
    },
    {
      prop: 'shelfSpaceName',
      label: '源库位',
      minWidth: 160,
    },
    {
      prop: 'originBatchNumber',
      label: '源批次号',
      minWidth: 220,
    },
    {
      prop: 'originPackagingMethod',
      label: '源包装方式',
      minWidth: 170,
    },
    {
      prop: 'oil',
      label: '机型',
      minWidth: 150,
    },
    {
      prop: 'accuracyLevel',
      label: '制令号',
      minWidth: 160,
    },
    {
      prop: 'sealingCoverTyping',
      label: '打字内容',
      minWidth: 180,
    },
    {
      prop: 'saleLineRemark',
      label: '销售备注',
      minWidth: 180,
    },
    {
      prop: 'noticeNum',
      label: '通知数量',
      minWidth: 120,
    },
    {
      prop: 'onlineNum',
      label: '线上数',
      minWidth: 150,
    },
    {
      prop: 'onlineInventoryNum',
      label: '线上库存',
      minWidth: 120,
    },
    {
      prop: 'inventoryQuantity',
      label: '当前库存',
      minWidth: 120,
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
