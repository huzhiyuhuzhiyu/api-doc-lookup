<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
     <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                   <el-col :span="3" v-if="abProjectSwitchVisible" >
                    <el-form-item>
                      <el-select v-model="productForm.projectId" placeholder="请选择所属项目" style="width: 100%;" filterable>
                        <el-option v-for="item in abProjectList" :key="item.id" :label="item.name"
                          :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                   <el-col :span="3"  >
                    <el-form-item>
                      <el-select v-model="productForm.finishProductFlag" placeholder="是否成品" style="width: 100%;" filterable>
                        <el-option v-for="item in finishProductFlagList" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                <el-form-item>
                  <el-date-picker v-model="productionDate" type="daterange" value-format="yyyy-MM-dd"
                    style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期">
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
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableProduce','1265')"> 导出</el-button>
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

              <JNPF-table ref="dataTableProduce" v-loading="listLoading" :data="produceData" :fixedNO="true" @sort-change="sortChange" custom-column  :setColumnDisplayList="columnList">
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
                <el-table-column prop="processName" label="工序名称" min-width="120"  sortable="custom"/>
                <el-table-column prop="productDrawingNo" label="型号" min-width="120"  sortable="custom"/>
                <el-table-column prop="producerName" label="生产人" min-width="120"  sortable="custom"/>
                <el-table-column prop="mainUnit" label="单位" min-width="100" sortable="custom"></el-table-column>
                <el-table-column prop="sumQuantity" label="产量合计" min-width="140" sortable="custom"></el-table-column>
              </JNPF-table>
              <pagination :total="produceTotal" :page.sync="productForm.pageNum" :limit.sync="productForm.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery  :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
           <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
          </div>
    </div>
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import {throughputReportAPI  } from '@/api/productOrdes/index.js'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import tenantMinix from "@/mixins/generator/TenantMinix"
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
export default {
  name: 'throughputReport',
  components: { SuperQuery,ExportForm },

  mixins: [getProjectList,AbProjectMixin],
  data() {
    return {
        superQuery: {},
      superForm: {},
      basicQuery: {},

      columnList:[],
      productionDate:[],
      produceData:[],
      produceTotal:0,
      superForm: {},
      productForm:{},
      productFormList:{
        startDate: "",
        endDate: "",
        drawingNo: "",
        processName: "",
        producerName: "",
        projectId:"",
        finishProductFlag:false,
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
      finishProductFlagList:[
        {label:"非成品",value:false},
        {label:"成品",value:true},
      ],
      searchList1:[
        { field: 'producerName', fieldValue: '', label: '生产人', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'drawingNo', fieldValue: '', label: '型号', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryProduce: [
        {
          prop: 'orderType',
          label: "任务类型",
          type: 'select',
          options: [
            { label: "正常任务", value: "normal" },
            { label: "返工任务", value: "rework" },
            { label: "新建任务", value: "manually" },
            { label: "翻库任务", value: "flipping" },
            { label: "在制任务", value: "transit" },
            { label: "修磨任务", value: "regrinding" },
          ]
        },
         {
          prop: 'processName',
          label: "工序名称",
          type: 'input'
        },
           {
          prop: 'productDrawingNo',
          label: "型号",
          type: 'input'
        },
        {
          prop: 'producerName',
          label: "生产人",
          type: 'input'
        },
           {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
      ],
      superQueryVisible: false,










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
    await this.getProjectSwitch()
    this.superForm=this.productForm = JSON.parse(JSON.stringify(this.productFormList))

   this.search('basic')
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
        this.productForm.orderItems[0].asc = order !== "descending"
        this.productForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    initData() {
      this.listLoading = true
        throughputReportAPI(this.productForm).then(res => {
          this.produceData = res.data.page.records||[]
          this.produceTotal = res.data.page.total||0
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })


    },

    search(type) {
        if (this.productionDate && this.productionDate.length > 0) {
          this.productForm.startDate = this.productionDate[0].replace(/ 0(?!0)/g, " ")
          this.productForm.endDate = this.productionDate[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.productForm.startDate = ''
          this.productForm.endDate = ''
        }
        Object.keys(this.productForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.productForm[key]
          this.productForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.productForm.pageNum = 1 // 重置页码
        if (type === 'basic') {
          this.basicQuery  = {
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
          this.superForm.superQuery = this.basicQuery
        }
        if (type === 'super') {
          this.superForm.superQuery = this.superQuery
        }



      this.initData()
    },
    reset() {
        this.$refs['dataTableProduce'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.productionDate = []
       this.superForm= this.productForm = JSON.parse(JSON.stringify(this.productFormList))
        this.searchList1=[
             { field: 'producerName', fieldValue: '', label: '生产人', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'drawingNo', fieldValue: '', label: '型号', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.$refs.SuperQuery.conditionList = []

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
      if(this.reportCode=='1265'){
        targetListQuery=this.productForm
        exportName='产量报表'
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

