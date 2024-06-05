<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="请输入派工单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.workNo" placeholder="请输入工单号" clearable />
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
            <div>
              <!-- <el-button size="mini" @click="handleBatch('startWork')" :disabled="!startWorkFlag"
                :loading="btnLoading">批量开工</el-button>
              <el-button size="mini" @click="handleBatch('stopWork')" :disabled="!stopWorkFlag" :loading="btnLoading"
                type="warning">批量下工</el-button> -->
              <el-button size="mini" @click="handleBatch('suspend')" :disabled="!suspendFlag" :loading="btnLoading"
                type="info">批量暂停</el-button>
              <el-button size="mini" @click="handleBatch('start')" :disabled="!startFlag" :loading="btnLoading"
                type="primary">批量开启</el-button>
              <!-- <el-button size="mini" @click="handleBatch('closed')" :disabled="!closeFlag" :loading="btnLoading"
                type="danger">批量关闭</el-button> -->
              <el-button size="mini" @click="handleBatch('finished')" :disabled="!finishedFlag" :loading="btnLoading"
                type="success">批量完成</el-button>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :selectable="tableData" :data="tableData" fixedNO
            @sort-change="sortChange" custom-column hasC @selection-change="currentChange"
            :checkSelectable="(row) => row.startingStatus !== 'finished'">
            <el-table-column prop="orderNo" label="派工单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="productionOrderNo" label="生产订单号" min-width="200" sortable="custom" />
            <el-table-column prop="workNo" label="工单号" min-width="200" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" min-width="120" sortable="custom" />
            <!-- <el-table-column prop="workOrderNo" label="工作令号" min-width="180" /> -->
            <el-table-column prop="productCode" label="产品编码" min-width="140" />
            <el-table-column prop="productName" label="产品名称" min-width="140" />
            <el-table-column prop="productDrawingNo" label="产品图号" min-width="140" />
            <el-table-column prop="workGroupName" label="班组名称" min-width="120" />
            <el-table-column prop="equipmentName" label="设备名称" min-width="220" >
              <template slot-scope="scope">
                <div>{{ scope.row.equipmentName?scope.row.equipmentName+"("+ scope.row.equipmentCode+")":""}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="personName" label="人员名称" min-width="120" />
            <el-table-column prop="productionLineName" label="产线名称" min-width="120" />
            <el-table-column prop="workstationName" label="工位名称" min-width="120" />
            <el-table-column prop="dispatchQuantity" label="派工生产数量" min-width="120" />
            <el-table-column prop="completedQuantity" label="完工数" min-width="120" />
              <el-table-column prop="industrialWasteQuantity" label="工废数量" min-width="130" />
            <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
            <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
            <el-table-column prop="actualStartDate" label="实际开始时间" width="180" sortable="custom" />
            <el-table-column prop="actualEndDate" label="实际结束时间" width="180" sortable="custom" />
            <el-table-column prop="processCode" label="工序编码" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" />
            <el-table-column prop="remark" label="备注" min-width="200" />
            <el-table-column prop="startingStatus" label="开工状态" width="120" align="center" fixed="right"
              sortable="custom">
              <template slot-scope="scope">
                <el-tag type="warning" disable-transitions v-if="scope.row.startingStatus === 'not_started'">未开工</el-tag>
                <el-tag type="primary" disable-transitions
                  v-else-if="scope.row.startingStatus === 'in_progress'">开工中</el-tag>
                <el-tag type="success" disable-transitions
                  v-else-if="scope.row.startingStatus === 'finished'">已完工</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="workOrderStatus" label="派工单状态" width="140" align="center" fixed="right"
              sortable="custom">
              <template slot-scope="scope">
                <el-tag type="primary" disable-transitions v-if="scope.row.workOrderStatus === 'normal'">正常</el-tag>
                <el-tag type="info" disable-transitions v-else-if="scope.row.workOrderStatus === 'suspend'">暂停</el-tag>
                <el-tag type="danger" disable-transitions v-else-if="scope.row.workOrderStatus === 'closed'">关闭</el-tag>
                <el-tag type="success" disable-transitions v-else-if="scope.row.workOrderStatus === 'finish'">已完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.workOrderStatus!='normal'"
                @click.native="updataData(scope.row.id )">改派</el-button>
                <el-button size="mini" type="text"
                @click.native="addOrUpdateHandle(scope.row.id, true)">查看详情</el-button>
               
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm"
      :startingStatusList="startingStatusList" :workOrderStatusList="workOrderStatusList" />
      <BatchDispatchForm v-if="batchReassignmentFormVisibles" ref="batchReassignmentForm" @refreshDataList="initData"
      @close="closeForm" />
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="派工单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入派工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产订单号">
              <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作令号">
              <el-input v-model="listQuery.workOrderNo" placeholder="请输入工作令号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单号">
              <el-input v-model="listQuery.workNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序编码">
              <el-input v-model="listQuery.processCode" placeholder="请输入工序编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="listQuery.processName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班组名称">
              <el-input v-model="listQuery.workGroupName" placeholder="请输入班组名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备代码">
              <el-input v-model="listQuery.equipmentCode" placeholder="请输入设备代码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员名称">
              <el-input v-model="listQuery.personName" placeholder="请输入人员名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开工状态">
              <el-select v-model="listQuery.startingStatus" placeholder="请选择开工状态" clearable style="width: 100%;">
                <el-option v-for="( item, index ) in startingStatusList " :key="index" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="派工单状态">
              <el-select v-model="listQuery.workOrderStatus" placeholder="请选择派工单状态" clearable style="width: 100%;">
                <el-option v-for="( item, index ) in workOrderStatusList " :key="index" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始日期">
              <el-date-picker v-model="listQuery.planStartTime" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期"
                :picker-options="global.timePickerOptions.shortcuts" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束日期">
              <el-date-picker v-model="listQuery.planEndTime" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期"
                :picker-options="global.timePickerOptions.shortcuts" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际开始时间">
              <el-date-picker v-model="listQuery.actualStartTime" type="datetimerange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际结束时间">
              <el-date-picker v-model="listQuery.actualEndTime" type="datetimerange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择创建时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
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

    <el-dialog :title="batchFormTitle" :close-on-click-modal="false" append-to-body :visible.sync="batchFormVisible"
      class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
      <el-row :gutter="15" class="">
        <el-form ref="elForm" :model="dataForm" size="small" label-position="top">
          <el-row :gutter="30" class="custom-row">
            <el-col :sm="24" :xs="24">
              <el-form-item label="工作人员" prop="personId"
                :rules="[{ required: true, trigger: 'change', message: '请选择工作人员' }]">
                <user-select v-model="dataForm.personId" placeholder="请选择工作人员" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :xs="24">
              <el-form-item label="操作时间" prop="operatingTime"
                :rules="[{ required: true, trigger: 'change', message: '请选择操作时间' }]">
                <el-date-picker v-model="dataForm.operatingTime" type="datetime" placeholder="请选择操作时间"
                  style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="timePickerOptions" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchFormVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()" :loading="batchFormBtnLoading">
          {{ $t('common.submitButton') }}
        </el-button>
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
        <el-button type="primary" :loading="btnLoading" @click="submitDateForm()">
          确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDispatchList, batchDispatchData, DispatchStart } from '@/api/productOrdes/dispatchTicketInquiry'
import Form from './Form.vue'
import BatchDispatchForm from './batchDispatchForm.vue'
export default {
  components: { Form,BatchDispatchForm },
  data() {
    return {
      batchReassignmentFormVisibles:false,
      visible: false,
      tableData: [],
      listLoading: false,
      formVisible: false,
      selectedData: [],
      startWorkFlag: false,
      stopWorkFlag: false,
      suspendFlag: false,
      startFlag: false,
      closeFlag: false,
      finishedFlag: false,
      btnLoading: false,
      listQuery: {},
      initListQuery: {
        actualEed: "",
        actualEsd: "",
        actualSed: "",
        actualSsd: "",
        createByName: "",
        demandType: "", // 需求类型 生产成品需求 finish_product 、生产半成品需求 semi_finished
        dispatchType: "",
        endTime: "",
        equipmentCode: "",
        keyword: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        personName: "",
        planEed: "",
        planEsd: "",
        planSed: "",
        planSsd: "",
        processCode: "",
        processName: "",
        productionOrderNo: "",
        startTime: "",
        startingStatus: "",
        workGroupName: "",
        workNo: "",
        workOrderNo: "",
        workOrderStatus: "",
        workOrderType: "",
        planStartTime: [],
        planEndTime: [],
        actualStartTime: [],
        actualEndTime: [],
        startAndEndTime: [],
        businessCode:"complete",
      },
      total: 0,
      timePickerOptions: { ...global.timePickerOptions, disabledDate(time) { return time.getTime() > Date.now() }, },
      startingStatusList: [{ label: '未开工', value: 'not_started' }, { label: '开工中', value: 'in_progress' }, { label: '已完工', value: 'finished' }], // 开工状态
      workOrderStatusList: [{ label: '正常', value: 'normal' }, { label: '暂停', value: 'suspend' }, { label: '关闭', value: 'closed' }, { label: '已完成', value: 'finish' }], // 派工单状态
      dataForm: {
        personId: "",
        operatingTime: ""
      },
      batchFormVisible: false,
      batchFormTitle: "",
      batchFormBtnLoading: false,
      batchType: "",
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
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  watch: {
    selectedData: {
      handler: function (data) {
        this.startWorkFlag = data.some(o => o.startingStatus === "not_started" && o.workOrderStatus === "normal")
        this.stopWorkFlag = data.some(o => o.startingStatus === "in_progress")
        this.suspendFlag = data.some(o => o.workOrderStatus === "normal")
        this.startFlag = data.some(o => o.workOrderStatus === "suspend")
        this.closeFlag = data.some(o => o.workOrderStatus === "normal" && o.startingStatus === "not_started")
        this.finishedFlag = data.some(o => o.workOrderStatus === "normal" && o.startingStatus === "not_started")
      }
    }
  },
  methods: {
    selectable(row, index) {
      console.log(row);
      let flag = null;
      if (row.workOrderStatus == "finish") {
        flag = true;

      } else {
        flag = false;

      }
      return flag
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
          DispatchStart(dataForm).then(res => {
            this.selectDateDialog = false
            this.dateForm.planStartDate = ""
            this.dateForm.planEndDate = ""
            this.$message({
              message: "开启成功",
              type: "success"
            })
            this.initData()
          })
        }
      })
    },
    isBeforeCurrentDate(date) {
      const currentDate = new Date();
      return date.getTime() < currentDate.getTime();
    },
    isBeforeStartDate(date) {
      const startDate = new Date(this.dateForm.approvalStateList);
      return date.getTime() < startDate.getTime();
    },
    async dataFormSubmit() {
      let form = this.$refs.elForm
      let valid = await form.validate().catch(err => false)
      if (!valid) return
      let effectData = this.selectedData.filter(o => this.judge(o))
      let requestData = effectData.map(o => {
        return {
          personId: this.dataForm.personId, // 工作人员id
          operatingTime: this.dataForm.operatingTime, // 操作时间
          dispatchListId: o.id,
          productionOrderId: o.productionOrderId,
          workOrderId: o.workOrderId,
          workType: this.batchFormTitle === '上工' ? "up" : "down"
        }
      })
      let batchObj = { batchType: this.batchType, list: requestData }
      this.btnLoading = true
      this.batchFormBtnLoading = true
      batchDispatchData(batchObj).then(res => {
        this.$message.success('操作成功')
        this.initData()
        this.btnLoading = false
        this.batchFormVisible = false
        setTimeout(() => {
          this.batchFormBtnLoading = false
          this.dataForm.personId = ""
        }, 200)
      }).catch(err => {
        this.btnLoading = false
        this.batchFormBtnLoading = false
      })
    },
    // 批量操作
    async handleBatch(batchType) {
      this.batchType = batchType
      if (batchType === "startWork" || batchType === "stopWork") {
        this.batchFormVisible = true
        this.batchFormTitle = batchType === 'startWork' ? "上工" : "下工"
        this.dataForm.operatingTime = this.getTime()
        return
      }
      if (batchType == "start") {
        this.selectDateDialog = true
      }
      let effectData = this.selectedData.filter(o => this.judge(o))

      let ids = effectData.map(o => o.id)
      this.idsArr = ids

      let batchObj = { batchType, list: ids }
      let submitFlag = true
      if (batchType === "closed") {
        submitFlag = await this.$confirm('请确定对应派工单已报工，您确定关闭吗？', this.$t('common.tipTitle'), { type: 'warning' }).catch(err => false)
      } else if (batchType === "finished") {
        submitFlag = await this.$confirm('请确定对应派工单已报工，您确定完成吗？', this.$t('common.tipTitle'), { type: 'warning' }).catch(err => false)
      } else if (batchType === "start") {
        this.btnLoading = false
        submitFlag = false

      }
      if (submitFlag) {
        this.btnLoading = true
        batchDispatchData(batchObj).then(res => {
          this.$message.success('操作成功')
          this.initData()
          this.btnLoading = false
        }).catch(err => { this.btnLoading = false })
      } else { this.btnLoading = false }

    },
    currentChange(data) {
      this.selectedData = data
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productionOrderNo' || prop === 'workNo' || prop === 'processName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      getDispatchList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(err => this.listLoading = false)
    },
    search() {
      this.visible = false
      let searchTimeFormat = (dateArr, startTime, endTime) => {
        if (this.listQuery[dateArr] && this.listQuery[dateArr].length > 0) {
          this.listQuery[startTime] = this.listQuery[dateArr][0].replace(/ 0(?!0)/g, " ")
          this.listQuery[endTime] = this.listQuery[dateArr][1].replace(/ 0(?!0)/g, " ")
        } else {
          this.listQuery[startTime] = ""
          this.listQuery[endTime] = ""
        }
      }
      searchTimeFormat("planStartTime", "planSsd", "planSed")
      searchTimeFormat("planEndTime", "planEsd", "planEed")
      searchTimeFormat("actualStartTime", "actualSsd", "actualSed")
      searchTimeFormat("actualEndTime", "actualEsd", "actualEed")
      searchTimeFormat("startAndEndTime", "startTime", "endTime")
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1 // 重置页码
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },
    addOrUpdateHandle(id, readOnly) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(id, readOnly) })
    },
     // 改派
     updataData(id) {
      this.batchReassignmentFormVisibles = true
      this.$nextTick(() => { this.$refs.batchReassignmentForm.init(id) })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.batchReassignmentFormVisibles=false
      if (isRefresh) { this.initData() }
    },
    judge(o) {
      let flag = true
      if (this.batchType === "startWork") flag = o.startingStatus === "not_started" && o.workOrderStatus === "normal"
      else if (this.batchType === "stopWork") flag = o.startingStatus === "in_progress"
      else if (this.batchType === "suspend") flag = o.workOrderStatus === "normal"
      else if (this.batchType === "start") flag = o.workOrderStatus === "suspend"
      else if (this.batchType === "closed") flag = o.workOrderStatus === "normal" && o.startingStatus === "not_started"
      else if (this.batchType === "finished") flag = o.workOrderStatus === "normal" && o.startingStatus === "not_started"
      return flag
    },
    getTime() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const date = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
      return formattedDate;
    }
  }
}
</script>
<style  scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>