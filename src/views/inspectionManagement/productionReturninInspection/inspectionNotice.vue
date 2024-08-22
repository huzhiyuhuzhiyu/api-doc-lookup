<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">

      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="请输入退料单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.personName" placeholder="请输入退料人" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
              @click="visible = true">更多查询</el-button>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div></div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column>
            <el-table-column prop="orderNo" label="退料单号" min-width="200" fixed="left" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="productionOrderNo" label="生产订单号" min-width="200" fixed="left" />
            <!-- <el-table-column prop="notifyType" label="通知单类型" min-width="120" fixed="left" :formatter="typeFormat" /> -->
            <el-table-column prop="personName" label="退料人" min-width="120" sortable="custom" />
            <el-table-column prop="operationDate" label="退料日期" width="180" sortable="custom" />
            <el-table-column prop="personName" label="退料人" width="120" sortable="custom">
            </el-table-column>
            <el-table-column prop="operationDate" label="退料日期" width="180" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" width="200" fixed="left" />
            <el-table-column prop="productName" label="产品名称" width="200" sortable="custom" fixed="left" />
            <el-table-column prop="productDrawingNo" label="产品图号" width="200" sortable="custom" fixed="left" />
            <el-table-column prop="routingName" label="工艺路线名称" width="200" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" width="200" sortable="custom" />
            <el-table-column prop="receivedQuantity" label="已退数量" width="140" />
            <el-table-column prop="unReceiveQuantity" label="待退数量" width="140" />
            <el-table-column prop="num" label="退料数量" min-width="120" />
            <el-table-column prop="mainUnit" label="单位" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" />
            <el-table-column prop="remark" min-width="200" label="备注" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row)" editText="检验" :hasDel="false">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, true)">
                        查看详情
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" />
  </div>
</template>

<script>
import { WithdrawalList, WithdrawalmxList } from '@/api/productOrdes/index'
import Form from '../components/inspectionNoticeForm.vue'
// import DetailForm from '@/views/productionOrders/finishedproductreceiving/materialreturnnotice/Form.vue'
import DetailForm from './DetailForm.vue'
export default {
  components: { Form, DetailForm },
  data() {
    return {
      visible: false,
      detailFormVisible: false,
      activeName: "dataTable",
      tableData: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        approvalStatus: "ok",
        documentStatus: "submit",
        pickingStatus: 'not_back', // 领退料状态 未领料 not_picked、已领料 picked、未退料 not_back、已退料 back
        inspectionStatus: 'unInspect', // 检验状态 待检验 unInspect、已检验 inspected
        orderNo: '',
        personName: '',
        productionOrderNo: '',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20
      },
      linesQuery: {},
      linesTotal: 0,
      linesTableData: [],
      initLinesQuery: {
        approvalStatus: "ok",
        documentStatus: "submit",
        pickingStatus: 'not_back', // 领退料状态 未领料 not_picked、已领料 picked、未退料 not_back、已退料 back
        inspectionStatus: 'unInspect', // 检验状态 待检验 unInspect、已检验 inspected
        orderNo: '',
        personName: '',
        productionOrderNo: '',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        deliveryDatefahuo: [],
        createTimeArrfahuo: [],
      },
      total: 0,
      formVisible: false,
    }
  },
  watch: { activeName() { this.initData() } },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        WithdrawalList(this.listQuery).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        WithdrawalmxList(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
          this.visible = false
        })
      }
    },
    search() {
      if (this.activeName === 'dataTable') {
        if (this.listQuery.createTimeArr && this.listQuery.createTimeArr.length) {
          this.listQuery.startTime = this.listQuery.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.listQuery.endTime = this.listQuery.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'deliveryDatefahuo', 'operationSd', 'operationEd')
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArrfahuo', 'startTime', 'endTime')
        Object.keys(this.linesQuery).forEach(key => {
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1
      }
      this.initData()
    },
    reset() {
      if (this.activeName === 'dataTable') {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
      }
      this.search()
    },
    addOrUpdateHandle(row, readOnly) {
      if (readOnly) {
        this.detailFormVisible = true
        this.$nextTick(() => { this.$refs.DetailForm.init(row, 'look') })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(row, readOnly, 'produce', 'notice') })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'ordersNo' || prop === 'personName' || prop === 'productName' || prop === 'productDrawingNo' || prop === 'routingName' || prop === 'processName' || prop === 'personName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      if (this.activeName === 'dataTable') {
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      if (isRefresh) { this.initData() }
    },

  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />