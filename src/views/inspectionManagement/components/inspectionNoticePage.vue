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
            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="检验开始日期"
                  end-placeholder="检验结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.originOrderNo" placeholder="品名规格" @keyup.enter.native="search()"
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column>
            <el-table-column prop="orderNo" label="检验单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="docNo" label="业务单号" min-width="200" sortable="custom" />
            <el-table-column prop="inspectorName" label="检验人" min-width="120" sortable="custom" />
            <el-table-column prop="inspectionDate" label="检验日期" width="120" sortable="custom" />
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" min-width="180" sortable="custom" />

            <el-table-column prop="mainUnit" label="单位" min-width="180" />
            <el-table-column prop="inspectionQuantity" label="报检数量" min-width="180" sortable="custom" />

            <el-table-column prop="inspectionMethod" label="检验方式" min-width="180" sortable="custom" />
            <el-table-column prop="samplingQuantity" label="检验数量" min-width="180" sortable="custom" />
            <el-table-column prop="inspectionResults" label="检验结果" min-width="180" sortable="custom" />
            <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="180" sortable="custom" />
            <el-table-column prop="processingStatus" label="处理状态" min-width="180" sortable="custom" />
            <el-table-column prop="samplingQuantity" label="处理结果" min-width="180" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="200" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" sortable="custom" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row,'add')" editText="处理" :hasDel="false">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, 'look')">
                        查看详情
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getInspectionList, deleteInspectionData, getInspectionLinesList } from '@/api/inspectionManagement/index' // 检验单
import { documentStatusList, approvalStatusList, inspectionResultsList, inspectionMethodList } from '../data.js'
import Form from './defectiveProductHandlingForm.vue'
import DetailForm from './inspectionFormManagementDetail.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  components: { Form, ExportForm, DetailForm },
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
      visible: false,
      activeName: 'dataTable',
      formVisible: false,
      detailFormVisible: false,
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
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
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
        console.log(includeFieldMap)
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

      this.initData()
    },
    addOrUpdateHandle(row, btnType) {
      if (btnType == 'look') {
        this.detailFormVisible = true

        this.$nextTick(() => {
          this.$refs.DetailForm.init(row, btnType, this.pageData.type)
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row, btnType, this.pageData.type)
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
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
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
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
