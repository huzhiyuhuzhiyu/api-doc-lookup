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
                        <el-form-item label="订单编号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入订单编号"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true ? false : true"
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
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="客户" prop="cooperativePartnerId"
                          v-if="dataForm.businessType == 'outbound_sale_send' || dataForm.businessType == 'inbound_sale_return'">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择所属客户" readonly @focus="openDialog"
                            :disabled="btnType == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="供应商" prop="cooperativePartnerId"
                          v-if="dataForm.businessType == 'inbound_purchase' || dataForm.businessType == 'outbound_purchase' || dataForm.businessType == 'outbound_external' || dataForm.businessType == 'inbound_external'">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择供应商" readonly @focus="openDialog"
                            :disabled="btnType == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="仓库" prop="warehouseName">
                          <ComSelect-list :requestObj="{ type: 'normal' }" :dialogTitle="'选择仓库'"
                            v-model="dataForm.warehouseName" :method="getWarehouseList" placeholder="请选择仓库"
                            @change="changeWarehousex"></ComSelect-list>





                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="jyFlag">
                        <el-form-item label="检验标志" prop="inspectionResults">
                          <el-select v-model="dataForm.inspectionResults" placeholder="检验结果" clearable
                            style="width: 100%;" :disabled="salesFlag" filterable>
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
                    border height="460" :key="165" style="width: 100%;">
                    <el-table-column type="selection" width="55" fixed="left" :key="2">
                    </el-table-column>
                    <el-table-column type="index" width="60" label="序号" :key="10"></el-table-column>
                    <el-table-column prop="customerProductNo" label="客户料号" width="160" :key="1212">
                    </el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6">
                    </el-table-column>
                    <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                    <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />
                    <el-table-column prop="num" label="数量" width="100" :key="7">
                      <template slot="header">
                        <span class="required">*</span>数量
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.num" :disabled="btnType == 'look' ? true : false"
                          @input="watchNum(scope.row, scope.$index)" placeholder="请输入"
                          @blur="checkNum(scope.row, scope.$index)">{{
                            scope.row.num }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="单价(含税)" width="120" :key="110"></el-table-column>
                    <el-table-column prop="taxRate" label="税率(%)" width="120" :key="171"></el-table-column>
                    <el-table-column prop="taxAmount" label="税额" width="120" :key="1721"></el-table-column>
                    <el-table-column prop="totalAmount" label="总金额(含税)" width="120" :key="125"></el-table-column>
                    <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="211"></el-table-column>
                    <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123"></el-table-column>
                    <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17"></el-table-column>
                    <el-table-column prop="oil" label="油脂" width="120" :key="61"></el-table-column>
                    <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51"> </el-table-column>
                    <el-table-column prop="clearance" label="游隙" width="120" :key="100"></el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101"></el-table-column>
                    <el-table-column prop="shelfSpaceName" label="货位" width="120" :key="1011" v-if="allocationFlag">
                      <template slot="header">
                        <span class="required">*</span>货位
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.shelfSpaceName" readonly
                          @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="货位">{{
                            scope.row.shelfSpaceName }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" width="200" :key="128"></el-table-column>
                  </el-table>
                </el-collapse-item>

              </el-collapse>

            </div>
          </div>
        </div>
      </div>
      <!-- 销售发货 产品信息 -->
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
        :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
        append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.customerProductDrawingNo" placeholder="请输入客户料号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.drawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="交货日期">
                    <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
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
                <el-table-column prop="customerProductNo" label="客户料号" width="160" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
                <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" width="160" sortable="custom" />
                <el-table-column prop="num" label="数量" width="160" sortable="custom" />
                <el-table-column prop="waitDeliverNum" label="待出库数量" width="160" sortable="custom" />
                <el-table-column prop="deliveryDate" label="交货日期" width="160" sortable="custom" />
                <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom" />
                <el-table-column prop="accuracyLevel" label="精度等级" width="160" sortable="custom" />
                <el-table-column prop="vibrationLevel" label="振动等级" width="160" sortable="custom" />
                <el-table-column prop="oil" label="油脂" width="160" sortable="custom" />
                <el-table-column prop="oilQuantity" label="油脂量" width="160" sortable="custom" />
                <el-table-column prop="clearance" label="游隙" width="160" sortable="custom" />
                <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom" />
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
      <CustomerForm v-if="CustomerForm" ref="CustomerForms" @selectCustomer="handleSelectCustomer"></CustomerForm>
      <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="WareTableItems" title="选择货位" treeTitle="仓库"
        :methodArr="WareMethodArr" :listMethod="getLocationList" :listRequestObj="WareListRequestObj"
        :searchList="WareTableSearchList" :elementShow="false" :dataFormatting="ComSelectTreeFormattind"
        :renderTree="false" />
    </div>
  </transition>
</template>

<script>
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getStockGoodsShelves, getStockGoodsShelvesList, getProductionLotList } from '@/api/basicData/index'
import { getcategoryTree, getCooperativeData, deleteCooperative, excelExport } from '@/api/basicData/index'
import { getcategoryTrees, getcooperativeProduct, getsaleOrderDetailList } from '@/api/salesManagement/assemblyOrders'
import { detailByBarCodes } from '@/api/warehouseManagement/packingList'
// import { addInboundOutbound} from '@/api/warehouseManagement/inboundAndOutbounds.js'
import TableFormProduct from "./TableForm-product.vue"
import { getLocationList } from '@/api/warehouseManagement/inventory' // 库位分类和列表
import CustomerForm from './customerForm.vue'
import { getBimBusinessSwitchConfigList, editBimBusinessData } from '@/api/basicData/index'
export default {
  components: { TableFormProduct, CustomerForm },

  data() {
    return {
      // 选择货位相关字段
      getLocationList, // 货位选择弹出框树状列表请求api
      getStockGoodsShelves,
      WareMethodArr: { method: getWarehouseList, requestObj: { chooseUserFlag: true } }, // 货位选择弹出框树状列表
      // 货位选择弹出框列表请求参数
      WareListRequestObj: {
        code: "",
        catrgory: "location",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": true,
          "column": ""
        }],
        pageNum: 1,
        pageSize: 20,
        warehouseId: "",
      },
      // 货位选择弹出框表单展示字段
      WareTableItems: [
        { prop: 'name', label: '货位名称', fixed: 'left' },
        { prop: 'code', label: '货位编码', fixed: 'left' },
        { prop: 'warehouseName', label: '仓库名称' },

        { prop: 'remark', label: '备注' }
      ],
      // 货位选择弹出框搜索条件
      WareTableSearchList: [
        { prop: "code", label: "货位编码", type: 'input' },

      ],





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
        customerProductDrawingNo: "",
        orderState: "not_finish",
        shipmentStatus: 'not_finish',
        drawingNo: "",        // customerProductNo: "",
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
    // 打开选择货位弹框
    openSeleceWareDialog(row, index) {
      this.currentProductIndex = index
      this.$refs['ComSelect-page'].openDialog()
    },
    ComSelectTreeFormattind(res) {
      return res.data
    },
    addth(val1, val2, val3) {
      this.shelfSpaceForm = val2
      let index=this.currentProductIndex
      this.$emit(this.productData[index],'shelfSpaceName',val2[0].name)
      this.$emit(this.productData[index],'areaId',val2[0].all.areaId)
      this.$emit(this.productData[index],'goodsShelvesId',val2[0].all.goodsShelvesId)
      this.$emit(this.productData[index],'warehouseId',val2[0].all.warehouseId)
      this.$emit(this.productData[index],'shelfSpaceId',val2[0].all.id)
 
      
      console.log("object,",this.productData);
    },

    // 点击选择产品 销售发货
    openSeleceProductDialog() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error("请先选择客户")
      this.productVisible = true
      this.searchProductFun()
    },
    // 销售发货选择产品——搜索
    searchProductFun() {
      if (this.deliveryDateArr.length) {
        this.orderForm.deliveryStartTime = this.deliveryDateArr[0]
        this.orderForm.deliveryEndTime = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartTime = ""
        this.orderForm.deliveryEndTime = ""
      }
      this.orderForm.cooperativePartnerId = this.dataForm.cooperativePartnerId
      getsaleOrderDetailList(this.orderForm).then(res => {
        console.log("产品", res);
        this.productList = res.data.records
        this.productTotal = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      this.selectSaleProductArr = val
    },
    // 销售发货选择产品——重置
    resetProductFun() {
      this.deliveryDateArr = []
      this.orderForm = {
        cooperativePartnerId: this.dataForm.cooperativePartnerId,
        customerProductDrawingNo: "",
        orderState: "not_finish",
        shipmentStatus: 'not_finish',
        drawingNo: "",        // customerProductNo: "",
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
      this.searchProductFun()

    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      this.selectSaleProductArr.forEach(item => {
        item.costPrice = item.price
        item.ordersNum = item.num
        item.taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [item.price, item.excludingTaxPrice]), 6)]), 6)

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


    },
    // 打开选择客户弹框
    openDialog() {
      this.CustomerForm = true
      this.$nextTick(() => {
        this.$refs.CustomerForms.init()
      })
    },
    // 所选择的客户数据
    handleSelectCustomer(data) {
      console.log("data", data);
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





    // refeshDataFormItems() {
    //   let partnerName = this.dataForm.businessType === "purchase_delivery_return" || this.dataForm.businessType === "outside_delivery_return" ? '供应商' : '客户'
    //   console.log("this.dataForm.businessType", this.dataForm.businessType);
    //   this.dataForm.businessType = this.dataForm.businessType ? this.dataForm.businessType : ''
    //   let sm = this.dataForm.businessType !== "io_other" ? 8 : 12
    //   this.dataFormItems = [
    //     { prop: "businessType", label: "业务类型", value: "", type: "select", change: this.selectSourceType, options: this.originTypeList, itemRules: [{ required: true, trigger: "change" }], sm },



    //     {
    //       prop: "warehouseName", label: "出入库仓库", value: "", type: "custom", customComponent: "ComSelect-list", method: getWarehouseList,
    //       change: this.wareChange, requestObj: { chooseUserFlag: true, type: 'normal', "category": "warehouse" },
    //       itemRules: [
    //         { validator: this.formValidate({ type: 'noEmtry', params: ["出入库仓库不能为空", (errMsg) => { this.$message.error(`出入库仓库${errMsg}`) }] }), trigger: 'no' },
    //         { required: true, trigger: "no" }
    //       ], dialogTitle: "选择仓库", sm
    //     },



    //     {
    //       prop: "partnerName", label: partnerName, value: "", type: "custom", customComponent: "ComSelect-list",
    //       requestObj: this.selectcustomerObj, method: getCooperativeData, change: this.selectCustomerFun,
    //       itemRules: [
    //         { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg) => { this.$message.error(`${partnerName}${errMsg}`) }] }), trigger: 'no' },
    //         { required: true, trigger: "no" }
    //       ], dialogTitle: "选择" + partnerName,
    //       render: ['send_return', 'purchase_delivery_return', 'outside_delivery_return',].includes(this.dataForm.businessType), sm
    //     },
    //     { prop: "remark", label: "备注", value: "", type: "textarea" }
    //   ]
    // },
    // refeshLinesListItems() {
    //   this.linesListItems = [
    //     { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 140 },
    //     // { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 140 },
    //     { prop: "drawingNo", label: "规格型号", value: "", type: 'view', minWidth: 300 },
    //     { prop: "processName", label: "工序名称", value: "", type: 'view', minWidth: 140 },
    //     { prop: "mainUnit", label: "单位(主)", value: "", type: "view", minWidth: 100 },
    //     {
    //       prop: "num", label: "数量(主)", value: "", type: "input",
    //       itemRules: [
    //         { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`) }] }), trigger: 'blur' },
    //         { required: true, trigger: 'blur' },
    //         { validator: this.formValidate({ type: 'decimal2', params: [20, 4, "", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
    //         // { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(主)：${errMsg}`) }), trigger: 'blur' }
    //       ], minWidth: 180, input:
    //         (val, scope) => {
    //           if (scope.row.calculationDirection === 'multiplication') { scope.row.deputyNum = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
    //           else { scope.row.deputyNum = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
    //           if (scope.row.costPrice) {
    //             scope.row.totalAmount = this.jnpf.numberFormat(val * scope.row.costPrice, 4)
    //           }
    //         }
    //     },
    //     { prop: "deputyUnit", label: "单位(副)", value: "", type: "view", minWidth: 100 },
    //     {
    //       prop: "deputyNum", label: "数量(副)", value: "", type: "input",
    //       itemRules: [
    //         { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`) }] }), trigger: 'blur' },
    //         { required: true, trigger: 'blur' },
    //         { validator: this.formValidate({ type: 'decimal2', params: [20, 4, "", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }] }), trigger: 'blur' },
    //         // { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(副)：${errMsg}`) }), trigger: 'blur' }
    //       ], minWidth: 180, input:
    //         (val, scope) => {
    //           if (scope.row.calculationDirection === 'division') { scope.row.num = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
    //           else { scope.row.num = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
    //         }
    //     },
    //     {
    //       prop: "costPrice", label: "单价(含税)", value: "", type: "input", minWidth: 140,
    //       itemRules: [
    //         { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：单价(含税)${errMsg}`) }] }), trigger: 'blur' },
    //         { required: true, trigger: 'blur' },
    //         { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('单价(含税)：' + errMsg) }] }), trigger: 'blur' },
    //         // { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(副)：${errMsg}`) }), trigger: 'blur' }
    //       ],
    //       input: (val, scope) => {
    //         if (scope.row.num) {
    //           scope.row.totalAmount = this.jnpf.numberFormat(val * scope.row.num, 4)
    //         }
    //         if (scope.row.taxRate) {
    //           scope.row.excludingTaxCostPrice = this.jnpf.numberFormat(val / (1 + (scope.row.taxRate * 1 / 100)), 4)
    //         }
    //       }
    //     },
    //     {
    //       prop: "taxRate", label: "税率(%)", value: "", type: "input", minWidth: 100,
    //       input: (val, scope) => {

    //         if (scope.row.taxRate) {
    //           scope.row.excludingTaxCostPrice = this.jnpf.numberFormat(scope.row.costPrice / (1 + (val * 1 / 100)), 4)
    //         }
    //       }
    //     },
    //     { prop: "excludingTaxCostPrice", label: "单价(不含税)", value: "", type: "view", minWidth: 140 },
    //     { prop: "totalAmount", label: "总金额", value: "", type: "view", minWidth: 140 },

    //     { prop: "originalBatchNumber", label: "产品原批号", value: "", type: "input", maxlength: 50, minWidth: 220 },
    //     { prop: "batchNumber", label: "批次号", value: "", type: "select", options: this.productionLotList, filterable: true, remote: true, remoteMethod: this.remoteMethod, maxlength: 50, minWidth: 220, blur: this.elementBlur },
    //     { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200, minWidth: 160 },
    //   ]
    //   this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
    // },
    // processSelectRequestObj(rowIndex) {
    //   let productsId = this.linesList[rowIndex].productsId
    //   return { productsId }
    // },
    // selectSourceType(val) {
    //   console.log("val", val);
    //   this.dataForm.businessType = val
    //   this.businessType = val
    //   if (val == "send_return") {
    //     this.selectcustomerObj.type = 'customer'
    //   } else if (val == "purchase_delivery_return" || val == "outside_delivery_return") {
    //     this.selectcustomerObj.type = 'supplier'

    //   } else {
    //     this.customerInfo = {}
    //   }
    //   this.refeshDataFormItems()
    // },
    init(id, btnType) {
      // this.visible = true
      this.formLoading = true
      this.oldId = JSON.parse(JSON.stringify(id)) || ""
      this.oldType = JSON.parse(JSON.stringify(btnType))
      this.btnType = btnType
      console.log("btnty", btnType);
      // this.refeshDataFormItems()
      if (id) {
        this.title = btnType ? '查看出入库单' : '编辑出入库单'
        // 获取详情
        detailWarehouseData(id).then(res => {
          this.dataForm = res.data.stockMove
          if (res.data.stockMove.businessType == "send_return") {
            this.selectcustomerObj.type = 'customer'
          } else if (res.data.stockMove.businessType == "purchase_delivery_return" || res.data.stockMove.businessType == "outside_delivery_return") {
            this.selectcustomerObj.type = 'supplier'

          } else {
            this.customerInfo = {}
          }
          this.linesList = res.data.lines
          this.spaceLines = res.data.spaceLines
          this.spaceLines.forEach(item => {
            item.boxList = item.boxVoList
            delete item.boxVoList
            item.barCodeIds = item.boxList.map(box => box.id)
            item.barCodeList = item.boxList.map(box => box.barCode)
            item.boxList.forEach(box => {
              box.name = box.barCode
            })
          });
          this.refeshDataFormItems()
          this.formLoading = false
        }).catch(() => { this.formLoading = false })
      } else {
        this.title = '新建出入库单'
        this.formLoading = false
        this.fetchData("CRDH")

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
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用

      // // 校验表单
      // let form_1 = this.$refs['dataForm'].$refs.main
      // let valid_1 = await form_1.validate().catch(() => false)
      // if (!valid_1 && submitFlag) {
      //   // 校验失败，聚焦第一失败项，继续校验后续项
      //   if (submitFlag) {
      //     // 聚焦第一个失败的表单元素
      //     let formItems = form_1.$children[0].$children
      //     for (let j = 0; j < formItems.length; j++) {
      //       let formItem = formItems[j].$children[0].$children[0]
      //       if (formItem.validateState === 'error') {
      //         submitFlag = false
      //         this.jnpf.focusItem(formItem.$children[1].$el)
      //         this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
      //         break
      //       }
      //     }
      //   }
      // }

      // 校验表单表格（子数据列表）
      // let form_2 = this.$refs['product'].$refs.main
      // let valid_2 = await form_2.validate().catch(err => false)
      // if (!valid_2 && submitFlag) {
      //   let formItems = form_2.fields
      //   formItems.some(formItem => {
      //     if (formItem.validateState === 'error') {
      //       submitFlag = false
      //       this.jnpf.focusItem(formItem.$children[1].$el)
      //       this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
      //       return true
      //     }
      //   });
      // }

      // 判断子表是否有效
      if (!this.productData.length && submitFlag) {
        submitFlag = false
        this.$message.error('请至少选择一个产品')
      }
      if (this.allocationFlag) {
        this.productData.forEach((item,index) => {
          if(!item.warehouseId){
            submitFlag=false
            this.$message.error("产品信息第"+(index + 1)+"行货位不能为空")
          }
        })
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
        this.dataForm.classAttribute = "finish_product"
        this.dataForm.sourceType = 'order'
        let dataObj = {
          stockMove: this.dataForm,
          lines: this.productData,
          spaceLines: this.copyLinesData
        }
        console.log("this.dataForm", this.dataForm);
        // 提交确认
        if (submitModel === 'submit') {
          let flag = await this.$confirm('请确认信息是否正确，提交后不允许修改，是否提交！', '提交确认', { type: 'warning' }).catch(err => false)
          if (!flag) {
            console.log(dataObj)
            return this.btnLoading = false
          }
        }

        // if (location.hostname === 'localhost' || location.href.indexOf('mode=dev') !== -1) { // 调试
        //   let flag = confirm('确定提交吗？')
        //   if (!flag) {
        //     console.log(dataObj)
        //     return this.btnLoading = false
        //   }
        // }

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
          // this.$emit('close', true)
          // this.$message({
          //   message: msg,
          //   type: 'success',
          //   duration: 1500,
          //   onClose: () => {
          //     this.visible = false
          //     this.btnLoading = false
          //   }
          // })
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }
    },
    // // 对应子数据新增或删除行
    // addOrDelLinesItem(data, type) {
    //   let paramType = Array.isArray(data) ? 'Array' : 'Object'
    //   console.log("data", data);
    //   console.log("paramType", paramType);
    //   if (paramType === 'Object') {
    //     this.linesList.splice(data.$index, 1)
    //     this.spaceLines = this.spaceLines.filter(item => item.productsId === data.row.productsId ? item.routingLineId !== data.row.routingLineId : true)
    //   } else {
    //     let tempList = JSON.parse(JSON.stringify(this.linesList))
    //     console.log("tempList", tempList);
    //     // 新数据替代旧数据
    //     if (type === 'cover') {
    //       data = data[0]
    //       tempList = data.lines
    //       this.spaceLines = data.spaceLines.map(spaceLine => {
    //         spaceLine.boxList = spaceLine.boxVoList.map(box => ({
    //           ...box,
    //           name: box.barCode
    //         }))
    //         delete spaceLine.boxVoList
    //         return spaceLine
    //       })
    //       this.dataForm['warehouseId'] = data.stockMove.warehouseId
    //       this.$set(this.dataForm, 'warehouseName', data.stockMove.warehouseName)
    //       this.wareChange(null, [{}])
    //     }
    //     let hasItemList = []
    //     for (let i = 0; i < data.length; i++) {
    //       let item = data[i];
    //       item.remark = ""
    //       item.costPrice = item.price
    //       if (item.calculationDirection === 'multiplication') {
    //         item.deputyNum = this.jnpf.numberFormat(item.num * item.ratio, 4)
    //       } else {
    //         item.deputyNum = this.jnpf.numberFormat(item.num / item.ratio, 4)
    //       }
    //       if (type == 'import') {
    //         item.productsId = item.productId
    //         item.productCode = item.productsCode
    //       } else {
    //         item.productCode = item.code

    //         item.productsId = item.id
    //       }
    //       item.totalAmount = this.jnpf.numberFormat(item.costPrice * item.num, 4)
    //       item.excludingTaxCostPrice = this.jnpf.numberFormat(item.costPrice / (1 + (item.taxRate * 1 / 100)), 4)
    //       item.warehouseId = this.dataForm.warehouseId
    //       item.warehouseType = this.dataForm.warehouseType
    //       const hasFlag = this.linesList.find(i => item.productsId === i.productsId)
    //       if (hasFlag) { hasItemList.push(item.productName) }
    //       else { tempList.push(item) }
    //       if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
    //     }
    //     this.linesList = tempList
    //     console.log("this.lin", this.linesList);
    //     this.linesList.forEach(item => {
    //       if (this.customerInfo.taxRate && !item.taxRate) {
    //         item.taxRate = this.customerInfo.taxRate
    //       }
    //     });
    //     this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() });
    //   }
    // },

    // linesChange(dataOrIndex, prop, value) {
    //   if (Array.isArray(dataOrIndex)) {
    //     this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
    //   } else if (prop) {
    //     this.linesList[dataOrIndex][prop] = value
    //   }
    // },
    // // 打开抽屉
    // openSide(scope) {
    //   console.log("scope", scope);
    //   this.wareVisibled = true
    //   this.$nextTick(() => {
    //     let rowDetailList = [JSON.parse(JSON.stringify(this.linesList[scope.$index]))]
    //     this.copyLinesData = rowDetailList
    //     this.$refs['wareSide'].init(scope, rowDetailList, this.btnType)
    //   })
    // },
    // // 抽屉提交
    // sideConfirm(data, scope) {
    //   let tempList = this.spaceLines.filter(line => line.productsId === scope.row.productsId ? line.routingLineId != scope.row.routingLineId : true)
    //   tempList.push(...data)
    //   this.spaceLines = tempList
    //   this.$refs['wareSide'].drawerVisible = false
    //   this.$refs['wareSide'].btnLoading = false
    //   this.$message.success("配置成功")
    // },
    // // 批次号失焦清空批次号列表选项
    // elementBlur(e) {
    //   setTimeout(() => {
    //     let option = this.linesListItems.find(o => o.prop === 'batchNumber')
    //     option.options = []
    //   }, 100)
    // },
    // wareChange(val, data) {
    //   this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField('warehouseName') })
    //   if (!val && data.length) return
    //   if (!data || !data.length) {
    //     this.dataForm['warehouseId'] = ""
    //     this.dataForm['warehouseName'] = ""
    //   } else {
    //     this.dataForm['warehouseId'] = data[0].id
    //     this.dataForm['warehouseName'] = data[0].name
    //     this.dataForm['warehouseType'] = data[0].all.type
    //   }
    //   console.log(val, data, this.dataForm);
    // },
    // selectCustomerFun(val, data) {
    //   console.log(val, data);
    //   this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField('partnerName') })
    //   if (!val && data.length) return
    //   if (!data || !data.length) {
    //     this.dataForm['cooperativePartnerId'] = ""
    //     this.dataForm['partnerName'] = ""
    //   } else {
    //     this.dataForm['cooperativePartnerId'] = data[0].id
    //     this.dataForm['partnerName'] = data[0].name
    //     this.customerInfo = data[0].all
    //   }
    //   console.log("tax", this.customerInfo.taxRate);
    //   if (!this.linesList.length) return
    //   this.linesList.forEach(item => {
    //     if (this.customerInfo.taxRate && !item.taxRate) {
    //       item.taxRate = this.customerInfo.taxRate
    //     }
    //   });
    //   console.log("this.lin", this.linesList);

    // },

    // processChange(val, data, paramsObj) {
    //   let tempList = this.spaceLines.filter(line => line.productsId === paramsObj.scope.row.productsId ? line.routingLineId !== paramsObj.scope.row.routingLineId : true) // 找出非操作line的scapeLines
    //   let template2 = this.spaceLines.filter(line => line.productsId === paramsObj.scope.row.productsId && line.routingLineId === paramsObj.scope.row.routingLineId) // 找出操作line的scapeLines
    //   if (!data || !data.length) {
    //     this.linesList[paramsObj.scope.$index].routingName = ""
    //     this.linesList[paramsObj.scope.$index].routingLineId = ""
    //     this.linesList[paramsObj.scope.$index].processName = ""
    //   } else {
    //     this.linesList[paramsObj.scope.$index].routingName = data[0].all.routingName
    //     this.linesList[paramsObj.scope.$index].routingLineId = data[0].all.routingLineId
    //     this.linesList[paramsObj.scope.$index].processName = data[0].all.processName
    //   }
    //   // template2.forEach(line => { line.routingLineId = this.linesList[paramsObj.scope.$index].routingLineId })
    //   // tempList.push(...template2)
    //   this.spaceLines = tempList
    // },
    // remoteMethod(query) {
    //   getProductionLotList({
    //     keyword: query,
    //     pageNum: 1,
    //     pageSize: 20,
    //   }).then(res => {
    //     this.productionLotList = res.data.records.map(item => { return { label: item.batchNumber, value: item.batchNumber } })
    //     // this.$nextTick(() => { this.refeshLinesListItems() });
    //     let option = this.linesListItems.find(o => o.prop === 'batchNumber')
    //     option.options = this.productionLotList
    //   })
    // },
    // onChangeLoading(val) {
    //   this.loadingText = val ? '正在导入数据' : ''
    //   this.formLoading = val
    // }
    // computed: {
    //   openMode() {
    //     this.$nextTick(() => { this.refeshLinesListItems() });
    //     return this.title === '新建出入库单' ? '新建' : this.title === '编辑出入库单' ? '编辑' : '只读'
    //   }
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

// .orderInfo ::v-deep .el-collapse-item__wrap {
//   border-bottom: none !important
// }</style>