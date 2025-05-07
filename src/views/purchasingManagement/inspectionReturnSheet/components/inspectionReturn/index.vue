<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4" v-for="item in searchList" :key="item.prop">
            <el-form-item>
              <el-input @keyup.native.enter="search()" v-if="item.type === 'input'" v-model="listQuery[item.prop]"
                :placeholder="'请输入' + item.label" :clearable="item.clearable ? item.clearable : true" />
              <el-select v-else-if="item.type === 'select'" @change="selectChange" v-model="listQuery[item.prop]"
                :placeholder="'请选择' + item.label" style="width: 100%;" :clearable="item.clearable ? item.clearable : true">
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>

              <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery.reconciliationDateArr"
                type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" :start-placeholder="item.label + '开始日期'"
                :end-placeholder="item.label + '结束日期'"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:10px">
          <div>
            <el-button size="mini" type="primary" @click="handleBatch" :disabled="!tableData.length">批量处理</el-button>
            <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click="importForm">导入</el-button>
            <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button> -->
          </div>

          <div class="JNPF-common-head-right">
            <!-- <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip> -->
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-if="tableDataFlag" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          ref="dataTable" hasC @selection-change="currentChange" :setColumnDisplayList="columnList" :checkSelectable="checkSelectable" customKey="JNPFTableKey_279757">
          <template v-for="item in tableItems">
            <el-table-column v-if="item.prop == 'effectiveDate'" :prop="item.prop" :key="item.prop" :label="item.label"
              :fixed="item.fixed || false" :min-width="item.minWidth || 130" align="center" :sortable="item.sortable"
              :formatter="jnpf.tableDateFormatStrDay"></el-table-column>
            <el-table-column v-else-if="item.prop == 'receivingStatus'" :prop="item.prop" :key="item.prop"
              :label="item.label" :fixed="item.fixed || false" :min-width="item.minWidth || 130"
              :sortable="item.sortable">
              <template slot-scope="scope">
                <div v-if="scope.row.receivingStatus == 'not_finished'">
                  <el-tag type="primary">未完成</el-tag>
                </div>
                <div v-else-if="scope.row.receivingStatus == 'finished'">
                  <el-tag type="success">已完成</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label" :fixed="item.fixed || false"
              :min-width="item.minWidth || 130" :sortable="item.sortable" />
          </template>
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="scope.row.receivingStatus ==='finished'"
                @click="addOrUpdateHandle(scope.row, 'look')">处理</el-button>
                <el-button size="mini" type="text"  @click="printFun(scope.row.id, 'look')">打印退货单</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
  </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo } from '@/api/system/printDev'
import { ApprovalStatus, DocumentStatus } from '@/views/esop/fileUpload/workinginstruction/utils/constant';
export default {
  components: { SuperQuery, PrintBrowse, PrintDialog, },
  mixins: [AbProjectMixin],
  props: {
    priceType: {
      type: String,
      required: true
    },
    /* 列表数据请求方法 */
    listMethod: {
      required: true
    },
    /* 设置数据请求方法 */
    batchMethod: {
      required: true
    },
    /* 上传数据请求方法 */
    uploadMethod: {
      required: true
    },
    /* 删除数据请求方法 */
    delMethod: {
      required: true
    },
    /* 列表数据请求体 */
    listRequestObj: {
      type: Object | Function,
      required: true
      /* 
        对象写法：{ code: "", name: "", orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        函数写法：(rowIndex) => {
          let id = this.linesList[rowIndex].id
          return { id, orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        }
      */
    },
    tableItems: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    searchList: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    searchListMore: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    /* 列表数据请求方法 */
    listMethod: {
      required: true
    },

    superQueryJson: {
      type: Array,
      default: () => []
    },
    columnList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      prindId: '',
      formId: '',
      enCode: "",
      printVisible: false,
      printBrowseVisible: false,
      priceTypeName: '',
      importProjectId: '',
      isProjectSwitch: '',
      tableDataFlag: false,
      depVisibled: false,
      uploadVisib: false,
      exportFormVisible: false,
      searchList: [],
      leftFlag: false,
      superQueryVisible: false,
      tableDetailItems: [],
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      listQuery: {},
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      listQuery: {},
      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      attributeLines: [],
      analyseDialog: false,
      btnLoading: false,
      processFlag: false,
      inspectionFlag: false,
      dataForm: {
        pricingType: '',
        effectiveDate: '',
        timePrice: '',
        unitPrice: ''
      },
      selectedData: [],
      basicQuery: {},
      superQuery: {},
      detailTableItems: []
    }
  },
  watch: {
  },
  computed: {
    DocumentStatus() {
      return DocumentStatus
    }
  },
  async created() {
   
   
    this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))

    this.initData()
  },
  methods: {
    checkSelectable(row) {
      return row.receivingStatus == 'not_finished'
        && row.documentStatus === DocumentStatus.SUBMIT
        && row.approvalStatus !== ApprovalStatus.ING
    },
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.printBrowseVisible = true
          this.printVisible = false

          this.printVisible = false
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    printFun(id) {
      this.enCode = 'p008' // 筛选出 businessType 等于 type 的项
      this.formId = id
      this.fullName = "质检退货通知单" // 筛选出 businessType 等于 type 的项
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    closePrint() {
      this.printVisible = false
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp
      if (['productCode', 'productName', 'productDrawingNo', 'productCategoryName','partnerName'].includes(prop)) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
     

      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      this.listMethod(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.tableDataFlag = true

          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
          this.tableDataFlag = true
        })
    },
    selectChange(val) {
      this.initData()
    },
    search(type) {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
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
        this.listQuery.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.listQuery.superQuery = this.superQuery
      }

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
      this.initData()
    },
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.search('basic')
    },
    currentChange(data) {
      this.selectedData = data
    },
    handleBatch() {
      if (!this.selectedData.length) return this.$message.error('请至少选择一条数据处理')
      console.log(this.selectedData,'this.selectedData')
      let idList = this.selectedData.map(item => item.id)
      console.log(idList)
      this.$confirm('此操作将修改数据状态为已处理, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.batchMethod(idList).then(res=>{
            this.$message({
            type: 'success',
            message: '处理成功!'
            })
          })
          this.initData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消处理'
          })      
        })
      this.btnLoading = false
    },
    hasDifferentPricingType(arr) {
      const codes = new Set()

      for (const item of arr) {
        codes.add(item.pricingType)
      }

      return codes.size > 1 // 如果有多个不同的代码，则返回 true
    },
    addOrUpdateHandle(row, type) {
      let idList = [row.id]
      this.$confirm('此操作将修改数据状态为已处理, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.batchMethod(idList).then(res=>{
            this.$message({
            type: 'success',
            message: '处理成功!'
            })
          })
          this.initData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消处理'
          })      
        })
      this.btnLoading = false
    },
  }
}
</script>
<style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
