<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="detailTableData" />
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <!-- <el-button :loading="btnLoading" size="mini" type="danger" @click="handleBatchStop()">批量停止</el-button> -->
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('detailTableData')">
                导出
              </el-button>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.detailTableData.showSortDrawer()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table @selection-change="handeleFinshData" highlight-current-row :fixedNO="true"
            ref="detailTableData" :data="detailTableData" custom-column
            :checkSelectable="checkSelectable" :partentOrChild="'child'" :setColumnDisplayList="columnList" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
            <el-table-column prop="orderNo" label="单号" min-width="200">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.purchaseOrderId, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" />
            <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" />
            <el-table-column prop="productCode" label="产品编码" min-width="140" />
            <el-table-column prop="productName" label="产品名称" min-width="180"></el-table-column>
            <el-table-column prop="drawingNo" label="品名规格" min-width="160"/>
            <el-table-column prop="productCategoryName" label="产品分类" width="160"/>
            <el-table-column prop="processName" label="工序" width="100"/>
            <el-table-column prop="mainUnit" label="单位" min-width="90"/>
            <el-table-column prop="purchaseQuantity" label="数量" min-width="100" />
            <el-table-column prop="receiptQuantity" label="已入库数量" width="130">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewReceiptFun(scope.row, 'inventoryFlag', scope.row.warehouseId, projectId)">
                  {{ scope.row.receiptQuantity }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价(含税)" width="140" />
            <el-table-column prop="taxRate" label="税率" width="80">
              <template slot-scope="scope">
                {{ scope.row.taxRate }}%
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="总金额(含税)" width="140" />
            <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="140" />
            <el-table-column prop="taxAmount" label="税额" min-width="80" />
            <el-table-column prop="excludingTaxAmount" label="总金额(不含税)" width="160" />
            <el-table-column prop="deliveryDate" label="交货日期" width="140" />
            <el-table-column prop="demandDate" label="需求日期" width="110" />
            <el-table-column prop="receivingStatus" label="订单状态" align="center" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.receivingStatus == 'not_finished' || scope.row.receivingStatus == 'returning'">
                  <el-tag>未完成</el-tag>
                </div>
                <div v-if="scope.row.receivingStatus == 'finished' || scope.row.receivingStatus == 'returned'">
                  <el-tag type="success">已完成</el-tag>
                </div>
                <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="documentStatus" label="单据状态" width="120" align="center">
              <template slot-scope="scope">
                <el-tag type="warning" v-if="scope.row.documentStatus === DocumentStatus.DRAFT">草稿</el-tag>
                <el-tag type="success" v-else-if="scope.row.documentStatus === DocumentStatus.SUBMIT">提交</el-tag>
                <el-tag type="danger" v-else-if="scope.row.documentStatus === DocumentStatus.BACK">撤回</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" />
            <el-table-column prop="createByName" label="创建人" width="100" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click.native="editPriceFun(scope.row)">修改单价</el-button>

                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.purchaseOrderId, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="orderFormDownload(scope.row.purchaseOrderId)">
                      下载订货单
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="printView(scope.row, 'p006')">
                      打印订货单
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
            :limit.sync="listQuery.pageSize" @pagination="initData()" />
        </div>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />
    <withdrawnForm v-if="withdrawnVisible" ref="withdrawnForm" @refresh="refresh" @close="closeForm" />
    <PrintForm ref="PrintForm" :value="printData" :dataValue="printForm" :pages="pages" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->

    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
    <!-- 选择打印模版弹窗 -->
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" />
    <Form v-if="receiptFormVisible" ref="Form" @refreshDataList="initData()" />
     <el-dialog title="修改单价" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="editPriceVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="form" :rules="dataRule" label-width="120px" label-position="left">
          <el-col :span="24">
            <el-form-item label="采购单号" prop="orderNo">
              <el-input v-model="form.orderNo" placeholder="采购单号" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="含税单价" prop="price">
              <el-input v-model="form.price" placeholder="含税单价"  @blur="handleCountFun()"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="税率" prop="taxRates">
              <el-select v-model="form.taxRates" placeholder="请选择" style="width: 100%;"  @change="changeRate">
                              <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                                :value="item.taxRate"></el-option>
                            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="不含税单价" prop="excludingTaxPrice">
              <el-input v-model="form.excludingTaxPrice" placeholder="不含税单价" disabled />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editPriceVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitFun()">
          提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  detailpurchaseOrderList,
  purPurchaseOrderExport,
  purPurchaseOrderdetail,
  purPurchaseBatch,
  purPurchaseBatchLine,
  editPrice
} from '@/api/purchasingAndOutsourcingOrders/index'
import JNPFForm from '../purchaseOrder/Form.vue'
import moment from 'moment'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import Form from './Form.vue'
import withdrawnForm from '@/views/purchasingManagement/purchasingDemand/purchasingDemandPool/Form.vue'
import PrintForm from './printForm'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {  getbimProductAttributes, getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import PrintBrowse from '@/components/PrintBrowse'
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintDialog from '@/components/no_mount/printDialog'
import { getBimBusinessDetail, getOrderFiledMap } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import {  DocumentStatus } from '@/views/esop/fileUpload/workinginstruction/utils/constant';
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";

export default {
  name: 'purchaseOrder',
  components: { JNPFForm,Form, withdrawnForm, PrintForm, ExportForm, SuperQuery, PrintBrowse, PrintDialog },
  mixins: [getProjectList,AbProjectMixin],

  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            { prop: 'orderNo', symbol: 'like', fixed: true },
            { prop: 'cooperativePartnerName', symbol: 'like', fixed: true },
            {
              prop: 'deliveryDate', // 属性*
              symbol: 'between', // 比较符*
              timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
              fixed: true // 是否在搜索栏显示
            },
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      dataRule: {
        price: [
          {
            validator: this.formValidate({
              type: 'noEmtry', params: ["含税单价：不能为空", (errMsg) => {
                this.$message.error(`${ errMsg }`)
              }]
            }), trigger: 'blur'
          },
          {
            validator: this.formValidate({
              type: 'decimal', params: [20, 4, '', (errMsg, index) => {
                this.$message.error(`单价：` + errMsg)
              }]
            }), trigger: 'blur'
          },
          {required: true, trigger: 'blur'},
        ]
      },
      taxRateList: [],
      form: {
        orderNo: "",
        price: "",
        taxRates: "",
        excludingTaxPrice: "",
      },
      editPriceVisible: false,
      printBrowseVisible: false,
      prindId: '',
      formId: '',
      superQueryJson: [{
        prop: 'receivingStatus',
        label: '订单状态',
        type: 'select',
        options: [{
          label: '未完成',
          value: 'not_finished'
        }, {
          label: '已完成',
          value: 'finished'
        }, {
          label: '已停止',
          value: 'stopped'
        }]
      }],
      printVisible: false,
      exportFormVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      btnLoading: false,
      withdrawnVisible: false,
      detailTableData: [],
      formVisible: false,
      receiptFormVisible: false,
      listLoading: false,
      // 明细参数
      listQuery: {
        classAttribute: 'other',
        orderType: 'procure',
      },
      total: 0,
      pickerOptions: {
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
      receiptReturnType: [{label: '未完成', value: 'receiving'}, {label: '已完成', value: 'received'}],
      columnList: [
        'cooperativePartnerCode',
        'productCode',
        'excludingTaxPrice',
        'taxAmount',
        'excludingTaxAmount',
        'sealingCoverTyping',
        'accuracyLevel',
        'vibrationLevel',
        'oil',
        'oilQuantity',
        'clearance',
        'packagingMethod',
      ],
      bimProductAttributesList: {}
    }
  },
  computed: {
    DocumentStatus() {
      return DocumentStatus
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  async created() {},
  methods: {
    editPriceFun(row){
      this.editPriceVisible=true
      this.form=row
    },
    changeRate(){
      this.form.taxrate=this.form.taxRates
      let taxrate = 1 * 1 + (this.form.taxRates) / 100 * 1
      console.log("this.",this.form);
      this.form.excludingTaxPrice=this.jnpf.numberFormat(this.jnpf.math('divide', [this.form.price, taxrate]), 6)
    },
    handleCountFun(){
      let taxrate = 1 * 1 + (this.form.taxRates) / 100 * 1
      this.form.excludingTaxPrice=this.jnpf.numberFormat(this.jnpf.math('divide', [this.form.price, taxrate]), 6)
    },
     submitFun() {
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let  arr=[]
          arr.push(this.form)
          editPrice(arr).then(res => {
            this.editPriceVisible = false
            this.btnLoading = false
            this.$message.success("修改单价成功")
            this.search('basic')
          }).catch(error => {
            this.btnLoading = false
          })
        }
      })
    },
     // 查看已入库数量
     viewReceiptFun(row, type, warehouseId, projectId) {
      this.receiptFormVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(row, type, warehouseId, projectId)
      })
    },

    // 获取
   async getProductClassFun() {
      // 产品属性
    const res = await getbimProductAttributesListMap()
    this.bimProductAttributesList = res.data
      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    checkSelectable(row) {
      return !row.disabled
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
    // 点击切换明细
    handleClick(e) {
      if (e.index == '0') {
        this.initData()
      } else {
        this.initData()
      }
      this.selectData = []
    },
    columnSetFun() {
      this.$refs.detailTableData.showDrawer()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.withdrawnVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.withdrawnVisible = false
      this.initData()
    },

    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      this.listLoading = true
      detailpurchaseOrderList(this.listQuery)
        .then((res) => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.detailTableData = res.data.records
          this.detailTableData.forEach((item) => {
            this.$set(item,'taxRates',item.taxRate* 1)
            item.disabled = item.receivingStatus == 'not_finished' && item.approvalStatus == 'ok' ? false : true
          })
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.listLoading = false
        })
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
        row = {
          attachmentList: [],
          cooperativePartnerName: res.data.cooperativePartnerName, //供应商名称
          cooperativePartnerCode: res.data.cooperativePartnerCode, //供应商名称
          cooperativePartnerId: res.data.cooperativePartnerId, //供应商名称
          deliveryDate: res.data.deliveryDate, //交货日期.
          orderType: 'procure',
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
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter((item) => !!item.label && !!item.prop&&item.prop!='documentStatus')
      console.log("columnList",columnList);
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
        exportType: '1003',
        exportName: '订单明细',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then((res) => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    // 选择模版弹窗
    printView(row, enCode) {
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
          this.formId = this.selectWarehouse.map(item => item.purchaseOrderId).join(',')
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
