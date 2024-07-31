<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2 >{{ $t('common.organization') }}</h2>
          <span  class="options">
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
        <div > <el-input placeholder="输入关键字进行过滤" v-model="filterText"
            style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable>
          </el-input>
        </div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.fullName">
            <i :class="data.icon" />
            <span class="text" :title="data.fullName">{{ data.fullName }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
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
          <topOpts @add="addOrUpdateHandle()" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableData" custom-column row-key="id"
          :setColumnDisplayList="columnList">
          <el-table-column prop="fullName" label="岗位名称" width="200" />
          <el-table-column prop="enCode" label="岗位编码" width="150" />
          <el-table-column prop="type" label="岗位类型" width="100" />
          <el-table-column prop="department" label="所属组织" min-width="150" show-overflow-tooltip />
          <el-table-column prop="creatorTime" :formatter="jnpf.tableDateFormatDayTime" label="创建时间" width="180" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column label="操作" width="180" fixed="right" :style="{ borderRight: 'none' }">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, scope.row.fullName)">
                      {{ $t('position.postMember') }}
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
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
    <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" />
  </div>
</template>

<script>
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import { getPositionList, delPosition } from '@/api/permission/position'
import Form from './Form'
import Diagram from '@/views/permission/user/Diagram'
import UserRelationList from './userRelation'

export default {
  name: 'permission-position',
  components: { Form, UserRelationList, Diagram },
  data() {
    return {
      columnList: ["creatorTime", "sortCode",],
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      listQuery: {
        organizeId: '',
        keyword: '',
        currentPage: 1,
        pageSize: 20
      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      leftFlag: false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.getOrganizeList(true)
    if (localStorage.getItem("positionFlag")) {
      let positionFlag = JSON.parse(localStorage.getItem('positionFlag'))
      this.expands = positionFlag
      console.log("positionFlag", positionFlag);
      this.toggleExpand(positionFlag)

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
        localStorage.setItem("positionFlag", expands)

      })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
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
        this.treeData = res.data.list
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
      getPositionList(this.listQuery).then(res => {
        this.tableData = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.listQuery = {
        ...this.listQuery,
        currentPage: 1,
        pageSize: 20
      }
      this.initData()
    },
    reset() {
      this.listQuery.keyword = ''
      this.search()
    },
    handleNodeClick(data, node) {
      if (this.listQuery.organizeId === data.id) return
      this.listQuery.organizeId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.reset()
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, this.listQuery.organizeId, this.organizeIdTree)
      })
    },
    removeUserRelationList(isRefresh) {
      this.userRelationListVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    removeAuthorizeForm(isRefresh) {
      this.authorizeFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delPosition(id).then(res => {
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
    handleUserRelation(id, fullName) {
      this.userRelationListVisible = true
      this.$nextTick(() => {
        this.$refs.UserRelationList.init(id, fullName)
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
