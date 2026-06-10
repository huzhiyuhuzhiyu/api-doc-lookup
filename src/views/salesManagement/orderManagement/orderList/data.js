import { getCooperativeData } from "@/api/basicData";
import global from "@/utils/global";
import { deepClone } from "@/utils";

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
  {
    buttonType: 'danger',
    type: 'cancel',
    permission: 'btn_cancel',
    icon: 'el-icon-close',
    text: '取消'
  },
  {
    buttonType: 'warning',
    type: 'uncancel',
    permission: 'btn_uncancel',
    icon: 'el-icon-refresh-left',
    text: '反取消'
  }
]

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  async function executeCustomerChange(context, data, isClear) {
    // dom更新后重新校验此元素
    context.$nextTick(() => {
      context.$refs.dataForm.$refs.main.validateField(['cooperativePartnerName', 'cooperativePartnerCode']);
    });

    const customerInfo = data[0].all;
    context.dataForm.cooperativePartnerId = customerInfo.id;
    context.dataForm.cooperativePartnerCode = customerInfo.code;
    context.dataForm.cooperativePartnerName = customerInfo.name;
    context.dataForm.contractRemark = customerInfo.remark;
    // 原逻辑：选中客户时未回填付款条约。
    // context.dataForm.paymentTerms = '';
    context.dataForm.remark1 = customerInfo.remark1||customerInfo.paymentTerms || customerInfo.paymentTermsText || '';
    context.dataForm.departmentId = customerInfo.departmentId;

    await context.fetchOrganization()
    context.dataForm.salesId = customerInfo.salespersonId;
    context.originalFormData = deepClone(context.dataForm);

    if (isClear) {
      clearFormOnCustomerChange();
    }

    // 原逻辑：选择客户后，如果产品明细为空，会自动手动补一条空行。
    // if (!context.computedLinesList.length) context.addLineForm()
    // 新逻辑：选择客户只回填客户信息，不再自动新增产品明细行。
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
      itemRules: [{ required: true, trigger: "blur" }],
      get disabled() {
        return context.isOrderNoEditable
      }
    },
    {
      prop: "orderType",
      label: "订单类型",
      value: "",
      type: "select",
      options: global.salesOrderType,
      itemRules: [{ required: true, trigger: "change" }],
      change: (val) => {
        const code = val === 'normal' ? 'KHDD' : 'YCDD'
        context.getOrderNoConfig(code)
      }
    },
    {
      prop: "cooperativePartnerName",
      label: "所属客户",
      value: "",
      type: "custom",
      customComponent: "ComSelect-page",
      itemRules: [{ required: true, trigger: "change" }],
      title: '选择客户',
      renderTree: false,
      multiple: false,
      clearable: true,
      listMethod: getCooperativeData,
      tableItems: [
        { prop: 'name', label: '客户名称', minWidth: '220px', sortable: 'custom' },
        { prop: 'code', label: '客户编码', sortable: 'custom' },
        { prop: 'contacts', label: '联系人', sortable: 'custom' },
        { prop: 'mobilePhone', label: '手机', sortable: 'custom' },
        { prop: 'phone', label: '电话', sortable: 'custom' },
        { prop: 'salespersonIdText', label: '所属销售', sortable: 'custom' },
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
        { prop: 'name', label: '客户名称', type: 'input' },
        { prop: 'code', label: '客户编码', type: 'input' },
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
            context.dataForm.contractRemark = originalData.remark;
            context.dataForm.paymentTerms = originalData.paymentTerms;
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
      itemRules: [{ required: true, trigger: "blur" }],
    },
    {
      prop: "contractRemark",
      label: "客户备注",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "contractNo",
      label: "客户订单号",
      value: "",
      type: "input",
    },
    // {
    //   prop: "departments",
    //   label: "所属部门",
    //   value: "",
    //   type: "custom",
    //   customComponent: "ComSelect",
    //   itemRules: [{ required: true, trigger: "blur" }],
    //   change: async (val) => {
    //     context.dataForm.salesId = ""
    //     if (!val || !val.length) return context.dataForm.departmentId = ''
    //     context.dataForm.departmentId = val[val.length - 1]
    //     context.$nextTick(() => {
    //       context.$refs.dataForm.$refs.main.clearValidate('departments')
    //     })
    //     await context.fetchOrganization()
    //   }
    // },
    {
      prop: "salesId",
      label: "所属销售",
      value: "",
      type: "select",
      get options() {
        return context.salesList
      },
      disabled: true,
      itemRules: [{ required: true, trigger: "change" }],
    },
    {
      prop: "orderDate",
      label: "订单日期",
      value: "",
      type: "date",
      itemRules: [{ required: true, trigger: "blur" }],
    },
    {
      prop: "deliveryDate",
      label: "交货日期",
      value: "",
      type: "date",
      itemRules: [{ required: true, trigger: "blur" }],
      change: () => {
        if (!context.linesList.length) return
        context.linesList.forEach(item => {
          item.deliveryDate = context.dataForm.deliveryDate || ''
        })
      }
    },
    {
      prop: "currencySystem",
      label: "币种",
      value: "",
      type: "select",
      itemRules: [{ required: true, trigger: "blur" }],
      render: context.isForeignTradeSystem,
      get options() {
        return context.systemOptions
      },
      change: (val) => {
        context.syncCurrencyExchangeRate(val);
      }
    },
    {
      prop: "exchangeRate",
      label: "汇率",
      value: "",
      type: "input",
      disabled: true,
      render: context.isForeignTradeSystem
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
      sm: 12
    },
    // 26/6/15
    // {
    //   prop: "remark1",
    //   label: "付款条约",
    //   value: "",
    //   type: "textarea",
    //   sm: 12
    // },
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
    },
    {
      prop: "cooperativePartnerCode",
      label: "客户编码",
      minWidth: 220,
    },
    {
      prop: "cooperativePartnerName",
      label: "客户名称",
      minWidth: 180,
    },
    {
      prop: "orderType",
      label: "订单类型",
      minWidth: 120,
      slot: true,
      dictType: 'salesOrderType',
    },
    {
      prop: "departmentName",
      label: "所属部门",
      minWidth: 120,
    },
    {
      prop: "salesName",
      label: "所属销售",
      minWidth: 120,
    },
    {
      prop: "orderDate",
      label: "订单日期",
      minWidth: 120,
    },
    {
      prop: "contractNo",
      label: "客户合同号",
      minWidth: 220,
    },
    {
      prop: "num",
      label: "订单数量",
      minWidth: 100,
    },
    {
      prop: "deliveryDate",
      label: "交货日期",
      minWidth: 120,
    },
    {
      prop: "orderState",
      label: "订单状态",
      minWidth: 120,
      slot: true,
      dictType: 'salesOrderState',
    },
    {
      prop: "deliveryStatus",
      label: "交期状态",
      minWidth: 120,
      slot: true,
      dictType: 'deliveryStatus',
    },
    {
      prop: "documentStatus",
      label: "单据状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
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
