import global from "@/utils/global";
import store from "@/store";

/**
 * @description 按钮权限列表
 */
export const buttonList = []

/**
 * @description 主表单数据
 */
export function getBasicFormSchema(dataFormRef, context) {
  return [
    {
      prop: "orderNo",
      label: "指标目标编码",
      value: "",
      type: "input",
      itemRules: [{ required: true, trigger: "blur" }],
      get disabled() {
        return context.isOrderNoEditable
      },
      sm: 24,
    },
    {
      prop: "name",
      label: "指标目标名称",
      value: "",
      type: "input",
      sm: 24,
      itemRules: [
        { required: true, message: "指标目标名称不能为空", trigger: "blur" },
      ],
    },
    {
      prop: "productionLineId",
      label: "产线",
      value: "",
      type: "select",
      options: store.getters.productionLineList,
      sm: 24,
      itemRules: [
        { required: true, message: "产线不能为空", trigger: "change" },
      ],
    },
    {
      prop: "libraryName",
      label: "指标中文名称",
      value: "",
      type: "input",
      disabled: true,
      sm: 24,
    },
    {
      prop: "libraryEnName",
      label: "指标英文名称",
      value: "",
      type: "input",
      disabled: true,
      sm: 24,
    },
    {
      prop: "calculationFormula",
      label: "计算公式",
      value: "",
      type: "input",
      disabled: true,
      sm: 24,
    },
    {
      prop: "targetComparator",
      label: "目标比较符",
      value: "",
      type: "select",
      options: global.targetComparatorList,
      sm: 24,
      itemRules: [
        { required: true, message: "目标比较符不能为空", trigger: "change" },
      ],
    },
    {
      prop: "targetValue",
      label: "目标值",
      value: "",
      type: "input",
      itemSlot: {
        position: 'append',
        content: '%'
      },
      sm: 24,
      itemRules: [
        { required: true, message: "目标值不能为空", trigger: "blur" },
      ],
    },
    {
      prop: "meetTargetColor",
      label: "目标达成颜色",
      value: "",
      type: "select",
      options: global.targetColorList,
      sm: 24,
      itemRules: [
        { required: true, message: "目标达成颜色不能为空", trigger: "change" },
      ],
    },
    {
      prop: "notMeetTargetColor",
      label: "目标未达成颜色",
      value: "",
      type: "select",
      options: global.targetColorList,
      sm: 24,
      itemRules: [
        { required: true, message: "目标未达成颜色不能为空", trigger: "change" },
      ],
    },
  ]
}

export function getColumns() {
  return [
    {
      prop: "orderNo",
      label: "指标目标编码",
      minWidth: 140,
    },
    {
      prop: "name",
      label: "指标目标名称",
      minWidth: 140,
    },
    {
      prop: "productionLineName",
      label: "产线",
      minWidth: 120,
    },
    {
      prop: "libraryName",
      label: "指标中文名称",
      minWidth: 120,
    },
    {
      prop: "libraryEnName",
      label: "指标英文名称",
      minWidth: 120,
    },
    {
      prop: "targetValue",
      label: "目标%",
      minWidth: 180,
      formatter: (row) => {
        return row.targetValue + '%'
      }
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
