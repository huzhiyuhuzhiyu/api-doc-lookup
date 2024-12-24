<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main"  v-if="!formVisible">
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


            <!-- <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderNoS" placeholder="生产任务单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
          
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="productDrawingNoS" placeholder="品名规格" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col> -->

            <el-col :span="4">
              <el-form-item>
                <el-select v-model="orderForm.orderType" placeholder="生产任务类型" style="width: 100%;">
                  <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.label"
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
        <div class="JNPF-common-layout-main JNPF-flex-main"  v-loading="listLoading" >
          <div class="JNPF-common-head">
            <div> </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
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
          <JNPF-table ref="dataTable"   :data="tableData" :fixedNO="true"   v-if="isProjectSwitchFlag"
            header-cell-class-name="all-select" @sort-change="sortChange" custom-column
            :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="生产任务单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id)">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="生产任务类型" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderType == 'normal'">正常任务</div>
                <div v-if="scope.row.orderType == 'rework'">返工任务</div>
                <div v-if="scope.row.orderType == 'manually'">手动新建任务</div>
                <div v-if="scope.row.orderType == 'flipping'">翻库任务</div>
                <div v-if="scope.row.orderType == 'transit'">在制任务</div>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="productionQuantity" label="生产数量" min-width="140" sortable="custom" />
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"
              v-if="sealingCoverTypingFlag == 1" />
            <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"
              v-if="accuracyLevelFlag == 1" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
              v-if="vibrationLevelFlag == 1" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
            <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" v-if="oilQuantityFlag == 1" />
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
              v-if="packagingMethodFlag == 1" />
            <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
              v-if="specialRequireFlag == 1" />
            <el-table-column prop="material" label="保持架材质" width="130" sortable="custom"
              v-if="materialFlag == 1"></el-table-column>
            <el-table-column prop="colour" label="颜色" width="120" sortable="custom"
              v-if="colourFlag == 1"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" />
            <el-table-column label="操作" width="220" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="addition(scope.row)">创建领料单</el-button>
                <el-button size="mini" type="text" @click.native="handleUserRelation(scope.row.id)">查看详情</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <PickForm v-if="pickVisible" ref="PickForm" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />

  </div>
</template>

<script>
import { ordershengchanList, addOrderNum } from '@/api/productOrdes/index.js'
import { excelExport, getOrderFiledMap } from '@/api/basicData/index'
import { UserListAll, } from '@/api/permission/user'
import Form from '@/views/productionManagement/assemblyplan/assemblyTaskManagement/taskFormCopy.vue'
import PickForm from '../assemblyPickManagement/Form.vue'
import { getProductionPlanList } from '@/api/productionManagement/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes,getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'assemblyplanManagement',
  components: { SuperQuery, Form, PickForm },
  mixins: [getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      isProjectSwitchFlag: false,
      pickVisible: false,
      columnList: [],
      orderTypeList: [
        { label: "正常任务", value: "normal" },
        { label: "返工任务", value: "rework" },
      ],
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],

      superQueryVisible: false,
      exportFormVisible: false,
      btnLoading: false,
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      orderForm: {},
      orderFormlist: {
        productsDrawingNo: "",
        orderNo: "",
        orderType: "",
        pageNum: 1,
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
        pickingStatus: "not_finished",
        orderStatus: "normal",
        materialFlag: 1,
      },
      total: 0,
      formVisible: false,
      selectArr: [],

      superQueryJson: [
        {
          prop: 'orderNo',
          label: "生产任务单号",
          type: 'input'
        },
     

        
        {
          prop: 'orderType',
          label: "生产任务类型",
          type: 'select',
          options: [
            { label: "正常任务", value: "normal" },
            { label: "返工任务", value: "rework" },
            { label: "手动新建任务", value: "manually" },
            { label: "翻库任务", value: "flipping" },
            { label: "在制任务", value: "transit" },
          ]
        },
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
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
      isProductNameSwitch:"",

    }
  },
 
  async created() {
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project') 
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(2, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      }) 
    }
    this.advancedQueryFun()
    this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  }, 
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    activeName() {
      this.search('basic')
    }
  },
  mounted() { 
  },
  methods: {
    async getOrderFiledMap() {
      await  getOrderFiledMap('sale').then((res) => {
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
    advancedQueryFun() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式          
      //     specialRequire //特殊要求
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'planEndDate')
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
    addition(data) {
      this.pickVisible = true
      this.$nextTick(() => {
        this.$refs.PickForm.init(data, 'add', false, 'awit')
      })
    },
    handleUserRelation(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, 'all')
      })
    },
    dispurchaseData(row) {
      return !row.selectFlag;
    },

    selectFun(val) {
      console.log(val);
      if (val.length) {
        this.tableData.forEach(item => {
          if (item.id != val[0].id) {
            item.selectFlag = true
          }
        });
        this.selectArr = val
      } else {
        this.tableData.forEach(item => {
          item.selectFlag = false
        });
      }
    },
  

    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode'||prop=='productName' ||prop=='projectName'|| prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'productDrawingNo') {
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
      this.pickVisible = false
      this.search('basic')
    },
    initData() {
      this.listLoading = true

      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      ordershengchanList(this.orderForm).then(res => {
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
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],

        this.$refs.SuperQuery.conditionList = []
      this.search('basic')
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
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
