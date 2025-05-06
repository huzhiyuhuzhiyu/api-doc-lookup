<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" content="选择工序创建外协订单" />
          <div class="options">
            <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('submit')">
              前往创建订单
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">

              <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                <el-row :gutter="30" class="custom-row">

                  <el-col :sm="6" :xs="24">
                    <el-form-item label="生产任务单号" prop="orderNo">
                      <el-input v-model="dataForm.orderNo" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="$store.getters.configData.product.enable_productName">
                    <el-form-item label="产品名称" prop="productsName">
                      <el-input v-model="dataForm.productsName" placeholder="产品名称" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="品名规格" prop="productsDrawingNo">
                      <el-input v-model="dataForm.productsDrawingNo" placeholder="品名规格"
                        readonly @focus="openSelectProductFun" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="6" :xs="24">
                    <el-form-item label="工艺路线名称" prop="routingName" style="margin-bottom: 20px;">
                      <el-input v-model="dataForm.routingName" placeholder="工艺路线名称" readonly
                        disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" maxlength="200" :rows="2"
                        disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
            <el-collapse-item title="工序信息" name="productInfo" class="productInfo">
              <!-- <div style="height:34px">
                <div style="float:right;margin-right: 10px;height:34px">
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun()" />
                  </el-tooltip>
                </div>
              </div> -->
              <el-form :model="dataFormTwo" ref="productForm" class="data-form">
                <JNPF-table ref="product" :data="dataFormTwo.data" fixedNO
                  :partentOrChild="'childrenLineProcess'" custom-column hasC @selection-change="handleSelectionChange"
                  >
                  <el-table-column prop="processCode" label="工序编码" width="130"></el-table-column>
                    <el-table-column prop="processName" label="工序名称" min-width="170" />
                    <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="170" />
                    <el-table-column prop="processingType" label="加工类型" width="100">
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.processingType == "self_produced" ? "自制" : "外协" }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="planStartDate" label="计划开始日期" width="160" />
                    <el-table-column prop="planEndDate" label="计划结束日期" width="160" />
                    <el-table-column prop="mainUnit" label="单位" width="120" />
                    <el-table-column prop="productionQuantity" label="计划数量" width="120" />
                    <el-table-column prop="qualifiedQuantity" label="合格数量" width="120" />
                    <el-table-column prop="outsourcingQuantity" label="已外协数量" width="120" />
                    <el-table-column prop="waitOutsourcingQuantity" label="可外协数量" width="120" />
                </JNPF-table>

              </el-form>
            </el-collapse-item>
          </el-collapse>
        </div>

        <OutSouringForm v-if="outSouringFormVisible" ref="OutSouringForm" @refreshDataList="initData" @close="closeForm" />
      </div>
    </transition>
  </div>
</template>

<script>

import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import { detailProductionToOutSouring } from '@/api/productOrdes/index.js'
import OutSouringForm from '@/views/outsourcingManagement/processOutsourcingOrders/orderCreation/index.vue'
export default {
  components: {
    OutSouringForm,
  },
  data() {
    return {
      productVisible: false,
      taskMethodList: [{ label: "指定加工对象", value: "appoint" }, { label: "不指定加工对象", value: "not_appoint" },],
      activeNames: ["productInfo", "basicInfo"],
      allocationFlag: false,
      routingVisible: false,
      collectForm: {
        orderNo: "",
        operationDate: "",
        personId: "",
      },
      collectConfig: {

      },
      pickDataRule: {
        orderNo: [
          { required: true, message: '领料单号单号不能为空', trigger: 'blur' }
        ],
        operationDate: [
          { required: true, message: '领料日期不能为空', trigger: 'change' }
        ],

      },
      dataForm: {
        planDate: [],
        orderNo: "",
        productsDrawingNo: "",
        productsCode: "",
        mainUnit: "",
        planProductionQuantity: "",
        availableArrangeQuantity: "",
        productionQuantity: "",
        taskMethod: "appoint",
        planStartDate: "",
        planEndDate: "",
        routingName: "",
        routingId: "",
        sealingCoverTyping: "",
        accuracyLevel: "",
        vibrationLevel: "",
        oil: "",
        oilQuantity: "",
        clearance: "",
        packagingMethod: "",
        specialRequire: "",
        remark: "",
        bomId: "",
        projectId: "",
        orderType: "manually",

      },
      dataFormTwo: {
        data: [],
      },
      listLoading: false,
      activeName: "orderInfo",
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataRule: {
        planDate: [
          { required: true, message: '计划生产日期不能为空', trigger: 'change' }
        ],
        productionQuantity: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["生产数量不能为空", (errMsg, index) => { this.$message.error(`生产数量：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '生产数量必须大于0', (errMsg, index) => { this.$message.error(`生产数量：${errMsg}`) }), trigger: 'blur' }
        ],
        routingName: [
          { required: true, message: '工艺路线不能为空', trigger: 'change' }
        ],
        productsDrawingNo: [
          { required: true, message: '品名规格' + '不能为空', trigger: 'change' }
        ]
      },
      selectArr: [],

      totalData: [],
      index: "",
      currentWorkgroupId: "",
      currentDeviceId: "",
      currentPersonId: '',
      routingProResMapDiaFlag: false,
      routingProResMapDiaTitle: "",
      workgroupData: [],
      deviceData: [],
      personnelData: [],
      workstationList: [],
      productionLineList: [],
      codeConfig: {},
      dispatchSearchForm: {
        resIdList: [],
        resType: "",
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      },
      detailDataList: [],
      detailDiaFlag: false,
      headerCellStyle: {
        backgroundColor: '#f5f7fa',
        fontWeight: 'bold'
      },
      naturalResourcesFlag: true,
      processList: [],
      warehouseList: [],
      isProductNameSwitch: "",
      selectedData: [],
      outSouringFormVisible: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },

  async created() {
    await this.getProductNameSwitch('product', 'enable_productName')
    this.getPickingConfig()
  },

  methods: {
    columnSetFun() {
      this.$refs.product.showDrawer()
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },

    // 获取领料设置 领料是否自动生成领料单
    getPickingConfig() {

      let obj = { "pageSize": -1, "businessCode": "produce" }
      getBimBusinessSwitchConfigList(obj).then(res => {
        this.allocationFlag = res.data.produce[0].configValue1 == '1' ? true : false
        if (this.allocationFlag) {
          this.activeNames = ['pickInfo', "productInfo", "basicInfo"]
          this.fetchData("PODH")
        } else {
          this.activeNames = ["productInfo", "basicInfo"]

        }
      })
    },




    init(id) {
      console.log({ id });
      this.formLoading = true
      detailProductionToOutSouring(id).then((res) => {
        this.dataForm = {
          ...res.data.prodOrder,
          productsCode: res.data.prodOrder.productCode,
          productsName: res.data.prodOrder.productName,
          productsDrawingNo: res.data.prodOrder.productDrawingNo,
        }
        this.dataFormTwo.data = res.data.workOrderList
        this.formLoading = false
      })
      // this.getProductionLineListFun()
      // this.fetchData("PROD")
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        if (code == 'PROD') {
          this.codeConfig = data
          this.dataForm.orderNo = data.number

        }
        if (code == 'PODH') {
          this.collectConfig = data
          this.collectForm.orderNo = data.number

        }

      } catch (error) {
      }
    },

    goBack() {
      this.$emit('close', true)
    },
    handleConfirm(submitType) {
      if (!this.selectedData.length) return this.$message.error('请选择要转外协的工序！')
      if (!this.isSortedCorrectly(this.selectedData)) return this.$message.error('选择的工序必须连贯！')
      // this.outSouringFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs.OutSouringForm.init(null, 'add', null, {})
      // })
      if (this.selectedData.length === 1 && (this.selectedData[0].processingType === "self_produced" && !this.selectedData[0].reportFlag)) {
            return this.$message.error('当前工序为自制工序且不报工，不可外协！')
      }else{
          if (this.selectedData[this.selectedData.length - 1].processingType === "self_produced" && !this.selectedData[this.selectedData.length - 1].reportFlag){
              return this.$message.error('最后一道工单为自制工序且不报工，不可外协！')
          }
      }
      this.selectedData.sort((a,b)=> a.sort - b.sort)
      console.log(this.selectedData,'data')
      // 临时存储传递数据到会话
      const processList = this.selectedData.map((item,index) => ({
        projectName: item.projectName,
        projectId: item.projectId,
        productSource: item.productSource, // 产品来源
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
        purchaseQuantity: this.selectedData[0].waitOutsourcingQuantity, // 数量
        price: '', // 含税单价
        totalAmount: '', // 金额(含税)
        taxRate: '13', // 税率
        excludingTaxPrice: '', // 不含税单价
        taxAmount: '', // 税额
        excludingTaxAmount: '', // 金额(不含税)
        deputyUnit: item.deputyUnit, // 副单位
        planQuantity: '', //计划数量
        planQuantity2: '', //计划数量副
        remark: item.remark,
          //   增加首选 末选标记
        firstSwitchFlag: item.firstFlag ? true : index === 0,
        lastSwitchFlag :item.lastFlag ? true : index === this.selectedData.length - 1,
        //   增加首道 末道标记
        firstFlag:!!item.firstFlag,
        lastFlag:!!item.lastFlag,
        receiveFlag:item.lastFlag ? true : index === this.selectedData.length - 1,
        deliveryDate: '', // 交期
        processId: item.processId,
        processName: item.processName,
        qty: item.qty,
        waitOutsourcingQuantity: this.selectedData[0].waitOutsourcingQuantity,
        workOrderId: item.id,
      }))
      const preData = {
        productionOrderId: this.dataForm.id,
        firstUseMaterialList: this.dataFormTwo.data[0].shipmentList,
        preProcessData: this.selectedData[0],
        processList
      }

      sessionStorage.setItem('preData', JSON.stringify(preData))
      this.$emit('toOutSouringForm')
      // this.outSouringFormVisible = true

      return
      // this.$nextTick(() => {
      //   this.$refs.OutSouringForm.init(null, 'add', preData)
      // })
      this.goBack()
      // this.btnLoading = true
      // addOutSouringByWorkLine(this.selectedData.map(item => item.id)).then(res => {
      //   this.btnLoading = false
      // }).catch(error => {
      //   this.btnLoading = false
      // })
    },
    checkContinuity() {
      this.dataFormTwo.data.forEach((item, index) => item._index = index);
      this.selectedData.sort((a, b) => a._index - b._index)
      return this.selectedData.every((item, index) => {
        if (index === 0) return true
        return item._index - this.selectedData[index - 1]._index === 1
      })
    },
      isSortedCorrectly(data) {
          const sortValues = this.dataFormTwo.data.map(item => item.sort);
          const sortValues2 = data.map(item => item.sort).sort((a,b)=>a - b)
          if (data.length === 1) return true
          console.log(sortValues,'this.dataFormTwo.data');
          console.log(sortValues2,'this.dataFormTwo.data');
          console.log(this.isSelectionInOrderAndContinuous(sortValues,sortValues2));
          return  this.isSelectionInOrderAndContinuous(sortValues,sortValues2)
      },
    checkSelectable(row) {
      return row.processingType !== "self_produced"
    },
    handleSelectionChange(val){
      console.log(val)
        this.selectedData = val
    },
      isSelectionInOrderAndContinuous(originalArray, selectedArray) {
          const startIndex = originalArray.indexOf(selectedArray[0]);
          if (startIndex === -1) return false;
          const endIndex = startIndex + selectedArray.length;
          const sliced = originalArray.slice(startIndex, endIndex);
          return JSON.stringify(sliced) === JSON.stringify(selectedArray);
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

.data-form ::v-deep.el-table__body-wrapper {
  height: auto !important;
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

.productInfo ::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  padding: 0
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

::v-deep .UploadFile-container-main {
  margin-top: 5px;
}
</style>
