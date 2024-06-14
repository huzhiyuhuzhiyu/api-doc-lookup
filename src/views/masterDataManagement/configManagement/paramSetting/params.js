/*
 * @Author: DESKTOP-5E76NPE\tiger '1'9'0'9446527@qq.com
 * @Date: 2'0'24-'0'6-'0'7 '0'8:32:45
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-14 10:46:05
 * @FilePath: \os-web-zgt4.'0'\src\views\configManagement\paramSetting\params.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro'1'/koro'1'FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import formValidate from "@/utils/formValidate";

export default () => [
  {
    tabCode: "codeSet",
    tabName: "编码设置",
    tabContent: [
      {
        row: [
          { prop: "bm_cp_ycl", clearable: false, label: "成品产品编码", sm: 6,   value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "blur" }],change:undefined },
          { prop: "bm_cp_bcp", clearable: false, label: "半成品产品编码", sm: 6,   value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "blur" }],change:undefined },
          { prop: "bm_cp_cp", clearable: false, label: "原材料产品编码", sm: 6,   value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "blur" }],change:undefined },
          { prop: "bm_cp_fl", clearable: false, label: "辅料产品编码", sm: 6,   value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "blur" }],change:undefined },
        ]
      },
      {
        row: [
          {
            prop: "bm_khbm", clearable: false, label: "客户编码", sm: 6,  value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "change" }]
          },
        ]
      },
      {
        row: [
          { prop: "bm_gysbm", clearable: false, label: "供应商编码", sm: 6,  value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },
      {
        row: [
          { prop: "bm_gy", clearable: false, label: "工艺", sm: 6, value: '0',  type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },
      {
        row: [
          { prop: "bm_gx", clearable: false, label: "工序", sm: 6, value: '0',  type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },




    ],
  },
  {
    tabCode: "financialSet",
    tabName: "财务设置",
    tabContent: [
      {
        row: [
          { prop: "cw_dz", clearable: false, label: "对账", value: '0', sm: 6, type: 'select', options: [{ label: "对出入库单", value: '0' }, { label: "对发货单", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },
    ]
  }
]