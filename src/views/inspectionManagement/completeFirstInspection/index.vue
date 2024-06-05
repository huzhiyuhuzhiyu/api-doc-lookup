<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.workOrder" placeholder="请输入工单号" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.processName" placeholder="请输入工序名称" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="listQuery.firstInspectionDateArr" type="daterange" value-format="yyyy-MM-dd"
                start-placeholder="请选择首检开始日期" end-placeholder="请选择首检结束日期" :picker-options="global.timePickerOptions">
              </el-date-picker>
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
        <JNPF-table v-loading="listLoading" ref="dataTable" :data="tableData" @sort-change="sortChange" custom-column
          fixedNO>
          <el-table-column prop="workOrder" label="工单号" width="200" fixed="left">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true)">
                {{ scope.row.workOrder }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="400" />
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="400" />
          <el-table-column prop="processName" label="工序名称" sortable="custom" min-width="120" />
          <el-table-column prop="firstInspectionDate" label="首检日期" sortable="custom" width="140" />
          <el-table-column prop="inspectorIdName" label="检验员" min-width="120" />
          <el-table-column prop="inspectionResults" label="检验结果" sortable="custom" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.inspectionResults == '1'">通过</div>
              <div v-if="scope.row.inspectionResults == '0'">未通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="problemDescription" label="问题描述" min-width="200" />
          <el-table-column prop="reasonRejection" label="驳回理由" min-width="180" />
          <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" />
          <el-table-column prop="submitDate" label="提交时间" width="180" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tag type="warning" disable-transitions v-if="scope.row.documentStatus === 'draft'">草稿</el-tag>
              <el-tag type="success" disable-transitions v-else-if="scope.row.documentStatus === 'submit'">提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tag type="warning" disable-transitions
                v-if="scope.row.approvalStatus === 'ing' && scope.row.documentStatus !== 'draft'">审批中</el-tag>
              <el-tag type="success" disable-transitions
                v-else-if="scope.row.approvalStatus === 'ok' && scope.row.documentStatus !== 'draft'">审批通过</el-tag>
              <el-tag type="danger" disable-transitions
                v-else-if="scope.row.approvalStatus === 'rebut' && scope.row.documentStatus !== 'draft'">审批拒绝</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row)" @del="handleDel(scope.row.id)"
                :editDisabled="scope.row.documentStatus === 'submit'"
                :delDisabled="scope.row.documentStatus === 'submit'">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, true)">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>


    <Form v-if="formVisible" ref="Form" @close="closeForm" />
  </div>
</template>
  
<script>
import { getPFIList, deletePFIData } from '@/api/inspectionManagement/productionFirstInspection'
import Form from './Form.vue'
export default {
  components: { Form },
  data() {
    return {
      formVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableData: [],
      listQuery: {},
      initListQuery: {
        businessCode: 'complete',
        outsideDiameter: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        firstInspectionDateArr: []
      },
      listLoading: false,
      total: 0,
      formVisible: false
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      getPFIList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      if (this.listQuery.firstInspectionDateArr && this.listQuery.firstInspectionDateArr.length) {
        this.listQuery.firstInspectionDateStart = this.listQuery.firstInspectionDateArr[0]
        this.listQuery.firstInspectionDateEnd = this.listQuery.firstInspectionDateArr[1]
      } else {
        this.listQuery.firstInspectionDateStart = ''
        this.listQuery.firstInspectionDateEnd = ''
      }
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },
    addOrUpdateHandle(row, readOnly) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(row, readOnly,this.listQuery.businessCode) })
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'plasticCapName' || prop === 'processName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
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
        deletePFIData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
  