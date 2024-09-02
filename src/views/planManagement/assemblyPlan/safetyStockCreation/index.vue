<template>
  <!-- 销售订单创建 -->
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="productDrawingNoS" @keyup.enter.native="search()" placeholder="品名规格" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="productCodeS" @keyup.enter.native="search()" placeholder="产品编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier()" :addText="'生成计划'">
              <el-button type="primary" size="mini" icon="el-icon-download"
                @click="exportForm('dataTable')">导出</el-button>
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column
            @selection-change="handleSelectionChange" hasC>
            <el-table-column prop="drawingNo" label="品名规格" min-width="160" sortable="custom" />
            <el-table-column prop="code" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="productCategoryName" label="产品分类" min-width="120" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="80" />
            <el-table-column prop="safeInventory" label="安全库存" min-width="120" />
            <el-table-column prop="inventoryQuantity" label="可用库存" min-width="120" />

          </JNPF-table>

          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData">

          </pagination>

        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />


    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { excelExport } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, getSaleordersTotal, getOrderLineReport } from '@/api/salesManagement/assemblyOrders'
import Form from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { getProducts, getDetailByDrawNo } from '@/api/masterDataManagement/index.js' // 产品列表 
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'salesOrderCreation',
  components: { Form, ExportForm, SuperQuery },
  data() {
    return {
      productCodeS: "",
      productDrawingNoS: "",
      columnList: ["cooperativePartnerName", "cooperativePartnerCode",   "productCode", "createTime", 'createByName'],
      superQueryVisible: false,
      exportFormVisible: false,
      tableData: [],
      listLoading: false,
      form: {
        classAttribute: "finish_product",
        productDrawingNo: "",
        productCode: "",
        productStatus: 'enable',
        safeInventoryWarnFlag: 1,
        purchaseFlag: false,
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      },


      total: 0,
      formVisible: false,
      superQueryJson: [



        {
          prop: 'drawingNo',
          label: "品名规格",
          type: 'input'
        },

        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'productCategoryName',
          label: "产品分类",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'safeInventory',
          label: "安全库存",
          type: 'input'
        },
        {
          prop: 'inventoryQuantity',
          label: "库存数量",
          type: 'input'
        },




      ],
      selectList: [],
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
    handleSelectionChange(val) {
      this.selectList = val
    },







    superQuerySearch(query) {
      this.form.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },





    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.form.orderItems[0].asc = order === "ascending"
      this.form.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },


    dataFormSubmit() {
      this.form.pageNum = 1
      Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })


      this.initData()

    },


    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      if (this.productCodeS) {

        if (this.form.superQuery.condition.length) {
          let filteredData = this.form.superQuery.condition.filter(obj => !obj.field.includes("code"));
          filteredData.push({ "field": "code", "fieldValue": this.productCodeS, "symbol": "like" })
          this.form.superQuery.condition = filteredData
        } else {
          this.form.superQuery.condition.push(
            { "field": "code", "fieldValue": this.productCodeS, "symbol": "like" }
          )
        }
      }
      if (this.productDrawingNoS) {

        if (this.form.superQuery.condition.length) {
          let filteredData = this.form.superQuery.condition.filter(obj => !obj.field.includes("drawingNo"));
          filteredData.push({ "field": "drawingNo", "fieldValue": this.productDrawingNoS, "symbol": "like" })
          this.form.superQuery.condition = filteredData
        } else {
          this.form.superQuery.condition.push(
            { "field": "drawingNo", "fieldValue": this.productDrawingNoS, "symbol": "like" }
          )
        }
      }

      if (this.productCodeS || this.productDrawingNoS) {
        this.$set(this.form.superQuery, 'matchLogic', 'AND')
      } else {
        this.form.superQuery = {
          condition: [],
          matchLogic: ""
        }
      }
      getProducts(this.form).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.getOrderLineReportFun()
      }).catch(() => {
        this.listLoading = false
      })

    },


    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.deliveryDateArr = []
      this.form = {
        classAttribute: "finish_product",
        productDrawingNo: "",
        productCode: "",
        productStatus: 'enable',
        safeInventoryWarnFlag: 1,
        purchaseFlag: false,
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,

        superQuery: {
          condition: [],
          matchLogic: ""
        },
      }
      this.$refs.SuperQuery.conditionList = []

      this.productCodeS = "",
        this.productDrawingNoS = "",
        this.search()
    },


    addSupplier() {
      console.log(this.selectList);
      if (!this.selectList.length) return this.$message.error("请选择您要生成计划的数据")
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.selectList)
      })

    },




    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.form
      let _data = {
        ...targetListQuery,
        exportType: '1200',
        exportName: '安全库存',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
  }
}
</script>
<style scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}



.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}

.JNPF-common-head {
  padding: 8px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #f5f5f5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

.aaa ::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}
</style>
