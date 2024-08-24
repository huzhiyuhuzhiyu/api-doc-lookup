<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="请输入收货单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.purchaseOrderNo" placeholder="请输入采购单号" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.salesman" placeholder="请输入业务员" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head" style="padding:10px">
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
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerName" label="供应商名称" min-width="120" />
            <el-table-column prop="partnerCode" label="供应商编码" min-width="120" />
            <el-table-column prop="deliverDate" label="收货日期" min-width="140" sortable="custom" />
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="140" sortable="custom" />
            <el-table-column prop="receivedQuantity" label="仓库" min-width="140" />
            <el-table-column prop="mainUnit" label="单位" min-width="140" />
            <el-table-column prop="receivedQuantity" label="收货数量" min-width="140" />
            <el-table-column prop="standardValue" label="规值" min-width="140" />
            <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="140" />
            <el-table-column prop="accuracyLevel" label="精度等级" min-width="140" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="140" />
            <el-table-column prop="oil" label="油脂" min-width="140" />
            <el-table-column prop="oilQuantity" label="油脂量" min-width="140" />
            <el-table-column prop="clearance" label="游隙" min-width="140" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="140" />
            <el-table-column prop="processName" label="工序" min-width="140" />
            <el-table-column prop="ordersNo" label="订单号" min-width="140" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" />
            <el-table-column prop="remark" min-width="200" label="备注" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row)" editText="检验" :hasDel="false">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
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
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { purPurchaseReceiptReturnGoodsDetailList, linesReceiptReturn } from '@/api/purchasingManagement/purchaseInquirySheet'
import Form from '../components/inspectionNoticeForm.vue'
// import DetailForm from '@/views/purchasingManagement/purchaseAndReceive/purchaseReceiptNote/Form.vue'
import DetailForm from './DetailForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  components: { Form, DetailForm, SuperQuery },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '单号',
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: '客户名称',
          type: 'input'
        },
        {
          prop: 'deliverDate',
          label: '退货日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },

        {
          prop: 'customerProductNo',
          label: '客户料号',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'deliveryQuantity',
          label: '退货数量',
          type: 'input'
        },
        {
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
        },
        {
          prop: 'approvalStatus',
          label: '审批状态',
          type: 'select',
          options: [
            { label: '审批中', value: 'ing' },
            { label: '审批通过', value: 'ok' },
            { label: '审批拒绝', value: 'rebut' },
            { label: '审批撤回', value: 'withdrawn' }
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        },
      ],
      columnList: ["partnerCode", "productCode", "productName", "createByName"],
      visible: false,
      detailFormVisible: false,
      activeName: 'dataTable',
      listLoading: false,
      formVisible: false,

      tableData: [],
      listQuery: {},
      initListQuery: {
        approvalStatus: 'ok', // 审批状态
        documentStatus: 'submit', // 单据状态
        inspectionStatus: 'unInspect', // 检验状态
        orderNo: '', // 收货单号
        purchaseOrderNo: '', // 业务单号
        notificationType: 'procure', // 通知单类型(采购 procure、外协 external、生产检验（入库检验） produce、退货检验 back、退料检验 back_material、在库检验 library、换料检验 refuelling、工序检验process)
        pageNum: 1,
        pageSize: 20,
        receiptReturnType: 'receipt',
        // receivingStatus: 'finished', //收货状态
        salesman: '', // 业务员
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        createTimeArr: []
      },
      total: 0,

      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},

    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  methods: {
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        purPurchaseReceiptReturnGoodsDetailList(this.listQuery)
          .then((res) => {
            this.tableData = res.data.records
            this.total = res.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      } else {
        linesReceiptReturn(this.linesQuery)
          .then((res) => {
            this.linesTableData = res.data.records
            this.linesTotal = res.data.total
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      }
      this.listLoading = true
    },
    search() {
      this.visible = false
      if (this.activeName === 'dataTable') {
        this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
        Object.keys(this.listQuery).forEach((key) => {
          this.listQuery[key] =
            typeof this.listQuery[key] === 'string' ? this.listQuery[key].trim() : this.listQuery[key]
        })
        this.listQuery.pageNum = 1
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArr', 'startTime', 'endTime')
        this.jnpf.searchTimeFormat(this.linesQuery, 'deliveryDate', 'deliverDateStart', 'deliverDateEnd')
        Object.keys(this.linesQuery).forEach((key) => {
          this.linesQuery[key] =
            typeof this.linesQuery[key] === 'string' ? this.linesQuery[key].trim() : this.linesQuery[key]
        })
        this.linesQuery.pageNum = 1
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

      this.initData()
    },
    addOrUpdateHandle(row, readOnly) {
      if (readOnly) {
        this.detailFormVisible = true
        this.$nextTick(() => {
          this.$refs.DetailForm.init(row, 'look')
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row, readOnly, 'procure', 'notice','QCDH')
        })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (this.activeName === 'dataTable') {
        if (prop === 'purchaseOrderNo') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
        }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? '' : newProp
      } else {
        if (['orderNo', 'purchaseOrderNo', 'productName', 'productDrawingNo', 'createTime'].includes(prop)) {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
        }
        this.linesQuery.orderItems[0].asc = order === 'ascending'
        this.linesQuery.orderItems[0].column = order === null ? '' : newProp
      }
      this.search()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
