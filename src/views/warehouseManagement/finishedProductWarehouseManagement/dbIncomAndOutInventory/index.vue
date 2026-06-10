<script>
import { getButtonList, getColumns, getSystemSearchView } from "./data";
import { getPrintBusInfo } from "@/api/system/printDev";
import { getStockMoveList } from "@/api/salesManagement";
import { getClassAttributeListByCode } from "@/api/masterDataManagement";
import { getQuotationdatasendlist } from "@/api/orderFollow";

import { purPurchaseReceiptReturnGoodsList } from "@/api/purchasingAndOutsourcingOrders";
import { getStockPickedPage } from "@/api/batchPacking";
import { getStockPlanPalletPage } from "@/api/PackagingPalletPlan";
import { ordershengchanList, WithdrawalList } from "@/api/productOrdes";
import { waitChange } from "@/utils";

// 组件导入
import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import outboundSaleSendForm from "@/views/salesManagement/shippingnotice/saleMetalworking/Form.vue";

import PackingForm from './module/PackingForm.vue'
import AutoRecBatchPacking from "./module/components/AutoRecBatchPacking.vue";
import InboundForm from "./module/InboundForm.vue";
import OutboundForm from "./module/OutboundForm.vue";
import SingleBoxPrintDialog from "./singleBoxPrintDialog.vue";
import { getDakeReceiveList } from "@/api/warehouseManagement/inboundAndOutbound";

export default {
  name: "WarehouseBusinessProcess",
  components: {
    outboundSaleSendForm,
    OutboundForm,
    InboundForm,
    AutoRecBatchPacking,
    PackingForm,
    BatchPrintBrowse,
    PrintDialog,
    SingleBoxPrintDialog,
  },
  props: {
    warehouseCode: {
      type: String,
      default: 'finish_product'
    }
  },
  data() {
    return {
      activeBusinessType: '',
      availableBusinessTypes: [],

      tableData: [],
      totalCount: 0,
      selectedRows: [],
      classAttributeList: [],

      listQuery: {},
      systemSearchView: getSystemSearchView(),
      superQueryConditions: [
        {
          prop: 'priority',
          label: "发货优先级",
          type: 'select',
          options: this.global.shippingPriority
        },
        {
          prop: 'deliveryStatus',
          label: "状态",
          type: 'select',
          options: this.global.shippingStatus
        },
      ],

      loading: false,
      isSwitching: false,

      isBatchPackingDialogVisible: false,
      isPackingDialogVisible: false,
      isPrintDialogVisible: false,
      isInboundDialogVisible: false,
      isOutboundDialogVisible: false,

      printConfig: {
        category: ''
      },
      currentPrintTemplateName: '',
      currentPrintTemplateCode: '',

      operationButtonsWidth: '160',
      buttonConfig: getButtonList(),
      tableColumnsConfig: getColumns(),
      displayedColumns: [],
      businessTypeOptions: this.getDictDataSync('warehouseBusinessType'),

      isPageInitialized: false,
    }
  },
  computed: {
    businessTypeConfig() {
      const classAttr = this.classAttributeList;

      const baseConfigs = {
        inbound_order_production: {
          api: ordershengchanList,
          initListQuery: {
            approvalStatus: 'ok',
            stockFlag: true,
            progressFlag: true,
          },
        },
        // 生产领料出库
        outbound_pick_out: {
          api: WithdrawalList,
          initListQuery: {
            documentStatus: 'submit',
            approvalStatus: 'ok',
            notifyType: 'picking',
            pickingFlag: 1,
          },
        },
        // 销售发货出库 （销售发货出库 功能：装箱单&推荐批次）
        outbound_sale_send: {
          api: getQuotationdatasendlist,
          initListQuery: {
            notifyType: "sale",
            returnDeliveryType: 'delivery',
            approvalStatus: 'ok',
          },
          detailConfig: {
            component: 'outboundSaleSendForm',
            rowId: 'id',
            visible: false
          }
        },
        // 销售退货入库
        inbound_sale_return: {
          api: getQuotationdatasendlist,
          initListQuery: {
            notifyType: "sale",
            returnDeliveryType: 'back',
            inspectionStatus: 'inspected',
            deliveryStatus: 'confirm',
            approvalStatus: 'ok',
          },
        },
        // 成品拣货出库
        finished_product_picking_send: {
          api: getStockPickedPage,
          initListQuery: {
            notifyType: "sale",
            returnDeliveryType: 'delivery',
            approvalStatus: 'ok',
          },
        },
        // 成品包装入库
        inbound_finished_package: {
          api: getStockPlanPalletPage,
          initListQuery: {
            waitStock: true,
          },
        },
        // 采购收货入库
        inbound_purchase: {
          api: purPurchaseReceiptReturnGoodsList,
          initListQuery: {
            inspectionStatus: 'inspected',
            notificationType: 'procure',
            receiptReturnType: 'receipt',
            receivingStatus: 'not_finished',
            receiptInboundFlag: true,
            documentStatus: 'submit',
            approvalStatus: 'ok',
          },
        },
        // 采购退货出库
        outbound_purchase: {
          api: purPurchaseReceiptReturnGoodsList,
          initListQuery: {
            receiptReturnType: "back",
            approvalStatus: 'ok',
          },
        },
        // 外协发料出库
        outbound_external_send: {
          api: getQuotationdatasendlist,
          initListQuery: {
            approvalStatus: 'ok',
          },
        },
        // 外协退料入库
        inbound_external_return: {
          api: getQuotationdatasendlist,
          initListQuery: {
            inspectionStatus: 'inspected',
            receiptReturnType: "back",
            approvalStatus: 'ok',
          },
        },
        // 外协收货入库
        inbound_external: {
          api: purPurchaseReceiptReturnGoodsList,
          initListQuery: {
            receiptInboundFlag: 1,
            receiptReturnType: "back",
            approvalStatus: 'ok',
          },
        },
        // 外协退货出库
        outbound_external: {
          api: purPurchaseReceiptReturnGoodsList,
          initListQuery: {
            notificationType: 'external_process',
            returnDeliveryType: 'back',
            documentStatus: 'submit',
            approvalStatus: 'ok',
            receivingStatus: 'not_finished',
          },
        },
        // 外协退货出库
        inbound_dake_receive: {
          api: getDakeReceiveList,
          initListQuery: {
          },
        },
      };

      // 特殊属性名配置
      // key: 配置名称
      // value: false 表示不需要添加 | string 表示使用特殊属性名 | 不配置表示使用默认的 'classAttributeList'
      const attrConfig = {
        outbound_pick_out: 'productClassAttributeList',
        inbound_finished_package: false,
      };

      const result = {};
      for (const [key, config] of Object.entries(baseConfigs)) {
        const attrSetting = attrConfig[key];

        if (attrSetting === false) {
          result[key] = config;
          continue;
        }

        const attrName = typeof attrSetting === 'string' ? attrSetting : 'classAttributeList';
        result[key] = {
          ...config,
          initListQuery: {
            ...config.initListQuery,
            [attrName]: classAttr
          }
        };
      }

      return result;
    },
    currentBusinessConfig() {
      return this.businessTypeConfig[this.activeBusinessType] || {};
    },
    hasDetailComponent() {
      return !!this.currentBusinessConfig.detailConfig;
    },
    isDetailDialogVisible() {
      return this.currentBusinessConfig.detailConfig?.visible || false;
    },
    // 出库
    isOutboundOperation() {
      return ['outbound_purchase', 'outbound_external_send', 'outbound_external', 'finished_product_picking_send', 'outbound_pick_out']
        .includes(this.activeBusinessType);
    },
    // 入库
    isInboundOperation() {
      return ['inbound_purchase', 'inbound_sale_return', 'inbound_external_return', 'inbound_external', 'inbound_finished_package', 'inbound_order_production', 'inbound_dake_receive']
        .includes(this.activeBusinessType);
    },
    // 装箱
    isPackingOperation() {
      return ['outbound_sale_send'].includes(this.activeBusinessType);
    },
    // 已装箱
    isRowPacked() {
      return (row) => row.packingStatus === 'boxed' && row.deliveryStatus === 'arranged';
    },
  },
  methods: {
    async loadTableData(customQuery) {
      if (customQuery) this.listQuery = customQuery;

      if (!this.listQuery?.pageSize) {
        this.$message.error('请先等待视图加载完成！');
        return;
      }
      const loadIdentifier = +new Date();
      this.currentLoadIdentifier = loadIdentifier;

      this.loading = true;
      try {
        if (!this.isPageInitialized) {
          await this.initializePageData();
        }

        if (loadIdentifier !== this.currentLoadIdentifier) return;
        const response = await this.currentBusinessConfig.api(this.listQuery);
        const { total, records } = response.data;

        this.tableData = records;
        this.totalCount = total;
      } finally {
        this.loading = false;
        this.isSwitching = false;
      }
    },

    async initializePageData() {
      await this.loadClassAttributes();
      await this.loadBusinessProcesses();
      this.isPageInitialized = true;
    },

    async loadClassAttributes() {
      const response = await getClassAttributeListByCode({ code: this.warehouseCode });
      this.classAttributeList = response.data || [];
    },

    async loadBusinessProcesses() {
      const response = await getStockMoveList(this.classAttributeList, this.warehouseCode);
      this.availableBusinessTypes = response.data.map(item => ({
        ...item,
        name: this.businessTypeOptions.find(type => type.value === item.businessType)?.label,
        pendingCount: item.todoNum
      }));
      this.activeBusinessType = this.availableBusinessTypes[0]?.businessType || '';
      this.handleBusinessTypeChange(this.activeBusinessType)
    },

    handleBusinessTypeChange(businessType) {
      const config = this.currentBusinessConfig;
      if (!config) return;

      this.isSwitching = true;
      this.tableData = [];

      this.updateInterfaceConfiguration(businessType);
      this.initializeQueryParameters(config);
      this.adjustTableLayout();
    },

    updateInterfaceConfiguration(businessType) {
      this.systemSearchView = getSystemSearchView(businessType);
      this.buttonConfig = getButtonList(businessType);
      this.tableColumnsConfig = getColumns(businessType);
    },

    initializeQueryParameters(config) {
      this.listQuery = structuredClone(config.initListQuery);
    },

    async adjustTableLayout() {
      await waitChange(() => {
        return this.tableData.length > 0
      })

      this.calculateOperationButtonsWidth();
      this.$nextTick(() => {
        this.$refs.dataTable.doLayout();
      });
    },

    calculateOperationButtonsWidth() {
      this.$nextTick(() => {
        if (this.$refs.operationButtons) {
          const buttons = this.$refs.operationButtons.querySelectorAll('.el-button');
          let totalWidth = 0;
          buttons.forEach(button => {
            totalWidth += button.offsetWidth;
          });
          this.operationButtonsWidth = totalWidth + (buttons.length * 10) + 20;
        }
      });
    },

    validateRowSelection() {
      if (!this.selectedRows.length) {
        this.$message.warning('请至少选择一条数据');
        return false;
      }
      if (this.selectedRows.length > 1) {
        this.$message.warning('只能选择一条数据');
        return false;
      }
      return true;
    },

    handleMainButtonClick(buttonType) {
      switch ( buttonType ) {
        case 'outboundSaleSendConfirm':
          this.handleOutboundSaleSendConfirmation();
          break;
        case 'print':
         if (!this.validateRowSelection()) return;

        const selectedRow = this.selectedRows[0];
        // 根据业务类型设置不同的打印模板编码
        const printTemplateMap = {
          'outbound_sale_send': { enCode: 'p032', fullName: '打印装箱清单' },
        };
        const printTemplate = printTemplateMap[this.activeBusinessType];
        if (!printTemplate) {
          this.$message.error('未配置打印模板');
          return;
        }
        this.openPrintPreview(selectedRow, printTemplate.enCode, printTemplate.fullName);
        break;
      }
    },
    handleOutboundSaleSendConfirmation() {
      if (!this.validateRowSelection()) return;

      const selectedRow = this.selectedRows[0];
      const invalidStatuses = new Set(['waiting', 'verified', 'finished', 'canceled']);

      if (invalidStatuses.has(selectedRow.deliveryStatus)) {
        this.$message.warning('当前状态不允许操作');
        return;
      }

      this.openPackingDialog(selectedRow, 'confirm');
    },

    // 装箱操作
    handlePackingOperation(row) {
      this.openPackingDialog(row, 'packing');
    },

    // 装箱单编辑
    handlePackingEdit(row, actionType, buttonType) {
      this.isBatchPackingDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.AutoRecBatchPacking.init({
          id: row.id,
          formType: actionType,
          type: buttonType,
        });
      });
    },

    handleOutboundOperation(row) {
      this.isOutboundDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.OutboundForm.init({
          id: '',
          prefillData: row,
          btnType: 'add',
          businessType: this.activeBusinessType,
          classAttributeList: this.classAttributeList,
          warehouseCode: this.warehouseCode
        });
      });
    },

    handleInboundOperation(row) {
      this.isInboundDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.InboundForm.init({
          id: '',
          prefillData: row,
          btnType: 'add',
          businessType: this.activeBusinessType,
          classAttributeList: this.classAttributeList,
          warehouseCode: this.warehouseCode
        });
      });
    },

    handleDetailView(row) {
      const detailConfig = this.currentBusinessConfig.detailConfig;
      if (!detailConfig) {
        this.$message.warning('当前业务类型不支持查看详情');
        return;
      }

      detailConfig.visible = true;
      this.$nextTick(() => {
        this.$refs.detailComponent.init(row[detailConfig.rowId], 'look');
      });
    },

    openPackingDialog(row, buttonType) {
      this.isPackingDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.PackingForm.init({
          id: row.id,
          btnType: buttonType,
          businessType: this.activeBusinessType,
          classAttributeList: this.classAttributeList,
          warehouseCode: this.warehouseCode
        });
      });
    },

    openPrintPreview(row, templateCode, templateName) {
      this.selectedRows = [row];
      this.currentPrintTemplateCode = templateCode;
      this.currentPrintTemplateName = templateName;
      this.isPrintDialogVisible = true;

      this.$nextTick(() => {
        this.$refs.printTemplate.init(templateCode);
      });
    },

    async executePrint(templateCode, params = null) {
      try {
        const response = await getPrintBusInfo(templateCode);
        if (!response.data) {
          return this.$message.warning('未找到相应打印模版');
        }

        // 单箱打印，需要选择前置数据
        if (!params && response.data.fullName === '单箱打印') {
          const firstRow = this.selectedRows[0];
          if (firstRow.packingStatus !== 'boxed') {
            return this.$message.warning('只有已装箱的数据才能单箱打印');
          }
          this.currentPrintTemplateCode = templateCode;
          this.$refs.singleBoxPrintDialog.open(firstRow.id, templateCode);
          return;
        }

        const templateId = response.data.id;
        const printData = this.selectedRows.map(item => ({
          formId: item.id,
          id: templateId,
          params
        }));

        this.$refs.batchPrint.print(printData);
      } catch ( error ) {
        console.error('打印错误:', error);
      }
    },

    closePrintDialog() {
      this.isPrintDialogVisible = false;
    },

    handleSingleBoxPrint(templateCode, trayNo) {
      this.executePrint(templateCode, { trayNo: trayNo });
    },

    closeDialog(shouldReloadData = true) {
      this.isPackingDialogVisible = false;
      this.isBatchPackingDialogVisible = false;
      this.isInboundDialogVisible = false;
      this.isOutboundDialogVisible = false;

      if (!shouldReloadData) return;
      this.loadTableData();
    },

    getColumnAlignment(align) {
      return align || 'left';
    },

    async reloadPageData() {
      this.isPageInitialized = false;
      await this.initializePageData();
      await this.loadTableData();
    }
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="business-process-container JNPF-common-search-box">
        <el-radio-group v-model="activeBusinessType" @change="handleBusinessTypeChange" :disabled="isSwitching">
          <template v-for="(process, index) in availableBusinessTypes">
            <el-badge :value="process.pendingCount" :max="99" :key="index" :hidden="!process.pendingCount">
              <el-radio-button :label="process.businessType">
                {{ process.name }}
              </el-radio-button>
            </el-badge>
          </template>
        </el-radio-group>
      </div>
      <JNPF-tableQuery :key="`search-${activeBusinessType}`" ref="tableQuery" :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable"/>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <CustomButton
              :btnList="buttonConfig"
              @click="handleMainButtonClick"
            />
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
              <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                       @click="$refs.dataTable.showSortDrawer()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                       @click="$refs.dataTable.showDrawer()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                       @click="loadTableData()"/>
            </el-tooltip>
          </div>
        </div>

        <JNPF-table
          v-loading="loading"
          :customKey="`dbInComAndOutInventoryIndex${activeBusinessType}`"
          :data="tableData"
          :row-key="'id'"
          :hasC="true"
          fixedNO
          :setColumnDisplayList="displayedColumns"
          @selection-change="(selected) => selectedRows = selected"
          ref="dataTable"
          custom-column
          :listQuery="listQuery"
          @queryChange="loadTableData"
          :queryJson="superQueryConditions"
        >
          <template v-for="column in tableColumnsConfig">
            <el-table-column
              v-if="typeof column.show === 'function' ? column.show() : (column.show !== undefined ? column.show : true)"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth"
              :fixed="column.fixed"
              :align="getColumnAlignment(column.align)"
              :formatter="column.formatter"
            >
              <template v-if="column.slot" v-slot="scope">
                <template v-if="column.prop === 'orderNo'">
                  <el-link type="primary"
                           @click.native="handleDetailView(scope.row)">{{
                      scope.row.orderNo
                    }}
                  </el-link>
                </template>
                <template v-if="column.dictType">
                   <span>
                <el-tag
                  :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">{{
                    global.getDictLabelGlobal(column.dictType, scope.row[column.prop])
                  }}</el-tag>
                   </span>
                </template>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" :width="operationButtonsWidth" fixed="right">
            <template slot-scope="{ row }">
              <div ref="operationButtons" class="operation-buttons">
                <el-button v-if="isOutboundOperation" size="mini" type="text" @click="handleOutboundOperation(row)">
                  出库
                </el-button>
                <el-button v-if="isInboundOperation" size="mini" type="text" @click="handleInboundOperation(row)">
                  入库
                </el-button>
                <template v-if="isPackingOperation">
                  <el-button size="mini" type="text" :disabled="!(row.deliveryStatus === 'arranged')" @click="handlePackingOperation(row)">
                    装箱
                  </el-button>
                  <el-button size="mini" type="text" :disabled="!isRowPacked(row)" @click="handlePackingEdit(row,'packing','edit')">
                    编辑装箱单
                  </el-button>
                </template>
              </div>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination
          :total="totalCount"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="loadTableData()"
        />
      </div>
    </div>

    <PrintDialog
      :visible.sync="isPrintDialogVisible"
      @closePrint="closePrintDialog"
      @printSubmit="executePrint"
      :printQuery="printConfig"
      :enCode="currentPrintTemplateCode"
      ref="printTemplate"
    />
    <BatchPrintBrowse ref="batchPrint" :fullName="currentPrintTemplateName"/>

    <!-- 业务组件 -->
    <AutoRecBatchPacking
      ref="AutoRecBatchPacking"
      v-if="isBatchPackingDialogVisible"
      @close="closeDialog"
    />
    <PackingForm
      ref="PackingForm"
      v-if="isPackingDialogVisible"
      @close="closeDialog"
    />
    <InboundForm
      ref="InboundForm"
      v-if="isInboundDialogVisible"
      @close="closeDialog"
    />
    <OutboundForm
      ref="OutboundForm"
      v-if="isOutboundDialogVisible"
      @close="closeDialog"
    />
    <SingleBoxPrintDialog
      ref="singleBoxPrintDialog"
      @confirm="handleSingleBoxPrint"
    />
    <!-- 详情组件 -->
    <component
      v-if="hasDetailComponent && isDetailDialogVisible"
      :is="currentBusinessConfig.detailConfig.component"
      ref="detailComponent"
      @close="currentBusinessConfig.detailConfig.visible = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.business-process-container {
  display: flex;
  align-items: center;
  padding: 5px 0 5px 10px;
  margin: 0;
  background: #ffffff;

  ::v-deep .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
  }

  ::v-deep .el-radio-button:first-child:last-child .el-radio-button__inner {
    border-radius: 0 !important;
  }

  ::v-deep .el-badge__content {
    top: 3px;
    right: 24px;
    z-index: 99;
  }
}
</style>
