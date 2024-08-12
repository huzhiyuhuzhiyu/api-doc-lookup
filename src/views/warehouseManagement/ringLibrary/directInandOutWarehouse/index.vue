<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <div class="pageTitle">新建直接出入库单</div>
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
                          <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false"
                            maxlength="300" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单据类型" prop="documentType">
                          <el-select v-model="dataForm.documentType" placeholder="单据类型" clearable style="width: 100%;"
                            :disabled="btnType == 'look'" filterable @change="selectDocutementType">
                            <el-option v-for="(item, index) in documentTypeList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
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
                            style="width: 100%;" filterable>
                            <el-option v-for="(item, index) in inspectionResultsList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
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
                    <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" sortable="custom"
                      v-if="dataForm.documentType == 'outbound'" />

                    <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6"
                      v-if="dataForm.documentType == 'inbound'"> </el-table-column>
                    <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
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
                    <el-table-column prop="shelfSpaceName" label="货位" width="140" :key="10112" v-if="allocationFlag">

                      <template slot="header" v-if="dataForm.documentType == 'inbound'">
                        <span class="required">*</span>货位
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.shelfSpaceName" readonly v-if="dataForm.documentType == 'inbound'"
                          @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="货位">
                        </el-input>
                        <div v-if="dataForm.documentType == 'outbound'"> {{ scope.row.shelfSpaceName }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />
                    <el-table-column prop="num" label="数量" width="140" :key="77">
                      <template slot="header">
                        <span class="required">*</span>数量
                      </template>
                      <template slot-scope="scope">
                        <el-input :disabled="btnType == 'look'" @input="watchNum(scope.row, scope.$index)"
                          v-model="scope.row.num" placeholder="数量"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="costPrice" label="单价(含税)" width="120" :key="110">
                      <template slot="header">
                        <span class="required">*</span>单价(含税)
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.costPrice" :disabled="btnType == 'look' ? true : false"
                          @input="watchPrice(scope.row, scope.$index)" placeholder="请输入"
                          @blur="checkPrice(scope.row, scope.$index)">{{
                            scope.row.costPrice }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="taxRate" label="税率(%)" width="120" :key="171">
                      <template slot="header">
                        <span class="required">*</span>税率(%)
                      </template>
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;"
                          @change="changeTaxRate(scope.row, scope.$index)">
                          <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                            :value="item.taxRate"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="taxAmount" label="税额" width="120" :key="1721"></el-table-column>
                    <el-table-column prop="totalAmount" label="总金额(含税)" width="120" :key="125"></el-table-column>
                    <el-table-column prop="originalBatchNumber" label="原产品批次号" width="140" :key="1255"
                      v-if="dataForm.documentType == 'inbound'">
                      <template slot-scope="scope">
                        <el-input :disabled="btnType == 'look'" v-model="scope.row.originalBatchNumber"
                          placeholder="原产品批次号"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="standardValue" label="规值" width="120" :key="211">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.standardValue" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="2111">
                      <!-- <template slot="header">
                        <span class="required">*</span>打字内容
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable
                          style="width: 100%;">
                          <el-option v-for="(item, index) in list1" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123">
                      <!-- <template slot="header">
                        <span class="required">*</span>精度等级
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable>
                          <el-option v-for="(item, index) in list2" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>

                    <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">
                      <!-- <template slot="header">
                        <span class="required">*</span>振动等级
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="oil" label="油脂" width="120" :key="61">
                      <!-- <template slot="header">
                        <span class="required">*</span>油脂
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list5" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clearance" label="游隙" width="120" :key="100">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
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
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
        @close="productVisible = false" :visible.sync="productVisible" lock-scroll
        class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                  <el-form-item>
                    <el-input v-model="orderForm.productDrawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                  <el-form-item>
                    <el-input v-model="orderForm.productCode" placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                  <el-form-item>
                    <el-input v-model="orderForm.batchNumber" placeholder="请输入批次号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                  <el-form-item>
                    <el-input v-model="orderForm.productDrawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                  <el-form-item>
                    <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                  <el-form-item>
                    <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable />
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
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" sortable="custom"
                  v-if="dataForm.documentType == 'outbound'" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="160" sortable="custom"
                  v-if="dataForm.documentType == 'inbound'" />
                <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom"
                  v-if="dataForm.documentType == 'outbound'" />
                <el-table-column prop="name" label="产品名称" min-width="160" sortable="custom"
                  v-if="dataForm.documentType == 'inbound'" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom"
                  v-if="dataForm.documentType == 'outbound'" />
                <el-table-column prop="code" label="产品编码" min-width="160" sortable="custom"
                  v-if="dataForm.documentType == 'inbound'" />
                <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom"
                  v-if="dataForm.documentType == 'outbound'" />
                <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom"
                  v-if="dataForm.documentType == 'outbound'" />
                <el-table-column prop="batchNumber" label="批次号" width="160" sortable="custom"
                  v-if="dataForm.documentType == 'outbound'" />
                <el-table-column prop="standardValue" label="规值" width="160" sortable="custom"
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
                <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom"
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
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
        width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>


        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>
          <el-button type="primary" @click="continueAdd()"> 继续新增</el-button>
        </span>
      </el-dialog>
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
import { getcategoryTrees, getcooperativeProduct, getsaleOrderDetailList } from '@/api/salesManagement/assemblyOrders'
import { getProductList } from '@/api/masterDataManagement/productManage'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { detailByBarCodes } from '@/api/warehouseManagement/packingList'
// import { addInboundOutbound} from '@/api/warehouseManagement/inboundAndOutbounds.js'
import { getLocationList } from '@/api/warehouseManagement/inventory' // 库位分类和列表 
import WareHouseForm from './wareHouseForm.vue'
import BatchNumberForm from './batchNumberForm.vue'
export default {
  components: { WareHouseForm, BatchNumberForm },

  data() {
    return {
      documentTypeList: [
        { label: "直接出库", value: "outbound", },
        { label: "直接入库", value: "inbound", },
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
        businessType: "io_other",
        sourceType: "io_other",
        id: "",
        warehouseType: "",
        inspectionResults: "",
      },
      customerInfo: {},//所选客户信息
      getWarehouseList,

      inspectionResultsList: [//检验下拉框数据
        { label: "合格", value: "qualified" },
        { label: "不合格", value: "unqualified" },
        { label: "待检验", value: "unInspect" },
      ],
      dataRule: {
        documentType: [{ required: true, message: "单据类型不能为空", trigger: 'change' }],

        inspectionResults: [{ required: true, message: "检验标志不能为空", trigger: 'change' }],

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
        classAttribute: "semi_finished",
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
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
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
        classAttribute: 'semi_finished'
      },
    }
  },
  created() {
    this.getWarehouseConfig()
    this.getProductClassFun()
  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },
  methods: {
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
        getProductList(this.listQuery)
          .then((res) => {
            console.log("res.", res);
            this.productList = res.data.records
            this.total = res.data.total
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
        classAttribute: "semi_finished",
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
          classAttribute: 'semi_finished'
        },
        this.searchProductFun()

    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productDrawingNo' || prop === 'productName' || prop === 'productCode') {
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

        item.classAttribute = "semi_finished"
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
    // 含税价格输入失去焦点 检验不能为  0
    checkPrice(row, index) {
      if (!row.costPrice) {
        this.$message({
          message: "请填写第" + (index + 1) + "行产品的单价(含税)",
          type: 'error',
          duration: 1500,
        })
      } else if (Number(row.costPrice) == 0) {
        this.$message({
          message: "第" + (index + 1) + "行产品的单价(含税)必须大于0",
          type: 'error',
          duration: 1500,
        })

      }
    },
    // 监听含税价格输入
    watchPrice(row, index) {
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      row.costPrice = row.costPrice.replace(/[^\d.]/g, '');
      let productArr = [...this.productData]

      if (row.costPrice.length == 1 && row.costPrice == '.') {
        // 如果第一位是小数点，则清空输入框
        row.costPrice = '';
        row.assistantNum = '';
      } else if (row.costPrice.length == 2 && row.costPrice[0] == '0' && row.costPrice[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.costPrice = row.costPrice.slice(0, 1) + '.' + row.costPrice.slice(1);
      } else if (row.costPrice.length > 2 && row.costPrice[0] == '0' && row.costPrice[1] != '.') {
        row.costPrice = row.costPrice.substring(1, row.costPrice.length)
      }


      if (row.costPrice.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果

        for (let i = 0; i < row.costPrice.length; i++) {
          const char = row.costPrice[i];
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

        row.costPrice = result;
        let arr = row.costPrice.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 4) {
          arr[1] = arr[1].substring(0, 4)
        }
        row.costPrice = arr[0] + '.' + arr[1]
      } else {
        if (row.costPrice.length > 8) {
          row.costPrice = row.costPrice.substring(0, 8);
        }
      }
      productArr[index].excludingTaxCostPrice = this.jnpf.numberFormat(row.costPrice / (1 + (row.taxRate * 1 / 100)), 4)
      productArr[index].excludingTaxTotalAmount = this.jnpf.numberFormat((row.excludingTaxCostPrice * row.num), 4)
      productArr[index].totalAmount = this.jnpf.numberFormat((row.costPrice * row.num), 4)
      productArr[index].taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [row.costPrice, row.excludingTaxCostPrice]), 6)]), 6)

      this.productData = productArr
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
      console.log("row.excludingTaxCostPrice", row.excludingTaxCostPrice);
      console.log("row.costPrice", row.costPrice);
      productArr[index].totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.costPrice]), 6)

      productArr[index].taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [row.costPrice, row.excludingTaxCostPrice]), 6)]), 6)
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
    selectDocutementType(val) {
      console.log(val);
      // 判断当前所选的业务类型是否与上一次一样 不一样 则清空产品列表数据及客户/供应商信息

      if (val == 'inbound') {
        this.jyFlag = true
        this.fetchData("RKDH")
      }
      if (val == 'outbound') {
        this.jyFlag = false
        this.fetchData("CKDH")

      }
      this.$forceUpdate()
      this.orderForm = { //获取产品数据
        cooperativePartnerId: "",
        drawingNo: "",        // customerProductNo: "",
        customerProductDrawingNo: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        classAttribute: "semi_finished",
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
                this.$message.error("产品信息第" + (index + 1) + "行货位不能为空")
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
            this.dataForm.classAttribute = "semi_finished"
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
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
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
        this.list8 = res.data.records
      })
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
        this.list1 = res.data.records
      })
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
        this.list2 = res.data.records
      })
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
        this.list3 = res.data.records
      })
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
        this.list4 = res.data.records
      })
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
        this.list5 = res.data.records
      })
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
        this.list6 = res.data.records
      })
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
        this.list7 = res.data.records
      })


      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log("税率", this.taxRateList);
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