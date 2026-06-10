<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <!-- 查询表单 -->
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入审批模版编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="请输入审批模版名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <!-- <el-input v-model="listQuery.mobilePhone" placeholder="请输入手机" clearable /> -->
              <el-select v-model="listQuery.state" placeholder="请选择模版状态" clearable style="width: 100%;">
                <el-option v-for="( item, index ) in  stateList " :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button :loading="btnLoading" style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="el-icon-search" @click="moreQueries()">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle('','add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" @sort-change='sortChange' ref="dataTable"
          highlight-current-row :fixedNO="true" custom-column customKey="JNPFTableKey_315617">
          <el-table-column prop="code" label="审批模板编码" min-width="160" sortable="custom" />
          <el-table-column prop="name" label="审批模板名称" min-width="160" sortable="custom" />
          <el-table-column prop="adminName" label="审批管理员" min-width="160" />
          <el-table-column prop="createByName" label="创建人" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="updateByName" label="修改人" />
          <el-table-column prop="updateTime" label="修改时间" width="180" sortable="custom" />
          <el-table-column prop="submitDate" label="提交时间" width="180" sortable="custom" />
          <el-table-column prop="state" label="状态" min-width="120" align="center" sortable="custom" fixed="right">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.documentStatus != 'draft'" @change="changeState(scope.row.state, scope.row.id)"
                v-model="scope.row.state == 'enable' ? true : false" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.documentStatus === 'draft'" type="warning">草稿</el-tag>
              <el-tag v-else-if="scope.row.documentStatus === 'submit'" type="success">提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template slot-scope="scope">
              <tableOpts :editDisabled="scope.row.documentStatus === 'submit'" :delDisabled="scope.row.documentStatus === 'submit'" @edit="addOrUpdateHandle(scope.row.id,'edit')" @del="handleDel(scope.row.id)">
                <!-- <el-button size="mini" :disabled="scope.row.documentStatus === 'submit'" type="text" @click="openWorkFlow(scope.row.id,scope.row,'')">流程设计</el-button> -->
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'copy')">
                          复制模版
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
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <stepForm v-if="stepFormVisible" ref="stepForm"  @close="closeForm" />
    <workFlow :workFlowT="workFlowTemplate" v-if="workVisible" @refreshDataList="initData" @close="closeForm" ref="workflowRef"/>
    <!-- <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="名称">
              <el-input v-model="listQuery.name" placeholder="请输入名称" clearable />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()">
          搜索</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { getApprovalTemplate, deleteApprovalTemplate, updateTemplateState } from '@/api/basicData/approvalAdministrator'
import Form from './Form'
import stepForm from './stepForm'
import workFlow from '@/components/WorkFlow/setting.vue'

export default {
  components: {
    Form,
    workFlow,
    stepForm
  },
  data() {
    return {
      title: "更多查询",
      listLoading: true,
      btnLoading: false,
      stepFormVisible: false,
      workFlowTemplate:{},
      visible: false,
      total: 0,
      tableData: [],
      listQuery: {},
      initListQuery: {
        code: "",
        createByName: "",
        endTime: "",
        keyword: "",
        name: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        state: ""
      },
      formVisible: false,
      workVisible: false,
      stateList: [
        { label: '启用', value: 'enable' },
        { label: '停用', value: 'disabled' },
      ],
    }
  },

  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    changeState(val, id) {
      console.log(val);
      let data = {
        id,
        state: val == 'enable' ? 'disabled' : 'enable'
      }
      updateTemplateState(data).then(res => {
        console.log(res);
        if (res.msg === 'Success') {
          this.initData()
        }
      })
    },
    // 打开工作流
    openWorkFlow(id,workFlowTemplate,type){
      this.workFlowTemplate = workFlowTemplate
      this.workVisible = true
      this.$nextTick(()=>{
        this.$refs.workflowRef.initData(id,type)
        console.log(this.workFlowTemplate);
      })
    },
    // moreQueries() {
    //   this.visible = true
    // },
    // dataFormSubmit() {
    //   this.btnLoading = true
    //   this.initData()
    // },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      getApprovalTemplate(this.listQuery).then(res => {
        console.log(123321, res)
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
        this.btnLoading = false
      }).catch(error => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteApprovalTemplate(id).then(res => {
          this.$message({
            type: 'success',
            message: "删除成功",
            onClose: () => {
              this.initData()
            }
          })
        })

      }).catch(() => {
      })
    },
    addOrUpdateHandle(id,type) {
      this.stepFormVisible = true
      this.$nextTick(() => {
        this.$refs.stepForm.init(id,type)
      })
      return
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id,type)
      })
    },

    // 关闭新建、编辑页面 
    closeForm(isRefresh) {
      this.stepFormVisible = false
      this.workVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
  }
}
</script>
<style scoped>
.JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
}

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

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />