<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="item in searchList">
              <el-col :span="4" :key="item.prop">
                <el-form-item>
                  <el-input v-if="item.searchType === 'input'"
                    v-model="dataForm[item.prop]"
                    :placeholder="'请输入' + item.label"
                    clearable @keyup.enter.native="search()"/>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="handleAction('', 'add')"/>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon"
                  :underline="false" @click="superQueryVisible = true"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon"
                  :underline="false" @click="columnSetFun()"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
                  :underline="false" @click="initData()"/>
              </el-tooltip>
            </div>
          </div>

          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData"
            @sort-change="sortChange" custom-column fixedNO :customKey="tableKey">
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
                  <template v-else-if="column.dictType">
                   <span>
                <el-tag :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">{{
                    global.getDictLabelGlobal(column.dictType, scope.row[column.prop])
                  }}</el-tag>
                   </span>
                  </template>
                </template>
              </el-table-column>
            </template>
            <el-table-column label="操作" width="180" fixed="right">
              <template v-slot="{row}">
                <el-button size="mini" type="text"
                  :disabled="row.documentStatus !== 'draft'"
                  @click="handleAction(row.id, 'edit')">
                  编辑
                </el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  :disabled="row.documentStatus !== 'draft'"
                  @click="handleDelete(row.id)">
                  删除
                </el-button>
                <el-dropdown hide-on-click>
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu>
                    <template v-if="showAppCodeFlag">
                      <el-dropdown-item v-if="['rebut','withdrawn'].includes(row.approvalStatus)"
                        @click.native="handleAction(row.id, 'add')">
                        重新提交
                      </el-dropdown-item>
                      <el-dropdown-item v-if="row.approvalStatus === 'ing'"
                        @click.native="withdrawnHandle(row.id)">
                        审批撤回
                      </el-dropdown-item>
                    </template>
                    <el-dropdown-item @click.native="handleAction(row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>

          <pagination :total="total" :page.sync="dataForm.pageNum"
            :limit.sync="dataForm.pageSize" @pagination="initData"/>
        </div>


      </div>
    </div>
    <SuperQuery :show="superQueryVisible" table-ref="dataTable"
      ref="SuperQuery" :columnOptions="superQueryConfig"
      partentOrChild="listDocumentsSuperQuery"
      @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
    <Form :abnormalOrderFlag="false" v-if="formVisible"
      ref="Form" @refreshDataList="initData" @close="closeForm"/>
  </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import {deleteOrdersChange, getOrdersChangeList} from '@/api/salesManagement/orderChanges'
import Form from '@/views/salesManagement/orderManagement/orderChanges/Form.vue'
import {withdrawn} from '@/api/basicData/approvalAdministrator'

export default {
  name: 'orderChanges',
  components: {Form, SuperQuery},
  data() {
    return {
      tableKey: 'JNPFTableKey_717393',
      showAppCodeFlag: true,
      formVisible: false,
      superQueryVisible: false,
      listLoading: false,
      tableData: [],
      total: 0,

      // 搜索表单配置
      searchList: [
        {prop: 'orderNo', label: '变更单号', searchType: 'input'},
        {prop: 'partnerName', label: '客户名称', searchType: 'input'}
      ],

      // 表格列配置
      columnsConfig: [
        {prop: 'orderNo', label: '变更单号', minWidth: 200, sortable: 'custom', slot: true},
        {prop: 'ordersNo', label: '订单号', minWidth: 200, sortable: 'custom'},
        {prop: 'cooperativePartnerName', label: '客户名称', minWidth: 250},
        {prop: 'applyReason', label: '申请理由', minWidth: 120},
        {prop: 'reasonRejection', label: '驳回理由', minWidth: 120},
        {prop: 'approvalCompletionDate', label: '审批完成时间', minWidth: 180},
        {prop: 'createTime', label: '创建时间', minWidth: 180, sortable: 'custom'},
        {prop: 'createByName', label: '创建人', minWidth: 100},
        {prop: 'remark', label: '备注', minWidth: 150},
        {
          prop: 'documentStatus',
          label: '单据状态',
          minWidth: 120,
          fixed: 'right',
          align: 'center',
          sortable: 'custom',
          slot: true,
          dictType: 'documentStatusList',
        },
        {
          prop: 'approvalStatus',
          label: '审批状态',
          minWidth: 120,
          fixed: 'right',
          align: 'center',
          sortable: 'custom',
          slot: true,
          dictType: 'approvalStateList',
          show: () => this.showAppCodeFlag
        }
      ],

      // 高级查询配置
      superQueryConfig: [],

      // 查询参数
      initDataFormQuery: {
        orderNo: "",
        partnerName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {asc: false, column: ""},
          {asc: false, column: "create_time"}
        ],
        abnormalOrderFlag: false
      },
      dataForm: {}
    }
  },
  async created() {
    this.dataForm = JSON.parse(JSON.stringify(this.initDataFormQuery))
    await this.$store.dispatch('base/getBusinessConfig', 'gobal')
    const res = await this.jnpf.getBusInfo('b021')
    this.showAppCodeFlag = (res && res.enabledMark) || false
    await this.initData()
    await this.$refs.dataTable.doLayout()
  },
  methods: {
    async initData() {
      this.listLoading = true
      try {
        const res = await getOrdersChangeList(this.dataForm)
        this.tableData = res.data.records
        this.total = res.data.total
      } finally {
        this.listLoading = false
      }
    },

    search() {
      this.initData()
    },

    reset() {
      this.$refs.dataTable.$refs.JNPFTable.clearSort()
      this.dataForm = JSON.parse(JSON.stringify(this.initDataFormQuery))
      this.search()
    },

    superQuerySearch(query) {
      this.dataForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },

    sortChange({prop, order}) {
      const newProp = ["ordersNo", "partnerCode", "cooperativePartnerName", "shipperName",
        "createByName", "productName", "productDrawingNo"].includes(prop)
        ? prop
        : prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase())

      this.dataForm.orderItems[0] = {
        asc: order === 'ascending',
        column: order ? newProp : ''
      }
      this.search()
    },

    // 通用操作处理
    handleAction(id, actionType) {
      if (actionType === 'delete') {
        this.handleDelete(id)
        return
      }

      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, actionType)
      })
    },

    async handleDelete(id) {
      try {
        await this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
          type: 'warning'
        })
        await deleteOrdersChange(id)
        this.$message.success("删除成功")
        await this.initData()
      } catch (error) {
        console.log('取消删除', error)
      }
    },

    async withdrawnHandle(formId) {
      try {
        await this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
          type: 'warning'
        })
        await withdrawn({formId})
        this.$message.success("撤回成功")
        await this.initData()
      } catch (error) {
        console.log('取消撤回', error)
      }
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    closeForm(isRefresh = true) {
      this.formVisible = false
      if (isRefresh) this.initData()
    }
  }
}
</script>
