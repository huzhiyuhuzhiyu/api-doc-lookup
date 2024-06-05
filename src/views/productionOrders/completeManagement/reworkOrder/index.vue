<!-- 成品订单返工管理 -->
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.orderNo" @keyup.enter.native="dataFormSubmit()" placeholder="请输入订单号"
                clearable />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.workOrderNo" @keyup.enter.native="dataFormSubmit()" placeholder="请输入工作令号"
                clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.orderNo" @keyup.enter.native="dataFormSubmit()" placeholder="请输入下料图号"
                clearable />
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.productName" @keyup.enter.native="dataFormSubmit()" placeholder="请输入产品名称"
                clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="orderForm.deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期">
              </el-date-picker>
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
            <topOpts @add="addSupplier('', 'add')" :addText="'新建返工订单'" />
            <el-button style="margin-left:10px" size="mini" @click="batchDispatch" type="primary">批量派工</el-button>
            <el-button size="mini" @click="batchStop" type="info">批量暂停</el-button>
            <el-button size="mini" @click="batchStart" type="primary">批量开启</el-button>
            <!-- <el-button size="mini" @click="batchClose" type="danger">批量关闭</el-button> -->
            <el-button size="mini" @click="batchFinsh" type="success">批量完成</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column
          hasC :fixedNO="true" @selection-change="handleSelectionChange" :checkSelectable="selectable" :row-class-name="tableRowClassName" 
          @select="handleSelection" @row-click="clickRow"  @select-all="allhandleSelectionChange">
          <el-table-column prop="orderNo" label="订单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
        scope.row.orderNo
      }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="产品编码" width="140"> </el-table-column>
          <el-table-column prop="productName" label="产品名称" width="120" :show-overflow-tooltip="true"
            sortable="custom"></el-table-column>
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="260" sortable="custom"
            :show-overflow-tooltip="true"></el-table-column>
          <!-- <el-table-column prop="orderType" label="订单类型" width="120">
            <template slot-scope="scope">
              <div v-for="(item, index) in orderList" :key="index">
                <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="planStartDate" label="计划开始日期" width="160" sortable="custom"></el-table-column>
          <el-table-column prop="planEndDate" label="计划结束日期" width="160" sortable="custom"></el-table-column> -->
          <el-table-column prop="workOrderNo" label="工作令号" min-width="110" show-overflow-tooltip
            sortable="custom"></el-table-column>
          <el-table-column prop="mainUnit" label="单位" width="120"></el-table-column>
          <el-table-column prop="productionQuantity" label="生产数量" width="120"></el-table-column>
          <el-table-column prop="completedQuantity" label="已完成数量" width="120"></el-table-column>
          <el-table-column prop="dispatchedQuantity" label="已派工数量" width="120"></el-table-column>

          <el-table-column prop="submitDate" label="提交时间" width="180"></el-table-column>
          <el-table-column prop="dispatchStatus" label="派工状态" width="110" fixed="right">

            <template slot-scope="scope">
              <el-tag type="warning" disable-transitions v-if="scope.row.dispatchStatus === 'not_finished'">未完成</el-tag>

              <el-tag type="success" disable-transitions v-if="scope.row.dispatchStatus === 'finished'">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productionStatus" label="生产状态" width="120" sortable="custom" fixed="right"
            align="center">
            <template slot-scope="scope">
              <el-tag type="warning" disable-transitions
                v-if="scope.row.productionStatus === 'not_started'">未生产</el-tag>
              <el-tag type="primary" disable-transitions
                v-else-if="scope.row.productionStatus === 'start_production'">生产中</el-tag>
              <el-tag type="success" disable-transitions
                v-else-if="scope.row.productionStatus === 'production_completed'">生产完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" width="120" sortable="custom" fixed="right" align="center">
            <template slot-scope="scope">
              <el-tag type=" primary" disable-transitions v-if="scope.row.orderStatus === 'normal'">正常</el-tag>
              <el-tag type="warning" disable-transitions v-else-if="scope.row.orderStatus === 'suspend'">暂停</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="scope.row.orderStatus === 'closed'">关闭</el-tag>
              <el-tag type="success" disable-transitions v-else-if="scope.row.orderStatus === 'finish'">已完成</el-tag>

            </template>
          </el-table-column>
          <el-table-column prop="routingCode" label="工艺路线编码" min-width="160" sortable="custom" />
          <el-table-column prop="routingName" label="工艺路线名称" min-width="160" />
          <el-table-column prop="suspendByName" label="暂停人" width="120"></el-table-column>
          <el-table-column prop="suspendDate" label="暂停时间" width="120"></el-table-column>

          <!-- <el-table-column prop="closedByName" label="关闭人" width="120"></el-table-column>
          <el-table-column prop="closeDate" label="关闭时间" min-width="200" sortable="custom"></el-table-column> -->
          <el-table-column prop="workOrderNo" label="工作令号" width="120"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="documentStatus" fixed="right" label="单据状态" width="120" sortable="custom"
            align="center">
            <template slot-scope="scope">

              <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
              <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>

            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                @click="updateHandle(scope.row.id, 'edit')">编辑</el-button>
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
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')"> 查看详情</el-dropdown-item>
                  <!-- <el-dropdown-item
                    :disabled="!(scope.row.orderStatus == 'normal' && scope.row.productionStatus != 'production_completed' && scope.row.documentStatus !== 'draft')"
                    @click.native="batchWorker(scope.row.id)">
                    派工
                  </el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <Forms v-if="formVisibles" ref="Forms" @refreshDataList="initData" @close="closeForm" />
    <batchDispatchForm v-if="batchDispatchFormVisibles" ref="batchDispatchForms" @refreshDataList="initData"
      @close="closeForm" />

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
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="orderForm.deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="orderForm.documentStatus" placeholder="请选择接收状态" clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label"
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
            <el-form-item label="派工状态">
              <el-select v-model="orderForm.dispatchStatus" placeholder="请选择派工状态" clearable>
                <el-option v-for="(item, index) in dispatchStatusList" :key="index" :label="item.label"
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
            <el-form-item label="返工类型" prop="reworkType">
              <el-select v-model="orderForm.reworkType" placeholder="请选择返工类型" style="width: 100%">
                <el-option v-for="(item, index) in reworkTypeList" :key="index" :label="item.label"
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
    <el-dialog title="生产派工" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="workerDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <!-- <TableForm-product :value="workerList" @input="linesChange" :hasToolbar="false" :hasActionbar="false" ref="linesForm" :tableItems="linesListItems" /> -->
      <el-row :gutter="20">

        <JNPF-table ref="workerDialog" v-loading="listLoading" :data="workerList" height="400">
          <el-table-column prop="processCode" label="工序编码" width="160"> </el-table-column>
          <el-table-column prop="processName" label="工序名称" width="120" />
          <el-table-column prop="planStartDate" label="计划开始时间" min-width="200">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.planStartDate" :clearable="false" type="date" value-format="yyyy-MM-dd"
                style="width: 100%;" placeholder="计划开始时间" :picker-options="pickerOptions">
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
              <el-select v-model="scope.row.workGroupId" placeholder="请选择班组">
                <el-option v-for="(item, index) in scope.row.routingProResMap.work_group" :key="index"
                  :label="item.resourceName" :value="item.resourceId"></el-option>
              </el-select>
              <!-- <el-input v-model="scope.row.productCode" placeholder="请输入班组"  /> -->
            </template>
          </el-table-column>
          <el-table-column prop="equipmentId" label="设备" width="160">
            <template slot-scope="scope">
              <el-select v-model="scope.row.equipmentId" placeholder="请选择设备">
                <el-option v-for="(item, index) in scope.row.routingProResMap.device" :key="index"
                  :label="item.resourceName" :value="item.resourceId"></el-option>
              </el-select>
              <!-- <el-input v-model="scope.row.productCode" placeholder="请选择设备"  /> -->
            </template>
          </el-table-column>
          <el-table-column prop="personId" label="人员" width="160">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.productCode" placeholder="请选择人员"  /> -->
              <el-select v-model="scope.row.personId" placeholder="请选择人员">
                <el-option v-for="(item, index) in scope.row.routingProResMap.personnel" :key="index"
                  :label="item.resourceName" :value="item.resourceId"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="productionLineId" label="产线" width="160">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.productCode" placeholder="请选择产线"  /> -->
              <el-select v-model="scope.row.productionLineId" placeholder="请选择产线">
                <el-option v-for="(item, index) in lineList" :key="index" :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="workstationId" label="工位" width="160">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.productCode" placeholder="请选择工位" /> -->
              <el-select v-model="scope.row.workstationId" placeholder="请选择工位" :disabled="!scope.row.productionLineId"
                @focus="selectworkstation(scope.row)">
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

              <el-button size="mini" type="text" :disabled="scope.$index == 0" @click="handleDeldata(scope)"
                style=" color: #ff3a3a">删除</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="workerDialog = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="worker()">
          确认</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择计划时间" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="selectDateDialog" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
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
        <el-button type="primary" @click="submitDateForm()">
          确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import Form from './Form'
import batchDispatchForm from './batchDispatchForm'
import Forms from './Forms'
import { getprodOrderList, prodOrderClose, prodOrderReceive, prodOrderRefuse, prodOrderStart, delOrderRework, prodOrderSuspend, prodOrderFinished, prodOrderDispatch, prodOrderInfo } from '@/api/productOrdes/finishedProductOrders'
import { getGroupList, getEquEquipmentList, getCategoryTrees, getProductionLineList, getProductionLineInfo } from '@/api/basicData/index'
export default {
  name: 'carrierProfile',
  components: { Form, Forms, batchDispatchForm },
  data() {
    return {
      batchDispatchFormVisibles: false,
      reworkTypeList: [
        { label: "返工成品", value: "product" },
        { label: "返工成品工序", value: "process" },
      ],
      workerDialog: false,
      btnLoading: false,
      workerList: [],
      workstationList: [],
      visible: false,
      title: "更多查询",
      planStartArr: [],
      planEndArr: [],
      dispatchStatusList: [
        { label: "所有", value: "" },
        { label: "未完成", value: "not_finished" },
        { label: "已完成", value: "finished" },

      ],
      orderForm: {
        dispatchStatus: "",
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
        orderType: "rework",
        planSsd: "",
        planSed: "",
        planEsd: "",
        planEed: "",
        documentStatus: "",
        productionStatus: "",
        orderStatus: "",
        demandType: "",
        businessCode:"complete",

      },
      lineList: [],
      tableData: [],
      listLoading: false,
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
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
      // 订单类型
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "返工", value: "rework" },
      ],
      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: " 审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],
      total: 0,
      formVisible: false,
      formVisibles: false,
      filterText: '',
      selectArr: [],
      prodOrderForm: {},
      idsArr: [],
      dateRules: {
        planStartDate: [{ required: true, message: '计划开始日期不能为空', trigger: 'change' }],
        planEndDate: [{ required: true, message: '计划结束日期不能为空', trigger: 'change' }],
      },
      selectDateDialog: false,
      dateForm: {
        planStartDate: "",
        planEndDate: ""
      },
      numbers:[],
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
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now();
        }
      },
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    clickRow(row, event, column) {
          console.log("this.$refs['dataTable'].$refs", this.$refs['dataTable']);
      if(!this.selectable(row))return

      this.$nextTick(()=>{
        this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row);
      
      this.tableData.forEach((r, i) => {
        if (r.id == row.id) {
          /* console.log(this.numbers.indexOf(i)) */
          if (this.numbers.indexOf(r.index) == -1) {
            this.numbers.push(r.index);
          } else {
            this.numbers.splice(this.numbers.indexOf(r.index), 1);
          }
        }
      });
      })

    },
    handleSelection(val, row) {

      // 表单绑定的数据
      this.tableData.forEach((item, i) => {
        if (item.id == row.id) {
          /* console.log(this.numbers.indexOf(i)) */
          if (this.numbers.indexOf(item.index) == -1) {
            this.numbers.push(item.index);
          } else {
            this.numbers.splice(this.numbers.indexOf(item.index), 1);
          }
        }
      });

    },
    allhandleSelectionChange(data){
      this.tableData.forEach((item, i) => {
        if(data.length){
        data.forEach((items, i) => {
            /* console.log(this.numbers.indexOf(i)) */
            if (item.id == items.id) {
          /* console.log(this.numbers.indexOf(i)) */
          this.numbers.push(items.index);
        }
        });
      }else{
        this.numbers=[]
      }
        
      });
      


    },


    tableRowClassName({ row, rowIndex }) {
      let color = "";
      this.numbers.forEach((r, i) => {
        if (rowIndex === r&&this.selectable(row)) {
          color = "tableSelectedRowBgColor";
        }
      });
        return color;
    },


    checkRoutingIds(arr) {
      const firstProductId = arr[0].routingId;
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].routingId !== firstProductId) {
          return false;
        }
      }
      return true;
    },
    // 批量派工
    batchDispatch() {
      if (this.selectArr.length) {
        let flag = this.checkRoutingIds(this.selectArr)
        console.log("flag", flag);
        if (!flag) return this.$message.error("批量派工的产品必须工艺路线一样")
        let a = [], b = []
        this.selectArr.forEach(item => {
          if (item.blankingProductsId) {
            b.push(item)
          } else {
            a.push(item)
          }
        });
        let submitFlag = null

        if (b.length) {
          let flag = false
          for (let index = 0; index < b.length; index++) {
            const item = b[index];
            if (flag) return
            if (Number(item.dispatchedQuantity) >= Number(item.blankingQuantity)) {
              this.$message({
                message: "订单" + item.orderNo + "未下料，请先下料",
                type: "error"
              })
              submitFlag = false
              flag = true
              break
            }
            if (Number(item.dispatchedQuantity) >= Number(item.productionQuantity)) {
              this.$message({
                message: "订单" + item.orderNo + "派工数量等于生产数量，无法进行派工",
                type: "error"
              })
              submitFlag = false
              flag = true
              break
            }
            if (item.orderStatus != 'normal') {
              flag = true
              submitFlag = false
              this.$message({
                message: "订单" + item.orderNo + "为暂停状态，不可进行派工操作",
                type: "error"
              })
              break
            }

          }

        }
        if (a.length) {
          a.forEach(item => {
            if (item.orderStatus != 'normal') {
              submitFlag = false
              return this.$message({
                message: "订单" + item.orderNo + "为暂停状态，不可进行派工操作",
                type: "error"
              })
            }
            //   if (Number(item.dispatchedQuantity) >= Number(item.productionQuantity)) {

            //    submitFlag = false 
            //    return  this.$message({
            //      message: "订单" + item.orderNo + "派工数量等于生产数量，无法进行派工",
            //      type: "error"
            //    })
            //  }
          });
        }
        if (submitFlag === false) return
        this.selectArr = this.selectArr.filter(o => o.dispatchedQuantity != o.productionQuantity)
        if (!this.selectArr.length) return this.$message.error("当前所选的订单数据没有可派工的")
        this.batchDispatchFormVisibles = true
        this.$nextTick(() => {
          this.$refs.batchDispatchForms.init(this.selectArr)
        })

      } else {
        this.$message({
          message: "请先选择数据",
          type: "error"
        })
      }
    },
    handleDeldata(row) {
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
    selectable(row, index) {
      let flag = null;
      if (row.orderStatus == "normal" || row.orderStatus == "suspend" || row.productionStatus == "not_started" || row.productionStatus == "start_production") {
        flag = true;

      } else {
        flag = false;

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
    closeDateDialog() {
      this.selectDateDialog = false
      this.dateForm.planStartDate = ""
      this.dateForm.planEndDate = ""
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
          })
        }
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

    worker() {
      console.log(this.workerList);
      let flag = null;
      let dataFormObj = {
        dispatchList: [],
        productionOrderId: this.prodOrderForm.id
      }
      for (let index = 0; index < this.workerList.length; index++) {

        const item = this.workerList[index];
        if (!item.dispatchQuantity) {
          flag = false
          this.$message({
            message: "派工信息第" + (index + 1) + "行派工数量不能为0或为空",
            type: "error"
          })
          break
        }
        if (Number(item.dispatchQuantity) + Number(item.dispatchedQuantity ? item.dispatchedQuantity : 0) > Number(item.workOrderQuantity)) {
          flag = false
          this.$message({
            message: "派工信息第" + (index + 1) + "行派工数量与已派工数量之和不能超过订单生产数量",
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
        this.workerDialog = false
        this.btnLoading = false
        this.$message({
          message: "派工成功",
          type: "success"
        })
        this.initData()
      }).catch(error => {
        this.btnLoading = false

      })

    },
    // 派工
    batchWorker(id) {
      console.log(9999);
      let obj = {
        id: id,
        dispatch: "1"
      }
      prodOrderInfo(obj).then(res => {
        if (res.data.workOrderList.length > 0) {
          this.formVisibles = true
          this.$nextTick(() => {
            this.$refs.Forms.init(id)
          })
        } else {
          this.$message({
            message: "该订单没有可派工的数据",
            type: "error"
          })
          return
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

        let arr = this.selectArr.filter(item => item.orderStatus == 'normal' && item.productionStatus != 'production_completed' && item.documentStatus == "submit")
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
        let arr = this.selectArr.filter(item => item.orderStatus == 'suspend' && item.productionStatus != 'production_completed' && item.documentStatus == "submit")
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
          let arr = this.selectArr.filter(item => item.orderStatus !== 'suspend' && item.productionStatus != 'production_completed' && item.documentStatus == "submit")
          console.log("开启的数据", arr);
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
          let arr = this.selectArr.filter(item => item.orderStatus !== 'suspend' && item.productionStatus !== 'production_completed' && item.documentStatus == "submit")
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
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
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
      this.formVisibles = false
      this.batchDispatchFormVisibles = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true

      getprodOrderList(this.orderForm).then(res => {
        res.data.records.forEach((item,index) => {
          item.index=index
        });
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()// 清除排序箭头高亮
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
        dispatchStatus: "",
        orderNo: "",
        workOrderNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        orderType: "rework",
        planSsd: "",
        planSed: "",
        planEsd: "",
        planEed: "",
        documentStatus: "",
        productionStatus: "",
        orderStatus: "",
        businessCode:"complete",
        demandType: ""
      },

        this.dataFormSubmit()
    },

    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    updateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        console.log(4444444);
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype,)
        })
        // }, 600);
      }


    },
    handleDel(id) {
      console.log(id)
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delOrderRework(id).then(res => {
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

::v-deep.el-table__body {
  height: 100%;
}

::v-deep.el-table__body-wrapper {
  height: auto !important;
}

.required {
  color: red;
  margin-right: 4px;
}
::v-deep  .tableSelectedRowBgColor td {
  background-color: #fedcbd !important;
}
</style>
