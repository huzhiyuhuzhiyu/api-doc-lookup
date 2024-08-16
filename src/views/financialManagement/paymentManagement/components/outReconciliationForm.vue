<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
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
        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>基本信息</h5>
              </div>
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="对账单号" prop="orderNo" ref="orderNo">
                      <el-input v-model="dataForm.orderNo" placeholder="请输入对账单号"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="外协供应商名称" prop="supplierName" ref="supplierName">
                      <el-input v-model="dataForm.cooperativePartnerName" placeholder="请输入外协供应商名称"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>



                  <el-col :sm="8" :xs="24">
                    <el-form-item label="对账日期" prop="reconciliationDate" ref="reconciliationDate">
                      <!-- <el-input v-model="dataForm.reconciliationDate" placeholder="请选择报价有效期" clearable
                        :style='{ "width": "100%" }' maxlength="20" :disabled="type == 'look'"></el-input> -->

                      <el-date-picker v-model="dataForm.reconciliationDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择对账日期" :disabled="type == 'look' ? true : false">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="订单金额" prop="includingTaxAmount" ref="includingTaxAmount">
                      <el-input v-model="dataForm.includingTaxAmount" placeholder="请输入订单金额"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="对账金额" prop="totalReconciliationAmount" ref="totalReconciliationAmount">
                      <el-input v-model="dataForm.totalReconciliationAmount" placeholder="请输入对账金额"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="备注" prop="remark" ref="remark">
                      <el-input :disabled="type == 'look' ? true : false" type="textarea" :rows="3" maxlength="200" v-model="dataForm.remark" placeholder="请输入备注">
                      </el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>对账信息</h5>
              </div>

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" hasC hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table">
                  <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

                  <el-table-column prop="ordersNo" label="订单号" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'ordersNo'">
                        <div class="viewData">
                          <span>{{ scope.row.ordersNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="confirmReceiptRecordsOrderNo" label="收退货通知单号" min-width="180"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'confirmReceiptRecordsOrderNo'">
                        <div class="viewData">
                          <span>{{ scope.row.confirmReceiptRecordsOrderNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                        <div class="viewData">
                          <span>{{ scope.row.productCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                        <div class="viewData">
                          <span>{{ scope.row.productName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drawingNo" label="产品图号" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">

                        <div class="viewData">
                          <span>{{ scope.row.drawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="spec" label="规格型号" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'spec'">

                        <div class="viewData">
                          <span>{{ scope.row.spec }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="reconciliationUnitPrice" label="对账数量" min-width="140">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'reconciliationUnitPrice'">

                        <div class="viewData">
                          <span>{{ scope.row.reconciliationUnitPrice }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位(主)" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">

                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="excludingTaxAmount" label="不含税金额" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">

                        <div :class="['viewData', scope.row.excludingTaxAmount < 0 ? 'red' : 'green']">
                          <span>{{ scope.row.excludingTaxAmount < 0 ? scope.row.excludingTaxAmount : '+' +
                            scope.row.excludingTaxAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="taxAmount" label="税额" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">

                        <div :class="['viewData', scope.row.taxAmount < 0 ? 'red' : 'green']">
                          <span>{{ scope.row.taxAmount < 0 ? scope.row.taxAmount : '+' + scope.row.taxAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="includingTaxAmount" label="含税金额" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'includingTaxAmount'">
                        <div :class="['viewData', scope.row.includingTaxAmount < 0 ? 'red' : 'green']">
                          <span>{{ scope.row.includingTaxAmount < 0 ? scope.row.includingTaxAmount : '+' +
                            scope.row.includingTaxAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>




                  <el-table-column prop="remark" label="备注" min-width="220">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" :disabled="type === 'look'" maxlength="20"
                        placeholder="请输入备注">{{
                          scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>
                  <!-- 
                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="type === 'look'"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>

                    </template>
                  </el-table-column> -->
                </el-table>
              </el-form>

              <div style="height: 40px; line-height: 40px; background: #f5f7fa;">
                <span style="font-size:17px;font-weight:500;margin-right:10px">不含税金额：
                  <span :class="dataForm.excludingTaxAmount > 0 ? 'green' : 'red'">{{ dataForm.excludingTaxAmount > 0 ?
                    '+' + dataForm.excludingTaxAmount : dataForm.excludingTaxAmount
                  }}</span></span>
                <span style="font-size:17px;font-weight:500;margin-right:10px">税额：
                  <span :class="dataForm.taxAmount > 0 ? 'green' : 'red'">{{ dataForm.taxAmount > 0 ?
                    '+' + dataForm.taxAmount : dataForm.taxAmount
                  }}</span></span>
              <span style="font-size:17px;font-weight:500;margin-right:10px">含税金额：
                  <span :class="dataForm.totalReconciliationAmount > 0 ? 'green' : 'red'">{{ dataForm.totalReconciliationAmount > 0 ?
                    '+' + dataForm.totalReconciliationAmount : dataForm.totalReconciliationAmount
                  }}</span></span>

              </div>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow">
              <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="type" :nodeConfig.sync="busNodeConfig"
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
            <el-tab-pane v-if="type == 'look'" label="流转记录" name="transferList">
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
      </div>
    </transition>
    <okOrNo v-if="okOrNoVisible" ref="okForm" @close="closeForm"/>
    <transferForm v-if="transferFormVisible" ref="transferForm" @close="closeForm"/>
  </div>
</template>
<script>
import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import { mapGetters, mapState } from 'vuex'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
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
      activeName: 'jcInfo',
      dialogTitle: '',
      loading: false,
      btnLoading: false,
      index: null,

      dataFormTwo: {
        data: []
      },
      dataForm: {
        id: "",
        orderNo: "",        // 单号
        cooperativePartnerName: '',
        reconciliationEndDate: '',
        excludingTaxAmount: '',
        includingTaxAmount: '',
        taxAmount: '',
        submitDate: '',
        createTime: '',
        createByName: '',
        remark: "",
        totalReconciliationAmount: '',

      },
      type: "",
      rules: {
      },
      productRules: {
      },
      productArr: [],
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
      formLoading:false,
      isShow:'',
      row:{},
    }
  },
  computed:{
    ...mapGetters(['userInfo']),
  },
  created() {
  },
  methods: {

    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(row, type,isShow) {
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = row.documentId || ''
      this.row = row
      this.isShow = isShow
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          getfinAccountDetail(this.dataForm.id).then(res => {
            console.log(res, '详情');
            // return
            this.dataForm = {
              id: res.data.id,
              orderNo: res.data.orderNo,
              cooperativePartnerName: res.data.cooperativePartnerName,
              excludingTaxAmount: res.data.excludingTaxAmount,
              includingTaxAmount: res.data.includingTaxAmount,
              taxAmount: res.data.taxAmount,
              reconciliationDate: res.data.reconciliationDate,
              totalReconciliationAmount: res.data.totalReconciliationAmount
            }
            this.dataFormTwo.data = res.data.reconciliationLines
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
              if (this.type == 'look') {
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
      })
    },
   

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
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
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs {
  height: 100%!important;
}
::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow:auto!important;
  padding: 0 20px;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.red {
  color: red
}

.green {
  color: #67C23A;
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