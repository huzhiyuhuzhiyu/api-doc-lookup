<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="生成外协订单" />
          <div class="options">
            <!-- <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿</el-button> -->
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提交</el-button>
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
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="外协供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                      <el-input v-model="dataForm.cooperativePartnerName" placeholder="请选择外协供应商名称" @focus="openDialog">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="交货日期" prop="deliveryDate">
                      <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择交货日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <!-- <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收件人" prop="recipient">
                      <el-input v-model="dataForm.recipient" placeholder="请输入收件人" :disabled="false" maxlength="20" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收件人电话" prop="phone">
                      <el-input v-model="dataForm.phone" placeholder="请输入电话" maxlength="20" :disabled="false" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="发货人" prop="shipperId">
                      <user-select @change="changeshipperId" v-model="dataForm.shipperId" placeholder="请选择发货人" clearable
                        style="width: 100%;" :disabled="false">
                      </user-select>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="发货方式" prop="delivery">
                      <el-select v-model="dataForm.delivery" placeholder="请选择发货方式" clearable style="width: 100%;"
                        :disabled="false">
                        <el-option v-for="(item, index) in orderListfhfs" :key="index" :label="item.label"
                          @click.native="changeDelivery(item.value)" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->



                  <!-- 
                  <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收货地址" prop="address">
                      <template slot="label">
                        <span>收货地址</span>
                        <span>>></span>
                        <el-button :disabled="type == 'look'" type="text" @click="changeAddress">更换收货地址</el-button>
                      </template>
                      <el-input v-model="defaultAddress" readonly :disabled="type == 'look'" type="textarea"
                        maxlength="50" :rows="3" />
                    </el-form-item>
                  </el-col> -->


                  <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="false" type="textarea"
                        maxlength="200" :rows="3" />
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>
              <!-- <div v-if="type !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                      icon="el-icon-plus" @click="openSeleceProductDialog()">选择产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                      icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                  </div> -->

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table">
                  <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                  <el-table-column prop="productCode" label="产品编码" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                        <div class="viewData">
                          <span>{{ scope.row.productCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productName" label="产品名称" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                        <div class="viewData">
                          <span>{{ scope.row.productName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="spec" label="规格型号" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'spec'">
                        <div class="viewData">
                          <span>{{ scope.row.spec }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="orderQuantity" label="可下单数量" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'orderQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.orderQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="planDemandQuantity" label="计划需求数量" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'planDemandQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.planDemandQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="orderedQuantity" label="已下单数量" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'orderedQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.orderedQuantity ? scope.row.orderedQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                  <!-- <el-table-column prop="completedQuantity" label="已完成数量" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'completedQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.completedQuantity ? scope.row.completedQuantity : 0  }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->







                  <el-table-column prop="purchaseQuantity" label="数量(主)" min-width="160">
                    <template slot="header">
                      <span class="required">*</span>数量(主)
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                        :rules='productRules.purchaseQuantity'>
                        <el-input @input="changePurchaseQuantity(scope.$index, scope.row.purchaseQuantity)"
                          v-model="scope.row.purchaseQuantity" maxlength="20" placeholder="请输入主数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>



                  <el-table-column prop="mainUnit" label="单位(主)" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                        <!-- <el-input v-model="scope.row.mainUnit" readonly maxlength="20" placeholder="请输入主单位">{{
                          scope.row.mainUnit }}
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="purchaseQuantity2" label="数量(副)" min-width="160">
                    <!-- <template slot="header">
                          <span class="required">*</span>数量(副)
                        </template> -->
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity2'"
                        :rules='productRules.purchaseQuantity2'>
                        <el-input @input="changePlanQuantity2(scope.$index, scope.row.purchaseQuantity2)"
                          v-model="scope.row.purchaseQuantity2" maxlength="20" placeholder="请输入副数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="deputyUnit" label="单位(副)" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deputyUnit'">
                        <!-- <el-input v-model="scope.row.deputyUnit" readonly maxlength="20" placeholder="请输入副单位">{{
                          scope.row.deputyUnit }}
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.deputyUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="price" label="含税单价" min-width="180">
                    <template slot="header">
                      <span class="required">*</span>含税单价
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules='productRules.price'>
                        <el-input v-model="scope.row.price" maxlength="20" placeholder="请输入含税单价">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="taxRate" label="税率%" min-width="160">
                    <template slot="header">
                      <span class="required">*</span>税率%
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'" :rules='productRules.taxRate'>
                        <el-input oninput="value = value.replace(/\D/g,'')" maxlength="2" v-model="scope.row.taxRate"
                          placeholder="请输入税率">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <!-- <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="160">
                    <template slot="header">
                      <span class="required">*</span>不含税单价
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxPrice }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->


                  <!-- <el-table-column prop="excludingTaxAmount" label="总金额" min-width="160">
                    <template slot="header">
                      <span class="required">*</span>总金额
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->



                  <el-table-column prop="taxAmount" label="税额" min-width="160">
                    <template slot="header">
                      <span class="required">*</span>税额
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                        <!-- <el-input v-model="scope.row.taxAmount" maxlength="20" placeholder="请输入税额">
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.taxAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>



                  <el-table-column prop="totalAmount" label="价税合计" min-width="160">
                    <template slot="header">
                      <span class="required">*</span>价税合计
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.totalAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="deliveryDate" label="交货日期" min-width="180">
                    <template slot="header">
                      <span class="required">*</span>交货日期
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                        :rules='productRules.deliveryDate'>
                        <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                          style="width: 100%;" :picker-options="dataPickerOptions" placeholder="请选择交货日期">
                        </el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" maxlength="200" placeholder="请输入备注">{{
                        scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">

                      <el-button size="mini" type="text" :disabled="sourceDisabled"
                        @click="handlerOpenSource(scope.$index, 'sources')">配置发料清单</el-button>
                      <el-button size="mini" type="text" class="JNPF-table-delBtn" v-if="dataFormTwo.data.length > 1"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
              <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin-right:10px">总金额：{{ computedValue
                }}</span>
                <span style="font-weight:500;margin-right:10px">总税额：{{ computedValue2 }}</span>
                <span style="font-weight:500;margin-right:10px">价税合计：{{ computedValue3 }}</span>
              </div>

            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="false" :detailed="false"></UploadWj>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow">
              <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="type" :nodeConfig.sync="busNodeConfig"
                ref="workflowRef" />
              <div class="noDataTip" v-if="!workVisible">
                <span class="el-table__empty-text">
                  <div data-v-4d190d64="" class="el-empty">
                    <div class="el-empty__image" style="width: 120px;"><svg viewBox="0 0 79 86" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                          <linearGradient id="linearGradient-1-48" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%">
                            <stop stop-color="#FCFCFD" offset="0%"></stop>
                            <stop stop-color="#EEEFF3" offset="100%"></stop>
                          </linearGradient>
                          <linearGradient id="linearGradient-2-48" x1="0%" y1="9.5%" x2="100%" y2="90.5%">
                            <stop stop-color="#FCFCFD" offset="0%"></stop>
                            <stop stop-color="#E9EBEF" offset="100%"></stop>
                          </linearGradient>
                          <rect id="path-3-48" x="0" y="0" width="17" height="36"></rect>
                        </defs>
                        <g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="B-type" transform="translate(-1268.000000, -535.000000)">
                            <g id="Group-2" transform="translate(1268.000000, 535.000000)">
                              <path id="Oval-Copy-2"
                                d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z"
                                fill="#F7F8FC"></path>
                              <polygon id="Rectangle-Copy-14" fill="#E5E7E9"
                                transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) "
                                points="13 58 53 58 42 45 2 45"></polygon>
                              <g id="Group-Copy"
                                transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)">
                                <polygon id="Rectangle-Copy-10" fill="#E5E7E9"
                                  transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) "
                                  points="2.84078316e-14 3 18 3 23 7 5 7"></polygon>
                                <polygon id="Rectangle-Copy-11" fill="#EDEEF2"
                                  points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon>
                                <rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-48)"
                                  transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) "
                                  x="38" y="7" width="17" height="36"></rect>
                                <polygon id="Rectangle-Copy-13" fill="#F8F9FB"
                                  transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) "
                                  points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon>
                              </g>
                              <rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-48)" x="13" y="45" width="40"
                                height="36"></rect>
                              <g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)">
                                <mask id="mask-4-48" fill="white">
                                  <use xlink:href="#path-3-48"></use>
                                </mask>
                                <use id="Mask" fill="#E0E3E9"
                                  transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) "
                                  xlink:href="#path-3-48"></use>
                                <polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-48)"
                                  transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) "
                                  points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon>
                              </g>
                              <polygon id="Rectangle-Copy-18" fill="#F8F9FB"
                                transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) "
                                points="62 45 79 45 70 58 53 58"></polygon>
                            </g>
                          </g>
                        </g>
                      </svg></div>
                    <div class="el-empty__description">
                      <p>暂无流程信息</p>
                    </div><!---->
                  </div>
                </span>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="type == 'look'" label="流转记录" name="transferList">
              <el-table v-loading="formLoading" :data="transferData">
                <el-table-column prop="businessName" label="审批业务名称" min-width="160" />
                <el-table-column prop="processedName" label="办理人名称" min-width="160" />
                <el-table-column prop="remark" label="备注" min-width="160" />
                <el-table-column prop="startDate" label="开始时间" min-width="160" />
                <el-table-column prop="endDate" label="结束时间" min-width="160" />
                <el-table-column prop="consumingTime" label="耗时" min-width="160" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
    <SupplierDialog ref="SupplierRef" @supplierdata="supplierdata" />
    <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area>
    <!-- <changeAddress v-if="addressVisibled" ref="addressRef" @getChangeAddress="getChangeAddress"></changeAddress> -->
  </div>
</template>
<script>
import { getCounryData, getCooperativeInfo } from '@/api/basicData/index'
import formValidate from "@/utils/formValidate";
import SourceArea from './source.vue'
import SupplierDialog from './supplier-dialog.vue'
import { insertOutOrder } from '@/api/purchasingAndOutsourcingOrders/index'
import { purProcurementDemandPoolexternal } from '@/api/purchasingManagement/purchaseInquirySheet'
import { mapGetters, mapState } from 'vuex'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
// import changeAddress from "./changeAddress.vue"
export default {
  components: {
    SupplierDialog,
    SourceArea,
    // changeAddress,
    workFlow
  },
  data() {
    return {
      datafilelist: [],
      addressVisibled: false,
      sourceVisibled: false,
      activeName: 'jcInfo',
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      // 发货方式
      orderListfhfs: [
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" }
      ],
      dataForm: {
        attachmentList: [],
        cooperativePartnerName: '',      //供应商名称
        deliveryDate: '',                //交货日期.
        orderType: 'external',
        purchaseOrderLines: [],
        address: "",                      //地址
        area: "",                         //区
        province: "",                     //省
        city: "",                         //市
        country: "",                      //国家(外协)
        cooperativePartnerId: '',
        delivery: "",                     //	发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        phone: "",                        // 电话
        recipient: '',                     //收件人
        shipperId: '',                     // 发货人
        remark: '',                        //备注

        excludingTaxTotalAmount: '',       //订单 不含税总金额
        totalAmount: '',                    //   含税总金额
        taxAmount: '',                     // 税额
      },
      dataPickerOptions2: { // 日期区间选择器通用选项
        disabledDate: this.disabledDate2
      },
      dataPickerOptions: { // 日期区间选择器通用选项
        disabledDate: this.disabledDate,
      },
      type: "",
      dataFormArr: [],
      rules: {
        cooperativePartnerName: [{ required: true, message: '请选择外协供应商名称', trigger: ['change'] }],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }],
        // recipient: [
        //   { required: true, message: '请输入收件人名称', trigger: 'blur' },
        //   { validator: this.formValidate('fullName'), trigger: 'blur' },
        // ],
        // phone: [{ required: true, message: '收件人电话不能为空', trigger: 'blur' }, { validator: this.formValidate('iphone'), trigger: 'blur' },],
        // // province: [{ required: true, message: '省份不能为空', trigger: 'change' }],
        // // city: [{ required: true, message: '市不能为空', trigger: 'change' }],
        // // area: [{ required: true, message: '地区不能为空', trigger: 'change' }],
        // address: [{ required: true, message: '收货地址不能为空', trigger: 'change' }],
        // delivery: [{ required: true, message: '发货方式不能为空', trigger: 'change' }],
        // shipperId: [{ required: true, message: '发货人不能为空', trigger: 'change' }],
        // country: [{ required: true, message: '国家不能为空', trigger: 'change' }],
      },
      productRules: {
        // productName: [{ required: true, trigger: ['change'] }],
        // planQuantity: [{ required: true, trigger: ['blur'] }, { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('主数量：' + errMsg) }] }), trigger: 'blur' }],
        // planQuantity2: [{ required: true, trigger: ['blur'] }, { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('副数量：' + errMsg) }] }), trigger: 'blur' }],
        // deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }],
        purchaseQuantity: [{ required: true, trigger: ['blur'] },
        { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
        { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(主)：${errMsg}`) }), trigger: 'blur' }
        ],
        purchaseQuantity2: [
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(副)：${errMsg}`) }), trigger: 'blur' }
        ],

        price: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 6, "", (errMsg) => { this.$message.error('含税单价：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('含税单价：不能为0') }), trigger: 'blur' }
        ],
        excludingTaxPrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 6, "", (errMsg) => { this.$message.error('不含税单价：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('不含税单价：不能为0') }), trigger: 'blur' }
        ],
        excludingTaxAmount: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('总金额(不含税)：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('总金额(不含税)：不能为0') }), trigger: 'blur' }
        ],
        taxAmount: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('税额：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('税额：不能为0') }), trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('价税合计：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('价税合计：不能为0') }), trigger: 'blur' }
        ],
        taxRate: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('税率：不能为0') }), trigger: 'blur' }
        ],


        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }],
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      demandDelivery: '',
      demandDelivery2: '',
      olddeliveryDateArr: [],        // 表格中旧的数据值
      areas: [],
      cities: [],
      countryList: [],
      provinces: [],
      nodeId: -1,
      parentId: '',
      sourceDisabled: false,
      sourceData: [],
      defaultAddress: '',
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: "发起人",
        nodeType: 0,
        type: 'node',
        priorityLevel: "",
        approvalType: "appoint",
        selectMode: "",
        selectRange: "",
        directorLevel: "",
        examineMode: "",
        whenEmpty: "",
        examineEndDirectorLevel: "",
        ccSelfSelectFlag: "",
        conditionList: [],
        nodeUserList: [],
        childNode: null,
        conditionNodes: []
      },
      approvalForm: {},
      firstOneNode: [],
      // 审批 转审记录参数
      transferQuery: {
        approvalFormId: '',
        createByName: "",
        documentId: '',
        endTime: "",
        keyword: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
      transferData: [],
    }
  },
  created() {
  },
  computed: {
    ...mapGetters(['userInfo']),
    computedValue() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach(item => {
        count += item.excludingTaxAmount * 1
      })
      this.dataForm.excludingTaxTotalAmount = this.jnpf.numberFormat(count)

      return this.dataForm.excludingTaxTotalAmount
    },
    computedValue2() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach(item => {
        count += item.taxAmount * 1
      })
      this.dataForm.taxAmount = this.jnpf.numberFormat(count)

      return this.dataForm.taxAmount
    },
    computedValue3() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach(item => {
        count += item.totalAmount * 1
      })
      this.dataForm.totalAmount = this.jnpf.numberFormat(count)

      return this.dataForm.totalAmount
    },

  },
  watch: {
    'dataFormTwo.data': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        console.log(newVal);
        newVal.forEach(item => {
          if (item.price != '' && item.taxRate != '') {
            console.log(11);
            setTimeout(() => {
              item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1 / 100)))
            }, 1000); // 设置延迟时间，单位为毫秒 
          }
          if (item.purchaseQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.purchaseQuantity * item.excludingTaxPrice)
          }
          if ((item.price && item.purchaseQuantity) && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.purchaseQuantity - item.excludingTaxAmount)
          }
          if (item.excludingTaxAmount && item.taxAmount) {
            item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          }

        })
      },
      deep: true,
    }
  },
  methods: {
    // 含税单价输入事件

    // 税率输入事件
    changeTaxRate(scope) {

    },


    // changeshipperId(val, data) {
    //   console.log(data);
    //   this.$nextTick(() => {
    //     this.$refs['elForm'].validateField('shipperId')
    //   })
    // },
    //切换发货方式
    // changeDelivery(val) {
    //   if (val === 'self_pickup') {
    //     console.log(this.$refs['elForm']);
    //     this.$nextTick(() => {
    //       this.$refs['elForm'].clearValidate()
    //     })
    //     this.dataForm.country = ''
    //     this.dataForm.province = ''
    //     this.dataForm.city = ''
    //     this.dataForm.area = ''
    //     this.dataForm.address = ''
    //     this.defaultAddress = ''

    //     this.countryShow = false
    //   } else if (val === 'self_pickup' && this.dataForm.country != 'CN') {
    //     this.countryShow = false
    //     this.dataForm.province = ''
    //     this.dataForm.city = ''
    //     this.dataForm.area = ''
    //     this.dataForm.address = ''
    //   } else {
    //     this.countryShow = true
    //   }
    // },
    // // 更换地址
    // changeAddress() {
    //   this.addressVisibled = true
    //   if (!this.dataForm.cooperativePartnerId) {
    //     this.$message.error('请先选择外协供应商')
    //   } else {
    //     this.$nextTick(() => {
    //       this.$refs.addressRef.initData(this.dataForm.cooperativePartnerId)
    //     })
    //   }
    // },    // 接收传递的地址
    // getChangeAddress(data) {
    //   if (data) {
    //     console.log(data, '11111111');
    //     this.dataForm.recipient = data.recipient
    //     this.dataForm.phone = data.phone
    //     this.dataForm.country = data.country === '中国' ? 'CN' : data.country
    //     this.dataForm.province = data.province
    //     this.dataForm.city = data.city
    //     this.dataForm.area = data.area
    //     this.dataForm.address = data.address
    //     if (this.dataForm.country === 'CN') {

    //       this.defaultAddress = (data.countryText ? data.countryText : '') + data.provinceText + data.cityText + data.areaText + data.address
    //     } else {
    //       this.dataForm.province = ''
    //       this.dataForm.city = ''
    //       this.dataForm.area = ''
    //       this.defaultAddress = (data.countryText ? data.countryText : '') + data.address
    //     }
    //     console.log(this.defaultAddress)
    //   }
    // },

    // 明细中 禁用后续日期
    disabledDate(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time);
      const targetDate = new Date(this.demandDelivery);
      // 检查日期是否大于给定日期
      return currentDate > targetDate;
    },
    // 主表上的日期
    disabledDate2(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time);
      const targetDate = new Date(this.demandDelivery2);
      // 检查日期是否大于给定日期
      return currentDate > targetDate;
    },

    // 对比日期方法
    changeDate(d1, d2) {
      console.log(d1, d2);
      return ((new Date(d1.replace((/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/")))))
    },
    // 打开选择供应商弹窗
    openDialog() {
      this.$refs['SupplierRef'].openDialog()
    },

    supplierdata(data) {
      console.log(data, '供应商数据');
      this.$nextTick(() => { this.$refs['elForm'].validateField('cooperativePartnerName') })
      if (data.length === 0) {
      } else {
        this.dataForm.cooperativePartnerName = data.name
        this.dataForm.cooperativePartnerCode = data.code
        this.dataForm.cooperativePartnerId = data.id
        // getCooperativeInfo(data.id).then(res => {
        //   console.log("客户信息", res);
        //   let addressInfo = {}
        //   if (res.data.deliveryAddressList.length > 0) {
        //     res.data.deliveryAddressList.forEach((item, index) => {
        //       if (item.defaultFlag) {
        //         addressInfo = item
        //         console.log("addressInfo", addressInfo);
        //         this.dataForm.recipient = addressInfo.recipient
        //         this.dataForm.phone = addressInfo.phone
        //         this.dataForm.country = addressInfo.country
        //         if (this.dataForm.country === 'CN') {

        //           this.dataForm.province = addressInfo.province
        //           this.dataForm.city = addressInfo.city
        //           this.dataForm.area = addressInfo.area
        //           this.dataForm.address = addressInfo.address
        //           this.defaultAddress = addressInfo.countryText + addressInfo.provinceText + addressInfo.cityText + addressInfo.areaText + addressInfo.address
        //         } else {
        //           this.dataForm.province = ''
        //           this.dataForm.city = ''
        //           this.dataForm.area = ''
        //           this.defaultAddress = (addressInfo.countryText ? addressInfo.countryText : '') + addressInfo.address
        //         }
        //       } else {
        //         this.dataForm.recipient = res.data.deliveryAddressList[0].recipient
        //         this.dataForm.phone = res.data.deliveryAddressList[0].phone
        //         this.dataForm.country = res.data.deliveryAddressList[0].country
        //         if (this.dataForm.country === 'CN') {

        //           this.dataForm.province = res.data.deliveryAddressList[0].province
        //           this.dataForm.city = res.data.deliveryAddressList[0].city
        //           this.dataForm.area = res.data.deliveryAddressList[0].area
        //           this.dataForm.address = res.data.deliveryAddressList[0].address
        //           this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].provinceText + res.data.deliveryAddressList[0].cityText + res.data.deliveryAddressList[0].areaText + res.data.deliveryAddressList[0].address
        //         } else {
        //           this.dataForm.province = ''
        //           this.dataForm.city = ''
        //           this.dataForm.area = ''
        //           this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].address
        //         }

        //       }
        //     });
        //   } else {
        //     this.dataForm.recipient = ""
        //     this.dataForm.phone = ""
        //     this.dataForm.country = ""
        //     this.dataForm.province = ""
        //     this.dataForm.city = ""
        //     this.dataForm.area = ""
        //     this.dataForm.address = ""
        //     this.defaultAddress = ""
        //   }
        // })

      }
    },
    // 配置资源
    handlerOpenSource(index, type) {
      this.sourceVisibled = true
      this.index = index
      this.sourceData = this.dataFormTwo.data[this.index].outShipmentList
      if (this.sourceData.length === 0) {
        this.sourceDisabled = true
      } else {
        this.sourceDisabled = false
      }
      this.$nextTick(() => {
        this.$refs['sourceRef'].init(this.sourceData, type)
      })
    },
    // 去除系数后两位的小数位
    numberFormat(number) {
      var formatted = parseFloat(number).toFixed(2).replace(/\.?0+$/, "");
      console.log(formatted, '8888');
      if (isNaN(formatted)) {
        return 0
      } else {
        return formatted;
      }
    },
    //下单数量输入事件
    changePurchaseQuantity(index, val) {
      // console.log(val);
      // this.dataFormTwo.data[index].purchaseQuantity = val
      this.$set(this.dataFormTwo.data[index], 'purchaseQuantity', val)
      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        console.log(this.dataFormTwo.data[index].ratio);
        this.dataFormTwo.data[index].purchaseQuantity2 = this.numberFormat(this.dataFormTwo.data[index].purchaseQuantity * this.dataFormTwo.data[index].ratio)
      } else {
        this.dataFormTwo.data[index].purchaseQuantity2 = this.numberFormat(this.dataFormTwo.data[index].purchaseQuantity / this.dataFormTwo.data[index].ratio)
      }
      console.log(this.dataFormTwo.data[index].purchaseQuantity2);
    },
    // 副数量输入事件
    changePlanQuantity2(index, val) {
      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        this.dataFormTwo.data[index].purchaseQuantity = this.numberFormat(this.dataFormTwo.data[index].purchaseQuantity2 / this.dataFormTwo.data[index].ratio)
      } else {
        this.dataFormTwo.data[index].purchaseQuantity = this.numberFormat(this.dataFormTwo.data[index].purchaseQuantity2 * this.dataFormTwo.data[index].ratio)
      }

    },

    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(data) {
      this.dataForm = data
      // 避免传递过来的数据 输入框设置默认值后无法修改 因为内存地址的问题 指向了同一个
      this.$set(this.dataFormTwo, "data", JSON.parse(JSON.stringify(data.purchaseOrderLines)))
      console.log(this.dataFormTwo.data, '传递过来的数据');
      var maxDate = null; // 最大日期初始值设为null
      // 遍历数组，比较日期来找到最大日期
      for (var i = 0; i < this.dataFormTwo.data.length; i++) {
        var currentDate = new Date(this.dataFormTwo.data[i].deliveryDate);
        if (maxDate === null || currentDate > maxDate) {
          maxDate = currentDate;
        }
      }
      // 需求池中最大的交货日期
      this.demandDelivery = maxDate.toISOString().split('T')[0];
      this.demandDelivery2 = maxDate.toISOString().split('T')[0]

      // 审批
      this.$nextTick(() => { this.getApproverData() })

    },
    // 表单提交
    dataFormSubmit() {
      this.request()
    },

    async request() {
      this.btnLoading = true
      let isOk = true
      console.log(this.dataFormTwo.data, 'this.dataFormTwo.data');
      // return
      if (!this.sourceDisabled) {
        this.dataFormTwo.data.forEach(item => {
          if (!item.outShipmentList) {
            this.$message.error('请配置发料清单')
            this.btnLoading = false
            isOk = false
          } else {
            isOk = true
          }
        })
      }
      // 审批条件参数列表
      let nodeCondList = []
      // 审批抄送人列表
      let ccList = []
      let ccLists = []
      let nodeJudg = []
      // 业务审批单流程节点列表
      let formNodeList = []
      // 业务审批单
      let form = {}
      let templateLineList = []
      if (this.busNodeConfig.childNode) {
        let data = JSON.parse(JSON.stringify(this.busNodeConfig))
        let flattenedNodes = this.flattenNodes(data);
        flattenedNodes.splice(0, 1)
        flattenedNodes = flattenedNodes.map(item => {
          return {
            ...item,
            nodeUserList: item.nodeUserList ? item.nodeUserList : []
          }
        })
        templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
        // 抄送人节点数组 ccList
        ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')

        for (var i = 0; i < ccList.length; i++) {
          var nodeUserList = ccList[i].nodeUserList;
          ccLists = ccLists.concat(nodeUserList);
        }
        if (templateLineList.length) {
          isOk = templateLineList.every(item => item.nodeUserList.length)
          if (!isOk) {
            this.$message.error('审核人不能为空！')
            this.btnLoading = false
            return
          }
        }
        if (ccList.length) {
          isOk = ccList.every(item => item.nodeUserList.length)
          if (!isOk) {
            this.$message.error('抄送人不能为空！')
            this.btnLoading = false
            return
          }
        }
        // 条件节点数组 nodeJudgmentList
        nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
        // 业务审批单流程节点参数
        formNodeList = flattenedNodes.map((item, index) => {
          return {
            ...item,
            approvalStatus: item.name == '审核人' ? 'no' : '',
            adminId: '',
            id: '',
            previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
            name: item.nodeName,
            designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
          }
        })
        // 抄送人
        ccLists = ccLists.map(item => {
          return {
            ...item,
            approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
            ccToId: item.targetId,
            approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
            id: '',
            defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1,
          }
        })
        // 条件列表
        if (nodeCondList.length) {
          nodeJudg = nodeCondList.map(item => {
            return {
              ...item,
              approvalFormNodeCode: item.code,
              businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
              code: item.conditionList[0].tjCode,
              dataType: item.conditionList[0].dataType,
              id: item.conditionList[0].id ? item.conditionList[0].id : ''
            }
          })
        }
        // 业务审批单
        form = {
          ...this.approvalForm,
          approvalTemplateId: this.approvalForm.id,
          documentStatus: 'submit',
          documentId: '',
          id: ''
        }
      }
      if (this.dataForm.approvalFlag) {
        if (!this.busNodeConfig.childNode) {
          isOk = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach(item => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                isOk = false
                this.btnLoading = false
                this.activeName = "approvalFlow"
                this.$message.error('未配置发起人自选！')
              }
            }
          })
        }
      }
      if (isOk) {



        let form_2 = this.$refs['productForm']
        let valid_2 = await form_2.validate().catch(err => false)
        console.log(this.dataForm, '参数');
        console.log(valid_2, '11111111111111111');

        this.$refs['elForm'].validate((valid) => {
          if (valid) {

            if (!valid_2) {
              console.log(1);
              this.btnLoading = false
              for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                const item = this.dataFormTwo.data[i]
                if (!item.price) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的含税单价',
                    duration: 1500,
                  })
                  break
                }
                if (!item.taxRate) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的税率',
                    duration: 1500,
                  })
                  break
                }
                if (!item.deliveryDate) {
                  this.$message({
                    type: 'error',
                    message: '请选择第' + (i + 1) + '行的交货日期',
                    duration: 1500,
                  })
                  break
                }
              }
              return
            } else {
              this.btnLoading = true
              this.dataFormTwo.data = this.dataFormTwo.data.map(obj => {
                return { ...obj, procurementDemandPoolId: obj.id, id: null };
              });
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
              this.dataForm.attachmentList = this.datafilelist
              this.dataForm.purchaseOrderLines = this.dataFormTwo.data
              let _data = {
                ...this.dataForm,
                form,
                formNodeList,
                nodeCondList: nodeJudg,
                ccList: ccLists,
              }
              console.log(this.dataForm, '参数');
              // return
              insertOutOrder(_data).then(res => {
                if (res.msg === 'Success') res.msg = '保存成功'
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

          } else {
            this.btnLoading = false
          }

        })
      }else{
        this.btnLoading = false
      }

    },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 抽屉提交
    handlerConfirm(data) {
      console.log('1111111111111111111111111')
      console.log(data, '资源资源数据');
      this.dataFormTwo.data[this.index].outShipmentList = data
    },
    //  选择产品弹框传递的数据
    // productsSubmit(data) {
    //   if (this.dataFormTwo.data.length) {
    //     this.dataFormTwo.data = this.dataFormTwo.data.filter(item => {
    //       return !data.some(element => element.productsId === item.productsId);
    //     });
    //   }
    //   console.log(data, '传递数据1111');
    //   this.dataFormTwo.data = [...this.dataFormTwo.data, ...data,]
    //   console.log(this.dataFormTwo.data, '传递数据');
    // },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      console.log(obj);
      if (obj) {
        if (obj.name === "审核人") {
          obj.nodeType = 1;
          obj.nodeName = obj.name;
          obj.directorLevel = obj.approvalType == "manager" ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == "multilevel" ? obj.levelSupervisor : ''
        }
        if (obj.name === "路由") {
          obj.nodeType = 4;
        }
        if (obj.name === "抄送人") {
          obj.nodeType = 2;
          obj.nodeName = obj.name;
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode);
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map(item => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(','); // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',');
                  var resultArr = [];
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      };
                      resultArr.push(option);
                    }
                  }
                }
                return {
                  ...item,
                  columnDbname: item.name,
                  columnType: item.dataType,
                  showName: item.name,
                  tjCode: item.code,
                  zdy1: item.comparisonValue,
                  columnId: item.approvalBusinessId,
                  options: resultArr,
                  optType: item.dataType == 'number' ? (item.operationalFormula == 'lt' ? '1' : item.operationalFormula == 'gt' ? '2' : item.operationalFormula == 'eq' ? '4' : item.operationalFormula == 'ge' ? '5' : item.operationalFormula == 'le' ? '3' : '') : ''

                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode);
            }
          }
        }
      }
    },
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        console.log(node, '提交数1');
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null });
        if (node.type === 'node') {

          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {

              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code);
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
        }
      }
      return flattenedNodes;
    },
    // // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = ''  // 条件符号
      let result = null     // 判断条件是否成立
      let condList = []
      getBusDetail('b010').then(res => {
        console.log(res);
        state = res.data.business.state
        condExpress = res.data.business.condExpress
        // if (res.data.businessConditionList.length) {
        //   res.data.businessConditionList.forEach(item => {
        //     condList.push({
        //       code: item.code,
        //       val: item.code === 'numCode' ? this.totalNum : this.totalPrice
        //     })
        //   })
        // }
        if (state === 'condition') {
          this.dataForm.approvalFlag = 1
          for (var i = 0; i < condArr.length; i++) {
            if (condExpress.includes(condArr[i])) {
              foundSymbol = condArr[i];
              break;
            }
          }
          // 找到符号并进行销售报价业务判断
          if (foundSymbol) {
            const parts = condExpress.split(foundSymbol); // 使用 ">" 符号拆分字符串
            const leftValue = parts[0]; // 提取 ">" 符号左边的值
            const rightValue = parts[1]; // 提取 ">" 符号右边的值
            console.log(leftValue);
            console.log(rightValue);
            // if (leftValue == 'numCode') {
            //   const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // } else {
            //   const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // }
            if (result) {
              let query = {
                businessCode: "b010",
                condList,
              }
              busApprovalFlowTree(query).then(res => {
                console.log(res, '树详情');
                if (res.data) {
                  this.firstOneNode = []
                  this.approvalForm = res.data.template
                  this.firstOneNode.push({
                    name: this.userInfo.userName
                  })
                  let data = res.data.tempLineTree.childNode
                  if (data) {
                    this.addNodeTypeAndNodeName(data)
                    this.busNodeConfig.childNode = data
                    this.workVisible = true
                    this.$nextTick(() => {
                      this.$refs.workflowRef.initData('busing', this.type)
                    })
                  }
                } else {
                  this.busNodeConfig.childNode = null
                }
              })
            } else {
              this.busNodeConfig.childNode = null
            }
          }
        }
        if (state === 'enable') {
          this.dataForm.approvalFlag = 1
          let query = {
            businessCode: "b010",
            condList,
          }
          busApprovalFlowTree(query).then(res => {
            console.log(res, '树详情');
            if (res.data) {
              this.firstOneNode = []
              this.approvalForm = res.data.template
              this.firstOneNode.push({
                name: this.userInfo.userName
              })
              let data = res.data.tempLineTree.childNode
              if (data) {
                this.addNodeTypeAndNodeName(data)
                this.busNodeConfig.childNode = data
                this.workVisible = true
                this.$nextTick(() => {
                  this.$refs.workflowRef.initData('busing', this.type)
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
        }
        if (state === 'disabled') {
          this.dataForm.approvalFlag = 0
          this.busNodeConfig.childNode = null
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

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  height: calc(100% - 47px) !important;
  overflow: auto !important;
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

::v-deep .el-date-table .today span {
  font-weight: 700;
  color: #C0C4CC !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .workNode {
  background-color: #f5f5f7 !important;
}

.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}
</style>