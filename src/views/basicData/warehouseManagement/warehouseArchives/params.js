import formValidate from '@/utils/formValidate'

export default () => [
  {
    tabCode: 'basicInfo',
    tabName: '基本信息',
    tabContent: [
      // { prop: "partnerCategoryIdText", label: "上级仓库", value: "", type: 'custom', customComponent: "ComSelect-list" },
      {
        prop: 'type',
        label: '仓库类型',
        value: 'normal',
        type: 'select',
        options: [
          { label: '正常仓库', value: 'normal' },
          { label: '中转仓库', value: 'temp' },
          { label: '不良品仓库', value: 'unqualified' },
          { label: '报废', value: 'scrap' },
          { label: '虚拟仓库', value: 'virtually' },
          { label: '线边仓库', value: 'line_edge' }
        ]
      },
      {
        prop: 'code',
        label: '仓库编码',
        value: '',
        type: 'input',
        itemRules: [{ required: true, trigger: 'blur' }, { validator: formValidate('enCode'), trigger: 'blur' }],
        render: true,
        // itemDisabled: false
      },
      {
        prop: 'name',
        label: '仓库名称',
        value: '',
        type: 'input',
        maxlength: 100,
        itemRules: [{ required: true, trigger: 'blur' }]
      },
      { prop: "state", label: "状态", value: "enable", type: 'select', render: true, itemRules: [{ required: true, trigger: "change" }], options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }] },
      {
        prop: 'workshop',
        label: '车间',
        value: '',
        type: 'select',
        options: [{ label: '装配车间', value: 'assemble' }, { label: '套圈车间', value: 'ferrule' }],
        render: false
      },
      { prop: 'position', label: '位置', value: '', type: 'input', maxlength: 100 },
      { prop: 'sort', label: '排序值', value: '', type: 'input', maxlength: 100 },
      { prop: 'remark', label: '备注', value: '', type: 'textarea', sm: 24 }
    ]
  }
]
