<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="检验单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="isProductNameSwitch === '1'">
              <el-form-item>
                <el-input v-model="listQuery.productName" placeholder="产品名称" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.docNo" placeholder="业务单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="检验开始日期"
                  end-placeholder="检验结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head" style="padding:10px">
            <div>
              <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
                icon="el-icon-download" @click="exportForm">
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
          <JNPF-table v-if="tableDataFlag" ref="dataTable" :data="tableData" :fixedNO="true" @sort-change="sortChange"
            custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_139872">
            <el-table-column prop="orderNo" label="检验单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="docNo" label="业务单号" min-width="200" sortable="custom" />
            <el-table-column prop="inspectorName" label="检验人" width="100" sortable="custom" />
            <el-table-column prop="inspectionDate" label="检验日期" width="120" sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" width="120"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="180" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" sortable="custom" />
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="60" />
            <el-table-column prop="inspectionQuantity" label="报检数量" width="110" sortable="custom" />

            <el-table-column prop="inspectionMethod" label="检验方式" width="110" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.inspectionMethod == 'exempt'">免检</div>
                <div v-if="scope.row.inspectionMethod == 'spot_check'">抽检</div>
                <div v-if="scope.row.inspectionMethod == 'all'">全检</div>
              </template>
            </el-table-column>
            <el-table-column prop="samplingQuantity" label="检验数量" width="110" sortable="custom" />
            <el-table-column prop="inspectionResults" label="检验结果" width="110" sortable="custom">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.inspectionResults == 'qualified'">合格</el-tag>
                <el-tag type="danger" v-if="scope.row.inspectionResults == 'unqualified'">不合格</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="unqualifiedQuantity" label="不合格数量" width="130" sortable="custom" />
            <el-table-column prop="processingStatus" label="处理状态" width="110" sortable="custom">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.processingStatus == 'untreated'">未处理</el-tag>
                <el-tag type="warning" v-if="scope.row.processingStatus == 'processing'">处理中</el-tag>
                <el-tag type="success" v-if="scope.row.processingStatus == 'processed'">已处理</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="samplingQuantity" label="处理结果" min-width="180" sortable="custom" /> -->
            <el-table-column prop="remark" label="备注" min-width="200" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" width="100" sortable="custom" />
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row, 'add')" editText="处理" :hasEdit="false" :hasDel="false">
                  <el-button size="mini" type="text" @click.native="addOrUpdateHandle(scope.row, 'look')">
                    查看详情
                  </el-button>
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" :inspectionMethodList="inspectionMethodList" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm"
      :inspectionMethodList="inspectionMethodList" />
    <DetailReportWorkForm v-if="detailReportWorkFormVisible" ref="DetailReportWorkForm" @close="closeForm"
      :inspectionMethodList="inspectionMethodList" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getInspectionList, deleteInspectionData, getInspectionLinesList } from '@/api/inspectionManagement/index' // 检验单
import { documentStatusList, approvalStatusList, inspectionResultsList, inspectionMethodList } from '../data.js'
import Form from './defectiveProductHandlingForm.vue'
import DetailForm from './inspectionFormManagementDetail.vue'
import DetailReportWorkForm from '../reportWorkInspection/inspectionFormManagementDetail.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import getProjectList from '@/mixins/generator/getProjectList'

import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  components: { Form, ExportForm, DetailForm,DetailReportWorkForm, SuperQuery },
  mixins: [getProjectList],

  props: {
    pageData: {
      // 页面配置
      type: Object,
      required: true,
      default: {
        type: '', // 通知单类型
        businessCode: '', // 业务编码
        showRouting: false, // 是否显示工艺路线
        showProcess: false // 是否显示工序
      }
    }
  },
  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '检验单号',
          type: 'input'
        },
        {
          prop: 'inspectorName',
          label: '检验人',
          type: 'input'
        },
        {
          prop: 'inspectionDate',
          label: '检验日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
      
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },

        {
          prop: 'inspectionMethod',
          label: '检验方式',
          type: 'select',
          options: [{ label: '免检', value: 'exempt' }, { label: '抽检', value: 'spot_check' }, { label: '全检', value: 'all' }]
        },
        {
          prop: 'inspectionResults',
          label: '检验结果',
          type: 'select',
          options: [
            { label: '合格', value: 'qualified' },
            { label: '不合格', value: 'unqualified' },
            { label: '审批拒绝', value: 'rebut' },
            { label: '审批撤回', value: 'withdrawn' }
          ]
        },
        {
          prop: 'inspectionResults',
          label: '处理状态',
          type: 'select',
          options: [
            { label: '未处理', value: 'untreated' },
            { label: '处理中', value: 'processing' },
            { label: '已处理', value: 'processed' }
          ]
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
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

      ],
      columnList: ["remark", "productCode", "processingStatus", "createByName"],
      visible: false,
      activeName: 'dataTable',
      formVisible: false,
      detailFormVisible: false,
      detailReportWorkFormVisible:false,
      listLoading: false,
      documentStatusList, // 单据状态
      approvalStatusList, // 审批状态
      inspectionResultsList, // 检验结果
      inspectionMethodList, // 检验方法
      time: null,
      tableData: [],
      listQuery: {},
      initListQuery: {
        orderNo: '',
        originOrderNo: '',
        inspectorName: '',
        documentStatus: '',
        approvalStatus: '',
        notificationType: this.pageData.type,
        businessCode: this.pageData.businessCode,
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          },
          {
            asc: false,
            column: 'order_no'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        createTimeArr: [],
        inspectionDateArr: []
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},
      exportFormVisible: false,
      linesTotal: 0
    }
  },
  async created() {
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
      this.superQueryJson.splice(4, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.tableDataFlag = true

    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
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
          ...this.listQuery,
          exportType: '1097',
          exportName: '采购检验通知单',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalRowFlag: true
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
    initData() {
      this.listLoading = true
      if (this.time) {
        this.listQuery.inspectionStartDate = this.time[0]
        this.listQuery.inspectionEndDate = this.time[1]
      } else {
        this.listQuery.inspectionStartDate = ''
        this.listQuery.inspectionEndDate = ''
      }
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      getInspectionList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      this.visible = false
      this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
      this.jnpf.searchTimeFormat(this.listQuery, 'inspectionDateArr', 'inspectionStartDate', 'inspectionEndDate')
      Object.keys(this.listQuery).forEach((key) => {
        this.listQuery[key] = typeof this.listQuery[key] === 'string' ? this.listQuery[key].trim() : this.listQuery[key]
      })
      this.listQuery.pageNum = 1

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.time = []
      this.initData()
    },
    addOrUpdateHandle(row, btnType) {
      if (btnType == 'look') {
        console.log(row,'对对对')
        if (row.notificationType === 'work_report') {
          this.detailReportWorkFormVisible = true
          this.$nextTick(() => {
            this.$refs.DetailReportWorkForm.init(row.id, btnType, false, this.pageData.type)
          })
        } else {
          this.detailFormVisible = true
          this.$nextTick(() => {
            this.$refs.DetailForm.init(row.id, btnType, false, this.pageData.type)
          })
        }
        
      } else {

        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row.id, btnType, false, this.pageData.type)
        })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'inspectorName' || prop === 'productDrawingNo' || prop === 'productCode' || prop === 'createTime' ||
        prop === 'createByName') {
        newProp = 'inspector_id'
      } else if ([].includes(prop)) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp

      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      this.detailReportWorkFormVisible = false
      this.initData()
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteInspectionData(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    inspectionResultsFormatter(row) {
      let option = this.inspectionResultsList.find((item) => item.value === row.inspectionResults)
      return option ? option.label : row.inspectionResults
    },
    inspectionMethodFormatter(row) {
      let option = this.inspectionMethodList.find((item) => item.value === row.inspectionMethod)
      return option ? option.label : row.inspectionMethod
    }
  }
}
</script>
