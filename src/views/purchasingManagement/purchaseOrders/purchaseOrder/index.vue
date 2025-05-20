<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.orderNo" placeholder="采购单号" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.cooperativePartnerCode" placeholder="供应商编码" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col> -->
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.cooperativePartnerName" placeholder="供应商名称" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-date-picker v-model="deliveryDateArr" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                  style="width: 100%" start-placeholder="交货开始日期" end-placeholder="交货结束日期" clearable></el-date-picker>
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
            <!-- <topOpts @add="addSupplier('', 'add')"></topOpts> -->
            <div>
              <el-button :loading="btnLoading" size="mini" type="success" @click="handleBatch()">批量完成</el-button>
                  <el-button type="primary" size="mini" v-has="'add_purchaseOrder'" icon="el-icon-plus" @click="addPurchase" >新建</el-button>
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('tableForm')">
                导出
              </el-button>
              <el-button :disabled="tableDataList.length <= 0" size="mini" type="primary"   icon="iconfont-menu  icon-chehui"
                @click="backFn">撤回</el-button>
            </div>

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
            custom-column :checkSelectable="checkSelectable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_606009">
            <el-table-column prop="orderNo" label="采购单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" sortable="custom" />
            <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" sortable="custom" />
            <el-table-column prop="deliveryDate" label="交货日期" width="110" sortable="custom" />
            <el-table-column prop="demandDate" label="需求日期" width="110" sortable="custom" v-if="isMS"/>
            <el-table-column prop="excludingTaxTotalAmount" label="总金额(不含税)" width="160" sortable="custom" />
            <el-table-column prop="taxAmount" label="税额" width="80" sortable="custom" />
            <el-table-column prop="totalAmount" label="总金额(含税)" width="140" sortable="custom" />
            <el-table-column prop="receivingStatus" label="订单状态" align="center" sortable="custom" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.receivingStatus == 'not_finished'">
                  <el-tag>未完成</el-tag>
                </div>
                <div v-if="scope.row.receivingStatus == 'finished'"><el-tag type="success">已完成</el-tag></div>
                <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center"
              v-if="showAppCodeFlag">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus !== 'draft'">审批中</el-tag>
                <el-tag type="success"
                  v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus !== 'draft'">
                  审批通过
                </el-tag>
                <el-tag type="danger"
                  v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus !== 'draft'">
                  审批拒绝
                </el-tag>
                <div v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                  <el-tag type="warning">审批撤回</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center">
              <template slot-scope="scope">
                <el-tag type="warning" v-if="scope.row.documentStatus === DocumentStatus.DRAFT">草稿</el-tag>
                <el-tag type="success" v-else-if="scope.row.documentStatus === DocumentStatus.SUBMIT">提交</el-tag>
                <el-tag type="danger" v-else-if="scope.row.documentStatus === DocumentStatus.BACK">撤回</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" min-width="140" label="备注" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" />

            <el-table-column label="操作" width="350" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  v-if="(scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn') && showAppCodeFlag"
                  @click.native="withdrawnAddHandle(scope.row.id, 'add')">
                  重新提交
                </el-button>
                <el-button size="mini" type="text" v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag"
                  @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                  审批撤回
                </el-button>
                <el-button size="mini" type="text" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                  查看详情
                </el-button>
                <el-button size="mini" type="text" @click.native="orderFormDownload(scope.row.id)">
                  下载订货单
                </el-button>
                <el-button size="mini" type="text" @click.native="printView(scope.row, 'p006')">
                  打印订货单
                </el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
            :limit.sync="listQuery.pageSize" @pagination="initData" />
        </div>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />

    <withdrawnForm v-if="withdrawnVisible" ref="withdrawnForm" @refresh="refresh" @close="closeForm" />
    <!-- <PrintForm ref="PrintForm" :value="printData" :dataValue="printForm" :pages="pages" /> -->
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
    <!-- 选择打印模版弹窗 -->
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" />
      <addForm v-if="addFormVisible" ref="addFormRef" @close="closeForm"></addForm>
  </div>
</template>

<script>
// import { purchaseOrderList } from '@/api/purchasingManagement/purchaseInquirySheet'
import {
  purchaseOrderList,
  detailpurchaseOrderList,
  purPurchaseOrderExport,
  purPurchaseOrderdetail,
  purPurchaseBatch,
  purPurchaseBatchLine, batchRevokeOrder,
} from '@/api/purchasingAndOutsourcingOrders/index';
import JNPFForm from './Form'
import moment from 'moment'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
// import withdrawnForm from './withranForm'
import withdrawnForm from '@/views/purchasingManagement/purchasingDemand/purchasingDemandPool/withranForm'
import PrintForm from './printForm'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getQueryConfirm } from '@/utils';
import { ApprovalStatus, DocumentStatus } from '@/views/esop/fileUpload/workinginstruction/utils/constant';
import addForm from './addForm.vue'
import tenantMinix from "@/mixins/generator/TenantMinix";
export default {
  name: 'purchaseOrder',
  components: { JNPFForm, withdrawnForm, PrintForm, ExportForm, SuperQuery, PrintBrowse, PrintDialog,addForm},
  mixins: [tenantMinix],
  data() {
    return {
      addFormVisible:false,
      printBrowseVisible: false,
      prindId: '',
      formId: '',
      exportFormVisible: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '采购单号',
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
          prop: 'demandDate',
          label: '需求日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        // {
        //   prop: 'taxAmount',
        //   label: '税额',
        //   type: 'input'
        // },

        {
          prop: 'receivingStatus',
          label: '订单状态',
          type: 'select',
          options: [
            { label: '未完成', value: 'not_finished' },
            { label: '已完成', value: 'finished' },
            { label: '已停止', value: 'stopped' }
          ]
        },
        {
          prop: 'approvalStatus',
          label: '审批状态',
          type: 'select',
          options: [
            { label: '审批中', value: 'ing' },
            { label: '审批通过', value: 'ok' },
            { label: '审批拒绝', value: 'rebut' },
            { label: '审批撤回', value: 'withdrawn' }
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
        classAttribute: 'other',
        orderType: 'procure', //	订单类型 采购 procure、外协 external
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        receivingStatus: ''
      },
      deliveryDateArr: [],
      total: 0,
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
      columnList: ['cooperativePartnerCode', 'excludingTaxTotalAmount', 'taxAmount', 'createByName'],
      showAppCodeFlag: true
    }
  },
  async created() {
    const res = await this.jnpf.getBusInfo('b009')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    this.initData()
  },
  computed: {
    DocumentStatus() {
      return DocumentStatus
    }
  },
  methods: {
    addPurchase(){
      this.addFormVisible=true
      this.$nextTick(()=>{
        this.$refs.addFormRef.init('','other','pool')
      })
    },
    async backFn() {
      if (this.selectData.length === 0) {
        this.$message.error('请选择要撤回的数据')
        return
      }
      await getQueryConfirm(this, '是否确认撤回')

     
      const res = await batchRevokeOrder(this.selectData.map(item => item.id))
      if (res.code === 200) {
        this.$message.success('撤回成功')
        this.initData()
      } else {
        this.$message.error(res.msg)
      }

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
        exportName: '订单列表',
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
      this.formVisible = false
      this.withdrawnVisible = false
      this.addFormVisible=false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.withdrawnVisible = false
      this.reset()
    },

    initData() {
      this.listLoading = true
      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.listQuery.deliveryStartDate = this.deliveryDateArr[0] 
        this.listQuery.deliveryEndDate = this.deliveryDateArr[1]
      } else {
        this.listQuery.deliveryStartDate = ''
        this.listQuery.deliveryEndDate = ''
      }
     
      purchaseOrderList(this.listQuery)
        .then((res) => {
          console.log(res, '采购订单列表')
          this.tableDataList = res.data.records

          this.total = res.data.total
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
        orderNo: '', //订单号
        orderType: 'procure', //	订单类型 采购 procure、外协 external
        classAttribute: 'other',
        receivingStatus: '', 
      }
      this.deliveryDateArr = []
      this.deliveryDate = []
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },

    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.procureForm.init(id, type)
      })
    },
    // 导出订货单
    orderFormDownload(id) {
      purPurchaseOrderExport(id).then((res) => {
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
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
        console.log(res.data.purchaseOrderLineVOList, 'asdada')
        row = {
          attachmentList: [],
          cooperativePartnerName: res.data.cooperativePartnerName, //供应商名称
          cooperativePartnerCode: res.data.cooperativePartnerCode, //供应商名称
          cooperativePartnerId: res.data.cooperativePartnerId, //供应商名称
          deliveryDate: res.data.deliveryDate, //交货日期.
          orderType: 'procure',
          purchaseOrderLines: res.data.purchaseOrderLineVOList,
          excludingTaxTotalAmount: res.data.excludingTaxTotalAmount, //订单 不含税总金额
          totalAmount: res.data.totalAmount, //   含税总金额
          taxAmount: res.data.taxAmount // 税额
        }

        this.withdrawnVisible = true
        this.$nextTick(() => {
          console.log(row, 'r')
          this.$refs.withdrawnForm.init(row, 'other', 'pool')
        })
      })
    },

    // 选择模版弹窗
    printView(row, enCode) {
      // if (!row.length) return this.$message.error("请选择您要打印的数据!")
      this.selectWarehouse = [row]
      this.enCode = enCode
      this.fullName = '仓库二维码'
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(enCode)
      })
    },
    printWarehouse(enCode) {
      if (!this.selectWarehouse.length) return this.$message.error("请选择您要打印的数据!")
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectWarehouse.map(item => item.id).join(',')
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    closePrint() {
      this.printVisible = false
    },

  }
}
</script>

<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->
