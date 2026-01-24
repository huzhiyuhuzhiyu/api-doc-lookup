/**
 * @description 按钮权限列表
 */
export const buttonList = [
  {
    buttonType: 'primary',
    type: 'feedback',
    permission: 'btn_feedback',
    icon: '',
    text: '交期反馈'
  }
]

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "drawingNo",
      label: "产品型号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "productName",
      label: "产品名称",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "waitIssuanceNum",
      label: "需求数量",
      value: "",
      type: "input",
      itemRules: [
        {
          validator: context.formValidate('noZero', '需求数量不能为0', (errMsg) => {
            context.$message.error(errMsg)
          }), trigger: 'blur'
        },
        {
          validator: context.formValidate({
            type: 'noEmtry', params: ['需求数量不能为空', (errMsg) => {
              context.$message.error(`	需求数量不能为空`)
            }]
          }), trigger: 'blur',
        },
        {
          validator: context.formValidate({
            type: 'decimal', params: [20, 4, null, (errMsg) => {
              context.$message.error(errMsg)
            }]
          }),
          trigger: ['blur', 'change'],
        },
        { required: true, message: '需求数量不能为空', trigger: ['blur', 'change'], },
      ],
      change: () => {
        context.updatePlanDemandQuantity()
      }
    }
  ]
}

export function getColumns() {
  return [
    {
      prop: "orderDate",
      label: "订单日期",
      minWidth: 120
    },
    {
      prop: "cooperativePartnerCode",
      label: "客户编码",
      minWidth: 200
    },
    {
      prop: "orderType",
      label: "订单类型",
      minWidth: 120,
      slot: true,
      dictType: 'salesOrderType'
    },
    {
      prop: "orderNo",
      label: "销售单号",
      minWidth: 200
    },
    {
      prop: "drawingNo",
      label: "型号",
      minWidth: 200
    },
    {
      prop: "productName",
      label: "产品名称",
      minWidth: 200
    },
    {
      prop: "productCode",
      label: "产品编码",
      minWidth: 200
    },
    // {
    //   prop: "customerProductDrawingNo",
    //   label: "客户型号",
    //   minWidth: 200
    // },
    {
      prop: "vibrationLevel",
      label: "图纸版本号",
      minWidth: 120
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 90
    },
    {
      prop: "deliveryDate",
      label: "交货日期",
      minWidth: 120
    },
    {
      prop: "waitIssuanceNum",
      label: "需求数量",
      minWidth: 120
    },
    {
      prop: "feedbackDeliveryDate",
      label: "反馈交期",
      minWidth: 120
    },
    {
      prop: "deliveryStatus",
      label: "交期状态",
      minWidth: 120,
      slot: true,
      dictType: 'deliveryStatus'
    },
    {
      prop: "sealingCoverTyping",
      label: "打字要求",
      minWidth: 180,
    },
    {
      prop: "specialRequire",
      label: "包装要求",
      minWidth: 180,
    },
    {
      prop: "ordersRemark",
      label: "销售订单备注",
      minWidth: 180,
    },
    {
      prop: "remark",
      label: "销售订单产品备注",
      minWidth: 180,
    },
  ]
}
