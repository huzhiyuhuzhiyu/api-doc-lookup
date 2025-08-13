/**
 * @description 装箱表单基础数据
 */
export function getPackingBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "orderNo",
      label: "发货单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "orderNo",
      label: "客户单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "ordersNo",
      label: "来源单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "partnerName",
      label: "客户名称",
      value: "",
      type: "input",
    },
    {
      prop: "partnerCode",
      label: "客户编码",
      value: "",
      type: "input",
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "recipient",
      label: "收件人",
      value: "",
      type: "input",
      render: context.dataForm.delivery !== 'self_pickup'
    },
    {
      prop: "phone",
      label: "收件人电话",
      value: "",
      type: "input",
      render: context.dataForm.delivery !== 'self_pickup'
    },
    {
      prop: "logisticsCompany",
      label: "发货方式",
      value: "",
      type: "select",
      options: context.getDictDataSync('logisticsCompany'),
      itemRules: [{required: true, trigger: "change"}],
    },
    {
      prop: "priority",
      label: "发货优先级",
      value: "",
      type: "select",
      options: context.global.shippingPriority,
      itemRules: [{required: true, trigger: "change"}],
    },
    {
      prop: "deliverDate",
      label: "计划发货日期",
      value: "",
      type: "date",
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "defaultAddress",
      label: "地址",
      value: "",
      type: "textarea",
      sm: 24,
    },
    {
      prop: "remark",
      label: "备注",
      value: "",
      type: "textarea",
      sm: 24
    }
  ]
}


/**
 * 通用数据处理器
 */
export const dataProcessor = {
  extractData(response, path) {
    if (!path) return response;
    return path.split('.').reduce((obj, key) => obj?.[key], response) || [];
  },

  applyFilter(data, filter) {
    if (!filter) return data;

    if (typeof filter === 'function') {
      return data.filter(filter);
    }

    if (typeof filter === 'object') {
      return data.filter(item => {
        return Object.entries(filter).every(([key, condition]) => {
          if (typeof condition === 'function') {
            return condition(item[key]);
          }
          if (Array.isArray(condition)) {
            return condition.includes(item[key]);
          }
          return item[key] === condition;
        });
      });
    }

    return data;
  }
};
