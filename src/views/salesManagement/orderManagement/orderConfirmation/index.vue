<script>
import SuperQuery from '@/components/SuperQuery/index.vue'

import { buttonList, getColumns } from "./data";
import { getsaleOrderList } from "@/api/salesManagement/assemblyOrders";
import { getPrintBusInfo } from "@/api/system/printDev";
import Form from '@/views/salesManagement/orderManagement/orderList/Form.vue'
import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import { ordersFeedbackDeliveryFinished } from "@/api/salesManagement/orderChanges";

export default {
  name: "index",
  components: {
    BatchPrintBrowse,
    PrintDialog,
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
            { prop: 'cooperativePartnerCode', symbol: 'like', fixed: true },
            { prop: 'cooperativePartnerName', symbol: 'like', fixed: true },
            { prop: 'deliveryStatus', symbol: '==', fixed: true },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: ''
            },
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
          prop: 'deliveryStatus',
          label: "交期状态",
          type: 'select',
          options: this.global.deliveryStatus
        },
      ],
      listQuery: {},
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

        const res = await getsaleOrderList(this.listQuery);
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
        case 'orderPrinting':
          if (!this.validateSelectedRows()) return;
          break;
        case 'contractPrinting':
          if (!this.validateSelectedRows()) return;
          break;
        default:
      }
    },
    handleColumnClick(row, type) {
      switch ( type ) {
        case 'look':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init(row.id, type)
          })
          break;
        case 'confirmDeliveryDate':
          this.handleConfirmDeliveryDate(row.id)
          break;
        default:
      }
    },
    async handleConfirmDeliveryDate(id) {
      try {
        await this.$confirm('确定要执行此操作吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        try {
          await ordersFeedbackDeliveryFinished(id)
          this.$message.success('确认成功')
          await this.initData()
        } catch ( e ) {
          this.$message.success('确认失败')
        }
      } catch ( error ) {
      }
    },
    close(isInitData = true) {
      this.visible = false
      this.BindingVisible = false
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
          customKey="orderConfirmation"
          v-loading="loading"
          :data="tableData"
          :has-c="true"
          @selection-change="(val) => selectedRow = val"
          :row-key="'id'"
          fixedNO
          :setColumnDisplayList="columnList"
          ref="dataTable"
          :auto-column="true"
          :columns-config="columnsConfig"
          :listQuery="listQuery"
          @queryChange="initData"
          :queryJson="superQueryJson">
          <template slot="extra-columns">
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="{ row }">
                <el-button size="mini" type="text"
                          @click="handleColumnClick(row, 'look')">
                  详情
                </el-button>
                <el-button size="mini" type="text" @click="handleColumnClick(row, 'confirmDeliveryDate')">
                  完成
                </el-button>
              </template>
            </el-table-column>
          </template>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
        />
      </div>
    </div>
    <Form ref="Form" v-if="visible" @close="close" from-page="conf"/>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
                 :printQuery="printQuery" :enCode="enCode" ref="printTemplate"/>
    <BatchPrintBrowse ref="batchPrint" :fullName="fullName"/>
  </div>
</template>
