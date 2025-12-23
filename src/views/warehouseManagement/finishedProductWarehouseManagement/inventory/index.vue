<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <JNPF-tableQuery v-if="classAttributeList.length" :listQuery="tableQuery" :systemSearchView="systemSearchView" tableRef="tabForm" :searchList="searchList" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <div>
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm('tabForm')">导出</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.tabForm.showSortDrawer()" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="tabForm"  :data="tableData" custom-column row-key="id"
          :fixedNo="true" :header-cell-class-name="handleHeaderCellClass" customKey="JNPFTableKey_263873" :listQuery="tableQuery" @queryChange="initData" :queryJson="superQueryJson">


          <el-table-column prop="productCode" label="产品编码" width="120" />
          <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160" />
          <el-table-column prop="productDrawingNo" label="品名规格" width="300" />
          <el-table-column prop="projectName" label="所属项目" min-width="120"
            v-if="isProjectSwitch == 1" />
          <el-table-column prop="classAttribute" label="产品分类" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.classAttribute == 'finish_product'">成品</div>
              <div v-if="scope.row.classAttribute == 'raw_material'">原材料</div>
              <div v-if="scope.row.classAttribute == 'semi_finished'">半成品</div>
              <div v-if="scope.row.classAttribute == 'accessories'">配件</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
          <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />

          <el-table-column prop="inventoryQuantity" label="库存数量" min-width="120">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row, 'inventoryFlag', scope.row.warehouseId, projectId)">
                {{ scope.row.inventoryQuantity }}
              </el-link>
            </template>

          </el-table-column>
          <el-table-column prop="availableQuantity" label="可用数量" width="120">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row, 'availableFlag', scope.row.warehouseId, projectId)">
                {{ scope.row.availableQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="occupancyQuantity" label="占用数量" width="120">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row, 'occupancyFlag', scope.row.warehouseId, projectId)">
                {{ scope.row.occupancyQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="safeInventory" label="安全库存" width="120" />
          <el-table-column prop="warehouseName" label="仓库名称" min-width="120" />
          <el-table-column prop="latestStorageTime" label="最新入库时间" min-width="180" />
          <el-table-column prop="processName" label="工序名称" min-width="180" />

          <el-table-column prop="pairingModeName" label="配对方式" width="160" v-if="isXBN" />
          <AttributeColumns :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'warehouse'" />
            <el-table-column prop="wireHeatNumber" v-if="isXY||isJR" label="钢丝炉号" width="120" />
            <el-table-column prop="rawStockMill" v-if="isXY||isJR" label="原材料厂家" width="120" />
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :limit.sync="tableQuery.pageSize" @pagination="initData()">
          <div class="text">
            <span>合计：</span>
            <span style="margin-left: 10px">库存数量：{{ totalData.totalInventory }}</span>
            <span style="margin-left: 10px">可用数量：{{ totalData.totalAvailable }}</span>
            <span style="margin-left: 10px">占用数量：{{ totalData.totalOccupancy }}</span>
          </div>
        </pagination>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData()" />
    <!-- 高级查询 -->

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getWarehouseList } from '@/api/basicData/index' // 仓库
import SuperQuery from '@/components/SuperQuery/index.vue'
import { inventoryWarehouseList } from '@/api/warehouseManagement/inventory'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getClassAttributeListByCode } from '@/api/masterDataManagement/index'
import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import { getWarehouseTree } from '@/api/warehouseManagement/inboundAndOutbound'
import {  getOrderFiledMap } from '@/api/basicData/index'
import tenantMinix from "@/mixins/generator/TenantMinix";

import Form from './Form'

export default {
  name: 'inventory',
  components: { Form, SuperQuery, ExportForm },
  props: {
    warehouseCode: "",
  },
  mixins: [getProjectList,tenantMinix],

  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
          {
            asc: true,
            column: ''
          }
        ]
        },
      }],
      searchList: [
        { prop: 'productionLineId', label: '产线', type: 'select', options: this.$store.getters.productionLineList },
      ],
      inventoryFlagList:[
        {label:"库存大于0",value:1},
        {label:"全部库存",value:0},
      ],
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

      tableFlag: false,
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
        totalInventoryFlag :false,
        scrapFlag: false,
        virtuallyFlag: false,
        inventoryFlag: 1,
      },
      selectedNodeKey: "",
      totalData: {
        totalInventory: 0,
        totalOccupancy: 0,
        totalAvailable: 0,
      },
      superQueryJson: [{
  prop: 'classAttribute',
  label: "产品分类",
  type: 'select',
  options: [{
    label: "成品",
    value: "finish_product"
  }, {
    label: "原材料",
    value: "raw_material"
  }, {
    label: "半成品",
    value: "semi_finished"
  }, {
    label: "配件",
    value: "accessories"
  }]
}],
      classAttributeList: [],
      productNameFlag: null,
      tableDataFlag: false,
      isProjectSwitch: '',
      projectId:"",
      warehouseInfo:{},

      // 排序数组
      sortArr: [{
        asc: false,
        column: "createTime"
      }],
      sortField: {}, // 存储每个字段的排序方式 ascending/descending
      sortStack: [], // 记录排序字段点击顺序
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  async created() {
    await this.getOrderFiledMap()
    // await this.getProjectSwitch('system', 'project')
    await this.getWarehouseListFun()
    this.getConfig()

console.log(this.$store.getters.productionLineList)
  },
  computed: {
    ...mapGetters(['userInfo'])
  },

  mounted() {
    this.getMainUnitFun('deputyUnit', 'warehouseDeputyUnit')

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
    // 获取仓库
    getWarehouseListFun() {
      getWarehouseTree({ code: this.warehouseCode }).then(res => {
        // 获取仓库详情信息
        this.projectId= this.isProjectSwitch === '1' ? res.data[0].projectId || '' : ''
        this.warehouseInfo=res.data[0]
        this.getclassAttributeList()
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
        this.listLoading = false


      } catch (error) {
      }
    },
    getclassAttributeList() {
      getClassAttributeListByCode({ code: this.warehouseCode }).then(res => {
        console.log("类别属性", res);
        this.classAttributeList = res.data
      })
    },
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

    // 查看产品明细
    viewFun(row, type, warehouseId, projectId) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(row, type, warehouseId, projectId)
      })
    },


    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },



    initData(listQuery) {
      if (listQuery) this.tableQuery = listQuery;
      if (!this.tableQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.tableQuery.classAttributeList = this.classAttributeList
      this.listLoading = true
      this.tableQuery.projectId=this.projectId
      this.tableQuery.warehouseId=this.warehouseInfo.id
      inventoryWarehouseList(this.tableQuery).then((res) => {
        console.log(res);
        this.tableData = res.data.whPage.records || []
        this.totalData = res.data.stockSts || {
          totalInventory: 0,
          totalOccupancy: 0,
          totalAvailable: 0,
        }
        this.total = res.data.whPage.total


        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },


    // 设置列的排序为自定义的排序
    handleHeaderCellClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      }
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
  margin-left: 0 !important;

  margin-bottom: 5px;
}
</style>
