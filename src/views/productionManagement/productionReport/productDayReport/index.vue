<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
     <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                  <el-col :span="4">
                <el-form-item>
                  <el-date-picker v-model="productionDate" type="daterange" value-format="yyyy-MM-dd"
                    style="width: 100%;" start-placeholder="请选择生产开始日期" end-placeholder="请选择生产结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
               <template v-for="item in searchList1">
                <el-col :span="item.searchType === 3 ? 6 : 3">
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
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col> 
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableProduce','1250')"> 导出</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFunProduce()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
 
              <JNPF-table ref="dataTableProduce" v-loading="listLoading" :data=" produceData" :fixedNO="true" @sort-change="sortChange" custom-column  :setColumnDisplayList="columnList">
                <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="productionOrderNo" label="生产任务单号" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="productionOrderType" label="任务类型" min-width="120" sortable="custom">
                  <template slot-scope="scope">
                    <div v-if="scope.row.productionOrderType == 'normal'">正常任务</div>
                    <div v-if="scope.row.productionOrderType == 'rework'">返工任务</div>
                    <div v-if="scope.row.productionOrderType == 'manually'">新建任务</div>
                    <div v-if="scope.row.productionOrderType == 'flipping'">翻库任务</div>
                    <div v-if="scope.row.productionOrderType == 'transit'">在制任务</div>
                    <div v-if="scope.row.productionOrderType == 'regrinding'">修磨任务</div>
                  </template>
                </el-table-column>
                <el-table-column prop="workNo" label="工单单号" min-width="180" />
                <el-table-column prop="orderNo" label="报工单号" min-width="180" />
                <el-table-column prop="reportingTime" label="报工时间" min-width="180" />
                <el-table-column prop="producerName" label="生产人" min-width="120" />
                <el-table-column prop="processName" label="工序名称" min-width="120" />
                <el-table-column prop="processCode" label="工序编码" min-width="120" />
                <el-table-column prop="equipmentName" label="设备名称" min-width="120" />
                <el-table-column prop="equipmentCode" label="设备编码" min-width="120" />
                <el-table-column prop="productName" label="产品名称" min-width="120" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="120" />
                <el-table-column prop="reportingQuantity" label="报工数量" min-width="120" />
                <el-table-column prop="actualQualifiedQuantity" label="实际合格数量" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="pairingModeName" label="配对方式" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="greaseMethod" label="注脂方式" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="100" sortable="custom"></el-table-column>
              </JNPF-table>
              <pagination :total="produceTotal" :page.sync="productForm.pageNum" :limit.sync="productForm.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryProduceVisible" ref="SuperQuery" :columnOptions="superQueryProduct" @superQuery="superQuerySearchProduce" @close="superQueryProduceVisible = false" />
           <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
          </div>
    </div>
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { produceDataReport,produceInboundReport,produceWorkOrderReport,produceProcessReport } from '@/api/productOrdes/index.js'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'productDayReport',
  components: { SuperQuery,ExportForm },

  mixins: [getProjectList],
  data() {
    return {
                columnList:['equipmentName','equipmentCode'],
      productionDate:[],
      produceData:[],
      produceTotal:0,
      superProductForm: {},
      productForm:{},
      productFormList:{
        produceStartDate: "",
        produceEndDate: "",
        productName: "",
        processName: "",
        producerName: "",
        equipmentName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
            {
                "asc": false,
                "column": ""
            },
            {
                "asc": false,
                "column": "createTime"
            }
        ],
        superQuery: {
            matchLogic: "AND",
            condition: []
        }
      }, 
      searchList1:[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'producerName', fieldValue: '', label: '生产人', symbol: 'like', searchType: 1, width: 120 },
        { field: 'equipmentName', fieldValue: '', label: '设备名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryProduce: [
        {
          prop: 'projectName',
          label: "所属项目",
          type: 'input'
        },
        {
          prop: 'productionOrderNo',
          label: "生产任务单号",
          type: 'input'
        }, 
        {
          prop: 'workNo',
          label: "工单单号",
          type: 'input'
        }, 
        {
          prop: 'orderNo',
          label: "报工单号",
          type: 'input'
        }, 
        { 
          prop: 'reportingTime',
          label: '报工时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'producerName',
          label: "生产人",
          type: 'input'
        }, 
        {
          prop: 'processName',
          label: "工序名称",
          type: 'input'
        },
          {
          prop: 'processCode',
          label: "工序编码",
          type: 'input'
        }, 
          {
          prop: 'equipmentName',
          label: "设备名称",
          type: 'input'
        }, 
             {
          prop: 'equipmentCode',
          label: "设备编码",
          type: 'input'
        }, 
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },   
          {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        }, 
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        }, 
        {
          prop: 'vibrationLevel',
          label: "振动等级",
          type: 'input'
        }, 
        {
          prop: 'accuracyLevel',
          label: "精度等级",
          type: 'input'
        },
         {
          prop: 'pairingModeName',
          label: "配对方式",
          type: 'input'
        },
         {
          prop: 'packagingMethod',
          label: "包装方式",
          type: 'input'
        },
       {
          prop: 'greaseMethod',
          label: "注脂方式",
          type: 'input'
        },
       {
          prop: 'sealingCoverTyping',
          label: "打字内容",
          type: 'input'
        },
       {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },  
      ],
      superQueryProduceVisible: false,



      

  




      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      activeName: "produce",
      reportCode:'',
    
    
      total: 0,
      formVisible: false,
      exportFormVisible:false,
    }
  },
  async created() { 
 
    this.superProductForm=this.productForm = JSON.parse(JSON.stringify(this.productFormList))
    
   this.search()
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
    columnSetFunProduce(){
      this.$refs['dataTableProduce'].showDrawer()
    },

    superQuerySearchProduce(query) {
      this.superProductForm = query
      this.superQueryProduceVisible = false
      this.search()
    },

    //排序
    sortChange({ prop, order }) {
      let newProp;
        if (prop === 'partnerCode' || prop === 'partnerName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.productForm.orderItems[0].asc = order !== "descending"
        this.productForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    initData() {
      this.listLoading = true
        produceDataReport(this.productForm).then(res => {
          this.produceData = res.data.records
          this.produceTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
    
       
    }, 
  
    search(type) {
        if (this.productionDate && this.productionDate.length > 0) {
          this.productForm.produceStartDate = this.productionDate[0].replace(/ 0(?!0)/g, " ")
          this.productForm.produceEndDate = this.productionDate[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.productForm.produceStartDate = ''
          this.productForm.produceEndDate = ''
        }
        Object.keys(this.productForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.productForm[key]
          this.productForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.productForm.pageNum = 1 // 重置页码
        if (type === 'basic') {
          this.superProductForm.superQuery  = {
            matchLogic: 'AND',
            condition: this.searchList1
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          } 
        }
        if (type === 'super') {
          this.superProductForm.superQuery = this.superQuery
        }
   
      
    
      this.initData()
    },
    reset() {
        this.$refs['dataTableProduce'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.productionDate = []
       this.superProductForm= this.productForm = JSON.parse(JSON.stringify(this.productFormList))
        this.searchList1=[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'producerName', fieldValue: '', label: '生产人', symbol: 'like', searchType: 1, width: 120 },
        { field: 'equipmentName', fieldValue: '', label: '设备名称', symbol: 'like', searchType: 1, width: 120 },
      ]
     
      this.search('basic')
    },
      // 导出
    exportForm(exportTableRef,code) {
      this.reportCode=code
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
      let targetListQuery={},exportName="";
      if(this.reportCode=='1250'){
        targetListQuery=this.productForm
        exportName='每日生产'
      }
  
         
      let _data = {
        ...targetListQuery,
        exportType: this.reportCode,
        exportName: exportName,
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
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />

