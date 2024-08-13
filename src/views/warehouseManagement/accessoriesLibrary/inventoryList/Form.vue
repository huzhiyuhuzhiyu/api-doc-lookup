<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading"
            @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
            @click="handleConfirm('submit')">保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
              :element-loading-text="loadingText">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入订单编号"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false"
                            maxlength="300" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="业务类型" prop="businessType">
                          <el-select v-model="dataForm.businessType" placeholder="请选择业务类型" style="width: 100%;"
                            @change="selectSourceTypeFun" :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in sourceTypeList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24"
                        v-if="dataForm.businessType == 'outbound_sale_send' || dataForm.businessType == 'inbound_sale_return'">
                        <el-form-item label="客户" prop="cooperativePartnerId">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择所属客户" readonly @focus="openDialog"
                            :disabled="btnType == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24"
                        v-if="dataForm.businessType == 'inbound_purchase' || dataForm.businessType == 'outbound_purchase' || dataForm.businessType == 'outbound_external' || dataForm.businessType == 'inbound_external'">
                        <el-form-item label="供应商" prop="cooperativePartnerId">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择供应商" readonly @focus="openDialog"
                            :disabled="btnType == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="仓库" prop="warehouseName">
                          <ComSelect-list :requestObj="{ type: 'normal' }" :dialogTitle="'选择仓库'"
                            :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName" :method="getWarehouseList"
                            placeholder="请选择仓库" @change="changeWarehousex"></ComSelect-list>





                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="jyFlag">
                        <el-form-item label="检验标志" prop="inspectionResults">
                          <el-select v-model="dataForm.inspectionResults" placeholder="检验结果" clearable
                            style="width: 100%;" :disabled="btnType == 'look'" filterable>
                            <el-option v-for="(item, index) in inspectionResultsList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>





                        </el-form-item>
                      </el-col>

                      <el-col :sm="12" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" placeholder="请输入备注"
                            :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2" maxlength="200" />
                        </el-form-item>
                      </el-col>
                    </el-row>


                  </el-form>
                </el-collapse-item>



                <el-collapse-item title="产品信息" name="productInfo">
                  <div v-if="btnType !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                      @click="openSeleceProductDialog()">选择产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                      @click="batchDelete">批量删除</el-button>

                  </div>

                  <el-table ref="product" :data="productData" :fixedNO="true" @selection-change="handeleProductInfoData"
                    border :key="165" style="width: 100%;">
                    <el-table-column type="selection" width="55" fixed="left" :key="2">
                    </el-table-column>
                    <el-table-column type="index" width="60" label="序号" :key="10"></el-table-column>
                    <el-table-column prop="customerProductNo" label="客户料号" width="160" :key="1212">
                    </el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6">
                    </el-table-column>
                    <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                    <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111"
                      v-if="dataForm.businessType == 'outbound_sale_send' || dataForm.businessType == 'outbound_purchase'">
                      <template slot="header">
                        <span class="required">*</span>批次号
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.batchNumber" readonly :disabled="btnType == 'look'"
                          @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                          {{ scope.row.batchNumber }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="shelfSpaceName" label="货位" width="140" :key="10112" v-if="allocationFlag">
                      <template slot="header"
                        v-if="dataForm.businessType == 'inbound_sale_return' || dataForm.businessType == 'inbound_purchase'">
                        <span class="required">*</span>货位
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.shelfSpaceName" readonly :disabled="btnType == 'look'"
                          v-if="dataForm.businessType == 'inbound_sale_return' || dataForm.businessType == 'inbound_purchase'"
                          @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="货位">
                        </el-input>
                        <div
                          v-if="dataForm.businessType == 'outbound_sale_send' || dataForm.businessType == 'outbound_purchase'">
                          {{ scope.row.shelfSpaceName }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />
                    <el-table-column prop="availableBatchNumber" label="批次可用数量" width="140" :key="7"
                      v-if="dataForm.businessType == 'outbound_sale_send' || dataForm.businessType == 'outbound_purchase'"></el-table-column>
                    <el-table-column prop="num" label="数量" width="140" :key="77">
                      <template slot="header">
                        <span class="required">*</span>数量
                      </template>
                      <template slot-scope="scope">
                        <el-input :disabled="btnType == 'look'" @input="watchNum(scope.row, scope.$index)"
                          v-model="scope.row.num" placeholder="数量"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="costPrice" label="单价(含税)" width="120" :key="110"></el-table-column>
                    <el-table-column prop="taxRate" label="税率(%)" width="120" :key="171"></el-table-column>
                    <el-table-column prop="taxAmount" label="税额" width="120" :key="1721"></el-table-column>
                    <el-table-column prop="totalAmount" label="总金额(含税)" width="120" :key="125"></el-table-column>
                    <el-table-column prop="originalBatchNumber" label="原产品批次号" width="140" :key="1255"
                      v-if="dataForm.businessType == 'inbound_sale_return'">
                      <template slot-scope="scope">
                        <el-input :disabled="btnType == 'look'" v-model="scope.row.originalBatchNumber"
                          placeholder="原产品批次号"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="standardValue" label="规值" width="120" :key="211"
                      v-if="this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase'"></el-table-column>
                    <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="2121"></el-table-column>
                    <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123"></el-table-column>
                    <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17"></el-table-column>
                    <el-table-column prop="oil" label="油脂" width="120" :key="61"></el-table-column>
                    <!-- <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51"> </el-table-column> -->
                    <el-table-column prop="clearance" label="游隙" width="120" :key="100"></el-table-column>
                    <!-- <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101"></el-table-column> -->
                    <!-- <el-table-column prop="shelfSpaceName" label="货位" width="120" :key="1011"
                      v-if="allocationFlag || !jyFlag">
                      <template slot="header" v-if="jyFlag">
                        <span class="required">*</span>货位
                      </template>
                      <template slot-scope="scope" v-if="jyFlag">
                        <el-input v-model="scope.row.shelfSpaceName" readonly
                          @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="货位">{{
                            scope.row.shelfSpaceName }}
                        </el-input>
                      </template>
                    </el-table-column> -->
                    <el-table-column prop="remark" label="备注" width="200" :key="128"></el-table-column>
                    <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'">
                      <template slot-scope="scope">
                        <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                </el-collapse-item>

              </el-collapse>

            </div>
          </div>
        </div>
      </div>
      <!-- 销售发货 产品信息 -->
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
        @close="productVisible = false" :visible.sync="productVisible" lock-scroll
        class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="6"
                  v-if="this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'inbound_sale_return'">
                  <el-form-item>
                    <el-input v-model="orderForm.customerProductDrawingNo" placeholder="请输入客户料号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6"
                  v-if="this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'inbound_purchase'">
                  <el-form-item>
                    <el-input v-model="orderForm.orderNo" placeholder="请输入单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.drawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item >
                    <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="交货开始日期" end-placeholder="交货结束日期" clearable>
                    </el-date-picker>
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
              <JNPF-table v-loading="listLoading" :data="productList" hasC
                @selection-change="handleSelectionChangeAllPruduct">
                <el-table-column prop="orderNo" label="订单号" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="customerProductNo" label="客户料号" width="160" sortable="custom" v-if="this.dataForm.businessType=='outbound_sale_send'||this.dataForm.businessType=='inbound_sale_return'"/>
                <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
                <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" width="90" sortable="custom" />
                <el-table-column prop="num" label="数量" width="160" sortable="custom"
                  v-if="this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'inbound_sale_return'" />
                <el-table-column prop="purchaseQuantity" label="数量" width="160" sortable="custom"
                  v-if="this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase'" />
                <el-table-column prop="undeliveredQuantity" label="待出库数量" width="160" sortable="custom"
                  v-if="dataForm.businessType == 'outbound_sale_send'" />
                <el-table-column prop="requiredReceivedQuantity" label="待入库数量" width="160" sortable="custom"
                  v-if="dataForm.businessType == 'inbound_purchase' " />
                <el-table-column prop="deliveryDate" label="交货日期" width="160" sortable="custom"  />
                <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom" />
                <el-table-column prop="accuracyLevel" label="精度等级" width="160" sortable="custom" />
                <el-table-column prop="vibrationLevel" label="振动等级" width="160" sortable="custom" />
                <el-table-column prop="oil" label="油脂" width="160" sortable="custom" />
                <!-- { label: "销售发货", value: "outbound_sale_send" },
        { label: "销售退货", value: "inbound_sale_return" },
        { label: "采购收货", value: "inbound_purchase" },
        { label: "采购退货", value: "outbound_purchase" },
        { label: "生产领料", value: "outbound_pick_out" },
        { label: "生产退料", value: "inbound_return_materials" },
        { label: "外协发料", value: "outbound_external_send" },
        { label: "外协退料", value: "inbound_external_return" },
        { label: "外协收货", value: "inbound_external" },
        { label: "外协退货", value: "outbound_external" }, -->
                <el-table-column prop="oilQuantity" label="油脂量" width="160" sortable="custom"
                  v-if="dataForm.businessType != 'outbound_sale_send' || dataForm.businessType != 'inbound_sale_return'" />
                <el-table-column prop="clearance" label="游隙" width="160" sortable="custom" />
                <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom"
                  v-if="dataForm.businessType != 'outbound_sale_send' || dataForm.businessType != 'inbound_sale_return'" />
                <el-table-column prop="remark" label="备注" width="160" sortable="custom" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
              </JNPF-table>
              <pagination :total="productTotal" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
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
          <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()"> {{ btnText }}</el-button>
          <el-button v-else type="primary" @click="continueAdd()"> {{ btnText }}</el-button>
        </span>
      </el-dialog>
      <!-- 选客户 -->
      <CustomerForm v-if="CustomerForm" ref="CustomerForms" @selectCustomer="handleSelectCustomer"></CustomerForm>
      <!-- 选货位 -->
      <WareHouseForm v-if="wareHouseVisible" ref="WareHouseForms" @selectWareHouseFun="selectWareHouseFun">
      </WareHouseForm>
      <!-- 选批次号 -->
      <BatchNumberForm v-if="batchNumVisible" ref="BatchNumberForms" @selectBatchNumberFun="selectBatchNumberFun">
      </BatchNumberForm>
    </div>
  </transition>
</template>

<script>
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getStockGoodsShelvesList, getProductionLotList, getBimBusinessSwitchConfigList, getBatchNumber, getStockGoodsShelves } from '@/api/basicData/index'
import { getcategoryTree, getCooperativeData, deleteCooperative, excelExport } from '@/api/basicData/index'
import { detailpurchaseOrderList } from '@/api/purchasingAndOutsourcingOrders/index'
import { getcategoryTrees, getcooperativeProduct, getsaleOrderDetailList } from '@/api/salesManagement/assemblyOrders'
import { detailByBarCodes } from '@/api/warehouseManagement/packingList'
// import { addInboundOutbound} from '@/api/warehouseManagement/inboundAndOutbounds.js'
import TableFormProduct from "./TableForm-product.vue"
import { getLocationList } from '@/api/warehouseManagement/inventory' // 库位分类和列表
import CustomerForm from './customerForm.vue'
import WareHouseForm from './wareHouseForm.vue'
import BatchNumberForm from './batchNumberForm.vue'
export default {
  components: { TableFormProduct, CustomerForm, WareHouseForm, BatchNumberForm },

  data() {
    return {
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
      ],
      inspectionResultsList: [//检验下拉框数据
        { label: "合格", value: "qualified" },
        { label: "不合格", value: "unqualified" },
        { label: "待检验", value: "unInspect" },
      ],
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
      orderForm: { //获取产品数据
        cooperativePartnerId: "",
        classAttribute: "accessories",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: ""
        }],
      },
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
      selectcustomerObj: {
        type: ""
      },
      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      spaceLines: [],
      productionLotList: [],
      loadingText: '',
      copyLinesData: [],
      previousValue: "",
      customerType: "",
    }
  },
  created() {
    this.getWarehouseConfig()
  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },
  methods: {
    // 打开选择批次号弹框
    openSeleceBatchNumberDialog(data, index) {
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库")
      this.batchNumVisible = true
      data.warehouseId = this.dataForm.warehouseId
      this.$nextTick(() => {
        this.$refs.BatchNumberForms.init(data, index)
      })
    },
    // 选择批次
    selectBatchNumberFun(data, index) {
      console.log("批次号数据", data, index);
      this.$set(this.productData[index], 'areaId', data.areaId)
      this.$set(this.productData[index], 'goodsShelvesId', data.goodsShelvesId)
      this.$set(this.productData[index], 'warehouseId', data.warehouseId)
      this.$set(this.productData[index], 'shelfSpaceId', data.shelfSpaceId)
      this.$set(this.productData[index], 'shelfSpaceName', data.shelfSpaceName)
      let num = this.jnpf.numberFormat(this.jnpf.math('subtract', [data.availableQuantity, data.occupancyQuantity]), 6)
      this.$set(this.productData[index], 'availableBatchNumber', num)
      this.$set(this.productData[index], 'batchNumber', data.batchNumber)
    },
    // 打开选择货位弹框
    openSeleceWareDialog(row, index) {
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库!")
      this.wareHouseVisible = true
      this.$nextTick(() => {
        this.$refs.WareHouseForms.initData(this.dataForm.warehouseId)
      })
      this.currentProductIndex = index
    },
    // 所选的货位信息
    selectWareHouseFun(data) {
      console.log("货位信息", data);
      let index = this.currentProductIndex
      this.$set(this.productData[index], 'shelfSpaceName', data.name)
      this.$set(this.productData[index], 'areaId', data.areaId)
      this.$set(this.productData[index], 'goodsShelvesId', data.goodsShelvesId)
      this.$set(this.productData[index], 'warehouseId', data.warehouseId)
      this.$set(this.productData[index], 'shelfSpaceId', data.id)
    },

    //   console.log("object,", this.productData);
    // },
    // 产品信息列表复制功能
    copyFun(row, index) {
      let data = JSON.parse(JSON.stringify(row))
      this.productData.splice(index + 1, 0, data);

    },

    // 点击选择产品 销售发货 
    openSeleceProductDialog() {
      let msg = ""
      if (this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'inbound_sale_return') {
        msg = '请先选择客户'
      } else if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase') {
        msg = '请先选择供应商'
      }
      if (!this.dataForm.businessType) return this.$message.error('请先选择业务类型')
      if (!this.dataForm.cooperativePartnerId) return this.$message.error(msg)
      this.productVisible = true
      this.searchProductFun()
    },
    searchProductFun() {

      // 销售发退货查询产品
      if (this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'inbound_sale_return') {
        this.orderForm = { //获取产品数据
          cooperativePartnerId: "",
          classAttribute: "accessories",
          pageNum: 1,
          pageSize: 20,
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: ""
          }],
        }
        this.orderForm.drawingNo = ""
        this.orderForm.customerProductDrawingNo = ""
        this.orderForm.deliveryStartTime = ""
        this.orderForm.deliveryEndTime = ""
        if (this.deliveryDateArr.length) {
          this.orderForm.deliveryStartTime = this.deliveryDateArr[0]
          this.orderForm.deliveryEndTime = this.deliveryDateArr[1]
        } else {
          this.orderForm.deliveryStartTime = ""
          this.orderForm.deliveryEndTime = ""
        }
        this.orderForm.cooperativePartnerId = this.dataForm.cooperativePartnerId
        if (this.dataForm.businessType == 'inbound_sale_return') {
          this.orderForm.returnQueryFlag = 1
        }else{
          this.orderForm.shipmentStatus='not_finish'
        }

        getsaleOrderDetailList(this.orderForm).then(res => {
          console.log("产品", res);
          res.data.records.forEach(item => {
            item.undeliveredQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.num, item.outboundQuantity]), 6)
          });
          this.productList = res.data.records
          this.productTotal = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })

      }
      // 采购收退货查询产品
      if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase') {

        this.orderForm = { //获取产品数据
          cooperativePartnerId: "",
          classAttribute: "accessories",
          pageNum: 1,
          pageSize: 20,
          orderType:"procure",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: ""
          }],
        }
        this.orderForm.cooperativePartnerId=this.dataForm.cooperativePartnerId
        this.orderForm.deliverDateEnd = ""
        this.orderForm.deliverDateStart = "" 
        this.orderForm.productDrawingNo = "" 
        this.orderForm.orderNo = ""
        if (this.deliveryDateArr.length) {
          this.orderForm.deliverDateStart = this.deliveryDateArr[0]
          this.orderForm.deliverDateEnd = this.deliveryDateArr[1]
        } else {
          this.orderForm.deliverDateStart = ""
          this.orderForm.deliverDateEnd = ""
        }
        if(this.dataForm.businessType=='inbound_purchase'){
          this.orderForm.receivingStatus='not_finished'
        }else{
          this.orderForm.returnQueryFlag = 1
        }
        detailpurchaseOrderList(this.orderForm).then(res => {
          console.log("采购收退货明细", res);

          this.productList = res.data.records
          this.total = res.data.total
        })
      }

      // { label: "销售发货", value: "outbound_sale_send" },
      //   { label: "销售退货", value: "inbound_sale_return" },
      //   { label: "采购收货", value: "inbound_purchase" },
      //   { label: "采购退货", value: "outbound_purchase" },
      //   { label: "生产领料", value: "outbound_pick_out" },
      //   { label: "生产退料", value: "inbound_return_materials" },
      //   { label: "外协发料", value: "outbound_external_send" },
      //   { label: "外协退料", value: "inbound_external_return" },
      //   { label: "外协收货", value: "inbound_external" },
      //   { label: "外协退货", value: "outbound_external" },  


    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      this.selectSaleProductArr = val
    },
    // 销售发货选择产品——重置
    resetProductFun() {
      this.deliveryDateArr = []
      this.searchProductFun()

    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      let arr = JSON.parse(JSON.stringify(this.selectSaleProductArr))
      arr.forEach(item => {
        if (this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'inbound_sale_return') {
          item.ordersNum = JSON.parse(JSON.stringify(item.num))

        }
        if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase') {

          item.ordersNum = JSON.parse(JSON.stringify(item.purchaseQuantity))
        }
        item.costPrice = item.price
        let taxrate = 1 * 1 + (item.taxRate) / 100 * 1
        item.excludingTaxCostPrice = this.jnpf.numberFormat(this.jnpf.math('divide', [item.price, taxrate]), 6)
        if (this.dataForm.businessType == 'outbound_sale_send') {
          item.num = item.undeliveredQuantity
          item.taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [item.price, item.excludingTaxCostPrice]), 6)]), 6)
        }
        if (this.dataForm.businessType == 'inbound_purchase'|| this.dataForm.businessType == 'outbound_purchase') {
          this.$set(item, 'num', item.purchaseQuantity)
          item.totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.price]), 6)
          item.taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [item.price, item.excludingTaxPrice]), 6)]), 6)
          item.excludingTaxTotalAmount = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.totalAmount, item.taxAmount]), 6)
        }
        if (this.dataForm.businessType == 'inbound_sale_return' || this.dataForm.businessType == 'outbound_purchase') {

          item.totalAmount = ""
          item.num = ""

        }
        item.classAttribute = "accessories"
        if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase') {
          item.ordersId = item.purchaseOrderId
        }
        if (this.dataForm.businessType == 'inbound_sale_return' || this.dataForm.businessType == 'outbound_sale_send') {

          item.ordersId = item.ordersId
        }
        item.ordersLineId = item.id

        console.log(" item.excludingTaxCostPrice", item.excludingTaxCostPrice, item.ordersNum);
        // item.taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [item.price, item.excludingTaxPrice]), 6)]), 6)

        this.productData.push(item)
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
      console.log("row.excludingTaxPrice", row.excludingTaxPrice);
      console.log("row.price", row.price);
      productArr[index].totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.price]), 6)

      productArr[index].taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [row.price, row.excludingTaxPrice]), 6)]), 6)
      productArr[index].excludingTaxTotalAmount = this.jnpf.numberFormat(this.jnpf.math('subtract', [productArr[index].totalAmount, productArr[index].taxAmount]), 6)
      console.log("productArr", productArr);
      this.productData = productArr
    },









    // 获取仓库设置 是否开启库位管理时
    getWarehouseConfig() {

      let obj = { "pageSize": -1, "businessCode": "warehouse" }
      getBimBusinessSwitchConfigList(obj).then(res => {
        this.allocationFlag = res.data.warehouse[0].configValue1 == '1' ? true : false
      })
    },
    // 选择业务类型
    selectSourceTypeFun(val) {
      console.log(val);
      // 判断当前所选的业务类型是否与上一次一样 不一样 则清空产品列表数据及客户/供应商信息

      if (val != this.previousValue) {
        this.productData = []
        this.dataForm['cooperativePartnerId'] = ""
        this.dataForm['partnerName'] = ""
        this.customerInfo = {}
        this.previousValue = val
        this.$refs.dataForm.clearValidate(['cooperativePartnerId'])
      } else {

      }
      if (this.dataForm.businessType == 'inbound_sale_return' ||
        this.dataForm.businessType == 'inbound_purchase' ||
        this.dataForm.businessType == 'inbound_return_materials' ||
        this.dataForm.businessType == 'inbound_external_return' ||
        this.dataForm.businessType == 'inbound_external') {
        this.jyFlag = true
        this.fetchData("RKDH")
      }
      if (this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_pick_out' || this.dataForm.businessType == 'outbound_external_send') {
        this.jyFlag = false
        this.fetchData("CKDH")

      }
      if (this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'inbound_sale_return') {
        this.customerType = 'customer'
      }
      if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_external' || this.dataForm.businessType == 'inbound_external') {

        this.customerType = 'supplier'
      }
      this.$forceUpdate()


    },


    // 打开选择客户弹框
    openDialog() {
      this.CustomerForm = true
      this.$nextTick(() => {
        this.$refs.CustomerForms.init(this.customerType, this.dataForm.businessType)
      })
    },
    // 所选择的客户数据
    handleSelectCustomer(data) {
      console.log("客户信息", data);
      this.dataForm['cooperativePartnerId'] = data.id
      this.dataForm['partnerName'] = data.name
      this.customerInfo = data
    },

    changeWarehousex(val, data) {
      console.log("data", data);
      if (!val && !data.length) {
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.warehouseType = ""
        return
      }
      this.dataForm.warehouseId = data[0].id
      this.dataForm.warehouseName = data[0].name
      this.dataForm.warehouseType = data[0].all.type
    },
    goBack() {
      this.$emit('close', true)
    },





    init(id, btnType) {
      // this.visible = true
      this.formLoading = true
      this.oldId = JSON.parse(JSON.stringify(id)) || ""
      this.oldType = JSON.parse(JSON.stringify(btnType))
      this.btnType = btnType
      console.log("btnty", btnType);
      // this.refeshDataFormItems()
      if (id) {
        this.title = btnType == 'look' ? '查看出入库单' : '编辑出入库单'
        // 获取详情
        detailWarehouseData(id).then(res => {
          this.dataForm = res.data.stockMove
          if (this.dataForm.businessType == 'inbound_sale_return' ||
            this.dataForm.businessType == 'inbound_purchase' ||
            this.dataForm.businessType == 'inbound_return_materials' ||
            this.dataForm.businessType == 'inbound_external_return' ||
            this.dataForm.businessType == 'inbound_external') {
            this.jyFlag = true
          }
          if (this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_pick_out' || this.dataForm.businessType == 'outbound_external_send') {
            this.jyFlag = false

          }
          // { label: "销售发货", value: "outbound_sale_send" },
          //   { label: "销售退货", value: "inbound_sale_return" },
          //   { label: "采购收货", value: "inbound_purchase" },
          //   { label: "采购退货", value: "outbound_purchase" },
          //   { label: "生产领料", value: "outbound_pick_out" },
          //   { label: "生产退料", value: "inbound_return_materials" },
          //   { label: "外协发料", value: "outbound_external_send" },
          //   { label: "外协退料", value: "inbound_external_return" },
          //   { label: "外协收货", value: "inbound_external" },
          //   { label: "外协退货", value: "outbound_external" },
          if (res.data.stockMove.businessType == "outbound_sale_send" || res.data.stockMove.businessType == "inbound_sale_return") {
            this.selectcustomerObj.type = 'customer'
          } else if (res.data.stockMove.businessType == "purchase_delivery_return" || res.data.stockMove.businessType == "outside_delivery_return") {
            this.selectcustomerObj.type = 'supplier'

          } else {
            this.customerInfo = {}
          }
          this.productData = res.data.spaceLines
          this.spaceLines = res.data.spaceLines

          this.formLoading = false
        }).catch(() => { this.formLoading = false })
      } else {
        this.title = '新建出入库单'
        this.formLoading = false


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
        inspectionResults: "",
      }
      this.productData = []
      this.$refs.dataForm.resetFields()
      this.init('', 'add')
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        this.dataForm.orderNo = data.number

      } catch (error) {
      }
    },
    async handleConfirm(submitModel) {

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let submitFlag = true // 自动聚焦是否可用
          // 判断子表是否有效
          if (!this.productData.length && submitFlag) {
            submitFlag = false
            this.$message.error('请至少选择一个产品')
          }
     
          if (this.productData.length) {
            let totals = {};
            let totalNum = {};
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if(!this.jyFlag&&item.batchNumber){
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行批次不能为空")
                break
              }
              if(this.allocationFlag &&this.jyFlag&&!item.goodsShelvesId){
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行货位不能为空")
                break
              }
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能为空")
                break
              }

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

              if (Number(item.num) > Number(item.ordersNum)) {
                console.log(Number(item.num));
                console.log(Number(item.ordersNum));
                console.log(Number(item.num) > Number(item.ordersNum));
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能超过订单数量")
                break
              }

              if (item.num > item.availableBatchNumber) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能超过批次可用数量")
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
            if (this.dataForm.businessType == 'outbound_sale_send') {
              for (let id in totalNum) {
                if (totalNum[id].totalNum > totalNum[id].availableBatchNumber) {
                  submitFlag = false
                  this.$message.error("同产品的总数量不能批次可用数量")
                  break
                }
              }
            }
          }




          // 自动聚焦未使用则提交
          if (submitFlag) {
            if (this.jyFlag) {
              this.dataForm.documentType = "inbound"
            } else {
              this.dataForm.documentType = "outbound"

            }
            this.dataForm.documentStatus = submitModel
            this.productData.forEach(item => item.id = "")
            // const formMethod = this.dataForm.id ? updateInboundOutbound : addInboundOutbound
            const formMethod = addWarehouseData
            // spaceLines每一项的产品id如果与linesList项的产品id相同，那么让spaceLines项的批次号也等于linesList项的批次号

            this.copyLinesData = JSON.parse(JSON.stringify(this.productData))
            this.copyLinesData.forEach(element => {
              element.warehouseType = this.dataForm.warehouseType
            });
            this.dataForm.classAttribute = "accessories"
            this.dataForm.sourceType = 'order'
            let dataObj = {
              stockMove: this.dataForm,
              lines: this.productData,
              spaceLines: this.copyLinesData
            }
            console.log("this.dataForm", this.dataForm);

            console.log(this.productData);
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
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
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
</style>