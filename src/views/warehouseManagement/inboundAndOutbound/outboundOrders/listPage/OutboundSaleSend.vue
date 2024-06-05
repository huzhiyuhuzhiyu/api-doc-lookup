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
                    <el-input v-model="listQuery.orderNo" placeholder="请输入发货单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.partnerCode" placeholder="请输入客户编码" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" clearable
                      @keyup.enter.native="search()" />
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
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <el-page-header @back="$emit('close', true)" :content="'销售发货出库'" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="发货单号" width="190" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="partnerCode" label="客户编码" width="160" sortable="custom" />
                <el-table-column prop="partnerName" label="客户名称" width="160" sortable="custom" />
                <el-table-column prop="deliverDate" label="发货日期" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="recipient" label="收件人" width="160" sortable="custom" />
                <el-table-column prop="phone" label="收件人电话" width="160" />
                <el-table-column prop="region.countryName" label="国家" width="120" />
                <el-table-column prop="region.provinceName" label="省" width="120" />
                <el-table-column prop="region.cityName" label="市" width="120" />
                <el-table-column prop="region.areaName" label="区" width="120" />
                <el-table-column prop="address" label="地址" width="310" />
                <el-table-column prop="delivery" label="发货方式" width="160">
                  <template slot-scope="scope">
                    <div v-if="scope.row.delivery == 'deliver_goods'">送货</div>
                    <div v-else-if="scope.row.delivery == 'self_pickup'">自提</div>
                    <div v-else-if="scope.row.delivery == 'express_delivery'">快递</div>
                    <div v-else-if="scope.row.delivery == 'freight_transport'">货运</div>
                    <div v-else-if="scope.row.delivery == 'collect_payment'">到付</div>
                  </template>
                </el-table-column>
                <el-table-column prop="shipperName" label="发货人" width="160" sortable="custom" />
                <el-table-column prop="createTime" label="申请日期" width="200" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="申请人" width="160" sortable="custom" />
                <!-- <el-table-column prop="inspectionStatus" label="检验状态" width="120" sortable="custom" fixed="right"
                  align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.inspectionStatus == 'unInspect'">待检验</el-tag>
                    <el-tag type="success" v-else-if="scope.row.inspectionStatus == 'inspected'">已检验</el-tag>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.id)"
                      :editDisabled="!!scope.row.outboundId || scope.row.stockStatus === 'not_finished'" :editText="'出库'"
                      :hasDel="false">
                      <el-button slot="left" type="text" size="mini" :disabled="scope.row.stockStatus === 'finished'"
                        @click="addOrUpdateHandle(scope.row.id, false, 'stock')"
                        v-if="scope.row.stockStatus!=='finished'">备货</el-button>
                      <span slot="left" v-if="scope.row.stockStatus!=='finished'"> &emsp;&emsp; </span>
                      <el-button slot="left" type="text" size="mini"
                        @click="addOrUpdateHandle(scope.row.id, true, 'stock_look')" v-else>查看备货</el-button>
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
                          <!-- <el-dropdown-item v-if="scope.row.stockMoveId"
                            @click.native="addOrUpdateHandle(scope.row.stockMoveId, true, 'stock_look')">
                            查看备货
                          </el-dropdown-item> -->
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
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入发货单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.partnerCode" placeholder="请输入客户编码" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.partnerName" placeholder="请输入客户名称" @keyup.enter.native="search()"
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
              <div class="JNPF-common-head">
                <el-page-header @back="$emit('close', true)" :content="'销售发货出库'" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true"
                custom-column @sort-change="sortChange">
                <el-table-column prop="orderNo" label="发货单号" width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="partnerCode" label="客户编码" width="200" sortable="custom">
                </el-table-column>
                <el-table-column prop="partnerName" label="客户名称" width="200" sortable="custom" />
                <el-table-column prop="deliverDate" label="发货日期" width="180" sortable="custom" />
                <el-table-column prop="recipient" label="收件人" width="120" sortable="custom" />
                <el-table-column prop="phone" label="收件人电话" width="160" />
                <el-table-column prop="customerProductDrawingNo" label="客户产品图号" width="200" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" width="200" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" width="200" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" width="200" sortable="custom" />
                <el-table-column prop="outboundQuantity" label="已出库数量" width="140" />
                <el-table-column prop="undeliveredQuantity" label="待出库数量" width="140" />
                <el-table-column prop="deliveryQuantity" label="发货数量" width="140" />
                <el-table-column prop="mainUnit" label="单位" min-width="120" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="申请日期" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="申请人" width="120" />
                <el-table-column label="操作" width="140" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.returnDeliveryNoticeId)"
                      :editDisabled="!!scope.row.outboundId || scope.row.stockStatus === 'not_finished'" :editText="'出库'"
                      :hasDel="false">
                      <!-- <el-button slot="left" type="text" size="mini" :disabled="scope.row.stockStatus === 'finished'"
                        @click="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, false, 'stock')"
                        v-if="!scope.row.stockMoveId">备货</el-button>
                      <span slot="left" v-if="!scope.row.stockMoveId"> &emsp;&emsp; </span>
                      <el-button slot="left" type="text" size="mini"
                        @click="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, true, 'stock_look')"
                        v-else>查看备货</el-button> -->
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
                          <!-- <el-dropdown-item v-if="scope.row.stockMoveId"
                            @click.native="addOrUpdateHandle(scope.row.stockMoveId, true, 'stock_look')">
                            查看备货
                          </el-dropdown-item> -->
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

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :originTypeList="originTypeList" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" />

    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">

      <el-row :gutter="20">
        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="发货单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入发货单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="linesQuery.partnerCode" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="linesQuery.partnerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="发货日期">
              <el-date-picker v-model="linesQuery.deliveryDatefahuo" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择发货开始日期" end-placeholder="请选择发货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人">
              <el-input v-model="linesQuery.recipient" placeholder="请输入收件人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户产品图号">
              <el-input v-model="linesQuery.customerProductDrawingNo" placeholder="请输入客户产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间">
              <el-date-picker v-model="linesQuery.createTimeArrfahuo" type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;"
                start-placeholder="请选择申请开始时间" end-placeholder="请选择申请结束时间" clearable
                :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getQuotationdatasendlist, getQuotationdatasenddatalist } from '@/api/salesManagement'
import Form from '../Form.vue'
// import DetailForm from '@/views/salesManagement/shippingnotice/foreigntradenotice/Form.vue'
import DetailForm from '../detailForm/OutboundSaleSend.vue'
export default {
  components: { Form, DetailForm },
  props: {
    originTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableData: [],
      visible: false,
      listLoading: false,
      activeName: "dataTable",
      listQuery: {},
      initListQuery: {
        notifyType: 'sale',	// 通知单类型 外协通知 external、销售通知 sale,
        returnDeliveryType: 'delivery', //	退发类型 退货 back、发货 delivery
        orderNo: "",
        partnerCode: "",
        partnerName: "",
        delivery: '',
        shipperName: '',
        deliveryStatus: "undelivered", //	发货状态 待发货 undelivered 、已发货 delivered 、已退货 returned 、待退货 not_returned
        documentStatus: 'submit',
        approvalStatus: 'ok',
        createByName: '',
        fullReceiptFlag: '', // 是否已全部收货 0否1是
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        notifyType: 'sale',	// 通知单类型 外协通知 external、销售通知 sale,
        returnDeliveryType: 'delivery', //	退发类型 退货 back、发货 delivery
        orderNo: "",
        partnerCode: "",
        partnerName: "",
        delivery: '',
        shipperName: '',
        deliveryStatus: "undelivered", //	发货状态 待发货 undelivered 、已发货 delivered 、已退货 returned 、待退货 not_returned
        documentStatus: 'submit',
        approvalStatus: 'ok',
        createByName: '',
        fullReceiptFlag: '', // 是否已全部收货 0否1是
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createTimeArrfahuo: [],
        deliveryDatefahuo: [],
      },
      total: 0,
      formVisible: false,
      detailFormVisible: false,
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
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'deliveryDatefahuo', 'rdsDate', 'rdeDate')
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArrfahuo', 'startTime', 'endTime')
        getQuotationdatasenddatalist(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop === 'productCode' || prop === 'productName' || prop === 'productDrawingNo') { newProp = prop }
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
        this.linesQuery.createTimeArrfahuo = []
        this.linesQuery.deliveryDatefahuo = []
      }
      this.search()
    },
    addOrUpdateHandle(id, readOnly, type) {
      if (readOnly && !type) {
        this.detailFormVisible = true
        this.$nextTick(() => { this.$refs.DetailForm.init(id, 'look') })
      } else if (type === 'stock_look') {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(id, readOnly, 'outbound_stock_up') })
      } else {
        this.formVisible = true
        if (type === 'stock') {
          this.$nextTick(() => { this.$refs.Form.init(id, undefined, "outbound_stock_up") })
        } else {
          this.$nextTick(() => { this.$refs.Form.init(id, undefined, "outbound_sale_send") })
        }
      }
    },
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />