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

        <el-collapse v-model="activeNames" >
          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" style="margin-top: 5px;">
            <el-form ref="dataForm" :model="dataForm" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="生产任务单号" prop="orderNo">
                    <el-input v-model="dataForm.orderNo" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="任务类型" prop="orderType">
                    <el-select v-model="dataForm.orderType" placeholder="任务类型" style="width: 100%;" disabled>
                      <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="品名规格" prop="productDrawingNo">
                    <el-input v-model="dataForm.productDrawingNo" placeholder="品名规格" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="产品编码" prop="productCode">
                    <el-input v-model="dataForm.productCode" placeholder="产品编码" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="总生产数量" prop="productionQuantity">
                    <el-input v-model="dataForm.productionQuantity" placeholder="总生产数量" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="已完成数量" prop="completedQuantity">
                    <el-input v-model="dataForm.completedQuantity" placeholder="已完成数量" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="工艺路线名称" prop="routingName">
                    <el-input v-model="dataForm.routingName" placeholder="工艺路线名称" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="工艺路线编码" prop="routingCode">
                    <el-input v-model="dataForm.routingCode" placeholder="工艺路线名称" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="打字内容" prop="sealingCoverTyping">
                    <el-input v-model="dataForm.sealingCoverTyping" placeholder="打字内容" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="精度等级" prop="accuracyLevel">
                    <el-input v-model="dataForm.accuracyLevel" placeholder="精度等级" disabled></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="6" :xs="24">
                  <el-form-item label="振动等级" prop="vibrationLevel">
                    <el-input v-model="dataForm.vibrationLevel" placeholder="振动等级" disabled></el-input>

                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="油脂" prop="oil">
                    <el-input v-model="dataForm.oil" placeholder="油脂" disabled></el-input>

                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="油脂量" prop="oilQuantity">
                    <el-input v-model="dataForm.oilQuantity" placeholder="油脂量" disabled></el-input>

                  </el-form-item>
                </el-col>

                <el-col :sm="6" :xs="24">
                  <el-form-item label="游隙" prop="clearance">
                    <el-input v-model="dataForm.clearance" placeholder="游隙" disabled></el-input>

                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="包装方式" prop="packagingMethod">
                    <el-input v-model="dataForm.packagingMethod" placeholder="包装方式" disabled></el-input>

                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="特殊要求" prop="specialRequire">
                    <el-input v-model="dataForm.specialRequire" placeholder="特殊要求" disabled></el-input>

                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="报工信息" name="productInfo" class="reportInfo">

            <div>

              <div style="margin-top: 5px; border-bottom: 1px solid #EBEEF5;padding: 0 10px;" >
                <div v-for="(item, index) in workList" :key="index" class="workInfo"
                  style="text-align: center;display: inline-block;">
                  <div class="processInfoBox" style="cursor: pointer;"
                    :class="item.processId == currentProcessId ? 'processInfo' : ''" @click="getProcessFun(item)">
                    {{ item.processName }} <div>({{ item.processCode }})</div>
                  </div>

                </div>
              </div>

              <div  class="info">
                <el-card class="box-card" shadow="hover" v-for="(item, index) in workList" :key="index"
                 >
                  <el-form label-width="160px" label-position="top">

                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="工单单号" prop="orderNo">
                          <el-input v-model="item.orderNo" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="工序名称" prop="processName">
                          <el-input v-model="item.processName" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="工序编码" prop="processCode">
                          <el-input v-model="item.processCode" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="班组" prop="workGroupName">
                          <el-input v-model="item.workGroupName" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="人员" prop="personName">
                          <el-input v-model="item.personName" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="计划开始日期" prop="planStartDate">
                          <el-input v-model="item.planStartDate" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="计划结束日期" prop="planEndDate">
                          <el-input v-model="item.planEndDate" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="item.processingType == 'self_produced'">
                        <el-form-item label="生产数量" prop="productionQuantity">
                          <el-input v-model="item.productionQuantity" placeholder="生产数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="item.processingType == 'self_produced'">
                        <el-form-item label="可报工数量" prop="waitReportNum">
                          <el-input v-model="item.waitReportNum" placeholder="可报工数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="item.processingType == 'self_produced'">
                        <el-form-item label="合格数量" prop="qualifiedQuantity">
                          <el-input v-model="item.qualifiedQuantity" placeholder="合格数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="item.processingType == 'self_produced'">
                        <el-form-item label="不合格数量" prop="unqualifiedQuantity">
                          <el-input v-model="item.unqualifiedQuantity" placeholder="不合格数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>

                    </el-row>
                  </el-form>
                  <!-- <div class="label_title"> 品名规格:{{item.productDrawingNo}}</div>                    -->

                  <div v-if="item.processingType == 'self_produced' && item.reportFlag == true">
                    <el-button type="primary" size="mini" @click='report(item)'>报 工</el-button>
                                        <el-button type="primary" size="mini" @click='transferOutFun()'>转外协</el-button>

                    <el-button type="primary" size="mini" @click="reportRecordsFun(item)">查看报工记录</el-button>
                  </div>
                </el-card>



              </div>
            </div>



          </el-collapse-item>
        </el-collapse>

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
import { log } from 'mathjs'
import NormalForm from './NormalForm.vue'
import VibrateForm from './VibrateForm.vue'
import recordForm from './recordForm.vue'
export default {

  components: {
    NormalForm, VibrateForm, recordForm
  },
  data() {
    return {
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
    }
  },

  mounted() {
  },

  methods: {
     // 转外协
     transferOutFun(row){

},
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
      })
    },
    getProcessFun(item) {
      this.currentProcess = item
      this.currentProcessId = item.processId
      console.log("当前current", item);
      this.getWorkListFun()
    },
    getRoutingDetailFun(id) {
      detailProcess(id).then((res) => {
        console.log("工艺详情", res);
        this.currentProcessId = res.data.routingLineList[0].processId
        this.currentProcess = res.data.routingLineList[0]
        this.processData = res.data.routingLineList
        this.getWorkListFun()
        let vibrateData = this.processData.find(item => item.processType === "vibrate");

        if (vibrateData) {
          this.sort = vibrateData.sort + ''
        } else {
        }
      })
    },
    getWorkListFun() {
      let obj = {
        processId: this.currentProcessId,
        productionOrderId: this.dataForm.id
      }
      getWorkList(obj).then(res => {
        this.workList = res.data.records
      })
    },
    goBack() {
      this.$emit("close", false)
    },
    // 查看报工记录
    viewReportRecords(item) {
      console.log("item记录", item);
    },
    reportRecordsFun(row) {
      this.recordFormVisible = true
      this.$nextTick(() => {
        this.$refs.recordForm.init(row.orderNo)
      })
    },
    // 报工
    report(item) {
      // 先判断是否有测震工序(sort有值表示有测震工序)  
      // 如果有 拿当前工序排序值大于等于测震工序值 则表示是测震工序或测震后工序
      // 如果没有 则是测震前工序
      console.log('scort', this.sort, this.currentProcess.sort);

      if (item.vibrateReportFlag) {
        this.vibrateFormVisible = true
        this.$nextTick(() => {
          this.$refs.VibrateForm.init(item)

        })
      } else {
        this.normalFormVisible = true
        this.$nextTick(() => {
          this.$refs.normalForm.init(item)

        })
      }

      // let arr = [];
      // let obj = {
      //   "classAttribute": item.classAttribute,

      //   "materialWasteQuantity": item.materialWasteQuantity,
      //   "orderNo": item.orderNo,
      //   "pricingType": item.pricingType,
      //   "processId": item.processId,
      //   "producerId": item.personId,
      //   "productionOrderId": item.productionOrderId,
      //   "qualifiedQuantity": item.qualifiedQuantity,
      //   "reportingQuantity": item.waitReportNum,
      //   "reportingType": "normal ",
      //   "unqualifiedQuantity": item.unqualifiedQuantity,
      //   "vibrationLevel": item.vibrationLevel,
      //   "workOrderId": item.id,
      // }
      // arr.push(obj)
      // addWorkReport(arr).then(res => {
      //   this.getRoutingDetailFun(this.dataForm.routingId)
      // })
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
<style scoped>
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
  border-top: none !important;

}
.reportInfo ::v-deep .el-collapse-item__wrap{
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

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important
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
  background-image: url('../../../assets/images/NotStarted.png');
  margin: 0 auto;
  border-radius: 2px;
  color: #0b80e0;
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

.info::-webkit-scrollbar {
  display: none;
  /* 对于 Chrome, Safari 和 Opera 的写法 */
}
 .el-card{
  border: 0;
  border-top: 1px solid #EBEEF5;
 }
box-card:nth-child(n+3) {
  margin-top: 10px
}
.workInfo:nth-child(n+2){
  margin-left: -8px;
}
</style>