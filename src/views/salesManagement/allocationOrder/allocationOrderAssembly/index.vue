<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单据列表" name="orderForm">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.orderNo" @keyup.enter.native="search()" placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerName" @keyup.enter.native="search()"
                      placeholder="请输入客户名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="orderForm.distributeStatus" placeholder="请选择分配状态" style="width: 100%;">
                      <el-option v-for="item in distributeStatusList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
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
                  @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" :disabled="btnLoading" @click="allocation" type="primary" :loading="btnLoading">一键分配</el-button>
                  <el-button size="mini" :disabled="btnLoading" @click="allocationPlan" type="primary" :loading="btnLoading">一键分配转计划</el-button>
                </div>

              </div>
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column @selection-change="handleSelectionChange" :hasC="orderForm.distributeStatus=='undistributed'">
                <el-table-column prop="orderNo" label="订单号" width="180" fixed="left" sortable="custom" />
                <el-table-column prop="orderType" label="订单类型" width="150" sortable="custom">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderList" :key="index">
                      <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="cooperativePartnerCode" label="客户编码" fixed="left" width="160" sortable="custom" />
                <el-table-column prop="cooperativePartnerName" label="客户名称" fixed="left" width="160" sortable="custom" />
                <el-table-column prop="salesName" label="所属销售" width="160" />
                <el-table-column prop="departmentName" label="所属部门" width="160" />
                <el-table-column prop="workOrderNo" label="工作令号" width="160" />
                <el-table-column prop="sourceOrderNo" label="来源单号" width="160" />
                <el-table-column prop="orderDate" label="订单日期" width="160" sortable="custom" />
                <el-table-column prop="contractNo" label="客户合同号" width="160" sortable="custom" />
                <el-table-column prop="deliveryDate" label="交货日期" width="160" sortable="custom" />
                <!-- <el-table-column prop="delivery" label="发货方式" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in departMentList" :key="index">
                      <span v-if="item.value == scope.row.delivery">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="recipient" label="收件人" width="160" />
                <el-table-column prop="phone" label="收件人电话" width="160" />
                <el-table-column prop="orderState" label="订单状态" width="160">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderStateList" :key="index">
                      <span v-if="item.value == scope.row.orderState">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="paymentMethod" label="付款方式" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in paymentMethodList" :key="index">
                      <span v-if="item.enCode == scope.row.paymentMethod">{{ item.fullName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="paymentCycle" label="付款周期" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in paymentCycleList" :key="index">
                      <span v-if="item.enCode == scope.row.paymentCycle">{{ item.fullName }}</span>
                    </div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" min-width="160" />
                <el-table-column prop="distributeStatus" label="分配状态" width="120" sortable="custom" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.distributeStatus === 'undistributed'">未分配</el-tag>
                    <el-tag type="success" v-else-if="scope.row.distributeStatus === 'distributed'">已分配</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="allocateOrders(scope.row.id, 'fp')"
                      :disabled="scope.row.distributeStatus === 'distributed'">分配订单</el-button>
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="allocateOrders(scope.row.id, 'look')">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="detailForm">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="detailForm.orderNo" placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="detailForm.cooperativePartnerName" placeholder="请输入客户名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="detailForm.customerProductDrawingNo" placeholder="请输入客户产品图号" clearable />
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
                  @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" @click="allocationDetail" :disabled="btnLoading" type="primary" :loading="btnLoading">一键分配</el-button>
                  <el-button size="mini" @click="allocationPlanDetail" :disabled="btnLoading" type="primary"
                    :loading="btnLoading">一键分配转计划</el-button>
                </div>

              </div>
              <JNPF-table ref="detailTable" v-loading="listLoading" :data="detailData" :fixedNO="true"
                @sort-change="sortChange" custom-column @selection-change="handleSelectionChangeDetail" :hasC="detailForm.distributeStatus=='undistributed'" :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="订单号" width="180" fixed="left" sortable="custom" />
                <el-table-column prop="cooperativePartnerCode" label="客户编码" fixed="left" width="160" sortable="custom" />
                <el-table-column prop="cooperativePartnerName" label="客户名称" fixed="left" width="160" sortable="custom" />
                <el-table-column prop="customerProductDrawingNo" label="客户产品图号" fixed="left" width="160"
                  sortable="custom" />
                <el-table-column prop="orderType" label="订单类型" width="150" sortable="custom">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderList" :key="index">
                      <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="orderDate" label="订单日期" width="160" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" width="120" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" width="120" sortable="custom" />
                <el-table-column prop="drawingNo" label="产品图号" width="120" sortable="custom" />
                <el-table-column prop="num" label="数量(主)" width="200" />
                <el-table-column prop="mainUnit" label="单位(主)" width="120" />
                <el-table-column prop="utilizationQuantity" label="利用库存数量" width="200" />
                <el-table-column prop="productionQuantity" label="需生产数量" width="200" />
                <el-table-column prop="purchaseQuantity" label="需采购数量" width="200" />
                <el-table-column prop="outsourcingQuantity" label="需外协数量" width="200" />
                <el-table-column prop="deliveryDate" label="交货日期" width="160" sortable="custom" />
                <el-table-column v-for="item in customList" :key="item.prop" :prop="item.prop" :label="item.label"
                  min-width="180" :formatter="filterateLabel" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="160" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="allocateOrders(scope.row.ordersId, 'fp')"
                      :disabled="orderForm.distributeStatus === 'distributed'">分配订单</el-button>
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="allocateOrders(scope.row.ordersId, 'look')">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="detailForm.pageNum" :limit.sync="detailForm.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <!-- 主表更多搜索 -->
        <el-form v-if="activeName === 'orderForm'" :model="orderForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="订单号">
              <el-input v-model="orderForm.orderNo" placeholder="请输入订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="orderForm.cooperativePartnerCode" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="orderForm.cooperativePartnerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单类型">
              <el-select v-model="orderForm.orderType" placeholder="请选择订单类型" clearable>
                <el-option v-for="(item, index) in orderList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配状态">
              <el-select v-model="orderForm.distributeStatus" placeholder="请选择分配状态" style="width: 100%;">
                <el-option v-for="item in distributeStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属销售">
              <el-select v-model="orderForm.salesName" placeholder="请选择所属销售" filterable clearable>
                <el-option v-for="(item, index) in salespersonList" :key="index" :label="item.realName"
                  :value="item.realName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作令号">
              <el-input v-model="orderForm.workOrderNo" placeholder="请输入工作令号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="orderForm.sourceOrderNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单日期">
              <el-date-picker v-model="orderForm.orderDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" :picker-options="global.timePickerOptions" start-placeholder="开始日期"
                end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户合同号">
              <el-input v-model="orderForm.contractNo" placeholder="请输入客户合同号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="orderForm.deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" :picker-options="global.timePickerOptions" start-placeholder="开始日期"
                end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="orderForm.createTimeArr" type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
                :picker-options="global.timePickerOptions" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"
                start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 明细表更多搜索 -->
        <el-form v-else :model="detailForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="订单号">
              <el-input v-model="detailForm.orderNo" placeholder="请输入订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="detailForm.cooperativePartnerCode" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="detailForm.cooperativePartnerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户产品图号">
              <el-input v-model="detailForm.customerProductDrawingNo" placeholder="请输入客户产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="detailForm.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="detailForm.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="detailForm.drawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="detailForm.deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" :picker-options="global.timePickerOptions" start-placeholder="开始日期"
                end-placeholder="结束日期" clearable>
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
  </div>
</template>

<script>
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { UserListAll } from '@/api/permission/user'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, distribute, distributeTransferPlan } from '@/api/salesManagement/assemblyOrders'
import Form from './Form'
export default {
  components: { Form },
  data() {
    return {
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      detailData: [],
      detailTableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,

      organizeIdTree: [],
      activeName: "orderForm",
      salespersonList: [],
      flag: true,
      detailFlag: false,
      shipmentsStateList: [
        { label: "未发货", value: "unshipped" },
        { label: "部分发货", value: "partial_shipment" },
        { label: "发货完成", value: "shipment_completed" },
      ],
      orderStateList: [
        { label: "未完成", value: "not_finish" },
        { label: "已完成", value: "finish" },
        { label: "已停止", value: "stopped" },
      ],
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],
      orderProduceStateList: [
        { label: "未开始", value: "not_started" },
        { label: "已排计划", value: "planned" },
        { label: "已开始生产", value: "start_production" },
        { label: "已生产完成", value: "production_completed" },

      ],
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],

      departMentList: [
        { lebel: "送货", value: "deliver_goods" },
        { lebel: "自提", value: "self_pickup" },
        { lebel: "快递", value: "express_delivery" },
        { lebel: "货运", value: "freight_transport" },
        { lebel: "到付", value: "collect_payment" },
      ],
      distributeStatusList: [
        { label: '已分配', value: 'distributed' },
        { label: '未分配', value: 'undistributed' }
      ],
      paymentMethodList: [],
      paymentCycleList: [],

      initialOrderForm: {
        orderNo: "",
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        orderType: "",
        salesName: "",
        workOrderNo: "",
        sourceOrderNo: "",
        orderStartDate: "",
        orderEndDate: "",
        contractNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        orderState: "not_finish",
        startTime: "",
        endTime: "",
        distributeStatus: "undistributed",
        orderCategory: "assembly",
        documentStatus: "submit",
        orderDateArr: [],
        deliveryDateArr: [],
        createTimeArr: [],
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
      initialDetailForm: {

        // "customerProductNo": "",
        // "ordersId": 0,
        // "showStockFlag": false,
        distributeStatus: "undistributed",
        orderCategory: "assembly",
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        customerProductDrawingNo: "",
        orderNo: "",
        productCode: "",
        productName: "",
        drawingNo: "",
        deliveryDateArr: [],
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
      },
      orderForm: {},
      detailForm: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      total: 0,
      formVisible: false,
      allocationList: [],
      allocationDetailList: [],
      btnLoading: false,
    }
  },
  created() {
    this.orderForm = JSON.parse(JSON.stringify(this.initialOrderForm))
    this.detailForm = JSON.parse(JSON.stringify(this.initialDetailForm))
    this.getUserList()
    this.initData()
    this.getAttributeline()
    this.getDictionaryType()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    // 一键分配 一键分配转计划 单据列表
    handleSelectionChange(val) {
      console.log("单据", val);
      this.allocationList = []
      if (val.length) {
        val.forEach(item => {
          this.allocationList.push(item.id)
        });
      }
    },
    allocation() {
      if (!this.allocationList.length) return this.$message.error("请先勾选数据")
      this.btnLoading = true
      distribute(this.allocationList).then(res => {
        this.$message.success("一键分配成功")
        console.log("res=>", res)
        this.btnLoading = false
          this.initData()
      }).catch(error => {
        this.btnLoading = false

      })
    },
    allocationPlan() {
      if (!this.allocationList.length) return this.$message.error("请先勾选数据")
      this.btnLoading = true
      distributeTransferPlan(this.allocationList).then(res => {
        this.$message.success("一键分配转计划成功")
        console.log("res=>", res)
        this.btnLoading = false
          this.initData()
      }).catch(error => {
        this.btnLoading = false

      })
    },

    // 一键分配 一键分配转计划 明细列表
    handleSelectionChangeDetail(val) {
      console.log("ming", val);
      this.allocationDetailList = []
      if (val.length) {
        val.forEach(item => {
          this.allocationDetailList.push(item.ordersId)
        });
      }
    },
    allocationDetail() {
      if (!this.allocationDetailList.length) return this.$message.error("请先勾选数据")
      this.btnLoading = true
      distribute(this.allocationDetailList).then(res => {
        this.$message.success("一键分配成功")
        this.btnLoading = false
        console.log("res=>", res)
          this.initData()
      }).catch(error => [
        this.btnLoading = false

      ])
    },
    allocationPlanDetail() {
      let uniqueArr = [...new Set(this.allocationDetailList)];
      if (!this.allocationDetailList.length) return this.$message.error("请先勾选数据")
        this.btnLoading = true
      distributeTransferPlan(uniqueArr).then(res => {
        console.log("res=>", res)
        this.$message.success("一键分配转计划成功")
        this.btnLoading = false
          this.initData()
      }).catch(error => [
        this.btnLoading = false

      ])
    },
    handleClick(e) {
      this.activeName = e.name
      this.search()
    },
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "paymentMethod") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.paymentMethodList = response.data.list
                })
              }
              if (resp.enCode == "paymentCycle") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.paymentCycleList = response.data.list
                })
              }
            });
          }
        });
      })
    },
    // 获取产品列表字段 编排属性
    getAttributeline() {
      getAttributeline('product').then(res => {
        this.customList = []
        res.data.forEach(column => {
          // 列表中显示
          let propExists = this.customList.some(item2 => item2.prop === column.attributeColumn);
          if (!propExists) { this.customList.push({ prop: column.attributeColumn, label: column.name }) }
        })
      })
    },
    sortChange({ prop, order }) {
      let activeForm = this.activeName === "orderForm" ? this.orderForm : this.detailForm // 活跃table
      let newProp;
      if (prop === 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop === 'sealingRingName' || prop === 'productName' || prop === 'productCode') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      activeForm.orderItems[0].asc = order === "ascending"
      activeForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    // 获取销售人员
    getUserList() {
      let obj = {
        currentPage: 1,
        pageSize: -1
      }
      UserListAll(obj).then(res => {
        this.salespersonList = res.data.list
      })
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      console.log("thus.orderForm.distributeStatus", this.orderForm.distributeStatus);
      this.listLoading = true
      let initDataMethod = this.activeName === "orderForm" ? getsaleOrderList : getsaleOrderDetailList
      let activeForm = this.activeName === "orderForm" ? this.orderForm : this.detailForm // 活跃table
      if (this.activeName != "orderForm") {
        this.detailForm.distributeStatus = this.orderForm.distributeStatus
      }
      initDataMethod(activeForm).then(res => {
        if (this.activeName === "orderForm") { this.tableData = res.data.records }
        else {
          this.detailData = res.data.records 
        }
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      let activeForm = this.activeName === "orderForm" ? this.orderForm : this.detailForm // 活跃table

      Object.keys(activeForm).forEach(key => {
        let item = activeForm[key]
        activeForm[key] = typeof item === 'string' ? item.trim() : item
      })
      activeForm.pageNum = 1
      if (activeForm.orderDateArr && activeForm.orderDateArr.length > 0) {
        activeForm.orderStartDate = activeForm.orderDateArr[0]
        activeForm.orderEndDate = activeForm.orderDateArr[1]
      } else {
        activeForm.orderStartDate = ""
        activeForm.orderEndDate = ""
      }

      if (activeForm.deliveryDateArr && activeForm.deliveryDateArr.length > 0) {
        activeForm.deliveryStartDate = activeForm.deliveryDateArr[0]
        activeForm.deliveryEndDate = activeForm.deliveryDateArr[1]
      } else {
        activeForm.deliveryStartDate = ""
        activeForm.deliveryEndDate = ""
      }

      if (activeForm.createTimeArr && activeForm.createTimeArr.length > 0) {
        activeForm.startTime = activeForm.createTimeArr[0]
        activeForm.endTime = activeForm.createTimeArr[1]
      } else {
        activeForm.startTime = ""
        activeForm.endTime = ""
      }

      if (this.activeName === "orderForm") {
        if (activeForm.distributeStatus === "undistributed") { activeForm.orderState = "not_finish" }
        else { activeForm.orderState = "" }
      } else {
        if (activeForm.deliveryDateArr && activeForm.deliveryDateArr.length > 0) {
          activeForm.startTime = activeForm.deliveryDateArr[0]
          activeForm.endTime = activeForm.deliveryDateArr[1]
        } else {
          activeForm.startTime = ""
          activeForm.endTime = ""
        }
      }

      this.initData()
    },
    reset() {
      if (this.activeName === "orderForm") {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort()
        this.orderForm = JSON.parse(JSON.stringify(this.initialOrderForm))
      } else {
        this.$refs['detailTable'].$refs.JNPFTable.clearSort()
        this.detailForm = JSON.parse(JSON.stringify(this.initialDetailForm))
      }
      this.search()
    },
    allocateOrders(id, btntype) {
      this.formVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype)
        })
      }
    },
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ""
      if (cellValue.includes(":")) {
        return cellValue.replace(/:(.*?)(,|$)/g, "$2");
      } else {
        return cellValue;
      }
    },
  }
}
</script>
<style scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-head {
  padding: 10px;
}

.JNPF-common-search-box {
  padding-top: 5px;
  padding-bottom: 10px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}
</style>