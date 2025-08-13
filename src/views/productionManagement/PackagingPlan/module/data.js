import global from "@/utils/global";
import {getProcessList} from "@/api/basicData/processSettingss";

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "productionPlanNo",
      label: "包装计划单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "orderNo",
      label: "包装任务单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: 'drawingNo',
      label: '型号',
      value: "",
      type: 'input',
      disabled: true,
    },
    {
      prop: 'productCode',
      label: '产品编码',
      value: "",
      type: 'input',
      disabled: true,
    },
    {
      prop: 'mainUnit',
      label: '单位',
      value: "",
      type: 'input',
      disabled: true,
    },
    {
      prop: 'planProductionQuantity',
      label: '计划生产数量',
      value: "",
      type: 'input',
      disabled: true,
    },
    {
      prop: 'availableArrangeQuantity',
      label: '可编排数量',
      value: "",
      type: 'input',
      disabled: true,
    },
    {
      prop: 'productionQuantity',
      label: context.formQuantityLabel,
      value: "",
      type: 'input',
      itemRules: [
        {
          validator: context.formValidate('noZero', `${ context.formQuantityLabel }不能为0`, (errMsg) => {
            context.$message.error(`${ context.formQuantityLabel }不能为0`)
          }), trigger: ['blur', 'change']
        },
        {
          validator: context.formValidate({
            type: 'decimal', params: [20, 4, null, (errMsg) => {
              context.$message.error(`${ context.formQuantityLabel }${ errMsg }`)
            }]
          }),
          trigger: ['blur', 'change'],
        },
        {required: true, message: `${ context.formQuantityLabel }不能为空`, trigger: ['blur', 'change'],},
      ],
      change: () => {
        context.watchProductionQuantity()
      }
    },
    {
      prop: 'taskMethod',
      label: '编排任务方式',
      value: "",
      type: 'select',
      options: global.taskMethodStatus,
      itemRules: [{required: true, trigger: "change"}],
      change: () => {
        context.updateLinesListItems()
      }
    },
    {
      prop: 'productionLineId',
      label: '产线',
      value: "",
      type: 'select',
      get options() {
        return context.productionLineList
      },
      change: (val) => {
        context.selectLine(val)
      }
    },
    {
      prop: "planDate",
      label: "计划日期",
      value: "",
      type: "date_interval",
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "routingName",
      label: "工艺路线",
      value: "",
      type: "custom",
      customComponent: "ComSelect-page",
      itemRules: [{required: true, trigger: "change"}],
      title: '选择工艺路线',
      renderTree: false,
      multiple: false,
      clearable: true,
      listMethod: getProcessList,
      tableItems: [
        {prop: 'name', label: '工艺路线名称', minWidth: '220px', sortable: 'custom'},
        {prop: 'code', label: '工艺路线编码', minWidth: '220px', sortable: 'custom'},
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
        {prop: 'name', label: '工艺路线名称', type: 'input'},
        {prop: 'code', label: '工艺路线编码', type: 'input'},
      ],
      change: (id, data) => {
        context.dataForm.routingId = data[0].all.id;
        context.dataForm.routingName = data[0].all.name;
        context.getRoutingDetail(data[0].all.id)
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

/**
 * @description 领料清单表单数据
 */
export function getBasicPickFormSchema(dataFormRef, context) {
  return [
    {
      prop: "orderNo",
      label: "领料单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "personId",
      label: "领料人",
      value: "",
      type: "input",
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "operationDate",
      label: "领料日期",
      value: "",
      type: "date",
      itemRules: [{required: true, trigger: "blur"}],
    },
  ]
}
