<script>
import { buttonList, getColumns } from "./data";
import { antiCancelSaleOrders, cancelSaleOrders, closeOrders, deleteOrders, getsaleOrderList } from "@/api/salesManagement/assemblyOrders";
import { getOrdersConfirmed, getOrdersConfirmedIssuance, ordersFeedbackDeliveryFinished } from "@/api/salesManagement/orderChanges";
import { getPrintBusInfo } from "@/api/system/printDev";
import Form from './Form.vue'
import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import { getQueryConfirm } from "@/utils";

export default {
  name: "index",
  components: {
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
          prop: 'orderState',
          label: "订单状态",
          type: 'select',
          options: this.global.salesOrderState
        },
      ],
      listQuery: {},
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),
      addProductProps: {
        title: '订单分配',
        renderTree: false,
        multiple: false,
        confirms: true,
        listMethod: getOrdersConfirmed,
        tableItems: [
          { prop: 'procurementPending', label: '采购待审', sortable: 'custom', align: 'center', minWidth: '120px' },
          { prop: 'productName', label: '产品名称', minWidth: '220px', sortable: 'custom' },
          { prop: 'productCode', label: '产品编码', sortable: 'custom' },
          { prop: 'drawingNo', label: '产品型号', minWidth: '220px', sortable: 'custom' },
          { prop: 'customerProductDrawingNo', label: '客户型号', minWidth: '220px', sortable: 'custom' },
          { prop: 'num', label: '订单数量', sortable: 'custom', minWidth: '120px', align: 'center' },
          { prop: 'stockInventoryNum', label: '总库存', sortable: 'custom', minWidth: '90px', align: 'center' },
          { prop: 'unpickedNum', label: '仓库未拣货数', sortable: 'custom', minWidth: '150px', align: 'center' },
          { prop: 'unDeliveryNum', label: '未发数', sortable: 'custom', minWidth: '90px', align: 'center' },
          { prop: 'onlineNum', label: '在线数', sortable: 'custom', minWidth: '90px', align: 'center' },
          { prop: 'inTransitNum', label: '在途数', sortable: 'custom', minWidth: '90px', align: 'center' },
          { prop: 'actualInventoryNum', label: '实际库存', sortable: 'custom', minWidth: '120px', align: 'center' },
          { prop: 'availableInventoryNum', label: '可用库存', sortable: 'custom', minWidth: '120px', align: 'center' },
          { prop: 'confirmedStatus', label: '状态', sortable: 'custom', minWidth: '220px', align: 'center' },
          { prop: 'inventoryArrangementNum', label: '库存安排', sortable: 'custom', minWidth: '160px', align: 'center' },
          { prop: 'orderPoolNum', label: '订单池', sortable: 'custom', minWidth: '160px', align: 'center' }
        ],
        listRequestObj: '',
        listDataFormatting: (res) => {
          return res.data
        },
      },
      selectedRow: [],
      confirmedStatusOptions: {
        production: [
          { label: '已有库存', value: 'existing_inventory' },
          { label: '无需生产', value: 'no_need_produce' },
          { label: '需要生产', value: 'need_produce' }
        ],
        purchase: [
          { label: '已有库存', value: 'existing_inventory' },
          { label: '无需采购', value: 'no_need_purchase' },
          { label: '需要采购', value: 'need_purchase' }
        ]
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
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.loading = true
      try {
        const res = await getsaleOrderList(this.listQuery);
        const { total, records } = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },

    getConfirmedStatusOptions(row) {
      const productSource = row.productSource || '';
      if (productSource.includes('purchase')) {
        return this.confirmedStatusOptions.purchase;
      } else {
        return this.confirmedStatusOptions.production;
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
    handleChangeStatus(val, row) {
    },
    async submitAllProduct(data) {
      const params = data.map(item => ({
        ...item,
        ordersLineId: item.id,
      }))
      const response = await getOrdersConfirmedIssuance(params);
      if (response.msg === 'Success') {
        this.$message.success('确认成功')
        this.initData()
      } else {
        this.$message.error(response.msg || '确认失败')
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
            this.$refs.Form.init('', 'add')
          })
          break;
        case 'confirm':
          if (!this.validateSelectedRows()) return;
          if (this.selectedRow[0].recognised === 'recognised') return this.$message.warning('已确认，不能重复确认');
          this.addProductProps.listRequestObj = this.selectedRow[0].id
          this.$refs.ComSelectProductRef.openDialog()
          break;
        case 'confirmDeliveryDate':
          if (!this.validateSelectedRows()) return;
          this.handleConfirmDeliveryDate()
          break;
        case 'cancel':
        case 'uncancel':
          if (!this.validateSelectedRows()) return;
          this.handleCancelOrUnCancel(type);
          break;
        default:
      }
    },
    async handleCancelOrUnCancel(type) {
      const config = {
        cancel: {
          isValid: (state) => state !== 'cancel',
          invalidMsg: '已取消的订单无法再次取消',
          title: '取消订单',
          message: '确定要取消该订单吗？',
          confirmType: 'warning',
          api: cancelSaleOrders,
          successMsg: '取消成功',
          errorMsg: '取消失败'
        },
        uncancel: {
          isValid: (state) => state === 'cancel',
          invalidMsg: '仅已取消的订单可恢复',
          title: '恢复订单',
          message: '确定要恢复该订单吗？',
          confirmType: 'info',
          api: antiCancelSaleOrders,
          successMsg: '恢复成功',
          errorMsg: '恢复失败'
        }
      };

      const action = config[type];
      if (!action) {
        console.error('未知操作类型:', type);
        return;
      }

      const row = this.selectedRow[0];

      if (!action.isValid(row.orderState)) {
        return this.$message.warning(action.invalidMsg);
      }

      try {
        await this.$confirm(action.message, action.title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: action.confirmType
        });

        await action.api(row.id);

        this.$message.success(action.successMsg);
        await this.initData();
      } catch ( error ) {
        if (error !== 'cancel') {
          this.$message.error(action.errorMsg);
        }
      }
    },
    async handleConfirmDeliveryDate() {
      try {
        await this.$confirm('确定要执行此操作吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        try {
          await ordersFeedbackDeliveryFinished(this.selectedRow[0].id)
          this.$message.success('确认成功')
          await this.initData()
        } catch ( e ) {
          this.$message.success('确认失败')
        }
      } catch ( error ) {
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
        case 'close':
          this.handleCloseOrder(row.id)
          break;
        default:
      }
    },
    async handleCloseOrder(id) {
      try {
        await getQueryConfirm(this, '确定要关闭此订单吗？');

        await closeOrders(id);

        this.$message.success('关单成功');
        await this.initData();
      } catch ( error ) {
        if (error !== 'cancel') {
          this.$message.error('关单失败');
        }
      }
    },
    handleRemove(id) {
      this.$confirm('您确定要删除这些数据吗, 是否继续？', '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await deleteOrders(id);
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
          customKey="orderList"
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
                  <el-dropdown-item @click.native="handleColumnClick(row, 'copy')">
                    复制
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleColumnClick(row, 'close')" :disabled="row.documentStatus === 'draft' || row.orderState === 'finish'">
                    关单
                  </el-dropdown-item>
                  <el-dropdown-item :disable="row.documentStatus === 'draft'"
                                    @click.native="printView(row,'p002','销售单打印')">
                    打印
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleColumnClick(row, 'look')">
                    查看详情
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
    <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false" @confirm="submitAllProduct">
      <template #confirmedStatus="{row}">
        <el-select v-model="row.confirmedStatus" placeholder="" @change="(val) => handleChangeStatus(val,row)">
          <el-option
            v-for="item in getConfirmedStatusOptions(row)"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <template #inventoryArrangementNum="{row}">
        <el-input v-model="row.inventoryArrangementNum"></el-input>
      </template>
      <template #orderPoolNum="{row}">
        <el-input v-model="row.orderPoolNum"></el-input>
      </template>
      <template slot="table-action">
        <div></div>
      </template>
    </ComSelect-page>
    <Form ref="Form" v-if="visible" @close="close"/>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
                 :printQuery="printQuery" :enCode="enCode" ref="printTemplate"/>
    <BatchPrintBrowse ref="batchPrint" :fullName="fullName"/>
  </div>
</template>
