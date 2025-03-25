<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="生成采购订单" />
          <div class="options">
            <!-- <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿</el-button> -->
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              {{ $t('common.submitButton') }}
            </el-button>
            <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
              @click="dataFormSubmit('submit', 'print')">提交并打印</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main" ref="main" v-loading="formLoading">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo" ref="orderInfos">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="" style="margin: 0 5px;">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :span="6">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <!-- 供应商选择弹窗  -->
                          <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                            v-model="dataForm.cooperativePartnerName" :beforeSubmit="beforeSubmit" ref="ComSelect-page"
                            @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'"
                            title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                            :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                            :paramsObj="{ oldData }" :searchList="PartnerTableSearchList" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="交货日期" prop="deliveryDate">
                          <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择交货日期" @change="deliveryDateChange"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="是否生成免检通知单" prop="stockFlag">
                          <el-select v-model="dataForm.noticeFlag" placeholder="请选择是否生成免检通知单" style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in noticeFlagList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="$store.getters.configData.purchase.outConsigneeFlag">
                        <el-form-item label="是否存在外协收货方" prop="stockFlag">
                          <el-select v-model="dataForm.outConsigneeFlag" placeholder="请选择是否存在外协收货方" style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in noticeFlagList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">
                  <div>
                    <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                      <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSeleceProductDialog">
                        选择产品
                      </el-button>
                      |
                      <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">
                        批量删除
                      </el-button>
                      |
                      <JNPF-table :fixedNO="true" hasC ref="multipleTable" @selection-change="handeleProductInfoData"
                        hasNO fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data" border
                        :height="customStyleData">
                        <el-table-column prop="projectName" label="所属项目" width="120" v-if="abProjectSwitchVisible"
                          key="1"></el-table-column>
                        <el-table-column prop="productName" label="产品名称" width="120" v-if="$store.getters.configData.product.enable_productName"
                          key="3" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="productCategoryName" label="产品分类" width="140"
                          show-overflow-tooltip></el-table-column>
                        <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" show-overflow-tooltip
                          key="5">
                          <template slot="header">
                            <span class="required">*</span>
                            品名规格
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'"
                              :rules="productRules.productDrawingNo">
                              <el-input v-model="scope.row.productDrawingNo" placeholder="请输入品名规格" disabled />
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="deliveryDate" label="交货日期" min-width="175" key="7">
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


                        <el-table-column prop="availableQuantity" label="可用库存" width="100" show-overflow-tooltip
                          v-if="this.purchasingType === 'safe'" key="9">
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'availableQuantity'">
                              <div class="viewData">
                                <span>{{ scope.row.availableQuantity }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="maxInventory" label="最高库存" width="100" show-overflow-tooltip
                          v-if="this.purchasingType === 'safe'" :key="11">
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'maxInventory'">
                              <div class="viewData">
                                <span>{{ scope.row.maxInventory }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="orderQuantity" label="可下单数量" min-width="120" show-overflow-tooltip
                          v-if="this.purchasingType === 'pool'" :key="13">
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'orderQuantity'">
                              <div class="viewData">
                                <span>{{ scope.row.orderQuantity }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch ? '单位(主)' : '单位'"
                          :min-width="isDeputyUnitSwitch ? 100 : 60" show-overflow-tooltip :key="15">
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                              <div class="viewData">
                                <span>{{ scope.row.mainUnit }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="purchaseQuantity" label="数量" min-width="140" :key="17">
                          <template slot="header">
                            <span class="required">*</span>
                            {{ isDeputyUnitSwitch ? '数量(主)' : '数量' }}
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                              :rules="productRules.purchaseQuantity">
                              <el-input @input="changePurchaseQuantity(scope.$index, scope.row.purchaseQuantity)"
                                v-model="scope.row.purchaseQuantity" placeholder="数量"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deputyUnit" label="单位(副)" width="100" show-overflow-tooltip :key="19"
                          v-if="isDeputyUnitSwitch">
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'deputyUnit'">
                              <div class="viewData">
                                <span>{{ scope.row.deputyUnit }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="purchaseQuantity2" label="数量(副)" width="120"
                          v-if="isDeputyUnitSwitch" :key="21">
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity2'"
                              :rules="productRules.purchaseQuantity2">
                              <div class="viewData">
                                <span>{{ scope.row.purchaseQuantity2 ? scope.row.purchaseQuantity2 : 0 }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="price" label="含税单价" min-width="140">
                          <template slot="header">
                            <span class="required">*</span>
                            单价(含税)
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                              <el-input v-model="scope.row.price" placeholder="单价(含税)" />
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="totalAmount" label="金额" width="140">
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
                        <el-table-column prop="taxRate" label="税率" min-width="120">
                          <template slot="header">
                            <span class="required">*</span>
                            税率
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'"
                              :rules="productRules.taxRate">
                              <el-select v-model="scope.row.taxRate" placeholder="请选择">
                                <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                                  :value="item.taxRate"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="150">
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                              <div class="viewData">
                                <span>{{ scope.row.excludingTaxPrice }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="taxAmount" label="税额" min-width="100">
                          <template slot="header">
                            <span class="required">*</span>
                            税额
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                              <div class="viewData">
                                <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="180">
                          <template slot="header">
                            <span class="required">*</span>
                            金额(不含税)
                          </template>
                          <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                              <div class="viewData">
                                <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column prop="standardValue" label="规值" width="120"
                          v-if="dataForm.classAttribute !== 'finish_product' && standardValueFlag === '1'">
                          <template slot-scope="scope">
                            <el-form-item>
                              <el-select v-model="scope.row.standardValue" placeholder="请选择" clearable
                                style="width: 100%;">
                                <el-option v-for="(item, index) in bimProductAttributesList.pa008" :key="index"
                                  :label="item.name" :value="item.name"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="this.dataForm.classAttribute == 'finish_product' && sealingCoverTypingFlag === '1'"
                          prop="sealingCoverTyping" label="打字内容" min-width="120">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable
                              style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa007" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="this.dataForm.classAttribute == 'finish_product' && accuracyLevelFlag === '1'"
                          prop="accuracyLevel" label="精度等级" min-width="120">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable>
                              <el-option v-for="(item, index) in bimProductAttributesList.pa006" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>

                        <el-table-column
                          v-if="this.dataForm.classAttribute == 'finish_product' && vibrationLevelFlag === '1'"
                          prop="vibrationLevel" label="振动等级" min-width="120">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable
                              style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa005" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column v-if="this.dataForm.classAttribute == 'finish_product' && oilFlag === '1'"
                          prop="oil" label="油脂" min-width="120">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa002" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="this.dataForm.classAttribute == 'finish_product' && oilQuantityFlag === '1'"
                          prop="oilQuantity" label="油脂量" min-width="160">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa003" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="this.dataForm.classAttribute == 'finish_product' && clearanceFlag === '1'"
                          prop="clearance" label="游隙" min-width="120">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa001" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          v-if="this.dataForm.classAttribute == 'finish_product' && packagingMethodFlag === '1'"
                          prop="packagingMethod" label="包装方式" min-width="120">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable
                              style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa015" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="specialRequire" label="特殊要求" min-width="120"
                          v-if="this.dataForm.classAttribute == 'finish_product' && specialRequireFlag === '1'">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable
                              style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa016" :key="index"
                                :label="item.name" :value="item.id"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="material" label="材质" width="120" v-if="materialFlag == 1">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.material" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa021" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="colour" label="颜色" min-width="120" v-if="colourFlag === '1'">
                          <template slot-scope="scope">
                            <el-form-item>
                              <el-select v-model="scope.row.colour" placeholder="请选择" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in bimProductAttributesList.pa010" :key="index"
                                  :label="item.name" :value="item.name"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="processId" label="工序" min-width="120">
                          <template slot-scope="scope">
                            <el-form-item>
                              <el-select v-model="scope.row.processId" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                                  :value="item.id"></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip key="1">
                          <template slot-scope="scope">
                            <el-form-item>
                              <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="20"
                                placeholder="备注"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column label="操作" width="80" fixed="right" v-if="dataFormTwo.data.length > 1">
                          <template slot-scope="scope">
                            <el-button type="text" class="JNPF-table-delBtn"
                              @click="delequipment_process_relList(scope.$index)">
                              删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </JNPF-table>
                    </el-form>
                    <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                      <span style="font-weight:500;margin-right:10px;margin-left: 5px;">
                        总金额：{{ computedValue }}
                      </span>
                      <span style="font-weight:500;margin-right:10px">总数量：{{ computedValue2 }}</span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
              <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
    <sourceForm v-if="sourceFormVisible" ref="sourceForm" @confirm="sourceFormConfirm" />
    <ComSelect-page v-if="purchasingType == 'pool'" ref="comSelect-page" @change="submitCustomerProduct"
      :tableItems="ProductPoolTableItems" dialogTitle="选择产品" :listMethod="purProcurementDemandPoolList"
      :listRequestObj="ProductPoolListRequestObj" :listDataFormatting="listDataFormatting"
      :searchList="ProductTableSearchList" :elementShow="false" :multiple="true" :renderTree="false" />
    <ComSelect-page v-else ref="comSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems"
      dialogTitle="选择产品" :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
      :listDataFormatting="listDataFormatting" :searchList="ProductTableSearchList" :elementShow="false"
      :multiple="true" :renderTree="false" />
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm"
      @closePrintPage="closePrintPage" />
  </div>
</template>
<script>
import sourceForm from './source.vue'
import { insertPurchaseOrder, partnerProductPrice, priceList } from '@/api/purchasingAndOutsourcingOrders/index'
import { getCooperativeData, getcategoryTree, getBimBusinessDetail } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import { purProcurementDemandPoolList } from '@/api/purchasingManagement/purchaseInquirySheet'
import { getProductList } from '@/api/masterDataManagement/productManage'
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
import { getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import { getBimProcessList } from '@/api/bimProcess/index'
import { getBusinessFlowInfo } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
import { getOrderFiledMap } from '@/api/basicData/index'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo } from '@/api/system/printDev'
export default {
  components: {
    sourceForm,
    Process,
    PrintBrowse,
    PrintDialog
  },
  mixins: [AbProjectMixin],

  data() {
    return {
      printVisible: false,
      printBrowseVisible: false,
      tableDataFlag: false,
      purProcurementDemandPoolList,
      isDeputyUnitSwitch: '',
      getProductList,
      activeNames: ['productInfo', 'basicInfo'],
      datafilelist: [],
      // 选择客户产品参数
      ProductListRequestObj: {
        productSource: 'purchase', // 产品来源
        safeInventoryWarnFlag: 1,
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
      ProductPoolListRequestObj: {
        demandStatus: 'not_finish', //需求状态 需求状态 未完成 not_finish、完成中 finishing、已完成 finished,可用值:finished,finishing,not_finish
        poolType: 'procure', //采购池类型  采购 procure、外协 external,可用值:external,procure
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
        { prop: 'projectName', label: '所属项目', sortable: 'custom',render:false },
        { prop: 'code', label: '产品编码', sortable: 'custom'},
        { prop: 'name', label: '产品名称', sortable: 'custom',render:false },
        { prop: 'drawingNo', label: '品名规格', sortable: 'custom' },
        { prop: 'immediatelyBuyFlag', label: '立即采购', sortable: 'custom' },
        { prop: 'mainUnit', label: '单位' },
        // { prop: 'planDemandQuantity', label: '计划需求数', sortable: 'custom', width: 150 },
        // { prop: 'orderedQuantity', label: '已下单数量', sortable: 'custom', width: 150 },
        { prop: 'deliveryDate', label: '交货日期', sortable: 'custom' },
        { prop: 'createTime', label: '创建日期', sortable: 'custom', width: 180 }
      ],
      ProductPoolTableItems: [
        { prop: 'projectName', label: '所属项目', sortable: 'custom',render:false },
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', sortable: 'custom' },
        { prop: 'productName', label: '产品名称', sortable: 'custom',render:false },
        { prop: 'immediatelyBuyFlag', label: '立即采购', sortable: 'custom' },
        { prop: 'mainUnit', label: '单位' },
        { prop: 'planDemandQuantity', label: '计划需求数', sortable: 'custom', width: 150 },
        { prop: 'orderedQuantity', label: '已下单数量', sortable: 'custom', width: 150 },
        { prop: 'deliveryDate', label: '交货日期', sortable: 'custom' },
        { prop: 'createTime', label: '创建日期', sortable: 'custom', width: 180 }
      ],
      // 客户产品查询条件
      ProductTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },

      ],
      getcooperativeProduct,
      productVisible: false,
      sourceFormVisible: false,
      activeName: 'jcInfo',
      classAttributeFlag: '',
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
        taxAmount: '', // 税额
        noticeFlag:false,
        outConsigneeFlag:false,
        approvalFlag: false, //
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
      noticeFlagList: [{ label: '是', value: true }, { label: '否', value: false }],
      rules: {
        // applicationReason: [{ required: true, message: '请输入申请理由', trigger: ['blur'] }],
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },
      productRules: {
        productDrawingNo: [{ required: true, message: '请输入品名规格', trigger: ['blur'] }],
        productName: [{ required: true, message: '请输入产品名称', trigger: ['blur'] }],
        purchaseQuantity: [
          // 主数量
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`)
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
                  this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`)
            }),
            trigger: 'blur'
          },
        ],
        purchaseQuantity2: [
          // 副数量
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：副数量${errMsg}`)
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
            trigger: ['change']
          },

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
        ],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      purchasingType: 'safe',
      demandDelivery: '',
      demandDelivery2: '',
      olddeliveryDateArr: [], // 表格中旧的数据值
      oldData: [],
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
      taxRateList: [],
      flowTemplateJson: {},
      flowData: {},
      standardValueFlag: '',
      colourFlag: '',
      processFlag: '',
      sealingCoverTypingFlag: '',
      accuracyLevelFlag: '',
      vibrationLevelFlag: '',
      oilFlag: '',
      oilQuantityFlag: '',
      clearanceFlag: '',
      packagingMethodFlag: '',
      specialRequireFlag: '',
      bimProductAttributesList: {}
    }
  },
  async created() {
    await this.getOrderFiledMap()
    await this.getProjectList()
    await this.switchStyleheight()
   

    this.tableDataFlag = true
    this.formLoading = false

    this.getBimBusinessDetail()
  },
  computed: {
    ...mapGetters(['userInfo']),
    computedValue() {
      // 在这里计算第三个输入框的值
      let excludingCount = 0
      let count = 0
      let taxAmountCount = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.totalAmount * 1
        excludingCount += item.excludingTaxAmount * 1
        taxAmountCount += item.taxAmount * 1
      })
      this.dataForm.totalAmount = this.jnpf.numberFormat(count)
      this.dataForm.excludingTaxTotalAmount = this.jnpf.numberFormat(excludingCount)
      this.dataForm.taxAmount = this.jnpf.numberFormat(taxAmountCount)
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
          if ((item.price && item.taxRate) || (item.price && item.taxRate === 0)) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1) / 100))
          } else {
            item.excludingTaxPrice = ''
          }
          if (item.purchaseQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.purchaseQuantity * item.excludingTaxPrice)
          } else {
            item.excludingTaxAmount = ''
          }
          if (item.price && item.purchaseQuantity && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.purchaseQuantity - item.excludingTaxAmount)
          } else {
            item.taxAmount = ''
          }
          if (item.excludingTaxAmount && item.taxAmount) {
            item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          } else {
            item.totalAmount = ''
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
    getOrderFiledMap() {
      getOrderFiledMap('purchase').then((res) => {
        this.standardValueFlag = res.data.standardValue
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
    },
    deliveryDateChange(val) {
      this.dataFormTwo.data.forEach((item) => {
        if (!item.deliveryDate) {
          this.$set(item, 'deliveryDate', val) // 总金额(不含税)
        }
      })
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_cgdd'
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isattachmentswitch = res.data.configValue1
      })
    },
    listDataFormatting(res) {
      res.data.records.forEach((item, index) => {
        if (item.immediatelyBuyFlag) {
          item.immediatelyBuyFlag = '是'
        } else {
          item.immediatelyBuyFlag = '否'
        }
      })
      return res.data.records
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
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
        this.list8 = res.data.records
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log(this.taxRateList, 'LOOO')
      })
    },
    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {
      this.ProductTableSearchList = [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
      ]
      if (this.$store.getters.configData.product.enable_productName) {
      this.ProductTableItems.forEach(tc=>{
        if (tc.prop === 'name') {
          tc.render = true
        }
      })
      this.ProductPoolTableItems.forEach(tc=>{
          if (tc.prop === 'productName') {
            tc.render = true
          }
        })
      let index = this.ProductTableSearchList.findIndex((obj) => obj.prop === 'productCode')
      this.ProductTableSearchList.splice(index+1, 0, { prop: 'productName', label: '产品名称', type: 'input' })
      }
      if (this.abProjectSwitchVisible) {
        this.ProductTableItems.forEach(tc=>{
          if (tc.prop === 'projectName') {
            tc.render = true
          }
        })
        this.ProductPoolTableItems.forEach(tc=>{
          if (tc.prop === 'projectName') {
            tc.render = true
          }
        })
        this.ProductTableSearchList.unshift({ prop: 'projectId', label: '所属项目', type: 'select',options:this.abProjectNoCommonList })
        this.ProductListRequestObj.projectId = this.abIsCommonUser ? '' : this.abProjectId
        this.ProductPoolListRequestObj.projectId = this.abIsCommonUser ? '' : this.abProjectId
      }
      this.$refs['comSelect-page'].openDialog()
    },
    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct(val, data, paramsObj) {
      this.productVisible = false
      data = data.filter((obj1) => !this.dataFormTwo.data.some((obj2) => obj2.id === obj1.id))
      data.forEach((i) => {
        const item = i.all
        console.log(item, 'oooo')
        if (this.purchasingType == 'pool') {
          this.$set(item, 'purchaseQuantity', item.planDemandQuantity)
          if (item.calculationDirection === 'multiplication') {
            item.purchaseQuantity2 = this.numberFormat(item.purchaseQuantity * item.ratio)
          } else {
            item.purchaseQuantity2 = this.numberFormat(item.purchaseQuantity * item.ratio)
          }
        } else {
          this.$set(item, 'purchaseQuantity', Number(item.maxInventory) - Number(item.availableQuantity))
          item.productDrawingNo = item.drawingNo
          if (item.calculationDirection === 'multiplication') {
            item.purchaseQuantity2 = this.numberFormat(item.purchaseQuantity * item.ratio)
          } else {
            item.purchaseQuantity2 = this.numberFormat(item.purchaseQuantity * item.ratio)
          }
        }
        if (item.taxRate) {
          item.excludingTaxPrice = this.jnpf.numberFormat(Number(item.price) / (1 + Number(item.taxRate) / 100), 6)
        } else {
          item.excludingTaxPrice = item.price
        }
        if (this.btnType == 'edit') {
          item.id = ''
        }
        this.dataFormTwo.data.push(item)

        var maxDate = null // 最大日期初始值设为null
        for (var i = 0; i < this.dataFormTwo.data.length; i++) {
          var currentDate = new Date(this.dataFormTwo.data[i].deliveryDate)
          if (maxDate === null || currentDate > maxDate) {
            maxDate = currentDate
          }
          this.$set(this.dataFormTwo.data[i], 'excludingTaxAmount', '') // 总金额(不含税)
          // this.$set(this.dataFormTwo.data[i], 'excludingTaxPrice', '')    // 	不含税单价
          this.$set(this.dataFormTwo.data[i], 'fixedPrice', '') //  	定价
          if (!this.dataFormTwo.data[i].price) {
            this.$set(this.dataFormTwo.data[i], 'price', '') // 	价税合计
          }
          this.$set(this.dataFormTwo.data[i], 'taxAmount', '') // 税额
          // this.$set(this.dataFormTwo.data[i], 'taxRate', 13) // taxRate
          if (!this.dataFormTwo.data[i].totalAmount) {
            this.$set(this.dataFormTwo.data[i], 'totalAmount', '') // 	价税合计
          }

          this.$set(
            this.dataFormTwo.data[i],
            'orderQuantity',
            this.dataFormTwo.data[i].planDemandQuantity -
            (this.dataFormTwo.data[i].orderedQuantity ? this.dataFormTwo.data[i].orderedQuantity : 0)
          ) // 	可下单数量
          this.olddeliveryDateArr.push(this.dataFormTwo.data[i].deliveryDate)
        }
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
      // if (!this.dataForm.transferOutWarehouseName) return true
      let flag = true
      if (paramsObj.oldData.length) {
        flag = await this.$confirm('切换供应商将更新产品信息的含税单价和税率，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '更换成功!'
            })
            // this.$refs['productForm'].resetFields()
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
          console.log(res, 'df')
          if (res.data.length === 0) {
            this.dataFormTwo.data.forEach((item) => {
              console.log(item, 'p[[[]]]')
              item.price = item.purchasePrice
              item.fixedPrice = item.purchasePrice
              this.$set(item, 'taxRate', Number(item.purchaseTaxRate))
            })
          } else {
            res.data.forEach((item) => {
              const targetList = this.dataFormTwo.data.filter((line) => line.productsId === item.productId)
              targetList.forEach((line) => {
                this.$set(line, 'fixedPrice', item.price)
                this.$set(line, 'price', item.price)
                this.$set(line, 'excludingTaxPrice', item.excludingTaxPrice)
                this.$set(line, 'taxRate', Number(item.taxRate))
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
    init(data, classAttributeFlag, type) {
      this.formLoading = true
      this.isDeputyUnitSwitch = this.$store.getters.configData.deputyUnit.procureDeputyUnit
      console.log(data, 'uuuu')
      console.log(classAttributeFlag, 'classAttributeFlag')
      this.purchasingType = type
      console.log(this.purchasingType, 'this.purchasingType')
      data.forEach((item) => {
        if (item.productDrawingNo) {
          item.productDrawingNo = item.productDrawingNo
        } else {
          item.productDrawingNo = item.drawingNo
        }
        if (this.purchasingType == 'pool') {
          console.log(333)
          item.purchaseQuantity = Number(item.planDemandQuantity) - Number(item.orderedQuantity)
          if (item.calculationDirection === 'multiplication') {
            item.purchaseQuantity2 = this.numberFormat(item.purchaseQuantity * item.ratio)
          } else {
            item.purchaseQuantity2 = this.numberFormat(item.purchaseQuantity * item.ratio)
          }

        } else {
          item.purchaseQuantity = Number(item.maxInventory) - Number(item.availableQuantity)
          if (item.calculationDirection === 'multiplication') {
            item.purchaseQuantity2 = this.numberFormat(item.purchaseQuantity * item.ratio)
          } else {
            item.purchaseQuantity2 = this.numberFormat(item.purchaseQuantity * item.ratio)
          }

        }
      })

      this.dataForm.classAttribute = classAttributeFlag
      this.ProductListRequestObj = {
        classAttribute: this.dataForm.classAttribute,
        productSource: 'purchase', // 产品来源
        safeInventoryWarnFlag: 1,
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
      this.ProductPoolListRequestObj = {
        classAttribute: this.dataForm.classAttribute,
        demandStatus: 'not_finish', //需求状态 需求状态 未完成 not_finish、完成中 finishing、已完成 finished,可用值:finished,finishing,not_finish
        poolType: 'procure', //采购池类型  采购 procure、外协 external,可用值:external,procure
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
      this.getProductClassFun()

      // if (!demandDelivery) { // 没有日期，代表从重新提交中进来的
      // this.dataForm = data
      this.$set(this.dataFormTwo, 'data', JSON.parse(JSON.stringify(data)))

      // }
      // else {
      //   // 避免传递过来的数据 输入框设置默认值后无法修改 因为内存地址的问题 指向了同一个
      //   this.$set(this.dataFormTwo, "data", JSON.parse(JSON.stringify(data)))
      // }

      var maxDate = null // 最大日期初始值设为null
      // 遍历数组，比较日期来找到最大日期
      for (var i = 0; i < this.dataFormTwo.data.length; i++) {
        console.log(this.dataFormTwo.data[i], 'this.dataFormTwo.data[i]')
        var currentDate = new Date(this.dataFormTwo.data[i].deliveryDate)
        if (maxDate === null || currentDate > maxDate) {
          maxDate = currentDate
        }
        this.$set(this.dataFormTwo.data[i], 'excludingTaxAmount', '') // 总金额(不含税)
        // this.$set(this.dataFormTwo.data[i], 'excludingTaxPrice', '')    // 	不含税单价
        this.$set(this.dataFormTwo.data[i], 'fixedPrice', '') //  	定价
        this.$set(this.dataFormTwo.data[i], 'price', '') //  	含税单价
        this.$set(this.dataFormTwo.data[i], 'taxAmount', '') // 税额
        this.$set(this.dataFormTwo.data[i], 'taxRate', '') // taxRate
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
      this.getBusInfo()
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
    async dataFormSubmit(type, printType) {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用

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
      this.dataForm.documentStatus = type
      if (this.dataForm.approvalFlag) {
        this.dataForm.approvalStatus = 'ing'
      } else {
        this.dataForm.approvalStatus = 'ok'
      }
      if (submitFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'system_attachment',
              configKey: this.dataForm.classAttribute == 'finish_product' ? 'fj_cgdd' : 'fj_cgdd',
              categoryId: this.categoryId,
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        this.btnLoading = true
        let dataTwo = []
        dataTwo = this.dataFormTwo.data.map((obj) => {
          return {
            ...obj,
            procurementDemandPoolId: obj.id,
            productsId: obj.productsId ? obj.productsId : obj.id,
            id: null
          }
        })
        this.dataForm.attachmentList = this.datafilelist
        this.dataForm.purchaseOrderLines = dataTwo
        let _data = {
          ...this.dataForm,
          flowData: this.flowData
        }
        console.log(_data, 'data')
        
        insertPurchaseOrder(_data)
          .then((res) => {
            if (res.msg === 'Success') res.msg = '保存成功'

            if (printType) {

              this.enCode = 'p006'
              this.formId = res.data
              this.fullName = '外协收货单'

              this.printVisible = true
              this.$nextTick(() => {
                this.$refs.printTemplate.init(this.enCode)
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false
                  this.$emit('close', true)
                }
              })
            }
          })
          .catch(() => {
            this.btnLoading = false
          })
      } else {
        this.btnLoading = false
      }
    },
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          // this.printVisible = false
          this.prindId = res.data.id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    closePrint() {
      this.btnLoading =false
      this.printVisible = false
      this.$message.warning("取消打印")
    },
    closePrintPage() {
      this.$emit('close', true)
    },
    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },

    switchStyleheight() {
      const mainRegion1 = this.$refs.main // 表单页面区域
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 400
      console.log(maxHeight, 'maxHeight')
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },
    // 测试审批流
    getBusInfo() {
      let code = this.dataForm.classAttribute === 'other' ? 'b009' : 'b028'
      getBusinessFlowInfo(code)
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
    }
  },
  mounted() {

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
  /* margin-right: 4px; */
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
  padding-bottom: 5px !important;
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
  padding-bottom: 10px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: -1px !important;
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

/* ::v-deep .el-table--small .el-table__cell {
  padding: 0 10px !important;
} */
::v-deep .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0;
}
</style>
