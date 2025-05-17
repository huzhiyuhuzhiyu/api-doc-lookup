<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
 
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                  <el-col :span="4">
                <el-form-item>
                  <el-date-picker v-model="inboundDate" type="daterange" value-format="yyyy-MM-dd"
                    style="width: 100%;" start-placeholder="请选择单据开始日期" end-placeholder="请选择单据结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
               <template v-for="item in searchList2">
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
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableInbound','1251')"> 导出</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFunInbound()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
            
              <JNPF-table ref="dataTableInbound" v-loading="listLoading" :data="inboundData" :fixedNO="true" @sort-change="sortChange" custom-column>
                <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="productionOrderNo" label="生产任务单号" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="orderNo" label="入库单号" min-width="180" />
                <el-table-column prop="batchNumber" label="批次号" min-width="180" />
                <el-table-column prop="productName" label="产品名称" min-width="120" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="120" />
                <el-table-column prop="num" label="入库数量" min-width="120" />
                <el-table-column prop="warehouseName" label="仓库" min-width="120" />
                <el-table-column prop="shelfSpaceName" label="库位" min-width="120" />
                <el-table-column prop="pairingModeName" label="配对方式" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="oil" label="油脂" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="clearance" label="游隙" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="orderDate" label="单据日期" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="创建人" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="remark" label="备注" width="120" sortable="custom"></el-table-column>
              </JNPF-table>
              <pagination :total="inboundTotal" :page.sync="inboundForm.pageNum" :limit.sync="inboundForm.pageSize" @pagination="initData" />
            </div>
           
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryInboundVisible" ref="SuperQuery" :columnOptions="superQueryInbound" @superQuery="superQuerySearchInbound" @close="superQueryInboundVisible = false" />
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
  name: 'inboundReport',
  components: { SuperQuery,ExportForm },

  mixins: [getProjectList],
  data() {
    return {




      inboundDate:[],
      inboundData:[],
      inboundTotal:0,
      superInboundForm: {},
      inboundForm:{},
      inboundFormList:{
        classAttribute: "finish_product",
        businessType: "inbound_mock_production",
        produceStartDate: "",
        produceEndDate: "",
        productName: "",
        productionOrderNo: "",
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
      searchList2:[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productionOrderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '入库单号', symbol: 'like', searchType: 1, width: 120 },
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
          label: "入库单号",
          type: 'input'
        }, 
        {
          prop: 'batchNumber',
          label: "批次号",
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
          prop: 'warehouseName',
          label: "仓库",
          type: 'input'
        },
        {
          prop: 'warehouseName',
          label: "库位",
          type: 'input'
        },
           {
          prop: 'pairingModeName',
          label: "配对方式",
          type: 'input'
        },
        {
          prop: 'accuracyLevel',
          label: "精度等级",
          type: 'input'
        },

       {
          prop: 'oil',
          label: "油脂",
          type: 'input'
        },
        {
          prop: 'clearance',
          label: "游隙",
          type: 'input'
        },
        {
          prop: 'packagingMethod',
          label: "包装方式",
          type: 'input'
        },
        {
          prop: 'specialRequire',
          label: "特殊要求",
          type: 'input'
        },
         {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
    { 
          prop: 'reportingTime',
          label: '单据日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '创建开始日期',
          endPlaceholder: '创建结束日期',
          pickerOptions: this.global.timePickerOptions
        },
      ],
      superQueryInboundVisible: false,


    

 
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
 
    this.superInboundForm=this.inboundForm = JSON.parse(JSON.stringify(this.inboundFormList))
   
   this.search()
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
   
    columnSetFunInbound(){
      this.$refs['dataTableInbound'].showDrawer()
    },
   
 
       superQuerySearchInbound(query) {
      this.superInboundForm = query
      this.superQueryInboundVisible = false
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
        this.inboundForm.orderItems[0].asc = order !== "descending"
        this.inboundForm.orderItems[0].column = order === null ? "" : newProp
 
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    initData() {
      this.listLoading = true

         produceInboundReport(this.inboundForm).then(res => {
          this.inboundData = res.data.records
          this.inboundTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
    
       
    }, 
  
    search(type) {
    
        if (this.inboundDate && this.inboundDate.length > 0) {
          this.inboundForm.produceStartDate = this.inboundDate[0].replace(/ 0(?!0)/g, " ")
          this.inboundForm.produceEndDate = this.inboundDate[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.inboundForm.produceStartDate = ''
          this.inboundForm.produceEndDate = ''
        }
        Object.keys(this.inboundForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.inboundForm[key]
          this.inboundForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.inboundForm.pageNum = 1 // 重置页码
         if (type === 'basic') {
          this.superInboundForm.superQuery  = {
            matchLogic: 'AND',
            condition: this.searchList2
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
          this.superInboundForm.superQuery = this.superQuery
        }
      
      
    
      this.initData()
    },
    reset() {
        this.$refs['dataTableInbound'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.inboundDate = []
        this.superInboundForm= this.inboundForm = JSON.parse(JSON.stringify(this.inboundFormList)) 
         this.searchList2=[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productionOrderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '入库单号', symbol: 'like', searchType: 1, width: 120 },
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
 
       if(this.reportCode=='1251'){
        targetListQuery=this.inboundForm
        exportName='每日生产入库'
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

