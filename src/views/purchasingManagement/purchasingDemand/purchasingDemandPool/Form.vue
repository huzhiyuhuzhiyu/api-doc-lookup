<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="生成采购订单" />
          <div class="options">
            <!-- <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿</el-button> -->
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              {{ $t('common.submitButton') }}
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main" ref="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo" ref="orderInfos">
              <!-- <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>基本信息</h5>
              </div> -->
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :span="12">
                    <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                      <!-- <el-input v-model="dataForm.cooperativePartnerName" placeholder="请选择供应商名称" @focus="openDialog">
                      </el-input> -->
                      <!-- 供应商选择弹窗  -->
                      <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                        v-model="dataForm.cooperativePartnerName" :beforeSubmit="beforeSubmit" ref="ComSelect-page"
                        @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'" title="选择供应商"
                        treeTitle="供应商分类" :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                        :listRequestObj="PartnerListRequestObj" :paramsObj="{ oldData }"
                        :searchList="PartnerTableSearchList" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="交货日期" prop="deliveryDate">
                      <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择交货日期"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
              <el-collapse v-model="activeNames">
                <el-collapse-item title="产品信息" name="basicInfo" class="orderInfo">
                  <div :style="{ height: customStyleData + 'px' }">
                    <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                      <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceProductDialog">
                        选择产品
                      </el-button>
                      |
                      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">
                        批量删除
                      </el-button>
                      |
                      <el-table style="border: 1px solid #e3e7ee;" :fixedNO="true"
                        @selection-change="handeleProductInfoData" v-bind="dataFormTwo.data" :data="dataFormTwo.data"
                        id="table" border>
                        <el-table-column type="selection" width="55" fixed="left" :key="2"></el-table-column>
                        <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                        <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                          <!-- <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'">
                              <div class="viewData">
                                <span>{{ scope.row.productDrawingNo }}</span>
                              </div>
                            </el-form-item>
                          </template> -->
                          <template slot="header">
                            <span class="required">*</span>
                            品名规格
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'"
                              :rules="productRules.productDrawingNo">
                              <el-input v-model="scope.row.productDrawingNo" placeholder="请输入品名规格" />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                          <template slot="header">
                            <span class="required">*</span>
                            产品名称
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'"
                              :rules="productRules.productName">
                              <el-input v-model="scope.row.productName" placeholder="请输入含税单价" />
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="deliveryDate" label="交货日期" min-width="200">
                          <template slot="header">
                            <span class="required">*</span>
                            交货日期
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                              :rules="productRules.deliveryDate">
                              <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                                style="width: 100%;" placeholder="请选择交货日期"></el-date-picker>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="mainUnit" label="单位" min-width="60" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                              <div class="viewData">
                                <span>{{ scope.row.mainUnit }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="purchaseQuantity" label="数量" min-width="100">
                          <template slot="header">
                            <span class="required">*</span>
                            数量
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                              :rules="productRules.purchaseQuantity">
                              <el-input @input="changePurchaseQuantity(scope.$index, scope.row.purchaseQuantity)"
                                v-model="scope.row.purchaseQuantity" maxlength="20" placeholder="请输入主数量"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="price" label="含税单价" min-width="180">
                          <template slot="header">
                            <span class="required">*</span>
                            含税单价
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                              <el-input v-model="scope.row.price" placeholder="请输入含税单价" />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="totalAmount" label="金额" min-width="140">
                          <template slot="header">
                            <span class="required">*</span>
                            金额(含税)
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                              <div class="viewData">
                                <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="taxRate" label="税率(%)" min-width="140">
                          <template slot="header">
                            <span class="required">*</span>
                            税率(%)
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :rules="productRules.taxRate">
                              <!-- <el-input oninput="value = value.replace(/\D/g,'')" maxlength="2"
                                v-model="scope.row.taxRate" placeholder="请输入税率"></el-input> -->
                              <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;">
                                <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                                  :value="item.id"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="150">
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                              <div class="viewData">
                                <span>{{ scope.row.excludingTaxPrice }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>

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

                        <el-table-column prop="taxAmount" label="税额" min-width="100">
                          <template slot="header">
                            <span class="required">*</span>
                            税额
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                              <!-- <el-input v-model="scope.row.taxAmount" maxlength="20" placeholder="请输入税额">
                          </el-input> -->
                              <div class="viewData">
                                <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="excludingTaxAmount" label="金额(不含税)" min-width="180">
                          <template slot="header">
                            <span class="required">*</span>
                            金额(不含税)
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                              <!-- <el-input v-model="scope.row.excludingTaxAmount" maxlength="20"
                                placeholder="请输入金额(不含税)"></el-input> -->
                              <div class="viewData">
                                <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="standardValue" label="规值" width="120" :key="211">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.standardValue" placeholder="请选择" clearable
                              style="width: 100%;">
                              <el-option v-for="(item, index) in list0" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>

                        <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="212">
                          <!-- <template slot="header">
                        <span class="required">*</span>打字内容
                      </template> -->
                          <template slot-scope="scope" v-if="scope.row.classAttribute == 'finish_product'">
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
                          <template slot-scope="scope" v-if="scope.row.classAttribute == 'finish_product'">
                            <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable>
                              <el-option v-for="(item, index) in list2" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>

                        <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">
                          <template slot-scope="scope" v-if="scope.row.classAttribute == 'finish_product'">
                            <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable
                              style="width: 100%;">
                              <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="oil" label="油脂" width="120" :key="61">
                          <template slot-scope="scope" v-if="scope.row.classAttribute == 'finish_product'">
                            <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="oilQuantity" label="油脂量" width="160" :key="51">
                          <template slot-scope="scope" v-if="scope.row.classAttribute == 'finish_product'">
                            <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in list5" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="clearance" label="游隙" width="120" :key="100">
                          <template slot-scope="scope" v-if="scope.row.classAttribute == 'finish_product'">
                            <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101">
                          <template slot-scope="scope" v-if="scope.row.classAttribute == 'finish_product'">
                            <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable
                              style="width: 100%;">
                              <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="processId" label="工序" width="120" :key="102">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.processId" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                                :value="item.id"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>

                        <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="20"
                              placeholder="请输入备注">
                              {{ scope.row.remark }}
                            </el-input>
                          </template>
                        </el-table-column>

                        <el-table-column label="操作" width="180" fixed="right" v-if="dataFormTwo.data.length > 1">
                          <template slot-scope="scope">
                            <el-button type="text" class="JNPF-table-delBtn"
                              @click="delequipment_process_relList(scope.$index)">
                              删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form>
                  </div>
                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin-right:10px">总金额：{{ computedValue }}</span>
                    <span style="font-weight:500;margin-right:10px">总数量：{{ computedValue2 }}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
            <!-- <el-tab-pane label="流程信息" name="approvalFlow">
              <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="type" :nodeConfig.sync="busNodeConfig"
                ref="workflowRef" />
              <div class="noDataTip" v-if="!workVisible">
                <span class="el-table__empty-text">
                  <div data-v-4d190d64="" class="el-empty">
                    <div class="el-empty__image" style="width: 120px;">
                      <svg viewBox="0 0 79 86" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink">
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
                                height="36">
                              </rect>
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
                      </svg>
                    </div>
                    <div class="el-empty__description">
                      <p>暂无流程信息</p>
                    </div>
                 
                  </div>
                </span>
              </div>
            </el-tab-pane> -->
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
    <sourceForm v-if="sourceFormVisible" ref="sourceForm" @confirm="sourceFormConfirm" />
    <ComSelect-page ref="comSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems"
      dialogTitle="选择产品" :listMethod="getcooperativeProduct" :listRequestObj="ProductListRequestObjs"
      :searchList="ProductTableSearchList" :elementShow="false" :multiple="true" :renderTree="false" />
  </div>
</template>
<script>
import sourceForm from './source.vue'
import { insertPurchaseOrder, partnerProductPrice, priceList } from '@/api/purchasingAndOutsourcingOrders/index'
import { getCooperativeData, getcategoryTree } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import {
  getApprovalTemplate,
  getApprovalDetailTree,
  busApprovalFlowTree,
  getSaleBusDetail,
  getBusDetail,
  approvalTransferList
} from '@/api/basicData/approvalAdministrator'
import {
  getOrderDetail,
  addOrders,
  editOrders,
  getcategoryTrees,
  getAttributeline,
  getcooperativeProduct,
  getCopyOrders,
  getWorkOrderNo,
  uploadProduct
} from '@/api/salesManagement/assemblyOrders'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getBimProcessList } from '@/api/bimProcess/index'
export default {
  components: {
    sourceForm,
    workFlow
  },
  data() {
    return {
      activeNames: ['productInfo', 'basicInfo'],
      datafilelist: [],
      // 选择客户产品参数
      ProductListRequestObjs: {
        contractId: null,
        customerProductNo: '',
        productCode: '',
        productName: '',
        partnerId: '',
        productStatus: 'enable',
        partnerType: 'customer',
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
      ProductTableItems: [
        { prop: 'customerProductNo', label: ' 客户料号', fixed: 'left' },
        { prop: 'productCode', label: '产品编码' },
        { prop: 'productName', label: '产品名称' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'mainUnit', label: '单位(主)' }
      ],
      // 客户产品查询条件
      ProductTableSearchList: [
        { prop: 'customerProductNo', label: '客户料号', type: 'input' },
        { prop: 'productName', label: '产品名称', type: 'input' },
        { prop: 'drawingNo', label: '品名规格', type: 'input' },
        { prop: 'productCode', label: '产品编码', type: 'input' }
      ],
      getcooperativeProduct,
      productVisible: false,
      sourceFormVisible: false,
      activeName: 'jcInfo',
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      getCooperativeData,
      getcategoryTree,
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'supplier' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码', fixed: 'left' },
        { prop: 'name', label: '供应商名称', fixed: 'left' },
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
        type: 'supplier'
      },
      dataForm: {
        attachmentList: [],
        cooperativePartnerName: '', //供应商名称
        deliveryDate: '', //交货日期.
        orderType: 'procure',
        purchaseOrderLines: [],
        excludingTaxTotalAmount: '', //订单 不含税总金额
        totalAmount: '', //   含税总金额
        taxAmount: '' // 税额
      },
      dataPickerOptions2: {
        // 日期区间选择器通用选项
        disabledDate: this.disabledDate2
      },
      dataPickerOptions: {
        // 日期区间选择器通用选项
        disabledDate: this.disabledDate
      },
      type: '',
      dataFormArr: [],
      rules: {
        // applicationReason: [{ required: true, message: '请输入申请理由', trigger: ['blur'] }],
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },
      productRules: {
        productDrawingNo: [{ required: true, message: '请输入产品名称', trigger: ['blur'] }],
        productName: [{ required: true, message: '请输入产品名称', trigger: ['blur'] }],
        purchaseQuantity: [
          // 主数量
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`)
            }),
            trigger: 'blur'
          },
          { required: true, trigger: ['blur'] }
        ],
        purchaseQuantity2: [
          // 副数量
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`)
            }),
            trigger: 'blur'
          },
          { required: true, trigger: ['blur'] }
        ],
        taxRate: [
          // 税率
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：税率${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('noZero', '', (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：税率${errMsg}`)
            }),
            trigger: 'blur'
          },
          { required: true, trigger: ['blur'] }
        ],
        price: [
          // 含税单价
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：含税单价${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                6,
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
                }
              ]
            }),
            trigger: 'blur'
          },
          // {
          //   validator: this.formValidate({
          //     type: 'calc',
          //     params: [
          //       (rowIndex, value) =>
          //         Number(this.dataFormTwo.data[rowIndex].price) <= Number(this.dataFormTwo.data[rowIndex].fixedPrice),
          //       '不能超过对应定价',
          //       (errMsg, index) => {
          //         this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
          //       }
          //     ]
          //   }),
          //   trigger: 'blur'
          // },
          { required: true, trigger: ['blur'] }
        ],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      demandDelivery: '',
      demandDelivery2: '',
      olddeliveryDateArr: [], // 表格中旧的数据值
      oldData: [],
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: '发起人',
        nodeType: 0,
        type: 'node',
        priorityLevel: '',
        approvalType: 'appoint',
        selectMode: '',
        selectRange: '',
        directorLevel: '',
        examineMode: '',
        whenEmpty: '',
        examineEndDirectorLevel: '',
        ccSelfSelectFlag: '',
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
        createByName: '',
        documentId: '',
        endTime: '',
        keyword: '',
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ''
      },
      transferData: [],
      formLoading: false,
      customStyleData: 0,
      selectRows: [],

      list0: [],
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
      taxRateList: []
    }
  },
  created() { },
  computed: {
    ...mapGetters(['userInfo']),
    computedValue() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.excludingTaxAmount * 1
      })
      this.dataForm.excludingTaxTotalAmount = this.jnpf.numberFormat(count)

      return this.dataForm.excludingTaxTotalAmount
    },
    computedValue2() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.purchaseQuantity * 1
      })
      this.dataForm.purchaseQuantity = this.jnpf.numberFormat(count)

      return this.dataForm.purchaseQuantity
    }
  },
  watch: {
    'dataFormTwo.data': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          if (item.price && item.taxRate) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1) / 100))
          }
          if (item.purchaseQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.purchaseQuantity * item.excludingTaxPrice)
          }
          if (item.price && item.purchaseQuantity && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.purchaseQuantity - item.excludingTaxAmount)
          }
          if (item.excludingTaxAmount && item.taxAmount) {
            item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          }
          // if (!item.price) {
          //   this.$message.error('未找到供应商单价')
          // }
        })
      },
      deep: true
    }
  },
  methods: {
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj0 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa008',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj0).then((res) => {
        console.log(res, 'res123')
        this.list0 = res.data.records
      })

      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa007',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj1).then((res) => {
        this.list1 = res.data.records
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa006',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj2).then((res) => {
        this.list2 = res.data.records
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa005',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj3).then((res) => {
        this.list3 = res.data.records
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa002',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj4).then((res) => {
        this.list4 = res.data.records
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa003',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj5).then((res) => {
        this.list5 = res.data.records
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa001',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj6).then((res) => {
        this.list6 = res.data.records
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa015',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj7).then((res) => {
        this.list7 = res.data.records
      })

      let obj8 = {
        pageNum: -1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getBimProcessList(obj8).then((res) => {
        console.log(res, 'oiii')
        this.list8 = res.data.records
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log('税率', this.taxRateList)
      })
    },
    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {
      if (this.dataForm.cooperativePartnerId) {
        // this.productVisible = true
        // this.getcooperativeProduct()
        this.$refs['comSelect-page'].openDialog()
      } else {
        this.$message({
          message: '请先选择供应商',
          type: 'error',
          duration: 1500
        })
      }
      // if (this.dataForm.orderType == 'normal' || this.dataForm.orderType == 'urgent') {
      //   if (this.dataForm.cooperativePartnerId) {

      //     // this.productVisible = true
      //     // this.getcooperativeProduct()
      //     this.$refs["comSelect-page"].openDialog()
      //   } else {
      //     this.$message({
      //       message: "请先选择客户",
      //       type: 'error',
      //       duration: 1500,
      //     })
      //   }
      // } else {
      //   this.allProVisible = true
      //   let arr = [];
      //   this.ProductListRequestObj = {
      //     classAttributeList: [],
      //     classAttribute: "",
      //     productDrawingNo: "",
      //     queryType: 2,
      //     productStatus: 'enable',

      //     productCategoryId: "",
      //     code: "",
      //     name: "",
      //     orderItems: [{
      //       "asc": false,
      //       "column": ""
      //     }, {
      //       "asc": false,
      //       "column": "create_time"
      //     }],
      //     pageNum: 1,
      //     pageSize: 20,
      //   }
      //   this.allproductData = []
      //   let successTotal = 0;
      //   let tempTreeData = [...this.ProductMethodArr]
      //   this.ProductMethodArr.forEach((item, index) => {
      //     item.method(item.requeseObj).then(res => {
      //       if (Array.isArray(res.data)) {
      //         tempTreeData[index] = {
      //           id: item.label,
      //           name: item.label,
      //           classAttribute: item.classAttribute,
      //           childrenList: res.data
      //         }
      //       } else {
      //         tempTreeData[index] = {
      //           id: item.label,
      //           name: item.label,
      //           classAttribute: item.classAttribute,
      //           childrenList: res.data.records
      //         }
      //       }
      //       if ((++successTotal) === this.ProductMethodArr.length) {
      //         this.ProductTreeData = tempTreeData
      //         this.initData2()
      //       }
      //     })
      //   });
      // }
    },
    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct(val, data, paramsObj) {
      this.productVisible = false
      data.forEach((i) => {
        const item = i.all

        if (item.taxRate) {
          item.excludingTaxPrice = this.jnpf.numberFormat(Number(item.price) / (1 + Number(item.taxRate) / 100), 6)
        } else {
          item.excludingTaxPrice = item.price
        }
        if (this.btnType == 'edit') {
          item.id = ''
        }
        this.dataFormTwo.data.push(item)
      })
    },
    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: '请选择你要删除的数据',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i]
        const index = this.dataFormTwo.data.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.selectRows = [] // 清空选中的行的数据
    },
    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 明细中 禁用后续日期
    disabledDate(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time)
      const targetDate = new Date(this.demandDelivery)
      // 检查日期是否大于给定日期
      return currentDate > targetDate
    },
    // 主表上的日期
    disabledDate2(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time)
      const targetDate = new Date(this.demandDelivery2)
      // 检查日期是否大于给定日期
      return currentDate > targetDate
    },

    // 打开选择供应商弹窗
    // 切换供应商后给的提示
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (paramsObj.oldData.length) {
        flag = await this.$confirm('切换供应商会更新产品价格信息，是否继续？', '提示', {
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
        this.$refs['elForm'].validateField('cooperativePartnerName')
      })
      if (data.length === 0) {
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.cooperativePartnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
        let productIdList = []
        this.dataFormTwo.data.forEach((item) => {
          productIdList.push(item.productsId)
        })
        let _data = {
          cooperativePartnerId: this.dataForm.cooperativePartnerId,
          productIdList
        }
        partnerProductPrice(_data).then((res) => {
          if (res.data.length === 0) {
            this.dataFormTwo.data.forEach((item) => {
              item.price = ''
              item.fixedPrice = ''
            })
          } else {
            res.data.forEach((item) => {
              const targetList = this.dataFormTwo.data.filter((line) => line.productsId === item.productId)
              targetList.forEach((line) => {
                this.$set(line, 'fixedPrice', item.price)
                this.$set(line, 'price', item.price)
                this.$set(line, 'excludingTaxPrice', item.excludingTaxPrice)
                this.$set(line, 'taxRate', item.taxRate)
              })
            })
            const targetList = this.dataFormTwo.data.filter((line) => line.price == '')
            targetList.forEach((line) => {
              this.$set(line, 'price', '')
            })
            // 重置子表校验状态
            this.$refs.productForm.clearValidate()
          }
        })
      }
    },

    // 去除系数后两位的小数位
    numberFormat(number) {
      var formatted = parseFloat(number)
        .toFixed(2)
        .replace(/\.?0+$/, '')
      if (isNaN(formatted)) {
        return 0
      } else {
        return formatted
      }
    },
    //下单数量输入事件
    changePurchaseQuantity(index, val) {
      // this.dataFormTwo.data[index].purchaseQuantity = val
      this.$set(this.dataFormTwo.data[index], 'purchaseQuantity', val)

      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        this.dataFormTwo.data[index].purchaseQuantity2 = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity * this.dataFormTwo.data[index].ratio
        )
      } else {
        this.dataFormTwo.data[index].purchaseQuantity2 = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity / this.dataFormTwo.data[index].ratio
        )
      }
    },
    // 副数量输入事件
    changePlanQuantity2(index, val) {
      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        this.dataFormTwo.data[index].purchaseQuantity = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity2 / this.dataFormTwo.data[index].ratio
        )
      } else {
        this.dataFormTwo.data[index].purchaseQuantity = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity2 * this.dataFormTwo.data[index].ratio
        )
      }
    },
    goBack() {
      this.$emit('close')
    },
    init(data) {
      console.log(data, 'data')
      this.getProductClassFun()
      // data.forEach((item) => {
      //   item.productDrawingNo = item.drawingNo
      //   item.productName = item.name
      //   item.productCode = item.code
      // })
      // if (!demandDelivery) { // 没有日期，代表从重新提交中进来的
      // this.dataForm = data
      this.$set(this.dataFormTwo, 'data', JSON.parse(JSON.stringify(data)))
      console.log(this.dataFormTwo, 'two')
      // }
      // else {
      //   // 避免传递过来的数据 输入框设置默认值后无法修改 因为内存地址的问题 指向了同一个
      //   this.$set(this.dataFormTwo, "data", JSON.parse(JSON.stringify(data)))
      // }

      var maxDate = null // 最大日期初始值设为null
      // 遍历数组，比较日期来找到最大日期
      for (var i = 0; i < this.dataFormTwo.data.length; i++) {
        var currentDate = new Date(this.dataFormTwo.data[i].deliveryDate)
        if (maxDate === null || currentDate > maxDate) {
          maxDate = currentDate
        }
        this.$set(this.dataFormTwo.data[i], 'excludingTaxAmount', '') // 总金额(不含税)
        // this.$set(this.dataFormTwo.data[i], 'excludingTaxPrice', '')    // 	不含税单价
        this.$set(this.dataFormTwo.data[i], 'fixedPrice', '') //  	定价
        this.$set(this.dataFormTwo.data[i], 'price', '') //  	含税单价
        this.$set(this.dataFormTwo.data[i], 'taxAmount', '') // 税额
        this.$set(this.dataFormTwo.data[i], 'taxRate', '13') // taxRate
        this.$set(this.dataFormTwo.data[i], 'totalAmount', '') // 	价税合计
        this.$set(
          this.dataFormTwo.data[i],
          'orderQuantity',
          this.dataFormTwo.data[i].planDemandQuantity -
          (this.dataFormTwo.data[i].orderedQuantity ? this.dataFormTwo.data[i].orderedQuantity : 0)
        ) // 	可下单数量
        this.olddeliveryDateArr.push(this.dataFormTwo.data[i].deliveryDate)
      }
      // 明细中最大的交货日期
      // this.demandDelivery = maxDate.toISOString().split('T')[0];
      // this.demandDelivery2 = demandDelivery
      // 取明细第一条数据的产品id，自动带下其第一条供应商设为主表供应商
      // priceList(this.dataFormTwo.data[0].productsId).then(res => {
      //   if (!res.data.length) return
      //   const data = [{
      //     all: {
      //       ...res.data[0],
      //       id: res.data[0].cooperativePartnerId,
      //       code: res.data[0].cooperativePartnerIdCode,
      //       name: res.data[0].cooperativePartnerIdName,
      //     }
      //   }]
      //   this.supplierdata('', data)
      // })
      // 审批
      // this.$nextTick(() => { this.getApproverData() })
    },
    // 侧边拉出产品信息
    async openSource(id) {
      // const form_1 = this.$refs.elForm
      // let flag = await form_1.validate().catch(err => false)
      // if (!flag) {
      //   this.jnpf.focusErrValidItem(form_1.fields)
      //   return
      // }
      priceList(id).then((res) => {
        this.sourceFormVisible = true
        this.$nextTick(() => {
          this.$refs.sourceForm.init(res.data, this.dataForm.deliveryDate)
        })
      })
    },
    // 侧边栏提交
    sourceFormConfirm(selectData) {
      const data = [
        {
          all: {
            ...selectData,
            fixedPrice: selectData.price,
            id: selectData.cooperativePartnerId,
            code: selectData.cooperativePartnerIdCode,
            name: selectData.cooperativePartnerIdName
          }
        }
      ]
      this.supplierdata('', data)
      this.sourceFormVisible = false
    },

    // 表单提交
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用
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
        let flattenedNodes = this.flattenNodes(data)
        flattenedNodes.splice(0, 1)
        flattenedNodes = flattenedNodes.map((item) => {
          return {
            ...item,
            nodeUserList: item.nodeUserList ? item.nodeUserList : []
          }
        })
        templateLineList = flattenedNodes.filter((item) => item.nodeName === '审核人')
        // 抄送人节点数组 ccList
        ccList = flattenedNodes.filter((item) => item.nodeName === '抄送人')

        for (var i = 0; i < ccList.length; i++) {
          var nodeUserList = ccList[i].nodeUserList
          ccLists = ccLists.concat(nodeUserList)
        }
        if (templateLineList.length) {
          submitFlag = templateLineList.every((item) => item.nodeUserList.length)
          if (!submitFlag) {
            this.$message.error('审核人不能为空！')
            this.btnLoading = false
            return
          }
        }
        if (ccList.length) {
          submitFlag = ccList.every((item) => item.nodeUserList.length)
          if (!submitFlag) {
            this.$message.error('抄送人不能为空！')
            this.btnLoading = false
            return
          }
        }
        // 条件节点数组 nodeJudgmentList
        nodeCondList = flattenedNodes.filter((item) => item.type === 'condition')
        // 业务审批单流程节点参数
        formNodeList = flattenedNodes.map((item, index) => {
          return {
            ...item,
            approvalStatus: item.name == '审核人' ? 'no' : '',
            adminId: '',
            id: '',
            previousCode:
              item.type === 'condition' ? item.previousCode : index === 0 ? '' : flattenedNodes[index - 1].code,
            name: item.nodeName,
            designatedMembersId: item.designatedMembersId
              ? item.designatedMembersId
              : item.nodeUserList.length
                ? item.nodeUserList[0].targetId
                : ''
          }
        })
        // 抄送人
        ccLists = ccLists.map((item) => {
          return {
            ...item,
            approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
            ccToId: item.targetId ? item.targetId : '',
            approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
            id: '',
            defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1
          }
        })
        // 条件列表
        if (nodeCondList.length) {
          nodeJudg = nodeCondList.map((item) => {
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
          submitFlag = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach((item) => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                submitFlag = false
                this.btnLoading = false
                this.activeName = 'approvalFlow'
                this.$message.error('未配置发起人自选！')
              }
            }
            if (item.nodeType === 2) {
              if (!item.nodeUserList.length) {
                submitFlag = false
                this.btnLoading = false
                this.activeName = 'approvalFlow'
                this.$message.error('抄送人不能为空')
              }
            }
          })
        }
      }
      let form_1 = this.$refs['elForm']
      let valid_1 = await form_1.validate().catch((err) => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      if (submitFlag) {
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
        this.btnLoading = true
        let dataTwo = []
        dataTwo = this.dataFormTwo.data.map((obj) => {
          return { ...obj, procurementDemandPoolId: obj.id, productsId: obj.id, id: null }
        })
        this.dataForm.attachmentList = this.datafilelist
        this.dataForm.purchaseOrderLines = dataTwo
        let _data = {
          ...this.dataForm,
          form,
          formNodeList,
          nodeCondList: nodeJudg,
          ccList: ccLists
        }

        insertPurchaseOrder(_data)
          .then((res) => {
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
          })
          .catch(() => {
            this.btnLoading = false
          })
      } else {
        this.btnLoading = false
      }
    },
    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      if (obj) {
        if (obj.name === '审核人') {
          obj.nodeType = 1
          obj.nodeName = obj.name
          obj.directorLevel = obj.approvalType == 'manager' ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == 'multilevel' ? obj.levelSupervisor : ''
        }
        if (obj.name === '路由') {
          obj.nodeType = 4
        }
        if (obj.name === '抄送人') {
          obj.nodeType = 2
          obj.nodeName = obj.name
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode)
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map((item) => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(',') // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',')
                  var resultArr = []
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      }
                      resultArr.push(option)
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
                  optType:
                    item.dataType == 'number'
                      ? item.operationalFormula == 'lt'
                        ? '1'
                        : item.operationalFormula == 'gt'
                          ? '2'
                          : item.operationalFormula == 'eq'
                            ? '4'
                            : item.operationalFormula == 'ge'
                              ? '5'
                              : item.operationalFormula == 'le'
                                ? '3'
                                : ''
                      : ''
                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode)
            }
          }
        }
      }
    },
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null })
        if (node.type === 'node') {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code)
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {
              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code)
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code)
          }
        }
      }
      return flattenedNodes
    },
    // // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = '' // 条件符号
      let result = null // 判断条件是否成立
      let condList = []
      getBusDetail('b009').then((res) => {
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
              foundSymbol = condArr[i]
              break
            }
          }
          // 找到符号并进行销售报价业务判断
          if (foundSymbol) {
            const parts = condExpress.split(foundSymbol) // 使用 ">" 符号拆分字符串
            const leftValue = parts[0] // 提取 ">" 符号左边的值
            const rightValue = parts[1] // 提取 ">" 符号右边的值

            // if (leftValue == 'numCode') {
            //   const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // } else {
            //   const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // }
            if (result) {
              let query = {
                businessCode: 'b009',
                condList
              }
              busApprovalFlowTree(query).then((res) => {
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
            businessCode: 'b009',
            condList
          }
          busApprovalFlowTree(query).then((res) => {
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
    switchStyleheight() {
      const mainRegion = this.$refs.orderInfos.$parent.$parent.$el // 表单页面区域
      const mainRegion1 = this.$refs.main // 表单页面区域
      const mainHeight = mainRegion.clientHeight
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 280
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    }
  },
  mounted() {
    this.switchStyleheight()
    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.table) return
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    }
    window.addEventListener('resize', this.clientResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.clientResize)
  }
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
  /* padding: 0 20px; */
}

::v-deep .el-tabs__header {
  /* padding-left: 10px !important; */
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
  color: #c0c4cc !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  /* overflow: auto !important; */
  /* padding: 0 20px; */
}

::v-deep .workNode {
  /* min-height: 1045px !important; */
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

::v-deep .el-form {
  height: 100% !important;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
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
</style>
