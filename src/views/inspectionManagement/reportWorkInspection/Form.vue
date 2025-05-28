<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="goBack" content="检验" />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" ref="main" v-loading="formLoading">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
            <el-form label-width="160px" label-position="top">
              <el-row :gutter="30" style="padding:0 10px">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="生产任务单号">
                    <el-input v-model="dataForm.productionOrderNo" placeholder="生产任务单号" disabled></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="6" :xs="24">
                  <el-form-item label="工单单号">
                    <el-input v-model="dataForm.workNo" placeholder="工单单号" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="报工单号">
                    <el-input v-model="dataForm.reportNo" placeholder="报工单号" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="报工人">
                    <el-input v-model="dataForm.createByName" placeholder="报工人" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="报工时间">
                    <el-input v-model="dataForm.reportingTime" placeholder="报工时间" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="工序名称">
                    <el-input v-model="dataForm.processName" placeholder="工序名称" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="品名规格">
                    <el-input v-model="dataForm.productDrawingNo" placeholder="品名规格" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="报工数量">
                    <el-input v-model="dataForm.reportingQuantity" placeholder="报工数量" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="检验信息" name="productInfo">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" style="padding:0 10px">
                <el-col :sm="12" :xs="24">
                  <el-form-item label="合格数量">
                    <el-input v-model="qualifiedQuantity" placeholder="合格数量" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="让步接收数量" prop="actualConcessionQuantity">
                    <el-input v-model="dataForm.actualConcessionQuantity" placeholder="让步接收数量"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="返工数量" prop="actualReworkQuantity">
                    <el-input placeholder="返工数量" v-model="dataForm.actualReworkQuantity" disabled>
                      <template slot="append">
                        <el-button @click="setReworkWasteM">修改</el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="责废数量" prop="actualResponsibilityWasteQuantity">
                    <el-input placeholder="责废数量" v-model="dataForm.actualResponsibilityWasteQuantity" disabled>
                      <template slot="append">
                        <el-button @click="setResponsWasteM">修改</el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="料废数量" prop="actualMaterialQuantity">
                    <el-input placeholder="料废数量" v-model="dataForm.actualMaterialQuantity" disabled>
                      <template slot="append">
                        <el-button @click="setMaterialWasteM">修改</el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <ReworkWaste v-if="reworkWasteFormVisible" ref="reworkWasteFormRef" @change="reworkWasteData"></ReworkWaste>
      <responsWaste v-if="responsWasteFormVisible" ref="responsWasteFormRef" @change="responsWasteData"></responsWaste>
      <MaterialWasteForm v-if="materialWasteFormVisible" ref="materialWasteFormRef" @change="materialWasteData">
      </MaterialWasteForm>
    </div>
  </transition>
</template>

<script>
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import {
  getcategoryTrees,
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
import { getOrderFiledMap } from '@/api/basicData/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'

import { mapGetters } from 'vuex'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
import ReworkWaste from './reworkWaste.vue'
import responsWaste from '../../completionReport/ringCompletionReport/responsWaste.vue'
import MaterialWasteForm from '../../completionReport/ringCompletionReport/materialWasteForm.vue'
import {
  addReportWorkInspectionData,
  updateInspectionData,
  detailInspectionData,
  detailInspectionDataByBizid
} from '@/api/inspectionManagement/index' // 产品检验项目列表
export default {
  components: { ReworkWaste, MaterialWasteForm, responsWaste },
  mixins: [AbProjectMixin],
  data() {
    return { 
      reworkWasteFormVisible: false,
      responsWasteFormVisible: false,
      materialWasteFormVisible: false,
      isProjectSwitch: '',
      isProductNameSwitch: '',
      isProportionSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      isattachmentswitch: '',
      categoryId: '',
      scanDialog: false,
      tipsvisible: false,
      submitmethodsTitle: '',
      btnText: '',
      productList: [],
      deliveryDateArr: [],
      activeNames: ['productInfo', 'basicInfo'],
      productTotal: 0,
      codeConfig: {},
      datafilelist: [],
      ordersLineId: '',
      code: '',
      iszhi: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,
      activeName: 'orderInfo',
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        exchangeGoodsFlag: false,
        inspectionStatus: '',
        warehouseId: '',
        createTime: '',
        createByName: '',
        id: '',
        // orderCategory: "assembly",
        returnDeliveryType: 'back',
        notificationType: 'procure',
        salesman: '',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        partnerName: '',
        orderNo: '',
        cooperativePartnerId: '',
        remark: '',
        approvalFlag: false,
        actualConcessionQuantity:"",
        actualReworkQuantity:"",
        actualResponsibilityWasteQuantity:"",
        actualMaterialQuantity:"",
      },
      workReport:{},
      defaultAddress: '',
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      dataRule: {
        actualConcessionQuantity: [
          { required: true, message: '让步接收数量不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (isNaN(value)) {
                callback(new Error('让步接收数量只允许输入数字'))
                //如果某个字段要求整数+数字
              } else if (Number(value) < 0) {
                callback(new Error('让步接收数量不能小于0'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      treeLoading: false,
      selectRows: [],
      warehouseIdList: [],
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      selectArr: [],
      customStyleData: 0,
      formLoading: true,
      prindId: '',
      formId: '',
      enCode: '',
      printBrowseVisible: false,
      printVisible: false,
      reworkWasteDataList: [],
      materialWasteDataList: [],
      responsWasteDataList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    qualifiedQuantity() {
      return (
        Number(this.dataForm.reportingQuantity) -
        Number(this.dataForm.actualResponsibilityWasteQuantity) -
        Number(this.dataForm.actualMaterialQuantity) -
        Number(this.dataForm.actualConcessionQuantity) - 
        Number(this.dataForm.actualReworkQuantity)
      )
    }
  },

  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  async created() {
    await this.getOrderFiledMap()
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getProportionSwitch('warehouse', 'proportion')
    this.formLoading = false
    // this.handleChange()
  },
  mounted() { },
  methods: {
    // 设置返工原因
    setReworkWasteM() {
      console.log('this.reworkWasteDataList', this.reworkWasteDataList)
      this.reworkWasteFormVisible = true
      this.$nextTick(() => {
        console.log(this.$refs.reworkWasteFormRef, 'this.$refs.reworkWasteFormRef')
        this.$refs.reworkWasteFormRef.init(
          JSON.parse(JSON.stringify(this.reworkWasteDataList)),
          this.dataForm.actualReworkQuantity,
          this.dataForm.projectId
        )
      })
    },
    reworkWasteData(data, totalNums) {
      console.log('返工数据', data, totalNums)
      this.reworkWasteDataList = data
      if (totalNums) {
        this.dataForm.actualReworkQuantity = totalNums
      }
      if (Number(this.qualifiedQuantity) <0) {
        this.$message.error('合格数量不能小于0')
        return
      }
     
    },
    // 设置责废原因
    setResponsWasteM() {
      console.log('this.responsWasteDataList', this.responsWasteDataList)

      this.responsWasteFormVisible = true
      this.$nextTick(() => {
        this.$refs.responsWasteFormRef.init(
          JSON.parse(JSON.stringify(this.responsWasteDataList)),
          this.dataForm.actualResponsibilityWasteQuantity,
          this.dataForm.projectId
        )
      })
    },
    responsWasteData(data, totalNums) {
      console.log('责废数据', data, totalNums)
      this.responsWasteDataList = data
      if (totalNums) {
        this.dataForm.actualResponsibilityWasteQuantity = totalNums
      }
      console.log(this.dataForm);
      if (Number(this.qualifiedQuantity) <0) {
        this.$message.error('合格数量不能小于0')
        return
      }
    },
    // 设置料废原因
    setMaterialWasteM() {
      console.log('this.materialWasteDataList', this.materialWasteDataList)
      this.materialWasteFormVisible = true
      this.$nextTick(() => {
        this.$refs.materialWasteFormRef.init(
          JSON.parse(JSON.stringify(this.materialWasteDataList)),
          this.dataForm.actualMaterialQuantity,
          this.dataForm.projectId
        )
      })
    },
    materialWasteData(data, totalNums) {
      console.log('设置的料废金额', data, totalNums)
      this.materialWasteDataList = data
      if (totalNums) {
        this.dataForm.actualMaterialQuantity = totalNums
      }
      console.log(this.dataForm);
      if (Number(this.qualifiedQuantity) <0) {
        this.$message.error('合格数量不能小于0')
        return
      }
    },

    getOrderFiledMap() {
      getOrderFiledMap('purchase').then((res) => {
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
        this.processFlag = res.data.process
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
      })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getProportionSwitch(code, type) {
      try {
        this.isProportionSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    scanFun() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error('请先选择供应商')
      this.scanDialog = true
      this.$nextTick(() => {
        this.$refs.inputRef.$refs.input.focus()
      })
    },
    closeScanDiaFun() {
      this.scanDialog = false
      this.scanResult = ''
      this.orderForm.productCode = ''
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
        this.$set(this.dataForm, 'orderNo', data.number)
      } catch (error) { }
    },
    init(row, readOnly, inspectionType, type, businessCode) {
      this.fetchData(businessCode, true)

      this.btnType = type
      this.approvalFlag = false
      console.log(inspectionType, 'ddd')

      this.dataForm = { ...row }
      this.workReport = {...row}
      this.qualifiedQuantity=this.dataForm.qualifiedQuantity
      this.dataForm.reportNo = this.dataForm.orderNo
      this.dataForm.actualResponsibilityWasteQuantity = Number(this.dataForm.responsibilityWasteQuantity) 
      this.dataForm.actualMaterialQuantity = Number(this.dataForm.materialWasteQuantity)
      this.dataForm.notificationType = 'work_report'
      this.workReport.notificationType = 'work_report'
      this.workReport.docLineId = this.dataForm.id
      console.log(this.dataForm, 'hhhh')
      this.dataForm.docLineId = this.dataForm.id
      this.dataForm.causesList.forEach((item) => {
        
        if (item.scrapCategoryType === 'responsibility_fee') {
          // 责废
          this.responsWasteDataList.push({
            name: item.scrapCategoryName,
            scrapCategoryName: item.scrapCategoryName,
            scrapCategoryId: item.scrapCategoryId,
            price: item.scrapCategoryPrice,
            num: item.scrapQuantity,
            scrapQuantity: item.scrapQuantity,
            amount: this.jnpf.numberFormat(
              this.jnpf.math('multiply', [item.scrapQuantity, item.scrapCategoryPrice]),
              6
            ),
            person: item.scrapUserId,
            scrapUserId: item.scrapUserId,
          })
        } else if (item.scrapCategoryType === 'material_fee') {
          // 料废
          this.materialWasteDataList.push({
            name: item.scrapCategoryName,
            scrapCategoryName: item.scrapCategoryName,
            scrapCategoryId: item.scrapCategoryId,
            price: item.scrapCategoryPrice,
            num: item.scrapQuantity,
            scrapQuantity: item.scrapQuantity,
            amount: this.jnpf.numberFormat(
              this.jnpf.math('multiply', [item.scrapQuantity, item.scrapCategoryPrice]),
              6
            ),
            person: item.scrapUserId,
            scrapUserId: item.scrapUserId,
          })
        }
      })

      if (this.btnType == 'edit') {
        this.btnText = '继续修改'
        this.getBusInfo()
      } else if (this.btnType == 'add' || this.btnType == 'copy') {
        this.btnText = '继续新增'
        console.log(6)
        this.getBusInfo()
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
    handleConfirm(value, type) {
      if (Number(this.qualifiedQuantity) <0) {
        this.$message.error('合格数量不能小于0')
        return
      }
      let submitFlag = true
      console.log(this.$refs['dataForm'])
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (!valid) {
          submitFlag = false
          this.btnLoading = false
        }
      })
      if (submitFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'system_attachment',
              configKey: 'fj_cgshd',
              categoryId: this.categoryId,
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        this.dataForm.causesList = []
        this.dataForm.causesList = [...this.responsWasteDataList, ...this.materialWasteDataList]
        this.dataForm.causesList.map(item=>{
          item.type = 'inspect'
        })
        // 实际合格数量 = 合格数量 + 让步接收数量
        this.dataForm.actualQualifiedQuantity =
          Number(this.qualifiedQuantity) + Number(this.dataForm.actualConcessionQuantity)
        console.log('actualQualifiedQuantity',this.dataForm.actualQualifiedQuantity);
        // 实际不合格数量 = 实际责废数量 + 实际料废数量
        this.dataForm.actualUnqualifiedQuantity = Number(this.dataForm.actualResponsibilityWasteQuantity) + Number(this.dataForm.actualMaterialQuantity)
        
        if (
          Number(this.dataForm.actualQualifiedQuantity) +
          Number(this.dataForm.actualUnqualifiedQuantity) +
          Number(this.dataForm.actualReworkQuantity) >
          Number(this.dataForm.reportingQuantity)
        ) {
          this.$message.error(`合格数量、让步接收数量、责废数量和料废数量、返工数量的合计不等于报工数量`)
          return
        }
        this.dataForm.inspectionStatus = 'inspected'
        let obj = {
          attachmentList: this.datafilelist,
          inspection: this.workReport,
          workReport: this.dataForm,
          lines: [],
          flowData: this.flowData
        }
        console.log(obj,'lll')
        this.btnLoading = true

        console.log(obj, 'obj')

        addReportWorkInspectionData(obj)
          .then((res) => {
            let msg = res.msg
            if (res.msg === 'Success') {
              msg = this.dataForm.documentStatus == 'submit' ? '提交成功' : '保存成功'
            }
            this.visible = false
            this.$emit('close', true)
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.btnLoading = false
              }
            })
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b034')
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
  padding-top: 5px;
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
  // padding: 10px;
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

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}

.scand ::v-deep.el-input__inner {
  height: 60px;
  line-height: 60px;
  font-size: 20px !important;
  font-weight: 600;
  border-color: #3fb9f8;
}

.scand .box {
  padding: 40px 20px;
}

.scand .tip {
  margin-top: 10px;
  font-size: 18px;
}
</style>
