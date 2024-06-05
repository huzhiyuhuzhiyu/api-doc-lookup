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
                    <el-input v-model="listQuery.partnerCode" placeholder="请输入外协供应商编码" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.partnerName" placeholder="请输入外协供应商名称" @keyup.enter.native="search()"
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

              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="退货单号" width="190" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>

                <el-table-column prop="partnerCode" label="外协供应商编码" width="160" sortable="custom" />
                <el-table-column prop="partnerName" label="外协供应商名称" width="160" sortable="custom" />
                <el-table-column prop="deliverDate" label="退货日期" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="createTime" label="申请时间" width="200" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="申请人" width="160" sortable="custom" />

                <el-table-column prop="reasonRejection" label="驳回理由" width="300" />
                <el-table-column prop="approvalCompletionDate" label="审批完成日期" width="200"></el-table-column>

                <el-table-column prop="deliveryStatus" label="退货状态" width="120" sortable="custom" align="center" fixed="right">
                    <template slot-scope="scope">
                      <div v-if="scope.row.deliveryStatus == 'not_returned'">
                        <el-tag>未完成</el-tag>
                      </div>
                      <div v-else-if="scope.row.deliveryStatus == 'returned'">
                        <el-tag type="success">已完成</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                <!-- <el-table-column prop="deliveryCompletionDate" label="发货完成日期" width="160"
                    sortable="custom"></el-table-column> -->
                <el-table-column prop="inspectionStatus" label="检验状态" width="120" sortable="custom" fixed="right"
                  align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.inspectionStatus == 'unInspect'">
                      <el-tag>待检验</el-tag>
                    </div>
                    <div v-else-if="scope.row.inspectionStatus == 'inspected'">
                      <el-tag type="success">已检验</el-tag>
                    </div>
                    <div v-else-if="scope.row.inspectionStatus == 'inspecting'">
                      <el-tag type="warning">检验中</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" fixed="right"
                  align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                    <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" fixed="right"
                  align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批中</el-tag></div>
                    <div v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag
                        type="success">审批通过</el-tag></div>
                    <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag
                        type="danger">审批拒绝</el-tag></div>
                  </template>
                </el-table-column> -->
                <!-- <el-table-column prop="fullReceiptFlag" label="是否全部收货" width="160">
                    <template slot-scope="scope">
                      <div v-if="scope.row.deliveryStatus == 1">
                        <span>是</span>
                      </div>
                      <div v-else-if="scope.row.deliveryStatus == 0">
                        <span>否</span>
                      </div>
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
                        <!-- <el-dropdown-item @click.native="confirmreceipt(scope.row.id, 'qrsh')" v-if="scope.row.deliveryStatus == 'delivered'&&scope.row.approvalStatus == 'ok'">
                            确认收货
                          </el-dropdown-item> -->
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                          查看详情
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'copy')">
                          重新发起订单
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
                <el-table-column prop="orderNo" label="退货单号" width="190" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>

                <el-table-column prop="partnerCode" label="外协供应商编码" width="160" sortable="custom" />
                <el-table-column prop="partnerName" label="外协供应商名称" width="160" sortable="custom" />
                <el-table-column prop="deliverDate" label="退货日期" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="140" />
                <el-table-column prop="productName" label="产品名称" min-width="140" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="140" sortable="custom" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="160" sortable="custom" />
                <el-table-column prop="processName" label="工序名称" min-width="140" sortable="custom" />
                <el-table-column prop="outboundQuantity" label="已入库数量" min-width="140" />
                <!-- <el-table-column prop="undeliveredQuantity" label="待入库数量" min-width="140" /> -->
                <el-table-column prop="deliveryQuantity" label="退料数量" min-width="140" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="140" />
                <el-table-column prop="remark" label="备注" min-width="140"  />
                <el-table-column prop="createTime" label="申请时间" width="200" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="申请人" width="160" sortable="custom" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      :disabled="scope.row.documentStatus == 'draft' ? false : true"
                      @click="handleDel(scope.row.returnDeliveryNoticeId)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, 'look')">
                          查看详情
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, 'copy')">
                          重新发起订单
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

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
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
            <el-form-item label="外协供应商编码">
              <el-input v-model="listQuery.partnerCode" placeholder="请输入外协供应商编码" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="外协供应商名称">
              <el-input v-model="listQuery.partnerName" placeholder="请输入外协供应商名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="申请人">
              <el-input v-model="listQuery.createByName" placeholder="请输入申请人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验状态">
              <el-select v-model="listQuery.inspectionStatus" placeholder="请选择检验状态" filterable clearable>
                <el-option v-for="(item, index) in orderStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="请选择单据状态" filterable clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="请选择审批状态" filterable clearable>
                <el-option v-for="(item, index) in approvalStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="12">
            <el-form-item label="退货日期">
              <el-date-picker v-model="listQuery.orderDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="退货开始日期" end-placeholder="退货结束日期" clearable>
              </el-date-picker>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="请选择申请开始时间" end-placeholder="请选择申请结束时间" style="width: 100%;"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row :gutter="20" v-else>

        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="退货单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入退货单号" clearable />
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
            <el-form-item label="退货日期">
              <el-date-picker v-model="linesQuery.orderDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="退货开始日期" end-placeholder="退货结束日期" clearable>
              </el-date-picker>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="申请时间">
              <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="请选择申请开始时间" end-placeholder="请选择申请结束时间" style="width: 100%;"
                :default-time="['00:00:00', '23:59:59']">
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
import { getQuotationdatasendlist, deleteQuotationsendlist } from '@/api/salesManagement'

import { linesReceiptGoods } from '@/api/purchasingManagement/purchaseInquirySheet'
import { UserListAll, } from '@/api/permission/user'
import Form from './Form'
export default {
  name: 'carrierProfile',
  components: { Form },
  data() {
    return {
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      activeName: "dataTable",
      shipmentsStateList: [
        { label: "待发货", value: "undelivered" },
        { label: "已发货", value: "delivered" }
      ],
      orderStateList: [
        { label: "待检验", value: "unInspect" },
        { label: "已检验", value: "inspected" },
      ],
      isfullReceiptFlag: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: " 审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],

      departMentList: [
        { lebel: "送货", value: "deliver_goods" },
        { lebel: "自提", value: "self_pickup" },
        { lebel: "快递", value: "express_delivery" },
        { lebel: "货运", value: "freight_transport" },
        { lebel: "到付", value: "collect_payment" },
      ],
      listQuery: {},
      initListQuery: {
        orderCategory: '',
        notifyType: 'external_process',
        returnDeliveryType: 'back',
        orderNo: "",
        partnerCode: "",
        partnerName: "",
        rdsDate: '',
        rdeDate: '',
        inspectionStatus: '',
        documentStatus: '',
        createByName: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createTimeArr: [],
        orderDateArr: [],
      },
      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        notifyType: 'external_process',
        returnDeliveryType: 'back',
        orderNo: "",
        partnerCode: "",
        partnerName: "",
        rdsDate: '',
        rdeDate: '',
        inspectionStatus: '',
        documentStatus: '',
        createByName: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createTimeArr: [],
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
    //排序
    sortChange({ prop, order }) {
      console.log("prop", prop);
      let newProp;

      if (prop === 'partnerCode' || prop === 'partnerName' || prop === 'productName' || prop === 'productDrawingNo' || prop === 'routingName' || prop === 'processName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop === 'createByName') {
        newProp = "create_by"
      }
      if (this.activeName == "dataTable") {
        this.listQuery.orderItems[0].asc = order !== "descending"
        this.listQuery.orderItems[0].column = order === null ? "" : newProp

      } else {
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
        if (this.listQuery.orderDateArr && this.listQuery.orderDateArr.length > 0) {
          this.listQuery.rdsDate = this.listQuery.orderDateArr[0]
          this.listQuery.rdeDate = this.listQuery.orderDateArr[1]
        } else {
          this.listQuery.rdsDate = ''
          this.listQuery.rdeDate = ''
        }
        if (this.listQuery.createTimeArr && this.listQuery.createTimeArr.length > 0) {
          this.listQuery.startTime = this.listQuery.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.listQuery.endTime = this.listQuery.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        getQuotationdatasendlist(this.listQuery).then(res => {
          console.log("res++", res);
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        if (this.linesQuery.orderDateArr && this.linesQuery.orderDateArr.length > 0) {
          this.linesQuery.rdsDate = this.linesQuery.orderDateArr[0]
          this.linesQuery.rdeDate = this.linesQuery.orderDateArr[1]
        } else {
          this.linesQuery.rdsDate = ''
          this.linesQuery.rdeDate = ''
        }
        if (this.linesQuery.createTimeArr && this.linesQuery.createTimeArr.length > 0) {
          this.linesQuery.startTime = this.linesQuery.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.linesQuery.endTime = this.linesQuery.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.linesQuery.startTime = ''
          this.linesQuery.endTime = ''
        }
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
        this.listQuery.createTimeArr = []
        this.listQuery.orderDateArr = []
        this.listQuery.deliveryDateArr = []
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
        deleteQuotationsendlist(id).then(res => {
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
  
  