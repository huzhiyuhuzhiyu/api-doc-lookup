<script>
import dynamicHeaderUtils from '@/views/smartReport/core/dynamicHeaderUtils';
import { deepClone } from "@/utils";

const RecursiveColumn = {
  name: 'RecursiveColumn',
  functional: true,
  props: {
    column: {
      type: Object,
      required: true
    },
    handleTableAlign: {
      type: Function,
      default: (align) => align || 'center'
    }
  },
  render(h, { props }) {
    const column = props.column;
    const children = column.children || [];

    return column.show !== false ? h('el-table-column', {
      props: {
        prop: column.prop,
        label: column.label,
        minWidth: column.minWidth,
        align: props.handleTableAlign(column.align),
        sortable: column.sortable || false,
        fixed: column.fixed
      }
    }, [
      children.length > 0 ? children.map((child, index) => {
        return h('recursive-column', {
          props: {
            column: child,
            key: index
          }
        });
      }) : null
    ]) : null
  }
};

export default {
  name: 'CommonReport',
  components: { RecursiveColumn },
  props: {
    // 基础配置
    config: {
      type: Object,
      required: true,
      default: () => ({
        // 数据接口
        fetchApi: {
          type: Function,
          required: true
        },
        // 初始查询参数
        initQuery: {
          type: Object,
          default: () => ({})
        },
        // 动态表头配置
        dynamicHeaders: {
          type: Object,
          default: () => ({
            enable: false,
          })
        },
        // 表头配置
        columnsConfig: {
          type: Array,
          default: () => []
        },
        // 高级查询配置
        superQueryConfig: {
          type: Object,
          default: () => ({
            systemSearchView: [],
            superQueryJson: []
          }),
          required: true
        },
        // 汇总行配置
        summaryConfig: {
          type: Object,
          default: () => ({
            showSummary: false
          })
        },
        // 导出配置
        exportConfig: {
          type: Object,
          default: () => ({
            enable: false,
            type: '',
            name: ''
          })
        },
        // 行key字段名
        rowKey: {
          type: String,
          default: 'id'
        }
      })
    },
  },
  data() {
    return {
      listQuery: deepClone(this.config.initQuery),
      total: 0,
      listLoading: true,
      tableData: [],
      apiTotalData: null,
      generatedHeaders: [], // 存储动态表头数据
      cachedHeaders: null // 用于缓存上一次生成的表头
    };
  },
  computed: {
    rowKey() {
      return this.config.rowKey || 'id';
    },
    dynamicHeaders() {
      return this.config.dynamicHeaders || {};
    },
    columnsConfig() {
      return this.config.columnsConfig || [];
    },
    summaryConfig() {
      return this.config.summaryConfig || {};
    },
    exportConfig() {
      return this.config.exportConfig || { enable: false };
    },
    superQueryConfig() {
      return this.config.superQueryConfig || {
        systemSearchView: [],
        superQueryJson: []
      };
    },
  },
  watch: {
    config: {
      handler(newVal) {
        if (newVal) {
          this.listQuery = deepClone(newVal.initQuery || {});
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery.pageSize) {
        this.$message.error('请先等待视图加载完成！');
        return;
      }

      try {
        await dynamicHeaderUtils.initData(this, this.dynamicHeaders);
      } catch ( error ) {
        this.$message.error('数据加载失败');
      }
    },

    getSummaries(param) {
      return dynamicHeaderUtils.getSummaries(param, this);
    },

    handleTableAlign(align) {
      return align || 'left';
    },
  }
};
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <!-- 搜索区域 -->
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="superQueryConfig.systemSearchView" tableRef="dataTable"/>
      <!-- 表格区域 -->
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <TableDataExportButton
              v-if="exportConfig.enable"
              tableRef="dataTable"
              :listQuery="listQuery"
              :exportMethod="exportConfig.fetchApi"
              :exportType="exportConfig.exportType"
              :exportName="exportConfig.exportName"
              :exportHidden="exportConfig.exportHidden"
            />
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
              <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                       @click="$refs.dataTable.showSortDrawer()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="$refs.dataTable.showDrawer()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                       @click="initData()"/>
            </el-tooltip>
          </div>
        </div>

        <JNPF-table
          v-loading="listLoading"
          ref="dataTable"
          customKey="commonReport"
          :data="tableData"
          :row-key="rowKey"
          :show-summary="summaryConfig.showSummary"
          :summary-method="summaryConfig.showSummary ? getSummaries : null"
          @queryChange="initData"
          :queryJson="superQueryConfig.superQueryJson"
          :listQuery="listQuery"
          fixedNO
          custom-column
        >
          <!-- 动态表头渲染 -->
          <template v-if="dynamicHeaders.enable">
            <recursive-column
              v-for="(column, index) in generatedHeaders"
              :key="index"
              :column="column"
              :handleTableAlign="handleTableAlign"
            />
          </template>
          <!-- 静态表头渲染 -->
          <template v-else>
            <template v-for="column in columnsConfig">
              <el-table-column
                v-if="typeof column.show === 'function' ? column.show() : true"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :min-width="column.minWidth"
                :sortable="column.sortable"
                :fixed="column.fixed"
                :align="handleTableAlign(column.align)"
                :formatter="!column.slot && column.formatter"
              >
                <template v-if="column.slot" v-slot="scope">
                  <template v-if="column.dictType">
                    <span>
                      <el-tag
                        :type="scope.row[column.prop] === 'urgent' ? 'danger' : global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">
                        {{ global.getDictLabelGlobal(column.dictType, scope.row[column.prop]) }}
                      </el-tag>
                    </span>
                  </template>
                  <span v-else-if="column.formatter">{{ column.formatter ? column.formatter(scope.row, scope.column, scope.row[column.prop]) : scope.row[column.prop] }}</span>
                  <!-- 特殊渲染 -->
                  <slot :row="scope.row" :column="column"></slot>
                </template>
              </el-table-column>
            </template>
          </template>

          <!-- 避免动态渲染没有数据时的样式问题 -->
          <el-empty v-if="!tableData.length && dynamicHeaders.enable" description="暂无数据"></el-empty>
        </JNPF-table>

        <pagination
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="initData()"/>
      </div>
    </div>
  </div>
</template>
