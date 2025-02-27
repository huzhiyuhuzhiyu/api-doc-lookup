<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>

            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="reportDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                  :picker-options="pickerOptions" start-placeholder="报工开始日期" end-placeholder="报工结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <template v-for="item in searchList">
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
              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTable')">
                导出
              </el-button>


            </div>
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
          <JNPF-table ref="dataTable"  :data="tableData" :fixedNO="true"  v-if="isProjectSwitchFlag"
            header-cell-class-name="all-select" @sort-change="sortChange" custom-column
            :setColumnDisplayList="columnList">
            <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="220" sortable="custom" />
            <el-table-column prop="workNo" label="工单单号" min-width="220" sortable="custom"></el-table-column>
            <el-table-column prop="orderNo" label="报工单号" min-width="220" sortable="custom"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
            <el-table-column prop="productCategoryName" label="产品分类" min-width="120" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" width="160" sortable="custom" />
            <el-table-column prop="reportingTime" label="报工时间" min-width="180" sortable="custom" />
            <el-table-column prop="producerName" label="生产人" min-width="120" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="80" />
            <el-table-column prop="reportingQuantity" label="报工数量" min-width="120" sortable="custom" />
            <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="120" sortable="custom" />
            <el-table-column prop="responsibilityWasteQuantity" label="责废数量" min-width="120" sortable="custom" />
            <el-table-column prop="materialWasteQuantity" label="料废数量" min-width="120" sortable="custom" />
            <el-table-column prop="reworkQuantity" label="返工数量" min-width="120" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom" />
            <el-table-column prop="oil" label="注脂方式" min-width="120" sortable="custom" />
            <el-table-column prop="sealingcoverTyping" label="打字内容" min-width="120" sortable="custom" />
            <el-table-column prop="orderStatus" label="任务状态" min-width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.orderStatus == 'finish'"><el-tag type="success">已完成</el-tag></div>
                <div v-else-if="scope.row.orderStatus == 'normal'"><el-tag>进行中</el-tag></div>
                <div v-else-if="scope.row.orderStatus == 'closed'"><el-tag type="danger">已关闭</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column label="操作" width="100" fixed="right">

              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="withdrawFun(scope.row)"  :disabled="scope.row.orderStatus!='normal'">撤回</el-button>

              </template>
            </el-table-column>

          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" >
            <span style="font-weight:500;margin-right:10px">报工数量总计：{{ totalData.reportingQuantity }}</span>
          </pagination>
        </div>
      </div>

    </div>

    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getWorkReportList, revokeReport } from "@/api/productOrdes/index.js"
import ExportForm from '@/components/no_mount/ExportBox/index'

import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { getSalaryDetailList} from '@/api/salaryManagement'
export default {
  name: 'assemblyplanManagement',
  components: { SuperQuery, ExportForm },
  mixins: [getProjectList],
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'productionOrderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'producerName', fieldValue: '', label: '生产人', symbol: 'like', searchType: 1, width: 120 },
      ], 
      columnList: ["productsCode",],

      superQueryVisible: false,
      exportFormVisible: false,

      btnLoading: false,
      reportDate: [],
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,

      orderForm: {},
      orderFormlist: {
        orderNo: "",
        processName: "",
        productsDrawingNo: "",
        reportingType:'normal',  // 报工类型 正常报工
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
      },


      totalData:{},
      total: 0,
      formVisible: false,
      selectArr: [],

      superQueryJson: [
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
          prop: 'productsCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'productCategoryName',
          label: "产品分类",
          type: 'input'
        },
        {
          prop: 'processName',
          label: "工序名称",
          type: 'input'
        },
        {
          prop: 'reportingTime',
          label: '报工时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
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
         


        {
          prop: 'vibrationLevel',
          label: "振动等级",
          type: 'select',
          options: []
        },




        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },

      ],
      requestArr: [
        {
          prop: "vibrationLevel",
          typeCode: "pa005"
        },
        {
          prop: "sealingcoverTyping",
          typeCode: "pa007"
        },
        {
          prop: "oil",
          typeCode: "pa002"
        },
        {
          prop: "packagingMethod",
          typeCode: "pa015"
        },
        
      ],
      isProjectSwitchFlag: false,
      isProjectSwitch: '',
    }
  },
  
  computed: {
    ...mapGetters(['userInfo'])
  },

  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(3, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  },
  mounted() {
    this.getProductClassFun()
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
    },
    // 撤回
    withdrawFun(data) {
      this.$confirm("您确定撤回该报工数据吗?", "提示", {
        type: 'warning'
      }).then(() => {
        revokeReport(data.id).then(res => {
          this.$message.success("撤回成功")
          this.initData()
        })
      }).catch(() => {

      })

    },

    // 获取打字内容等
    getProductClassFun() {
      this.requestArr.forEach((item, index) => {
        let obj1 = {
          pageNum: -1,
          pageSize: 20,
          typeCode: item.typeCode,
          orderItems: [
            {
              asc: false,
              column: "",
            },
            {
              asc: false,
              column: "code",
            },
          ],
        };
        getbimProductAttributesList(obj1).then(res => {

          let arr = []
          res.data.records.forEach(items => {
            let obj = {
              label: items.name,
              value: items.name,
            }
            arr.push(obj)
          });
          let oilObj = this.superQueryJson.find(rs => rs.prop === item.prop);
          if (oilObj) {
            // 将options赋值为5  
            oilObj.options = JSON.parse(JSON.stringify(arr));
          }
        })
      })




    },

    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },






    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode'||prop=='projectName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'workNo' || prop == 'productDrawingNo' || prop == 'productionOrderNo' || prop == 'productCode'
        || prop == 'productCategoryName' || prop == 'processName' || prop == 'producerName'
      ) {
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


    initData() {
      this.listLoading = true

      if (this.reportDate && this.reportDate.length) {
        this.orderForm.reportStartDate = this.reportDate[0]
        this.orderForm.reportEndDate = this.reportDate[1]
      } else {
        this.orderForm.reportStartDate = ""
        this.orderForm.reportEndDate = ""
      }
     this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
     getSalaryDetailList(this.orderForm).then(res => {
        console.log("报工记录", res);
        // res.data.records.forEach(item => {
        //   item.selectFlag = false
        // })
        this.tableData = res.data.page.records
        this.total = res.data.page.total
        this.totalData = res.data.total ? res.data.total : {}
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
        this.orderForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.orderForm.superQuery = this.superQuery
      }
      this.orderForm.pageNum = 1 // 重置页码

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

      this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))

      this.searchList=[
        { field: 'productionOrderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'producerName', fieldValue: '', label: '生产人', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.$refs.SuperQuery.conditionList = []
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
        exportType: "1020",
        exportName: '报工记录',
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
