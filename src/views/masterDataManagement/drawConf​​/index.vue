<script>
import SuperQuery from '@/components/SuperQuery/index.vue'

export default {
  name: "index",
  components: {
    SuperQuery
  },
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      superQueryVisible: false,
      superQueryJson: [],
      initListQuery: {
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
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {
        value1:'',
      },
      superQuery: {},
      columnList: [],
      columnsConfig: [
        {prop: 'a', label: '客户订单号', minWidth: 120, sortable: 'custom',slot: true},
        {prop: 'b', label: '产品型号', minWidth: 200, sortable: 'custom'},
        {prop: 'c', label: '产品名称', minWidth: 120, sortable: 'custom'},
        {prop: 'd', label: '采购单号', minWidth: 120, sortable: 'custom'},
        {prop: 'e', label: '客户型号', minWidth: 120, sortable: 'custom'},
        {prop: 'f', label: '数量', minWidth: 120, sortable: 'custom'},
        {prop: 'g', label: '客户号', minWidth: 120, sortable: 'custom'},
        {prop: 'q', label: '工厂号', minWidth: 120, sortable: 'custom'},
        {prop: 'w', label: '下单日期', minWidth: 120, sortable: 'custom'},
        {prop: 'e', label: '确认日期', minWidth: 120, sortable: 'custom'},
        {prop: 'r', label: '状态', minWidth: 120, sortable: 'custom', dictType: "approval_state"},
      ],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    initData() {
    },
    sortChange({prop, order}) {
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
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    search(type) {
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList.filter(item => item.fieldValue).map(item => {
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
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.searchList.forEach(item => {
        item.fieldValue = ''
      })
      this.search()
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16" style="margin-bottom: 5px !important;">
        <el-form @submit.native.prevent>
          <el-col :span="12">
            <el-form-item>
              <el-input v-model="listQuery.value1"
                  placeholder="请输入型号/采购单号/客户型号/工厂号"
                  clearable @keyup.enter.native="search('basic')"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search"
                  @click="search('basic')">查询
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
            <TableDataExportButton :disabled="tableData.length <= 0" tableRef="dataTable"
                :listQuery="listQuery" exportType="1018"
                exportName="生产巡检待检工单" :hasMarginLeft="false"/>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="initData()"/>
            </el-tooltip>
          </div>
        </div>
        <JNPF-table partentOrChild="payrollManagement"
            v-loading="loading"
            :data="tableData" :row-key="'id'" fixedNO
            :setColumnDisplayList="columnList"
            @sort-change="sortChange"
            ref="dataTable"
            custom-column>
          <template v-for="column in columnsConfig">
            <el-table-column
                v-if="typeof column.show === 'function' ? column.show() : true"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :min-width="column.minWidth"
                :sortable="column.sortable"
                :fixed="column.fixed"
                :align="column.align"
            >
              <template v-if="column.slot" v-slot="scope">
                <template v-if="column.prop === 'orderNo'">
                  <el-link type="primary" @click.native="handleAction(scope.row.id, 'look')">
                    {{ scope.row.orderNo }}
                  </el-link>
                </template>
                <template v-if="column.dictType">
                   <span>
                <el-tag
                    :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">{{
                    global.getDictLabelGlobal(column.dictType, scope.row[column.prop])
                  }}</el-tag>
                   </span>
                </template>
              </template>
            </el-table-column>
          </template>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData"
        />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery partentOrChild="TransitionApplicationRecordQuery" :show="superQueryVisible" ref="SuperQuery"
        table-ref="dataTable"
        :columnOptions="superQueryJson"
        @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
  </div>
</template>

<style scoped lang="scss">

</style>
