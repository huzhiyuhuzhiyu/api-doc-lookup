<template>
  <div class="JNPF-preview-main org-form">
    <div v-if="!processOutFormVisible && !TransitionRemakeVisible && !TransitionRemakeRecordVisible&&!outSouringFormVisible">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="'生产任务报工'" />
        <div class="options">

          <el-button @click="printBarCode">打印二维码</el-button>
          <!-- <el-button type="primary" plain v-has="'remakeRecord'" @click="()=>{TransitionRemakeRecordVisible = true}">重制生产申请记录</el-button> -->
          <el-button type="primary" plain v-has="'remake'" @click="orderRemakeRequest('add')" :disabled="isRemakeRequest">重制生产申请</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-collapse v-model="activeNames">
          <el-collapse-item title="任务信息" name="basicInfo" class="orderInfo" style="margin-top: 5px;">
            <div class="stoclInfo">
              <el-descriptions :column="1" class="box">
                <el-descriptions-item label="品名规格" class="drawingNo">{{ dataForm.productDrawingNo
                  }}</el-descriptions-item>
              </el-descriptions>
                <el-descriptions class="margin-top" :column="4">
                <el-descriptions-item label="任务单号" class="orderNo">
                  {{ dataForm.orderNo }}</el-descriptions-item>

                <el-descriptions-item label="产品编码">{{ dataForm.productCode }}</el-descriptions-item>
                <el-descriptions-item label="产品分类">{{ dataForm.productCategoryName }}</el-descriptions-item>
                <el-descriptions-item label="总生产数量">{{ dataForm.productionQuantity }}</el-descriptions-item>
                <el-descriptions-item v-if="isXY||isJR" label="生产桶数">{{ dataForm.productionBarrels }}</el-descriptions-item>
                <el-descriptions-item v-if="isXY||isJR" label="生产重量">{{ dataForm.productionWeight }}</el-descriptions-item>
                <el-descriptions-item v-if="isXY||isJR" label="规值">{{ dataForm.standardValue }}</el-descriptions-item>
                <el-descriptions-item v-if="isXY||isJR" label="精度等级">{{ dataForm.accuracyLevel }}</el-descriptions-item>
                <el-descriptions-item v-if="isXY||isJR" label="钢丝炉号">{{ dataForm.wireHeatNumber }}</el-descriptions-item>
                <el-descriptions-item v-if="isXY||isJR" label="原材料厂家">{{ dataForm.rawStockMill }}</el-descriptions-item>
                <el-descriptions-item label="工艺名称">{{ dataForm.routingName }}</el-descriptions-item>
                <el-descriptions-item label="领料方式">{{ dataForm.pickingWay == 'production_order' ? '生产订单领料' : "工单领料"
                  }}</el-descriptions-item>
              </el-descriptions>
            </div>

          </el-collapse-item>
        </el-collapse>
        <div>
          <div class="process">
            <div v-for="(item, index) in workList" :key="index" class="workInfo"
              style="text-align: center;display: inline-block;">
              <div class="processInfoBox" style="cursor: pointer;"
                :class="item.processId == currentProcessId ? 'processInfo' : ''" @click="getProcessFun(item)">
                {{ item.processName }} {{ item.waitReportNum *1 ? '(' + item.waitReportNum + ')' : '' }} <div>({{ item.processCode }})</div>
              </div>

            </div>
          </div>
          <el-col :span="11" class="fixedInfo" ref="fixedInfo" :style="{ height: targetHeight + 'px!important' }"
            style="width: 48%!important;position: relative;">
            <img src="@/assets/images/extend.png" alt="" v-if="currentProcess.processingType == 'external_production'"
              class="extend">
            <img src="@/assets/images/noReport.png" alt=""
              v-if="currentProcess.processingType == 'self_produced' && currentProcess.reportFlag == false"
              class="extend">
            <el-row>
              <el-col :sm="24" :xs="24">

                <div class="info">
                  <span class="left-title">工单单号：</span>
                  <el-tooltip class="item" effect="dark" :content="currentProcess.orderNo" placement="top-start">
                    <span class="left-title ts">
                      {{ currentProcess.orderNo }}
                    </span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">工单类型：</span>
                  <span class="left-title" v-if="processInfo.processType == 'normal'">正常工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'vibrate'">测振工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'heat_treatment'">热工工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'packing'">包装工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'pairs'">配对工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'grinding'">磨孔工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'accuracy'">精度工序</span>
                </div>
              </el-col>

              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">品名规格：</span>
                  <el-tooltip class="item" effect="dark" :content="currentProcess.productDrawingNo"
                    placement="top-start">
                    <span class="left-title ts">
                      {{ currentProcess.productDrawingNo }}
                    </span>
                  </el-tooltip>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">加工工序：</span>
                  <span class="left-title">{{ currentProcess.processName }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="materialList.length && materialList[0].reduceType == 'picking'">
                <div class="info">
                  <span class="left-title">已领料数量：</span>
                  <span class="left-title">{{ materialList[0].receivedQuantity }}</span>
                </div>

              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12" class="rightInfo" ref="mycol"
            v-if="currentProcess.processingType == 'self_produced' && currentProcess.reportFlag == true">
            <el-form ref="reportRef" :model="currentProcess" :rules="dataRule" label-width="180px"
              label-position="left">

              <el-row>
                <div style="margin-bottom: 10px; background: #f2f2f2; padding: 20px 16px;">
                  <span style="font-size: 17px;font-weight: bold">加工数量：</span><span
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold">[{{
                      currentProcess.productionQuantity }}]</span>
                  <span style="font-size: 17px;font-weight: bold;margin-left: 10px;">可报工数量：</span><span
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold">[{{ currentProcess.waitReportNum
                    }}]</span>
                  <span style="font-size: 17px;font-weight: bold;margin-left: 10px;">报工数量：</span><span
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold">[{{ currentProcess.reportingQuantity
                    }}]</span>
                  <span
                    style="font-size: 17px;font-weight: bold;margin-left: 10px;display: inline-block;">不合格数量：</span><span
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold">[{{ currentProcess.unqualifiedQuantity
                    }}]</span>
                  <span v-if="dataForm.pickingWay == 'dispatch_list'"
                    style="font-size: 17px;font-weight: bold;margin-left: 10px;display: inline-block;">可领库存数：</span>
                  <span v-if="dataForm.pickingWay == 'dispatch_list'"
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold">[{{ currentProcess.availableStockNum
                    }}]</span>
                </div>
                <div style="padding: 0 20px;">
                  <template v-if="$store.getters.configData.produce.steelBallTask && currentProcess.processType !== 'boxing'">
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="生产桶数" prop="productionBarrels" class="iptLabel"
                        :style="{ marginBottom: iptLabelMargin }">
                        <el-input v-model="currentProcess.productionBarrels" placeholder="生产桶数" class="ipt" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="生产重量" prop="productionWeight" class="iptLabel"
                        :style="{ marginBottom: iptLabelMargin }">
                        <el-input v-model="currentProcess.productionWeight" placeholder="生产重量" class="ipt" @blur="productionWeightFun"/>
                      </el-form-item>
                    </el-col>
                  </template>


                  <el-col :sm="24" :xs="24">
                    <el-form-item label="合格数量:" prop="qualifiedQuantity" class="iptLabel"
                      :style="{ marginBottom: iptLabelMargin }">
                      <el-input v-model="currentProcess.qualifiedQuantity" placeholder="合格数量" class="ipt"
                        @blur="handleBlur(item)" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" v-if="isXY||isJR">
                    <el-form-item label="规值:" prop="standardValue" class="iptLabel"
                      :style="{ marginBottom: iptLabelMargin }">
                      <el-select v-model="currentProcess.standardValue" placeholder="请选择" clearable style="width: 100%;" class="ipt">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa008" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" v-if="isXY||isJR">
                    <el-form-item label="精度等级:" prop="accuracyLevel" class="iptLabel"
                      :style="{ marginBottom: iptLabelMargin }">
                      <el-select v-model="currentProcess.accuracyLevel" placeholder="请选择" clearable style="width: 100%;" class="ipt">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa006" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="24" :xs="24" v-if="isXY">
                    <el-form-item label="是否全部报工:" prop="forceCompleteFlag" class="iptLabel"
                      :style="{ marginBottom: iptLabelMargin }">
                      <el-select v-model="currentProcess.forceCompleteFlag" placeholder="请选择" clearable style="width: 100%;" class="ipt">
                              <el-option v-for="(item, index) in forceCompleteFlagList" :key="index"
                                :label="item.label" :value="item.value"></el-option>
                            </el-select>
                    </el-form-item>
                  </el-col> -->
                  <!-- <el-col :sm="24" :xs="24" v-if="currentProcess.processType == 'boxing'">
                    <el-form-item label="是否强制完成:" class="iptLabel">
                      <el-select v-model="currentProcess.forceCompleteFlag" placeholder="是否强制完成" style="width: 100%;"
                        class="ipt">
                        <el-option v-for="(item, index) in totalStockOutboundList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->

                  <el-col :sm="24" :xs="24" v-if="currentProcess.processType !== 'boxing'">
                    <el-form-item label="责废数量:" class="iptLabel">
                      <el-input v-model="currentProcess.responsibilityWasteQuantity" disabled placeholder="责废数量"
                        @blur="handleBlur2" class="ipt materialWaste" />
                        <el-button type="primary"
                        style="float: right;height: 50px" size="mini" @click='setResponsWasteM()'>设置责废原因</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" v-if="currentProcess.processType !== 'boxing'">
                    <el-form-item label="料废数量:" class="iptLabel">
                      <el-input v-model="currentProcess.materialWasteQuantity" disabled placeholder="料废数量"
                        class="ipt materialWaste" />
                      <el-button type="primary"
                        style="float: right;height: 50px" size="mini" @click='setMaterialWasteM()'>设置料废原因</el-button>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="24" :xs="24">
                    <el-form-item label="利用数量:" class="iptLabel">
                      <el-input v-model="currentProcess.utilizeQuantity" placeholder="料废数量" @blur="handleBlur2"
                        class="ipt" />
                    </el-form-item>
                  </el-col> -->
                  <el-col :sm="24" :xs="24" class="iptLabel" v-if="currentProcess.processType == 'grinding'">
                    <el-form-item label="孔径" :prop="aperture">
                      <el-select v-model="currentProcess.aperture" placeholder="孔径" style="width: 100%;" class="ipt">
                        <el-option v-for="(item, index) in apertureList" :key="index" :label="item.label"
                          :value="item.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="24" :xs="24">
                    <el-form-item label="返工数量:" class="iptLabel">
                      <el-input v-model="currentProcess.reworkQuantity" placeholder="返工数量" class="ipt"
                        @blur="handleBlur2" />
                    </el-form-item>
                  </el-col> -->
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="报工时间" class="iptLabel">
                      <el-date-picker v-model="currentProcess.reportingTime" value-format="yyyy-MM-dd"
                        @change="reportingTimeChange" class="ipt" type="date" style="width: 100%;" placeholder="选择报工时间">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" class="iptLabel">
                    <el-form-item label="生产人:" prop="producerName" v-if="currentProcess.taskMethod != 'not_appoint'"
                      :style="{ marginBottom: producerMargin }">
                      <el-select v-model="currentProcess.producerName" placeholder="生产人" style="width: 100%;"
                        class="ipt">
                        <el-option v-for="(item, index) in personList" :key="index" :label="item.label"
                          :value="item.id"></el-option>
                      </el-select>

                      <!-- producerId -->
                    </el-form-item>
                    <el-form-item label="生产人:" prop="producerId" v-if="currentProcess.taskMethod == 'not_appoint'"
                      :style="{ marginBottom: producerMargin }" class="iptLabel">
                      <user-select v-model="currentProcess.producerId" placeholder="生产人" clearable style="width: 100%;"
                        class="ipt" @change="hangleSelectSales">
                      </user-select>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="设备:" class="iptLabel">
                      <el-select v-model="currentProcess.equipmentId" placeholder="设备" style="width: 100%;"
                        class="ipt">
                        <el-option v-for="(item, index) in equipmentList" :key="index" :label="item.name"
                          :value="item.value"></el-option>
                      </el-select>
                      <!-- equipmentId -->
                    </el-form-item>
                  </el-col>

                  <el-col :sm="24" :xs="24">
                    <div v-if="currentProcess.processingType == 'self_produced' && currentProcess.reportFlag == true"
                      style="margin-bottom: 20px;" class="reportBtn_right">
                      <el-button type="primary" size="mini" @click='report()'>报 工</el-button>
                      <el-button type="primary" size="mini" @click='transferOutFun()' v-if="currentProcess.processingType == 'self_produced'">转外协</el-button>
                      <el-button type="primary" size="mini" @click="reportRecordsFun()">查看报工记录</el-button>
                    </div>
                  </el-col>
                </div>


              </el-row>
            </el-form>
          </el-col>
          <el-col :span="12" class="rightInfo" style="padding-top: 18px;"
            :style="{ height: targetHeight2 + 'px!important' }"
            v-if="currentProcess.processingType == 'external_production'">
            <el-form ref="reportRef" :model="currentProcess" :rules="dataRule" label-width="180px"
              label-position="left">
              <el-row>

                <div style="padding: 0 20px;" class="external_text">

                  <el-descriptions :column="1">
                    <el-descriptions-item label="计划外协数量" class="external_cotent">
                      {{ currentProcess.productionQuantity }}
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="完工数量" class="external_cotent">{{ currentProcess.qualifiedQuantity
                      }}</el-descriptions-item>
                  </el-descriptions>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="发料数量" class="external_cotent">
                      <el-tag>{{ dataForm.productionQuantity }}</el-tag>

                    </el-descriptions-item>
                  </el-descriptions>
                </div>


              </el-row>
            </el-form>
          </el-col>
        </div>
      </div>

    </div>
    <recordForm v-if="recordFormVisible" ref="recordForm"></recordForm>
    <OutForm v-if="processOutFormVisible" ref="outForm" @close="closeForm"></OutForm>
    <MaterialWasteForm v-if="materialWasteFormVisible" ref="materialWasteFormRef" @change="materialWasteData">
    </MaterialWasteForm>
    <responsWaste v-if="responsWasteFormVisible" ref="responsWasteFormRef" @change="responsWasteData">
    </responsWaste>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
    <TransitionRemake ref="TransitionRemake" v-if="TransitionRemakeVisible" @close="closeRemakeRequest" :productionOrderId="dataForm.id" :workList="workList" :currentProcessId="currentProcessId" :currentWorkOrderId="currentProcess.id" :pickingWay="currentProcess.pickingWay" ></TransitionRemake>
    <TransitionRemakeRecord ref="TransitionRemakeRecord" v-if="TransitionRemakeRecordVisible" :productionOrderId="dataForm.id" @close="TransitionRemakeRecordVisible = false"></TransitionRemakeRecord>
    <OutSouringForm v-if="outSouringFormVisible" ref="OutSouringForm"  @close="closeForm" />
  </div>

</template>

<script>

import {
  getbimProductAttributesList, getbimProductAttributes,getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import { detailProcess, } from '@/api/basicData/processSettingss.js'
import { detailordershengchan, getWorkList, addWorkReport } from '@/api/productOrdes/index.js'
import { producePersonList } from "@/api/warehouseManagement/packingList.js"
import { log } from 'mathjs'
import OutForm from '@/views/outsourcingManagement/processOutsourcingOrders/orderCreation/processOut.vue'
import recordForm from './recordForm.vue'
import MaterialWasteForm from './materialWasteForm.vue';
import responsWaste from './responsWaste.vue'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo ,getPrintDeliveryNote} from '@/api/system/printDev'
import { getProductsWeightQuantityList } from '@/api/basicData/productsWeightQuantity'
import TransitionRemake from "@/views/completionReport/ringCompletionReport/TransitionRemake";
import TransitionRemakeRecord from "@/views/completionReport/ringCompletionReport/TransitionRemakeRecord.vue";
import OutSouringForm from '@/views/outsourcingManagement/processOutsourcingOrders/orderCreation/index.vue';
import { detailProductionToOutSouring } from '@/api/productOrdes/index.js'
import tenantMinix from "@/mixins/generator/TenantMinix";

export default {
  mixins: [tenantMinix],

  components: {
    recordForm, OutForm, MaterialWasteForm,responsWaste,PrintBrowse,
    PrintDialog, TransitionRemake, TransitionRemakeRecord,
    OutSouringForm
  },
  data() {
    return {
      forceCompleteFlagList:[
        {label:"是",value:true},
        {label:"否",value:false},
      ],
      bimProductAttributesList:{},
      printVisible: false,
      printBrowseVisible: false,
      TransitionRemakeVisible:false,
      TransitionRemakeRecordVisible:false,
      enCode: "p035",
      fullName: "打印工单码",
      formId: "",
      processInfo:{},
      responsWasteFormVisible:false,
      materialWasteFormVisible: false,
      apertureList: [],
      targetHeight: "",
      targetHeight2: "",
      processOutFormVisible: false,
      recordFormVisible: false,
      normalFormVisible: false,
      vibrateFormVisible: false,
      outSouringFormVisible:false,
      activeName: 'orderInfo',
      activeNames: ['basicInfo', 'productInfo'],
      orderTypeList: [
        { label: "正常任务", value: "normal", },
        { label: "返工任务", value: "rework", },
      ],
      dataForm: {
      },
      codeConfig: {},//单据规则配置
      workList: [],
      totalStockOutboundList:[
        {label:"是",value:true,},
        {label:"否",value:false,},

      ],
      equipmentList:"",
      currentProcess: {},
      listLoading: false,
      currentProcessId: "",
      id: "",
      sort: "",//测震工序序号
      personList: [],
      totalReportNum: "",
      dataRule: {
        reportingTime: [
          { required: true, message: '报工时间不能为空', trigger: 'change' }
        ],
        producerName: [
          { required: true, message: '生产人不能为空', trigger: 'change' }
        ],
        producerId: [
          { required: true, message: '生产人不能为空', trigger: 'change' }
        ],
        qualifiedQuantity: [
          { required: true, message: '合格数量不能为空', trigger: 'blur' },
          { validator: this.formValidate({ type: "decimal", params: [20, 2, "请输入正确的数量(最多保留2位小数,整数8位)"], }), trigger: "blur", },
          // { validator: this.formValidate('noZero', '合格数量不能为0', (errMsg) => { this.$message.error(errMsg) }), trigger: 'blur' },
        ],
        productionBarrels: [
          { required: true, message: '生产桶数不能为空', trigger: 'blur' },
          { validator: this.formValidate({ type: "decimal", params: [20, 2, "请输入正确的数量(最多保留2位小数,整数8位)"], }), trigger: "blur", },
          // { validator: this.formValidate('noZero', '合格数量不能为0', (errMsg) => { this.$message.error(errMsg) }), trigger: 'blur' },
        ],
        productionWeight: [
          { required: true, message: '生产重量不能为空', trigger: 'blur' },
          { validator: this.formValidate({ type: "decimal", params: [20, 2, "请输入正确的数量(最多保留2位小数,整数8位)"], }), trigger: "blur", },
          // { validator: this.formValidate('noZero', '合格数量不能为0', (errMsg) => { this.$message.error(errMsg) }), trigger: 'blur' },
        ]
      },
      iptLabelMargin: '30px',
      producerMargin: '30px',
      materialList: [],
      materialWasteDataList: [],
      responsWasteDataList:[],
      copyCurrentProcess: {},
      remakeUnqualifiedQuantity:0,
    }
  },
  computed: {
    isRemakeRequest(){
          return this.workList.length > 0 && !+this.remakeUnqualifiedQuantity
    },
  },
  watch: {
    'currentProcess.productionWeight': {
      handler: function (newVal, oldVal) {
        if (this.$store.getters.configData.produce.steelBallTask) {
          if (newVal) {
            this.currentProcess.qualifiedQuantity = Number(newVal) / Number(this.weight) *Number(this.quantity) ? Number(newVal) / Number(this.weight) *Number(this.quantity) : this.currentProcess.qualifiedQuantity?this.currentProcess.qualifiedQuantity:this.currentProcess.waitReportNum

          } else {
            // this.currentProcess.qualifiedQuantity = 0
          }
          this.currentProcess.reportingQuantity = this.currentProcess.qualifiedQuantity
          this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity]), 6)
        }
      },
      deep: true
    },
  },
  mounted() {
    this.getProductClassFun()

  },

  methods: {
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })
    },

    // 工单顺序调换申请
    orderRemakeRequest(type){
      this.TransitionRemakeVisible = true
      this.$nextTick(() => {
        console.log(this.$refs.TransitionRemake,'所属')
        this.$refs.TransitionRemake.init('',type)
      })
    },
    // 关闭工单顺序调换申请
    closeRemakeRequest(){
      this.TransitionRemakeVisible = false
      this.init(this.id)
    },
    closePrint() {
      this.printVisible = false
    },
    // 打印
    printBarCode() {
      this.formId = this.dataForm.id
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.printBrowseVisible = true
          this.printVisible = false

        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    setMaterialWasteM() {
      console.log("this.materialWasteDataList", this.materialWasteDataList);
      this.materialWasteFormVisible = true
      this.$nextTick(() => {
        this.$refs.materialWasteFormRef.init(JSON.parse(JSON.stringify(this.materialWasteDataList)), this.currentProcess.materialWasteQuantity,this.dataForm.projectId)
      })
    },
    // 设置责废原因
    setResponsWasteM() {
      console.log("this.responsWasteDataList", this.responsWasteDataList);
      this.responsWasteFormVisible = true
      this.$nextTick(() => {
        this.$refs.responsWasteFormRef.init(JSON.parse(JSON.stringify(this.responsWasteDataList)), this.currentProcess.responsibilityWasteQuantity,this.dataForm.projectId)
      })
    },
    materialWasteData(data,totalNums) {
      console.log("设置的料废金额", data,totalNums);
      if(totalNums){

      this.materialWasteDataList = data
      this.currentProcess.materialWasteQuantity=totalNums
        this.handleBlur2()
      } else {
        this.currentProcess.materialWasteQuantity= 0
        this.handleBlur2()
      }
    },
    responsWasteData(data,totalNums){
      console.log("责废数据",data,totalNums);
      this.responsWasteDataList = data
      if(totalNums){
        this.currentProcess.responsibilityWasteQuantity=totalNums
        this.handleBlur2()
      }else {
        this.currentProcess.responsibilityWasteQuantity= 0
        this.handleBlur2()
      }
    },
   // 转外协
   async transferOutFun() {
      const productOutData = await detailProductionToOutSouring(this.dataForm.id)
      const workOrderList = productOutData.data && productOutData.data.workOrderList
      if (workOrderList.length){
          // 单条转外协 过滤出所需工单
        const workOrderProcess = workOrderList.filter(item => item.id === this.currentProcess.id)
          // 临时存储传递数据到会话
          const processList = workOrderProcess.map((item,index) => ({
              projectName: item.projectName,
              projectId: item.projectId,
              productSource: item.productSource, // 产品来源
              processType: item.processType, // 工序类型
              classAttribute: item.classAttribute,
              productsId: item.productsId, // 产品id
              productName: item.productName, // 产品名称
              productCode: item.productCode, // 产品编码
              productDrawingNo: item.productDrawingNo, // 品名规格
              model: item.model, // 品名规格
              spec: item.spec, // 品名规格
              drawingSheetNo: item.drawingSheetNo, // 品名规格
              ratio: item.ratio, // 转换系数
              calculationDirection: item.calculationDirection, // 计算方向
              mainUnit: item.mainUnit, // 单位
              purchaseQuantity: workOrderProcess[0].waitOutsourcingQuantity, // 数量
              price: '', // 含税单价
              totalAmount: '', // 金额(含税)
              taxRate: '', // 税率
              excludingTaxPrice: '', // 不含税单价
              taxAmount: '', // 税额
              excludingTaxAmount: '', // 金额(不含税)
              deputyUnit: item.deputyUnit, // 副单位
              planQuantity: '', //计划数量
              planQuantity2: '', //计划数量副
              remark: item.remark,
              //   增加首选 末选标记
              firstSwitchFlag: item.firstFlag ? true : index === 0,
              lastSwitchFlag :item.lastFlag ? true : index === workOrderProcess.length - 1,
              //   增加首道 末道标记
              firstFlag:!!item.firstFlag,
              lastFlag:!!item.lastFlag,
              receiveFlag:item.lastFlag ? true : index === workOrderProcess.length - 1,
              deliveryDate: '', // 交期
              processId: item.processId,
              processName: item.processName,
              qty: item.qty,
              waitOutsourcingQuantity: workOrderProcess[0].waitOutsourcingQuantity,
              workOrderId: item.id,
          }))
          const preData = {
              productionOrderId: this.dataForm.id,
              firstUseMaterialList: workOrderProcess[0].shipmentList,
              preProcessData: workOrderProcess[0],
              processList
          }
          sessionStorage.setItem('preData', JSON.stringify(preData))
          this.outSouringFormVisible = true
      }


    },
    closeForm(flag) {
      this.processOutFormVisible = false
      this.outSouringFormVisible = false
      this.getProcessFun(this.currentProcess)
    },
    init(id) {
      this.id = id
      detailordershengchan(id).then(res => {
        this.dataForm = res.data.prodOrder
        this.workList = res.data.workOrderList.map(item=>{
          return {
            ...item,
          autoUnqualifiedQuantity :item.unqualifiedQuantity
          }

        })
        this.remakeUnqualifiedQuantity = this.workList[0].autoUnqualifiedQuantity
        this.materialList = res.data.materialList
        if (this.$store.getters.configData.produce.steelBallTask) {
          let obj = {
            productsId: this.dataForm.productsId
          }
          getProductsWeightQuantityList(obj).then(res=>{
            this.weight = res.data.records.length ? res.data.records[0].weight : 0
            this.quantity = res.data.records.length ? res.data.records[0].quantity : 0
          })
        }

        if (Object.keys(this.copyCurrentProcess).length !== 0) {
          const matchingItem = res.data.workOrderList.find(item => item.processId === this.copyCurrentProcess.processId);
          if (matchingItem) {
            this.currentProcessId = matchingItem.processId
            this.currentProcess = matchingItem
            this.$set(this.currentProcess,'productionBarrels',this.dataForm.productionBarrels)
            // this.$set(this.currentProcess,'forceCompleteFlag',false)
            this.$set(this.currentProcess,'productionWeight',this.dataForm.productionWeight)
            this.$set(this.currentProcess,'qualifiedQuantity',this.dataForm.productionQuantity)
            this.processInfo = JSON.parse(JSON.stringify(matchingItem))
          } else {
          }
        } else {
            // 修改初始进入报工默认展示第一条  更改为可报工数量有值的项显示
          this.currentProcess =  res.data.workOrderList.find(item=>+item.waitReportNum && item.reportFlag) || res.data.workOrderList[0]
          this.currentProcessId = this.currentProcess.processId
            // this.$set(this.currentProcess,'forceCompleteFlag',false)
            this.$set(this.currentProcess,'productionBarrels',this.dataForm.productionBarrels)
          this.$set(this.currentProcess,'productionWeight',this.dataForm.productionWeight)
          this.processInfo = JSON.parse(JSON.stringify(this.currentProcess))
        }
        if(this.currentProcess.workOrderResMap && this.currentProcess.workOrderResMap.device){

          this.equipmentList=this.currentProcess.workOrderResMap.device
        }
        this.$set(this.currentProcess, 'reportingQuantity', 0)
        this.$set(this.currentProcess, 'qualifiedQuantity', "")
        this.$set(this.currentProcess, 'unqualifiedQuantity', 0)
        this.$set(this.currentProcess, 'materialWasteQuantity', 0)
        this.$set(this.currentProcess, 'responsibilityWasteQuantity', 0)
        this.$set(this.currentProcess, 'reworkQuantity', 0)
        this.$set(this.currentProcess, 'utilizeQuantity', 0)
        if (this.$store.getters.configData.produce.reporting_auto_recode) {
          this.currentProcess.qualifiedQuantity = this.currentProcess.waitReportNum
          this.currentProcess.reportingQuantity = this.currentProcess.waitReportNum
        }
        this.commonFun()
        // this.getRoutingDetailFun(this.dataForm.routingId)
      })
    },
    getProcessFun(item) {
      this.currentProcess = item
            // this.$set(this.currentProcess,'forceCompleteFlag',false)
            this.$set(this.currentProcess,'productionBarrels',this.dataForm.productionBarrels)
      this.$set(this.currentProcess,'productionWeight',this.dataForm.productionWeight)

      this.copyCurrentProcess = JSON.parse(JSON.stringify(item))
      this.currentProcessId = item.processId
      this.remakeUnqualifiedQuantity = item.autoUnqualifiedQuantity
      this.$set(this.currentProcess, 'reportingQuantity', 0)
          this.currentProcess.qualifiedQuantity = this.currentProcess.waitReportNum
      this.$set(this.currentProcess, 'unqualifiedQuantity', 0)
      this.$set(this.currentProcess, 'materialWasteQuantity', 0)
      this.$set(this.currentProcess, 'responsibilityWasteQuantity', 0)
      this.$set(this.currentProcess, 'reworkQuantity', 0)
      this.$set(this.currentProcess, 'utilizeQuantity', 0)
      console.log("当前current", item);
      this.targetHeight = ""
      this.targetHeight2 = ""
      this.commonFun()

      this.processInfo = JSON.parse(JSON.stringify(item))
    },
    handleBlur(item, data) {


      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity]), 6)
      this.$set(this.currentProcess, 'reportingQuantity', this.totalReportNum)

      this.$nextTick(() => {
        const height = this.$refs.mycol.$el.clientHeight
        console.log('el-col的高度是1：', height);
        this.targetHeight = height;
      })
    },
    productionWeightFun(){
      let num=this.currentProcess.productionWeight?this.jnpf.numberFormat(this.jnpf.math('subtract', [this.dataForm.productionWeight, this.currentProcess.productionWeight]), 6):0
      if(num<0){
        this.currentProcess.productionWeight=0
        this.$message.error("当前生产重量不可超过任务的生产重量")
      }else{
        this.currentProcess.materialWasteQuantity=num
      }
    },
    handleBlur2() {
      this.currentProcess.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.materialWasteQuantity, this.currentProcess.responsibilityWasteQuantity]), 6)
      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity]), 6)
      this.$set(this.currentProcess, 'reportingQuantity', this.totalReportNum)

    },
    reportingTimeChange(e) {
      this.currentProcess.reportingTime = e + ' 00:00:00'
    },
    commonFun() {
      this.currentProcess.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.materialWasteQuantity, this.currentProcess.responsibilityWasteQuantity]), 6)

      if (this.currentProcess.processingType == 'self_produced' && this.currentProcess.reportFlag == true) {
        this.getvibrationLevelFun()

        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          console.log('el-col的高度是2：', height);
          this.targetHeight = height;
        });
      } else {
        // const height = this.$refs.fixedInfo.$el.clientHeight
        // console.log('el-col的高度是2：', height);
        // this.targetHeight2 = height;
      }
      this.producePersonListFun(this.currentProcess.id)
      const end = new Date();//获取当前的日期
      this.$set(this.currentProcess, 'reportingTime', this.dateFormat(end))
    },
    // 获取生产人员数据
    producePersonListFun(id) {
      producePersonList(id).then(res => {

        console.log("生产人", res);
        if (res.data) {
          let result = Object.entries(res.data).map(([key, value]) => {
            return {
              id: key,
              label: value
            };
          });
          this.personList = result
          console.log(result);
          if (result.length > 0) {
            this.$set(this.currentProcess, 'producerId', result[0].id)
            this.$set(this.currentProcess, 'producerName', result[0].label)


          }

        }
      })
    },
    // 获取振动等级数据
    getvibrationLevelFun() {
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa009",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj3).then(res => {
        console.log("孔径数据", res);
        this.apertureList = res.data.records
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          console.log('el-col的高度是1：', height);
          this.targetHeight = height;
        });
      })




    },

    goBack() {
      this.$emit("close", false)
    },

    reportRecordsFun() {
      this.recordFormVisible = true
      this.$nextTick(() => {
        this.$refs.recordForm.init(this.currentProcess.orderNo)
      })
    },
    // 报工
    report() {
      // 先判断是否有测震工序(sort有值表示有测震工序)
      // 如果有 拿当前工序排序值大于等于测震工序值 则表示是测震工序或测震后工序
      // 如果没有 则是测震前工序
      console.log(this.currentProcess);
      this.$refs['reportRef'].validate((valid) => {
        if (valid) {
          let submitFlag = null
          console.log(this.totalReportNum)
          if (this.currentProcess.processType !== 'boxing') {
          if (this.totalReportNum > Number(this.currentProcess.waitReportNum)) {
            this.submitFlag = false
            this.$message.error("合格数量+不合格数量不能超过可报工数量")
            return
          }
          } else {
            if (!this.totalReportNum) {
              submitFlag = false
              this.$message.error("合格数量必须大于0")
              return
            }
          }
          let total = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.materialWasteQuantity, this.currentProcess.responsibilityWasteQuantity, this.currentProcess.qualifiedQuantity, this.currentProcess.reworkQuantity]), 6)
          if (this.currentProcess.processType !== 'boxing') {
            if (total <= 0 || !total) {
            submitFlag = false
            this.$message.error("请填写合格数量、料废数量、责废数量")
            return
          }
          }

          if (this.currentProcess.reportFlag && this.currentProcessType === 1) {
            if (!this.totalReportNum) {
              submitFlag = false
              this.$message.error("合格数量加上不合格数量必须大于0")
              return
            }
          }
          if (submitFlag === false) return
          if (this.currentProcess.materialWasteQuantity && !this.materialWasteDataList.length&&!this.isXY) return this.$message.error("料废金额不能为空")
          let obj = {}
          let arr = []
          obj.classAttribute = this.currentProcess.classAttribute
          obj.orderType = this.currentProcess.orderType
          obj.productDrawingNo = this.currentProcess.productDrawingNo
          obj.processName = this.currentProcess.processName
          obj.productionQuantity = this.currentProcess.productionQuantity
          obj.equipmentId = this.currentProcess.equipmentId
          obj.remark = this.currentProcess.remark
          obj.reportingTime = this.currentProcess.reportingTime
          obj.reworkQuantity = this.currentProcess.reworkQuantity
          obj.responsibilityWasteQuantity = this.currentProcess.responsibilityWasteQuantity
          obj.materialWasteQuantity = this.currentProcess.materialWasteQuantity
          obj.causesList = [...this.materialWasteDataList,...this.responsWasteDataList]
          obj.pricingType = this.currentProcess.pricingType
          obj.processId = this.currentProcess.processId
          obj.producerId = this.currentProcess.producerId
          obj.accuracyLevel = this.currentProcess.accuracyLevel
          obj.standardValue = this.currentProcess.standardValue
          obj.productionOrderId = this.currentProcess.productionOrderId
          obj.qualifiedQuantity = this.currentProcess.qualifiedQuantity
          obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity, this.currentProcess.reworkQuantity,this.utilizeQuantity]), 6)
          obj.reportingType = "normal"
          obj.unqualifiedQuantity = this.currentProcess.unqualifiedQuantity
          obj.aperture = this.currentProcess.aperture
          obj.productionBarrels = this.currentProcess.productionBarrels
          obj.productionWeight = this.currentProcess.productionWeight
          obj.workOrderId = this.currentProcess.id
          // obj.forceCompleteFlag = this.currentProcess.forceCompleteFlag
          if (this.currentProcess.processType === 'boxing') {
            obj.processType = this.currentProcess.processType
            // obj.forceCompleteFlag = this.currentProcess.forceCompleteFlag
            obj.actualQualifiedQuantity = this.currentProcess.qualifiedQuantity
            // obj.mainUnit = '盒'
          }

          arr.push(obj)

          addWorkReport(arr).then(res => {
            this.$message.success("报工成功")
            this.init(this.id)
          })
        } else {
          // if (!this.currentProcess.vibrateReportFlag) {
          //   if (!this.currentProcess.qualifiedQuantity || this.currentProcess.qualifiedQuantity == 0) {
          //     this.iptLabelMargin = '38px'
          //   } else {
          //     this.iptLabelMargin = '18px'

          //   }
          // }
          // if (!this.currentProcess.producerId) {
          //   this.producerMargin = '38px'
          // } else {
          //   this.producerMargin = '18px'

          // }
          this.$nextTick(() => {
            const height = this.$refs.mycol.$el.clientHeight
            console.log('el-col的高度是1：', height);
            this.targetHeight = height;
          });
        }
      })


    },
    // 选择生产人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.reportRef.validateField('producerId')
      })
      this.currentProcess.producerId = e
    },
    dateFormat(dateData) {
      var date = new Date(dateData);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");
      var hours = date.getHours().toString().padStart(2, "0");
      var minutes = date.getMinutes().toString().padStart(2, "0");
      var seconds = date.getSeconds().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedDate
    },
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px
}




::v-deep .el-tabs__content {
height: auto !important;
padding: 0;
}

::v-deep .JNPF-common-page-header.noButtons {
padding: 9px 10px;
}
</style>
<style scoped lang="scss">
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

.el-table__footer {
  display: none;
}

::v-deep.has-gutter {
  display: none;
}

.JNPF-preview-main .main {
  padding-top: 0;
  margin-bottom: 10px;
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
  height: calc(100% - 48px);

}

::v-deep .el-collapse-item__content {
  height: 100%;
}

.reportInfo ::v-deep .el-collapse-item__wrap {
  padding: 0;
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

.orderInfo {
  height: 100%;
}

.eol {
  height: 100%;
  border-right: 1px solid #dcdfe6;
  background: #f5f7fa;
  padding-left: 10px;
}

.options {
  display: inline-block;
  float: right;
}

.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}

.setipImg {
  width: 60px;
  height: 60px;
}

.reportBox_left {
  /* padding-right: 10px; */
  /* margin-right: 15px; */
  background: #fff;
  /* margin-right: 5px; */
  padding-right: 10px;
  box-sizing: border-box;
  border-right: 5px solid #ebeef5;
  padding: 10px 0 0px 0;
  width: 220px;
  height: 640px;
  display: inline-block;
  overflow-y: auto;
}

.reportBox_left::-webkit-scrollbar {
  display: none;
  /* 对于 Chrome, Safari 和 Opera 的写法 */
}

.processInfoBox {
  background-image: url('../../../assets/images/success2.png');
  /* width: 90%; */
  /* height: 80px; */
  width: 160px;
  height: 50px;
  background-size: 100% 100%;
  margin: 0 auto;
  /* line-height: 80px; */
  /* border-radius: 2px; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 20px;
  box-sizing: border-box;
  font-size: 16px;
  padding-right: 20px;
  padding-top: 6px;
  line-height: 19px;
}

.processInfo {
  background-image: url('../../../assets/images/NotStarted3.png');
  margin: 0 auto;
  border-radius: 2px;
  color: #fff;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 隐藏超出的内容 */
  text-overflow: ellipsis;
}

.info {
  display: inline-block;
  vertical-align: top;
  overflow-y: auto;

}

.info ::v-deep .el-form {
  padding-left: 10px;
  padding-right: 10px;
  background: #ffa07a;
}

.information ::v-deep.el-form {
  padding-left: 10px;
  padding-right: 10px;
  background: #add8e6;
}

.reportBtn {
  // text-align: center;
  margin-top: 20px;
}

.tit {
  background: #fafafa;
  height: 48px;
  line-height: 48px;
  font-size: 18px;
  font-weight: 600;
  padding: 0 10px;
}

.info::-webkit-scrollbar {
  display: none;
  /* 对于 Chrome, Safari 和 Opera 的写法 */
}

.el-card {
  border: 0;
  border-top: 1px solid #EBEEF5;
}

box-card:nth-child(n+3) {
  margin-top: 10px
}

.workInfo:nth-child(n+2) {
  margin-left: -8px;
}

.taskInfo ::v-deep.el-form-item {
  margin-bottom: 0;
}

.taskInfo::v-deep .el-form-item__content {
  line-height: 40px !important;
}

.taskInfo::v-deep .el-form-item__label {
  line-height: 40px !important;

}

.taskInfo ::v-deep.el-form-item__content div {
  width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .el-col .el-form-item--small .el-form-item__content {
  line-height: 32px;
}

.stoclInfo {
  background: linear-gradient(0deg, #11B481 0.00%, #6ADE7D 100.00%);
  padding: 5px;
}

.stoclInfo .margin-top {
  background: linear-gradient(0deg, #11B481 0.00%, #6ADE7D 100.00%);

}

.orderInfo::v-deep .el-descriptions-item__label {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.orderInfo::v-deep .el-descriptions-item__content {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block !important;
}

.orderInfo ::v-deep .el-descriptions__table {
  background: linear-gradient(0deg, #11B481 0%, #6ADE7D 100%);
}

.box ::v-deep .el-descriptions__table {
  background: #6ADE7D;
}

.info {
  margin-top: 18px;
}

.fixedInfo {
  background: linear-gradient(0deg, #11B481 0.00%, #6ADE7D 100.00%);
  padding: 20px;
  color: #fff;
  padding: 20px;
  color: #fff;
  padding-top: 0;
  border-bottom: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
}

.rightInfo {
  width: 52%;
  /* border: 1px solid; */
  border-radius: 4px;
  // margin-left: 20px;
  float: right;
  box-shadow: beige;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}

.ipt ::v-deep.el-input__inner {
  height: 50px;
  line-height: 50px;
  font-size: 20px !important;
  font-weight: bold;
  padding-right: 0;
  border: 0;
}

.iptLabel ::v-deep.el-form-item__label {
  height: 50px;
  line-height: 50px;
  font-size: 20px !important;
  font-weight: bold;
  padding-left: 10px;
  padding-right: 0;
}

.rightInfo ::v-deep .el-form-item--small.el-form-item {
  border: 1px solid #ebeef5;
}

.JNPF-common-drawer ::v-deep.el-drawer__body {
  overflow-y: auto;
}

.ts {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.JNPF-dialog.JNPF-dialog_center ::v-deep.el-dialog .el-dialog__body {
  padding: 10px !important;
}

.left-title {
  font-size: 18px;
  font-weight: 600;
}

.reportBtn ::v-deep .el-button {

  line-height: 40px;
  background: #fff;
  color: #3fb9f8;
}

.reportBtn ::v-deep .el-button span {
  font-size: 18px !important;
  font-weight: bold;
}

.reportBtn_right .el-button {

  line-height: 40px;

}

.reportBtn_right ::v-deep .el-button span {
  font-size: 18px !important;
  font-weight: bold;
}

.process {
  padding-top: 5px;
  padding: 0px 10px;
  border: 1px solid #dcdfe6;
  padding-top: 5px;
  background: #f2f2f2;
}

.extend {
  width: 150px;
  position: absolute;
  right: 10px;
  top: 10px;
}

.external_text ::v-deep .el-descriptions-item__content,
.external_text ::v-deep .el-descriptions-item__label {
  font-size: 18px;
  font-weight: bold;
}

::v-deep .el-form-item__error {
  font-size: 16px !important;
  margin: 8px 0;
  padding-top: 0px;
}

.materialWaste {
  width: 70%;
}
</style>
