<template>
  <div class="JNPF-common-layout">
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
              <el-input v-model="listQuery.productSpec" placeholder="请输入规格型号" clearable
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
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" highlight-current-row fixedNO ref="tableForm" :data="tableDataList"
          @sort-change="sortChange" custom-column show-summary :summary-method="getSummaries">
          <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" fixed="left" />
          <el-table-column prop="productName" label="产品名称" width="160" sortable="custom" fixed="left" />
          <el-table-column prop="productSpec" label="规格型号" width="120" sortable="custom" fixed="left" />
          <el-table-column prop="routingName" label="工艺路线名称" width="160" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" width="160" sortable="custom" />
          <el-table-column prop="mainUnit" label="单位(主)" width="120" />
          <el-table-column prop="inventoryQuantity" label="库存数(主)" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleDetail(scope, 'inventoryFlag')">
                {{ scope.row.inventoryQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="availableQuantity" label="可用数(主)" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleDetail(scope, 'availableFlag')">
                {{ scope.row.availableQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="occupancyQuantity" label="占用数(主)" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleDetail(scope, 'occupancyFlag')">
                {{ scope.row.occupancyQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="safeInventory" label="安全库存" width="140" />
          <el-table-column prop="deputyUnit" label="单位(副)" width="120" />
          <el-table-column prop="deputyInventoryQuantity" label="库存数(副)" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleDetail(scope, 'inventoryFlag')">
                {{ scope.row.deputyInventoryQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="deputyAvailableQuantity" label="可用数(副)" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleDetail(scope, 'availableFlag')">
                {{ scope.row.deputyAvailableQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="deputyOccupancyQuantity" label="占用数(副)" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleDetail(scope, 'occupancyFlag')">
                {{ scope.row.deputyOccupancyQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="latestStorageTime" label="最新入库时间" width="180" sortable="custom" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
  </div>
</template>
<script>
import { inventoryList, inventorySpaceList, inventoryWarehouseList } from '@/api/warehouseManagement/inventory'
import Form from '../Form'
export default {
  components: { Form },
  data() {
    return {
      formVisible: false,
      tableDataList: [],
      listLoading: false,
      listQuery: {
        productCode: "",
        productName: "",
        productSpec: "",
        classAttribute: "accessories",
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
        { label: "原材料", value: "accessories" },
        { label: "半成品", value: "semi_finished" },
        { label: "成品", value: "finish_product" },
        { label: "辅料", value: "accessories" },
        { label: "其他", value: "other" }
      ]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode' || prop === 'productName' || prop === 'productSpec' || prop === 'processName' || prop === 'processName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      function getQueryString(name) {
        const url_string = location.href;
        const url = new URL(url_string);
        return url.searchParams.get(name) || void(0);
      }
      this.listLoading = true
      this.listQuery.productCategoryCode =  getQueryString('productCategoryCode')
      inventoryList(this.listQuery).then(res => {
        this.tableDataList = res.data.stockPage.records
        this.total = res.data.stockPage.total
        this.stockSts = res.data.stockSts || {}
        this.listLoading = false
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
      this.initData()
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
  