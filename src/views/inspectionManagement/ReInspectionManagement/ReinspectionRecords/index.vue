<script>
import { buttonList, getColumns } from "./data";
import Form from '@/views/productionManagement/PackagingPlan/module/Form.vue'
import { getStockChangePackageLineList, submitStockChangePackage } from "@/api/stockChangePackage";

export default {
  name: "index",
  components: {
    Form,
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
            { prop: 'orderNo', symbol: 'like', fixed: true },
            { prop: 'status', symbol: '==', fixed: true },
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: []
        },
      }],
      loading: false,
      visible: false,
      tableData: [],
      total: 0,
      superQueryJson: [
        {
          prop: 'status',
          label: '状态',
          type: 'select',
          options: [
            { label: '未确认', value: 'not_confirm' },
            { label: '已确认', value: 'confirmed' },
          ]
        }
      ],
      listQuery: {
        changePackageType: 'flipping',
        status: 'not_confirm',
      },
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),
      selectedRow: [],
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
        const res = await getStockChangePackageLineList(this.listQuery);
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
        case 'reInspection':
          if (!this.validateSelectedRows()) return;
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', 'add', this.selectedRow[0], 'flipping')
          })
          break;
        default:
      }
    },
    handleColumnClick(row, type) {
      switch ( type ) {
        case 'submit':
          this.handleSubmit(row.id)
          break;
        default:
      }
    },
    async handleSubmit(id) {
      try {
        await submitStockChangePackage(id);
        this.$message.success('提交成功');
        this.initData()
      } catch ( e ) {
        this.$message.error(e.message || '提交失败');
      }
    },
    close(isInitData = true) {
      this.visible = false
      if (!isInitData) return
      this.initData()
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
          customKey="ReinspectionRecords"
          v-loading="loading"
          :data="tableData"
          :has-c="true"
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
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" @click="handleColumnClick(row, 'submit')">
                提交
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
        />
      </div>
    </div>
    <Form ref="Form" v-if="visible" @close="close"/>
  </div>
</template>
