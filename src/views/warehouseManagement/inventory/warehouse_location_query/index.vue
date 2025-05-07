<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>仓库</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
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
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" highlight-current-row fixedNO ref="tableForm" :data="tableData"
          @sort-change="sortChange" custom-column show-summary :summary-method="getSummaries" customKey="JNPFTableKey_172382">
          <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" width="160" sortable="custom" />
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="400" />
          <el-table-column prop="productSpec" label="规格型号" width="120" sortable="custom" />
          <el-table-column prop="routingName" label="工艺路线名称" width="160" />
          <el-table-column prop="processName" label="工序名称" width="160" />
          <!-- <el-table-column prop="classAttribute" label="类别属性" width="120" sortable="custom"
            :formatter="classAttributeFormatter" /> -->
          <el-table-column prop="warehouseName" label="仓库" width="160" />
          <el-table-column prop="goodsShelvesName" label="货架" width="160" />
          <el-table-column prop="shelfSpaceName" label="货位" width="160" />
          <el-table-column prop="mainUnit" label="单位(主)" width="120" />
          <el-table-column prop="inventoryQuantity" label="库存数(主)" min-width="140" />
          <el-table-column prop="availableQuantity" label="可用数(主)" min-width="140" />
          <el-table-column prop="occupancyQuantity" label="占用数(主)" min-width="140" />
          <el-table-column prop="safeInventory" label="安全库存" width="140" />
          <el-table-column prop="deputyUnit" label="单位(副)" width="120" />
          <el-table-column prop="deputyInventoryQuantity" label="库存数(副)" min-width="140" />
          <el-table-column prop="deputyAvailableQuantity" label="可用数(副)" min-width="140" />
          <el-table-column prop="deputyOccupancyQuantity" label="占用数(副)" min-width="140" />
          <el-table-column prop="latestStorageTime" label="最新入库时间" width="180" sortable="custom" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号">
              <el-input v-model="listQuery.productSpec" placeholder="请输入规格型号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="类别属性">
              <el-select v-model="listQuery.classAttribute" placeholder="请选择类别属性" clearable style="width: 100%;">
                <el-option v-for="item in classAttributeList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
  </div>
</template>
<script>
import { inventoryList, inventorySpaceList, inventoryWarehouseList } from '@/api/warehouseManagement/inventory'
import { getWarehouseList } from '@/api/basicData/index' // 仓库树
import Form from '../Form'
export default {
  components: { Form },
  data() {
    return {
      formVisible: false,
      background: true, // 分页器背景颜色
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {
        productCode: "",
        productName: "",
        productSpec: "",
        classAttribute: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "productName"
        }, {
          asc: false,
          column: "latest_storage_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      stockSts: {},
      classAttributeList: [
        { label: "原材料", value: "raw_material" },
        { label: "半成品", value: "semi_finished" },
        { label: "成品", value: "finish_product" },
        { label: "辅料", value: "accessories" },
        { label: "其他", value: "other" }
      ],
      refreshTree: true,
      treeData: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      expands: true,
    }
  },
  created() {
    this.getcategoryTree()
  },
  methods: {
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.warehouseId = "" // 重置数据类型id筛选
      getWarehouseList({ type: 'normal' }).then(res => {
        this.treeData = res.data
        this.$nextTick(() => {
          this.treeLoading = false
          this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
        this.listLoading = false
      })
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode' || prop === 'productName' || prop === 'productSpec') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      inventorySpaceList(this.listQuery).then(res => {
        this.tableData = res.data.whPage.records
        this.total = res.data.whPage.total
        this.stockSts = res.data.stockSts || {}
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        productCode: "",
        productName: "",
        productSpec: "",
        classAttribute: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "productName"
        }, {
          asc: false,
          column: "latest_storage_time"
        }],
        pageNum: 1,
        pageSize: 20,
      }
      this.getcategoryTree()
    },
    classAttributeFormatter(row) {
      let option = this.classAttributeList.find(item => item.value === row.classAttribute)
      return option ? option.label : row.classAttribute
    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
      })
    },
    handleNodeClick(data, node) {
      if (this.listQuery.warehouseId === data.id) return
      this.listQuery.warehouseId = data.id
      this.search()
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleDetail(scope, typeFlag) {
      this.formVisible = true
      this.$nextTick(() => {
        const { productsId, routingLineId, processId } = scope.row
        this.$refs.Form.init(productsId, routingLineId, processId, typeFlag)
      })
    },
    // 关闭明细页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },
    getSummaries(param) {
      let list = []
      let relationshipList = [
        { prop: "inventoryQuantity", value: this.stockSts.totalInventory },
        { prop: "availableQuantity", value: this.stockSts.totalAvailable },
        { prop: "occupancyQuantity", value: this.stockSts.totalOccupancy },
        { prop: "deputyInventoryQuantity", value: this.stockSts.totalDeputyInventory },
        { prop: "deputyAvailableQuantity", value: this.stockSts.totalDeputyAvailable },
        { prop: "deputyOccupancyQuantity", value: this.stockSts.totalDeputyOccupancy },
      ]
      param.columns.forEach(o => {
        let option = relationshipList.find(item => item.prop === o.property)
        if (option) { list.push(option.value) }
        else { list.push('') }
      })
      list[0] = "总计"
      return list
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
  