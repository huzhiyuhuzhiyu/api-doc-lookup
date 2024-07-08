<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>{{ $t('common.organization') }}</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getOrganizeList()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              <el-dropdown-item @click.native="showDiagram">架构图</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <div class="JNPF-common-tree-search-box">
        <el-input placeholder="输入关键字" v-model="filterText" suffix-icon="el-icon-search" clearable />
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="filteredTree" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree">
          <span class="custom-tree-node" slot-scope="{ data, node }" :title="data.fullName">
            <i :class="data.icon" />
            <span class="text" :title="data.fullName">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.account" placeholder="请输入账户" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.realName" placeholder="请输入姓名" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-select v-model="listQuery.employeeType" placeholder="请选择员工类型" clearable>
                <el-option v-for="item in employeeTypeList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">{{ $t('common.search')
              }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>

          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
            @click="moreQueries()">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <topOpts @add="addOrUpdateHandle()">
            <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
            <el-button type="text" icon="el-icon-upload2" @click="uploadForm">导入</el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData"   @sort-change="sortChange"
          ref="dataTable" custom-column>
          <el-table-column prop="account" label="账户" width="100"  /> <!-- 这里的 width 会被转成 min-width -->
          <el-table-column prop="realName" label="姓名" width="100"  sortable="custom"  >
            <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">{{
                  scope.row.realName
                  }}</el-link>
              </template>
            </el-table-column>

          <!-- 这里的 width 会被转成 min-width -->
          <el-table-column prop="gender" label="性别" width="90" align="center" sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row.gender == 1 ? '男' : (scope.row.gender == 2 ? '女' : '保密') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mobilePhone" label="手机号码" width="160" />
          <el-table-column prop="organizeName" label="所属组织" min-width="200" />
          <el-table-column prop="employeeType" label="员工类型" width="120" sortable="custom" />
          <el-table-column prop="employeeStatus" label="员工状态" width="120" align="center" sortable="custom">
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.employeeStatus == 'on_job'">在职</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="row.employeeStatus == 'off_job'">离职</el-tag>
              <!-- <el-tag type="warning" disable-transitions v-else>未知</el-tag> -->
            </template>
          </el-table-column>
          <el-table-column prop="entryDate" label="入职日期" :formatter="jnpf.tableDateFormatDay" width="140"
            sortable="custom" />
          <el-table-column prop="resignationDate" label="离职日期" :formatter="jnpf.tableDateFormatDay" width="140"
            sortable="custom" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" width="180"
            sortable="custom" />
          <el-table-column prop="sortCode" label="排序" width="80" align="center" sortable="custom" />
          <el-table-column prop="enabledMark" label="状态" width="80" align="center" sortable="custom">
            <template slot-scope="scope">
              <el-tag type="success" disable-transitions v-if="scope.row.enabledMark == 1">启用</el-tag>
              <el-tag type="warning" disable-transitions v-else-if="scope.row.enabledMark == 2">锁定</el-tag>
              <el-tag type="danger" disable-transitions v-else>禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope" v-if="!scope.row.isAdministrator">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button size="mini" type="text">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="scope.row.employeeStatus != 'off_job' || !scope.row.employeeStatus">
                      <el-dropdown-item @click.native="jobTransfer(scope.row, scope)">岗位调动</el-dropdown-item>
                      <el-dropdown-item @click.native="jobQuit(scope.row.id)">办理离职</el-dropdown-item>
                    </template>
                    <el-dropdown-item v-else @click.native="jobEntry(scope.row.id)">重新入职</el-dropdown-item>
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">查看详情</el-dropdown-item>
                    <el-dropdown-item @click.native="handleResetPwd(scope.row.id)"> {{ $t('user.resetPassword') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="unlockUser(scope.row.id)"
                      v-if="scope.row.enabledMark == 2">解除锁定</el-dropdown-item>
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

    <el-dialog :title="'更多查询'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="账户">
              <el-input v-model="listQuery.account" placeholder="请输入账户" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="listQuery.realName" placeholder="请输入姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工类型">
              <el-select v-model="listQuery.employeeType" placeholder="请选择员工类型" clearable>
                <el-option v-for="item in employeeTypeList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工状态">
              <el-select v-model="listQuery.employeeStatus" placeholder="请选择员工状态" clearable>
                <el-option v-for="item in employeeStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          搜索
        </el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @close="removeForm" />
    <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
    <ResetPwdForm v-if="resetFormVisible" ref="ResetPwdForm" @refreshDataList="initData" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" />
    <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()" />
    <JobTransfer v-if="jobTransferFormVisible" ref="JobTransfer" @close="removeForm" />
    <JobQuit v-if="jobQuitFormVisible" ref="JobQuit" @close="removeForm" />
    <JobEntry v-if="jobEntryFormVisible" ref="JobEntry" @close="removeForm" />
  </div>
</template>
<script>
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import {
  updateUserState,
  unlockUser,
  delUser,
  getUserListPost
} from '@/api/permission/user'
import Form from './Form' // 新建
import Diagram from './Diagram' // 树状列表-组织机构
import ResetPwdForm from './ResetPassword' // 重设密码
import ImportForm from './ImportForm' // 导入数据
import ExportForm from './ExportForm' // 导出数据
import JobTransfer from './JobTransfer' // 岗位调动
import JobQuit from './JobQuit' // 办理离职
import JobEntry from './JobEntry' // 重新入职

export default {
  name: 'permission-user',
  components: {
    Form,
    Diagram,
    ResetPwdForm,
    ExportForm,
    ImportForm,
    JobTransfer,
    JobQuit,
    JobEntry
  },
  data() {
    return {
      tableData: [],
      treeLoading: false,
      listLoading: true,
      listQuery: {
        account: "",
        employeeStatus: "",
        employeeType: "",
        orderItems: [
          {
            asc: true,
            column: ""
          },
          {
            asc: false,
            column: "f_entrydate"
          }
        ],
        organizeId: "",
        pageNum: 1,
        pageSize: 20,
        realName: ""
      },
      employeeTypeList: [{ label: "劳务派遣", value: "labor_dispatch" }, { label: "正式员工", value: "formal" }, { label: "兼职", value: "sideline" }, { label: "实习", value: "pratice" }, { label: "试用", value: "trial" }, { label: "学徒", value: "apprentice" }],
      employeeStatusList: [{ label: "在职", value: "on_job" }, { label: "离职", value: "off_job" }],
      total: 0,
      type: '',
      visible: false,
      formVisible: false,
      diagramVisible: false,
      resetFormVisible: false,
      authorizeFormVisible: false,
      importFormVisible: false,
      exportFormVisible: false,
      jobTransferFormVisible: false,
      jobQuitFormVisible: false,
      jobEntryFormVisible: false,
      treeData: [], //树形结构所有的数据
      filterText: '',
      refreshTree: true,
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      expands: true,
      filteredTree: []
    }
  },
  watch: {
    filterText(val) {
      this.filterTree();
    },
    // 监听树形数据变化
    treeData: {
      handler: function (val) {
        this.filterTree();
      },
      deep: true,
    }
  },
  created() {
    this.getOrganizeList()
  },
  methods: {
    moreQueries() {
      this.visible = true
    },
    columnSetFun() {
      this.$refs.datatable.showDrawer()
    },
    showDiagram() {
      this.diagramVisible = true
      this.$nextTick(() => {
        this.$refs.Diagram.init()
      })
    },
    search() {
      this.visible = false
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = {
        account: "",
        employeeStatus: "",
        employeeType: "",
        orderItems: [{
          asc: true,
          column: ""
        }, {
          asc: false,
          column: "f_entrydate"
        }],
        organizeId: this.listQuery.organizeId,
        pageNum: 1,
        pageSize: 20,
        realName: ""
      }
      this.search()
    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    filterNode(value, data) {
      return !value || data.fullName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    filterNodes(node) {
      let matched = this.filterNode(this.filterText, node);
      if (!matched && node.children) {
        node.children = node.children.filter(childNode => {
          const matchedChild = this.filterNodes(childNode);
          return matchedChild;
        });
        matched = node.children.length > 0;
      }
      return matched;
    },
    filterTree() {
      if (!this.filterText) {
        // 如果搜索框内容为空，展示全部树形结构数据
        this.filteredTree = this.treeData;
        return;
      }
      const filteredTreeData = JSON.parse(JSON.stringify(this.treeData));
      this.filteredTree = filteredTreeData.filter(node => {
        return this.filterNodes(node);
      });
    },
    getOrganizeList(isInit) {
      this.filterText = ''
      this.treeLoading = true
      this.listQuery.organizeId = ''
      this.initData()
      getDepartmentSelectorByAuth().then(res => {
        this.treeData = res.data.list
        this.treeLoading = false
        if (isInit) this.initData()
      }).catch(() => {
        this.treeLoading = false
      })
    },
    initData() {
      this.listLoading = true
      getUserListPost(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleNodeClick(data) {
      if (this.listQuery.organizeId === data.id) return
      this.listQuery.organizeId = data.id
      this.type = data.type
      this.initData()
    },
    addOrUpdateHandle(id, onlyRead) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, this.type === 'department' ? this.listQuery.organizeId : '', onlyRead)
      })
    },
    // 岗位调动
    jobTransfer(row, scope) {
      this.jobTransferFormVisible = true
      this.$nextTick(() => {
        this.$refs.JobTransfer.init({ id: row.id, departmentName: row.organize })
      })
    },
    // 办理离职
    jobQuit(id) {
      this.jobQuitFormVisible = true
      this.$nextTick(() => {
        this.$refs.JobQuit.init(id)
      })
    },
    // 重新入职
    jobEntry(id) {
      this.jobEntryFormVisible = true
      this.$nextTick(() => {
        this.$refs.JobEntry.init(id)
      })
    },
    removeForm(isRefresh) {
      this.formVisible = false
      this.resetFormVisible = false
      this.jobTransferFormVisible = false
      this.jobQuitFormVisible = false
      this.jobEntryFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前用户吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateUserState(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              row.enabledMark = row.enabledMark ? 0 : 1
            }
          })
        })
      }).catch(() => { })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        delUser(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    unlockUser(id) {
      this.$confirm('此操作将解除该账户锁定, 是否继续?', '解除锁定', {
        type: 'warning'
      }).then(() => {
        unlockUser(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    exportForm() {
      this.exportFormVisible = true
      this.$nextTick(() => {
        this.$refs.exportForm.init(this.listQuery)
      })
    },
    uploadForm() {
      this.importFormVisible = true
      this.$nextTick(() => {
        this.$refs.importForm.init()
      })
    },
    handleResetPwd(id, account) {
      this.resetFormVisible = true
      this.$nextTick(() => {
        this.$refs.ResetPwdForm.init(id, account)
      })
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop == 'employeeStatus' || prop == 'resignationDate' || prop == 'employeeType') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      else newProp = 'f_' + prop.toLowerCase()
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = newProp
      this.initData()
    },
  }
}
</script>

<style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

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
