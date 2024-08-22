<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="tableQuery.productDrawingNo" placeholder="品名规格" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="tableQuery.productCode" placeholder="产品编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="tableQuery.warehouseName" placeholder="仓库名称" clearable
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
          <div>
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm('tabForm')">导出</el-button>
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
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableData" custom-column row-key="id" :fixedNo="true"
          @sort-change="sortChange">


          <el-table-column prop="productDrawingNo" label="品名规格" width="200" sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" width="120" sortable="custom" />
          <el-table-column prop="classAttribute" label="产品分类" width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.classAttribute == 'finish_product'">成品</div>
              <div v-if="scope.row.classAttribute == 'raw_material'">原材料</div>
              <div v-if="scope.row.classAttribute == 'semi_finished'">半成品</div>
              <div v-if="scope.row.classAttribute == 'accessories'">配件</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" label="单位" min-width="80" />
          <el-table-column prop="inventoryQuantity" label="库存数量" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.productsId, 'inventoryFlag', scope.row.warehouseId)">
                {{ scope.row.inventoryQuantity }}
              </el-link>
            </template>

          </el-table-column>
          <el-table-column prop="availableQuantity" label="可用数量" width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.productsId, 'availableFlag', scope.row.warehouseId)">
                {{ scope.row.availableQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="occupancyQuantity" label="占用数量" width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.productsId, 'occupancyFlag', scope.row.warehouseId)">
                {{ scope.row.occupancyQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="safeInventory" label="安全库存" width="120" sortable="custom" />
          <el-table-column prop="warehouseName" label="仓库名称" min-width="120" sortable="custom" />
          <el-table-column prop="latestStorageTime" label="最新入库时间" min-width="180" sortable="custom" />

        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.currentPage" :limit.sync="tableQuery.pageSize"
          @pagination="initData">
          <div class="text">
            <span>合计：</span>
            <span style="margin-left: 10px">库存数量：{{ totalData.totalInventory }}</span>
            <span style="margin-left: 10px">可用数量：{{ totalData.totalAvailable }}</span>
            <span style="margin-left: 10px">占用数量：{{ totalData.totalOccupancy }}</span>
          </div>
        </pagination>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getWarehouseList } from '@/api/basicData/index' // 仓库 
import SuperQuery from '@/components/SuperQuery/index.vue'
import { inventoryWarehouseList } from '@/api/warehouseManagement/inventory'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import Form from './Form'

export default {
  name: 'inventory',
  components: { Form, SuperQuery, ExportForm },
  props: {
    classAttribute: "",
  },
  data() {
    return {
      exportFormVisible: false,
      superQueryVisible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],

      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      leftFlag: false,
      tableQuery: {

        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        warehouseName: "",
        pageNum: 1,
        pageSize: 20,
        scrapFlag: false,
        virtuallyFlag: false,
        warehouseId: '',
        productDrawingNo: "",
        productCode: "",
        superQuery: {},
        classAttribute: "finish_product",
      },
      selectedNodeKey: "",
      totalData: {
        totalInventory:0,
        totalOccupancy:0,
        totalAvailable:0,
      },
      superQueryJson: [
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },

        {
          prop: 'classAttribute',
          label: "产品分类",
          type: 'select',
          options: [{ label: "成品", value: "finish_product", }, { label: "原材料", value: "raw_material", }, { label: "半成品", value: "semi_finished", }, { label: "配件", value: "accessories", }]
        },

        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },

        {
          prop: 'availableQuantity',
          label: "可用数量",
          type: 'input',
        },

        {
          prop: 'occupancyQuantity',
          label: "占用数量",
          type: 'input'
        },
        {
          prop: 'safeInventory',
          label: "安全库存",
          type: 'input'
        },
        {
          prop: 'warehouseName',
          label: "仓库名称",
          type: 'input'

        },
        {
          prop: 'latestStorageTime',
          label: '最新入库时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },


      ],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.initData()

  },
  methods: {
    // 导出
    exportForm(exportTableRef) {
      console.log("object,", exportTableRef);
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      console.log(this.$refs[exportTableRef]);
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      console.log("columnList", columnList);
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.tableQuery
      let _data = {
        ...targetListQuery,
        exportType: '1007',
        exportName: "库存查询",
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    superQuerySearch(query) {
      this.tableQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 查看产品明细
    viewFun(id, type, warehouseId) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type, warehouseId)
      })
    },


    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },



    initData() {
      this.tableQuery.classAttribute = this.classAttribute
      inventoryWarehouseList(this.tableQuery).then((res) => {
        console.log(res);
        if (res.data.whPage.records.length) {
          this.tableData = res.data.whPage.records
          this.totalData = res.data.stockSts
          this.total = res.data.whPage.total
        }else{

        }

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.initData()
    },
    reset() {
      if (this.treeData.length > 1) {
        this.selectedNodeKey = this.tableQuery.warehouseId
        this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      }
      this.tableQuery = {
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        warehouseName: "",
        pageNum: 1,
        pageSize: 20,

        scrapFlag: false,
        virtuallyFlag: false,
        warehouseId: '',
        productDrawingNo: "",
        productCode: "",
        superQuery: {},
        classAttribute: this.classAttribute,
      }
      this.initData()
    },




    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.tableQuery.orderItems[0].asc = order === 'ascending'
      this.tableQuery.orderItems[0].column = newProp
      this.initData()
    },


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

.JNPF-common-head {
  padding: 8px
}
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0!important;

  margin-bottom: 5px;
}
</style>
