<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4" v-for="item in searchList" :key="item.prop">

            <el-form-item>
              <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]" :placeholder="'请输入' + item.label"
                clearable />
              <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                :placeholder="'请选择' + item.label" style="width: 100%;">
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>

              <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery.reconciliationDateArr" type="daterange"
                value-format="yyyy-MM-dd" style="width: 100%;" :start-placeholder="item.label + '开始日期'"
                :end-placeholder="item.label + '结束日期'">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
            @click="visible = true">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <!-- <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle('', 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div> -->

        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO show-summary :summary-method="getSummaries">
          <template v-for="item in tableItems">
            <el-table-column  :key="item.prop" :prop="item.prop" :label="item.label"
              :fixed="item.fixed || false" :min-width="item.minWidth || 120" />
          </template>

          <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                :disabled="Math.abs(scope.row.totalReconciliationAmount) - Math.abs(scope.row.totalPaymentAmount) == 0 ? true : false"
                @click="addOrUpdateHandle(scope.row.id, 'pay')">{{ reconciliationType !== 'receivable' ? '付款' : '收款'
                }}</el-button>
              <el-button size="mini" type="text"
                :disabled="Math.abs(scope.row.totalReconciliationAmount) - Math.abs(scope.row.totalInvoicingAmount) == 0 ? true : false"
                @click="addOrUpdateHandle(scope.row.id, 'make')">{{ reconciliationType !== 'receivable' ? '收票' : '开票'
                }}</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="addOrUpdateHandle(scope.row.id, 'look', scope.row.orderNo)">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <el-dialog :title="'更多查询'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px" append-to-body>
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12" v-for="item in searchListMore" :key="item.prop">
            <el-form-item :label="item.label">
              <el-input v-if="item.type === 'input'" v-model="listQuery[item.prop]" :placeholder="'请输入' + item.label"
                clearable />

              <el-select v-else-if="item.type === 'select'" v-model="listQuery[item.prop]"
                :placeholder="'请选择' + item.label" style="width: 100%;">
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>

              <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery.reconciliationDateArr" type="daterange"
                value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="对账开始日期" end-placeholder="对账结束日期">
              </el-date-picker>

            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
    <makeForm :reconciliationType="reconciliationType" v-if="makeVisibled" ref="makeForm" @close="closeForms" />
    <collectionForm :reconciliationType="reconciliationType" v-if="collectionVisibled" ref="collectionForm"
      @close="closeForms" />
    <depForm :reconciliationType="reconciliationType" :orderNo="orderNo" v-if="depVisibled"
      ref="depForm" @close="closeForms" />
  </div>
</template>

<script>

import collectionForm from './collectionForm.vue'
import makeForm from './makeForm.vue'
import depForm from './depForm.vue'
export default {
  name: 'payment',
  components: { collectionForm, makeForm, depForm },
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
    },
  },
  data() {
    return {
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
      totalList: [],
    }
  },

  created() {
    this.getData()
  },
  methods: {
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
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = this.totalList.map(item => item[column.property] ? Number(item[column.property]) : '');
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          });
          // sums[index] += '';
        } else {
          sums[index] = null;
        }
      });
      return sums;

    },
    initData() {
      this.visible = false
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.totalList = []
      this.jnpf.searchTimeFormat(this.listQuery, 'reconciliationDateArr', 'reconciliationStartDate', 'reconciliationEndDate')
      this.listMethod(this.listQuery).then(res => {
        this.tableData = res.data.page ? res.data.page.records : []
        res.data.total ? this.totalList.push(res.data.total) : ''
        this.total = res.data.page ? res.data.page.total : 0
        this.listLoading = false
      }).catch(() => {
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
    },




  }
}
</script>
<style  scoped>
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

::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
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
}</style>

