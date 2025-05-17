<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
 
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                  <el-col :span="4">
                <el-form-item>
                  <el-date-picker v-model="workForm.orderDate" type="date" value-format="yyyy-MM-dd"
                    style="width: 100%;" placeholder="请选择日期" >
                  </el-date-picker>
                </el-form-item>
              </el-col>
               <template v-for="item in searchList3">
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
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
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
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableWork','1252')"> 导出</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFunWork()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTableWork" v-loading="listLoading" :data="workData" :fixedNO="true" @sort-change="sortChange" custom-column>
                <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="productionOrderNo" label="生产任务单号" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="workNo" label="工单单号" min-width="180" />
                <el-table-column prop="productName" label="产品名称" min-width="120" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" />
                <el-table-column prop="mainUnit" label="单位" min-width="100" />
                <el-table-column prop="processName" label="工序名称" min-width="120" />
                <el-table-column prop="processCode" label="工序编码" min-width="120" />
                <el-table-column prop="productionQuantity" label="计划数量" min-width="120" />
                <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" />
                <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" />
                <el-table-column prop="qualifiedTotalQuantity" label="当日生产合格总数" min-width="180" />
                <el-table-column prop="proportion" label="当日生产占计划数量百分比" min-width="200" >
                     <template slot-scope="scope">
                    <el-progress :percentage="scope.row.qualifiedTotalQuantity?jnpf.numberFormat(jnpf.math('divide', [scope.row.qualifiedTotalQuantity, scope.row.productionQuantity])*100, 2):0"></el-progress>
                  </template>
                </el-table-column>
              </JNPF-table>
     
              <pagination :total="workTotal" :page.sync="workForm.pageNum" :limit.sync="workForm.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryWorkVisible" ref="SuperQuery" :columnOptions="superQueryWork" @superQuery="superQuerySearchWork" @close="superQueryWorkVisible = false" />
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
  name: 'workReport',
  components: { SuperQuery,ExportForm },

  mixins: [getProjectList],
  data() {
    return {




      workForm:{},
      superWorkForm: {},
      workTotal:0,
      workData:[],
      workFormList:{
        orderDate: "",
        productName: "",
        processName: "",
        orderNo: "",
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
      searchList3:[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '工单单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryInbound: [
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
          prop: 'orderNo',
          label: "工单单号",
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
          prop: 'maunit',
          label: "单位",
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
      ],
      superQueryWorkVisible: false,




 
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
    this.superWorkForm=this.workForm = JSON.parse(JSON.stringify(this.workFormList))
   this.search()
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
  
    columnSetFunWork(){
      this.$refs['dataTableWork'].showDrawer()
    },
   
 
      superQuerySearchWork(query) {
      this.superWorkForm = query
      this.superQueryWorkVisible = false
      this.search()
    },

    handleClick(e) {
      this.activeName = e.name
      // this.reset()
    },
    //排序
    sortChange({ prop, order }) {
      let newProp;
        if (prop === 'partnerCode' || prop === 'partnerName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.workForm.orderItems[0].asc = order !== "descending"
        this.workForm.orderItems[0].column = order === null ? "" : newProp
    
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    initData() {
      this.listLoading = true
         produceWorkOrderReport(this.workForm).then(res => {
          this.workData = res.data.records
          this.workTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
    }, 
  
    search(type) {
   
        Object.keys(this.workForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.workForm[key]
          this.workForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.workForm.pageNum = 1 // 重置页码
         if (type === 'basic') {
          this.superWorkForm.superQuery  = {
            matchLogic: 'AND',
            condition: this.searchList3
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
          this.superWorkForm.superQuery = this.superQuery
      } 
      
    
      this.initData()
    },
    reset() {
    
        this.$refs['dataTableWork'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
     
        this.superWorkForm= this.workForm = JSON.parse(JSON.stringify(this.workFormList))
          this.searchList3=[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '工单单号', symbol: 'like', searchType: 1, width: 120 },
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
   
       if(this.reportCode=='1252'){
        targetListQuery=this.workForm
        exportName='当日工单进度'
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

