<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <el-page-header @back="goBack" :content="title" />
          <!-- <el-page-header @back="goBack" :content="type === 'look' ? '查看外协订单' : '新建外协订单'" /> -->
          <div class="options" v-if="type !== 'look'">
            <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
              保存草稿
            </el-button>
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main">
          <el-tabs v-model="activeName" v-if="!approvalFlag">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :span="6" v-if="type === 'look'">
                        <el-form-item label="外协单号" prop="orderNo" ref="orderNo">
                          <el-input :disabled="type == 'look'" type="text" v-model="dataForm.orderNo"
                            placeholder="外协单号"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <el-input :disabled="type == 'look'" v-model="dataForm.cooperativePartnerName"
                            placeholder="请选择供应商名称" @focus="openDialog"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="交货日期" prop="deliveryDate">
                          <el-date-picker :disabled="type == 'look'" v-model="dataForm.deliveryDate" type="date"
                            value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="dataPickerOptions2"
                            placeholder="请选择交货日期"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" v-if="type === 'look'">
                        <el-form-item label="订单状态" prop="receivingStatus" ref="receivingStatus">
                          <el-select v-model="value" style="width: 100%;" placeholder="请选择"
                            :disabled="type !== 'add' ? true : false">
                            <el-option v-for="item in receivingStatusOptions" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                    <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                      :data="dataFormTwo.data" id="table">
                      <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                      <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                            <div class="viewData">
                              <span>{{ scope.row.drawingNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                            <div class="viewData">
                              <span>{{ scope.row.productCode }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                            <div class="viewData">
                              <span>{{ scope.row.productName }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column> -->

                      <el-table-column prop="planDemandQuantity" label="计划需求数量" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'planDemandQuantity'">
                            <div class="viewData">
                              <span>{{ scope.row.planDemandQuantity ? scope.row.planDemandQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="purchaseQuantity" label="订单数量" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                            :rules="productRules.purchaseQuantity">
                            <div class="viewData">
                              <span>{{ scope.row.purchaseQuantity ? scope.row.purchaseQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="receiptQuantity" label="已入库数量" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'receiptQuantity'"
                            :rules="productRules.receiptQuantity">
                            <div class="viewData">
                              <span>{{ scope.row.receiptQuantity ? scope.row.receiptQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="price" label="含税单价" min-width="120">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">
                            <div class="viewData">
                              <span>{{ scope.row.price ? scope.row.price : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="taxRate" label="税率%" min-width="100">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                            <div class="viewData">
                              <span>{{ scope.row.taxRate }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <!-- <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="160">
                
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                 
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxPrice  ? scope.row.excludingTaxPrice  : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="excludingTaxAmount" label="总金额" min-width="160">
               
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                 
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount  : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                      <el-table-column prop="taxAmount" label="税额" min-width="120">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="totalAmount" label="价税合计" min-width="140">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="deliveryDate" label="交货日期" min-width="240">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'">
                            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" disabled :picker-options="dataPickerOptions"
                              placeholder="请选择交货日期"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="receivingStatus" label="订单状态" width="130">
                        <template slot-scope="scope">
                          <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag></div>
                          <div v-if="scope.row.receivingStatus == 'received'">
                            <el-tag type="success">已完成</el-tag>
                          </div>
                          <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="220">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" disabled maxlength="20"
                            :placeholder="type == 'look' ? '' : '请输入备注'">
                            {{ scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" :disabled="sourceDisabled"
                            @click="handlerOpenSource(scope.$index, 'source')">
                            查看发料清单
                          </el-button>
                        </template>
                      </el-table-column> -->
                    </el-table>
                  </el-form>

                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin-right:10px">
                      总金额：{{ dataForm.excludingTaxTotalAmount }}
                    </span>
                    <span style="font-weight:500;margin-right:10px">总税额：{{ dataForm.taxAmount }}</span>
                    <span style="font-weight:500;margin-right:10px">价税合计：{{ dataForm.totalAmount }}</span>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="发料清单信息" name="materialInfo">
                  <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="linesList" :data="linesList"
                    id="table">
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="160"></el-table-column>
                    <el-table-column prop="productCode" label="产品编码" min-width="140"></el-table-column>
                    <el-table-column prop="processName" label="工序名称" min-width="140"></el-table-column>
                    <el-table-column prop="mainUnit" label="单位" min-width="140"></el-table-column>
                    <el-table-column prop="purchaseQuantity" label="基本数量" min-width="140"></el-table-column>
                    <el-table-column prop="demandQuantity" label="发料数量" min-width="140"></el-table-column>
                    <el-table-column prop="undeliveredQuantity" label="待出库数量" min-width="140"></el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>

            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
              <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
            </el-tab-pane>
            <el-tab-pane v-if="type == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
              <recordList :list="flowTaskOperatorRecordList" :endTime="endTime" />
            </el-tab-pane>
          </el-tabs>
          <el-collapse v-model="activeNames" v-else>
            <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :span="6" v-if="type === 'look'">
                    <el-form-item label="外协单号" prop="orderNo" ref="orderNo">
                      <el-input :disabled="type == 'look'" type="text" v-model="dataForm.orderNo"
                        placeholder="外协单号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                      <el-input :disabled="type == 'look'" v-model="dataForm.cooperativePartnerName"
                        placeholder="请选择供应商名称" @focus="openDialog"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="交货日期" prop="deliveryDate">
                      <el-date-picker :disabled="type == 'look'" v-model="dataForm.deliveryDate" type="date"
                        value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="dataPickerOptions2"
                        placeholder="请选择交货日期"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="type === 'look'">
                    <el-form-item label="订单状态" prop="receivingStatus" ref="receivingStatus">
                      <el-select v-model="value" placeholder="请选择" :disabled="type !== 'add' ? true : false">
                        <el-option v-for="item in receivingStatusOptions" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-collapse-item>

            <el-collapse-item title="产品信息" name="productInfo">
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table">
                  <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                  <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                        <div class="viewData">
                          <span>{{ scope.row.drawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                        <div class="viewData">
                          <span>{{ scope.row.productCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="planDemandQuantity" label="计划需求数量" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'planDemandQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.planDemandQuantity ? scope.row.planDemandQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="purchaseQuantity" label="订单数量" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                        :rules="productRules.purchaseQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.purchaseQuantity ? scope.row.purchaseQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="receiptQuantity" label="已入库数量" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'receiptQuantity'"
                        :rules="productRules.receiptQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.receiptQuantity ? scope.row.receiptQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
          

                  <el-table-column prop="price" label="含税单价" min-width="120">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">
                        <div class="viewData">
                          <span>{{ scope.row.price ? scope.row.price : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="taxRate" label="税率%" min-width="100">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                        <div class="viewData">
                          <span>{{ scope.row.taxRate }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="taxAmount" label="税额" min-width="120">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="totalAmount" label="价税合计" min-width="140">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="deliveryDate" label="交货日期" min-width="240">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'">
                        <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                          style="width: 100%;" disabled :picker-options="dataPickerOptions"
                          placeholder="请选择交货日期"></el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="receivingStatus" label="订单状态" width="130">
                    <template slot-scope="scope">
                      <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag></div>
                      <div v-if="scope.row.receivingStatus == 'received'">
                        <el-tag type="success">已完成</el-tag>
                      </div>
                      <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="220">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" disabled maxlength="20"
                        :placeholder="type == 'look' ? '' : '请输入备注'">
                        {{ scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" :disabled="sourceDisabled"
                        @click="handlerOpenSource(scope.$index, 'source')">
                        查看发料清单
                      </el-button>
                    </template>
                  </el-table-column> -->
                </el-table>
              </el-form>

              <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin-right:10px">总金额：{{ dataForm.excludingTaxTotalAmount }}</span>
                <span style="font-weight:500;margin-right:10px">总税额：{{ dataForm.taxAmount }}</span>
                <span style="font-weight:500;margin-right:10px">价税合计：{{ dataForm.totalAmount }}</span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="发料清单信息" name="materialInfo">
              <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="linesList" :data="linesList"
                id="table">
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="160"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="140"></el-table-column>
                <el-table-column prop="processName" label="工序名称" min-width="140"></el-table-column>
                <el-table-column prop="mainUnit" label="单位" min-width="140"></el-table-column>
                <el-table-column prop="purchaseQuantity" label="基本数量" min-width="140"></el-table-column>
                <el-table-column prop="demandQuantity" label="发料数量" min-width="140"></el-table-column>
                <el-table-column prop="undeliveredQuantity" label="待出库数量" min-width="140"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </transition>
    <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area>
  </div>
</template>
<script>
import { editOutOrder, purPurchaseOrderdetail, orderSchedule } from '@/api/purchasingAndOutsourcingOrders/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow'
import recordList from '@/views/workFlow/components/RecordList.vue'
import { getShipmentList } from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import SourceArea from '../orderCreation/source.vue'
export default {
  components: { Process, recordList, SourceArea },
  mixins: [busFlow],
  data() {
    return {
      title: '',
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo', 'materialInfo'],
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      sourceVisibled: false,
      dataForm: {
        cooperativePartnerName: '', //供应商名称
        deliveryDate: '', //交货日期.
        orderNo: '',
        orderType: 'external_process',
        purchaseOrderLines: [],
        excludingTaxTotalAmount: '', //订单 不含税总金额
        totalAmount: '', //   含税总金额
        taxAmount: '', // 税额
        approvalFlag: false
      },
      receivingStatusOptions: [
        {
          value: 'not_finished',
          label: '未完成'
        },
        {
          value: 'finished',
          label: '已完成'
        },
        {
          value: 'stopped',
          label: '已停止'
        }
      ],
      dataPickerOptions: {
        // 日期区间选择器通用选项
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      dataPickerOptions2: {
        // 日期区间选择器通用选项
        disabledDate: this.disabledDate
      },
      type: '',
      dataFormArr: [],
      rules: {},
      productRules: {},
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      demandDelivery: '',
      linesList: [],
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0
    }
  },
  created() { },

  methods: {
    // 抽屉提交
    handlerConfirm(data) {

      console.log(data, '资源资源数据')
      this.dataFormTwo.data[this.index].outShipmentList = data
    },

    disabledDate(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time)
      const targetDate = new Date(this.demandDelivery)
      // 检查日期是否大于给定日期
      return currentDate > targetDate
    },
    // 对比日期方法
    changeDate(d1, d2) {
      return new Date(d1.replace((/-/g, '\/'))) > new Date(d2.replace(/-/g, '\/'))
    },

    // 打开选择供应商弹窗
    openDialog() {
      this.$refs['SupplierRef'].openDialog()
    },
    supplierdata(data) {
      if (data.length === 0) {
        this.$refs['elForm'].validateField('cooperativePartnerName')
      } else {
        this.$refs['elForm'].fields[0].resetField()
        this.dataForm.cooperativePartnerName = data.name
        this.dataForm.cooperativePartnerCode = data.code
        this.dataForm.cooperativePartnerId = data.id
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
    },

    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type, approvalFlag) {

      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.type = type
      this.approvalFlag = approvalFlag
      if (id) {
        if (this.type == 'edit') {
          this.title = '编辑外协订单'
        } else if (this.type == 'look') {
          this.title = '查看外协订单'
        }
      } else {
        this.title = '新建外协订单'
        this.getBusInfo()
      }
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          purPurchaseOrderdetail(this.dataForm.id).then((res) => {
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
            this.dataForm = res.data
            this.dataFormTwo.data = res.data.purchaseOrderLineVOList
            this.linesList = res.data.purchaseOrderLineVOList[0].outShipmentVOList
            if (this.type === 'edit') {
              this.getBusInfo()
            } else {
              // 流程信息和流转记录
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
            }
          })
        }
      })
    },
    // 表单提交
    handleSubmit(type) {
      this.request(type)
    },
    // 配置资源
    handlerOpenSource(index, type) {
      this.sourceVisibled = true

      this.$nextTick(() => {
        this.$refs['sourceRef'].init(this.dataFormTwo.data[index].outShipmentVOList, 'look')
      })
    },
    async request(type) {
      let _data
      let hasCostPrice = true
      this.btnLoading = true
      this.dataForm.documentStatus = type

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
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.taxAmount * 1
      })
      this.dataForm.taxAmount = this.jnpf.numberFormat(count)
      _data = {
        ...this.dataForm,
        attachmentList: this.datafilelist,
        purProcurementRequirements: this.dataForm,
        purchaseOrderLines: this.dataFormTwo.data,
        flowData: this.flowData,
        orderType: 'external_process'
      }

      let msg = ''
      if (this.dataForm.documentStatus === 'draft') {
        msg = '保存成功'
      } else {
        msg = '提交成功'
      }
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      if (hasCostPrice) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.data.length === 0) {
              this.btnLoading = false
              this.$message.error('请至少选择一项产品')
            } else {
              if (!valid_2) {

                this.btnLoading = false
                for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                  const item = this.dataFormTwo.data[i]
                  if (!item.planQuantity) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的主数量',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.deliveryDate) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的交货日期',
                      duration: 1500
                    })
                    break
                  }
                }
                return
              } else {
                this.btnLoading = true

                if (this.type === 'add') {
                  insertOutOrder(_data)
                    .then((res) => {
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
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                } else {
                  editOutOrder(_data)
                    .then((res) => {
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
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                }
              }
            }
          } else {
            this.btnLoading = false
          }
        })
      } else {
        this.btnLoading = false
      }
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b011')
        .then((res) => {
          if (res.data) {
            if (res.data.enabledMark) {
              this.flowData = res.data
              this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
              this.dataForm.approvalFlag = res.data.enabledMark
            } else {
              this.flowTemplateJson = {}
              this.dataForm.approvalFlag = false
              this.$message.error('未找到审批流程！')
            }
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
          }
        })
        .catch(() => { })
    },
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id)
        .then((res) => {
          if (res.data) {
            this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson
              ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson)
              : null
            this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
            this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
            let flowTaskNodeList = res.data.flowTaskNodeList
            if (flowTaskNodeList.length) {
              for (let i = 0; i < flowTaskNodeList.length; i++) {
                const nodeItem = flowTaskNodeList[i]
                const loop = (data) => {
                  if (Array.isArray(data)) data.forEach((d) => loop(d))
                  if (data.nodeId === nodeItem.nodeCode) {
                    if (nodeItem.type == 0) data.state = 'state-past'
                    if (nodeItem.type == 1) data.state = 'state-curr'
                    if (
                      nodeItem.nodeType === 'approver' ||
                      nodeItem.nodeType === 'start' ||
                      nodeItem.nodeType === 'subFlow'
                    )
                      data.content = nodeItem.userName
                    return
                  }
                  if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                  if (data.childNode) loop(data.childNode)
                }
                loop(this.flowTemplateJson)
              }
            }
          }
        })
        .catch(() => { })
    }
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
  padding: 0 10px 10px;
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
  padding: 10px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
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

/* 进度跟踪样式 */
::v-deep #pane-schedule {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  /* padding: 0 20px; */
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}

::v-deep .el-progress-bar {
  padding-right: 65px !important;
}

::v-deep .el-progress__text {
  margin-left: -7px !important;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
