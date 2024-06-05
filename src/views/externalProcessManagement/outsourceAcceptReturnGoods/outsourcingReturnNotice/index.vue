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
                    <el-input v-model="listQuery.orderNo" placeholder="请输入退货单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.salesman" placeholder="请输入业务员" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="listQuery.approvalStatus" placeholder="审批状态" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
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
                <topOpts @add="addOrUpdateHandle('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="退货单号" min-width="280" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="purchaseOrderNo" label="外协单号" min-width="220" sortable="custom"></el-table-column>
                <el-table-column prop="salesman" label="业务员" min-width="140" sortable="custom" />
                <el-table-column prop="deliverDate" label="退货日期" min-width="140" sortable="custom" />
                <el-table-column prop="approvalCompletionDate" label="审批完成日期" min-width="180"></el-table-column>
                <el-table-column prop="reasonRejection" label="驳回理由" min-width="180" />
                <el-table-column prop="submitDate" label="提交时间" min-width="180"></el-table-column>
                <el-table-column prop="remark" min-width="140" label="备注" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" />

                <!-- <el-table-column prop="inspectionStatus" label="检验状态" align="center" width="160" sortable="custom" fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.inspectionStatus == 'unInspect'">
                      <el-tag>待检验</el-tag>
                    </div>
                    <div v-else-if="scope.row.inspectionStatus == 'inspected'">
                      <el-tag type="success">已检验</el-tag>
                    </div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="receivingStatus" label="退货状态" width="130" key="receivingStatus">
                  <template slot-scope="scope">
                    <div v-if="scope.row.receivingStatus == 'returning'"><el-tag>未完成</el-tag></div>
                    <div v-else-if="scope.row.receivingStatus == 'returned'"><el-tag type="success">已完成</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                    <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批中</el-tag></div>
                    <div v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag
                        type="success">审批通过</el-tag></div>
                    <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag
                        type="danger">审批拒绝</el-tag></div>
                  </template>
                </el-table-column> -->

                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="handleDel(scope.row.id)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                          查看详情
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'copy')">
                          复制通知单
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
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
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入退货单号" @keyup.enter.native="search()"
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
                  @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">

              <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true"
                @sort-change="sortChange" custom-column :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="退货单号" min-width="280" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.purchaseReceiptReturnGoodsId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="partnerCode" label="外协供应商编码" width="160" />
                <el-table-column prop="partnerName" label="外协供应商名称" width="160" sortable="custom" />

                <el-table-column prop="salesman" label="业务员" min-width="140" sortable="custom" />
                <el-table-column prop="deliverDate" label="退货日期" min-width="140" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="140" />
                <el-table-column prop="productName" label="产品名称" min-width="140" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="140" sortable="custom" />
                <el-table-column prop="routingIdName" label="工艺路线名称" min-width="160" sortable="custom" />
                <el-table-column prop="processIdName" label="工序名称" min-width="140" sortable="custom" />
                <el-table-column prop="receiptQuantity" label="已出库数量" min-width="140" />
                <!-- <el-table-column prop="requiredReceivedQuantity" label="待出库数量" min-width="140" /> -->
                <el-table-column prop="receivedQuantity" label="退货数量" min-width="140" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="140" />
                <el-table-column prop="remark" min-width="140" label="备注" />

                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" />
                <!-- <el-table-column prop="receivingStatus" label="退货状态" width="130" key="receivingStatus">
                  <template slot-scope="scope">
                    <div v-if="scope.row.receivingStatus == 'returning'"><el-tag>未完成</el-tag></div>
                    <div v-else-if="scope.row.receivingStatus == 'returned'"><el-tag type="success">已完成</el-tag></div>
                    <div v-else-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="addOrUpdateHandle(scope.row.purchaseReceiptReturnGoodsId, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="handleDel(scope.row.purchaseReceiptReturnGoodsId)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.purchaseReceiptReturnGoodsId, 'look')">
                          查看详情
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.purchaseReceiptReturnGoodsId, 'copy')">
                          复制通知单
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
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

    <Form v-if="formVisible" ref="Form" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20" v-if="activeName === 'dataTable'">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="退货单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入退货单号" clearable />
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

          <!-- <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="请选择审批状态" filterable clearable>
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="请选择单据状态" filterable clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货状态">
              <el-select v-model="listQuery.receivingStatus" placeholder="请选择退货状态" filterable clearable>
                <el-option v-for="(item, index) in receiptReturnType" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <!-- <el-col :span="12">
            <el-form-item label="检验状态">
              <el-select v-model="listQuery.inspectionStatus" placeholder="请选择检验状态" filterable clearable>
                <el-option v-for="(item, index) in orderStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="创建开始时间" end-placeholder="创建结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row :gutter="20" v-else>
        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="退货单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入收货单号" clearable />
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
            <el-form-item label="工艺路线名称">
              <el-input v-model="linesQuery.routingIdName" placeholder="请输入工艺路线名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="linesQuery.processIdName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货状态">
              <el-select v-model="linesQuery.receivingStatus" placeholder="请选择退货状态" filterable clearable>
                <el-option v-for="(item, index) in receiptReturnLineType" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货日期">
              <el-date-picker v-model="linesQuery.deliveryDate" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择退货开始日期" end-placeholder="请选择退货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="创建开始时间" end-placeholder="创建结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { purPurchaseReceiptReturnGoodsList, deletepurPurchaseReceiptReturnGoods ,linesReceiptReturn} from '@/api/purchasingManagement/purchaseInquirySheet'
import Form from './Form'
export default {
  name: 'purchaseReceiptNote',
  components: { Form },
  data() {
    return {
      activeName: 'dataTable',
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      receiptReturnType: [
        { label: "未完成", value: "returning" },
        { label: "已完成", value: "returned" },
      ],
      receiptReturnLineType: [
        { label: "未完成", value: "returning" },
        { label: "已完成", value: "returned" },
        { label: "已停止", value: "stopped" },
      ],
      orderStateList: [
        { label: "待检验", value: "uninspected" },
        { label: "已检验", value: "inspected" },
      ],
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      statusList: [{
        label: "审批中",
        value: "ing"
      }, {
        label: "审批通过",
        value: "ok"
      }, {
        label: "审批拒绝",
        value: "rebut"
      },],
      listQuery: {},
      initListQuery: {
        approvalStatus: "",     //审批状态
        createByName: "",
        createEndTime: "",
        createRequirementDate: "",
        createStartTime: "",
        documentStatus: "",       // 单据状态
        endTime: "",
        inspectionStatus: "",     // 检验状态
        orderNo: "",              //收货单号
        purchaseOrderNo: "",      //采购单号
        notificationType: 'external_process',
        pageNum: 1,
        pageSize: 20,
        receivingStatus: "",      //收货状态
        receiptReturnType: 'back', // 类型（收货 receipt、退货 back）,可用值:back,receipt
        salesman: "",             //业务员
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createTimeArr: [],
        deliveryDateArr: [],
        orderDateArr: [],
      },

      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        approvalStatus: "",     //审批状态
        createByName: "",
        createEndTime: "",
        createRequirementDate: "",
        createStartTime: "",
        documentStatus: "",       // 单据状态
        endTime: "",
        inspectionStatus: "",     // 检验状态
        orderNo: "",              //收货单号
        purchaseOrderNo: "",      //采购单号
        notificationType: 'external_process',
        pageNum: 1,
        pageSize: 20,
        receivingStatus: "",      //收货状态
        receiptReturnType: 'back', // 类型（收货 receipt、退货 back）,可用值:back,receipt
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
        deliveryDateArr: [],
        orderDateArr: [],
      },



      total: 0,
      formVisible: false,
    }
  },
  watch:{activeName() { this.initData() }},
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {


    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerName' || prop === 'productName' || prop === 'productDrawingNo' || prop === 'createTime'  || prop === 'routingIdName' || prop === 'processIdName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (newProp === 'purchase_order_no') {
        newProp = 'purchaseOrderNo'
      }
      if (this.activeName === 'dataTable') {
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (prop === 'orderNo') {
          newProp = prop
        }
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },

    moreQueries() {
      this.visible = true
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
      this.listLoading = true
      if (this.activeName === 'dataTable') {

        if (this.listQuery.createTimeArr && this.listQuery.createTimeArr.length > 0) {
          this.listQuery.startTime = this.listQuery.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.listQuery.endTime = this.listQuery.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        purPurchaseReceiptReturnGoodsList(this.listQuery).then(res => {
          console.log("res++", res);
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArr', 'startTime', 'endTime')
        this.jnpf.searchTimeFormat(this.linesQuery, 'deliveryDate', 'deliverDateStart', 'deliverDateEnd')
        linesReceiptReturn(this.linesQuery).then(res => {
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
    refresh() {
      this.formVisible = false
      this.reset()
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
        this.listQuery.createTimeArr = []
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()

        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
        this.linesQuery.createTimeArr = []
        this.linesQuery.deliveryDate = []
      }
      this.initData()
    },


    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype)
        })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletepurPurchaseReceiptReturnGoods(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
 
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />

