<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">

      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">

        <el-form @submit.native.prevent>



          <template v-for="item in searchList">

            <el-col :span="item.searchType === 3 ? 6 : 4">

              <el-form-item>

                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="search('basic')" />



                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>

                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>

                </el-select>

                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>

              </el-form-item>

            </el-col>
          </template>

          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.businessType" placeholder="业务类型" style="width: 100%;" clearable>
                <el-option v-for="(item, index) in list" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button v-has="'btn_withdraw'"   :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="iconfont-menu  icon-chehui" @click="withdrawFun">撤回</el-button>
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">导出</el-button>
            <el-button v-has="'btn_print_merge'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="printMergeForm">合并打印</el-button>
          </div>

          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>

            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" border :setColumnDisplayList="columnList"
        :hasC="['btn_print_merge','btn_withdraw']" :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" :fixedNO="true"
          @sort-change="sortChange" custom-column customKey="JNPFTableKey_962568">
          <el-table-column prop="orderNo" label="单号" sortable="custom" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewFun(scope.row.id, 'look', scope.row)">

                {{ scope.row.orderNo }}

              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="businessType" label="业务类型" sortable="custom" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'outbound_sale_send'">

                销售发货</div>

              <div v-if="scope.row.businessType == 'inbound_sale_return'">销售退货</div>

              <div v-if="scope.row.businessType == 'inbound_purchase'">采购收货</div>

              <div v-if="scope.row.businessType == 'outbound_purchase'">采购退货</div>

              <div v-if="scope.row.businessType == 'outbound_pick_out'">生产领料</div>

              <div v-if="scope.row.businessType == 'inbound_return_materials'">生产退料</div>

              <div v-if="scope.row.businessType == 'outbound_external_send'">外协发料</div>

              <div v-if="scope.row.businessType == 'inbound_external_return'">外协退料</div>

              <div v-if="scope.row.businessType == 'inbound_external'">外协收货</div>

              <div v-if="scope.row.businessType == 'inbound_other'">直接入库</div>

              <div v-if="scope.row.businessType == 'outbound_other'">直接出库</div>

              <div v-if="scope.row.businessType == 'outbound_transfer'">调拨出库</div>

              <div v-if="scope.row.businessType == 'inbound_transfer'">调拨入库</div>

              <div v-if="scope.row.businessType == 'inbound_receive_material'">直接领料入库</div>

              <div v-if="scope.row.businessType == 'outbound_receive_material'">直接领料出库</div>

              <div v-if="scope.row.businessType == 'inbound_production'">生产工单入库</div>

              <div v-if="scope.row.businessType == 'inbound_order_production'">生产产品入库</div>

              <div v-if="scope.row.businessType == 'inbound_flip'">翻库入库</div>



              <div v-if="scope.row.businessType == 'outbound_use'">资产领用</div>

              <div v-if="scope.row.businessType == 'inbound_return'">资产归还</div>

              <div v-if="scope.row.businessType == 'inbound_taking_adjust'">盘点调整入库</div>

              <div v-if="scope.row.businessType == 'outbound_taking_adjust'">盘点调整出库</div>

              <div v-if="scope.row.businessType == 'inbound_merge'">组装入库</div>

              <div v-if="scope.row.businessType == 'inbound_split'">拆卸入库</div>

              <div v-if="scope.row.businessType == 'inbound_shift'">形态转换入库</div>

              <div v-if="scope.row.businessType == 'outbound_merge'">组装出库</div>

              <div v-if="scope.row.businessType == 'outbound_split'">拆卸出库</div>

              <div v-if="scope.row.businessType == 'outbound_shift'">形态转换出库</div>
            </template>
          </el-table-column>
          <el-table-column prop="sourceType" label="来源类型" sortable="custom" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.sourceType == 'order'">

                订单</div>

              <div v-if="scope.row.sourceType == 'notice'">通知单</div>

              <div v-if="scope.row.sourceType == 'direct'">直接出入库</div>

              <div v-if="scope.row.sourceType == 'io_other'">其他</div>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="客户/供应商" sortable="custom" min-width="160" v-if="userInfo.roleCode.split(',').includes('show_warehouse_data') && userInfo.roleCode.split(',').includes('show_cooperativePartnerIdName_data')">

          </el-table-column>
          <el-table-column prop="partnerCode" label="客户/供应商编码" sortable="custom" min-width="180" v-if="userInfo.roleCode.split(',').includes('show_warehouse_data') && userInfo.roleCode.split(',').includes('show_cooperativePartnerIdName_data')"></el-table-column>
          <el-table-column prop="inspectionResults" label="检验标志" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.inspectionResults == 'qualified'">

                合格</el-tag>

              <el-tag type="danger" v-else-if="scope.row.inspectionResults == 'unqualified'">不合格</el-tag>

              <el-tag v-else-if="scope.row.inspectionResults == 'unInspect'">待检验</el-tag>
            </template>

          </el-table-column>
          <el-table-column prop="orderDate" label="单据日期" min-width="120" />
          <el-table-column prop="documentStatus" label="单据状态" min-width="120">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">

                草稿</el-tag>

              <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>

              <el-tag type="danger" v-else-if="scope.row.documentStatus == 'back'">撤回</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'">

                <el-tag>审批中</el-tag>

              </div>

              <div v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'">

                <el-tag type="success">审批通过</el-tag>

              </div>

              <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'">

                <el-tag type="danger">审批拒绝</el-tag>

              </div>

              <div v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">

                <el-tag type="warning">审批撤回</el-tag>

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="180" />
          <el-table-column prop="createByName" label="创建人" width="120" />
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                :delDisabled="scope.row.documentStatus == 'submit'"
                :editDisabled="scope.row.documentStatus == 'submit'||scope.row.documentStatus=='back' "
                @edit="viewFun(scope.row.id, 'edit', scope.row)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="viewFun(scope.row.id, 'look', scope.row)">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item type="text"
                      :disabled="!((scope.row.businessType == 'inbound_purchase' || scope.row.businessType == 'inbound_sale_return' || scope.row.businessType == 'outbound_sale_send' || scope.row.businessType == 'inbound_external' || scope.row.businessType == 'outbound_external_send' || scope.row.businessType == 'outbound_purchase') || (scope.row.businessType == 'outbound_pick_out' && isMS) && scope.row.documentStatus == 'submit')"
                      @click.native="PrintFun(scope.row)">打印</el-dropdown-item>
                    <el-dropdown-item type="text" v-if="isPrintNBWSwitch === '1'"
                      :disabled="!((scope.row.businessType == 'inbound_purchase' || scope.row.businessType == 'inbound_sale_return' || scope.row.businessType == 'outbound_sale_send' || scope.row.businessType == 'inbound_external' || scope.row.businessType == 'outbound_external_send' || scope.row.businessType == 'outbound_purchase') || scope.row.businessType == 'outbound_pick_out' && scope.row.documentStatus == 'submit')"
                      @click.native="nbwPrintFun(scope.row)">能博旺打印</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData">
        </pagination>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" :warehouseCode="warehouseCode" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <ProductInboundForm v-if="productInboundFormVisible" ref="productInboundREFForm" @close="closeForm">
    </ProductInboundForm>
    <WorkInboundForm v-if="workInboundFormVisible" ref="workInboundREFForm" @close="closeForm">
    </WorkInboundForm>
    <OutboundSaleSendForm v-if="outboundSaleSendFormVisible" ref="outboundSaleSendREFForm" @close="closeForm">
    </OutboundSaleSendForm>
    <InboundSaleReturnForm v-if="inboundSaleReturnFormVisible" ref="inboundSaleReturnREFForm" @close="closeForm">
    </InboundSaleReturnForm>
    <InboundPurchaseForm v-if="inboundPurchaseFormVisible" ref="inboundPurchaseREFForm" @close="closeForm">
    </InboundPurchaseForm>
    <OutboundPurchaseForm v-if="outboundPurchaseFormVisible" ref="outboundPurchaseREFForm" @close="closeForm">
    </OutboundPurchaseForm>
    <OutboundExternalSendForm v-if="outboundExternalSendFormVisible" ref="outboundExternalSendREFForm"
      @close="closeForm">
    </OutboundExternalSendForm>
    <InboundExternalForm v-if="inboundExternalFormVisible" ref="inboundExternalREFForm" @close="closeForm">
    </InboundExternalForm>
    <OutboundPickOutForm v-if="outboundPickOutFormVisible" ref="outboundPickOutREFForm" @close="closeForm">
    </OutboundPickOutForm>
    <InboundReturnMaterialsForm v-if="inboundReturnMaterialsFormVisible" ref="inboundReturnMaterialsREFForm"
      @close="closeForm">
    </InboundReturnMaterialsForm>
    <Transfer v-if="transferFormVisible" ref="transferREFForm" @close="closeForm"></Transfer>
    <SaleOutboundForm v-if="saleOutboundFormVisible" ref="saleOutboundREFForm" @close="closeForm"></SaleOutboundForm>
    <PurchaseOrderInboundForm v-if="PurchaseOrderInboundFormVisible" ref="PurchaseOrderInboundREFForm"
      @close="closeForm">
    </PurchaseOrderInboundForm>
    <ExternalMaterOutboundForm v-if="externalMaterOutboundFormVisible" ref="externalMaterOutboundREFForm"
      @close="closeForm">
    </ExternalMaterOutboundForm>
    <ExternalInboundForm v-if="externalInboundFormVisible" ref="externalInboundREFForm" @close="closeForm">
    </ExternalInboundForm>
    <outboundUseForm v-if="outboundUseVisible" ref="outboundUseREFForm" @close="closeForm">
    </outboundUseForm>
    <InboundReturnForm v-if="inboundReturnVisible" ref="inboundReturnREFForm" @close="closeForm"></InboundReturnForm>
    <TakingAdjustForm v-if="takingAdjustVisible" ref="takingAdjustREFForm" @close="closeForm"></TakingAdjustForm>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
  </div>
</template>

<script>
import { getInventoryDetailList, getInventorySummaryData, withdrawApi } from '@/api/warehouseManagement/inventory'
import { getWarehouseList, deleteWarehouseData, getWarehouseTree, detailWarehouseData } from '@/api/warehouseManagement/inboundAndOutbound'
import { excelExport, getWarehouseInfo } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import ProductInboundForm from '../dbIncomAndOutInventory/productInboundForm.vue'
import WorkInboundForm from '../dbIncomAndOutInventory/workInboundForm.vue'
import OutboundSaleSendForm from '../dbIncomAndOutInventory/outboundSaleSendForm.vue'
import InboundSaleReturnForm from '../dbIncomAndOutInventory/inboundSaleReturnForm.vue'
import InboundPurchaseForm from '../dbIncomAndOutInventory/inboundPurchaseForm.vue'
import OutboundPurchaseForm from '../dbIncomAndOutInventory/outboundPurchaseForm.vue'
import OutboundExternalSendForm from '../dbIncomAndOutInventory/outboundExternalSendForm.vue'
import InboundExternalForm from '../dbIncomAndOutInventory/inboundExternalForm.vue'
import OutboundPickOutForm from '../dbIncomAndOutInventory/outboundPickOutForm.vue'
import InboundReturnMaterialsForm from '../dbIncomAndOutInventory/inboundReturnMaterialsForm.vue'
import Transfer from '../dbIncomAndOutInventory/transferForm.vue'
import { getClassAttributeListByCode } from '@/api/masterDataManagement/index'
import SaleOutboundForm from '../dbIncomAndOutInventory/saleOutboundForm.vue'
import ExternalMaterOutboundForm from '../dbIncomAndOutInventory/externalMaterialsForm.vue'
import PurchaseOrderInboundForm from '../dbIncomAndOutInventory/purchaseOrderInboundForm.vue'
import ExternalInboundForm from '../dbIncomAndOutInventory/externalInboundForm.vue'
import Form from '../directInandOutWarehouse/index.vue'
import outboundUseForm from '../dbIncomAndOutInventory/equipmentOutboundForm.vue'
import InboundReturnForm from '../dbIncomAndOutInventory/equipmentInboundForm.vue'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo, getPrintDeliveryNote } from '@/api/system/printDev'
import TakingAdjustForm from '@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/adjust.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import tenantMinix from "@/mixins/generator/TenantMinix";
export default {
  name: 'finishedProductWarehouseManagement',
  components: {
    Form,
    ExportForm,
    SuperQuery,
    WorkInboundForm,
    ProductInboundForm,
    OutboundSaleSendForm,
    InboundSaleReturnForm,
    InboundPurchaseForm,
    OutboundPurchaseForm,
    OutboundExternalSendForm,
    InboundExternalForm,
    OutboundPickOutForm,
    InboundReturnMaterialsForm,
    Transfer,
    SaleOutboundForm,
    PurchaseOrderInboundForm,
    ExternalMaterOutboundForm,
    ExternalInboundForm,
    outboundUseForm,
    InboundReturnForm,
    PrintBrowse,
    PrintDialog,
    TakingAdjustForm
  },
  mixins: [getProjectList,tenantMinix],

  props: {
    warehouseCode: "",
  },
  data() {
    return {
      takingAdjustVisible: false,
      printVisible: false,
      isPrintNBWSwitch: '',
      printBrowseVisible: false,
      inboundReturnVisible: false,
      outboundUseVisible: false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '客户/供应商', symbol: 'like', searchType: 1, width: 120 },
      ],
      externalMaterOutboundFormVisible: false,
      PurchaseOrderInboundFormVisible: false,
      outboundSaleSendFormVisible: false,
      workInboundFormVisible: false,
      productInboundFormVisible: false,
      inboundSaleReturnFormVisible: false,
      inboundPurchaseFormVisible: false,
      outboundPurchaseFormVisible: false,
      outboundExternalSendFormVisible: false,
      inboundExternalFormVisible: false,
      outboundPickOutFormVisible: false,
      inboundReturnMaterialsFormVisible: false,
      transferFormVisible: false,
      saleOutboundFormVisible: false,
      externalInboundFormVisible: false,

      columnList: ["partnerCode", "inspectionResults",  "remark", "createByName", 'sourceType'],

      exportFormVisible: false,
      visible: false,
      tableData: [],
      listLoading: false,

      list: [
        { label: "销售发货", value: "outbound_sale_send" },
        { label: "销售退货", value: "inbound_sale_return" },
        { label: "采购收货", value: "inbound_purchase" },
        { label: "采购退货", value: "outbound_purchase" },
        { label: "生产领料", value: "outbound_pick_out" },
        { label: "生产退料", value: "inbound_return_materials" },
        { label: "生产产品入库", value: "inbound_order_production" },
        { label: "生产工单入库", value: "inbound_production" },
        { label: "翻库入库", value: "inbound_flip" },

        { label: "外协发料", value: "outbound_external_send" },
        // { label: "外协退料", value: "inbound_external_return" },
        { label: "外协收货", value: "inbound_external" },
        { label: "直接入库", value: "inbound_other" },
        { label: "直接出库", value: "outbound_other" },
        { label: "直接领料入库", value: "inbound_receive_material" },
        { label: "直接领料出库", value: "outbound_receive_material" },
        { label: "调拨出库", value: "outbound_transfer" },
        { label: "调拨入库", value: "inbound_transfer" },
        { label: "资产领用", value: "outbound_use" },
        { label: "资产归还", value: "inbound_return" },
        { label: "盘点调整入库", value: "inbound_taking_adjust" },
        { label: "盘点调整出库", value: "outbound_taking_adjust" },
        { label: "组装入库", value: "inbound_merge" },
        { label: "拆卸入库", value: "inbound_split" },
        { label: "形态转换入库", value: "inbound_shift" },
        { label: "组装出库", value: "outbound_merge" },
        { label: "拆卸出库", value: "outbound_split" },
        { label: "形态转换出库", value: "outbound_shift" }
      ],
      superQueryVisible: false,

      initListQuery: {
        businessType: "",
        orderNo: "",
        pageNum: 1,
        partnerName: "",
        pageSize: 20,
        projectId: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "order_date"
        }],
      },
      listQuery: {},
      total: 0,
      formVisible: false,
      selectData: [],
      totalList: [],
      superQueryJson: [{
        prop: 'orderNo',
        label: "单号",
        type: 'input'
      },
      {
        prop: 'orderDate',
        label: '单据日期',
        type: 'daterange',
        valueFormat: "yyyy-MM-dd",
        startPlaceholder: '单据开始日期',
        endPlaceholder: '单据结束日期',
      },
      {
        prop: 'businessType',
        label: "业务类型",
        type: 'select',
        options: [
          { label: "销售发货", value: "outbound_sale_send" },
          { label: "销售退货", value: "inbound_sale_return" },
          { label: "采购收货", value: "inbound_purchase" },
          { label: "采购退货", value: "outbound_purchase" },
          { label: "生产领料", value: "outbound_pick_out" },
          { label: "生产退料", value: "inbound_return_materials" },
          { label: "生产产品入库", value: "inbound_order_production" },
          { label: "生产工单入库", value: "inbound_production" },
          { label: "翻库入库", value: "inbound_flip" },

          { label: "外协发料", value: "outbound_external_send" },
          // { label: "外协退料", value: "inbound_external_return" },
          { label: "外协收货", value: "inbound_external" },
          { label: "直接入库", value: "inbound_other" },
          { label: "直接出库", value: "outbound_other" },
          { label: "直接领料入库", value: "inbound_receive_material" },
          { label: "直接领料出库", value: "outbound_receive_material" },
          { label: "调拨出库", value: "outbound_transfer" },
          { label: "调拨入库", value: "inbound_transfer" },
          { label: "资产领用", value: "outbound_use" },
          { label: "资产归还", value: "inbound_return" },
          { label: "盘点调整入库", value: "inbound_taking_adjust" },
          { label: "盘点调整出库", value: "outbound_taking_adjust" },
          { label: "组装入库", value: "inbound_merge" },
          { label: "拆卸入库", value: "inbound_split" },
          { label: "形态转换入库", value: "inbound_shift" },
          { label: "组装出库", value: "outbound_merge" },
          { label: "拆卸出库", value: "outbound_split" },
          { label: "形态转换出库", value: "outbound_shift" }
        ],
      },
      {
        prop: 'partnerName',
        label: "客户/供应商",
        type: 'input'
      },
      {
        prop: 'partnerCode',
        label: "客户/供应商编码",
        type: 'input'
      },
      {
        prop: 'inspectionResults',
        label: "检验标志",
        type: 'select',
        options: [
          { label: "合格", value: "qualified" },
          { label: "不合格", value: "unqualified" },
          { label: "待检验", value: "unInspect" },
        ]
      },
      {
        prop: 'documentStatus',
        label: "单据状态",
        type: 'select',
        options: [
          { label: "草稿", value: "draft" },
          { label: "提交", value: "submit" }
        ]
      },
      {
        prop: 'documentStatus',
        label: "审批状态",
        type: 'select',
        options: [
          { label: "审批中", value: "ing" },
          { label: "审批通过", value: "ok" },
          { label: "审批拒绝", value: "rebut" },
          { label: "审批撤回", value: "withdrawn" },
        ]
      },
      {
        prop: 'createByName',
        label: "创建人",
        type: 'input',
      }, {
        prop: 'remark',
        label: "备注",
        type: 'input',
      }, {
        prop: 'createTime',
        label: '创建时间',
        type: 'datetimerange',
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        startPlaceholder: '创建开始时间',
        endPlaceholder: '创建结束时间',
        pickerOptions: this.global.timePickerOptions
      },

      ],
      classAttributeList: [],
      selectArr: [],
      arr: [{
        businessType: 'inbound_purchase',
        code: "p017",
        fullName: "采购收货单"
      },
      {
        businessType: 'outbound_purchase',
        code: "p008",
        fullName: "采购退货"
      },
      {
        businessType: 'outbound_external_send',
        code: "p013",
        fullName: "外协发料单"
      },
      {
        businessType: 'inbound_external',
        code: "p019",
        fullName: "外协收货单"
      },
      {
        businessType: 'outbound_sale_send',
        code: "p031",
        fullName: "销售发货单"
      },
      {
        businessType: 'inbound_sale_return',
        code: "p031",
        fullName: "销售退库单"
      },
      {
        businessType: 'outbound_pick_out',
        code: "p062",
        fullName: "生产领料单"
      },
      ],
      enCode: "",
      isProjectSwitch: '',
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },

  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.$store.dispatch('base/getBusinessConfig', 'gobal')
    await this.getPrintNBWSwitch('print', 'print_zy_nbw')
    this.getWarehouseListFun()
    this.superForm = this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
  },
  methods: {
    async getPrintNBWSwitch(code, type) {
      try {
        this.isPrintNBWSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    handleSelectionChange(val) {
      this.selectArr = val

    },
    withdrawFun() {
      if (!this.selectArr.length) return this.$message.error("请选择您要撤回的数据")
      if (this.selectArr.length > 1) return this.$message.error("撤回操作只支持单条数据")
      this.$confirm("您确定撤回该数据吗?", "提示", {
        type: 'warning'
      }).then(() => {
        withdrawApi(this.selectArr[0].id).then(res => {
          this.$message.success('撤回成功')
          this.getclassAttributeList()
        })
      }).catch(() => {

      })

    },
    //禁用复选框
    checkSelectable(row) {





      if (row.sourceType == 'direct' || ((row.sourceType == 'order' || row.sourceType == 'notice') && (row.businessType != 'inbound_flip' && row.businessType != 'inbound_order_production' && row.businessType != 'inbound_production' && row.businessType != 'outbound_use' && row.businessType != 'inbound_return'
      ))) {
        if (row.approvalStatus == 'ok') {
          if (row.documentStatus != 'back') {
            return true

          }
        }
      } else {

        return false
      }
    },

    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.printBrowseVisible = true
          this.printVisible = false

          this.printVisible = false
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    // 打印
    PrintFun(row) {
      console.log(this.arr, row);
      this.enCode = this.arr.find(item => item.businessType === row.businessType).code // 筛选出 businessType 等于 type 的项
      this.formId = row.id
      this.fullName = this.arr.find(item => item.businessType === row.businessType).fullName // 筛选出 businessType 等于 type 的项
      if (row.businessType == 'outbound_sale_send' && row.sourceType == 'notice') {
        this.enCode = 'p003'
        // detailWarehouseData(row.id).then(res => {
        //   console.log("详情", res);
        //   this.formId = res.data.spaceLines[0].noticeId

        // })
      } else if (row.businessType == 'outbound_pick_out' && row.sourceType == 'notice') {
        this.enCode = 'p062'
        // detailWarehouseData(row.id).then(res => {
        //   console.log("详情", res);
        //   this.formId = res.data.spaceLines[0].noticeId

        // })
      }
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    // 合并打印
    printMergeForm() {
      console.log(this.selectArr, '看');

      this.formId = this.selectArr.map(item => item.id).join(',')
      this.enCode = 'p031'
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    nbwPrintFun(row) {
      getPrintDeliveryNote(row.id).then(res => {
        console.log(res, 'res')
        this.jnpf.downloadFile(res.data.url)
      })
    },
    closePrint() {
      this.printVisible = false
    },
    getclassAttributeList() {
      getClassAttributeListByCode({ code: this.warehouseCode }).then(res => {
        console.log("类别属性", res);
        this.classAttributeList = res.data
        this.search('basic')
      })
    },

    // 获取仓库
    getWarehouseListFun() {
      getWarehouseTree({ code: this.warehouseCode }).then(res => {
        // 获取仓库详情信息
        this.initListQuery.projectId = this.listQuery.projectId = this.isProjectSwitch === '1' ? res.data[0].projectId || '' : ''
        this.getclassAttributeList()

      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.productInboundFormVisible = false
      this.workInboundFormVisible = false
      this.outboundSaleSendFormVisible = false
      this.inboundSaleReturnFormVisible = false
      this.inboundPurchaseFormVisible = false
      this.outboundPurchaseFormVisible = false
      this.outboundExternalSendFormVisible = false
      this.inboundExternalFormVisible = false
      this.outboundPickOutFormVisible = false
      this.inboundReturnMaterialsFormVisible = false
      this.transferFormVisible = false
      this.saleOutboundFormVisible = false
      this.externalMaterOutboundFormVisible = false
      this.externalInboundFormVisible = false
      this.PurchaseOrderInboundFormVisible = false
      this.outboundUseVisible = false
      this.inboundReturnVisible = false
      this.takingAdjustVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    viewFun(id, type, row) {

      if (row.businessType == 'inbound_order_production' || row.businessType == 'inbound_flip') {
        if (row.sourceType == 'direct') {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        } else {

          this.productInboundFormVisible = true
          this.$nextTick(() => {
            this.$refs.productInboundREFForm.init(id, type, this.classAttributeList)
          })
        }
      } else if (row.businessType == 'inbound_production') {
        if (row.sourceType == 'direct') {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        } else {
          this.workInboundFormVisible = true
          this.$nextTick(() => {
            this.$refs.workInboundREFForm.init(id, type, this.classAttributeList)
          })
        }
      } else if (row.businessType == 'outbound_sale_send') {
        if (row.sourceType == 'order') {
          this.saleOutboundFormVisible = true
          this.$nextTick(() => {
            this.$refs.saleOutboundREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else if (row.sourceType == 'notice') {
          this.outboundSaleSendFormVisible = true
          this.$nextTick(() => {
            this.$refs.outboundSaleSendREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }
      } else if (row.businessType == 'inbound_sale_return') {


        if (row.sourceType == 'notice') {

          this.inboundSaleReturnFormVisible = true
          this.$nextTick(() => {
            this.$refs.inboundSaleReturnREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }
      } else if (row.businessType == 'inbound_purchase') {
        if (row.sourceType == 'order') {
          this.PurchaseOrderInboundFormVisible = true
          this.$nextTick(() => {
            this.$refs.PurchaseOrderInboundREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else if (row.sourceType == 'notice') {
          this.inboundPurchaseFormVisible = true
          this.$nextTick(() => {
            this.$refs.inboundPurchaseREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }

      } else if (row.businessType == 'outbound_purchase') {
        if (row.sourceType == 'notice') {
          this.outboundPurchaseFormVisible = true
          this.$nextTick(() => {
            this.$refs.outboundPurchaseREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }

      } else if (row.businessType == 'outbound_external_send') {
        if (row.sourceType == 'order') {
          this.externalMaterOutboundFormVisible = true
          this.$nextTick(() => {
            this.$refs.externalMaterOutboundREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else if (row.sourceType == 'notice') {
          this.outboundExternalSendFormVisible = true
          this.$nextTick(() => {
            this.$refs.outboundExternalSendREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }




      } else if (row.businessType == 'inbound_external') {
        if (row.sourceType == 'order') {
          this.externalInboundFormVisible = true
          this.$nextTick(() => {
            this.$refs.externalInboundREFForm.init(id, type, row.businessType, this.classAttributeList, this.warehouseCode, false)
          })
        } else if (row.sourceType == 'notice') {

          this.inboundExternalFormVisible = true
          this.$nextTick(() => {
            this.$refs.inboundExternalREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }
      } else if (row.businessType == 'outbound_pick_out') {

        if (row.sourceType == 'notice') {
          this.outboundPickOutFormVisible = true
          this.$nextTick(() => {
            this.$refs.outboundPickOutREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }

      } else if (row.businessType == 'inbound_return_materials') {


        if (row.sourceType == 'notice') {
          this.inboundReturnMaterialsFormVisible = true
          this.$nextTick(() => {
            this.$refs.inboundReturnMaterialsREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }
      } else if (row.businessType == 'inbound_return_materials') {

        if (row.sourceType == 'notice') {
          this.inboundReturnMaterialsFormVisible = true
          this.$nextTick(() => {
            this.$refs.inboundReturnMaterialsREFForm.init(id, type, row.businessType, this.classAttributeList)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }
      } else if (row.businessType == 'inbound_transfer' || row.businessType == 'outbound_transfer') {

        this.transferFormVisible = true
        this.$nextTick(() => {
          this.$refs.transferREFForm.init(id, type,)
        })
      } else if (row.businessType == 'outbound_use') {

        if (row.sourceType == 'order') {
          this.outboundUseVisible = true
          this.$nextTick(() => {
            this.$refs.outboundUseREFForm.init(id, type,)
          })
        } else {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(id, type, this.warehouseCode)
          })
        }
      } else if (row.businessType == 'inbound_return') {
        this.inboundReturnVisible = true
        this.$nextTick(() => {
          this.$refs.inboundReturnREFForm.init(id, type,)
        })
      } else if (row.businessType == 'inbound_taking_adjust' || row.businessType == 'outbound_taking_adjust') {
        this.takingAdjustVisible = true
        this.$nextTick(() => {
          this.$refs.takingAdjustREFForm.init(id, type,)
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(id, type)
        })
      }

    },

    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init("", 'add')
      })
    },
    // 合计处理

    getInventorySummaryDataFun() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.classAttributeList = this.classAttributeList
      // this.listQuery.approvalStatus = 'ok'

      this.listQuery.projectId = this.isProjectSwitch === '1' ? this.initListQuery.projectId || '' : ''
      if (localStorage.getItem('loginTenant')) {
        this.listQuery.tenant = localStorage.getItem('loginTenant')
      }
      getWarehouseList(this.listQuery).then(res => {

        this.tableData = res.data.records ? res.data.records : []
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef);
        let columnList = domRef.columnList.filter(item => !!item.label && !!item.prop)
        columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
        this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
      } else {
        this.$message({
          message: "暂无数据导出",
          type: "error",
          duration: 1500,
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableData, 'dataTable')


    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        this.listQuery.classAttributeList = this.classAttributeList
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1012',
          exportName: '出入库列表',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },











    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    handeleInfoData(val) {
      this.selectData = val
    },
    initData() {
      this.getInventorySummaryDataFun()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop == 'partnerName' || prop == 'partnerCode') {
        newProp = prop
      } else {

        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },


    search(type) {
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.superForm = this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '客户/供应商', symbol: 'like', searchType: 1, width: 120 },
      ],
        this.initData()
    },

    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteWarehouseData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    releaseFun() {
      if (this.selectData.length) {
        let idList = this.selectData.map(item => item.id)
        releasePartner(idList).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "释放成功",
            duration: 1500,
          })
        }).catch(() => { })
      } else {
        this.$message.warning('请选择您要释放的客户数据！')
      }
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 0 0 !important;
  margin-left: 0 !important;
  margin-bottom: 5px;
}
</style>
