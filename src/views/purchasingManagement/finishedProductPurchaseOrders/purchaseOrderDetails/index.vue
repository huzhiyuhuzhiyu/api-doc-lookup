<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listsQuery.orderNo" placeholder="请输入采购单号" clearable
                  @keyup.enter.native="searchDetail()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listsQuery.cooperativePartnerCode" placeholder="请输入供应商编码" clearable
                  @keyup.enter.native="searchDetail()" />
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="isProductNameSwitch === '1'">
              <el-form-item>
                <el-input v-model.trim="listsQuery.productName" placeholder="产品名称" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="deliveryDateArr" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                  style="width: 100%" start-placeholder="交货开始日期" end-placeholder="交货结束日期" clearable></el-date-picker>
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
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="detailData()" />
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
            <el-table-column prop="productCode" label="产品编码" width="120" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="drawingNo" label="品名规格" min-width="200" sortable="custom" />
            <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
              :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
            <el-table-column prop="purchaseQuantity" :label="isDeputyUnitSwitch === '1' ? '数量(主)' : '数量'"
              :width="isDeputyUnitSwitch === '1' ? 100 : 80" />
            <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
            <el-table-column prop="purchaseQuantity2" label="数量(副)" width="100" v-if="isDeputyUnitSwitch === '1'" />
            <el-table-column prop="receiptQuantity" label="已入库数量" width="130" sortable="custom" />
            <el-table-column prop="price" label="单价(含税)" width="140" sortable="custom" />
            <el-table-column prop="taxRate" label="税率" width="80" sortable="custom">
              <template slot-scope="scope">
                {{ scope.row.taxRate }}%
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="总金额(含税)" width="140" sortable="custom" />
            <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="150" sortable="custom" />
            <el-table-column prop="taxAmount" label="税额" width="80" />
            <el-table-column prop="excludingTaxAmount" label="总金额(不含税)" width="160" sortable="custom" />
            <el-table-column prop="deliveryDate" label="交货日期" width="140" sortable="custom" />
            <el-table-column prop="receivingStatus" label="订单状态" align="center" sortable="custom" width="120">
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
            <el-table-column prop="standardValue" label="规值" width="100" sortable="custom"
              v-if="standardValueFlag === '1'" />
            <el-table-column prop="colour" label="颜色" width="100" sortable="custom" v-if="colourFlag === '1'" />

            <el-table-column prop="sealingCoverTyping" width="120" label="打字内容" sortable="custom"
              v-if="sealingCoverTypingFlag === '1'" />
            <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"
              v-if="accuracyLevelFlag === '1'" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
              v-if="vibrationLevelFlag === '1'" />
            <el-table-column prop="oil" label="油脂" width="80" sortable="custom" v-if="oilFlag === '1'" />
            <el-table-column prop="oilQuantity" label="油脂量" width="100" sortable="custom"
              v-if="oilQuantityFlag === '1'" />
            <el-table-column prop="clearance" label="游隙" width="80" sortable="custom" v-if="clearanceFlag === '1'" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
              v-if="packagingMethodFlag === '1'" />
            <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
              v-if="specialRequireFlag === '1'" />
            <el-table-column prop="processName" label="工序" width="100" sortable="custom" v-if="processFlag === '1'" />
            <el-table-column prop="remark" label="备注" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" width="100" sortable="custom" />
            <el-table-column label="操作" width="90" fixed="right">
              <template slot-scope="scope">
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
          <pagination :total="total" :page.sync="listsQuery.pageNum" :background="background"
            :limit.sync="listsQuery.pageSize" @pagination="detailData" />
        </div>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="采购单号">
              <el-input v-model.trim="listQuery.orderNo" placeholder="请输入采购单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model.trim="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商编码">
              <el-input v-model.trim="listQuery.cooperativePartnerCode" placeholder="请输入供应商编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="审批状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态">
              <el-select v-model="listQuery.receivingStatus" placeholder="订单状态" style="width: 100%;" clearable>
                <el-option v-for="(item, index) in receiptReturnType" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="deliveryDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                clearable start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期"
                :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>

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
  purPurchaseBatchLine
} from '@/api/purchasingAndOutsourcingOrders/index'
import JNPFForm from '../purchaseOrder/Form.vue'
import moment from 'moment'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
// import withdrawnForm from './withranForm'
import withdrawnForm from '@/views/purchasingManagement/purchasingDemand/purchasingDemandPool/Form.vue'
// import PrintForm from './printForm'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getBimBusinessDetail, getOrderFiledMap } from '@/api/basicData/index'
import {
  getbimProductAttributesList,
  getbimProductAttributes,
  getbimProductAttributesListMap
} from '@/api/masterDataManagement/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { getBimProcessList } from '@/api/bimProcess/index'
export default {
  name: 'purchaseOrder',
  components: { JNPFForm, withdrawnForm, ExportForm, SuperQuery, PrintBrowse, PrintDialog },
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      printBrowseVisible: false,
      prindId: '',
      formId: '',
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
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input'
        },

        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },

        {
          prop: 'taxRate',
          label: '税率(%)',
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
          label: '订单状态',
          type: 'select',
          options: [
            { label: '审批中', value: 'receiving' },
            { label: '已完成', value: 'received' },
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
        orderType: 'procure', //	订单类型 采购 procure、外协 external
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
        receivingStatus: ''
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
        classAttribute: 'finish_product',
        orderType: 'procure',
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
        receivingStatus: ''
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
        'excludingTaxAmount'
        // 'standardValue',
        // 'sealingCoverTyping',
        // 'accuracyLevel',
        // 'vibrationLevel',
        // 'oil',
        // 'oilQuantity',
        // 'clearance',
        // 'packagingMethod',
        // 'processName'
        // 'createByName'
      ],
      standardValueFlag: '',
      colourFlag: '',
      processFlag: '',
      sealingCoverTypingFlag: '',
      accuracyLevelFlag: '',
      vibrationLevelFlag: '',
      oilFlag: '',
      oilQuantityFlag: '',
      clearanceFlag: '',
      packagingMethodFlag: '',
      specialRequireFlag: '',
      bimProductAttributesList: {},
      processList: []
    }
  },

  async created() {
    await this.getProductClassFun()
    await this.getOrderFiledMap()

    await this.getDeputyUnit()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')

    let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'receivingStatus')
    if (this.processFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'processName',
        label: '工序',
        type: 'select',
        options: this.processList.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.specialRequireFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'specialRequire',
        label: '特殊要求',
        type: 'select',
        options: this.bimProductAttributesList.pa016.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.packagingMethodFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'packagingMethod',
        label: '包装方式',
        type: 'select',
        options: this.bimProductAttributesList.pa015.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.clearanceFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'clearance',
        label: '游隙',
        type: 'select',
        options: this.bimProductAttributesList.pa001.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.oilQuantityFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'oilQuantity',
        label: '油脂量',
        type: 'select',
        options: this.bimProductAttributesList.pa003.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.oilFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'oil',
        label: '油脂',
        type: 'select',
        options: this.bimProductAttributesList.pa002.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }

    if (this.vibrationLevelFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'vibrationLevel',
        label: '振动等级',
        type: 'select',
        options: this.bimProductAttributesList.pa005.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.accuracyLevelFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'accuracyLevel',
        label: '精度等级',
        type: 'select',
        options: this.bimProductAttributesList.pa006.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.sealingCoverTypingFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'sealingCoverTyping',
        label: '打字内容',
        type: 'select',
        options: this.bimProductAttributesList.pa007.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.colourFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'colour',
        label: '颜色',
        type: 'select',
        options: this.bimProductAttributesList.pa010.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.standardValueFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'standardValue',
        label: '规值',
        type: 'select',
        options: this.bimProductAttributesList.pa008.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }
    if (this.isDeputyUnitSwitch === '1') {
      let mainUnitIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'mainUnit')
      this.superQueryJson.forEach((item) => {
        if (item.prop === 'mainUnit') {
          item.label = '单位(主)'
        }
      })
      this.superQueryJson.splice(mainUnitIndex + 1, 0, {
        prop: 'deputyUnit',
        label: '单位(副)',
        type: 'input'
      })
    }
    if (this.isProductNameSwitch === '1') {
      let productCodeIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'productCode')
      this.superQueryJson.splice(productCodeIndex + 1, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }

    this.detailData()
  },
  methods: {
    getOrderFiledMap() {
      getOrderFiledMap('purchase').then((res) => {
        this.standardValueFlag = res.data.standardValue
        this.colourFlag = res.data.colour
        this.processFlag = res.data.process
      })
      getOrderFiledMap('finishProductPurchase').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
      })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `procureDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    superQuerySearch(query) {
      console.log(query, 'j')
      this.listsQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 获取产品属性
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })

      // 工序
      let obj8 = {
        pageNum: -1,
        pageSize: 20,
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
      getBimProcessList(obj8).then((res) => {
        this.processList = res.data.records
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
      this.$refs.detailTableData.showDrawer()
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
      this.detailData()
    },
    sortChangeDetail({ prop, order }) {
      let newProp
      if (
        prop === 'productCode' ||
        prop === 'cooperativePartnerCode' ||
        prop === 'cooperativePartnerName' ||
        prop === 'processName' ||
        prop === 'createTime' ||
        prop === 'createByName'
      ) {
        newProp = prop
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
        this.detailData()
      }
    },
    refresh() {
      this.formVisible = false
      this.withdrawnVisible = false
      this.reset()
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
      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.listsQuery.deliveryStartDate = this.deliveryDateArr[0] + ' 00:00:00'
        this.listsQuery.deliveryEndDate = this.deliveryDateArr[1] + ' 23:59:59'
      } else {
        this.listsQuery.deliveryStartDate = ''
        this.listsQuery.deliveryEndDate = ''
      }
      detailpurchaseOrderList(this.listsQuery)
        .then((res) => {
          console.log(res, '明细列表')
          this.detailTableData = res.data.records
          this.tableFlag = true

          console.log(this.detailTableData)
          this.detailTableData.forEach((item) => {
            item.disabled = item.receivingStatus == 'not_finished' && item.approvalStatus == 'ok' ? false : true
          })
          this.total = res.data.total
          this.listLoading = false
          this.detailVisible = false
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
      this.detailData()
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
        classAttribute: 'finish_product',
        receivingStatus: '',
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
      this.deliveryDateArr = []
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
                this.detailData()
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
    // 打印
    printPurchaseOrder(id, enCode) {
      getPrintBusInfo(enCode)
        .then((res) => {
          if (res.data) {
            this.prindId = res.data.id
            this.formId = id
            this.printBrowseVisible = true
          } else {
            this.$message.warning('未找到相应打印模版')
          }
        })
        .catch(() => {
          this.printBrowseVisible = false
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
      if (!this.selectWarehouse.length) return this.$message.error('请选择您要打印的数据!')
      getPrintBusInfo(enCode)
        .then((res) => {
          if (res.data) {
            this.prindId = res.data.id
            this.formId = this.selectWarehouse.map((item) => item.purchaseOrderId).join(',')
            this.printBrowseVisible = true
          } else {
            this.$message.warning('未找到相应打印模版')
          }
        })
        .catch(() => {
          this.printBrowseVisible = false
        })
    },
    closePrint() {
      this.printVisible = false
    }
  }
}
</script>

<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->
