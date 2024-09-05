/*
 * @Author: DESKTOP-5E76NPE\tiger '1'9'0'9446527@qq.com
 * @Date: 2'0'24-'0'6-'0'7 '0'8:32:45
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-17 11:41:31
 * @FilePath: \os-web-zgt4.'0'\src\views\configManagement\paramSetting\params.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro'1'/koro'1'FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import formValidate from "@/utils/formValidate";

export default () => [
  // {
  //   tabCode: "codeSet",
  //   tabName: "编码设置",
  //   tabContent: [
  //     {
  //       row: [
  //         { prop: "bm_cp_cp", clearable: false, label: "成品产品编码", sm: 6,   value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "blur" }],change:undefined },
  //         { prop: "bm_cp_bcp", clearable: false, label: "半成品产品编码", sm: 6,   value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "blur" }],change:undefined },
  //         { prop: "bm_cp_ycl", clearable: false, label: "原材料产品编码", sm: 6,   value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "blur" }],change:undefined },
  //         { prop: "bm_cp_fl", clearable: false, label: "辅料产品编码", sm: 6,   value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "blur" }],change:undefined },
  //       ]
  //     },
  //     {
  //       row: [
  //         {
  //           prop: "bm_khbm", clearable: false, label: "客户编码", sm: 6,  value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "change" }]
  //         },
  //       ]
  //     },
  //     {
  //       row: [
  //         { prop: "bm_gysbm", clearable: false, label: "供应商编码", sm: 6,  value: '0', type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
  //       ]
  //     },
  //     {
  //       row: [
  //         { prop: "bm_gy", clearable: false, label: "工艺", sm: 6, value: '0',  type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
  //       ]
  //     },
  //     {
  //       row: [
  //         { prop: "bm_gx", clearable: false, label: "工序", sm: 6, value: '0',  type: 'select', options: [{ label: "手动输入", value: '0' }, { label: "默认生成", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
  //       ]
  //     },




  //   ],
  // },
  // {
  //   tabCode: "financialSet",
  //   tabName: "财务设置",
  //   tabContent: [
  //     {
  //       row: [
  //         { prop: "cw_dz", clearable: false, label: "对账", value: '0', sm: 6, type: 'select', options: [{ label: "对出入库单", value: '0' }, { label: "对发货单", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
  //       ]
  //     },
  //   ]
  // },
  // {
  //   tabCode: "sale",
  //   tabName: "销售设置",
  //   tabContent: [
  //     {
  //       row: [
  //         { prop: "arrange_auto_sale", clearable: false, label: "销售发货允许超发", value: '0', sm: 6, type: 'switch', options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
  //         // { prop: "ferrule_inbound_process", clearable: false, label: "套圈（对应半成品）完工入库是否加工序", value: '1', sm: 8, type: 'switch',  options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
  //       ]
  //     },

  //   ]
  // },
  {
    tabCode: "produce",
    tabName: "生产设置",
    tabContent: [
      {
        row: [
          { prop: "work_exceed_report", clearable: false, label: "是否完工报工超报", value: '0', sm: 6, type: 'switch', options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
          { prop: "configValue2", clearable: true, label: "范围值", value: '0', sm: 6, type: 'input', itemRules: [{ required: true, trigger: "blur" },], render: false },
          { prop: "collect_exceed_picking", clearable: false, label: "是否允许装配超领料", value: '0', sm: 6, type: 'switch', options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
          { prop: "collectValue", clearable: true, label: "范围值", value: '0', sm: 6, type: 'input', itemRules: [{ required: true, trigger: "blur" },], render: false },
          { prop: "arrange_auto_picking", clearable: false, label: "是否自动生成领料单", value: '0', sm: 6, type: 'switch', options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
          // { prop: "ferrule_inbound_process", clearable: false, label: "套圈（对应半成品）完工入库是否加工序", value: '1', sm: 8, type: 'switch',  options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },

    ]
  },
  {
    tabCode: "warehouse",
    tabName: "仓库设置",
    tabContent: [
      {
        row: [
          { prop: "allocation", clearable: false, label: "库存是否管到库位", value: '0', sm: 6, type: 'switch', options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
          // { prop: "ferrule_inbound_process", clearable: false, label: "套圈（对应半成品）完工入库是否加工序", value: '1', sm: 8, type: 'switch',  options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
        ]
      },

    ]
  },

  {
    tabCode: "attachment",
    tabName: "附件开关",
    tabContent: [
      {
        row: [
          { prop: "fj_zskh", clearable: false, label: "正式客户", value: '0', sm: 6, type: 'switch', options: [{ label: "关", value: '0' }, { label: "开", value: '1' }], itemRules: [{ required: true, trigger: "blur" }] },
          { prop: "fj_wdkh", clearable: false, label: "我的客户", value: '0', sm: 6, type: 'switch', options: [{ label: "关", value: '0' }, { label: "开", value: '1' }], itemRules: [{ required: true, trigger: "blur" }] },
          { prop: "fj_qzkh", clearable: false, label: "潜在客户", value: '0', sm: 6, type: 'switch', options: [{ label: "关", value: '0' }, { label: "开", value: '1' }], itemRules: [{ required: true, trigger: "blur" }] },
          { prop: "fj_ghkh", clearable: false, label: "公海客户", value: '0', sm: 6, type: 'switch', options: [{ label: "关", value: '0' }, { label: "开", value: '1' }], itemRules: [{ required: true, trigger: "blur" }] },
          { prop: "fj_cggysgl", clearable: false, label: "采购供应商管理", value: '0', sm: 6, type: 'switch', options: [{ label: "关", value: '0' }, { label: "开", value: '1' }], itemRules: [{ required: true, trigger: "blur" }] },
          { prop: "fj_wxgysgl", clearable: false, label: "外协供应商管理", value: '0', sm: 6, type: 'switch', options: [{ label: "关", value: '0' }, { label: "开", value: '1' }], itemRules: [{ required: true, trigger: "blur" }] },
        ]
      },
    ]
  },

  // {
  //   tabCode: "mrp",
  //   tabName: "MRP设置",
  //   tabContent: [
  //     {
  //       row: [
  //         { prop: "ferrule_bom", clearable: false, label: "套圈（对应半成品）是否配置BOM", value: '0', sm: 8, type: 'switch',  options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
  //         { prop: "assemble_custom_product_merge", clearable: false, label: "组装按客户产品合并下达", value: '1', sm: 8, type: 'switch',  options: [{ label: "否", value: '0' }, { label: "是", value: '1' }], itemRules: [{ required: true, trigger: "change" },] },
  //       ]
  //     },
  //   ]
  // },
] 