import { getProcessList } from "@/api/basicData/processSettingss";

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "orderNo",
      label: "重检单号",
      value: "",
      type: "input",
      itemRules: [{ required: true, trigger: "blur" }],
      get disabled() {
        return context.isOrderNoEditable
      }
    },
    {
      prop: 'batchNumber',
      label: '批次号',
      type: 'input',
      value: "",
    },
    {
      prop: "priority",
      label: "优先级",
      value: "",
      type: 'select',
      options: context.global.shippingPriority,
    },
    {
      prop: "planDate",
      label: "计划日期",
      value: "",
      type: "date_interval",
      itemRules: [{ required: true, trigger: "change" }],
      change(val) {
        if (!val.length) return
        context.dataForm.planStartDate = val[0]
        context.dataForm.planEndDate = val[1]
      }
    },
    {
      prop: "orderDate",
      label: "单据日期",
      value: "",
      type: "date",
      itemRules: [{ required: true, trigger: "blur" }],
    },
    {
      prop: "routingName",
      label: "工艺路线",
      value: "",
      type: "custom",
      customComponent: "ComSelect-page",
      itemRules: [{ required: true, trigger: "change" }],
      title: '选择工艺路线',
      renderTree: false,
      multiple: false,
      clearable: true,
      listMethod: getProcessList,
      tableItems: [
        { prop: 'name', label: '工艺路线名称', minWidth: '220px', sortable: 'custom' },
        { prop: 'code', label: '工艺路线编码', minWidth: '220px', sortable: 'custom' },
      ],
      listRequestObj: {
        code: "",
        name: "",
        documentStatus: "submit",
        source: "packaging",
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
        { prop: 'name', label: '工艺路线名称', type: 'input' },
        { prop: 'code', label: '工艺路线编码', type: 'input' },
      ],
      change: (id, data) => {
        context.dataForm.routingId = data[0].all.id;
        context.dataForm.routingName = data[0].all.name;
      },
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
