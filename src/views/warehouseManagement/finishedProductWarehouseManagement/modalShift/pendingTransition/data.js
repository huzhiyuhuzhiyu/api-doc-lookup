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
        this.$nextTick(() => {
          this.$refs['dataForm'].$refs.main.validateField('warehouseName')
        })
        if (!val && data.length) return
        if (data && data.length) {
          this.dataForm.warehouseId = data[0].id
          this.dataForm.warehouseName = data[0].name
          this.dataForm.warehouseType = data[0].all.type
          this.locationEnabled = data[0].all.locationStatus !== 'disabled'
        } else {
          this.dataForm.warehouseId = ''
          this.dataForm.warehouseName = ''
          this.dataForm.warehouseType = ''
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
    },
    {
      prop: "partnerCode",
      label: "客户编码",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "recipient",
      label: "收件人",
      value: "",
      type: "input",
      render: context.dataForm.delivery !== 'self_pickup',
      disabled: true,
    },
    {
      prop: "phone",
      label: "收件人电话",
      value: "",
      type: "input",
      render: context.dataForm.delivery !== 'self_pickup',
      disabled: true,
    },
    {
      prop: "logisticsCompany",
      label: "发货方式",
      value: "",
      type: "select",
      options: context.getDictDataSync('logisticsCompany'),
      disabled: true,
    },
    {
      prop: "defaultAddress",
      label: "地址",
      value: "",
      type: "textarea",
      disabled: true,
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
      prop: "warehouseName",
      label: "仓库名称",
      minWidth: 180,
    },
    {
      prop: "shelfSpaceName",
      label: "库位",
      minWidth: 120,
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
