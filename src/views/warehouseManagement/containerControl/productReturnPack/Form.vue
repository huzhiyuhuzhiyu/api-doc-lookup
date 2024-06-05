<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack"
            :content="type == 'add' ? '新建生产退料装箱单' : type == 'edit' ? '编辑生产退料装箱单' : '查看生产退料装箱单'" />
          <div class="options" v-if="type != 'look'">
            <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">保存草稿</el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>基本信息</h5>
              </div>
              <el-row :gutter="30" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">

                  <el-col :sm="6" :xs="24">
                    <el-form-item label="生产退料单号" prop="sourceOrderNo" ref="sourceOrderNo">
                      <ComSelect-page :beforeSubmit="beforeSubmit" :renderTree="false" :isdisabled="type === 'look'"
                        v-model="dataForm.sourceOrderNo" ref="ComSelect-page" @change="purchaseData"
                        :tableItems="purchaseTableItems" :placeholder="'请选择生产退料单号'" title="选择生产退料单号"
                        :listMethod="WithdrawalList" :listRequestObj="purPurchaseListRequestObj" :paramsObj="{ oldData }"
                        :searchList="purPurchaseTableSearchList" />
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="6" :xs="24">
                    <el-form-item label="供应商名称" prop="partnerName" ref="partnerName">
                      <el-input type="text" v-model="dataForm.partnerName" placeholder="供应商名称" maxlength="20" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col> -->

                  <el-col :sm="6" :xs="24">
                    <el-form-item label="装箱类型" prop="packingType">
                      <el-select v-model="dataForm.packingType" placeholder="请选择装箱类型" clearable style="width: 100%;"
                        :disabled="type !== 'add'">
                        <el-option v-for="(item, index) in packingTypeList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.packingType === 'mixed'">
                    <el-form-item label="标准箱" prop="standardBoxName">
                      <ComSelect-page clearable :beforeSubmit="beforeSubmit1" :value="dataForm.standardBoxName" :renderTree="false"
                        :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page" @change="changeStandard"
                        :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr"
                        :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
                        :searchList="ProductTableSearchList" :elementShow="true"
                        :paramsObj="{ types: 'standardBox', standardBoxName: dataForm.standardBoxName }" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.packingType === 'mixed'">
                    <el-form-item label="零头箱" prop="oddBoxName">
                      <ComSelect-page clearable :beforeSubmit="beforeSubmit2" :value="dataForm.oddBoxName" :renderTree="false"
                        :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page" @change="changeStandard"
                        :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr"
                        :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
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
                      <el-input type="textarea" :rows="3" v-model="dataForm.remark" :placeholder="type == 'look' ? '' : '请输入备注'" maxlength="200"
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
                  icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openBarcode()">生成条码</el-button>
              </div>

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="tableContainer"
                v-loading="showType">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table" @selection-change="handeleProductInfoData" ref="table">
                  <el-table-column type="selection" width="60" fixed="left" align="center"
                    v-if="dataForm.packingType === 'mixed' && type !== 'look'" key="selection"
                    :selectable="checkSelectable" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                  <el-table-column prop="productsCode" label="产品编码" key="productsCode" min-width="200"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="productsCode">
                        <div class="viewData">
                          <span>{{ scope.row.productsCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productsName" label="产品名称" key="productsName" min-width="200"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="productsName">
                        <div class="viewData">
                          <span>{{ scope.row.productsName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drawingNo" label="产品图号" key="drawingNo" min-width="200"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="drawingNo">
                        <div class="viewData">
                          <span>{{ scope.row.drawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="routingName" label="工艺路线名称" min-width="160" key="routingName"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="routingName">
                        <div class="viewData">
                          <span>{{ scope.row.routingName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processName" label="工序名称" min-width="160" key="processName"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="processName">
                        <div class="viewData">
                          <span>{{ scope.row.processName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="totalNum" label="数量" key="totalNum" min-width="140">
                    <template slot-scope="scope">
                      <el-form-item prop="totalNum">
                        <div class="viewData">
                          <span>{{ scope.row.totalNum }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                  <el-table-column prop="mainUnit" label="单位(主)" key="mainUnit" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="mainUnit">
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="waitPackingQuantity" label="待装箱总数量" key="waitPackingQuantity" min-width="140" v-if="type !== 'look'">
                    <template slot-scope="scope">
                      <el-form-item prop="waitPackingQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.waitPackingQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalNum" label="装箱总数量" key="totalNum" min-width="140" v-if="dataForm.packingType === 'single'">
                    <template slot="header">
                      <span class="required">*</span>装箱总数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'totalNum'" :rules='productRules.totalNum'>
                        <el-input v-model="scope.row.totalNum" maxlength="20" :disabled="type === 'look'"
                          placeholder="请输入装箱总数量">
                        </el-input>
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
                    label="剩余装箱数量" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item prop="packedQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.packedQuantity ? scope.row.packedQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <!-- 单装 -->
                  <el-table-column prop="standardBoxName" label="标准箱" min-width="180"
                    v-if="dataForm.packingType === 'single'">
                    <template slot="header">
                      <span class="required">*</span>标准箱
                    </template>
                    <template slot-scope="scope">
                   
                      <el-form-item   :prop="'data.' + scope.$index + '.' + 'standardBoxName'"
                        :rules='productRules.standardBoxName'>
                        <ComSelect-page clearable :beforeSubmit="beforeSubmitStand" :value="scope.row.standardBoxName" :renderTree="false"
                          :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page" @change="addth"
                          :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr"
                          :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
                          :searchList="ProductTableSearchList" :elementShow="true"
                          :paramsObj="{ index: scope.$index, types: 'standardBox', standardBoxName: scope.row.standardBoxName }" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="dataForm.packingType === 'single'" prop="packing" label="标准箱数量" min-width="180">
                    <template slot="header">
                      <span class="required">*</span>标准箱数量
                    </template>
                    <template slot-scope="scope">
                      <!-- <el-form-item :prop="'data.' + scope.$index + '.' + 'packing'" :rules='productRules.packing'
                        v-if="!scope.row.defaultFlag">
                        <div class="viewData">
                          <span>{{ scope.row.packing }}</span>
                        </div>
                      </el-form-item> -->
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'packing'" :rules='productRules.packing'>
                        <el-input clearable v-model="scope.row.packing" maxlength="20" :disabled="type === 'look'"
                          placeholder="请输入标准箱数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="oddBoxName" label="零头箱" v-if="dataForm.packingType === 'single'" min-width="180">
                    <template slot="header">
                      <span class="required">*</span>零头箱
                    </template>
                    <template slot-scope="scope">
                      <el-form-item  :prop="'data.' + scope.$index + '.' + 'oddBoxName'"
                        :rules='productRules.oddBoxName'>
                        <ComSelect-page clearable :beforeSubmit="beforeSubmitStand2" :value="scope.row.oddBoxName" :renderTree="false"
                          :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page" @change="addth"
                          :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr"
                          :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
                          :searchList="ProductTableSearchList" :elementShow="true"
                          :paramsObj="{ index: scope.$index, types: 'oddBox', oddBoxName: scope.row.oddBoxName }" />

                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="num" label="箱数" v-if="dataForm.packingType === 'single'" min-width="140">
                    <template slot-scope="scope">
                      <el-form-item prop="num">
                        <div class="viewData">
                          <span>{{ scope.row.num }}</span>
                        </div>
                      </el-form-item>

                    </template>
                  </el-table-column>


                  <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="200"
                        :disabled="type === 'look'" :placeholder="type == 'look' ? '' : '请输入备注'">{{
                          scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>

                </el-table>
              </el-form>



            </el-tab-pane>

            <el-tab-pane label="装箱条码" name="boxCode">
              <CodeTable @lookCode="lookCode" @delth="delequipment_process_relList" :tableData="tableData"
                :mixedTableData="mixedTableData" :listLoading="listLoading" :morePrintData="{
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
      </div>
    </transition>
  </div>
</template>
<script>
import { addSalePackingList, updateSalePackingList, detailSalePackingList } from '@/api/warehouseManagement/packingList'
import barCodePrint from '@/views/warehouseManagement/containerControl/barcodeManagement/barCodePrint.js'
import { WithdrawalList } from '@/api/productOrdes/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { detailWithdrawal } from '@/api/productOrdes/index' // 生产退料
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
      sourceFormVisible: false,
      getProductList, // 产品选择弹出框树状列表请求api
      getcategoryTree,
      // material
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
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

      codeFormVisible: false,
      listLoading: false,
      tableData: [],
      mixedTableData: [],
      WithdrawalList,

      // 采购收货弹窗渲染列表
      purchaseTableItems: [
        { prop: 'orderNo', label: '生产退料单号', fixed: 'left' },
        { prop: 'productionOrderNo', label: '生产订单号', fixed: 'left' },
        { prop: 'personName', label: '退料人' },
        { prop: 'operationDate', label: '退料日期', },
      ],
      // 采购收货通知单请求
      purPurchaseListRequestObj: {
        inspectionStatus: 'inspected', // 检验状态,可用值:inspected,unInspect
        notifyType: 'back',
        demandType: '',
        productionOrderNo: "",
        // packingStatus: 'unboxed',                     // 装箱状态 未完成
        waitPackingFlag: true,
        startTime: "",
        endTime: "",
        documentStatus: "submit",
        approvalStatus: "ok",
        pickingStatus: "",
        personName: "",
        orderNo: "",
        operationSd: "",
        operationEd: "",
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
        { prop: "orderNo", label: "生产退料单号", type: 'input' },
        { prop: "productionOrderNo", label: "生产订单号", type: 'input' },
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
        documentType: 'return_production',
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
        sourceOrderNo: [{ required: true, message: '请选择生产退料单号', trigger: ['change'] }],
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
        packing: [
          { validator: this.packingRule(), trigger: 'blur' },
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error(`装箱数量：${errMsg}`) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('装箱数量：不能为0') }), trigger: 'blur' }
        ],
        totalNum: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate('positiveNumber', '', (errMsg) => { this.$message.error('装箱总数量：必须大于0') }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => this.dataFormTwo.data[rowIndex].totalNum <= this.dataFormTwo.data[rowIndex].waitPackingQuantity, "不能超过对应待装箱总数量", (errMsg) => { this.$message.error('装箱总数量：' + errMsg) }] }), trigger: 'blur' }
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
      oldsData: [],
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
  },
  watch: {
    'dataFormTwo.data': {
      handler: function (newVal, oldVal) {
        console.log(newVal);
        console.log(oldVal, '老数据');
        this.oldDataTwo = oldVal
        this.oddNum = 0
        newVal.forEach(item => {
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
          } else if (Number(item.totalNum) && Number(item.packing) && Number(item.totalNum) < Number(item.packing)) {
            item.num = 1
          } else {
            item.num = 0
          }
          if (Number(item.packingQuantity) >= Number(item.totalNum)) {
            item.disabled = true
            console.log(11);
          } else {
            item.disabled = false
          }
          // if (this.oldsData.length) {
          //   this.oldsData.forEach(item2 => {
          //     if (Number(item.packing) !== Number(item2.packing)) {
          //       this.tableData = []
          //     }
          //   })
          // }

        })
        if (!this.tableData.length) {
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
        this.$refs.dataTable.clearSelection()
        this.selectedData = []
      }
      barCodePrint(row, callBack, type)
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
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
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
            this.showType = false
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
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            this.dataForm.oddBoxName = ''
            this.dataForm.oddBox = ''
            this.dataForm.standardBox = ''
            this.dataForm.standardBoxName = ''
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            this.showType = false
            this.dataForm.packingType = oldType
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
            this.showType = false
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
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            this.showType = false
            this.dataForm.packingType = oldType
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

    // packType(val) {
    //   if (val === 'mixed' && this.dataFormTwo.data.length) {
    //     this.dataFormTwo.data.forEach(item => {
    //       item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
    //       item.oddBox = ''
    //       item.oddBoxName = ''
    //       item.standardBox = ''
    //       item.standardBoxName = ''
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
      if (e.name === 'boxCode' && this.type === 'add') {
        if (this.dataForm.packingType === 'single') {
        } else {
          this.tableData = []
          // 混装 生成条码数据
          if (this.mixedTableData.length) {

          }
        }
      } if (e.name === 'boxCode' && this.type !== 'add') {
        console.log(this.tableData);
        // if (this.mixedTableData.length) {
        //   console.log(this.mixedTableData);
        //   this.mixedTableData.forEach(item => {
        //     if (!item.oddFlag) {
        //       item.standardBox = this.dataForm.standardBox
        //       item.standardBoxName = this.dataForm.standardBoxName
        //     } else {
        //       item.standardBox = this.dataForm.oddBox
        //       item.standardBoxName = this.dataForm.oddBoxName
        //     }
        //   })
        // }
        // if (this.tableData.length) {
        //   this.dataFormTwo.data.forEach(item => {
        //     this.tableData.forEach(item2 => {
        //       if ((item.productsId === item2.productsId) && (item.routingLineId === item2.routingLineId) ) {
        //         if (!item2.oddFlag) {
        //           item2.standardBox = item.standardBox
        //           item2.standardBoxName = item.standardBoxName
        //         } else {
        //           item2.standardBox = item.oddBox
        //           item2.standardBoxName = item.oddBoxName
        //         }
        //       }
        //     })
        //   })
        // }
      }
    },
    // 切换采购单后给的提示
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (paramsObj.oldData.length) {
        flag = await this.$confirm('已选择过生产退料单号，是否切换，切换后会清空产品信息是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '更换成功!'
          });
          this.tableData = []
          this.mixedTableData = []
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
    // 选择采购单
    purchaseData(id, data) {
      console.log(data, '收货弹窗数据');
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('sourceOrderNo')
      })
      if (data.length === 0) {
        this.dataForm.sourceOrderNo = ''
        this.dataForm.documentId = ''
        this.dataForm.partnerName = ''
        this.dataForm.cooperativePartnerId = ''
        this.dataForm.cooperativePartnerCode = ''
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.sourceOrderNo = data[0].all.orderNo
        this.dataForm.documentId = data[0].id
        this.dataForm.partnerName = data[0].all.partnerName
        this.dataForm.cooperativePartnerId = data[0].all.partnerId
        this.dataForm.cooperativePartnerCode = data[0].all.cooperativePartnerCode
        detailWithdrawal(this.dataForm.documentId).then(res => {
          console.log(res, '明细');
          let _data = []
          res.data.collectLineList.forEach(item => {
            _data.push({
              waitPackingQuantity: item.inspectionResults === 'partially_discard' ? this.jnpf.math('subtract'[item.qualifiedQuantity,item.packingQuantity]) : this.jnpf.math('subtract',[item.num,item.packedQuantity]),
              totalNum: item.inspectionResults === 'partially_discard' ? this.jnpf.math('subtract'[item.qualifiedQuantity,item.packingQuantity]) : this.jnpf.math('subtract',[item.num,item.packedQuantity]),
              calculationDirection: item.calculationDirection,
              deputyUnit: item.deputyUnit,
              mainUnit: item.mainUnit,
              packing: item.productPacking,
              productsId: item.productsId,
              ratio: item.ratio,
              remark: item.remark,
              returnDeliveryNoticeLineId: item.id,
              standardBoxName: item.packagingMaterialsName,
              standardBox: item.packagingMaterials,
              oddBoxName: item.packagingMaterialsName,
              oddBox: item.packagingMaterials,
              num: '',
              routingName: item.routingName,
              routingId: item.routingId,
              routingLineId: item.routingLineId,
              processName: item.processName,
              processId: item.processId,
              packingQuantity: 0,         // 已装箱
              packedQuantity: '',         // 待装箱
              // totalNum: item.inspectionResults === 'partially_discard' ? item.qualifiedQuantity : item.num, // 装箱总数 = 检验结果部分报废 ? 检验合格数量 : 领退料数量
              productsCode: item.productCode,
              productsName: item.productName,
              drawingNo: item.productDrawingNo,
            })
          })
          _data.forEach(item => {
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
          this.dataFormTwo.data = _data.filter(line => line.totalNum && line.totalNum != '0')
          this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
          console.log(this.dataFormTwo.data, '收货单据数据');
        })
      }
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
                    drawingNo: item.drawingNo,
                    totalNum: item.packing,
                    netWeight: item.netWeight,
                    standardBox: item.standardBox,
                    standardBoxName: item.standardBoxName,
                    routingName: item.routingName,
                    routingId: item.routingId,
                    processName: item.processName,
                    processId: item.processId,
                    // 零头箱
                    oddFlag: 0,
                    returnDeliveryNoticeLineId: item.returnDeliveryNoticeLineId,
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
                  drawingNo: item.drawingNo,
                  totalNum: Number(item.totalNum),
                  netWeight: item.netWeight,
                  standardBox: item.oddBox,
                  standardBoxName: item.oddBoxName,
                  // 零头箱
                  oddFlag: 1,
                  returnDeliveryNoticeLineId: item.returnDeliveryNoticeLineId,
                })
              }
            })
            for (let j = 0; j < this.dataForm.num; j++) {
              this.tableData[j].barCode = this.tableData[j].barCode * 1 + j + 1
            }
            console.log(this.tableData);
            this.$message.success('生成条码成功')
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
          this.$message.error('请先选择产品！')
        }
      }
    },
    // 混装生成条码后传递的数据
    mixCodeData(data, dataFormTwo) {
      // console.log(data);
      this.mixAllArr = [...this.mixAllArr, ...data]
      this.dataFormTwo.data = dataFormTwo
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
            if (item.returnDeliveryNoticeLineId === item2.returnDeliveryNoticeLineId) {
              dataFormTwo[index].packingQuantity = this.jnpf.math('subtract', [dataFormTwo[index].packingQuantity, item2.totalNum])
              dataFormTwo[index].packedQuantity = this.jnpf.math('add', [item.packedQuantity, item2.totalNum])
            }
          })
        })
        this.tempArr2 = dataFormTwo.map(item => item.packing)
        this.mixedTableData.splice(index, 1)
      }).catch(() => { })
    },
    // 混装选择产品事件 选中的产品信息
    handeleProductInfoData(val) {
      this.productArr = val
    },

    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
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
            this.dataForm.cooperativePartnerCode = res.data.cooperativePartnerCode
            this.dataForm.submitDate = res.data.submitDate
            this.dataForm.num = res.data.num
            this.dataForm.orderNo = res.data.orderNo
            this.dataForm.standardBox = res.data.standardBox
            this.dataForm.standardBoxName = res.data.standardBoxName
            this.dataForm.oddBoxName = res.data.oddBoxName
            this.dataForm.oddBox = res.data.oddBox
            this.dataForm.remark = res.data.remark
            // 明细列表
            this.dataFormTwo.data = res.data.packingListLines
            console.log(this.dataFormTwo.data, '数据');
            this.dataFormTwo.data.forEach((item, index) => {
              item.defaultFlag = true
              item.standardBoxFlag = true
              item.oddBoxFlag = true
              if (item.totalNum && item.packingQuantity) {
                this.$set(this.dataFormTwo.data[index], 'packedQuantity', Number(item.totalNum) - Number(item.packingQuantity))
              }
            })
            // 装箱单条码信息
            if (this.dataForm.packingType === 'single') {
              this.tableData = res.data.barcodes
              this.oldData.push(res.data.barcodes)
            }
            if (this.dataForm.packingType === 'mixed') {
              this.mixAllArr = res.data.barcodes
              this.mixedTableData = this.mixAllArr
              console.log(this.mixAllArr);
            }
            console.log(this.dataFormTwo.data, '数据');
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            this.oldsData = JSON.parse(JSON.stringify(this.dataFormTwo.data))
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
      let barcodeDTOS = []      //装箱单条码列表信息
      let barcodeLines = []
      this.dataForm.documentStatus = type
      let linesList = JSON.parse(JSON.stringify(this.dataFormTwo.data || []))


      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)

      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (this.dataFormTwo.data.length === 0) {
            this.btnLoading = false
            this.$message.error('请至少选择一项产品生成条码')
          } else {
            if (valid_2) {
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
                      returnDeliveryNoticeLineId: item.barcodeLines ? item.barcodeLines[0].returnDeliveryNoticeLineId : item.returnDeliveryNoticeLineId,
                      returnDeliveryNoticeLineIdList: [item.barcodeLines ? item.barcodeLines[0].returnDeliveryNoticeLineId : item.returnDeliveryNoticeLineId],
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
                  this.mixedTableData.forEach(item => {
                    item.barcodeLines.forEach(item2 => {
                      barcodeLines.push({
                        totalNum: item2.totalNum,
                        id: item2.id ? item2.id : '',
                        packingBarcodeId: item2.packingBarcodeId ? item2.packingBarcodeId : '',
                        packingListId: item2.packingListId ? item2.packingListId : '',
                        packingListLineId: item2.packingListLineId ? item2.packingListLineId : '',
                        returnDeliveryNoticeLineId: item2.returnDeliveryNoticeLineId,
                        returnDeliveryNoticeLineIdList: [item2.returnDeliveryNoticeLineId],
                        productsId: item2.productsId,
                        processId: item2.processId,
                        routingLineId: item2.routingLineId
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
                  })
                  if (this.dataForm.documentStatus !== 'draft') { // 保存并提交时合并条码箱内的同产品
                    barcodeDTOS.forEach(box => {
                      box.barcodeLines = box.barcodeLines.reduce((result, obj) => {
                        let existingObj = result.find(product =>
                          product.productsId === obj.productsId &&
                          product.processId == obj.processId &&
                          product.routingLineId == obj.routingLineId
                        );
                        if (existingObj) {
                          existingObj.totalNum = this.jnpf.math('add', [existingObj.totalNum, obj.totalNum]);
                          existingObj.returnDeliveryNoticeLineIdList.push(obj.returnDeliveryNoticeLineId)
                          existingObj.returnDeliveryNoticeLineId = ''
                        } else {
                          result.push({
                            ...obj,
                            returnDeliveryNoticeLineId: ''
                          });
                        }
                        return result;
                      }, []);
                    })
                    linesList = linesList.map(line => {
                      return {
                        ...line,
                        returnDeliveryNoticeLineIdList: [line.returnDeliveryNoticeLineId]
                      }
                    })
                  }
                }
              }
              _data = {
                barcodeDTOS,
                stockPackingList: this.dataForm,
                stockPackingListLines: linesList,
              }
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
                if (!item.standardBoxName) {
                  this.$message({
                    type: 'error',
                    message: '请选择第' + (i + 1) + '行的标准箱',
                    duration: 1500,
                  })
                  break
                }
                if (!item.packing) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的装箱数量',
                    duration: 1500,
                  })
                  break
                }
                if (!item.oddBoxName) {
                  this.$message({
                    type: 'error',
                    message: '请选择第' + (i + 1) + '行的零头箱',
                    duration: 1500,
                  })
                  break
                }

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
}</style>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />