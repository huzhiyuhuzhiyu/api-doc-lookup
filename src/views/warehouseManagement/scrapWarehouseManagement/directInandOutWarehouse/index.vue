<template>
  <div class="JNPF-preview-main org-form">

    <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
      <div class="pageTitle">新建直接出入库单</div>
      <div class="options">
        <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading"
          @click="handleConfirm('draft')">保存草稿</el-button>
        <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
          @click="handleConfirm('submit')">保存并提交</el-button>
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
                        <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                          :disabled="JSON.stringify(codeConfig) == '{}' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                          maxlength="300" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="业务类型" prop="documentType">
                        <el-select v-model="dataForm.businessType" placeholder="业务类型" clearable style="width: 100%;"
                          :disabled="btnType == 'look'" filterable @change="selectDocutementType">
                          <el-option v-for="(item, index) in list" :key="index" :label="item.label"
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
                        <ComSelect-list
                          :requestObj="{ type: 'scrap', state: 'enable', projectId: isProjectSwitch === '1' ? userInfo.projectId || '' : '' }"
                          :dialogTitle="'选择仓库'" :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName"
                          :method="getWarehouseList" placeholder="请选择仓库" @change="changeWarehousex"></ComSelect-list>
                      </el-form-item>
                    </el-col>


                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2"
                          maxlength="200" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="productInfo">
                <div>
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
                  <el-table-column prop="productCode" label="产品编码" width="120" :key="4" />
                  <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                    show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" sortable="custom"
                    v-if="dataForm.documentType == 'outbound'" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                  <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6"
                    v-if="dataForm.documentType == 'inbound'"> </el-table-column>
                  <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111"
                    v-if="dataForm.documentType == 'outbound'">
                    <template slot="header">
                      <span class="required">*</span>批次号
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.batchNumber" readonly
                        @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                        {{ scope.row.batchNumber }}
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="shelfSpaceName" label="库位" :key="10112" v-if="allocationFlag">

                    <template slot="header" v-if="dataForm.documentType == 'inbound'">
                      <span class="required">*</span>库位
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.shelfSpaceName" readonly v-if="dataForm.documentType == 'inbound'"
                        @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="库位">
                      </el-input>
                      <div v-if="dataForm.documentType == 'outbound'"> {{ scope.row.shelfSpaceName }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />
                  <el-table-column prop="num" label="数量" :key="77">
                    <template slot="header">
                      <span class="required">*</span>数量
                    </template>
                    <template slot-scope="scope">
                      <el-input :disabled="btnType == 'look'" @input="watchNum(scope.row, scope.$index)"
                        v-model="scope.row.num" placeholder="数量"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="originalBatchNumber" label="原产品批次号" :key="1255"
                    v-if="dataForm.documentType == 'inbound'">
                    <template slot-scope="scope">
                      <el-input :disabled="btnType == 'look'" v-model="scope.row.originalBatchNumber"
                        placeholder="原产品批次号"></el-input>
                    </template>
                  </el-table-column>

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
    <!-- 选择产品 产品信息 -->
    <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" @close="productVisible = false"
      :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
      append-to-body>

      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

        <div class="JNPF-common-layout-center JNPF-flex-main">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>

              <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                <el-form-item>
                  <el-input @keyup.native.enter="searchProductFun()"  v-model="orderForm.productDrawingNo" placeholder="请输入品名规格" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                <el-form-item>
                  <el-input @keyup.native.enter="searchProductFun()"  v-model="orderForm.productCode" placeholder="请输入产品编码" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                <el-form-item>
                  <el-input @keyup.native.enter="searchProductFun()"  v-model="orderForm.batchNumber" placeholder="请输入批次号" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                <el-form-item>
                  <el-input @keyup.native.enter="searchProductFun()"  v-model="orderForm.productDrawingNo" placeholder="请输入品名规格" clearable />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                <el-form-item>
                  <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable />
                </el-form-item>
              </el-col> -->
              <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                <el-form-item>
                  <el-input @keyup.native.enter="searchProductFun()"  v-model="listQuery.productCode" placeholder="请输入产品编码" clearable />
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
              @selection-change="handleSelectionChangeAllPruduct" @sort-change="sortChange">

              <!-- <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" /> -->
              <!-- <el-table-column prop="name" label="产品名称" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" /> -->
              <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="code" label="产品编码" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" />
              <el-table-column prop="name" label="产品名称" sortable="custom" width="160"
                v-if="dataForm.documentType == 'inbound' && isProductNameSwitch === '1'"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="productsName" label="产品名称" sortable="custom" width="160"
                v-if="dataForm.documentType == 'outbound' && isProductNameSwitch === '1'"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="drawingNo" label="品名规格" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" />
              <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                v-if="isProjectSwitch == 1" />
              <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="batchNumber" label="批次号" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="standardValue" label="规值" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="colour" label="颜色" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="accuracyLevel" label="精度等级" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="vibrationLevel" label="振动等级" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="oil" label="油脂" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />

              <el-table-column prop="oilQuantity" label="油脂量" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="clearance" label="游隙" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="aperture" label="孔径" width="120" :key="102"
                v-if="dataForm.documentType == 'outbound'"></el-table-column>
              <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="specialRequire" label="特殊要求" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="remark" label="备注" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" />
              <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" />
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
      :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
      <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
          {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>


      <span slot="footer" class="dialog-footer">
        <el-button @click="goBack">返回列表</el-button>
        <el-button type="primary" @click="continueAdd()"> 继续新增</el-button>
      </span>
    </el-dialog>
    <!-- 选客户 -->
    <CustomerForm v-if="CustomerForm" ref="CustomerForms" @selectCustomer="handleSelectCustomer"></CustomerForm>
    <!-- 选库位 -->
    <WareHouseForm v-if="wareHouseVisible" ref="WareHouseForms" @selectWareHouseFun="selectWareHouseFun">
    </WareHouseForm>
    <!-- 选批次号 -->
    <BatchNumberForm v-if="batchNumVisible" ref="BatchNumberForms" @selectBatchNumberFun="selectBatchNumberFun">
    </BatchNumberForm>
  </div>
</template>

<script>
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getStockGoodsShelvesList, getProductionLotList, getBimBusinessSwitchConfigList, getBatchNumber, getStockGoodsShelves } from '@/api/basicData/index'
import { getcategoryTree, getCooperativeData, deleteCooperative, excelExport } from '@/api/basicData/index'
import { getcategoryTrees, getcooperativeProduct, getsaleOrderDetailList } from '@/api/salesManagement/assemblyOrders'
import { getProductList } from '@/api/masterDataManagement/productManage'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { detailByBarCodes } from '@/api/warehouseManagement/packingList'
// import { addInboundOutbound} from '@/api/warehouseManagement/inboundAndOutbounds.js'
import { getLocationList } from '@/api/warehouseManagement/inventory' // 库位分类和列表 
import WareHouseForm from './wareHouseForm.vue'
import CustomerForm from './customerForm.vue'
import BatchNumberForm from './batchNumberForm.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  components: { WareHouseForm, BatchNumberForm, CustomerForm },
  props: {
    classAttribute: "",
  },
  mixins: [getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      documentTypeList: [
        { label: "直接出库", value: "outbound", },
        { label: "直接入库", value: "inbound", },
      ],
      list: [
        { label: "直接入库", value: "inbound_other" },
        { label: "直接出库", value: "outbound_other" },
      ],
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
        warehouseName: "",
        warehouseId: "",
        documentType: "",
        businessType: "",
        sourceType: "io_other",
        id: "",
        warehouseType: "",
        inspectionResults: "",
        partnerName: "",
        cooperativePartnerId: "",
      },
      customerInfo: {},//所选客户信息
      getWarehouseList,


      dataRule: {


        orderNo: [{ required: true, message: "请输入单号", trigger: 'blur' }],
        warehouseName: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
      },
      orderForm: { //获取产品数据 
        drawingNo: "",        // customerProductNo: "",
        customerProductDrawingNo: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
      },
      productList: [],
      productTotal: 0,
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

      taxRateList: [],
      listQuery: {
        productName: '',
        productCode: '',
        productDrawingNo: '', // 图号
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
        pageNum: 1,
        pageSize: 20,
        classAttribute: 'finish_product'
      },
      isProductNameSwitch: ""
    }
  },

  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')

    this.isProjectSwitchFlag = true
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
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.tableDataFlag = true
      } catch (error) { }
    },
    // 所选择的客户数据
    handleSelectCustomer(data) {
      console.log("客户信息", data);
      this.dataForm['cooperativePartnerId'] = data.id
      this.dataForm['partnerName'] = data.name
      this.customerInfo = data
    },
    changeTaxRate(row, index) {
      console.log(row, index);
      let productArr = [...this.productData]
      productArr[index].excludingTaxCostPrice = this.jnpf.numberFormat(row.costPrice / (1 + (row.taxRate * 1 / 100)), 4)
      productArr[index].excludingTaxTotalAmount = this.jnpf.numberFormat((row.excludingTaxCostPrice * row.num), 4)
      this.productData = productArr
    },
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
    // 打开选择库位弹框
    openSeleceWareDialog(row, index) {
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库!")
      this.wareHouseVisible = true
      this.$nextTick(() => {
        this.$refs.WareHouseForms.initData(this.dataForm.warehouseId)
      })
      this.currentProductIndex = index
    },
    // 所选的库位信息
    selectWareHouseFun(data) {
      console.log("库位信息", data);
      let index = this.currentProductIndex
      this.$set(this.productData[index], 'shelfSpaceName', data.name)
      this.$set(this.productData[index], 'areaId', data.areaId)
      this.$set(this.productData[index], 'goodsShelvesId', data.goodsShelvesId)
      this.$set(this.productData[index], 'warehouseId', data.warehouseId)
      this.$set(this.productData[index], 'shelfSpaceId', data.id)
    },

    // 产品信息列表复制功能
    copyFun(row, index) {
      let data = JSON.parse(JSON.stringify(row))
      this.productData.splice(index + 1, 0, data);

    },

    // 点击选择产品 
    openSeleceProductDialog() {
      if (!this.dataForm.documentType) return this.$message.error("请先选择单据类型")
      this.productVisible = true
      this.searchProductFun()
    },
    // 销售发货选择产品——搜索 如果是销售订单  需要计算待出库数量=订单数量-已出库数量  如果是通知单 则直接取接口返回的待出库数量
    searchProductFun() {
      if (this.dataForm.documentType == 'outbound') {

        this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
        getBatchNumber(this.orderForm).then(res => {
          console.log("产品", res);

          this.productList = res.data.records
          this.productTotal = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.listLoading = true
        Object.keys(this.listQuery).forEach((key) => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        // this.listQuery.pageNum = 1
        this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
        this.listQuery.classAttribute = this.classAttribute
        this.listQuery.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
        getProductList(this.listQuery)
          .then((res) => {
            console.log("res.", res);
            this.productList = res.data.records
            this.productTotal = res.data.total
            this.listLoading = false
            this.visible = false
          })
          .catch(() => {
            this.listLoading = false
          })
      }


    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      console.log("val", val);
      this.selectSaleProductArr = val
    },
    // 销售发货选择产品——重置
    resetProductFun() {
      this.orderForm = { //获取产品数据
        drawingNo: "",        // customerProductNo: "",
        productName: "",
        productCode: "",

        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
      },
        this.listQuery = {
          productName: '',
          productCode: '',
          productDrawingNo: '', // 图号
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
          pageNum: 1,
          pageSize: 20,
          classAttribute: this.classAttribute
        },
        this.searchProductFun()

    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productDrawingNo' || prop == 'projectName' || prop === 'productName' || prop === 'productCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order === 'ascending'
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.searchProductFun()
    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      let arr = JSON.parse(JSON.stringify(this.selectSaleProductArr))
      console.log("arr", arr);
      arr.forEach(item => {

        item.classAttribute = item.classAttribute
        item.ordersId = ""
        item.ordersLineId = ""
        item.noticeId = ""
        item.num = ''
        item.costPrice = ""
        item.excludingTaxCostPrice = ""
        item.excludingTaxTotalAmount = ""
        item.noticeLineId = ""
        item.ordersLineId = ""
        item.totalAmount = ""
        item.taxAmount = ""
        item.taxRate = 13
        if (this.dataForm.documentType == 'inbound') {
          item.productsId = item.id
          item.productName = item.name
          item.productCode = item.code
        }
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









    // 获取仓库设置 是否开启库位管理时
    getWarehouseConfig() {

      let obj = { "pageSize": -1, "businessCode": "warehouse" }
      getBimBusinessSwitchConfigList(obj).then(res => {
        this.allocationFlag = res.data.warehouse[0].configValue1 == '1' ? true : false
      })
    },
    // 选择业务类型
    selectDocutementType(val) {
      console.log(val);
      // 判断当前所选的业务类型是否与上一次一样 不一样 则清空产品列表数据及客户/供应商信息

      if (val == 'outbound_sale_send' || val == 'outbound_purchase' || val == 'outbound_pick_out' || val == 'outbound_external_send' || val == 'outbound_other') {
        this.jyFlag = false
        this.dataForm.documentType = 'outbound'
        this.fetchData("CKDH")
      }
      if (val == 'inbound_sale_return' || val == 'inbound_purchase' || val == 'inbound_return_materials' || val == 'inbound_external_return' || val == 'inbound_external' || val == 'inbound_other') {
        this.dataForm.documentType = 'inbound'
        this.jyFlag = true
        this.fetchData("RKDH")

      }
      this.$forceUpdate()
      this.orderForm = { //获取产品数据
        cooperativePartnerId: "",
        drawingNo: "",        // customerProductNo: "",
        customerProductDrawingNo: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
      }

    },


    // 打开选择客户弹框
    openDialog() {
      this.CustomerForm = true
      this.$nextTick(() => {
        this.$refs.CustomerForms.init()
      })
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
      this.$router.push({
        path: "/warehouseManagement/finishedProductWarehouseManagement/inventoryList",
      })
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
          this.productData = res.data.spaceLines
          this.spaceLines = res.data.spaceLines

          this.formLoading = false
        }).catch(() => { this.formLoading = false })
      } else {
        this.title = '新建出入库单'
        this.formLoading = false


      }
    },
    // 继续新增
    continueAdd() {
      this.tipsvisible = false
      this.btnLoading = false
      this.dataForm = {  //表单信息
        orderNo: "",
        warehouseName: "",
        warehouseId: "",
        documentType: "",
        businessType: "io_other",
        sourceType: "io_other",
        id: "",
        warehouseType: "",
        inspectionResults: "",
      }
      this.productData = []
      this.$refs.dataForm.resetFields()
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
          if (this.allocationFlag && this.jyFlag) {
            this.productData.forEach((item, index) => {
              if (!item.shelfSpaceId) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行库位不能为空")
              }
            })
          }

          if (this.productData.length) {
            let totals = {};
            let totalNum = {};
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能为空")
                break
              }
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能为空")
                break
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
            this.dataForm.classAttribute = this.classAttribute
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

.JNPF-common-layout-main.JNPF-flex-main {
  padding-top: 5px;
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

.options {
  display: inline-block;
  float: right;
}

.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}
</style>