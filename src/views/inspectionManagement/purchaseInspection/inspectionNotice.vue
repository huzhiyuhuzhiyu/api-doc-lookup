<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="采购收货单" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.orderNo" placeholder="请输入收货单号" @keyup.enter.native="search()"
                      clearable />
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
                    <el-input v-model="listQuery.salesman" placeholder="请输入业务员" @keyup.enter.native="search()"
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
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="收货单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="purchaseOrderNo" label="采购单号" min-width="200" />
                <el-table-column prop="partnerName" label="供应商名称" min-width="120" />
                <el-table-column prop="salesman" label="业务员" min-width="120" sortable="custom" />
                <el-table-column prop="deliverDate" label="收货日期" width="180" sortable="custom" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column label="操作" width="140" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.id)" editText="检验" :hasDel="false">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">
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
        </el-tab-pane>

        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入收货单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.purchaseOrderNo" placeholder="请输入采购单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.salesman" placeholder="请输入业务员" @keyup.enter.native="search()"
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
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true"
                @sort-change="sortChange" :partentOrChild="'child'" custom-column>
                <el-table-column prop="orderNo" label="收货单号" min-width="280" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary"
                      @click.native="addOrUpdateHandle(scope.row.purchaseReceiptReturnGoodsId, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="purchaseOrderNo" label="采购单号" min-width="220" sortable="custom" />
                <el-table-column prop="partnerName" label="供应商名称" min-width="120" />
                <el-table-column prop="salesman" label="业务员" min-width="140" sortable="custom" />
                <el-table-column prop="deliverDate" label="收货日期" min-width="140" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="140" />
                <el-table-column prop="productName" label="产品名称" min-width="140" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="140" sortable="custom" />
                <el-table-column prop="receiptQuantity" label="已入库数量" min-width="140" />
                <el-table-column prop="requiredReceivedQuantity" label="待入库数量" min-width="140" />
                <el-table-column prop="receivedQuantity" label="收货数量" min-width="140" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="140" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" />
                <el-table-column prop="remark" min-width="140" label="备注" />
                <el-table-column label="操作" width="140" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.purchaseReceiptReturnGoodsId)" editText="检验"
                      :hasDel="false">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            @click.native="addOrUpdateHandle(scope.row.purchaseReceiptReturnGoodsId, true)">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>
                  </template>
                </el-table-column>

              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form v-model="listQuery" label-width="120px" label-position="top" v-if="activeName === 'dataTable'">
          <el-col :span="12">
            <el-form-item label="收货单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入收货单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购单号">
              <el-input v-model="listQuery.purchaseOrderNo" placeholder="请输入采购单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务员">
              <el-input v-model="listQuery.salesman" placeholder="请输入业务员" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
        <el-form v-model="linesQuery" label-width="120px" label-position="top" v-else>
          <el-col :span="12">
            <el-form-item label="收货单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入收货单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购单号">
              <el-input v-model="linesQuery.purchaseOrderNo" placeholder="请输入采购单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务员">
              <el-input v-model="linesQuery.salesman" placeholder="请输入业务员" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货日期">
              <el-date-picker v-model="linesQuery.deliveryDate" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择收货开始日期" end-placeholder="请选择收货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" />
  </div>
</template>

<script>
import { purPurchaseReceiptReturnGoodsList, linesReceiptReturn } from '@/api/purchasingManagement/purchaseInquirySheet'
import Form from '../components/inspectionNoticeForm.vue'
// import DetailForm from '@/views/purchasingManagement/purchaseAndReceive/purchaseReceiptNote/Form.vue'
import DetailForm from './DetailForm.vue'
export default {
  components: { Form, DetailForm },
  data() {
    return {
      visible: false,
      detailFormVisible: false,
      activeName: "dataTable",
      listLoading: false,
      formVisible: false,

      tableData: [],
      listQuery: {},
      initListQuery: {
        approvalStatus: "ok", // 审批状态
        documentStatus: "submit", // 单据状态
        inspectionStatus: "unInspect", // 检验状态
        orderNo: "", // 收货单号
        purchaseOrderNo: "", // 业务单号
        notificationType: "procure", // 通知单类型(采购 procure、外协 external、生产检验（入库检验） produce、退货检验 back、退料检验 back_material、在库检验 library、换料检验 refuelling、工序检验process)
        pageNum: 1,
        pageSize: 20,
        receiptReturnType: 'receipt',
        receivingStatus: "receiving",      //收货状态
        salesman: "", // 业务员
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createTimeArr: []
      },
      total: 0,

      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        approvalStatus: "ok", // 审批状态
        documentStatus: "submit", // 单据状态
        inspectionStatus: "unInspect", // 检验状态
        createByName: "",
        createEndTime: "",
        createTimeArr: "",
        createStartTime: "",
        endTime: "",
        orderNo: "",              //收货单号
        purchaseOrderNo: "",      //采购单号
        notificationType: 'procure',
        pageNum: 1,
        pageSize: 20,
        receivingStatus: "receiving",      //收货状态
        receiptReturnType: 'receipt',
        salesman: "",             //业务员
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        createTimeArr: [],
        deliveryDate: [],
      }
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  watch: { activeName() { this.initData() } },
  methods: {
    initData() {

      this.listLoading = true
      if (this.activeName === 'dataTable') {
        purPurchaseReceiptReturnGoodsList(this.listQuery).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
      } else {
        linesReceiptReturn(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
      }
      this.listLoading = true
    },
    search() {
      this.visible = false
      if (this.activeName === 'dataTable') {
        this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
        Object.keys(this.listQuery).forEach(key => { this.listQuery[key] = typeof this.listQuery[key] === 'string' ? this.listQuery[key].trim() : this.listQuery[key] })
        this.listQuery.pageNum = 1
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArr', 'startTime', 'endTime')
        this.jnpf.searchTimeFormat(this.linesQuery, 'deliveryDate', 'deliverDateStart', 'deliverDateEnd')
        Object.keys(this.linesQuery).forEach(key => { this.linesQuery[key] = typeof this.linesQuery[key] === 'string' ? this.linesQuery[key].trim() : this.linesQuery[key] })
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
      this.initData()
    },
    addOrUpdateHandle(id, readOnly) {
      if (readOnly) {
        this.detailFormVisible = true
        this.$nextTick(() => { this.$refs.DetailForm.init(id, 'look') })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(id, readOnly, 'procure', 'notice') })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (this.activeName === 'dataTable') {
        if (prop === 'purchaseOrderNo') { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (['orderNo', 'purchaseOrderNo', 'productName', 'productDrawingNo', 'createTime'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.linesQuery.orderItems[0].asc = order === 'ascending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.search()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      if (isRefresh) { this.initData() }
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />