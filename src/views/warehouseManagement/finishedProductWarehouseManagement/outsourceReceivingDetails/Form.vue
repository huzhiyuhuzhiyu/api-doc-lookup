<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add'
          ? '新建外协收货通知单'
          : btnType == 'edit'
            ? '编辑外协收货通知单'
            : btnType == 'copy'
              ? '新建外协收货通知单'
              : '查看外协收货通知单'
          " />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿
          </el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="btnType == 'look'
                          ? true
                          : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                            ? false
                            : true
                          "></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="仓库" prop="warehouseId">
                        <el-select v-model="dataForm.warehouseId" placeholder="请选择仓库" style="width: 100%;"
                          :disabled="btnType == 'look' ? true : false" clearable>
                          <el-option v-for="(item, index) in warehouseIdList" :key="index" :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="供应商名称" prop="partnerName">
                        <ComSelect-page clearable :isdisabled="btnType === 'look'" :treeNodeClick="treeNodeClick"
                          v-model="dataForm.partnerName" :beforeSubmit="beforeSubmit" ref="ComSelect-page"
                          @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'" title="选择供应商"
                          treeTitle="供应商分类" :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                          :listRequestObj="PartnerListRequestObj" :paramsObj="{ oldData }"
                          :searchList="PartnerTableSearchList" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="操作人" prop="salesman">
                        <el-input v-model="dataForm.salesman" placeholder="请选择操作人"
                          :disabled="btnType == 'look'"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="收货日期" prop="deliverDate">
                        <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择收货日期" type="date"
                          :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="创建时间" prop="createTime">
                        <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="请选择创建时间"
                          :disabled="btnType == 'look'" style="width: 100%;" clearable></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="创建人" prop="createByName">
                        <el-input v-model="dataForm.createByName" placeholder="请输入创建人" :disabled="btnType == 'look'"
                          maxlength="20" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'"
                          type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="productInfo">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    icon="el-icon-plus" @click="openSeleceProductDialog()">
                    选择产品
                  </el-button>
                  |
                  <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                  :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择订单</el-button>| -->
                  <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                    批量删除
                  </el-button>
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO
                    @selection-change="handeleProductInfoData">
                    <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType !== 'look'"
                      key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                    <!-- <el-table-column prop="customerProductNo" label="客户产品编码" width="200" show-overflow-tooltip> -->
                    <!-- </el-table-column> -->
                    <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom" />
                    <el-table-column prop="mainUnit" label="单位" width="160" />
                    <el-table-column prop="purchaseQuantity" label="入库数量" width="160" sortable="custom" />
                    <el-table-column v-if="btnType !== 'look'" prop="waitReceiptNum" label="待收货数量" width="160"
                      sortable="custom" />
                    <el-table-column prop="receivedQuantity" label="收货数量" width="170" v-if="!dataForm.exchangeGoodsFlag"
                      key="789">
                      <template slot="header">
                        <span class="required">*</span>
                        收货数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'receivedQuantity'"
                          :rules="productRules.receivedQuantity">
                          <el-input v-model="scope.row.receivedQuantity" placeholder="请输入收货数量"
                            :disabled="btnType == 'look'" maxlength="11" @input="watchnums(scope.row, scope.$index)"
                            style="width: 145px;">
                            {{ scope.row.receivedQuantity }}
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注"
                          :disabled="btnType == 'look' ? true : false" maxlength="200" show-overflow-tooltip />
                      </template>
                    </el-table-column>
                    <el-table-column prop="standardValue" label="规值" min-width="200"></el-table-column>
                    <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom" />
                    <el-table-column prop="accuracyLevel" label="精度等级" width="160" sortable="custom" />
                    <el-table-column prop="vibrationLevel" label="振动等级" width="160" sortable="custom" />
                    <el-table-column prop="oil" label="油脂" width="160" sortable="custom" />
                    <el-table-column prop="oilQuantity" label="油脂量" width="160" sortable="custom" />
                    <el-table-column prop="clearance" label="游隙" width="160" sortable="custom" />
                    <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom" />
                    <el-table-column prop="remark" label="备注" width="160" />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />

                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin:0 10px">总收货数量：{{ totalDeliveryQuantity }}</span>
                  </div>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>

      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
        width="500px">
        <div>
          <img src="@/assets/images/importSuccess.gif" alt="" style="width:100px" />
          <span class="import_t">{{ submitmethodsTitle }}啦！</span>
          <span class="import_b">您还可以进行如下操作：</span>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>
          <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()">{{ btnText }}</el-button>
          <el-button v-else type="primary" @click="continueAdd()">{{ btnText }}</el-button>
        </span>
      </el-dialog>
      <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
        :methodArr="ProductMethodArr" :listMethod="detailpurchaseOrderList" :listRequestObj="ProductListRequestObj"
        :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>

<script>
import { getProvinceList } from '@/api/system/province'
// import { getOrderDetail, addOrders, editOrders, getcategoryTrees, getAttributeline, getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
import {
  editQuotationMsendlist,
  addQuotationsendlist,
  getQuotationsendlist,
  editReceiptnoticelist
} from '@/api/salesManagement/index'
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import {
  getcategoryTrees,
  getAttributeline,
  getcooperativeProduct,
  getOrderDetail,
  getsaleOrderDetailList
} from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData } from '@/api/basicData/index'
import { detailpurchaseOrderList } from '@/api/purchasingAndOutsourcingOrders/index'
import {
  addpurPurchaseReceiptReturnGoods,
  editpurPurchaseReceiptReturnGoods,
  getpurPurchaseReceiptReturnGoodsdetail
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getWarehouseList } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { mapGetters } from "vuex"
export default {
  data() {
    return {

      getCooperativeData,
      getcategoryTree,
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'outsourcing_suppliers' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码' },
        { prop: 'name', label: '供应商名称' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '供应商编码', type: 'input' },
        { prop: 'name', label: '供应商名称', type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'outsourcing_suppliers'
      },
      oldData: [],

      detailpurchaseOrderList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: '产品分类', classAttribute: '', method: getcategoryTree, requestObj: { classAttribute: '' } }
        // { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        cooperativePartnerCode: '',
        cooperativePartnerId: '',
        partnerName: '',
        createByName: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        endTime: '',
        orderNo: '',
        orderType: 'external',
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        productCode: '',
        productName: '',
        classAttribute: 'finish_product',
        receivingStatus: 'receiving'
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'drawingNo', label: '品名规格', sortable: 'custom' },
        { prop: 'name', label: '产品名称', sortable: 'custom' },
        { prop: 'productCode', label: '产品编码', sortable: 'custom' },
        { prop: 'classAttributeText', label: '产品分类', sortable: 'custom' },
        { prop: 'mainUnit', label: '单位' },
        { prop: 'num', label: '数量' },
        { prop: 'sealingCoverTyping', label: '打字内容' },
        { prop: 'accuracyLevel', label: '精度等级' },
        { prop: 'vibrationLevel', label: '振动等级' },
        { prop: 'oil', label: '油脂' },
        { prop: 'oilQuantity', label: '油脂量' },
        { prop: 'clearance', label: '游隙' },
        { prop: 'packagingMethod', label: '包装方式' },
        { prop: 'remark', label: '备注' },
        { prop: 'createTime', label: '创建日期', sortable: 'custom' }
      ], // 产品选择弹出框搜索条件
      ProductTableSearchList: [
        { prop: 'drawingNo', label: '品名规格', type: 'input' },
        { prop: 'name', label: '产品名称', type: 'input' },
        { prop: 'code', label: '产品编码', type: 'input' }
      ], // 产品选择弹出框搜索条件

      tipsvisible: false,
      submitmethodsTitle: '',
      btnText: '',
      productList: [],
      deliveryDateArr: [],
      activeNames: ['productInfo', 'basicInfo'],
      productTotal: 0,
      codeConfig: {},
      datafilelist: [],
      provinces: [],
      orderForm: {
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        createByName: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        endTime: '',
        orderNo: '',
        orderType: 'external',
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        productCode: '',
        productName: '',
        classAttribute: 'finish_product',
        receivingStatus: 'receiving'
      },
      // orderList: [
      //   { label: "外协通知", value: "external" },
      //   { label: "外协通知", value: "sale" },
      // ],
      inspectionStatusList: [
        { label: '待检验', value: 'unInspect' },
        { label: '已检验', value: 'inspected' },
        { label: '检验中', value: 'inspecting' }
      ],
      deliveryStatusList: [
        { label: '未完成', value: 'not_returned' },
        { label: '已完成', value: 'returned' },
        { label: '已取消', value: 'canceled' }
      ],
      documentStatusList: [{ label: '收货', value: false }, { label: '换货', value: true }],
      approvalStatusList: [
        { label: '审批中', value: 'ing' },
        { label: '审批通过', value: 'ok' },
        { label: '审批拒绝', value: 'rebut' }
      ],
      orderListtf: [{ label: '收货', value: 'back' }, { label: '发货', value: 'delivery' }],
      orderListdd: [
        { label: '外贸', value: 'foreign_trade' },
        { label: '内销', value: 'domestic_market' },
        { label: '总成', value: 'assembly' }
      ],
      orderListfhfs: [
        { label: '送货', value: 'deliver_goods' },
        { label: '自提', value: 'self_pickup' },
        { label: '快递', value: 'express_delivery' },
        { label: '货运', value: 'freight_transport' },
        { label: '到付', value: 'collect_payment' }
      ],
      orderList: [
        { label: '正常订单', value: 'normal' },
        { label: '预测订单', value: 'prediction' },
        { label: '样品订单', value: 'sample' },
        { label: '备货订单', value: 'stock_up' },
        { label: '急件订单', value: 'urgent' }
      ],
      productRules: {
        receivedQuantity: [
          { required: true, trigger: 'blur' },
          { validator: this.calcValidate(), trigger: 'blur' },
          { validator: this.calcValidatenum(), trigger: 'blur' }
        ]
      },
      ordersLineId: '',
      code: '',
      iszhi: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,
      // 选择客户产品参数
      productForm: {
        //   drawingNo: "",
        productCode: '',
        productName: '',
        partnerId: '',
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
        pageSize: 20
      },
      productVisible: false,
      cusPrototal: 0, //选择客户产品分页器的总条数
      cusProductData: [],
      // 选择全部产品参数
      allProVisible: false,
      ProductMethodArr: [
        {
          label: '物料分类',
          classAttribute: 'material',
          method: getcategoryTree,
          requestObj: { classAttribute: 'material' }
        }
      ],
      allproductData: [],
      allProductTotal: 0,
      orderDateArr: [],
      ProductTreeData: [],
      ProductListRequestObj: {
        // neOrderState: 'finish',
        orderNo: '',
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        orderType: '',
        salesName: '',
        workOrderNo: '',
        sourceOrderNo: '',
        orderStartDate: '',
        orderEndDate: '',
        contractNo: '',
        deliveryStartDate: '',
        deliveryEndDate: '',
        distributeStatus: 'distributed',
        // orderCategory: "assembly",
        shipmentStatus: '',
        orderState: '',
        productionStatus: '',
        documentStatus: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ]
      },
      attributeLines: [],
      dataFormTwo: {
        productData: []
      },
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      treeData: [],
      form: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      index: null,
      expands: true,
      refreshTree: true,
      customerVisible: false,
      paymentMethodList: [],
      paymentCycleList: [],
      activeNameDetail: 'productInfo',
      coverNum: '', //用于计算
      invoicingStatusList: [
        { label: '未开票', value: 'not_invoiced' },
        { label: '部分开票', value: 'partial_invoicing' },
        { label: '已开票', value: 'invoiced' }
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
      activeName: 'orderInfo',
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        exchangeGoodsFlag: false,
        inspectionStatus: '',
        // orderCategory: "assembly",
        returnDeliveryType: 'back',
        notificationType: 'external',
        salesman: '',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        partnerName: '',
        orderNo: '',
        logisticsNumber: '',
        //   phone: '',
        //   country: '',
        //   province: '',
        //   city: '',
        //   area: '',
        //   address: '',
        //   delivery: '',
        //   shipperId: '',
        cooperativePartnerId: '',
        remark: ''
      },
      defaultAddress: '',
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      dataRule: {
        salesman: [{ required: true, message: '操作人不能为空', trigger: 'blur' }],
        partnerName: [{ required: true, message: '所属客户不能为空', trigger: 'change' }],
        exchangeGoodsFlag: [{ required: true, message: '换货标识不能为空', trigger: 'change' }],
        orderNo: [{ required: true, message: '订单编号不能为空', trigger: 'change' }],
        deliverDate: [{ required: true, message: '收货日期不能为空', trigger: 'change' }],
        logisticsCompany: [{ required: true, message: '物流公司不能为空', trigger: 'change' }],
        logisticsNumber: [{ required: true, message: '物流单号不能为空', trigger: 'change' }]
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
      warehouseIdList: []
    }
  },
  computed: {
    // 总发货数量
    totalDeliveryQuantity: function () {
      var totalNum = 0
      for (var i = 0; i < this.dataFormTwo.productData.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.dataFormTwo.productData[i].receivedQuantity])
      }
      return totalNum
    },
    ...mapGetters(['userInfo'])
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    // this.handleChange()
    // this.getProvinceList()
    this.getAttributeline()
    this.getWarehouseList()
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 切换供应商后给的提示
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (paramsObj.oldData.length) {
        flag = await this.$confirm('切换供应商将清空产品信息，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '更换成功!'
            })
            this.$refs['productForm'].resetFields()
            return true
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            return false
          })
      }
      return flag
    },
    supplierdata(id, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('partnerName')
      })
      if (data.length === 0) {
        this.dataForm.partnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.partnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
        this.ProductListRequestObj.cooperativePartnerId = this.dataForm.cooperativePartnerId

      }
    },

    // 点击选择产品
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    // 产品组件回调
    addth(id, data) {
      console.log(data)
      if (data.length) {
        let selectArr = []
        let list = data.map((item) => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productSource: item.productSource, // 产品来源 采购
            classAttribute: item.classAttribute,
            productsId: item.id, // 产品id
            productName: item.name, // 产品名称
            productCode: item.code, // 产品编码
            productDrawingNo: item.drawingNo, // 品名规格
            ratio: item.ratio, // 转换系数
            calculationDirection: item.calculationDirection, // 计算方向
            mainUnit: item.mainUnit, // 主单位
            purchaseQuantity: item.purchaseQuantity, // 数量
            price: item.price, // 含税单价
            totalAmount: item.totalAmount, // 金额(含税)
            taxRate: item.taxRate, // 税率
            excludingTaxPrice: item.excludingTaxPrice, // 不含税单价
            taxAmount: item.taxAmount, // 税额
            excludingTaxAmount: item.excludingTaxAmount, // 金额(不含税)
            deputyUnit: item.deputyUnit, // 副单位
            planQuantity: '', //计划数量主
            planQuantity2: '', //计划数量副
            remark: item.remark,
            deliveryDate: '' // 交期
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = []
          selectArr = selectArr.filter((item1) => {
            const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
            if (index !== -1) {
              deletedArray.push(item1.productName)
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false
            }
            return true
          })
          console.log(data, '删除后的数据')
          console.log(deletedArray, '被删掉的数据')
        }
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]
        // 审批
        // this.$nextTick(() => { this.getApproverData() })
      }
    },

    getWarehouseList() {
      let obj = {
        type: 'virtually',
        category: "warehouse",
      }
      getWarehouseList(obj).then(res => {
        this.warehouseIdList = res.data
      })
    },
    //发货数量不能为0
    calcValidatenum() {
      return (rule, value, callback) => {
        let msg = `收货数量不能为'0'`
        if (value == 0) {
          callback(new Error(msg)), this.$message.error(msg)
        }
      }
    },
    //数量验证
    // list 中 a 不能 operator b 的校验规则
    calcValidate() {
      return (rule, value, callback) => {
        let index = Number(rule.field.match(/\d+/)[0])
        let msg = this.dataForm.exchangeGoodsFlag ? `换货数量超过最大可换货数量` : `收货数量超过最大可收货数量`
        if (!value || value == 0) {
          callback()
        } else {
          let flag = false
          let list = this.dataFormTwo.productData
          let num_1 = Number(list[index].receivedQuantity)
          let num_2 = Number(list[index].waitReceiptNum)

          if (!(num_1 <= num_2)) {
            flag = true
          }
          if (flag) {
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },

    dateFormat(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      const time = y + '-' + m + '-' + d
      return time
    },
    // handleChange($event) {
    //   this.dataForm.country = ''

    //   this.countryList = []
    //   let obj = {
    //     "keyword": "",
    //     "orderItems": [
    //       {
    //         "asc": true,
    //         "column": ""
    //       }
    //     ],
    //     "pageNum": 1,
    //     "pageSize": -1
    //   }
    //   getCounryData(obj).then(res => {
    //     this.countryList = res.data.records
    //   })
    // },
    // 根据选择的省份获取相应的城市数据
    changeProvince(item, row) {
      this.dataForm.city = ''
      this.dataForm.area = ''
      getProvinceList(item.id).then((res) => {
        // this.changeCity()
        this.cities = res.data.list
      })
    },
    // 根据选择的城市获取各区的数据
    changeCity(item, row) {
      if (row) {
        row.area = ''
      } else {
        this.dataForm.area = ''
      }
      getProvinceList(item.id).then((res) => {
        this.areas = res.data.list
      })
    },
    // 获取省份数据
    getProvinceList() {
      getProvinceList(this.nodeId, this.listQuery)
        .then((res) => {
          this.provinces = res.data.list
          this.init(id, parentId)
        })
        .catch(() => {
          this.listLoading = false
          this.btnLoading = false
          this.refreshTable = true
        })
    },
    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i]
        const index = this.dataFormTwo.productData.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.productData.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.selectRows = [] // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      if (this.btnType == 'qrsh') {
        if (this.dataFormTwo.productData.length > 1) {
          this.dataFormTwo.productData.splice(data.$index, 1)
        } else {
          this.$message({
            message: '已是最后一条数据',
            type: 'error',
            duration: 1500
          })
        }
      } else {
        this.dataFormTwo.productData.splice(data.$index, 1)
      }
    },
    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct() {
      this.productVisible = false
    },

    // 重置客户产品搜索条件
    resetcusProduct() {
      this.productForm = {
        //   drawingNo: "",
        productCode: '',
        productName: '',
        partnerId: '',
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
        pageSize: 20
      }
    },
    // 搜索客户产品
    searchcusProduct() {
      this.productForm.pageNum = 1
      this.getcooperativeProduct()
    },
    // 获取客户产品数据
    getcooperativeProduct() {
      this.productForm.partnerId = this.dataForm.cooperativePartnerId
      getcooperativeProduct(this.productForm).then((res) => {
        this.cusProductData = res.data.records
      })
    },

    // 选择产品——搜索
    searchProductFun() {
      if (this.deliveryDateArr.length) {
        this.orderForm.deliveryStartTime = this.deliveryDateArr[0]
        this.orderForm.deliveryEndTime = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartTime = ''
        this.orderForm.deliveryEndTime = ''
      }
      this.orderForm.cooperativePartnerId = this.dataForm.cooperativePartnerId
      detailpurchaseOrderList(this.orderForm)
        .then((res) => {

          this.productList = res.data.records
          this.productTotal = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 选择产品——重置
    resetProductFun() {
      this.deliveryDateArr = []
      this.orderForm = {
        cooperativePartnerId: this.dataForm.cooperativePartnerId,
        customerProductDrawingNo: '',
        returnQueryFlag: 1,
        drawingNo: '', // customerProductNo: "",
        deliveryStartTime: '',
        deliveryEndTime: '',

        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 't1.create_time'
          }
        ]
      }
      this.searchProductFun()
    },
    // 点击选择产品
    openSeleceProductDialog() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error('请先选择供应商')
      this.productVisible = true
      this.searchProductFun()
    },
    submitAllProduct() {
      if (!this.selectArr.length) return this.$message.error('请选择产品！')
      this.productVisible = false
      this.selectArr.forEach((item) => {

        this.$set(item, 'receivedQuantity', item.waitReceiptNum)
        this.dataFormTwo.productData.push(item)
      })
      let uniqueArr = []
      let idSet = new Set()

      this.dataFormTwo.productData.forEach((item) => {
        if (!idSet.has(item.id)) {
          uniqueArr.push(item)
          idSet.add(item.id)
        }
      })
      this.dataFormTwo.productData = uniqueArr

    },
    // },
    // 获取所有订单列表数据
    initData2() {
      this.ProductListRequestObj.cooperativePartnerCode = this.code ? this.code : this.dataForm.partnerCode
      this.listLoading = true
      getsaleOrderList(this.ProductListRequestObj).then((listRes) => {
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
        this.ProductListRequestObj.orderStartDate = ''
        this.ProductListRequestObj.orderEndDate = ''
      }
      this.initData2()
    },
    // 监听主数量输入
    watchnums(row, index) {
      if (!row.receivedQuantity) {
        return
      }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '')

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = ''
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1)
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0 // 小数点的数量
        let result = '' // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i]
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char
              dotCount++
            }
          } else {
            result += char
          }
        }
        row.receivedQuantity = result
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8)
        }
      }
      if (!row.receivedQuantity) {
        return
      }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '')

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = ''
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1)
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0 // 小数点的数量
        let result = '' // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i]
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char
              dotCount++
            }
          } else {
            result += char
          }
        }
        row.receivedQuantity = result
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8)
        }
      }
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.orderDateArr = []
      this.ProductListRequestObj = {
        // neOrderState: 'finish',
        orderNo: '',
        cooperativePartnerName: '',
        orderType: '',
        salesName: '',
        workOrderNo: '',
        sourceOrderNo: '',
        orderStartDate: '',
        orderEndDate: '',
        contractNo: '',
        deliveryStartDate: '',
        deliveryEndDate: '',
        distributeStatus: 'distributed',
        // orderCategory: "assembly",
        shipmentStatus: '',
        orderState: '',
        productionStatus: '',
        documentStatus: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ]
      }
      this.searchAllProduct()
    },
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },
    // 获取产品列表字段 编排属性
    getAttributeline() {
      getAttributeline('product').then((res) => {
        this.attributeLines = res.data
      })
    },

    // 选完所属外协，带出所属部门
    hangleSelectSales(e, r) {
      this.dataForm.departmentId = r.parentId
      this.dataForm.departmentName = r.organize
    },
    handleClose() {
      this.form = {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      }
      this.initData()
    },
    // 选择客户
    seleceCustomer(e) {
      getCooperativeInfo(e.id).then((res) => {
        if (this.dataForm.cooperativePartnerId && res.msg == 'Success') {
          this.$confirm('已选择过客户，是否切换，切换后将清空订单和产品信息，是否继续！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: '切换成功'
              })
              // this.dataForm = {
              //   exchangeGoodsFlag: false,
              //   // orderCategory: "assembly",
              //   returnDeliveryType: 'back',
              //   notificationType: 'procure',
              //   logisticsCompany: '',
              //   ordersId: '',
              //   deliverDate: '',
              //   logisticsNumber: '',
              //   cooperativePartnerId: '',
              //   remark: '',
              //   orderNo: this.codeConfig.number
              // }
              this.dataFormTwo.productData = []
              this.customerData = e
              this.dataForm.cooperativePartnerId = e.id
              this.ProductListRequestObj.cooperativePartnerCode = e.code
              this.code = e.code
              this.dataForm.partnerName = e.name
              this.dataForm.code = e.code
              this.customerVisible = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
              this.customerVisible = true
            })
        } else {
          // this.$nextTick(() => { this.$refs['dataForm'].validateField('cooperativePartnerId') })
          // this.dataForm = {
          //   exchangeGoodsFlag: false,
          //   // orderCategory: "assembly",
          //   returnDeliveryType: 'back',
          //   notificationType: 'external',
          //   logisticsCompany: '',
          //   ordersId: '',
          //   orderNo: this.codeConfig.number,
          //   deliverDate: '',
          //   logisticsNumber: '',
          //   cooperativePartnerId: '',
          //   remark: ''
          // }
          this.dataFormTwo.productData = []
          this.customerData = e
          this.dataForm.cooperativePartnerId = e.id
          this.ProductListRequestObj.cooperativePartnerCode = e.code
          this.code = e.code
          this.dataForm.partnerName = e.name
          this.dataForm.code = e.code
          this.customerVisible = false
        }
      })
    },

    search() {
      this.form.pageNum = 1
      this.initData()
    },
    reset() {
      this.form = {
        code: '',
        taxId: '',
        name: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      }
      this.getcategoryTree()
    },
    initData() {
      this.listLoading = true
      getCooperativeData(this.form)
        .then((res) => {
          this.tableDataCustomer = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map((o) => o.id)
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
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map((o) => o.id)
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


    // 切换table
    handleClick(tab, event) { },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
        this.$set(this.dataForm, 'orderNo', data.number)

      } catch (error) { }
    },
    init(id, btnType) {

      this.dataForm.id = id || ''

      this.btnType = btnType
      if (this.dataForm.id) {
        getpurPurchaseReceiptReturnGoodsdetail(this.dataForm.id).then((res) => {
          this.dataForm = res.data.notice
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push({
                name: item.document.fullName,
                fileSize: item.document.fileSize,
                filename: item.document.filePath,
                id: item.document.id,
                url: item.url
              })
            })
          }
          if (this.btnType == 'copy') {
            this.dataForm.inspectionStatus = ''
            this.dataForm.id = ''
            this.dataForm.deliverDate = ''
            this.datafilelist = []
            this.dataForm.approvalStatus = ''
            this.dataForm.packingStatus = 'unboxed'
            // getOrderDetail(res.data.notice.ordersId).then(res1 => {
            //   res1.data.orderLines.map((item) => {
            //     res.data.lines.map((item1) => {
            //       if (item.productsId == item1.productId) {
            //         item1.outboundQuantity = item.outboundQuantity
            //         item1.returnQuantity = item.returnQuantity
            //         item1.deliveryQuantity = ''

            //       }
            //     })
            //   })

            // })
            res.data.noticeLineList.forEach((item) => {
              item.receivedQuantity = ''
            })
            this.dataFormTwo.productData = res.data.noticeLineList
          } else if (this.btnType == 'edit') {
            this.dataFormTwo.productData = res.data.noticeLineList
            this.dataFormTwo.productData.forEach((item) => {
              item.drawingNo = item.productDrawingNo
            })
          } else {
            this.dataFormTwo.productData = res.data.noticeLineList
            this.dataFormTwo.productData.forEach((item) => {
              item.drawingNo = item.productDrawingNo
            })
          }
        })



      }
      if (btnType == 'add' || btnType == 'copy') {

        this.dataForm.salesman = this.userInfo.userName
        this.formLoading = true
        setTimeout(() => {
          this.formLoading = false
          this.fetchData('CPWXSH')
        }, 500)
      }
      if (this.btnType == 'edit') {
        this.btnText = '继续修改'
      } else if (this.btnType == 'add' || this.btnType == 'copy') {
        this.btnText = '继续新增'
      }
    },
    goBack() {
      this.$emit('close', true)
    },
    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.dataFormTwo.productData = []
      this.dataForm = {
        exchangeGoodsFlag: false,
        inspectionStatus: '',
        // orderCategory: "assembly",
        // returnDeliveryType: 'back',
        // notificationType: 'external',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        partnerName: '',
        orderNo: '',
        logisticsNumber: '',
        //   phone: '',
        //   country: '',
        //   province: '',
        //   city: '',
        //   area: '',
        //   address: '',
        //   delivery: '',
        //   shipperId: '',
        cooperativePartnerId: '',
        remark: ''
      }
      this.$refs.dataForm.resetFields()
      this.init('', 'add')
      this.tipsvisible = false
      this.btnLoading = false
    },
    handleConfirm(value) {
      this.$refs['productForm'].validate((valid) => {
        if (!valid) {
          return
        }
      })
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value

        if (valid) {
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
          this.dataForm.classAttribute = 'finish_product'
          this.dataForm.receiptReturnType = 'receipt'
          let obj = {
            attachmentList: this.datafilelist,
            returnGoods: this.dataForm,
            lines: []
          }
          if (!this.dataFormTwo.productData.length) {
            this.$message({
              message: '请选择产品',
              type: 'error',
              duration: 1500
            })
            return
          }
          this.dataFormTwo.productData.forEach((item, index) => {

            if (!item.receivedQuantity) {
              this.iszhi = true
              this.$message({
                message: this.dataForm.exchangeGoodsFlag
                  ? `第${index + 1}行换货数量不能为空`
                  : `第${index + 1}行收货数量不能为空`,
                type: 'error',
                duration: 1500
              })
            } else if (
              item.outboundQuantity &&
              item.receivedQuantity * 1 > item.outboundQuantity * 1 - item.returnQuantity * 1
            ) {
              this.iszhi = true
              this.$message({
                message: this.dataForm.exchangeGoodsFlag ? `换货数量超过最大可换货数量` : `收货数量超过最大可收货数量`,
                type: 'error',
                duration: 1500
              })
            } else if (item.receivedQuantity == 0) {
              this.iszhi = true
              this.$message({
                message: this.dataForm.exchangeGoodsFlag
                  ? `第${index + 1}行换货数量不能为'0'`
                  : `第${index + 1}行收货数量不能为'0'`,
                type: 'error',
                duration: 1500
              })
            }
          })
          if (this.iszhi) {
            this.iszhi = false
            return
          }
          this.dataFormTwo.productData.forEach((item, index) => {
            let dep = {
              accuracyLevel: item.accuracyLevel,
              billStatus: item.billStatus,
              calculationDirection: item.calculationDirection,
              clearance: item.clearance,
              customColumn: item.customColumn,
              deputyUnit: item.deputyUnit,
              // id: 0,
              notificationType: 'external',
              inspectionResults: item.inspectionResults,
              mainUnit: item.mainUnit,
              // notificationType: item.notificationType,
              oil: item.oil,
              oilQuantity: item.oilQuantity,
              ordersLineId: item.ordersLineId,
              packagingMethod: item.packagingMethod,
              packingQuantity: item.packingQuantity,
              processId: item.processId,
              productsId: item.productsId ? item.productsId : '',
              purchaseOrderId: item.purchaseOrderId,
              purchaseQuantity: item.purchaseQuantity,
              purchaseReceiptReturnGoodsId: item.purchaseReceiptReturnGoodsId,
              qualifiedQuantity: item.qualifiedQuantity,
              ratio: item.ratio,
              waitReceiptNum: item.waitReceiptNum,
              receivedQuantity: item.receivedQuantity,
              receivingStatus: item.receivingStatus,
              remark: item.remark,
              sealingCoverTyping: item.sealingCoverTyping,
              standardValue: item.standardValue,
              unqualifiedQuantity: item.unqualifiedQuantity,
              vibrationLevel: item.vibrationLevel,
              warehouseId: item.warehouseId,
              ordersId: item.ordersId,
              classAttribute: 'finish_product',
              id: item.id ? item.id : '',
              // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
              ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
              // pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
              ratio: item.ratio ? item.ratio : '',
              receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
              remark: item.remark ? item.remark : '',
              purchaseReceiptReturnGoodsId: this.dataForm.id ? this.dataForm.id : '',
              receivingQuantity: item.receivingQuantity ? item.receivingQuantity : ''
            }
            let dep1 = {
              billStatus: item.billStatus ? item.billStatus : '',
              calculationDirection: item.calculationDirection ? item.calculationDirection : '',
              receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
              deputyUnit: item.deputyUnit ? item.deputyUnit : '',
              mainUnit: item.mainUnit ? item.mainUnit : '',
              ordersId: item.ordersId,
              notificationType: 'external',
              classAttribute: 'finish_product',
              id: item.id ? item.id : '',
              purchaseQuantity: item.purchaseQuantity,
              productsId: item.productsId ? item.productsId : '',
              waitReceiptNum: item.waitReceiptNum ? item.waitReceiptNum : '',
              // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
              ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
              pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
              ratio: item.ratio ? item.ratio : '',
              receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
              remark: item.remark ? item.remark : '',
              purchaseReceiptReturnGoodsId: this.dataForm.id ? this.dataForm.id : '',
              receivingQuantity: item.receivingQuantity ? item.receivingQuantity : ''
            }
            if (this.btnType == 'add' || this.btnType == 'copy') {
              obj.lines.push(dep)
            } else {
              obj.lines.push(dep1)
            }
          })
          this.btnLoading = true
          let formMethod = null

          if (this.btnType == 'edit') {
            formMethod = editpurPurchaseReceiptReturnGoods
          } else if (this.btnType == 'add' || this.btnType == 'copy') {
            // obj.notice.deliveryStatus = 'not_returned'
            formMethod = addpurPurchaseReceiptReturnGoods
          }
          formMethod(obj)
            .then((res) => {
              // let msg = "";
              // if (formMethod == addpurPurchaseReceiptReturnGoods) {
              //   msg = "新建成功"
              // } else if (value == 'draft') {
              //   msg = "保存成功"
              // } else if (value == 'submit') {
              //   msg = '提交成功'
              // }
              if (value == 'draft') {
                this.submitmethodsTitle = '保存成功'
              } else if (value == 'submit') {
                this.submitmethodsTitle = '提交成功'
              }
              this.tipsvisible = true
              // this.$message({
              //   message: msg,
              //   type: 'success',
              //   duration: 1500,
              //   onClose: () => {
              //     this.visible = false
              //     this.btnLoading = false
              //     this.$emit('close', true)
              //   }
              // })
            })
            .catch(() => {
              this.btnLoading = false
            })
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
  padding: 0px;
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

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
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
  padding-bottom: 0px;
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

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important;
}
</style>
