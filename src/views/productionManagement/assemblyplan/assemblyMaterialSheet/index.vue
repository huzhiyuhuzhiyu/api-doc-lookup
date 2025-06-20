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
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="装配产品" prop="drawingNo">
                      <el-input v-model="dataForm.drawingNo" placeholder="装配产品"
                        @focus="openSelectProductFun"></el-input>
                    </el-form-item>
                  </el-col>
                    <el-col :sm="6" :xs="24" v-if="$store.getters.configData.product.enable_symbol">
                        <el-form-item label="代号"  prop="productSymbol">
                            <el-select @change="selectProductSymbolFormData" v-model="dataForm.productSymbol" placeholder="代号" clearable
                                       style="width: 100%;">
                                <el-option  v-for="(item, index) in productSymbolList" :key="index" :label="item.code"
                                            :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                  <template v-for="item in attrDictionaryData">
                      <el-col :sm="6" :xs="24"  :key="item.id">
                          <el-form-item :label="$store.getters[item.description] || item.fullName" :prop="item.description">
                              <el-select style="width: 100%" :disabled="btnType === 'look'" v-model="dataForm[item.description]" :placeholder="$store.getters[item.description] || item.fullName">
                                  <el-option v-for="(line, index) in item.list" :key="line.id" :label="line.name"
                                             :value="line.name"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </template>


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
                      <el-input v-model="collect.orderNo" :disabled="btnType === 'look'
                        ? true : collectConfig.codeWay === 'auto' && !collectConfig.modifyFlag" />
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
                      <el-date-picker v-model="collect.operationDate"  type="date" :clearable="false"
                        value-format="yyyy-MM-dd" style="width: 100%;" placeholder="领料日期"
                        :disabled="btnType === 'look'"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
            <el-collapse-item title="领料清单" name="pickInfo">
                <div v-if="btnType !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"  icon="el-icon-plus" @click="openSelectProductDialog()">
                        选择产品分类
                    </el-button>|
                </div>
              <el-form :model="dataFormOne" v-bind="dataFormOne" ref="processRef" class="data-form">
                <el-table ref="product" :data="dataFormOne.collectData" fixedNo
                  v-bind="dataFormOne.collectData">
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                  <el-table-column prop="productCode" width="160" label="产品编码"></el-table-column>
                  <el-table-column prop="productName" width="160" label="产品名称" sortable="custom"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="drawingNo" width="160" label="品名规格" />
                  <el-table-column prop="productCategoryName" label="产品分类" min-width="140" />
                  <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111">
                    <template slot="header">
                      <span class="required">*</span>
                      批次号
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'collectData.' + scope.$index + '.' + 'batchNumber'" :rules="productRules.batchNumber">
                          <el-input v-model="scope.row.batchNumber" readonly :disabled="btnType == 'look'"
                            @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                            {{ scope.row.batchNumber }}
                          </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="inventoryQuantity" label="批次库存数量" min-width="160" />
                  <el-table-column prop="mainUnit" label="单位"></el-table-column>
                  <AttributeColumns :btnType="btnType" :dataType="'line'" :moduleConfig="'produce'" />
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
                  <el-table-column label="操作" fixed="right" width="100"
                                     v-if=" btnType !== 'look'">
                        <template slot-scope="scope">
                            <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                            <el-button class="JNPF-table-delBtn" type="text" @click="delFun(scope.row, scope.$index)" size="mini">删除</el-button>
                        </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </div>


        <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" dialogTitle="选择产品"
          treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
          :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false"
          :multiple="false" :renderTree="false" />
        <!-- 选批次号 -->
        <BatchNumberForm :productCategoryId="currentProductCategory" v-if="batchNumVisible" ref="BatchNumberForms" @selectBatchNumberFun="selectBatchNumberFun">
        </BatchNumberForm>
        <ComSelect-page ref="productCateRef" @change="productCateChange" :tableItems="ProductCateTableItems" dialogTitle="选择产品分类"
                          :listMethod="getcategoryTree" :listDataTreeFlag="true" :expands="true" multiple
                          :listRequestObj="productCateRequest" :searchList="ProductCateTableSearchList" :elementShow="false"
                          :renderTree="false" />
      </div>
    </transition>
  </div>
</template>
<script>
import {
  addProdPickOrder,
} from '@/api/productOrdes/finishedProductOrders'
import BatchNumberForm from '../../../warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/batchNumberForm.vue'

import {
    getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap, productAttributeCodeRelated
} from '@/api/masterDataManagement/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: {
    BatchNumberForm,
  },
  mixins: [getProjectList],
  data() {
    return {
      ProductCateTableItems:[
          { prop: 'code', label: '分类编码' },
          { prop: 'name', label: '分类名称'},
      ],
      ProductCateTableSearchList:[
          {prop:'code',label:'编码',type:'input'},
          {prop:'name',label:'名称',type:'input'}
      ],
      productCateVisible:false,
      productCateRequest:{
          "classAttribute": "",
          "type": "material",
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
      },
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
        batchNumber:[
            {
                validator: this.formValidate({
                    type: 'noEmtry',
                    params: [
                        '',
                        (errMsg, index) => {
                            this.$message.error(`领料清单第${index + 1}行：批次号${errMsg}`)
                        }
                    ]
                }),
                trigger: ['change']
            },
            { required: true, trigger: ['change'] }
        ],
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
      },
      collectConfig: {},
      pickDataRule: {
        orderNo: [{ required: true, message: '领料单号单号不能为空', trigger: 'blur' }],
        operationDate: [{ required: true, message: '领料日期不能为空', trigger: 'change' }]
      },
      activeNames2: [],
      collect: {
        orderNo: '',
        operationDate: this.jnpf.getToday(),
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
      attrDictionaryData:[],
      currentProductCategory:'',
      productSymbolList:[],
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
    this.attrDictionaryData = productAttribute.filter(item=>!['pa014','pa017','pa018','pa021','pa022'].includes(item.enCode)).map(item=>{
          return {
              ...item,
              list:this.bimProductAttributesList[item.enCode]
          }
    })
    this.getPickingConfig()
  },
  methods: {
      getcategoryTree,
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
        let msg = `投料数量不能超过批次库存数量`
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
      this.batchNumVisible = true
      data.productsId = data.productId
      this.currentProductCategory = this.dataFormOne.collectData[index].productCategoryId
      this.$nextTick(() => {
        this.$refs.BatchNumberForms.init(data, index)
      })
    },
    // 选择批次
    selectBatchNumberFun(data, index) {
      console.log('批次号数据', data, index)
      let list = this.dataFormOne.collectData
      this.$set(list[index], 'inventoryQuantity', data.inventoryQuantity)
      this.$set(list[index], 'batchNumber', data.batchNumber)
      this.$set(list[index], 'materialsUsedQuantity', this.dataForm.productionQuantity)
      this.$set(list[index], 'drawingNo', data.productDrawingNo)
      this.$set(list[index], 'productName', data.productName)
      this.$set(list[index], 'productCode', data.productCode)
      this.$set(list[index], 'productsId', data.productsId)
      this.$set(list[index], 'warehouseId', data.warehouseId)
      this.$set(list[index], 'shelfSpaceId', data.shelfSpaceId)
      this.$set(list[index], 'cooperativePartnerId', data.cooperativePartnerId)
      this.$set(list[index], 'classType', data.classType)
      this.$set(list[index], 'mainUnit', data.mainUnit)
      this.$set(list[index], 'ratio', data.ratio)
      this.$set(list[index], 'calculationDirection', data.calculationDirection)
      this.$set(list[index], 'material', data.classType === 'holder' ? data.material : '')
      this.$set(list[index], 'colour', data.classType === 'sealing_cap' ? data.colour : '')

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
    async addth(val, data) {
      console.log('所选装配产品', data)
      this.dataForm = {
          ...data[0].all,
          taskMethod:'not_appoint',
          planDate:this.dataForm.planDate || [],
          orderType:'manually',
          orderNo:this.dataForm.orderNo || this.codeConfig.number,
          productionQuantity:this.dataForm.productionQuantity || '',
      }
      await this.selectProductSymbol(this.dataForm.id)
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
      this.btnLoading = true
      let submitFlag = true
      this.$refs['dataForm'].validate(async (valid) => {
        this.dataForm.documentStatus = value
        if (valid) {
          this.dataForm.productsId = this.dataForm.id
          this.dataForm.planStartDate = this.dataForm.planDate[0]
          this.dataForm.planEndDate = this.dataForm.planDate[1]
          this.dataForm.materialFlag = this.allocationFlag
          if (!this.dataFormOne.collectData.length){
              submitFlag = false
              this.btnLoading = false
              return this.$message.error('请至少添加一条领料清单')
          }
          let form_2 = this.$refs['processRef']
          let valid_2 = await form_2.validate().catch(() => false)
          if (!valid_2 && submitFlag) {
              submitFlag = false
              this.btnLoading = false
              this.jnpf.focusErrValidItem(form_2.fields)
          }
          if(submitFlag){
              let obj = {
                  collect:this.allocationFlag ? this.collect : '',
                  materialList: this.dataFormOne.collectData.map(item=>{
                      item.num = item.materialsUsedQuantity
                      return item
                  }),
                  prodOrder: this.dataForm,
              }
              addProdPickOrder({...obj,bomFlag:true,})
                  .then(async (res) => {
                      this.$message.success('新建装配任务成功')
                      this.dataForm = {
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
                      }
                      this.collect ={
                          orderNo: '',
                          operationDate: this.jnpf.getToday(),
                          personId: ''
                      }
                      this.dataFormOne.collectData = []
                      await this.fetchData('PROD', true)
                      await this.fetchData('PODH', true)
                      this.btnLoading = false
                      this.$emit('close')
                  })
                  .catch((error) => {
                      this.btnLoading = false
                  })
          }else{
              this.btnLoading = false
          }
        }else{
            this.btnLoading = false
        }
      })
    },
    openSelectProductDialog(){
        this.$refs.productCateRef.openDialog()
    },
    productCateChange(val,data){
          if (data && data.length) {
              let selectArr = []
              let list = data.map((item) => item.all)
              list.forEach((item, index) => {
                  selectArr.push({
                      classAttribute: item.classAttribute,
                      productCategoryId: item.id,
                      productCategoryName: item.name,
                      productCategoryCode: item.code,
                      qty:1,
                      inventoryQuantity:'',
                      batchNumber:'',
                      materialsUsedQuantity: this.dataForm.productionQuantity,
                      ratio: item.ratio,
                      calculationDirection: item.calculationDirection,
                      remark: item.remark,
                      reduceType:'picking',
                      id:'',
                  })
              })
              if (this.dataFormOne.collectData.length) {
                  const deletedArray = []
                  selectArr = selectArr.filter((item1) => {
                      const index = this.dataFormOne.collectData.findIndex((item2) => item2.productCategoryId === item1.productCategoryId)
                      if (index !== -1) {
                          deletedArray.push(item1.productCategoryName)
                          if (deletedArray.length) {
                              this.$message.error(`已经添加过的产品分类：${deletedArray.join('、')}`)
                          }
                          return false
                      }
                      return true
                  })
              }
              this.dataFormOne.collectData = [...this.dataFormOne.collectData, ...selectArr]
          }
    },
      selectProductSymbolFormData(val){
          let row = this.productSymbolList.find(item=>item.code === val)
          if (row){
              for (let key in row){
                  this.dataForm[key] = row[key]
              }
          }
      },
      async selectProductSymbol(id){
          let query = {
              orderItems: [{
                  asc: false,
                  column: ""
              }, {
                  asc: false,
                  column: "create_time"
              }],
              productId: id,
          }
          productAttributeCodeRelated(query).then(res=>{
              this.productSymbolList = res.data.records
          })
      },
      copyFun(row, index){
          let data = JSON.parse(JSON.stringify(row))
          this.dataFormOne.collectData.splice(index + 1, 0, data);
      },
      delFun(row,index){
          this.dataFormOne.collectData.splice(index, 1)
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
