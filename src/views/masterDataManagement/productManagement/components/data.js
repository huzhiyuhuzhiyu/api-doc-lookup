import {getcategoryTree} from "@/api/basicData/materialSettings";
import {getHsProductsList} from "@/api/shipmentNote/hsCodes";

/**
 * @description 成品型号表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "code",
      label: "产品编码",
      value: "",
      type: "input",
      itemDisabled: true,
      itemRules: [{required: true, trigger: "blur"}],
      sm: 12
    },
    {
      prop: "name",
      label: "产品名称",
      value: "",
      type: "input",
      itemRules: [{required: true, trigger: "blur"}],
      sm: 12
    },
    {
      prop: "drawingNo",
      label: "型号",
      value: "",
      type: "input",
      itemRules: [{required: true, trigger: "blur"}],
      sm: 12
    },
    {
      prop: "productCategoryName",
      label: "产品分类",
      value: "",
      type: "custom",
      customComponent: "ComSelect-list",
      itemRules: [{required: true, message: "请选择产品分类", trigger: "no"}],
      method: getcategoryTree,
      requestObj: {classAttribute: context.dataForm.classAttribute},
      change: (val, data) => {
        // dom更新后重新校验此元素
        context.$nextTick(() => {
          context.dataFormRef[0].$children[0].validateField('productCategoryName')
        })
        if (!val && data.length) return
        if (!data || !data.length) return
        context.dataForm.productCategoryId = data[0].id
        context.dataForm.productCategoryName = data[0].name
      },
      dialogTitle: '选择产品分类',
      sm: 12
    },
    {
      prop: "productSource",
      label: "获取方式",
      value: "",
      type: "select",
      options: context.global.productSource,
      sm: 12,
      itemRules: [{required: true, trigger: "change"}],
    },
    {
      prop: "hsProductsName",
      label: "海关分类",
      value: "",
      type: "custom",
      customComponent: "ComSelect-page",
      title: 'HS编码绑定',
      renderTree: false,
      multiple: false,
      clearable: true,
      listMethod: getHsProductsList,
      tableItems: [
        {prop: 'code', label: 'HS编码', minWidth: '220px', sortable: 'custom'},
        {prop: 'name', label: '商品名称', sortable: 'custom'},
        {prop: 'type', label: '类型', sortable: 'custom'},
      ],
      listRequestObj: {
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
        {prop: 'code', label: 'HS编码', type: 'input'},
      ],
      change: (id, data) => {
        // dom更新后重新校验此元素
        context.$nextTick(() => {
          context.dataFormRef[0].$children[0].validateField('hsProductsName')
        })
        context.dataForm.hsProductsId = data[0].all.id
        context.dataForm.hsProductsCode = data[0].all.code
        context.dataForm.hsProductsName = data[0].all.name
      },
      sm: 12
    },
    {
      prop: "material",
      label: "材料",
      value: "",
      type: "input",
      sm: 12
    },
    {
      prop: "insideDiameter",
      label: "内径",
      value: "",
      type: "input",
      suffix: "mm",
      sm: 12
    },
    {
      prop: "externalDiameter",
      label: "外径",
      value: "",
      type: "input",
      suffix: "mm",
      sm: 12
    },
    {
      prop: "width",
      label: "宽度",
      value: "",
      type: "input",
      suffix: "mm",
      sm: 12
    },
    {
      prop: "hoseInternalDiameter",
      label: "内圈宽",
      value: "",
      type: "input",
      suffix: "mm",
      sm: 12
    },
    {
      prop: "hoseOd",
      label: "外圈宽",
      value: "",
      type: "input",
      suffix: "mm",
      sm: 12
    },
    {
      prop: "grossWeight",
      label: "单重",
      value: "",
      type: "input",
      suffix: "kg",
      sm: 12
    },
    {
      prop: "mainUnit",
      label: "计量单位",
      value: "",
      type: "select",
      options: [],
      sm: 12
    },
    {
      prop: "sealingCoverTyping",
      label: "打字位置",
      value: "",
      type: "input",
      sm: 12
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
