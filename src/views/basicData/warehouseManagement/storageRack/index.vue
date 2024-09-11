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
        <el-input placeholder="输入关键字" v-model="filterText" style="width:200px;margin:10px auto;display:block"
          suffix-icon="el-icon-search" clearable></el-input>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode" :default-expanded-keys="[selectedNodeKey]">
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
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.name" placeholder="库位名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.code" placeholder="库位编码" clearable />
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
          <!-- <el-button icon="el-icon-plus" type="primary" size="mini" @click.native="addSupplier('add')">
            新建库位
          </el-button> -->
          <div>
            <el-dropdown style="margin-right:10px;">
              <el-button size="mini" type="primary" icon="el-icon-plus">
                新建
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="addSupplier('add')">普通新建</el-dropdown-item>
                <el-dropdown-item @click.native="aiAdd()">批量生成</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="mini" icon="el-icon-edit-outline" @click="batchEditFun">
              批量修改
            </el-button>
          </div>


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
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableDataList" row-key="id" v-if="refreshTable"
          :fixedNO="true" @sort-change="sortChange" custom-column :default-expand-all="expands"
          :tree-props="{ children: 'childrenList', hasChildren: '' }" :setColumnDisplayList="columnList" hasC
          @selection-change="handleSelectionChange">
          <el-table-column prop="name" label="库位名称" min-width="140"></el-table-column>
          <el-table-column prop="code" label="库位编码" min-width="140" sortable="custom"></el-table-column>
          <el-table-column prop="state" label="状态" width="70">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949" active-value="enable"
                inactive-value="disabled" @change="stateChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="warehouseName" label="所属仓库" min-width="180"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="160" />
          <el-table-column prop="createByName" label="创建人" min-width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row)" @del="handleDel(scope.row.id, scope.row.parentId)">
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <AiForm v-if="aiFormVisible" ref="aiForm" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { deleteStockGoodsShelves, getStockGoodsShelves, editStockGoodsShelves, getList } from '@/api/basicData/stockGoodsShelves'
import { getWarehouseList } from '@/api/basicData/index'
import DepForm from './Form'
import AiForm from "./AiForm.vue";
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  name: 'storageRack',
  components: { DepForm, AiForm, SuperQuery },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'name',
          label: '库位名称',
          type: 'input'
        },
        {
          prop: 'code',
          label: '库位编码',
          type: 'input'
        },
        {
          prop: 'code',
          label: '状态',
          type: 'select',
          options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }]
        },
        {
          prop: 'warehouseName',
          label: '所属仓库',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
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
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        }
      ],
      columnList: ['warehouseName', 'createTime', 'createByName'],
      selectedNodeKey: '',
      depFormVisible: false,
      aiFormVisible: false,
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
        category: 'warehouse',
        state: 'enable'
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
      warehouseName: '',
      selectList: []
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
    stateChange(row) {
      editStockGoodsShelves(row).then((res) => {
        this.initData()
        this.$message({
          type: 'success',
          message: row.state == 'enable' ? '开启成功' : '禁用成功',
          duration: 1500
        })
      })
    },
    handleSelectionChange(val) {
      this.selectList = val
    },
    batchEditFun() {
      if (!this.selectList.length) return this.$message.error('请先选择您要修改的数据!')
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(this.selectList, 'edit')
      })
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      this.aiFormVisible = false
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

      getList(this.tableQuery)
        .then((res) => {
          //

          this.tableDataList = res.data.records
          this.tableDataList.forEach((item) => {
            // if (item.category == 'area') {
            //   item.category = '库区'
            // } else if (item.category == 'shelves') {
            //   item.category = '货架'
            // } else if (item.category == 'location') {
            //   item.category = '库位'
            // }
          })

          // if (this.tableDataList.length > 0) this.setTableIndex(this.tableDataList)

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
      this.filterText = ''
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
        let row = {
          id: '',
          warehouseId: this.tableQuery.warehouseId,
          btntype: type,
          warehouseName: this.warehouseName
        }
        this.$refs.depForm.init(row, row.btntype)
      })
    },
    aiAdd() {
      this.aiFormVisible = true
      this.$nextTick(() => {
        let row = {
          id: '',
          warehouseId: this.tableQuery.warehouseId,
          btntype: 'add',
          warehouseName: this.warehouseName
        }
        this.$refs.aiForm.init(row)
      })
    },
    addOrUpdateHandle(row) {
      console.log(row, 'row')
      this.depFormVisible = true

      row.btntype = 'edit'

      if (row.id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(row)
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
        .catch(() => { })
    },
    handleUserRelation(id, parentId, btnType) {
      this.depFormVisible = true
      let newBtnType = ''

      if (btntype == '库区') {
        newBtnType = 'areaEdit'
      } else if (btntype == '货架') {
        newBtnType = 'shelvesEdit'
      } else if (btntype == '库位') {
        newBtnType = 'locationEdit'
      }
      this.$nextTick(() => {
        this.$refs.depForm.init(id, parentId, newBtnType)
      })
    }
  }
}
</script>
