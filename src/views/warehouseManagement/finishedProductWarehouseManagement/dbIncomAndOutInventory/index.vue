<script>
import { getButtonList, getColumns, getSystemSearchView } from "./data";
import { getPrintBusInfo } from "@/api/system/printDev";
import { getStockMoveList } from "@/api/salesManagement";
import { getClassAttributeListByCode } from "@/api/masterDataManagement";
import { getQuotationdatasendlist } from "@/api/orderFollow";

import { purPurchaseReceiptReturnGoodsList } from "@/api/purchasingAndOutsourcingOrders";
import { getStockPickedPage } from "@/api/batchPacking";
import { getStockPlanPalletPage } from "@/api/PackagingPalletPlan";

// 组件导入
import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import outboundSaleSendForm from "@/views/salesManagement/shippingnotice/saleMetalworking/Form.vue";
import packingForm from './module/packingForm.vue'
import autoRecBatchPacking from "./module/components/autoRecBatchPacking.vue";
import InboundForm from "./module/inboundForm.vue";

export default {
  name: "WarehouseBusinessProcess",
  components: {
    outboundSaleSendForm,
    InboundForm,
    autoRecBatchPacking,
    packingForm,
    BatchPrintBrowse,
    PrintDialog,
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
      isBatchPackingDialogVisible: false,
      isPackingDialogVisible: false,
      isPrintDialogVisible: false,
      isInboundDialogVisible: false,

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
      return {
        // 生产领料入库
        outbound_pick_out: {
          api: purPurchaseReceiptReturnGoodsList,
          initListQuery: {
            notificationType: 'external_process',
            returnDeliveryType: 'back',
            documentStatus: 'submit',
            approvalStatus: 'ok',
            receivingStatus: 'not_finished',
            classAttributeList: classAttr
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
            classAttributeList: classAttr
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
            classAttributeList: classAttr,
            approvalStatus: 'ok',
          },
        },
        // 外协退料入库
        inbound_external_return: {
          api: getQuotationdatasendlist,
          initListQuery: {
            inspectionStatus: 'inspected',
            classAttributeList: classAttr,
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
            classAttributeList: classAttr,
          },
        },
      }
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
      return ['outbound_purchase', 'outbound_external_send', 'outbound_external', 'finished_product_picking_send']
        .includes(this.activeBusinessType);
    },
    // 入库
    isInboundOperation() {
      return ['inbound_purchase', 'inbound_sale_return', 'inbound_external_return', 'inbound_external', 'inbound_finished_package']
        .includes(this.activeBusinessType);
    },
    // 装箱
    isPackingOperation() {
      return ['outbound_sale_send'].includes(this.activeBusinessType);
    },
    // 已装箱
    isRowPacked() {
      return (row) => row.packingStatus === 'boxed' && row.deliveryStatus === 'arranged';
    }
  },
  async created() {
    await this.initializePageData();
  },
  methods: {
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

    adjustTableLayout() {
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
        if (!this.currentBusinessConfig?.api) return;

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
      }
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
        this.$refs.autoRecBatchPacking.init({
          id: row.id,
          formType: actionType,
          type: buttonType,
        });
      });
    },

    handleOutboundOperation(row) {
    },

    handleInboundOperation(row) {
      this.isInboundDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.inboundForm.init({
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
        this.$refs.packingForm.init({
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

    async executePrint(templateCode) {
      try {
        const response = await getPrintBusInfo(templateCode);
        if (!response.data) {
          return this.$message.warning('未找到相应打印模版');
        }

        const templateId = response.data.id;
        const printData = this.selectedRows.map(item => ({
          formId: item.id,
          id: templateId
        }));

        this.$refs.batchPrint.print(printData);
      } catch ( error ) {
        console.error('打印错误:', error);
      }
    },

    closePrintDialog() {
      this.isPrintDialogVisible = false;
    },

    closeDialog(shouldReloadData = true) {
      this.isPackingDialogVisible = false;
      this.isBatchPackingDialogVisible = false;
      this.isInboundDialogVisible = false;

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
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <div class="business-process-container JNPF-common-search-box">
        <el-radio-group v-model="activeBusinessType" @change="handleBusinessTypeChange">
          <template v-for="(process, index) in availableBusinessTypes">
            <el-badge :value="process.pendingCount" :max="99" :key="index" :hidden="!process.pendingCount">
              <el-radio-button :label="process.businessType">
                {{ process.name }}
              </el-radio-button>
            </el-badge>
          </template>
        </el-radio-group>
      </div>
      <JNPF-tableQuery :key="`search-${activeBusinessType}`" :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable"/>
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
          :customKey="`dbIncomAndOutInventoryIndex${activeBusinessType}`"
          v-loading="loading"
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
              v-if="typeof column.show === 'function' ? column.show() : true"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth"
              :sortable="column.sortable"
              :fixed="column.fixed"
              :align="getColumnAlignment(column.align)"
            >
              <template v-if="column.slot" v-slot="scope">
                <template v-if="column.prop === 'orderNo'">
                  <el-link type="primary"
                           @click.native="handleDetailView(scope.row)">{{
                      scope.row.orderNo
                    }}
                  </el-link>
                </template>
                <template v-if="column.prop === 'hairExchangeGoodsFlag'">
                  <span>
                    {{ scope.row.exchangeGoodsFlag ? '换货发货' : '正常发货' }}
                  </span>
                </template>
                <template v-if="column.prop === 'retreatExchangeGoodsFlag'">
                  <span>
                    {{ scope.row.exchangeGoodsFlag ? '换货' : '退货' }}
                  </span>
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
    <autoRecBatchPacking
      ref="autoRecBatchPacking"
      v-if="isBatchPackingDialogVisible"
      @close="closeDialog"
    />
    <packingForm
      ref="packingForm"
      v-if="isPackingDialogVisible"
      @close="closeDialog"
    />
    <inboundForm
      ref="inboundForm"
      v-if="isInboundDialogVisible"
      @close="closeDialog"
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
