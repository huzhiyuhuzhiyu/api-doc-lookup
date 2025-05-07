<template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible="visible" lock-scroll
    class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="visible = false">
    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6" class="noPaddingLeft" v-if="warehoseFlag">
              <el-form-item>
                <el-select v-model="listQuery.warehouseName" :placeholder="'请选择仓库'" clearable @clear="handleClear"
                  ref="treeSelect">
                  <el-option hidden key="hidden" :value="listQuery.warehouseId" :label="''" />
                  <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                    highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                    class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
                    <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                      <i
                        :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                      <span class="text" :title="data.name">{{ data.name }}</span>
                    </span>
                  </el-tree>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :class="!warehoseFlag ? 'noPaddingLeft' : ''">
              <el-form-item>
                <el-input v-model="listQuery.batchNumber" :placeholder="'请输入批次号'" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="treeLoading || listLoading" :data="tableData" hasNO fixedNO @sort-change="sortChange"
            show-summary :summary-method="getSummaries" ref="dataTable" customKey="JNPFTableKey_550231">

            <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" fixed="left" />
            <el-table-column prop="productName" label="产品名称" width="160" sortable="custom" fixed="left" />
            <el-table-column prop="productSpec" label="规格型号" width="120" sortable="custom" fixed="left" />
            <el-table-column prop="routingName" label="工艺路线名称" width="160" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" width="160" sortable="custom" />
            <el-table-column prop="warehouseName" label="仓库" min-width="160" />
            <el-table-column prop="shelfSpaceName" label="库位" min-width="160" />
            <el-table-column prop="batchNumber" label="批次号" min-width="180" />
            <el-table-column prop="mainUnit" label="单位(主)" min-width="160" />
            <el-table-column prop="inventoryQuantity" label="库存数(主)" min-width="160" />
            <el-table-column prop="availableQuantity" label="可用数(主)" min-width="160" />
            <el-table-column prop="occupancyQuantity" label="占用数(主)" min-width="160" />
            <el-table-column prop="safeInventory" label="安全库存" min-width="160" v-if="isHidden('safeInventory')" />
            <el-table-column prop="deputyUnit" label="单位(副)" min-width="160" />
            <el-table-column prop="deputyInventoryQuantity" label="库存数(副)" min-width="160" />
            <el-table-column prop="deputyAvailableQuantity" label="可用数(副)" min-width="160" />
            <el-table-column prop="deputyOccupancyQuantity" label="占用数(副)" min-width="160" />
            <el-table-column prop="latestStorageTime" label="最新入库时间" min-width="180" fixed="right" sortable="custom" />

          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { inventorySpaceList } from '@/api/warehouseManagement/inventory'
import { getWarehouseList } from '@/api/basicData/index' // 仓库树
export default {
  data() {
    return {
      title: "明细",
      treeData: [],
      tableData: [],
      visible: false,
      treeLoading: false,
      listLoading: false,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      listQuery: {},
      originalListQuery: {},
      total: 0,
      stockSts: {},
      expands: true,
      refreshTree: true,
      warehoseFlag: true,
      hiddenList: [], // 不显示的列
      warehouseType: undefined
    }
  },
  methods: {
    getTreeData() {
      if (this.warehoseFlag) {
        this.treeLoading = true
        this.listLoading = true
        getWarehouseList({ type: this.warehouseType }).then(res => {
          this.treeData = res.data
        })
      }
      this.$nextTick(() => this.$refs['dataTable'].$refs.JNPFTable.clearSort())
      this.initData()
    },
    init(productsId, routingLineId = "", processId = "", typeFlag, warehouseId = "", hiddenList = [], warehouseType = 'normal') {
      this.warehouseType = warehouseType
      this.hiddenList = hiddenList
      this.visible = true
      if (warehouseId) { this.warehoseFlag = false }
      let tempListQuery = {
        warehouseType,
        productsId,
        routingLineId,
        excludeProcessFlag: routingLineId ? 0 : 1, // 是否排除工序产品
        processId,
        warehouseId,
        batchNumber: "",
        availableFlag: 0, // 可用数标识（0 否 1是）默认否
        inventoryFlag: 0, // 库存数标识（0 否 1是）默认否
        occupancyFlag: 0, // 占用数标识（0 否 1是）默认否
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "latest_storage_time"
        }],
        pageNum: 1,
        pageSize: 20
      }
      tempListQuery[typeFlag] = 1
      this.originalListQuery = tempListQuery
      this.listQuery = JSON.parse(JSON.stringify(this.originalListQuery))
      if (typeFlag === 'inventoryFlag') { this.title = '库存数明细' }
      else if (typeFlag === 'occupancyFlag') { this.title = '占用数明细' }
      else if (typeFlag === 'availableFlag') { this.title = '可用数明细' }
      this.getTreeData()
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.listQuery = JSON.parse(JSON.stringify(this.originalListQuery))
      this.getTreeData()
    },
    initData() {
      this.listLoading = true
      inventorySpaceList(this.listQuery).then(res => {
        this.tableData = res.data.whPage.records
        this.total = res.data.whPage.total
        this.stockSts = res.data.stockSts || {}
        this.treeLoading = false
        this.listLoading = false
      }).catch(err => {
        this.treeLoading = false
        this.listLoading = false
      })
    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
      })
    },
    handleNodeClick(data, node) {
      this.$refs.treeSelect.blur()
      if (this.listQuery.warehouseId === data.id) return
      this.listQuery.warehouseId = data.id
      this.listQuery.warehouseName = data.name
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleClear() {
      this.listQuery.warehouseId = ""
      this.listQuery.warehouseName = ""
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode' || prop === 'productName' || prop === 'productSpec' || prop === 'routingName' || prop === 'processName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    isHidden(prop) {
      return !this.hiddenList.some(item => item === prop)
    },
    getSummaries(param) {
      return [
        '总计',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        this.stockSts.totalInventory || 0,
        this.stockSts.totalAvailable || 0,
        this.stockSts.totalOccupancy || 0,
        '',
        this.stockSts.totalDeputyInventory || 0,
        this.stockSts.totalDeputyAvailable || 0,
        this.stockSts.totalDeputyOccupancy || 0,
        ''
      ];
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
}

::v-deep .el-dialog__body {
  margin-bottom: 10px;
}

::v-deep .el-dialog__footer {
  padding: 0 20px 10px;
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

.noPaddingLeft {
  padding-left: 0 !important;
}
</style>