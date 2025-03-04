<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2>仓库分类</h2>
          <span class="options">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getWarehouseTree(true)">刷新数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:200px;margin:10px auto;display:block"
            suffix-icon="el-icon-search" clearable></el-input>
        </div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          :default-expanded-keys="[selectedNodeKey]" v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i :class="[
              data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm'
            ]" />
            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="5">
            <el-form-item>
              <el-select v-model="tableQuery.shelvesIds" multiple collapse-tags placeholder="库位">
                <el-option v-for="item in shelvesData" :key="item.value" :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
              <el-button type="primary" icon="el-icon-search" @click="search('basic', 'search')" class="commonBox">
                {{ $t('common.search') }}
              </el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <div>
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm('tabForm')">
              导出
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="advancedQueryFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table v-if="isProjectSwitchFlag" v-loading="listLoading" custom-column :data="tableData" hasNO fixedNO
          @sort-change="sortChange" ref="tabForm">
          <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" />
          <el-table-column prop="inventoryQuantity" label="库存" width="160" sortable="custom" />
          <el-table-column prop="mainUnit" label="单位" width="80" />
          <el-table-column prop="remark" label="备注" width="160" />
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :limit.sync="tableQuery.pageSize"
          @pagination="search('basic')">
          <!-- <div class="text">
            <span>合计：</span>
            <span style="margin-left: 10px">库存数量：{{ totalData.inventoryQuantity }}</span>
            <span style="margin-left: 10px">可用数量：{{ totalData.availableQuantity }}</span>
            <span style="margin-left: 10px">占用数量：{{ totalData.occupancyQuantity }}</span>
          </div> -->
        </pagination>
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getWarehouseList, getInventoryLineReport } from '@/api/basicData/index' // 仓库
import SuperQuery from '@/components/SuperQuery/index.vue'
import { inventoryWarehouseList } from '@/api/warehouseManagement/inventory'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import { getBimBusinessSwitchConfigList, getWarehouseInfo, excelExport } from '@/api/basicData/index'
import { getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import { getList } from '@/api/basicData/stockGoodsShelves'
export default {
  name: 'angularContactReport',
  components: { SuperQuery, ExportForm },
  mixins: [getProjectList],
  data() {
    return {
      colourFlag: '',
      processFlag: '',
      isProjectSwitchFlag: false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 }
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
      totalData: {
        inventoryQuantity: 0,
        availableQuantity: 0,
        occupancyQuantity: 0
      },
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      leftFlag: false,
      tableQuery: {
        totalInventoryFlag: false,
        // projectId: '1860848897609494530',
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 20,

        scrapFlag: false,
        virtuallyFlag: false,
        warehouseId: '',
        productDrawingNo: '',
        productCode: '',
        superQuery: {},
        lineFlag: 1
      },
      selectedNodeKey: '',
      superQueryJson: [
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'processName',
          label: '工序名称',
          type: 'input'
        },
        {
          prop: 'processCode',
          label: '工序编码',
          type: 'input'
        },
        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'input'
        },

        {
          prop: 'warehouseName',
          label: '仓库名称',
          type: 'input'
        },
        {
          prop: 'latestStorageTime',
          label: '最新入库时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        }
      ],
      isProjectSwitch: '',
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: '',
      clearanceFlag: '',
      oilFlag: '',
      oilQuantityFlag: '',
      packagingMethodFlag: '',
      sealingCoverTypingFlag: '',
      specialRequireFlag: '',
      vibrationLevelFlag: '',
      bimProductAttributesList: [],
      standardValueFlag: '',
      colourFlag: '',
      shelvesData: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },

  computed: {
    ...mapGetters(['userInfo'])
  },

  async created() {
    await this.getProjectSwitch('system', 'project')
    this.isProjectSwitchFlag = true
    this.superForm = this.tableQuery
    this.getWarehouseTree(true)
  },
  methods: {
    // 点击高级查询
    advancedQueryFun() {
      this.superQueryVisible = true
    },
    // 导出
    exportForm(exportTableRef) {
      console.log('object,', exportTableRef)
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      console.log(this.$refs[exportTableRef])
      let columnList = this.$refs[exportTableRef].columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      console.log('columnList', columnList)
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i]
      }
      const targetListQuery = this.tableQuery
      let _data = {
        ...targetListQuery,
        exportType: '1007',
        exportName: '角接触库存',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then((res) => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    superQuerySearch(query) {
      this.tableQuery.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getWarehouseTree(isInit) {
      this.filterText = ''
      this.treeLoading = true
      let obj = {
        category: 'warehouse',
        code: '',
        name: '',
        scrapFlag: false,
        virtuallyFlag: false
      }
      obj.projectId = '1860848897609494530',

      getWarehouseList(obj)
        .then((res) => {
          this.treeData = res.data
          this.$nextTick(() => {
            this.treeLoading = false
            if (isInit) this.search('basic')
          })
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    initData() {
      this.tableQuery.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      inventoryWarehouseList(this.tableQuery)
        .then((res) => {
          console.log(res)
          this.tableData = res.data.whPage.records

          this.totalData = res.data.stockSts || {
            inventoryQuantity: 0,
            availableQuantity: 0,
            occupancyQuantity: 0
          }

          this.total = res.data.whPage.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type, flag) {
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
      if (flag) this.tableQuery.pageNum = 1
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
        pageNum: 1,
        pageSize: 20,
        scrapFlag: false,
        virtuallyFlag: false,
        warehouseId: '',
        productDrawingNo: '',
        productCode: '',
        superQuery: {},
        lineFlag: 1
      }
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 }
      ]
      this.getWarehouseTree(true)
    },
    handleNodeClick(data, node) {
      if (this.tableQuery.warehouseId === data.id) return
      this.tableQuery.warehouseId = data.id
      const nodePath = this.getNodePath(node)
      this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      this.organizeIdTree = nodePath.map((o) => o.id)
      this.shelvesData = []
      let obj = {
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: -1,
        warehouseId: this.tableQuery.warehouseId
      }
      getList(obj).then((res) => {
        console.log(res, 'dd')
        this.shelvesData = res.data.records
      })
      this.search('basic')
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },

    sortChange({ prop, order }) {
      let newProp
      if (
        prop == 'productDrawingNo' ||
        prop == 'mainUnit' ||
        prop == 'projectName' ||
        prop == 'productCode' ||
        prop == 'warehouseName'
      ) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.tableQuery.orderItems[0].asc = order === 'ascending'
      this.tableQuery.orderItems[0].column = newProp
      this.initData()
    }
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
  padding: 8px 10px;
}
</style>
