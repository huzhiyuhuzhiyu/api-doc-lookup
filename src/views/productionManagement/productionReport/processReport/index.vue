<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
               <template v-for="item in searchList4">
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
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableProcess','1253')"> 导出</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFunProcess()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTableProcess" v-loading="listLoading" :data="processData" :fixedNO="true" @sort-change="sortChange" custom-column>
                <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="productName" label="产品名称" min-width="180" />
                <el-table-column prop="productCode" label="产品编码" min-width="180" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" />
                <el-table-column prop="processName" label="工序名称" min-width="180" />
                <el-table-column prop="processCode" label="工序编码" min-width="180" />
                <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="180" />
                <el-table-column prop="warehouseName" label="所属线边仓" min-width="180" />
           
              </JNPF-table>
              <pagination :total="processTotal" :page.sync="processForm.pageNum" :limit.sync="processForm.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryProcessVisible" ref="SuperQuery" :columnOptions="superQueryProcess" @superQuery="superQuerySearchProcess" @close="superQueryProcessVisible = false" />
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
  name: 'processReport',
  components: { SuperQuery,ExportForm },

  mixins: [getProjectList],
  data() {
    return {
 

 

    



      superProcessForm: {},
      processForm:{},
      processData:[],
      processTotal:0,
      processFormList:{
        productName: "",
        processName: "",
        warehouseName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
            {
                "asc": false,
                "column": ""
            },
            {
                "asc": false,
                "column": "productName"
            }
        ],
        superQuery: {
            matchLogic: "AND",
            condition: []
        }
      }, 
      searchList4:[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'warehouseName', fieldValue: '', label: '线边仓名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryProcess: [
         {
          prop: 'projectName',
          label: "所属项目",
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
          prop: 'warehouseName',
          label: "所属线边仓",
          type: 'input'
        },    
      ],
      superQueryProcessVisible: false,
 
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
 
 
    this.superProcessForm=this.processForm = JSON.parse(JSON.stringify(this.processFormList))
   this.search()
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
 
    columnSetFunProcess(){
      this.$refs['dataTableProcess'].showDrawer()
    },
 
      superQuerySearchProcess(query) {
      this.superProcessForm = query
      this.superQueryProcessVisible = false
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
        this.processForm.orderItems[0].asc = order !== "descending"
        this.processForm.orderItems[0].column = order === null ? "" : newProp

      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    initData() {
      this.listLoading = true
   
 
         produceProcessReport(this.processForm).then(res => {
          this.processData = res.data.records
          this.processTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
       
    }, 
  
    search(type) {

        Object.keys(this.processForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.processForm[key]
          this.processForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.processForm.pageNum = 1 // 重置页码
         if (type === 'basic') {
          this.superProcessForm.superQuery  = {
            matchLogic: 'AND',
            condition: this.searchList4
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
          this.superProcessForm.superQuery = this.superQuery
        }
      
    
      this.initData()
    },
    reset() {

        this.$refs['dataTableProcess'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.superProcessForm= this.processForm = JSON.parse(JSON.stringify(this.processFormList))
         this.searchList4=[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'warehouseName', fieldValue: '', label: '线边仓名称', symbol: 'like', searchType: 1, width: 120 },
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
       if(this.reportCode=='1253'){
        targetListQuery=this.processForm
        exportName='工序料合计'
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

