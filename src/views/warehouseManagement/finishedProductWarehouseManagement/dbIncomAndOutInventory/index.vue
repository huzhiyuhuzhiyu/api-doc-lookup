<script>
import SuperQuery from '@/components/SuperQuery/index.vue'

import {getButtonList, getColumns, getSearchList} from "./data";
import {getPrintBusInfo} from "@/api/system/printDev";
import {getStockMoveList} from "@/api/salesManagement";
import {getClassAttributeListByCode} from "@/api/masterDataManagement";
import {getQuotationdatasendlist, purchaseOrderList} from "@/api/orderFollow";
import {deepClone} from "@/utils";

import {purPurchaseReceiptReturnGoodsList} from "@/api/purchasingAndOutsourcingOrders";
import {getStockPickedPage} from "@/api/batchPacking";


import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";

import outboundSaleSendForm from "@/views/salesManagement/shippingnotice/saleMetalworking/Form.vue";

import packingForm from './module/packingForm.vue'
import autoRecBatchPacking from "./module/components/autoRecBatchPacking.vue";
import InboundForm from "./module/inboundForm.vue";
import {getStockPlanPalletPage} from "@/api/PackagingPalletPlan";

export default {
  name: "index",
  components: {
    InboundForm,
    outboundSaleSendForm,
    autoRecBatchPacking,
    packingForm,
    BatchPrintBrowse,
    PrintDialog,
    SuperQuery,
  },
  props: {
    warehouseCode: {
      type: String,
      default: 'finish_product'
    }
  },
  data() {
    return {
      loading: false,
      autoRecBatchPackingFormVisible: false,
      packingFormVisible: false,
      printVisible: false,
      inboundFormVisible: false,
      printQuery: {
        category: ''
      },
      fullName: '',
      enCode: '',
      tableData: [],
      total: 0,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'priority',
          label: "发货优先级",
          type: 'select',
          options: this.global.shippingPriority
        },
      ],
      initListQuery: {},
      searchList: getSearchList('default'),
      listQuery: {},
      btnList: getButtonList('default'),
      columnList: [],
      columnsConfig: getColumns('default'),

      selectedRow: [],
      classAttributeList: [],
      businessTypeData: this.getDictDataSync('warehouseBusinessType'),
      activeProcess: '',
      processes: [],
      operationWidth: '160',
      commonQueryConfig: {
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        superQuery: {},
        pageNum: 1,
        pageSize: 20
      },
      businessTypeConfig: {
        // 生产领料入库
        outbound_pick_out: {
          api: purPurchaseReceiptReturnGoodsList,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            cooperativePartnerCode: '',
            notificationType: 'external_process',
            returnDeliveryType: 'back',
            documentStatus: 'submit',
            approvalStatus: 'ok',
            receivingStatus: 'not_finished',
            classAttributeList: this.classAttributeList,
          },
        },
        // 销售发货出库 （销售发货出库 功能：装箱单&推荐批次）
        outbound_sale_send: {
          api: getQuotationdatasendlist,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            notifyType: "sale",
            returnDeliveryType: 'delivery',
            deliveryStatus: '',
            approvalStatus: 'ok',
          },
          viewForm: 'outboundSaleSendForm',
          rowId: 'id',
          visible: false
        },
        // 销售退货入库
        inbound_sale_return: {
          api: getQuotationdatasendlist,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            cooperativePartnerCode: '',
            priority: '',
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
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            notifyType: "sale",
            returnDeliveryType: 'delivery',
            deliveryStatus: '',
            approvalStatus: 'ok',
          },
        },
        // 成品包装入库
        inbound_finished_package: {
          api: getStockPlanPalletPage,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            waitStock: true,
          },
        },
        // 采购收货入库
        inbound_purchase: {
          api: purchaseOrderList,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            cooperativePartnerCode: '',
            orderType: "procure",
            approvalStatus: 'ok',
          },
        },
        // 采购退货出库
        outbound_purchase: {
          api: purPurchaseReceiptReturnGoodsList,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            cooperativePartnerCode: '',
            receiptReturnType: "back",
            approvalStatus: 'ok',
          },
        },
        // 外协发料出库
        outbound_external_send: {
          api: getQuotationdatasendlist,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            cooperativePartnerCode: '',
            classAttributeList: this.classAttributeList,
            approvalStatus: 'ok',
          },
        },
        // 外协退料入库
        inbound_external_return: {
          api: getQuotationdatasendlist,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            cooperativePartnerCode: '',
            inspectionStatus: 'inspected',
            classAttributeList: this.classAttributeList,
            receiptReturnType: "back",
            approvalStatus: 'ok',
          },
        },
        // 外协收货入库
        inbound_external: {
          api: purPurchaseReceiptReturnGoodsList,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            cooperativePartnerCode: '',
            receiptInboundFlag: 1,
            receiptReturnType: "back",
            approvalStatus: 'ok',
          },
        },
        // 外协退货出库
        outbound_external: {
          api: purPurchaseReceiptReturnGoodsList,
          initListQuery: {
            ...this.commonQueryConfig,
            orderNo: '',
            cooperativePartnerName: '',
            cooperativePartnerCode: '',
            notificationType: 'external_process',
            returnDeliveryType: 'back',
            documentStatus: 'submit',
            approvalStatus: 'ok',
            receivingStatus: 'not_finished',
            classAttributeList: this.classAttributeList,
          },
        },

      }
    }
  },
  computed: {
    currentTypeConfig() {
      return this.businessTypeConfig[this.activeProcess] || {};
    },
    // 出库
    isOutbound() {
      return ['outbound_purchase', 'outbound_external_send', 'outbound_external', 'finished_product_picking_send'].includes(this.activeProcess);
    },
    // 入库
    isInbound() {
      return ['inbound_purchase', 'inbound_sale_return', 'inbound_external_return', 'inbound_external', 'inbound_finished_package'].includes(this.activeProcess);
    },
    // 装箱
    isPacking() {
      return ['outbound_sale_send'].includes(this.activeProcess);
    },
    // 已装箱
    isPacked() {
      return (row) =>
        row.packingStatus === 'boxed' &&
        row.deliveryStatus === 'arranged';
    }
  },
  watch: {
    activeProcess(newVal) {
      this.switchBusinessType(newVal);
    }
  },
  async created() {
    await this.getClassAttributeListByCode();
    await this.getStockMoveList();
    await this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        if (!this.currentTypeConfig || !this.currentTypeConfig.api) return
        const res = await this.currentTypeConfig.api(this.listQuery);
        const {total, records} = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },

    calculateOperationWidth() {
      this.$nextTick(() => {
        if (this.$refs.operationButtons) {
          const buttons = this.$refs.operationButtons.querySelectorAll('.el-button');
          let totalWidth = 0;
          buttons.forEach(button => {
            const buttonWidth = button.offsetWidth;
            totalWidth += buttonWidth;
          });
          this.operationWidth = totalWidth + (buttons.length * 10) + 20;
        }
      });
    },

    validateSelectedRows() {
      if (!this.selectedRow.length) {
        this.$message.warning('请至少选择一条数据');
        return false;
      }
      if (this.selectedRow.length > 1) {
        this.$message.warning('只能选择一条数据');
        return false;
      }
      return true;
    },

    handleButtonClick(type) {
      switch (type) {
        case 'outboundSaleSendConfirm':
          if (!this.validateSelectedRows()) return;
          const outboundSaleSendConfirmStatus = new Set(['waiting', 'verified', 'finished', 'canceled'])
          if (outboundSaleSendConfirmStatus.has(this.selectedRow[0].deliveryStatus)) {
            this.$message.warning('当前状态不允许操作');
            return;
          }
          this.onPackingForm(this.selectedRow[0], 'confirm')
          break;
      }
    },

    // 装箱
    handlePacking(row) {
      this.onPackingForm(row, 'packing')
    },
    // 装箱&批次编辑
    handlePackingEdit(row, actionType, btnType) {
      this.autoRecBatchPackingFormVisible = true;
      this.$nextTick(() => {
        this.$refs.autoRecBatchPacking.init({
          id: row.id,
          formType: actionType,
          type: btnType,
        })
      })
    },

    handleOutbound(row) {

    },

    handleInbound(row) {
      this.inboundFormVisible = true;
      this.$nextTick(() => {
        this.$refs.inboundForm.init({
          id: '',
          prefillData: row,
          btnType: 'add',
          businessType: this.activeProcess,
          classAttributeList: this.classAttributeList,
          warehouseCode: this.warehouseCode
        })
      })
    },

    handleView(row) {
      if (!this.currentTypeConfig ||
        !this.currentTypeConfig.viewForm ||
        !this.currentTypeConfig.rowId) {
        this.$message.warning('当前业务类型不支持查看详情')
        return
      }
      this.currentTypeConfig.visible = true
      this.$nextTick(() => {
        this.$refs[this.currentTypeConfig.viewForm].init(row[this.currentTypeConfig.rowId], 'look')
      })
    },

    onPackingForm(row, btnType) {
      this.packingFormVisible = true
      this.$nextTick(() => {
        this.$refs.packingForm.init({
          id: row.id,
          btnType: btnType,
          businessType: this.activeProcess,
          classAttributeList: this.classAttributeList,
          warehouseCode: this.warehouseCode
        })
      })
    },


    switchBusinessType(businessType) {
      const config = this.businessTypeConfig[businessType];
      if (!config) return;
      this.btnList = getButtonList(businessType)
      this.columnsConfig = getColumns(businessType);
      this.searchList = getSearchList(businessType);
      this.initListQuery = config.initListQuery || {};
      this.listQuery = deepClone(this.initListQuery);
      this.calculateOperationWidth()
      this.$nextTick(() => {
        this.$refs.dataTable.doLayout()
        this.initData()
      })
    },

    async getClassAttributeListByCode() {
      const res = await getClassAttributeListByCode({code: this.warehouseCode});
      this.classAttributeList = res.data || [];
    },

    async getStockMoveList() {
      const res = await getStockMoveList(this.classAttributeList, this.warehouseCode);
      this.processes = res.data.map(item => ({
        ...item, name: this.businessTypeData.find(type => type.value === item.businessType).label,
        num: item.todoNum
      }))
      this.activeProcess = this.processes[0].businessType
    },

    closePrint() {
      this.printVisible = false
    },

    printView(row, enCode, fullName) {
      this.selectedRow = [row]
      this.enCode = enCode
      this.fullName = fullName
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(enCode)
      })
    },

    async printOrder(enCode) {
      try {
        const res = await getPrintBusInfo(enCode)
        if (!res.data) {
          return this.$message.warning('未找到相应打印模版')
        }
        const id = res.data.id
        const printData = this.selectedRow.map(item => ({
          formId: item.id,
          id: id
        }))
        this.$refs.batchPrint.print(printData);
      } catch (e) {
      }
    },

    async close(isInitData = true) {
      this.packingFormVisible = false
      this.autoRecBatchPackingFormVisible = false
      this.inboundFormVisible = false
      if (!isInitData) return
      await this.initData()
    },

    sortChange({prop, order}) {
      let newProp = ''
      if (prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    getAlign(align) {
      return align || 'center'
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.initData()
    },
    search() {
      this.searchList.forEach(item => {
        this.listQuery[item.prop] = item.fieldValue;
      });
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.searchList = getSearchList(this.activeProcess)
      this.search()
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <div class="business-process-container JNPF-common-search-box">
        <el-radio-group v-model="activeProcess">
          <template v-for="(process, index) in processes">
            <el-badge :value="process.num" :max="99" :key="index" :hidden="!process.num">
              <el-radio-button :label="process.businessType">
                {{ process.name }}
              </el-radio-button>
            </el-badge>
          </template>
        </el-radio-group>
      </div>
      <el-row class="JNPF-common-search-box" :gutter="16" style="margin-top: 5px !important;">
        <el-form @submit.native.prevent @keyup.enter.native="search()">
          <template v-for="item in searchList">
            <el-col :span="4" :key="item.prop">
              <el-form-item>
                <el-input v-if="item.searchType === 'input'" v-model="item.fieldValue"
                  :placeholder="'请输入' + item.label"
                  clearable/>
                <el-select v-else-if="item.searchType === 'select'" v-model="item.fieldValue"
                  @change="search('basic')"
                  :placeholder="'请选择' + item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2"
                    :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 'date'" v-model="item.fieldValue"
                  :type="item.type" :value-format="item.valueFormat"
                  :placeholder="'请选择' + item.label"
                  clearable @keyup.enter.native="search('basic')"/>
                <el-date-picker v-else-if="item.searchType === 'daterange'" v-model="item.fieldValue"
                  :type="item.type" :value-format="item.valueFormat"
                  :picker-options="item.pickerOptions"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'"
                  clearable @keyup.enter.native="search('basic')"/>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search"
                @click="search('basic')">查询
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <CustomButton
              :btnList="btnList"
              @click="handleButtonClick"
            />
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                @click="columnSetFun()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()"/>
            </el-tooltip>
          </div>
        </div>
        <JNPF-table customKey="hsCodes"
          v-loading="loading"
          :data="tableData"
          :row-key="'id'"
          :hasC="true"
          fixedNO
          :setColumnDisplayList="columnList"
          @selection-change="(val)=> selectedRow = val"
          @sort-change="sortChange"
          ref="dataTable"
          custom-column>
          <template v-for="column in columnsConfig">
            <el-table-column
              v-if="typeof column.show === 'function' ? column.show() : true"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth"
              :sortable="column.sortable"
              :fixed="column.fixed"
              :align="getAlign(column.align)"
            >
              <template v-if="column.slot" v-slot="scope">
                <template v-if="column.prop === 'orderNo'">
                  <el-link type="primary"
                    @click.native="handleView(scope.row)">{{
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
          <el-table-column label="操作" :width="operationWidth" fixed="right">
            <template slot-scope="{ row }">
              <div ref="operationButtons" class="operation-buttons">
                <el-button v-if="isOutbound" size="mini" type="text" @click="handleOutbound(row)">
                  出库
                </el-button>
                <el-button v-if="isInbound" size="mini" type="text" @click="handleInbound(row)">
                  入库
                </el-button>
                <template v-if="isPacking">
                  <el-button size="mini" type="text" :disabled="!(row.deliveryStatus === 'arranged')" @click="handlePacking(row)">
                    装箱
                  </el-button>
                  <el-button size="mini" type="text" :disabled="!isPacked(row)" @click="handlePackingEdit(row,'packing','edit')">
                    编辑装箱单
                  </el-button>
                </template>
              </div>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery partentOrChild="TransitionApplicationRecordQuery" :show="superQueryVisible" ref="SuperQuery"
      table-ref="dataTable"
      :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate"/>
    <BatchPrintBrowse ref="batchPrint" :fullName="fullName"/>
    <!--  装箱&批次  -->
    <autoRecBatchPacking ref="autoRecBatchPacking" v-if="autoRecBatchPackingFormVisible" @close="close"/>
    <packingForm ref="packingForm" v-if="packingFormVisible" @close="close"/>
    <!--  入库  -->
    <inboundForm ref="inboundForm" v-if="inboundFormVisible" @close="close"/>
    <!--  详情  -->
    <outboundSaleSendForm ref="outboundSaleSendForm" v-if="currentTypeConfig.visible" @close="currentTypeConfig.visible = false"/>
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
