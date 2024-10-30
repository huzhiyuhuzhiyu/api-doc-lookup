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

              <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery[item.prop]" type="daterange"
                value-format="yyyy-MM-dd" style="width: 100%;" clearable
                :start-placeholder="'' + item.placeholder + '开始日期'"
                :end-placeholder="'' + item.placeholder + '结束日期'">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
              <el-button :disabled="tableData.length > 0 ? false : true" type="text" icon="el-icon-download"
                @click="exportForm">导出</el-button>
            </el-form-item>
          </el-col>
          <el-button v-if="searchListMore.length" style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="el-icon-search" @click="visible = true">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <el-page-header @back="$emit('close', true)" :content="showTitle + '明细'" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table :partentOrChild="'child'" ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO
          custom-column show-summary :summary-method="getSummaries">
          <template v-for="item in tableItems">
            <el-table-column v-if="['paymentMethod'].includes(item.prop)" :key="item.prop" :prop="item.prop"
              :label="item.label" :fixed="item.fixed || false" :min-width="item.minWidth || 120">
              <template slot-scope="scope">
                <span v-if="scope.row[item.prop] === 'transfer_accounts'">转账</span>
                <span v-else-if="scope.row[item.prop] === 'draft'">汇票</span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
            <el-table-column v-else :key="item.prop + '_else'" :prop="item.prop" :label="item.label"
              :fixed="item.fixed || false" :min-width="item.minWidth || 120" />
          </template>

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

              <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery[item.prop]" type="daterange"
                value-format="yyyy-MM-dd" style="width: 100%;" clearable
                :start-placeholder="'请选择' + item.placeholder + '开始日期'"
                :end-placeholder="'请选择' + item.placeholder + '结束日期'">
              </el-date-picker>

              <el-date-picker v-else-if="item.type === 'dateTime'" v-model="listQuery[item.prop]" type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" clearable
                :start-placeholder="'请选择' + item.placeholder + '开始时间'"
                :end-placeholder="'请选择' + item.placeholder + '结束时间'" :default-time="['00:00:00', '23:59:59']">
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
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'lineTables',
  components: { ExportForm, },
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
  computed: {
    showTitle() {
      let title = ''
      if (this.lineType === 'currentBillingAmount') {
        let label = this.reconciliationType !== 'receivable' ? '收' : '开'
        title = '本期' + label + '票'
      } else if (this.lineType === 'currentInboundOutboundAmount') {
        let label = this.reconciliationType !== 'receivable' ? '入' : '出'
        title = '本期' + label + '库'
      } else if (this.lineType === 'duePaymentAmount') {
        let label = this.reconciliationType !== 'receivable' ? '付' : '收'
        title = '到期应' + label
      } else if (this.lineType === 'currentActualAmount') {
        let label = this.reconciliationType !== 'receivable' ? '付' : '收'
        title = '本期实' + label
      } else if (this.lineType === 'overduePaymentAmount') {
        let label = this.reconciliationType !== 'receivable' ? '付' : '收'
        title = '逾期应' + label
      }
      return title
    },
  },
  data() {
    return {
      title: '更多查询',
      tableData: [],
      listLoading: false,
      visible: false,
      listQuery: {},
      exportFormVisible: false,
      total: 0,
      formVisible: false,
      cooperativePartnerId: '',
      totalList: [],
      lineType: '',
      totalData: {},
    }
  },

  // created() {
  //   this.getData(this.lineType)
  // },
  methods: {
    getData(type) {
      this.lineType = type
      this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
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
      this.jnpf.searchTimeFormat(this.listQuery, 'invoiceDateArr', 'invoiceStartDate', 'invoiceEndDate')
      this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
      const loadKey = +new Date()
      this.loadKey = loadKey
      this.listMethod({
        ...this.listQuery,
        totalAllRowFlag: true
      }).then(res => {
        if (this.loadKey !== loadKey) return
        if (['currentBillingAmount', 'currentInboundOutboundAmount', 'currentActualAmount'].includes(this.lineType)) {
          this.tableData = res.data.records.slice(0, res.data.records.length - 1)
          this.totalData = res.data.records[res.data.records.length - 1] || {}
          this.total = res.data.total
        } else {
          this.tableData = res.data.page ? res.data.page.records : []
          this.totalData = res.data.total || {}
          res.data.total ? this.totalList.push(res.data.total) : ''
          this.total = res.data.page ? res.data.page.total : 0
        }
        this.listLoading = false
      }).catch(() => {
        if (this.loadKey !== loadKey) return
        this.listLoading = false
      })
    },

    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.getData(this.lineType)
    },

    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    // 总计处理
    getSummaries(param) {
      return param.columns.map((column, index) => {
        if (index === 0) return '总计'
        if (!column.property) return ''
        return this.totalData[column.property]
      })
    },
    download(data) {
      let code = ''
      let exportName = ''
      if (this.lineType === 'currentBillingAmount') {
        code = '1119'
        exportName = '发票记录'
      } else if (this.lineType === 'currentInboundOutboundAmount') {
        code = '1121'
        exportName = '收付款结存出入库明细'
      } else if (this.lineType === 'currentActualAmount') {
        code = '1120'
        exportName = '本期实收付'
      } else if (['duePaymentAmount', 'overduePaymentAmount'].includes(this.lineType)) {
        code = '1063'
        exportName = this.lineType === 'duePaymentAmount' ? '到期应收付' : '逾期收付款'
      }
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.listQuery,
          exportType: code,
          exportName: exportName,
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalAllRowFlag: true,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url, res.data.name)
        }).catch(() => { })
      }
    },
    // 明细列表
    linesTable() {

    },


  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />