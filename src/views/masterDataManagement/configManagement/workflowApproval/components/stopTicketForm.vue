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
                  <el-form-item label="销售订单" prop="saleOrderNo">
                    <el-input readonly placeholder="请选择订单" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.saleOrderNo" @focus="openOrderDia"></el-input>
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
            <el-table ref="product" :data="orderDetailData" :fixedNO="true">
              <el-table-column type="index" width="60" fixed="left" label="序号">
              </el-table-column>
              <el-table-column prop="customerProductDrawingNo" label="客户产品图号" width="150"></el-table-column>
              <el-table-column prop="productCode" label="产品编码" width="200" />
              <el-table-column prop="productName" label="产品名称" width="200"></el-table-column>
              <el-table-column prop="drawingNo" label="型号" width="120" />
              <el-table-column prop="num" label="订单数量" width="120"></el-table-column>
              <el-table-column prop="planQuantity" label="已计划数量" width="120"></el-table-column>
              <el-table-column prop="dispatchingQuantity" label="已派工数量" width="120"></el-table-column>
              <el-table-column prop="completedQuantity" label="已完工数量" width="120"></el-table-column>
              <el-table-column prop="shipmentQuantity" label="已发货数量" width="120"></el-table-column>
              <el-table-column prop="mainUnit" label="单位" width="120"></el-table-column>
              <el-table-column prop="stopQuantity" label="停止数量" width="200">
                <template slot="header">
                  <span class="required">*</span>停止数量
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.stopQuantity" :disabled="btnType == 'look' ? true : false"
                    placeholder="请输入停止数量" @input="watchNum(scope.row, scope.$index)"
                    @blur="checkNum(scope.row, scope.$index)">
                    {{ scope.row.productName }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="stopReason" label="停止原因" width="220">
                <template slot="header">
                  <span class="required">*</span>停止原因
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.stopReason" :disabled="btnType == 'look' ? true : false"
                    placeholder="请输入停止原因">
                    {{ scope.row.productName }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="stopDate" label="停止日期" width="200">
                <template slot="header">
                  <span class="required">*</span>停止日期
                </template>
                <template slot-scope="scope">
                  <el-date-picker v-model="scope.row.stopDate" type="date" value-format="yyyy-MM-dd"
                    :disabled="btnType == 'look' ? true : false" style="width: 100%;" placeholder="请选择停止日期">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false"
                    maxlength="200" />
                </template>
              </el-table-column>
            </el-table>


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
                    <el-input @keyup.native.enter="search()"  v-model="orderForm.orderNo" placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="orderForm.cooperativePartnerCode" placeholder="请输入客户编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="orderForm.cooperativePartnerName" placeholder="请输入客户名称" clearable />
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
              <JNPF-table v-loading="listLoading" :data="orderData" :fixedNO="true" customKey="JNPFTableKey_895507">
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
                    <el-button type="text" size="mini" @click="selectOrder(scope.row)"> 选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="getOrderData" />
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

import { addApplyStopOrders, editApplyStopOrders, getApplyStopOrders } from '@/api/salesManagement/stopTicket'
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
      orderVisible: false,
      listLoading: false,
      total: 0,
      orderDetailData: [],
      orderData: [],
      dataForm: {
        saleOrderNo: "",
        orderNo: "",
        applyReason: "",
        remark: "",
        id: "",
        documentStatus: ""
      },
      orderForm: {
        orderState: "not_finish",
        ordersNo: "",
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        pageNum: 1,
        pageSize: 20,
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
        saleOrderNo: [
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
    handleClick() {

    },
    checkNum(row, index) {
      if (Number(row.stopQuantity) > Number(row.num)) {
        this.$message({
          message: "第" + (index + 1) + "行产品的停止数量不能大于订单数量",
          type: 'error',
          duration: 1500,
        })
      }
    },
    watchNum(row, index) {
      console.log("主数量", row, index);
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      row.stopQuantity = row.stopQuantity.replace(/[^\d.]/g, '');

      if (row.stopQuantity.length == 1 && row.stopQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.stopQuantity = '';
      } else if (row.stopQuantity.length == 2 && row.stopQuantity[0] == '0' && row.stopQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.stopQuantity = row.stopQuantity.slice(0, 1) + '.' + row.stopQuantity.slice(1);
      } else if (row.stopQuantity.length > 2 && row.stopQuantity[0] == '0' && row.stopQuantity[1] != '.') {
        row.stopQuantity = row.stopQuantity.substring(1, row.stopQuantity.length)
      }



      if (row.stopQuantity.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果

        for (let i = 0; i < row.stopQuantity.length; i++) {
          const char = row.stopQuantity[i];
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char;
              dotCount++;
            }
          } else {
            result += char;
          }
        }

        row.stopQuantity = result;
        console.log(9999, row.stopQuantity);
        let arr = row.stopQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.stopQuantity = arr[0] + '.' + arr[1]
        console.log(999666, arr);
      } else {
        if (row.stopQuantity.length > 8) {
          row.stopQuantity = row.stopQuantity.substring(0, 8);
        }
      }
    },
    // 弹框中选择订单
    selectOrder(row) {
      console.log(row);
      this.dataForm.saleOrderNo = row.orderNo
      this.dataForm.ordersId = row.id
      getOrderDetail(row.id).then(res => {
        console.log("详情数据", res);
        this.orderVisible = false
        res.data.orderLines.forEach(item => {
          item.ordersLineId = item.id
        });
        this.orderDetailData = res.data.orderLines
        // 审批
        this.$nextTick(() => { this.getApproverData() })
      })
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
        ordersNo: "",
        code: "",
        name: "",
        orderState: "not_finish",
        pageNum: 1,
        pageSize: 20,
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
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
    init(row, btnType,isShow) {
      this.dataForm.id = row.documentId || ''
      this.btnType = btnType
      this.row = row
      this.isShow = isShow
      if (this.dataForm.id && this.btnType != 'add') {
        getApplyStopOrders(this.dataForm.id).then(res => {
          console.log("订单详情", res);
            this.dataForm = res.data.stop
            res.data.lines.forEach(item => {
              item.drawingNo = item.productDrawingNo
            })
            this.orderDetailData = res.data.lines
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
        getApplyStopOrders(this.dataForm.id).then(res => {
          this.dataForm = res.data.stop
          res.data.lines.forEach(item => {
              item.drawingNo = item.productDrawingNo
              item.id = ''
          })
          this.orderDetailData = res.data.lines
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
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = null;
          let submitFlag = null;
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
              submitFlag = false
              this.btnLoading = false
              this.$message.error('未找到匹配的审批流程，请联系管理员！')
            }
            if (formNodeList.length) {
              formNodeList.forEach(item => {
                if (item.approvalType === 'option') {
                  if (!item.designatedMembersId) {
                    submitFlag = false
                    this.btnLoading = false
                    this.$message.error('未配置发起人自选！')
                  }
                }
              })
            }
          }




          if (this.btnType == 'edit') {
            formMethod = editApplyStopOrders
          } else if (this.btnType == 'add') {
            formMethod = addApplyStopOrders
          }
          this.dataForm.documentStatus = value
          let obj = {
            lines: this.orderDetailData,
            stop: this.dataForm,
            form: form,
            formNodeList,
            nodeCondList: nodeJudg,
            ccList: ccLists,
          }
          let num = 0;
          for (let index = 0; index < this.orderDetailData.length; index++) {
            const item = this.orderDetailData[index];
            console.log("item.stopQuantity", item.stopQuantity);
            num += Number(item.stopQuantity)
            if (Number(item.stopQuantity) > Number(item.num)) {
              submitFlag = false
              this.btnLoading = false
              this.$message({
                message: "第" + (index + 1) + "行产品的停止数量不能大于订单数量",
                type: 'error',
                duration: 1500,
              })
              break
            }
            console.log("num", num);
            // if (this.orderDetailData.length - index == 1) {
            //   if (num == 0) {
            //     submitFlag = false
            //     this.btnLoading = false
            //     this.$message({
            //       message: "停止数量总数量不能为0",
            //       type: 'error',
            //       duration: 1500,
            //     })
            //     break
            //   }

            // }
            if (!item.stopReason) {
              submitFlag = false
              this.btnLoading = false
              this.$message({
                message: "请输入第" + (index + 1) + "行产品的停止原因",
                type: 'error',
                duration: 1500,
              })
              break
            }
            if (!item.stopDate) {
              submitFlag = false
              this.btnLoading = false
              this.$message({
                message: "请选择第" + (index + 1) + "行产品的停止日期",
                type: 'error',
                duration: 1500,
              })
              break
            }


          }

          if (submitFlag === false) return
          formMethod(obj).then(res => {
            let msg = "";
            if (formMethod == editApplyStopOrders) {
              msg = "修改成功"
            } else {
              msg = "新建成功"
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

        }
      })
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
      getBusDetail('b017').then(res => {
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
                businessCode: "b017",
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
            businessCode: "b017",
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

.el-button--small {
  // padding: 1;
}
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