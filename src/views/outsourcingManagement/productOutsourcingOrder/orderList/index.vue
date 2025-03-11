<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.orderNo" placeholder="外协单号" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.cooperativePartnerCode" placeholder="供应商编码" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.cooperativePartnerName" placeholder="供应商名称" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
            <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button> -->
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier('', 'add')">
              <el-button :loading="btnLoading" size="mini" type="success" @click="handleBatch()">批量完成</el-button>
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('tableForm')">
                导出
              </el-button>
              <el-button :disabled="tableDataList.length <= 0" size="mini" type="primary" icon="iconfont  icon-chehui1"
                @click="backFn">撤回</el-button>
            </topOpts>

            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
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
          <JNPF-table @selection-change="handeleFinshData" hasC v-if="flag" v-loading="listLoading"
            highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange"
            custom-column :checkSelectable="checkSelectable" :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="外协单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" sortable="custom" />
            <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" sortable="custom" />

            <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom" />
            <el-table-column prop="excludingTaxTotalAmount" label="总金额(不含税)" width="180" sortable="custom" />
            <el-table-column prop="taxAmount" label="税额" width="120" sortable="custom" />
            <el-table-column prop="totalAmount" label="总金额(含税)" width="140" sortable="custom" />
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center">
              <template slot-scope="scope">
                <el-tag type="warning" v-if="scope.row.documentStatus === DocumentStatus.DRAFT">草稿</el-tag>
                <el-tag type="success" v-else-if="scope.row.documentStatus === DocumentStatus.SUBMIT">提交</el-tag>
                <el-tag type="danger" v-else-if="scope.row.documentStatus === DocumentStatus.BACK">撤回</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="receivingStatus" label="订单状态" align="center" sortable="custom" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.receivingStatus == 'not_finished'">
                  <el-tag>未完成</el-tag>
                </div>
                <div v-if="scope.row.receivingStatus == 'finished'"><el-tag type="success">已完成</el-tag></div>
                <div v-if="scope.row.approvalStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" min-width="140" label="备注" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)"
                  :editDisabled="scope.row.documentStatus === DocumentStatus.SUBMIT"
                  :delDisabled="scope.row.documentStatus === DocumentStatus.SUBMIT">
                  <el-button size="mini" type="text" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                    查看详情
                  </el-button>
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
            :limit.sync="listQuery.pageSize" @pagination="initData"></pagination>
        </div>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />
    <CreateForm v-if="createFormVisible" ref="createForm" @refresh="refresh" @close="closeForm" />
    <withdrawnForm v-if="withdrawnVisible" ref="withdrawnForm" @refresh="refresh" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
// import { purchaseOrderList } from '@/api/purchasingManagement/purchaseInquirySheet'
import {
  purchaseOrderList,
  purPurchaseOrderdetail,
  purPurchaseBatch,
  purPurchaseBatchLine,
  deletePurPurchaseOrder, batchRevokeOrder,
} from '@/api/purchasingAndOutsourcingOrders/index';
import JNPFForm from './Form'
import moment from 'moment'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
// import withdrawnForm from './withranForm'
import withdrawnForm from '@/views/purchasingManagement/purchasingDemand/purchasingDemandPool/Form.vue'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { CreateForm } from '../orderCreation/index.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { ApprovalStatus, DocumentStatus } from '@/views/esop/fileUpload/workinginstruction/utils/constant';
import { getQueryConfirm } from '@/utils';
export default {
  name: 'orderList',
  computed: {
    DocumentStatus() {
      return DocumentStatus
    }
  },
  components: { JNPFForm, withdrawnForm, ExportForm, SuperQuery, CreateForm },
  data() {
    return {
      exportFormVisible: false,
      createFormVisible: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '外协单号',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: '供应商编码',
          type: 'input'
        },

        {
          prop: 'cooperativePartnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'deliveryDate',
          label: '交货日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'excludingTaxTotalAmount',
          label: '总金额(不含税)',
          type: 'input'
        },
        {
          prop: 'taxAmount',
          label: '税额',
          type: 'input'
        },
        {
          prop: 'totalAmount',
          label: '总金额(含税)',
          type: 'input'
        },
        {
          prop: 'receivingStatus',
          label: '订单状态',
          type: 'select',
          options: [
            { label: '已完成', value: 'finished' },
            { label: '已停止', value: 'stopped' }
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ],
      printVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      visible: false,
      btnLoading: false,
      detailVisible: false,
      withdrawnVisible: false,
      tableDataList: [],
      detailTableData: [],
      flag: true,
      activeName: 'orderList',
      formVisible: false,
      listLoading: false,
      statusList: [
        {
          label: '审批中',
          value: 'ing'
        },
        {
          label: '审批通过',
          value: 'ok'
        },
        {
          label: '审批拒绝',
          value: 'rebut'
        },
        { label: '审批撤回', value: 'withdrawn' }
      ],
      listQuery: {
        approvalStatus: '', //审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: '', //供应商编码
        cooperativePartnerName: '', // 	供应商名称
        createByName: '',
        delivery: '', //发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        deliveryEndDate: '', //交货结束日期
        deliveryStartDate: '',
        deliveryDate: '',
        endTime: '',
        orderNo: '', //订单号
        orderType: 'external', //	订单类型 采购 procure、外协 external
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        receivingStatus: 'receiving'
      },

      total: 0,
      computedValue: 0,
      computedValue2: 0,
      formVisible: false,
      createRequirementDate: [],
      deliveryDate: [],
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now()
        // },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上个月',
            onClick(picker) {
              const end = new Date(moment(new Date().getTime()).format('YYYY-MM-01 00:00:00'))
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      selectData: [],
      pages: 0, // 总页数
      printData: [], // 表格数据
      printForm: {}, // 表单数据
      //	收货状态 待收货 receiving、已收货 received,可用值:received,receiving,returned,returning
      receiptReturnType: [{ label: '未完成', value: 'receiving' }, { label: '已完成', value: 'received' }],
      columnList: ['cooperativePartnerCode', 'excludingTaxTotalAmount', 'taxAmount', 'receivingStatus', 'createByName']
    }
  },
  created() {
    this.initData()
  },

  methods: {
    async backFn() {
      await getQueryConfirm(this, '是否确认撤回')
      const arr = this.$refs.tableForm.getCurrentSelection()
      if (arr.length === 0) {
        this.$message.error('请选择要撤回的数据')
        return
      }
      console.log(arr);
      const res = await batchRevokeOrder(arr.map(item => item.id))
      if (res.code === 200) {
        this.$message.success('撤回成功')
        this.initData()
      } else {
        this.$message.error(res.msg)
      }

    },
    // 获取合计数据
    getOrderLineReportFun() {
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.totalAmount * 1
      })
      this.computedValue = this.jnpf.numberFormat(count)
      let count2 = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.purchaseQuantity * 1
      })
      this.computedValue = this.jnpf.numberFormat(count2)
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i]
      }
      const targetListQuery = this.listQuery
      let _data = {
        ...targetListQuery,
        exportType: '1002',
        exportName: '外协订单列表',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then((res) => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    checkSelectable(row) {
      return row.receivingStatus == 'not_finished'
        && row.documentStatus === DocumentStatus.SUBMIT
        && row.approvalStatus !== ApprovalStatus.ING
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleFinshData(val) {
      this.selectData = val
    },
    // 批量完成
    handleBatch() {
      console.log(this.selectData, '选择的数据')
      if (!this.selectData.length) {
        this.$message.error('请先选择您要完成的数据')
      } else {
        this.btnLoading = true
        this.$confirm('手动完成后，将不能再继续生成通知单，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let data = this.selectData.map((item) => item.id)
            purPurchaseBatch(data)
              .then((res) => {
                console.log(res, '1111')
                if (res.msg == 'Success') {
                  this.$message({
                    message: '完成成功',
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.btnLoading = false
                      this.initData()
                    }
                  })
                }
              })
              .catch(() => {
                this.btnLoading = false
              })
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    },
    // 明细列表 批量停止
    handleBatchStop() {
      console.log(this.selectData, '选择的数据')
      if (!this.selectData.length) {
        this.$message.error('请先选择您要停止的数据')
      } else {
        this.btnLoading = true
        this.$confirm('手动停止后，将不能再继续生成通知单，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let data = this.selectData.map((item) => item.id)
            purPurchaseBatchLine(data)
              .then((res) => {
                console.log(res, '1111')
                if (res.msg == 'Success') {
                  this.$message({
                    message: '停止成功',
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.btnLoading = false
                      this.detailData()
                    }
                  })
                }
              })
              .catch(() => {
                this.btnLoading = false
              })
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    },
    // 点击切换明细
    handleClick(e) {
      console.log(e)
      if (e.index == '0') {
        this.initData()
      } else {
        this.detailData()
      }
      this.selectData = []
    },
    moreQueries() {
      this.visible = true
    },
    moreQueriesDetail() {
      this.detailVisible = true
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      if (newProp === 'cooperative_partner_code') {
        newProp = 'cooperativePartnerCode'
      }
      if (newProp === 'cooperative_partner_name') {
        newProp = 'cooperativePartnerName'
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      console.log(isRefresh, 'is')
      this.formVisible = false
      this.withdrawnVisible = false
      this.createFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.withdrawnVisible = false
      this.createFormVisible = false
      this.reset()
    },

    initData() {
      this.listLoading = true
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listQuery.startTime = this.createRequirementDate[0] + ' 00:00:00'
        this.listQuery.endTime = this.createRequirementDate[1] + ' 23:59:59'
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      if (this.deliveryDate && this.deliveryDate.length > 0) {
        this.listQuery.deliveryStartDate = this.deliveryDate[0]
        this.listQuery.deliveryEndDate = this.deliveryDate[1]
      } else {
        this.listQuery.deliveryStartDate = ''
        this.listQuery.deliveryEndDate = ''
      }
      purchaseOrderList(this.listQuery)
        .then((res) => {
          console.log(res, '外协订单列表')
          this.tableDataList = res.data.records

          this.total = res.data.total
          this.getOrderLineReportFun()
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },

    search() {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },

    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        approvalStatus: '', //审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: '', //供应商编码
        cooperativePartnerName: '', // 	供应商名称
        createByName: '',
        delivery: '', //发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        deliveryEndDate: '', //交货结束日期
        deliveryStartDate: '',
        deliveryDate: '',
        endTime: '',
        orderNo: '', //订单号
        orderType: 'external', //	订单类型 采购 procure、外协 external
        startTime: ''
      }
      this.createRequirementDate = []
      this.deliveryDate = []
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },

    addSupplier(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.procureForm.init(id, type)
      })
    },
    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.procureForm.init(id, type)
      })
    },
    handleDel(id) {
      this.$confirm('此操作将删除该数据，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deletePurPurchaseOrder(id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500,
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => { })
    },

    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          withdrawn(_data).then((res) => {
            this.$message({
              type: 'success',
              message: '撤回成功',
              duration: 1500,
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => { })
    },
    // 重新生成外协订单 将选中的数据传递过去
    withdrawnAddHandle(id, type) {
      let row = {}
      purPurchaseOrderdetail(id).then((res) => {
        console.log(res, 'asdada')
        row = {
          attachmentList: [],
          cooperativePartnerName: res.data.cooperativePartnerName, //供应商名称
          cooperativePartnerCode: res.data.cooperativePartnerCode, //供应商名称
          cooperativePartnerId: res.data.cooperativePartnerId, //供应商名称
          deliveryDate: res.data.deliveryDate, //交货日期.
          orderType: 'external',
          purchaseOrderLines: res.data.purchaseOrderLineVOList.map((item) => {
            return {
              ...item,
              orderQuantity:
                item.planDemandQuantity -
                (item.procurementDemandPoolVO ? item.procurementDemandPoolVO.orderedQuantity : 0),
              id: ''
            }
          }),
          excludingTaxTotalAmount: res.data.excludingTaxTotalAmount, //订单 不含税总金额
          totalAmount: res.data.totalAmount, //   含税总金额
          taxAmount: res.data.taxAmount // 税额
        }
        this.withdrawnVisible = true
        this.$nextTick(() => {
          this.$refs.withdrawnForm.init(row)
        })
      })
    },

    // 处理分页
    printPageDataFn(data, pageSize = 20) {
      const printTable = []
      if (data && data.length > 0) {
        let remainderLength = Math.floor(data.length / pageSize) * pageSize
        let pagedata = []
        let pageNum = 0
        for (let i = 0; i < data.length; i++) {
          if (pageNum < pageSize) {
            pagedata.push(data[i])
          }
          pageNum++
          if (pageNum === pageSize || (i > remainderLength && i === data.length - 1)) {
            printTable.push({
              total: pagedata.reduce((accumulator, currentValue) => accumulator + currentValue.totalAmount * 1, 0),
              UpperMoney: this.digitUppercase(
                pagedata.reduce((accumulator, currentValue) => accumulator + currentValue.totalAmount * 1, 0).toFixed(2)
              ),
              pagedata: pagedata
            })
            pagedata = []
            pageNum = 0
          }
        }
        if (pageSize > data.length && pagedata && pagedata.length > 0) {
          printTable.push({
            total: pagedata.reduce((accumulator, currentValue) => accumulator + currentValue.totalAmount, 0),
            UpperMoney: this.digitUppercase(
              pagedata.reduce((accumulator, currentValue) => accumulator + currentValue.totalAmount * 1, 0).toFixed(2)
            ),
            pagedata: pagedata
          })
        }
      }
      return printTable
    },
    // 处理金额
    digitUppercase(n) {
      var fraction = ['角', '分']
      var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
      var head = n < 0 ? '欠' : ''
      n = Math.abs(n)
      var s = ''
      for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
      }
      s = s || '整'
      n = Math.floor(n)
      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = ''
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p
          n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, '元')
          .replace(/(零.)+/g, '零')
          .replace(/^整$/, '零元整')
      )
    }
  }
}
</script>

<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->
