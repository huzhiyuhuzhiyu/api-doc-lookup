import {getCooperativeData} from "@/api/basicData";
import {deepClone} from "@/utils";

/**
 * @description 表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  function executeCustomerChange(context, data, isClear) {
    // dom更新后重新校验此元素
    context.$nextTick(() => {
      context.$refs.dataForm.$refs.main.validateField(['partnerName', 'partnerCode']);
    });

    context.dataForm.cooperativePartnerId = data[0].all.id;
    context.dataForm.partnerCode = data[0].all.code;
    context.dataForm.partnerName = data[0].all.name;
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
      prop: "orderNo",
      label: "发货单号",
      value: "",
      type: "input",
      disabled: true,
      itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "partnerName",
      label: "客户名称",
      value: "",
      type: "custom",
      customComponent: "ComSelect-page",
      itemRules: [{required: true, trigger: "change"}],
      title: '选择客户',
      renderTree: false,
      multiple: false,
      clearable: true,
      listMethod: getCooperativeData,
      tableItems: [
        {prop: 'name', label: '客户名称', minWidth: '220px', sortable: 'custom'},
        {prop: 'code', label: '客户编码', sortable: 'custom'},
        {prop: 'contacts', label: '联系人', sortable: 'custom'},
        {prop: 'mobilePhone', label: '手机', sortable: 'custom'},
        {prop: 'phone', label: '电话', sortable: 'custom'},
        {prop: 'salespersonIdText', label: '所属销售', sortable: 'custom'},
      ],
      listRequestObj: {
        name: '',
        type: "customer",
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
        {prop: 'name', label: '客户名称', type: 'input'},
      ],
      change: (id, data) => {
        context.dataForm.cooperativePartnerName = data[0].all.name

        if (context.dataForm.cooperativePartnerId && context.dataForm.cooperativePartnerId !== data[0].all.id) {
          context.$confirm('切换客户将会清空当前数据，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            executeCustomerChange(context, data, true);
          }).catch(() => {
            const originalData = context.originalFormData || {};
            context.dataForm.cooperativePartnerId = originalData.cooperativePartnerId;
            context.dataForm.partnerCode = originalData.cooperativePartnerCode;
            context.dataForm.partnerName = originalData.cooperativePartnerName;
          });
        } else {
          executeCustomerChange(context, data, false);
        }
      },
    },
    {
      prop: "partnerCode",
      label: "客户编码",
      value: "",
      type: "input",
      disabled: true,
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
      // itemRules: [{required: true, trigger: "change"}],
    },
    {
      prop: "priority",
      label: "发货优先级",
      value: "",
      type: "select",
      options: context.global.shippingPriority,
      // itemRules: [{required: true, trigger: "change"}],
    },
    {
      prop: "deliverDate",
      label: "计划发货日期",
      value: "",
      type: "date",
      // itemRules: [{required: true, trigger: "blur"}],
    },
    {
      prop: "defaultAddress",
      label: "地址",
      value: "",
      type: "textarea",
      sm: 24,
      readonly: true,
      click: () => {
        console.log('zx')
        if (!context.dataForm.cooperativePartnerId) return context.$message.error("请先选择客户")
        context.addressVisible = true
        context.$nextTick(() => {
          context.$refs.addressRef.initData(context.dataForm.cooperativePartnerId)
        })
      }
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
