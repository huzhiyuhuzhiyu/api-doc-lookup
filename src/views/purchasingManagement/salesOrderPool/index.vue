<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { buttonList, getColumns } from "./data";
import { feedbackDeliveryOrderPool, getSalesOrderPoolPage } from "@/api/salesOrderPool";
import Form from './Form.vue'
import FeedbackEditDialog from "./feedbackEditDialog.vue";

export default {
  name: "index",
  components: {
    FeedbackEditDialog,
    SuperQuery,
    Form
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
            { prop: 'deliveryStatus', symbol: '==', fixed: true },
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: ''
            }
          ]
        },
      }],
      loading: false,
      visible: false,
      showDialog: false,
      tableData: [],
      total: 0,
      superQueryJson: [
        {
          prop: 'orderType',
          label: "订单类型",
          type: 'select',
          options: this.global.salesOrderType
        },
        {
          prop: 'deliveryStatus',
          label: "交期状态",
          type: 'select',
          options: this.global.deliveryStatus
        },
      ],
      listQuery: {
        shipmentStatus: 'not_finish',
        confirmedStatus: 'need_purchase',
        productSourceList: ['purchase', 'assemble', 'virtual_assemble'],
        waitIssuanceNumFlag: true,
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
        const res = await getSalesOrderPoolPage(this.listQuery);
        const { total, records } = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },
    async handleConfirm(selectedDate) {
      const params = {
        feedbackDeliveryDate: selectedDate,
        id: this.selectedRow[0].id,
      }
      try {
        await feedbackDeliveryOrderPool(params);
        this.$message.success('反馈成功')
        await this.initData()
      } catch ( e ) {
        this.$message.error('反馈失败，请稍后再试')
      }
    },
    handleButtonClick(type) {
      switch ( type ) {
        case 'feedback':
          if (!this.selectedRow.length) return this.$message.warning('请至少选择一条数据')
          if (this.selectedRow.length > 1) return this.$message.warning('只能选择一条数据')
          if (this.selectedRow[0].deliveryStatus !== 'pending_reply') {
            return this.$message.warning('仅“交期待回复”的订单可执行交期反馈');
          }
          this.showDialog = true
          break;
        default:
      }
    },
    handleColumnClick(row, type, productSource) {
      switch ( type ) {
        case 'add':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init(row, type, productSource)
          })
          break;
        default:
      }
    },
    close(isInitData = true) {
      this.visible = false
      if (!isInitData) return
      this.initData()
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
                       @click="$refs.dataTable.showDrawer()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                       @click="initData()"/>
            </el-tooltip>
          </div>
        </div>
        <JNPF-table customKey="hsCodes"
                    v-loading="loading"
                    :data="tableData"
                    :has-c="true"
                    @selection-change="(val) => selectedRow = val"
                    :row-key="'id'"
                    fixedNO
                    :setColumnDisplayList="columnList"
                    ref="dataTable"
                    custom-column :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
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
          <el-table-column label="操作" width="260" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" @click="handleColumnClick(row, 'add','product')">
                成品需求
              </el-button>
              <el-button size="mini" type="text" @click="handleColumnClick(row, 'add','component')">
                子件需求
              </el-button>
              <el-button size="mini" type="text" @click="handleColumnClick(row, 'add','mainComponent')">
                主子件需求
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
        />
      </div>
    </div>
    <Form ref="Form" v-if="visible" @close="close"/>
    <FeedbackEditDialog
      :visible.sync="showDialog"
      @confirm="handleConfirm"
    />
  </div>
</template>
