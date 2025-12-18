/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "quotationNo",
      label: "询价单号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "cooperativePartnerId",
      label: "客户编码",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "quotationTime",
      label: "询价日期",
      value: "",
      type: "date",
    },
    {
      prop: "createByName",
      label: "制单人",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "bidder",
      label: "业务员",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "",
      label: "采购负责人",
      value: "",
      type: "input",
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "quotationNo",
      label: "询价单号",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "cooperativePartnerId",
      label: "客户编码",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "quotationTime",
      label: "询价日期",
      minWidth: 120,
      sortable: 'custom',
    },
    {
      prop: "createByName",
      label: "制单人",
      minWidth: 120,
      sortable: 'custom',
    },
    {
      prop: "bidder",
      label: "业务员",
      minWidth: 120,
      sortable: 'custom',
    },
    {
      prop: "remark",
      label: "备注",
      align: "left",
      minWidth: 150,
      sortable: 'custom',
    },
    {
      prop: "documentStatus",
      label: "状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
      sortable: 'custom',
    },
  ]
}
