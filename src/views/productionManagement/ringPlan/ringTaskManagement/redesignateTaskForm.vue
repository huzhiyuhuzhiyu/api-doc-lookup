<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" content="改制" />
          <div class="options">
            <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading"
              @click="handleConfirm('submit')">提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="基础信息" name="orderInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">

                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="品名规格" prop="productDrawingNo">
                          <el-input v-model="dataForm.productDrawingNo" placeholder="品名规格" readonly
                            @focus="openSelectProductFun">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单位" prop="mainUnit">
                          <el-input v-model="dataForm.mainUnit" placeholder="单位" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24"  >
                        <el-form-item label="原生产桶数" prop="oldProductionBarrels">
                          <el-input v-model="dataForm.oldProductionBarrels" placeholder="原生产桶数" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24"  >
                        <el-form-item label="原生产重量" prop="oldProductionWeight">
                          <el-input v-model="dataForm.oldProductionWeight" placeholder="原生产重量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24"  >
                        <el-form-item label="生产总数" prop="productionQuantity">
                          <el-input v-model="dataForm.productionQuantity" placeholder="原生产总数" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="生产重量" prop="productionWeight">
                          <el-input v-model="dataForm.productionWeight" placeholder="生产重量">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="生产桶数" prop="productionBarrels">
                          <el-input v-model="dataForm.productionBarrels" placeholder="生产桶数" >
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="万粒数量" prop="productionQuantity">
                          <el-input v-model="dataForm.productionQuantity" placeholder="万粒数量">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="规值">
                          <el-select v-model="dataForm.standardValue" placeholder="请选择"
                            :disabled="type == 'look' ? true : false" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa008" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item :label="$store.getters.accuracyLevel" >
                          <el-select v-model="dataForm.accuracyLevel" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa006" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="isXY||isJR">
                        <el-form-item  label="钢丝炉号" >
                          <el-select v-model="dataForm.wireHeatNumber" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa026" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24"  v-if="isXY||isJR">
                        <el-form-item  label="原材料厂家" >
                          <el-select v-model="dataForm.rawStockMill" placeholder="请选择" clearable style="width: 100%;">
                              <el-option v-for="(item, index) in bimProductAttributesList.pa027" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" maxlength="200"
                            :rows="2" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>

              
              </el-collapse>
            </el-tab-pane>
          
          </el-tabs>
        </div>
     
        <SelectProductForm v-if="productVisible" ref="productForm" @selectProduct="selectProductFun">
        </SelectProductForm>
      </div>
    </transition>
  </div>
</template>

<script>
import { reformOrderNum } from '@/api/productOrdes/index.js'
import { excelExport, getProductionLineInfo, getProductionLineList } from "@/api/basicData/index";
import SelectProductForm from './selectProductForm.vue'
import RoutingForm from "./RoutingForm.vue"
import { detailProcess, getProcessList, getWorkListMap, addProdPlanArrange, detailResourceProcess } from '@/api/basicData/processSettingss.js'
import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { getWarehouseList } from '@/api/basicData/index'
import { getBimBusinessDetail } from '@/api/basicData/index'
import {
  BOMLineList
} from "@/api/calculationList/MRPOperation"
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue'
import { getBimProcessList } from '@/api/bimProcess'
import { detailordershengchan } from '@/api/productOrdes/index.js'
import { getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import { getProductsWeightQuantityList } from '@/api/basicData/productsWeightQuantity'
import tenantMinix from "@/mixins/generator/TenantMinix";
export default {
  mixins: [getProjectList,tenantMinix],
  components: {
    TableFormProduct,
    RoutingForm,
    SelectProductForm,
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
      collectForm: {
        orderNo: "",
        operationDate: this.jnpf.getToday(),
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
        lineEdgeList: [],
        lineEdgeId: "",
        orderNo: "",
        productDrawingNo: "",
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
      },
      bimProductAttributesList:{},
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
        productionQuantity: [{ required: true, message: '万粒数不能为空', trigger: 'blur' },
        { validator: this.formValidate('positiveNumber', '万粒数必须大于0', (errMsg, index) => { this.$message.error(`万粒数：${errMsg}`) }), trigger: 'blur' },
        ],
    
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

    totalProductionQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].productionQuantity])
      }
      return totalNums
    },
    totalQualifiedQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].qualifiedQuantity])
      }
      return totalNums
    },
    totalUnqualifiedQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].unqualifiedQuantity])
      }
      return totalNums
    },
  },
  watch: {
    'dataForm.productionWeight': {
      handler: function (newVal, oldVal) {
        if (this.$store.getters.configData.produce.steelBallTask) {
          if (newVal) {
            if (this.weight && this.quantity) {
              this.dataForm.productionQuantity = Number(newVal) / Number(this.weight) * Number(this.quantity)
            } else {
              this.dataForm.productionQuantity = 0
            }
          } else {
            this.dataForm.productionQuantity = 0
          }
          
        }
      },
      deep: true
    }
  },
  async created() {
    await this.getProjectList()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getTechnicalSwitch('produce', 'technical_requirement')
    await this.getCheckingSwitch('produce', 'checking_information')
    this.getProductClassFun()
  },

  methods: {
      // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
      getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })
    },
    delethHandle(scope) {
      this.$confirm(this.$t('此操作将删除当前数据，确认删除？'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        this.dataFormTwo.data.splice(scope.$index, 1)

      }).catch(() => { })
    },
    getProcessData(id, data, params, index) {
      this.materialList[params.scope.$index].processId = data[0].id || ''
      this.materialList[params.scope.$index].processName = data[0].name || ''
    },
    async getTechnicalSwitch(code, type) {
      try {
        this.isTechnicalSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getCheckingSwitch(code, type) {
      try {
        this.isCheckingSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    openSelectProductFun() {
      this.productVisible = true
      this.$nextTick(() => {
        if (this.isProjectSwitch == 1) {
          this.$refs.productForm.init(this.userInfo.projectId || '')

        } else {
          this.$refs.productForm.init('')

        }
      })
    },
    // 选择产品
    selectProductFun(data) {
      console.log("所选返工产品", data);

      this.$refs.dataForm.clearValidate('productDrawingNo');

      this.dataForm.productDrawingNo = data.drawingNo
      this.dataForm.productCode = data.code
      this.dataForm.productName = data.name
      this.dataForm.productsId = data.id
 
      console.log(this.dataForm)
    },
    //领料人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.collectForm.clearValidate('personId')
      })
      this.collectForm.personId = e
    },


    // 通过查询条件查询未完成的派工单
    dataFormSubmit() {
      if (this.daterangeList.length) {
        this.dispatchSearchForm.startTime = this.daterangeList[0] + " 00:00:00";
        this.dispatchSearchForm.endTime = this.daterangeList[1] + " 23:59:59";
      } else {
        this.dispatchSearchForm.startTime = "";
        this.dispatchSearchForm.endTime = "";
      }
      getWorkListMap(this.dispatchSearchForm).then((res) => {
        console.log("查询结果", res);
        let arr = Object.keys(res.data);
        console.log(555, res.data[arr[0]]);
        this.detailDataList = res.data[arr[0]];
      });
    },
    // 重置查询条件
    reset() {
      this.daterangeList = [];
      this.dispatchSearchForm = {
        resIdList: this.dispatchSearchForm.resIdList,
        resType: this.dispatchSearchForm.resType,
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      },
        this.dataFormSubmit();
    },
    // 点击详情
    getDetailFun(id, data, type) {
      console.log(data);
      this.dispatchSearchForm.resIdList = [];
      this.dispatchSearchForm.resIdList.push(id.split("_")[0]);
      // this.detailDataList = data
      this.detailDiaFlag = true;
      if (type == "人员") this.dispatchSearchForm.resType = "personnel";
      if (type == "设备") this.dispatchSearchForm.resType = "device";
      if (type == "班组") this.dispatchSearchForm.resType = "work_group";
      this.detailDiaFlag = true;
      this.dispatchSearchForm.startTime = "";
      this.dispatchSearchForm.endTime = "";
      this.daterangeList = [];
      this.dataFormSubmit();
    },
    changresouce(item, type) {
      console.log("单击item", item);
      if (type == "人员") {
        this.currentPersonId = item.split("_")[0];
      }
      if (type == "班组") {
        this.currentWorkgroupId = item.split("_")[0];
      }
      if (type == "设备") {
        this.currentDeviceId = item.split("_")[0];
      }
    },


    search() {
      this.form.pageNum = 1
      this.initData()
    },

    initData() {
      this.listLoading = true
      getCooperativeData(this.form).then(res => {
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
 
    init(id) {
      detailordershengchan(id).then(res => {
          console.log("生产任务详情", res);
          this.dataForm = res.data.prodOrder
          this.$set(this.dataForm,'oldProductionBarrels',this.dataForm.productionBarrels)
          this.$set(this.dataForm,'oldProductionWeight',this.dataForm.productionWeight)
          this.$set(this.dataForm,'splitNo',1)
          this.oldWorkOrderList = res.data.workOrderList
          this.dataFormTwo.data = res.data.workOrderList
          if (this.$store.getters.configData.produce.steelBallTask) {
          let obj = {
            productsId: this.dataForm.productsId
          }
          getProductsWeightQuantityList(obj).then(res=>{
            this.weight = res.data.records.length ? res.data.records[0].weight : 0
            this.quantity = res.data.records.length ? res.data.records[0].quantity : 0
          })
        }
      })
  
      // this.fetchData("PROD")
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
    async handleConfirm(value) {
        try {
          await this.$refs['dataForm'].validate()
          this.btnLoading = true
          reformOrderNum(this.dataForm).then(res => {
            this.btnLoading = false
            this.$message.success("改制成功")
            setTimeout(() => {
              this.$emit('close')
            }, 1500);
          }).catch(error => {
            this.btnLoading = false

      })
        } catch (e) {
          console.log('基础信息');
          console.log(e);
          throw new Error('orderInfo')
        }
        if (!this.allocationFlag) {
          return this.checkFun()
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
