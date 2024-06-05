<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          content="查看工单详情" />
        <!-- <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div> -->
      </div>
      <div class="main" >

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="工单信息" name="orderInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForms" :model="reworkForm"  label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="生产订单号" prop="productionOrderNo">
                    <el-input readonly placeholder="请选择生产订单号" disabled v-model="reworkForm.productionOrderNo"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="工作令号" prop="workOrderNo">
                    <el-input placeholder="请输入工作令号" disabled v-model="reworkForm.workOrderNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品编码" prop="productCode">
                    <el-input placeholder="请输入产品编码" disabled v-model="reworkForm.productCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品名称" prop="productName">
                    <el-input placeholder="请输入产品名称" disabled v-model="reworkForm.productName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品图号" prop="productDrawingNo">
                    <el-input placeholder="请输入产品图号" disabled v-model="reworkForm.productDrawingNo"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="规格型号" prop="productCode">
                    <el-input placeholder="请输入规格型号" disabled v-model="reworkForm.productCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="工艺路线编码" prop="routingCode">
                    <el-input placeholder="请输入工艺路线编码" disabled v-model="reworkForm.routingCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="工艺路线名称" prop="routingName">
                    <el-input placeholder="请输入工艺路线名称" disabled v-model="reworkForm.routingName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="工序编码" prop="processCode">
                    <el-input placeholder="请输入工序编码" disabled v-model="reworkForm.processCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="工序名称" prop="processName">
                    <el-input placeholder="请输入工序名称" disabled v-model="reworkForm.processName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="订单生产数量" prop="workOrderQuantity">
                    <el-input placeholder="请输入订单生产数量" disabled v-model="reworkForm.workOrderQuantity"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="已派工数量" prop="dispatchedQuantity">
                    <el-input placeholder="请输入已派工数量" disabled v-model="reworkForm.dispatchedQuantity"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="完成数量" prop="completedQuantity">
                    <el-input placeholder="请输入完成数量" disabled v-model="reworkForm.completedQuantity"></el-input>
                  </el-form-item>
                </el-col>
             
                <!-- <el-col :sm="8" :xs="24">
                  <el-form-item label="计划开始日期" prop="planStartDate">
                    <el-date-picker v-model="reworkForm.planStartDate" type="date" value-format="yyyy-MM-dd" disabled
                      style="width: 100%;" placeholder="计划开始日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="计划结束时间" prop="planEndDate">
                    <el-date-picker v-model="reworkForm.planEndDate" type="date" value-format="yyyy-MM-dd" disabled
                      style="width: 100%;" placeholder="计划结束时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="8" :xs="24">
                  <el-form-item label="实际开始时间" prop="actualStartDate">
                    <el-date-picker v-model="reworkForm.actualStartDate" type="date" value-format="yyyy-MM-dd" disabled
                      style="width: 100%;" placeholder="实际开始时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="实际结束时间" prop="actualEndDate">
                    <el-date-picker v-model="reworkForm.actualEndDate" type="date" value-format="yyyy-MM-dd" disabled
                      style="width: 100%;" placeholder="实际结束时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
               
                <el-col :sm="8" :xs="24">
                  <el-form-item label="是否首道工序" prop="firstFlag">
                    <el-select v-model="reworkForm.firstFlag" placeholder="请选择是否首道工序" disabled style="width: 100%;">
                      <el-option v-for="(item, index) in firstFlagList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="是否报工" prop="reportFlag">
                    <el-select v-model="reworkForm.reportFlag" placeholder="请选择是否报工" disabled style="width: 100%;">
                      <el-option v-for="(item, index) in reportFlagList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="是否首检" prop="firstInspection">
                    <el-select v-model="reworkForm.firstInspection" placeholder="请选择是否首检" disabled style="width: 100%;">
                      <el-option v-for="(item, index) in firstInspectionList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="是否末道工序" prop="lastFlag">
                    <el-select v-model="reworkForm.lastFlag" placeholder="请选择是否末道工序" disabled style="width: 100%;">
                      <el-option v-for="(item, index) in lastFlagList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="创建时间" prop="createTime">
                    <el-input v-model="reworkForm.createTime" placeholder="请输入创建时间" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="创建人" prop="createByName">
                    <el-input v-model="reworkForm.createByName" placeholder="请输入创建人" disabled />
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>

import { getprodOrderList, prodOrderInfo,detailWorkData, addProdOrder, updateprodOrderFinished } from '@/api/productOrdes/index'

export default {
  data() {
    return {
      activeName:"orderInfo",
      id:"",
      btnType:"",
      reworkForm:{},
      firstFlagList:[
        {label:"是",value:true},
        {label:"否",value:false},
      ],
      stockFlagList:[
        {label:"是",value:true},
        {label:"否",value:false},
      ],
      firstInspectionList:[
        {label:"是",value:true},
        {label:"否",value:false},
      ],
      lastFlagList:[
        {label:"是",value:true},
        {label:"否",value:false},
      ],
      reportFlagList:[
        {label:"是",value:true},
        {label:"否",value:false},
      ],
    }
  },
  created() {
  },
  methods: {
    handleClick() {

    },
    init(id, btnType) {
      this.id = id || ''
      this.btnType = btnType
      if (this.id) {
        detailWorkData(this.id).then(res=>{
          console.log("res",res);
          this.reworkForm=res.data
        })
            }
    },
    goBack() {
      this.$emit('close')
    },
    
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

.el-button--small {
  // padding: 1;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
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
::v-deep .el-table__body-wrapper  {
  height: auto !important;
}
</style>