<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" :content="'销售订单进度'" />
          <div class="options">
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading" ref="main">
          <el-collapse v-model="activeNames1" class="orderInfo">
            <el-collapse-item title="基本信息" name="basicInfo">
              <div class="stoclInfo" ref="stoclInfo">
                <el-descriptions :column="1" class="orderNo">
                  <el-descriptions-item label="订单号">{{ dataForm.orderNo }} </el-descriptions-item>
                </el-descriptions>

                <el-descriptions class="margin-top" :column="4">

                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'normal'">
                    <el-tag style="vertical-align: super;" effect="dark">正常任务</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'prediction'">
                    <el-tag style="vertical-align: super;" effect="dark" type="success">预测订单</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'sample'">
                    <el-tag style="vertical-align: super;" effect="dark" type="info">样品订单</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'stock_up'">
                    <el-tag style="vertical-align: super;" effect="dark" type="warning">备货订单</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'urgent'">
                    <el-tag style="vertical-align: super;" effect="dark" type="danger">急件订单</el-tag>
                  </el-descriptions-item>

                  <el-descriptions-item label="所属客户" class="orderNo">{{ dataForm.cooperativePartnerName }}
                  </el-descriptions-item>
                  <el-descriptions-item label="所属部门" class="orderNo">{{ dataForm.departmentName
                    }}</el-descriptions-item>
                  <el-descriptions-item label="所属销售" class="orderNo">{{ dataForm.salesName }}</el-descriptions-item>
                  <el-descriptions-item label="订单日期" class="orderNo">{{ dataForm.orderDate }}</el-descriptions-item>
                  <el-descriptions-item label="交货日期">{{ dataForm.deliveryDate }}</el-descriptions-item>



                  <el-descriptions-item label="含税总金额">{{ dataForm.totalAmount }}</el-descriptions-item>
                  <el-descriptions-item label="不含税总金额">{{ dataForm.excludingTaxTotalAmount }}</el-descriptions-item>
                  <el-descriptions-item label="税额">{{ dataForm.taxAmount }}</el-descriptions-item>

                </el-descriptions>
                <!-- <img class="JJImg" v-if="dataForm.urgentFlag" src="@/assets/images/emergency.png" alt="" style="bottom: 0;"> -->
                <img class="JJ" v-if="dataForm.orderStatus == 'not_finish'" src="@/assets/images/incomplete.png" alt="">
                <img class="JJ" v-if="dataForm.orderStatus == 'finish'" src="@/assets/images/successing.png" alt="">
                <img class="JJ" v-if="dataForm.orderStatus == 'part_finish'"
                  src="@/assets/images/partiallyCompleted.png" alt="">
              </div>

            </el-collapse-item>
            <!-- <el-collapse-item title="" name="info" class="info" :disabled="true"> -->
            <el-collapse-item title="订单产品" name="product">
              <JNPF-table ref="work" :data="productData" fixedNO  v-loading="tableloading" class="productTable">
                <el-table-column prop="customerProductNo" label="客户料号" width="160" :key="1212">
                </el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6">
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />
                <el-table-column prop="outNum11" label="利用库存" width="120" :key="68">
                  <template slot-scope="scope">
                    <div>{{ scope.row.outNum11 ? scope.row.outNum11 : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="outNum12" label="自制数量" width="120" :key="58">
                  <template slot-scope="scope">
                    <div>{{ scope.row.outNum12 ? scope.row.outNum12 : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="outNum13" label="采购数量" width="120" :key="84">
                  <template slot-scope="scope">
                    <div>{{ scope.row.outNum13 ? scope.row.outNum13 : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="outNum14" label="外协数量" width="120" :key="38">
                  <template slot-scope="scope">
                    <div>{{ scope.row.outNum14 ? scope.row.outNum14 : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="outNum15" label="已发货" width="100" :key="28">
                  <template slot-scope="scope">
                    <div>{{ scope.row.outNum15 ? scope.row.outNum15 : 0 }}</div>
                  </template>
                </el-table-column>

                <el-table-column prop="num" label="数量" width="100" :key="7">
                </el-table-column>
                <el-table-column prop="price" label="单价(含税)" width="120" :key="11">
                </el-table-column>
                <!-- <el-table-column prop="taxRate" label="税率" width="120" :key="171">
                  <template slot-scope="scope">
                    <div>{{ scope.row.taxRate }}%</div>
                  </template>
                </el-table-column>
                <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="140"></el-table-column>
                <el-table-column prop="totalAmount" label="金额(含税)" width="120" :key="125"></el-table-column> -->
                <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="140" :key="126">
                  <template slot-scope="scope">
                    <div>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="deliveryDate" label="交货日期" width="180" :key="131"></el-table-column>
                <el-table-column prop="contractNo" label="合同号" width="180" :key="132"></el-table-column>
                <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  width="140" :key="211">
                </el-table-column>
                <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  width="120" :key="123">
                </el-table-column>
                <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">
                </el-table-column>
                <el-table-column prop="oil" label="油脂" width="120" :key="61">
                </el-table-column>
                <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51">
                </el-table-column>
                <el-table-column prop="clearance" label="游隙" width="120" :key="100">
                </el-table-column>
                <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101"> </el-table-column>
                <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  width="120" :key="1012"></el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="viewFun(scope.row.id, 'edit')">详情</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <el-radio-group v-model="categoryType"
                style="width:100%;padding-left: 5px;border-bottom: 1px solid #dcdfe6 ;">
                <el-radio-button v-for="item in categoryTypeList" :key="item.code" style="height: 100%;"
                  :label="item.code">{{
                    item.fullName
                  }}</el-radio-button>
              </el-radio-group>
              <JNPF-table ref="report" v-if="categoryType == 'plan'" height="450" :data="planData" fixedNO
                v-loading="tableloading" :key="Math.random()">
                <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180"  />
                <el-table-column prop="productsDrawingNo" label="品名规格" min-width="300" show-overflow-tooltip ></el-table-column>
                <el-table-column prop="productsCode" label="产品编码" min-width="140"  />
                <el-table-column prop="mainUnit" label="单位" width="80" />
                <el-table-column prop="planProductionQuantity" label="计划生产数量" min-width="160"  />
                <el-table-column prop="availableArrangeQuantity" label="可编排数量" min-width="160"  />
                <el-table-column prop="arrangeOrderNum" label="已编排单数/数量" min-width="180"  />
               
                <el-table-column prop="planStartDate" label="计划开始日期" min-width="160"
                  ></el-table-column>
                <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" ></el-table-column>
                <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  min-width="140"  />
                <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  min-width="120"  />
                <el-table-column prop="vibrationLevel" label="振动等级" min-width="120"  />
                <el-table-column prop="oil" label="油脂" min-width="100"  />
                <el-table-column prop="oilQuantity" label="油脂量" min-width="120"  />
                <el-table-column prop="clearance" label="游隙" min-width="100"  />
                <el-table-column prop="packagingMethod" label="包装方式" min-width="120"  />
                <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  min-width="160"  />
                <el-table-column prop="arithmeticNo" label="运算单号" min-width="200" show-overflow-tooltip />
                <el-table-column prop="remark" label="备注" min-width="180" ></el-table-column>
                <el-table-column prop="createTime" label="创建时间" min-width="180" ></el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="scheduleFun(scope.row.id, 'edit')">计划进度</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
            </el-collapse-item>
            <el-collapse-item title="计划甘特图" name="planGantt">


            </el-collapse-item>

            <!-- </el-collapse-item> -->
          </el-collapse>
        </div>
      </div>


    </transition>
    <RelatedTasksForm v-if="relatedTaskVisible" ref="relatedTaskForms" @selectRelatedTasksFun="selectRelatedTasksFun">
    </RelatedTasksForm>
  </div>
</template>
<script>
import { getOrderDetail } from '@/api/salesManagement/assemblyOrders'
import { detailordershengchan } from '@/api/productOrdes/index.js'
import { getWorkReportList } from "@/api/productOrdes/index.js"
import { getInspectionList, deleteInspectionData, getInspectionLinesList } from '@/api/inspectionManagement/index' // 检验单
import { getProductionPlanList } from '@/api/productionManagement/index'
export default {
  data() {
    return {
      categoryType: "plan",
      height: 0,
      relatedTaskVisible: false,
      categoryTypeList: [
        { code: "plan", fullName: "订单计划", },
        { code: "inventory", fullName: "利用库存", },
        { code: "finishpurchase", fullName: "成品采购", },
        { code: "rawpurchase", fullName: "原材料采购", },
        { code: "out", fullName: "外协", },
        { code: "sendOut", fullName: "已发货", },
        { code: "guidebook", fullName: "已退货", },
        { code: "refund", fullName: "已退款", },
        { code: "reconciliation", fullName: "已对账", },
        
      ],
      productData: [], 
      orderTypeList: [
        { label: "正常任务", value: "normal", },
        { label: "返工任务", value: "rework", },
      ],


      urgentFlagList: [

        { label: "是", value: true, },

        { label: "否", value: false, },

      ],

      planData: [],

      activeNames1: ["basicInfo", 'product', 'planGantt'],



      feedData: [],

      workOrderData: [],

      dataForm: {},

      formLoading: false,

      btnType: "",

      title: "",

      prodOrderId: "",
      inspectData: [],
      orderLinesId:""
    }

  },

  watch: {

    'categoryType': function (newVal) {
      this.getTabdataList()
    },
  },
  mounted() {
    this.switchStyle()
  },
  methods: {
    scheduleFun(id){

    },
    viewFun(id){
      // 详情
      this.orderLinesId=id
      this.categoryType='plan'
      this.getTabdataList()
    },
    //自适应窗口
    async switchStyle() {
      await this.$nextTick();
      let allHeight = this.$refs.main.clientHeight
      let HeightstoclInfo = this.$refs.stoclInfo.clientHeight
      console.log("allHeight", allHeight);
      console.log("HeightstoclInfo", HeightstoclInfo);
      this.height = (allHeight - HeightstoclInfo - 180) + 'px'
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },
    selectRelatedTasksFun(val) {
      this.init(val.id)
    },
    getTabdataList() {


      if (this.categoryType == 'plan') {
        let obj={
          ordersLineId:this.orderLinesId,
          pageSize:-1,
          pageNum:-1,
        }
        getProductionPlanList(obj).then(res=>{
          console.log("计划信息",res);
          this.planData=res.data.records
        })
      } else if (this.categoryType == 'purchase') {
        // 投料
      } else if (this.categoryType == 'out') {



      } else if (this.categoryType == 'sendOut') {

      } else if (this.categoryType == 'guidebook') {
        // 作业指导书
      }
    },
    goBack() {
      this.$emit('close')
    },

    associationTaskFun() {
      this.relatedTaskVisible = true
      console.log(666);
      this.$nextTick(() => {
        this.$refs.relatedTaskForms.init(this.dataForm.productionPlanNo)
      })
    },
    init(id) {
      getOrderDetail(id).then(res => {
        console.log("销售详情详情", res);
        res.data.orderLines.forEach(item => {
          this.$set(item, 'outNum11', '')
          this.$set(item, 'outNum12', '')
          this.$set(item, 'outNum13', '')
          this.$set(item, 'outNum14', '')
          this.$set(item, 'outNum15', '')
        });
        this.dataForm = res.data.order
        this.productData = res.data.orderLines
        this.orderLinesId=this.productData[0].id
        this.getTabdataList()

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
  border-bottom: 0 !important;
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










::v-deep .el-descriptions-item__label {
  font-size: 16px;
}

::v-deep .el-descriptions-item__content {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block !important;
  font-size: 16px;
}

.tableContainer {
  height: auto;
}

.stoclInfo {
  position: relative;
  padding: 5px;
}

.JJ {
  position: absolute;
  right: 10px;
  top: 0;
  width: 120px;
}

.JNPF-preview-main .main {
  padding-top: 0;
}



.indfo ::v-deep .el-collapse-item__header {
  display: none;
}

.orderNo ::v-deep .el-descriptions-item__label,
.orderNo ::v-deep .el-descriptions-item__content {
  font-size: 20px;
  font-weight: bold;
}

::v-deep .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 4px 0 0;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 4px 0 0 0;
}

::v-deep .el-radio-button__inner {
  border-bottom: 0;
}

.tableContainer {
  padding: 5px
}

::v-deep .el-collapse-item {
  border-bottom: 1px solid rgb(220, 223, 230)
}
.productTable ::v-deep .el-table__body-wrapper{
  height: auto!important;
}
</style>