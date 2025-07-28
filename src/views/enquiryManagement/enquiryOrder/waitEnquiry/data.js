import {getCooperativeData} from "@/api/basicData";
import global from "@/utils/global";
import {deepClone} from "@/utils";

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
      prop: "quotationNo",
      label: "询价单号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "cooperativePartnerId",
      label: "客户编号",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "quotationTime",
      label: "询价日期",
      value: "",
      type: "date",
      itemDisabled: true,
    },
    {
      prop: "bidder",
      label: "制单人",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "",
      label: "业务员",
      value: "",
      type: "input",
      disabled: true,
    },
    {
      prop: "",
      label: "采购负责人",
      value: "",
      type: "input",
      disabled: true,
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "quotationNo",
      label: "询价单号",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "cooperativePartnerId",
      label: "客户编码",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "quotationTime",
      label: "询价日期",
      minWidth: 120,
    },
    {
      prop: "bidder",
      label: "制单人",
      minWidth: 120,
    },
    {
      prop: "",
      label: "业务员",
      minWidth: 120,
    },
    {
      prop: "remark",
      label: "备注",
      align: "left",
      minWidth: 150,
    },
    {
      prop: "documentStatus",
      label: "状态",
      minWidth: 120,
      slot: true,
      dictType: 'documentStatusList',
    },
  ]
}
