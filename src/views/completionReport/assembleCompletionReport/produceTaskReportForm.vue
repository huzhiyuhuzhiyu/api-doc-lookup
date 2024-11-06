<template>
  <div>
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="'生产任务报工'" />
        <div class="options">

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
                <el-descriptions-item label="总生产数量">{{ dataForm.productionQuantity }}</el-descriptions-item>
                <el-descriptions-item label="工艺名称">{{ dataForm.routingName }}</el-descriptions-item>
                <el-descriptions-item label="打字内容">{{ dataForm.sealingCoverTyping }}</el-descriptions-item>
                <el-descriptions-item label="精度等级">{{ dataForm.accuracyLevel }}</el-descriptions-item>
                <el-descriptions-item label="振动等级">{{ dataForm.vibrationLevel }}</el-descriptions-item>
                <el-descriptions-item label="油脂">{{ dataForm.oil }}</el-descriptions-item>
                <el-descriptions-item label="油脂量">{{ dataForm.oilQuantity }}</el-descriptions-item>
                <el-descriptions-item label="游隙">{{ dataForm.clearance }}</el-descriptions-item>
                <el-descriptions-item label="包装方式">{{ dataForm.packagingMethod }}</el-descriptions-item>
                <el-descriptions-item label="特殊要求">{{ dataForm.specialRequire }}</el-descriptions-item>
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
                {{ item.processName }} <div>({{ item.processCode }})</div>
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
                  <span class="left-title" v-if="currentProcess.orderType == 'normal'">正常工单</span>
                  <span class="left-title" v-if="currentProcess.orderType == 'rework'">返工工单</span>
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


              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">打字内容：</span>
                  <span class="left-title">{{ currentProcess.sealingCoverTyping }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">精度等级：</span>
                  <span class="left-title">{{ currentProcess.accuracyLevel }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">振动等级：</span>
                  <span class="left-title">{{ currentProcess.vibrationLevel }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">油脂：</span>
                  <span class="left-title">{{ currentProcess.oil }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">油脂量：</span>
                  <span class="left-title">{{ currentProcess.oilQuantity }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">游隙：</span>
                  <span class="left-title">{{ currentProcess.clearance }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">包装方式：</span>
                  <span class="left-title">{{ currentProcess.processName }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">特殊要求：</span>
                  <span class="left-title">{{ currentProcess.specialRequire }}</span>
                </div>

              </el-col>

            </el-row>
          </el-col>
          <el-col :span="12" class="rightInfo" :style="{ height: targetHeight2 + 'px!important' }" ref="mycol"
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
                </div>
                <div style="padding: 0 20px;">

                  <el-col :sm="24" :xs="24" v-if="!currentProcess.vibrateReportFlag">
                    <el-form-item label="合格数量:" prop="qualifiedQuantity" class="iptLabel"
                      :style="{ marginBottom: iptLabelMargin }">
                      <el-input v-model="currentProcess.qualifiedQuantity" placeholder="合格数量" class="ipt"
                        @blur="handleBlur(item)" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" v-for="(item, index) in vibrationLevelList" :key="index"
                    v-if="currentProcess.vibrateReportFlag">
                    <el-form-item :label="item.name + '(合格数量):'" :prop="item.name" class="iptLabel">
                      <el-input v-model="currentProcess.item[item.name]" placeholder="合格数量" @input="forceUpdata"
                        @blur="handleBlur(item, currentProcess.item[item.name])" class="ipt" />
                    </el-form-item>
                  </el-col>

                  <el-col :sm="24" :xs="24" :style="!currentProcess.vibrateReportFlag ? 'margin-top:5px' : ''">
                    <el-form-item label="责废数量:" class="iptLabel">
                      <el-input v-model="currentProcess.responsibilityWasteQuantity" placeholder="责废数量"
                        @blur="handleBlur2" class="ipt" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="料废数量:" class="iptLabel">
                      <el-input v-model="currentProcess.materialWasteQuantity" placeholder="料废数量" @blur="handleBlur3"
                        class="ipt" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="返工数量:" class="iptLabel">
                      <el-input v-model="currentProcess.reworkQuantity" placeholder="返工数量" class="ipt" />
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
                    <el-form-item label="生产人:" prop="producerId" v-if="currentProcess.taskMethod == 'not_appoint'" :style="{ marginBottom: producerMargin }"
                      class="iptLabel">
                      <user-select v-model="currentProcess.producerId" placeholder="生产人" clearable style="width: 100%;"
                        class="ipt" @change="hangleSelectSales">
                      </user-select>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="设备:" class="iptLabel">
                      <el-select v-model="currentProcess.equipmentName" placeholder="设备" style="width: 100%;"
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
                    <el-descriptions-item label="完工数量" class="external_cotent">{{ currentProcess.qualifiedQuantity?currentProcess.qualifiedQuantity:0
                      }}</el-descriptions-item>
                  </el-descriptions>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="发料数量" class="external_cotent ">
                      <span class="mater">{{ dataForm.productionQuantity }}</span>

                    </el-descriptions-item>
                  </el-descriptions>
                </div>


              </el-row>
            </el-form>
          </el-col>
        </div>
      </div>


    </div>
    <NormalForm v-if="normalFormVisible" ref="normalForm" @close="closeForm"></NormalForm>
    <VibrateForm v-if="vibrateFormVisible" ref="VibrateForm" @close="closeForm"></VibrateForm>
    <recordForm v-if="recordFormVisible" ref="recordForm"></recordForm>

  </div>
</template>

<script>

import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { detailProcess, } from '@/api/basicData/processSettingss.js'
import { detailordershengchan, getWorkList, addWorkReport } from '@/api/productOrdes/index.js'
import { producePersonList } from "@/api/warehouseManagement/packingList.js"
import { log } from 'mathjs'
import NormalForm from './NormalForm.vue'
import VibrateForm from './VibrateForm.vue'
import recordForm from './recordForm.vue'
export default {

  components: {
    NormalForm, VibrateForm, recordForm,
  },
  data() {
    return {
      targetHeight: "",
      targetHeight2: "",
      processOutFormVisible: false,
      recordFormVisible: false,
      normalFormVisible: false,
      vibrateFormVisible: false,
      activeName: 'orderInfo',
      activeNames: ['basicInfo', 'productInfo'],
      orderTypeList: [
        { label: "正常订单", value: "normal", },
        { label: "返工订单", value: "rework", },
      ],
      dataForm: {
      },
      codeConfig: {},//单据规则配置
      workList: [],


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
          { validator: this.formValidate('noZero', '合格数量不能为0', (errMsg) => { this.$message.error(errMsg) }), trigger: 'blur' },
        ]
      },
      iptLabelMargin: '28px',
      producerMargin: '28px'
    }
  },

  mounted() {
  },

  methods: {

    closeForm(flag) {
      if (flag) this.getRoutingDetailFun(this.dataForm.routingId)
    },
    init(id) {
      this.id = id
      detailordershengchan(id).then(res => {
        this.dataForm = res.data.prodOrder
        this.workList = res.data.workOrderList
        this.currentProcessId = res.data.workOrderList[0].processId
        this.currentProcess = res.data.workOrderList[0]
        this.$set(this.currentProcess, 'reportingQuantity', 0)
        this.$set(this.currentProcess, 'qualifiedQuantity', "")
        this.$set(this.currentProcess, 'unqualifiedQuantity', 0)
        this.$set(this.currentProcess, 'materialWasteQuantity', 0)
        this.$set(this.currentProcess, 'responsibilityWasteQuantity', 0)
        this.$set(this.currentProcess, 'reworkQuantity', 0)

        this.commonFun()
        // this.getRoutingDetailFun(this.dataForm.routingId)
      })
    },
    getProcessFun(item) {
      this.currentProcess = item
      this.currentProcessId = item.processId
      this.$set(this.currentProcess, 'reportingQuantity', 0)
      this.$set(this.currentProcess, 'qualifiedQuantity', "")
      this.$set(this.currentProcess, 'unqualifiedQuantity', 0)
      this.$set(this.currentProcess, 'materialWasteQuantity', 0)
      this.$set(this.currentProcess, 'responsibilityWasteQuantity', 0)
      this.$set(this.currentProcess, 'reworkQuantity', 0)
      console.log("当前current", item);
      this.targetHeight = ""
      this.targetHeight2 = ""
      this.commonFun()

    },
    handleBlur(item, data) {
      console.log("item", item, data, this.currentProcess.item);
      let total
      if (this.currentProcess.item) {
        total = Object.values(this.currentProcess.item)
          .map(Number) // 将每个值转换为数字  
          .reduce((acc, curr) => acc + curr, 0); // 使用 reduce 方法计算总和
      } else {
        total = this.currentProcess.qualifiedQuantity
      }
      if (!this.currentProcess.vibrateReportFlag) {
        // if (!this.currentProcess.qualifiedQuantity || this.currentProcess.qualifiedQuantity == 0) {
        //   this.iptLabelMargin = '24px'
        // } else {
        //   this.iptLabelMargin = '18px'
        //   if (!this.currentProcess.producerId) {
        //     this.producerMargin = '24px'
        //   } else {
        //     this.producerMargin = '18px'
        //   }
         

        // }
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      }
      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [total, this.currentProcess.unqualifiedQuantity]), 6)
      this.$set(this.currentProcess, 'reportingQuantity', this.totalReportNum)
    },
    handleBlur2() {
      this.currentProcess.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.materialWasteQuantity, this.currentProcess.responsibilityWasteQuantity]), 6)
      let total
      if (this.currentProcess.item) {
        total = Object.values(this.currentProcess.item)
          .map(Number) // 将每个值转换为数字  
          .reduce((acc, curr) => acc + curr, 0); // 使用 reduce 方法计算总和
      } else {
        total = this.currentProcess.qualifiedQuantity
      }
      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [total, this.currentProcess.unqualifiedQuantity]), 6)
      this.$set(this.currentProcess, 'reportingQuantity', this.totalReportNum)
    },
    handleBlur3() {
      this.currentProcess.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.materialWasteQuantity, this.currentProcess.responsibilityWasteQuantity]), 6)
      let total
      if (this.currentProcess.item) {
        total = Object.values(this.currentProcess.item)
          .map(Number) // 将每个值转换为数字  
          .reduce((acc, curr) => acc + curr, 0); // 使用 reduce 方法计算总和
      } else {
        total = this.currentProcess.qualifiedQuantity
      }
      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [total, this.currentProcess.unqualifiedQuantity]), 6)
      this.$set(this.currentProcess, 'reportingQuantity', this.totalReportNum)
    },
    commonFun() {
      this.currentProcess.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.materialWasteQuantity, this.currentProcess.responsibilityWasteQuantity]), 6)
      if (this.currentProcess.vibrateReportFlag) {
        this.$set(this.currentProcess, 'item', {})
        this.getvibrationLevelFun()
      } else {
        if (this.currentProcess.processingType == 'self_produced' && this.currentProcess.reportFlag == true) {

          this.$nextTick(() => {
            const height = this.$refs.mycol.$el.clientHeight
            this.targetHeight = height;
          });
        } else {
          const height = this.$refs.fixedInfo.$el.clientHeight
          this.targetHeight2 = height;
        }
      }
      this.producePersonListFun(this.currentProcess.id)
      const end = new Date();//获取当前的日期
      this.currentProcess.reportingTime = this.dateFormat(end)
    },
    // 获取生产人员数据
    producePersonListFun(id) {
      producePersonList(id).then(res => {

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
        typeCode: "pa005",
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
        this.vibrationLevelList = res.data.records
        res.data.records.forEach(item => {
          this.$set(this.currentProcess, item[item.name], 0)
          // this.currentProcess.item[item.name] = ""
        });
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
        console.log(666666, this.currentProcess);
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
          if (this.totalReportNum > Number(this.currentProcess.waitReportNum)) {
            this.submitFlag = false
            this.$message.error("合格数量加上不合格数量不能超过可报工数量")
            return
          }
          if (submitFlag === false) return
          let arr = []
          if (this.currentProcess.vibrateReportFlag) {

            if (this.vibrationLevelList.length) {
              this.vibrationLevelList.forEach((item, index) => {
                let obj = {}
                if (index == 0) {
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
                  obj.pricingType = this.currentProcess.pricingType
                  obj.processId = this.currentProcess.processId
                  obj.producerId = this.currentProcess.producerId
                  obj.productionOrderId = this.currentProcess.productionOrderId
                  obj.qualifiedQuantity = this.currentProcess.item[item.name]
                  obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.item[item.name], this.currentProcess.unqualifiedQuantity, this.currentProcess.reworkQuantity]), 6)
                  obj.reportingType = "normal"
                  obj.unqualifiedQuantity = this.currentProcess.unqualifiedQuantity
                  obj.vibrationLevel = item.name
                  obj.workOrderId = this.currentProcess.id
                  arr.push(obj)
                } else {
                  obj.classAttribute = this.currentProcess.classAttribute
                  obj.orderType = this.currentProcess.orderType
                  obj.productDrawingNo = this.currentProcess.productDrawingNo
                  obj.processName = this.currentProcess.processName
                  obj.productionQuantity = this.currentProcess.productionQuantity
                  obj.equipmentId = this.currentProcess.equipmentId
                  obj.remark = this.currentProcess.remark
                  obj.reportingTime = this.currentProcess.reportingTime
                  obj.reworkQuantity = 0
                  obj.responsibilityWasteQuantity = this.currentProcess.responsibilityWasteQuantity
                  obj.materialWasteQuantity = this.currentProcess.materialWasteQuantity
                  obj.pricingType = this.currentProcess.pricingType
                  obj.processId = this.currentProcess.processId
                  obj.producerId = this.currentProcess.producerId
                  obj.productionOrderId = this.currentProcess.productionOrderId
                  obj.qualifiedQuantity = this.currentProcess.item[item.name]
                  obj.reportingQuantity = this.currentProcess.item[item.name]
                  obj.reportingType = "normal"
                  obj.unqualifiedQuantity = 0
                  obj.vibrationLevel = item.name
                  obj.workOrderId = this.currentProcess.id
                  arr.push(obj)
                }
              });
            }
          } else {
            let obj = {
              "classAttribute": this.currentProcess.classAttribute,
              orderType: this.currentProcess.orderType,
              productDrawingNo: this.currentProcess.productDrawingNo,
              processName: this.currentProcess.processName,
              productionQuantity: this.currentProcess.productionQuantity,
              equipmentId: this.currentProcess.equipmentId,
              remark: this.currentProcess.remark,
              reportingTime: this.currentProcess.reportingTime,
              reworkQuantity: this.currentProcess.reworkQuantity,
              responsibilityWasteQuantity: this.currentProcess.responsibilityWasteQuantity,
              reworkQuantity: this.currentProcess.reworkQuantity,
              "materialWasteQuantity": this.currentProcess.materialWasteQuantity,
              "pricingType": this.currentProcess.pricingType,
              "processId": this.currentProcess.processId,
              "producerId": this.currentProcess.producerId,
              "productionOrderId": this.currentProcess.productionOrderId,
              "qualifiedQuantity": this.currentProcess.qualifiedQuantity,
              "reportingQuantity": this.currentProcess.qualifiedQuantity,
              "reportingType": "normal ",
              "unqualifiedQuantity": this.currentProcess.unqualifiedQuantity,
              "vibrationLevel": this.currentProcess.vibrationLevel,
              "workOrderId": this.currentProcess.id,
            }
            arr.push(obj)
          }
          addWorkReport(arr).then(res => {
            this.$message.success("报工成功")
            this.init(this.id)
          })
        } else {
          // if (!this.currentProcess.vibrateReportFlag) {
          //   if (!this.currentProcess.qualifiedQuantity || this.currentProcess.qualifiedQuantity == 0) {
          //     this.iptLabelMargin = '24px'
          //   } else {
          //     this.iptLabelMargin = '24px'

          //   }
          // }
          // if (!this.currentProcess.producerId) {
          //   this.producerMargin = '24px'
          // } else {
          //   this.producerMargin = '24px'

          // }
          this.$nextTick(() => {
            const height = this.$refs.mycol.$el.clientHeight
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
  margin-bottom: 10px
}



//.el-button--small {
// padding: 1;
//}</style>
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
  padding: 0px;
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
  margin: 8px 0
}
</style>