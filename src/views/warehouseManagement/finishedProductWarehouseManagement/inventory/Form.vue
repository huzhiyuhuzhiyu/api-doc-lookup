<template>
  <div>
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="visible = false">
      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="listQuery.batchNumber" placeholder="批次号" clearable
                    @keyup.enter.native="search()" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="listQuery.partnerName" placeholder="请输入供应商名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="productNameFlag == 1">
                <el-form-item>
                  <el-input v-model="listQuery.productName" placeholder="产品名称" clearable
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
          <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
            <div class="JNPF-common-head">
              <el-button type="primary" size="mini" icon="el-icon-download"
                @click="exportForm('dataTables')">导出</el-button>
                <div class="JNPF-common-head-right">
    
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun()" />
                  </el-tooltip>
                </div>
            </div>
            <JNPF-table v-if="tableDataFlag" :data="tableData" hasNO fixedNO @sort-change="sortChange"     :setColumnDisplayList="columnList"  custom-column ref="dataTable">

              <el-table-column prop="partnerName" label="供应商名称" min-width="200" sortable="custom" />
              <el-table-column prop="partnerCode" label="供应商编码" min-width="200" sortable="custom" />
              <el-table-column prop="productCode" label="产品编码" width="120" sortable="custom" />
              <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160" sortable="custom" />
              <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
              <el-table-column prop="weight" label="重量(KG)" min-width="120" sortable="custom" />
              <el-table-column prop="proportion" label="比重" min-width="120" sortable="custom" />
              <el-table-column prop="processName" label="工序名称" min-width="120" />
              <el-table-column prop="processCode" label="工序编码" min-width="120" />
              <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                v-if="isProjectSwitch == 1" />
              <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
              <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
              <el-table-column prop="inventoryQuantity" v-if="fieldFlag" label="库存数量" width="120" sortable="custom" />
              <el-table-column prop="availableQuantity" label="可用数量" width="120" sortable="custom" />
              <el-table-column prop="occupancyQuantity" v-if="fieldFlag" label="占用数量" width="120" sortable="custom" />
              <el-table-column prop="safeInventory" label="安全库存" min-width="100">
                <template slot-scope="scope">
                  <div>{{ scope.row.safeInventory ? scope.row.safeInventory : 0 }}</div>

                </template>
              </el-table-column>
              <el-table-column prop="batchNumber" label="批次号" min-width="180" sortable="custom" />

              <el-table-column prop="inspectionResults" label="检验结果" sortable="custom" min-width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.inspectionResults == 'qualified'">合格</div>
                  <div v-if="scope.row.inspectionResults == 'unqualified'">不合格</div>
                  <div v-if="scope.row.inspectionResults == 'partially_qualified'">部分合格</div>
                  <div v-if="scope.row.inspectionResults == 'discard'">报废</div>
                  <div v-if="scope.row.inspectionResults == 'concessive_acceptance'">让步接收</div>
                </template>
              </el-table-column>
              <el-table-column prop="warehouseName" label="仓库名称" min-width="180" sortable="custom"> </el-table-column>
              <el-table-column prop="shelfSpaceName" label="库位名称" min-width="120" sortable="custom" />
              <el-table-column prop="specSize" label="规格/尺寸" width="120" sortable="custom" :key="601"></el-table-column>
              <el-table-column prop="logo" label="logo" width="120" sortable="custom" :key="602"></el-table-column>
              <el-table-column prop="divideEqually" label="开等分" width="120" sortable="custom"
                :key="603"></el-table-column>
              <el-table-column prop="material" label="材质" width="120" sortable="custom" :key="604"></el-table-column>
              <el-table-column prop="standardValue" label="规值" sortable="custom" min-width="120"
                v-if="standardValueFlag == 1" />
              <el-table-column prop="colour" label="颜色" sortable="custom" min-width="120" v-if="colourFlag == 1" />
              <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" v-if="sealingCoverTypingFlag == 1"
                sortable="custom"></el-table-column>
              <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" v-if="accuracyLevelFlag == 1"
                sortable="custom"></el-table-column>
              <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" v-if="vibrationLevelFlag == 1"
                sortable="custom"></el-table-column>
              <el-table-column prop="oil" label="油脂" min-width="120" v-if="oilFlag == 1"
                sortable="custom"></el-table-column>
              <el-table-column prop="clearance" label="游隙" min-width="120" v-if="clearanceFlag == 1"
                sortable="custom"></el-table-column>
              <el-table-column prop="aperture" label="孔径" min-width="120" v-if="apertureFlag == 1"
                sortable="custom"></el-table-column>
              <el-table-column prop="packagingMethod" label="包装方式" min-width="120" v-if="packagingMethodFlag == 1"
                sortable="custom"></el-table-column>
              <el-table-column prop="specialRequire" label="特殊要求" min-width="120" v-if="specialRequireFlag == 1"
                sortable="custom"></el-table-column>
              <el-table-column prop="latestStorageTime" label="最新入库时间" min-width="180" fixed="right"
                sortable="custom" />
            </JNPF-table>
            <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
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
      </div>
    </el-dialog>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>


</template>

<script>
import { inventorySpaceList } from '@/api/warehouseManagement/inventory'
import { getWarehouseList, getOrderFiledMap } from '@/api/basicData/index' // 仓库树
import ExportForm from '@/components/no_mount/ExportBox/index'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  mixins: [getProjectList],

  components: { ExportForm },
  data() {
    return {
      columnList:[],
      exportFormVisible: false,
      title: "明细",
      tableData: [],
      visible: false,
      treeLoading: false,
      listLoading: false,
      standardValueList: [],
      vibrationLevelList: [],
      originalListQuery: {},
      total: 0,
      totalData: {
        totalInventory: 0,
        totalAvailable: 0,
        totalOccupancy: 0,
      },

      listQuery: {
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 20,
        partnerName:"",
        scrapFlag: false,
        virtuallyFlag: false,
        warehouseId: '',
        productDrawingNo: "",
        productsId: "",
        batchNumber: "",
        vibrationLevel: '',
        standardValue: '',
        fieldFlag: true,
        tableDataFlag: false,
        mainUnitFlag: null,
        isProjectSwitch: '',
        productNameFlag: null,
        // 属性字段  控制属性字段显示隐藏
        accuracyLevelFlag: "",
        clearanceFlag: "",
        oilFlag: "",
        oilQuantityFlag: "",
        packagingMethodFlag: "",
        sealingCoverTypingFlag: "",
        specialRequireFlag: "",
        vibrationLevelFlag: "",
        bimProductAttributesList: [],
        standardValueFlag: "",
        colourFlag: "",
        processFlag: "",
      }
    }
  },
  async created() {
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    this.getConfig()
    this.isProjectSwitchFlag = true

  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getMainUnitFun('deputyUnit', 'warehouseDeputyUnit')

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
    getConfig() {
      let objs = { "pageSize": -1, "businessCode": "product" }
      getBimBusinessSwitchConfigList(objs).then(res => {
        this.productNameFlag = res.data.product[1].configValue1
        console.log(this.productNameFlag);
        this.tableDataFlag = true

      }).catch(error => {
        this.tableFlag = true
      })
    },
    async getMainUnitFun(code, type) {
      this.listLoading = true
      try {
        this.mainUnitFlag = await this.jnpf.getMainUnitFun(code, type);
        this.tableDataFlag = true
        this.listLoading = false


      } catch (error) {
      }
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
    init(id, type, flag) {
      this.getProductClassFun()
      this.fieldFlag = flag || true
      if (type === 'inventoryFlag') { this.title = '库存数明细' }
      else if (type === 'occupancyFlag') { this.title = '占用数明细' }
      else if (type === 'availableFlag') { this.title = '可用数明细' }
      this.visible = true
      let tempListQuery = {

        productsId: id,
        batchNumber: "",
        availableFlag: 0, // 可用数标识（0 否 1是）默认否
        inventoryFlag: 0, // 库存数标识（0 否 1是）默认否
        occupancyFlag: 0, // 占用数标识（0 否 1是）默认否
        virtuallyFlag: false,
        scrapFlag: false,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "latest_storage_time"
        }],
        pageNum: 1,
        pageSize: 20,
        vibrationLevel: '',
        standardValue: '',
      }
      tempListQuery[type] = 1
      this.originalListQuery = tempListQuery
      this.listQuery = JSON.parse(JSON.stringify(this.originalListQuery))
      this.initData()
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
      this.initData()
    },
    initData() {
      this.listLoading = true
      inventorySpaceList(this.listQuery).then(res => {
        this.treeLoading = false
        this.listLoading = false


        this.tableData = res.data.whPage.records
        this.total = res.data.whPage.total
        this.totalData = res.data.stockSts || {
          totalInventory: 0,
          totalAvailable: 0,
          totalOccupancy: 0,
        }


      }).catch(err => {
        this.treeLoading = false
        this.listLoading = false
      })
    },


    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode'||prop=='partnerCode'||prop=='partnerName'||prop=='productDrawingNo' || prop === 'productName' || prop === 'productSpec' || prop === 'routingName' || prop === 'processName' || prop == 'shelfSpaceName' || prop == 'warehouseName') { newProp = prop }
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