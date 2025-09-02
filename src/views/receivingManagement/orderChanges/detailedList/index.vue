<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <!-- 搜索表单 -->
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="item in searchConfig">
              <el-col
                :span="item.span || 6"
                :key="item.prop"
                v-if="item.show === undefined || item.show()"
              >
                <el-form-item>
                  <el-input
                    v-model="queryParams[item.prop]"
                    :placeholder="'请输入' + item.label"
                    clearable
                    @keyup.enter.native="search"
                  />
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>

        <!-- 表格区域 -->
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="handleAction('', 'add')"/>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top">
                <el-link
                  icon="icon-ym icon-ym-filter JNPF-common-head-icon"
                  :underline="false"
                  @click="superQueryVisible = true"
                />
              </el-tooltip>
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

          <!-- 数据表格 -->
          <JNPF-table
            ref="dataTable"
            v-loading="loading"
            :data="tableData"
            @sort-change="sortChange"
            custom-column
            fixedNO
            customKey="JNPFTableKey_717393"
          >
            <template v-for="column in columnsConfig">
              <el-table-column
                v-if="column.show === undefined || column.show()"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :min-width="column.minWidth"
                :width="column.width"
                :sortable="column.sortable"
                :fixed="column.fixed"
                :align="column.align"
              >
                <template v-if="column.slot" v-slot="scope">
                  <template v-if="column.prop === 'orderNo'">
                    <el-link
                      type="primary"
                      @click.native="handleAction(scope.row.ordersChangeId, 'look')"
                    >
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                  <template v-else-if="column.dictType">
                    <el-tag
                      :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type"
                    >
                      {{ global.getDictLabelGlobal(column.dictType, scope.row[column.prop]) }}
                    </el-tag>
                  </template>
                </template>
              </el-table-column>
            </template>

            <!-- 操作列 -->
            <el-table-column label="操作" width="180" fixed="right">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="text"
                  :disabled="scope.row.documentStatus !== 'draft'"
                  @click="handleAction(scope.row.ordersChangeId, 'edit')"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  class="JNPF-table-delBtn"
                  :disabled="scope.row.documentStatus !== 'draft'"
                  @click="handleDelete(scope.row.ordersChangeId)"
                >
                  删除
                </el-button>
                <el-dropdown hide-on-click>
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu>
                    <el-dropdown-item @click.native="handleAction(scope.row.ordersChangeId, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>

          <!-- 分页 -->
          <pagination
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="initData"
          />
        </div>

        <!-- 高级查询 -->
        <SuperQuery
          :show="superQueryVisible"
          ref="SuperQuery"
          :columnOptions="superQueryConfig"
          table-ref="dataTable"
          @superQuery="superQuerySearch"
          @close="superQueryVisible = false"
        />
      </div>
    </div>

    <!-- 表单弹窗 -->
    <Form
      :classAttribute="classAttribute"
      v-if="formVisible"
      ref="Form"
      @refreshDataList="initData"
      @close="closeForm"
    />
  </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import {deletePurchaseChange, getPurchaseChangeLineList} from '@/api/salesManagement/orderChanges'
import Form from '@/views/receivingManagement/orderChanges/Form.vue'

export default {
  name: 'detailedList',
  components: {Form, SuperQuery},
  props: {
    classAttribute: {
      type: String,
      default: 'other'
    }
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      total: 0,
      loading: false,

      // 弹窗控制
      formVisible: false,
      superQueryVisible: false,

      initQueryParams: {
        approvalStatus: "",
        orderNo: "",
        documentStatus: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {asc: false, column: ""},
          {asc: false, column: "create_time"}
        ],
        classAttribute: this.classAttribute
      },
      // 查询参数
      queryParams: {},

      // 搜索表单配置
      searchConfig: [
        {prop: 'orderNo', label: '变更单号', searchType: 'input'},
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          searchType: 'input',
        },
      ],

      // 表格列配置
      columnsConfig: [
        {
          prop: 'orderNo',
          label: '变更单号',
          minWidth: 200,
          sortable: 'custom',
          slot: true,
        },
        {
          prop: 'ordersNo',
          label: '采购订单号',
          minWidth: 200,
          sortable: 'custom',
        },
        {
          prop: 'cooperativePartnerName',
          label: '供应商名称',
          minWidth: 250,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          minWidth: 140,
        },
        {
          prop: 'productName',
          label: '产品名称',
          minWidth: 120,
        },
        {
          prop: 'productDrawingNo',
          label: () => '品名规格',
          minWidth: 250,
        },

        {
          prop: 'num',
          label: '原数量(主)',
          minWidth: 120,
        },
        {
          prop: 'mainUnit',
          label: '单位(主)',
          minWidth: 120,
        },
        {
          prop: 'assistantNum',
          label: '原数量(副)',
          minWidth: 120,
        },
        {
          prop: 'deputyUnit',
          label: '单位(副)',
          minWidth: 120,
        },
        {
          prop: 'price',
          label: '原单价',
          minWidth: 120,
        },
        {
          prop: 'excludingTaxAmount',
          label: '原金额',
          minWidth: 120,
        },
        {
          prop: 'deliveryDate',
          label: '原交货日期',
          minWidth: 120,
        },
        {
          prop: 'newNum',
          label: '新数量',
          minWidth: 120,
        },
        {
          prop: 'newPrice',
          label: '新单价',
          minWidth: 120,
        },
        {
          prop: 'newExcludingTaxAmount',
          label: '新金额',
          minWidth: 120,
        },
        {
          prop: 'newDeliveryDate',
          label: '新交货日期',
          minWidth: 120,
        },
        {
          prop: 'remark',
          label: '备注',
          minWidth: 150,
        },
        {
          prop: 'createTime',
          label: '创建时间',
          minWidth: 180,
          sortable: 'custom',
        },
        {
          prop: 'createByName',
          label: '创建人',
          minWidth: 100,
        },
        { prop: 'procurePeople', label: '请购人', minWidth: 140 },
        {
          prop: 'documentStatus',
          label: '单据状态',
          minWidth: 120,
          fixed: 'right',
          align: 'center',
          sortable: 'custom',
          slot: true,
          dictType: 'documentStatusList'
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
        }
      ],

      // 高级查询配置
      superQueryConfig: []
    }
  },
  async created() {
    this.queryParams = JSON.parse(JSON.stringify(this.initQueryParams))
    await this.initData()
    await this.$refs.dataTable.doLayout()
  },
  methods: {
    // 初始化数据
    async initData() {
      this.loading = true
      try {
        const res = await getPurchaseChangeLineList(this.queryParams)
        this.tableData = res.data.records
        this.total = res.data.total
      } finally {
        this.loading = false
      }
    },

    // 搜索
    search() {
      this.queryParams.pageNum = 1
      this.initData()
    },

    // 重置
    reset() {
      this.$refs.dataTable.$refs.JNPFTable.clearSort()
      this.queryParams = JSON.parse(JSON.stringify(this.initQueryParams))
      this.search()
    },

    // 高级查询
    superQuerySearch(query) {
      this.queryParams.superQuery = query
      this.superQueryVisible = false
      this.search()
    },

    // 排序
    sortChange({prop, order}) {
      const specialProps = ["purchaseOrderNo", "partnerCode", "cooperativePartnerName",
        "shipperName", "createByName", "productName", "productDrawingNo"]

      const newProp = specialProps.includes(prop)
        ? prop
        : prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase())

      this.queryParams.orderItems[0] = {
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

    // 删除处理
    async handleDelete(id) {
      try {
        await this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
          type: 'warning'
        })
        await deletePurchaseChange(id)
        this.$message.success("删除成功")
        await this.initData()
      } catch (error) {
        console.log('取消删除', error)
      }
    },

    // 列设置
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    // 关闭表单
    closeForm(isRefresh = true) {
      this.formVisible = false
      if (isRefresh) this.initData()
    }
  }
}
</script>
