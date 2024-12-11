export default {
    arrange_auto_picking:
        {
            configKeyLabel: '启用自动生成领料单',
            description: '启用后，在编辑任务后，将会自动生成领料单。'
        },
    work_exceed_report: {
        configKeyLabel: '允许生产报工超报',
        description: '允许超报后，生产报工总数量将大于计划生产数量。'
    },
    collect_exceed_picking: {
        configKeyLabel: '允许生产超领料',
        description: '允许超领料后，生产领料总数量将大于计划用料总数量。'
    },
    technical_requirement: {
        configKeyLabel: '启用工艺路线技术要求',
        description: '启用工艺路线技术要求后，新建、编辑工艺路线时，将会显示技术要求输入字段，对应工单也将显示技术要求字段。'
    },
    checking_information: {
        configKeyLabel: '启用工艺路线检验信息',
        description: '启用工艺路线检验信息后，新建、编辑工艺路线时，将会显示检验信息要求输入字段，对应工单也将显示检验信息字段。'
    },
}
