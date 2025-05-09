<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="visible = false">
      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
        <div class="JNPF-common-layout-center JNPF-flex-main">

          <div class="JNPF-common-layout-main JNPF-flex-main">
            <div class="JNPF-common-head">
              <div></div>
              <div class="JNPF-common-head-right">

                <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                  <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                    @click="columnSetFun()" />
                </el-tooltip>
              </div>
            </div>
            <JNPF-table v-loading="listLoading" :data="tableData" hasNO fixedNO @sort-change="sortChange" custom-column
              ref="dataTable">
              <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="160"
                sortable="custom"></el-table-column>
              <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom"></el-table-column>
              <el-table-column prop="processCode" label="工序编码" min-width="160" sortable="custom"></el-table-column>
              <el-table-column prop="productDrawingNo" label="成品规格" min-width="160" sortable="custom"></el-table-column>
              <el-table-column prop="processingType" label="加工类型" min-width="120" sortable="custom">
                <template slot-scope="scope">
                  <div>{{ scope.row.processingType == "self_produced" ? '自制' : "外协" }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="workGroupName" label="班组" min-width="120" sortable="custom" />
              <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom" />
              <el-table-column prop="planEndDate" label="计划结束日期" min-width="180" sortable="custom" />
              <el-table-column prop="mainUnit" label="单位" min-width="80" />
              <el-table-column prop="productionQuantity" label="生产数量" min-width="120" sortable="custom" />
              <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="120" sortable="custom" />
              <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="140" sortable="custom" />
              <el-table-column prop="waitReportNum" label="可报工数量" min-width="140" sortable="custom" />
            </JNPF-table>
            <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
              @pagination="initData">

            </pagination>
          </div>
        </div>
      </div>
    </el-dialog>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>


</template>

<script>
import { inventorySpaceList } from '@/api/warehouseManagement/inventory'
import { getWarehouseList, getOrderFiledMap } from '@/api/basicData/index' // 仓库树
import { getWorkList } from '@/api/productOrdes/index.js'
import ExportForm from '@/components/no_mount/ExportBox/index'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: { ExportForm },
  mixins: [getProjectList],
  data() {
    return {
      exportFormVisible: false,
      title: "明细",
      tableData: [],
      visible: false,
      treeLoading: false,
      listLoading: false,
      standardValueList: [],
      vibrationLevelList: [],
      originalListQuery: {

      },
      total: 0,
      listQuery: {
      },
      searchList: [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],
    }
  },
  async created() {
    await this.getOrderFiledMap()

    await this.getProjectSwitch('system', 'project')


  },
  methods: {
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    getOrderFiledMap() {
      getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
      })
      getOrderFiledMap('purchase').then(res => {
        this.standardValueFlag = res.data.standardValue
        this.colourFlag = res.data.colour
        this.processFlag = res.data.process
      })
    },
    // 导出
    exportForm(exportTableRef) {
      console.log("object,", exportTableRef);
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      console.log(this.$refs[exportTableRef].$refs.JNPFTable);
      let columnList = this.$refs[exportTableRef].$refs.JNPFTable.columns.filter(item => !!item.label && !!item.property)
      columnList = columnList.filter(item => !(item.label === "序号" && item.property === "index"));
      console.log("columnList", columnList);
      columnList = columnList.map(item => { return { label: item.label, prop: item.property } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.listQuery
      let _data = {
        ...targetListQuery,
        exportType: '1008',
        exportName: this.title,
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },

    init(row, type, processName) {
      if (type === 'inventoryFlag') { this.title = '可报工数明细' }
      else if (type === 'occupancyFlag') { this.title = '占用数明细' }
      else if (type === 'availableFlag') { this.title = '可用数明细' }
      this.visible = true
      let tempListQuery = {
        productsId: row.productsId,
        processName: processName,
        productionPlanNo: "",
        orderNo: "",
        prodOrderStatus: "normal",
        classAttribute: "semi_finished",
        workReportFlag: true,
        standardValue: row.standardValue,
        accuracyLevel: row.accuracyLevel,
        wireHeatNumber: row.wireHeatNumber,
        rawStockMill: row.rawStockMill,
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        // superQuery: {
        //   matchLogic: 'AND',
        //   condition: [
        //     { field: 'productDrawingNo', fieldValue: drawingNo, label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        //   ],
        // }
      }

      this.originalListQuery = tempListQuery
      this.listQuery = JSON.parse(JSON.stringify(this.originalListQuery))
      setTimeout(() => {
        this.initData()
      }, 500);
    },
    search(type) {
      if (type === 'basic') {
        console.log(this.searchList, 'this.searchList')
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.listQuery.superQuery = this.basicQuery
      }
      this.initData()
    },
    reset() {
      this.listQuery = JSON.parse(JSON.stringify(this.originalListQuery))
      this.initData()
    },
    initData() {
      this.listLoading = true
      getWorkList(this.listQuery).then(res => {
        this.treeLoading = false
        this.listLoading = false
        this.tableData = res.data.records
        this.total = res.data.total


      }).catch(err => {
        this.treeLoading = false
        this.listLoading = false
      })
    },


    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode' || prop === 'productName' || prop === 'productSpec' || prop === 'routingName' || prop === 'processName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },


  }
}
</script>

<style lang="scss" scoped>
::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 !important;
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

.tableContainer {
  padding: 0 10px;
}
</style>