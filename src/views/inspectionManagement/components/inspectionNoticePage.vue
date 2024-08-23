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
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.originOrderNo" placeholder="来源单号" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.inspectorName" placeholder="检验人" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column>
            <el-table-column prop="orderNo" label="检验单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true, scope.row)">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="originOrderNo" label="来源单号" min-width="200" />
            <el-table-column prop="inspectorName" label="检验人" min-width="120" sortable="custom" />
            <el-table-column prop="inspectionDate" label="检验日期" width="120" sortable="custom" />
            <el-table-column prop="reasonRejection" label="驳回理由" min-width="120" />
            <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" sortable="custom" />
            <el-table-column prop="submitDate" label="提交时间" min-width="180" sortable="custom" />
            <el-table-column prop="unqualifiedFlag" label="是否有不合格" min-width="140">
              <template slot-scope="scope">{{ scope.row.unqualifiedFlag ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column prop="handleFlag" label="不合格是否处理" min-width="140">
              <template slot-scope="scope">{{ scope.row.handleFlag ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="200" />
            <el-table-column prop="createByName" label="创建人" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center"
              fixed="right">
              <template slot-scope="scope">
                <el-tag type="warning" disable-transitions v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                <el-tag type="success" disable-transitions v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <el-tag type="warning" disable-transitions
                      v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus !== 'draft'">审批中</el-tag>
                    <el-tag type="success" disable-transitions
                      v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus !== 'draft'">审批通过</el-tag>
                    <el-tag type="danger" disable-transitions
                      v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus !== 'draft'">审批拒绝</el-tag>
                  </template>
                </el-table-column> -->
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)"
                  :editDisabled="scope.row.documentStatus === 'submit'"
                  :delDisabled="scope.row.documentStatus === 'submit'">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true, scope.row)">
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

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
  </div>
</template>

<script>
import { getInspectionList, deleteInspectionData, getInspectionLinesList } from '@/api/inspectionManagement/index' // 检验单
import { documentStatusList, approvalStatusList, inspectionResultsList, inspectionMethodList } from '../data.js'
import Form from '../components/inspectionNoticeForm.vue'
export default {
  components: { Form },
  props: {
    pageData: { // 页面配置
      type: Object,
      required: true,
      default: {
        type: '', // 通知单类型
        businessCode: '', // 业务编码
        showRouting: false, // 是否显示工艺路线
        showProcess: false, // 是否显示工序
      }
    }
  },
  data() {
    return {
      visible: false,
      activeName: "dataTable",
      formVisible: false,
      listLoading: false,
      documentStatusList, // 单据状态
      approvalStatusList, // 审批状态
      inspectionResultsList, // 检验结果
      inspectionMethodList, // 检验方法

      tableData: [],
      listQuery: {},
      initListQuery: {
        orderNo: "",
        originOrderNo: "",
        inspectorName: "",
        documentStatus: "",
        approvalStatus: "",
        notificationType: this.pageData.type,
        businessCode: this.pageData.businessCode,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        createTimeArr: [],
        inspectionDateArr: []
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},

      linesTotal: 0,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  watch: { activeName() { this.initData() } },
  methods: {
    initData() {
      this.listLoading = true
      getInspectionList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => { this.listLoading = false })

    },
    search() {
      this.visible = false
      this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
      this.jnpf.searchTimeFormat(this.listQuery, 'inspectionDateArr', 'inspectionStartDate', 'inspectionEndDate')
      Object.keys(this.listQuery).forEach(key => { this.listQuery[key] = typeof this.listQuery[key] === 'string' ? this.listQuery[key].trim() : this.listQuery[key] })
      this.listQuery.pageNum = 1

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));

      this.initData()
    },
    addOrUpdateHandle(id, readOnly, data) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(id, readOnly, this.pageData.type, data, this.pageData.businessCode) })
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'inspectorName') { newProp = 'inspector_id' }
      else if ([].includes(prop)) { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()

      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteInspectionData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    inspectionResultsFormatter(row) {
      let option = this.inspectionResultsList.find(item => item.value === row.inspectionResults)
      return option ? option.label : row.inspectionResults
    },
    inspectionMethodFormatter(row) {
      let option = this.inspectionMethodList.find(item => item.value === row.inspectionMethod)
      return option ? option.label : row.inspectionMethod
    },
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />