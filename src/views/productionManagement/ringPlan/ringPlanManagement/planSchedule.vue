<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" :content="'计划进度'" />
          <div class="options">
            <!-- <el-button type="primary" size="mini" @click="associationTaskFun">查看关联任务</el-button> -->
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-collapse v-model="activeNames1" class="orderInfo">
            <el-collapse-item title="计划信息" name="basicInfo">
              <div class="stoclInfo">
                <el-descriptions :column="1" class="orderNo">
                  <el-descriptions-item label="计划单号"  >{{ dataForm.productionPlanNo
                    }}</el-descriptions-item>
                 
                </el-descriptions>
                <el-descriptions :column="1" class="box">
                  <el-descriptions-item label="品名规格" class="drawingNo">{{ dataForm.productsDrawingNo
                    }} <img v-if="dataForm.urgentFlag" src="@/assets/images/emergency1.png" alt=""
                      style="width: 30px;vertical-align: top;"> </el-descriptions-item>
                </el-descriptions>

                <!-- <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" sortable="custom" />
            <el-table-column prop="productsDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="productsCode" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="planProductionQuantity" label="计划生产数量" min-width="160" sortable="custom" />
            <el-table-column prop="availableArrangeQuantity" label="可编排数量" min-width="160" sortable="custom" />
            <el-table-column prop="arrangeOrderNum" label="已编排单数/数量" min-width="180" sortable="custom" />
            <el-table-column prop="urgentFlag" label="是否紧急" min-width="120" sortable="custom"
              :cell-class-name="cellClassName">
              <template slot-scope="scope">
                <div :style="scope.row.urgentFlag ? 'color:red' : ''">{{ scope.row.urgentFlag ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" sortable="custom" />
            <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
            <el-table-column prop="oil" label="油脂" min-width="100" sortable="custom" />
            <el-table-column prop="oilQuantity" label="油脂量" min-width="120" sortable="custom" />
            <el-table-column prop="clearance" label="游隙" min-width="100" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom" />
            <el-table-column prop="specialRequire" label="特殊要求" min-width="160" sortable="custom" />
            <el-table-column prop="arithmeticNo" label="运算单号" min-width="160" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" /> -->

                <el-descriptions class="margin-top" :column="4">
                  <el-descriptions-item label="产品编码">{{ dataForm.productsCode }}</el-descriptions-item>
                  <el-descriptions-item label="计划生产数量">{{ dataForm.planProductionQuantity }}{{ dataForm.mainUnit
                    }}</el-descriptions-item>
                  <el-descriptions-item label="已完成数量">{{ dataForm.completedQuantity?dataForm.completedQuantity:'0' }}{{ dataForm.mainUnit
                    }}</el-descriptions-item>
                  <el-descriptions-item label="打字内容">{{ dataForm.sealingCoverTyping }}</el-descriptions-item>
                  <el-descriptions-item label="精度等级">{{ dataForm.accuracyLevel }}</el-descriptions-item>
                  <el-descriptions-item label="振动等级">{{ dataForm.vibrationLevel }}</el-descriptions-item>
                  <el-descriptions-item label="油脂">{{ dataForm.oil }}</el-descriptions-item>
                  <el-descriptions-item label="油脂量">{{ dataForm.oilQuantity }}</el-descriptions-item>
                  <el-descriptions-item label="游隙">{{ dataForm.clearance }}</el-descriptions-item>
                  <el-descriptions-item label="包装方式">{{ dataForm.packagingMethod }}</el-descriptions-item>
                  <el-descriptions-item label="特殊要求">{{ dataForm.specialRequire }}</el-descriptions-item>
                  <el-descriptions-item label="计划日期">{{ dataForm.planStartDate }}至{{ dataForm.planEndDate
                    }}</el-descriptions-item>
                </el-descriptions>
               
              </div>
            </el-collapse-item>
            <el-collapse-item title="任务信息" name="info">

              <!-- <el-radio-group v-model="categoryType" style="background-color:#fafafa;width:100%;height: 40px;">
                <el-radio-button v-for="item in categoryTypeList"  :key="item.code" style="height: 100%;"
                  :label="item.code">{{
                    item.fullName
                  }}</el-radio-button>
              </el-radio-group>
              <JNPF-table ref="work" v-if="categoryType == 'workOrder'" :data="workOrderData" fixedNO
                v-loading="tableloading">
                <el-table-column prop="processName" label="工序名称" min-width="120" />
                <el-table-column prop="processCode" label="工序编码" min-width="120"></el-table-column>
                <el-table-column prop="processingType" label="加工类型" min-width="120">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.processingType == "self_produced" ? "自制" : "外协" }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="planStartDate" label="计划开始日期" min-width="150"></el-table-column>
                <el-table-column prop="planEndDate" label="计划结束日期" min-width="150"></el-table-column>
                <el-table-column prop="mainUnit" label="单位" min-width="80"></el-table-column>
                <el-table-column prop="productionQuantity" label="生产数量" min-width="100"></el-table-column>
                <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="100"></el-table-column>
                <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="130"></el-table-column>
                <el-table-column v-if="dataForm.taskMethod != 'not_appoint'" prop="personName" label="人员"
                  min-width="120">
                </el-table-column>
                <el-table-column v-if="dataForm.taskMethod != 'not_appoint'" prop="workGroupName" label="班组"
                  min-width="160">
                </el-table-column>
                <el-table-column v-if="dataForm.taskMethod != 'not_appoint'" prop="device" label="设备" min-width="120">
                </el-table-column>
                <el-table-column prop="pickingFlag" label="是否领料" min-width="100">
                  <template slot-scope="scope">
                    <div>{{ scope.row.pickingFlag ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="firstInspection" label="是否首检" min-width="100">
                  <template slot-scope="scope">
                    <div>{{ scope.row.firstInspection ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="checkFlag" label="是否检验" min-width="100">
                  <template slot-scope="scope">
                    <div>{{ scope.row.checkFlag ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="reportFlag" label="是否报工" min-width="100">
                  <template slot-scope="scope">
                    <div>{{ scope.row.reportFlag ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="stockFlag" label="是否入库" min-width="100">
                  <template slot-scope="scope">
                    <div>{{ scope.row.stockFlag ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
              </JNPF-table>
              <JNPF-table ref="feed" v-if="categoryType == 'feed'" :data="feedData" fixedNO v-loading="tableloading"
                :key="Math.random()">
                <el-table-column prop="productDrawingNo" show-overflow-tooltip label="用料规格"></el-table-column>
                <el-table-column prop="productCode" label="用料编码" />
                <el-table-column prop="processName" label="工序名称" />
                <el-table-column prop="mainUnit" label="单位" />
                <el-table-column prop="qty" label="单位用量" v-if="dataForm.orderType != 'rework'" />
                <el-table-column prop="materialsUsedQuantity" label="计划用量" />
                <el-table-column prop="receivedQuantity" label="已领数量" />
                <el-table-column prop="inventoryQuantity" label="库存数量">
                  <template slot-scope="scope">
                    <div>{{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : "0" }}</div>
                  </template>
                </el-table-column>
              </JNPF-table>
              <JNPF-table ref="feed" v-if="categoryType == 'report'" :data="recoredsData" fixedNO
                v-loading="tableloading" :key="Math.random()">
                <el-table-column prop="workNo" label="工单号" min-width="180"></el-table-column>
                <el-table-column prop="orderNo" label="报工单号" min-width="180"></el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="180"></el-table-column>
                <el-table-column prop="processName" label="工序名称" width="160" />
                <el-table-column prop="reportingTime" label="报工时间" min-width="160" />
                <el-table-column prop="producerName" label="生产人" min-width="160" />
                <el-table-column prop="mainUnit" label="单位" min-width="160" />
                <el-table-column prop="reportingQuantity" label="报工数量" min-width="160" />
                <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="160" />
                <el-table-column prop="responsibilityWasteQuantity" label="责废数量" min-width="160" />
                <el-table-column prop="materialWasteQuantity" label="料废数量" min-width="160" />
                <el-table-column prop="reworkQuantity" label="返工数量" min-width="160" />
                <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" />
                <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
              </JNPF-table> -->
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      
   
    </transition>
 
  </div>
</template>
<script>
import { detailordershengchan } from '@/api/productOrdes/index.js'
import { getWorkReportList } from "@/api/productOrdes/index.js"
export default {
  data() {
    return {
      relatedTaskVisible:false,
      categoryTypeList: [
        { code: "workOrder", fullName: "工单", },
        { code: "feed", fullName: "投料", },
        { code: "report", fullName: "报工", },
        { code: "test", fullName: "检验", },
        { code: "guidebook", fullName: "作业指导书", },
        { code: "inspectionManual", fullName: "检验指导书", },
        { code: "tool", fullName: "工装模具", },
      ],
      categoryType: "workOrder",
      orderTypeList: [
        { label: "正常订单", value: "normal", },
        { label: "返工订单", value: "rework", },
      ],
      orderStatusList: [

        { label: "进行中", value: "normal", },

        { label: "暂停", value: "suspend", },

        { label: "关闭", value: "closed", },

        { label: "已完成", value: "finish", },

      ],

      urgentFlagList: [

        { label: "是", value: true, },

        { label: "否", value: false, },

      ],

      recoredsData: [],

      activeNames1: ["basicInfo",'info'],

      activeNames2: ["workOrderInfoForm"],

      activeNames3: ["feedInfoForm"],

      activeNames4: ['record'],

      activeName: 'orderInfo',

      feedData: [],

      workOrderData: [],

      dataForm: {},

      formLoading: false,

      btnType: "",

      title: "",

      prodOrderId: "", 
    }

  },

  watch: {

    'categoryType': function (newVal) {
      this.getTabdataList()
    },
  },
  mounted() {
  },
  methods: {
    selectRelatedTasksFun(val){
      this.init(val.id)
    },
    getTabdataList() {

      // 工单数据

      if (this.categoryType == 'workOrder') {



      } else if (this.categoryType == 'feed') {

        // 投料

      } else if (this.categoryType == 'report') {

        // 报工

        let obj = {

          productionOrderNo: this.prodOrderId,
          classAttribute: "finish_product",
          processId: "",
          "orderItems": [
            {
              "asc": false,
              "column": ""
            },
            {
              "asc": false,
              "column": "create_time"
            }
          ],
          pageNum: -1,
          pageSize: 20,
        }
        getWorkReportList(obj).then(res => {
          this.recoredsData = res.data.records
        })

      } else if (this.categoryType == 'test') {
        // 检验
      } else if (this.categoryType == 'guidebook') {
        // 作业指导书
      } else if (this.categoryType == 'inspectionManual') {
        // 检验指导书
      } else if (this.categoryType == 'tool') {
        // 工装模具
      }
    },
    goBack() {
      this.$emit('close')
    },

    associationTaskFun() {
      this.relatedTaskVisible=true
      console.log(666);
      this.$nextTick(()=>{
        this.$refs.relatedTaskForms.init(this.dataForm.productionPlanNo)
      })
    },
    init(row) {
      console.log(row);
      this.dataForm=row
     
    },





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



::v-deep .JNPF-common-page-header.noButtons {

  padding: 11px 10px;

}



.required {

  color: red;

  margin-right: 4px;

}



::v-deep .el-tabs__header {

  padding: 0 !important;

  padding-bottom: 0px !important;

  margin-bottom: 0;

}
</style>

<style scoped>
::v-deep .el-tabs__content {

  height: auto !important;

  padding: 0;

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



.JNPF-common-search-box {

  padding: 8px 0px 0;

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

  margin-bottom: 0;



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

  margin-top: 5px;

}

::v-deep.routingProRes .el-dialog__body {

  height: 500px;

}



::v-deep .applySelect .el-icon-arrow-up:before {

  content: "";

}



.underline-button {

  text-decoration: underline;

}
.personBox p {
  text-align: center;
}
.personBox:nth-child(n + 6) {

  margin-top: 12px;

}



::v-deep .elbutton span {
  font-size: 14px !important;
}



.personBox {

  border: 1px solid #dcdfe6;

  background-color: #f5f7fa;

  /* background-color: #1890ff; */

  margin-left: 26px;

  height: 150px;

  border-radius: 5px;

}



.active {

  background-color: #5d9bd5;

  color: #fff;

}



.feedInfoForm ::v-deep.el-collapse-item__wrap,

.workOrderInfoForm ::v-deep.el-collapse-item__wrap {

  padding: 0 !important;

  border-top: 1px solid #dcdfe6;

  border-right: 0 !important;

}





::v-deep .el-table__body-wrapper {
  height: auto !important;
}


 


::v-deep .el-descriptions-item__label {
  font-size: 16px; 
}

::v-deep .el-descriptions-item__content {
  font-size: 16px; 
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block !important;
}

.tableContainer {
  height: auto;
}

.stoclInfo {
  position: relative;
  padding: 10px;
  box-shadow: 0 3px 5px rgba(13, 20, 36, 0.18), 0 0 1px rgba(13, 20, 36, 0.29);
}

.JJ {
  position: absolute;
  right: 10px;
  top: 0;
  width: 120px;
}
.JNPF-preview-main .main{
  padding-top: 0;
}
::v-deep .el-radio-button__inner{
  padding: 12px 15px;
  background-color: #fafafa;
  border: none;
  border-right: 1px solid #dcdfe6;
  font-size: 16px; 
  }
  ::v-deep .el-radio-button:last-child .el-radio-button__inner,::v-deep .el-radio-button:first-child .el-radio-button__inner{
    border-radius: 0;
  }
  .orderNo ::v-deep .el-descriptions-item__label,.orderNo ::v-deep .el-descriptions-item__content{
    font-size: 20px;
    font-weight: bold;
  }
</style>