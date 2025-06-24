export default {
    arrange_auto_picking:
        {
            configKeyLabel: '启用任务显示领料单',
            description: '启用后，在新建任务页面，显示领料单信息。'
        },
    work_exceed_report: {
        configKeyLabel: '允许生产报工超报',
        description: '允许超报后，生产报工总数量将大于计划生产数量。'
    },
    collect_exceed_picking: {
        configKeyLabel: '允许生产超领料',
        description: '允许超领料后，生产领料总数量将大于计划用料总数量。'
    },
    auto_material: {
        configKeyLabel: '生产扣减料顺序',
        description: '启用首道自制工序扣减料，首道自制工序报工时，则会扣减线边仓库的料;启用生产产品入库扣减料，生产产品入库时，则会扣减线边仓库的料。'
    },
    blank_auto_order: {
        configKeyLabel: '毛坯生成任务',
        description: '内外圈毛坯入库后自动生成套圈生产任务'
    },
    technical_requirement: {
        configKeyLabel: '启用工艺路线技术要求',
        description: '启用工艺路线技术要求后，新建、编辑工艺路线时，将会显示技术要求输入字段，对应工单也将显示技术要求字段。'
    },
    checking_information: {
        configKeyLabel: '启用工艺路线检验信息',
        description: '启用工艺路线检验信息后，新建、编辑工艺路线时，将会显示检验信息要求输入字段，对应工单也将显示检验信息字段。'
    },
    purchase_to_production: {
        configKeyLabel: '套圈毛坯采购生成任务',
        description: '启用后，套圈毛坯采购入库自动生成套圈任务。'
    },
    bom: {
        configKeyLabel: '默认按工单领料自动扣减料',
        description: '不勾选，则BOM不作限制;勾选后， 默认按工单领料自动扣减料。'
    },
    inventory_balance: {
        configKeyLabel: '结存方式',
        description: '勾选，按出入库单日期结存；不勾选，按出入库单创建时间结存。'
    },
    steelBallTask: {
        configKeyLabel: '钢球任务',
        description: '开启后，显示相关属性字段'
    },
    production_related_customers: {
        configKeyLabel: '生产关联客户',
        description: '开启后，计划管理安全库存创建、直接创建；生产管理编排和新建任务将显示客户名称选择，进行生产关联客户'
    },
    split_sequence_modified: {
        configKeyLabel: '拆分工序顺序可修改',
        description: '开启后，生产管理拆分任务可以修改工序顺序'
    },
    reporting_auto_recode: {
        configKeyLabel: '可报工数量自动带出',
        description: '开启后，完工汇报报工时，合格数量默认带出可报工数量'
    },
    enable_rework_arrange_auto_picking:{
        configKeyLabel: '启用返工显示领料单',
        description: '启用后，在新建返工页面，显示领料单信息',
        mainModule: '生产设置'
    },
    task_process_selection: {
      configKeyLabel: '任务工艺选择',
      description: '如果开启按工艺列表，新建任务时工艺路线来源为工艺列表；如果开启按工艺设置，新建任务时工艺路线来源为工艺设置'
  },
    sealingCoverTyping: {
        configKeyLabel: '启用打字内容',
        description: '启用生产打字内容后，新建生产时，将会显示打字内容输入字段。',
        mainModule: '生产'
    },
    accuracyLevel: {
        configKeyLabel: '启用精度等级',
        description: '启用生产精度等级后，新建生产时，将会显示精度等级输入字段。',
        mainModule: '生产'
    },
    vibrationLevel: {
        configKeyLabel: '启用振动等级',
        description: '启用生产振动等级后，新建生产时，将会显示振动等级输入字段。',
        mainModule: '生产'
    },
    oil: {
        configKeyLabel: '启用油脂',
        description: '启用生产油脂后，新建生产时，将会显示油脂输入字段。',
        mainModule: '生产'
    },
    oilQuantity: {
        configKeyLabel: '启用油脂量',
        description: '启用生产油脂量后，新建生产时，将会显示油脂量输入字段。',
        mainModule: '生产'
    },
    clearance: {
        configKeyLabel: '启用游隙',
        description: '启用生产游隙后，新建生产时，将会显示游隙输入字段。',
        mainModule: '生产'
    },
    packagingMethod: {
        configKeyLabel: '启用包装方式',
        description: '启用生产包装方式后，新建生产时，将会显示包装方式输入字段。',
        mainModule: '生产'
    },
    specialRequire: {
        configKeyLabel: '启用特殊要求',
        description: '启用生产特殊要求后，新建生产时，将会显示特殊要求输入字段。',
        mainModule: '生产'
    },
    // material: {
    //     configKeyLabel: '启用保持架材质',
    //     description: '启用生产保持架材质后，新建生产时，将会显示保持架材质输入字段，对应发货通知单、计划、需求、生产计划等也将显示保持架材质字段。',
    //     mainModule: '生产'
    // },
    colour: {
        configKeyLabel: '启用颜色',
        description: '启用生产颜色后，新建生产时，将会显示颜色输入字段。',
        mainModule: '生产'
    },
    horder: {
        configKeyLabel: '启用保持架',
        description: '启用生产保持架后，新建生产时，将会显示保持架输入字段。',
        mainModule: '生产'
    },
    standardValue: {
        configKeyLabel: '启用规值',
        description: '启用生产规值后，新建生产时，将会显示规值输入字段。',
        mainModule: '生产'
    },
    aperture: {
        configKeyLabel: '启用孔径',
        description: '启用生产孔径后，新建生产时，将会显示孔径输入字段。',
        mainModule: '生产'
    },
    brand: {
        configKeyLabel: '启用品牌',
        description: '启用生产品牌后，新建生产时，将会显示品牌输入字段。',
        mainModule: '生产'
    },
    sealingCover: {
        configKeyLabel: '启用密封盖',
        description: '启用生产密封盖后，新建生产时，将会显示密封盖输入字段。',
        mainModule: '生产'
    },
    structureType: {
        configKeyLabel: '启用结构类型',
        description: '启用生产结构类型后，新建生产时，将会显示结构类型输入字段。',
        mainModule: '生产'
    },
    noise: {
        configKeyLabel: '启用噪音',
        description: '启用生产噪音后，新建生产时，将会显示噪音输入字段。',
        mainModule: '生产'
    },
    // holderSpecSize: {
    //     configKeyLabel: '启用保持架规格/尺寸',
    //     description: '启用生产保持架规格/尺寸后，新建生产时，将会显示保持架规格输入字段，对应发货通知单、计划、需求、生产计划等也将显示保持架规格/尺寸字段。',
    //     mainModule: '生产'
    // },
    specSize: {
        configKeyLabel: '启用规格/尺寸',
        description: '启用生产规格/尺寸后，新建生产时，将会显示规格/尺寸输入字段。',
        mainModule: '生产'
    },
    logo: {
        configKeyLabel: '启用LOGO',
        description: '启用生产LOGO后，新建生产时，将会显示防尘盖规格输入字段。',
        mainModule: '生产'
    },
    divideEqually: {
        configKeyLabel: '启用开等分',
        description: '启用生产开等分后，新建生产时，将会显示防尘盖规格输入字段。',
        mainModule: '生产'
    },
    // holderMaterial: {
    //     configKeyLabel: '启用保持架材质',
    //     description: '启用生产保持架材质后，新建生产时，将会显示保持架规格输入字段，对应发货通知单、计划、需求、生产计划等也将显示保持架材质字段。',
    //     mainModule: '生产'
    // },
    material: {
        configKeyLabel: '启用材质',
        description: '启用生产材质后，新建生产时，将会显示材质输入字段。',
        mainModule: '生产'
    },
    protrusion: {
        configKeyLabel: '启用凸出量',
        description: '启用生产凸出量后，新建生产时，将会显示防尘盖规格输入字段。',
        mainModule: '生产'
    },
    preload: {
        configKeyLabel: '启用预负荷',
        description: '启用生产预负荷后，新建生产时，将会显示防尘盖规格输入字段。',
        mainModule: '生产'
    },
    angle: {
        configKeyLabel: '启用角度',
        description: '启用生产角度后，新建生产时，将会显示角度输入字段。',
        mainModule: '生产'
    },

    // 新加18个属性
    prodAttrField01: {
        configKeyLabel: '启用轮辐-原料',
        description: '启用生产后，新建生产时，将会显示轮辐-原料输入字段。',
        mainModule: '生产'
    },
    prodAttrField02: {
        configKeyLabel: '启用轮辐-风孔',
        description: '启用生产后，新建生产时，将会显示轮辐-风孔输入字段。',
        mainModule: '生产'
    },
    prodAttrField03: {
        configKeyLabel: '启用轮辐-PCD孔',
        description: '启用生产后，新建生产时，将会显示轮辐-PCD孔输入字段。',
        mainModule: '生产'
    },
    prodAttrField04: {
        configKeyLabel: '启用轮辐-中心孔',
        description: '启用生产后，新建生产时，将会显示轮辐-中心孔输入字段。',
        mainModule: '生产'
    },
    prodAttrField05: {
        configKeyLabel: '启用轮辐-螺栓孔',
        description: '启用生产后，新建生产时，将会显示轮辐-螺栓孔输入字段。',
        mainModule: '生产'
    },
    prodAttrField06: {
        configKeyLabel: '启用轮辐倒角',
        description: '启用生产后，新建生产时，将会显示轮辐倒角输入字段。',
        mainModule: '生产'
    },
    prodAttrField07: {
        configKeyLabel: '启用轮辐钢印',
        description: '启用生产后，新建生产时，将会显示轮辐钢印输入字段。',
        mainModule: '生产'
    },
    prodAttrField08: {
        configKeyLabel: '启用轮辐钻孔攻丝',
        description: '启用生产后，新建生产时，将会显示轮辐钻孔攻丝输入字段。',
        mainModule: '生产'
    },
    prodAttrField09: {
        configKeyLabel: '启用偏距',
        description: '启用生产后，新建生产时，将会显示偏距输入字段。',
        mainModule: '生产'
    },
    prodAttrField10: {
        configKeyLabel: '启用涂装要求',
        description: '启用生产后，新建生产时，将会显示涂装要求输入字段。',
        mainModule: '生产'
    },
    prodAttrField11: {
        configKeyLabel: '启用轮毂划线',
        description: '启用生产后，新建生产时，将会显示轮毂划线输入字段。',
        mainModule: '生产'
    },
    prodAttrField12: {
        configKeyLabel: '启用轮毂厚度',
        description: '启用生产后，新建生产时，将会显示轮毂厚度输入字段。',
        mainModule: '生产'
    },
    prodAttrField13: {
        configKeyLabel: '启用轮辐厚度',
        description: '启用生产后，新建生产时，将会显示轮辐厚度输入字段。',
        mainModule: '生产'
    },
    prodAttrField14: {
        configKeyLabel: '启用轮毂钢印位置',
        description: '启用生产后，新建生产时，将会显示轮毂钢印位置输入字段。',
        mainModule: '生产'
    },
    prodAttrField15: {
        configKeyLabel: '启用轮毂钢印内容',
        description: '启用生产后，新建生产时，将会显示轮毂钢印内容输入字段。',
        mainModule: '生产'
    },
    prodAttrField16: {
        configKeyLabel: '启用真锁圈',
        description: '启用生产后，新建生产时，将会显示真锁圈输入字段。',
        mainModule: '生产'
    },
    prodAttrField17: {
        configKeyLabel: '启用分体假锁圈',
        description: '启用生产后，新建生产时，将会显示分体假锁圈输入字段。',
        mainModule: '生产'
    },
    prodAttrField18: {
        configKeyLabel: '启用一体假锁圈',
        description: '启用生产后，新建生产时，将会显示一体假锁圈输入字段。',
        mainModule: '生产'
    },


}
