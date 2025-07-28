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
      disabled: true,
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
      prop: "inquiryNo",
      label: "询价单号",
      minWidth: 200,
      align: "left",
      sortable: 'custom',
    },
    {
      prop: "quotationTime",
      label: "询价日期",
      minWidth: 120,
      sortable: 'custom',
    },
    {
      prop: "cooperativePartnerId",
      label: "供应商编号",
      align: "left",
      minWidth: 180,
      sortable: 'custom',
    },
    {
      prop: "supplierName",
      label: "供应商名称",
      align: "left",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "productsCode",
      label: "产品型号",
      align: "left",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "productsName",
      label: "产品名称",
      align: "left",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "mainUnit",
      label: "单位",
      minWidth: 150,
    },
    {
      prop: "numStr",
      label: "数量",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "sampleNumStr",
      label: "样品数",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "procurementAmounts",
      label: "采购价",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "sampleAmounts",
      label: "样品价",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "minNumStr",
      label: "起订量",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "moldAmounts",
      label: "磨具费",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "deliveryDate",
      label: "交期",
      sortable: 'custom',
      minWidth: 150,
    },
    {
      prop: "remark1",
      label: "反馈备注",
      align: "left",
      minWidth: 150,
    },
  ]
}
