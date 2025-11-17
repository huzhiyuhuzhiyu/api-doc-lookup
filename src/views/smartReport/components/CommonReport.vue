<!--
config: {
  // 合计行
    summaryConfig: {
      showSummary: true, // 控制是否显示汇总行
      summaryColumns: {
        'qualified': 'qualifiedQuantity',
        'defect': 'unqualifiedQuantity'
      },
    },
  // 动态表头配置
  dynamicHeaders: {
    enable: true, 是否启用动态表头
    config: {
      // 左侧固定列配置
      leftFields: [
        {
          prop: 'workshopName',
          label: '车间名称',
          sortable: 'custom'
        }
      ],

      // 动态列配置
      dynamicColumns: [
        {
          type: 'chinese',  // chinese模式：中文关键词匹配  exact模式：精确字段名匹配
          minWidth: 120,
          children: [  // 可选子列配置 children为空则匹配 " 测试A：0 " 类型
              { prop: 'qualifiedQuantity', label: '合格数' },
              { prop: 'unqualifiedQuantity', label: '不良数' }
            ]
          },
      ],

      // 日期列特殊配置
        dateColumns: {
           mergeParent: true, // 是否合并日期父列
           children: [ // 子列配置
              {prop: 'qualifiedQuantity', label: '合格数', minWidth: 100},
              {prop: 'unqualifiedQuantity', label: '不合格数', minWidth: 100}
            ],
           datePattern: /^\d{4}-\d{2}-\d{2}$/, // 周 匹配 YYYY-MM-dd 格式  -  月 匹配 YYYY-MM 格式
           dateFormatter: date => date.replace(/-/g, '/') // 可选
          }
        }
  },

  // 数据获取配置
  fetchApi: getProductionData,

  // 初始化查询参数
  initQuery: {
    reporting: '',
    input: '',
    pageNum: 1,
    pageSize: 20,
  },

  // 搜索栏配置
  searchConfig: [
    {
      label: '选择周',
      prop: 'reporting',
      searchType: 'date',
      type: 'week',
      format: "yyyy 第 WW 周",
    },
     {
        label: '输入',
        prop: 'input',
        searchType: 'input',
      }
  ],

  // 导出配置
  exportConfig: {
    enable: true,
    type: 'PROD_REPORT',
    name: '生产报表_' + moment().format('YYYYMMDD'),
    exportHidden: true,
    fetchApi: null,
  },
}
-->
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <!-- 搜索区域 -->
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable"/>
      <!-- 表格区域 -->
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <TableDataExportButton
              v-if="exportConfig.enable"
              tableRef="dataTable"
              :listQuery="listQuery"
              :exportMethod="exportConfig.fetchApi"
              :exportType="exportConfig.type"
              :exportName="exportConfig.name"
              :exportHidden="exportConfig.exportHidden"
              :exportLabelShow="exportConfig.exportLabelShow"
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
          :queryJson="superQueryJson"
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
        // 行key字段名
        rowKey: {
          type: String,
          default: 'id'
        },
        // 是否使用动态表头
        dynamicHeaders: {
          // datePattern: /^\d{4}-\d{2}$/, // 匹配 YYYY-MM 格式 /^\d{4}-\d{2}-\d{2}$/ 匹配 YYYY-MM-dd 格式
          type: Object,
          default: () => ({
            enable: false,
          })
        },
        // 初始查询参数
        initQuery: {
          type: Object,
          default: () => ({
            orderItems: [
              {
                asc: false,
                column: ''
              }
            ],
            pageNum: 1,
            pageSize: 20
          })
        },
        // 搜索条件配置
        searchConfig: {
          type: Array,
          default: () => []
        },
        // 表头配置
        columnsConfig: {
          type: Array,
          default: () => []
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
        // 数据接口
        fetchApi: {
          type: Function,
          required: true
        }
      })
    },
    systemSearchView: {
      type: Array,
      default: []
    },
    superQueryJson: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      listQuery: deepClone(this.config.initQuery),
      searchList: deepClone(this.config.searchConfig),
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
    columnsConfig() {
      return this.config.columnsConfig || [];
    },
    exportConfig() {
      return this.config.exportConfig || { enable: false };
    },
    superQueryConfig() {
      return this.config.superQueryConfig || { enable: false };
    },
    dynamicHeaders() {
      return this.config.dynamicHeaders || {};
    },
    summaryConfig() {
      return this.config.summaryConfig || {};
    },
  },
  methods: {
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery
      if (!this.listQuery.pageSize) return this.$message.error('请先等待视图加载完成！');
      await dynamicHeaderUtils.initData(this, this.dynamicHeaders);
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
