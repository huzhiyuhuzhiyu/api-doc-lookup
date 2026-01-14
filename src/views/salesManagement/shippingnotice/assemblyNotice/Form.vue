<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" :content="btnType == 'add' ? '新建销售发货通知单' : btnType == 'edit' ? '编辑销售发货通知单' : btnType == 'qrsh' ? '确认收货' : btnType == 'copy' ? '新建销售发货通知单' : '查看销售发货通知单'" />
          <div class="options" v-if="btnType != 'look'">
            <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')" v-if="btnType != 'qrsh'">
              保存草稿</el-button>
            <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="订单信息" name="orderInfo">
              <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                <h5>基本信息</h5>
              </div>
              <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="8" :xs="24" v-if="btnType == 'look'" key="1">
                    <el-form-item label="通知单号" prop="orderNo">
                      <el-input v-model="dataForm.orderNo" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="换货标识" prop="exchangeGoodsFlag">
                      <el-select v-model="dataForm.exchangeGoodsFlag" placeholder="请选择状态" style="width: 100%;" @change="changeclick" :disabled="btnType == 'look' || Flagtype">
                        <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="客户名称" prop="partnerName">
                      <el-input v-model="dataForm.partnerName" placeholder="请选择客户" readonly @focus="openDialog" :disabled="true">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="发货日期" prop="deliverDate">
                      <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择发货日期" type="date" :disabled="btnType == 'look' || btnType == 'qrsh'" value-format="yyyy-MM-dd" style="width: 100%;">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'" key="2">
                    <el-form-item label="收件人" prop="recipient">
                      <el-input v-model="dataForm.recipient" placeholder="请输入收件人" :disabled="btnType == 'look' || btnType == 'qrsh'" maxlength="20" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'" key="3">
                    <el-form-item label="收件人电话" prop="phone">
                      <el-input v-model="dataForm.phone" placeholder="请输入电话" maxlength="20" :disabled="btnType == 'look' || btnType == 'qrsh'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="发货方式" prop="delivery">
                      <el-select v-model="dataForm.delivery" placeholder="请选择发货方式" clearable style="width: 100%;" :disabled="btnType == 'look' || btnType == 'qrsh'">
                        <el-option v-for="(item, index) in orderListfhfs" :key="index" :label="item.label" @click.native="changeDelivery(item.value)" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="发货状态" prop="deliveryStatus">
                      <el-select v-model="dataForm.deliveryStatus" placeholder="请选择发货状态" clearable style="width: 100%;" :disabled="btnType == 'look' ? true : false">
                        <el-option v-for="(item, index) in deliveryStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="发货完成时间" prop="deliveryCompletionDate">
                      <el-date-picker v-model="dataForm.deliveryCompletionDate" type="datetime" placeholder="请选择发货完成时间" :disabled="btnType == 'look'" style="width: 100%;" clearable>
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="创建时间" prop="createTime">
                      <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="请选择创建时间" :disabled="btnType == 'look'" style="width: 100%;" clearable>
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="创建人" prop="createByName">
                      <el-input v-model="dataForm.createByName" placeholder="请输入创建人" :disabled="btnType == 'look'" maxlength="20" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :xs="24" v-if="dataForm.delivery != 'self_pickup'" key="4">
                    <el-form-item label="收件地址" prop="address">
                      <template slot="label">
                        <span>地址</span>
                        <span>>></span>
                        <el-button :disabled="btnType == 'look'" type="text" @click="changeAddress">更换地址</el-button>
                      </template>
                      <el-input v-model="defaultAddress" readonly :disabled="btnType == 'look' || btnType == 'qrsh'" type="textarea" maxlength="50" :rows="2" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' || btnType == 'qrsh'" type="textarea" maxlength="200" :rows="2" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>发货订单</h5>
              </div>
              <div v-if="btnType != 'look'">
                <el-button type="text" style="margin-right:8px;margin-left:8px;  font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择销售订单</el-button>|
                <el-button type="text" style="margin-right:8px;margin-left:8px ; font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
              </div>
              <el-form :model="dataFormOne" v-bind="dataFormOne" ref="product1" class="data-form">
                <el-table :data="dataFormOne.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData">
                  <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                  <el-table-column prop="orderNo" label="销售订单号" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="workOrderNo" label="工作令号" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="deliveryDate" label="交货日期" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="orderDate" label="订单日期" show-overflow-tooltip></el-table-column>
                  <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'edit' || btnType == 'add' || btnType == 'copy'" :key="28">
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleDelone(scope)" style="color: #ff3a3a">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
              <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>
              <div v-if="btnType == 'add' || btnType == 'edit' || btnType == 'copy'">
              </div>
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                <el-table ref="product" :data="dataFormTwo.data" @selection-change="handeleProductInfoData" v-loading="tableloading">
                  <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                  <el-table-column prop="workOrderNo" label="工作令号" width="160" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="customerProductNo" label="客户物料号" width="150" show-overflow-tooltip key="166">
                  </el-table-column>
                  <el-table-column prop="customerProductDrawingNo" label="客户产品图号" width="290" show-overflow-tooltip key="16">
                  </el-table-column>
                  <el-table-column prop="productCode" label="产品编码" width="170" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="productName" label="产品名称" width="170" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="productDrawingNo" label="型号" width="290" key="8" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="ordersNum" label="订单数量" width="120" key="9" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="outboundQuantity" label="已出库数量" width="120" key="10" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="undeliveredQuantity" label="待出库数量" width="120" key="11" v-if="btnType == 'add' || btnType == 'edit' || btnType == 'copy'" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="receivingQuantity" label="收货数量" width="170" v-if="btnType == 'qrsh'" key="12">
                    <template slot="header">
                      <span class="required">*</span>收货数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'receivingQuantity'" :rules='productRules.receivingQuantity'>
                        <el-input v-model="scope.row.receivingQuantity" placeholder="请输入收货数量" :disabled="btnType == 'look'" maxlength="11" @input="watchnums(scope.row, scope.$index)" style="width: 145px;">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="pickingQuantity" label="拣货数量" width="200" v-if="btnType == 'qrsh'" show-overflow-tooltip key="13">
                  </el-table-column>
                  <el-table-column prop="deliveryQuantity" label="发货数量" width="170" key="21" v-if="!dataForm.exchangeGoodsFlag">
                    <template slot="header">
                      <span class="required">*</span>发货数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryQuantity'" :rules='productRules.deliveryQuantity'>
                        <el-input v-model="scope.row.deliveryQuantity" placeholder="请输入发货数量" :disabled="btnType == 'look' || btnType == 'qrsh'" maxlength="11" @input="watchnums(scope.row, scope.$index)" style="width: 145px;">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="deliveryQuantity" label="换发货数量" width="170" key="30" v-else>
                    <template slot="header">
                      <span class="required">*</span>换发货数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryQuantity'" :rules='productRules.deliveryQuantity'>
                        <el-input v-model="scope.row.deliveryQuantity" placeholder="请输入换发货数量" :disabled="btnType == 'look' || btnType == 'qrsh'" maxlength="11" @input="watchnums(scope.row, scope.$index)" style="width: 145px;">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="mainUnit" label="单位" width="100" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
            </el-tab-pane>
          </el-tabs>
        </div>
        <ComSelectPages ref="ComSelect-pages" @change="submitfaultLocationName" :tableItems="faultLocationNameItems" title="选择客户" placeholder="请选择客户" :listMethod="getCooperativeData" treeTitle="客户分类" :methodArr="{
            method: getcategoryTrees, requestObj: {
              keyword: '',
              type: 'customer'
            }
          }" :listRequestObj="form" :searchList="ProductfaultLocationName" :elementShow="false" />
        <!-- 选择订单 -->
        <ComSelect-page ref="ComSelect-page" @change="seleceCustomerdd" :beforeSubmit="beforeSubmit" :maxShowSearchField="4" :dialogWidth="'80%'" :tableItems="productTableItems" dialogTitle="选择订单" :listMethod="getsaleOrderList" :listRequestObj="ProductListRequestObj" :renderTree="false" :listDataFormatting="listDataFormatting" :searchList="productTableSearchList" :elementShow="false" multiple />
      </div>
    </transition>
    <changeAddress v-if="addressVisibled" ref="addressRef" @getChangeAddress="getChangeAddress"></changeAddress>
  </div>
</template>

<script>
import { editQuotationMsendlist, addQuotationsendlist, getQuotationsendlist, editReceiptnoticelist } from "@/api/salesManagement/index";
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getcategoryTrees, getAttributeline, getcooperativeProduct, getOrderDetail, getsaleOrderDetailList } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData, getAddressInfo } from '@/api/basicData/index'
import changeAddress from "./changeAddress.vue"
import ComSelectPages from "./ComSelect-pages/index.vue";
export default {
  components: {
    changeAddress,
    ComSelectPages
  },
  data() {
    return {
      tableloading: false,
      dataFormOne: {
        data: []
      },
      productTableSearchList: [],
      getsaleOrderList,
      productTableItems: [
        { prop: 'orderNo', label: '订单号' },
        { prop: 'cooperativePartnerCode', label: '客户编码', width: 140 },
        { prop: 'cooperativePartnerName', label: '客户名称', minWidth: 160 },
        { prop: 'orderDate', label: '订单日期' },
        { prop: 'orderType', label: '订单类型' },
        { prop: 'workOrderNo', label: '工作令号' }
      ],
      Flagtype: false,
      datafilelist: [],
      getCooperativeData,
      getcategoryTrees,
      deliveryList: [
        { label: "全部", value: "all" },
        { label: "未发货完成", value: "un_shipment_completed" },
        { label: "已发货完成", value: "shipment_completed" }
      ],
      faultLocationNameItems: [
        { label: "客户编码", prop: "code" },
        { label: "客户名称", prop: "name" },
        { label: "税号", prop: "taxId" }
      ],
      ProductfaultLocationName: [
        { label: "客户编码", prop: "code", type: 'input' },
        { label: "客户名称", prop: "name", type: 'input' },
      ],
      provinces: [],
      addressVisibled: false,
      inspectionStatusList: [
        { label: "待检验", value: "unInspect" },
        { label: "已检验", value: "inspected" },
      ],
      deliveryStatusList: [
        { label: "未完成", value: "undelivered" },
        { label: "已完成", value: "delivered" },
        { label: "已取消", value: "canceled" }
      ],
      documentStatusList: [
        { label: "正常发货", value: false },
        { label: "换货发货", value: true },
      ],
      approvalStatusList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" }
      ],
      orderList: [
        { label: "正常任务", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],
      orderListtf: [
        { label: "退货", value: "back" },
        { label: "发货", value: "delivery" },
      ],
      orderListdd: [
        { label: "外贸", value: "foreign_trade" },
        { label: "内销", value: "domestic_market" },
        { label: "总成", value: "assembly" }
      ],
      orderListfhfs: [
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" }
      ],
      productRules: {
        deliveryQuantity: [{ required: true, trigger: 'blur' }, { validator: this.formValidate('positiveNumber', '发货数量必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }, { validator: this.calcValidate(), trigger: 'blur' }],
        receivingQuantity: [{ required: true, trigger: 'blur' }, { validator: this.calcValidates(), trigger: 'blur' }]
      },
      ordersLineId: '',
      orderDateArr: [],
      code: '',
      iszt: false,
      iszhi: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,
      // 选择客户产品参数
      productForm: {
        drawingNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      productVisible: false,
      cusPrototal: 0,//选择客户产品分页器的总条数
      cusProductData: [],
      // 选择全部产品参数
      allProVisible: false,
      allproductData: [],
      allProductTotal: 0,

      ProductTreeData: [],
      ProductListRequestObj: {
        // neOrderState: 'finish',
        orderNo: "",
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        orderType: "",
        salesName: "",
        workOrderNo: "",
        sourceOrderNo: "",
        orderStartDate: "",
        orderEndDate: "",
        contractNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        // distributeStatus: 'distributed',
        orderCategory: "assembly",
        shipmentState: "",
        exchangeStatus: '',
        orderState: "",
        productionStatus: "",
        documentStatus: "",
        approvalStatus: "",
        startTime: "",
        endTime: "",
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
      attributeLines: [],
      // productData: [],
      dataFormTwo: {
        data: []
      },
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      treeData: [],
      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      index: null,
      expands: true,
      refreshTree: true,
      customerVisible: false,
      paymentStatusList: [
        { label: "未付款", value: "no_pay", },
        { label: "部分付款", value: "part_pay", },
        { label: "已付清", value: "payed", },
      ],
      paymentCycleList: [],
      activeNameDetail: 'productInfo',
      coverNum: "",//用于计算
      invoicingStatusList: [
        { label: "未开票", value: "not_invoiced" },
        { label: "部分开票", value: "partial_invoicing" },
        { label: "已开票", value: "invoiced" },
      ],
      btnType: undefined,
      areaList: [],
      provinces: [],
      cities: [],
      areas: [],
      contactsList: [],
      deliveryAddressList: [],
      countryList: [],
      listQuery: {
        keyword: ''
      },
      activeName: "orderInfo",
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        exchangeGoodsFlag: false,
        partnerName: '',
        orderCategory: "assembly",
        returnDeliveryType: 'delivery',
        notifyType: 'sale',
        ordersId: '',
        ordersNo: '',
        deliverDate: '',
        recipient: '',
        phone: '',
        country: '',
        province: '',
        city: '',
        area: '',
        address: '',
        delivery: '',
        // shipperId: '',
        cooperativePartnerId: '',
        remark: ''
      },
      defaultAddress: "",
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dataRule: {
        ordersNo: [
          { required: true, message: '订单编号不能为空', trigger: 'change' }
        ],
        exchangeGoodsFlag: [
          { required: true, message: '换货标识不能为空', trigger: 'change' }
        ],
        partnerName: [
          { required: true, message: '所属客户不能为空', trigger: 'change' }
        ],
        deliverDate: [
          { required: true, message: '发货日期不能为空', trigger: 'change' }
        ],
        recipient: [
          { required: true, message: '收件人不能为空', trigger: 'change' }
        ],
        phone: [{ required: true, message: '收件人电话不能为空', trigger: 'change' }, { validator: this.formValidate('iphone', '请输入正确的收件人电话'), trigger: 'blur' },],
        province: [{ required: true, message: '省份不能为空', trigger: 'change' }],
        city: [{ required: true, message: '市不能为空', trigger: 'change' }],
        area: [{ required: true, message: '地区不能为空', trigger: 'change' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'change' }],
        delivery: [{ required: true, message: '发货方式不能为空', trigger: 'change' }],
        // shipperId: [{ required: true, message: '发货人不能为空', trigger: 'change' }],
        country: [{ required: true, message: '国家不能为空', trigger: 'change' }],
      },
      customerData: {},
      treeLoading: false,
      selectRows: []
    }
  },
  created() {
    this.getAttributeline()
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    beforeSubmit(data) {
      let flags = false
      if (!data) {
        this.$message.error('请选择销售订单')
        return flags
      }
      if (this.dataFormOne.data.length) {
        flags = data.some(item => item.all.cooperativePartnerCode != this.dataFormOne.data[0].cooperativePartnerCode)
      } else {
        flags = data.some(item => item.all.cooperativePartnerCode != data[0].all.cooperativePartnerCode)
      }
      if (flags) return this.$message.error('不能同时选择不同客户的订单')
      return !flags
    },
    //数据格式化
    listDataFormatting(res) {
      res.data.records.forEach((item, index) => {
        if (item.orderType === 'normal') {
          item.orderType = '正常任务'
        } else if (item.orderType === 'prediction') {
          item.orderType = '预测订单'
        } else if (item.orderType === 'sample') {
          item.orderType = '样品订单'
        } else if (item.orderType === 'stock_up') {
          item.orderType = '备货订单'
        } else if (item.orderType === 'urgent') {
          item.orderType = '急件订单'
        }
      })
      return res.data.records
    },
    changeclick(e) {
      if (this.dataFormOne.data.length) {
        this.$confirm('切换换货标识，将清空订单和产品数据,是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '切换成功'
          })
          this.dataFormOne.data = []
          this.dataFormTwo.data = []
          this.deletedata()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
          this.dataForm.exchangeGoodsFlag = !e
        })
      }
    },
    //选择客户
    submitfaultLocationName(selectedIds, selectedList) {
      getCooperativeInfo(selectedIds).then(res => {
        if (this.dataForm.cooperativePartnerId && res.msg == 'Success') {
          this.$confirm('已选择过客户，是否切换，切换后将清空订单和产品信息，是否继续！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '切换成功'
            })
            this.deletedata()
            this.dataFormTwo.data = []
            // this.customerData = e
            this.dataForm.cooperativePartnerId = selectedList[0].all.id
            this.ProductListRequestObj.cooperativePartnerCode = selectedList[0].all.code
            this.code = selectedList[0].all.code
            this.dataForm.partnerName = selectedList[0].all.name
            this.dataForm.code = selectedList[0].all.code
            if (selectedList[0].all.modeTransport == "SH") {
              this.$set(this.dataForm, 'delivery', "deliver_goods")
              this.changeDelivery("deliver_goods")
            }
            if (selectedList[0].all.modeTransport == "ZT") {
              this.$set(this.dataForm, 'delivery', "self_pickup")
              this.changeDelivery("self_pickup")
            }
            if (selectedList[0].all.modeTransport == "KD") {
              this.$set(this.dataForm, 'delivery', "express_delivery")
              this.changeDelivery("express_delivery")
            }
            if (selectedList[0].all.modeTransport == "HY") {
              this.$set(this.dataForm, 'delivery', "freight_transport")
              this.changeDelivery("freight_transport")
            }
            if (selectedList[0].all.modeTransport == "DF") {
              this.$set(this.dataForm, 'delivery', "collect_payment")
              this.changeDelivery("collect_payment")
            }
            this.$refs['ComSelect-pages'].isvisible()

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        } else {
          this.deletedata()
          this.dataFormTwo.data = []
          // this.customerData = e
          this.dataForm.cooperativePartnerId = selectedList[0].all.id
          this.ProductListRequestObj.cooperativePartnerCode = selectedList[0].all.code
          this.code = selectedList[0].all.code
          this.dataForm.partnerName = selectedList[0].all.name
          this.dataForm.code = selectedList[0].all.code
          if (selectedList[0].all.modeTransport == "SH") {
            this.$set(this.dataForm, 'delivery', "deliver_goods")
            this.changeDelivery("deliver_goods")
          }
          if (selectedList[0].all.modeTransport == "ZT") {
            this.$set(this.dataForm, 'delivery', "self_pickup")
            this.changeDelivery("self_pickup")
          }
          if (selectedList[0].all.modeTransport == "KD") {
            this.$set(this.dataForm, 'delivery', "express_delivery")
            this.changeDelivery("express_delivery")
          }
          if (selectedList[0].all.modeTransport == "HY") {
            this.$set(this.dataForm, 'delivery', "freight_transport")
            this.changeDelivery("freight_transport")
          }
          if (selectedList[0].all.modeTransport == "DF") {
            this.$set(this.dataForm, 'delivery', "collect_payment")
            this.changeDelivery("collect_payment")
          }
          this.$refs['ComSelect-pages'].isvisible()

        }
      })
    },
    //发货数量不能为0
    calcValidate() {
      return (rule, value, callback) => {
        if (this.dataForm.exchangeGoodsFlag) {
          let index = Number(rule.field.match(/\d+/)[0])
          let msg = `第${index + 1}行换发货数量超过最大换发货数量`
          let flag = false
          let list = this.dataFormTwo.data
          let num_1 = Number(list[index].deliveryQuantity)
          let num_2 = Number(list[index].exchangeReturnQuantity) - Number(list[index].undeliveredReplacementQuantity) - Number(list[index].replacementQuantity)//已换退数量-待换出数量-已换发数量
          if (!(num_1 <= num_2)) { flag = true }
          if (flag) {
            this.$message.error(msg)
            callback(new Error(msg));
          } else { callback() }
        } else {
          callback()
        }
      };
    },
    //收货数量不能为0
    calcValidates() {
      return (rule, value, callback) => {
        let index = Number(rule.field.match(/\d+/)[0])
        let msg = `收货数量不能大于已出库数量`
        if (value == 0) {
          // this.$message.error('收货数量不能为"0"')
          // callback(new Error('收货数量不能为"0"'));
          callback()
        } else if (value < 0) {
          this.$message.error('收货数量不能小于0')
          callback(new Error('收货数量不能小于0'));
        }
        else {
          let flag = false
          let list = this.dataFormTwo.data
          let num_1 = Number(list[index].receivingQuantity)
          let num_2 = Number(list[index].outboundQuantity)
          if (!(num_1 <= num_2)) { flag = true }
          if (flag) {
            this.$message.error(msg)
            callback(new Error(msg));
          } else { callback() }
        }
      };
    },
    //选择发货方式
    changeDelivery(val) {
      if (val === 'self_pickup') {
        this.dataForm.country = ''
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
        this.dataForm.address = ''
        this.dataForm.phone = ''
        this.dataForm.recipient = ''
        this.defaultAddress = ''
      } else if (val === 'self_pickup' && this.dataForm.country != 'CN') {
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
        this.dataForm.address = ''
        this.dataForm.phone = ''
        this.dataForm.recipient = ''
        this.defaultAddress = ''
      }
    },
    dateFormat(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      const time = y + '-' + m + '-' + d
      return time
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) return this.$message.error('请选择要删除的产品')
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormOne.data.indexOf(row);
        if (index > -1) {
          this.dataFormOne.data.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
      this.dataFormTwo.data = []
      if (!this.dataFormOne.data.length) return this.deletedata()
      let idlist = {
        pageSize: -1,
        ordersIdList: this.dataFormOne.data.map(item => { return item.ordersId }),
        orderItems: [
          {
            "asc": false,
            "column": "orderNo"
          }
        ]
      }
      this.tableloading = true
      getsaleOrderDetailList(idlist).then(res => {
        this.tableloading = false
        let a = []
        if (!this.dataForm.exchangeGoodsFlag) {
          this.Flagtype = false
          a = res.data.records.filter(row => {
            //未完成 not_finish, 已完成 finish,  已停止 stopped//shipmentStatus发货状态
            return row.shipmentStatus == 'not_finish'
          })
        } else {
          this.Flagtype = false
          a = res.data.records
        }
        a.map((item) => {
          item.ordersNum = item.num
          item.productDrawingNo = item.drawingNo
          if (this.dataForm.exchangeGoodsFlag) {
            item.deliveryQuantity = Number(item.exchangeReturnQuantity * 1 - item.undeliveredReplacementQuantity * 1 - item.replacementQuantity * 1) > 0 ? item.exchangeReturnQuantity * 1 - item.undeliveredReplacementQuantity * 1 - item.replacementQuantity * 1 : ''
          } else {
            item.deliveryQuantity = Number(item.num * 1 - item.outboundQuantity * 1 - item.undeliveredQuantity * 1) > 0 ? item.num * 1 - item.outboundQuantity * 1 - item.undeliveredQuantity * 1 : ''
          }
        })
        // this.dataFormTwo.data = a
        this.processingdata(a)
      }).catch(() => {
        this.tableloading = false
      })
    },
    handleDelone(data) {
      this.dataFormOne.data.splice(data.$index, 1)
      this.dataFormTwo.data = []
      if (!this.dataFormOne.data.length) return this.deletedata()
      let idlist = {
        pageSize: -1,
        ordersIdList: this.dataFormOne.data.map(item => { return item.ordersId }),
        orderItems: [
          {
            "asc": false,
            "column": "orderNo"
          }
        ]
      }
      this.tableloading = true
      getsaleOrderDetailList(idlist).then(res => {
        this.tableloading = false
        let a = []
        if (!this.dataForm.exchangeGoodsFlag) {
          this.Flagtype = false
          a = res.data.records.filter(row => {
            //未完成 not_finish, 已完成 finish,  已停止 stopped//shipmentStatus发货状态
            return row.shipmentStatus == 'not_finish'
          })
        } else {
          this.Flagtype = false
          a = res.data.records
        }
        a.map((item) => {
          item.ordersNum = item.num
          item.productDrawingNo = item.drawingNo
          if (this.dataForm.exchangeGoodsFlag) {
            item.deliveryQuantity = Number(item.exchangeReturnQuantity * 1 - item.undeliveredReplacementQuantity * 1 - item.replacementQuantity * 1) > 0 ? item.exchangeReturnQuantity * 1 - item.undeliveredReplacementQuantity * 1 - item.replacementQuantity * 1 : ''
          } else {
            item.deliveryQuantity = Number(item.num * 1 - item.outboundQuantity * 1 - item.undeliveredQuantity * 1) > 0 ? item.num * 1 - item.outboundQuantity * 1 - item.undeliveredQuantity * 1 : ''
          }
        })
        // this.dataFormTwo.data = a
        this.processingdata(a)
      }).catch(() => {
        this.tableloading = false
      })
    },
    // 单个删除
    handleDel(data) {
      if (this.btnType == 'qrsh') {
        if (this.dataFormTwo.data.length > 1) {
          this.dataFormTwo.data.splice(data.$index, 1)
        } else {
          this.$message({
            message: '已是最后一条数据',
            type: 'error',
            duration: 1500,
          })
        }
      } else {
        this.dataFormTwo.data.splice(data.$index, 1)
      }
      if (this.dataFormTwo.data.length == 0) {
        this.deletedata()
      }
    },
    // 获取客户产品数据
    getcooperativeProduct() {
      this.productForm.partnerId = this.dataForm.cooperativePartnerId
      getcooperativeProduct(this.productForm).then(res => {
        this.cusProductData = res.data.records
      })
    },
    // 更换地址
    changeAddress() {
      this.addressVisibled = true
      if (!this.dataFormOne.data.length) {
        this.$message.error('请先选择订单')
      } else {
        this.$nextTick(() => {
          this.$refs.addressRef.initData(this.dataForm.cooperativePartnerId)
        })
      }
    },
    // 接收传递的地址
    getChangeAddress(data) {
      if (data) {
        this.dataForm.recipient = data.recipient
        this.dataForm.phone = data.phone
        this.dataForm.country = data.country === '中国' ? 'CN' : data.country
        this.dataForm.province = data.province
        this.dataForm.city = data.city
        this.dataForm.area = data.area
        this.dataForm.address = data.address
        if (this.dataForm.country === 'CN') {
          this.defaultAddress = data.countryText + data.provinceText + data.cityText + data.areaText + data.address
        } else {
          this.defaultAddress = data.countryText + data.address
        }
      }
    },
    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {
      if (this.dataForm.exchangeGoodsFlag) {
        this.productTableSearchList = [
          { prop: "orderNo", label: "订单号", type: "input" },
          { prop: "cooperativePartnerCode", label: "客户编码", type: "input" },
          { prop: "cooperativePartnerName", label: "客户名称", type: 'input' },
          {
            prop: "exchangeStatus", label: "换发状态", type: 'select', options: [{ label: "全部", value: "all" },
            { label: "未换发完成", value: "not_complete" },
            { label: "已换发完成", value: "completed" }]
          }
        ]
        this.ProductListRequestObj.exchangeStatus = 'not_complete'
        this.ProductListRequestObj.shipmentState = ''
      } else {
        this.productTableSearchList = [
          { prop: "orderNo", label: "订单号", type: "input" },
          { prop: "cooperativePartnerCode", label: "客户编码", type: "input" },
          { prop: "cooperativePartnerName", label: "客户名称", type: 'input' },
          {
            prop: "shipmentState", label: "发货状态", type: 'select', options: [{ label: "全部", value: "all" },
            { label: "未发货完成", value: "un_shipment_completed" },
            { label: "已发货完成", value: "shipment_completed" }]
          }
        ]
        this.ProductListRequestObj.shipmentState = 'un_shipment_completed'
        this.ProductListRequestObj.exchangeStatus = ''
      }
      // this.initData2()
      this.$refs['ComSelect-page'].openDialog()
      // }
    },
    // 获取所有产品列表数据
    initData2() {
      // this.ProductListRequestObj.cooperativePartnerCode = this.code ? this.code : this.dataForm.partnerCode
      this.listLoading = true
      getsaleOrderList(this.ProductListRequestObj).then(listRes => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        this.allProductTotal = listRes.data.total
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      })
    },
    // 搜索所有产品 列表
    searchAllProduct() {
      this.ProductListRequestObj.pageNum = 1
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.ProductListRequestObj.orderStartDate = this.orderDateArr[0]
        this.ProductListRequestObj.orderEndDate = this.orderDateArr[1]
      } else {
        this.ProductListRequestObj.orderStartDate = ""
        this.ProductListRequestObj.orderEndDate = ""
      }
      Object.keys(this.ProductListRequestObj).forEach(key => { // 清除搜索条件两端空格
        let item = this.ProductListRequestObj[key]
        this.ProductListRequestObj[key] = typeof item === 'string' ? item.trim() : item
      })
      this.initData2()
    },
    // 监听主数量输入
    watchnums(row, index) {
      if (this.btnType == 'qrsh') {
        if (!row.receivingQuantity) {
          return
        }
        row.receivingQuantity = row.receivingQuantity.replace(/[^0-9.]/g, '');

        if (row.receivingQuantity.length == 1 && row.receivingQuantity == '.') {
          // 如果第一位是小数点，则清空输入框
          row.receivingQuantity = '';
        } else if (row.receivingQuantity.length == 2 && row.receivingQuantity[0] == '0' && row.receivingQuantity[1] != '.') {
          // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
          row.receivingQuantity = row.receivingQuantity.slice(0, 1) + '.' + row.receivingQuantity.slice(1);
        } else if (row.receivingQuantity.length > 2 && row.receivingQuantity[0] == '0' && row.receivingQuantity[1] != '.') {
          row.receivingQuantity = row.receivingQuantity.substring(1, row.receivingQuantity.length)
        }
        if (row.receivingQuantity.includes('.')) {
          let dotCount = 0; // 小数点的数量
          let result = ''; // 处理后的结果
          for (let i = 0; i < row.receivingQuantity.length; i++) {
            const char = row.receivingQuantity[i];
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
          row.receivingQuantity = result;
          let arr = row.receivingQuantity.split('.')
          if (arr[0].length > 8) {
            arr[0] = arr[0].substring(0, 8)
          }
          if (arr[1].length > 2) {
            arr[1] = arr[1].substring(0, 2)
          }
          row.receivingQuantity = arr[0] + '.' + arr[1]
        } else {
          if (row.receivingQuantity.length > 8) {
            row.receivingQuantity = row.receivingQuantity.substring(0, 8);
          }
        }
      } else {
        // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
        // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
        // 如果计算方向是除 则副数量等于主数量*套数/转换系数
        // 使用正则表达式验证输入内容
        if (!row.deliveryQuantity) {
          return
        }
        row.deliveryQuantity = row.deliveryQuantity.replace(/[^0-9.]/g, '');

        if (row.deliveryQuantity.length == 1 && row.deliveryQuantity == '.') {
          // 如果第一位是小数点，则清空输入框
          row.deliveryQuantity = '';
        } else if (row.deliveryQuantity.length == 2 && row.deliveryQuantity[0] == '0' && row.deliveryQuantity[1] != '.') {
          // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
          row.deliveryQuantity = row.deliveryQuantity.slice(0, 1) + '.' + row.deliveryQuantity.slice(1);
        } else if (row.deliveryQuantity.length > 2 && row.deliveryQuantity[0] == '0' && row.deliveryQuantity[1] != '.') {
          row.deliveryQuantity = row.deliveryQuantity.substring(1, row.deliveryQuantity.length)
        }
        if (row.deliveryQuantity.includes('.')) {
          let dotCount = 0; // 小数点的数量
          let result = ''; // 处理后的结果
          for (let i = 0; i < row.deliveryQuantity.length; i++) {
            const char = row.deliveryQuantity[i];
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
          row.deliveryQuantity = result;
          let arr = row.deliveryQuantity.split('.')
          if (arr[0].length > 8) {
            arr[0] = arr[0].substring(0, 8)
          }
          if (arr[1].length > 2) {
            arr[1] = arr[1].substring(0, 2)
          }
          row.deliveryQuantity = arr[0] + '.' + arr[1]
        } else {
          if (row.deliveryQuantity.length > 8) {
            row.deliveryQuantity = row.deliveryQuantity.substring(0, 8);
          }
        }
      }
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.orderDateArr = []
      this.ProductListRequestObj = {
        // neOrderState: 'finish',
        orderNo: "",
        cooperativePartnerName: "",
        cooperativePartnerCode: '',
        orderType: "",
        salesName: "",
        workOrderNo: "",
        sourceOrderNo: "",
        orderStartDate: "",
        orderEndDate: "",
        contractNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        // distributeStatus: 'distributed',
        orderCategory: "assembly",
        shipmentState: "",
        exchangeStatus: '',
        orderState: "",
        productionStatus: "",
        documentStatus: "",
        approvalStatus: "",
        startTime: "",
        endTime: "",
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
        this.searchAllProduct()
    },
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },
    // 获取产品列表字段 编排属性
    getAttributeline() {
      getAttributeline('product').then(res => {
        this.attributeLines = res.data
      })
    },
    handleClose() {
      this.form = {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.initData()
    },
    closeproductVisible() {

    },
    //清空数据
    deletedata() {
      this.dataForm.ordersNo = '',
        this.dataForm.ordersId = '',
        this.dataForm.deliverDate = '',
        this.dataForm.recipient = '',
        this.dataForm.phone = '',
        this.dataForm.partnerName = '',
        this.dataForm.code = '',
        this.dataForm.country = '',
        this.dataForm.province = '',
        this.dataForm.city = '',
        this.dataForm.area = '',
        this.dataForm.address = '',
        this.dataForm.delivery = '',
        // this.dataForm.shipperId = '',
        this.dataForm.remark = '',
        this.defaultAddress = ''
    },
    //选择订单
    seleceCustomerdd(val, data) {
      data.forEach(row => {
        row.all.ordersId = row.all.id
        row.all.id = ''
      })
      if (this.dataFormOne.data.length) {
        let hasItemList = []
        data.map(i => {
          const hasFlag = this.dataFormOne.data.some(item => {
            let flag = false
            if (i.all.orderNo === item.orderNo) { flag = true }
            return flag
          })
          if (hasFlag) { hasItemList.push(i.all.orderNo) }
          else { this.dataFormOne.data.push(i.all) }
          if (hasItemList.length) this.$message.error(`已经存在的订单：${hasItemList.join('、')}`)
        })
      } else {
        data.map(item => {
          this.dataFormOne.data.push(item.all)
        })
      }
      this.dataForm.cooperativePartnerId = data[0].all.cooperativePartnerId
      this.productForm.partnerId = data[0].all.cooperativePartnerId
      this.dataForm.partnerName = data[0].all.cooperativePartnerName
      getAddressInfo(this.dataForm.cooperativePartnerId).then(row => {
        let dfaddress = row.data.filter(item => { return item.defaultFlag })
        if (dfaddress.length) {
          this.dataForm.recipient = dfaddress[0].recipient
          this.dataForm.phone = dfaddress[0].phone
          this.dataForm.country = dfaddress[0].country === '中国' ? 'CN' : dfaddress[0].country
          this.dataForm.province = dfaddress[0].province
          this.dataForm.city = dfaddress[0].city
          this.dataForm.area = dfaddress[0].area
          this.dataForm.address = dfaddress[0].address
          if (this.dataForm.country === 'CN') {
            this.defaultAddress = dfaddress[0].countryText + dfaddress[0].provinceText + dfaddress[0].cityText + dfaddress[0].areaText + dfaddress[0].address
          } else {
            this.defaultAddress = dfaddress[0].countryText + dfaddress[0].address
          }
        }
      })
      let idlist = {
        pageSize: -1,
        ordersIdList: this.dataFormOne.data.map(item => { return item.ordersId }),
        orderItems: [
          {
            "asc": false,
            "column": "orderNo"
          }
        ]
      }
      this.tableloading = true
      getsaleOrderDetailList(idlist).then(res => {
        this.tableloading = false
        let a = []
        this.dataFormTwo.data = []
        if (!this.dataForm.exchangeGoodsFlag) {
          this.Flagtype = false
          a = res.data.records.filter(row => {
            //未完成 not_finish, 已完成 finish,  已停止 stopped//shipmentStatus发货状态
            return row.shipmentStatus == 'not_finish'
          })
        } else {
          this.Flagtype = false
          a = res.data.records
        }
        a.map((item) => {
          item.ordersNum = item.num
          item.productDrawingNo = item.drawingNo
          if (this.dataForm.exchangeGoodsFlag) {
            item.deliveryQuantity = Number(item.exchangeReturnQuantity * 1 - item.undeliveredReplacementQuantity * 1 - item.replacementQuantity * 1) > 0 ? item.exchangeReturnQuantity * 1 - item.undeliveredReplacementQuantity * 1 - item.replacementQuantity * 1 : ''
          } else {
            item.deliveryQuantity = Number(item.num * 1 - item.outboundQuantity * 1 - item.undeliveredQuantity * 1) > 0 ? item.num * 1 - item.outboundQuantity * 1 - item.undeliveredQuantity * 1 : ''
          }
        })
        // this.dataFormTwo.data = a
        this.processingdata(a)
      }).catch(() => {
        this.tableloading = false
      })

    },
    //明细列表id相同合并
    processingdata(a) {
      let list = a.reduce((result, obj) => {
        let target = result.find((item) => {
          return item.id == obj.id
        })
        if (target) {
          target.ordersNum = obj.ordersNum * 1 + target.ordersNum * 1
          target.outboundQuantity = obj.outboundQuantity * 1 + target.outboundQuantity * 1
          target.undeliveredQuantity = obj.undeliveredQuantity * 1 + target.undeliveredQuantity * 1
          target.deliveryQuantity = obj.deliveryQuantity * 1 + target.deliveryQuantity * 1
        } else {
          result.push(obj)
        }
        return result
      }, [])
      this.dataFormTwo.data = list
    },
    search() {
      this.form.pageNum = 1
      this.initData()
    },
    initData() {
      this.listLoading = true
      getCooperativeData(this.form).then(res => {
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.search()
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.ProductListRequestObj.classAttribute = data.classAttribute
      this.searchAllProduct()
    },
    getNodePathProduct(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    // 打开选择客户弹框
    openDialog() {
      this.$refs['ComSelect-pages'].openDialog()
    },
    // 切换table
    handleClick(tab, event) {
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType != 'look') {
        this.iszt = true
      }
      if (this.dataForm.id) {
        getQuotationsendlist(this.dataForm.id).then(res => {
          this.dataForm = res.data.notice
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push(
                {
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                }
              )
            })
          }
          this.dataForm.country = res.data.notice.country === '中国' ? 'CN' : res.data.notice.country
          if (this.dataForm.country === 'CN') {
            this.defaultAddress = res.data.notice.region.provinceName + res.data.notice.region.cityName + res.data.notice.region.areaName + res.data.notice.address
          } else {
            this.defaultAddress = res.data.notice.region.countryName + res.data.notice.address
          }
          if (this.btnType == 'copy') {
            this.dataForm.id = ''
            this.dataForm.stockStatus = ''
            this.dataForm.inspectionStatus = ''
            this.dataForm.deliverDate = ''
            this.datafilelist = []
            this.dataForm.approvalStatus = ''
            this.dataForm.fullReceiptFlag = false
            this.dataForm.shipmentStatus = ""
            this.dataFormOne.data = res.data.sourceNoticeList.map(item => {
              item.orderNo = item.saleOrderNo
              item.cooperativePartnerCode = this.dataForm.partnerCode
              return item
            })
            let idlist = {
              pageSize: -1,
              ordersIdList: this.dataFormOne.data.map(item => { return item.ordersId }),
              orderItems: [
                {
                  "asc": false,
                  "column": "orderNo"
                }
              ]
            }
            getsaleOrderDetailList(idlist).then(res => {
              let a = []
              this.dataFormTwo.data = []
              if (!this.dataForm.exchangeGoodsFlag) {
                this.Flagtype = false
                a = res.data.records.filter(row => {
                  //未完成 not_finish, 已完成 finish,  已停止 stopped//shipmentStatus发货状态
                  return row.shipmentStatus == 'not_finish'
                })
              } else {
                this.Flagtype = false
                a = res.data.records
              }
              a.map((item) => {
                item.ordersNum = item.num
                item.productDrawingNo = item.drawingNo
                if (this.dataForm.exchangeGoodsFlag) {
                  item.deliveryQuantity = Number(item.exchangeReturnQuantity * 1 - item.undeliveredReplacementQuantity * 1 - item.replacementQuantity * 1) > 0 ? item.exchangeReturnQuantity * 1 - item.undeliveredReplacementQuantity * 1 - item.replacementQuantity * 1 : ''
                } else {
                  item.deliveryQuantity = Number(item.num * 1 - item.outboundQuantity * 1 - item.undeliveredQuantity * 1) > 0 ? item.num * 1 - item.outboundQuantity * 1 - item.undeliveredQuantity * 1 : ''
                }
              })
              // this.dataFormTwo.data = a
              this.processingdata(a)
            })
          } else if (this.btnType == 'edit' || this.btnType == 'look') {
            this.dataFormOne.data = res.data.sourceNoticeList.map(item => {
              item.orderNo = item.saleOrderNo
              item.cooperativePartnerCode = this.dataForm.partnerCode
              return item
            })
            // this.dataFormTwo.data = res.data.noticeLineList
            this.processingdata(res.data.noticeLineList)
          }
        })
      }
    },
    goBack() {
      this.$emit('close')
    },
    handleConfirm(value) {
      this.$refs['productForm'].validate((valid) => {
        this.iszhi = valid ? false : true
      })
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (valid) {
          if (!this.dataFormTwo.data.length) {
            this.$message({
              message: '至少有一条发货明细',
              type: 'error',
              duration: 1500,
            })
            return
          }
          if (this.btnType == 'qrsh') {
            this.dataFormTwo.data.forEach((item, index) => {
              if (!item.receivingQuantity) {
                this.iszhi = true
                this.$message({
                  message: `第${index + 1}行收货数量不能为空`,
                  type: 'error',
                  duration: 1500,
                })
              }
            })
          }
          if (this.iszhi) {
            this.iszhi = false
            return
          }
          if (value == 'submit') {
            this.dataForm.inspectionStatus = 'inspected'
          }
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: '',
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj = {
            attachmentList: this.datafilelist,
            notice: this.dataForm,
            noticeLineList: [],
            sourceNoticeList: this.btnType == 'add' ? this.dataFormOne.data.map(item => { return { ordersId: item.ordersId, cooperativePartnerId: item.cooperativePartnerId, returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '' } }) : this.dataFormOne.data
          }
          let obj1 = {
            attachmentList: this.datafilelist,
            id: this.dataForm.id,
            remark: this.dataForm.remark,
            receiptLineList: [],
          }
          this.dataFormTwo.data.forEach((item, index) => {
            let dep1 = {
              billStatus: item.billStatus ? item.billStatus : '',
              calculationDirection: item.calculationDirection ? item.calculationDirection : '',
              deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
              deputyUnit: item.deputyUnit ? item.deputyUnit : '',
              mainUnit: item.mainUnit ? item.mainUnit : '',
              ordersId: item.ordersId,
              notifyType: 'sale',
              id: item.id ? item.id : '',
              // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
              ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
              pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
              ratio: item.ratio ? item.ratio : '',
              receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
              remark: item.remark ? item.remark : '',
              returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
              receivingQuantity: item.receivingQuantity ? item.receivingQuantity : '',
            }
            obj1.receiptLineList.push(dep1)
            if (this.btnType == 'add' || this.btnType == 'copy') {
              let dep = {
                calculationDirection: item.calculationDirection ? item.calculationDirection : '',
                deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                deputyUnit: item.deputyUnit ? item.deputyUnit : '',
                mainUnit: item.mainUnit ? item.mainUnit : '',
                ordersId: item.ordersId,
                notifyType: 'sale',
                inspectionResults: 'qualified',
                qualifiedQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                id: '',
                ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
                ratio: item.ratio ? item.ratio : '',
                // receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
                remark: item.remark ? item.remark : '',
                returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
                receivingQuantity: item.receivingQuantity ? item.receivingQuantity : '',
                sourceNoticeLineList: [
                  {
                    id: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].id : '',
                    deliveryQuantity: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].deliveryQuantity : item.deliveryQuantity,
                    ordersId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].ordersId : item.ordersId,
                    ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                    returnDeliveryNoticeId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeId : '',
                    returnDeliveryNoticeLineId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeLineId : '',
                  }
                ]
              }
              obj.noticeLineList.push(dep)
            } else {
              let dep2 = {
                billStatus: item.billStatus ? item.billStatus : '',
                calculationDirection: item.calculationDirection ? item.calculationDirection : '',
                deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                deputyUnit: item.deputyUnit ? item.deputyUnit : '',
                mainUnit: item.mainUnit ? item.mainUnit : '',
                ordersId: item.ordersId,
                notifyType: 'sale',
                inspectionResults: 'qualified',
                qualifiedQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                id: '',
                ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
                ratio: item.ratio ? item.ratio : '',
                receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
                remark: item.remark ? item.remark : '',
                returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
                receivingQuantity: item.receivingQuantity ? item.receivingQuantity : '',
                sourceNoticeLineList: [
                  {
                    id: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].id : '',
                    deliveryQuantity: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].deliveryQuantity : item.deliveryQuantity,
                    ordersId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].ordersId : item.ordersId,
                    ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                    returnDeliveryNoticeId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeId : '',
                    returnDeliveryNoticeLineId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeLineId : '',
                  }
                ]
              }
              obj.noticeLineList.push(dep2)
            }
          })
          if (this.btnType == 'qrsh') {
            let isreceivingQuantity = this.dataFormTwo.data.some((item, index) => {
              return item.receivingQuantity && item.receivingQuantity * 1 < item.outboundQuantity * 1
            })
            let isreceivingQuantitys = this.dataFormTwo.data.some((item, index) => {
              return item.receivingQuantity && item.receivingQuantity * 1 > item.outboundQuantity * 1
            })
            if (isreceivingQuantitys) {
              return
            } else if (isreceivingQuantity) {
              this.$confirm(`确认收货只能操作一次，您是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.btnLoading = true
                editReceiptnoticelist(obj1).then(res => {
                  this.$message({
                    message: '确认收货成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.btnLoading = false
                      this.$emit('close', true)
                    }
                  })
                }).catch(() => {
                  this.btnLoading = false
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
            }
            else {
              this.$confirm(`确认收货只能操作一次，您是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.btnLoading = true
                editReceiptnoticelist(obj1).then(res => {
                  this.$message({
                    message: '确认收货成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.btnLoading = false
                      this.$emit('close', true)
                    }
                  })
                }).catch(() => {
                  this.btnLoading = false
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
            }
          } else {
            let isQuantity = this.dataFormTwo.data.some((item, index) => {
              return item.ordersNum && item.deliveryQuantity * 1 + item.outboundQuantity * 1 + item.undeliveredQuantity * 1 > item.ordersNum * 1
            })
            if (!this.dataForm.exchangeGoodsFlag && isQuantity) {
              this.$confirm(`总发货数量大于订单数量,是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.btnLoading = true
                let formMethod = null;
                if (this.btnType == 'edit') {
                  formMethod = editQuotationMsendlist
                } else if (this.btnType == 'add' || this.btnType == 'copy') {
                  obj.notice.deliveryStatus = 'undelivered'
                  formMethod = addQuotationsendlist
                }
                formMethod(obj).then(res => {
                  let msg = "";
                  if (formMethod == addQuotationsendlist) {
                    msg = "新建成功"
                  } else if (value == 'draft') {
                    msg = "保存成功"
                  } else if (value == 'submit') {
                    msg = '提交成功'
                  }
                  this.$message({
                    message: msg,
                    type: 'success',
                    duration: 1500,
                  })
                  this.visible = false
                  this.btnLoading = false
                  this.$emit('close', true)
                }).catch(() => {
                  this.btnLoading = false
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
            } else {
              this.btnLoading = true
              let formMethod = null;
              if (this.btnType == 'edit') {
                formMethod = editQuotationMsendlist
              } else if (this.btnType == 'add' || this.btnType == 'copy') {
                obj.notice.deliveryStatus = 'undelivered'
                formMethod = addQuotationsendlist
              }
              formMethod(obj).then(res => {
                let msg = "";
                if (formMethod == addQuotationsendlist) {
                  msg = "新建成功"
                } else if (value == 'draft') {
                  msg = "保存成功"
                } else if (value == 'submit') {
                  msg = '提交成功'
                }
                this.$message({
                  message: msg,
                  type: 'success',
                  duration: 1500,
                })
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }).catch(() => {
                this.btnLoading = false
              })
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>
<style lang="scss" scoped>
$footerPadding: '10px';

::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
}

::v-deep .el-dialog__body {
  margin-bottom: 10px;
}

::v-deep .el-dialog__footer {
  padding: 0 20px 10px;
}

::v-deep .even-row,
::v-deep .odd-row {
  cursor: pointer;
}

.killPadding {
  padding: 0;
}

.killPaddingLeft {
  padding-left: 0 !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding: 2px 10px 2px 0;
}

::v-deep .JNPF-common-search-box.noSearchList {
  padding: 3px 0;
}

::v-deep .has-gutter .el-table__cell.gutter {
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}
</style>
