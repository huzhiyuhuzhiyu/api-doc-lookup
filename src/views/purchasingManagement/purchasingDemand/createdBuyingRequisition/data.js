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
      prop: "deliveryDate",
      label: "交货日期",
      value: "",
      type: "date",
      itemRules: [{required: true, trigger: "blur"}],
      change: (val) => {
        if (!context.linesList.length) return
        context.linesList.forEach(item => {
          item.deliveryDate = val;
        });
      }
    },
    {
      prop: "organizeIdTrees",
      label: "申请部门",
      value: "",
      type: "custom",
      customComponent: "ComSelect",
      itemRules: [{required: true, trigger: "blur"}],
      change: async (val) => {
        context.dataForm.applicationUserId = ""
        if (!val || !val.length) return context.dataForm.applicationDepartmentId = ''
        context.dataForm.applicationDepartmentId = val[val.length - 1]
        context.$nextTick(() => {
          context.$refs.dataForm.$refs.main.validateField('organizeIdTrees')
        })
        await context.fetchOrganization()
      }
    },
    {
      prop: "applicationUserId",
      label: "申请人",
      value: "",
      type: "select",
      get options() {
        return context.userList
      },
      itemRules: [{required: true, trigger: "change"}],
    },
    {
      prop: "applicationReason",
      label: "申请理由",
      value: "",
      type: "textarea",
      maxlength: 200,
      itemRules: [{required: true, trigger: "blur"}],
    }
  ]
}
