<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.orderNo" placeholder="请输入退料单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.ordersNo" placeholder="请输入外协订单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.shipperName" placeholder="请输入业务员" @keyup.enter.native="search()"
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
                <el-table-column prop="orderNo" label="退料单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="ordersNo" label="外协订单号" min-width="200" />
                <el-table-column prop="partnerName" label="客户名称" min-width="120" />
                <el-table-column prop="shipperName" label="业务员" min-width="120" sortable="custom" />
                <el-table-column prop="deliverDate" label="退料日期" width="180" />
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
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入退料单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.partnerCode" placeholder="请输入外协供应商编码" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.partnerName" placeholder="请输入外协供应商名称" @keyup.enter.native="search()"
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
                @sort-change="sortChange" custom-column :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="退料单号" width="190" fixed="left" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>

                <el-table-column prop="partnerCode" label="外协供应商编码" fixed="left" width="160" sortable="custom" />
                <el-table-column prop="partnerName" label="外协供应商名称" fixed="left" width="160" sortable="custom" />
                <el-table-column prop="deliverDate" label="退料日期" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="140" />
                <el-table-column prop="productName" label="产品名称" min-width="140" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="140" sortable="custom" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="160" sortable="custom" />
                <el-table-column prop="processName" label="工序名称" min-width="140" sortable="custom" />
                <el-table-column prop="outboundQuantity" label="已入库数量" min-width="140" />
                <el-table-column prop="undeliveredQuantity" label="待入库数量" min-width="140" />
                <el-table-column prop="deliveryQuantity" label="退料数量" min-width="140" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="140" />
                <el-table-column prop="remark" label="备注" min-width="140" />
                <el-table-column prop="createTime" label="申请时间" width="200" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="申请人" width="160" sortable="custom" />
                <el-table-column label="操作" width="140" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.returnDeliveryNoticeId)" editText="检验" :hasDel="false">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, true)">
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
      <el-row :gutter="20" v-if="activeName === 'dataTable'">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="退料单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入退料单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外协订单号">
              <el-input v-model="listQuery.ordersNo" placeholder="请输入外协订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务员">
              <el-input v-model="listQuery.shipperName" placeholder="请输入业务员" clearable />
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
      </el-row>
      <el-row :gutter="20" v-else>

        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="退料单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入退料单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外协供应商编码">
              <el-input v-model="linesQuery.partnerCode" placeholder="请输入外协供应商编码" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="外协供应商名称">
              <el-input v-model="linesQuery.partnerName" placeholder="请输入外协供应商名称" clearable />
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
            <el-form-item label="工艺路线名称">
              <el-input v-model="linesQuery.routingName" placeholder="请输入工艺路线名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="linesQuery.processName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="退料日期">
              <el-date-picker v-model="linesQuery.orderDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="退料开始日期" end-placeholder="退料结束日期" clearable>
              </el-date-picker>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间">
              <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" style="width: 100%;"
                :default-time="['00:00:00', '23:59:59']">
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
import { getQuotationdatasendlist } from '@/api/salesManagement'
import { linesReceiptGoods } from '@/api/purchasingManagement/purchaseInquirySheet'

import Form from '../components/inspectionNoticeForm.vue'
// import DetailForm from '@/views/externalProcessManagement/outsourceMaterial/outsourcingReturnMaterial/Form.vue'
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
        approvalStatus: "ok", // 审批状态
        documentStatus: "submit", // 单据状态
        // fullReceiptFlag: false, // 是否已全部收货 0否1是
        inspectionStatus: "unInspect", // 检验状态 待检验 unInspect、已检验 inspected
        notifyType: 'external', // 通知单类型 外协通知 external、销售通知 sale,
        externalFlag: true, // notifyType是外协时，连同工序外协数据一起获取
        // deliveryStatus: "not_returned", // 退发货状态 待发货 undelivered 、已发货 delivered 、待退货 not_returned 、已退货 returned
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createTimeArr: [],
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        canceledFlag: true, // 过滤掉取消的单据
      },
      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        approvalStatus: "ok", // 审批状态
        documentStatus: "submit", // 单据状态
        // fullReceiptFlag: false, // 是否已全部收货 0否1是
        inspectionStatus: "unInspect", // 检验状态 待检验 unInspect、已检验 inspected
        notifyType: 'external', // 通知单类型 外协通知 external、销售通知 sale,
        externalFlag: true, // notifyType是外协时，连同工序外协数据一起获取
        // deliveryStatus: "not_returned", // 退发货状态 待发货 undelivered 、已发货 delivered 、待退货 not_returned 、已退货 returned
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        createTimeArr: [],
        orderDateArr: [],
        canceledFlag: true, // 过滤掉取消的单据
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
        getQuotationdatasendlist(this.listQuery).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArr', 'startTime', 'endTime')
        this.jnpf.searchTimeFormat(this.linesQuery, 'orderDateArr', 'rdsDate', 'rdeDate')
        linesReceiptGoods(this.linesQuery).then(res => {
          console.log("res++", res);
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    search() {
      if (this.activeName === 'dataTable') {
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
      } else {
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
    addOrUpdateHandle(id, readOnly) {
      if (readOnly) {
        this.detailFormVisible = true
        this.$nextTick(() => { this.$refs.DetailForm.init(id, 'look') })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(id, readOnly, 'back_material', 'notice') })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (['shipperName', 'partnerCode', 'partnerName', 'productName', 'productDrawingNo', 'routingName', 'processName', 'createByName'].includes(prop)) { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      if (this.activeName == "dataTable") {
        this.listQuery.orderItems[0].asc = order !== "descending"
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