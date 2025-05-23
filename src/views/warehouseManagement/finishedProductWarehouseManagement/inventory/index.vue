<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
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
              <el-button type="primary" icon="el-icon-search" @click="search('basic')" class="commonBox">
                {{ $t('common.search') }}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
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
        <JNPF-table ref="tabForm" v-if="tableDataFlag == true" :data="tableData" custom-column row-key="id"
          :fixedNo="true" @sort-change="sortChange" :header-cell-class-name="handleHeaderCellClass" customKey="JNPFTableKey_263873">


          <el-table-column prop="productCode" label="产品编码" width="120" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160"
            sortable="custom" />
          <el-table-column prop="productDrawingNo" label="品名规格" width="300" sortable="custom" />
          <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
          <el-table-column prop="classAttribute" label="产品分类" width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.classAttribute == 'finish_product'">成品</div>
              <div v-if="scope.row.classAttribute == 'raw_material'">原材料</div>
              <div v-if="scope.row.classAttribute == 'semi_finished'">半成品</div>
              <div v-if="scope.row.classAttribute == 'accessories'">配件</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
          <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />

          <el-table-column prop="inventoryQuantity" label="库存数量" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row, 'inventoryFlag', scope.row.warehouseId, projectId)">
                {{ scope.row.inventoryQuantity }}
              </el-link>
            </template>

          </el-table-column>
          <el-table-column prop="availableQuantity" label="可用数量" width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row, 'availableFlag', scope.row.warehouseId, projectId)">
                {{ scope.row.availableQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="occupancyQuantity" label="占用数量" width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row, 'occupancyFlag', scope.row.warehouseId, projectId)">
                {{ scope.row.occupancyQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="safeInventory" label="安全库存" width="120" sortable="custom" />
          <el-table-column prop="warehouseName" label="仓库名称" min-width="120" sortable="custom" />
          <el-table-column prop="latestStorageTime" label="最新入库时间" min-width="180" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" min-width="180" sortable="custom" />
          <el-table-column prop="specSize" label="规格/尺寸" width="120" sortable="custom"></el-table-column>
          <el-table-column prop="logo" label="logo" width="120" sortable="custom"></el-table-column>
          <el-table-column prop="divideEqually" :label="$store.getters.divideEqually" width="120" sortable="custom"></el-table-column>
          <el-table-column prop="material" label="材质" width="120" sortable="custom"></el-table-column>

          <el-table-column prop="pairingModeName" label="配对方式" width="160" v-if="isXBN" sortable="custom" />
          <el-table-column prop="standardValue" label="规值" sortable="custom" min-width="120" />
          <el-table-column prop="colour" :label="$store.getters.colour"  sortable="custom" min-width="120" />
          <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  min-width="140" v-if="sealingCoverTypingFlag == 1"
            sortable="custom"></el-table-column>
          <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  min-width="120" v-if="accuracyLevelFlag == 1"
            sortable="custom"></el-table-column>
            <el-table-column prop="wireHeatNumber" v-if="isXY||isJR" label="钢丝炉号" width="120" />
            <el-table-column prop="rawStockMill" v-if="isXY||isJR" label="原材料厂家" width="120" />
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
          <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  min-width="120" v-if="specialRequireFlag == 1"
            sortable="custom"></el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :limit.sync="tableQuery.pageSize"
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
import { getclassAttributelistByCode } from '@/api/masterDataManagement/index'
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
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'productCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        // { field: 'warehouseName', fieldValue: '', label: '仓库名称', symbol: 'like', searchType: 1, width: 120 },
      ],
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
        productCode:"",
        productDrawingNo:"",
        totalInventoryFlag :false,
        scrapFlag: false,
        virtuallyFlag: false,
        warehouseId: '',
        productDrawingNo: "",
        productCode: "",
        superQuery: {},
        classAttribute: "",
        inventoryFlag: 1,
        projectId:"",
      },
      selectedNodeKey: "",
      totalData: {
        totalInventory: 0,
        totalOccupancy: 0,
        totalAvailable: 0,
      },
      superQueryJson: [
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: "品名规格",
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
          prop: 'inventoryQuantity',
          label: "库存数量",
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
      classAttributeList: [],
      productNameFlag: null,
      tableDataFlag: false,
      isProjectSwitch: '',
      projectId:"",
      warehouseInfo:{},

      // 排序数组
      sortArr: [{
        asc: false,
        column: "create_time"
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
    await this.getProjectSwitch('system', 'project')
    await this.getWarehouseListFun()
    this.superForm = this.tableQuery
    this.getConfig()


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
        if (this.productNameFlag == '1') {

          this.searchList.splice(1, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 })
          this.superQueryJson.splice(1, 0, {
            prop: 'productsName',
            label: '产品名称',
            type: 'input'
          })
        }
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
      getclassAttributelistByCode({ code: this.warehouseCode }).then(res => {
        console.log("类别属性", res);
        this.classAttributeList = res.data

        this.search('basic')
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
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search()
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



    initData() {
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
    search(type) {
      if (type === 'basic') {
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
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      if (this.treeData.length > 1) {
        this.selectedNodeKey = this.tableQuery.warehouseId
        this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      }
      this.superForm = this.tableQuery = {
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        warehouseName: "",
        pageNum: 1,
        pageSize: 20,
          totalInventoryFlag:false,
        inventoryFlag: 1,
        scrapFlag: false,
        virtuallyFlag: false,
        warehouseId: '',
        productDrawingNo: "",
        productCode: "",
        superQuery: {},
        classAttributeList: this.classAttributeList,
      }
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'productCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'warehouseName', fieldValue: '', label: '仓库名称', symbol: 'like', searchType: 1, width: 120 },
      ]

      this.getConfig()
      this.initData()
    },
    // 设置列的排序为自定义的排序
    handleHeaderCellClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      }
    },
    sortChange({ prop, order }) {
      let newProp;

      if (['productCode', 'productName', 'productDrawingNo', 'warehouseName'].includes(prop)) {
        newProp = prop;
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }

      const index = this.sortStack.indexOf(prop);

      // 如果取消排序（再次点击同一个字段）
      if (!order || this.sortField[prop] === order) {
        this.sortField[prop] = null;
        if (index > -1) {
          this.sortStack.splice(index, 1); // 删除该字段
        }
      } else {
        this.sortField[prop] = order;
        // 无论字段是否存在，先移除旧位置再添加到头部
        if (index > -1) {
          this.sortStack.splice(index, 1);
        }
        this.sortStack.unshift(prop); // 最新排序字段始终在首位
      }

      // 构建排序数组（按照 sortStack 顺序）
      this.sortArr = this.sortStack.map(key => ({
        column: key,
        asc: this.sortField[key] === 'ascending'
      }));

      // // 添加默认排序字段（仅当无自定义排序时）
      // const defaultSort = 'create_time'
      // if (this.sortArr.length === 0) {
      //   this.sortArr.push({ column: defaultSort, asc: false });
      // } else {
      //   // 若已存在默认排序字段，则替换或忽略
      //   const existsDefault = this.sortArr.some(item => item.column === defaultSort);
      //   if (!existsDefault) {
      //     this.sortArr.push({ column: defaultSort, asc: false });
      //   }
      // }

      // 更新请求参数
      this.tableQuery.orderItems = this.sortArr;

      this.initData();
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
