<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title">
        <h2 v-if="!leftFlag">仓库</h2>
        <span class="options" v-if="!leftFlag">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getWarehouseList()">刷新数据</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <div v-if="!leftFlag">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="width:200px;margin:10px auto;display:block"
          suffix-icon="el-icon-search"
          clearable
        ></el-input>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree
          ref="treeBox"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="expands"
          highlight-current
          :expand-on-click-node="false"
          node-key="id"
          @node-click="handleNodeClick"
          class="JNPF-common-el-tree"
          v-if="refreshTree"
          :filter-node-method="filterNode"
          :default-expanded-keys="[selectedNodeKey]"
        >
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i
              :class="[
                data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm'
              ]"
            />
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
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.name" placeholder="请输入货架/货位名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.code" placeholder="请输入编码" clearable />
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
        <div class="JNPF-common-head">
          <el-dropdown>
            <el-button icon="el-icon-plus" type="primary" size="mini">
              新建
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addSupplier('addReservoirArea')">新建库区</el-dropdown-item>
              <el-dropdown-item @click.native="addSupplier('addShelves')">新建货架</el-dropdown-item>
              <el-dropdown-item @click.native="addSupplier('addLocation')">新建货位</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="JNPF-common-head-right">
            <!-- <el-tooltip effect="dark" content="展开" placement="top">
                            <el-link v-show="!expandsTable" type="text"
                                icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon" :underline="false"
                                @click="toggleExpandTable()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="折叠" placement="top">
                            <el-link v-show="expandsTable" type="text"
                                icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon" :underline="false"
                                @click="toggleExpandTable()" />
                        </el-tooltip> -->
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table
          v-loading="listLoading"
          :data="tableDataList"
          row-key="id"
          v-if="refreshTable"
          :fixedNO="true"
          @sort-change="sortChange"
          custom-column
          :default-expand-all="expands"
          :tree-props="{ children: 'childrenList', hasChildren: '' }"
        >
          <el-table-column prop="name" label="货架/货位名称" fixed="left" min-width="180">
            <!-- <template slot-scope="scope">
              <i
                :class="[scope.row.childrenList.length >= 1 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']"></i>{{
                  scope.row.name }}
            </template> -->
          </el-table-column>
          <el-table-column prop="code" label="货架/货位编码" width="180" sortable="custom">
            <!-- <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, scope.row.warehouseId, 'look')">
                {{ scope.row.code }}
              </el-link>
            </template> -->
          </el-table-column>
          <!-- <el-table-column prop="unitVolume" label="体积" width="150" />
          <el-table-column prop="usedVolume" label="已使用体积" width="150" />
          <el-table-column prop="residualVolume" label="剩余体积" width="150" />
          <el-table-column prop="warehouseName" label="仓库名称" width="160" /> -->
          <el-table-column prop="category" label="货位类型" width="100" />
          <!-- <el-table-column prop="goodsFrameRow" label="货架行" width="80" />
                    <el-table-column prop="goodsFrameCol" label="货架列" width="80" /> -->
          <el-table-column prop="remark" label="备注" width="160" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts
                @edit="addOrUpdateHandle(scope.row.id, scope.row.warehouseId, scope.row.category)"
                @del="handleDel(scope.row.id, scope.row.parentId)"
              >
                <!-- <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, scope.row.warehouseId, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </tableOpts>

              <!-- <el-button type="text"
                                @click="addOrUpdateHandle(scope.row.id, scope.row.warehouseId, 'edit')">编辑</el-button>
                            <el-button type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                                style=" color: #ff3a3a">删除</el-button>
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    <el-button type="text" size="mini">
                                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        @click.native="handleUserRelation(scope.row.id, scope.row.warehouseId, 'look')">
                                        查看详情
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown> -->
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- <pagination
          :total="total"
          :page.sync="tableQuery.pageNum"
          :background="background"
          :limit.sync="tableQuery.pageSize"
          @pagination="initData"
        /> -->
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
  </div>
</template>

<script>
import { deleteStockGoodsShelves, getStockGoodsShelves, getListTree } from '@/api/basicData/stockGoodsShelves'
import { getWarehouseList } from '@/api/basicData/index'
import DepForm from './Form'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
export default {
  name: 'storageRack',
  components: { DepForm },
  data() {
    return {
      selectedNodeKey: '',
      depFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      treeData: [],
      tableDataList: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      treeQuery: {
        code: '',
        name: '',
        category: 'warehouse'
      },
      tableQuery: {
        areaId: '',
        category: '',
        code: '',
        createByName: '',
        endTime: '',
        endUpdateTime: '',
        goodsShelvesId: '',
        keyword: '',
        name: '',
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        startUpdateTime: '',

        totalRowFlag: false,
        warehouseId: ''
      },
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      leftFlag: false,
      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      expandsTable: true,
      refreshTree: true,
      refreshTable: true,
      filterText: '',
      warehouseName: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.getWarehouseList(true)
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.tableQuery.orderItems[0].asc = order === 'ascending'
      this.tableQuery.orderItems[0].column = newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.getWarehouseList(true)
      }
    },
    toggleExpandTable() {
      this.refreshTable = false
      this.expandsTable = !this.expandsTable
      this.$nextTick(() => {
        this.refreshTable = true
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
    // 设置默认展开
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem('customExpandsFlag', expands)
      })
    },
    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getWarehouseList(isInit) {
      this.treeLoading = true
      getWarehouseList(this.treeQuery)
        .then((res) => {
          this.treeData = res.data
          this.$nextTick(() => {
            this.treeLoading = false
            if (isInit) this.initData()
          })
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    initData() {
      if (this.treeData.length > 1) {
        this.tableQuery.warehouseId = this.tableQuery.warehouseId ? this.tableQuery.warehouseId : this.treeData[0].id
        this.warehouseName = this.warehouseName ? this.warehouseName : this.treeData[0].name
        this.selectedNodeKey = this.tableQuery.warehouseId
        this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      }

      getListTree(this.tableQuery)
        .then((res) => {
          //

          this.tableDataList = res.data
          this.tableDataList.forEach((item) => {
            // if (item.category == 'area') {
            //   item.category = '库区'
            // } else if (item.category == 'shelves') {
            //   item.category = '货架'
            // } else if (item.category == 'location') {
            //   item.category = '货位'
            // }
          })

          if (this.tableDataList.length > 0) this.setTableIndex(this.tableDataList)

          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        if (item.category == 'area') {
          item.category = '库区'
        } else if (item.category == 'shelves') {
          item.category = '货架'
        } else if (item.category == 'location') {
          item.category = '货位'
        }
        item.index = key + 1
        if (index) {
          item.index = index + 1
        }
        if (item.childrenList.length > 0) {
          this.setTableIndex(item.childrenList, item.index)
        }
      })
    },
    search() {
      this.initData()
    },
    reset() {
      if (this.treeData.length > 1) {
        this.tableQuery.warehouseId = this.tableQuery.warehouseId ? this.tableQuery.warehouseId : this.treeData[0].id
        this.warehouseName = this.warehouseName ? this.warehouseName : this.treeData[0].name
        this.selectedNodeKey = this.tableQuery.warehouseId
        this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      }
      this.tableQuery = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        warehouseId: this.treeData[0].id,
        code: '',
        createByName: '',
        endTime: '',
        keyword: '',
        locationType: '',
        name: '',
        parentId: '',
        startTime: ''
      }
      this.getWarehouseList(true)

      // this.search()
    },
    handleNodeClick(data, node) {
      if (this.tableQuery.warehouseId === data.id) return
      this.tableQuery.warehouseId = data.id
      this.warehouseName = data.name
      const nodePath = this.getNodePath(node)
      this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      this.organizeIdTree = nodePath.map((o) => o.id)
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
    addSupplier(type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init('', this.tableQuery.warehouseId, type, this.warehouseName)
      })
    },
    addOrUpdateHandle(id, warehouseId, btntype) {
      this.depFormVisible = true
      let newBtnType = ''

      if (btntype == '库区') {
        newBtnType = 'areaEdit'
      } else if (btntype == '货架') {
        newBtnType = 'shelvesEdit'
      } else if (btntype == '货位') {
        newBtnType = 'locationEdit'
      }

      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, warehouseId, newBtnType)
        })
        // }, 600);
      }
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
      })
        .then(() => {
          const ids = [id]
          deleteStockGoodsShelves(ids).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => {})
    },
    handleUserRelation(id, parentId, btnType) {
      this.depFormVisible = true
      let newBtnType = ''

      if (btntype == '库区') {
        newBtnType = 'areaEdit'
      } else if (btntype == '货架') {
        newBtnType = 'shelvesEdit'
      } else if (btntype == '货位') {
        newBtnType = 'locationEdit'
      }
      this.$nextTick(() => {
        this.$refs.depForm.init(id, parentId, newBtnType)
      })
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
