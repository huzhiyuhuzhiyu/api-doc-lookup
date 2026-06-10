<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack"
            :content="type == 'add' ? '新建直接装箱单' : type == 'edit' ? '编辑直接装箱单' : '查看直接装箱单'" />
          <div class="options" v-if="type != 'look'">
            <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">保存草稿</el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading" :element-loading-text="loadingText">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>基本信息</h5>
              </div>
              <el-row :gutter="30" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">

                  <!-- <el-col :sm="6" :xs="24">
                    <el-form-item label="采购收货单号" prop="sourceOrderNo" ref="sourceOrderNo">
                      <ComSelect-page :beforeSubmit="beforeSubmit" :renderTree="false" :isdisabled="type === 'look'"
                        v-model="dataForm.sourceOrderNo" ref="ComSelect-page" @change="purchaseData"
                        :tableItems="purchaseTableItems" :placeholder="'请选择采购收货单号'" title="选择采购收货单号"
                        :listMethod="purPurchaseReceiptReturnGoodsList" :listRequestObj="purPurchaseListRequestObj"
                        :paramsObj="{ oldData }" :searchList="purPurchaseTableSearchList" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="供应商名称" prop="partnerName" ref="partnerName">
                      <el-input type="text" v-model="dataForm.partnerName" placeholder="供应商名称" maxlength="20" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col> -->


                  <el-col :sm="6" :xs="24">
                    <el-form-item label="装箱类型" prop="packingType">
                      <el-select v-model="dataForm.packingType" placeholder="请选择装箱类型" style="width: 100%;"
                        :disabled="type !== 'add'">
                        <el-option v-for="(item, index) in packingTypeList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.packingType === 'mixed'">
                    <el-form-item label="标准箱" prop="standardBoxName">
                      <ComSelect-page :beforeSubmit="beforeSubmit1" :value="dataForm.standardBoxName"
                        :renderTree="false" :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page"
                        @change="changeStandard" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
                        :methodArr="boxProductMethodArr" :listMethod="getProductList"
                        :listRequestObj="boxProductListRequestObj" :searchList="ProductTableSearchList"
                        :elementShow="true"
                        :paramsObj="{ types: 'standardBox', standardBoxName: dataForm.standardBoxName }" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.packingType === 'mixed'">
                    <el-form-item label="零头箱" prop="oddBoxName">
                      <ComSelect-page :beforeSubmit="beforeSubmit2" :value="dataForm.oddBoxName" :renderTree="false"
                        :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page" @change="changeStandard"
                        :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="boxProductMethodArr"
                        :listMethod="getProductList" :listRequestObj="boxProductListRequestObj"
                        :searchList="ProductTableSearchList" :elementShow="true"
                        :paramsObj="{ types: 'oddBox', oddBoxName: dataForm.oddBoxName }" />

                    </el-form-item>
                  </el-col>


                  <el-col :sm="6" :xs="24">
                    <el-form-item label="总箱数" prop="num" ref="num">
                      <el-input v-model="dataForm.num" placeholder="总箱数" maxlength="20" disabled>{{ computedValue }}
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark" ref="remark">
                      <el-input type="textarea" :rows="3" v-model="dataForm.remark"
                        :placeholder="type == 'look' ? '' : '请输入备注'" maxlength="200"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>
              <div v-if="type !== 'look'">
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                  icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openSeleceProductDialog()">选择产品
                  |</el-button>
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                  icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openBarcode()">生成条码
                  |</el-button>
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                  icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="importProductFun()">导入产品
                  |</el-button>
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                  icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="downLoadTemplate()">下载导入模板
                  |</el-button>
              </div>

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="tableContainer"
                v-loading="showType">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table" @selection-change="handeleProductInfoData" ref="table">
                  <el-table-column type="selection" width="60" fixed="left" align="center"
                    v-if="dataForm.packingType === 'mixed' && type !== 'look'" key="selection"
                    :selectable="checkSelectable" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                  <el-table-column prop="productsCode" label="产品编码" key="productsCode" min-width="140"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="productsCode">
                        <div class="viewData">
                          <span>{{ scope.row.productsCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productsName" label="产品名称" key="productsName" min-width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="productsName">
                        <div class="viewData">
                          <span>{{ scope.row.productsName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drawingNo" label="型号" key="drawingNo" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="drawingNo">
                        <div class="viewData">
                          <span>{{ scope.row.drawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="routingName" label="工艺路线名称" key="routingName" min-width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="routingName">
                        <div class="viewData">
                          <span>{{ scope.row.routingName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processName" label="工序名称" key="processName" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item prop="processName">
                        <ComSelect-page :beforeSubmit="beforeSubmit" clearable :dialogTitle="'选择工序'"
                          :listDataFormatting="listDataFormatting" :value="scope.row.processName"
                          :isdisabled="type == 'look'" placeholder="请选择工序名称" ref="ComSelect-processName"
                          @change="processChange" :tableItems="processTableItems" :renderTree="false"
                          :listMethod="getProductRoutingList" :listRequestObj="processListRequestObj(scope.$index)"
                          :elementShow="true" :paramsObj="{ scope }" />
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="totalNum" label="数量" key="totalNum" min-width="140">
                    <template slot="header">
                      <span class="required">*</span>数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'totalNum'" :rules='productRules.totalNum'>
                        <el-input v-model="scope.row.totalNum" maxlength="20" :disabled="type === 'look'"
                          placeholder="请输入数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位(主)" key="mainUnit" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="mainUnit">
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 混装 -->
                  <el-table-column v-if="dataForm.packingType === 'mixed'" key="packingQuantity" prop="packingQuantity"
                    label="已装箱数量" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item prop="packingQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.packingQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="dataForm.packingType === 'mixed'" key="packedQuantity" prop="packedQuantity"
                    label="待装箱数量" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item prop="packedQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.packedQuantity ? scope.row.packedQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <!-- 单装 -->
                  <el-table-column prop="standardBoxName" label="标准箱" min-width="180" key="standardBoxName"
                    v-if="dataForm.packingType === 'single'">
                    <template slot="header">
                      <span class="required">*</span>标准箱
                    </template>
                    <template slot-scope="scope">

                      <el-form-item :prop="'data.' + scope.$index + '.' + 'standardBoxName'"
                        :rules='productRules.standardBoxName'>
                        <ComSelect-page :beforeSubmit="beforeSubmitStand" :value="scope.row.standardBoxName"
                          :renderTree="false" :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page"
                          @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
                          :methodArr="boxProductMethodArr" :listMethod="getProductList"
                          :listRequestObj="boxProductListRequestObj" :searchList="ProductTableSearchList"
                          :elementShow="true"
                          :paramsObj="{ index: scope.$index, types: 'standardBox', standardBoxName: scope.row.standardBoxName }" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="dataForm.packingType === 'single'" prop="packing" label="装箱数量" min-width="180"
                    key="packing">
                    <template slot="header">
                      <span class="required">*</span>装箱数量
                    </template>
                    <template slot-scope="scope">
                      <!-- <el-form-item :prop="'data.' + scope.$index + '.' + 'packing'" :rules='productRules.packing'
                        v-if="!scope.row.defaultFlag">
                        <div class="viewData">
                          <span>{{ scope.row.packing }}</span>
                        </div>
                      </el-form-item> -->
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'packing'" :rules='productRules.packing'>
                        <el-input v-model="scope.row.packing" maxlength="20" :disabled="type === 'look'"
                          placeholder="请输入装箱数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="oddBoxName" label="零头箱" v-if="dataForm.packingType === 'single'"
                    min-width="180" key="oddBoxName">
                    <template slot="header">
                      <span class="required">*</span>零头箱
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'oddBoxName'"
                        :rules='productRules.oddBoxName'>
                        <ComSelect-page :beforeSubmit="beforeSubmitStand2" :value="scope.row.oddBoxName"
                          :renderTree="false" :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page"
                          @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
                          :methodArr="boxProductMethodArr" :listMethod="getProductList"
                          :listRequestObj="boxProductListRequestObj" :searchList="ProductTableSearchList"
                          :elementShow="true"
                          :paramsObj="{ index: scope.$index, types: 'oddBox', oddBoxName: scope.row.oddBoxName }" />


                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="num" label="箱数" v-if="dataForm.packingType === 'single'" min-width="140"
                    key="num">
                    <template slot-scope="scope">
                      <el-form-item prop="num">
                        <div class="viewData">
                          <span>{{ scope.row.num }}</span>
                        </div>
                      </el-form-item>

                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" key="remark" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="200"
                        :disabled="type === 'look'" :placeholder="type == 'look' ? '' : '请输入备注'">{{
                          scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="90" fixed="right" key="right"
                    v-if="dataFormTwo.data.length > 1 && type != 'look'">
                    <template slot-scope="scope">
                      <el-button v-if="type != 'look'" type="text" class="JNPF-table-delBtn" :disabled="type === 'look'"
                        @click="deleteProduct(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>



            </el-tab-pane>

            <el-tab-pane label="装箱条码" name="boxCode">
              <CodeTable ref="CodeTable" @lookCode="lookCode" @delth="delequipment_process_relList"
                :tableData="tableData" :mixedTableData="mixedTableData" :listLoading="listLoading" :morePrintData="{
                  packingType: dataForm.packingType,
                  sourceOrderNo: dataForm.sourceOrderNo,
                  cooperativePartnerCode: dataForm.cooperativePartnerCode,
                  createTime: dataForm.submitDate || jnpf.getToday()
                }" :btnType="type" :show="activeName === 'boxCode'" :showRoutingLine="true" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <codeForm :standardBoxName="dataForm.standardBoxName" :oddBoxName="dataForm.oddBoxName"
          :standardBox="dataForm.standardBox" :oddBox="dataForm.oddBox" v-if="codeFormVisible" ref="codeForm"
          @codeData="mixCodeData" :showRoutingLine="true" />
        <sourceForm v-if="sourceFormVisible" ref="sourceForm" :showRoutingLine="true" />
        <ComSelect-page :beforeSubmit="beforeSubmitProduct" ref="ComSelect-pageProduct" @change="productData"
          :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr"
          :listMethod="getProductList" :paramsObj="{ proData: dataFormTwo.data }"
          :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
        <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
          :http-request="UploadProduct" />
      </div>
    </transition>
  </div>
</template>
<script>
import { addSalePackingList, updateSalePackingList, detailSalePackingList, uploadstockPackingList } from '@/api/warehouseManagement/packingList'
import barCodePrint from '@/views/warehouseManagement/containerControl/barcodeManagement/barCodePrint.js'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import formValidate from "@/utils/formValidate";
import { purPurchaseReceiptReturnGoodsList, detailpurPurchaseReceiptReturnGoods } from '@/api/purchasingManagement/purchaseInquirySheet'

import { getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { mapState } from 'vuex'
import codeForm from '@/views/warehouseManagement/containerControl/components/codeForm.vue'
import sourceForm from '@/views/warehouseManagement/containerControl/components/source.vue'
import CodeTable from '@/views/warehouseManagement/containerControl/components/CodeTable.vue'
export default {
  components: {
    codeForm,
    sourceForm,
    CodeTable
  },
  data() {
    return {
      loadingText: '',
      formLoading: false,
      getProductRoutingList,
      processTableItems: [{ prop: "routingName", label: "工艺路线名称" }, { prop: "processName", label: "工序名称" }],

      sourceFormVisible: false,
      getProductList, // 产品选择弹出框树状列表请求api
      getcategoryTree,
      // material
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
        { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories", "other"],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '产品图号' },
        { prop: 'spec', label: '规格型号' },
        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeText', label: '产品分类' },
        { prop: "mainUnit", label: "主单位" }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      boxProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } }
      ], // 产品选择弹出框树状列表
      boxProductListRequestObj: {
        productCategoryType: "packaging",
        classAttribute: "",
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      codeFormVisible: false,
      listLoading: false,
      tableData: [],
      mixedTableData: [],
      purPurchaseReceiptReturnGoodsList,

      // 采购收货弹窗渲染列表
      purchaseTableItems: [
        { prop: 'orderNo', label: '收货单号', fixed: 'left' },
        { prop: 'purchaseOrderNo', label: '采购单号', fixed: 'left' },
        { prop: 'salesman', label: '业务员' },
        { prop: 'deliverDate', label: '收货日期', },
      ],
      // 采购收货通知单请求
      purPurchaseListRequestObj: {
        receiptReturnType: 'receipt',
        notificationType: 'procure',
        inspectionStatus: "inspected",               // 检验状态
        // packingstatus: 'unboxed',                     // 装箱状态 未完成
        waitPackingFlag: true,
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      // 采购收货弹窗搜索条件
      purPurchaseTableSearchList: [
        { prop: "orderNo", label: "收货单号", type: 'input' },
        { prop: "purchaseOrderNo", label: "采购单号", type: 'input' },
      ],
      activeName: 'jcInfo',
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      dataForm: {
        orderNo: '',
        documentId: '',                    // 单据id
        cooperativePartnerId: '',
        sourceOrderNo: "",                      //  收货单号
        partnerName: '',                   // 供应商名称
        packingType: 'single',                   // 装箱类型
        remark: "",
        id: '',
        num: '',
        documentStatus: '',
        documentType: 'direct_allocation',        // 直接装箱
        standardBox: '',                   //标准箱
        standardBoxName: '',
        oddBoxName: '',
        oddBox: '',                        // 零头箱
      },
      productArr: [],
      // 装箱类型
      packingTypeList: [
        { label: "单装", value: "single" },
        { label: "混装", value: "mixed" },
      ],
      type: "",


      rules: {
        packingType: [{ required: true, message: '请选择装箱类型', trigger: ['change'] }],
        standardBoxName: [{ required: true, message: '请选择标准箱', trigger: ['change'] }],
        oddBoxName: [{ required: true, message: '请选择零头箱', trigger: ['change'] }],
      },
      productRules: {
        standardBoxName: [
          { required: true, trigger: ['change'] },
          { validator: this.formValidate({ type: 'noEmtry', params: ["标准箱包材不能为空", (errMsg) => { this.$message.error('标准箱：' + errMsg) }] }), trigger: 'change' }
        ],
        oddBoxName: [
          { required: true, trigger: ['change'] },
          { validator: this.formValidate({ type: 'noEmtry', params: ["零头箱不能为空", (errMsg) => { this.$message.error('零头箱：' + errMsg) }] }), trigger: 'change' }
        ],
        totalNum: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate('positiveNumber', '', (errMsg) => { this.$message.error('数量：必须大于0') }), trigger: 'blur' }
        ],
        packing: [
          { validator: this.packingRule(), trigger: 'blur' },
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('装箱数量：不能为0') }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error(`装箱数量：${errMsg}`) }] }), trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      oldData: [],
      timeCode: '',
      codeCount: 0,
      oddNum: 0,        // 判断是否零头
      mixAllArr: [],
      oldDataTwo: [],        //切换单混 装后 回到老数据
      oldsData: [],            // 用于监听数量变化清空单装 装箱条码
      delteProductId: '',
      delteRotId: '',
      oldPacking: '',       // 旧装箱数量
      oldTotalNum: '',       // 旧数量
      tempArr: [],
      tempArr2: [],
      showType: false,
      selectedData: []
    }
  },
  created() {
  },
  mounted() {
    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.table) return
      this.$nextTick(() => { this.$refs.table.doLayout() })
    }
    window.addEventListener('resize', this.clientResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.clientResize)
  },
  computed: {
    computedValue() {
      let count = 0
      if (this.dataForm.packingType === 'single') {
        this.dataFormTwo.data.forEach(item => {
          count += item.num * 1
        })
      } else {
        count = this.mixAllArr.length
      }
      this.dataForm.num = count

      return this.dataForm.num
    },
    ...mapState('user', ['token']),
  },
  watch: {
    'dataFormTwo.data': {
      handler: function (newVal, oldVal) {
        console.log(newVal);

        this.oddNum = 0
        newVal.forEach(item => {
          if (Number(item.totalNum)) {
            item.packedQuantity = Number(item.totalNum) - Number(item.packingQuantity)
          }
          if (Number(item.totalNum) && Number(item.packing) && Number(item.totalNum) >= Number(item.packing)) {
            let count = this.divide(item.totalNum, item.packing)
            console.log(count);
            if (count.quotient && !count.remainder) {
              item.num = this.jnpf.numberFormat(count.quotient)
            }
            if (count.quotient && count.remainder) {
              item.num = this.jnpf.numberFormat(count.quotient) + 1
              this.oddNum = 1
            }
            if (!count.quotient && count.remainder) {
              item.num = 0
            }
            if (this.oldDataTwo.length) {

            } else {
              this.oldDataTwo = oldVal
            }
          } else if (Number(item.totalNum) && Number(item.packing) && Number(item.totalNum) < Number(item.packing)) {
            item.num = 1
          } else {
            item.num = 0
          }

          if (Number(item.packingQuantity) >= Number(item.totalNum)) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
        if (!this.tableData.length) {
          this.tempArr = newVal.map(item => item.totalNum)
          this.tempArr2 = newVal.map(item => item.packing)
        }
      },
      deep: true,
    },
    'dataForm.packingType': {
      handler: function (newVal, oldVal) {
        console.log(newVal, oldVal, '类型变化');
        // if (oldVal!=='') {
        if (this.type === 'add') {
          this.showTipBox(newVal, oldVal)
        }
        // }
      },
    },

  },
  methods: {
    handleSelectionChange(data) {
      this.selectedData = data
    },
    //批量打印条码
    printWithLodop(row, type) {
      const callBack = () => {
        // if(this.dataForm.packingType === 'single')
        this.$refs.dataTable && this.$refs.dataTable.clearSelection()
        this.$refs.mixedTable && this.$refs.mixedTable.clearSelection()
        this.selectedData = []
        this.$message.success('打印成功')
      }
      barCodePrint(row, callBack, type)
    },
    // 导入产品
    importProductFun() {
      // 导入产品，获取数据渲染
      if (this.dataFormTwo.data.length) {
        this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).then(() => {
          this.$refs.UploadProduct.$el.querySelector('input').click()
        }).catch(() => { })
      } else {
        this.$refs.UploadProduct.$el.querySelector('input').click()
      }
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data.file)
      //调用上传文件接口
      uploadstockPackingList(formData).then(res => {
        this.$message.success(`数据更新成功`)
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.oddBox = item.oddBoxId
            item.standardBox = item.standardBoxId
            item.oddBoxName = item.oddBoxDrawingNo
            item.standardBoxName = item.standardBoxDrawingNo
          })
          this.loadingText = ''
        }
        this.dataFormTwo.data = res.data
        this.formLoading = false
      }).catch(err => {
        this.$message.error(`${err}`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/装箱产品导入模板.xlsx')
      a.click()
    },
    // 有装箱信息后，子表切换标准箱和零头箱
    async beforeSubmitStand(data, paramsObj) {
      let flag = true
      if (this.dataForm.packingType === 'single' && this.tableData.length) {
        if (paramsObj.standardBoxName) {
          flag = await this.$confirm('已有装箱信息，修改标准箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.tableData = []
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      if (this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
        if (paramsObj.standardBoxName) {
          flag = await this.$confirm('已有装箱信息，修改标准箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.mixedTableData = []
            this.mixAllArr = []
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      return flag
    },
    async beforeSubmitStand2(data, paramsObj) {
      let flag = true
      if (this.dataForm.packingType === 'single' && this.tableData.length) {
        if (paramsObj.oddBoxName) {
          flag = await this.$confirm('已有装箱信息，修改零头箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.tableData = []
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      if (this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
        if (paramsObj.oddBoxName) {
          flag = await this.$confirm('已有装箱信息，修改零头箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.mixedTableData = []
            this.mixAllArr = []
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      return flag
    },
    // 已经选择过产品后 ，再次选择 
    async beforeSubmitProduct(data, paramsObj) {
      let flag = true
      if (paramsObj.proData.length) {
        flag = await this.$confirm('已有产品信息，再次添加将清空装箱信息，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '清空成功!'
          });
          this.mixedTableData = []
          this.mixAllArr = []
          this.tableData = []
          this.dataFormTwo.data.forEach(item => {
            item.disabled = false
            item.packingQuantity = 0
            // item.totalNum = ''
            item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
            // item.oddBox = ''
            // item.oddBoxName = ''
            // item.standardBox = ''
            // item.standardBoxName = ''
            if (item.defaultFlag) {
              item.packing = ''
            }
          })
          this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
          this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
          return true
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          return false
        })
      }

      return flag
    },
    // 有装箱信息后，主表标准箱和零头箱 
    async beforeSubmit1(data, paramsObj) {
      let flag = true
      if (this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
        if (paramsObj.standardBoxName) {
          flag = await this.$confirm('已有装箱信息，修改标准箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.mixedTableData = []
            this.mixAllArr = []
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              // item.totalNum = ''
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
            this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      return flag
    },
    async beforeSubmit2(data, paramsObj) {
      let flag = true
      if (this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
        if (paramsObj.oddBoxName) {
          flag = await this.$confirm('已有装箱信息，修改零头箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.mixedTableData = []
            this.mixAllArr = []
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
            this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      return flag
    },
    // 有装箱信息后 切换装箱类型
    showTipBox(type, oldType) {
      if (type === 'single') {
        if (this.mixedTableData.length) {
          this.showType = true
          this.$confirm('已有装箱信息，更换装箱类型，将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            // this.dataFormTwo.data = []
            this.mixedTableData = []
            this.mixAllArr = []
            this.dataForm.packingType = type
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
            this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            this.dataForm.oddBoxName = ''
            this.dataForm.oddBox = ''
            this.dataForm.standardBox = ''
            this.dataForm.standardBoxName = ''
            this.showType = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            this.dataForm.packingType = oldType
            this.showType = false
          })
        } else {
          this.dataForm.oddBoxName = ''
          this.dataForm.oddBox = ''
          this.dataForm.standardBox = ''
          this.dataForm.standardBoxName = ''
          this.dataFormTwo.data = this.oldDataTwo
        }
      }
      if (type === 'mixed') {
        if (this.tableData.length) {
          this.showType = true
          console.log(111);
          this.$confirm('已有装箱信息，更换装箱类型，将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            // this.dataFormTwo.data = []
            this.tableData = []
            this.dataForm.packingType = type
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
            this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            this.showType = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            this.dataForm.packingType = oldType
            this.showType = false
          })
        } else {
          console.log(1111);
          if (type === 'mixed' && this.dataFormTwo.data.length) {
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
            this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
          } else {
            this.dataForm.oddBoxName = ''
            this.dataForm.oddBox = ''
            this.dataForm.standardBox = ''
            this.dataForm.standardBoxName = ''
            this.dataFormTwo.data = this.oldDataTwo
          }
        }
      }
    },
    listDataFormatting(res) {
      if (!res.data.records.length) this.$message.warning('此产品没有工序')
      return res.data.records
    },
    async beforeSubmit(data, paramsObj) {
      console.log(data);
      console.log(paramsObj);
      // return
      let flag = true
      if (paramsObj.scope.row.routingLineId && this.tableData.length || paramsObj.scope.row.routingLineId && this.mixedTableData.length) {
        console.log(1111);
        if (this.dataForm.packingType === 'single' && this.tableData.length) {
          // if (paramsObj.scope.row.routingLineId) {
          flag = await this.$confirm('已有装箱信息，修改工序名称将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.tableData = []
            this.dataFormTwo.data[paramsObj.scope.$index].routingName = ""
            this.dataFormTwo.data[paramsObj.scope.$index].routingLineId = ""
            this.dataFormTwo.data[paramsObj.scope.$index].processName = ""
            this.dataFormTwo.data[paramsObj.scope.$index].routingId = ''
            this.dataFormTwo.data[paramsObj.scope.$index].processId = ''
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
          // }
        }
        if (this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
          // if (paramsObj.scope.row.routingLineId) {
          flag = await this.$confirm('已有装箱信息，修改工序名称将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.mixedTableData = []
            this.mixAllArr = []
            this.dataFormTwo.data[paramsObj.scope.$index].routingName = ""
            this.dataFormTwo.data[paramsObj.scope.$index].routingLineId = ""
            this.dataFormTwo.data[paramsObj.scope.$index].processName = ""
            this.dataFormTwo.data[paramsObj.scope.$index].routingId = ''
            this.dataFormTwo.data[paramsObj.scope.$index].processId = ''
            this.dataFormTwo.data.forEach(line => {
              item.disabled = false
              line.packingQuantity = 0
              line.packedQuantity = line.totalNum - line.packingQuantity
            })
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
          // }
        }
        if (data) {
          if (this.dataFormTwo.data.some(line => line.productsId === paramsObj.scope.row.productsId && line.routingLineId == data.routingLineId)) {
            await this.$message.error('该产品已存在此工艺路线')
            flag = false
          }
        }
      }
      return flag
    },
    // 有条码信息数量变化
    totalNumRule() {
      return async (rule, value, callback) => {
        console.log('blur');
        let index = Number(rule.field.match(/\d+/)[0])
        // if (this.dataForm.packingType === 'single') {
        if (Number(value)) {
          if (this.dataForm.packingType === 'single' && this.tableData.length || this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
            console.log(12312);
            if (!this.tempArr[index]) {
              this.tempArr[index] = value
              console.log(this.tempArr[index], 'asdjkasjokasjdlk');
              this.dataFormTwo.data[index].packingQuantity = 0
              this.dataFormTwo.data[index].packedQuantity = 0
              this.dataFormTwo.data[index].packedQuantity = Number(value) - Number(this.dataFormTwo.data[index].packingQuantity)
              callback()
            } else if (this.tempArr[index] != value) {
              let flag = await this.$confirm('已有装箱信息，修改数量将清空装箱信息，您是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).catch(() => false)
              if (flag) {
                this.$message({
                  type: 'success',
                  message: '清空成功!'
                });
                this.tableData = []
                this.mixAllArr = []
                this.mixedTableData = []
                this.dataFormTwo.data[index].totalNum = value
                this.tempArr[index] = value
                this.dataFormTwo.data.forEach(line => {
                  line.disabled = false
                  line.packingQuantity = 0
                  line.packedQuantity = line.totalNum - line.packingQuantity
                })
              } else {
                this.$message({
                  type: 'info',
                  message: '已取消'
                });
                // this.dataFormTwo.data[index].totalNum = Number(this.oldsData[index].totalNum)
                this.dataFormTwo.data[index].totalNum = this.tempArr[index]
              }
            }
          }

        }
        callback()
        // } else {
        //   callback()
        // }
      };
    },
    // 有条码信息 装箱数量变化
    packingRule() {
      return async (rule, value, callback) => {
        console.log('blur');
        if (Number(value) && this.tableData.length) {

          let index = Number(rule.field.match(/\d+/)[0])
          if (this.dataForm.packingType === 'single' && this.tableData.length) {
            if (!this.tempArr2[index]) {
              this.tempArr2[index] = value
              console.log(this.tempArr2[index]);
              callback()
            } else if (this.tempArr2[index] != value) {
              let flag = await this.$confirm('已有装箱信息，修改装箱数量将清空装箱信息，您是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).catch(() => false)
              if (flag) {
                this.$message({
                  type: 'success',
                  message: '清空成功!'
                });
                this.tableData = []
                this.dataFormTwo.data[index].packing = value
                this.tempArr2[index] = value
              } else {
                this.$message({
                  type: 'info',
                  message: '已取消'
                });
                // this.dataFormTwo.data[index].totalNum = Number(this.oldsData[index].totalNum)
                this.dataFormTwo.data[index].packing = this.tempArr2[index]
              }
            }
            callback()
          } else {
            callback()
          }

        }
      };
    },

    processListRequestObj(rowIndex) {
      let productsId = this.dataFormTwo.data[rowIndex].productsId
      return { productsId }
    },
    processChange(id, data, paramsObj) {
      console.log(data);
      if (!data || !data.length) {
        this.dataFormTwo.data[paramsObj.scope.$index].routingName = ""
        this.dataFormTwo.data[paramsObj.scope.$index].routingLineId = ""
        this.dataFormTwo.data[paramsObj.scope.$index].processName = ""
        this.dataFormTwo.data[paramsObj.scope.$index].routingId = ''
        this.dataFormTwo.data[paramsObj.scope.$index].processId = ''
      } else {
        this.dataFormTwo.data[paramsObj.scope.$index].routingName = data[0].all.routingName
        this.dataFormTwo.data[paramsObj.scope.$index].routingLineId = data[0].all.routingLineId
        this.dataFormTwo.data[paramsObj.scope.$index].processName = data[0].all.processName
        this.dataFormTwo.data[paramsObj.scope.$index].routingId = data[0].all.routingId
        this.dataFormTwo.data[paramsObj.scope.$index].processId = data[0].all.processId
      }
    },
    // 产品弹窗
    openSeleceProductDialog() {
      this.$refs['ComSelect-pageProduct'].openDialog()
    },
    productData(id, data) {
      console.log(data, '产品');
      if (data.length) {
        let selectArr = []
        let list = data.map(item => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            calculationDirection: item.calculationDirection,
            deputyUnit: item.deputyUnit,
            mainUnit: item.mainUnit,
            packing: item.packing ? item.packing : '',
            productsId: item.id,
            ratio: item.ratio,
            remark: item.remark,
            routingName: '',
            routingId: '',
            processId: '',
            processName: '',
            routingLineId: '',
            // returnDeliveryNoticeLineId: item.id,
            standardBoxName: item.packagingMaterialsText,
            standardBox: item.packagingMaterials,
            oddBoxName: item.packagingMaterialsText,
            oddBox: item.packagingMaterials,
            num: '',
            packingQuantity: 0,         // 已装箱
            packedQuantity: '',         // 待装箱
            totalNum: '',               //  数量
            productsCode: item.code,
            productsName: item.name,
            drawingNo: item.drawingNo,
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = [];
          selectArr = selectArr.filter(item1 => {
            const index = this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId);
            if (index !== -1) {
              deletedArray.push(item1.productsName);
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false;
            }
            return true;
          });
          console.log(data, '删除后的数据');
          console.log(deletedArray, '被删掉的数据');
        }
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr,]
        this.dataFormTwo.data.forEach(item => {
          item.defaultFlag = false
          item.standardBoxFlag = false
          item.oddBoxFlag = false
          if (!item.packing) {
            item.defaultFlag = true
          }
          if (!item.standardBox) {
            item.standardBoxFlag = true
          }
          if (!item.oddBox) {
            item.oddBoxFlag = true
          }
          if (!item.packingQuantity && this.dataForm.packingType === 'mixed') {
            console.log(1);
            item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
          }

        })
        this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
        this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
      }
    },
    // packType(val) {
    //   if (val === 'mixed' && this.dataFormTwo.data.length) {
    //     this.dataFormTwo.data.forEach(item => {
    //       item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
    //       item.oddBox = ''
    //       item.oddBoxName = ''
    //       item.standardBox = ''
    //       item.standardBoxName = ''
    //       item.totalNum = ''
    //       if (item.defaultFlag) {
    //         item.packing = ''
    //       }
    //     })
    //   } else {
    //     this.dataForm.oddBoxName = ''
    //     this.dataForm.oddBox = ''
    //     this.dataForm.standardBox = ''
    //     this.dataForm.standardBoxName = ''
    //     this.dataFormTwo.data = this.oldDataTwo
    //   }
    // },
    checkSelectable(row) {
      return !row.disabled
    },
    // 主表标准箱和零头箱
    changeStandard(id, data, paramsObj) {
      if (paramsObj.types === 'standardBox') {
        this.$nextTick(() => {
          this.$refs['elForm'].validateField("standardBoxName")
          this.$refs['elForm'].validateField("oddBoxName")
        })
        if (data.length === 0) {
          this.dataForm.standardBox = ''
          this.dataForm.standardBoxName = ''
        } else {
          this.dataForm.standardBox = data[0].id
          this.dataForm.standardBoxName = data[0].all.drawingNo
          // 选择标准箱时如果没有零头箱，默认取标准箱作为零头箱
          if (!this.dataForm.oddBox) {
            this.dataForm.oddBox = data[0].id
            this.dataForm.oddBoxName = data[0].all.drawingNo
          }
        }
      } else {
        this.$nextTick(() => {
          this.$refs['elForm'].validateField("oddBoxName")
        })
        if (data.length === 0) {
          this.dataForm.oddBox = ''
          this.dataForm.oddBoxName = ''
        } else {
          this.dataForm.oddBox = data[0].id
          this.dataForm.oddBoxName = data[0].all.drawingNo
        }
      }
    },
    // 箱数 数量除以装箱数量 得出除数和余数 进行是否零头箱判断
    divide(dividend, divisor) {
      let quotient = 0
      let remainder = 0
      if (Number(dividend) >= Number(divisor)) {
        quotient = Math.floor(dividend / divisor)
        remainder = dividend % divisor;
      } else {
        quotient = Math.floor(divisor / dividend)
        remainder = divisor % dividend;
      }
      return { quotient, remainder };
    },
    // 标准箱弹窗
    addth(id, data, paramsObj) {
      if (paramsObj.types === 'standardBox') {
        this.$nextTick(() => {
          let prop = 'data.' + paramsObj.index + '.' + 'standardBoxName'
          this.$refs['productForm'].validateField(prop)
          prop = 'data.' + paramsObj.index + '.' + 'oddBoxName'
          this.$refs['productForm'].validateField(prop)
        })
        if (data.length === 0) {
          this.dataFormTwo.data[paramsObj.index].standardBox = ''
          this.dataFormTwo.data[paramsObj.index].standardBoxName = ''
        } else {
          this.dataFormTwo.data[paramsObj.index].standardBox = data[0].id
          this.dataFormTwo.data[paramsObj.index].standardBoxName = data[0].all.drawingNo
          // 选择标准箱时如果没有零头箱，默认取标准箱作为零头箱
          if (!this.dataFormTwo.data[paramsObj.index].oddBox) {
            this.dataFormTwo.data[paramsObj.index].oddBox = data[0].id
            this.dataFormTwo.data[paramsObj.index].oddBoxName = data[0].all.drawingNo
          }
        }
      } else {
        this.$nextTick(() => {
          let prop = 'data.' + paramsObj.index + '.' + 'oddBoxName'
          this.$refs['productForm'].validateField(prop)
        })
        if (data.length === 0) {
          this.dataFormTwo.data[paramsObj.index].oddBox = ''
          this.dataFormTwo.data[paramsObj.index].oddBoxName = ''
        } else {
          this.dataFormTwo.data[paramsObj.index].oddBox = data[0].id
          this.dataFormTwo.data[paramsObj.index].oddBoxName = data[0].all.drawingNo
        }
      }
    },

    // 点击装箱条码
    async handleClick(e) {
    },

    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 生成条码
    async openBarcode() {
      let focusFlag = true // 自动聚焦是否可用
      let form_1 = this.$refs['elForm']
      let valid_1 = await form_1.validate().catch(err => false)

      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && focusFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            focusFlag = false
            console.log(formItem.$children[1].$el);
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }
      // let scFlag = true
      // if (!scFlag) return
      // scFlag = false
      // setTimeout(() => {
      // 	scFlag = true
      // }, 1000)
      if (focusFlag && valid_1) {
        if (this.dataFormTwo.data.length) {
          this.timeCode = this.timeCode ? this.timeCode : new Date().getTime()
          console.log(this.timeCode);
          if (this.dataForm.packingType === 'single') {
            this.tableData = []
            this.dataFormTwo.data.forEach((item, index) => {
              if (Number(item.totalNum) >= Number(item.packing)) {
                let total = 0
                for (let i = 0; i < item.num; i++) {
                  this.tableData.push({
                    barCode: this.timeCode + '000',
                    productsCode: item.productsCode,
                    productsName: item.productsName,
                    productsId: item.productsId,
                    drawingNo: item.drawingNo,
                    totalNum: item.packing,
                    netWeight: item.netWeight,
                    standardBox: item.standardBox,
                    standardBoxName: item.standardBoxName,
                    processName: item.processName,
                    routingName: item.routingName,
                    routingLineId: item.routingLineId,
                    // 零头箱
                    oddFlag: 0,
                  })
                  total++
                }
                if (item.packing * total !== Number(this.dataFormTwo.data[index].totalNum)) {
                  this.tableData[this.tableData.length - 1].oddFlag = 1
                  this.tableData[this.tableData.length - 1].standardBoxName = this.dataFormTwo.data[this.dataFormTwo.data.length - 1].oddBoxName
                  this.tableData[this.tableData.length - 1].standardBox = this.dataFormTwo.data[this.dataFormTwo.data.length - 1].oddBox
                  this.tableData[this.tableData.length - 1].totalNum = Number(this.dataFormTwo.data[index].totalNum) - item.packing * (total - 1)

                }
              } else {
                this.tableData.push({
                  barCode: this.timeCode + '000',
                  productsCode: item.productsCode,
                  productsName: item.productsName,
                  productsId: item.productsId,
                  drawingNo: item.drawingNo,
                  totalNum: Number(item.totalNum),
                  standardBox: item.oddBox,
                  standardBoxName: item.oddBoxName,
                  processName: item.processName,
                  routingName: item.routingName,
                  routingLineId: item.routingLineId,
                  netWeight: item.netWeight,
                  // 零头箱
                  oddFlag: 1,
                })
              }
            })
            for (let j = 0; j < this.dataForm.num; j++) {
              this.tableData[j].barCode = this.tableData[j].barCode * 1 + j + 1
            }
            this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            console.log(this.tableData);
            if (this.tableData.length) {
              this.$message({ type: 'success', message: '生成条码成功', duration: 1000, })
            }
          } else {
            if (this.productArr.length) {
              console.log(this.dataForm.standardBoxName, '标准箱');
              let barCode = ''
              if (this.mixedTableData.length) {

                barCode = this.mixedTableData[this.mixedTableData.length - 1].barCode ? this.mixedTableData[this.mixedTableData.length - 1].barCode : ''
              }
              this.codeCount++
              this.codeFormVisible = true
              this.$nextTick(() => {
                this.$refs.codeForm.init(this.timeCode, this.codeCount, this.productArr, this.dataFormTwo.data, barCode)
              })
            } else {
              this.$message.error('请先选择要生成条码的数据！')
            }



          }
        } else {
          this.$message.error('请至少选择一个产品！')
        }
      }
    },
    // 混装生成条码后传递的数据
    mixCodeData(data, dataFormTwo) {
      // console.log(data);
      this.mixAllArr = [...this.mixAllArr, ...data]
      this.dataFormTwo.data = dataFormTwo
      this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
      this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
      console.log(this.mixAllArr, 'this.mixAllArr');
      this.mixedTableData = this.mixAllArr
      this.$message.success('生成条码成功')
    },
    // 混装 装箱条码 查看事件
    // 通过 数据中的条码 找到对应的数据
    lookCode(data) {
      this.sourceFormVisible = true
      this.$nextTick(() => {
        this.$refs.sourceForm.init(data.barcodeLines)
      })
    },
    // 删除事件
    delequipment_process_relList(data, index, dataFormTwo) {
      dataFormTwo = this.dataFormTwo
      // this.mixedTableData
      console.log(data);
      console.log(dataFormTwo);

      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: "删除成功",
          duration: 1500,
        })
        dataFormTwo.forEach((item, index) => {
          data.barcodeLines.forEach(item2 => {
            if (item.productsCode === item2.productsCode) {
              dataFormTwo[index].packingQuantity = this.jnpf.math('subtract', [dataFormTwo[index].packingQuantity, item2.totalNum])
              dataFormTwo[index].packedQuantity = this.jnpf.math('add', [item.packedQuantity, item2.totalNum])
            }
          })
        })
        this.tempArr = dataFormTwo.map(item => item.totalNum)
        this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
        this.mixedTableData.splice(index, 1)
        if (this.mixedTableData.length === 0) {
          this.codeCount = 0
        }
      }).catch(() => { })
    },
    deleteProduct(index) {
      this.delteProductId = this.dataFormTwo.data[index].productsCode
      this.delteRotId = this.dataFormTwo.data[index].routingLineId
      if (this.dataForm.packingType === 'single') {
        if (this.tableData.length) {
          this.$confirm("删除该产品，会同步删除对应装箱条码，您是否继续？", {
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: "删除成功",
              duration: 1500,
            })
            this.tableData = this.tableData.filter(item => !(item.productsCode === this.delteProductId && item.routingLineId == this.delteRotId))
            console.log(this.tableData, '数据数据');
            this.dataFormTwo.data.splice(index, 1);
            this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
          }).catch(() => { })
          // this.tableData.forEach((item, ind) => {
          //   if (item.productsId === this.delteProductId && item.routingLineId === this.delteRotId) {
          //     console.log(111,'单装删除');
          //     this.tableData.splice(ind, 1)
          //   }
          // })
        } else {
          this.dataFormTwo.data.splice(index, 1);
          this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
          this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
        }
      }
      if (this.dataForm.packingType === 'mixed') {
        if (this.mixedTableData.length) {
          this.$confirm("删除该产品，会同步删除对应装箱条码，您是否继续？", {
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: "删除成功",
              duration: 1500,
            })
            console.log(111);
            this.mixedTableData = this.mixedTableData.filter(item => !(item.barcodeLines.find(i => i.productsCode === this.delteProductId && i.routingLineId == this.delteRotId)))
            this.dataFormTwo.data.splice(index, 1);
            this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            if (this.mixedTableData.length === 0) {
              this.codeCount = 0
              this.mixAllArr = []
              this.dataForm.num = 0
              this.dataFormTwo.data.forEach(line => {
                line.packingQuantity = 0
                line.packedQuantity = line.totalNum - line.packingQuantity
              })
            } else {
              this.dataFormTwo.data.forEach(line => {
                line.packingQuantity = 0
                this.mixedTableData.forEach(item => {
                  // 混装条码明细信息
                  item.barcodeLines.forEach(item_1 => {
                    if (item_1.productsId === line.productsId && line.packingQuantity !== item_1.totalNum) {
                      line.packingQuantity += Number(item_1.totalNum)
                    }
                  })
                })
                line.packedQuantity = line.totalNum - line.packingQuantity
              })
            }
          }).catch(() => { })
        } else {
          this.dataFormTwo.data.splice(index, 1);
          this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
          this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
        }
      }



    },

    // 混装选择产品事件 选中的产品信息
    handeleProductInfoData(val) {
      this.productArr = val
    },

    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
      this.tempArr = []
      this.tempArr2 = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      console.log(id, type);
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''

      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          detailSalePackingList(this.dataForm.id).then(res => {
            console.log(res);
            this.dataForm.sourceOrderNo = res.data.sourceOrderNo
            this.dataForm.documentId = res.data.documentId
            this.dataForm.documentType = res.data.documentType
            this.dataForm.packingType = res.data.packingType
            this.dataForm.partnerName = res.data.cooperativePartnerName
            this.dataForm.cooperativePartnerId = res.data.cooperativePartnerId
            this.dataForm.submitDate = res.data.submitDate
            this.dataForm.num = res.data.num
            this.dataForm.orderNo = res.data.orderNo
            this.dataForm.standardBox = res.data.standardBox
            this.dataForm.standardBoxName = res.data.standardBoxName
            this.dataForm.oddBoxName = res.data.oddBoxName
            this.dataForm.oddBox = res.data.oddBox
            this.dataForm.remark = res.data.remark
            // 明细列表
            let _data = []
            _data = res.data.packingListLines
            _data.forEach((item, index) => {
              item.defaultFlag = true
              item.standardBoxFlag = true
              item.oddBoxFlag = true
              if (item.totalNum && item.packingQuantity) {
                this.$set(_data[index], 'packedQuantity', this.jnpf.math('subtract', [item.totalNum, item.packingQuantity]))
              }
            })
            this.dataFormTwo.data = _data
            this.tempArr = this.dataFormTwo.data.map(item => item.totalNum)
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            // 装箱单条码信息
            if (this.dataForm.packingType === 'single') {
              this.tableData = res.data.barcodes
              this.oldData.push(res.data.barcodes)
            }
            if (this.dataForm.packingType === 'mixed') {
              this.mixAllArr = res.data.barcodes
              this.mixedTableData = this.mixAllArr
            }
            this.oldsData = JSON.parse(JSON.stringify(this.dataFormTwo.data))
            console.log(this.oldsData, ' this.oldsData');
            console.log(this.mixedTableData, ' this.oldsData');
          }).catch(() => { })
        }
      })
    },
    // 表单提交
    dataFormSubmit(type) {
      this.request(type)
    },

    async request(type) {
      let _data
      this.btnLoading = true
      let isOk = true
      let focusFlag = true
      let barcodeDTOS = []      //装箱单条码列表信息
      let barcodeLines = []
      this.dataForm.documentStatus = type


      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && focusFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            focusFlag = false
            console.log(formItem.$children[1].$el);
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (this.dataFormTwo.data.length === 0) {
            this.btnLoading = false
            this.$message.error('请至少选择一项产品生成条码')
          } else {
            if (focusFlag) {
              if (this.dataForm.packingType === 'single') {
                if (this.tableData.length === 0) {
                  this.$message.error('请先生成装箱条码！')
                  this.btnLoading = false
                  isOk = false
                } else {
                  this.tableData.forEach(item => {
                    barcodeLines.push({
                      totalNum: item.totalNum,
                      id: item.barcodeLines ? item.barcodeLines[0].id : '',
                      packingBarcodeId: item.barcodeLines ? item.barcodeLines[0].packingBarcodeId : '',
                      packingListId: item.barcodeLines ? item.barcodeLines[0].packingListId : '',
                      packingListLineId: item.barcodeLines ? item.barcodeLines[0].packingListLineId : '',
                      productsId: item.productsId
                      // returnDeliveryNoticeLineId: item.barcodeLines ? item.barcodeLines[0].returnDeliveryNoticeLineId : item.returnDeliveryNoticeLineId,
                    })
                    barcodeDTOS.push({
                      barcode: {
                        barCode: item.barCode,
                        oddFlag: item.oddFlag,
                        standardBox: item.standardBox,
                        totalNum: item.totalNum,
                      },
                      barcodeLines
                    })
                    barcodeLines = []
                    isOk = true
                  })
                }
              } else {
                if (this.mixedTableData.length === 0) {
                  this.$message.error('请先生成装箱条码！')
                  this.btnLoading = false
                  isOk = false
                } else {
                  console.log(this.mixedTableData, '混装数据');
                  this.mixedTableData.forEach(item => {
                    item.barcodeLines.forEach(item2 => {
                      barcodeLines.push({
                        totalNum: item2.totalNum,
                        id: item2.id ? item2.id : '',
                        packingBarcodeId: item2.packingBarcodeId ? item2.packingBarcodeId : '',
                        packingListId: item2.packingListId ? item2.packingListId : '',
                        packingListLineId: item2.packingListLineId ? item2.packingListLineId : '',
                        productsId: item2.productsId
                        // returnDeliveryNoticeLineId: item2.returnDeliveryNoticeLineId,
                      })
                    })
                    barcodeDTOS.push({
                      barcode: {
                        barCode: item.barCode,
                        oddFlag: item.oddFlag,
                        standardBox: item.standardBox,
                        totalNum: item.totalNum,
                      },
                      barcodeLines
                    })
                    barcodeLines = []
                    isOk = true
                  })
                  if (this.dataForm.packingType === 'mixed') {
                    this.dataFormTwo.data.forEach(item => {
                      if (Number(item.packingQuantity) === Number(item.totalNum)) {
                        isOk = true
                      } else {
                        isOk = false
                        this.btnLoading = false
                        this.$message.error('收货单未装箱完成，不能提交！')
                      }
                    })
                  }
                }
              }
              _data = {
                barcodeDTOS,
                stockPackingList: this.dataForm,
                stockPackingListLines: this.dataFormTwo.data,
              }

              if (isOk) {
                this.btnLoading = true
                if (this.type === 'add') {
                  addSalePackingList(_data).then(res => {
                    if (res.msg === 'Success') res.msg = this.dataForm.documentStatus === 'draft' ? '保存成功' : '提交成功'
                    this.$message({
                      message: res.msg,
                      type: 'success',
                      duration: 1000,
                      onClose: () => {

                        this.btnLoading = false
                        this.$emit('close', true)
                      }
                    })

                  }).catch(() => {
                    this.btnLoading = false
                  })
                } else {
                  updateSalePackingList(_data).then((res) => {
                    if (res.msg === 'Success') res.msg = this.dataForm.documentStatus === 'draft' ? '保存成功' : '提交成功'
                    this.$message({
                      message: res.msg,
                      type: 'success',
                      duration: 1000,
                      onClose: () => {

                        this.btnLoading = false
                        this.$emit('close', true)

                      }
                    })
                  }).catch(() => {
                    this.btnLoading = false
                  })
                }

              }
            } else {
              this.btnLoading = false
              for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                const item = this.dataFormTwo.data[i]
                // if (!item.standardBoxName) {
                //   this.$message({
                //     type: 'error',
                //     message: '请选择第' + (i + 1) + '行的标准箱',
                //     duration: 1500,
                //   })
                //   break
                // }
                // if (!item.packing) {
                //   this.$message({
                //     type: 'error',
                //     message: '请输入第' + (i + 1) + '行的装箱数量',
                //     duration: 1500,
                //   })
                //   break
                // }
                // if (!item.oddBoxName) {
                //   this.$message({
                //     type: 'error',
                //     message: '请输入第' + (i + 1) + '行的零头箱',
                //     duration: 1500,
                //   })
                //   break
                // }

              }
              return
            }
          }
        } else {
          this.btnLoading = false
        }

      })

    },





  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 10px;
}

.main .boxCode-table {
  height: 100%;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .el-table--small .el-table__cell {
  padding: 9px 0 !important;
}
</style>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />