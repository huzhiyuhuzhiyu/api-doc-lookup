<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <!-- <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading"
            @click="handleConfirm('draft')">保存草稿</el-button> -->
          <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
            @click="handleConfirm('submit')">提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
              :element-loading-text="loadingText">
              <el-tabs v-model="activeName" v-if="!approvalFlag && dataForm.approvalFlag">
                <el-tab-pane label="基础信息" name="orderInfo" class="orderInfo">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px"
                        label-position="top">
                        <el-row :gutter="30" class="custom-row">
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="单号" prop="orderNo">
                              <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                                :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                                maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="业务单号" prop="sourceNo">
                              <el-input v-model="dataForm.sourceNo" placeholder="请输入业务单号" disabled maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="业务类型" prop="businessType">
                              <el-select v-model="dataForm.businessType" placeholder="请选择业务类型" style="width: 100%;"
                                disabled>
                                <el-option v-for="(item, index) in sourceTypeList" :key="index" :label="item.label"
                                  :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                            <el-col :sm="6" :xs="24" v-if="btnType !== 'look'">
                                <el-form-item label="批次号生成规则" prop="diffBatchNumFlag">
                                    <el-select v-model="dataForm.diffBatchNumFlag" placeholder="请选择批次号生成规则"
                                               style="width: 100%;">
                                        <el-option v-for="(item, index) in diffBatchList" :key="index"
                                                   :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="仓库" prop="warehouseName">
                              <ComSelect-list
                                :requestObj="{ type: 'normal', state: 'enable', projectId: isProjectSwitch === '1' ? dataForm.projectId || '' : '' }"
                                :dialogTitle="'选择仓库'" :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName"
                                :method="getWarehouseList" placeholder="请选择仓库"
                                @change="changeWarehousex"></ComSelect-list>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="单据日期" prop="orderDate">
                              <el-date-picker v-model="dataForm.orderDate" type="date" :clearable="false"
                                :disabled="btnType == 'look' ? true : false" value-format="yyyy-MM-dd"
                                style="width: 100%;" placeholder="请选择单据日期"></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="12" :xs="24">
                            <el-form-item label="备注" prop="remark">
                              <el-input v-model="dataForm.remark" placeholder="请输入备注"
                                :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2"
                                maxlength="200" />
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </el-collapse-item>



                    <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                      <!-- <div v-if="btnType !== 'look'">
                        <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                          :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>

                      </div> -->

                      <JNPF-table ref="product" :data="productData" :fixedNO="true" border :key="165"
                        style="width: 100%;">



                        <el-table-column prop="productCode" label="产品编码" width="120" :key="4" show-overflow-tooltip />
                        <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'"
                          min-width="160" />
                          <el-table-column prop="productDrawingNo" label="品名规格" min-width="320" :key="6"
                          show-overflow-tooltip> </el-table-column>
                        <el-table-column prop="projectName" label="所属项目" v-if="isProjectSwitch == '1'"
                          min-width="160" />
                        <el-table-column prop="processName" label="工序" width="120" />
                        <el-table-column v-if="!dataForm.diffBatchNumFlag" prop="batchNumber" label="批次号" min-width="200" :key="101132">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.batchNumber"   :disabled="btnType == 'look'"
                              placeholder="批次号">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="shelfSpaceName" label="库位" min-width="120" :key="10112"
                          v-if="allocationFlag">
                          <template slot="header">
                            <span class="required">*</span>库位
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.shelfSpaceName" readonly :disabled='btnType == "look"'
                              @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="库位">
                            </el-input>

                          </template>
                        </el-table-column>
                        <el-table-column prop="waitReceivedQuantity" label="待入库数量" width="140"
                          v-if="btnType != 'look'"></el-table-column>


                        <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
                        <el-table-column prop="num" :label="mainUnitFlag == 1 ? '入库数量(主)' : '入库数量'" min-width="160">
                          <template slot="header">
                            <span class="required">*</span>{{ mainUnitFlag == 1 ? '入库数量(主)' : '入库数量' }}
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.num" placeholder="入库数量(主)" :disabled="btnType == 'look'"
                              @input="watchNum(scope.row, scope.$index)">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="deputyNum" label="入库数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="remark" label="备注" width="200">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
                          </template>
                        </el-table-column>

                      </JNPF-table>



                    </el-collapse-item>

                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                  <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'">
                  </UploadWj>
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                  <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                </el-tab-pane>
                <el-tab-pane v-if="btnType == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
                  <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                </el-tab-pane>
              </el-tabs>
              <el-tabs v-model="activeName" v-else>
                <el-tab-pane label="基础信息" name="orderInfo" class="orderInfo">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px"
                        label-position="top">
                        <el-row :gutter="30" class="custom-row">
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="单号" prop="orderNo">
                              <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                                :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                                maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="业务单号" prop="sourceNo">
                              <el-input v-model="dataForm.sourceNo" placeholder="请输入业务单号" disabled maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="业务类型" prop="businessType">
                              <el-select v-model="dataForm.businessType" placeholder="请选择业务类型" style="width: 100%;"
                                disabled>
                                <el-option v-for="(item, index) in sourceTypeList" :key="index" :label="item.label"
                                  :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                            <el-col :sm="6" :xs="24" v-if="btnType !== 'look'">
                                <el-form-item label="批次号生成规则" prop="diffBatchNumFlag">
                                    <el-select v-model="dataForm.diffBatchNumFlag" placeholder="请选择批次号生成规则"
                                               style="width: 100%;">
                                        <el-option v-for="(item, index) in diffBatchList" :key="index"
                                                   :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="仓库" prop="warehouseName">
                              <ComSelect-list
                                :requestObj="{ type: 'normal', state: 'enable', projectId: isProjectSwitch === '1' ? dataForm.projectId || '' : '' }"
                                :dialogTitle="'选择仓库'" :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName"
                                :method="getWarehouseList" placeholder="请选择仓库"
                                @change="changeWarehousex"></ComSelect-list>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="单据日期" prop="orderDate">
                              <el-date-picker v-model="dataForm.orderDate" type="date" :clearable="false"
                                :disabled="btnType == 'look' ? true : false" value-format="yyyy-MM-dd"
                                style="width: 100%;" placeholder="请选择单据日期"></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="12" :xs="24">
                            <el-form-item label="备注" prop="remark">
                              <el-input v-model="dataForm.remark" placeholder="请输入备注"
                                :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2"
                                maxlength="200" />
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </el-collapse-item>



                    <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                      <!-- <div v-if="btnType !== 'look'">
                        <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                          :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>

                      </div> -->

                      <JNPF-table ref="product" :data="productData" :fixedNO="true" border :key="165"
                        style="width: 100%;">



                        <el-table-column prop="productCode" label="产品编码" width="120" :key="4" show-overflow-tooltip />
                        <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'"
                          min-width="160" />
                          <el-table-column prop="productDrawingNo" label="品名规格" min-width="320" :key="6"
                          show-overflow-tooltip> </el-table-column>
                        <el-table-column prop="projectName" label="所属项目" v-if="isProjectSwitch == '1'"
                          min-width="160" />
                        <el-table-column prop="processName" label="工序" width="120" />
                        <el-table-column  v-if="!dataForm.diffBatchNumFlag" prop="batchNumber" label="批次号" min-width="200" :key="101132">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.batchNumber"   :disabled="btnType == 'look'"
                              placeholder="批次号">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="shelfSpaceName" label="库位" min-width="120" :key="10112"
                          v-if="allocationFlag">
                          <template slot="header">
                            <span class="required">*</span>库位
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.shelfSpaceName" readonly :disabled='btnType == "look"'
                              @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="库位">
                            </el-input>

                          </template>
                        </el-table-column>
                        <el-table-column prop="waitReceivedQuantity" label="待入库数量" width="140"
                          v-if="btnType != 'look'"></el-table-column>


                        <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
                        <el-table-column prop="num" :label="mainUnitFlag == 1 ? '入库数量(主)' : '入库数量'" min-width="160">
                          <template slot="header">
                            <span class="required">*</span>{{ mainUnitFlag == 1 ? '入库数量(主)' : '入库数量' }}
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.num" placeholder="入库数量(主)" :disabled="btnType == 'look'"
                              @input="watchNum(scope.row, scope.$index)">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="deputyNum" label="入库数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="remark" label="备注" width="200">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
                          </template>
                        </el-table-column>

                      </JNPF-table>



                    </el-collapse-item>

                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                  <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'">
                  </UploadWj>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <!-- 选择产品信息 -->
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
        @close="productVisible = false" :visible.sync="productVisible" lock-scroll
        class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.productionOrderNo" placeholder="任务单号" clearable
                      @keyup.enter.native="searchProductFun()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.orderNo" placeholder="工单号" clearable
                      @keyup.enter.native="searchProductFun()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.productDrawingNo" placeholder="品名规格" clearable
                      @keyup.enter.native="searchProductFun()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.processName" placeholder="工序名称" clearable
                      @keyup.enter.native="searchProductFun()" />
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
              <JNPF-table v-loading="listLoading" :data="productList" hasC :fixedNO="true"
                @selection-change="handleSelectionChangeAllPruduct" ref="form">
                <el-table-column prop="productionOrderNo" label="任务单号" width="180" />
                <el-table-column prop="orderNo" label="工单号" width="180" />
                <el-table-column prop="productName" label="产品编码" width="160" />
                <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160" />
                <el-table-column prop="productDrawingNo" label="品名规格" width="300" />
                <el-table-column prop="projectName" label="所属项目" v-if="isProjectSwitch == '1'" min-width="160" />
                <el-table-column prop="processName" label="工序名称" width="160" />
                <el-table-column prop="mainUnit" label="单位" width="80" />
                <el-table-column prop="productionQuantity" label="生产数量" width="120" />
                <el-table-column prop="qualifiedQuantity" label="已完成数量" width="120" />
                <el-table-column prop="waitReceivedQuantity" label="待入库数量" width="120" />

                <el-table-column prop="createTime" label="创建时间" width="180" />
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

      <!-- 选库位 -->
      <WareHouseForm v-if="wareHouseVisible" ref="WareHouseForms" @selectWareHouseFun="selectWareHouseFun">
      </WareHouseForm>

    </div>
  </transition>
</template>

<script>
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getWarehouseInfo, getStockGoodsShelvesList, getProductionLotList, getBimBusinessSwitchConfigList, getBatchNumber, getStockGoodsShelves,getBimBusinessDetail} from '@/api/basicData/index'
import { getbimProductAttributesList } from '@/api/masterDataManagement/index'
import { getQuotationsendlist } from "@/api/salesManagement/index";
import { ordershengchanList, getWorkPage } from '@/api/productOrdes/index.js'

import CustomerForm from './customerForm.vue'
import WareHouseForm from './wareHouseForm.vue'
import { getpurPurchaseReceiptReturnGoodsdetail, addpurPurchaseReceiptReturnGoods, editpurPurchaseReceiptReturnGoods, detailpurPurchaseReceiptReturnGoods } from '@/api/purchasingManagement/purchaseInquirySheet'  // 询价单
import { purPurchaseReceiptReturnGoodsDetailList } from '@/api/purchasingManagement/purchaseInquirySheet'
import { detailordershengchan, detailWithdrawal, addWithdrawal, updateWithdrawal, getWorkList, WithdrawalmxList } from '@/api/productOrdes/index.js'
import BatchNumberForm from './batchNumberForm.vue'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import flowMixin from '@/mixins/generator/flowMixin'
import recordList from '@/views/workFlow/components/RecordList.vue'
import busFlow from '@/mixins/generator/busFlow';
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  components: { CustomerForm, WareHouseForm, BatchNumberForm, Process, recordList },
  mixins: [flowMixin, busFlow, getProjectList],
  data() {
    return {
      datafilelist: [],
      isattachmentswitch: '',
      attachmentData: {},
      isProjectSwitch: "",
      warehouseRequestObj: {
        type: 'normal', state: 'enable'
      },
      inOroundTitle: "",
      numTitle: "",
      batchNumVisible: false,
      wareHouseVisible: false,

      btnText: "",
      submitmethodsTitle: "",
      tipsvisible: false,
      CustomerForm: false,
      activeNames: ["productInfo", "basicInfo"],
      jyFlag: false,//是否显示检验标志
      codeConfig: {},//单号配置信息(单据规则)
      dataForm: {  //表单信息
        orderNo: "",
        businessType: "inbound_production",
        warehouseName: "",
        warehouseId: "",
        documentType: "",
        id: "",
        warehouseType: "",
        approvalFlag: false,
        remark: "",
        sourceNo: "",
        orderDate: this.jnpf.getToday(),
        projectId:"",
        diffBatchNumFlag:1
      },
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
        { label: "生产产品入库", value: "inbound_order_production" },
        { label: "生产工单入库", value: "inbound_production" },

      ],

      dataRule: {

        businessType: [
          { required: true, message: '业务类型不能为空', trigger: 'change' }
        ],
        orderDate: [
          { required: true, message: '单据日期不能为空', trigger: 'change' }
        ],
        orderNo: [{ required: true, message: "请输入单号", trigger: 'blur' }],
        warehouseName: [
          { required: true, message: '仓库不能为空', trigger: 'blur' }
        ],
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

      spaceLines: [],
      loadingText: '',
      copyLinesData: [],
      orderForm: {
        productionOrderNo: "",
        orderNo: "",
        processName: "",
        productDrawingNo: "",
        classAttributeList:"",
        stockFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {},
        pageNum: 1,
        pageSize: 20,
      },
      activeName: "orderInfo",
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
        diffBatchList:[
            {label:'产品生成同批次号',value:0},
            {label:'产品生成不同批次号',value:1},
        ],


      productNameFlag: null,
      tableDataFlag: false,

    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    let objs = { "pageSize": -1, "businessCode": "product" }
    getBimBusinessSwitchConfigList(objs).then(res => {
      this.productNameFlag = res.data.product[1].configValue1


    })
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },
  mounted() {
    this.getBimBusinessDetail()

    this.getMainUnitFun('deputyUnit', 'warehouseDeputyUnit')

  },
  methods: {
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_outAndInWarehouse'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.attachmentData = res.data
      })
    },
    async getMainUnitFun(code, type) {
      this.listLoading = true
      try {
        this.mainUnitFlag = await this.jnpf.getMainUnitFun(code, type);
        this.tableDataFlag = true
        this.listLoading = false


      } catch (error) {
      }
    },






    // 打开选择库位弹框
    openSeleceWareDialog(row, index) {
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库!")
      this.wareHouseVisible = true
      this.$nextTick(() => {
        this.$refs.WareHouseForms.initData(this.dataForm.warehouseId)
      })
      this.currentProductIndex = index
    },
    // 所选的库位信息
    selectWareHouseFun(data) {
      console.log("库位信息", data);
      let index = this.currentProductIndex
      this.$set(this.productData[index], 'shelfSpaceName', data.name)
      this.$set(this.productData[index], 'warehouseId', data.warehouseId)
      this.$set(this.productData[index], 'shelfSpaceId', data.id)
    },




    // 点击选择产品
    openSeleceProductDialog() {

      this.productVisible = true
      this.searchProductFun()
    },
    //
    searchProductFun() {

      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.dataForm.projectId || '' : ''
      getWorkPage(this.orderForm).then(res => {
        console.log("生产产品", res);
        res.data.records.forEach(item => {
          if (this.mainUnitFlag == 1) {
            if (item.calculationDirection == 'multiplication') {
              this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.waitReceivedQuantity, item.ratio]), 6))
            } else {
              this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.waitReceivedQuantity, item.ratio]), 6))
            }
          }
        });
        this.productList = res.data.records
        this.productTotal = res.data.total
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
      })
      // { label: "销售发货", value: "outbound_sale_send" },
      //   { label: "销售退货", value: "inbound_sale_return" },
      //   { label: "采购收货", value: "inbound_purchase" },
      //   { label: "采购退货", value: "outbound_purchase" },
      //   { label: "生产领料", value: "outbound_pick_out" },
      //   { label: "生产退料", value: "inbound_return_materials" },
      //   { label: "外协发料", value: "outbound_external_send" },
      //   { label: "外协退料", value: "inbound_external_return" },
      //   { label: "外协收货", value: "inbound_external" },
      //   { label: "外协退货", value: "outbound_external" },



    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      this.selectSaleProductArr = val
    },
    // 销售发货选择产品——重置
    resetProductFun() {
      this.orderForm = {
        productionOrderNo: "",
        orderNo: "",
        processName: "",
        productDrawingNo: "",
        classAttributeList: this.classAttributeList,
        stockFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {},
        pageNum: 1,
        pageSize: 20,
      }
      this.searchProductFun()

    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      let arr = JSON.parse(JSON.stringify(this.selectSaleProductArr))
      let list = [...this.productData, ...arr]
      console.log("list", list);
      let uniqueArr = [];
      let idSet = new Set();

      list.forEach(item => {
        if (!idSet.has(item.id)) {
          uniqueArr.push(item);
          idSet.add(item.id);
        }
      });
      uniqueArr.forEach(item => {
        this.$set(item, 'num', item.waitReceivedQuantity)
        item.ordersId = item.productionOrderId
      })
      this.productData = uniqueArr
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
          message: "请填写第" + (index + 1) + "行产品的入库数量",
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
      if (this.mainUnitFlag == 1) {
        if (item.calculationDirection == 'multiplication') {
          this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
        } else {
          this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
        }
      }
      this.productData = productArr
    },















    changeWarehousex(val, data) {
      console.log("data", data);
      if (!val && !data) {
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.warehouseType = ""
        return
      }
      this.allocationFlag = data[0].all.locationStatus == 'disabled' ? false : true

      this.dataForm.warehouseId = data[0].id
      this.dataForm.warehouseName = data[0].name
      this.dataForm.projectId = data[0].all.projectId
      this.dataForm.warehouseType = data[0].all.type
      this.$nextTick(() => this.$refs['dataForm'].validateField('warehouseName'))
    },
    goBack() {
      this.$emit('close', true)
    },
    // 获取仓库id
    getWarehouseListFun() {
      getWarehouseList({ code: this.warehouseCode }).then(res => {
        this.dataForm.warehouseName = res.data[0].name
        this.dataForm.warehouseId = res.data[0].id
        // 获取仓库详情信息
        getWarehouseInfo(res.data[0].id).then(response => {
          this.dataForm.projectId = response.data.projectId
          this.dataForm.warehouseType = response.data.type
          this.allocationFlag = response.data.locationStatus == 'disabled' ? false : true
        })
      })
    },



    //   { label: "销售发货", value: "outbound_sale_send" },
    // { label: "销售退货", value: "inbound_sale_return" },
    // { label: "采购收货", value: "inbound_purchase" },
    // { label: "采购退货", value: "outbound_purchase" },
    // { label: "生产领料", value: "outbound_pick_out" },
    // { label: "生产退料", value: "inbound_return_materials" },
    // { label: "外协发料", value: "outbound_external_send" },
    // { label: "外协退料", value: "inbound_external_return" },
    // { label: "外协收货", value: "inbound_external" },
    // { label: "外协退货", value: "outbound_external" },
    init(data, btnType, classAttributeList, warehouseCode) {
      this.productData = []
      console.log("11", data, btnType, classAttributeList);
      this.classAttributeList = classAttributeList
      this.warehouseCode = warehouseCode
      this.btnType = btnType
      this.getWarehouseListFun()
      if (this.btnType == 'edit') {
        this.fetchData("RKDH", false)
        this.title = '修改入库单'
      }

      if (btnType == 'edit' || btnType == 'look') {
        detailWarehouseData(data).then(res => {
          console.log("入库单详情", res);
          res.data.spaceLines.forEach(item => {
            this.$set(item, 'productDrawingNo', item.drawingNo)
          });
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
          this.dataForm = res.data.stockMove
          this.productData = res.data.spaceLines
          // 流程信息和流转记录
          if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
        })
      } else {
        this.fetchData("RKDH", true)
        this.getBusInfo('b045')
        this.dataForm.sourceNo = data[0].orderNo
        this.title = '新建入库单'
        this.datafilelist = []

        setTimeout(() => {
          data.forEach(item => {
            this.$set(item, 'num', item.waitReceivedQuantity)
            this.$set(item, 'sourceNo', item.orderNo)
            if (this.mainUnitFlag == 1) {
              if (item.calculationDirection == 'multiplication') {
                this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
              } else {
                this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
              }
            }
            item.ordersId = item.productionOrderId
            item.ordersLineId = item.id
          });
          this.productData = data
        }, 600);
      }
      if (btnType == 'look') {
        this.title = '查看入库单'
      }



    },


    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.orderNo = data.number
        }

      } catch (error) {
      }
    },
    async handleConfirm(submitModel) {
      console.log(this.productData);
      let submitFlag = true // 自动聚焦是否可用

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 判断子表是否有效
          if (!this.productData.length && submitFlag) {
            submitFlag = false
            this.$message.error('请至少选择一个产品')
          }
          if (this.allocationFlag) {
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.shelfSpaceId) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行库位不能为空")
                return
              }
            }

          }

          if (this.productData.length) {
            console.log(this.productData);
            let totals = {};
            let totalNum = {};
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能为空")
                break
              }



            }


          }




          // 自动聚焦未使用则提交
          if (submitFlag) {
            this.btnLoading = true

            this.dataForm.documentType = "inbound"
            this.dataForm.documentStatus = submitModel
            this.dataForm.classAttributeList = this.classAttributeList
            this.dataForm.sourceType = 'order'
            console.log("this.dataForm", this.dataForm);

            const formMethod = this.dataForm.id ? updateWarehouseData : addWarehouseData
            // const formMethod = addWarehouseData
            // spaceLines每一项的产品id如果与linesList项的产品id相同，那么让spaceLines项的批次号也等于linesList项的批次号

            this.copyLinesData = JSON.parse(JSON.stringify(this.productData))
            this.copyLinesData.forEach(element => {
              element.warehouseType = this.dataForm.warehouseType
            });
            if (this.datafilelist.length) {
              this.datafilelist.map((item, index) => {
                item.bimAttachments = {
                  businessType: "system_attachment",
                  categoryId: this.attachmentData.configValue2,
                  configKey: this.attachmentData.configKey,
                  documentId: item.id,
                  fileFlag: '',
                  sort: index
                }
              })
            }
            let dataObj = {
              attachmentList: this.datafilelist,
              stockMove: this.dataForm,
              lines: this.productData,
              spaceLines: this.copyLinesData,
              flowData: this.flowData
            }
            // 提交确认
            // if (submitModel === 'submit') {
            //   let flag = await this.$confirm('请确认信息是否正确，提交后不允许修改，是否提交！', '提交确认', { type: 'warning' }).catch(err => false)
            //   if (!flag) {
            //     console.log(dataObj)
            //     return this.btnLoading = false
            //   }
            // }
            console.log("this.productData", this.productData);
            formMethod(dataObj).then(res => {
              let msg = res.msg
              if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
              this.$message.success(msg)
              this.btnLoading = false

              setTimeout(() => {
                this.$emit('close', true)
              }, 500);
            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            this.btnLoading = false
          }
        }
      })

    },

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
  padding-top: 0;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 5px 10px;
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

::v-deep.JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 !important;
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

.JNPF-common-search-box {
  margin-bottom: 5px;
}

// .orderInfo ::v-deep .el-collapse-item__wrap {
//   border-bottom: none !important
// }
.JNPF-common-table {
  border: 1px solid #ebeef5 !important;
}

.JNPF-common-layout-main {
  padding-top: 0;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
}
</style>
