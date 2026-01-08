/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "inquiryNo",
      label: "询价单号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "customerCode",
      label: "客户编号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "inquiryTime",
      label: "询价日期",
      value: "",
      type: "date",
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
      prop: "purchaseUserId",
      label: "采购负责人",
      value: "",
      type: "input",
      disabled: true,
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "inquiryNo",
      label: "询价单号",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "customerCode",
      label: "客户编码",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "inquiryTime",
      label: "询价日期",
      minWidth: 120,
      sortable: 'custom',
    },
    {
      prop: "bidder",
      label: "制单人",
      minWidth: 120,
      sortable: 'custom',
    },
    {
      prop: "purchaseUserId",
      label: "采购负责人",
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
  ]
}
