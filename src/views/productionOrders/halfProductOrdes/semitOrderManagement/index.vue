  <!-- 成品订单管理 -->
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.orderNo" @keydown.enter.native="dataFormSubmit()" placeholder="请输入订单号"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.productName" @keydown.enter.native="dataFormSubmit()" placeholder="请输入产品名称"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.workOrderNo" @keydown.enter.native="dataFormSubmit()" placeholder="请输入工作令号"
                clearable />
            </el-form-item>
          </el-col>
        


          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="dataFormSubmit()">
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
            <el-button size="mini" @click="batchStop" type="info">批量暂停</el-button>
            <el-button size="mini" @click="batchStart" type="primary">批量开启</el-button>
            <el-button size="mini" @click="batchClose" type="danger">批量关闭</el-button>
            <el-button size="mini" @click="batchFinsh" type="success">批量完成</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <el-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column hasC
          :fixedNO="true" @selection-change="handleSelectionChange"  style="height:68vh">
          <el-table-column type="selection" width="60"  :selectable="selectable" ></el-table-column>
          <el-table-column type="index" width="60"  label="序号" fixed="left"></el-table-column>
          <el-table-column prop="orderNo" label="订单号" min-width="200" fixed="left" sortable="custom">
            <template slot-scope="scope">
              <span
                style="background-color: rgb(255, 102, 0); color: rgb(255, 255, 255); line-height: 16px; height: 16px; font-size: 12px!important; border-radius: 4px; display: inline-block; padding: 0 2px; margin-right: 4px;"
                v-if="scope.row.insertOrderFlag">插</span>
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" fixed="left" label="产品编码" width="160"></el-table-column>
          <el-table-column prop="productName" fixed="left" label="产品名称" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productDrawingNo" fixed="left" label="产品图号" width="120"></el-table-column>
          <el-table-column prop="workOrderNo" label="工作令号" width="120"></el-table-column>
          <!-- <el-table-column prop="orderType" label="订单类型" width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-for="(item, index) in orderList" :key="index"> 
                <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column prop="planStartDate" label="计划开始日期" width="160" sortable="custom"></el-table-column>
          <el-table-column prop="planEndDate" label="计划结束日期" width="160" sortable="custom"></el-table-column>
          <el-table-column prop="productionQuantity" label="生产数量" width="120"></el-table-column>
          <el-table-column prop="completedQuantity" label="已完成数量" width="120"></el-table-column>
          <el-table-column prop="mainUnit" label="单位" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productionStatus" label="生产状态" width="110" sortable="custom" fixed="right">
            <template slot-scope="scope">
                <el-tag type="warning" disable-transitions v-if="scope.row.productionStatus === 'not_started'">未生产</el-tag>
                <el-tag type="primary" disable-transitions
                  v-else-if="scope.row.productionStatus === 'start_production'">生产中</el-tag>
                <el-tag type="success" disable-transitions
                  v-else-if="scope.row.productionStatus === 'production_completed'">生产完成</el-tag>
              </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" width="110" sortable="custom" fixed="right">
            <template slot-scope="scope">
                <el-tag type=" primary" disable-transitions v-if="scope.row.orderStatus === 'normal'">正常</el-tag>
                <el-tag type="warning" disable-transitions
                  v-else-if="scope.row.orderStatus === 'suspend'">暂停</el-tag>
                <el-tag type="danger" disable-transitions
                  v-else-if="scope.row.orderStatus === 'closed'">关闭</el-tag>
              <el-tag type="success" disable-transitions v-else-if="scope.row.orderStatus === 'finish'">已完成</el-tag>
              </template>
          </el-table-column>
          <el-table-column prop="receiveStatus" label="接收状态" width="110" sortable="custom" fixed="right">
            <template slot-scope="scope">
                <el-tag type="warning" disable-transitions v-if="scope.row.receiveStatus === 'not_received'">未接收</el-tag>
                <el-tag type="success" disable-transitions
                  v-else-if="scope.row.receiveStatus === 'received'">已接收</el-tag>
                <el-tag type="danger" disable-transitions
                  v-else-if="scope.row.receiveStatus === 'refused'">已拒绝</el-tag>
              </template>
          </el-table-column>
          <el-table-column prop="recipientName" label="接收人" width="120"></el-table-column>

          <el-table-column prop="receptionDate" label="接收时间" min-width="200" sortable="custom"></el-table-column>


          <el-table-column prop="suspendByName" label="暂停人" width="120"></el-table-column>
          <el-table-column prop="suspendDate" label="暂停时间" min-width="200"></el-table-column>
          <el-table-column prop="closedByName" label="关闭人" width="120"></el-table-column>
          <el-table-column prop="closeDate" label="关闭时间" min-width="200" sortable="custom"></el-table-column>
          <el-table-column prop="insertOrderFlag" label="是否插单" width="120">
            <template slot-scope="scope">
              <div v-if="!scope.row.insertOrderFlag">否</div>
              <div v-if="scope.row.insertOrderFlag">是</div>
            </template>
          </el-table-column>
          <el-table-column prop="insertOrderSort" label="插单顺序" width="120"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>




          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :loading="scope.row.btnLoading"
                :disabled="scope.row.receiveStatus == 'received' || scope.row.receiveStatus == 'refused' || scope.row.productionStatus == 'production_completed' || scope.row.orderStatus != 'normal'"
                @click="updateHandle(scope.row, 'edit')">接收</el-button>
              <el-button size="mini" type="text"
                :disabled="!(scope.row.receiveStatus == 'received' && scope.row.orderStatus == 'normal' && scope.row.productionStatus != 'production_completed')"
                @click="batchWorker(scope.row.id)">派工</el-button>
              <el-dropdown hide-on-click >
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :disabled="scope.row.receiveStatus == 'refused' || scope.row.receiveStatus == 'received' || scope.row.productionStatus == 'production_completed' || scope.row.orderStatus != 'normal'"
                    @click.native="rejection(scope.row.id,)">
                    拒收
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />

    <!-- 更多查询弹框 -->
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="orderForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="订单号">
              <el-input v-model="orderForm.orderNo" placeholder="请输入订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作令号">
              <el-input v-model="orderForm.workOrderNo" placeholder="请输入工作令号" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="orderForm.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="orderForm.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="orderForm.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
              <el-form-item label="订单类型">
                <el-select v-model="orderForm.orderType" placeholder="请选择订单类型" clearable>
                  <el-option v-for="(item, index) in orderList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          <el-col :span="12">

            <el-form-item label="计划开始日期">
              <el-date-picker v-model="planStartArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="开始日期" end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束日期">
              <el-date-picker v-model="planEndArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="开始日期" end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收状态">
              <el-select v-model="orderForm.receiveStatus" placeholder="请选择接收状态" clearable>
                <el-option v-for="(item, index) in receiveStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产状态">
              <el-select v-model="orderForm.productionStatus" placeholder="请选择生产状态" clearable>
                <el-option v-for="(item, index) in productionStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态">
              <el-select v-model="orderForm.orderStatus" placeholder="请选择订单状态" clearable>
                <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否插单">
              <el-select v-model="orderForm.insertOrderFlag" placeholder="请选择是否插单" clearable>
                <el-option v-for="(item, index) in insertOrderFlagList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()">
          搜索</el-button>
      </span>
    </el-dialog>
    <!-- 派工弹框 -->
    <el-dialog title="派工信息" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="workerDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <!-- <TableForm-product :value="workerList" @input="linesChange" :hasToolbar="false" :hasActionbar="false" ref="linesForm" :tableItems="linesListItems" /> -->
      <el-row :gutter="20">

        <el-table ref="workerDialog" v-loading="listLoading" :data="workerList" border>
          <el-table-column prop="processCode" label="工序编码" width="160"> </el-table-column>
          <el-table-column prop="processName" label="工序名称" width="120" />
          <el-table-column prop="planStartDate" label="计划开始时间" min-width="200">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.planStartDate" :clearable="false" type="date" value-format="yyyy-MM-dd"
                style="width: 100%;" placeholder="计划开始时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="planEndDate" label="计划结束时间" min-width="200">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.planEndDate" type="date" :clearable="false" value-format="yyyy-MM-dd"
                style="width: 100%;" placeholder="计划结束时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="workOrderQuantity" label="订单生产数量" width="150"></el-table-column>
          <el-table-column prop="dispatchedQuantity" label="已派工数量" width="120"></el-table-column>
          <el-table-column prop="dispatchQuantity" label="派工数量" width="170">
            <template slot="header"><span class="required">*</span>派工数量</template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.dispatchQuantity" placeholder="请输入派工数量" />
            </template>
          </el-table-column>
          <el-table-column prop="workGroupId" label="班组" width="160">
            <template slot-scope="scope">
              <el-select v-model="scope.row.workGroupId" placeholder="请选择班组" clearable>
                <el-option v-for="(item, index) in scope.row.routingProResMap.work_group" :key="index"
                  :label="item.resourceName" :value="item.resourceId"></el-option>
              </el-select>
              <!-- <el-input v-model="scope.row.productCode" placeholder="请输入班组"  /> -->
            </template>
          </el-table-column>
          <el-table-column prop="equipmentId" label="设备" width="160">
            <template slot-scope="scope">
              <el-select v-model="scope.row.equipmentId" placeholder="请选择设备" clearable>
                <el-option v-for="(item, index) in scope.row.routingProResMap.device" :key="index"
                  :label="item.resourceName" :value="item.resourceId"></el-option>
              </el-select>
              <!-- <el-input v-model="scope.row.productCode" placeholder="请选择设备"  /> -->
            </template>
          </el-table-column>
          <el-table-column prop="personId" label="人员" width="160">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.productCode" placeholder="请选择人员"  /> -->
              <el-select v-model="scope.row.personId" placeholder="请选择人员" clearable>
                <el-option v-for="(item, index) in scope.row.routingProResMap.personnel" :key="index"
                  :label="item.resourceName" :value="item.resourceId"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="productionLineId" label="产线" width="160">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.productCode" placeholder="请选择产线"  /> -->
              <el-select v-model="scope.row.productionLineId" placeholder="请选择产线" clearable>
                <el-option v-for="(item, index) in lineList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="workstationId" label="工位" width="160">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.productCode" placeholder="请选择工位" /> -->
              <el-select v-model="scope.row.workstationId" placeholder="请选择工位" :disabled="!scope.row.productionLineId"
                clearable @focus="selectworkstation(scope.row)">
                <el-option v-for="(item, index) in workstationList" :key="index" :label="item.workstationIdName"
                  :value="item.workstationId"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="160">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">

              <el-button size="mini" type="text" :disabled="scope.$index == 0" @click="handleDel(scope)"
                style=" color: #ff3a3a">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="workerDialog = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="worker()" :loading="btnLoading">
          确认</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择计划时间" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="selectDateDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <!-- <TableForm-product :value="workerList" @input="linesChange" :hasToolbar="false" :hasActionbar="false" ref="linesForm" :tableItems="linesListItems" /> -->
      <el-row :gutter="20">
        <el-form ref="dateForm" :model="dateForm" :rules="dateRules" label-width="120px" label-position="top">
          <el-col :span="24">
            <el-form-item label="计划开始日期" prop="planStartDate">
              <el-date-picker v-model="dateForm.planStartDate" type="date" value-format="yyyy-MM-dd"
                :before-current-date="isBeforeCurrentDate" :picker-options="startPickerOptions" style="width: 100%;"
                placeholder="请选择计划开始日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划结束日期" prop="planEndDate">
              <el-date-picker v-model="dateForm.planEndDate" type="date" value-format="yyyy-MM-dd"
                :picker-options="endPickerOptions" :before-start-date="isBeforeStartDate" style="width: 100%;"
                placeholder="请选择计划结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDateDialog">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitDateForm()">
          确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
//   列表，关闭，接收，拒收，开启，暂停，完成，派工,详情
import { getprodOrderList, prodOrderClose, prodOrderReceive, prodOrderRefuse, prodOrderStart, prodOrderSuspend, prodOrderFinished, prodOrderDispatch, prodOrderInfo } from '@/api/productOrdes/finishedProductOrders'
import Form from './Form'
import TableFormProduct from '@/components/no_mount/TableForm-product/index'
import { getGroupList, getEquEquipmentList, getCategoryTrees, getProductionLineList, getProductionLineInfo } from '@/api/basicData/index'
import { number } from 'echarts/lib/export'
export default {
  name: 'carrierProfile',
  components: { Form, TableFormProduct },
  data() {
    return {
      btnLoading:false,
      selectDateDialog: false,
      dateForm: {
        planStartDate: "",
        planEndDate: ""
      },
      startPickerOptions: {
       
       disabledDate: (date) => {
         const today = new Date();
         today.setHours(0, 0, 0, 0); // 将时间设置为当天的凌晨

         return date.getTime() < today.getTime();
       },
     },
     endPickerOptions: {

       disabledDate: (date) => {
         const today = new Date();
         today.setHours(0, 0, 0, 0); // 将时间设置为当天的凌晨

         return date.getTime() < today.getTime();
       },
     },
      lineList: [],
      productionLine: [],
      workstationList: [],
      btnLoading: false,
      workerList: [],
      workerDialog: false,
      stopFlag: false,
      startFlag: false,
      closeFlag: false,
      finshFlag: false,
      workerFlag: false,
      planStartArr: [],
      planEndArr: [],

      visible: false,
      // 订单状态
      orderStatusList: [
        { label: "正常", value: "normal" },
        { label: "暂停", value: "suspend" },
        { label: "关闭", value: "closed" },
        { label: "已完成", value: "finish" },
      ],
      // 生产状态
      productionStatusList: [
        { label: "未生产", value: "not_started" },
        { label: "生产中", value: "start_production" },
        { label: "生产完成", value: "production_completed" },
      ],
      // 接收状态
      receiveStatusList: [
        { label: "未接收", value: "not_received" },
        { label: "已接收", value: "received" },
        { label: "已拒绝", value: "refused" },
      ],
      // 订单类型
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "返工", value: "rework" },
      ],
      insertOrderFlagList: [
        { label: "否", value: false },
        { label: "是", value: true },
      ],
      title: "更多查询",
      tableData: [],
      listLoading: false,
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: " 审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],
      selectArr: [],
      total: 0,
      formVisible: false,
      orderForm: {

        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        orderNo: "",
        workOrderNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        orderType: "normal",
        planSsd: "",
        planSed: "",
        planEsd: "",
        planEed: "",
        receiveStatus: "",
        productionStatus: "",
        orderStatus: "",
        insertOrderFlag: "",
        demandType: "semi_finished",
        documentStatus: "submit",
      },
      filterText: '',
      prodOrderForm: {},
      idsArr: [],
      dateRules: {
        planStartDate: [{ required: true, message: '计划开始日期不能为空', trigger: 'change' }],
        planEndDate: [{ required: true, message: '计划结束日期不能为空', trigger: 'change' }],
      },
    }
  },

  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },

  },
  created() {
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    selectable(row, index) {
      console.log(row);
      let flag = null;
      if (row.receiveStatus == "received") {
        flag = true;
        if (row.orderStatus == "normal" || row.orderStatus == "suspend"||row.productionStatus=="not_started"||row.productionStatus=="start_production") {
          flag = true;

        } else {
          flag = false;

        }
      }
      return flag
    },
    isBeforeCurrentDate(date) {
      const currentDate = new Date();
      return date.getTime() < currentDate.getTime();
    },
    isBeforeStartDate(date) {
      const startDate = new Date(this.dateForm.approvalStateList);
      return date.getTime() < startDate.getTime();
    },
    closeDateDialog(){
      this.selectDateDialog = false
      this.dateForm.planStartDate=""
      this.dateForm.planEndDate=""
      this.$refs.dateForm.resetFields();
    },
    submitDateForm() {
      this.$refs['dateForm'].validate((valid) => {
        if (valid) {
          const date1 = new Date(this.dateForm.planStartDate);
          const date2 = new Date(this.dateForm.planEndDate);
          let flag = null;
          if (date1.getTime() > date2.getTime()) {
            flag = false
            console.log('date1在date2之后');
            this.$message({
              message: "结束日期不能在开始日期之前",
              type: "error"
            })
          }
          if (flag === false) return
          let dataForm = []
          this.idsArr.forEach(item => {
            let obj = {
              planStartDate: this.dateForm.planStartDate,
              planEndDate: this.dateForm.planEndDate,
              id: item
            }
            dataForm.push(obj)
          });
          console.log(dataForm);
          prodOrderStart(dataForm).then(res => {
            this.selectDateDialog = false
            this.$message({
              message: "开启成功",
              type: "success"
            })

            this.initData()
          }).catch(error => {
            this.selectDateDialog = false
          })
        }
      })
    },
    // 删除数据
    handleDel(row) {
      if (row.$index != this.workerList.length - 1) {
        this.$confirm('删除当前工序时，会一起把后面的工序一起删除，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.workerList.splice(row.$index);
        }).catch(() => {

        })
      } else {
        this.workerList.splice(row.$index);
      }

    },
    // 拒收
    rejection(id) {
      prodOrderRefuse(id).then(res => {
        this.$message({
          message: "拒收成功",
          type: "success"
        })
        this.initData()
      }).catch(error => {

      })
    },
    selectworkstation(row) {
      console.log(row);
      this.workstationList = []
      getProductionLineInfo(row.productionLineId).then(res => {
        console.log("工位", res);
        this.workstationList = res.data.returnList
        console.log(this.workstationList);


        this.$forceUpdate()
      })
    },
    // 提交派工的数据
    // 
    worker() {
      console.log(this.workerList);
      let flag = null;
      let dataFormObj = {
        dispatchList: [],
        productionOrderId: this.prodOrderForm.id
      }
      for (let index = 0; index < this.workerList.length; index++) {

        const item = this.workerList[index];
        if (!Number(item.dispatchQuantity)) {
          flag = false
          this.$message({
            message: "派工信息第" + (index + 1) + "行派工数量不能为0或为空",
            type: "error"
          })
          break
        }
        if (index > 0) {
          if (
            Number(item.dispatchQuantity) + Number(item.dispatchedQuantity) >
            (Number(this.workerList[index - 1].dispatchQuantity) + Number(this.workerList[index - 1].dispatchedQuantity))) {
            console.log(666666);
            flag = false
            this.$message({
              message: "第" + (index + 1) + "行总派工数量不能超过第"+index+"道工序的总派工数量",
              type: "error"
            })
            break
          }
        }



        if (Number(item.dispatchQuantity) + Number(item.dispatchedQuantity ? item.dispatchedQuantity : 0) > Number(item.workOrderQuantity)) {
          flag = false
          this.$message({
            message: "总派工数量不能超过生产订单数量！",
            type: "error"
          })
          break
        }
        if (!item.workGroupId && !item.equipmentId && !item.personId) {
          flag = false
          this.$message({
            message: "派工信息第" + (index + 1) + "行班组、设备、人员需要必填一项",
            type: "error"
          })
          break
        }
        if (!item.reportFlag && !item.personId) {
          flag = false
          this.$message({
            message: "派工信息第" + (index + 1) + "行人员不能为空",
            type: "error"
          })
          break
        }
        let obj = {
          dispatchQuantity: item.dispatchQuantity,
          equipmentId: item.equipmentId,
          orderNo: item.orderNo,
          personId: item.personId,
          planStartDate: item.planStartDate,
          planEndDate: item.planEndDate,
          processId: item.processId,
          productionLineId: item.productionLineId,
          productionOrderId: item.productionOrderId,
          remark: item.remark,
          workGroupId: item.workGroupId,
          workOrderId: item.id,
          workOrderStatus: "normal",
          workOrderType: "normal",
          workstationId: item.workstationId,
          dispatchType: "work_order",
        }
        dataFormObj.dispatchList.push(obj)
        // item.workGroupId=""
        //   item.equipmentId=""
        //   item.personId=""
      }
      console.log(123, dataFormObj);
      if (flag === false) return
      this.btnLoading = true
      prodOrderDispatch(dataFormObj).then(res => {
        this.btnLoading = false
        this.workerDialog = false
        this.$message({
          message: "派工成功",
          type: "success"
        })
        this.initData()
      }).catch(error => {
        this.workerDialog = false
        this.btnLoading = false
      })

    },

    // 派工
    batchWorker(id) {
      let obj = {
        id: id,
        dispatch: "1"
      }
      prodOrderInfo(obj).then(res => {
        this.workerList = res.data.workOrderList
        this.prodOrderForm = res.data.prodOrder
        if (this.workerList.length < 1) {
          this.$message({ message: "暂无可派工的数据", type: "error" })
        } else {
          this.workerDialog = true
          let obj = {
            "code": "",
            "createByName": "",
            "endTime": "",
            "keyword": "",
            "name": "",
            "orderItems": [
              {
                "asc": true,
                "column": ""
              }
            ],
            "pageNum": 1,
            "pageSize": -1,
            "startTime": "",
            "state": ""
          }
          // 获取产线
          getProductionLineList(obj).then(res => {
            console.log("产线", res);
            this.lineList = res.data.records
          })
        }
      })
    },
    handleSelectionChange(val) {
      console.log("选中的数据", val);
      this.selectArr = val
    },
    // 批量暂停
    batchStop() {
      if (this.selectArr.length) {
        let arr = this.selectArr.filter(item => item.orderStatus == 'normal' && item.receiveStatus == 'received' && item.productionStatus != 'production_completed')
        console.log(arr);
        if (arr.length < 1) {
          return this.$message({
            message: "您所选的数据没有可暂停的",
            type: "error"
          })
        }
        let idArr = arr.map(obj => obj.id);

        prodOrderSuspend(idArr).then(res => {
          console.log("+++", res);
          this.$message({
            message: "暂停成功",
            type: "success"
          })
          this.initData()
        })
      } else {
        this.$message({
          message: "请先选择数据",
          type: "error"
        })
      }
    },

    // 批量开启
    batchStart() {
      if (this.selectArr.length) {
        let arr = this.selectArr.filter(item => item.orderStatus == 'suspend' && item.receiveStatus == 'received' && item.productionStatus != 'production_completed')
        console.log("开启的数据", arr);
        if (arr.length < 1) {
          return this.$message({
            message: "您所选的数据没有可开启的",
            type: "error"
          })
        }
        this.idsArr = arr.map(obj => obj.id);
        this.selectDateDialog = true
        this.dateForm.planStartDate = ""
        this.dateForm.planStartDate = ""
      } else {
        this.$message({
          message: "请先选择数据",
          type: "error"
        })
      }
    },
    // 批量关闭
    batchClose() {
      if (this.selectArr.length) {
        this.$confirm('您确定强制关闭订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = this.selectArr.filter(item => item.productionStatus !== 'suspend' && item.receiveStatus == 'received' && item.productionStatus != 'production_completed')
          if (arr.length < 1) {
            return this.$message({
              message: "您所选的数据没有可关闭的",
              type: "error"
            })
          }
          let idArr = arr.map(obj => obj.id);
          prodOrderClose(idArr).then(res => {
            console.log("+++", res);
            this.$message({
              message: "开启成功",
              type: "success"
            })
            this.initData()
          })
        })

      } else {
        this.$message({
          message: "请先选择数据",
          type: "error"
        })
      }
    },
    // 批量完成
    batchFinsh() {
      if (this.selectArr.length) {
        this.$confirm('您确定强制完成订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = this.selectArr.filter(item => item.productionStatus !== 'production_completed' && item.receiveStatus == 'received')
          console.log("开启的数据", arr);
          if (arr.length < 1) {
            return this.$message({
              message: "您所选的数据没有可完成的",
              type: "error"
            })
          }
          let idArr = arr.map(obj => obj.id);
          prodOrderFinished(idArr).then(res => {
            console.log("+++", res);
            this.$message({
              message: "开启成功",
              type: "success"
            })
            this.initData()
          })
        })

      } else {
        this.$message({
          message: "请先选择数据",
          type: "error"
        })
      }
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    dataFormSubmit() {
      this.orderForm.pageNum = 1
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      if (this.planStartArr && this.planStartArr.length > 0) {
        this.orderForm.planSsd = this.planStartArr[0]
        this.orderForm.planSed = this.planStartArr[1]
      } else {
        this.orderForm.planSsd = ""
        this.orderForm.planSed = ""
      }

      if (this.planEndArr && this.planEndArr.length > 0) {
        this.orderForm.planEsd = this.planEndArr[0]
        this.orderForm.planEed = this.planEndArr[1]
      } else {
        this.orderForm.planEsd = ""
        this.orderForm.planEed = ""
      }
      this.initData()

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

      getprodOrderList(this.orderForm).then(res => {
        console.log("res++", res);
        // workGroupId,equipmentId,personId
        res.data.records.forEach(item => {
          item.workGroupId = ""
          item.equipmentId = ""
          item.personId = ""
          item.remark = ""
          item.btnLoading=false
        });
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this, this.visible = false

      }).catch(() => {
        this.listLoading = false
      })

    },
    reset() {
      console.log("this.$refs['dataTable']",this.$refs['dataTable']);
      this.$refs['dataTable'].clearSort() // 清除排序箭头高亮
      this.planEndArr = []
      this.planStartArr = []
      this.orderForm = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        orderNo: "",
        workOrderNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        orderType: "normal",
        planSsd: "",
        planSed: "",
        planEsd: "",
        planEed: "",
        receiveStatus: "",
        productionStatus: "",
        orderStatus: "",
        insertOrderFlag: "",
        demandType: "semi_finished",
        documentStatus: "submit",

      },

        this.dataFormSubmit()
    },

    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    updateHandle(row) {
      row.btnLoading=true
      prodOrderReceive(row.id).then(res => {
        this.initData()
      row.btnLoading=false
        row.$message({
          message: "接收成功",
          type: "success"
        })
      }).catch(error => {
        row.btnLoading=false

      })



    },

    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    }
  }
}
</script>
<style  scoped>
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


::v-deep.el-table__body-wrapper {
  height: auto !important;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body {
  margin-top: 20px;
}
::v-deep .el-table__body-wrapper  {
  height: auto !important;
}
</style>
  
  