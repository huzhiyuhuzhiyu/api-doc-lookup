<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" content="拆分任务" />
          <div class="options">
            <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading"
              @click="handleConfirm('submit')">提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">

                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="生产任务单号" prop="oldOrderNo">
                          <el-input v-model="dataForm.oldOrderNo" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="品名规格" prop="productDrawingNo">
                          <el-input v-model="dataForm.productDrawingNo" placeholder="品名规格" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="拆分第几道" prop="splitNo">
                          <el-input v-model="dataForm.splitNo" placeholder="拆分第几道" @blur="splitNoBlur">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <template v-if="$store.getters.configData.produce.steelBallTask">
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="生产桶数:" prop="productionBarrels" >
                            <el-input v-model="dataForm.productionBarrels" placeholder="生产桶数" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="生产重量:" prop="productionWeight">
                            <el-input v-model="dataForm.productionWeight" placeholder="生产重量"  />
                          </el-form-item>
                        </el-col>
                      </template>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="拆分数量" prop="splitQuantity">
                          <el-input v-model="dataForm.splitQuantity" placeholder="拆分数量">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="新生产任务单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo"  />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>

                <el-collapse-item title="工序信息" name="productInfo" class="productInfo">
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                    <JNPF-table ref="product" :data="dataFormTwo.data" fixedNO v-loading="tableloading">
                      <el-table-column prop="processCode" label="工序编码" width="130"></el-table-column>
                      <el-table-column prop="processName" label="工序名称" min-width="170" />
                      <el-table-column prop="waitReportNum" label="可报工数量" width="180" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="splitQuantity" label="拆分数量" width="180" show-overflow-tooltip></el-table-column>
                    </JNPF-table>

                  </el-form>
                </el-collapse-item>
              </el-collapse>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { excelExport, getProductionLineInfo, getProductionLineList } from "@/api/basicData/index";
import { splitOrderNum} from '@/api/productOrdes/index.js'
import { detailProcess, getProcessList, getWorkListMap, addProdPlanArrange, detailResourceProcess } from '@/api/basicData/processSettingss.js'
import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { getWarehouseList } from '@/api/basicData/index'
import { getBimBusinessDetail } from '@/api/basicData/index'
import {
  BOMLineList
} from "@/api/calculationList/MRPOperation"
import { mapGetters, mapState } from 'vuex'
import { getBimProcessList } from '@/api/bimProcess'
import { detailordershengchan } from '@/api/productOrdes/index.js'
import { getProductsWeightQuantityList } from '@/api/basicData/productsWeightQuantity'
export default {
  mixins: [],
  components: {
  },
  data() {
    return {
      productVisible: false,
      isattachmentswitch: "",
      taskMethodList: [{ label: "指定加工对象", value: "appoint" }, { label: "不指定加工对象", value: "not_appoint" },],
      activeNames: ["productInfo", "basicInfo"],
      activeNamess: ['pickInfo', 'productInfos'],
      allocationFlag: false,
      routingVisible: false,
   
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
        lineEdgeList: [],
        lineEdgeId: "",
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
        lineEdgeId: "",
        splitNo:null,
        splitQuantity:0,
      },
      dataFormTwo: {
        data: [],
      },
      oldWorkOrderList:[],
      listLoading: false,
      activeName: "orderInfo",
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataRule: {
        orderNo: [{ required: true, message: '请输入生产单号', trigger: 'blur' }],
        planDate: [
          { required: true, message: '计划生产日期不能为空', trigger: 'change' }
        ],
        splitQuantity: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["拆分数量不能为空", (errMsg, index) => { this.$message.error(`拆分数量：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '拆分数量必须大于0', (errMsg, index) => { this.$message.error(`拆分数量：${errMsg}`) }), trigger: 'blur' }
        ],
        routingName: [
          { required: true, message: '工艺路线不能为空', trigger: 'change' }
        ],
        productsDrawingNo: [
          { required: true, message: '品名规格不能为空', trigger: 'blur' }
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
      isProjectSwitch: "",
      projectIdData: [],
      isProductNameSwitch: "",
      isTechnicalSwitch: "",
      isCheckingSwitch: "",
      materialList: [],
      linesFormItems_right: [],
      lineIndex: null,
      weight:null,
      quantity:null,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },

  async created() {
 
  },
  watch: {
    'dataForm.productionWeight': {
      handler: function (newVal, oldVal) {
        if (this.$store.getters.configData.produce.steelBallTask) {
          if (newVal) {
            this.dataForm.splitQuantity = Number(newVal) / Number(this.weight) *Number(this.quantity)
          } else {
            this.dataForm.splitQuantity = 0
          }
          
        }
      },
      deep: true
    }
  },
  methods: {
 
    getProcessData(id, data, params, index) {
      this.materialList[params.scope.$index].processId = data[0].id || ''
      this.materialList[params.scope.$index].processName = data[0].name || ''
    },
    splitNoBlur(){
      if (!this.dataForm.splitNo) this.dataForm.splitNo =1
      const splitNo = Number(this.dataForm.splitNo)-1
      if (splitNo === this.oldWorkOrderList.length -1) {
        
      } else {
        this.dataFormTwo.data = this.oldWorkOrderList.slice(splitNo, this.oldWorkOrderList.length)
      }
      
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_assembleArrange'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
      })
    },

 
    init(id) {
      detailordershengchan(id).then(res => {
          console.log("生产任务详情", res);
          this.dataForm = res.data.prodOrder
          this.dataForm.oldOrderNo = res.data.prodOrder.orderNo
          this.dataForm.productionBarrels = 0
          this.dataForm.productionWeight = 0
          this.dataForm.splitQuantity = 0
          this.dataForm.orderNo = ''
          this.$set(this.dataForm,'splitNo',1)
          this.oldWorkOrderList = res.data.workOrderList
          this.dataFormTwo.data = res.data.workOrderList
          if (this.$store.getters.configData.produce.steelBallTask) {
          let obj = {
            productsId: this.dataForm.productsId
          }
          getProductsWeightQuantityList(obj).then(res=>{
            this.weight = res.data.records[0].weight
            this.quantity = res.data.records[0].quantity
          })
      }
      })
      
      this.creaFun()
    },
    creaFun() {
      this.linesFormItems_right = [
        { prop: "productsCode", label: "产品编码", value: "", type: 'view', minWidth: 140 },
        { prop: "productsName", label: "产品名称", value: "", type: 'view', minWidth: 120, render: this.isProductNameSwitch === '1' },
        { prop: "productsDrawingNo", label: "品名规格", value: "", type: 'view', minWidth: 150 },
        {
          prop: "processName", label: "工序名称", value: "", type: 'custom', minWidth: 140,
          customComponent: 'ComSelect-page', renderTree: false, change: this.getProcessData,
          tableItems: [
            { prop: 'name', label: '工序名称' },
            { prop: 'code', label: '工序编码' },
          ], placeholder: "请选择工序名称", title: "选择工序名称",
          listMethod: getBimProcessList, listRequestObj: {
            "name": "",
            "code": "",
            "processingType": "",
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
            "pageNum": 1,
            "pageSize": 20,
            "productCategoryId": "",
            "projectId": ''
          },
          searchList: [
            { prop: "code", label: "工序编码", type: 'input' },
            { prop: "name", label: "工序名称", type: 'input' },
          ]
        },
        {
          prop: "qty", label: "数量", value: "", type: 'input', width: 180,
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：数量${errMsg}`) }] }), trigger: 'blur' },
            { required: true, message: '', trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：数量${errMsg}`) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：数量${errMsg}`) }), trigger: 'blur' }
          ]
        },
        { prop: "mainUnit", label: "单位", value: "", type: 'view', minWidth: 80 },
        {
          prop: 'reduceType',
          label: '扣减料方式',
          value: 'picking',
          type: 'select',
          disabled: this.btnType === 'look',
          options: [
            { label: '生成领料单', value: 'picking' },
            { label: '自动扣减料', value: 'auto' },
            { label: '都不是', value: 'none' }
          ],
          itemRules: [{ required: true, trigger: 'change' }],
          minWidth: 160,
        },
        {
          prop: "materialsUsedQuantity", label: "领料数量", value: "", type: 'input', minWidth: 140,
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：领料数量${errMsg}`) }] }), trigger: 'blur' },
            { required: true, message: '', trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：领料数量${errMsg}`) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：领料数量${errMsg}`) }), trigger: 'blur' }
          ]
        },
      ]
    },
 

    goBack() {
      this.$emit('close', true)
    },
    checkFun() {
      let submitFlag = null;
      if (!this.dataForm.bomId) return this.$message.error("提交失败:该产品无BOM，请配置BOM后重试")
      console.log()
      if (this.dataForm.taskMethod == 'appoint') {

        for (let index = 0; index < this.dataFormTwo.data.length; index++) {
          const item = this.dataFormTwo.data[index];
          if (item.reportFlag) {

            if (
              !item.workGroupId &&
              !item.personId && item.processingType == "self_produced"
            ) {
              submitFlag = false;
              this.$message({
                message: "第" + (index + 1) + "行班组、人员、设备需要必填一项",
                type: "error",
              });
              break;
            }
          }
          // else {
          //   if (!item.personId && item.processingType == "self_produced") {
          //     submitFlag = false;
          //     this.$message({
          //       message: "第" + (index + 1) + "行工序需配置人员信息",
          //       type: "error",
          //     });
          //     break;
          //   }
          // }
        }
      } else {
        this.dataFormTwo.data.forEach(item => {
          item.personId = ""
          item.equipmentId = ""
          item.workGroupId = ""
        });
      }
      if (!this.dataForm.bomId) return this.$message.error("提交失败:该产品无BOM，请配置BOM后重试")
      if (this.allocationFlag) {
        this.dataForm.materialFlag = true
      } else {
        this.dataForm.materialFlag = false

      }
      console.log("表单", this.dataForm);
      console.log("工序", this.dataFormTwo.data);

      // this.dataFormTwo.data.forEach(item => {
      //   console.log(item)
      //   item.routingProResList.forEach(items => {
      //     items.processId = item.processId
      //   })
      //   this.$set(item, 'workOrderResList', item.routingProResList)
      // });
      let arr = []

      // if (this.dataForm.pickingWay == 'dispatch_list') {
      //   arr.push({
      //     productionOrderId: "",
      //     warehouseId: this.dataForm.lineEdgeId
      //   })
      // } else if (this.dataForm.pickingWay === 'production_order' && this.dataForm.lineEdgeList.length) {

      //   this.dataForm.lineEdgeList.forEach(item => {
      //     arr.push({
      //       productionOrderId: "",
      //       warehouseId: item
      //     })
      //   })
      // }
      // if (this.materialList.length) {
      //   let hasAutoReduceType = this.materialList.some(item => item.reduceType === "auto")
      //   if (hasAutoReduceType && !arr.length) {
      //     submitFlag = false
      //     return this.$message.error("提交失败:请选择线边仓")
      //   }
      // }
      if (submitFlag === false) return
      this.dataFormTwo.data.forEach(item=>{
        item.productionQuantity = this.dataForm.splitQuantity
        item.orderNo = ''
      })
      let obj = {
        prodOrder: this.dataForm,
        workOrderList: this.dataFormTwo.data,
        // collect: this.collectForm,
        // lineEdgeList: arr,
        // materialList: this.materialList
      }
      this.btnLoading = true
      splitOrderNum(obj).then(res => {
        this.btnLoading = false
        this.$message.success("拆分任务成功")
        setTimeout(() => {
          this.$emit('close')
        }, 1500);
      }).catch(error => {
        this.btnLoading = false

      })
    },
    async handleConfirm(value) {
      console.log(this.dataForm);
    
        try {
          await this.$refs['dataForm'].validate()
          this.dataForm.documentStatus = value
        } catch (e) {
          console.log('基础信息');
          console.log(e);
          throw new Error('orderInfo')
        }
        if (!this.allocationFlag) {
          return this.checkFun()
        }
        
   

    },
    addth(data, index, type) {
      console.log("dtata", data);
      let tempList = JSON.parse(JSON.stringify(this.materialList))
      let hasItemList = []
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        item.productsId = item.id
        item.productsCode = item.code
        item.productsName = item.name
        item.productsDrawingNo = item.drawingNo
        item.qty = 1
        const hasFlag = this.materialList.find(i => item.productsId === i.productsId)
        if (hasFlag) { hasItemList.push(item.productDrawingNo) }
        else { tempList.push(item) }
        if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
      }
      this.materialList = tempList.map(item => {
        return {
          productsId: item.productsId,
          productsCode: item.productsCode,
          productsName: item.productsName,
          productsDrawingNo: item.productsDrawingNo,
          qty: item.qty,
          calculationDirection: item.calculationDirection,
          mainUnit: item.mainUnit,
          ratio: item.ratio,
          // materialsUsedQuantity: item.materialsUsedQuantity || '',
          materialsUsedQuantity: this.jnpf.numberFormat(this.jnpf.math('multiply', [this.dataForm.productionQuantity, item.qty]), 6) || '',
          processName: item.processName,
          processId: item.processId,
          selectProduct: true,
          reduceType: "picking",
        }
      })
      console.log(this.materialList, 'this.materialList')
    },
    deleteth(scope, index, type) {
      this.materialList.splice(scope.$index, 1)
    },
    linesChange(dataOrIndex, prop, value, index, type) {
      if (Array.isArray(dataOrIndex)) {
        this.materialList = JSON.parse(JSON.stringify(dataOrIndex))
        // this.$set(this.dataForm, type, JSON.parse(JSON.stringify(dataOrIndex)))
      } else if (prop) {
        console.log(111)
        console.log(dataOrIndex)
        console.log(value)
        console.log(prop)
        if (prop === 'processName') {
          this.lineIndex = dataOrIndex
          return
        }
        this.materialList[dataOrIndex][prop] = value
      }
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
