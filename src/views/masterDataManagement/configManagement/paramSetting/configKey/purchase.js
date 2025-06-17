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
    standardValue: {
        configKeyLabel: '启用规值',
        description: '启用采购订单规值后，新建采购订单时，将会显示规值输入字段，对应收货也将显示规值字段。',
        mainModule: '采购订单'
    },
    colour: {
        configKeyLabel: '启用颜色',
        description: '启用采购订单颜色后，新建采购订单时，将会显示颜色输入字段，对应收货也将显示颜色字段。',
        mainModule: '采购订单'
    },
    material: {
        configKeyLabel: '启用材质',
        description: '启用采购材质后，新建采购订单时，将会显示材质输入字段，对应收货也将显示材质字段。',
        mainModule: '采购订单'
    },
    sealingCoverTyping: {
        configKeyLabel: '启用打字内容',
        description: '启用采购订单打字内容后，新建采购订单时，将会显示打字内容输入字段，对应收货也将显示打字内容字段。',
        mainModule: '采购订单'
    },
    accuracyLevel: {
        configKeyLabel: '启用精度等级',
        description: '启用采购订单精度等级后，新建采购订单时，将会显示精度等级输入字段，对应收货也将显示精度等级字段。',
        mainModule: '采购订单'
    },
    vibrationLevel: {
        configKeyLabel: '启用振动等级',
        description: '启用采购订单振动等级后，新建采购订单时，将会显示振动等级输入字段，对应收货也将显示振动等级字段。',
        mainModule: '采购订单'
    },
    oil: {
        configKeyLabel: '启用油脂',
        description: '启用采购订单油脂后，新建采购订单时，将会显示油脂输入字段，对应收货也将显示油脂字段。',
        mainModule: '采购订单'
    },
    oilQuantity: {
        configKeyLabel: '启用油脂量',
        description: '启用采购订单油脂量后，新建采购订单时，将会显示油脂量输入字段，对应收货也将显示油脂量字段。',
        mainModule: '采购订单'
    },
    clearance: {
        configKeyLabel: '启用游隙',
        description: '启用采购订单游隙后，新建采购订单时，将会显示游隙输入字段，对应收货也将显示游隙字段。',
        mainModule: '采购订单'
    },
    packagingMethod: {
        configKeyLabel: '启用包装方式',
        description: '启用采购订单包装方式后，新建采购订单时，将会显示包装方式输入字段，对应收货也将显示包装方式字段。',
        mainModule: '采购订单'
    },
    specialRequire: {
        configKeyLabel: '启用特殊要求',
        description: '启用采购订单特殊要求后，新建采购订单时，将会显示特殊要求输入字段，对应收货也将显示特殊要求字段。',
        mainModule: '采购订单'
    },
}
