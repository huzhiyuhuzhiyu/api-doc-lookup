<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <template v-for="item in searchList">
            <el-col :span="item.searchType === 3 ? 6 : item.searchType == 2 ? 0 : 4">
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
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">导出</el-button>
          </div>

          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
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
          :fixedNO="true" @sort-change="sortChange" custom-column>
          <el-table-column prop="orderNo" label="单号" sortable="custom" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewFun(scope.row.moveId, 'look', scope.row)">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="businessType" label="业务类型" sortable="custom" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'outbound_sale_send'">销售发货</div>
              <div v-if="scope.row.businessType == 'inbound_sale_return'">销售退货</div>
              <div v-if="scope.row.businessType == 'inbound_purchase'">采购收货</div>
              <div v-if="scope.row.businessType == 'outbound_purchase'">采购退货</div>
              <div v-if="scope.row.businessType == 'outbound_pick_out'">生产领料</div>
              <div v-if="scope.row.businessType == 'inbound_return_materials'">生产退料</div>
              <div v-if="scope.row.businessType == 'outbound_external_send'">外协发料</div>
              <div v-if="scope.row.businessType == 'inbound_external_return'">外协退料</div>
              <div v-if="scope.row.businessType == 'inbound_external'">外协收货</div>
              <div v-if="scope.row.businessType == 'outbound_external'">外协退货</div>
              <div v-if="scope.row.businessType == 'inbound_other'">直接入库</div>
              <div v-if="scope.row.businessType == 'outbound_other'">直接出库</div>
              <div v-if="scope.row.businessType == 'outbound_transfer'">调拨出库</div>
              <div v-if="scope.row.businessType == 'inbound_transfer'">调拨入库</div>
              <div v-if="scope.row.businessType == 'inbound_receive_material'">直接领料入库</div>
              <div v-if="scope.row.businessType == 'outbound_receive_material'">直接领料出库</div>
              <div v-if="scope.row.businessType == 'inbound_production'">生产入库</div>
              <div v-if="scope.row.businessType == 'inbound_order_production'">生产入库</div>
              <div v-if="scope.row.businessType == 'outbound_use'">资产领用</div>
              <div v-if="scope.row.businessType == 'inbound_return'">资产归还</div>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="客户/供应商" sortable="custom" min-width="160">

          </el-table-column>
          <el-table-column prop="partnerCode" label="客户/供应商编码" sortable="custom" min-width="180">

          </el-table-column>
          <el-table-column prop="drawingNo" label="品名规格" sortable="custom" min-width="300" />
          <el-table-column prop="productCode" label="产品编码" sortable="custom" min-width="120" />
          <el-table-column prop="mainUnit" label="单位" min-width="140" />
          <el-table-column prop="num" label="数量" sortable="custom" min-width="140" />

          <el-table-column prop="costPrice" label="单价(含税)" sortable="custom" min-width="160" />
          <el-table-column prop="totalAmount" label="总金额(含税)" sortable="custom" min-width="180" />

          <el-table-column prop="taxRate" label="税率(%)" sortable="custom" min-width="140" />
          <el-table-column prop="excludingTaxCostPrice" label="单价(不含税)" sortable="custom" min-width="180" />
          <el-table-column prop="taxAmount" label="税额" sortable="custom" min-width="120" />
          <el-table-column prop="excludingTaxAmount" label="总金额(不含税)" sortable="custom" min-width="180" />
          <el-table-column prop="standardValue" label="规值" sortable="custom" min-width="120" />
          <el-table-column prop="colour" label="颜色" sortable="custom" min-width="120" />
          <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" sortable="custom"></el-table-column>
          <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" sortable="custom"></el-table-column>
          <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom"></el-table-column>
          <el-table-column prop="oil" label="油脂" min-width="120" sortable="custom"></el-table-column>
          <el-table-column prop="oilQuantity" label="油脂量" min-width="120" sortable="custom"> </el-table-column>
          <el-table-column prop="clearance" label="游隙" min-width="120" sortable="custom"></el-table-column>
          <el-table-column prop="aperture" label="孔径" min-width="120" sortable="custom"></el-table-column>
          <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom"></el-table-column>
          <el-table-column prop="specialRequire" label="特殊要求" min-width="120" sortable="custom"></el-table-column>
          <el-table-column prop="processName" label="工序" min-width="120" sortable="custom"></el-table-column>
          <el-table-column prop="documentStatus" label="单据状态" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
              <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
            </template>

          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="180" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column label="操作" min-width="200" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                :delDisabled="scope.row.documentStatus == 'submit'" :editDisabled="scope.row.documentStatus == 'submit'"
                @edit="viewFun(scope.row.moveId, 'edit', scope.row)" @del="handleDel(scope.row.moveId)">
                <el-button size="mini" type="text"
                  @click="viewFun(scope.row.moveId, 'look', scope.row)">查看详情</el-button>
                <!-- <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="viewFun(scope.row.moveId, 'look')">查看详情</el-dropdown-item>

                  </el-dropdown-menu>
                </el-dropdown> -->
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData">
          <div class="text">
            <span style="margin-left: 10px">数量:{{ num }}</span>
            <span style="margin-left: 10px">税额:{{ taxAmount }}</span>
            <span style="margin-left: 10px">总金额(含税):{{ totalAmount }}</span>
            <span style="margin-left: 10px">总金额(不含税):{{ excludingTaxTotalAmount }}</span>
          </div>
        </pagination>
      </div>
    </div>


    <Form v-if="formVisible" ref="Form" @close="closeForm" />
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
    <PurchaseOrderInboundForm v-if="PurchaseOrderInboundFormVisible" ref="PurchaseOrderInboundREFForm"
      @close="closeForm">
    </PurchaseOrderInboundForm>
    <Transfer v-if="transferFormVisible" ref="transferREFForm" @close="closeForm"></Transfer>
    <ExternalInboundForm v-if="externalInboundFormVisible" ref="externalInboundREFForm" @close="closeForm">
    </ExternalInboundForm>
    <ExternalMaterOutboundForm v-if="externalMaterOutboundFormVisible" ref="externalMaterOutboundREFForm"
      @close="closeForm">
    </ExternalMaterOutboundForm>
    <SaleOutboundForm v-if="saleOutboundFormVisible" ref="saleOutboundREFForm" @close="closeForm"></SaleOutboundForm>
    <outboundUseForm v-if="outboundUseVisible" ref="outboundUseREFForm" @close="closeForm">
    </outboundUseForm>
    <InboundReturnForm v-if="inboundReturnVisible" ref="inboundReturnREFForm" @close="closeForm"></InboundReturnForm>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getInventoryDetailList, getInventorySummaryData } from '@/api/warehouseManagement/inventory'
import ExportForm from '@/components/no_mount/ExportBox/index'
import Form from '../inventoryList/Form.vue'
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
import SaleOutboundForm from '../dbIncomAndOutInventory/saleOutboundForm.vue'
import ExternalMaterOutboundForm from '../dbIncomAndOutInventory/externalMaterialsForm.vue'
import PurchaseOrderInboundForm from '../dbIncomAndOutInventory/purchaseOrderInboundForm.vue'
import ExternalInboundForm from '../dbIncomAndOutInventory/externalInboundForm.vue'
import { getclassAttributelistByCode } from '@/api/masterDataManagement/index'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import outboundUseForm from '../dbIncomAndOutInventory/equipmentOutboundForm.vue'
import InboundReturnForm from '../dbIncomAndOutInventory/equipmentInboundForm.vue'
export default {
  name: 'inventoryDetaisList',
  components: {
    Form, SuperQuery, ExportForm, ProductInboundForm, WorkInboundForm, OutboundSaleSendForm, InboundSaleReturnForm,
    InboundPurchaseForm, OutboundPurchaseForm, OutboundExternalSendForm,
    InboundExternalForm, OutboundPickOutForm, InboundReturnMaterialsForm,
    Transfer, SaleOutboundForm, ExternalMaterOutboundForm, PurchaseOrderInboundForm, ExternalInboundForm, outboundUseForm, InboundReturnForm
  },
  props: {
    warehouseCode: "",
  },
  data() {
    return {
      inboundReturnVisible: false,
      outboundUseVisible: false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'approvalStatus', fieldValue: 'ok', label: '', symbol: 'like', searchType: 2, width: 0 },
      ],
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
      externalMaterOutboundFormVisible: false,
      columnList: ["partnerCode", 'productCode', "productName", "taxRate", "excludingTaxCostPrice", "taxAmount", "excludingTaxAmount", "createByName", "taxAmount"],
      num: 0,
      superQueryVisible: false,
      taxAmount: 0,
      totalAmount: 0,
      excludingTaxTotalAmount: 0,
      exportFormVisible: false,
      recordFormVisible: false,
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      list: [ //业务类型
        { label: "销售发货", value: "outbound_sale_send" },
        { label: "销售退货", value: "inbound_sale_return" },
        { label: "采购收货", value: "inbound_purchase" },
        { label: "采购退货", value: "outbound_purchase" },
        { label: "生产领料", value: "outbound_pick_out" },
        { label: "生产退料", value: "inbound_return_materials" },
        { label: "生产入库", value: "inbound_mock_production" },
        { label: "外协发料", value: "outbound_external_send" },
        { label: "外协退料", value: "inbound_external_return" },
        { label: "外协收货", value: "inbound_external" },
        { label: "直接入库", value: "inbound_other" },
        { label: "直接出库", value: "outbound_other" },
        { label: "直接领料入库", value: "inbound_receive_material" },
        { label: "直接领料出库", value: "outbound_receive_material" },
        { label: "调拨出库", value: "outbound_transfer" },
        { label: "调拨入库", value: "inbound_transfer" },
        { label: "资产领用", value: "outbound_use" },
        { label: "资产归还", value: "inbound_return" },
      ],

      initListQuery: {
        productDrawingNo: "",
        businessType: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
      },
      listQuery: {},
      total: 0,
      formVisible: false,
      selectData: [],
      totalList: [],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "单号",
          type: 'input'
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
            { label: "生产入库", value: "inbound_mock_production" },
            { label: "外协发料", value: "outbound_external_send" },
            { label: "外协退料", value: "inbound_external_return" },
            { label: "外协收货", value: "inbound_external" },
            { label: "直接入库", value: "inbound_other" },
            { label: "直接出库", value: "outbound_other" },
            { label: "直接领料入库", value: "inbound_receive_material" },
            { label: "直接领料出库", value: "outbound_receive_material" },
            { label: "调拨出库", value: "outbound_transfer" },
            { label: "调拨入库", value: "inbound_transfer" },
            { label: "资产领用", value: "outbound_use" },
            { label: "资产归还", value: "inbound_return" },
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
          prop: 'drawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },

        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },


        {
          prop: 'taxRate',
          label: "税率(%)",
          type: 'select',
          options: [],
        },


        {
          prop: 'standardValue',
          label: "规值",
          type: 'select',
          options: []
        },
        {
          prop: 'colour',
          label: "颜色",
          type: 'select',
          options: []
        },
        {
          prop: 'sealingCoverTyping',
          label: "打字内容",
          type: 'select',
          options: []
        },
        {
          prop: 'accuracyLevel',
          label: "精度等级",
          type: 'select',
          options: []
        },
        {
          prop: 'vibrationLevel',
          label: "振动等级",
          type: 'select',
          options: []
        },

        {
          prop: 'oil',
          label: "油脂",
          type: 'select',
          options: []
        },
        {
          prop: 'oilQuantity',
          label: "油脂量",
          type: 'select',
          options: []
        },
        {
          prop: 'clearance',
          label: "游隙",
          type: 'select',
          options: []
        },
        {
          prop: 'aperture',
          label: "孔径",
          type: 'select',
          options: []
        },
        {
          prop: 'packagingMethod',
          label: "包装方式",
          type: 'select',
          options: []
        },
        {
          prop: 'specialRequire',
          label: "特殊要求",
          type: 'select',
          options: []
        },
        {
          prop: 'processName',
          label: "工序",
          type: 'input',
        },
        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'select',
          options: [{ label: "草稿", value: "draft" }, { label: "提交", value: "submit" }]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input',
        },
      ],
      classAttributeList: [],
    }
  },
  created() {
    this.superForm = this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.getclassAttributeList()
  },
  mounted() {
    this.getProductClassFun()
  },
  methods: {
    getclassAttributeList() {
      getclassAttributelistByCode({ code: this.warehouseCode }).then(res => {
        console.log("类别属性", res);
        this.classAttributeList = res.data
        this.search('basic')
      })
    },
    getProductClassFun() {
      // 孔径
      let objO = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa009",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(objO).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'aperture');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 颜色
      let objT = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa010",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(objT).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'colour');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 特殊要求

      let objS = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa016",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(objT).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'specialRequire');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 规值
      let obj0 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa008",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj0).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'standardValue');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 打字内容
      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa007",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj1).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'sealingCoverTyping');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 精度等级
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa006",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj2).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'accuracyLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 振动等级
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj3).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'vibrationLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 油脂
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa002",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj4).then(res => {



        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oil');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 油脂量
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa003",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj5).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oilQuantity');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 游隙
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa001",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj6).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'clearance');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      // 包装方式
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa015",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj7).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'packagingMethod');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })


      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        let arr = []
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
          let obj = {
            label: item.taxRate,
            value: item.taxRate,
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find(item => item.prop === 'taxRate');
        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })

    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    viewFun(id, type, row) {
      if (row.businessType == 'inbound_order_production') {
        console.log(444);
        this.productInboundFormVisible = true
        this.$nextTick(() => {
          this.$refs.productInboundREFForm.init(id, type, this.classAttribute)
        })
      } else if (row.businessType == 'inbound_production') {
        this.workInboundFormVisible = true
        this.$nextTick(() => {
          this.$refs.workInboundREFForm.init(id, type, this.classAttribute)
        })
      } else if (row.businessType == 'inbound_sale_return') {
        this.inboundSaleReturnFormVisible = true
        this.$nextTick(() => {
          this.$refs.inboundSaleReturnREFForm.init(id, type, row.businessType, this.classAttribute)
        })
      } else if (row.businessType == 'outbound_purchase') {
        this.outboundPurchaseFormVisible = true
        this.$nextTick(() => {
          this.$refs.outboundPurchaseREFForm.init(id, type, row.businessType, this.classAttribute)
        })
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
            this.$refs.Form.init(id, type)
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
            this.$refs.Form.init(id, type)
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
            this.$refs.Form.init(id, type)
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
            this.$refs.Form.init(id, type)
          })
        }
      } else if (row.businessType == 'outbound_pick_out') {
        this.outboundPickOutFormVisible = true
        this.$nextTick(() => {
          this.$refs.outboundPickOutREFForm.init(id, type, row.businessType, this.classAttribute)
        })
      } else if (row.businessType == 'inbound_return_materials') {
        this.inboundReturnMaterialsFormVisible = true
        this.$nextTick(() => {
          this.$refs.inboundReturnMaterialsREFForm.init(id, type, row.businessType, this.classAttribute)
        })
      } else if (row.businessType == 'inbound_transfer' || row.businessType == 'outbound_transfer') {
        this.transferFormVisible = true
        this.$nextTick(() => {
          this.$refs.transferREFForm.init(id, type,)
        })
      }else if (row.businessType == 'outbound_use') {
        this.outboundUseVisible = true
        this.$nextTick(() => {
          this.$refs.outboundUseREFForm.init(id, type,)
        })
      } else if (row.businessType == 'inbound_return') {
        this.inboundReturnVisible = true
        this.$nextTick(() => {
          this.$refs.inboundReturnREFForm.init(id, type,)
        })
      } else {
        console.log(555);
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(id, type)
        })
      }
    },



    getInventorySummaryDataFun() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.totalList = []
      this.listQuery.pageNum = 1
      this.listQuery.classAttributeList = this.classAttributeList
      this.listQuery.approvalStatus = 'ok'
      getInventorySummaryData(this.listQuery).then(res => {

        this.tableData = res.data.page.records
        console.log("tableData", this.tableData);
        // res.data.total ? this.totalList.push(res.data.total) : ''
        this.total = res.data.page ? res.data.page.total : 0
        this.num = res.data.total ? res.data.total.num : 0
        this.taxAmount = res.data.total ? res.data.total.taxAmount : 0
        this.totalAmount = res.data.total ? res.data.total.totalAmount : 0
        this.excludingTaxTotalAmount = res.data.total ? res.data.total.excludingTaxTotalAmount : 0

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
        let query = this.initListQuery
        let _data = {
          ...query,
          exportType: '1201',
          exportName: '出入库明细',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.initListQuery.pageSize : -1,
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
      if (prop == 'partnerName' || prop == 'createTime' || prop == 'documentStatus' || prop == 'processName' || prop == 'oilQuantity' || prop == 'excludingTaxAmount' || prop == 'productCode' || prop == 'partnerCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.recordFormVisible = false
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
      this.outboundUseVisible=false
      this.inboundReturnVisible=false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
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
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],
        this.initData()
    },

    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, true)
      })
    },


    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteOrders(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
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