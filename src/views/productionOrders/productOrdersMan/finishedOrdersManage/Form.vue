<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          :content="btnType == 'add' ? '新建订单' : btnType == 'edit' ? '编辑订单' : btnType == 'look' ? '查看订单' : ''" />
        <!-- <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div> -->
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="orderInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基础信息</h5>
            </div>
            <el-form ref="dataForms" :model="reworkForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="生产订单" prop="orderNo">
                    <el-input readonly placeholder="请选择生产订单" disabled v-model="reworkForm.orderNo"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="计划单号" prop="planOrderNo">
                    <el-input placeholder="请输入计划单号" disabled v-model="reworkForm.planOrderNo"></el-input>
                  </el-form-item>
                </el-col>

                <!-- <el-col :sm="8" :xs="24">
                  <el-form-item label="需求类型" prop="demandType">
                    <el-select v-model="reworkForm.demandType" placeholder="请选择需求类型" disabled style="width: 100%;">
                      <el-option v-for="(item, index) in demandTypeList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品编码" prop="productCode">
                    <el-input placeholder="请输入产品编码" disabled v-model="reworkForm.productCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品名称" prop="productName">
                    <el-input placeholder="请输入产品名称" disabled v-model="reworkForm.productName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品图号" prop="productDrawingNo">
                    <el-input placeholder="请输入产品图号" disabled v-model="reworkForm.productDrawingNo"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="规格型号" prop="productCode">
                    <el-input placeholder="请输入规格型号" disabled v-model="reworkForm.productCode"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="生产数量" prop="productionQuantity">
                    <el-input placeholder="请输入生产数量" disabled v-model="reworkForm.productionQuantity"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="单位" prop="mainUnit">
                    <el-input placeholder="请输入单位" disabled v-model="reworkForm.mainUnit"></el-input>
                  </el-form-item>
                </el-col>
        
                <!-- <el-col :sm="8" :xs="24">
                  <el-form-item label="接收状态" prop="receiveStatus">
                    <el-select v-model="reworkForm.receiveStatus" placeholder="请选择接收状态" disabled style="width: 100%;">
                      <el-option v-for="(item, index) in receiveStatusList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="接收人" prop="recipientName">
                    <el-input placeholder="请输入接收人" disabled v-model="reworkForm.recipientName"></el-input>

                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="接收时间" prop="receptionDate">
                    <el-input placeholder="请选择接收时间" disabled v-model="reworkForm.receptionDate"></el-input>

                  </el-form-item>
                </el-col> -->
                <el-col :sm="8" :xs="24">
                  <el-form-item label="已完成数量" prop="completedQuantity">
                    <el-input placeholder="请输入已完成数量" disabled v-model="reworkForm.completedQuantity"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="生产状态" prop="productionStatus">
                    <el-select v-model="reworkForm.productionStatus" placeholder="请选择生产状态" clearable disabled
                      style="width: 100%;">
                      <el-option v-for="(item, index) in productionStatusList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="订单状态" prop="orderStatus">
                    <el-select v-model="reworkForm.orderStatus" placeholder="请选择订单状态" clearable disabled
                      style="width: 100%;">
                      <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="暂停人" prop="suspendByName">
                    <el-input placeholder="请输入暂停人" disabled v-model="reworkForm.suspendByName"></el-input>

                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="暂停时间" prop="suspendDate">
                    <el-input placeholder="请选择暂停时间" disabled v-model="reworkForm.suspendDate"></el-input>

                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="是否插单">
                    <el-select v-model="reworkForm.insertOrderFlag" placeholder="请选择是否插单" clearable style="width: 100%;"
                      disabled>
                      <el-option v-for="(item, index) in insertOrderFlagList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="插单顺序" prop="insertOrderSort">
                    <el-input v-model="reworkForm.insertOrderSort" placeholder="请输入插单顺序" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="工艺路线名称" prop="routingName">
                    <el-input v-model="reworkForm.routingName" placeholder="请输入工艺路线名称" disabled />
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="创建人" prop="createByName">
                    <el-input v-model="reworkForm.createByName" placeholder="请输入创建人" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="创建时间" prop="createTime">
                    <el-input v-model="reworkForm.createTime" placeholder="请输入创建时间" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="reworkForm.remark" placeholder="请输入备注" disabled />
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>工单信息</h5>
            </div>
            <JNPF-table ref="product" :data="workOrderData" :fixedNO="false" height="100%" style="width:100%">




              <el-table-column prop="orderNo" label="工单号" min-width="200"></el-table-column>
              <el-table-column prop="workOrderQuantity" label="任务生产数量" min-width="130" />
              <el-table-column prop="dispatchedQuantity" label="已派工数量" min-width="130" />
              <el-table-column prop="completedQuantity" label="完工数量" min-width="130" />
              <!-- <el-table-column prop="actualStartDate" label="实际开始日期" min-width="130" /> -->
              <!-- <el-table-column prop="actualEndDate" label="实际结束日期" min-width="130" /> -->
              <el-table-column prop="processCode" label="工序编码" min-width="130"></el-table-column>
              <el-table-column prop="processName" label="工序名称" min-width="130" />
              <el-table-column prop="processingType" label="加工类型" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.processingType == 'self_produced'">自制</div>
                  <div v-if="scope.row.processingType == 'external_production'">外协</div>
                </template>
              </el-table-column>
              <el-table-column prop="firstFlag" label="是否首道工序" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.firstFlag">是</div>
                  <div v-if="!scope.row.firstFlag">否</div>
                </template>
              </el-table-column>
              <el-table-column prop="pickingFlag" label="是否领料" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.pickingFlag">是</div>
                  <div v-if="!scope.row.pickingFlag">否</div>
                </template>
              </el-table-column>
              <el-table-column prop="firstInspection" label="是否首检" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.firstInspection">是</div>
                  <div v-if="!scope.row.firstInspection">否</div>
                </template>
              </el-table-column>
              <el-table-column prop="reportFlag" label="是否报工" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.reportFlag">是</div>
                  <div v-if="!scope.row.reportFlag">否</div>
                </template>
              </el-table-column>
              <el-table-column prop="stockFlag" label="是否入库" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.stockFlag">是</div>
                  <div v-if="!scope.row.stockFlag">否</div>
                </template>
              </el-table-column>


              <el-table-column prop="lastFlag" label="是否末道工序" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.lastFlag">是</div>
                  <div v-if="!scope.row.lastFlag">否</div>
                </template>
              </el-table-column>
              <el-table-column prop="firstInspectionStatus" label="首检是否通过" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.firstInspectionStatus">是</div>
                  <div v-if="!scope.row.firstInspectionStatus">否</div>
                </template>
              </el-table-column>





              <!-- <el-table-column prop="chargeableReworkFlag" label="是否计费返工" min-width="130">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.chargeableReworkFlag" disabled></el-checkbox>
                </template>
              </el-table-column>
             
        
            
              
              
              <el-table-column prop="checkFlag" label="是否检验工序" min-width="130">
                <template slot-scope="scope">
                  <div v-if="scope.row.checkFlag">是</div>
                  <div v-if="!scope.row.checkFlag">否</div>
                </template>
              </el-table-column> -->


              <el-table-column prop="firstInspectionDate" label="首检日期" min-width="130"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="200"></el-table-column>
              <el-table-column prop="createByName" label="创建人" min-width="130"></el-table-column>
              <!-- <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope" v-if="btnType != 'look'">
                  <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                </template>
              </el-table-column> -->
            </JNPF-table>

          </el-tab-pane>
          <el-tab-pane label="用料清单" name="annex">
            <JNPF-table ref="dataTable" v-loading="listLoading" :data="materialList" border>
              <el-table-column prop="productCode" label="产品编码"></el-table-column>
              <el-table-column prop="productName" label="产品名称"></el-table-column>
              <el-table-column prop="productDrawingNo" label="产品图号"></el-table-column>
              <el-table-column prop="qty" label="基本数量"></el-table-column>
              <el-table-column prop="materialsUsedQuantity" label="用料数量"></el-table-column>
              <!-- <el-table-column prop="materialProcessName" label="用料工序名称"></el-table-column> -->

              <!-- <el-table-column prop="receivedQuantity" label="实际领料数量"></el-table-column> -->
              <el-table-column prop="mainUnit" label="单位"></el-table-column>
              <!-- <el-table-column prop="remark" label="备注"></el-table-column> -->
              <!-- <el-table-column prop="createByName" label="创建人"></el-table-column> -->
              <!-- <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column> -->
            </JNPF-table>
          </el-tab-pane>
          <el-tab-pane label="流程卡" name="approval">
            <el-form ref="dataForm" :model="flowCard" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品编码" prop="productCode">
                    <el-input placeholder="请输入产品编码" disabled v-model="flowCard.productCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品名称" prop="productName">
                    <el-input placeholder="请输入产品名称" disabled v-model="flowCard.productName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="产品图号" prop="productDrawingNo">
                    <el-input placeholder="请输入产品图号" disabled v-model="flowCard.productDrawingNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="软管净长" prop="hoseLength">
                    <el-input placeholder="请输入软管净长" disabled v-model="flowCard.hoseLength"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="左芯子（图号）" prop="leftCore">
                    <el-input placeholder="请输入左芯子（图号）" disabled v-model="flowCard.leftCore"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="左芯子长" prop="leftCoreLength">
                    <el-input placeholder="请输入左芯子长" disabled v-model="flowCard.leftCoreLength"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="右芯子（图号）" prop="rightCore">
                    <el-input placeholder="请输入左芯子（图号）" disabled v-model="flowCard.rightCore"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="右芯子长" prop="rightCoreLength">
                    <el-input placeholder="请输入右芯子长" disabled v-model="flowCard.rightCoreLength"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="套筒（图号）" prop="sleeveModel">
                    <el-input placeholder="请输入套筒（图号）" disabled v-model="flowCard.sleeveModel"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="护套（图号）" prop="sheathModel">
                    <el-input placeholder="请输入护套（图号）" disabled v-model="flowCard.sheathModel"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="剥内胶长" prop="innerRubberLength">
                    <el-input placeholder="请输入剥内胶长" disabled v-model="flowCard.innerRubberLength"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="剥外胶长" prop="externalAdhesive">
                    <el-input placeholder="请输入剥外胶长" disabled v-model="flowCard.externalAdhesive"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="扣压伸长量" prop="compressionElongation">
                    <el-input placeholder="请输入扣压伸长量" disabled v-model="flowCard.compressionElongation"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="扣压量" prop="withhold">
                    <el-input placeholder="请输入扣压量" disabled v-model="flowCard.withhold"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="扣压时间" prop="withholdingTime">
                    <el-input placeholder="请输入扣压时间" disabled v-model="flowCard.withholdingTime"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="芯孔变型量" prop="coreHoleDeformation">
                    <el-input placeholder="请输入芯孔变型量" disabled v-model="flowCard.coreHoleDeformation"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="创建时间" prop="createTime">
                    <el-input placeholder="请输入创建时间" disabled v-model="flowCard.createTime"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="创建人" prop="createByName">
                    <el-input placeholder="请输入创建人" disabled v-model="flowCard.createByName"></el-input>
                  </el-form-item>
                </el-col>


              </el-row>
            </el-form>
          </el-tab-pane>
       
        </el-tabs>
      </div>
      <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />

    </div>

  </transition>
</template>

<script>

import { getprodOrderList, prodOrderInfo, addProdOrder, updateprodOrderFinished, getProgressList } from '@/api/productOrdes/finishedProductOrders'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'

export default {
  components: { ExportForm },
  data() {
    return {
      progressForm: {
        "orderItems": [
          {
            "asc": true,
            "column": ""
          }
        ],
        "pageNum": 1,
        "pageSize": 20,
        "processCode": "",
        "processName": "",
        "workNo": "",
        productionOrderId: "",
      },
      insertOrderFlagList: [
        { label: "否", value: false },
        { label: "是", value: true },
      ],
      orderQuantity: "",//原订单生产数量
      demandTypeList: [
        { label: "生产成品需求", value: 'finish_product' },
        { label: "生产半成品需求", value: 'semi_finished' },
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
      // 接收状态
      receiveStatusList: [
        { label: "未接收", value: "not_received" },
        { label: "已接收", value: "received" },
        { label: "已拒绝", value: "refused" },
      ],
      workOrderData: [],
      reworkForm: {
        orderNo: "",
        productionOrderId: "",
        workOrderNo: "",
        productsId: "",
        productName: "",
        routingName: "",
        routingId: "",
        planStartDate: "",
        planEndDate: "",
        productionQuantity: "",
        remark: "",
        demandType: "",
        orderStatus: "normal",
        orderType: "rework",
        deputyUnit: "",
        insertOrderFlag: false,
        productionStatus: "not_started",
        receiveStatus: "received",
        documentStatus: "",

      },

      orderVisible: false,
      listLoading: false,
      total: 0,
      orderDetailData: [],
      orderData: [],
      btnType: undefined,
      activeName: "orderInfo",
      nodeId: -1,
      btnLoading: false,
      formLoading: false,
      parentId: '',
      dataRule: {
        orderNo: [
          { required: true, message: '生产订单不能为空', trigger: 'change' }
        ],
        planEndDate: [{ required: true, message: "请选择计划结束日期", trigger: 'change' }],
        planStartDate: [{ required: true, message: "请选择计划结束日期", trigger: 'change' }],
        productionQuantity: [{ required: true, message: "请输入返工生产数量", trigger: 'blur' }, { validator: this.formValidate('positiveNumber', '请输入大于0的正整数',), trigger: 'blur' }],
      },
      id: "",
      collectionForm: {},
      flowCard: {
        productCode: "",
        productName: "",
        productDrawingNo: "",
        hoseLength: "",
        leftCore: "",
        leftCoreLength: "",
        rightCore: "",
        rightCoreLength: "",
        sleeveModel: "",
        sheathModel: "",
        innerRubberLength: "",
        externalAdhesive: "",
        compressionElongation: "",
        withhold: "",
        withholdingTime: "",
        coreHoleDeformation: "",
        createTime: "",
        createByName: "",

      },
      materialList: [],
      selectArr: [],
      exportFormVisible: false,
      progressList: [],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    getProgressFun() {
      getProgressList(this.progressForm).then(res => {
        console.log("订单进度", res);
        this.progressList = res.data.records
        this.total = res.data.total
      })
    },
    reset() {
      this.progressForm = {
        "orderItems": [
          {
            "asc": true,
            "column": ""
          }
        ],
        "pageNum": 1,
        "pageSize": 20,
        "processCode": "",
        "processName": "",
        "workNo": "",
        productionOrderId: this.id
      },
        this.getProgressFun()
    },
    exportForm(exportTableRef) {

        console.log("exportTableRef", this.$refs);
        this.exportFormVisible = true
        let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
        columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.progressForm
      let _data = {
        ...targetListQuery,
        exportType: "1103",
        exportName: "生产订单",
        includeFieldMap,
        pageSize: targetListQuery.pageSize
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    handleClick(e) {
      console.log(e);
      if (e.name == "progress") {
        this.getProgressFun()
      }
    },





    goBack() {
      this.$emit('close')
    },
    init(id, btnType) {
      this.id = id || ''
      this.btnType = btnType
      console.log("00000", id, btnType, this.id);
      if (this.id) {
        this.progressForm.productionOrderId = id
        let obj = {
          id: id,
          dispatch: "0"
        }
        prodOrderInfo(obj).then(res => {
          console.log("订单详情", res);
          this.$nextTick(() => {
            let collectionForm = res.data
            this.workOrderData = res.data.workOrderList
            this.materialList = res.data.materialList
            this.flowCard = res.data.flowCard ? collectionForm.flowCard : this.flowCard
            this.reworkForm = res.data.prodOrder

            // this.dataForm = res.data.stop
            // res.data.lines.forEach(item => {
            //   item.drawingNo = item.productDrawingNo
            // })
            // this.orderDetailData = res.data.lines
            // 根据生产订单号查找原订单生产数量
            let obj = {
              pageNum: 1,
              pageSize: -1,
              orderItems: [{
                asc: false,
                column: ""
              }, {
                asc: false,
                column: "create_time"
              }],
              orderNo: this.reworkForm.orderNo,
              workOrderNo: "",
              productCode: "",
              productName: "",
              productDrawingNo: "",
              orderType: "",
              planSsd: "",
              planSed: "",
              planEsd: "",
              planEed: "",
              receiveStatus: "",
              productionStatus: "",
              orderStatus: "",
              insertOrderFlag: "",
              demandType: ""
            };
            getprodOrderList(obj).then(res => {
              console.log("++++++++", res);
              this.orderQuantity = res.data.records[0].productionQuantity
            })

          })

        })

      }
    },
    goBack() {
      this.$emit('close')
    },
    // handleConfirm(value) {

    //   this.$refs['dataForms'].validate((valid) => {
    //     if (valid) {
    //       this.btnLoading = true
    //       let submitFlag = null;
    //       this.reworkForm.documentStatus = value
    //       let obj = {
    //         flowCard: this.flowCard,
    //         materialList: this.materialList,
    //         prodOrder: this.reworkForm,
    //         workOrderList: this.selectArr,
    //       }
    //       console.log(this.selectArr);
    //       if (this.selectArr.length<1) {
    //         submitFlag = false
    //         this.btnLoading = false
    //         this.$message({
    //           message: "请选择你要返工的工单",
    //           type: 'error',
    //           duration: 1500,
    //         })
    //         return
    //       }
    //       if (Number(this.reworkForm.productionQuantity) > Number(this.orderQuantity)) {
    //         submitFlag = false
    //         this.btnLoading = false
    //             this.$message({
    //           message: "返工数量不得超过原订单生产数量",
    //           type: 'error',
    //           duration: 1500,
    //         })
    //         return
    //       }

    //       if (submitFlag === false) return
    //       let methods=null
    //       let msg=""
    //       if(this.btnType=='add'){
    //         methods=addProdOrder
    //       }else if(this.btnType=='edit'){
    //         methods=updateprodOrderFinished
    //       }
    //       if (value == "draft") {
    //           msg = "保存成功"
    //         } else {
    //           msg = "提交成功"
    //         }
    //       methods(obj).then(res => {

    //         this.$message({
    //           message: msg,
    //           type: 'success',
    //           duration: 1500,
    //           onClose: () => {
    //             this.visible = false
    //             this.btnLoading = false
    //             this.$emit('close', true)
    //           }
    //         })
    //       }).catch(() => {
    //         this.btnLoading = false
    //       })

    //     }
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

.el-button--small {
  // padding: 1;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;

}

::v-deep .el-table__body-wrapper {
  height: auto !important;
}
</style>