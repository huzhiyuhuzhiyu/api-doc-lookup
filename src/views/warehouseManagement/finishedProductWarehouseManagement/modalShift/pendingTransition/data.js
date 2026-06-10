import { getWarehouseList } from "@/api/basicData";

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
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "orderNo",
      label: "转换单号",
      value: "",
      type: "input",
      itemRules: [{ required: true, trigger: "blur" }],
      get disabled() {
        return context.isOrderNoEditable
      }
    },
    {
      prop: 'warehouseName',
      label: '仓库',
      value: '',
      type: 'custom',
      customComponent: 'ComSelect-list',
      change: (val, data, paramsObj) => {
        context.$nextTick(() => {
          context.$refs['dataForm'].$refs.main.validateField('warehouseName')
        })
        if (!val && data.length) return
        if (data && data.length) {
          context.dataForm.warehouseId = data[0].id
          context.dataForm.warehouseName = data[0].name
          context.dataForm.warehouseType = data[0].all.type
          context.locationEnabled = data[0].all.locationStatus !== 'disabled'
        } else {
          context.dataForm.warehouseId = ''
          context.dataForm.warehouseName = ''
          context.dataForm.warehouseType = ''
        }
      },
      requestObj: {type: 'normal', state: 'enable'},
      dialogTitle: '选择仓库',
      method: getWarehouseList,
      itemDisabled: true
    },
    {
      prop: "partnerName",
      label: "客户名称",
      value: "",
      type: "input",
      disabled: true,
      render: context.activeType
    },
    {
      prop: "partnerCode",
      label: "客户编码",
      value: "",
      type: "input",
      disabled: true,
      render: context.activeType
    },
    {
      prop: "recipient",
      label: "收件人",
      value: "",
      type: "input",
      render: context.dataForm.delivery !== 'self_pickup' && context.activeType,
      disabled: true,
    },
    {
      prop: "phone",
      label: "收件人电话",
      value: "",
      type: "input",
      render: context.dataForm.delivery !== 'self_pickup' && context.activeType,
      disabled: true,
    },
    {
      prop: "logisticsCompany",
      label: "发货方式",
      value: "",
      type: "select",
      options: context.getDictDataSync('logisticsCompany'),
      disabled: true,
      render: context.activeType
    },
    {
      prop: "defaultAddress",
      label: "地址",
      value: "",
      type: "textarea",
      disabled: true,
      render: context.activeType
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
      label: "通知单号",
      minWidth: 220,
    },
    {
      prop: "partnerCode",
      label: "客户编码",
      minWidth: 180,
    },
    {
      prop: "partnerName",
      label: "客户名称",
      minWidth: 180,
    },
    {
      prop: "deliverDate",
      label: "发货日期",
      minWidth: 120,
    },
    {
      prop: "recipient",
      label: "收件人",
      minWidth: 120,
    },
    {
      prop: "phone",
      label: "收件人电话",
      minWidth: 120,
    },
    {
      prop: "deliveryCompletionDate",
      label: "完成日期",
      minWidth: 160,
    },
    {
      prop: "hairExchangeGoodsFlag",
      label: "发货标识",
      minWidth: 120,
      slot: true,
    },
    {
      prop: "logisticsCompany",
      label: "发货方式",
      minWidth: 120,
      slot: true,
      dictType: 'logisticsCompany',
    },
    {
      prop: "priority",
      label: "优先级",
      minWidth: 120,
      slot: true,
      dictType: 'shippingPriority',
    },
    {
      prop: "deliveryStatus",
      label: "状态",
      minWidth: 120,
      slot: true,
      dictType: 'shippingStatus',
    },
    {
      prop: "priority",
      label: "优先级",
      minWidth: 120,
      slot: true,
      dictType: 'shippingPriority',
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
