export default {
    inbound_purchase: {
        configKeyLabel: '采购收货',
        description: '仓库待办出入库中，会根据您设置的规则，显示收货单还是采购订单进行入库。'
    },
    inbound_external: {
        configKeyLabel: '外协收货',
        description: '仓库待办出入库中，会根据您设置的规则，显示收货单还是外协订单进行入库。'
    },
    outbound_external_send: {
        configKeyLabel: '外协发料',
        description: '仓库待办出入库中，会根据您设置的规则，显示发料通知单还是外协订单进行出库。'
    },
    outbound_sale_send: {
        configKeyLabel: '销售发货',
        description: '仓库待办出入库中，会根据您设置的规则，显示发货通知单还是销售订单进行出库。'
    },
    allocation: {
        configKeyLabel: '启用仓库库位',
        description: '开启后，在仓库库位新建、编辑、查看都会显示附件操作。'
    },
    proportion: {
        configKeyLabel: '启用比重折扣',
        description: '启用比重折扣后，采购和外协收货入库、外协发料出库时，则必须填写重重和比重。'
    },
    inventorySearcheListFlag: {
        configKeyLabel: '启用库存明细查询条件',
        description: '启用库存明细查询条件后,则库存明细查询条件按精度等级、配对方式、打字内容、库位名称查询。'
    },
    unitPriceSetting: {
        configKeyLabel: '启用单价校验',
        description: '启用单价校验后,则直接出入库将进行单价校验。'
    }
}
