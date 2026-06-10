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
    sealingCoverTyping: {
        configKeyLabel: '启用打字内容',
        description: '启用采购管理打字内容后，新建采购管理时，将会显示打字内容输入字段。',
        mainModule: '采购管理'
    },
    accuracyLevel: {
        configKeyLabel: '启用精度等级',
        description: '启用采购管理精度等级后，新建采购管理时，将会显示精度等级输入字段。',
        mainModule: '采购管理'
    },
    vibrationLevel: {
        configKeyLabel: '启用振动等级',
        description: '启用采购管理振动等级后，新建采购管理时，将会显示振动等级输入字段。',
        mainModule: '采购管理'
    },
    oil: {
        configKeyLabel: '启用油脂',
        description: '启用采购管理油脂后，新建采购管理时，将会显示油脂输入字段。',
        mainModule: '采购管理'
    },
    oilQuantity: {
        configKeyLabel: '启用油脂量',
        description: '启用采购管理油脂量后，新建采购管理时，将会显示油脂量输入字段。',
        mainModule: '采购管理'
    },
    clearance: {
        configKeyLabel: '启用游隙',
        description: '启用采购管理游隙后，新建采购管理时，将会显示游隙输入字段。',
        mainModule: '采购管理'
    },
    packagingMethod: {
        configKeyLabel: '启用包装方式',
        description: '启用采购管理包装方式后，新建采购管理时，将会显示包装方式输入字段。',
        mainModule: '采购管理'
    },
    specialRequire: {
        configKeyLabel: '启用特殊要求',
        description: '启用采购管理特殊要求后，新建采购管理时，将会显示特殊要求输入字段。',
        mainModule: '采购管理'
    },
    // material: {
    //     configKeyLabel: '启用保持架材质',
    //     description: '启用采购管理保持架材质后，新建采购管理时，将会显示保持架材质输入字段，对应发货通知单、计划、需求、生产计划等也将显示保持架材质字段。',
    //     mainModule: '采购管理'
    // },
    colour: {
        configKeyLabel: '启用颜色',
        description: '启用采购管理颜色后，新建采购管理时，将会显示颜色输入字段。',
        mainModule: '采购管理'
    },
    horder: {
        configKeyLabel: '启用保持架',
        description: '启用采购管理保持架后，新建采购管理时，将会显示保持架输入字段。',
        mainModule: '采购管理'
    },
    standardValue: {
        configKeyLabel: '启用规值',
        description: '启用采购管理规值后，新建采购管理时，将会显示规值输入字段。',
        mainModule: '采购管理'
    },
    aperture: {
        configKeyLabel: '启用孔径',
        description: '启用采购管理孔径后，新建采购管理时，将会显示孔径输入字段。',
        mainModule: '采购管理'
    },
    brand: {
        configKeyLabel: '启用品牌',
        description: '启用采购管理品牌后，新建采购管理时，将会显示品牌输入字段。',
        mainModule: '采购管理'
    },
    sealingCover: {
        configKeyLabel: '启用密封盖',
        description: '启用采购管理密封盖后，新建采购管理时，将会显示密封盖输入字段。',
        mainModule: '采购管理'
    },
    structureType: {
        configKeyLabel: '启用结构类型',
        description: '启用采购管理结构类型后，新建采购管理时，将会显示结构类型输入字段。',
        mainModule: '采购管理'
    },
    noise: {
        configKeyLabel: '启用噪音',
        description: '启用采购管理噪音后，新建采购管理时，将会显示噪音输入字段。',
        mainModule: '采购管理'
    },
    // holderSpecSize: {
    //     configKeyLabel: '启用保持架规格/尺寸',
    //     description: '启用采购管理保持架规格/尺寸后，新建采购管理时，将会显示保持架规格输入字段，对应发货通知单、计划、需求、生产计划等也将显示保持架规格/尺寸字段。',
    //     mainModule: '采购管理'
    // },
    specSize: {
        configKeyLabel: '启用规格/尺寸',
        description: '启用采购管理规格/尺寸后，新建采购管理时，将会显示规格/尺寸输入字段。',
        mainModule: '采购管理'
    },
    logo: {
        configKeyLabel: '启用LOGO',
        description: '启用采购管理LOGO后，新建采购管理时，将会显示防尘盖规格输入字段。',
        mainModule: '采购管理'
    },
    divideEqually: {
        configKeyLabel: '启用开等分',
        description: '启用采购管理开等分后，新建采购管理时，将会显示防尘盖规格输入字段。',
        mainModule: '采购管理'
    },
    // holderMaterial: {
    //     configKeyLabel: '启用保持架材质',
    //     description: '启用采购管理保持架材质后，新建采购管理时，将会显示保持架规格输入字段，对应发货通知单、计划、需求、生产计划等也将显示保持架材质字段。',
    //     mainModule: '采购管理'
    // },
    material: {
        configKeyLabel: '启用材质',
        description: '启用采购管理材质后，新建采购管理时，将会显示材质输入字段。',
        mainModule: '采购管理'
    },
    protrusion: {
        configKeyLabel: '启用凸出量',
        description: '启用采购管理凸出量后，新建采购管理时，将会显示防尘盖规格输入字段。',
        mainModule: '采购管理'
    },
    preload: {
        configKeyLabel: '启用预负荷',
        description: '启用采购管理预负荷后，新建采购管理时，将会显示防尘盖规格输入字段。',
        mainModule: '采购管理'
    },
    angle: {
        configKeyLabel: '启用角度',
        description: '启用采购管理角度后，新建采购管理时，将会显示角度输入字段。',
        mainModule: '采购管理'
    },

    // 新加18个属性
    prodAttrField01: {
        configKeyLabel: '启用轮辐-原料',
        description: '启用采购管理后，新建采购管理时，将会显示轮辐-原料输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField02: {
        configKeyLabel: '启用轮辐-风孔',
        description: '启用采购管理后，新建采购管理时，将会显示轮辐-风孔输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField03: {
        configKeyLabel: '启用轮辐-PCD孔',
        description: '启用采购管理后，新建采购管理时，将会显示轮辐-PCD孔输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField04: {
        configKeyLabel: '启用轮辐-中心孔',
        description: '启用采购管理后，新建采购管理时，将会显示轮辐-中心孔输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField05: {
        configKeyLabel: '启用轮辐-螺栓孔',
        description: '启用采购管理后，新建采购管理时，将会显示轮辐-螺栓孔输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField06: {
        configKeyLabel: '启用轮辐倒角',
        description: '启用采购管理后，新建采购管理时，将会显示轮辐倒角输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField07: {
        configKeyLabel: '启用轮辐钢印',
        description: '启用采购管理后，新建采购管理时，将会显示轮辐钢印输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField08: {
        configKeyLabel: '启用轮辐钻孔攻丝',
        description: '启用采购管理后，新建采购管理时，将会显示轮辐钻孔攻丝输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField09: {
        configKeyLabel: '启用偏距',
        description: '启用采购管理后，新建采购管理时，将会显示偏距输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField10: {
        configKeyLabel: '启用涂装要求',
        description: '启用采购管理后，新建采购管理时，将会显示涂装要求输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField11: {
        configKeyLabel: '启用轮毂划线',
        description: '启用采购管理后，新建采购管理时，将会显示轮毂划线输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField12: {
        configKeyLabel: '启用轮毂厚度',
        description: '启用采购管理后，新建采购管理时，将会显示轮毂厚度输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField13: {
        configKeyLabel: '启用轮辐厚度',
        description: '启用采购管理后，新建采购管理时，将会显示轮辐厚度输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField14: {
        configKeyLabel: '启用轮毂钢印位置',
        description: '启用采购管理后，新建采购管理时，将会显示轮毂钢印位置输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField15: {
        configKeyLabel: '启用轮毂钢印内容',
        description: '启用采购管理后，新建采购管理时，将会显示轮毂钢印内容输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField16: {
        configKeyLabel: '启用真锁圈',
        description: '启用采购管理后，新建采购管理时，将会显示真锁圈输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField17: {
        configKeyLabel: '启用分体假锁圈',
        description: '启用采购管理后，新建采购管理时，将会显示分体假锁圈输入字段。',
        mainModule: '采购管理'
    },
    prodAttrField18: {
        configKeyLabel: '启用一体假锁圈',
        description: '启用采购管理后，新建采购管理时，将会显示一体假锁圈输入字段。',
        mainModule: '采购管理'
    },
}
