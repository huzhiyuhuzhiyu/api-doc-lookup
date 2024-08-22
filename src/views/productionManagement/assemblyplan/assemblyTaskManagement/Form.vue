<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" content="查看任务" />
          <div class="options">

            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="任务信息" name="orderInfo">
              <el-collapse v-model="activeNames1">
                <el-collapse-item title="任务信息" name="basicInfo"  >

                  <el-form ref="dataForm" :model="dataForm" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="生产任务单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="任务类型" prop="orderType">
                          <el-select v-model="dataForm.orderType" placeholder="精度等级" clearable style="width: 100%;" disabled>
                            <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="品名规格" prop="productDrawingNo">
                          <el-input v-model="dataForm.productDrawingNo" placeholder="品名规格" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>




                      <el-col :sm="8" :xs="24">
                        <el-form-item label="产品编码" prop="productCode">
                          <el-input v-model="dataForm.productCode" placeholder="产品编码" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="单位" prop="mainUnit">
                          <el-input v-model="dataForm.mainUnit" placeholder="单位" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="总生产数量" prop="productionQuantity">
                          <el-input v-model="dataForm.productionQuantity" placeholder="计划生产数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="已完成数量" prop="completedQuantity">
                          <el-input v-model="dataForm.completedQuantity" placeholder="可编排数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="工艺路线名称" prop="routingName">
                          <el-input v-model="dataForm.routingName" placeholder="工艺路线名称" disabled ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="工艺路线编码" prop="routingCode">
                          <el-input v-model="dataForm.routingCode" placeholder="工艺路线名称"  disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="打字内容" prop="sealingCoverTyping">
                          <el-input v-model="dataForm.sealingCoverTyping" placeholder="打字内容"  disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="精度等级" prop="accuracyLevel">
                          <el-input v-model="dataForm.accuracyLevel" placeholder="精度等级"  disabled></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="振动等级" prop="vibrationLevel">
                          <el-input v-model="dataForm.vibrationLevel" placeholder="振动等级"  disabled></el-input>
                         
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="油脂" prop="oil">
                          <el-input v-model="dataForm.oil" placeholder="油脂"  disabled></el-input>
                          
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="油脂量" prop="oilQuantity">
                          <el-input v-model="dataForm.oilQuantity" placeholder="油脂量"  disabled></el-input>
                         
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="游隙" prop="clearance">
                          <el-input v-model="dataForm.clearance" placeholder="游隙"  disabled></el-input>
                          
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="包装方式" prop="packagingMethod">
                          <el-input v-model="dataForm.packagingMethod" placeholder="包装方式"  disabled></el-input>
                          
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="特殊要求" prop="specialRequire">
                          <el-input v-model="dataForm.specialRequire" placeholder="特殊要求"  disabled></el-input>
                          
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="生产计划单号" prop="productionPlanNo">
                          <el-input v-model="dataForm.productionPlanNo" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="状态" prop="orderStatus">
                          <el-select v-model="dataForm.orderStatus" placeholder="精度等级" clearable style="width: 100%;" disabled>
                            <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="计划开始日期" prop="planStartDate">
                          <el-date-picker v-model="dataForm.planStartDate" placeholder="计划开始日期" type="date" disabled
                            value-format="yyyy-MM-dd" style="width: 100%;">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="计划结束日期" prop="planEndDate">
                          <el-date-picker v-model="dataForm.planEndDate" placeholder="计划结束日期" type="date" disabled
                            value-format="yyyy-MM-dd" style="width: 100%;">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="是否紧急" prop="urgentFlag">
                          <el-select v-model="dataForm.urgentFlag" placeholder="精度等级" clearable style="width: 100%;" disabled>
                            <el-option v-for="(item, index) in urgentFlagList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="创建时间" prop="createTime">
                          <el-date-picker v-model="dataForm.createTime" placeholder="创建时间" type="date" disabled
                            value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="创建人" prop="createByName">
                          <el-input v-model="dataForm.createByName" placeholder="创建人" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>


                    </el-row>
                  </el-form>
                </el-collapse-item>

              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="工单信息" name="workOrderInfo">
              <el-collapse v-model="activeNames2">
                <el-collapse-item title="工单信息" name="workOrderInfoForm" class="workOrderInfoForm">
                  <JNPF-table ref="work" :data="workOrderData" fixedNo v-loading="tableloading">
                    <el-table-column prop="processName" label="工序名称" min-width="120" />
                    <el-table-column prop="processCode" label="工序编码" min-width="120"></el-table-column>
                    <el-table-column prop="processingType" label="加工类型" min-width="120">
                      <template slot-scope="scope">
                        <div>
                          {{ scope.row.processingType == "self_produced" ? "自制" : "外协" }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="workGroupName" label="班组" min-width="120"> </el-table-column>
                    <el-table-column prop="personName" label="人员" min-width="120"> </el-table-column>
                    <el-table-column prop="planStartDate" label="计划开始日期" min-width="150"></el-table-column>
                    <el-table-column prop="planEndDate" label="计划结束日期" min-width="150"></el-table-column>
                    <el-table-column prop="mainUnit" label="单位" min-width="80"></el-table-column>
                    <el-table-column prop="productionQuantity" label="生产数量" min-width="100"></el-table-column>
                    <el-table-column prop="completedQuantity" label="完成数量" min-width="100"></el-table-column>
                    <el-table-column prop="industrialWasteQuantity" label="工废数量" min-width="100"></el-table-column>
                    <el-table-column prop="materialWasteQuantity" label="料废数量" min-width="100"></el-table-column>
                    <el-table-column prop="responsibilityWasteQuantity" label="责废数量" min-width="100"></el-table-column>
                    <el-table-column prop="productionLineName" label="产线" min-width="100"></el-table-column>
                    <el-table-column prop="workstationName" label="工位" min-width="100"></el-table-column>
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

                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>

            <el-tab-pane label="投料信息" name="feedInfo">
              <el-collapse v-model="activeNames3">
                <el-collapse-item title="投料信息" name="feedInfoForm" class="feedInfoForm" >
                  <JNPF-table ref="feed" :data="feedData" fixedNo v-loading="tableloading">
                    <el-table-column prop="productDrawingNo" label="品名规格" ></el-table-column>
                    <el-table-column prop="productCode" label="产品编码"  />
                    <el-table-column prop="processName" label="工序名称"/>
                    <el-table-column prop="mainUnit" label="单位"/>
                    <el-table-column prop="qty" label="基本数量"/>
                    <el-table-column prop="materialsUsedQuantity" label="投料数量"/>
                    <el-table-column prop="receivedQuantity" label="已领数量"/>



                  </JNPF-table>

                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
          </el-tabs>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>

import{detailordershengchan} from '@/api/productOrdes/index.js'
export default {
 
  data() {
    return {
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

      activeNames1: ["basicInfo"],
      activeNames2: ["workOrderInfoForm"],
      activeNames3: ["feedInfoForm"],
      activeName:'orderInfo',
      feedData: [],
      workOrderData: [],
      dataForm: {},
      formLoading:false,
    }
  },
 
  mounted() {

  },
  methods: {
    handleClick(){

    },
    goBack(){
      this.$emit('close')
    },
    init(id){
      detailordershengchan(id).then(res=>{
        console.log("生产任务详情",res);
        this.dataForm=res.data.prodOrder
        this.feedData=res.data.materialList
        this.workOrderData=res.data.workOrderList
      })
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
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
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
.feedInfoForm ::v-deep.el-collapse-item__wrap ,.workOrderInfoForm ::v-deep.el-collapse-item__wrap{
  padding: 0!important;
  border-top: 1px solid  #dcdfe6;
  border-right: 0!important;
}
</style>