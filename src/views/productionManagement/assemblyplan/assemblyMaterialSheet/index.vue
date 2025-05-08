<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <div style="font-size:18px" >新建装配任务</div>
          <div class="options">
            <el-button type="primary" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('submit')">
              保存并提交
            </el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
              <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="生产任务单号" prop="orderNo">
                      <el-input v-model="dataForm.orderNo" :disabled="btnType === 'look' ? true : codeConfig.codeWay === 'auto' && !codeConfig.modifyFlag" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="装配产品" prop="drawingNo">
                      <el-input v-model="dataForm.drawingNo" placeholder="装配产品"
                        @focus="openSelectProductFun"></el-input>
                    </el-form-item>
                  </el-col>
<!--                  <el-col :sm="6" :xs="24" v-for="item in attrDictionaryData" :key="item.id">-->
<!--                      <el-form-item :label="item.fullName" :prop="item">-->
<!--                      </el-form-item>-->
<!--                  </el-col>-->
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="计划生产开始—结束日期" prop="planDate" style="margin-bottom: 18px;">
                      <el-date-picker v-model="dataForm.planDate" type="daterange" value-format="yyyy-MM-dd"
                        style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="装配数量" prop="productionQuantity">
                      <el-input v-model="dataForm.productionQuantity" placeholder="装配数量"></el-input>
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

            <el-collapse-item title="领料信息" name="pickbasicInfo" class="orderInfo">
              <el-form ref="collectForm" :model="collect" :rules="pickDataRule" label-width="160px"
                label-position="top">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="领料单号" prop="orderNo">
                      <el-input v-model="collect.orderNo" :disabled="btnType == 'look'
                        ? true
                        : collectConfig.codeWay == 'auto' && !collectConfig.modifyFlag
                          ? true
                          : false
                        " />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="领料人" prop="personId">
                      <el-input v-model="collect.personId" :disabled="btnType == 'look' ? true : false"
                        placeholder="领料人" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="领料日期" prop="operationDate">
                      <el-date-picker v-model="collect.operationDate" :default-value="new Date()" type="date"
                        value-format="yyyy-MM-dd" style="width: 100%;" placeholder="领料日期"
                        :disabled="btnType == 'look' ? true : false" @change="changDateFun"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
            <el-collapse-item title="领料清单" name="pickInfo">
              <el-form :model="dataFormOne" v-bind="dataFormOne" ref="processRef" class="data-form">
                <el-table ref="product" :data="dataFormOne.collectData" fixedNo v-loading="tableloading"
                  v-bind="dataFormOne.collectData" @selection-change="handeleProductInfoData">
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                  <el-table-column prop="productCode" width="160" label="产品编码"></el-table-column>
                  <el-table-column prop="productName" width="160" label="产品名称" sortable="custom"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="drawingNo" width="160" label="品名规格" />
                  <el-table-column prop="qty" label="基本数量" width="120" />
                  <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111">
                    <template slot="header">
                      <span class="required">*</span>
                      批次号
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.batchNumber" readonly :disabled="btnType == 'look'"
                        @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                        {{ scope.row.batchNumber }}
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="mainUnit" label="单位"></el-table-column>
                  <el-table-column prop="material" label="保持架材质" width="120">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.material" placeholder="请选择"
                        :disabled="scope.row.classType !== 'holder'" clearable style="width: 100%;">
                        <el-option v-for="(item, index) in list9" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="colour" :label="$store.getters.colour"  width="120">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.colour" placeholder="请选择"
                        :disabled="scope.row.classType !== 'sealing_cap'" clearable style="width: 100%;">
                        <el-option v-for="(item, index) in list10" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="materialsUsedQuantity" label="投料数量" width="160">
                    <template slot="header">
                      <span class="required">*</span>
                      投料数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'collectData.' + scope.$index + '.' + 'materialsUsedQuantity'"
                        :rules="productRules.materialsUsedQuantity">
                        <el-input v-model="scope.row.materialsUsedQuantity" placeholder="投料数量" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </div>

        <CollectProductForm v-if="collectVisible" ref="collectProductForm"
          @selectCollectProduct="selectCollectProductFun">
        </CollectProductForm>

        <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" dialogTitle="选择产品"
          treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
          :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false"
          :multiple="false" :renderTree="false" />
        <!-- 选批次号 -->
        <BatchNumberForm v-if="batchNumVisible" ref="BatchNumberForms" @selectBatchNumberFun="selectBatchNumberFun">
        </BatchNumberForm>
      </div>
    </transition>
  </div>
</template>
<script>
import {
  getprodOrderList,
  prodOrderInfo,
  addProdPickOrder,
  updateprodOrderFinished,
  prodOrderDispatch,
  dispatchListMap
} from '@/api/productOrdes/finishedProductOrders'
import { excelExport, getProductionLineInfo, getProductionLineList } from '@/api/basicData/index'
import { BOMLineList } from '@/api/calculationList/MRPOperation'
import BatchNumberForm from '../../../warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/batchNumberForm.vue'
import CollectProductForm from '../assemblyTaskManagement/CollectProductForm.vue'
import {
  detailProcess,
  getWorkListMap,
  addProdPlanArrange,
  detailResourceProcess
} from '@/api/basicData/processSettingss.js'
import { getBimBusinessSwitchConfigList, getOrderFiledMap } from '@/api/basicData/index'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import { getBimProcessList, getBimProcessDetail } from '@/api/bimProcess/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    BatchNumberForm,
    CollectProductForm
  },
  mixins: [getProjectList],
  data() {
    return {
      reduceTypeList: [
        { label: '生成领料单', value: 'picking' },
        { label: '自动扣减料', value: 'auto' },
        { label: '都不是', value: 'none' }
      ],
      workOrderList: false,
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: { method: getcategoryTree, requestObj: { classAttribute: "finish_product" } }, // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "finish_product",
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'productCategoryName', label: '产品分类' },
        { prop: 'routingName', label: '工艺路线' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "productCode", label: "产品编码", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "productDrawingNo", label: "品名规格", type: 'input' }
      ], // 产品选择弹出框搜索条件
      collectVisible: false,
      productRules: {
        materialsUsedQuantity: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`领料清单第${index + 1}行：投料数量${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg, index) => {
                  this.$message.error(`领料清单第${index + 1}行：投料数量${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg, index) => {
              this.$message.error(`领料清单第${index + 1}行：投料数量${errMsg}`)
            }),
            trigger: 'blur'
          },
          { validator: this.calcValidate(), trigger: 'blur' },
          { required: true, trigger: ['blur'] }
        ],
        processName: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`领料清单第${index + 1}行：工序${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          }
        ]
      },
      collectConfig: {},
      pickDataRule: {
        orderNo: [{ required: true, message: '领料单号单号不能为空', trigger: 'blur' }],
        operationDate: [{ required: true, message: '领料日期不能为空', trigger: 'change' }]
      },
      activeNames2: [],
      collect: {
        orderNo: '',
        operationDate: '',
        personId: ''
      },
      allocationFlag: false,
      btnType: '',
      processVisible: false,
      productVisible: false,
      batchNumVisible: false,
      activeNames: ['productInfo', 'basicInfo', 'pickInfo', 'pickbasicInfo'],
      routingVisible: false,
      dataForm: {
        taskMethod: 'not_appoint',
        planDate: [],
        orderNo: '',
        productsDrawingNo: '',
        productsCode: '',
        mainUnit: '',
        planProductionQuantity: '',
        availableArrangeQuantity: '',
        productionQuantity: '',
        planStartDate: '',
        planEndDate: '',
        routingName: '',
        routingId: '',

        remark: '',
        bomId: '',
        drawingNo: '',
        productionLineId: '',

        pieceworkFlag: false,
        pairingModeId: ''
      },

      dataFormTwo: {
        data: []
      },
      dataFormOne: {
        collectData: []
      },
      listLoading: false,
      activeName: 'orderInfo',
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataRule: {
        orderNo: [{ required: true, message: '生产任务单号不能为空', trigger: 'blur' }],
        drawingNo: [{ required: true, message: '装配产品不能为空', trigger: 'change' }],
        planDate: [{ required: true, message: '计划生产日期不能为空', trigger: 'change' }],
        productionQuantity: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '装配数量不能为空',
                (errMsg) => {
                  this.$message.error(`${errMsg}`)
                }
              ]
            }),
            trigger: 'blur'
          },
          { required: true, trigger: 'blur' },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg) => {
              this.$message.error(`装配数量${errMsg}`)
            }),
            trigger: 'blur'
          }
        ],
        routingName: [{ required: true, message: '工艺路线不能为空', trigger: 'change' }]
      },
      selectArr: [],

      totalData: [],
      index: '',
      currentWorkgroupId: '',
      currentDeviceId: '',
      currentPersonId: '',
      routingProResMapDiaFlag: false,
      routingProResMapDiaTitle: '',
      workgroupData: [],
      deviceData: [],
      personnelData: [],
      workstationList: [],
      lineList: [],
      codeConfig: {},
      dispatchSearchForm: {
        resIdList: [],
        resType: '',
        endTime: '',
        startTime: '',
        orderNo: '',
        processName: ''
      },
      detailDataList: [],
      selectProcessArr: [],
      selectRows: [],
      currentProductIndex: '',
      isSame: false,
      previousroutingId: '',
      naturalResourcesFlag: true,

      isProductNameSwitch: '',

      isTechnicalSwitch: '',
      isCheckingSwitch: '',
      productionLineList: [],
      pairingModeList: [],
      bimProductAttributesList: {},
      list9: [],
      list10: [],
      attrDictionaryData:[]
    }
  },
  async created() {
    await this.fetchData('PROD', true)
    await this.fetchData('PODH', true)
      await this.getProductClassFun()
    await this.getProductAttributeFun()
    this.isProductNameSwitch = this.$store.getters.configData.product.enable_productName ? '1' : false
    await this.getProjectSwitch('system', 'project')
    const productAttribute = await this.$store.dispatch('base/getDictionaryData', { sort: 'productAttributes'})
    this.attrDictionaryData = productAttribute.map(item=>{
          return {
              ...item,
              list:this.bimProductAttributesList[item.enCode]
          }
    })
    this.getPickingConfig()
  },

  watch: {
    'dataForm.productionQuantity': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        this.dataFormOne.collectData.forEach((item, index) => {
          console.log(item.lossRate, 'item.lossRate')
          console.log(Number(1 + item.lossRate), 'Number(1 + item.lossRate)')
          console.log(item.inventoryQuantity, 'item.inventoryQuantity')
          if (item.batchNumber && item.inventoryQuantity) {
            this.$set(
              item,
              'materialsUsedQuantity',
              Number(newVal) * Number(item.qty) * Number(1 + Number(item.lossRate)) + Number(item.fixedLoss)
            )
            console.log(item.materialsUsedQuantity, 'qiee')
            if (item.materialsUsedQuantity > Number(item.inventoryQuantity)) {
              return this.$message.error(`第${index + 1}行，投料数量大于库存数量`)
            }
          }
        })
      },
      deep: true
    }
  },
  mounted() { },
  methods: {
    // 获取产品属性
    async getProductClassFun() {
      // 产品属性
      const res = await getbimProductAttributesListMap()
      this.bimProductAttributesList = res.data
    },
    getProductAttributeFun() {
      // 保持架材质

      this.list9 = this.bimProductAttributesList.pa021.map((item) => {
        return {
          label: item.name,
          name: item.name
        }
      })

      // 颜色


      this.list10 = this.bimProductAttributesList.pa010.map((item) => {
        return {
          label: item.name,
          name: item.name
        }
      })

    },
    calcValidate() {
      console.log(12332222)
      return (rule, value, callback) => {
        console.log(value, 'p')
        let index = Number(rule.field.match(/\d+/)[0])
        let msg = `批次库存数量小于投料数量`
        if (!value || value == 0) {
          callback()
        } else {
          let flag = false
          let list = this.dataFormOne.collectData
          let num_1 = Number(list[index].materialsUsedQuantity)
          let num_2 = Number(list[index].inventoryQuantity)

          if (!(num_1 <= num_2)) {
            flag = true
          }
          if (flag) {
            this.$message.error(`第${index + 1}行${msg}`)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },



    // 打开选择批次号弹框
    openSeleceBatchNumberDialog(data, index) {
      if (!this.dataForm.productionQuantity) return this.$message.error('请先填写装配数量')
      console.log(data, 'dd')
      console.log(index, 'in')
      // if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库")
      this.batchNumVisible = true
      data.warehouseId = this.dataForm.warehouseId
      data.productsId = data.productId
      this.$nextTick(() => {
        this.$refs.BatchNumberForms.init(data, index)
      })
    },
    // 选择批次
    selectBatchNumberFun(data, index) {
      console.log('批次号数据', data, index)
      let list = this.dataFormOne.collectData
      this.$set(list[index], 'cooperativePartnerId', data.cooperativePartnerId)
      this.$set(list[index], 'warehouseId', data.warehouseId)
      this.$set(list[index], 'shelfSpaceId', data.shelfSpaceId)
      this.$set(list[index], 'shelfSpaceName', data.shelfSpaceName)
      this.$set(list[index], 'inventoryQuantity', data.inventoryQuantity)
      this.$set(list[index], 'batchNumber', data.batchNumber)
      // 投料数量 = 装配数量x基本数量x(1+损耗率)+固定损耗
      this.$set(
        list[index],
        'materialsUsedQuantity',
        Number(this.dataForm.productionQuantity) * Number(list[index].qty) * Number(1 + Number(list[index].lossRate)) +
        Number(list[index].fixedLoss)
      )
    },
    submit(id, data) {
      console.log('选择的工序', id, data, this.dataFormOne.collectData)
      let datas = data[0].all
      this.$set(this.dataFormOne.collectData[this.currentProductIndex], 'processName', datas.name)
      this.$set(this.dataFormOne.collectData[this.currentProductIndex], 'processId', datas.id)
    },

    // 选择的领料清单产品
    selectCollectProductFun(data) {
      console.log('领料产品', data)
      data.forEach((item) => {
        this.$set(item, 'reduceType', 'auto')
      })
      this.dataFormOne.collectData = data
    },

    // 获取领料设置 领料是否自动生成领料单
    getPickingConfig() {
        this.allocationFlag = this.$store.getters.configData.produce.arrange_auto_picking
        if (this.allocationFlag) {
            this.activeNames2 = ['pickInfo', 'pickbasicInfo']
        } else {
            this.activeNames2 = ['pickInfo']
        }
    },

    // 打开选择装配产品弹框
    openSelectProductFun() {
      this.$refs['ComSelect-page'].openDialog()
    },
    // 选择装配产品
    addth(val, data) {
      console.log('所选装配产品', data)
      this.dataForm = data[0].all
      this.$set(this.dataForm, 'taskMethod', 'not_appoint')
      this.$set(this.dataForm, 'planDate', [])
      this.$set(this.dataForm, 'orderType', 'rework')
      this.$set(this.dataForm, 'orderNo', this.codeConfig.number)
      if (this.dataForm.bomId) {
        BOMLineList(this.dataForm.bomId).then((res) => {
          console.log('bom详情', res)
          this.dataFormOne.collectData = res.data
          this.dataFormOne.collectData.forEach((item) => {
            item.drawingNo = item.productDrawingNo
            if (item.classType === 'holder') {
              item.material = item.material
            } else if (item.classType === 'sealing_cap') {
              item.colour = item.colour
            }
          })
        })
      } else {
        this.dataForm = {}
        this.dataFormOne.collectData = []
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
        })
        return this.$message.error('请选择有BOM的产品')
      }
      if (!this.dataForm.routingId) {
        this.dataFormOne.collectData = []
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
        })
        return this.$message.error('请选择有工艺路线的产品')
      }
    },

    async fetchData(code, flag) {
      try {
        const data = await this.$store.dispatch('base/getOrderNoConfig', code)
        if (code === 'PROD') {
          this.codeConfig = data
          if (flag) this.dataForm.orderNo = data.number
        }
        if (code === 'PODH') {
          this.collectConfig = data
          if (flag) this.collect.orderNo = data.number
        }
      } catch (error) { }
    },
    goBack() {
      this.$emit('close', true)
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (valid) {
          this.dataForm.productsId = this.dataForm.id
          this.dataForm.planStartDate = this.dataForm.planDate[0]
          this.dataForm.planEndDate = this.dataForm.planDate[1]
          let submitFlag = null

          if (this.allocationFlag) {
            this.dataForm.materialFlag = true
          } else {
            this.dataForm.materialFlag = false
          }

          if (submitFlag === false) return
          this.btnLoading = true

          let obj = {
            collect: this.dataFormTwo.data.length ? this.collect : null,
            materialList: this.dataFormOne.collectData,
            prodOrder: this.dataForm,
            workOrderList: this.dataFormTwo.data
          }
          console.log('dataForm', this.dataForm)
          console.log('dataFormTwo.data', this.dataFormTwo.data)
          console.log('coll', this.collect)
          console.log('dataFormOne.collectData', this.dataFormOne.collectData)
          addProdPickOrder(obj)
            .then((res) => {
              this.btnLoading = false
              this.$message.success('新建装配任务成功')
              this.dataForm ={}
              this.collect ={}
              this.dataFormOne.collectData = []
              setTimeout(() => {
                this.$emit('close')
              }, 1500)
            })
            .catch((error) => {
              this.btnLoading = false
            })
        }
      })
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

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
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
  padding: 0px;
  border-top: none !important;
}

.orderInfo ::v-deep.el-collapse-item__wrap {
  padding: 0 10px;
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

.orderInfo {
  margin-top: 5px;
  border-top: 0;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important;
}

::v-deep.routingProRes .el-dialog__body {
  height: 500px;
}

::v-deep .applySelect .el-icon-arrow-up:before {
  content: '';
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
</style>
