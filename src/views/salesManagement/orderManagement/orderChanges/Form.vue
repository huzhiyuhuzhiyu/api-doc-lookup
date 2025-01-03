<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header" v-if="!approvalFlag">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建订单变更' : btnType == 'edit' ? '编辑订单变更' : btnType == 'look' ? '查看订单变更' : ''" />
        <div class="options">
          <el-button v-if="btnType != 'look'" type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button v-if="btnType != 'look'" type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading" ref="mains">

        <el-tabs v-model="activeName" v-if="!approvalFlag" @tab-click="handleClick">
          <el-tab-pane label="订单信息" name="orderInfo" ref="orderInfos">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="销售订单" prop="ordersNo">
                        <el-input readonly placeholder="请选择订单" :disabled="btnType == 'look' ? true : false" v-model="dataForm.ordersNo" @focus="openOrderDia"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="customerContractNoSwitch === '1'">
                      <el-form-item label="客户合同号" prop="contractNo">
                        <el-input placeholder="" disabled v-model="dataForm.contractNo"></el-input>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :sm="6" :xs="24">
                      <el-form-item label="来源单号" prop="sourceOrderNo">
                        <el-input placeholder="请输入来源单号" :disabled="btnType == 'look'" v-model="dataForm.sourceOrderNo"></el-input>
                      </el-form-item>
                    </el-col> -->
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="申请理由" prop="applyReason">
                        <el-input v-model="dataForm.applyReason" placeholder="请输入申请理由" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="24" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" maxlength="200" type="textarea" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="cpInfo">
                <div v-if="btnType !== 'look'&&orderDetailData.length>1">
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-delete" @click="batchDelete()">批量删除</el-button>

                </div>
                <JNPF-col-table :style="{ height: customStyleData + 'px'}" v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems" v-if="orderDetailData.length > 1" :hasC="btnType != 'look'&&orderDetailData.length >1" :openMode="btnType == 'look' ? '只读' : btnType == 'add' ? '新建' : '编辑'" @select="handeleProductInfoData" @deleteth="deleteData" />
                <JNPF-col-table :style="{ height: customStyleData + 'px'}" v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems" :openMode="btnType == 'look' ? '只读' : btnType == 'add' ? '新建' : '编辑'" v-else />
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
            <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
          </el-tab-pane>
          <el-tab-pane v-if="btnType == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
            <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
          </el-tab-pane>
        </el-tabs>
        <el-collapse v-model="activeNames" v-else>
          <el-collapse-item title="基本信息" name="basicInfo">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="销售订单" prop="ordersNo">
                    <el-input readonly placeholder="请选择订单" :disabled="btnType == 'look' ? true : false" v-model="dataForm.ordersNo" @focus="openOrderDia"></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="来源单号" prop="sourceOrderNo">
                    <el-input placeholder="请输入来源单号" :disabled="btnType == 'look'" v-model="dataForm.sourceOrderNo"></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="6" :xs="24">
                  <el-form-item label="申请理由" prop="applyReason">
                    <el-input v-model="dataForm.applyReason" placeholder="请输入申请理由" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                  </el-form-item>
                </el-col>

                <el-col :sm="24" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" maxlength="200" type="textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="产品信息" name="cpInfo">
            <div v-if="btnType !== 'look'&&orderDetailData.length>1">
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-delete" @click="batchDelete()">批量删除</el-button>
            </div>
            <JNPF-col-table :style="{ height: customStyleData + 'px'}" v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems" v-if="orderDetailData.length > 1" :hasC="btnType != 'look'&&orderDetailData.length >1" :openMode="btnType == 'look' ? '只读' : btnType == 'add' ? '新建' : '编辑'" @select="handeleProductInfoData" @deleteth="deleteData" />
            <JNPF-col-table :style="{ height: customStyleData + 'px'}" v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems" :openMode="btnType == 'look' ? '只读' : btnType == 'add' ? '新建' : '编辑'" v-else />
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-dialog title="选择销售订单" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="orderVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="handleClose">

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.orderNo" placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerCode" placeholder="请输入客户编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerName" placeholder="请输入客户名称" clearable />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.workOrderNo" placeholder="请输入工作令号" clearable />
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

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="orderData" :fixedNO="true">
                <el-table-column prop="orderNo" label="订单号" width="180" fixed="left"></el-table-column>

                <el-table-column prop="cooperativePartnerCode" label="客户编码" width="160" />
                <el-table-column prop="cooperativePartnerName" label="客户名称" width="120" />
                <!-- <el-table-column prop="workOrderNo" label="工作令号" width="160"></el-table-column>
                <el-table-column prop="sourceOrderNo" label="来源单号" width="160"></el-table-column> -->
                <el-table-column prop="deliveryDate" label="交货日期" width="180" />
                <el-table-column prop="num" label="数量" width="120" />
                <el-table-column prop="remark" label="订单主表备注" min-width="180" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column prop="documentStatus" fixed="right" label="单据状态" width="120" align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.documentStatus == 'draft'" type="warning">草稿</el-tag>
                    <el-tag v-if="scope.row.documentStatus == 'submit'" type="success">提交</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" fixed="right" label="审批状态" width="120" align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.approvalStatus == 'ing'">审批中</el-tag>
                    <el-tag v-if="scope.row.approvalStatus == 'ok'" type="success">审批通过</el-tag>
                    <el-tag v-if="scope.row.approvalStatus == 'rebut'" type="danger">审批拒绝</el-tag>
                    <el-tag v-if="scope.row.approvalStatus == 'withdrawn'" type="warning">审批撤回</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="90" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" :disabled="selectFlag" @click="selectOrder(scope.row)">
                      选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
            </div>
          </div>
        </div>

      </el-dialog>
    </div>
  </transition>
</template>

<script>
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import flowMixin from '@/mixins/generator/flowMixin'
import { addOrdersChange, editOrdersChange, getOrdersChangeInfo } from '@/api/salesManagement/orderChanges'
import { getOrderDetail, getsaleOrderList, } from '@/api/salesManagement/assemblyOrders'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
import { mapGetters, mapState } from 'vuex'
export default {
  mixins: [busFlow, flowMixin],
  components: { Process, recordList },
  props: {
    customerContractNoSwitch: {}
  },
  data() {
    return {
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      activeNames: ["basicInfo", "cpInfo"],
      selectRows: [],
      selectFlag: false,
      sleeveItems: [
        { prop: "customerProductNo", label: "客户料号", value: "", type: 'view', width: "120", },
        { prop: "contractNo", label: "客户合同号", value: "", type: 'view', width: "120", render: this.customerContractNoSwitch === '0' },
        // { prop: "customerProductDrawingNo", label: `客户规格型号`, value: "", type: 'view', width: "180", },
        { prop: "productCode", label: "产品编码", value: "", type: 'view', width: "140", },
        { prop: "productName", label: "产品名称", value: "", type: 'view', width: "120", },
        { prop: "productDrawingNo", label: "品名规格", value: "", type: 'view', width: "350", },
        { prop: "pairingModeName", label: "配对方式", value: "", type: 'view', width: "120", },
        { prop: "mainUnit", label: "单位", value: "", type: 'view', width: "180", },
        { prop: "num", label: "原数量", value: "", type: 'view', width: "100", },
        // { prop: "assistantNum", label: "原数量(副)", value: "", type: 'view', width: "100", },
        // { prop: "deputyUnit", label: "副单位", value: "", type: 'view', width: "180", },
        { prop: "price", label: "原单价", value: "", type: 'view', width: "120" },
        { prop: "excludingTaxAmount", label: "原金额", value: "", type: 'view', width: "120" },
        { prop: "deliveryDate", label: "原交货日期", value: "", type: 'view', width: "180" },
        // { prop: "ask", label: "要求", value: "", type: 'view', width: "200" },
        { prop: "newNum", label: "新数量", value: "", type: 'input', width: "180", maxlength: 20, itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [10, 4, false, errMsg => { this.$message.error(`新数量(主)：${errMsg}`) }] }), trigger: 'blur' }] },
        // { prop: "newAssistantNum", label: "新数量(副)", value: "", type: 'view', width: "100" },
        { prop: "newPrice", label: "新单价", value: "", width: "180", change: this.changePrice, type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [20, 4, false, errMsg => { this.$message.error(`新单价：${errMsg}`) }] }), trigger: 'blur' }] },
        { prop: "newTotalAmount", label: "新金额", value: "", type: 'view', width: "180" },
        { prop: "newDeliveryDate", label: "新交货日期", value: "", type: 'date', width: "180", itemRules: [{ required: true, trigger: "change" },] },
        // { prop: "newAsk", label: "新要求", value: "", type: 'input', width: "180", },
        { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200, width: "200" },
      ],
      orderVisible: false,
      listLoading: false,
      total: 0,
      orderDetailData: [],
      orderData: [],
      dataForm: {
        orderNo: "",
        applyReason: "",
        remark: "",
        documentStatus: "",
        ordersId: "",
        ordersNo: "",
      },
      orderForm: {
        id: '',
        approvalFlag: false,
        workOrderNo: '',
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        pageNum: 1,
        pageSize: 20,
        ordersNo: "",
        // neOrderState: "finish",
        documentStatus: "submit",
        // changeFlag:true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      btnType: undefined,
      activeName: "orderInfo",
      nodeId: -1,
      btnLoading: false,
      formLoading: false,
      parentId: '',
      dataRule: {
        ordersNo: [
          { required: true, message: '销售订单不能为空', trigger: 'change' }
        ],
        applyReason: [{ required: true, message: "请输入申请理由", trigger: 'blur' }],
      },
      customStyleData: 0,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },
    orderDetailData(val) {
      val.forEach(item => {
        if (this.btnType != 'look') {
          if (item.calculationDirection == "division") {
            if (item.newNum) {
              item.newAssistantNum = this.jnpf.math('divide', [item.newNum, item.ratio], 4)
            }
          } else {
            if (item.newNum) {
              item.newAssistantNum = this.jnpf.math('multiply', [item.newNum, item.ratio], 4)
            } else {
              item.newAssistantNum = ""
            }

          }
          if (item.newNum && item.newPrice) {
            item.newTotalAmount = this.jnpf.math('multiply', [item.newNum, item.newPrice], 2)
          } else {
            item.newTotalAmount = ""
          }
          if (item.newNum && item.newPrice && item.taxRate) {
            item.newExcludingTaxAmount = this.jnpf.math('multiply', [item.newNum, this.jnpf.numberFormat((item.newPrice / (1 + (Number(item.taxRate)) / 100)), 4)], 2)
          } else {
            item.newExcludingTaxAmount = ""
          }
          if (item.newNum && item.newPrice && item.taxRate) {
            item.newTaxAmount = this.jnpf.math('multiply', [this.jnpf.math('multiply', [item.newNum, item.newPrice], 2), (Number(item.taxRate)) / 100], 2)
          } else {
            item.newTaxAmount = ""
          }
          this.$forceUpdate()
        }

      })
    }
  },
  created() {
  },
  computed: {
    ...mapGetters(['userInfo']),
  },

  mounted() {
    this.switchStyleheight()
    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.table) return
      this.$nextTick(() => { this.$refs.table.doLayout() })
    }
    window.addEventListener('resize', this.clientResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.clientResize)
  },
  methods: {
    switchStyleheight() {
      const mainRegion = this.$refs.orderInfos.$parent.$parent.$el // 表单页面区域
      const mainRegion1 = this.$refs.mains // 表单页面区域
      const mainHeight = mainRegion.clientHeight;
      const mainHeight1 = mainRegion1.clientHeight;
      console.log("mainRegion1", mainRegion1);
      console.log("mainHeight1", mainHeight1);
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach(item => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 350
      this.customStyleData = maxHeight
      console.log("customStyleData", this.customStyleData);
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100);
      };
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      console.log("val", val);
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
        return
      }
      if (this.selectRows.length == this.orderDetailData.length) return this.$message.error("请至少保留一条产品数据")
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.orderDetailData.indexOf(row);
        if (index > -1) {
          this.orderDetailData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    deleteData(val) {
      this.orderDetailData.splice(val.$index, 1)
    },
    // 监听价格改变
    changePrice(val, scope) {
      let index = scope.$index;
      if (this.orderDetailData[index].taxRate) {
        this.orderDetailData[index].newExcludingTaxPrice = this.jnpf.numberFormat((this.orderDetailData[index].newPrice / (1 + (Number(this.orderDetailData[index].taxRate)) / 100)), 4)
      } else {
        this.orderDetailData[index].newExcludingTaxPrice = this.orderDetailData[index].newPrice
      }
    },

    handleClick() {

    },
    // 监听新主数量改变
    // changeNewNum(row, index) {
    //   console.log("新主数量", row, index, row.newNum.length - 1);
    //   this.orderDetailData[index].newNum = row.newNum.replace(/[^\d.]/g, '')
    //   if (num.length - 1 != '.') {
    //     if (row.newPrice) {
    //       this.orderDetailData[index].newExcludingTaxAmount = (row.newNum * newPrice).toFixed(2)
    //     }
    //   }
    // },
    // 弹框中选择订单
    selectOrder(row) {
      if (this.dataForm.ordersNo) {
        this.$confirm('此操作将更换产品数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.ordersNo = row.orderNo
          this.dataForm.contractNo = row.contractNo
          this.dataForm.sourceOrderNo = row.sourceOrderNo
          this.dataForm.ordersId = row.id
          this.orderDetailData = []
          getOrderDetail(row.id).then(res => {
            this.selectFlag = true
            this.orderVisible = false
            this.selectFlag = false
            this.distributeStatus = res.data.order.distributeStatus
            let a = res.data.orderLines.filter(res => {
              return true
              // return res.shipmentStatus == 'not_finish'&&(Number(res.outboundQuantity)==0||!res.outboundQuantity)
            })
            a.forEach(item => {
              let obj = {
                pairingModeName: item.pairingModeName ? item.pairingModeName : "",
                contractNo: item.contractNo ? item.contractNo : "",
                productCode: item.productCode ? item.productCode : "",
                productName: item.productName ? item.productName : "",
                drawingNo: item.drawingNo ? item.drawingNo : "",
                productDrawingNo: item.drawingNo ? item.drawingNo : "",
                num: item.num ? item.num : "",
                mainUnit: item.mainUnit ? item.mainUnit : "",
                assistantNum: item.assistantNum ? item.assistantNum : "",
                deputyUnit: item.deputyUnit ? item.deputyUnit : "",
                price: item.price ? item.price : "",
                excludingTaxPrice: item.excludingTaxPrice ? item.excludingTaxPrice : "",
                totalAmount: item.totalAmount ? item.totalAmount : "",
                deliveryDate: item.deliveryDate ? item.deliveryDate : "",
                ask: item.ask ? item.ask : "",
                excludingTaxAmount: item.totalAmount ? item.totalAmount : "",
                // newNum: item.num ? item.num : "",
                // newAssistantNum: item.newAssistantNum ? item.newAssistantNum : "",
                newPrice: item.price ? item.price : "",
                newNum: item.num ? item.num : "",
                newTotalAmount: item.totalAmount ? item.totalAmount : "",
                newDeliveryDate: item.deliveryDate ? item.deliveryDate : "",
                newAsk: item.newAsk ? item.newAsk : "",
                remark: item.remark ? item.remark : "",
                ordersLineId: item.id ? item.id : "",
                productsId: item.productsId ? item.productsId : "",
                orderId: row.id ? row.id : "",
                ratio: item.ratio ? item.ratio : "",
                undeliveredQuantity: item.undeliveredQuantity ? item.undeliveredQuantity : 0,
                outboundQuantity: item.outboundQuantity ? item.outboundQuantity : 0,
                taxRate: item.taxRate,
                calculationDirection: item.calculationDirection,
                customerProductDrawingNo: item.customerProductDrawingNo,
                customerProductNo: item.customerProductNo,
              }
              this.orderDetailData.push(obj)
            })
          })
        })
      } else {
        this.dataForm.ordersNo = row.orderNo
        this.dataForm.contractNo = row.contractNo
        this.dataForm.sourceOrderNo = row.sourceOrderNo
        this.dataForm.ordersId = row.id
        this.orderDetailData = []
        getOrderDetail(row.id).then(res => {
          this.selectFlag = true
          this.orderVisible = false
          this.selectFlag = false
          this.distributeStatus = res.data.order.distributeStatus
          let a = res.data.orderLines.filter(res => {
            return true
            // return res.shipmentStatus == 'not_finish'
          })
          a.forEach(item => {
            let obj = {
              pairingModeName: item.pairingModeName ? item.pairingModeName : "",
              contractNo: item.contractNo ? item.contractNo : "",
              productCode: item.productCode ? item.productCode : "",
              productName: item.productName ? item.productName : "",
              drawingNo: item.drawingNo ? item.drawingNo : "",
              productDrawingNo: item.drawingNo ? item.drawingNo : "",
              num: item.num ? item.num : "",
              mainUnit: item.mainUnit ? item.mainUnit : "",
              assistantNum: item.assistantNum ? item.assistantNum : "",
              deputyUnit: item.deputyUnit ? item.deputyUnit : "",
              price: item.price ? item.price : "",
              excludingTaxPrice: item.excludingTaxPrice ? item.excludingTaxPrice : "",
              totalAmount: item.totalAmount ? item.totalAmount : "",
              deliveryDate: item.deliveryDate ? item.deliveryDate : "",
              ask: item.ask ? item.ask : "",
              excludingTaxAmount: item.totalAmount ? item.totalAmount : "",
              // newNum: item.num ? item.num : "",
              // newAssistantNum: item.newAssistantNum ? item.newAssistantNum : "",
              newPrice: item.price ? item.price : "",
              newNum: item.num ? item.num : "",
              newTotalAmount: item.totalAmount ? item.totalAmount : "",
              newDeliveryDate: item.deliveryDate ? item.deliveryDate : "",
              newAsk: item.newAsk ? item.newAsk : "",
              remark: item.remark ? item.remark : "",
              ordersLineId: item.id ? item.id : "",
              productsId: item.productsId ? item.productsId : "",
              orderId: row.id ? row.id : "",
              ratio: item.ratio ? item.ratio : "",
              undeliveredQuantity: item.undeliveredQuantity ? item.undeliveredQuantity : 0,
              outboundQuantity: item.outboundQuantity ? item.outboundQuantity : 0,
              taxRate: item.taxRate,
              calculationDirection: item.calculationDirection,
              customerProductDrawingNo: item.customerProductDrawingNo,
              customerProductNo: item.customerProductNo,
            }
            this.orderDetailData.push(obj)
          })
        })
      }
    },
    handleClose() {
      this.orderVisible = false
    },
    search() {
      this.orderForm.pageNum = 1
      this.getOrderData()
    },
    reset() {
      this.orderForm = {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        ordersNo: "",
        // neOrderState: "finish",
        documentStatus: "submit",
        // changeFlag:true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },

        this.search()
    },
    openOrderDia() {
      this.orderVisible = true
      // 获取销售订单的数据
      this.getOrderData()
    },
    getOrderData() {
      getsaleOrderList(this.orderForm).then(res => {
        this.orderData = res.data.records
        this.total = res.data.total
      })
    },
    goBack() {
      this.$emit('close')
    },
    initData() {
      this.getOrderData()
    },
    init(id, btnType, approvalFlag) {
      this.approvalFlag = approvalFlag
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType === 'add' || this.btnType === 'edit') {
        this.getBusInfo('b021')
      }
      if (this.dataForm.id && this.btnType != 'add') {
        getOrdersChangeInfo(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            this.dataForm = res.data.change
            this.orderDetailData = res.data.changeLineList
            if (this.btnType === 'look') {
              // 流程信息和流转记录
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
            }
          })
        })
      }
      if (this.dataForm.id && this.btnType === 'add') {
        getOrdersChangeInfo(this.dataForm.id).then(res => {
          this.dataForm = res.data.change
          this.orderDetailData = res.data.changeLineList
          this.orderDetailData.forEach(item => { item.id = '' })
          this.dataForm.approvalStatus = ''
          this.dataForm.submitDate = ''
          this.dataForm.approvalCompletionDate = ''
          this.dataForm.id = ''
          this.dataForm.documentStatus = ''
        })
      }
    },
    goBack() {
      this.$emit('close')
    },
    async handleConfirm(value) {
      this.btnLoading = true
      let focusFlag = true // 自动聚焦是否可用
      // 校验表单
      let form_1 = this.$refs['dataForm']
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && focusFlag) {
        // 校验失败，聚焦第一失败项，继续校验后续项
        if (focusFlag) {
          // 聚焦第一个失败的表单元素
          let formItems = form_1.$children[0].$children
          for (let j = 0; j < formItems.length; j++) {
            let formItem = formItems[j].$children[0]
            if (formItem.validateState === 'error') {
              focusFlag = false
              this.jnpf.focusItem(formItem.$children[1].$el)
              this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
              break
            }
          }
        }
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['sleeveForm'].$children[0]
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && focusFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            focusFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }
      if (focusFlag) {
        this.btnLoading = true
        let formMethod = null;
        if (this.btnType == 'edit') {
          formMethod = editOrdersChange
        } else if (this.btnType == 'add') {
          formMethod = addOrdersChange
        }
        this.dataForm.documentStatus = value
        let obj = {
          changeLineList: this.orderDetailData,
          change: this.dataForm,
          flowData: this.flowData
        }
        let flag = null;
        for (let index = 0; index < this.orderDetailData.length; index++) {
          const item = this.orderDetailData[index];
          if (item.newPrice == 0 || !item.newPrice) {
            this.btnLoading = false
            flag = false
            this.$message({
              message: "第" + (index + 1) + "行产品新单价需要大于0",
              type: "error"
            })
            break
          }
        }


        if (flag === false) return
        formMethod(obj).then(res => {
          let msg = "";
          if (value == 'draft') {
            msg = "保存成功"
          } else {
            msg = "提交成功"

          }

          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}
.required {
  color: red;
  margin-right: 4px;
}
::v-deep .data-form {
  margin-bottom: 18px;
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
.JNPF-preview-main .main {
  padding-top: 0;
}
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>