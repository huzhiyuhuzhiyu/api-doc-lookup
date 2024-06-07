/*
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-07 08:32:45
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-07 13:57:16
 * @FilePath: \os-web-zgt4.0\src\views\configManagement\paramSetting\params.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import formValidate from "@/utils/formValidate";

export default () => [
  {
    tabCode: "codeSet",
    tabName: "编码设置",
    tabContent: [
      {
        row: [
          {
            prop: "code", label: "产品编码：", value: {}, type: 'custom', customComponent: 'JNPF-col', sm: 24, colType: '', style: '',
            tabContent: [
              { prop: "rawMaterial", clearable:false, label: "原材料-产品编码", sm: 6, colType: '', style: 'flex-wrap:nowrap', value: "sd", type: 'select', options: [{ label: "手动输入", value: "sd" }, { label: "默认生成", value: "default" }], itemRules: [{ required: true, trigger: "blur" }], },
              { prop: "semiFinished", clearable:false, label: "半成品-产品编码", sm: 6, colType: '', style: 'flex-wrap:nowrap', value: "sd", type: 'select', options: [{ label: "手动输入", value: "sd" }, { label: "默认生成", value: "default" }], itemRules: [{ required: true, trigger: "blur" }], },
              { prop: "finished", clearable:false, label: "成品-产品编码", sm: 6, colType: '', style: 'flex-wrap:nowrap', value: "sd", type: 'select', options: [{ label: "手动输入", value: "sd" }, { label: "默认生成", value: "default" }], itemRules: [{ required: true, trigger: "blur" }], },
              { prop: "accessories", clearable:false, label: "辅料-产品编码", sm: 6, colType: '', style: 'flex-wrap:nowrap', value: "sd", type: 'select', options: [{ label: "手动输入", value: "sd" }, { label: "默认生成", value: "default" }], itemRules: [{ required: true, trigger: "blur" }], },
            ]
          },
        ]
      },
      {
        row: [
          {
            prop: "partentCode",clearable:false, label: "客户编码", sm: 6, colType: 'flex', style: 'flex-direction:column', value: "sd", type: 'select', options: [{ label: "手动输入", value: "sd" }, { label: "默认生成", value: "default" }], itemRules: [{ required: true, trigger: "change" }]
          },
        ]
      },
      {
        row:[
          { prop: "cooperArtentCode",clearable:false, label: "供应商编码", sm: 6, colType: 'flex', style: 'flex-direction:column', value: "sd", type: 'select', options: [{ label: "手动输入", value: "sd" }, { label: "默认生成", value: "default" }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },
      {
        row:[
          { prop: "rount", clearable:false, label: "工艺", sm: 6, value: "sd", colType: 'flex', style: 'flex-direction:column', type: 'select', options: [{ label: "手动输入", value: "sd" }, { label: "默认生成", value: "default" }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },
      {
        row:[
          { prop: "process",clearable:false, label: "工序", sm: 6, value: "sd", colType: 'flex', style: 'flex-direction:column', type: 'select', options: [{ label: "手动输入", value: "sd" }, { label: "默认生成", value: "default" }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },

      
     
    
    ],
  },
  {
    tabCode: "financialSet",
    tabName: "财务设置",
    tabContent: [
      {
        row:[
          { prop: "reconciliation",clearable:false,  label: "对账", value: "sd", sm: 6, type: 'select', options: [{ label: "对出入库单", value: "sd" }, { label: "对发货单", value: "default" }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },
    ]
  }
]