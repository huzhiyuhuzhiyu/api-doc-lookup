<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">

      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="请输入处理单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.inspectionOrderNo" placeholder="请输入检验单号" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="listQuery.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;">
                  <el-option v-for="item in approvalStatusList" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
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
          <div class="JNPF-common-head">
            <topOpts @add="addOrUpdateHandle()" />
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>

          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO @sort-change="sortChange"
            custom-column>
            <el-table-column prop="orderNo" label="处理单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="inspectionOrderNo" label="检验单号" min-width="200" />
            <el-table-column prop="description" label="处理说明" min-width="180" />
            <el-table-column prop="reasonRejection" label="驳回理由" min-width="120" />
            <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" sortable="custom" />
            <el-table-column prop="submitDate" label="提交时间" min-width="180" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="200" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" />
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center"
              fixed="right">
              <template slot-scope="scope">
                <el-tag type="warning" disable-transitions v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                <el-tag type="success" disable-transitions v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center"
              fixed="right">
              <template slot-scope="scope">
                <el-tag disable-transitions
                  v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus !== 'draft'">审批中</el-tag>
                <el-tag type="success" disable-transitions
                  v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus !== 'draft'">审批通过</el-tag>
                <el-tag type="danger" disable-transitions
                  v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus !== 'draft'">审批拒绝</el-tag>
                <el-tag type="warning" disable-transitions
                  v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus !== 'draft'">审批撤回</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)"
                  :editDisabled="scope.row.documentStatus === 'submit'"
                  :delDisabled="scope.row.documentStatus === 'submit'">
                  <template #left>
                    <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id, 'setLoss')"
                      :disabled="scope.row.lossFlag">设置损失</el-button>
                  </template>
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                        @click.native="addOrUpdateHandle(scope.row.id, 'anew')">
                        重新提交
                      </el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                        @click.native="withdrawnHandle(scope.row.id)">
                        审批撤回
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
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
  </div>
</template>

<script>
import { getQcUnqualifiedList, deleteQcUnqualifiedData, getQcUnqualifiedLinesList } from '@/api/inspectionManagement/index' // 检验单
import Form from './defectiveProductHandlingForm.vue'
import { approvalStatusList, inspectionMethodList, inspectionResultsList } from '../data.js'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
export default {
  components: { Form },
  props: {
    pageData: {
      type: Object,
      required: true,
      default: {
        type: '', // 通知单类型
        showRouting: false, // 是否显示工艺路线
        showProcess: false, // 是否显示工序
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
          { label: '报废和返修', value: 'discard_repair' },
        ]
      }
    }
  },
  data() {
    return {
      visible: false,
      activeName: "dataTable",
      listLoading: false,
      approvalStatusList,
      inspectionMethodList,
      inspectionResultsList,
      formVisible: false,

      tableData: [],
      listQuery: {},
      initListQuery: {
        approvalStatus: "",
        createByName: "",
        inspectionOrderNo: "",
        notificationType: this.pageData.type,
        businessCode: this.pageData.businessCode,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
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
      getQcUnqualifiedList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => { this.listLoading = false })

    },
    search() {
      this.visible = false
      Object.keys(this.listQuery).forEach(key => { this.listQuery[key] = typeof this.listQuery[key] === 'string' ? this.listQuery[key].trim() : this.listQuery[key] })
      this.listQuery.pageNum = 1

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));

      this.initData()
    },
    addOrUpdateHandle(id, btnType = 'add') {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(id, btnType, this.pageData.type, this.pageData.businessCode) })
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
        deleteQcUnqualifiedData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    treatmentResultsFormat(row) {
      let option = this.processingresults.find(item => item.value === row.treatmentResults)
      return option ? option.label : row.treatmentResults
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        withdrawn(_data).then(res => {
          this.$message({
            type: 'success',
            message: "撤回成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />