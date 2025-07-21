<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import Form from './Form.vue'
import {buttonList, getColumns} from "./data";
import {deleteOrders, getsaleOrderList} from "@/api/salesManagement/assemblyOrders";
import {getOrdersConfirmed} from "@/api/salesManagement/orderChanges";


export default {
  name: "index",
  components: {
    SuperQuery,
    Form
  },
  data() {
    return {
      loading: false,
      visible: false,
      tableData: [],
      total: 0,
      superQueryVisible: false,
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
      initListQuery: {
        orderNo: '',
        cooperativePartnerName: '',
        cooperativePartnerCode: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        superQuery: {},
        pageNum: 1,
        pageSize: 20
      },
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
          {prop: 'procurementPending', label: '采购待审', sortable: 'custom'},
          {prop: 'productName', label: '产品名称', minWidth: '220px', sortable: 'custom'},
          {prop: 'productCode', label: '产品编码', sortable: 'custom'},
          {prop: 'drawingNo', label: '产品型号', minWidth: '220px', sortable: 'custom'},
          {prop: 'customerProductDrawingNo', label: '客户型号', minWidth: '220px', sortable: 'custom'},
          {prop: 'num', label: '订单数量', sortable: 'custom'},
          {prop: 'stockInventoryNum', label: '总库存', sortable: 'custom'},
          {prop: 'unpickedNum', label: '仓库未拣货数', sortable: 'custom'},
          {prop: 'unDeliveryNum', label: '未发数', sortable: 'custom'},
          {prop: 'onlineNum', label: '在线数', sortable: 'custom'},
          {prop: 'inTransitNum', label: '在途数', sortable: 'custom'},
          {prop: 'actualInventoryNum', label: '实际库存', sortable: 'custom'},
          {prop: 'availableInventoryNum', label: '可用库存', sortable: 'custom'},
          {prop: 'confirmedStatus', label: '状态', sortable: 'custom', minWidth: '220px',},
          {prop: 'inventoryArrangementNum', label: '库存安排', sortable: 'custom'},
          {prop: 'orderPoolNum', label: '订单池', sortable: 'custom'}
        ],
        listRequestObj: '',
        listDataFormatting: (res) => {
          return res.data
        },
      },
      selectedRow: [],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        const res = await getsaleOrderList(this.listQuery);
        const {total, records} = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },

    handleChangeStatus(val, row) {
      this.$refs.ComSelectProductRef.$refs.dataTable.$refs.JNPFTable.toggleRowSelection(row, true)
    },

    async submitAllProduct(data) {
      console.log("data ✈️ ", data)
    },

    handleButtonClick(type) {
      switch (type) {
        case 'add':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', 'add')
          })
          break;
        case 'confirm':
          if (!this.selectedRow.length) return this.$message.warning('请至少选择一条数据')
          if (this.selectedRow.length > 1) return this.$message.warning('只能选择一条数据')
          const row = this.selectedRow[0]
          this.addProductProps.listRequestObj = row.id
          this.$refs.ComSelectProductRef.openDialog()
          break;
        default:
      }
    },

    handleColumnClick(row, type) {
      console.log("row ✈️ ", row)
      switch (type) {
        case 'look':
        case 'edit':
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
        const res = await deleteOrders(id);
        const {msg} = res
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

    sortChange({prop, order}) {
      let newProp = ''
      if (prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    getAlign(align) {
      return align || 'center'
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16" style="margin-bottom: 5px !important;">
        <el-form @submit.native.prevent @keyup.enter.native="search()">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.orderNo"
                placeholder="订单号"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerCode"
                placeholder="客户编码"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerName"
                placeholder="客户名称"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search"
                @click="search()">查询
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <CustomButton
              :btnList="btnList"
              @click="handleButtonClick"
            />
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true"/>
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
        <JNPF-table customKey="hsCodes"
          v-loading="loading"
          :data="tableData"
          :has-c="true"
          @selection-change="(val) => selectedRow = val"
          :row-key="'id'"
          fixedNO
          :setColumnDisplayList="columnList"
          @sort-change="sortChange"
          ref="dataTable"
          custom-column>
          <template v-for="column in columnsConfig">
            <el-table-column
              v-if="typeof column.show === 'function' ? column.show() : true"
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
              <el-button size="mini" type="text"
                @click="handleColumnClick(row, 'edit')">
                编辑
              </el-button>
              <el-button size="mini" type="text"
                @click="handleColumnClick(row, 'look')">
                详情
              </el-button>
              <el-button style="color: rgb(245, 108, 108)" size="mini" type="text"
                @click="handleColumnClick(row, 'delete')">
                删除
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false" @confirm="submitAllProduct">
      <template #confirmedStatus="row">
        <el-select v-model="row.row.confirmedStatus" placeholder="" @change="(val)=>handleChangeStatus(val,row.row)">
          <el-option
            v-for="item in getDictDataSync('order_confirmed_status')"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      <template slot="table-action">
        <div></div>
      </template>
    </ComSelect-page>
    <!-- 高级查询 -->
    <SuperQuery partentOrChild="TransitionApplicationRecordQuery" :show="superQueryVisible" ref="SuperQuery"
      table-ref="dataTable"
      :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
    <Form ref="Form" v-if="visible" @close="close"/>
  </div>
</template>
