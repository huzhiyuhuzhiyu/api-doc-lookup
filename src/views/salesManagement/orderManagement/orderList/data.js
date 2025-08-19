import {getCooperativeData} from "@/api/basicData";
import global from "@/utils/global";
import {deepClone} from "@/utils";

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
  },
  {
    buttonType: 'primary',
    type: 'confirm',
    permission: 'btn_confirm',
    icon: '',
    text: '确认'
  },
  {
    buttonType: 'primary',
    type: 'confirmDeliveryDate',
    permission: 'btn_confirmDeliveryDate',
    icon: '',
    text: '确认交期'
  },
]

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  function executeCustomerChange(context, data, isClear) {
    // dom更新后重新校验此元素
    context.$nextTick(() => {
      context.$refs.dataForm.$refs.main.validateField(['cooperativePartnerName', 'cooperativePartnerCode']);
    });

    context.dataForm.cooperativePartnerId = data[0].all.id;
    context.dataForm.cooperativePartnerCode = data[0].all.code;
    context.dataForm.cooperativePartnerName = data[0].all.name;
    context.originalFormData = deepClone(context.dataForm);

    if (isClear) {
      clearFormOnCustomerChange();
    }
  }

  function clearFormOnCustomerChange() {
    context.linesList = [];
  }

  return [
    {
      prop: "orderNo",
      label: "订单编号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "orderType",
      label: "订单类型",
      value: "",
      type: "select",
      options: global.salesOrderType,
      itemRules: [{required: true, trigger: "change"}],
    },
    {
      prop: "cooperativePartnerName",
      label: "所属客户",
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
        context.dataForm.cooperativePartnerName = data[0].all.name

        if (context.dataForm.cooperativePartnerId && context.dataForm.cooperativePartnerId !== data[0].all.id) {
          context.$confirm('切换客户将会清空当前数据，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            executeCustomerChange(context, data, true);
          }).catch(() => {
            const originalData = context.originalFormData || {};
            context.dataForm.cooperativePartnerId = originalData.cooperativePartnerId;
            context.dataForm.cooperativePartnerCode = originalData.cooperativePartnerCode;
            context.dataForm.cooperativePartnerName = originalData.cooperativePartnerName;
          });
        } else {
          executeCustomerChange(context, data, false);
        }
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
      prop: "contractNo",
      label: "客户订单号",
      value: "",
      type: "input",
    },
    {
      prop: "departments",
      label: "所属部门",
      value: "",
      type: "custom",
      customComponent: "ComSelect",
      itemRules: [{required: true, trigger: "blur"}],
      change: async (val) => {
        context.dataForm.salesId = ""
        if (!val || !val.length) return context.dataForm.departmentId = ''
        context.dataForm.departmentId = val[val.length - 1]
        context.$nextTick(() => {
          context.$refs.dataForm.$refs.main.clearValidate('departments')
        })
        await context.fetchOrganization()
      }
    },
    {
      prop: "salesId",
      label: "所属销售",
      value: "",
      type: "select",
      get options() {
        return context.salesList
      },
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
      prop: "deliveryDate",
      label: "交货日期",
      value: "",
      type: "date",
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
      sm: 12
    },
    {
      prop: "remark1",
      label: "付款条约",
      value: "",
      type: "textarea",
      sm: 12
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "订单编号",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "cooperativePartnerCode",
      label: "客户编码",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "cooperativePartnerName",
      label: "客户名称",
      minWidth: 180,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "orderType",
      label: "订单类型",
      minWidth: 120,
      slot: true,
      dictType: 'salesOrderType',
      sortable: 'custom',
    },
    {
      prop: "departmentName",
      label: "所属部门",
      minWidth: 120,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "salesName",
      label: "所属销售",
      minWidth: 120,
      sortable: 'custom',
      align: "left",
    },
    {
      prop: "orderDate",
      label: "订单日期",
      minWidth: 120,
      sortable: 'custom',
    },
    {
      prop: "contractNo",
      label: "客户合同号",
      minWidth: 220,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "num",
      label: "订单数量",
      minWidth: 100,
      sortable: 'custom',
    },
    {
      prop: "deliveryDate",
      label: "交货日期",
      minWidth: 120,
      sortable: 'custom',
    },
    {
      prop: "deliveryStatus",
      label: "交期状态",
      minWidth: 120,
      slot: true,
      dictType: 'deliveryStatus',
      sortable: 'custom',
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
      sortable: 'custom',
    },
    {
      prop: "createTime",
      label: "创建时间",
      minWidth: 180,
      sortable: 'custom',
    },
    {
      prop: "createByName",
      label: "创建人",
      minWidth: 120,
      sortable: 'custom',
    }
  ]
}
