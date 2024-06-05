<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单据列表" name="orderList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.orderNo" placeholder="请输入外协单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.cooperativePartnerCode" placeholder="请输入外协供应商编码" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入外协供应商名称" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                      $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head" style="padding:10px">
                <div>
                  <topOpts @add="addSupplier('', 'add')" />
                  <el-button :loading="btnLoading" style="margin-left:10px;" size="mini" type="success"
                    @click="handleBatch()">批量完成</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table @selection-change="handeleFinshData" hasC :checkSelectable="checkSelectable" v-if="flag"
                v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="外协单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>

                <el-table-column prop="cooperativePartnerCode" label="外协供应商编码" min-width="180" sortable="custom"
                  show-overflow-tooltip />
                <el-table-column prop="cooperativePartnerName" label="外协供应商名称" min-width="180" sortable="custom"
                  show-overflow-tooltip />

                <el-table-column prop="reasonRejection" label="驳回理由" align="left" min-width="180" />


                <!-- <el-table-column prop="delivery" label="发货方式" min-width="140" sortable="custom">
                  <template slot-scope="scope">
                    <span v-if="scope.row.delivery == 'deliver_goods'">送货</span>
                    <span v-if="scope.row.delivery == 'self_pickup'">自提</span>
                    <span v-if="scope.row.delivery == 'express_delivery'">快递</span>
                    <span v-if="scope.row.delivery == 'freight_transport'">货运</span>
                    <span v-if="scope.row.delivery == 'collect_payment'">到付</span>
                  </template>
                </el-table-column>
                <el-table-column prop="shipperIdText" label="发货人" min-width="140" />
                <el-table-column prop="recipient" label="收件人" min-width="140" />
                <el-table-column prop="phone" label="收件人电话" min-width="140" />
                <el-table-column prop="region.countryName" label="国家" min-width="140" />
                <el-table-column prop="region.provinceName" label="省" min-width="140" />
                <el-table-column prop="region.cityName" label="市" min-width="140" />
                <el-table-column prop="region.areaName" label="区" min-width="140" />
                <el-table-column prop="address" label="地址" min-width="140" /> -->
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" align="center" min-width="180"
                  sortable="custom" />

                <el-table-column prop="deliveryDate" label="交货日期" min-width="180" sortable="custom" />
                <el-table-column prop="remark" min-width="140" label="备注" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column prop="receivingStatus" label="订单状态" align="center" sortable="custom" width="120"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag> </div>
                    <div v-if="scope.row.receivingStatus == 'received'"><el-tag type="success">已完成</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" fixed="right"
                  align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                    <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" label="审批状态" align="center" sortable="custom" min-width="120"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批撤回</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)"
                      :editDisabled="scope.row.documentStatus === 'submit'"
                      :delDisabled="scope.row.documentStatus === 'submit'">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                            @click.native="addOrUpdateHandle(scope.row.id, 'add')">
                            重新提交
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                            @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                            审批撤回
                          </el-dropdown-item>
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>
                  </template>
                </el-table-column>

              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="detailList">
          <div class="JNPF-common-layout-center JNPF-flex-main">

            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listsQuery.orderNo" placeholder="请输入外协单号" clearable
                      @keyup.enter.native="searchDetail()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listsQuery.cooperativePartnerCode" placeholder="请输入外协供应商编码" clearable
                      @keyup.enter.native="searchDetail()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listsQuery.productName" placeholder="请输入产品名称" clearable
                      @keyup.enter.native="searchDetail()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="searchDetail()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetDetail()">{{
                      $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueriesDetail()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head" style="padding:10px">
                <div>
                  <topOpts @add="addSupplier('', 'add')" />
                  <el-button :loading="btnLoading" style="margin-left:10px;" size="mini" type="danger" @click="handleBatchStop()">批量停止</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="detailData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table @selection-change="handeleFinshData" hasC :checkSelectable="checkSelectable" v-loading="listLoading" highlight-current-row :fixedNO="true" ref="detailTableData"
                :data="detailTableData" @sort-change="sortChangeDetail" custom-column :partentOrChild="'child'">

                <el-table-column prop="orderNo" label="外协单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.purchaseOrderId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>

                <el-table-column prop="cooperativePartnerCode" label="外协供应商编码" min-width="180" sortable="custom"
                  show-overflow-tooltip />
                <el-table-column prop="cooperativePartnerName" label="外协供应商名称" min-width="180" sortable="custom"
                  show-overflow-tooltip />
                <el-table-column prop="productCode" label="产品编码" min-width="140" show-overflow-tooltip />
                <el-table-column prop="productName" label="产品名称" min-width="140" show-overflow-tooltip
                  sortable="custom" />
                <el-table-column prop="drawingNo" label="产品图号" min-width="200" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="140" show-overflow-tooltip />
                <el-table-column prop="processName" label="工序名称" min-width="140" show-overflow-tooltip />
                <el-table-column prop="spec" label="规格型号" min-width="140" />
                <el-table-column prop="purchaseQuantity" label="外协数量(主)" min-width="140" />
                <el-table-column prop="mainUnit" label="主单位" min-width="140" show-overflow-tooltip />
                <el-table-column prop="purchaseQuantity2" label="外协数量(副)" min-width="140" />
                <el-table-column prop="deputyUnit" label="副单位" min-width="140" show-overflow-tooltip />

                <el-table-column prop="deliveryDate" label="交货日期" min-width="180" sortable="custom" />
                <el-table-column prop="remark" min-width="140" label="备注" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" />
                <el-table-column prop="receivingStatus" label="订单状态" align="center" sortable="custom" width="120"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag> </div>
                    <div v-if="scope.row.receivingStatus == 'received'"><el-tag type="success">已完成</el-tag></div>
                    <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" label="审批状态" align="center" sortable="custom" width="120"
                  fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'"><el-tag
                        type="warning">审批撤回</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.purchaseOrderId, 'edit')"
                      @del="handleDel(scope.row.purchaseOrderId)" :editDisabled="scope.row.approvalStatus ? true : false"
                      :delDisabled="scope.row.approvalStatus ? true : false">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.purchaseOrderId, 'look')">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>
                  </template>
                </el-table-column>

              </JNPF-table>
              <pagination :total="total" :page.sync="listsQuery.pageNum" :background="background"
                :limit.sync="listsQuery.pageSize" @pagination="detailData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="外协单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入外协单号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="外协供应商名称">
              <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入外协供应商名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外协供应商编码">
              <el-input v-model="listQuery.cooperativePartnerCode" placeholder="请输入外协供应商编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态">
              <el-select v-model="listQuery.receivingStatus" placeholder="订单状态"  style="width: 100%;" clearable>
                <el-option v-for="(item, index) in receiptReturnType" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="审批状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="deliveryDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                clearable start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
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

    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="detailVisible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listsQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="外协单号">
              <el-input v-model.trim="listsQuery.orderNo" placeholder="请输入外协单号" clearable
                @keyup.enter.native="searchDetail()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="外协供应商名称">
              <el-input v-model.trim="listsQuery.cooperativePartnerName" placeholder="请输入外协供应商名称" clearable
                @keyup.enter.native="searchDetail()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外协供应商编码">
              <el-input v-model.trim="listsQuery.cooperativePartnerCode" placeholder="请输入外协供应商编码" clearable
                @keyup.enter.native="searchDetail()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model.trim="listsQuery.productCode" placeholder="请输入产品编码" clearable
                @keyup.enter.native="searchDetail()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model.trim="listsQuery.productName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="searchDetail()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺路线名称">
              <el-input v-model.trim="listsQuery.routingName" placeholder="请输入工艺路线名称" clearable
                @keyup.enter.native="searchDetail()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model.trim="listsQuery.processName" placeholder="请输入工序名称" clearable
                @keyup.enter.native="searchDetail()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态">
              <el-select v-model="listsQuery.receivingStatus" placeholder="订单状态"  style="width: 100%;">
                <el-option v-for="(item, index) in receiptReturnType" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="deliveryDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                clearable start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="searchDetail()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>


  </div>
</template>
  
<script>
// import { purchaseOrderList } from '@/api/purchasingManagement/purchaseInquirySheet'
import { purchaseOrderList, detailpurchaseOrderList, deleteProcessOrder, purPurchaseBatch, purPurchaseBatchLine } from '@/api/purchasingAndOutsourcingOrders/index'
import JNPFForm from './Form'
import moment from 'moment'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
export default {
  name: 'purchaseOrder',
  components: { JNPFForm },
  data() {
    return {
      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      detailVisible: false,
      tableDataList: [
      ],
      detailTableData: [],
      flag: true,
      activeName: "orderList",
      formVisible: false,
      listLoading: false,
      statusList: [{
        label: "审批中",
        value: "ing"
      }, {
        label: "审批通过",
        value: "ok"
      }, {
        label: "审批拒绝",
        value: "rebut"
      },
      { label: "审批撤回", value: "withdrawn" },
      ],
      listQuery: {
        approvalStatus: "",             //审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: "",     //供应商编码
        cooperativePartnerName: "",     // 	供应商名称
        createByName: "",
        delivery: "",                   //发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        deliveryEndDate: "",            //交货结束日期
        deliveryStartDate: "",
        deliveryDate: '',
        endTime: "",
        orderNo: "",                    //订单号
        orderType: "external_process",                  //	订单类型 采购 procure、外协 external_processes
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        receivingStatus:'receiving',
      },
      // 明细参数
      listsQuery: {
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        createByName: "",
        deliveryEndDate: "",
        deliveryStartDate: "",
        endTime: "",
        orderNo: "",
        orderType: "external_process",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        productCode: "",
        productName: "",
        receivingStatus:'receiving',
      },
      total: 0,
      formVisible: false,
      createRequirementDate: [],
      deliveryDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick(picker) {
            const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      selectData: [],
      btnLoading: false,
      //	收货状态 待收货 receiving、已收货 received,可用值:received,receiving,returned,returning
      receiptReturnType: [
        { label: "未完成", value: "receiving" },
        { label: "已完成", value: "received" }
      ],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    checkSelectable(row) {
      return !row.disabled
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleFinshData(val) {
      this.selectData = val
    },
    // 批量完成
    handleBatch() {
      console.log(this.selectData, '选择的数据');
      if (!this.selectData.length) {
        this.$message.error('请先选择您要完成的数据')
      } else {
        this.btnLoading = true
        this.$confirm('手动完成后，将不能再继续生成通知单，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = this.selectData.map(item => item.id)
          purPurchaseBatch(data).then(res => {
            console.log(res, '1111');
            if (res.msg == 'Success') {
              this.$message({
                message: '完成成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false
                  this.initData()
                }
              })
            }
          }).catch(() => { this.btnLoading = false })
        }).catch(() => { this.btnLoading = false })

      }
    },
    // 明细列表 批量停止
    handleBatchStop(){
      console.log(this.selectData, '选择的数据');
      if (!this.selectData.length) {
        this.$message.error('请先选择您要停止的数据')
      } else {
        this.btnLoading = true
        this.$confirm('手动停止后，将不能再继续生成通知单，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = this.selectData.map(item => item.id)
          purPurchaseBatchLine(data).then(res => {
            console.log(res, '1111');
            if (res.msg == 'Success') {
              this.$message({
                message: '停止成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false
                  this.detailData()
                }
              })
            }
          }).catch(() => { this.btnLoading = false })
        }).catch(() => { this.btnLoading = false })

      }
    },
    // 点击切换明细
    handleClick(e) {
      console.log(e);
      if (e.index == '0') {
        this.initData()
      } else {
        this.detailData()
      }
      this.selectData = []
    },
    moreQueries() {
      this.visible = true
    },
    moreQueriesDetail() {

      this.detailVisible = true
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      if (newProp === 'cooperative_partner_code') {
        newProp = 'cooperativePartnerCode'
      }
      if (newProp === 'cooperative_partner_name') {
        newProp = 'cooperativePartnerName'
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    sortChangeDetail({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      if (newProp === 'cooperative_partner_code') {
        newProp = 'cooperativePartnerCode'
      }
      if (newProp === 'cooperative_partner_name') {
        newProp = 'cooperativePartnerName'
      }
      if (newProp === 'product_name') {
        newProp = 'productName'
      }
      if (newProp === 'create_time') {
        newProp = 'createTime'
      }
      this.listsQuery.orderItems[0].asc = order !== 'descending'
      this.listsQuery.orderItems[0].column = order === null ? "" : newProp
      this.detailData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },


    initData() {
      this.listLoading = true
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listQuery.startTime = this.createRequirementDate[0] + " 00:00:00"
        this.listQuery.endTime = this.createRequirementDate[1] + " 23:59:59"
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      if (this.deliveryDate && this.deliveryDate.length > 0) {
        this.listQuery.deliveryStartDate = this.deliveryDate[0] + " 00:00:00"
        this.listQuery.deliveryEndDate = this.deliveryDate[1] + " 23:59:59"
      } else {
        this.listQuery.deliveryStartDate = ''
        this.listQuery.deliveryEndDate = ''
      }
      purchaseOrderList(this.listQuery).then(res => {
        console.log(res, '采购订单列表');
        this.tableDataList = res.data.records
        this.tableDataList.forEach(item => {
          item.disabled = item.receivingStatus == 'receiving' && item.approvalStatus == 'ok' ? false : true
        })
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    detailData() {
      this.listLoading = true
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listsQuery.startTime = this.createRequirementDate[0] + " 00:00:00"
        this.listsQuery.endTime = this.createRequirementDate[1] + " 23:59:59"
      } else {
        this.listsQuery.startTime = ''
        this.listsQuery.endTime = ''
      }
      if (this.deliveryDate && this.deliveryDate.length > 0) {
        this.listsQuery.deliveryStartTime = this.deliveryDate[0] + " 00:00:00"
        this.listsQuery.deliveryEndTime = this.deliveryDate[1] + " 23:59:59"
      } else {
        this.listsQuery.deliveryStartTime = ''
        this.listsQuery.deliveryEndTime = ''
      }
      detailpurchaseOrderList(this.listsQuery).then(res => {
        console.log(res, '明细列表');
        this.detailTableData = res.data.records
        console.log(this.detailTableData);
        this.detailTableData.forEach(item=>{
          item.disabled = item.receivingStatus == 'receiving' && item.approvalStatus == 'ok' ? false : true
        })
        this.total = res.data.total
        this.listLoading = false
        this.detailVisible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    // 搜索明细
    searchDetail() {
      Object.keys(this.listsQuery).forEach(key => {
        let item = this.listsQuery[key]
        this.listsQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listsQuery.pageNum = 1
      this.detailData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        approvalStatus: "",             //审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: "",     //供应商编码
        cooperativePartnerName: "",     // 	供应商名称
        createByName: "",
        delivery: "",                   //发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        deliveryEndDate: "",            //交货结束日期
        deliveryStartDate: "",
        deliveryDate: '',
        endTime: "",
        orderNo: "",                    //订单号
        orderType: "external_process",                  //	订单类型 采购 procure、外协 external_processes
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
        this.createRequirementDate = []
      this.deliveryDate = []
      this.search()
    },
    // 重置明细
    resetDetail() {
      this.$refs['detailTableData'].$refs.JNPFTable.clearSort()
      this.listsQuery = {
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        createByName: "",
        deliveryEndDate: "",
        deliveryStartDate: "",
        endTime: "",
        orderNo: "",
        orderType: "external_process",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        productCode: "",
        productName: "",
      },
        this.createRequirementDate = []
      this.deliveryDate = []
      this.searchDetail()
    },
    addSupplier(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.procureForm.init(id, type)
      })
    },
    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.procureForm.init(id, type)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteProcessOrder(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        withdrawn(_data).then(res => {
          this.$message({
            type: 'success',
            message: "撤回成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
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
  