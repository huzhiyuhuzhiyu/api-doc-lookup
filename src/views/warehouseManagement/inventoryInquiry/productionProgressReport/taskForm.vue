<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="visible = false">
      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <!-- <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <template v-for="item in searchList">
                <el-col :span="item.searchType === 3 ? 6 : 4">
                  <el-form-item>
                    <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                      @keyup.enter.native="search('basic')" />

                    <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                      clearable>
                      <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                        :value="item2.value"></el-option>
                    </el-select>
                    <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                      :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                      :type="item.dateType"
                      :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                  </el-form-item>
                </el-col>
              </template>
<el-col :span="6">
  <el-form-item>
    <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
      {{ $t('common.search') }}
    </el-button>
    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
      {{ $t('common.reset') }}
    </el-button>
  </el-form-item>
</el-col>
</el-form>
</el-row> -->
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <JNPF-table v-loading="listLoading" :data="tableData" hasNO fixedNO @sort-change="sortChange"
              ref="dataTables">
              <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom"></el-table-column>
              <el-table-column prop="processCode" label="工序编码" min-width="160" sortable="custom"></el-table-column>
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
    // 获取规值 振动等级
    getProductClassFun() {
      let obj0 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa008",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj0).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });

        this.standardValueList = arr
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj3).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        this.vibrationLevelList = arr
      })
    },
    init(drawingNo, type, warehouseId) {
      this.getProductClassFun()
      if (type === 'inventoryFlag') { this.title = '生产任务' }
      else if (type === 'occupancyFlag') { this.title = '占用数明细' }
      else if (type === 'availableFlag') { this.title = '可用数明细' }
      this.visible = true
      let tempListQuery = {
        productDrawingNo: drawingNo,
        productionPlanNo: "",
        orderNo: "",
        orderStatus: "normal",
        classAttribute: "semi_finished",
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