<template>
  <!-- 销售退货 inbound_sale_return -->
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <!-- <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading"
            @click="handleConfirm('draft')">保存草稿</el-button> -->
          <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
            @click="handleConfirm('submit')">提交</el-button>
          <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
              :element-loading-text="loadingText">
              <el-tabs v-model="activeName" v-if="!approvalFlag && dataForm.approvalFlag">
                <el-tab-pane label="基础信息" name="orderInfo" class="orderInfo">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px"
                        label-position="top">
                        <el-row :gutter="30" class="custom-row">
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="单号" prop="orderNo">
                              <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                                :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                                maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="业务单号" prop="sourceNo">
                              <el-input v-model="dataForm.sourceNo" placeholder="请输入业务单号" disabled maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="业务类型" prop="businessType">
                              <el-select v-model="dataForm.businessType" placeholder="请选择业务类型" style="width: 100%;" disabled>
                                <el-option v-for="(item, index) in sourceTypeList" :key="index" :label="item.label"
                                  :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        

                          <el-col :sm="6" :xs="24">
                            <el-form-item label="仓库" prop="warehouseName">
                              <ComSelect-list :requestObj="warehouseRequestObj" :dialogTitle="'选择仓库'"
                                :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName"
                                :method="getWarehouseList" placeholder="请选择仓库"
                                @change="changeWarehousex"></ComSelect-list>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24" v-if="allocationFlag&&btnType!='look'">
                            <el-form-item label="库位" prop="shelfSpaceName">
                              <el-input v-model="shelfSpaceName" placeholder="库位" readonly
                                @focus="openSeleceWareDialog">
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="检验结果" prop="inspectionResults">
                              <el-select v-model="dataForm.inspectionResults" placeholder="请选择检验结果"
                                style="width: 100%;">
                                <el-option v-for="(item, index) in inspectionResultsList" :key="index"
                                  :label="item.label" :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>

                          <el-col :sm="12" :xs="24">
                            <el-form-item label="备注" prop="remark">
                              <el-input v-model="dataForm.remark" placeholder="请输入备注"
                                :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2"
                                maxlength="200" />
                            </el-form-item>
                          </el-col>
                        </el-row>


                      </el-form>
                    </el-collapse-item>



                    <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                      <div v-if="btnType !== 'look'">
                        <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                          :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>

                      </div>

                      <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="btnType != 'look'"
                        @selection-change="handeleProductInfoData" border :key="165" style="width: 100%;">
 
                        <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6"
                          show-overflow-tooltip> </el-table-column>
                        <el-table-column prop="productCode" label="产品编码" width="120" :key="4" show-overflow-tooltip />

                        <el-table-column prop="shelfSpaceName" label="库位" width="120" :key="10112"
                          v-if="allocationFlag">
                          <template slot="header">
                            <span class="required">*</span>库位
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.shelfSpaceName" readonly :disabled="btnType == 'look'"
                              @focus="openSeleceWareDialog(scope.row, scope.$index,'table')" placeholder="库位">
                            </el-input>

                          </template>
                        </el-table-column>
                        <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />
                        <el-table-column prop="undeliveredQuantity" label="待归还数量" width="140" :key="777">
                        </el-table-column>


                        <el-table-column prop="num" label="归还数量" width="140" :key="77">
                          <template slot="header">
                            <span class="required">*</span>归还数量
                          </template>
                          <template slot-scope="scope">
                            <el-input :disabled="btnType == 'look'" @input="watchNum(scope.row, scope.$index)"
                              v-model="scope.row.num" placeholder="归还数量"></el-input>
                          </template>
                        </el-table-column>
                        
                        <el-table-column prop="remark" label="备注" width="200" :key="128">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="btnType == 'look'"
                              placeholder="备注"></el-input>
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'"
                          fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                          </template>
                        </el-table-column> -->
                      </JNPF-table>



                    </el-collapse-item>

                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                  <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                </el-tab-pane>
                <el-tab-pane v-if="btnType == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
                  <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                </el-tab-pane>
              </el-tabs>
              <el-collapse v-model="activeNames" v-else>
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" style="margin-top: 5px;">
                      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px"
                        label-position="top">
                        <el-row :gutter="30" class="custom-row">
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="单号" prop="orderNo">
                              <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                                :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                                maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="业务单号" prop="sourceNo">
                              <el-input v-model="dataForm.sourceNo" placeholder="请输入业务单号" disabled maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="业务类型" prop="businessType">
                              <el-select v-model="dataForm.businessType" placeholder="请选择业务类型" style="width: 100%;" disabled>
                                <el-option v-for="(item, index) in sourceTypeList" :key="index" :label="item.label"
                                  :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                 

                          <el-col :sm="6" :xs="24">
                            <el-form-item label="仓库" prop="warehouseName">
                              <ComSelect-list :requestObj="warehouseRequestObj" :dialogTitle="'选择仓库'"
                                :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName"
                                :method="getWarehouseList" placeholder="请选择仓库"
                                @change="changeWarehousex"></ComSelect-list>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24" v-if="allocationFlag&&btnType!='look'">
                            <el-form-item label="库位" prop="shelfSpaceName">
                              <el-input v-model="shelfSpaceName" placeholder="库位" readonly
                                @focus="openSeleceWareDialog">
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="检验结果" prop="inspectionResults">
                              <el-select v-model="dataForm.inspectionResults" placeholder="请选择检验结果"
                                style="width: 100%;">
                                <el-option v-for="(item, index) in inspectionResultsList" :key="index"
                                  :label="item.label" :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>

                          <el-col :sm="12" :xs="24">
                            <el-form-item label="备注" prop="remark">
                              <el-input v-model="dataForm.remark" placeholder="请输入备注"
                                :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2"
                                maxlength="200" />
                            </el-form-item>
                          </el-col>
                        </el-row>


                      </el-form>
                    </el-collapse-item>



                    <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                      <div v-if="btnType !== 'look'">
                        <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                          :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>

                      </div>

                      <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="btnType != 'look'"
                        @selection-change="handeleProductInfoData" border :key="165" style="width: 100%;">
 
                        <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6"
                          show-overflow-tooltip> </el-table-column>
                        <el-table-column prop="productCode" label="产品编码" width="120" :key="4" show-overflow-tooltip />

                        <el-table-column prop="shelfSpaceName" label="库位" width="120" :key="10112"
                          v-if="allocationFlag">
                          <template slot="header">
                            <span class="required">*</span>库位
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.shelfSpaceName" readonly :disabled="btnType == 'look'"
                              @focus="openSeleceWareDialog(scope.row, scope.$index,'table')" placeholder="库位">
                            </el-input>

                          </template>
                        </el-table-column>
                        <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />
                        <el-table-column prop="undeliveredQuantity" label="待归还数量" width="140" :key="777">
                        </el-table-column>


                        <el-table-column prop="num" label="归还数量" width="140" :key="77">
                          <template slot="header">
                            <span class="required">*</span>归还数量
                          </template>
                          <template slot-scope="scope">
                            <el-input :disabled="btnType == 'look'" @input="watchNum(scope.row, scope.$index)"
                              v-model="scope.row.num" placeholder="归还数量"></el-input>
                          </template>
                        </el-table-column>
                         
                        <el-table-column prop="remark" label="备注" width="200" :key="128">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="btnType == 'look'"
                              placeholder="备注"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'"
                          fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                          </template>
                        </el-table-column>
                      </JNPF-table>



                    </el-collapse-item>

              </el-collapse>
            </div>
          </div>
        </div>
      </div>
    <!-- 选择产品信息 -->
    <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
        @close="productVisible = false" :visible.sync="productVisible" lock-scroll
        class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">

              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="productForm.productDrawingNo" placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="productForm.productCode" placeholder="产品编码" clearable />
                  </el-form-item>
                </el-col> 
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductFun()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetProductFun()">{{
                      $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="productList" hasC :fixedNO="true"
                @selection-change="handleSelectionChangeAllPruduct" ref="form">
                <el-table-column prop="orderNo" label="领用单号" width="190" sortable="custom"></el-table-column>

                <el-table-column prop="collectionTime" label="领用日期" width="180" sortable="custom" />

                <el-table-column prop="productDrawingNo" label="品名规格" width="300" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" width="140" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" width="90" sortable="custom" />
                <el-table-column prop="awitNum" label="待领用数量" width="150" sortable="custom" />
                <el-table-column prop="num" label="领用数量" width="120" sortable="custom" />

              </JNPF-table>
              <pagination :total="productTotal" :page.sync="productForm.pageNum" :limit.sync="productForm.pageSize"
                @pagination="searchProductFun" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click=" productVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
            确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
        width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>


        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>

        </span>
      </el-dialog>
      <!-- 选客户 -->
      <CustomerForm v-if="CustomerForm" ref="CustomerForms" @selectCustomer="handleSelectCustomer"></CustomerForm>
      <!-- 选库位 -->
      <WareHouseForm v-if="wareHouseVisible" ref="WareHouseForms" @selectWareHouseFun="selectWareHouseFun">
      </WareHouseForm>

    </div>
  </transition>
</template>

<script>
import { detailCollectionandreturn, addCollectionandreturn, equRequisitionRecordsproducts } from '@/api/dailyManagement/Maintenance'
import { getQuotationdatasenddatalist } from '@/api/salesManagement'
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getWarehouseInfo, getStockGoodsShelvesList, getProductionLotList, getBimBusinessSwitchConfigList, getBatchNumber, getStockGoodsShelves } from '@/api/basicData/index'
import { getQuotationsendlist } from "@/api/salesManagement/index";

import CustomerForm from './customerForm.vue'
import WareHouseForm from './wareHouseForm.vue'
import { getpurPurchaseReceiptReturnGoodsdetail, addpurPurchaseReceiptReturnGoods, editpurPurchaseReceiptReturnGoods, detailpurPurchaseReceiptReturnGoods } from '@/api/purchasingManagement/purchaseInquirySheet'  // 询价单
import { purPurchaseReceiptReturnGoodsDetailList } from '@/api/purchasingManagement/purchaseInquirySheet'
import { detailordershengchan, detailWithdrawal, addWithdrawal, updateWithdrawal, getWorkList, WithdrawalmxList } from '@/api/productOrdes/index.js'
import BatchNumberForm from './batchNumberForm.vue'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import flowMixin from '@/mixins/generator/flowMixin'
import recordList from '@/views/workFlow/components/RecordList.vue'
import busFlow from '@/mixins/generator/busFlow';
export default {
  components: { CustomerForm, WareHouseForm, BatchNumberForm, Process  ,recordList},
  mixins: [flowMixin,busFlow],
  data() {
    return {
      warehouseRequestObj: {
        type: 'normal', state: 'enable'
      },
      inOroundTitle: "",
      numTitle: "",
      batchNumVisible: false,
      wareHouseVisible: false,
      // 选择批次号请求条件
      batchNOForm: {
        batchNumber: "",
        shelfSpaceName: "",
        orderItems: [{
          "asc": false,
          "column": ""
        },],
        productsId: "",
        pageNum: 1,
        pageSize: 20,
        warehouseId: "",
        sourceNo: "",
      },
      btnText: "",
      submitmethodsTitle: "",
      tipsvisible: false,
      CustomerForm: false,
      activeNames: ["productInfo", "basicInfo"],
      jyFlag: false,//是否显示检验标志
      codeConfig: {},//单号配置信息(单据规则)
      dataForm: {  //表单信息
        orderNo: "",
        businessType: "",
        warehouseName: "",
        warehouseId: "",
        cooperativePartnerId: "",
        partnerName: "",
        documentType: "",
        id: "",
        warehouseType: "",
        approvalFlag: false,
        inspectionResults: "",
      },
      customerInfo: {},//所选客户信息
      getWarehouseList,
      sourceTypeList: [ //业务类型
        { label: "销售发货", value: "outbound_sale_send" },
        { label: "销售退货", value: "inbound_sale_return" },
        { label: "采购收货", value: "inbound_purchase" },
        { label: "采购退货", value: "outbound_purchase" },
        { label: "生产领料", value: "outbound_pick_out" },
        { label: "生产退料", value: "inbound_return_materials" },
        { label: "外协发料", value: "outbound_external_send" },
        { label: "外协退料", value: "inbound_external_return" },
        { label: "外协收货", value: "inbound_external" },
        { label: "外协退货", value: "outbound_external" },
        { label: "生产入库", value: "inbound_mock_production" },
        { label: "资产领用", value: "outbound_use" },
        { label: "资产归还", value: "inbound_return" },

      ],
      productForm: {
        orderNo: "",
        orderType: "",
        productDrawingNo: "",
        stockFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      dataRule: {
        cooperativePartnerId: [
          { required: true, message: '客户不能为空', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '业务类型不能为空', trigger: 'change' }
        ],
        inspectionResults: [{ required: true, message: "检验标志不能为空", trigger: 'change' }],

        orderNo: [{ required: true, message: "请输入单号", trigger: 'blur' }],
        warehouseName: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
      },

      inspectionResultsList: [
        { label: "待检验", value: "" },
        { label: "合格", value: "qualified" },
        { label: "不合格", value: "unqualified" },
        { label: "报废", value: "discard" },
      ],
      productList: [],
      productTotal: 0,
      deliveryDateArr: [],
      productVisible: false,
      selectSaleProductArr: [],
      productData: [],
      selectRows: [],
      listLoading: false,
      currentProductIndex: "",



      title: "",
      visible: true,
      btnType: false,
      wareVisibled: false,
      btnLoading: false,
      formLoading: false,
      allocationFlag: false,

      dataFormItems: [/* 通过 this.refeshDataFormItems() 动态更改 */],
       
      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      spaceLines: [],
      productionLotList: [],
      loadingText: '',
      copyLinesData: [],
      previousValue: "",
      orderForm: {},
      activeName: "orderInfo",
      classAttributeList: [],
      warehouseCode: "",
      flowTemplateJson: {},
      flowData:{},
      approvalFlag:false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime:0
    }
  },
  created() {
  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },
  methods: {


        // 打开选择库位弹框
    openSeleceWareDialog(row, index, type) {
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库!")
      this.wareHouseVisible = true
      this.$nextTick(() => {
        this.$refs.WareHouseForms.initData(this.dataForm.warehouseId, type)
      })
      if (index) this.currentProductIndex = index
    },

    // 所选的库位信息
    selectWareHouseFun(data, type) {
      console.log("库位信息", data);
      let index = this.currentProductIndex
      if (!type) {
        this.shelfSpaceId = data.id
        this.shelfSpaceName = data.name
      }

      if (this.productData.length) {
        this.productData.forEach(item => {
          if (!item.shelfSpaceId) {
            this.$set(item, 'shelfSpaceName', data.name)
            this.$set(item, 'warehouseId', data.warehouseId)
            this.$set(item, 'shelfSpaceId', data.id)
          }
        });
        if (index) {
          this.$set(this.productData[index], 'shelfSpaceName', data.name)
          this.$set(this.productData[index], 'warehouseId', data.warehouseId)
          this.$set(this.productData[index], 'shelfSpaceId', data.id)
        }
      }
      this.index = ""
    },


    // 产品信息列表复制功能
    copyFun(row, index) {
      let data = JSON.parse(JSON.stringify(row))
      this.productData.splice(index + 1, 0, data);

    },

    // 点击选择产品 销售发货 
    openSeleceProductDialog() {
      if (this.dataForm.businessType != 'inbound_return_materials' && this.dataForm.businessType != 'outbound_pick_out') {
        if (!this.dataForm.cooperativePartnerId) return this.$message.error("请先选择客户")

      }
      this.productVisible = true
      this.searchProductFun()
    },
    //  
    searchProductFun() {
      this.productForm.orderNo = this.dataForm.sourceNo

      equRequisitionRecordsproducts(this.productForm).then(res => {
        if (res.data.records.length) {
          res.data.records.forEach(element => {
            this.$set(item, 'num', this.jnpf.numberFormat(this.jnpf.math('subtract', [item.requisitionNum, item.incomingOutgoingNum]), 2))
            this.$set(item, 'awitNum', this.jnpf.numberFormat(this.jnpf.math('subtract', [item.requisitionNum, item.incomingOutgoingNum]), 2))
          });
          this.productList = res.data.records
          this.productTotal = this.res.data.total
        }
      })



    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      this.selectSaleProductArr = val
    },
    // 销售发货选择产品——重置
    resetProductFun() { 
      this.productForm={
        orderNo: "",
        productCode: "",
        productDrawingNo: "",
        orderItems: [{
          "asc": false,
          "column": ""
        },],
        pageNum: 1,
        pageSize: 20,
      }
      this.searchProductFun()

    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      let arr = JSON.parse(JSON.stringify(this.selectSaleProductArr))

      arr.forEach(item => {
        let taxrate = 1 * 1 + (item.taxRate) / 100 * 1
        item.excludingTaxCostPrice = this.jnpf.numberFormat(this.jnpf.math('divide', [item.price, taxrate]), 6)
        item.num = item.undeliveredQuantity
        item.taxRates= item.taxRate+"%"

        item.costPrice = item.price
        item.totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.price]), 6)
        item.taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [item.price, item.excludingTaxCostPrice]), 6)]), 6)
        item.excludingTaxTotalAmount = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.totalAmount, item.taxAmount]), 6)
        item.noticeId = item.returnDeliveryNoticeId
        item.noticeLineId = item.id
        item.sourceNo = this.dataForm.sourceNo
        item.moveId = this.dataForm.id


        this.productData.push(item)
      });
      this.productData.forEach(item => {
          if (!item.shelfSpaceId) {
            this.$set(item, 'shelfSpaceName', this.shelfSpaceName)
            this.$set(item, 'warehouseId', this.dataForm.warehouseId)
            this.$set(item, 'shelfSpaceId', this.shelfSpaceId)
          }
        });
      console.log("this.dataFormTwo", this.productData);
    },
    // 产品信息列表多选
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 产品信息列表 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.productData.indexOf(row);
        if (index > -1) {
          this.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },

    // 主数量输入失去焦点 检验不能为  0
    checkNum(row, index) {
      if (!row.num) {
        this.$message({
          message: "请填写第" + (index + 1) + "行产品的主数量",
          type: 'error',
          duration: 1500,
        })
      } else if (Number(row.num) == 0) {
        this.$message({
          message: "第" + (index + 1) + "行产品的数量必须大于0",
          type: 'error',
          duration: 1500,
        })

      }
    },
    // 监听主数量输入
    watchNum(row, index) {
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      row.num = row.num.replace(/[^\d.]/g, '');
      let productArr = [...this.productData]

      if (row.num.length == 1 && row.num == '.') {
        // 如果第一位是小数点，则清空输入框
        row.num = '';
      } else if (row.num.length == 2 && row.num[0] == '0' && row.num[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.num = row.num.slice(0, 1) + '.' + row.num.slice(1);
      } else if (row.num.length > 2 && row.num[0] == '0' && row.num[1] != '.') {
        row.num = row.num.substring(1, row.num.length)
      }


      if (row.num.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果

        for (let i = 0; i < row.num.length; i++) {
          const char = row.num[i];
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char;
              dotCount++;
            }
          } else {
            result += char;
          }
        }

        row.num = result;
        let arr = row.num.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 4) {
          arr[1] = arr[1].substring(0, 4)
        }
        row.num = arr[0] + '.' + arr[1]
      } else {
        if (row.num.length > 8) {
          row.num = row.num.substring(0, 8);
        }
      } 
      this.productData = productArr
      console.log(this.productData);
    }, 


   
    // 切换仓库
    changeWarehousex(val, data) {
      console.log("data", data);
      if (!val && !data.length) {
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.warehouseType = ""
        return
      }
      this.allocationFlag = data[0].all.locationStatus == 'disabled' ? false : true
      this.dataForm.warehouseId = data[0].id
      this.dataForm.warehouseName = data[0].name
      this.dataForm.warehouseType = data[0].all.type
      if (this.dataForm.warehouseType == 'scrap') {
        this.dataForm.inspectionResults = 'discard'
      } else if (this.dataForm.warehouseType == 'normal') {
        this.dataForm.inspectionResults = 'qualified'

      } else if (this.dataForm.warehouseType == 'unqualified') {
        this.dataForm.inspectionResults = 'unqualified'

      }
    }, 
    // 获取仓库id
    getWarehouseListFun() {
      getWarehouseList({ code: this.warehouseCode }).then(res => {
        this.dataForm.warehouseName = res.data[0].name
        this.dataForm.warehouseId = res.data[0].id
        // 获取仓库详情信息
        getWarehouseInfo(res.data[0].id).then(response => {
          this.wareHouseInfo = response.data
          this.dataForm.warehouseType = response.data.type
          this.allocationFlag = response.data.locationStatus == 'disabled' ? false : true
          if (this.dataForm.warehouseType == 'scrap') {
            this.dataForm.inspectionResults = 'discard'
          } else if (this.dataForm.warehouseType == 'normal') {
            this.dataForm.inspectionResults = 'qualified'

          } else if (this.dataForm.warehouseType == 'unqualified') {
            this.dataForm.inspectionResults = 'unqualified'

          }
        })
      })
    },
    goBack() {
      this.$emit('close', true)
    },




    //   { label: "销售发货", value: "outbound_sale_send" },
    // { label: "销售退货", value: "inbound_sale_return" },
    // { label: "采购收货", value: "inbound_purchase" },
    // { label: "采购退货", value: "outbound_purchase" },
    // { label: "生产领料", value: "outbound_pick_out" },
    // { label: "生产退料", value: "inbound_return_materials" },
    // { label: "外协发料", value: "outbound_external_send" },
    // { label: "外协退料", value: "inbound_external_return" },
    // { label: "外协收货", value: "inbound_external" },
    // { label: "外协退货", value: "outbound_external" },
    init(data, btnType, businessType, classAttributeList, warehouseCode) {

      console.log("665", data, btnType, businessType);
      // this.visible = true
      this.warehouseCode = warehouseCode
      this.dataForm.businessType = businessType
      this.classAttributeList = classAttributeList
      this.btnType = btnType 
      this.$set(this.orderForm, 'deliveryStatus', 'not_finished')
      this.warehouseRequestObj.virtuallyFlag = false
      this.warehouseRequestObj.type = ""
      this.getWarehouseListFun()



      // this.visible = true
      // this.refeshDataFormItems()






      if (btnType == 'look') {
        this.title = '查看入库单'
        detailWarehouseData(data).then(res => {
          res.data.spaceLines.forEach(item => {
            this.$set(item, 'productDrawingNo', item.drawingNo)
            this.$set(item, 'price', item.costPrice)
            item.taxRates= item.taxRate+"%"
          });
           
          this.dataForm = res.data.stockMove
          this.productData = res.data.spaceLines
          // 流程信息和流转记录
          if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
        })
      } else { 
        this.$set(this.dataForm, 'sourceNo', data.orderNo)
        this.fetchData("RKDH", true)
        this.getBusInfo('b045')
        this.title = '新建入库单'
        detailCollectionandreturn(data.id).then(res => {
          console.log("详情", res);
          if (res.data.lines.length) {
            res.data.lines.forEach(item => {
              item.noticeId = ""
              item.noticeLineId = ""
              item.sourceNo = this.dataForm.sourceNo
              item.ordersId = res.data.requisition.id
              item.ordersLineId = item.id
              item.num = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.requisitionNum, item.incomingOutgoingNum]), 2)
              this.$set(item, 'unReceiveQuantity', item.num)
            });
            console.log("this.productData", this.productData);
            this.productData = res.data.lines
          }
          this.formLoading = false
        }).catch(() => { this.formLoading = false })
      }




    },

    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.init('', 'add')
      this.tipsvisible = false
      this.btnLoading = false
      this.dataForm = {  //表单信息
        orderNo: "",
        businessType: "",
        warehouseName: "",
        warehouseId: "",
        cooperativePartnerId: "",
        partnerName: "",
        documentType: "",
        id: "",
        warehouseType: "",
        approvalFlag: false,
      }
      this.productData = []
      this.$refs.dataForm.resetFields()
      this.init('', 'add')
    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.orderNo = data.number
        }

      } catch (error) {
      }
    },
    async handleConfirm(submitModel) {
      console.log(this.productData);
      let submitFlag = true // 自动聚焦是否可用
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          // 判断子表是否有效
          if (!this.productData.length && submitFlag) {
            submitFlag = false
            this.$message.error('请至少选择一个产品')
          }
          if (this.allocationFlag) {
            this.productData.forEach((item, index) => {
              if (!item.shelfSpaceId) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行库位不能为空")
              }
            })
          }

          if (this.productData.length) {
            console.log(this.productData);
            let totals = {};
            let totalNum = {};
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能为空")
                break
              }



              if (Number(item.num) > Number(item.ordersNum)) {
                console.log(item.num);
                console.log(item.ordersNum);
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能超过待退货数量")
                break
              }


              if (!totals[item.ordersLineId]) {
                totals[item.ordersLineId] = { totalNum: 0, ordersNum: item.ordersNum };
              }
              if (!totalNum[item.ordersLineId]) {
                totalNum[item.ordersLineId] = { totalNum: 0, availableBatchNumber: item.availableBatchNumber };
              }
              totals[item.ordersLineId].totalNum += Number(item.num)
              totalNum[item.ordersLineId].totalNum += Number(item.num);
            }
            for (let id in totals) {
              if (totals[id].totalNum > totals[id].ordersNum) {
                console.log(`同产品 ${id} 的总数量不能超过订单数量`);
                submitFlag = false
                this.$message.error("同产品的总数量不能超过订单数量")
                break
              }
            }

          }




          // 自动聚焦未使用则提交
          if (submitFlag) {
            this.dataForm.documentType = "inbound"

            this.dataForm.documentStatus = submitModel
            // const formMethod = this.dataForm.id ? updateInboundOutbound : addInboundOutbound
            const formMethod = addWarehouseData
            // spaceLines每一项的产品id如果与linesList项的产品id相同，那么让spaceLines项的批次号也等于linesList项的批次号

            this.copyLinesData = JSON.parse(JSON.stringify(this.productData))
            this.copyLinesData.forEach(element => {
              element.warehouseType = this.dataForm.warehouseType
            });
            this.dataForm.classAttributeList = this.classAttributeList
            this.dataForm.sourceType = 'notice'
            let dataObj = {
              stockMove: this.dataForm,
              lines: this.productData,
              spaceLines: this.copyLinesData,
              flowData: this.flowData
            }
            console.log("this.dataForm", this.dataForm);
            // // 提交确认
            // if (submitModel === 'submit') {
            //   let flag = await this.$confirm('请确认信息是否正确，提交后不允许修改，是否提交！', '提交确认', { type: 'warning' }).catch(err => false)
            //   if (!flag) {
            //     console.log(dataObj)
            //     return this.btnLoading = false
            //   }
            // }
            console.log("this.productData", this.productData);
      this.btnLoading = true
      formMethod(dataObj).then(res => {
              let msg = res.msg
              if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
              if (submitModel == "draft") {
                this.submitmethodsTitle = "保存成功"
              } else {
                this.submitmethodsTitle = "提交成功"

              }
              if (this.btnType == 'edit') {
                this.btnText = "继续修改"
              } else if (this.btnType == 'add' || this.btnType == 'copy') {
                this.btnText = "继续新增"
              }
              this.tipsvisible = true

              this.btnLoading = false

            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            this.btnLoading = false
          }
        }
      })

    },

  },
}
</script>
<style lang="scss" scoped>
.contain {
  position: relative;
  height: calc(100% - 47px);
  overflow-y: auto;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px 10px;
  padding-top: 0;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 5px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}

::v-deep.JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 !important;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}


.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.JNPF-common-search-box {
  margin-bottom: 5px;
}

// .orderInfo ::v-deep .el-collapse-item__wrap {
//   border-bottom: none !important
// }
.JNPF-common-table {
  border: 1px solid #ebeef5 !important;
}

.JNPF-common-layout-main {
  padding-top: 0;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
}
</style>