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
    inventory_balance: {
        configKeyLabel: '结存方式',
        description: '勾选，按出入库单日期结存；不勾选，按出入库单创建时间结存。'
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


}
