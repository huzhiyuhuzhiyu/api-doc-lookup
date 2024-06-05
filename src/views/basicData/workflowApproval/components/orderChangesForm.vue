<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" content="审批" />
        <div class="options" v-if="isShow != 'disabled'">
          <el-button type="success" :loading="btnLoading" @click="confirmOk('审批同意', 'ok', row)">
            审批同意</el-button>
          <el-button type="danger" :loading="btnLoading" @click="confirmOk('审批拒绝', 'rebut', row)">
            审批拒绝</el-button>
          <el-button type="primary" :loading="btnLoading" @click="confirmTrans('转审', 'transferred', row)">
            转审</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单信息" name="orderInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="销售订单" prop="ordersNo">
                    <el-input readonly placeholder="请选择订单" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.ordersNo" @focus="openOrderDia"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="申请理由" prop="applyReason">
                    <el-input v-model="dataForm.applyReason" placeholder="请输入申请理由"
                      :disabled="btnType == 'look' ? true : false" maxlength="200" />
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false"
                      maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>
            <JNPF-col-table v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems"
              v-if="orderDetailData.length > 1" :openMode="btnType == 'look' ? '只读' : btnType == 'add' ? '新建' : '编辑'"
              @deleteth="deleteData" />
            <JNPF-col-table v-model="orderDetailData" ref="sleeveForm" :tableItems="sleeveItems"
              :openMode="btnType == 'look' ? '只读' : btnType == 'add' ? '新建' : '编辑'" v-else />
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="approvalFlow">
            <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="btnType" :nodeConfig.sync="busNodeConfig"
              ref="workflowRef" />
            <div class="noDataTip" v-if="!workVisible">
              <span class="el-table__empty-text">
                <div data-v-4d190d64="" class="el-empty">
                  <div class="el-empty__image" style="width: 120px;"><svg viewBox="0 0 79 86" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <defs>
                        <linearGradient id="linearGradient-1-48" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%">
                          <stop stop-color="#FCFCFD" offset="0%"></stop>
                          <stop stop-color="#EEEFF3" offset="100%"></stop>
                        </linearGradient>
                        <linearGradient id="linearGradient-2-48" x1="0%" y1="9.5%" x2="100%" y2="90.5%">
                          <stop stop-color="#FCFCFD" offset="0%"></stop>
                          <stop stop-color="#E9EBEF" offset="100%"></stop>
                        </linearGradient>
                        <rect id="path-3-48" x="0" y="0" width="17" height="36"></rect>
                      </defs>
                      <g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="B-type" transform="translate(-1268.000000, -535.000000)">
                          <g id="Group-2" transform="translate(1268.000000, 535.000000)">
                            <path id="Oval-Copy-2"
                              d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z"
                              fill="#F7F8FC"></path>
                            <polygon id="Rectangle-Copy-14" fill="#E5E7E9"
                              transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) "
                              points="13 58 53 58 42 45 2 45"></polygon>
                            <g id="Group-Copy"
                              transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)">
                              <polygon id="Rectangle-Copy-10" fill="#E5E7E9"
                                transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) "
                                points="2.84078316e-14 3 18 3 23 7 5 7"></polygon>
                              <polygon id="Rectangle-Copy-11" fill="#EDEEF2"
                                points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon>
                              <rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-48)"
                                transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) "
                                x="38" y="7" width="17" height="36"></rect>
                              <polygon id="Rectangle-Copy-13" fill="#F8F9FB"
                                transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) "
                                points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon>
                            </g>
                            <rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-48)" x="13" y="45" width="40"
                              height="36"></rect>
                            <g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)">
                              <mask id="mask-4-48" fill="white">
                                <use xlink:href="#path-3-48"></use>
                              </mask>
                              <use id="Mask" fill="#E0E3E9"
                                transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) "
                                xlink:href="#path-3-48"></use>
                              <polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-48)"
                                transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) "
                                points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon>
                            </g>
                            <polygon id="Rectangle-Copy-18" fill="#F8F9FB"
                              transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) "
                              points="62 45 79 45 70 58 53 58"></polygon>
                          </g>
                        </g>
                      </g>
                    </svg></div>
                  <div class="el-empty__description">
                    <p>暂无流程信息</p>
                  </div><!---->
                </div>
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="btnType == 'look'" label="流转记录" name="transferList">
            <el-table v-loading="formLoading" :data="transferData">
              <el-table-column prop="businessName" label="审批业务名称" min-width="160" />
              <el-table-column prop="processedName" label="办理人名称" min-width="160" />
              <el-table-column prop="remark" label="备注" min-width="160" />
              <el-table-column prop="startDate" label="开始时间" min-width="160" />
              <el-table-column prop="endDate" label="结束时间" min-width="160" />
              <el-table-column prop="consumingTime" label="耗时" min-width="160" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="选择销售订单" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="orderVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="handleClose">

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.orderNo" placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerCode" placeholder="请输入客户编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerName" placeholder="请输入客户名称" clearable />
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

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="orderData" :fixedNO="true">
                <el-table-column prop="orderNo" label="订单号" width="180" fixed="left"></el-table-column>

                <el-table-column prop="cooperativePartnerCode" label="客户编码" width="160" />
                <el-table-column prop="cooperativePartnerName" label="客户名称" width="120" />
                <el-table-column prop="workOrderNo" label="工作令号" width="160"></el-table-column>
                <el-table-column prop="sourceOrderNo" label="来源单号" width="160"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column prop="documentStatus" fixed="right" label="单据状态" width="120">
                  <template slot-scope="scope">

                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                    <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>

                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" fixed="right" label="审批状态" width="120">
                  <template slot-scope="scope">
                    <!-- <div v-for="(item, index) in approvalStateList" :key="index">
                      <span v-if="item.value == scope.row.orderProduceState">{{ item.label }}</span>
                    </div> -->
                    <div v-if="scope.row.approvalStatus == 'ing'"><el-tag type="warning">审批中</el-tag> </div>
                    <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
                    <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" :disabled="selectFlag" @click="selectOrder(scope.row)">
                      选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </div>

      </el-dialog>
      <okOrNo v-if="okOrNoVisible" ref="okForm" @close="closeForm"/>
      <transferForm v-if="transferFormVisible" ref="transferForm" @close="closeForm"/>
    </div>
  </transition>
</template>

<script>

import { addOrdersChange, editOrdersChange, getOrdersChangeInfo } from '@/api/salesManagement/orderChanges'
import { getOrderDetail, getsaleOrderList, } from '@/api/salesManagement/assemblyOrders'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
import { mapGetters, mapState } from 'vuex'
import okOrNo from './okOrNoForm.vue'
import transferForm from './transferForm.vue'
export default {
  components: {
    workFlow,okOrNo,transferForm
  },
  data() {
    return {
      okOrNoVisible:false,
      transferFormVisible:false,
      selectFlag: false,
      sleeveItems: [
        { prop: "customerProductDrawingNo", label: "客户产品图号", value: "", type: 'view', width: "180", },
        { prop: "productCode", label: "产品编码", value: "", type: 'view', width: "180", },
        { prop: "productName", label: "产品名称", value: "", type: 'view', width: "180", },
        { prop: "productDrawingNo", label: "产品图号", value: "", type: 'view', width: "180", },
        { prop: "num", label: "原数量(主)", value: "", type: 'view', width: "180", },
        { prop: "mainUnit", label: "主单位", value: "", type: 'view', width: "180", },
        { prop: "assistantNum", label: "原数量(副)", value: "", type: 'view', width: "100", },
        { prop: "deputyUnit", label: "副单位", value: "", type: 'view', width: "180", },
        { prop: "price", label: "原单价", value: "", type: 'view', width: "120" },
        { prop: "excludingTaxAmount", label: "原金额", value: "", type: 'view', width: "120" },
        { prop: "deliveryDate", label: "原交货日期", value: "", type: 'view', width: "180" },
        { prop: "ask", label: "要求", value: "", type: 'view', width: "200" },
        // { prop: "newNum", label: "新数量(主)", value: "", type: 'input', width: "200", maxlength: 11, itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [10, 2, false, errMsg => { this.$message.error(`新数量(主)：${errMsg}`) }] }), trigger: 'blur' }] },
        // { prop: "newAssistantNum", label: "新数量(副)", value: "", type: 'view', width: "200" },
        { prop: "newPrice", label: "新单价", value: "", width: "120", change: this.changePrice, type: 'input', itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [10, 2, false, errMsg => { this.$message.error(`新单价：${errMsg}`) }] }), trigger: 'blur' }] },
        { prop: "newExcludingTaxAmount", label: "新金额", value: "", type: 'view', width: "180" },
        { prop: "newDeliveryDate", label: "新交货日期", value: "", type: 'date', width: "180", itemRules: [{ required: true, trigger: "change" },] },
        { prop: "newAsk", label: "新要求", value: "", type: 'input', width: "180", },
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
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        pageNum: 1,
        pageSize: 20,
        ordersNo: "",
        orderState: "not_finish",
        documentStatus: "submit",

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
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: "发起人",
        nodeType: 0,
        type: 'node',
        priorityLevel: "",
        approvalType: "appoint",
        selectMode: "",
        selectRange: "",
        directorLevel: "",
        examineMode: "",
        whenEmpty: "",
        examineEndDirectorLevel: "",
        ccSelfSelectFlag: "",
        conditionList: [],
        nodeUserList: [],
        childNode: null,
        conditionNodes: []
      },
      approvalForm: {},
      firstOneNode: [],
      // 审批 转审记录参数
      transferQuery: {
        approvalFormId: '',
        createByName: "",
        documentId: '',
        endTime: "",
        keyword: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
      transferData: [],
      formLoading: false,
      isShow:'',
      row:{},
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },
    orderDetailData(val) {
      val.forEach(item => {
        console.log(item);
        if (this.btnType != 'look') {
          // if (item.calculationDirection == "division") {
          //   if (item.newNum) {
          //     console.log("除", item);
          //     item.newAssistantNum = (Number(item.newNum) / Number(item.ratio)).toFixed(2)
          //   }

          // } else {
          //   console.log("成", item);
          //   if (item.newNum) {

          //     item.newAssistantNum = (Number(item.newNum) * Number(item.ratio)).toFixed(2)
          //   } else {
          //     item.newAssistantNum = ""
          //   }

          // }
          // if (item.newNum && item.newPrice) {
          //   item.newExcludingTaxAmount = (Number(item.newNum) || 0) * (Number(item.newPrice) || 0)
          // } else {
          //   item.newExcludingTaxAmount = ""
          // }
          if (item.newPrice) {
            item.newExcludingTaxAmount = (Number(item.num) || 0) * (Number(item.newPrice) || 0)
          } else {
            item.newExcludingTaxAmount = ""
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

  },
  methods: {
    deleteData(val) {
      console.log(val);
      this.orderDetailData.splice(val.$index, 1)
    },
    // 监听价格改变
    changePrice(val, scope) {
      console.log(val, scope);
      let index = scope.$index;
      if (this.orderDetailData[index].taxRate) {
        this.orderDetailData[index].newExcludingTaxPrice = (this.orderDetailData[index].newPrice / (1 + (Number(this.orderDetailData[index].taxRate)) / 100)).toFixed(8)
        console.log("scope.row", scope.row);
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
      console.log(row);
      if (this.dataForm.ordersNo) {
        this.$confirm('此操作将更换产品数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.ordersNo = row.orderNo
          this.dataForm.ordersId = row.id
          this.orderDetailData = []
          getOrderDetail(row.id).then(res => {
            console.log("详情数据", res);
            this.selectFlag = true
            this.orderVisible = false
            this.selectFlag = false

            res.data.orderLines.forEach(item => {
              let obj = {
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
                newExcludingTaxAmount: item.totalAmount ? item.totalAmount : "",
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
                customerProductDrawingNo: item.customerProductDrawingNo
              }
              this.orderDetailData.push(obj)
            })
          })
        })
      } else {
        this.dataForm.ordersNo = row.orderNo
        this.dataForm.ordersId = row.id
        this.orderDetailData = []
        getOrderDetail(row.id).then(res => {
          console.log("详情数据", res);
          this.selectFlag = true
          this.orderVisible = false
          this.selectFlag = false

          res.data.orderLines.forEach(item => {
            let obj = {
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
              newExcludingTaxAmount: item.totalAmount ? item.totalAmount : "",
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
              customerProductDrawingNo: item.customerProductDrawingNo
            }
            this.orderDetailData.push(obj)
          })
        })
      }
      // 审批
      this.$nextTick(() => { this.getApproverData() })
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
        orderState: "not_finish",
        documentStatus: "submit",

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
        console.log("销售订单数据", res);
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
    init(row, btnType,isShow) {
      this.dataForm.id = row.documentId || ''
      this.btnType = btnType 
      this.row = row
      this.isShow = isShow
      if (this.dataForm.id && this.btnType != 'add') {
        getOrdersChangeInfo(this.dataForm.id).then(res => {
          console.log("订单详情", res);
          this.$nextTick(() => {
            this.dataForm = res.data.change
            this.orderDetailData = res.data.changeLineList
            // res.data.changeLineList.forEach(item => {
            //   let obj = {
            //     productCode: item.productCode ? item.productCode : "",
            //     productName: item.productName ? item.productName : "",
            //     drawingNo: item.drawingNo ? item.drawingNo : "",
            //     num: item.num ? item.num : "",
            //     mainUnit: item.mainUnit ? item.mainUnit : "",
            //     assistantNum: item.assistantNum ? item.assistantNum : "",
            //     deputyUnit: item.deputyUnit ? item.deputyUnit : "",
            //     price: item.price ? item.price : "",
            //     excludingTaxPrice: item.excludingTaxPrice ? item.excludingTaxPrice : "",
            //     deliveryDate: item.deliveryDate ? item.deliveryDate : "",
            //     ask: item.ask ? item.ask : "",
            //     newNum: item.newNum ? item.newNum : "",
            //     newAssistantNum: item.newAssistantNum,
            //     newPrice: item.newPrice ? item.newPrice : "",
            //     newExcludingTaxAmount: item.newExcludingTaxAmount ? item.newExcludingTaxAmount : "",
            //     newDeliveryDate: item.newDeliveryDate ? item.newDeliveryDate : "",
            //     newAsk: item.newAsk ? item.newAsk : "",
            //     remark: item.remark ? item.remark : "",
            //     ratio: item.ratio
            //   }
            //   this.orderDetailData.push(obj)
            // })

          })

        })
        getSaleBusDetail(this.dataForm.id).then(res => {
          console.log(res, '业务详情');
          if (res.data) {
            this.firstOneNode = []
            this.approvalForm = res.data.form
            this.transferQuery.approvalFormId = this.approvalForm.id
            this.firstOneNode.push({
              name: res.data.form.createByName
            })
            let data = res.data.formNodeTree.childNode
            if (data) {
              this.addNodeTypeAndNodeName(data)

              this.busNodeConfig.childNode = data
              this.workVisible = true
              // this.$nextTick(() => {
              //   this.$refs.workflowRef.initData('busing', this.btnType)
              // })
            }
            if (this.btnType == 'look') {
              console.log(this.approvalForm, '++++++++++');
              this.transferQuery.documentId = this.dataForm.id
              approvalTransferList(this.transferQuery).then(res => {
                console.log(res, '流转记录');
                this.transferData = res.data.records
              })
            }
          } else {
            this.busNodeConfig.childNode = null
          }
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
          // 审批
          this.$nextTick(() => { this.getApproverData() })


        })
      }
    },
    goBack() {
      this.$emit('close')
    },
    async handleConfirm(value) {
      this.btnLoading = true
      let focusFlag = true // 自动聚焦是否可用
      // 审批条件参数列表
      let nodeCondList = []
      // 审批抄送人列表
      let ccList = []
      let ccLists = []
      let nodeJudg = []
      // 业务审批单流程节点列表
      let formNodeList = []
      // 业务审批单
      let form = {}
      if (this.btnType == 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          console.log(flattenedNodes, 'flattenedNodesflattenedNodes');
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')

          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }

          console.log(ccLists, 'ccListsccLists');
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: item.name == '审核人' ? 'no' : '',
              adminId: '',
              id: '',
              previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
              ccToId: item.targetId,
              approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
              id: '',
              defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1,
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: value,
            documentId: '',
            id: ''
          }
        }

      }
      if (this.btnType === 'edit' || this.btnType === 'look') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          console.log(flattenedNodes, 'flattenedNodesflattenedNodes');
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }
          console.log(ccLists, 'ccListsccLists');
          // return
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              // previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              // name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalFormId: item.approvalFormId ? item.approvalFormId : this.approvalForm.id,
              approvalFormNodeCode: item.approvalFormNodeCode ? item.approvalFormNodeCode : item.code,
              ccToId: item.targetId,
              id: item.id ? item.id : ''
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: value,
          }
        }
      }
      if (value === 'submit' && this.dataForm.approvalFlag) {
        if (!this.busNodeConfig.childNode) {
          focusFlag = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach(item => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                focusFlag = false
                this.btnLoading = false
                this.$message.error('未配置发起人自选！')
              }
            }
          })
        }
      }

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
      console.log("focusFlag", focusFlag);
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
          form: form,
          formNodeList,
          nodeCondList: nodeJudg,
          ccList: ccLists,
        }
        let flag = null;
        for (let index = 0; index < this.orderDetailData.length; index++) {
          const item = this.orderDetailData[index];
          if (item.newPrice == 0 || !item.newPrice) {
            this.btnLoading = false
            flag = false
            console.log(index);
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
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      console.log(obj);
      if (obj) {
        if (obj.name === "审核人") {
          obj.nodeType = 1;
          obj.nodeName = obj.name;
          obj.directorLevel = obj.approvalType == "manager" ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == "multilevel" ? obj.levelSupervisor : ''
        }
        if (obj.name === "路由") {
          obj.nodeType = 4;
        }
        if (obj.name === "抄送人") {
          obj.nodeType = 2;
          obj.nodeName = obj.name;
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode);
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map(item => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(','); // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',');
                  var resultArr = [];
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      };
                      resultArr.push(option);
                    }
                  }
                }
                return {
                  ...item,
                  columnDbname: item.name,
                  columnType: item.dataType,
                  showName: item.name,
                  tjCode: item.code,
                  zdy1: item.comparisonValue,
                  columnId: item.approvalBusinessId,
                  options: resultArr,
                  optType: item.dataType == 'number' ? (item.operationalFormula == 'lt' ? '1' : item.operationalFormula == 'gt' ? '2' : item.operationalFormula == 'eq' ? '4' : item.operationalFormula == 'ge' ? '5' : item.operationalFormula == 'le' ? '3' : '') : ''

                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode);
            }
          }
        }
      }
    },
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        console.log(node, '提交数1');
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null });
        if (node.type === 'node') {

          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {

              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code);
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
        }
      }
      return flattenedNodes;
    },
    // // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = ''  // 条件符号
      let result = null     // 判断条件是否成立
      let condList = []
      getBusDetail('b016').then(res => {
        console.log(res);
        state = res.data.business.state
        condExpress = res.data.business.condExpress
        // if (res.data.businessConditionList.length) {
        //   res.data.businessConditionList.forEach(item => {
        //     condList.push({
        //       code: item.code,
        //       val: item.code === 'numCode' ? this.totalNum : this.totalPrice
        //     })
        //   })
        // }
        if (state === 'condition') {
          this.dataForm.approvalFlag = 1
          for (var i = 0; i < condArr.length; i++) {
            if (condExpress.includes(condArr[i])) {
              foundSymbol = condArr[i];
              break;
            }
          }
          // 找到符号并进行销售报价业务判断
          if (foundSymbol) {
            const parts = condExpress.split(foundSymbol); // 使用 ">" 符号拆分字符串
            const leftValue = parts[0]; // 提取 ">" 符号左边的值
            const rightValue = parts[1]; // 提取 ">" 符号右边的值
            console.log(leftValue);
            console.log(rightValue);
            // if (leftValue == 'numCode') {
            //   const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // } else {
            //   const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // }
            if (result) {
              let query = {
                businessCode: "b016",
                condList,
              }
              busApprovalFlowTree(query).then(res => {
                console.log(res, '树详情');
                if (res.data) {
                  this.firstOneNode = []
                  this.approvalForm = res.data.template
                  this.firstOneNode.push({
                    name: this.userInfo.userName
                  })
                  let data = res.data.tempLineTree.childNode
                  if (data) {
                    this.addNodeTypeAndNodeName(data)
                    this.busNodeConfig.childNode = data
                    this.workVisible = true
                    this.$nextTick(() => {
                      this.$refs.workflowRef.initData('busing', this.type)
                    })
                  }
                } else {
                  this.busNodeConfig.childNode = null
                }
              })
            } else {
              this.busNodeConfig.childNode = null
            }
          }
        }
        if (state === 'enable') {
          this.dataForm.approvalFlag = 1
          let query = {
            businessCode: "b016",
            condList,
          }
          busApprovalFlowTree(query).then(res => {
            console.log(res, '树详情');
            if (res.data) {
              this.firstOneNode = []
              this.approvalForm = res.data.template
              this.firstOneNode.push({
                name: this.userInfo.userName
              })
              let data = res.data.tempLineTree.childNode
              if (data) {
                this.addNodeTypeAndNodeName(data)
                this.busNodeConfig.childNode = data
                this.workVisible = true
                this.$nextTick(() => {
                  this.$refs.workflowRef.initData('busing', this.type)
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
        }
        if (state === 'disabled') {
          this.dataForm.approvalFlag = 0
          this.busNodeConfig.childNode = null
        }
      })

    },
    confirmOk(title,state,row){
      this.okOrNoVisible = true
      this.$nextTick(()=>{
        this.$refs.okForm.init(title,state,row)
      })
    },
    confirmTrans(title,state,row){
      this.transferFormVisible = true
      this.$nextTick(()=>{
        this.$refs.transferForm.init(title,state,row)
      })
    },
    closeForm(isRefresh){
      if (isRefresh) {
        this.$emit('close', true)
      }
    },
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

// .el-button--small {
//   // padding: 1;
// }
</style>
<style scoped>
::v-deep .el-tabs {
  height: 100%!important;
}
::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow:auto!important;
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

::v-deep .workNode {
  background-color: #f5f5f7 !important;
}

.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}
</style>