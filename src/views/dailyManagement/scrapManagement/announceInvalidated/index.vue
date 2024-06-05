<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.orderNo" placeholder="请输入报废单号" clearable
                @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="orderForm.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in auditStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="orderForm.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="dataFormSubmit()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier('', 'add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" fixedNO
          custom-column style="padding-bottom: 50px;">
          <el-table-column prop="orderNo" label="报废单号" width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="departmentIdName" label="申请部门" width="120" />
          <el-table-column prop="applicantIdName" label="申请人" width="120"></el-table-column>
          <el-table-column prop="applicantTime" label="申请日期" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="reasonScrapping" label="报废理由" min-width="200"></el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag
                  type="success">审批通过</el-tag></div>
              <div v-else-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag
                  type="warning">审批中</el-tag></div>
              <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag
                  type="danger">审批拒绝</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="reasonRejection" label="驳回理由" min-width="200"></el-table-column>
          <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="documentStatus" label="单据状态" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              <div v-else-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="submitDate" label="提交时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)" :editDisabled="scope.row.documentStatus === 'submit'" :delDisabled="scope.row.documentStatus === 'submit'">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>
<script>
import { ScrapApplicationFormList, deleteScrapApplicationForm } from '@/api/dailyManagement/Maintenance'
import Form from './Form'
export default {
  name: 'announceInvalidated',
  components: { Form },
  data() {
    return {
      tableData: [],
      listLoading: false,
      documentStatusList: [
        { label: "审批通过", value: "ok" },
        { label: "审批中", value: "ing" },
        { label: "审批拒绝", value: "rebut" }
      ],
      auditStatusList: [
        { label: "提交", value: "submit" },
        { label: "草稿", value: "draft" },
      ],
      orderForm: {
        orderNo: '',
        documentStatus: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    dataFormSubmit() {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      ScrapApplicationFormList(this.orderForm).then(res => {
        console.log("res++", res);
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false

      }).catch(() => {
        this.listLoading = false
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.orderForm = {
        orderNo: '',
        documentStatus: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      }
      this.dataFormSubmit()
    },

    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype,)
        })
        // }, 600);
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteScrapApplicationForm(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    }
  }
}
</script>
<style  scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

::v-deep .el-table .cell.el-tooltip {
  width: 98% !important;
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-head {
  padding: 10px;
}

.JNPF-common-search-box {
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}</style>

