<script>
import { buttonList, getColumns } from "./data";

import quickCreateForm from "../modules/quickCreateForm.vue"
import PrintFlowCard from '../components/PrintFlowCard.vue'
import { getInspectionList } from "@/api/inspectionManagement";
import DetailForm from "@/views/inspectionManagement/components/inspectionFormManagementDetail.vue";

export default {
  name: "index",
  components: {
    DetailForm,
    quickCreateForm,
    PrintFlowCard
  },
  props: {
    productionLineName: {
      type: String,
      default: '大线'
    }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            { prop: 'productionPlanNo', symbol: 'like', fixed: true },
            { prop: 'orderNo', symbol: 'like', fixed: true },
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            },
          ]
        },
      }],
      loading: false,
      visible: false,
      detailFormVisible: false,
      printFlowCardVisible: false,
      quickCreateFormVisible: false,
      quickCreateFormData: {},
      tableData: [],
      total: 0,
      superQueryJson: [
        {
          prop: 'inspectionMethod',
          label: '检验方式',
          type: 'select',
          options: this.global.inspectionMethod
        },
        {
          prop: 'inspectionResults',
          label: '检验结果',
          type: 'select',
          options: this.global.inspectionResultsType
        },
        {
          prop: 'processingStatus',
          label: '处理状态',
          type: 'select',
          options: this.global.processingStatusType
        },
        {
          prop: 'status',
          label: '检验确认状态',
          type: 'select',
          options: this.global.workReportInspection
        },
      ],
      listQuery: {
        productionLineName: this.productionLineName,
        notificationType: 'finished',
      },
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),
      selectedRow: [],
      printQuery: {
        categoryId: 'p023'
      }
    }
  },
  created() {
  },
  methods: {
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();

      this.loading = true
      try {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
        const res = await getInspectionList(this.listQuery);
        const { total, records } = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },
    validateSelectedRows() {
      if (!this.selectedRow.length) {
        this.$message.warning('请至少选择一条数据');
        return false;
      }
      if (this.selectedRow.length > 1) {
        this.$message.warning('只能选择一条数据');
        return false;
      }
      return true;
    },
    handleButtonClick(type) {
      switch ( type ) {
        case 'quickCreate':
          if (!this.validateSelectedRows()) return;
          this.quickCreateFormData = this.selectedRow[0]
          this.quickCreateFormVisible = true
          break;
        case 'transferCardPrint':
          if (this.validateSelectedRows()) {
            this.printFlowCardVisible = true
          }
          break;
        default:
      }
    },
    handleColumnClick(row, type) {
      switch ( type ) {
        case 'look':
          this.detailFormVisible = true
          this.$nextTick(() => {
            this.$refs.DetailForm.init(row.id, type, false, 'finished')
          })
          break;
        default:
      }
    },
    close(isInitData = true) {
      this.visible = false
      this.detailFormVisible = false
      if (!isInitData) return
      this.initData()
    },
    handlePrintFlowCardClose() {
      this.printFlowCardVisible = false
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    getAlign(align) {
      return align || 'left'
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable"/>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <CustomButton
              :btnList="btnList"
              @click="handleButtonClick"
            />
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
              <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                       @click="$refs.dataTable.showSortDrawer()"/>
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
        <JNPF-table
          customKey="createReworkPlan"
          v-loading="loading"
          :data="tableData"
          :has-c="['btn_transferCard_print','btn_quickCreate']"
          @selection-change="(val) => selectedRow = val"
          :row-key="'id'"
          fixedNO
          :setColumnDisplayList="columnList"
          ref="dataTable"
          custom-column
          :listQuery="listQuery"
          @queryChange="initData"
          :queryJson="superQueryJson"
        >
          <template v-for="column in columnsConfig">
            <el-table-column
              v-if="typeof column.show === 'function' ? column.show() : (column.show !== undefined ? column.show : true)"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth"
              :sortable="column.sortable"
              :fixed="column.fixed"
              :align="getAlign(column.align)"
            >
              <template v-if="column.slot" v-slot="scope">
                <template v-if="column.prop === 'orderNo'">
                  <el-link type="primary" @click.native="handleColumnClick(scope.row, 'look')">
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
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
        />
      </div>
    </div>
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="close" :inspectionMethodList="global.inspectionMethod"/>
    <quickCreateForm :visible.sync="quickCreateFormVisible" :formData="quickCreateFormData" @initData="initData"/>
    <PrintFlowCard
      :visible.sync="printFlowCardVisible"
      :selected-rows="selectedRow"
      :print-query="printQuery"
      :en-code="'p023'"
      @close="handlePrintFlowCardClose"
    />
  </div>
</template>
