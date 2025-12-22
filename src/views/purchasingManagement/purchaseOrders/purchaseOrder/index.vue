<script>
import { buttonList, getColumns } from "../createPurchaseOrder/data";
import { getPrintBusInfo } from "@/api/system/printDev";
import Form from '../createPurchaseOrder/index.vue'
import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import { deletePurPurchaseOrder, purchaseOrderList } from "@/api/purchasingAndOutsourcingOrders";

export default {
  name: "index",
  components: {
    BatchPrintBrowse,
    PrintDialog,
    Form
  },
  props: {
    queryObject: {
      type: Object,
      default: () => ({})
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
            { prop: 'orderNo', symbol: 'like', fixed: true },
            { prop: 'cooperativePartnerCode', symbol: 'like', fixed: true },
            { prop: 'cooperativePartnerName', symbol: 'like', fixed: true },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      loading: false,
      visible: false,
      printVisible: false,
      printQuery: {
        category: ''
      },
      fullName: '',
      enCode: '',
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
          prop: 'orderState',
          label: "订单状态",
          type: 'select',
          options: this.global.salesOrderState
        },
      ],
      listQuery: {
        ...this.queryObject,
        orderType: 'procure',
      },
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),
      selectedRow: [],
    }
  },
  methods: {
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();

      this.loading = true
      try {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期

        const res = await purchaseOrderList(this.listQuery);
        const { total, records } = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },
    closePrint() {
      this.printVisible = false
    },
    printView(row, enCode, fullName) {
      this.selectArr = [row]
      this.enCode = enCode
      this.fullName = fullName
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(enCode)
      })
    },
    async printOrder(enCode) {
      try {
        const res = await getPrintBusInfo(enCode)
        if (!res.data) {
          return this.$message.warning('未找到相应打印模版')
        }
        const id = res.data.id
        const printData = this.selectArr.map(item => ({
          formId: item.id,
          id: id
        }))
        this.$refs.batchPrint.print(printData);
      } catch ( e ) {
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
        case 'add':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', type, this.listQuery.source)
          })
          break;
        case 'print':
          if (!this.validateSelectedRows()) return;
          this.printView(this.selectedRow[0], 'p006', '打印');
          break;
      }
    },
    handleColumnClick(row, type) {
      switch ( type ) {
        case 'look':
        case 'edit':
        case 'copy':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init(row.id, type)
          })
          break;
        case 'delete':
          this.handleRemove(row.id)
          break;
        default:
      }
    },
    handleRemove(id) {
      this.$confirm('您确定要删除这些数据吗, 是否继续？', '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await deletePurPurchaseOrder(id);
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success('删除成功')
          this.initData()
        }
      }).catch(() => {
      })
    },
    close(isInitData = true) {
      this.visible = false
      this.BindingVisible = false
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
        <JNPF-table
          customKey="purchaseOrder"
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
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" :disabled="row.documentStatus !== 'draft'"
                         @click="handleColumnClick(row, 'edit')">
                编辑
              </el-button>
              <el-button class="JNPF-table-delBtn" size="mini" type="text" :disabled="row.documentStatus !== 'draft'"
                         @click="handleColumnClick(row, 'delete')">
                删除
              </el-button>
              <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleColumnClick(row, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"/>
      </div>
    </div>
    <Form ref="Form" v-if="visible" @close="close" :autoInit="false"/>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
                 :printQuery="printQuery" :enCode="enCode" ref="printTemplate"/>
    <BatchPrintBrowse ref="batchPrint" :fullName="fullName"/>
  </div>
</template>
