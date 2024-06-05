<!-- 出入库查询 -->
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="通知单列表" name="orderList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.orderNo" @keyup.enter.native="search()" placeholder="请输入单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.sourceNo" @keyup.enter.native="search()" placeholder="请输入来源单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.partnerName" @keyup.enter.native="search()" placeholder="请输入合作伙伴名称" clearable />
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column :fixedNO="true">
                <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row, true)">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceType" label="来源类型" :showOverflowTooltip="false" width="150">
                  <template slot-scope="scope">
                    <span>{{ sourceTypeformat(scope.row.sourceType) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceNo" label="来源单号" min-width="150" sortable="custom" />
                <el-table-column prop="partnerCode" label="合作伙伴编码" min-width="150" sortable="custom" />
                <el-table-column prop="partnerName" label="合作伙伴名称" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="documentType" label="单据类型" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentType == 'outbound'">出库</div>
                    <div v-if="scope.row.documentType == 'inbound'">入库</div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                <el-table-column label="操作" fixed="right" width="120">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleUserRelation(scope.row, true)">查看详情</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="detailList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入单号" @keyup.enter.native="search()" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" @keyup.enter.native="search()" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.drawingNo" placeholder="请输入产品图号" @keyup.enter.native="search()" clearable />
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true" style="height: 100%;" custom-column @sort-change="sortChange">
                <el-table-column prop="orderNo" label="单号" width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation1(scope.row, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="200" />
                <el-table-column prop="productName" label="产品名称" width="200" sortable="custom" />
                <el-table-column prop="drawingNo" label="产品图号" width="200" sortable="custom" />
                <el-table-column prop="routingName" label="工艺路线名称" width="140" />
                <el-table-column prop="processName" label="工序名称" width="140" />
                <el-table-column prop="documentType" label="单据类型" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentType == 'outbound'"><el-tag type="danger">出库</el-tag></div>
                    <div v-if="scope.row.documentType == 'inbound'"><el-tag type="success">入库</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="num" label="数量（主）" min-width="120" />
                <el-table-column prop="mainUnit" label="单位（主）" min-width="120" />
                <el-table-column prop="deputyNum" label="数量（副）" min-width="120" />
                <el-table-column prop="deputyUnit" label="单位（副）" min-width="120" />
                <el-table-column prop="originalBatchNumber" label="产品原批号" min-width="120" />
                <el-table-column prop="batchNumber" label="批次号" min-width="120" sortable="custom" />
                <el-table-column prop="remark" label="备注" min-width="120" />
                <el-table-column prop="sourceType" label="来源类型" :showOverflowTooltip="false" width="150" sortable="custom">
                  <template slot-scope="scope">
                    <span>{{ sourceTypeformat(scope.row.sourceType) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceNo" label="来源单号" width="180" sortable="custom" />
                <el-table-column prop="partnerCode" label="合作伙伴编码" width="200" sortable="custom" />
                <el-table-column prop="partnerName" label="合作伙伴名称" width="200" sortable="custom" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="120" />
                <el-table-column label="操作" fixed="right" width="120">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleUserRelation1(scope.row, true)">查看详情</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize" @pagination="initData">
                <div><span>入库合计数量(主)：{{totalNum}}</span>&nbsp;&nbsp;<span>入库合计数量(副)：{{totaldeputyNum}}</span>&nbsp;&nbsp;<span>出库合计数量(主)：{{tooutboundtalNum}}</span>&nbsp;&nbsp;<span>出库合计数量(副)：{{tooutboundtaldeputyNum}}</span></div>
              </pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 更多搜索 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20" v-if="activeName === 'orderList'">
        <el-form :model="dataForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="单号">
              <el-input v-model="dataForm.orderNo" placeholder="请输入单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="dataForm.originNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作伙伴编码">
              <el-input v-model="dataForm.partnerCode" placeholder="请输入合作伙伴编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作伙伴名称">
              <el-input v-model="dataForm.partnerName" placeholder="请输入合作伙伴名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据类型">
              <el-select v-model="dataForm.documentType" placeholder="请选择单据类型" filterable clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createTimeArrsta" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < limit || time.getTime() > Date.now()
                        }
                      }" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="创建开始时间" end-placeholder="创建结束时间" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row :gutter="20" v-else>
        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="linesQuery.originNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作伙伴编码">
              <el-input v-model="linesQuery.partnerCode" placeholder="请输入合作伙伴编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作伙伴名称">
              <el-input v-model="linesQuery.partnerName" placeholder="请输入合作伙伴名称" clearable />
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
            <el-form-item label="批次号">
              <el-input v-model="linesQuery.batchNumber" placeholder="请输入批次号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据类型">
              <el-select v-model="dataForm.documentType" placeholder="请选择单据类型" filterable clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createTimeArrfahuo" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" clearable :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < limit || time.getTime() > Date.now()
                        }
                      }">
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
    <Form1 v-if="formVisible1" ref="Form1" @refreshDataList="initData" @close="closeForm1" :originTypeList="originTypeList1" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :originTypeList="originTypeList" />
  </div>
</template>
  
<script>
import Form from "../outbound/Form.vue";
import Form1 from "../inbound/Form.vue";
import originTypeList from "../../inboundAndOutbound/originTypeList.js"
import { getWarehouseList, getWarehouseLinesList } from '@/api/warehouseManagement/inboundAndOutbound'
export default {
  name: 'ioboundQuery',
  components: { Form, Form1 },
  data () {
    return {
      originTypeList1: originTypeList.inboundList,
      originTypeList: originTypeList.outboundList,
      formVisible1: false,
      formVisible: false,
      limit: 0,
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      activeName: "orderList",
      orderList: [
        { label: "采购入库", value: "inbound_purchase" },
        { label: "外协入库", value: "inbound_external" },
        { label: "外协退料入库", value: "inbound_external_return" },
        { label: "生产工单入库", value: "inbound_production" },
        { label: "生产订单入库", value: "inbound_order_production" },
        { label: "调拨入库", value: "inbound_transfer" },
        { label: "退料入库", value: "inbound_return_materials" },
        { label: "移库入库", value: "inbound_move" },
        { label: "销售退货入库", value: "inbound_sale_return" },
        { label: "组装入库", value: "inbound_merge" },
        { label: "拆卸入库", value: "inbound_split" },
        { label: "盘盈入库", value: "inbound_profit" },
        { label: "形态转换入库", value: "inbound_shift" },
        { label: "报废入库", value: "inbound_scrap" },
        { label: "生产入库", value: "inbound_mock_production" },
        { label: "其他", value: "io_other" },
        { label: "销售发货出库", value: "outbound_sale_send" },
        { label: "采购退货出库", value: "outbound_purchase" },
        { label: "外协退货出库", value: "outbound_external" },
        { label: "调拨出库", value: "outbound_transfer" },
        { label: "领料出库", value: "outbound_pick_out" },
        { label: "移库出库", value: "outbound_move" },
        { label: "组装出库", value: "outbound_merge" },
        { label: "拆卸出库", value: "outbound_split" },
        { label: "盘亏出库", value: "outbound_loss" },
        { label: "形态转换出库", value: "outbound_shift" },
        { label: "外协发料出库", value: "outbound_external_send" },
        { label: "报废出库", value: "outbound_scrap" }
      ],
      visible: false,
      createTimeArrsta: [],
      tableData: [],
      listLoading: false,
      documentStateList: [
        { label: "入库", value: "inbound" },
        { label: "出库", value: "outbound" },
      ],
      dataForm: {},
      dataFormlist: {
        warehouseType: "normal",
        endTime: '',
        startTime: '',
        orderNo: '',
        originNo: '',
        partnerCode: '',
        partnerName: '',
        documentType: '',
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
      linesQuery: {},
      linesQuery1: {},
      linesQuerylist: {
        warehouseType: "normal",
        orderNo: '',
        endTime: '',
        startTime: '',
        originNo: '',
        productName: '',
        documentType: '',
        productDrawingNo: '',
        partnerName: '',
        batchNumber: '',
        productCode: '',
        partnerCode: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
      },
      total: 0,
      toTableData: [],
      toTableData1: []
    }
  },
  created () {
    this.dataForm = JSON.parse(JSON.stringify(this.dataFormlist))
    this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
    this.limittime()
    this.search()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  watch: {
    activeName () {
      this.reset()
    }
  },
  computed: {
    totalNum: function () {
      var totalNum = 0;
      for (var i = 0; i < this.toTableData.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.toTableData[i].num])
      }
      return totalNum
    },
    totaldeputyNum: function () {
      var totaldeputyNum = 0;
      for (var i = 0; i < this.toTableData.length; i++) {
        totaldeputyNum = this.jnpf.math('add', [totaldeputyNum, this.toTableData[i].deputyNum])
      }
      return totaldeputyNum
    },
    tooutboundtalNum: function () {
      var tooutboundtalNum = 0;
      for (var i = 0; i < this.toTableData1.length; i++) {
        tooutboundtalNum = this.jnpf.math('add', [tooutboundtalNum, this.toTableData1[i].num])
      }
      return tooutboundtalNum
    },
    tooutboundtaldeputyNum: function () {
      var tooutboundtaldeputyNum = 0;
      for (var i = 0; i < this.toTableData1.length; i++) {
        tooutboundtaldeputyNum = this.jnpf.math('add', [tooutboundtaldeputyNum, this.toTableData1[i].deputyNum])
      }
      return tooutboundtaldeputyNum
    },
  },
  methods: {
    sourceTypeformat (val) {
      let a = this.orderList.find(item => item.value === val)
      return a ? a.label : ''
    },
    closeForm (isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },
    closeForm1 (isRefresh) {
      this.formVisible1 = false
      if (isRefresh) { this.initData() }
    },
    //限制时间
    limittime () {
      const end = new Date()
      end.setMonth(end.getMonth() - 6);
      end.setTime(end.getTime())
      this.limit = Date.parse(end)
    },
    handleClick (e) {
      this.activeName = e.name
    },
    sortChange ({ prop, order }) {
      let newProp;
      if (this.activeName == "orderList") {
        if (prop === 'partnerCode' || prop === 'partnerName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.dataForm.orderItems[0].asc = order === "ascending"
        this.dataForm.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (prop === 'partnerName' || prop === 'partnerCode' || prop === 'createTime') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.linesQuery.orderItems[0].asc = order !== "descending"
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    initData () {
      this.listLoading = true
      if (this.activeName == "orderList") {
        getWarehouseList(this.dataForm).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
          this.visible = false
        })
      } else {
        this.linesQuery1 = JSON.parse(JSON.stringify(this.linesQuery))
        this.linesQuery1.pageSize = -1
        getWarehouseLinesList(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
          this.visible = false
        })
        getWarehouseLinesList(this.linesQuery1).then(res => {
          this.toTableData = res.data.records.filter((item) => {
            return item.documentType == 'inbound'
          })
          this.toTableData1 = res.data.records.filter((item) => {
            return item.documentType == 'outbound'
          })
        }).catch(() => {

        })
      }
    },
    search () {
      if (this.activeName == "orderList") {
        if (this.createTimeArrsta && this.createTimeArrsta.length > 0) {
          this.dataForm.startTime = this.createTimeArrsta[0].replace(/ 0(?!0)/g, " ")
          this.dataForm.endTime = this.createTimeArrsta[1].replace(/ 0(?!0)/g, " ")
        } else {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          this.dataForm.startTime = this.jnpf.dateFormat(start, 'YYYY-MM-DD HH:mm:ss')
          this.dataForm.endTime = this.jnpf.dateFormat(end, 'YYYY-MM-DD HH:mm:ss')
        }
        Object.keys(this.dataForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.dataForm[key]
          this.dataForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.dataForm.pageNum = 1
      } else {
        if (this.createTimeArrfahuo && this.createTimeArrfahuo.length > 0) {
          this.linesQuery.startTime = this.createTimeArrfahuo[0].replace(/ 0(?!0)/g, " ")
          this.linesQuery.endTime = this.createTimeArrfahuo[1].replace(/ 0(?!0)/g, " ")
        } else {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          this.linesQuery.startTime = this.jnpf.dateFormat(start, 'YYYY-MM-DD HH:mm:ss')
          this.linesQuery.endTime = this.jnpf.dateFormat(end, 'YYYY-MM-DD HH:mm:ss')
        }
        Object.keys(this.linesQuery).forEach(key => { // 清除搜索条件两端空格
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1 // 重置页码
      }
      this.initData()
    },
    reset () {
      if (this.activeName == "orderList") {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.createTimeArrsta = []
        this.dataForm = JSON.parse(JSON.stringify(this.dataFormlist))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
        this.createTimeArrfahuo = []
      }
      this.search()
    },
    handleUserRelation (row, btnType) {
      if (row.documentType == "outbound") {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row.id, btnType)
        })
      } else {
        this.formVisible1 = true
        this.$nextTick(() => {
          this.$refs.Form1.init(row.id, btnType)
        })
      }
    },
    handleUserRelation1 (row, btnType) {
      if (row.documentType == "outbound") {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row.moveId, btnType)
        })
      } else {
        this.formVisible1 = true
        this.$nextTick(() => {
          this.$refs.Form1.init(row.moveId, btnType)
        })
      }
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />