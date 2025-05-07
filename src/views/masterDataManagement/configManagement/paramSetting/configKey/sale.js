export default {
    salePersonFlag: {
        configKeyLabel: '启用所属销售可见',
        description: '启用所属销售可见后，销售管理只能展示客户配置所属销售的人员可见。'
    },
    cpp_rw_order: {
        configKeyLabel: '启用客户产品修改同步销售订单',
        description: '启用客户产品修改同步销售订单后，修改客户产品时,将该客户产品销售订单(未完成、未转计划)里的信息同步修改'
    },
    discount: {
        configKeyLabel: '启用折扣计算',
        description: '启用折扣计算后，销售管理中销售对账将显示折扣，折扣、含税折扣单价、不含税折扣单价、含税折扣金额、不含税折扣金额。'
    },
    allow_exceed_shipment:{
        configKeyLabel: '启用销售发货出库超发',
        description: '启用后，出入库管理中销售发货出库允许超过待发数量。'
    },
}
