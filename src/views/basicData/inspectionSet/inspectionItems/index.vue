<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" v-if="!leftFlag">
        <h2 v-if="!leftFlag">检验项目分类</h2>
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
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.code" placeholder="项目编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="tableQuery.name" placeholder="检验项目名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select clearable v-model="tableQuery.inspectionMethod" placeholder="检验方式" style="width: 100%;">
                <el-option v-for="(item, index) in wayList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
          <topOpts @add="addSupplier('add')" />
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
        <JNPF-table v-loading="listLoading" :data="tableDataList" ref="dataTable" @sort-change="sortChange"
          custom-column :fixedNO="true" :setColumnDisplayList="columnList">
          <el-table-column prop="code" label="项目编码" sortable="custom" min-width="180" >
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="检验项目名称" sortable="custom" width="150"  />
          <el-table-column prop="equipmentName" label="检验工具" min-width="140" />
          <el-table-column prop="inspectionMethod" label="检验方式" sortable="custom" width="120" />
          <el-table-column prop="inspectionBasis" label="检验要求" width="120" />
          <el-table-column prop="normalValue" label="正常值" />
          <el-table-column prop="minimum" label="最低值" />
          <el-table-column prop="maximum" label="最高值" />
          <el-table-column prop="productCategoryIdText" label="所属分类" width="140" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createBy" label="创建人" width="100" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
              <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id,)" style=" color: #ff3a3a">删除</el-button>
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
                </el-dropdown-menu>
              </el-dropdown> -->
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
          :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getCategoryTrees, getBimInspectionItemsList, deleteBimInspectionItemsData } from '@/api/basicData/index'
import DepForm from './depForm'
import moment from 'moment'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'quality',
  components: { DepForm, SuperQuery },
  data() {
    return {
      leftFlag: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '项目编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '检验项目名称',
          type: 'input'
        },

        {
          prop: 'inspectionMethod',
          label: '检验方式',
          type: 'input'
        },
        {
          prop: 'inspectionBasis',
          label: '检验要求',
          type: 'input'
        },
        {
          prop: 'normalValue',
          label: '正常值',
          type: 'input'
        },
        {
          prop: 'minimum',
          label: '最低值',
          type: 'input'
        },
        {
          prop: 'maximum',
          label: '最高值',
          type: 'input'
        },
        {
          prop: 'productCategoryIdText',
          label: '所属分类',
          type: 'select',
          options: []
        },

        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        // {
        //   prop: 'remark',
        //   label: '备注',
        //   type: 'input'
        // },
      ],
      columnList: ["partnerCode", "productCode", "productName", "createByName"],
      depFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],
      wayList: [
        {
          label: '测量',
          value: 'measure'
        },
        {
          label: '其他',
          value: 'other'
        }
      ],
      listLoading: false,
      tableQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
        
          {
            asc: false,
            column: ''
          }
        ],
        // keyword:"",
        name: '',
        code: '',
        classAttribute: '',
        inspectionMethod: '',
        productCategoryId: '',
        productCategoryList: []
      },
      organizeIdTree: [],
      total: 0,
      formVisible: false,
      filterText: '',
      expands: true,
      refreshTree: true,
      treeData: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      treeLoading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.getcategoryTree(true)
    this.initData()
  },
  methods: {
    getcategoryTree(isInit) {
      this.treeLoading = true

      let listQuery = {
        keyword: '',
        classAttribute: 'inspection_items'
      }
      getCategoryTrees(listQuery)
        .then((res) => {
          this.treeData = res.data
          this.treeLoading = false
          // if (res.data.length > 0) {
          //   this.tableQuery.productCategoryId = res.data[0].id
          // }
          this.$nextTick(() => {
            this.treeLoading = false
            // if (isInit) this.initData()
          })
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    // // 设置默认展开
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("inspectionItemsFlag", expands)
      })
    },
    superQuerySearch(query) {
      this.tableQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.tableQuery.orderItems[0].asc = order === 'ascending'
      this.tableQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      // this.tableQuery.classAttribute = "inspection_items",
      getBimInspectionItemsList(this.tableQuery)
        .then((res) => {
          console.log('货位表格', res)
          this.tableDataList = res.data.records
          this.tableDataList.forEach((item) => {
            if (item.inspectionMethod === 'other') {
              item.inspectionMethod = '其他'
            }
            if (item.inspectionMethod === 'measure') {
              item.inspectionMethod = '测量'
            }
          })
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleNodeClick(data, node) {
      console.log('请选择节点', node)
      if (this.tableQuery.productCategoryId === data.id) return
      this.tableQuery.productCategoryId = data.id
      console.log(this.tableQuery.productCategoryId)
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
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
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
    search() {
      Object.keys(this.tableQuery).forEach((key) => {
        let item = this.tableQuery[key]
        this.tableQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.tableQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.tableQuery = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        name: '',
        code: '',
        inspectionMethod: '',
        productCategoryId: ''
      }
      this.filterText = ''
      this.getcategoryTree(true)
      // this.search()
      this.initData()
    },
    addSupplier(type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init('', type)
      })
    },
    addOrUpdateHandle(id, type) {
      this.depFormVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
        // }, 600);
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteBimInspectionItemsData(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, btnType)
      })
    }
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
