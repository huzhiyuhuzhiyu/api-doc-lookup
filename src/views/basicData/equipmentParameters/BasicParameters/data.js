/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'add',
    permission: 'btn_add',
    icon: 'el-icon-plus',
    text: '新建'
  }
]

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "code",
      label: "编码",
      value: "",
      type: "input",
      itemRules: [{required: true, trigger: "blur"}],
      maxlength: "20",
      sm: 24
    },
    {
      prop: "name",
      label: "名称",
      value: "",
      type: "input",
      itemRules: [{required: true, trigger: "blur"}],
      maxlength: "20",
      sm: 24
    },
    {
      prop: "itemRequirements",
      label: "要求",
      value: "",
      type: "textarea",
    },
    {
      prop: "inspectionMethod",
      label: "点检方法",
      value: "",
      type: "textarea",
      render: context.typeCode === 'inspectionItem',
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
    }
  ]
}

export function getColumns(type = '') {
  const commonColumns = [
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
      align: "center",
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 140,
      align: "center",
    }
  ];

  const faultColumns = [
    {
      prop: "name",
      label: "名称",
      minWidth: 180,
    },
    {
      prop: "code",
      label: "编码",
      minWidth: 120,
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 220,
    },
    ...commonColumns,
  ];

  const itemColumns = [
    {
      prop: "name",
      label: "名称",
      minWidth: 180,
    },
    {
      prop: "code",
      label: "编码",
      minWidth: 120,
    },
    {
      prop: "itemRequirements",
      label: "要求",
      minWidth: 220,
    },
    {
      prop: "inspectionMethod",
      label: "点检方法",
      minWidth: 220,
      render: type === 'inspectionItem',
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 220,
    },
    ...commonColumns,
  ];

  const typeMap = {
    faultType: faultColumns,
    faultLocation: faultColumns,
    maintenanceItem: itemColumns,
    inspectionItem: itemColumns
  };

  return typeMap[type] || faultColumns;
}
