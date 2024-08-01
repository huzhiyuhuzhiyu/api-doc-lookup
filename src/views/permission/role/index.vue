<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2  >{{ $t('common.organization') }}</h2>
          <span   class="options">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getOrganizeList()">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item> 
                <el-dropdown-item @click.native="showDiagram">架构图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div   >
          <el-input placeholder="输入关键字" v-model="filterText" suffix-icon="el-icon-search" clearable style="width:200px;margin:10px auto;display:block" />
        </div>
      </div>
      
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag" >
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class=" custom-tree-node" slot-scope="{ data }" :title="data.fullName">
            <i :class="data.icon" />
            <span class="text" :title="data.fullName">{{ data.fullName }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute" >
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>  
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute" >
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>  
      </div>
    </div>
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="8">
            <el-form-item :label="$t('common.keyword')">
              <el-input v-model="listQuery.keyword" :placeholder="$t('common.enterKeyword')" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()" class="commonBox">
                {{ $t('common.search') }}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle()"></topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="list" custom-column>
          <el-table-column prop="fullName" label="角色名称" width="200" />
          <el-table-column prop="enCode" label="角色编码" width="150" />
          <el-table-column prop="type" label="角色类型" width="90" align="center" />
          <el-table-column prop="organizeInfo" label="所属组织" min-width="150" show-overflow-tooltip />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" width="160" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column prop="enabledMark" label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.enabledMark == 1 ? '启用' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row)">
                      {{ $t('role.roleMember') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleAuthorize(scope.row.id, scope.row.fullName)">
                      {{ $t('role.rolePermission') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
      <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
      <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
      <AuthorizeForm v-if="authorizeFormVisible" ref="AuthorizeForm" @close="removeAuthorizeForm" />
      <component :is="currentView" v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="initData"
        @closeDialog="userRelationListVisible = false" />
    </div>
  </div>
</template>

<script>
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import { getRoleList, delRole, updateRoleState } from '@/api/permission/role'
import Form from './Form'
import AuthorizeForm from '@/views/permission/authorize/AuthorizeForm'
import UserRelationList from './userRelation'
import GlobalUserRelationList from '@/views/permission/userRelation/Selector'
import Diagram from '@/views/permission/user/Diagram'
import { mapGetters } from "vuex";
export default {
  components: { Form, AuthorizeForm, UserRelationList, GlobalUserRelationList, Diagram },
  name: 'permission-role',
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      }, 
      leftFlag: false, 
      list: [],
      listQuery: {
        organizeId: '',
        keyword: '',
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      listLoading: true,
      treeLoading: false,
      formVisible: false,
      diagramVisible: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      currentView: null,
      expands: true,
      refreshTree: true,
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getOrganizeList(true)
    if (localStorage.getItem("roleFlag")) {
      let roleFlag = JSON.parse(localStorage.getItem('roleFlag'))
      this.expands = roleFlag
      console.log("roleFlag", roleFlag);
      this.toggleExpand(roleFlag)

    }
  },
  methods: {
      // // 设置默认展开
      setexpand(expands) {
      console.log("expands", expands);
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("roleFlag", expands)

      })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
     
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    reset() {
      this.listQuery.keyword = ''
      this.search()
    },
    search() {
      this.listQuery = {
        ...this.listQuery,
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    showDiagram() {
      this.diagramVisible = true
      this.$nextTick(() => {
        this.$refs.Diagram.init()
      })
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
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    getOrganizeList(isInit) {
      this.filterText = ''
      this.treeLoading = true
      getDepartmentSelectorByAuth().then(res => {
        if (this.userInfo.isAdministrator) {
          let globalItem = {
            fullName: "全局",
            hasChildren: false,
            id: "0",
            parentId: "-1",
            icon: 'icon-ym icon-ym-global-role'
          }
          this.treeData = [...res.data.list, globalItem]
        } else {
          this.treeData = res.data.list || []
        }
        this.$nextTick(() => {
          this.treeLoading = false
          if (isInit) this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    initData() {
      this.listLoading = true
      getRoleList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    handleNodeClick(data) {
      if (this.listQuery.organizeId === data.id) return
      this.listQuery.organizeId = data.id
      this.reset()
    },
    removeAuthorizeForm(isRefresh) {
      this.authorizeFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    removeUserRelationList(isRefresh) {
      this.userRelationListVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前角色吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateRoleState(row.id).then(res => {
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
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delRole(id).then(res => {
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
    handleUserRelation(row) {
      this.currentView = row.type === '全局' ? GlobalUserRelationList : UserRelationList
      this.$nextTick(() => {
        this.userRelationListVisible = true
        this.$nextTick(() => {
          this.$refs.UserRelationList.init(row.id, row.fullName, 'Role')
        })
      })
    },
    handleAuthorize(id, fullName) {
      this.authorizeFormVisible = true
      this.$nextTick(() => {
        this.$refs.AuthorizeForm.init(id, fullName, 'Role')
      })
    }
  }
}
</script>
<style scoped>
  .title_box {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.JNPF-common-head{
  padding:8px 10px
}
</style>
