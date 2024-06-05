<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack"
            :content="type == 'add' ? '新建工序外协发料通知单' : type == 'edit' ? '编辑工序外协发料通知单' : type == 'copy' ? '新建工序外协发料通知单' : '查看工序外协发料通知单'" />
          <div class="options" v-if="type != 'look'">
            <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿</el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>基本信息</h5>
              </div>
              <el-row :gutter="30" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :span="6" v-if="type === 'look'">
                    <el-form-item label="通知单号" prop="orderNo" ref="orderNo">
                      <el-input type="text" v-model="dataForm.orderNo" placeholder="通知单号"
                        :disabled="type != 'add' ? true : false">
                      </el-input>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="外协订单" prop="ordersNo" ref="ordersNo">
                      <el-input v-model="dataForm.ordersNo" placeholder="请选择外协订单" readonly @focus="openOrderDialog"
                        :disabled="type != 'add' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="外协供应商" prop="partnerName" ref="partnerName">
                      <!-- <el-input :disabled="type != 'add' ? true : false" v-model="dataForm.partnerName"
                        placeholder="请选择外协供应商名称" @focus="openDialog">
                      </el-input> -->
                      <ComSelect-page :isdisabled="true" :treeNodeClick="treeNodeClick"
                        v-model="dataForm.partnerName" :beforeSubmit="beforeSubmit" ref="ComSelect-page"
                        @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择外协供应商'" title="选择外协供应商"
                        treeTitle="外协供应商分类" :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                        :listRequestObj="PartnerListRequestObj" :paramsObj="{ oldData }"
                        :searchList="PartnerTableSearchList" />
                    </el-form-item>
                  </el-col>

                  

                  <!-- <el-col :sm="6" :xs="24">
                    <el-form-item label="发货人" prop="shipperId">
                      <user-select @change="changeshipperId" v-model="dataForm.shipperId" placeholder="请选择发货人" clearable
                        style="width: 100%;" :disabled="type == 'look'">
                      </user-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="发货方式" prop="delivery">
                      <el-select v-model="dataForm.delivery" placeholder="请选择发货方式" clearable style="width: 100%;"
                        :disabled="type == 'look'">
                        <el-option v-for="(item, index) in orderListfhfs" :key="index" :label="item.label"
                          @click.native="changeDelivery(item.value)" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="发货日期" prop="deliverDate">
                      <el-date-picker clearable v-model="dataForm.deliverDate" placeholder="请选择发货日期" type="date"
                        :disabled="type == 'look'" value-format="yyyy-MM-dd" style="width: 100%;">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收件人" prop="recipient">
                      <el-input clearable v-model="dataForm.recipient" placeholder="请输入收件人" :disabled="type == 'look'"
                        maxlength="20" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收件人电话" prop="phone">
                      <el-input clearable v-model="dataForm.phone" placeholder="请输入电话" maxlength="20"
                        :disabled="type == 'look'" />
                    </el-form-item>
                  </el-col>




                  <!-- <el-col :sm="6" :xs="24" v-if="type === 'look'">
                    <el-form-item label="提交时间" prop="submitDate" ref="submitDate">
                      <el-time-select style="width: 100%;" :disabled="type == 'look' ? true : false"
                        v-model="dataForm.submitDate" placeholder="提交时间">
                      </el-time-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :sm="6" :xs="24" v-if="type === 'look'">
                    <el-form-item label="创建时间" prop="createTime" ref="createTime">
                      <el-input type="text" v-model="dataForm.createTime" placeholder="创建时间" maxlength="20"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="type === 'look'">
                    <el-form-item label="创建人" prop="createByName" ref="createByName">
                      <el-input type="text" v-model="dataForm.createByName" placeholder="请输入创建人" maxlength="20"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="6" :xs="24" v-if="type === 'look'">
                    <el-form-item label="发料状态" prop="deliveryStatus" ref="deliveryStatus">
                      <el-input type="text" v-model="dataForm.deliveryStatus === 'undelivered' ? '未完成' : '已完成'"
                        placeholder="发料状态" :disabled="type != 'add' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="type === 'look'">
                    <el-form-item label="发料完成时间" prop="deliveryCompletionDate" ref="deliveryCompletionDate">
                      <el-time-select style="width: 100%;" :disabled="type == 'look' ? true : false"
                        v-model="dataForm.deliveryCompletionDate" placeholder="发料完成时间">
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="type === 'look'">
                    <el-form-item label="检验状态" prop="inspectionStatus" ref="inspectionStatus">
                      <el-input type="text" v-model="dataForm.inspectionStatus === 'unInspect' ? '待检验' : dataForm.inspectionStatus === 'inspecting' ? '检验中' : '已检验'"
                        placeholder="检验状态" :disabled="type != 'add' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="6" :xs="24" v-if="type === 'look'">
                    <el-form-item label="单据状态" prop="documentStatus" ref="documentStatus">
                      <el-input type="text" v-model="dataForm.documentStatus === 'draft' ? '草稿' : '提交'" placeholder="单据状态"
                        :disabled="type != 'add' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="6" :xs="24" v-if="type === 'look'">
                    <el-form-item label="审批状态" prop="approvalStatus" ref="approvalStatus">
                      <el-input type="text"
                        v-model="dataForm.approvalStatus === 'ok' ? '审批通过' : dataForm.approvalStatus === 'ing' ? '审批中' : '审批拒绝'"
                        placeholder="审批状态" :disabled="type != 'add' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col> -->



                  <!-- <el-col :sm="24" :xs="24" v-if="type === 'look'">
                    <el-form-item label="驳回理由" prop="reasonRejection" ref="reasonRejection">
                      <el-input type="textarea" :rows="3" v-model="dataForm.reasonRejection" placeholder="请输入驳回理由"
                        maxlength="200" :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col> -->

                  <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark" ref="remark">
                      <el-input type="textarea" :rows="3" v-model="dataForm.remark" :placeholder="type == 'look' ? '' : '请输入备注'" maxlength="200"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收货地址" prop="address">
                      <template slot="label" v-if="type !== 'look'">
                        <span>收货地址</span>
                        <span>>></span>
                        <el-button :disabled="type == 'look'" type="text" @click="changeAddress">更换收货地址</el-button>
                      </template>
                      <el-input v-model="defaultAddress" readonly :disabled="type == 'look'" type="textarea"
                        maxlength="50" :rows="3" />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table">
                  <!-- <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" /> -->
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

                  <el-table-column prop="productCode" label="产品编码" min-width="200" fixed="left" show-overflow-tooltip>

                    <template slot-scope="scope">
                      <el-form-item prop="productCode">
                        <!-- <el-input :title="scope.row.productCode" v-model="scope.row.productCode"
                              :disabled="type != 'add'" readonly maxlength="20" placeholder="产品编码">{{
                                scope.row.productCode }}
                            </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.productCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productName" label="产品名称" min-width="200" fixed="left" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="productName">
                        <!-- <el-input :title="scope.row.productName" v-model="scope.row.productName" :disabled="type != 'add'"
                          readonly maxlength="20" placeholder="产品名称">{{
                            scope.row.productName }}
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.productName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productDrawingNo" label="产品图号" min-width="200" fixed="left"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="productDrawingNo">
                        <div class="viewData">
                          <span>{{ scope.row.productDrawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="routingName" label="工艺路线名称" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'routingName'">

                        <div class="viewData">
                          <span>{{ scope.row.routingName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processName" label="工序名称" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'processName'">

                        <div class="viewData">
                          <span>{{ scope.row.processName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="ordersNum" label="订单发料数量" min-width="180" v-if="type != 'look'">

                    <template slot-scope="scope">
                      <el-form-item prop="ordersNum">
                        <!-- <el-input v-model="scope.row.ordersNum"
                          @input="changePlanQuantity(scope.$index, scope.row.ordersNum)" readonly
                          :disabled="type != 'add'" maxlength="20" placeholder="请输入采购数量">{{
                            scope.row.ordersNum }}
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.ordersNum }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="outboundQuantity" label="已出库数量" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item prop="outboundQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.outboundQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column v-if="type != 'look'" prop="undeliveredQuantity" label="待出库数量" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item prop="undeliveredQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.undeliveredQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="deliveryQuantity" label="发料数量" min-width="180">
                    <template slot="header">
                      <span class="required">*</span>发料数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryQuantity'"
                        :rules='productRules.deliveryQuantity'>
                        <el-input v-model="scope.row.deliveryQuantity" :disabled="type === 'look'" maxlength="20"
                          placeholder="请输入发料数量">{{
                            scope.row.deliveryQuantity }}
                        </el-input>

                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="mainUnit" label="单位(主)" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="mainUnit">
                        <!-- <el-input v-model="scope.row.mainUnit" :disabled="type != 'add'" readonly maxlength="20"
                          placeholder="请输入主单位">{{
                            scope.row.mainUnit }}
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
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


                  <el-table-column label="操作" width="180" fixed="right"
                    v-if="dataFormTwo.data.length > 1 && type !== 'look'">
                    <template slot-scope="scope">
                      <el-button v-if="type != 'look'" type="text" class="JNPF-table-delBtn"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>

                    </template>
                  </el-table-column>
                </el-table>
              </el-form>



            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
    <OrderDialog v-if="orderVisibled" ref="orderRef" @changeOrder="changeOrder"></OrderDialog>
    <changeAddress v-if="addressVisibled" ref="addressRef" @getChangeAddress="getChangeAddress"></changeAddress>
  </div>
</template>
<script>


import { purProcurementDemandPoolexternal, outPoolexternal, addoutReceiptGoods, getpurPurchaseReceiptReturnGoodsdetail, updateoutReceiptGoods, detailpurPurchaseReceiptReturnGoods } from '@/api/purchasingManagement/purchaseInquirySheet'  // 询价单

import { getQuotationsendlist, editReceiptnoticelist } from "@/api/salesManagement/index";

import { insertPurchaseOrder, purPurchaseOrderdetail } from '@/api/purchasingAndOutsourcingOrders/index'
import { getCounryData, getCooperativeInfo, getcategoryTree, getCooperativeData } from '@/api/basicData/index'
import { getProvinceList, } from '@/api/system/province'
import OrderDialog from './order-dialog.vue'
import formValidate from "@/utils/formValidate";
import changeAddress from "./changeAddress.vue"
export default {
  components: {
    OrderDialog,
    changeAddress
  },
  data() {
    return {
      datafilelist: [],
      getcategoryTree,
      getCooperativeData,
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'outsourcing_suppliers', } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '外协供应商编码', fixed: 'left' },
        { prop: 'name', label: '外协供应商名称', fixed: 'left' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' },
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: "code", label: "外协供应商编码", type: 'input' },
        { prop: "name", label: "外协供应商名称", type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: 'outsourcing_suppliers',
      },
      sourceVisibled: false,
      orderVisibled: false,
      addressVisibled: false,
      activeName: 'jcInfo',
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      countryList: [],
      nodeId: -1,
      dataForm: {
        cooperativePartnerCode: "",
        approvalCompletionDate: "",       // 审批完成时间
        approvalStatus: "",               // 审批状态
        documentStatus: "",               // 单据状态
        partnerName: '',
        cooperativePartnerId: '',
        ordersNo: "",                      //外协单号
        ordersId: '',
        shipperId: '',                     // 发货人
        delivery: '',                      // 发货方式
        recipient: '',                    // 收件人
        phone: '',                        // 收件人电话
        country: '',                      // 国家
        province: '',                     // 省
        city: '',                         // 市
        area: '',                         // 区
        address: '',                      // 地址
        returnDeliveryType: 'delivery',
        deliveryStatus: 'undelivered',
        reasonRejection: "",              //驳回理由
        submitDate: "",                  //提交时间
        deliveryCompletionDate: "",       //	发货完成时间
        id: 0,
        deliverDate: '',                  // 发货日期
        notifyType: "external_process",             //	通知单类型 外协通知 external、销售通知 sale,可用值:external,sale           

        remark: "",

      },
      cooperativePartnerCode: '',
      provinces: [],
      cities: [],
      area: [],
      defaultAddress: '',                //默认地址
      // 发货方式
      orderListfhfs: [
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" }
      ],
      orderNoId: '',
      type: "",
      dataFormArr: [],
      rules: {
        // salesman: [
        //   { required: true, message: '请输入业务员', trigger: ['blur'] },
        //   { validator: formValidate('fullName'), trigger: 'blur' },
        // ],
        partnerName: [
          { required: true, message: '请选择外协供应商', trigger: 'change' }
        ],
        ordersNo: [{ required: true, message: '请选择外协订单', trigger: ['change'] }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }, { validator: this.formValidate('iphone'), trigger: 'blur' },],
        deliverDate: [{ required: true, message: '请选择发货日期', trigger: ['change'] }],
        delivery: [{ required: true, message: '请选择发货方式', trigger: 'change' }],
        shipperId: [{ required: true, message: '请选择发货人', trigger: 'change' }],
        address: [{ required: true, message: '请选择收货地址', trigger: 'change' }],
        recipient: [
          { required: true, message: '请输入收件人名称', trigger: 'blur' },
          { validator: this.formValidate('fullName'), trigger: 'blur' },
        ],
      },
      productRules: {

        deliveryQuantity: [{ required: true, trigger: ['blur'] },
        { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('发料数量：' + errMsg) }] }), trigger: 'blur' },

        { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('发料数量：不能为0') }), trigger: 'blur' }
        ],
      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      countryShow: true,
      oldData: [],
    }
  },
  created() {
    // this.getProvinceList()
    // this.getCounryDatas()
  },
  methods: {
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 切换供应商后给的提示
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (paramsObj.oldData.length) {
        flag = await this.$confirm('已选择过外协供应商，是否切换，切换后会清空外协供应商信息是否继续!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '更换成功!'
          });
          this.dataForm.ordersId = ''
          this.dataForm.ordersNo = ''
          this.dataFormTwo.data = []
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
    // 供应商传递数据
    supplierdata(id, data) {
      console.log(data, '供应商数据');
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('partnerName')
      })
      if (data.length === 0) {
      } else {
        if (this.oldData.length) {
          console.log(this.oldData, '上一次数据');
          // 更换供应商编码 联动外协订单数据 以及产品明细
          // this.cooperativePartnerCode = this.oldData[0].code

        } else {
          this.oldData.push(data)
        }
        this.$refs['elForm'].fields[0].resetField()
        this.dataForm.partnerName = data[0].name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].id

      }
      getCooperativeInfo(data[0].id).then(res => {
        console.log("客户信息", res);
        let addressInfo = {}
        if (res.data.cooperativePartner.modeTransport) {

          if (res.data.cooperativePartner.modeTransport == "SH") {
            this.dataForm.delivery = "deliver_goods"
          }
          if (res.data.cooperativePartner.modeTransport == "ZT") {
            this.dataForm.delivery = "self_pickup"
          }

          if (res.data.cooperativePartner.modeTransport == "KD") {
            this.dataForm.delivery = "express_delivery"
          }
          if (res.data.cooperativePartner.modeTransport == "HY") {
            this.dataForm.delivery = "freight_transport"
          }
          if (res.data.cooperativePartner.modeTransport == "DF") {
            this.dataForm.delivery = "collect_payment"
          }
        }
        if (res.data.deliveryAddressList.length > 0) {
          res.data.deliveryAddressList.forEach((item, index) => {
            if (item.defaultFlag) {
              addressInfo = item
              console.log("addressInfo", addressInfo);
              this.dataForm.recipient = addressInfo.recipient
              this.dataForm.phone = addressInfo.phone
              this.dataForm.country = addressInfo.country === '中国' ? 'CN' : addressInfo.country
              if (this.dataForm.country === 'CN') {

                this.dataForm.province = addressInfo.province
                this.dataForm.city = addressInfo.city
                this.dataForm.area = addressInfo.area
                this.dataForm.address = addressInfo.address
                this.defaultAddress = addressInfo.countryText + addressInfo.provinceText + addressInfo.cityText + addressInfo.areaText + addressInfo.address
              } else {
                this.dataForm.province = ''
                this.dataForm.city = ''
                this.dataForm.area = ''
                this.defaultAddress = (addressInfo.countryText ? addressInfo.countryText : '') + addressInfo.address
              }
            } else {
              this.dataForm.recipient = res.data.deliveryAddressList[0].recipient
              this.dataForm.phone = res.data.deliveryAddressList[0].phone
              this.dataForm.country = res.data.deliveryAddressList[0].country === '中国' ? 'CN' : res.data.deliveryAddressList[0].country
              if (this.dataForm.country === 'CN') {

                this.dataForm.province = res.data.deliveryAddressList[0].province
                this.dataForm.city = res.data.deliveryAddressList[0].city
                this.dataForm.area = res.data.deliveryAddressList[0].area
                this.dataForm.address = res.data.deliveryAddressList[0].address
                this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].provinceText + res.data.deliveryAddressList[0].cityText + res.data.deliveryAddressList[0].areaText + res.data.deliveryAddressList[0].address
              } else {
                this.dataForm.province = ''
                this.dataForm.city = ''
                this.dataForm.area = ''
                this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].address
              }
            }
          });
        } else {
          this.dataForm.recipient = ""
          this.dataForm.phone = ""
          this.dataForm.country = ""
          this.dataForm.province = ""
          this.dataForm.city = ""
          this.dataForm.area = ""
          this.dataForm.address = ""
          this.defaultAddress = ""
        }
      })
    },
    changeshipperId(val, data) {
      console.log(data);
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('shipperId')
      })
    },
    changeshipperId(val, data) {
      console.log(data);
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('shipperId')
      })
    },
    // 接收传递的地址
    getChangeAddress(data) {
      if (data) {
        console.log(data, '11111111');
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
    // 更换地址
    changeAddress() {
      this.addressVisibled = true
      if (!this.dataForm.cooperativePartnerId) {
        this.$message.error('请先选择外协供应商')
      } else {
        this.$nextTick(() => {
          this.$refs.addressRef.initData(this.dataForm.cooperativePartnerId)
        })
      }
    },
    changeDelivery(val) {
      if (val === 'self_pickup') {
        this.$nextTick(() => {
          this.$refs['elForm'].clearValidate()
        })
        this.dataForm.country = ''
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
        this.dataForm.address = ''
        this.defaultAddress = ''
        this.countryShow = false
      } else if (val === 'self_pickup' && this.dataForm.country != 'CN') {
        this.countryShow = false
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
        this.dataForm.address = ''
      } else {
        this.countryShow = true
      }
    },


    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      console.log(id, type);
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''

      // this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          getQuotationsendlist(this.dataForm.id).then(res => {
            console.log(res, '详情');
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
            this.dataForm = res.data.notice
            if (this.dataForm.country === 'CN') {
              this.countryShow = true
              this.defaultAddress = this.dataForm.region.countryName + this.dataForm.region.provinceName + this.dataForm.region.cityName + this.dataForm.region.areaName + this.dataForm.address
            }
            if (this.dataForm.country != 'CN') {
              this.defaultAddress = this.dataForm.region.countryName + this.dataForm.address
            }
            if (this.type === 'copy') {
              let _data = res.data.noticeLineList
              this.dataForm.approvalCompletionDate = ''
              this.dataForm.approvalStatus = ''
              this.dataForm.submitDate = ''
              this.dataForm.inspectionStatus = "inspected"
              this.dataForm.receivingStatus = "receiving"
              this.dataForm.packingStatus = "unboxed"
              this.dataForm.deliverDate = ""
              this.dataForm.deliveryCompletionDate = ''
              let linesData = []
              this.datafilelist = []
              outPoolexternal(this.dataForm.ordersId).then(res => {
                console.log(res, '通过外协id 拿到明细数据');
                linesData = res.data
                linesData.forEach(item => {
                  _data.forEach(item2 => {
                    item2.inspectionResults = ""
                    if (item.id === item2.ordersLineId) {
                      item2.outboundQuantity = item.issuedQuantity ? item.issuedQuantity : 0
                      item2.undeliveredQuantity = item.undeliveredQuantity ? item.undeliveredQuantity : 0
                      item2.ordersNum = item.demandQuantity ? item.demandQuantity : 0
                      item2.deliveryQuantity = Number(item.demandQuantity - item.issuedQuantity - item.undeliveredQuantity) > 0 ? Number(item.demandQuantity - item.issuedQuantity - item.undeliveredQuantity) : 0
                    }
                  })
                })
                this.dataFormTwo.data = _data
                console.log(this.dataFormTwo.data, '去订单的出入库数量');

              })
            } else if (this.type === 'edit') {
              console.log(this.dataForm.id);
              let linesData = []
              console.log(res.data.noticeLineList, '通过外协id 拿到明细数据');
              let _data = res.data.noticeLineList
              outPoolexternal(this.dataForm.ordersId).then(res => {
                console.log(res, '通过外协id 拿到明细数据');
                linesData = res.data
                linesData.forEach(item => {
                  _data.forEach(item2 => {
                    if (item.id === item2.ordersLineId) {
                      item2.outboundQuantity = item.issuedQuantity ? item.issuedQuantity : 0
                      item2.undeliveredQuantity = item.undeliveredQuantity ? item.undeliveredQuantity : 0
                      item2.ordersNum = item.demandQuantity ? item.demandQuantity : 0
                    }
                  })
                })
                this.dataFormTwo.data = _data
                console.log(this.dataFormTwo.data, '去订单的出入库数量');
                this.listLoading = false

              })
            } else {
              this.dataFormTwo.data = res.data.noticeLineList
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit(type) {
      this.request(type)
    },

    async request(type) {
      let _data
      let hasCostPrice = true
      this.btnLoading = true
      this.dataForm.documentStatus = type
      if (!this.dataFormTwo.data.length) {
        hasCostPrice = false
        this.btnLoading = false
        this.$message.error('至少有一条发料明细')
        return
      }
      let msg = ''
      if (this.dataForm.documentStatus === 'draft') {
        this.dataForm.inspectionStatus = "unInspect"
        msg = '保存成功'
      } else {
        msg = '提交成功'
      }
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      console.log(valid_2, '1111');
      if (hasCostPrice) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.data.length === 0) {
              this.btnLoading = false
              this.$message.error('请至少选择一项产品')
            } else {
              if (!valid_2) {
                console.log(1);
                this.btnLoading = false
                for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                  const item = this.dataFormTwo.data[i]

                  if (!item.deliveryQuantity) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的发料数量',
                      duration: 1500,
                    })
                    break
                  }

                }
                return
              } else {
                this.btnLoading = true
                let dataFormTwoData = []
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
                if (this.type === 'add' || this.type === 'copy') {
                  dataFormTwoData = this.dataFormTwo.data.map(item => {
                    return {
                      ...item,
                      ordersLineId: this.type === 'add' ? item.id : item.ordersLineId,
                      notifyType: "external_process",
                      ordersId: this.dataForm.ordersId,
                      id: null,
                      outboundQuantity: 0,
                      inspectionResults: 'qualified',
                      qualifiedQuantity: item.deliveryQuantity,
                    }
                  })
                  _data = {
                    attachmentList: this.datafilelist,
                    notice: this.dataForm,
                    noticeLineList: dataFormTwoData
                  }
                } else {
                  dataFormTwoData = this.dataFormTwo.data.map(item => {
                    return {
                      ...item,
                      outboundQuantity: 0,
                      qualifiedQuantity: item.deliveryQuantity,
                    }
                  })
                  _data = {
                    attachmentList: this.datafilelist,
                    notice: this.dataForm,
                    noticeLineList: dataFormTwoData
                  }
                }
                console.log(this.dataFormTwo.data, 'this.dataFormTwo.data');

                // return

                if (this.type === 'add' || this.type === 'copy') {
                  addoutReceiptGoods(_data).then(res => {
                    if (res.msg === 'Success') res.msg = '新建成功'
                    this.$message({
                      message: msg,
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
                  updateoutReceiptGoods(_data).then((res) => {
                    if (res.msg === 'Success') res.msg = '修改成功'
                    this.$message({
                      message: msg,
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
            }
          } else {
            this.btnLoading = false
          }

        })
      }
    },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 打开选择订单弹窗
    openOrderDialog() {
      this.orderVisibled = true
      // if (this.dataForm.partnerName === '') {
      //   this.$message({
      //     message: "请先选择外协供应商",
      //     type: 'error',
      //     duration: 1500,
      //   })
      // } else {
        this.$nextTick(() => {
          // console.log(this.dataForm.cooperativePartnerCode, '供应商编码');
          this.$refs.orderRef.initData2(this.dataForm.cooperativePartnerCode, this.dataFormTwo.data)
        })
      // }
    },
    changeOrder(data) {
      this.dataForm.ordersId = data[0].id
      this.dataForm.ordersNo = data[0].orderNo
      this.dataForm.partnerName = data[0].cooperativePartnerName
      this.dataForm.cooperativePartnerCode = data[0].cooperativePartnerCode
      this.dataForm.cooperativePartnerId = data[0].cooperativePartnerId
      getCooperativeInfo(data[0].cooperativePartnerId).then(res => {
        let addressInfo = {}
        if (res.data.cooperativePartner.modeTransport) {

          if (res.data.cooperativePartner.modeTransport == "SH") {
            this.dataForm.delivery = "deliver_goods"
          }
          if (res.data.cooperativePartner.modeTransport == "ZT") {
            this.dataForm.delivery = "self_pickup"
          }

          if (res.data.cooperativePartner.modeTransport == "KD") {
            this.dataForm.delivery = "express_delivery"
          }
          if (res.data.cooperativePartner.modeTransport == "HY") {
            this.dataForm.delivery = "freight_transport"
          }
          if (res.data.cooperativePartner.modeTransport == "DF") {
            this.dataForm.delivery = "collect_payment"
          }
        }
        if (res.data.deliveryAddressList.length > 0) {
          res.data.deliveryAddressList.forEach((item, index) => {
            if (item.defaultFlag) {
              addressInfo = item
              this.dataForm.recipient = addressInfo.recipient
              this.dataForm.phone = addressInfo.phone
              this.dataForm.country = addressInfo.country === '中国' ? 'CN' : addressInfo.country
              if (this.dataForm.country === 'CN') {

                this.dataForm.province = addressInfo.province
                this.dataForm.city = addressInfo.city
                this.dataForm.area = addressInfo.area
                this.dataForm.address = addressInfo.address
                this.defaultAddress = addressInfo.countryText + addressInfo.provinceText + addressInfo.cityText + addressInfo.areaText + addressInfo.address
              } else {
                this.dataForm.province = ''
                this.dataForm.city = ''
                this.dataForm.area = ''
                this.defaultAddress = (addressInfo.countryText ? addressInfo.countryText : '') + addressInfo.address
              }
            } else {
              this.dataForm.recipient = res.data.deliveryAddressList[0].recipient
              this.dataForm.phone = res.data.deliveryAddressList[0].phone
              this.dataForm.country = res.data.deliveryAddressList[0].country === '中国' ? 'CN' : res.data.deliveryAddressList[0].country
              if (this.dataForm.country === 'CN') {

                this.dataForm.province = res.data.deliveryAddressList[0].province
                this.dataForm.city = res.data.deliveryAddressList[0].city
                this.dataForm.area = res.data.deliveryAddressList[0].area
                this.dataForm.address = res.data.deliveryAddressList[0].address
                this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].provinceText + res.data.deliveryAddressList[0].cityText + res.data.deliveryAddressList[0].areaText + res.data.deliveryAddressList[0].address
              } else {
                this.dataForm.province = ''
                this.dataForm.city = ''
                this.dataForm.area = ''
                this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].address
              }
            }
          });
        } else {
          this.dataForm.recipient = ""
          this.dataForm.phone = ""
          this.dataForm.country = ""
          this.dataForm.province = ""
          this.dataForm.city = ""
          this.dataForm.area = ""
          this.dataForm.address = ""
          this.defaultAddress = ""
        }
      })
      outPoolexternal(this.dataForm.ordersId).then(res => {
        console.log(res, '通过外协单id 拿到明细数据');
        // this.dataFormTwo.data = res.data.purchaseOrderLineVOList
        let _data = res.data
        this.dataFormTwo.data = _data.map(item => {
          return {
            ...item,
            productDrawingNo: item.drawingNo,
            drawingNo: null,
            ordersNum: item.demandQuantity,
            ordersLineId: item.id,
            outboundQuantity: item.issuedQuantity,
            deliveryQuantity:Number(item.demandQuantity - item.issuedQuantity - item.undeliveredQuantity) > 0 ? Number(item.demandQuantity - item.issuedQuantity - item.undeliveredQuantity) : 0
          }
        })
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
</style>