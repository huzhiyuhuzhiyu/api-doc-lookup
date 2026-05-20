<template>
  <div class="JNPF-common-layout">
    <div v-if="!establishVisible" class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent @keyup.enter.native="search">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.quotationNo" placeholder="询价单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerId" placeholder="客户编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.bidder" placeholder="业务员" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts :add-text="'新建'" @add="handleCreate" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link
                icon="icon-ym icon-ym-shezhi JNPF-common-head-icon"
                :underline="false"
                @click="columnSetFun"
              />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link
                icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
                :underline="false"
                @click="initData"
              />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table
          ref="dataTable"
          v-loading="loading"
          custom-key="awaitQuoteTable"
          :data="tableData"
          has-c
          fixed-n-o
          custom-column
          :row-key="'id'"
          @selection-change="selectedRow = $event"
          @sort-change="sortChange"
        >
          <template v-for="column in columnsConfig">
            <el-table-column
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth"
              :sortable="column.sortable"
              :fixed="column.fixed"
              :align="getAlign(column.align)"
            >
              <template v-if="column.slot === 'quotationStatus'" v-slot="scope">
                <el-tag :type="getQuotationStatusTag(scope.row.quotationStatus)">
                  {{ getQuotationStatusText(scope.row.quotationStatus) }}
                </el-tag>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" @click="openEstablish(row)">新建</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>

    <EstablishForm v-if="establishVisible" ref="establishForm" @close="closeForm" />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getQuotationLists } from '@/api/salesManagement/index'
import EstablishForm from '../enquiryManagementPage/establishForm'

export default {
  name: 'AwaitQuote',
  components: {
    EstablishForm
  },
  data() {
    return {
      loading: false,
      establishVisible: false,
      tableData: [],
      selectedRow: [],
      total: 0,
      initListQuery: {
        quotationNo: '',
        cooperativePartnerId: '',
        bidder: '',
        quotationStatus: 'pending_feedback',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        superQuery: {
          condition: [],
          matchLogic: ''
        }
      },
      listQuery: {},
      columnsConfig: [
        {
          prop: 'quotationNo',
          label: '询价单号',
          minWidth: 200,
          align: 'left',
          sortable: 'custom'
        },
        {
          prop: 'cooperativePartnerId',
          label: '客户编号',
          minWidth: 180,
          align: 'left',
          sortable: 'custom'
        },
        {
          prop: 'quotationTime',
          label: '询价日期',
          minWidth: 140,
          sortable: 'custom'
        },
        {
          prop: 'createByName',
          label: '制单人',
          minWidth: 120,
          sortable: 'custom'
        },
        {
          prop: 'bidder',
          label: '业务员',
          minWidth: 120,
          sortable: 'custom'
        },
        {
          prop: 'purchaseUserId',
          label: '采购负责人',
          minWidth: 140,
          sortable: 'custom'
        },
        {
          prop: 'quotationStatus',
          label: '状态',
          minWidth: 120,
          align: 'center',
          slot: 'quotationStatus',
          sortable: 'custom'
        }
      ]
    }
  },
  created() {
    this.listQuery = deepClone(this.initListQuery)
    this.initData()
  },
  activated() {
    if (this.$refs.dataTable) {
      this.$refs.dataTable.doLayout()
    }
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        const res = await getQuotationLists(this.listQuery)
        const { records = [], total = 0 } = res.data || {}
        this.tableData = records
        this.total = total
      } finally {
        this.loading = false
      }
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        const item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      if (this.$refs.dataTable && this.$refs.dataTable.$refs.JNPFTable) {
        this.$refs.dataTable.$refs.JNPFTable.clearSort()
      }
      this.listQuery = deepClone(this.initListQuery)
      this.search()
    },
    sortChange({ prop, order }) {
      const newProp = order === null ? '' : prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = newProp || 'create_time'
      this.initData()
    },
    handleCreate() {
      if (this.selectedRow.length !== 1) {
        this.$message.error('请选择一条待询价单')
        return
      }
      this.openEstablish(this.selectedRow[0])
    },
    openEstablish(row) {
      this.establishVisible = true
      this.$nextTick(() => {
        this.$refs.establishForm.init('', 'add', deepClone(row))
      })
    },
    closeForm(isInitData = true) {
      this.establishVisible = false
      if (!isInitData) return
      this.initData()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    getAlign(align) {
      return align || 'left'
    },
    getQuotationStatusText(status) {
      const statusMap = {
        feedback_received: '已反馈',
        finished: '完成',
        not_submit: '未提交',
        pending_feedback: '待反馈'
      }
      return statusMap[status] || status || '-'
    },
    getQuotationStatusTag(status) {
      const tagMap = {
        finished: 'success',
        not_submit: 'danger',
        pending_feedback: 'warning'
      }
      return tagMap[status] || ''
    }
  }
}
</script>

<style scoped lang="scss"></style>
