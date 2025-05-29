<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 4">
                <el-form-item>
                  <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                    @keyup.enter.native="search('basic')" />
                  <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                    clearable>
                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                    :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                    :type="item.dateType"
                    :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="addTaskFun()">新建任务</el-button>
              <el-button v-has="'reworkTask'" size="mini" type="primary" icon="el-icon-plus" @click.native="addReworkTaskFun('', 'add')">返工任务</el-button>
              <el-button size="mini" v-has="'btn_split'" type="primary"  @click="splitHander()">拆分</el-button>
              <el-button size="mini" v-has="'btn_redesignate'" type="primary"  @click="redesignateHander()">改制</el-button>
              <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click="addTaskFun()">新建任务</el-button> -->
              <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="addReworkTaskFun('', 'add')">
                新建返工任务
              </el-button>
              <el-button type="primary" size="mini" icon="iconfont-menu  icon-piliangdayin" style="margin-left: 8px;"
                @click="batchPrint">批量打印</el-button>
               <el-button size="mini" type="primary" icon="el-icon-plus" @click="addition2()">追加生产</el-button> -->
              <!-- <el-button size="mini" type="primary" icon="el-icon-edit" @click="reassignmentFun2()">改派</el-button> -->
              <el-button size="mini" type="primary" icon="el-icon-printer" @click="printView('p035')">打印装配单</el-button>
              <el-button size="mini" type="primary" icon="el-icon-printer"
                @click="printFlowCard('p020')">打印流转卡</el-button>
              <el-button size="mini" type="danger" icon="el-icon-close" @click.native="Cancelshipment()"> 关单
              </el-button>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="advanceFun" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table :partentOrChild="'dataTable'" ref="dataTable" :data="tableData" v-if="isProjectSwitchFlag"
            :fixedNO="true" :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" hasC
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" sortable="custom" />
            <el-table-column prop="orderNo" label="生产任务单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="viewDetailFun(scope.row.id)">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="任务类型" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderType == 'normal'">正常任务</div>
                <div v-if="scope.row.orderType == 'rework'">返工任务</div>
                <div v-if="scope.row.orderType == 'manually'">新建任务</div>
                <div v-if="scope.row.orderType == 'flipping'">翻库任务</div>
                <div v-if="scope.row.orderType == 'transit'">在制任务</div>
              </template>
            </el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
              v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />

            <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
              v-if="isProjectSwitch == 1" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="productionQuantity" label="总生产数量" min-width="140" sortable="custom" />
            <el-table-column prop="completedQuantity" label="已完成数量" min-width="140" sortable="custom" />
            <el-table-column prop="splitQuantity" label="已拆分数量" min-width="140" sortable="custom" v-has="'btn_split'" />
            <template v-if="$store.getters.configData.produce.steelBallTask">
              <el-table-column prop="productionWeight" label="生产重量" min-width="140" sortable="custom" />
              <el-table-column prop="productionBarrels" label="生产桶数" min-width="140" sortable="custom" />
            </template>
            <el-table-column prop="prodSchedule" label="完成进度" min-width="140">
              <template slot-scope="scope">
                <el-progress
                  :percentage="Number((scope.row.completedQuantity / scope.row.productionQuantity * 100).toFixed(2)) || 0"></el-progress>
              </template>
            </el-table-column>
            <el-table-column prop="routingName" label="工艺路线名称" min-width="160" sortable="custom" />
            <el-table-column prop="routingCode" label="工艺路线编码" min-width="160" sortable="custom" />
            <el-table-column prop="taskMethod" label="编排任务方式" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.taskMethod == 'appoint' ? "指定加工对象" : '不指定加工对象' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="productionLineName" label="产线" min-width="120" sortable="custom" />
            <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  width="140" sortable="custom"
              v-if="sealingCoverTypingFlag == 1" />

              <el-table-column prop="standardValue" label="规值"  width="140" sortable="custom"
              v-if="standardValueFlag == 1" />
            <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  width="120" sortable="custom"
              v-if="accuracyLevelFlag == 1" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
              v-if="vibrationLevelFlag == 1" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
            <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" v-if="oilQuantityFlag == 1" />
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
              v-if="packagingMethodFlag == 1" />
            <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  width="120" sortable="custom"
              v-if="specialRequireFlag == 1" />
            <el-table-column prop="material" label="保持架材质" width="130" sortable="custom"
              v-if="materialFlag == 1"></el-table-column>
            <el-table-column prop="colour" :label="$store.getters.colour"  width="120" sortable="custom"
              v-if="colourFlag == 1"></el-table-column>
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="urgentFlag" label="是否紧急" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div :style="scope.row.urgentFlag ? 'color:red' : ''">{{ scope.row.urgentFlag ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
            <el-table-column label="操作" width="320" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'feed')">投料信息</el-button>
                <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'work')">工单信息</el-button>
                <el-button size="mini" type="text"
                  @click="handleUserRelation(scope.row.orderNo, 'report')">报工信息</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addition1(scope.row)">
                      追加生产
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="updataDispatch(scope.row.id)"
                      v-if="scope.row.taskMethod != 'not_appoint'">
                      改派
                    </el-dropdown-item>
                    <!-- <el-dropdown-item v-has="'btn_split'" v-if="scope.row.orderStatus==='normal'" @click.native="splitHander(scope.row.id)">
                      拆分
                    </el-dropdown-item>
                    <el-dropdown-item v-has="'btn_redesignate'" v-if="scope.row.orderStatus==='normal'" @click.native="redesignateHander(scope.row.id)">
                      改制
                    </el-dropdown-item> -->
                    <el-dropdown-item @click.native="generateQRcode(scope.row)" >
                      生成二维码
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="editPlanDate(scope.row)" >
                      修改计划日期
                    </el-dropdown-item>
                    <!-- <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'all')">
                      查看详情
                    </el-dropdown-item> -->
                    <el-dropdown-item @click.native="viewDetailFun(scope.row.id)">
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
    </div>
    <el-dialog title="追加生产数量" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="addOrderVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="form" :rules="dataRule" label-width="120px" label-position="left">
          <el-col :span="24">
            <el-form-item label="生产任务单号" prop="orderNo">
              <el-input v-model="form.orderNo" placeholder="生产任务单号" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="原生产数" prop="productionQuantity">
              <el-input v-model="form.productionQuantity" placeholder="原生产数" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="追加数量" prop="appendQuantity">
              <el-input v-model="form.appendQuantity" placeholder="追加数量" clearable />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrderVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitFun()">
          提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="拆分" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="splitVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">
        <el-form ref="splitForm" :model="splitForm" :rules="splitDataRule" label-width="120px" label-position="left">
          <el-col :span="24">
            <el-form-item label="生产任务单号">
              <el-input v-model="splitForm.orderNo" placeholder="生产任务单号" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="品名规格">
              <el-input v-model="splitForm.productDrawingNo" placeholder="品名规格" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="可拆分数量">
              <el-input v-model="splitForm.canSplitQuantity" placeholder="原生产数" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="拆分数量" prop="splitQuantity">
              <el-input v-model="splitForm.splitQuantity" placeholder="追加数量" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工艺路线" prop="routingId">
              <el-select v-model="splitForm.routingId" placeholder="工艺路线" @change="routingChange">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                      v-for="item in routingOptions" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="splitVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="splitSubmitFun()">
          提交</el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ReworkForm v-if="reworkVisible" ref="reworkForm" @refreshDataList="initData" @close="closeForm"></ReworkForm>
    <BatchDispatchForm v-if="BatchDispatchVisible" ref="BatchDispatchForm" @refreshDataList="initData"
      @close="closeForm">
    </BatchDispatchForm>
    <ProcessOutForm v-if="processOutFormVisible" ref="ProcessOutForm" @close="closeForm" @toOutSouringForm="toOutSouringForm" />
    <TaskForm v-if="taskFormVisible" ref="taskForm" @refreshDataList="initData" @close="closeForm" @handleProcessOut="handleProcessOut"></TaskForm>
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" :params="workOrderForm"
      :fullName="fullName" ref="printForm" />
    <!-- 打印流转卡弹窗选择工单数据 -->
    <el-dialog title="工单信息" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="workOrderVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <el-form ref="workOrderForm" :rules='workOrderRule' :model="workOrderForm" label-width="120px"
          label-position="left">
          <el-col :span="12">
            <el-form-item label="生产数量：" prop="productionQuantity">
              <el-input v-model="workOrderForm.productionQuantity" placeholder="生产数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打印模版：" prop="enCode">
              <el-select v-model="workOrderForm.enCode" placeholder="选择打印模版">
                <el-option :key="item.id" :label="item.fullName" :value="item.id" v-for="item in printList" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <JNPF-table ref="work" :data="workOrderData" hasC @selection-change="handleSelectWork" fixedNo
        v-loading="tableloading" border :checkSelectable="row => !row.selectFlag" customKey="JNPFTableKey_232750">
        <el-table-column prop="orderNo" label="工单号" min-width="160" />
        <el-table-column prop="processName" label="工序名称" min-width="120" />
        <el-table-column prop="processCode" label="工序编码" min-width="120"></el-table-column>
        <el-table-column prop="planStartDate" label="计划开始日期" min-width="150"></el-table-column>
        <el-table-column prop="planEndDate" label="计划结束日期" min-width="150"></el-table-column>
        <el-table-column prop="mainUnit" label="单位" min-width="80"></el-table-column>
        <el-table-column prop="productionQuantity" label="生产数量" min-width="100"></el-table-column>
        <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="100"></el-table-column>
        <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="130"></el-table-column>
      </JNPF-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="workOrderVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="printSubmit()">
          打 印</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改计划日期" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="dateVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">
        <el-form ref="dateForm" :model="dateForm" :rules="dateRule" label-width="120px" label-position="left">
          <el-col :span="24">
            <el-form-item label="生产任务单号" prop="orderNo">
              <el-input v-model="dateForm.orderNo" placeholder="生产任务单号" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="计划开始日期" prop="planStartDate">
              <el-date-picker v-model="dateForm.planStartDate" placeholder="计划开始日期" type="date"
                            value-format="yyyy-MM-dd" style="width: 100%;">
                          </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划结束日期" prop="planEndDate">
              <el-date-picker v-model="dateForm.planEndDate" placeholder="计划结束日期" type="date"
                            value-format="yyyy-MM-dd" style="width: 100%;">
                          </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dateVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitEditDateFun()">
          提交</el-button>
      </span>
    </el-dialog>
    <!-- 选择打印模版弹窗 -->
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" />
    <PrintDialog2 :visible.sync="printVisible2" @closePrint="closePrint2" @printSubmit="printWarehouse2"
      :printQuery="printQuery2" :enCode="enCode2" ref="printTemplate2" append-to-body />
    <print-browse2 :visible.sync="printBrowseVisible2" :id="prindId2" :formId="formId2" ref="printForm" />
    <AddTaskForm v-if="addTaskFormVisible" ref="addTaskForm" @refreshDataList="initData" @close="closeForm">
    </AddTaskForm>
    <SplitTaskForm v-if="splitTaskFormVisible" ref="splitTaskForm" @refreshDataList="initData" @close="closeForm">
    </SplitTaskForm>
    <RedesignateTaskForm v-if="redesignateTaskFormVisible" ref="redesignateTaskForm" @refreshDataList="initData" @close="closeForm">
    </RedesignateTaskForm>
    <OutSouringForm v-if="outSouringFormVisible" ref="OutSouringForm" @refreshDataList="initData" @close="closeForm" />
    <el-dialog title="生产任务码" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="dialogVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px" style="text-align: center;">
      <div id="qrcode" ref="qrCode" style="text-align: center;"></div>
    </el-dialog>
  </div>
</template>
<script>
import { ordershengchanList, addOrderNum, detailordershengchan,editProductOrder, splitOrderNum} from '@/api/productOrdes/index.js'
import { prodOrderClose } from '@/api/productOrdes/finishedProductOrders.js'
import { UserListAll, } from '@/api/permission/user'
import Form from './Form'
import ReworkForm from './reworkForm.vue'
import BatchDispatchForm from './batchDispatchForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'
import PrintBrowse2 from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import PrintDialog2 from '@/components/no_mount/printDialog'
import ProcessOutForm from './ProcessOutForm.vue';
import { getPrintList } from '@/api/system/printDev'
import { excelExport, getOrderFiledMap,getProductionLineList } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import TaskForm from './taskFormCopy.vue'
import AddTaskForm from './addTaskForm.vue'
import SplitTaskForm from './splitTaskForm.vue'
import RedesignateTaskForm from './redesignateTaskForm.vue'
import { getProcessList,detailProcess } from '@/api/basicData/processSettingss'
import OutSouringForm from '@/views/outsourcingManagement/processOutsourcingOrders/orderCreation/index.vue'
// import TaskForm from './taskForm.vue'
import QRCode from 'qrcodejs2'
export default {
  name: 'blankTaskManagement',
  components: { SuperQuery, Form, ReworkForm, BatchDispatchForm, PrintBrowse, PrintDialog, TaskForm, AddTaskForm, SplitTaskForm,RedesignateTaskForm, PrintDialog2, PrintBrowse2,ProcessOutForm,OutSouringForm },
  mixins: [getProjectList],
  data() {
    return {
      dialogVisible:false,
      qrCode:"",
      addTaskFormVisible: false,
      splitTaskFormVisible:false,
      redesignateTaskFormVisible:false,
      processOutFormVisible:false,
      outSouringFormVisible:false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productionLineId', fieldValue: '', label: '产线', symbol: 'like', searchType: 4, width: 120, options: [] },
      ],
      taskFormVisible: false,
      fullName: '',
      printVisible: false,
      BatchDispatchVisible: false,
      printBrowseVisible: false,
      workOrderVisible: false,
      workOrderForm: {
        productionQuantity: '',
        enCode: ''
      },
      form: {
        appendQuantity: "",
        productionQuantity: "",
        orderNo: ""
      },
      reworkVisible: false,
      addOrderVisible: false,
      // 拆分
      splitVisible: false,
      splitForm: {
        splitQuantity: "",
        canSplitQuantity: "",
        orderNo: "",
        routingId:"",
      },
      routingOptions:[],
      splitDataRule: {
        splitQuantity: [
          { required: true, message: '请输入拆分数量', trigger: 'blur' },
          { validator: this.calcValidate(), trigger: 'blur' },
        ],
        routingId: [
          { required: true, message: '请选择工艺路线', trigger: 'change' },
        ],
      },
      columnList: ["productCode", "routingCode", "planStartDate", "planEndDate", "createByName",],
      superQueryVisible: false,
      btnLoading: false,
      title: "更多查询",
      tableData: [],
      listLoading: false,
      detailFlag: false,
      orderForm: {},
      orderFormlist: {
        productDrawingNo: "",
        productionPlanNo: "",
        productionLineId: "",
        orderNo: "",
        orderStatus: "normal",
        classAttribute: "raw_material",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      total: 0,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "生产任务单号",
          type: 'input'
        },
        {
          prop: 'orderType',
          label: "任务类型",
          type: 'select',
          options: [
            { label: "正常任务", value: "normal" },
            { label: "返工任务", value: "rework" },
            { label: "新建任务", value: "manually" },
            { label: "翻库任务", value: "flipping" },
            { label: "在制任务", value: "transit" },
          ]
        },

        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'productionQuantity',
          label: "总生产数量",
          type: 'input'
        },
        {
          prop: 'completedQuantity',
          label: "已完成数量",
          type: 'input'
        },
        {
          prop: 'productionLineId',
          label: "产线",
          type: 'select',
          options: [

          ]
        },
        {
          prop: 'routingName',
          label: "工艺路线名称",
          type: 'input'
        },
        {
          prop: 'routingCode',
          label: "工艺路线编码",
          type: 'input'
        },

        {
          prop: 'productionPlanNo',
          label: "生产计划单号",
          type: 'input'
        },
        {
          prop: 'urgentFlag',
          label: "是否紧急",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
      ],

      dataRule: {
        appendQuantity: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["追加数量不能为空", (errMsg, index) => { this.$message.error(`追加数量：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' }
        ],
      },
      workOrderData: [],
      selectWorkOrder: [],
      flowCardCode: '',
      workOrderRule: {
        productionQuantity: [{ required: true, message: '请输入生产数量', trigger: 'blur' }],
        enCode: [{ required: true, message: '请选择打印模版', trigger: 'change' }]
      },
      printQuery: {
        category: 'Productionmanage'
      },
      enCode: '',
      printList: [],
      isProjectSwitch: '',
      isProjectSwitchFlag: false,
      isProductNameSwitch: "",
      // 属性字段  控制属性字段显示隐藏
      standardValueFlag:"",
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag: '',
      colourFlag: '',
      bimProductAttributesList: [],
      prindId2: '',
      formId2: '',
      enCode2: "",
      printVisible2: false,
      printBrowseVisible2: false,
      productionLineList:[],
      dateVisible:false,
      dateForm:{},
      dateRule:{
        planStartDate: [{ required: true, message: '请选择计划开始日期', trigger: 'change' }],
        planEndDate: [{ required: true, message: '请选择计划结束日期', trigger: 'change' }]
      },
    }
  },
  async created() {
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    await this.getProductionLineListFun()
    await this.getProductNameSwitch('product', 'enable_productName')
    this.getProcessList()
    this.advancedQueryFuns()
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(3, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
  },
  methods: {
     //数量验证
    calcValidate() {
      console.log(12332222)
      return (rule, value, callback) => {
        console.log(value, 'p')
        if (!value || value == 0) {
          callback('请输入拆分数量')
        } else {
          let flag = false
          let num_1 = Number(this.splitForm.splitQuantity)
          let num_2 = Number(this.splitForm.canSplitQuantity)

          if (!(num_1 <= num_2)) {
            flag = true
          }
          if (flag) {
            callback(new Error('拆分数量超过可拆分数量'))
          } else {
            callback()
          }
        }
      }
    },
    getProcessList(){
      const obj = {
        pageNum: 1,
        pageSize: -1,
      }
      getProcessList(obj).then(res=>{
        this.routingOptions = res.data.records
      })
    },
    editPlanDate(row){
      detailordershengchan(row.id).then(res=>{
        this.dateVisible=true
        this.dateForm=res.data.prodOrder
      })
    },
    submitEditDateFun(){
      this.$refs['dateForm'].validate((valid) => {
        if (valid) {
          console.log(this.dateForm);
          let endDate = new Date(this.dateForm.planEndDate);
          let startDate = new Date(this.dateForm.planStartDate);

          if (endDate < startDate) {
              this.$message.error("计划开始日期必须在计划结束日期之前")
              return
          }
          this.btnLoading = true
          editProductOrder(this.dateForm).then(res => {
            this.dateVisible = false
            this.btnLoading = false
            this.$message.success("修改计划日期成功")
            this.search('basic')
          }).catch(error => {
            this.btnLoading = false
          })
        }
      })
    },
    // 生成二维码
    generateQRcode(row){
      if (!row.orderNo) {
        return
      }
      this.dialogVisible=true
    this.$nextTick(()=>{
      this.$refs.qrCode.innerHTML = "";
      let qrcode = new QRCode(this.$refs.qrCode, {
        width: 265,
        height: 265, // 高度
        text: row.orderNo, // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
        correctLevel: QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      })
    })
      console.log(this.qrcode);
    },

    // 产线
    getProductionLineListFun() {
      let objs = {
        code: "",
        createByName: "",
        endTime: "",
        name: "",
        orderItems: [
          {
            asc: true,
            column: "",
          },
        ],
        pageNum: 1,
        pageSize: -1,
      };
      // 获取产线
      objs.projectId =this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getProductionLineList(objs).then((res) => {
        console.log("产线", res);
        res.data.records.forEach(item => {
          this.$set(item,'label',item.name)
          this.$set(item,'value',item.id)
        });
        this.searchList[3].options=res.data.records;
        this.productionLineList = res.data.records;
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'productionLineId')
      this.superQueryJson[classIndex].options=this.productionLineList
      });
    },
    printWarehouse2(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId2 = res.data.id
          this.formId2 = this.selectArr.map(item => item.id).join(',')
          this.printBrowseVisible2 = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible2 = false
      });
    },
    closePrint2() {
      console.log(345345345);
      this.printVisible2 = false
    },
    batchPrint() {
      if (!this.selectArr.length) return this.$message.error("请选择你要打印的数据")
      this.enCode2 = 'p020' // 筛选出 businessType 等于 type 的项

      this.fullName2 = "任务排产单" // 筛选出 businessType 等于 type 的项
      this.printVisible2 = true
      this.$nextTick(() => {
        console.log(345345);
        this.$refs.printTemplate2.init(this.enCode2)
      })
    },
    async getOrderFiledMap() {
      await getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
      await getOrderFiledMap('purchase').then((res) => {
        this.standardValueFlag = res.data.standardValue
      })
    },
    async getProductClassFun() {
      // 产品属性
      await getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })

    },
    advancedQueryFuns() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式
      //     specialRequire //特殊要求
      //     material // 保持架材质
      //     colour  //  颜色
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'routingCode')
      if (this.colourFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'colour',
          label: '颜色',
          type: 'select',
          options: this.bimProductAttributesList.pa010.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.materialFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'material',
          label: '保持架材质',
          type: 'select',
          options: this.bimProductAttributesList.pa021.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.specialRequireFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'specialRequire',
          label: '特殊要求',
          type: 'select',
          options: this.bimProductAttributesList.pa016.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.packagingMethodFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.bimProductAttributesList.pa015.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.clearanceFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: this.bimProductAttributesList.pa001.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilQuantityFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: this.bimProductAttributesList.pa003.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: this.bimProductAttributesList.pa002.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.vibrationLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: this.bimProductAttributesList.pa005.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.accuracyLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'select',
          options: this.bimProductAttributesList.pa006.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.sealingCoverTypingFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'select',
          options: this.bimProductAttributesList.pa007.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
    },
    advanceFun() {
      this.superQueryVisible = true
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
    },
    // 改派
    updataDispatch(id) {
      this.BatchDispatchVisible = true
      this.$nextTick(() => {
        this.$refs.BatchDispatchForm.init(id, 'all')
      })
    },
    // 新建返工
    addReworkTaskFun(id, type) {
      this.reworkVisible = true
      this.$nextTick(() => {
        this.$refs.reworkForm.init(id, type)
      })
    },
    // 追加
    addition2() {
      if (!this.selectArr.length) return this.$message.error("请选择您要追加生产的数据!")
      if (this.selectArr.length > 1) return this.$message.error("追加生产只支持单条数据操作")
      if (this.selectArr[0].orderType == 'rework') return this.$message.error("返工任务不可追加生产")
      this.form = this.selectArr[0]
      this.addOrderVisible = true
    },
    addition1(data) {
      this.form = data
      this.addOrderVisible = true
    },
    // 拆分
    splitHander() {
      if(!this.selectArr.length) return this.$message.error("请选择要拆分的数据")
      if(this.selectArr.length.length>1) return this.$message.error("只支持单条数据进行拆分")
      if(this.selectArr[0].orderStatus!=='normal') return this.$message.error("只支持对正常任务进行拆分")
      this.splitTaskFormVisible = true
      this.$nextTick(() => {
        this.$refs.splitTaskForm.init(this.selectArr[0].id)
      })
      // this.splitForm = {...data}
      // this.splitForm.canSplitQuantity = Number(this.splitForm.productionQuantity) - Number(this.splitForm.completedQuantity) - Number(this.splitForm.splitQuantity)
      // this.splitVisible = true
      // this.$nextTick(() => {
      //   this.$refs.splitForm.resetFields();
      // });
    },
     // 改制
     redesignateHander(id) {
      if(!this.selectArr.length) return this.$message.error("请选择要改制的数据")
      if(this.selectArr.length.length>1) return this.$message.error("只支持单条数据进行改制")
      if(this.selectArr[0].orderStatus!=='normal') return this.$message.error("只支持对正常任务进行改制")
      this.redesignateTaskFormVisible = true
      this.$nextTick(() => {
        this.$refs.redesignateTaskForm.init(this.selectArr[0].id)
      })


      // this.redesignateTaskFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs.redesignateTaskForm.init(id)
      // })
      // this.splitForm = {...data}
      // this.splitForm.canSplitQuantity = Number(this.splitForm.productionQuantity) - Number(this.splitForm.completedQuantity) - Number(this.splitForm.splitQuantity)
      // this.splitVisible = true
      // this.$nextTick(() => {
      //   this.$refs.splitForm.resetFields();
      // });
    },
    routingChange(val){
      detailProcess(val).then(res=>{
        for (let index = 0; index < res.data.routingLineList.length; index++) {
          const item = res.data.routingLineList[index];
          if (!item.routingProResList.length) {
            this.$message({
              message: "工艺路线第" + (index + 1) + "行班组、人员、设备需要配置",
              type: "error",
            });
            this.splitForm.routingId = ''
            break;
          }
        }
      })
    },
    // 拆分数量 提交
    splitSubmitFun() {
      this.$refs['splitForm'].validate((valid) => {
        if (valid) {
          console.log(this.splitForm);
          this.btnLoading = true
          splitOrderNum(this.splitForm).then(res => {
            this.splitVisible = false
            this.btnLoading = false
            this.$message.success("拆分成功")
            this.search('basic')
          }).catch(error => {
            this.splitVisible = false
            this.btnLoading = false
          })
        }
      })
    },
    // 新建任务
    addTaskFun() {
      this.addTaskFormVisible = true
      this.$nextTick(() => {
        this.$refs.addTaskForm.init('add')
      })
    },
    reassignmentFun2() {
      console.log(this.selectArr);
      if (!this.selectArr.length) return this.$message.error("请选择您要改派的数据!")
      if (this.selectArr.length > 1) return this.$message.error("改派只支持单条数据操作")
      if (this.selectArr[0].taskMethod != 'appoint') return this.$message.error("改派只支持编排方式为指定加工对象的数据")
      this.BatchDispatchVisible = true
      this.$nextTick(() => {
        this.$refs.BatchDispatchForm.init(this.selectArr[0].id, 'all')
      })
    },
    reassignmentFun1(data) {
      this.BatchDispatchVisible = true
      this.$nextTick(() => {
        this.$refs.BatchDispatchForm.init(id, 'all')
      })
    },
    // 追加生产数量 提交
    submitFun() {
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          console.log(this.form);
          this.btnLoading = true
          addOrderNum(this.form).then(res => {
            this.addOrderVisible = false
            this.btnLoading = false
            this.$message.success("追加生产数量成功")
            this.search('basic')
          }).catch(error => {
            this.btnLoading = false
          })
        }
      })
    },
    // 多选
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //禁用复选框
    checkSelectable(row) {
      if (row.orderStatus !== 'normal' || row.orderStatus == 'suspend' || row.documentStatus == 'draft') {
        return false
      } else {
        return true
      }
    },
    // 关单
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error("请选择您要关单的任务")
      this.$confirm('关闭任务将会把领料单一起关闭，您确认关闭吗？', this.$t('common.tipTitle'), {
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
          this.search('basic')
        }).catch(() => {
        })
      }).catch(() => { })
    },

    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' ||prop=='productionLineNmae'|| prop == 'pairingModeName' || prop == 'productName' || prop == 'projectName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'productDrawingNo' || prop == 'productCode' || prop == 'routingName' || prop == 'routingCode') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.addTaskFormVisible = false
      this.splitTaskFormVisible = false
      this.redesignateTaskFormVisible = false
      this.formVisible = false
      this.reworkVisible = false
      this.BatchDispatchVisible = false
      this.taskFormVisible = false
      this.processOutFormVisible = false
      this.outSouringFormVisible = false
      this.search()
    },
    handleProcessOut(id) {
      // if (!this.selectArr.length) return this.$message.error("请选择您要工序转外协的任务")
      // if (this.selectArr.length !== 1) return this.$message.error("单次只能选择一条任务进行工序转外协！")
      this.processOutFormVisible = true
      this.$nextTick(() => {
        this.$refs.ProcessOutForm.init(id)
      })
    },
    toOutSouringForm() {
      console.log(123)
      this.processOutFormVisible = false
      this.outSouringFormVisible = true
      console.log(this.$refs)
    },
    initData() {
      this.listLoading = true
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      ordershengchanList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productionLineId', fieldValue: '', label: '产线', symbol: 'like', searchType: 4, width: 120,options:this.productionLineList },
      ],
        this.search('basic')
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
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    viewDetailFun(id) {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.taskForm.init(id)
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    closePrint() {
      this.printVisible = false
    },
    // 选择模版弹窗
    printView(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectArr.length > 1) return this.$message.error("打印只支持单条数据操作！")
      this.enCode = enCode
      this.fullName = '装配单'
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(enCode)
      })
    },
    // 打印 装配单
    printOrder(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectArr.length > 1) return this.$message.error("打印只支持单条数据操作！")
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectArr[0].id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    // 打印 流转卡
    printFlowCard(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectArr.length > 1) return this.$message.error("打印只支持单条数据操作！")
      this.workOrderVisible = true
      // this.workOrderForm.enCode = enCode
      this.fullName = '装配流转卡'
      this.workOrderForm.productionQuantity = this.selectArr[0].productionQuantity
      detailordershengchan(this.selectArr[0].id).then(res => {
        res.data.workOrderList.forEach(item => {
          item.selectFlag = false
        })
        this.workOrderData = res.data.workOrderList
      })
      getPrintList(this.printQuery).then(res => {
        if (res.data) {
          if (res.data.hasOwnProperty(enCode)) {
            this.printList = res.data[enCode]
            this.printList && this.printList.forEach(item => {
              if (item.enabledMark) {
                this.workOrderForm.enCode = item.id
              }
            })
          }
        }
      }).catch(() => { })
    },
    handleSelectWork(val) {
      if (val.length) {
        this.workOrderData.forEach(item => {
          if (item.id != val[0].id) {
            item.selectFlag = true
          }
        });
        this.selectWorkOrder = val
      } else {
        this.workOrderData.forEach(item => {
          item.selectFlag = false
        });
      }
    },
    printSubmit() {
      if (!this.selectWorkOrder.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectWorkOrder.length > 1) return this.$message.error("打印只支持单条数据操作！")
      getPrintBusInfo(this.workOrderForm.enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectWorkOrder[0].id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
  margin-bottom: 5px;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}
::v-deep #qrcode img{
  margin: 0 auto;
}
</style>
