/**
 * @description 按钮权限列表
 */
export function getButtonList(type = 'default') {
  // 定义各业务类型的按钮权限配置
  const buttonConfig = {
    // 待装箱
    toBePacked: [
      {
        buttonType: 'primary',
        type: 'packing',
        permission: 'btn_packing',
        icon: '',
        text: '装箱'
      },
    ],
    // 已装箱
    packedInBoxes: [],
    default: []
  };

  return buttonConfig[type] || buttonConfig.default;
}

export function getColumns(type = 'default') {
  // 默认列配置
  const defaultColumns = [];
  const createColumns = [
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
      align: "center",
      sortable: 'custom',
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 140,
      align: "center",
    }
  ]

  // 定义各业务类型的列配置
  const columnsConfig = {

    // 待装箱
    toBePacked: [
      ...defaultColumns,
      {
        prop: "cooperativePartnerName",
        label: "客户",
        minWidth: 180,
        align: "left",
        sortable: 'custom'
      },
      // {
      //   prop: "purchaseOrderNo",
      //   label: "采购单号",
      //   minWidth: 180,
      //   align: "left",
      //   sortable: 'custom'
      // },
      {
        prop: "productDrawingNo",
        label: "产品型号",
        minWidth: 150,
        align: "left"
      },
      {
        prop: "productName",
        label: "产品名称",
        minWidth: 180,
        align: "left"
      },
      {
        prop: "batchNumber",
        label: "批次",
        minWidth: 120,
        align: "left"
      },
      {
        prop: "productionQuantity",
        label: "计划数",
        minWidth: 100,
      },
      {
        prop: "unqualifiedQuantity",
        label: "不合格",
        minWidth: 100,
      },
      {
        prop: "packingQuantity",
        label: "已装箱",
        minWidth: 100,
      },
      {
        prop: "waitPackingQuantity",
        label: "待装箱",
        minWidth: 100,
      },
      // {
      //   prop: "packagingRequirements",
      //   label: "包装要求",
      //   minWidth: 220,
      //   align: "left",
      // },
      ...createColumns,
    ],
    // 已装箱
    packedInBoxes: [
      ...defaultColumns,
      {
        prop: "createTime",
        label: "装箱时间",
        minWidth: 160,
      },
      // {
      //   prop: "cooperativePartnerName",
      //   label: "客户",
      //   minWidth: 180,
      //   align: "left",
      //   sortable: 'custom'
      // },
      // {
      //   prop: "purchaseOrderNo",
      //   label: "采购单号",
      //   minWidth: 180,
      //   align: "left",
      //   sortable: 'custom'
      // },
      {
        prop: "productsDrawingNo",
        label: "产品型号",
        minWidth: 150,
        align: "left"
      },
      {
        prop: "productsName",
        label: "产品名称",
        minWidth: 180,
        align: "left"
      },
      {
        prop: "batchNumber",
        label: "批次",
        minWidth: 120,
        align: "left"
      },
      {
        prop: "productionQuantity",
        label: "计划数",
        minWidth: 100,
      },
      {
        prop: "unqualifiedQuantity",
        label: "不合格",
        minWidth: 100,
      },
      {
        prop: "num",
        label: "已装箱",
        minWidth: 100,
      },
      {
        prop: "waitPackingQuantity",
        label: "待装箱",
        minWidth: 100,
      },
      // {
      //   prop: "packagingRequirements",
      //   label: "包装要求",
      //   minWidth: 220,
      //   align: "left",
      // },
    ],

    default: defaultColumns
  };

  return columnsConfig[type] || columnsConfig.default;
}

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "productDrawingNo",
      label: "产品型号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "productName",
      label: "产品名称",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "num",
      label: "总数量",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: 'packagingMaterialId',
      label: '打包物料',
      type: 'select',
      get options() {
        return context.packagingMaterialList
      },
    },
    {
      prop: 'packagingMethod',
      label: '包装方式',
      type: 'select',
      options: context.getDictDataSync('packaging'),
      change: (val) => {
        context.handlePackagingChange(val)
      }
    },
    {
      prop: 'singleBoxNum',
      label: '每箱数量',
      type: 'input',
      minWidth: 180,
      itemRules: [
        {
          validator: context.formValidate('noZero', '每箱数量不能为0', (errMsg) => {
            context.$message.error(`${ errMsg }`)
          }), trigger: ['blur', 'change']
        },
        {
          validator: context.formValidate({
            type: 'noEmtry', params: ['每箱数量不能为空', (errMsg) => {
              context.$message.error(`${ errMsg }`)
            }]
          }), trigger: 'blur',
        },
        {
          validator: context.formValidate({
            type: 'decimal', params: [20, 1, null, (errMsg) => {
              context.$message.error(`每箱数量${ errMsg }`)
            }]
          }),
          trigger: ['blur', 'change'],
        },
        {required: true, message: '每箱数量不能为空', trigger: ['blur', 'change'],},
      ]
    },
    {
      prop: "singleWeight",
      label: "单个重量",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: 'kg'
      },
    },
  ]
}

