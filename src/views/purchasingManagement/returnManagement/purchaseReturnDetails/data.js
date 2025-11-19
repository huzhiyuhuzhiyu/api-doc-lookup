import { getcategoryTrees } from "@/api/salesManagement/assemblyOrders";
import { getCooperativeData } from "@/api/basicData";

/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'warning',
    type: 'resubmit',
    permission: 'btn_resubmit',
    icon: 'el-icon-refresh',
    text: '重收'
  },
  {
    buttonType: 'primary',
    type: 'export',
    permission: 'btn_export',
    exportType: '1073',
    exportName: '退货通知单明细',
    tableRef: 'dataTable',
    disabled: false
  },
]

/**
 * @description 主表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "orderNo",
      label: "重收单号",
      value: "",
      type: "input",
      itemRules: [{ required: true, trigger: "blur" }],
      get disabled() {
        return context.isOrderNoEditable
      }
    },
    // {
    //   prop: "orderNo",
    //   label: "退货单号",
    //   value: "",
    //   type: "input",
    //   disabled: true
    // },
    {
      prop: "cooperativePartnerName",
      label: "供应商名称",
      value: "",
      type: "custom",
      customComponent: "ComSelect-page",
      itemRules: [{required: true, trigger: "change"}],
      title: '选择供应商',
      treeTitle: '供应商分类',
      renderTree: true,
      multiple: false,
      clearable: true,
      methodArr: {method: getcategoryTrees, requestObj: {type: 'supplier'}},
      listMethod: getCooperativeData,
      tableItems: [
        {prop: 'code', label: '供应商编码'},
        {prop: 'name', label: '供应商名称'},
        {prop: 'nameEn', label: '英文名称'},
        {prop: 'taxId', label: '税号'}
      ],
      listRequestObj: {
        code: '',
        name: '',
        type: 'supplier',
        partnerCategoryId: '',
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
        {prop: 'code', label: '供应商编码', type: 'input'},
        {prop: 'name', label: '供应商名称', type: 'input'}
      ],
      change: (id, data) => {
        // dom更新后重新校验此元素
        context.$nextTick(() => {
          context.$refs.dataForm.$refs.main.validateField(['cooperativePartnerName', 'cooperativePartnerCode']);
        });
        context.dataForm.cooperativePartnerId = data[0].all.id;
        context.dataForm.cooperativePartnerCode = data[0].all.code;
        context.dataForm.cooperativePartnerName = data[0].all.name;
      },
      treeNodeClick: (data, node, listQuery) => {
        if (listQuery.partnerCategoryId === data.id) return listQuery
        listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
        listQuery.classAttribute = data.classAttribute
        return listQuery
      },
    },
    {
      prop: "cooperativePartnerCode",
      label: "供应商编码",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "deliveryDate",
      label: "确认交期",
      value: "",
      type: "date",
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
    }
  ]
}


export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "单号",
      minWidth: 220,
      align: "left",
      slot: true
    },
    {
      prop: "partnerCode",
      label: "供应商编码",
      minWidth: 220,
      align: "left",
    },
    {
      prop: "partnerName",
      label: "供应商名称",
      minWidth: 180,
      align: "left",
    },
    {
      prop: "deliverDate",
      label: "退货日期",
      minWidth: 120,
    },
    {
      prop: "unqualifiedQuantity",
      label: "退货数量",
      minWidth: 120,
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
    }
  ]
}
