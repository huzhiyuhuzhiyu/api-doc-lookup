<!-- 成品订单管理 -->
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
     
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.routingCode" placeholder="请输入工艺路线编码" clearable />
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
      <div class="JNPF-common-layout-main JNPF-flex-main ">
        <div class="JNPF-common-head">
          <div>
            <el-button size="mini" @click="batchDispatch" type="primary">批量派工</el-button>
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

        <JNPF-table ref="dataTable"  :cell-style="tableCellStyle"  :select-on-click-row="true" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column
          hasC :fixedNO="true" @select-all="allhandleSelectionChange" @selection-change="handleSelectionChange" :checkSelectable="selectable"   :row-class-name="tableRowClassName" 
  @select="handleSelection" @row-click="clickRow">
          
          <el-table-column prop="orderNo" label="订单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <span
                style="background-color: rgb(255, 102, 0); color: rgb(255, 255, 255); line-height: 16px; height: 16px; font-size: 12px!important; border-radius: 4px; display: inline-block; padding: 0 2px; margin-right: 4px;"
                v-if="scope.row.insertOrderFlag">插</span>
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
        scope.row.orderNo
      }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="订单来源" min-width="100">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="getOrderSourceList(scope.row.id,)">MRP</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="产品编码" width="140"></el-table-column>
          <el-table-column prop="productName" label="产品名称" width="160" sortable="custom"></el-table-column>
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="340" show-overflow-tooltip
            sortable="custom"></el-table-column>



          
          <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom"></el-table-column>

          <el-table-column prop="mainUnit" label="单位" width="60"></el-table-column>
          <el-table-column prop="productionQuantity" label="生产数量" width="100"></el-table-column>


          <el-table-column prop="completedQuantity" label="已完成数量" width="120"></el-table-column>
     
          <el-table-column prop="dispatchStatus" label="派工状态" width="110" fixed="right">

            <template slot-scope="scope">
              <el-tag type="warning" disable-transitions
                v-if="scope.row.dispatchStatus === 'not_finished'">未完成</el-tag>

              <el-tag type="success" disable-transitions v-if="scope.row.dispatchStatus === 'finished'">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productionStatus" label="生产状态" width="110" sortable="custom" fixed="right">
            <template slot-scope="scope">
              <!-- {{ scope.row.productionStatus }} -->
              <el-tag type="warning" disable-transitions
                v-if="scope.row.productionStatus === 'not_started'">未生产</el-tag>
              <el-tag type="primary" disable-transitions
                v-if="scope.row.productionStatus === 'start_production'">生产中</el-tag>
              <el-tag type="success" disable-transitions
                v-if="scope.row.productionStatus === 'production_completed'">生产完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" width="110" sortable="custom" fixed="right">

            <template slot-scope="scope">
              <el-tag type=" primary" disable-transitions v-if="scope.row.orderStatus === 'normal'">正常</el-tag>
              <el-tag type="warning" disable-transitions v-if="scope.row.orderStatus === 'suspend'">暂停</el-tag>
              <el-tag type="danger" disable-transitions v-if="scope.row.orderStatus === 'closed'">关闭</el-tag>

              <el-tag type="success" disable-transitions v-if="scope.row.orderStatus === 'finish'">已完成</el-tag>
            </template>
          </el-table-column> 

       
           
          <el-table-column prop="dispatchedQuantity" label="已派工数量" min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="routingCode" label="工艺路线编码" width="220" sortable="custom"></el-table-column>
          <el-table-column prop="routingName" label="工艺路线名称" width="150"></el-table-column>
          <el-table-column prop="suspendByName" label="暂停人" width="120"></el-table-column>
          <el-table-column prop="suspendDate" label="暂停时间" min-width="200"></el-table-column>
          <!-- <el-table-column prop="closedByName" label="关闭人" width="120"></el-table-column> -->
          <!-- <el-table-column prop="closeDate" label="关闭时间" min-width="200"></el-table-column> -->
          <el-table-column prop="insertOrderFlag" label="是否插单(紧急)" width="160" sortable="custom">
            <template slot-scope="scope">
              <div v-if="!scope.row.insertOrderFlag">否</div>
              <div v-if="scope.row.insertOrderFlag" style="color:#fff">是</div>
            </template>
          </el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>




          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" :loading="scope.row.btnLoading"
                  :disabled="scope.row.receiveStatus == 'received' || scope.row.receiveStatus == 'refused' || scope.row.productionStatus == 'production_completed' || scope.row.orderStatus != 'normal'"
                  @click="updateHandle(scope.row, 'edit')">接收</el-button> -->
              <!-- <el-button size="mini" type="text"
                  :disabled="!(scope.row.orderStatus == 'normal' && scope.row.productionStatus != 'production_completed' && scope.row.productionStatus != 'production_completed')"
                  @click="batchWorker(scope.row.id)">派工</el-button> -->
              <el-button size="mini" type="text"
                @click.native="handleUserRelation(scope.row.id, 'look')">查看详情</el-button>
              <!-- <el-dropdown hide-on-click>
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
                </el-dropdown> -->
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
          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="orderForm.deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺路线编码">
              <el-input v-model="orderForm.routingCode" placeholder="请输入工艺路线编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺路线名称">
              <el-input v-model="orderForm.routingName" placeholder="请输入工艺路线名称" clearable />
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
            <el-form-item label="派工状态">
              <el-select v-model="orderForm.dispatchStatus" placeholder="请选择派工状态" clearable>
                <el-option v-for="(item, index) in dispatchStatusList" :key="index" :label="item.label"
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
    <!-- 订单来源明细 -->
    <el-dialog title="订单来源明细" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="sourceDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20" style="margin :10px 0">
        <el-table ref="workerDialog" v-loading="listLoading" :data="sourceList" border height="400">
          <el-table-column prop="ordersNo" label="销售单号"> </el-table-column>
          <el-table-column prop="planOrderNo" label="计划单号" />
          <el-table-column prop="workOrderNo" label="工作令号" />
          <el-table-column prop="createTime" label="来源时间"></el-table-column>
        </el-table>
      </el-row>
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
//   列表，关闭，接收，拒收，开启，暂停，完成，派工,详情
import { getprodOrderList, prodOrderClose, prodOrderReceive, prodOrderRefuse, prodOrderStart, prodOrderSuspend, prodOrderFinished, prodOrderDispatch, prodOrderInfo, getOrderSourceList } from '@/api/productOrdes/finishedProductOrders'
import Form from './Form'
import Forms from './Forms'
import batchDispatchForm from './batchDispatchForm'
import TableFormProduct from '@/components/no_mount/TableForm-product/index'
import { getGroupList, getEquEquipmentList, getCategoryTrees, getProductionLineList, getProductionLineInfo } from '@/api/basicData/index'
import { number } from 'mathjs'
export default {
  name: 'carrierProfile',
  components: { Form, TableFormProduct, Forms, batchDispatchForm,  },
  data() {
    return {
      hasfixed:true,
      sourceList: [],
      sourceDialog: false,
      dispatchDetailsForm: {

      },
      activeName: "orderWork",
      dateForm: {
        planStartDate: "",
        planEndDate: ""
      },
      selectDateDialog: false,
      lineList: [],
      productionLine: [],
      workstationList: [],
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
      workerList: [],
      workerDialog: false,
      stopFlag: false,
      startFlag: false,
      closeFlag: false,
      finshFlag: false,
      workerFlag: false,
      planStartArr: [],
      planEndArr: [],
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 86400000; // 86400000为一天的毫秒数
        }
      },
      visible: false,
      // 订单状态
      orderStatusList: [
        { label: "正常", value: "normal" },
        { label: "暂停", value: "suspend" },
        { label: "关闭", value: "closed" },
        { label: "已完成", value: "finish" },
      ],
     
      dispatchStatusList: [
        { label: "所有", value: "" },
        { label: "未完成", value: "not_finished" },
        { label: "已完成", value: "finished" },

      ],
      // 生产状态
      productionStatusList: [
        { label: "未生产", value: "not_started" },
        { label: "生产中", value: "start_production" },
        { label: "生产完成", value: "production_completed" },
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
      btnLoading: false,
      selectArr: [],
      total: 0,
      formVisible: false,
      orderForm: {
        deliverySd: "",
        deliveryEd: "",
        dispatchStatus: "",
        blankStatus: "",
        pageNum: 1,
        pageSize: 100,
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
        // planSsd: "",
        // planSed: "",
        // planEsd: "",
        // planEed: "",
        // receiveStatus: "",
        productionStatus: "",
        orderStatus: "",
        insertOrderFlag: "",
        demandType: "",
        documentStatus: "submit",
        deliveryDateArr: [],
        businessCode:"assemble",
      },
      dateRules: {
        planStartDate: [{ required: true, message: '计划开始日期不能为空', trigger: 'change' }],
        planEndDate: [{ required: true, message: '计划结束日期不能为空', trigger: 'change' }],
      },
      filterText: '',
      prodOrderForm: {},
      idsArr: [],
      planStartDate: "",
      planEndDate: "",
      stDate: "",
      etDate: "",
      formVisibles: false,
      batchDispatchFormVisibles: false,
      blankingFormVisibles: false,
      numbers:[],
    }
  },

  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },
    selectArr(val){
      console.log(111,val);
      if(!val.length) return this.numbers=[]
    }
  },
  created() {
    this.initData()
    this.selectArr = []
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
     // 背景颜色处理
     tableCellStyle({row, column, rowIndex, columnIndex}) {
       
       
       if(columnIndex === 16) {  
         if(row.insertOrderFlag){
           return 'background:red!important'
         }else{
           return 

         }
          
       } 
             
     }, 
    clickRow(row, event, column) {
          console.log("this.$refs['dataTable'].$refs", this.$refs['dataTable']);
          console.log(this.selectable(row));
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
    handleSelectionChange(row) {
      console.log("选中的数据", row);
    
      
   
      this.selectArr = row
    },

 
    getOrderSourceList(id) {
      let obj = {
        "createByName": "",
        "endTime": "",
        "endUpdateTime": "",
        "keyword": "",
        "orderItems": [
          {
            "asc": true,
            "column": ""
          }
        ],
        "productionOrderId": id,
        "startTime": "",
        "startUpdateTime": ""
      }
      getOrderSourceList(obj).then(res => {
        console.log("订单来源明细", res);
        if (res.data.records.length) {
          this.sourceList = res.data.records
          this.sourceDialog = true
        } else {
          this.$message.error("暂无来源明细")
        }
      })
    },
    changeStartData(e) {
      console.log(e);

      if (this.dispatchDetailsForm.planEndDate) {
        const date1 = new Date(this.dispatchDetailsForm.planStartDate);
        const date2 = new Date(this.dispatchDetailsForm.planEndDate);
        let flag = null;
        if (date1.getTime() > date2.getTime()) {
          flag = false
          this.$message({
            message: "结束日期不能在开始日期之前",
            type: "error"
          })
          this.dispatchDetailsForm.planStartDate = this.stDate
          this.dispatchDetailsForm.planEndDate = this.etDate
          console.log("stDate", this.stDate); tiuuityuitui
          console.log("etDate", this.etDate);
        } else {
          this.dispatchDetailsForm.planStartDate = e
          if (this.workerList.length) {
            this.workerList.forEach(item => {
              item.planStartDate = e
            });
          }
        }
      }
    },
    changeEndData(e) {
      if (this.dispatchDetailsForm.planStartDate) {
        const date1 = new Date(this.dispatchDetailsForm.planStartDate);
        const date2 = new Date(this.dispatchDetailsForm.planEndDate);
        let flag = null;
        if (date1.getTime() > date2.getTime()) {
          flag = false
          this.$message({
            message: "结束日期不能在开始日期之前",
            type: "error"
          })
          this.dispatchDetailsForm.planStartDate = this.stDate
          this.dispatchDetailsForm.planEndDate = this.etDate
        } else {
          this.dispatchDetailsForm.planStartDate = e
          if (this.workerList.length) {
            this.workerList.forEach(item => {
              item.planEndDate = e
            });
          }
        }
      }

    },
    dispatchQuantityFun() {
      console.log("this.dispatchDetailsForm.dispatchQuantity", this.dispatchDetailsForm.dispatchQuantity);

      if ((Number(this.dispatchDetailsForm.productionQuantity) - Number(this.dispatchDetailsForm.completedQuantity)) < this.dispatchDetailsForm.dispatchQuantity) {
        this.$message.error("派工数量不得超过未派工数量")
      } else {
        if (this.workerList.length > 0) {
          this.workerList.forEach(item => {
            item.dispatchQuantity = this.dispatchDetailsForm.dispatchQuantity
          });
        }
      }
    },
    handleClick() {

    },
    selectable(row, index) {
      let flag = null;
      if (row.receiveStatus == "received") {
        flag = true;
        if (row.orderStatus == "normal" || row.orderStatus == "suspend" || row.productionStatus == "not_started" || row.productionStatus == "start_production") {
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
    // 删除数据
    handleDel(row) {
      console.log(row);
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

    // 派工
    batchWorker(id) {
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
          this.$message({ message: "暂无可派工的数据", type: "error" })

        }

      })
    },
  
    checkProductIds(arr) {
      const firstProductId = arr[0].blankingProductsId;
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].blankingProductsId !== firstProductId) {
          return false;
        }
      }
      return true;
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
            // if (Number(item.dispatchedQuantity) >= Number(item.productionQuantity)) {

            //   submitFlag = false 
            //   return  this.$message({
            //     message: "订单" + item.orderNo + "派工数量等于生产数量，无法进行派工",
            //     type: "error"
            //   })
            // }
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

    // 批量暂停1
    batchStop() {
      if (this.selectArr.length) {
        let arr = this.selectArr.filter(item => item.orderStatus == 'normal' && item.productionStatus != 'production_completed')
        if (arr.length < 1) {
          return this.$message({
            message: "您所选的数据没有可暂停的",
            type: "error"
          })
        }
        let idArr = arr.map(obj => obj.id);

        prodOrderSuspend(idArr).then(res => {
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
    // 批量开启
    batchStart() {
      if (this.selectArr.length) {
        let arr = this.selectArr.filter(item => item.orderStatus == 'suspend' && item.productionStatus != 'production_completed')
        console.log("开启的数据", arr);
        if (arr.length < 1) {
          return this.$message({
            message: "您所选的数据没有可开启的",
            type: "error"
          })
        }
        this.idsArr = arr.map(obj => obj.id);
        this.dateForm.planStartDate = ""
        this.dateForm.planStartDate = ""
        this.selectDateDialog = true

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
          let arr = this.selectArr.filter(item => item.productionStatus !== 'suspend' && item.productionStatus != 'production_completed')
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
              message: "关闭成功",
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
          let arr = this.selectArr.filter(item => item.productionStatus !== 'production_completed')
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
      let newProp;
      if (prop === 'productDrawingNo' || prop == "productName" || prop == "routingCode" || prop == 'workOrderNo'||prop=="blankProductsDrawingNo") { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
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
      // if (this.planStartArr && this.planStartArr.length > 0) {
      //   this.orderForm.planSsd = this.planStartArr[0]
      //   this.orderForm.planSed = this.planStartArr[1]
      // } else {
      //   this.orderForm.planSsd = ""
      //   this.orderForm.planSed = ""
      // }

      // if (this.planEndArr && this.planEndArr.length > 0) {
      //   this.orderForm.planEsd = this.planEndArr[0]
      //   this.orderForm.planEed = this.planEndArr[1]
      // } else {
      //   this.orderForm.planEsd = ""
      //   this.orderForm.planEed = ""
      // }
      this.initData()

    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.formVisibles = false
      this.batchDispatchFormVisibles = false
      this.blankingFormVisibles = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      if (this.orderForm.deliveryDateArr && this.orderForm.deliveryDateArr.length > 0) {
        this.orderForm.deliverySd = this.orderForm.deliveryDateArr[0]
        this.orderForm.deliveryEd = this.orderForm.deliveryDateArr[1]
      } else {
        this.orderForm.deliverySd = ''
        this.orderForm.deliveryEd = ''
      }
      getprodOrderList(this.orderForm).then(res => {
        let list = JSON.parse(JSON.stringify(res.data.records))
        console.log("list===>", list);
        list.forEach((item,index) => {
          item.workGroupId = ""
          item.equipmentId = ""
          item.personId = ""
          item.remark = ""
          item.btnLoading = false
          item.className = "normal";
          item.index=index
        });
        this.tableData = list
        console.log("this.tableData", this.tableData);
        this.total = res.data.total
        this.listLoading = false
        this.visible = false

      }).catch(() => {
        this.listLoading = false
      })

    },
    reset() {
      console.log("this.$refs['dataTable'].$refs", this.$refs['dataTable']);
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.planEndArr = []
      this.planStartArr = []
      this.orderForm = {
        pageNum: 1,
        pageSize: 100,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        dispatchStatus: "",
        blankStatus: "",
        orderNo: "",
        workOrderNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        orderType: "normal",
        // planSsd: "",
        // planSed: "",
        // planEsd: "",
        // planEed: "",
        productionStatus: "",
        orderStatus: "",
        insertOrderFlag: "",
        demandType: "",
        documentStatus: "submit",
        businessCode:"assemble",

      },

        this.dataFormSubmit()
    },

    addSupplier(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    updateHandle(row) {
      row.btnLoading = true
      prodOrderReceive(row.id).then(res => {
        this.initData()
        this.$message({
          message: "接收成功",
          type: "success"
        })
        row.btnLoading = false
      }).catch(error => {
        row.btnLoading = false
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
<style scoped lang="scss">
  
.tableContainer {
  height: calc(100% - 95px);
}

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


::v-deep.el-tabs__header {
  padding-left: 0;
}

.JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body {
  margin-top: 0;
}
::v-deep .selected-row{
  background-color: red;
}
::v-deep .table-SelectedRow-bgcolor {
      td{
        background-color: #fa645f !important;
      }
      
    }
  ::v-deep  .tableSelectedRowBgColor td {
  background-color: #fedcbd !important;
}
</style>
