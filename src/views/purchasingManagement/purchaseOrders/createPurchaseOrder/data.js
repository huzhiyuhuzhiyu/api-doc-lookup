import {getCooperativeData} from "@/api/basicData";
import global from "@/utils/global";
import {deepClone} from "@/utils";
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
    text: '新增'
  },
  {
    buttonType: 'primary',
    type: 'print',
    permission: 'btn_print',
    icon: 'el-icon-printer',
    text: '打印'
  },
  {
    buttonType: 'primary',
    type: 'procurementContract',
    permission: 'btn_procurementContract',
    icon: '',
    text: '采购合同'
  },
  {
    buttonType: 'primary',
    type: 'forReview',
    permission: 'btn_forReview',
    icon: '',
    text: '送审'
  },
]

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "orderNo",
      label: "采购单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "currency",
      label: "币种",
      value: "CNY",
      type: "select",
      options: global.currencyType,
      itemRules: [{required: true, trigger: "change"}],
    },
    {
      prop: "orderDate",
      label: "订单日期",
      value: "",
      type: "date",
      itemRules: [{required: true, trigger: "blur"}],
    },
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
    }
  ]
}

/**
 * @description 其他要求表单数据
 */
export function getOtherFormSchema(dataFormRef, context) {
  return [
    {
      prop: "paymentTerms",
      label: "付款条约",
      value: "",
      type: "textarea",
      sm: 24
    },
    {
      prop: "qualityRequirements",
      label: "质量要求",
      value: "",
      type: "textarea",
      sm: 24
    },
    {
      prop: "sealingCoverTyping",
      label: "打字要求",
      value: "",
      type: "textarea",
      sm: 24
    },
    {
      prop: "packagingRequirements",
      label: "包装要求",
      value: "",
      type: "textarea",
      sm: 24
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

/**
 * @description 付款信息表单数据
 */
export function getPaymentFormSchema(dataFormRef, context) {
  return [
    {
      prop: "paymentTerms",
      label: "单位名称",
      value: "",
      type: "input",
      sm: 24
    },
    {
      prop: "qualityRequirements",
      label: "单位地址",
      value: "",
      type: "input",
      sm: 24
    },
    {
      prop: "sealingCoverTyping",
      label: "法定代表人",
      value: "",
      type: "input",
      sm: 24
    },
    {
      prop: "packagingRequirements",
      label: "委托代理人",
      value: "",
      type: "input",
      sm: 24
    },
    {
      prop: "remark",
      label: "电话",
      value: "",
      type: "input",
      sm: 24
    },
    {
      prop: "remark",
      label: "传真",
      value: "",
      type: "input",
      sm: 24
    },
    {
      prop: "remark",
      label: "开户银行",
      value: "",
      type: "input",
      sm: 24
    },
    {
      prop: "remark",
      label: "账号",
      value: "",
      type: "input",
      sm: 24
    },
    {
      prop: "remark",
      label: "邮政编码",
      value: "",
      type: "input",
      sm: 24
    },


  ]
}

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "单据号",
      minWidth: 220,
    },
    {
      prop: "cooperativePartnerCode",
      label: "供应商编码",
      minWidth: 220,
    },
    {
      prop: "cooperativePartnerName",
      label: "供应商名称",
      minWidth: 220,
    },
    {
      prop: "orderDate",
      label: "订单日期",
      minWidth: 120,
    },
    {
      prop: "deliveryDate",
      label: "确认交期",
      minWidth: 120,
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
    },
    {
      prop: "approvalStatus",
      label: "审批状态",
      minWidth: 120,
      slot: true,
      dictType: 'approvalStateList',
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
