<script>
import { buttonList, getColumns } from "./data";
import PrintDialogPro from '@/components/no_mount/PrintDialogPro'
import Form from '@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue'
import { getInventorySummaryData } from "@/api/warehouseManagement/inventory";

export default {
  name: "index",
  components: {
    Form,
    PrintDialogPro
  },
  props: {
    queryParams: {
      type: Object,
      default: () => {
      }
    },
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            { prop: 'orderNo', symbol: 'like', fixed: true },
            // { prop: 'businessType', symbol: '==', fixed: true },
            { prop: 'partnerName', symbol: 'like', fixed: true },
            { prop: 'partnerCode', symbol: 'like', fixed: true },
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
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
      apiTotalData: {},
      summaryMapping: {},
      tableData: [],
      total: 0,
      superQueryJson: [
        {
          prop: 'businessType',
          label: '业务类型',
          type: 'select',
          options: this.getDictDataSync('warehouseBusinessType'),
        },
      ],
      listQuery: { ...this.queryParams },
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),

      printableTypes: [
        {
          businessType: 'inbound_purchase',
          code: "p017",
          fullName: "采购收货单"
        },
        {
          businessType: 'outbound_purchase',
          code: "p008",
          fullName: "采购退货"
        },
        {
          businessType: 'outbound_external_send',
          code: "p013",
          fullName: "外协发料单"
        },
        {
          businessType: 'inbound_external',
          code: "p019",
          fullName: "外协收货单"
        },
        {
          businessType: 'outbound_sale_send',
          code: "p031",
          fullName: "销售发货单"
        },
        {
          businessType: 'inbound_sale_return',
          code: "p031",
          fullName: "销售退库单"
        },
        {
          businessType: 'outbound_pick_out',
          code: "p062",
          fullName: "生产领料单"
        },
      ]
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
        const res = await getInventorySummaryData(this.listQuery);
        const { page, total } = res.data
        this.tableData = page.records;
        this.total = page.total
        this.apiTotalData = total
      } finally {
        this.loading = false
      }
    },
    handleButtonClick(type) {
      switch ( type ) {
        case '':
          break;
        default:
      }
    },
    handleColumnClick(row, type) {
      switch ( type ) {
        case 'print':
          this.handlePrint(row);
          break;
        default:
      }
    },
    // 处理打印
    handlePrint(row) {
      const printConfig = this.getPrintConfig(row.businessType);
      if (!printConfig) {
        return this.$message.warning('当前业务类型不允许打印');
      }
      this.$refs.PrintDialogPro.init({
        enCode: printConfig.code,
        formId: row.id,
        fullName: printConfig.fullName
      })
    },
    getPrintConfig(businessType) {
      return this.printableTypes.find(item => item.businessType === businessType);
    },
    isPrintable(row) {
      return !!this.getPrintConfig(row.businessType);
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
          customKey="inOutRecords"
          v-loading="loading"
          :data="tableData"
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
              :formatter="column.formatter"
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
              <el-button size="mini" type="text"
                         @click="handleColumnClick(row, 'print')"
                         :disabled="!isPrintable(row)"
              >
                打印
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
        />
      </div>
    </div>
    <!--  打印  -->
    <PrintDialogPro ref="PrintDialogPro"/>
  </div>
</template>
