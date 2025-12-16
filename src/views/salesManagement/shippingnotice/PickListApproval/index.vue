<script>
import { buttonList, getColumns } from "./data";
import { getPrintBusInfo } from "@/api/system/printDev";
import { approveOrdersNotice, deleteQuotationsendlist, getQuotationdatasendlist, refuseOrdersNotice } from "@/api/salesManagement";

import Form from '@/views/salesManagement/shippingnotice/saleMetalworking/Form.vue'
import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import ConfirmBatchPacking from "./ConfirmBatchPacking.vue";

export default {
  name: "index",
  components: {
    ConfirmBatchPacking,
    BatchPrintBrowse,
    PrintDialog,
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
            { prop: 'partnerCode', symbol: 'like', fixed: true },
            { prop: 'partnerName', symbol: 'like', fixed: true },
            { prop: 'deliveryStatus', symbol: '==', value: 'waiting', fixed: true },
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
      confirmBatchPackingVisible: false,
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
          prop: 'deliveryStatus',
          label: '发货状态',
          type: 'select',
          options: this.global.shippingStatus
        }
      ],
      listQuery: {
        notifyType: 'sale',
        returnDeliveryType: 'delivery',
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

        const res = await getQuotationdatasendlist(this.listQuery);
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
    validateSelectedRows(allowMultiple = false) {
      if (!this.selectedRow.length) {
        this.$message.warning('请至少选择一条数据');
        return false;
      }
      if (!allowMultiple && this.selectedRow.length > 1) {
        this.$message.warning('只能选择一条数据');
        return false;
      }
      return true;
    },
    handleButtonClick(type) {
      switch ( type ) {
        case 'approve':
        case 'reject':
          this.handleBatchAction(type)
          break;
        case 'printPackingList':
          if (!this.validateSelectedRows()) return;
          break;
        case 'deliveryConfirm':
          if (!this.validateSelectedRows()) return;
          this.printView(this.selectedRow[0], 'p003', '送货单打印')
          // if (this.selectedRow[0].deliveryStatus !== 'verified') {
          //   this.$message.warning('只有状态为“已审核”的拣货单才能进行确认')
          //   return
          // }
          // this.confirmBatchPackingVisible = true
          // this.$nextTick(() => {
          //   this.$refs.ConfirmBatchPacking.init({
          //     id: this.selectedRow[0].id,
          //     type: 'deliveryConfirm'
          //   })
          // })
          break;
        default:
      }
    },
    async handleBatchAction(type) {
      if (!this.validateSelectedRows(true)) return;
      const actionMap = {
        approve: {
          title: '批准',
          apiMethod: approveOrdersNotice,
          successMsg: '批准成功'
        },
        reject: {
          title: '拒绝',
          apiMethod: refuseOrdersNotice,
          successMsg: '拒绝成功'
        }
      };

      try {
        await this.$confirm(`确定要${ actionMap[type].title }选中的 ${ this.selectedRow.length } 条数据吗？`, '提示', {
          type: 'warning'
        });

        try {
          const ids = this.selectedRow.map(item => item.id);
          await actionMap[type].apiMethod(ids);
          this.$message.success(actionMap[type].successMsg);
          await this.initData();
        } catch ( error ) {
          this.$message.error(`${ actionMap[type].title }操作失败: ${ error }`);
        }
      } catch {
      }
    },
    handleColumnClick(row, type) {
      switch ( type ) {
        case 'approve':
        case 'reject':
          this.selectedRow = []
          this.selectedRow = [row]
          this.handleBatchAction(type)
          break;
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
        const res = await deleteQuotationsendlist(id);
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
      this.confirmBatchPackingVisible = false
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
              :exportListQuery="listQuery"
              :exportDisabled="tableData.length <= 0"
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
          customKey="PickListApproval"
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
                <template v-if="column.prop === 'orderNo'">
                  <el-link type="primary"
                           @click.native="handleColumnClick(scope.row,'look')">{{
                      scope.row.orderNo
                    }}
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
          <el-table-column label="操作" width="280" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" :disabled="row.deliveryStatus !== 'waiting'"
                         @click="handleColumnClick(row, 'approve')">
                批准
              </el-button>
              <el-button class="JNPF-table-delBtn" size="mini" type="text" :disabled="row.deliveryStatus !== 'waiting'"
                         @click="handleColumnClick(row, 'reject')">
                拒绝
              </el-button>
              <el-button size="mini" type="text"
                         :disabled="row.documentStatus !== 'draft' || !['ready', 'waiting'].includes(row.deliveryStatus)"
                         @click="handleColumnClick(row, 'edit')">
                编辑
              </el-button>
              <el-button class="JNPF-table-delBtn" size="mini" type="text"
                         :disabled="row.documentStatus !== 'draft' || !['ready', 'waiting'].includes(row.deliveryStatus)"
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
                  <el-dropdown-item @click.native="handleColumnClick(row, 'copy')">
                    复制通知单
                  </el-dropdown-item>
                  <el-dropdown-item :disable="row.documentStatus === 'draft'"
                                    @click.native="printView(row,'p004','销售退货单打印')">
                    打印
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
        />
      </div>
    </div>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
                 :printQuery="printQuery" :enCode="enCode" ref="printTemplate"/>
    <BatchPrintBrowse ref="batchPrint" :fullName="fullName" :enCode="enCode"/>
    <Form ref="Form" v-if="visible" @close="close" :autoInit="false"/>
    <ConfirmBatchPacking ref="ConfirmBatchPacking" v-if="confirmBatchPackingVisible" @close="close" :autoInit="false"/>
  </div>
</template>
