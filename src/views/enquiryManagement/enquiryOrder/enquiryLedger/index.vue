<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16" style="margin-bottom: 5px !important;">
        <el-form @submit.native.prevent @keyup.enter.native="search()">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.inquiryNo" placeholder="询价单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker v-model="listQuery.quotationTime" placeholder="询价日期" type="date"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerId" placeholder="客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerIdText" placeholder="客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">查询
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
          </div>
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
        <JNPF-table customKey="hsCodes" v-loading="loading" :data="tableData" :has-c="hasC"
          @selection-change="(val) => selectedRow = val" :row-key="'id'" fixedNO :setColumnDisplayList="columnList"
          @sort-change="sortChange" ref="dataTable" custom-column>
          <template v-for="column in columnsConfig">
            <el-table-column v-if="typeof column.show === 'function' ? column.show() : (column.show !== undefined ? column.show : true)" :key="column.prop"
              :prop="column.prop" :label="column.label" :min-width="column.minWidth" :sortable="column.sortable"
              :fixed="column.fixed" :align="getAlign(column.align)">
              <template v-if="column.slot" v-slot="scope">
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" @click="handleColumnClick(row, 'look')">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery partentOrChild="TransitionApplicationRecordQuery" :show="superQueryVisible" ref="SuperQuery"
      table-ref="dataTable" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
    <Form ref="Form" v-if="visible" @close="close" />
  </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import Form from './Form.vue'
import { deepClone } from "@/utils";
import { getColumns } from "./data";
import { getEnquiryLedgerList } from '@/api/enquiryManagement/enquiryLedger'

export default {
  name: "EnquiryLedger",
  components: {
    SuperQuery,
    Form
  },
  data() {
    return {
      loading: false,
      visible: false,
      tableData: [],
      total: 0,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderType',
          label: "订单类型",
          type: 'select',
          options: this.global.salesOrderType
        },
        {
          prop: 'orderState',
          label: "订单状态",
          type: 'select',
          options: this.global.salesOrderState
        },
      ],
      initListQuery: {
        inquiryNo: '',
        cooperativePartnerIdText: '',
        cooperativePartnerId: '',
        quotationStatus: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        superQuery: {},
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {},
      columnList: [],
      columnsConfig: getColumns(),
      selectedRow: [],
      clientInfoVisible: false,
      clientInfoData: {
        cooperativePartnerIdText: ''
      },
      partnerSearchList: [
        { prop: 'code', label: '客户编码', type: 'input' },
        { prop: 'name', label: '客户名称', type: 'input' },
      ], // 客户搜索条件
      partnerTableItems: [
        { prop: 'name', label: '客户名称', minWidth: '220px', sortable: 'custom' },
        { prop: 'code', label: '客户编码', sortable: 'custom' },
        { prop: 'contacts', label: '联系人', sortable: 'custom' },
        { prop: 'mobilePhone', label: '手机', sortable: 'custom' },
        { prop: 'phone', label: '电话', sortable: 'custom' },
        { prop: 'salespersonIdText', label: '所属销售', sortable: 'custom' },
      ], // 客户列表字段
      partnerRequestObj: {
        code: "",
        name: "",
        taxId: "",
        mobilePhone: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }, // 意向客户列表入参
      lineRowData: {},
      renderTree: false,
      hasC: false
    }
  },
  created() {
    this.listQuery = deepClone(this.initListQuery)
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        const res = await getEnquiryLedgerList(this.listQuery);
        const { total, records } = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },

    handleButtonClick(type) {
      switch (type) {
        case 'add':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', 'add')
          })
          break;
        default:
      }
    },

    handleColumnClick(row, type) {
      switch (type) {
        case 'look':
        case 'edit':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init(row.id, type)
          })
          break;
        default:
      }
    },

    close(isInitData = true) {
      this.visible = false
      this.BindingVisible = false
      if (!isInitData) return
      this.initData()
    },

    sortChange({ prop, order }) {
      let newProp = ''
      if (prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    getAlign(align) {
      return align || 'left'
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = deepClone(this.initListQuery)
      this.search()
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
