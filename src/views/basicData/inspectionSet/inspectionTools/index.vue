<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" v-if="!leftFlag">
        <h2 v-if="!leftFlag">检验工具分类</h2>
        <span class="options" v-if="!leftFlag">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(true)">默认展开</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(false)">默认收起</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <div v-if="!leftFlag">
        <el-input placeholder="请输入" v-model="filterText" style="width:200px;margin:10px auto;display:block"
          suffix-icon="el-icon-search" clearable></el-input>
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i :class="[
              data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm'
            ]" />
            <span class="text" :title="data.name">{{ data.name }}</span>
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
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="检验工具编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="检验工具名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <topOpts @add="addOrUpdateHandle()" />
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" ref="dataTable" :fixedNO="true" :customColumn="true"
          @sort-change="sortChange" custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_745385">
          <el-table-column prop="code" label="检验工具编码" min-width="200" sortable />

          <el-table-column prop="name" label="检验工具名称" min-width="200" sortable />
          <el-table-column prop="categoryName" label="所属分类" width="140" sortable />
          <el-table-column prop="specModel" label="检验工具规格" min-width="200" sortable />
          <el-table-column prop="drawingNo" label="品名规格" min-width="200" sortable />
          <el-table-column prop="createByName" label="创建人" width="100" sortable />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable />
          <el-table-column label="操作" width="220" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">
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
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getPositionList, deleteEquEquipment } from '@/api/permission/position'
import { getCategoryTrees, getEquEquipmentList } from '@/api/basicData/index'
import Form from './Form'
import Diagram from '@/views/permission/user/Diagram'
import UserRelationList from './userRelation'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  name: 'permission-position',
  components: { Form, UserRelationList, Diagram, SuperQuery },
  data() {
    return {
      leftFlag: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '检验工具编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '检验工具名称',
          type: 'input'
        },


        {
          prop: 'specModel',
          label: '检验工具规格',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        }
      ],
      columnList: ['partnerCode', 'productCode', 'productName', 'createByName'],
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      listQuery: {
        unitCode: '',
        name: '',
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
        remark: '',
        code: '',
        classAttribute: 'inspect',
        productCategoryId: ''
      },
      typeList: [],
      equipmentState: {
        normal: '正常',
        repair: '维修',
        maintain: '保养',
        discard: '报废'
      },
      equipmentStateList: [
        {
          label: '正常',
          value: 'normal'
        },
        {
          label: '维修',
          value: 'repair'
        },
        {
          label: '保养',
          value: 'maintain'
        },
        {
          label: '报废',
          value: 'discard'
        }
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
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    // this.initData()
    this.getCategoryTree(true)
  },
  methods: {
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    // // 设置默认展开
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem('OfficialFlag', expands)
      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'categoryName') {
        newProp = prop
      } else if (prop === 'createByName') {
        newProp = 'create_by'
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        // this.getCategoryTree()
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
    // 左边树节点
    getCategoryTree(isInit) {
      this.treeLoading = true
      let listQuery = {
        page: 1,
        limit: 999,
        keyword: '',
        type: 'ispection_tools'
      }
      getCategoryTrees(listQuery)
        .then((res) => {
          console.log(99, res)
          this.treeData = res.data
          this.getTypeList(res.data)
          this.$nextTick(() => {
            this.treeLoading = false
            if (isInit) this.initData()
          })
        })
        .catch(() => {
          this.treeLoading = false
        })
    },

    // 获取设备类型
    getTypeList(data) {
      let arr = []
      let fn = (data) => {
        data.forEach((item) => {
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
      getEquEquipmentList(this.listQuery)
        .then((res) => {
          console.log('res++', res)
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.listQuery = {
        ...this.listQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        unitCode: '',
        name: '',
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
        remark: '',
        code: '',
        classAttribute: 'inspect',
        productCategoryId: ''
      }
      this.getCategoryTree(true)
      this.search()
    },
    handleNodeClick(data, node) {
      console.log('选择节点', node)
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map((o) => o.id)
      this.initData()
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

    addOrUpdateHandle(id, parentId) {
      console.log(id, '编辑')
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId)
      })
    },
    // handleUserRelation(id, btnType) {
    //   this.formVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.Form.init(id, btnType)
    //   })
    // },
    // removeUserRelationList(isRefresh) {
    //   this.userRelationListVisible = false
    //   if (isRefresh) {
    //     this.keyword = ''
    //     this.initData()
    //   }
    // },
    // removeAuthorizeForm(isRefresh) {
    //   this.authorizeFormVisible = false
    //   if (isRefresh) {
    //     this.keyword = ''
    //     this.initData()
    //   }
    // },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteEquEquipment(id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500,
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => { })
    }
    // handleUserRelation(id, name) {
    //   this.userRelationListVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.UserRelationList.init(id, name)
    //   })
    // }
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
