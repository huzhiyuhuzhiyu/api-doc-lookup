<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="处理单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.inspectionOrderNo" placeholder="检验单号" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productDrawingNo" placeholder="品名规格" @keyup.enter.native="search()"
                  clearable />
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
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head" style="padding: 10px;">
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

          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO @sort-change="sortChange"
            custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="处理单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="inspectionOrderNo" label="检验单号" min-width="200" sortable="custom" />
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" min-width="180" sortable="custom" />
            <el-table-column prop="inspectionDate" label="检验日期" min-width="180" sortable="custom" />
            <el-table-column prop="inspectorName" label="检验人" min-width="180" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="180" />
            <el-table-column prop="inspectionQuantity" label="报检数量" min-width="180" sortable="custom" />
            <el-table-column prop="samplingQuantity" label="检验数量" min-width="180" sortable="custom" />
            <el-table-column prop="description" label="处理说明" min-width="180" sortable="custom" />
            <el-table-column prop="treatmentResults" label="处理结果" min-width="180" sortable="custom" />
            <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="120" sortable="custom" />
            <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="180" sortable="custom" />
            <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center">
              <template slot-scope="scope">
                <el-tag disable-transitions
                  v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus !== 'draft'">
                  审批中
                </el-tag>
                <el-tag type="success" disable-transitions
                  v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus !== 'draft'">
                  审批通过
                </el-tag>
                <el-tag type="danger" disable-transitions
                  v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus !== 'draft'">
                  审批拒绝
                </el-tag>
                <el-tag type="warning" disable-transitions
                  v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus !== 'draft'">
                  审批撤回
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" sortable="custom" />

            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts :hasEdit="false" :hasDel="false">
                  <template #left>
                    <el-button type="text" size="mini"
                      v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                      @click.native="withdrawnAddHandle(scope.row, 'add')">
                      重新提交
                    </el-button>
                    <el-button type="text" size="mini" v-if="scope.row.approvalStatus === 'ing'"
                      @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                      审批撤回
                    </el-button>
                    <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row, 'look')">
                      查看详情
                    </el-button>
                  </template>
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
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import {
  getQcUnqualifiedList,
  deleteQcUnqualifiedData,
  getQcUnqualifiedLinesList
} from '@/api/inspectionManagement/index' // 检验单
import Form from './defectiveProductHandlingForm.vue'
import { approvalStatusList, inspectionMethodList, inspectionResultsList } from '../data.js'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  components: { Form, SuperQuery },
  props: {
    pageData: {
      type: Object,
      required: true,
      default: {
        type: '', // 通知单类型
        showRouting: false, // 是否显示工艺路线
        showProcess: false // 是否显示工序
      }
    },
    processingresults: {
      type: Array,
      default: () => {
        return [
          { label: '合格', value: 'qualified' },
          { label: '不合格', value: 'unqualified' },
          { label: '让步接收', value: 'concessive_acceptance' },
          { label: '报废', value: 'discard' },
          { label: '挑选', value: 'select' },
          { label: '返工返修', value: 'repair' },
          { label: '报废和返修', value: 'discard_repair' }
        ]
      }
    }
  },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '处理单号',
          type: 'input'
        },
        {
          prop: 'inspectionOrderNo',
          label: '检验单号',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '产品编码',
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
          prop: 'inspectorName',
          label: '检验人',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'inspectionQuantity',
          label: '报检数量',
          type: 'input'
        },
        {
          prop: 'samplingQuantity',
          label: '检验数量',
          type: 'input'
        },
        {
          prop: 'description',
          label: '处理说明',
          type: 'input'
        },
        {
          prop: 'treatmentResults',
          label: '处理结果',
          type: 'select',
          options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
        },
        {
          prop: 'qualifiedQuantity',
          label: '合格数量',
          type: 'input'
        },
        {
          prop: 'unqualifiedQuantity',
          label: '不合格数量',
          type: 'input'
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
        }
      ],
      columnList: [
        'partnerCode',
        'productCode',
        'inspectionDate',
        'inspectorName',
        'inspectionQuantity',
        'samplingQuantity',
        'createByName'
      ],
      visible: false,
      activeName: 'dataTable',
      listLoading: false,
      approvalStatusList,
      inspectionMethodList,
      inspectionResultsList,
      formVisible: false,

      tableData: [],
      listQuery: {},
      initListQuery: {
        approvalStatus: '',
        createByName: '',
        inspectionOrderNo: '',
        notificationType: this.pageData.type,
        businessCode: this.pageData.businessCode,
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
        orderNo: '',
        pageNum: 1,
        pageSize: 20
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},

      linesTotal: 0
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  methods: {
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    initData() {
      this.listLoading = true
      getQcUnqualifiedList(this.listQuery)
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
      Object.keys(this.listQuery).forEach((key) => {
        this.listQuery[key] = typeof this.listQuery[key] === 'string' ? this.listQuery[key].trim() : this.listQuery[key]
      })
      this.listQuery.pageNum = 1

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

      this.initData()
    },
    addOrUpdateHandle(row, btnType) {
      this.formVisible = true
      if (btnType == 'look') {
        this.$nextTick(() => {
          this.$refs.Form.init(row.id, btnType, false, this.pageData.type, this.pageData.businessCode)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.Form.init(row.inspectionId, btnType, false, this.pageData.type, this.pageData.businessCode)
        })
      }

    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'inspectorName') {
        newProp = 'inspector_id'
      } else if ([].includes(prop)) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()

      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteQcUnqualifiedData(id).then((res) => {
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
    treatmentResultsFormat(row) {
      let option = this.processingresults.find((item) => item.value === row.treatmentResults)
      return option ? option.label : row.treatmentResults
    },
    withdrawnAddHandle(row, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(row.inspectionId, btnType, this.pageData.type)
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
    }
  }
}
</script>
<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->
