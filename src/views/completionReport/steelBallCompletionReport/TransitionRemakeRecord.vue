<template>
  <transition name="el-zoom-in-center">
    <div style="height: 100%">
      <div class="JNPF-preview-main">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" :content="title"/>
          <div class="options">
            <el-button @click="goBack()">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center  JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16" style="margin-bottom: 5px !important;">
              <el-form @submit.native.prevent>
                <template v-for="item in searchList">
                  <el-col :span="4" :key="item.prop">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue"
                          :placeholder="'请输入' + item.label"
                          clearable @keyup.enter.native="search('basic')"/>
                      <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue"
                          @change="search('basic')"
                          :placeholder="'请选择' + item.label"
                          clearable>
                        <el-option v-for="(item2, index2) in item.options" :key="index2"
                            :label="item2.label"
                            :value="item2.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </template>
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
                <div></div>
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
              <JNPF-table partentOrChild="TransitionApplicationRecord"
                  v-loading="listLoading"
                  :data="treeList" :row-key="'id'" v-if="refreshTable" fixedNO
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
                    <el-button size="mini" type="text" :disabled="row.documentStatus !== 'draft'"
                        @click="handleColumnClick(row, 'edit')">
                      编辑
                    </el-button>
                    <el-button size="mini" type="text"
                        @click="handleColumnClick(row, 'look')">
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                  @pagination="initData"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 高级查询 -->
      <SuperQuery partentOrChild="TransitionApplicationRecordQuery" :show="superQueryVisible" ref="SuperQuery"
          table-ref="dataTable"
          :columnOptions="superQueryJson"
          @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
      <TransitionRemake ref="TransitionOrderChange" v-if="TransitionOrderChangeVisible"
          :productionOrderId="productionOrderId"
          @close="closeDepForm"></TransitionRemake>
    </div>
  </transition>
</template>

<script>
import {getRemasteredPage} from "@/api/monotonicRemake/monotonicRemake";
import TransitionRemake from "@/views/completionReport/ringCompletionReport/TransitionRemake.vue";

export default {
  components: {TransitionRemake},
  props: {
    productionOrderId: {
      type: String | Number,
      default: null
    },
    title: {
      type: String,
      default: "重制生产申请记录"
    }
  },
  data() {
    return {
      TransitionOrderChangeVisible: false,
      basicQuery: {},
      superQuery: {},
      total: 0,
      searchList: [
        {
          fieldValue: '',
          field: 'applicationReason',
          label: '申请理由',
          prop: 'applicationReason',
          symbol: 'like',
          searchType: 1
        },
      ],
      superQueryVisible: false,
      superQueryJson: [],
      initListQuery: {
        type: 'process',
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
        productionOrderId: this.productionOrderId,
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {},
      treeList: [],
      refreshTable: true,
      listLoading: true,
      depFormVisible: false,
      columnList: [],
      // 列配置（JSON 格式）
      columnsJson: [
        {prop: 'processName', label: '当前工序名称', minWidth: 120, sortable: 'custom'},
        {prop: 'remasteredProcessName', label: '重制工序名称', minWidth: 120, sortable: 'custom'},
        {prop: 'applicationReason', label: '申请理由', minWidth: 120, sortable: 'custom'},
        {prop: 'documentStatus', label: '单据状态', minWidth: 120, sortable: 'custom', dict: "documentStatusList"},
        {prop: 'approvalStatus', label: '审批状态', minWidth: 120, sortable: 'custom', dict: "approvalStateList"},
        {prop: 'createTime', label: '创建时间', minWidth: 120, sortable: 'custom'},
        {prop: 'createByName', label: '创建人', minWidth: 120, sortable: false},
      ],
    }
  },
  async created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    orderChangeRequest(id, type) {
      this.TransitionOrderChangeVisible = true
      this.$nextTick(() => {
        this.$refs.TransitionOrderChange.init(id, type)
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
        case 'look':
        case 'edit':
          this.orderChangeRequest(row.id, type)
          break;
        default:
      }
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    initData() {
      this.listLoading = true
      getRemasteredPage(this.listQuery)
          .then((res) => {
            this.total = res.data.total
            this.treeList = res.data.records
            console.log(this.treeList,'list')
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
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
    closeDepForm(isRefresh = true) {
      this.TransitionOrderChangeVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    goBack() {
      this.$emit('close')
    },
  }
}
</script>

<style lang="scss"></style>
