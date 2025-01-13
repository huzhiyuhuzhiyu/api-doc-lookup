<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4" v-for="item in searchList" :key="item.prop">
            <el-form-item>
              <el-input @keyup.native.enter="search()"  v-if="item.type === 'input'" v-model="listQuery[item.prop]" :placeholder="'请输入' + item.label"
                clearable />
              <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                :placeholder="'请选择' + item.label" style="width: 100%;">
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
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <!-- <topOpts @add="addOrUpdateHandle('', 'add')" /> -->
          <div></div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO show-summary  custom-column
          :summary-method="getSummaries" :fixedNO="true" @sort-change="sortChange" :setColumnDisplayList="columnList">
          <template v-for="item in tableItems">
            <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" :fixed="item.fixed || false"
              :min-width="item.minWidth || 120" :sortable="item.sortable" />
          </template>

          <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="Math.abs(scope.row.totalReconciliationAmount) - Math.abs(scope.row.totalPaymentAmount) == 0
                  ? true
                  : false
                " @click="addOrUpdateHandle(scope.row.id, 'pay')">
                {{ reconciliationType !== 'receivable' ? '付款' : '收款' }}
              </el-button>
              <!-- <el-button size="mini" type="text"
                :disabled="Math.abs(scope.row.totalReconciliationAmount) - Math.abs(scope.row.totalInvoicingAmount) == 0 ? true : false"
                @click="addOrUpdateHandle(scope.row.id, 'make')">{{ reconciliationType !== 'receivable' ? '收票' : '开票'
                }}</el-button> -->
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id, 'look', scope.row.orderNo)">
                查看详情
              </el-button>
              <!-- <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look', scope.row.orderNo)">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <makeForm :reconciliationType="reconciliationType" v-if="makeVisibled" ref="makeForm" @close="closeForms" />
    <collectionForm :reconciliationType="reconciliationType" v-if="collectionVisibled" ref="collectionForm"
      @close="closeForms" />
    <depForm :reconciliationType="reconciliationType" :orderNo="orderNo" v-if="depVisibled" ref="depForm"
      @close="closeForms" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import collectionForm from './collectionForm.vue'
import makeForm from './makeForm.vue'
import depForm from './depForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  name: 'payment',
  components: { collectionForm, makeForm, depForm, SuperQuery },
  props: {
    reconciliationType: {
      type: String,
      required: true
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
    }
  },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '对账流水号',
          type: 'input'
        },

        {
          prop: 'reconciliationDate',
          label: '对账日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'cooperativePartnerCode',
          label: '客户编码',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '客户名称',
          type: 'input'
        },
        {
          prop: 'includingTaxAmount',
          label: '出入库金额',
          type: 'input'
        },
        {
          prop: 'totalReconciliationAmount',
          label: '应付金额',
          type: 'input'
        },
        {
          prop: 'totalPaymentAmount',
          label: '已收款金额',
          type: 'input'
        },
        {
          prop: 'totalUnpaidAmount',
          label: '未收款金额',
          type: 'input'
        },
        {
          prop: 'totalInvoicingAmount',
          label: '已开票金额',
          type: 'input'
        },
        {
          prop: 'totalNotInvoicedAmount',
          label: '未开票金额',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        }
      ],
      columnList: ['partnerCode', 'createByName'],
      title: '更多查询',
      tableData: [],
      listLoading: false,
      visible: false,
      listQuery: {},
      makeVisibled: false,
      collectionVisibled: false,
      depVisibled: false,

      total: 0,
      formVisible: false,
      orderNo: '',
      totalList: []
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  created() {
    this.getData()
  },
  methods: {
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log('税率', this.taxRateList)
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode' || prop === 'productName' || prop === 'drawNo') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    getData() {
      this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
      this.initData()
    },
    // 关闭 收款新建、编辑页面
    closeForms(isRefresh) {
      this.collectionVisibled = false
      this.makeVisibled = false
      this.depVisibled = false
      if (isRefresh) {
        this.getData()
      }
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    // 合计处理
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = this.totalList.map((item) => (item[column.property] ? Number(item[column.property]) : ''))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          })
          // sums[index] += '';
        } else {
          sums[index] = null
        }
      })
      return sums
    },
    initData() {
      this.visible = false
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.totalList = []
      this.jnpf.searchTimeFormat(
        this.listQuery,
        'reconciliationDateArr',
        'reconciliationStartDate',
        'reconciliationEndDate'
      )
      this.listMethod(this.listQuery)
        .then((res) => {
          this.tableData = res.data.page ? res.data.page.records : []
          res.data.total ? this.totalList.push(res.data.total) : ''
          this.total = res.data.page ? res.data.page.total : 0
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },

    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.getData()
    },

    addOrUpdateHandle(id, type, orderNo) {
      if (type == 'pay') {
        this.collectionVisibled = true
        this.$nextTick(() => {
          this.$refs.collectionForm.init(id, type)
        })
      }
      if (type == 'make') {
        this.makeVisibled = true
        this.$nextTick(() => {
          this.$refs.makeForm.init(id, type)
        })
      }
      if (type == 'look') {
        this.depVisibled = true
        this.orderNo = orderNo
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type, orderNo)
        })
      }
    }
  }
}
</script>
<style scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-head {
  padding: 10px;
}

.JNPF-common-search-box {
  padding-top: 5px;
  padding-bottom: 10px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}

::v-deep.el-range-editor--small.el-input__inner {
  height: 34px;
}

::v-deep.el-table__body-wrapper {
  height: auto !important;
}
</style>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
