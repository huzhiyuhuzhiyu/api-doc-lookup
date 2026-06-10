import {getCooperativeData} from "@/api/basicData";

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "orderNo",
      label: "单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "exchangeGoodsFlag",
      label: "退货标识",
      value: "",
      type: "select",
      options: context.global.returnIndication,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "partnerName",
      label: "客户名称",
      value: "",
      type: "custom",
      customComponent: "ComSelect-page",
      itemRules: [{required: true, trigger: "change"}],
      title: '选择客户',
      renderTree: false,
      multiple: false,
      clearable: true,
      listMethod: getCooperativeData,
      tableItems: [
        {prop: 'name', label: '客户名称', minWidth: '220px', sortable: 'custom'},
        {prop: 'code', label: '客户编码', sortable: 'custom'},
        {prop: 'contacts', label: '联系人', sortable: 'custom'},
        {prop: 'mobilePhone', label: '手机', sortable: 'custom'},
        {prop: 'phone', label: '电话', sortable: 'custom'},
        {prop: 'salespersonIdText', label: '所属销售', sortable: 'custom'},
      ],
      listRequestObj: {
        name: '',
        type: "customer",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ]
      },
      searchList: [
        {prop: 'name', label: '客户名称', type: 'input'},
      ],
      change: (id, data) => {
        context.dataForm.cooperativePartnerId = data[0].all.id;
        context.dataForm.partnerCode = data[0].all.code;
        context.dataForm.partnerName = data[0].all.name;
      },
    },
    {
      prop: "partnerCode",
      label: "客户编码",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "deliverDate",
      label: "退货日期",
      value: "",
      type: "date",
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
      sm: 24
    }
  ]
}
