<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>工具分类</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getOrganizeList()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="showDiagram">架构图</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i
              :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入工具编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.name" placeholder="请输入工具名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.state" placeholder="请选择工具状态"  clearable>
                <el-option v-for="(item, index) in equipmentStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <topOpts @add="addOrUpdateHandle('', false,'add')">
              <el-button size="mini" type="primary" icon="el-icon-printer" @click="printTool('p039')">打印工具二维码</el-button>
            </topOpts>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" :customColumn="true" ref="dataTable"
          @sort-change="sortChange" custom-column hasC @selection-change="handleSelectionChange">
          <el-table-column prop="code" label="工具编码" min-width="200" sortable="custom"  />

          <el-table-column prop="name" label="工具名称" min-width="200" sortable="custom"  />
          <el-table-column prop="state" label="工具状态" min-width="200" sortable="custom">
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.state == 'normal'">正常</el-tag>
              <el-tag  type="warning" disable-transitions v-if="row.state == 'verification'">检定</el-tag>
              <el-tag  disable-transitions v-if="row.state == 'use'">领用</el-tag>
              <el-tag type="danger"  disable-transitions v-if="row.state == 'discard'">报废</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="分类名称" width="200" sortable="custom" />
          <el-table-column prop="specModel" label="工具规格" min-width="200" sortable="custom" />
          <el-table-column prop="drawingNo" label="图号" min-width="200" sortable="custom" />
          <el-table-column prop="createName" label="创建人" min-width="200" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" min-width="200" sortable="custom" />
          <el-table-column prop="plmSyncFlag" label="PLM同步状态" min-width="160" sortable="custom" fixed="right" align="center">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="!scope.row.plmSyncFlag">同步失败</el-tag>
              <el-tag type="success" v-else>同步成功</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, false,'edit')" @del="handleDel(scope.row.id)">
                <el-button size="mini" type="text" 
                      :disabled="scope.row.plmSyncFlag"
                      @click="PLMchange(scope.row.id)">同步PLM</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true,'look')">
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
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" :params="workOrderForm" ref="printForm" />
  </div>
</template>

<script>
import { getPositionList, deleteEquEquipment } from '@/api/permission/position'
import { getCategoryTrees, getEquEquipmentList,plmsync } from '@/api/basicData/index'
import Form from './Form'
import Diagram from '@/views/permission/user/Diagram'
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'
export default {
  name: 'toolProfilesettings',
  components: { Form, UserRelationList, Diagram ,PrintBrowse},
  data() {
    return {
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      listQuery: {
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
        classAttribute: "tool",
        productCategoryId: "",
        state:'',
      },

      typeList: [],
      equipmentStateList: [
      {
          value: "normal",
          label: "正常"
        },
        {
          value: "verification",
          label: "检定"
        },
        {
          value: "use",
          label: "领用"
        },
        {
          value: "discard",
          label: "报废"
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },

      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      selectList:[],
      printBrowseVisible:false,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.getCategoryTree(true)
  },
  methods: {
    PLMchange(id){
      this.listLoading = true
      plmsync(id).then(res=>{
        console.log(res,'tongbu');
        if (res.msg === 'Success') {
          this.initData()
        }else{
          this.listLoading = false
        }
      }).catch(() => {this.listLoading = false })
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      if (newProp === 'create_name') {newProp = 'create_by'}
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
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
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getCategoryTree(isInit) {
      this.treeLoading = true
      let listQuery = {
        page: 1,
        limit: 999,
        keyword: '',
        classAttribute: 'tool'
      }
      getCategoryTrees(listQuery).then(res => {
        console.log(99, res)
        this.treeData = res.data
        this.getTypeList(res.data)
        this.$nextTick(() => {
          this.treeLoading = false
          if (isInit) this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    // 获取设备类型
    getTypeList(data) {
      let arr = []
      let fn = (data) => {
        data.forEach(item => {
          arr.push(item)
          if (item.childrenList && item.childrenList.length) {
            fn(item.childrenList)
          }
        })
      }
      fn(data)
      this.typeList = arr
    },
    initData() {
      this.listLoading = true
      getEquEquipmentList(this.listQuery).then(res => {
        console.log("res++", res)
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum=1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = {
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
        classAttribute: "tool",
        productCategoryId:"",
        state:'',
      }
      this.getCategoryTree(true)
      this.search()
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node)
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.search()
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

    addOrUpdateHandle(id, type, types) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type, types)
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
        deleteEquEquipment(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    printTool(enCode){
      if (!this.selectList.length) return this.$message.error("请选择您要打印的数据!")
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectList.map(item=>item.id).join(',')
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    handleSelectionChange(val) {
      this.selectList = val
    },    
  }
}
</script>
<style>
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
  background-color: #f5f7fa !important;
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
