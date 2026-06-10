/**
 * @description 按钮权限列表
 */
export const buttonList = []

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "name",
      label: "名称",
      value: "",
      type: "input",
      maxlength: 100,
      itemRules: [{ required: true, trigger: "blur" }],
    },
    {
      prop: "sizeLength",
      label: "长",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: 'mm'
      },
    },
    {
      prop: "outerLength",
      label: "外箱长",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: 'mm'
      },
    },
    {
      prop: "maxLoad",
      label: "最大载重",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: 'kg'
      },
    },
    {
      prop: "sizeWidth",
      label: "宽",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: 'mm'
      },
    },
    {
      prop: "outerWidth",
      label: "外箱宽",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: 'mm'
      },
    },
    {
      prop: "netWeight",
      label: "自重",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: 'kg'
      },
    },
    {
      prop: "sizeHeight",
      label: "高",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: 'mm'
      },
    },
    {
      prop: "outerHeight",
      label: "外箱高",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: 'mm'
      },
    },
    {
      prop: "remark",
      label: "描述",
      value: "",
      type: "textarea",
      maxlength: 200
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "name",
      label: "名称",
      minWidth: 220,
    },
    {
      prop: "packagingType",
      label: "物料类型",
      minWidth: 220,
      slot: true,
      dictType: "packagingType",
    },
    {
      prop: "size",
      label: "尺寸（长 * 宽 * 高 mm）",
      minWidth: 220,
      slot: true,
    },
    {
      prop: "sizeVolume",
      label: "体积",
      minWidth: 160,
    },
    {
      prop: "maxLoad",
      label: "最大载重（kg）",
      minWidth: 180,
    },
    {
      prop: "netWeight",
      label: "自重（kg）",
      minWidth: 160,
    },
    {
      prop: "remark",
      label: "描述",
      minWidth: 180,
    },
  ]
}
