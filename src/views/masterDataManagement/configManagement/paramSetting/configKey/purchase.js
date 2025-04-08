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
}
