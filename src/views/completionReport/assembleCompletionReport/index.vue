<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="aaa">
        <el-tab-pane label="按生产任务报工" name="produce">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="produceForm.orderNo" @keyup.enter.native="searchProductData()" placeholder="生产任务单号"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="produceForm.productDrawingNo" @keyup.enter.native="searchProductData()" placeholder="品名规格"
                      clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="计划开始日期">
                    <el-date-picker v-model="planDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                      :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>

                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductData()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>

                  <el-button size="mini" type="danger" icon="el-icon-close" @click.native="Cancelshipment()">
                    关单
                  </el-button>

                </div>
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
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="produceData" :fixedNO="true"
                @sort-change="sortChange" custom-column @selection-change="handleSelectionChange" hasC>
                <el-table-column prop="orderNo" label="生产任务单号" min-width="180" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="orderType" label="任务类型" width="120" sortable="custom">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderList" :key="index">
                      <span v-if="item.value == scope.row.orderTypeList">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" width="160" sortable="custom" />
                <el-table-column prop="productName" label="产品编码" width="160" sortable="custom" />
                <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" width="160"></el-table-column>
                <el-table-column prop="productionQuantity" label="总生产数量" width="160"
                  sortable="custom"></el-table-column>
                <el-table-column prop="completedQuantity" label="已完成数量" width="160"></el-table-column>
                <el-table-column prop="routingName" label="工艺路线名称" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="routingCode" label="工艺路线编码" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" sortable="custom" />
                <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" sortable="custom" />
                <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
                <el-table-column prop="oil" label="油脂" width="100" sortable="custom" />
                <el-table-column prop="oilQuantity" label="油脂量" min-width="120" sortable="custom" />
                <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" />
                <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom" />
                <el-table-column prop="packagingMethod" label="特殊要求" min-width="120" sortable="custom" />
                <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="120" sortable="custom" />
                <el-table-column prop="planStartDate" label="计划开始日期" min-width="120" sortable="custom" />
                <el-table-column prop="planEndDate" label="计划结束日期" min-width="120" sortable="custom" />
                <el-table-column prop="urgentFlag" label="是否紧急" min-width="120" sortable="custom" />



                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <!-- <el-table-column prop="approvalStatus" fixed="right" label="审批状态" width="120" sortable="custom"
                  :showOverflowTooltip="false" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag
                        type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag
                        type="danger">审批拒绝</el-tag></div>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="addOrUpdateHandle(scope.row.id, 'edit')">报工</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="handleDel(scope.row.id)">查看详情</el-button>

                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="produceForm.pageNum" :limit.sync="produceForm.pageSize"
                @pagination="searchProductData">
              </pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按班组报工" name="workgroup">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerCode" @keyup.enter.native="search()"
                      placeholder="班组名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.drawNo" @keyup.enter.native="search()" placeholder="班组编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建时间">
                    <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" :picker-options="pickerOptions" start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
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

                <div class="JNPF-common-head-right">

                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column hasC @selection-change="selectWithdrawDataFun">

                <el-table-column prop="cooperativePartnerCode" label="班组名称" width="160" sortable="custom" />
                <el-table-column prop="cooperativePartnerName" label="班组编码" width="160" sortable="custom" />

                <!-- <el-table-column prop="shipmentStatus" label="发货状态" width="120">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in partialList" :key="index">
                      <span v-if="item.value == scope.row.shipmentStatus">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column> -->



                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="180" sortable="custom" />
                <!-- <el-table-column prop="approvalStatus" fixed="right" label="审批状态" width="120" sortable="custom"
                  :showOverflowTooltip="false" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag
                        type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag
                        type="danger">审批拒绝</el-tag></div>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="addOrUpdateHandle(scope.row.id, 'edit')">报工</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="handleDel(scope.row.id)">查看报工记录</el-button>

                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="initData">
              </pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按人员报工" name="response">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderDetailForm.orderNo" @keydown.enter.native="searchDetail()"
                      placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderDetailForm.cooperativePartnerCode" @keydown.enter.native="searchDetail()"
                      placeholder="请输入客户编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderDetailForm.cooperativePartnerName" @keydown.enter.native="searchDetail()"
                      placeholder="请输入客户名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchDetail()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetDetail()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addSupplier('', 'add')">
                  <el-button type="primary" size="mini" icon="el-icon-download"
                    @click="exportForm('detailTableData')">导出</el-button>
                </topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initDataDetail()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="detailTableData" v-loading="listLoading" :data="detailTableData" :fixedNO="true"
                @sort-change="sortChangeDetail" custom-column :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="订单号" min-width="180" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native.stop="handleUserRelation(scope.row.ordersId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="itemNumber" label="项号" width="80" />
                <el-table-column prop="cooperativePartnerCode" label="客户编码" width="120" sortable="custom" />
                <el-table-column prop="cooperativePartnerName" label="客户名称" width="120" sortable="custom" />
                <!-- <el-table-column prop="customerProductNo" label="客户产品编码" min-width="150" sortable="custom">
                </el-table-column> -->
                <el-table-column prop="customerProductNo" label="客户物料号" min-width="150" />
                <el-table-column prop="customerProductDrawingNo" label="客户产品图号" min-width="150" sortable="custom">

                </el-table-column>
                <el-table-column prop="orderType" label="订单类型" :showOverflowTooltip="false" width="150">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderList" :key="index">
                      <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="orderDate" label="订单日期" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="120" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" width="120" sortable="custom" />
                <el-table-column prop="drawingNo" label="产品图号" width="160" sortable="custom" />
                <el-table-column prop="shipmentStatus" label="发货状态" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.shipmentStatus == 'not_finish'">未完成</div>
                    <div v-else-if="scope.row.shipmentStatus == 'finish'">已完成</div>
                    <div v-else-if="scope.row.shipmentStatus == 'stopped'">已停止</div>
                  </template>
                </el-table-column>
                <el-table-column prop="num" label="数量(主)" width="160" />
                <el-table-column prop="mainUnit" label="单位(主)" width="160" />
                <el-table-column prop="assistantNum" label="数量(副)" width="160" />
                <el-table-column prop="outboundQuantity" label="已出库数量" width="160" />
                <el-table-column prop="undeliveredQuantity" label="待出库数量" width="160" />
                <el-table-column prop="returnQuantity" label="退货数量" width="160" />
                <el-table-column prop="deputyUnit" label="单位(副)" width="160" />
                <el-table-column prop="price" label="含税单价" width="160"></el-table-column>
                <el-table-column prop="taxRate" label="税率%" width="160"></el-table-column>
                <el-table-column prop="totalAmount" label="金额(含税)" width="160"></el-table-column>
                <el-table-column prop="deliveryDate" label="交货日期" width="160" sortable="custom"></el-table-column>
                <el-table-column v-for="item in customList" :key="item.prop" :prop="item.prop" :label="item.label"
                  min-width="180" :formatter="filterateLabel" />

                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="documentStatus" fixed="right" label="单据状态" width="120" sortable="custom"
                  :showOverflowTooltip="false" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                    <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注1" width="160" />
                <el-table-column prop="remark2" label="备注2" width="160" />
                <el-table-column prop="approvalStatus" fixed="right" label="审批状态" width="120" sortable="custom"
                  :showOverflowTooltip="false" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag
                        type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag
                        type="danger">审批拒绝</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <!-- <tableOpts @edit="addOrUpdateHandle(scope.row.ordersId, 'edit')" @del="handleDetailDel(scope.row.ordersId)"> -->
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click.stop="addOrUpdateHandle(scope.row.ordersId, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click.stop="handleDetailDel(scope.row.ordersId)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.ordersId, 'look')">
                          查看详情
                        </el-dropdown-item>
                        <!-- :disabled="scope.row.distributeStatus!='undistributed'" -->
                        <el-dropdown-item @click.native="getCopyOrders(scope.row.ordersId, 'copy')">
                          复制订单
                        </el-dropdown-item>

                      </el-dropdown-menu>
                    </el-dropdown>
                    <!-- </tableOpts> -->
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="detailTotal" :page.sync="orderDetailForm.pageNum"
                :limit.sync="orderDetailForm.pageSize" @pagination="initDataDetail" />

            </div>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>



  </div>
</template>

<script>
import { prodOrderClose } from '@/api/productOrdes/finishedProductOrders.js'



import { UserListAll, } from '@/api/permission/user'
import { excelExport } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, getSaleordersTotal, batchRevokeorders } from '@/api/salesManagement/assemblyOrders'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  name: 'carrierProfile',
  components: { ExportForm, },
  data() {
    return {
      produceForm: {
        orderNo: "",
        productDrawingNo: "",
        planSsd: "",
        planSed: "",
        orderStatus: "normal",
        documentStatus: "submit",
        classAttribute: "finish_product",
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
      planDate: [],
      superQueryVisible: false,
      orderTypeList: [
        { label: "正常订单", value: "normal" },
        { label: "返工订单", value: "rework" },
      ],
      selectArr:[],
      produceTotal:0,
      produceData:[],



      orderFollowVisible: false,
      productFormVisible: false,
      exportFormVisible: false,
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      detailVisible: false,
      treeData: [],
      tableData: [],
      tableData1: [],
      detailTableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      activeName: "produce",
      salespersonList: [],
      detailFlag: false,
      orderStateList: [
        { label: "未完成", value: "not_finish" },
        { label: "已完成", value: "finish" },
        { label: "部分完成", value: "part_finish" },
      ],
      partialList: [
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
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" },
      ],
      paymentMethodList: [],
      paymentCycleList: [],
      orderForm: {
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
        orderCategory: "assembly",
        shipmentStatus: "",
        orderState: "",
        productionStatus: "",
        documentStatus: "",
        approvalStatus: "",
        startTime: "",
        endTime: "",

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
      orderDetailForm: {
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        customerProductDrawingNo: "",
        // customerProductNo: "",
        orderType: "",
        drawingNo: "",
        customerProductNo: "",
        orderNo: "",
        productCode: "",
        productName: "",
        shipmentStatus: '',
        orderCategory: "assembly",
        orderStartDate: "",
        orderEndDate: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        startTime: "",
        endTime: "",
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
      detailTotal: 0,
      salespersonList: [],
      pickerOptions: {
        disabledDate(time) {
          // 获取当前日期
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // 获取6个月前的日期
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          sixMonthsAgo.setHours(0, 0, 0, 0);
          // 如果选择的日期范围超过6个月，或者结束日期不是当前日期，则禁用
          return time.getTime() < sixMonthsAgo || time.getTime() > today;
        }
      },
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      createTimeArr: [],
      deliveryDateArr: [],
      orderDateArr: [],
      CompletionDate: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      filterText: '',
      totalDataForm: {},
      orderForm1: {},
      withdrawData: [],
      btnLoading: false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },

  created() {
 
  
    this.searchProductData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    columnSetFun() {

    },
      // 多选
      handleSelectionChange(val) {
      this.selectArr = val
    },
        //禁用复选框
        checkSelectable(row) {
      if (row.orderStatus !== 'normal' || row.orderStatus == 'suspend' || row.documentStatus == 'draft') {
        console.log(222);
        return false
      } else {
        console.log(333);
        return true

      }
    },
     // 关单
     Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error("请选择您要关单的任务")
      this.$confirm('您确认关闭选中的任务吗？', this.$t('common.tipTitle'), {
        type: 'warning',
        customClass: 'custom-confirm',
      }).then(() => {

        let arr = this.selectArr.map(item => {
          return item.id
        })
        console.log(arr)
        prodOrderClose(arr).then(res => {
          console.log(555);
          this.$message.success("关单成功")
          this.search()
        }).catch(() => {
        })
      }).catch(() => { })
    },

    searchProductData(){
      ordershengchanList(this.produceForm).then(res=>{
        this.produceData=res.data.records
        this.produceTotal=res.data.total
      })
    },

















    batchWithdraw() {
      // 批量撤回
      if (this.withdrawData.length) {
        this.btnLoading = true
        let idList = this.withdrawData.map(item => item.id)
        this.$confirm('您确定要撤回吗？', this.$t('common.tipTitle'), {
          type: 'warning'
        }).then(() => {
          // 验证下一步流程是否撤回 调接口
          batchRevokeorders(idList).then(res => {
            // 有 代表下一步还在进行 需要进行提示 提示再响应拦截处理 显示时间3秒 
            if (res.msg == 'Success') {
              this.$message({
                message: '撤回成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false
                  this.initData()
                }
              })
            }
            this.btnLoading = false
          }).catch(() => { this.btnLoading = false })
        }).catch(() => { this.btnLoading = false })
      } else {
        this.$message.warning('请选择需要撤回的数据！')
      }
    },

    selectWithdrawDataFun(val) {
      this.withdrawData = val
    },




    getSaleordersTotal() {
      let data = {
        num: "0",
        outboundQuantity: "0",
        undeliveredQuantity: "0",
        returnQuantity: "0",
        totalAmount: "0",

      }
      getSaleordersTotal(this.orderDetailForm).then(res => {
        this.totalDataForm = res.data ? res.data : data
      })
    },
    initDataDetail() {
      this.listLoading = true
      getsaleOrderDetailList(this.orderDetailForm).then(res => {
        this.detailTableData = res.data.records
        this.detailTotal = res.data.total
        this.listLoading = false
        this.detailVisible = false
        this.$forceUpdate()
      }).catch(() => {
        this.listLoading = false
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
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ""
      if (cellValue.includes(":")) {
        return cellValue.replace(/:(.*?)(,|$)/g, "$2");
      } else {
        return cellValue;
      }
    },
    moreQueriesDetail() {
      this.detailVisible = true
    },
    handleClick(e) {
      if (e.index == '0') {
        this.search()
      } else {
        this.resetDetail()
        this.getSaleordersTotal()
      }
      let endDate = new Date().toISOString().slice(0, 10);
      let startDate = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().slice(0, 10);
      this.orderDateArr[0] = startDate
      this.orderDateArr[1] = endDate
      this.orderForm.orderStartDate = startDate
      this.orderForm.orderEndDate = endDate
      this.orderDetailForm.orderStartDate = startDate
      this.orderDetailForm.orderEndDate = endDate

    },
    // 获取等级付款方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              // 付款方式
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
              // 付款周期
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
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop === 'sealingRingName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    sortChangeDetail({ prop, order }) {
      let newProp;
      if (prop === 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop === 'sealingRingName' || prop === 'productCode' || prop === 'productName' || prop === 'documentStatus' || prop === 'approvalStatus') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderDetailForm.orderItems[0].asc = order === "ascending"
      this.orderDetailForm.orderItems[0].column = order === null ? "" : newProp
      this.initDataDetail()
    },
    moreQueries() {
      this.visible = true
    },
    dataFormSubmit() {
      this.orderForm.pageNum = 1
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.orderForm.orderStartDate = this.orderDateArr[0]
        this.orderForm.orderEndDate = this.orderDateArr[1]
      } else {
        this.orderForm.orderStartDate = ""
        this.orderForm.orderEndDate = ""
      }
      if (this.CompletionDate && this.CompletionDate.length > 0) {
        this.orderForm.deliveryStartDate = this.CompletionDate[0]
        this.orderForm.deliveryEndDate = this.CompletionDate[1]
      } else {
        this.orderForm.deliveryStartDate = ""
        this.orderForm.deliveryEndDate = ""
      }
      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.orderForm.deliveryStartDate = this.deliveryDateArr[0]
        this.orderForm.deliveryEndDate = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartDate = ""
        this.orderForm.deliveryEndDate = ""
      }
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.orderForm.startTime = this.createTimeArr[0]
        this.orderForm.endTime = this.createTimeArr[1]
      } else {
        this.orderForm.startTime = ""
        this.orderForm.endTime = ""
      }
      this.initData()

    },
    dataFormSubmitDetail() {
      this.orderDetailForm.pageNum = 1
      Object.keys(this.orderDetailForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderDetailForm[key]
        this.orderDetailForm[key] = typeof item === 'string' ? item.trim() : item
      })
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.orderDetailForm.orderStartDate = this.orderDateArr[0]
        this.orderDetailForm.orderEndDate = this.orderDateArr[1]
      } else {
        this.orderDetailForm.orderStartDate = ""
        this.orderDetailForm.orderEndDate = ""
      }
      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {

        this.orderDetailForm.deliveryStartTime = this.deliveryDateArr[0]
        this.orderDetailForm.deliveryEndTime = this.deliveryDateArr[1]
      } else {
        this.orderDetailForm.deliveryStartTime = ""
        this.orderDetailForm.deliveryEndTime = ""
      }

      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.orderDetailForm.startTime = this.createTimeArr[0]
        this.orderDetailForm.endTime = this.createTimeArr[1]
      } else {
        this.orderDetailForm.startTime = ""
        this.orderDetailForm.endTime = ""
      }
      this.initDataDetail()
      this.getSaleordersTotal()
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
      this.orderFollowVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      getsaleOrderList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
      this.orderForm1 = JSON.parse(JSON.stringify(this.orderForm))
      this.$set(this.orderForm1, 'pageSize', -1)
      getsaleOrderList(this.orderForm1).then(res => {
        this.tableData1 = res.data.records
      }).catch(() => {

      })
    },


    search() {
      this.dataFormSubmit()
    },
    searchDetail() {
      this.dataFormSubmitDetail()
      this.getSaleordersTotal()

    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.orderDateArr = []
      this.deliveryDateArr = []
      this.CompletionDate = []
      this.orderForm = {
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
        orderCategory: "assembly",
        shipmentStatus: "",
        orderState: "",
        productionStatus: "",
        documentStatus: "",
        approvalStatus: "",
        startTime: "",
        endTime: "",

        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

      }

      this.search()
    },
    resetDetail() {
      this.$refs['detailTableData'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.orderDateArr = []
      this.deliveryDateArr = []
      this.orderDetailForm = {

        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        customerProductDrawingNo: "",
        customerProductNo: "",
        drawingNo: "",
        orderNo: "",
        productCode: "",
        productName: "",
        orderCategory: "assembly",
        pageNum: 1,
        pageSize: 20,
        orderStartDate: "",
        orderEndDate: "",
        shipmentStatus: '',
        deliveryStartTime: "",
        deliveryEndTime: "",
        startTime: "",
        endTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
      }
      this.searchDetail()
    },

    // 订单跟踪
    orderFollow(id) {
      this.orderFollowVisible = true
      this.$nextTick(() => {
        this.$refs.orderFollow.init(id)
      })
    },
    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    getCopyOrders(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })

    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype)
        })
        // }, 600);
      }
    },
    handleDetailDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteOrders(id).then(res => {
          this.initDataDetail()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteOrders(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.exportTableRef === 'dataTable' ? this.orderForm : this.orderDetailForm
      let _data = {
        ...targetListQuery,
        exportType: this.exportTableRef === 'dataTable' ? '1004' : '1005',
        exportName: this.exportTableRef === 'dataTable' ? '销售订单' : '销售订单明细',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
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

.aaa ::v-deep .el-tabs__header {
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
