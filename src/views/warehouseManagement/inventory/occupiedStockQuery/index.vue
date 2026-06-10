<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入型号" clearable
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
        <JNPF-table v-loading="listLoading" highlight-current-row fixedNO ref="tableForm" :data="tableDataList"
          @sort-change="sortChange" custom-column customKey="JNPFTableKey_552659">
          <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom" />
          <el-table-column prop="productDrawingNo" label="型号" min-width="400" sortable="custom" />
          <el-table-column prop="productSpec" label="规格型号" min-width="120" />
          <el-table-column prop="routingName" label="工艺路线名称" min-width="160" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom" />
          <el-table-column prop="warehouseName" label="仓库" min-width="160" sortable="custom" />

          <el-table-column prop="mainUnit" label="单位(主)" min-width="120" />
          <el-table-column prop="occupancyQuantity" label="占用数(主)" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleDetail(scope)">
                {{ scope.row.occupancyQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="availableQuantity" label="可用数(主)" min-width="140" />
          <el-table-column prop="deputyUnit" label="单位(副)" width="120" />
          <el-table-column prop="deputyOccupancyQuantity" label="占用数(副)" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleDetail(scope)">
                {{ scope.row.deputyOccupancyQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="deputyAvailableQuantity" label="可用数(副)" min-width="140" />
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
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入型号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号">
              <el-input v-model="listQuery.productSpec" placeholder="请输入规格型号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺路线名称">
              <el-input v-model="listQuery.routingName" placeholder="请输入工艺路线名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="listQuery.processName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库">
              <el-input v-model="listQuery.warehouseName" placeholder="请输入仓库" clearable />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
    <Form :listRequestObj="lineQuery" :listMethod="occupyStockList" :tableItems="tableItems" :searchList="searchList"
      v-if="formVisible" ref="Form" @close="closeForm" />
  </div>
</template>
<script>
import { inventoryList, inventorySpaceList, inventoryWarehouseList, occupyStockList } from '@/api/warehouseManagement/inventory'
import Form from './form'
export default {
  components: { Form },
  data() {
    return {
      occupyStockList,
      formVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [],
      listLoading: false,
      listQuery: {
        productCode: "",
        productName: "",
        productSpec: "",
        classAttribute: "",
        occupancyFlag: 1,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "productName"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      lineQuery: {
        batchNumber: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        occupyNo: "",
        occupyType: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }, {
            asc: true,
            column: "createTime"
          }
        ],
        pageNum: 1,
        pageSize: 20,
        productsId: '',
        routingLineId: '',
        shelfSpaceId: '',
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        warehouseId: '',
        createTimeArr:[]
      },
      tableItems: [
        { prop: 'occupyType', label: '占用类型' ,sortable:true},
        { prop: 'occupyNo', label: '占用单号',sortable:true },
        { prop: 'batchNumber', label: '批次号' },
        { prop: 'shelfSpaceName', label: '库位' },
        { prop: 'mainUnit', label: '单位' },
        { prop: 'num', label: '占用数量' },
        { prop: 'createTime', label: '占用时间',sortable:true },
      ],
      searchList:[
        { prop: "occupyType", label: '占用类型', type: 'select', options: [{ label: '订单占用库存 ', value: 'order', }, { label: '计划占库存 ', value: 'plan', }] },
        { prop: 'occupyNo', label: '占用单号', type: 'input' },
        { prop: 'batchNumber', label: '批次号', type: 'input' },
        { prop: 'shelfSpaceName', label: '库位', type: 'input' },
        { prop: 'createTimeArr', label: '占用时间', type: 'date',placeholder:'占用' },
      ],
      total: 0,

    }
  },
  created() {
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode' || prop === 'productName' || prop === 'productDrawingNo' || prop === 'productSpec'|| prop === 'routingName'|| prop === 'processName'|| prop === 'warehouseName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      inventoryWarehouseList(this.listQuery).then(res => {
        this.tableDataList = res.data.whPage.records
        this.total = res.data.whPage.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
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
        occupancyFlag: 1,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "productName"
        }],
        pageNum: 1,
        pageSize: 20,
      }
      this.initData()
    },

    handleDetail(scope) {
      this.formVisible = true
      this.lineQuery.productsId = scope.row.productsId
      this.lineQuery.warehouseId = scope.row.warehouseId
      this.$nextTick(() => {
        this.$refs.Form.getData()
      })
    },
    // 关闭明细页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },

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
  