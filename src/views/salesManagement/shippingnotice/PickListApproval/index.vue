<script>
import SuperQuery from '@/components/SuperQuery/index.vue'

import {buttonList, getColumns} from "./data";
import {getPrintBusInfo} from "@/api/system/printDev";
import Form from '@/views/salesManagement/shippingnotice/saleMetalworking/Form.vue'
import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import {approveOrdersNotice, deleteQuotationsendlist, getQuotationdatasendlist, refuseOrdersNotice} from "@/api/salesManagement";
import ConfirmBatchPacking from "./ConfirmBatchPacking.vue";

export default {
  name: "index",
  components: {
    ConfirmBatchPacking,
    BatchPrintBrowse,
    PrintDialog,
    SuperQuery,
    Form
  },
  data() {
    return {
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
      superQueryVisible: false,
      superQueryJson: [],
      initListQuery: {
        orderNo: '',
        deliveryStatus: 'waiting',
        notifyType: 'sale',
        returnDeliveryType: 'delivery',
        returnDate: [],
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
        const res = await getQuotationdatasendlist(this.listQuery);
        const {total, records} = res.data
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
      } catch (e) {
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
      switch (type) {
        case 'approve':
        case 'reject':
          this.handleBatchAction(type)
          break;
        case 'printPackingList':
          if (!this.validateSelectedRows()) return;
          break;
        case 'deliveryConfirm':
          if (!this.validateSelectedRows()) return;
          // if (this.selectedRow[0].deliveryStatus !== 'verified') {
          //   this.$message.warning('只有状态为“已审核”的拣货单才能进行确认')
          //   return
          // }
          this.confirmBatchPackingVisible = true
          this.$nextTick(() => {
            this.$refs.ConfirmBatchPacking.init({
              id: this.selectedRow[0].id,
              type: 'deliveryConfirm'
            })
          })
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
        } catch (error) {
          this.$message.error(`${ actionMap[type].title }操作失败: ${ error }`);
        }
      } catch {
      }
    },

    handleColumnClick(row, type) {
      switch (type) {
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
      this.confirmBatchPackingVisible = false
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
      return align || 'left'
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    search() {
      this.listQuery.rdsDate = ""
      this.listQuery.rdeDate = ""
      if (this.listQuery.returnDate && this.listQuery.returnDate.length) {
        this.listQuery.rdsDate = this.listQuery.returnDate[0]
        this.listQuery.rdeDate = this.listQuery.returnDate[1]
      }
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
                placeholder="通知单号"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.deliveryStatus"
                @change="search()"
                placeholder="状态"
              >
                <el-option v-for="(item, index) in global.shippingStatus" :key="index"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
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
            <TableDataExportButton :disabled="tableData.length <= 0" tableRef="dataTable"
              :listQuery="listQuery" exportType="1060"
              exportName="销售退货通知单"/>
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
        <JNPF-table customKey="returnSalesmemo"
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
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery partentOrChild="returnSalesmemoSuperQuery" :show="superQueryVisible" ref="SuperQuery"
      table-ref="dataTable"
      :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false"/>

    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate"/>
    <BatchPrintBrowse ref="batchPrint" :fullName="fullName"/>
    <Form ref="Form" v-if="visible" @close="close" :autoInit="false"/>
    <ConfirmBatchPacking ref="ConfirmBatchPacking" v-if="confirmBatchPackingVisible" @close="close" :autoInit="false"/>
  </div>
</template>
