<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
 
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                  <el-col :span="4">
                <el-form-item>
                  <el-date-picker v-model="inboundDate" type="daterange" value-format="yyyy-MM-dd"
                    style="width: 100%;" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期">
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
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableInbound')"> 导出</el-button>
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
            
              <JNPF-table ref="dataTableInbound" v-loading="listLoading" :data="tableData"  @sort-change="sortChange" custom-column customKey="JNPFTableKey_7668545512749">
                <el-table-column prop="partnerName" label="客户名称"  ></el-table-column>
                <el-table-column prop="productsName" label="产品名称"  />
            <el-table-column prop="productSourceName" label="产品来源"  ></el-table-column>
                <el-table-column prop="sumNum" label="销售发货数量"  />
                <el-table-column prop="sumAmount" label="销售金额"  ></el-table-column>
                <el-table-column prop="amountPercent" label="销售额占比"   width="200">
                  <template slot-scope="scope">
                    <el-progress :percentage="scope.row.amountPercent || 0"></el-progress>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" >
              <span>总发货数量:{{ totalSumNum }}</span>
              <span style="margin-left: 10px;">总销售金额:{{ totalSumTotalAmount }}</span>
              </pagination>
            </div>
           
            <!-- 高级查询 -->
            <SuperQuery   :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
           <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" /> 
          </div>
 
    </div>
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { saleCustomerReport} from '@/api/salesManagement/assemblyOrders' 
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'supplierQualityReport',
  components: { SuperQuery,ExportForm },

  mixins: [getProjectList],
  data() {
    return {




      inboundDate:[],
      inboundData:[],
      inboundTotal:0,
      superForm: {},
      superQuery: {},
      basicQuery: {},
      orderForm:{},
      inboundFormList:{
        businessType:"outbound_sale_send",
        orderDateStart: "",
        orderDateEnd: "",
        productsName: "",
        partnerName: "",
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
                "column": ""
            }
        ],
        superQuery: {
            matchLogic: "AND",
            condition: []
        }
      }, 
      searchList2:[
        { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ], 
      superQueryJson: [
          {
          prop: 'productsName',
          label: "产品名称",
          type: 'input'
        },
     
           {
          prop: 'partnerName',
          label: "客户名称",
          type: 'input'
        },
      ],
      superQueryVisible: false,
      totalSumTotalAmount:0,
      totalSumNum:0,

    

 
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
 
    this.superForm=this.orderForm = JSON.parse(JSON.stringify(this.inboundFormList))
   
   this.search('basic')
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
   
 
       superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
     
    //排序
    sortChange({ prop, order }) {
      let newProp;
        if (prop === 'partnerCode' || prop === 'partnerName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.orderForm.orderItems[0].asc = order !== "descending"
        this.orderForm.orderItems[0].column = order === null ? "" : newProp
 
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    initData() {
      this.listLoading = true

         saleCustomerReport(this.orderForm).then(res => {
           this.tableData = res.data.page.records||[]
        this.total = res.data.page.total||0
        this.totalSumTotalAmount=res.data.total.sumAmount||0
        this.totalSumNum=res.data.total.sumNum||0
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
    
       
    }, 
  
    search(type) {
    
        if (this.inboundDate && this.inboundDate.length > 0) {
          this.orderForm.orderDateStart = this.inboundDate[0].replace(/ 0(?!0)/g, " ")
          this.orderForm.orderDateEnd = this.inboundDate[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.orderForm.orderDateStart = ''
          this.orderForm.orderDateEnd = ''
        }
        Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.orderForm[key]
          this.orderForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.orderForm.pageNum = 1 // 重置页码
         if (type === 'basic') {
            this.basicQuery = {
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
        this.superForm.superQuery = this.basicQuery
        }
        if (type === 'super') {
          this.superForm.superQuery = this.superQuery
        }
      
      
    
      this.initData()
    },
    reset() {
        this.$refs['dataTableInbound'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.inboundDate = []
        this.superForm= this.orderForm = JSON.parse(JSON.stringify(this.inboundFormList)) 
        this.searchList2=[
              { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },

      ]
  
      this.search('basic')
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
      
      let _data = {
        ...this.orderForm,
        exportType: '1258',
        exportName: "客户销售报表",
        includeFieldMap,
        pageSize: data.dataType == 0 ? this.orderForm.pageSize : -1
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
<style lang="scss" scoped>
::v-deep .el-progress-bar{
  width: 80%;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />

