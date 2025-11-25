import { getBankPage } from "@/api/bankMaintenance";

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
 * @description 主表单数据
 */
export function getBasicFormSchema(dataFormRef, context, paymentTypeLabel) {
  return [
    {
      prop: "bankInfo",
      label: "银行卡",
      value: "",
      type: 'custom',
      customComponent: 'ComSelect-page',
      dialogTitle: '选择银行卡',
      renderTree: false,
      listMethod: getBankPage,
      listRequestObj: {
        bankInfo: '',
        depositBank: '',
        pageNum: -1,
        pageSize: 999,
        orderItems: [{ asc: false, column: '' }, { asc: false, column: 'createTime' }],
      },
      searchList: [
        { prop: 'bankInfo', label: '银行账号', type: 'input' },
        { prop: 'depositBank', label: '开户行', type: 'input' }
      ],
      tableItems: [
        { prop: 'bankInfo', label: '银行账号', minWidth: 180 },
        { prop: 'depositBank', label: '开户行', minWidth: 180 },
        { prop: 'balance', label: '余额', minWidth: 120 },
        { prop: 'initAmount', label: '期初金额', minWidth: 120 },
        { prop: 'type', label: '分类', minWidth: 120, dictType: 'bankMaintenanceType' },
        { prop: 'remark', label: '备注', minWidth: 180 }
      ],
      change: (val, data) => {
        if (!val) {
          context.dataForm.bankInfo = ''
          context.dataForm.bankId = ''
          return
        }
        const _data = data[0].all
        context.dataForm.bankInfo = _data.bankInfo;
        context.dataForm.bankId = val;
      }
    },
    {
      prop: "paymentDate",
      label: `${ paymentTypeLabel }日期`,
      value: '',
      type: "date",
      itemRules: [{ required: true, trigger: "change" }],
    },
    {
      prop: "paymentAmount",
      label: `${ paymentTypeLabel }金额`,
      value: "",
      type: "input",
      itemRules: [
        { required: true, message: `${ paymentTypeLabel }金额不能为空`, trigger: "blur" },
        { validator: context.formValidate({ type: 'decimal2', params: [15, 2, "请输入正确的期初金额（最多13位整数，2位小数）"] }), trigger: 'blur' }
      ],
    },
    {
      prop: "paymentMethod",
      label: `${ paymentTypeLabel }方式`,
      value: "",
      type: "select",
      options: context.global.paymentMethodType,
      itemRules: [{ required: true, trigger: "change" }],
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
    },
  ]
}

export function getColumns(paymentType) {
  const paymentTypeLabel = paymentType === 'pay' ? '付款' : '收款'
  return [
    {
      prop: "bankInfo",
      label: "银行账号",
      minWidth: 180,
    },
    {
      prop: "paymentDate",
      label: `${ paymentTypeLabel }日期`,
      minWidth: 160,
    },
    {
      prop: "paymentAmount",
      label: `${ paymentTypeLabel }金额`,
      minWidth: 180,
    },
    {
      prop: "paymentMethod",
      label: `${ paymentTypeLabel }方式`,
      minWidth: 120,
      slot: true,
      dictType: 'paymentMethodType',
    },
    {
      prop: "remark",
      label: "备注",
      minWidth: 180,
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
