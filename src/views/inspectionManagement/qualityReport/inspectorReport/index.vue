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
            
              <JNPF-table ref="dataTableInbound" v-loading="listLoading" :data="inboundData"  @sort-change="sortChange" custom-column customKey="JNPFTableKey_8957749">
                <el-table-column prop="inspectorName" label="检验人"  />
                <el-table-column prop="samplingSumQuantity" label="累计检验总数"  />
                <el-table-column prop="unqualifiedSumQuantity" label="累计检验不合格总数"  ></el-table-column>
              </JNPF-table>
              <pagination :total="inboundTotal" :page.sync="inboundForm.pageNum" :limit.sync="inboundForm.pageSize" @pagination="initData" >
                <span>总检验数量：{{ samplingSumQuantity }}</span>
                <span style="margin-left: 10px;">总检验不合格总数{{ unqualifiedSumQuantity }}</span>
              </pagination>
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
import { inspectorReport } from '@/api/inspectionManagement/index.js'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'inspectorReport',
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
        startDate: "",
        endDate: "",
        inspectorName: "",
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
        { field: 'inspectorName', fieldValue: '', label: '检验人', symbol: 'like', searchType: 1, width: 120 },
      ],
      
      superQueryInbound: [
        {
          prop: 'inspectorName',
          label: "检验人",
          type: 'input'
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
    unqualifiedSumQuantity:0,
    samplingSumQuantity:0,
    
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

         inspectorReport(this.inboundForm).then(res => {
            this.inboundData = res.data.page.records||[]
          this.inboundTotal = res.data.page.total||0
          this.listLoading = false
          this.visible = false
          this.samplingSumQuantity=res.data.total?res.data.total.samplingSumQuantity:0
          this.unqualifiedSumQuantity=res.data.total?res.data.total.unqualifiedSumQuantity:0
        }).catch(() => {
          this.listLoading = false
        })
    
       
    }, 
  
    search(type) {
    
        if (this.inboundDate && this.inboundDate.length > 0) {
          this.inboundForm.startDate = this.inboundDate[0].replace(/ 0(?!0)/g, " ")
          this.inboundForm.endDate = this.inboundDate[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.inboundForm.startDate = ''
          this.inboundForm.endDate = ''
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
        { field: 'inspectorName', fieldValue: '', label: '检验人', symbol: 'like', searchType: 1, width: 120 }, 
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
        ...this.inboundForm,
        exportType: '1257',
        exportName: "检验员检验报表",
        includeFieldMap,
        pageSize: data.dataType == 0 ? this.inboundForm.pageSize : -1
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

