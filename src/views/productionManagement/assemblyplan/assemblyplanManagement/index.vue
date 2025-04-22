<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>


            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 4">
                <el-form-item>
                  <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                    @keyup.enter.native="search('basic')" />

                  <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                    clearable>
                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                    :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                    :type="item.dateType"
                    :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="orderForm.urgentFlag" placeholder="是否紧急" style="width: 100%;">
                  <el-option v-for="(item, index) in urgentFlagList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="translateFun()">
                编排
              </el-button> -->
              <el-button type="primary" size="mini" icon="iconfont-menu  icon-piliangdayin" style="margin-left: 8px;"
              @click="batchPrint">批量打印</el-button>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="importFun('dataTable')">
                导入
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-download" @click.native="exportForm('dataTable')">
                导出
              </el-button>


            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="advanceFun" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" :data="tableData" :fixedNO="true" v-if="isProjectSwitchFlag"
             @sort-change="sortChange" custom-column
            :setColumnDisplayList="columnList" hasC @selection-change="selectFun" >
            <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" sortable="custom" />
            <el-table-column prop="productsCode" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="productsName" label="产品名称" sortable="custom" width="160"
              v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
              <el-table-column prop="productsDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
              <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
              <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" />


            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
              v-if="isProjectSwitch == 1" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="planProductionQuantity" label="计划生产数量" min-width="160" sortable="custom" />
            <el-table-column prop="availableArrangeQuantity" label="可编排数量" min-width="160" sortable="custom" />
            <el-table-column prop="arrangeOrderNum" label="生产订单/已编排数" min-width="220" sortable="custom" />
            <el-table-column prop="urgentFlag" label="是否紧急" min-width="120" sortable="custom"
              :cell-class-name="cellClassName">
              <template slot-scope="scope">
                <div :style="scope.row.urgentFlag ? 'color:red' : ''">{{ scope.row.urgentFlag ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  width="120" sortable="custom"
              v-if="sealingCoverTypingFlag == 1" />
            <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  width="120" sortable="custom"
              v-if="accuracyLevelFlag == 1" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
              v-if="vibrationLevelFlag == 1" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
            <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" v-if="oilQuantityFlag == 1" />
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
              v-if="packagingMethodFlag == 1" />
            <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  width="120" sortable="custom"
              v-if="specialRequireFlag == 1" />
            <el-table-column prop="material" label="保持架材质" width="130" sortable="custom"
              v-if="materialFlag == 1"></el-table-column>
            <el-table-column prop="colour" :label="$store.getters.colour"  width="120" sortable="custom"
              v-if="colourFlag == 1"></el-table-column>
            <el-table-column prop="arithmeticNo" label="运算单号" min-width="160" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" />
            <el-table-column label="操作" width="220" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.orderType == 'rework'"
                  @click="addition(scope.row)">编排</el-button>
                <el-button size="mini" type="text" :disabled="scope.row.orderType == 'rework'"
                  @click="planSchedule(scope.row)">计划进度</el-button>
                <el-button size="mini" type="text" 
                  @click="viewDetailFun(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <PlanSchedule v-if="planScheduleVisible" ref="planScheduleForm" @refreshDataList="initData" @close="closeForm" />
    <TaskForm v-if="taskFormVisible" ref="taskForm" @refreshDataList="initData" @close="closeForm"></TaskForm>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
        :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton"
            icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="submit()">
          提交</el-button>
      </span>
    </el-dialog>
    <PrintDialog2 :visible.sync="printVisible2" @closePrint="closePrint2" @printSubmit="printWarehouse2"
      :printQuery="printQuery2" :enCode="enCode2" ref="printTemplate2" append-to-body />
    <print-browse2 :visible.sync="printBrowseVisible2" :id="prindId2" :formId="formId2" ref="printForm" />
  </div>
</template>

<script>
import { UserListAll, } from '@/api/permission/user'
import Form from './Form'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { getProductionPlanList,planImport } from '@/api/productionManagement/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import PlanSchedule from './planSchedule.vue'
import { excelExport, getOrderFiledMap, } from '@/api/basicData/index'
import PrintBrowse2 from '@/components/PrintBrowse'
import PrintDialog2 from '@/components/no_mount/printDialog'
import getProjectList from '@/mixins/generator/getProjectList'
import { getPrintList } from '@/api/system/printDev'
import { mapGetters, mapState } from 'vuex'
import { getPrintBusInfo } from '@/api/system/printDev'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import TaskForm from './taskFormCopy.vue'
export default {
  name: 'assemblyplanManagementSS',
  components: { Form, SuperQuery, ExportForm,TaskForm, PlanSchedule,PrintDialog2,PrintBrowse2 },
  mixins: [getProjectList],
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productsDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],
      planScheduleVisible: false,
      columnList: ["productCode", "arithmeticNo", "remark", "createByName",],

      superQueryVisible: false,
      exportFormVisible: false,
      qxbtnLoading: false,
      hbbtnLoading: false,
      btnLoading: false,

      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,

      orderForm: {},
      orderFormlist: {
        productsDrawingNo: "",
        productionPlanNo: "",
        urgentFlag: "",
        pageNum: 1,
        availableArrangeFlag: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        classAttribute: "finish_product",
      },
      urgentFlagList: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },

      total: 0,
      diagramVisible: false,
      formVisible: false,
      taskFormVisible: false,
      selectArr: [],
      prindId2: '',
      formId2: '',
      enCode2: "",
      printVisible2: false,
      printBrowseVisible2: false,
      superQueryJson: [
        {
          prop: 'productionPlanNo',
          label: "生产计划单号",
          type: 'input'
        },

        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'productsDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'planProductionQuantity',
          label: "计划生产数量",
          type: 'input'
        },
        {
          prop: 'availableArrangeQuantity',
          label: "可编排数量",
          type: 'input'
        },
        {
          prop: 'urgentFlag',
          label: "是否紧急",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'planStartDate',
          label: '计划开始日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'planEndDate',
          label: '计划结束日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input',

        },



        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
      ],

      isProjectSwitch: '',
      isProjectSwitchFlag: false,
      isProductNameSwitch: "",
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag:'',
      colourFlag:'',
      bimProductAttributesList: [],
      uploadVisib: false,

    }
  },
  async created() {
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    this.advancedQueryFuns()
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(2, 0, {
        prop: 'productsName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')

  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
  },
  methods: {
    printWarehouse2(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId2 = res.data.id
          this.formId2 = this.selectArr.map(item => item.id).join(',')
          this.printBrowseVisible2 = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible2 = false
      });
    },
    closePrint2() {
      console.log(345345345);
      this.printVisible2 = false
    },
    batchPrint() {
      if (!this.selectArr.length) return this.$message.error("请选择你要打印的数据")
      this.enCode2 = 'p020' // 筛选出 businessType 等于 type 的项  

      this.fullName2 = "未排产单" // 筛选出 businessType 等于 type 的项  
      this.printVisible2 = true
      this.$nextTick(() => {
        console.log(345345);
        this.$refs.printTemplate2.init(this.enCode2)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    submit() {
      console.log(this.fileList);
      this.UploadProduct(this.file)
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/装配计划导入模板.xlsx')
      a.click()
    },
    importFun(){
      this.uploadVisib = true
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    handleFileChange(file) {
      console.log("所选文件:", file);
      this.file = file.raw
    },
       // 上传产品
       UploadProduct(data) {
      console.log("data产品", data);
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data)
      //调用上传文件接口
      planImport(formData).then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)

          this.formLoading = false
          this.loadingText = ''
          this.search('basic')
        } else {
          this.handleMessage(res.data)
          this.$refs['uploadRef'].clearFiles();
        }
        this.uploadVisib = false
        // this.tipsvisible=true

        this.$refs['uploadRef'].clearFiles();
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
    viewDetailFun(row) {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.taskForm.init(row)
      })
    },
    async getOrderFiledMap() {
      await getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
    },
    async getProductClassFun() {
      // 产品属性
      await getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })

    },
    advancedQueryFuns() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式          
      //     specialRequire //特殊要求
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'planEndDate')
      if (this.colourFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'colour',
          label: '颜色',
          type: 'select',
          options: this.bimProductAttributesList.pa010.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.materialFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'material',
          label: '保持架材质',
          type: 'select',
          options: this.bimProductAttributesList.pa021.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.specialRequireFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'specialRequire',
          label: '特殊要求',
          type: 'select',
          options: this.bimProductAttributesList.pa016.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.packagingMethodFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.bimProductAttributesList.pa015.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.clearanceFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: this.bimProductAttributesList.pa001.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilQuantityFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: this.bimProductAttributesList.pa003.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: this.bimProductAttributesList.pa002.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.vibrationLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: this.bimProductAttributesList.pa005.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.accuracyLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'select',
          options: this.bimProductAttributesList.pa006.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.sealingCoverTypingFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'select',
          options: this.bimProductAttributesList.pa007.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
    },
    advanceFun() {
      this.superQueryVisible = true
    },
    planSchedule(row) {
      this.planScheduleVisible = true
      this.$nextTick(() => {
        this.$refs.planScheduleForm.init(row)
      })
    },
   
    addition(data) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(data)
      })
      // if (this.selectArr) {
      //   this.selectArr = []
      //   this.selectArr.push(data)
      //   this.translateFun()
      // } else {
      //   this.selectArr.push(data)
      //   this.translateFun()
      // }
    },
    // // 编排
    // translateFun() {
    //   // if (!this.selectArr.length) return this.$message.error("请选择您要生成编排的数据")
    //   this.formVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.Form.init(row)
    //   })
    // },
    selectFun(val) {
      console.log(val);
      this.selectArr = val


    },


    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },






    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode'||prop=='pairingModeName' || prop == 'projectName' || prop == 'productsName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'productsDrawingNo' || prop == 'productsCode' || prop == 'availableArrangeQuantity' || prop == 'arrangeOrderNum') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp

      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.planScheduleVisible = false
      this.taskFormVisible =false
      this.selectArr = []
      this.search('basic')
    },
    initData() {
      this.listLoading = true
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getProductionPlanList(this.orderForm).then(res => {
        res.data.records.forEach(item => {
          item.selectFlag = false
        })
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    search(type) {

      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

      this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))


      this.$refs.SuperQuery.conditionList = []

      this.searchList = [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],
        this.search('basic')
    },





    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.orderForm
      let _data = {
        ...targetListQuery,
        exportType: "1210",
        exportName: '生产计划',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
  }
}
</script>
<style scoped>
::v-deep .all-select .cell .el-checkbox__inner {
  display: none;
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}
</style>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
