<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listsQuery.orderNo" placeholder="外协单号" clearable
                  @keyup.enter.native="searchDetail()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listsQuery.cooperativePartnerCode" placeholder="供应商编码" clearable
                  @keyup.enter.native="searchDetail()" />
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="isProductNameSwitch === '1'">
              <el-form-item>
                <el-input v-model.trim="listsQuery.productName" placeholder="请输入产品名称" clearable
                  @keyup.enter.native="searchDetail()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="searchDetail()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="resetDetail()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
            <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
              icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueriesDetail()">
              更多查询
            </el-button> -->
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <!-- <el-button :loading="btnLoading" size="mini" type="danger" @click="handleBatchStop()">批量停止</el-button> -->
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('detailTableData')">
                导出
              </el-button>
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
          <JNPF-table v-if="tableFlag" @selection-change="handeleFinshData" highlight-current-row :fixedNO="true"
            ref="detailTableData" :data="detailTableData" @sort-change="sortChangeDetail" custom-column
            :checkSelectable="checkSelectable" :partentOrChild="'child'" :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.purchaseOrderId, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" sortable="custom" />
            <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" width="120"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="productName" label="产品名称" width="120"
              v-if="isProductNameSwitch === '1'"></el-table-column>
            <el-table-column prop="drawingNo" label="品名规格" min-width="200" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" min-width="140" sortable="custom" />

            <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
              :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
            <el-table-column prop="purchaseQuantity" :label="isDeputyUnitSwitch === '1' ? '数量(主)' : '数量'"
              :width="isDeputyUnitSwitch === '1' ? 100 : 80" />
            <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
            <el-table-column prop="purchaseQuantity2" label="数量(副)" width="100" v-if="isDeputyUnitSwitch === '1'" />
            <el-table-column prop="receiptQuantity" label="已入库数量" min-width="130" sortable="custom" />
            <el-table-column prop="price" label="单价(含税)" min-width="140" sortable="custom" />
            <el-table-column prop="taxRate" label="税率" width="80" sortable="custom">
              <template slot-scope="scope">
                {{ scope.row.taxRate }}%
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="总金额(含税)" min-width="140" sortable="custom" />
            <el-table-column prop="excludingTaxPrice" label="单价(不含税)" min-width="160" sortable="custom" />
            <el-table-column prop="taxAmount" label="税额" min-width="80" />
            <el-table-column prop="excludingTaxAmount" label="总金额(不含税)" width="160" sortable="custom" />
            <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom" />
            <el-table-column prop="receivingStatus" label="收货状态" align="center" sortable="custom" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.receivingStatus == 'receiving' || scope.row.receivingStatus == 'returning'">
                  <el-tag>未完成</el-tag>
                </div>
                <div v-if="scope.row.receivingStatus == 'received' || scope.row.receivingStatus == 'returned'">
                  <el-tag type="success">已完成</el-tag>
                </div>
                <div v-if="scope.row.approvalStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" width="120" sortable="custom" />
            <el-table-column label="操作" width="90" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click.native="addOrUpdateHandle(scope.row.purchaseOrderId, 'look')">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listsQuery.pageNum" :background="background"
            :limit.sync="listsQuery.pageSize" @pagination="detailData" />
        </div>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />

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
  purchaseOrderReport,
  detailpurchaseOrderList,
  purPurchaseOrderExport,
  purPurchaseOrderdetail,
  purPurchaseBatch,
  purPurchaseBatchLine
} from '@/api/purchasingAndOutsourcingOrders/index'
import JNPFForm from '../orderList/Form.vue'
import moment from 'moment'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
// import withdrawnForm from './withranForm'

import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getBimBusinessDetail } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  name: 'purchaseOrder',
  components: { JNPFForm, ExportForm, SuperQuery },
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '单号',
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
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'processName',
          label: '工序名称',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'purchaseQuantity',
          label: '数量',
          type: 'input'
        },
        {
          prop: 'receiptQuantity',
          label: '已入库数量',
          type: 'input'
        },
        {
          prop: 'price',
          label: '单价(含税)',
          type: 'input'
        },
        {
          prop: 'taxRate',
          label: '税率(%)',
          type: 'input'
        },
        {
          prop: 'totalAmount',
          label: '总金额(含税)',
          type: 'input'
        },

        {
          prop: 'excludingTaxPrice',
          label: '单价(不含税)',
          type: 'input'
        },
        {
          prop: 'taxAmount',
          label: '税额',
          type: 'input'
        },
        {
          prop: 'excludingTaxAmount',
          label: '总金额(不含税)',
          type: 'input'
        },
        {
          prop: 'deliveryDate',
          label: '交货日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'receivingStatus',
          label: '收货状态',
          type: 'select',
          options: [
            { label: '审批中', value: 'receiving' },
            { label: '已完成', value: 'received' },
            { label: '已停止', value: 'stopped' }
          ]
        },

        {
          prop: 'standardValue',
          label: '规值',
          type: 'input'
        },

        {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'select',
          options: []
        },
        {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'select',
          options: []
        },
        {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: []
        },

        {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: []
        },
        {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: []
        },
        {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: []
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: []
        },

        {
          prop: 'processName',
          label: '工序',
          type: 'select',
          options: []
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
      exportFormVisible: false,
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
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        receivingStatus: 'receiving'
      },
      // 明细参数
      listsQuery: {
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        createByName: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        endTime: '',
        orderNo: '',
        orderType: 'external',
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        productCode: '',
        productName: '',
        receivingStatus: 'receiving'
      },
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
      columnList: [
        'cooperativePartnerCode',
        'productCode',
        'excludingTaxPrice',
        'taxAmount',
        'excludingTaxAmount',
        'standardValue',
        'sealingCoverTyping',
        'accuracyLevel',
        'vibrationLevel',
        'oil',
        'oilQuantity',
        'clearance',
        'packagingMethod',
        'processName'
        // 'createByName'
      ]
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  async created() {
    await this.getDeputyUnit()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isDeputyUnitSwitch === '1') {
      this.superQueryJson.forEach(item => {
        if (item.prop === 'mainUnit') {
          item.label = '单位(主)'
        }
      })
      this.superQueryJson.splice(7, 0, {
        prop: 'deputyUnit',
        label: '单位(副)',
        type: 'input'
      })

    }
    if (this.isProductNameSwitch === '1') {
      this.superQueryJson.splice(3, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.initData()
    this.detailData()
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `outDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa007',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj1).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverTyping')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa006',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj2).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'accuracyLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa005',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj3).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'vibrationLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa002',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj4).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oil')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa003',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj5).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oilQuantity')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa001',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj6).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'clearance')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa015',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj7).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'packagingMethod')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log('税率', this.taxRateList)
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

    columnSetFun() {
      this.$refs.detailTableData.showDrawer()
    },

    sortChangeDetail({ prop, order }) {
      let newProp
      if (
        prop === 'processName' ||
        prop === 'productCode' ||
        prop === 'productDrawingNo' ||
        prop === 'cooperativePartnerCode' ||
        prop == 'cooperativePartnerName'
      ) {
        newProp = prop
      } else if (prop === 'createByName') {
        newProp = 'create_by'
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listsQuery.orderItems[0].asc = order !== 'descending'
      this.listsQuery.orderItems[0].column = order === null ? '' : newProp
      this.detailData()
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
          this.tableFlag = true

          this.tableDataList.forEach((item) => {
            item.disabled = item.receivingStatus == 'receiving' && item.approvalStatus == 'ok' ? false : true
          })
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },

    detailData() {
      this.listLoading = true
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listsQuery.startTime = this.createRequirementDate[0] + ' 00:00:00'
        this.listsQuery.endTime = this.createRequirementDate[1] + ' 23:59:59'
      } else {
        this.listsQuery.startTime = ''
        this.listsQuery.endTime = ''
      }
      if (this.deliveryDate && this.deliveryDate.length > 0) {
        this.listsQuery.deliveryStartTime = this.deliveryDate[0] + ' 00:00:00'
        this.listsQuery.deliveryEndTime = this.deliveryDate[1] + ' 23:59:59'
      } else {
        this.listsQuery.deliveryStartTime = ''
        this.listsQuery.deliveryEndTime = ''
      }
      detailpurchaseOrderList(this.listsQuery)
        .then((res) => {
          console.log(res, '明细列表')
          this.detailTableData = res.data.records
          console.log(this.detailTableData)
          this.detailTableData.forEach((item) => {
            item.disabled = item.receivingStatus == 'receiving' && item.approvalStatus == 'ok' ? false : true
          })
          this.total = res.data.total
          this.listLoading = false
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
    // 搜索明细
    searchDetail() {
      Object.keys(this.listsQuery).forEach((key) => {
        let item = this.listsQuery[key]
        this.listsQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listsQuery.pageNum = 1
      this.detailData()
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
        orderType: 'procure', //	订单类型 采购 procure、外协 external
        startTime: ''
      }
      this.createRequirementDate = []
      this.deliveryDate = []
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },
    // 重置明细
    resetDetail() {
      this.$refs['detailTableData'].$refs.JNPFTable.clearSort()
      this.listsQuery = {
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        createByName: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        endTime: '',
        orderNo: '',
        orderType: 'procure',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        productCode: '',
        productName: ''
      }
      this.createRequirementDate = []
      this.deliveryDate = []
      this.searchDetail()
    },
    // addSupplier(id, type) {
    //   this.formVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.JNPFForm.init(id, type)
    //   })
    // },
    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.procureForm.init(id, type)
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
      const targetListQuery = this.listsQuery
      let _data = {
        ...targetListQuery,
        exportType: '1003',
        exportName: '外协订单明细',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then((res) => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
  }
}
</script>

<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->
