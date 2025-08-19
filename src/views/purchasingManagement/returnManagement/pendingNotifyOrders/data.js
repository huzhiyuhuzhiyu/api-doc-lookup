import {getCooperativeData} from "@/api/basicData";
import {getcategoryTrees} from "@/api/salesManagement/assemblyOrders";

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
      prop: "orderNo",
      label: "单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "partnerName",
      label: "供应商名称",
      value: "",
      type: "custom",
      customComponent: "ComSelect-page",
      itemRules: [{required: true, trigger: "change"}],
      title: '选择供应商',
      treeTitle: "供应商分类",
      renderTree: true,
      multiple: false,
      clearable: true,
      methodArr: {
        method: getcategoryTrees,
        requestObj: {
          type: 'supplier'
        }
      },
      listMethod: getCooperativeData,
      tableItems: [
        {prop: 'code', label: '供应商编码'},
        {prop: 'name', label: '供应商名称'},
        {prop: 'nameEn', label: '英文名称'},
        {prop: 'taxId', label: '税号'}
      ],
      listRequestObj: {
        name: '',
        code: '',
        type: "supplier",
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
        context.dataForm.cooperativePartnerId = data[0].all.id;
        context.dataForm.cooperativePartnerCode = data[0].all.code;
        context.dataForm.partnerName = data[0].all.name;
      },
    },
    {
      prop: "cooperativePartnerCode",
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
    }
  ]
}


export function getColumns() {
  return [
    {
      prop: "inspectionMethod",
      label: "检验方式",
      minWidth: 160,
      sortable: 'custom',
      slot: true,
      dictType: "inspectionMethod",
    },
    {
      prop: "orderNo",
      label: "退货单号",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
      slot: true
    },
    {
      prop: "purchaseOrderNo",
      label: "采购单号",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
      slot: true
    },
    {
      prop: "partnerName",
      label: "供应商",
      minWidth: 180,
      align: "left",
      sortable: 'custom'
    },
    {
      prop: "productDrawingNo",
      label: "产品型号",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "batchNumber",
      label: "批次",
      minWidth: 160,
      sortable: 'custom',
    },
    {
      prop: "inspectionDate",
      label: "判定日期",
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: "samplingQuantity",
      label: "来料数",
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: "unqualifiedQuantity",
      label: "数量",
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: "returnReason",
      label: "退货原因",
      minWidth: 120,
      sortable: 'custom'
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
      sortable: 'custom'
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
      sortable: 'custom'
    }
  ]
}
