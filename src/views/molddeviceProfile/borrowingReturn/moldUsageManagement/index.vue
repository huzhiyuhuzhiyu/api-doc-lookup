<script>
import {
  confirmedEquRequisitionRecords,
  equRequisitionRecordsPage
} from "@/api/dailyManagement/Maintenance";

export default {
  name: 'moldUsageManagement',
  data() {
    return {
      basicQuery: {},
      superQuery: {},
      initListQuery: {
        equipmentType: 'mold',
        maintainerIdText: '',
        requisitionType: '',
        orderNo: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {},
      total: 0,
      searchList: [
        {
          fieldValue: '',
          field: 'orderNo',
          label: '单号',
          prop: 'orderNo',
          symbol: 'like',
          searchType: 'input'
        },
        {
          fieldValue: '',
          field: 'maintainerIdText',
          label: '操作人',
          prop: 'maintainerIdText',
          symbol: 'like',
          searchType: 'input'
        },
        {
          fieldValue: '',
          field: 'requisitionType',
          label: '操作类型',
          prop: 'requisitionType',
          symbol: '=',
          options: this.global.requisitionType,
          searchType: 'select'
        }
      ],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'requisitionType',
          label: '操作类型',
          options: this.global.requisitionType,
          type: 'select'
        }
      ],
      tableData: [],
      listLoading: true,
      columnList: [],
      // 列配置（JSON 格式）
      columnsJson: [
        {prop: 'orderNo', label: '单号', minWidth: 220, sortable: 'custom'},
        {prop: 'equipmentIdName', label: '模具名称', minWidth: 120, sortable: 'custom'},
        {prop: 'equipmentIdCode', label: '模具编码', minWidth: 120, sortable: 'custom'},
        {prop: 'maintainerIdText', label: '操作人', minWidth: 100, sortable: 'custom'},
        {prop: 'collectionTime', label: '操作日期', minWidth: 120, sortable: 'custom'},
        {prop: 'requisitionType', label: '操作类型', minWidth: 140, sortable: 'custom', dict: "requisitionType"},
        {prop: 'status', label: '模具确认状态', minWidth: 160, sortable: 'custom', dict: "confirmStatus"},
        {prop: 'documentStatus', label: '单据状态', minWidth: 120, sortable: 'custom', dict: "documentStatusList"},
        {prop: 'approvalStatus', label: '审批状态', minWidth: 120, sortable: 'custom', dict: "approvalStateList"},
        {prop: 'remark', label: '备注', minWidth: 120, sortable: 'custom'},
        {prop: 'createTime', label: '创建时间', minWidth: 180, sortable: 'custom'},
        {prop: 'createByName', label: '创建人', minWidth: 120, sortable: false},
      ],
    }
  },
  computed: {
    // 是否可以确认收 | 发 模具
    canConfirmCollectMold() {
      return function (row) {
        // 收模具操作：requisitionType为'back'且status为'confirmed'时可操作
        const canReceive = row.requisitionType === 'back' && row.status === 'no_confirmed';

        // 发模具操作：requisitionType为'requisition'且status为'confirmed'时可操作
        const canIssue = row.requisitionType === 'requisition' && row.status === 'no_confirmed';

        return {
          confirmPut: canReceive,  // 确认收模具
          confirmHair: canIssue    // 确认发模具
        };
      }
    },
  },
  async created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      equRequisitionRecordsPage(this.listQuery)
          .then((res) => {
            this.total = res.data.total
            this.tableData = res.data.records
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
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
    handleColumnClick(row, type) {
      switch (type) {
        case 'confirmHair':
        case 'confirmPut':
          this.handleConfirm(row.requisitionRecordsId, type)
          break;
        default:
      }
    },
    async handleConfirm(id, type) {
      try {
        const confirmMsg = type === 'confirmPut' ? '收' : '发'
        const confirm = await this.$confirm(
            `确定要执行确认${confirmMsg}模具操作吗？`,
            `确认${confirmMsg}模具`,
            {
              type: 'warning',
              confirmButtonText: `确认${confirmMsg}模具`,
              cancelButtonText: '取消'
            }
        )

        if (!confirm) return
        const res = await confirmedEquRequisitionRecords(id)
        const {code, msg} = res

        if (code === 200) {
          this.$message.success(`操作成功`)
        } else {
          this.$message.error('操作失败')
        }
        this.initData()
      } catch (error) {
      }
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
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
          <template v-for="item in searchList">
            <el-col :span="4" :key="item.prop">
              <el-form-item>
                <el-input v-if="item.searchType === 'input'" v-model="item.fieldValue"
                    :placeholder="'请输入' + item.label"
                    clearable @keyup.enter.native="search('basic')"/>
                <el-select v-else-if="item.searchType === 'select'" v-model="item.fieldValue"
                    @change="search('basic')"
                    :placeholder="'请选择' + item.label"
                    clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2"
                      :label="item2.label"
                      :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 'date'" v-model="item.fieldValue"
                    :type="item.type" :value-format="item.valueFormat"
                    :placeholder="'请选择' + item.label"
                    clearable @keyup.enter.native="search('basic')"/>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search"
                  @click="search('basic')">{{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div>
            <TableDataExportButton tableRef="dataTable" :listQuery="listQuery" exportType="1094"
                exportName="模具领用单"/>
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
            v-loading="listLoading"
            :data="tableData" :row-key="'id'" fixedNO
            :setColumnDisplayList="columnList"
            @sort-change="sortChange"
            ref="dataTable"
            custom-column>
          <el-table-column
              v-for="column in columnsJson"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth"
              :sortable="column.sortable"
          >
            <template slot-scope="scope">
                                    <span v-if="column.dict">
                                        <el-tag
                                            :type="global.getDictLabelGlobal(column.dict, scope.row[column.prop], { withType: true }).type">{{
                                            global.getDictLabelGlobal(column.dict, scope.row[column.prop])
                                          }}</el-tag>
                                    </span>
              <span v-else>{{ scope.row[column.prop] || '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="{ row }">
              <el-button :disabled="!canConfirmCollectMold(row).confirmHair" size="mini" type="text"
                  @click="handleColumnClick(row, 'confirmHair')">
                确认发模具
              </el-button>
              <el-button :disabled="!canConfirmCollectMold(row).confirmPut" size="mini" type="text"
                  @click="handleColumnClick(row, 'confirmPut')">
                确认收模具
              </el-button>
            </template>
          </el-table-column>
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
