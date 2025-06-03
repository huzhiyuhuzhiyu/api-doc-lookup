export default {
    outConsigneeFlag: {
        configKeyLabel: '是否存在外协收货方',
        description: '启用是否存在外协收货方后，生成采购订单时，将会显示是否存在外协收货方字段，对应采购订单也将显示是否存在外协收货方字段。'
    },
    productTimeSetting: {
        configKeyLabel: '是否存在产品时间设置',
        description: '启用是否存在产品时间设置后，新建供应商产品时，将会显示有效起始时间字段和有效结束时间字段。'
    },
    uniqueProduct: {
        configKeyLabel: '是否开启自定义产品校验',
        description: '启用是否开启自定义产品校验后，新建供应商产品时，将会使用产品Id和轴承相关字段拼接而成的字段进行校验是否唯一。'
    },

    priceFlag: {
        configKeyLabel: '是否开启单价必填',
        description: '开启单价必填后，将在采购需求池生成采购订单和采购订单列表新建时，产品信息中，单价为必填项；如果不开启，则为非必填'
    },
    allow_exceed_receiving:{
        configKeyLabel: '允许采购超收',
        description: '允许超收后，采购收货总数量将大于待收货数量。'
    },

      related_out_select: {
        configKeyLabel: '钢管采购订单配置',
        description: '如果勾选，则在创建钢管采购订单时，需要先维护委外关联产品；取消勾选，在创建钢管采购订单时，可以直接选择相关信息'
    },
}
