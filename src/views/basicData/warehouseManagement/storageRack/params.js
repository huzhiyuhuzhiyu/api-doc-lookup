import formValidate from "@/utils/formValidate";
import { getWarehouseList } from "@/api/basicData";

export default (vm) => [
  {
    tabCode: "basicInfo",
    tabName: "基本信息",
    tabContent: [
      {
        prop: "warehouseName",
        label: "上级仓库", value: "",
        dialogTitle: '选择上级仓库',
        type: 'custom',
        customComponent: "ComSelect-list",
        render: true,
        itemRules: [{ required: true, trigger: "change" }],
        method: getWarehouseList,
        requestObj: {
          name: '',
          code: '',
          noId: '',
          type: '',
          state: 'enable',
          locationStatus: 'enable',
          category: 'warehouse'
        },
        change: vm.warehouseNameChange,
      },
      { prop: "state", label: "启用状态", value: "enable", type: 'select', render: true, itemRules: [{ required: true, trigger: "change" }], options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }] },
      { prop: "name", label: "库位名称", value: "", type: 'input', render: true, itemRules: [{ required: true, trigger: "blur" }] },
      { prop: "code", label: "库位编码", value: "", type: 'input', render: true, itemRules: [{ required: true, trigger: "blur" }], itemDisabled: false },
      { prop: 'remark', label: '备注', value: '', type: 'input',render: true, maxlength: 200 }
    ],
  },

]
