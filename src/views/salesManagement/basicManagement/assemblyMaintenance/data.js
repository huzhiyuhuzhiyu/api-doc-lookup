import {getCooperativeData} from "@/api/basicData";

/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'add',
    permission: 'btn_add',
    icon: 'el-icon-plus',
    text: '新增'
  }
]

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "name",
      label: "机型",
      value: "",
      type: "input",
      maxlength: 100,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "cooperativePartnerName",
      label: "客户名称",
      value: "",
      type: "custom",
      customComponent: "ComSelect-page",
      itemRules: [{required: true, trigger: "blur"}],
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
        // dom更新后重新校验此元素
        context.$nextTick(() => {
          context.dataFormRef[0].$children[0].validateField('cooperativePartnerName')
        })
        context.dataForm.cooperativePartnerId = data[0].all.id
        context.dataForm.cooperativePartnerCode = data[0].all.code
        context.dataForm.cooperativePartnerName = data[0].all.name
      },
    },
    {
      prop: "cooperativePartnerCode",
      label: "客户编码",
      value: "",
      type: "input",
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
      sm: 24
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "name",
      label: "机型",
      minWidth: 180,
      sortable: 'custom',
    },
    {
      prop: "cooperativePartnerCode",
      label: "客户编码",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "cooperativePartnerName",
      label: "客户名称",
      minWidth: 160,
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
    },
  ]
}
