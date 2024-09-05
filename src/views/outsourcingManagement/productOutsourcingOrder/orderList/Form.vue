<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="title" />
          <!-- <el-page-header @back="goBack" :content="type === 'look' ? '查看外协订单' : '新建外协订单'" /> -->
          <div class="options" v-if="type !== 'look'">
            <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿
            </el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :span="8" v-if="type === 'look'">
                        <el-form-item label="外协单号" prop="orderNo" ref="orderNo">
                          <el-input :disabled="type == 'look'" type="text" v-model="dataForm.orderNo"
                            placeholder="外协单号"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <el-input :disabled="type == 'look'" v-model="dataForm.cooperativePartnerName"
                            placeholder="请选择供应商名称" @focus="openDialog"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="交货日期" prop="deliveryDate">
                          <el-date-picker :disabled="type == 'look'" v-model="dataForm.deliveryDate" type="date"
                            value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="dataPickerOptions2"
                            placeholder="请选择交货日期"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" v-if="type === 'look'">
                        <el-form-item label="订单状态" prop="receivingStatus" ref="receivingStatus">
                          <el-select v-model="value" placeholder="请选择" :disabled="type !== 'add' ? true : false">
                            <el-option v-for="item in receivingStatusOptions" :key="item.value" :label="item.label"
                              :value="item.value" ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                    <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                      :data="dataFormTwo.data" id="table">
                      <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                      <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                            <div class="viewData">
                              <span>{{ scope.row.drawingNo }}</span>
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
                      <!-- <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                            <div class="viewData">
                              <span>{{ scope.row.productName }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column> -->

                      <el-table-column prop="planDemandQuantity" label="计划需求数量" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'planDemandQuantity'">
                            <div class="viewData">
                              <span>{{ scope.row.planDemandQuantity ? scope.row.planDemandQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="purchaseQuantity" label="订单数量" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                            :rules="productRules.purchaseQuantity">
                            <div class="viewData">
                              <span>{{ scope.row.purchaseQuantity ? scope.row.purchaseQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="receiptQuantity" label="已入库数量" min-width="160">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'receiptQuantity'"
                            :rules="productRules.receiptQuantity">
                            <div class="viewData">
                              <span>{{ scope.row.receiptQuantity ? scope.row.receiptQuantity : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <!-- <el-table-column prop="deputyUnit" label="单位(副)" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deputyUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.deputyUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column> -->

                      <el-table-column prop="price" label="含税单价" min-width="120">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">
                            <div class="viewData">
                              <span>{{ scope.row.price ? scope.row.price : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="taxRate" label="税率%" min-width="100">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                            <div class="viewData">
                              <span>{{ scope.row.taxRate }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <!-- <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="160">
                
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                 
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxPrice  ? scope.row.excludingTaxPrice  : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="excludingTaxAmount" label="总金额" min-width="160">
               
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                 
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount  : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                      <el-table-column prop="taxAmount" label="税额" min-width="120">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="totalAmount" label="价税合计" min-width="140">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="deliveryDate" label="交货日期" min-width="240">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'">
                            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" disabled :picker-options="dataPickerOptions"
                              placeholder="请选择交货日期"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="receivingStatus" label="订单状态" width="130">
                        <template slot-scope="scope">
                          <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag></div>
                          <div v-if="scope.row.receivingStatus == 'received'">
                            <el-tag type="success">已完成</el-tag>
                          </div>
                          <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="220">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" disabled maxlength="20"
                            :placeholder="type == 'look' ? '' : '请输入备注'">
                            {{ scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>

                      <!-- <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            @click="delequipment_process_relList(scope.$index)">删除</el-button>

                        </template>
                      </el-table-column> -->
                    </el-table>
                  </el-form>

                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin-right:10px">
                      总金额：{{ dataForm.excludingTaxTotalAmount }}
                    </span>
                    <span style="font-weight:500;margin-right:10px">总税额：{{ dataForm.taxAmount }}</span>
                    <span style="font-weight:500;margin-right:10px">价税合计：{{ dataForm.totalAmount }}</span>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="发料清单信息" name="materialInfo">
                  <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="linesList" :data="linesList"
                    id="table">
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="160"></el-table-column>
                    <el-table-column prop="productCode" label="产品编码" min-width="140"></el-table-column>
                    <el-table-column prop="processName" label="工序名称" min-width="140"></el-table-column>
                    <el-table-column prop="mainUnit" label="单位" min-width="140"></el-table-column>
                    <el-table-column prop="purchaseQuantity" label="基本数量" min-width="140"></el-table-column>
                    <el-table-column prop="demandQuantity" label="发料数量" min-width="140"></el-table-column>
                    <el-table-column prop="undeliveredQuantity" label="待出库数量" min-width="140"></el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>

            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>
    </transition>
    <!-- <Products-dialog v-if="productVisibled" ref="productRef" @productsSubmit="productsSubmit"></Products-dialog> -->
    <!-- <SupplierDialog ref="SupplierRef" @supplierdata="supplierdata" /> -->
  </div>
</template>
<script>
// import ProductsDialog from './products-dialog.vue'
// import SupplierDialog from './supplier-dialog.vue'
import { editOutOrder, purPurchaseOrderdetail, orderSchedule } from '@/api/purchasingAndOutsourcingOrders/index'
import { excelExport } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import {
  getApprovalTemplate,
  getApprovalDetailTree,
  busApprovalFlowTree,
  getSaleBusDetail,
  getBusDetail,
  approvalTransferList
} from '@/api/basicData/approvalAdministrator'
import ExportForm from '@/components/no_mount/ExportBox/index'
import TableFormProduct from '@/components/no_mount/TableForm-product/index' // 产品选择组件
export default {
  components: {
    // ProductsDialog,
    // SupplierDialog
    TableFormProduct,
    workFlow,
    ExportForm
  },
  data() {
    return {
      title: '',
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo', 'materialInfo'],
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },

      dataForm: {
        cooperativePartnerName: '', //供应商名称
        deliveryDate: '', //交货日期.
        orderNo: '',
        orderType: 'procure',
        purchaseOrderLines: [],
        excludingTaxTotalAmount: '', //订单 不含税总金额
        totalAmount: '', //   含税总金额
        taxAmount: '' // 税额
      },
      receivingStatusOptions: [
        {
          value: 'not_finished',
          label: '未完成'
        },
        {
          value: 'finished',
          label: '已完成'
        },
        {
          value: 'stopped',
          label: '已停止'
        }
      ],
      dataPickerOptions: {
        // 日期区间选择器通用选项
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      dataPickerOptions2: {
        // 日期区间选择器通用选项
        disabledDate: this.disabledDate
      },
      type: '',
      dataFormArr: [],
      rules: {},
      productRules: {},
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      demandDelivery: '',
      olddeliveryDateArr: [], // 表格中旧的数据值
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: '发起人',
        nodeType: 0,
        type: 'node',
        priorityLevel: '',
        approvalType: 'appoint',
        selectMode: '',
        selectRange: '',
        directorLevel: '',
        examineMode: '',
        whenEmpty: '',
        examineEndDirectorLevel: '',
        ccSelfSelectFlag: '',
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
        createByName: '',
        documentId: '',
        endTime: '',
        keyword: '',
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ''
      },
      transferData: [],
      formLoading: false,
      // 进度跟踪数据
      scheduleData: [],
      scheduleForm: {
        createByName: '',
        endTime: '',
        endUpdateTime: '',
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        productCode: '',
        productDrawingNo: '',
        productName: '',
        purchaseOrderId: '',
        startTime: '',
        startUpdateTime: ''
      },
      total: 0,
      background: true, //分页器背景颜色
      exportFormVisible: false,
      linesList: []
    }
  },
  created() { },

  methods: {
    disabledDate(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time)
      const targetDate = new Date(this.demandDelivery)
      // 检查日期是否大于给定日期
      return currentDate > targetDate
    },
    // 对比日期方法
    changeDate(d1, d2) {
      return new Date(d1.replace((/-/g, '\/'))) > new Date(d2.replace(/-/g, '\/'))
    },

    // 打开选择供应商弹窗
    openDialog() {
      this.$refs['SupplierRef'].openDialog()
    },
    supplierdata(data) {
      if (data.length === 0) {
        this.$refs['elForm'].validateField('cooperativePartnerName')
      } else {
        this.$refs['elForm'].fields[0].resetField()
        this.dataForm.cooperativePartnerName = data.name
        this.dataForm.cooperativePartnerCode = data.code
        this.dataForm.cooperativePartnerId = data.id
      }
    },

    // 去除系数后两位的小数位
    numberFormat(number) {
      var formatted = parseFloat(number)
        .toFixed(2)
        .replace(/\.?0+$/, '')

      if (isNaN(formatted)) {
        return 0
      } else {
        return formatted
      }
    },
    //下单数量输入事件
    changePurchaseQuantity(index, val) {
      // this.dataFormTwo.data[index].purchaseQuantity = val
      this.$set(this.dataFormTwo.data[index], 'purchaseQuantity', val)
    },

    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      console.log(id, 'id')
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.type = type
      if (id) {
        if (this.type == 'edit') {
          this.title = '编辑外协订单'
        } else if (this.type == 'look') {
          this.title = '查看外协订单'
        }
      } else {
        this.title = '新建外协订单'
      }
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          purPurchaseOrderdetail(this.dataForm.id).then((res) => {
            if (res.data.attachmentList) {
              res.data.attachmentList.forEach((item) => {
                this.datafilelist.push({
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                })
              })
            }
            this.dataForm = {
              cooperativePartnerName: res.data.cooperativePartnerName, //供应商名称
              deliveryDate: res.data.deliveryDate, //交货日期.
              orderType: res.data.orderType,
              excludingTaxTotalAmount: res.data.excludingTaxTotalAmount, //订单 不含税总金额
              totalAmount: res.data.totalAmount, //   含税总金额
              taxAmount: res.data.taxAmount,
              orderNo: res.data.orderNo,
              id: res.data.id,
              receivingStatus: res.data.receivingStatus
            }
            this.dataFormTwo.data = res.data.purchaseOrderLineVOList
            this.linesList = res.data.purchaseOrderLineVOList[0].outShipmentVOList
            this.dataFormTwo.data[0].outShipmentList = res.data.purchaseOrderLineVOList[0].outShipmentVOList
          })
          getSaleBusDetail(this.dataForm.id).then((res) => {
            console.log(res, 'res')
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
                this.transferQuery.documentId = this.dataForm.id
                approvalTransferList(this.transferQuery).then((res) => {
                  this.transferData = res.data.records
                  this.formLoading = false
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
          if (this.type == 'look') {
            // 进度跟踪
            this.initData()
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit(type) {
      this.request(type)
    },

    async request(type) {
      let _data
      let hasCostPrice = true
      this.btnLoading = true
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
      let templateLineList = []
      if (this.type == 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data)
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map((item) => {
            return {
              ...item,
              nodeUserList: item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter((item) => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter((item) => item.nodeName === '抄送人')

          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList
            ccLists = ccLists.concat(nodeUserList)
          }

          if (templateLineList.length && type === 'submit') {
            hasCostPrice = templateLineList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && type === 'submit') {
            hasCostPrice = ccList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          }
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter((item) => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: item.name == '审核人' ? 'no' : '',
              adminId: '',
              id: '',
              previousCode:
                item.type === 'condition' ? item.previousCode : index === 0 ? '' : flattenedNodes[index - 1].code,
              name: item.nodeName,
              designatedMembersId: item.designatedMembersId
                ? item.designatedMembersId
                : item.nodeUserList.length
                  ? item.nodeUserList[0].targetId
                  : ''
            }
          })
          // 抄送人
          ccLists = ccLists.map((item) => {
            return {
              ...item,
              approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
              ccToId: item.targetId,
              approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
              id: '',
              defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map((item) => {
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
            documentStatus: type,
            documentId: '',
            id: ''
          }
        }
      }
      if (this.type === 'edit' || this.type === 'look') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data)
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map((item) => {
            return {
              ...item,
              nodeUserList: item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter((item) => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter((item) => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList
            ccLists = ccLists.concat(nodeUserList)
          }
          if (templateLineList.length && type === 'submit') {
            hasCostPrice = templateLineList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && type === 'submit') {
            hasCostPrice = ccList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          }
          // return
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter((item) => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              // previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              // name: item.nodeName,
              designatedMembersId: item.designatedMembersId
                ? item.designatedMembersId
                : item.nodeUserList.length
                  ? item.nodeUserList[0].targetId
                  : ''
            }
          })
          // 抄送人
          ccLists = ccLists.map((item) => {
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
            nodeJudg = nodeCondList.map((item) => {
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
            documentStatus: type
          }
        }
      }
      if (type === 'submit' && this.dataForm.approvalFlag) {
        if (!this.busNodeConfig.childNode) {
          hasCostPrice = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach((item) => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                hasCostPrice = false
                this.btnLoading = false
                this.$message.error('未配置发起人自选！')
              }
            }
          })
        }
      }
      this.dataForm.documentStatus = type
      console.log(this.dataForm.documentStatus, 'this.dataForm.documentStatus')
      if (this.datafilelist.length) {
        this.datafilelist.map((item, index) => {
          item.bimAttachments = {
            businessType: '',
            documentId: item.id,
            fileFlag: '',
            sort: index
          }
        })
      }
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.taxAmount * 1
      })
      this.dataForm.taxAmount = this.jnpf.numberFormat(count)
      if (this.type == 'add') {
        _data = {
          ...this.dataForm,
          attachmentList: this.datafilelist,
          purProcurementRequirements: this.dataForm,
          purchaseOrderLines: this.dataFormTwo.data,
          form: this.dataForm,
          formNodeList,
          nodeCondList: nodeJudg,
          ccList: ccLists,
          orderType: 'external'
        }
      }
      if (this.type === 'edit' || this.type === 'look') {
        // this.dataFormTwo.data.forEach((item, index) => {
        //   this.dataFormTwo.data[index].inquirySheetId = this.dataForm.id
        // })
        _data = {
          ...this.dataForm,
          attachmentList: this.datafilelist,
          purProcurementRequirements: this.dataForm,
          purchaseOrderLines: this.dataFormTwo.data,
          form: this.dataForm,
          formNodeList,
          nodeCondList: nodeJudg,
          ccList: ccLists,
          orderType: 'external'
        }
      }
      console.log(_data, '参数')
      let msg = ''
      if (this.dataForm.documentStatus === 'draft') {
        msg = '保存成功'
      } else {
        msg = '提交成功'
      }
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      if (hasCostPrice) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.data.length === 0) {
              this.btnLoading = false
              this.$message.error('请至少选择一项产品')
            } else {
              if (!valid_2) {
                console.log(1)
                this.btnLoading = false
                for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                  const item = this.dataFormTwo.data[i]
                  if (!item.planQuantity) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的主数量',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.deliveryDate) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的交货日期',
                      duration: 1500
                    })
                    break
                  }
                }
                return
              } else {
                this.btnLoading = true

                if (this.type === 'add') {
                  insertOutOrder(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '新建成功'
                      if (!this.dialogTitle) {
                        this.$message({
                          message: msg,
                          type: 'success',
                          duration: 1000,
                          onClose: () => {
                            this.btnLoading = false
                            this.datafilelist = []
                            this.dataFormTwo.data = []
                            this.dataForm = {
                              applicationReason: '',
                              approvalCompletionDate: '',
                              // approvalStatus: "",
                              documentStatus: '',
                              id: '',
                              orderNo: '',
                              reasonRejection: '',
                              submitDate: ''
                            }
                            this.workVisible = false
                          }
                        })
                        return
                      }
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                        }
                      })
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                } else {
                  editOutOrder(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '修改成功'
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                        }
                      })
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                }
              }
            }
          } else {
            this.btnLoading = false
          }
        })
      } else {
        this.btnLoading = false
      }
    },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    //  选择产品弹框传递的数据
    productsSubmit(data) {
      if (this.dataFormTwo.data.length) {
        this.dataFormTwo.data = this.dataFormTwo.data.filter((item) => {
          return !data.some((element) => element.productsId === item.productsId)
        })
      }

      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data]
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      if (obj) {
        if (obj.name === '审核人') {
          obj.nodeType = 1
          obj.nodeName = obj.name
          obj.directorLevel = obj.approvalType == 'manager' ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == 'multilevel' ? obj.levelSupervisor : ''
        }
        if (obj.name === '路由') {
          obj.nodeType = 4
        }
        if (obj.name === '抄送人') {
          obj.nodeType = 2
          obj.nodeName = obj.name
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode)
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map((item) => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(',') // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',')
                  var resultArr = []
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      }
                      resultArr.push(option)
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
                  optType:
                    item.dataType == 'number'
                      ? item.operationalFormula == 'lt'
                        ? '1'
                        : item.operationalFormula == 'gt'
                          ? '2'
                          : item.operationalFormula == 'eq'
                            ? '4'
                            : item.operationalFormula == 'ge'
                              ? '5'
                              : item.operationalFormula == 'le'
                                ? '3'
                                : ''
                      : ''
                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode)
            }
          }
        }
      }
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.scheduleRef.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.scheduleForm,
          exportType: '1104',
          exportName: '外协订单进度跟踪',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.scheduleForm.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },
    searchDetail() {
      Object.keys(this.scheduleForm).forEach((key) => {
        let item = this.scheduleForm[key]
        this.scheduleForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.scheduleForm.pageNum = 1
      this.initData()
    },
    initData() {
      this.formLoading = true
      this.scheduleForm.purchaseOrderId = this.dataForm.id


    },
    resetDetail() {
      this.$refs['scheduleRef'].$refs.JNPFTable.clearSort()
      this.scheduleForm = {
        createByName: '',
        endTime: '',
        endUpdateTime: '',
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        productCode: '',
        productDrawingNo: '',
        productName: '',
        purchaseOrderId: this.dataForm.id,
        startTime: '',
        startUpdateTime: ''
      }
      this.searchDetail()
    }
  }
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

::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
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

::v-deep .el-date-table .today span {
  font-weight: 700;
  color: #c0c4cc !important;
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

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

/* 进度跟踪样式 */
::v-deep #pane-schedule {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  /* padding: 0 20px; */
}

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

::v-deep .el-progress-bar {
  padding-right: 65px !important;
}

::v-deep .el-progress__text {
  margin-left: -7px !important;
}
</style>
