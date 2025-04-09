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
    <div class="JNPF-common-layout-center JNPF-flex-main" >
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="5">
            <el-form-item>
              <el-select v-model="tableQuery.shelfSpaceName" placeholder="库位" @change="shelfSpaceChange">
                <el-option v-for="item in shelvesData" :key="item.name" :label="item.name"
                  :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.productCode" placeholder="物料编号" clearable
                @keyup.enter.native="search('basic', 'search')" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.productCode" placeholder="产品编码" clearable @keyup.enter.native="search('basic')" />
            </el-form-item>
          </el-col> -->
          <el-col :span="5">
            <el-form-item>
              <el-select v-model="tableQuery.excludeProcessFlag" placeholder="工序" @change="excludeProcessFlagChange">
                <el-option v-for="item in excludeProcessFlagData" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
            <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
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
          @sort-change="sortChange" ref="tabForm" :setColumnDisplayList="columnList">
          <el-table-column prop="productCode" label="物料编号" min-width="130" />
          <el-table-column prop="mainUnit" label="单位" width="80" />
          <el-table-column prop="vibrationLevel" label="振动等级" width="130" />
          <el-table-column prop="shelves" label="库位" width="180" />
          <el-table-column prop="inventoryQuantity" label="库存" width="100" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" width="160" />
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :limit.sync="tableQuery.pageSize"
          @pagination="initData()" :pageSizes="[50, 100, 500,1000]">
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
import { inventoryWarehouseTotalRoutineReport } from '@/api/warehouseManagement/inventory'
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
      basicQuery: {},
      searchList: [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
        {
          field: 'excludeProcessFlag',
          fieldValue: '',
          label: '工序',
          symbol: 'like',
          searchType: 4,
          width: 120,
          options: [
            { label: '所有', value: '' },
            { label: '有工序', value: 0 },
            { label: '无工序', value: 1 }
          ]
        }
      ],
      excludeProcessFlagData: [
        { label: '所有', value: '' },
        { label: '有工序', value: 0 },
        { label: '无工序', value: 1 }
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
      columnList:['processName'],
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
        shelfSpaceName:'',
        excludeProcessFlag:'',
        totalInventoryFlag: '',
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 50,

        scrapFlag: '',
        virtuallyFlag: '',
        warehouseId: '',
        productDrawingNo: '',
        productCode: '',
        superQuery: {},
        lineFlag: 1
      },
      selectedNodeKey: '',
      superQueryJson: [
        {
          prop: 'productCode',
          label: '物料编号',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'input'
        },
        {
          prop: 'shelves',
          label: '库位',
          type: 'input'
        },
        {
          prop: 'inventoryQuantity',
          label: '库存',
          type: 'input'
        },

        {
          prop: 'processName',
          label: '仓库名称',
          type: 'input'
        },
       
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
    await this.getProjectList()
    this.isProjectSwitchFlag = true
    await this.getWarehouseTree(true)
    // this.currentLivingId = this.treeData[0].children[0].value
    console.log(this.treeData[0].id,'所属')
    this.$nextTick(function () {
      this.$refs.treeBox.setCurrentKey(this.treeData[0].id)
      this.tableQuery.warehouseId = this.treeData[0].id
      this.getShelvesName()
    })
  },
  methods: {
    async getShelvesName(){
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
      const res = await getList(obj)
      console.log(res, 'dd')
      const newData = [];
      res.data.records.forEach(item => {
        const name = item.name;
        let processedName;
        // 检查首字符是否是中文
        const firstChar = name.charAt(0);
        const isChinese = /[\u4e00-\u9fa5]/.test(firstChar);
        if (isChinese) {
          processedName = name; // 中文不处理，保留完整 name
        } else {
          processedName = firstChar; // 非中文，直接取首字母（区分大小写）
        }
      
        // 去重
        if (!newData.some(obj => obj.name === processedName)) {
          newData.push({ name: processedName });
        }
      });

      // 排序规则：字母按 A-Za-z 顺序，中文按原字符串排序
      newData.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      this.shelvesData = newData
      console.log(this.shelvesData,'this.shelvesData3333')
      if (this.shelvesData.length) {
        this.tableQuery.shelfSpaceName = this.shelvesData[0].name
      } else {
        this.tableQuery.shelfSpaceName = ''
      }
      this.search('basic', 'search')
      console.log(this.shelvesData,'this.shelvesData')
    
    },
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
        exportType: '1245',
        exportName: '常规库存',
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
      console.log(query)
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super','search')
    },
    shelfSpaceChange(){
      this.search('basic', 'search')
    },
    excludeProcessFlagChange(){
      this.search('basic', 'search')
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
    async getWarehouseTree(isInit) {
      this.filterText = ''
      this.treeLoading = true
      let obj = {
        category: 'warehouse',
        code: '',
        name: '',
        scrapFlag: false,
        virtuallyFlag: false
      }
      console.log(this.projectIdData)
      this.projectIdData.forEach((element) => {
        console.log(element)
        if (element.code === 'AP') {
          obj.projectId = element.id
          this.tableQuery.projectId = element.id
        }
      })
      console.log(obj, 'lll')
      const res = await getWarehouseList(obj)
    
      this.treeData = res.data
      this.$nextTick(() => {
        this.treeLoading = false
      })
     
    },
    initData() {
      this.listLoading = true
      inventoryWarehouseTotalRoutineReport(this.tableQuery)
        .then((res) => {
          console.log(res)
          this.tableData = res.data.records

          this.totalData = res.data.stockSts || {
            inventoryQuantity: 0,
            availableQuantity: 0,
            occupancyQuantity: 0
          }

          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type, flag) {
      console.log(this.tableQuery)
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
        this.tableQuery.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.tableQuery.superQuery = this.superQuery
      }
      if (flag) this.tableQuery.pageNum = 1
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
        excludeProcessFlag:'',
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
        { field: 'productCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
        {
          field: 'excludeProcessFlag',
          fieldValue: '',
          label: '工序',
          symbol: 'like',
          searchType: 4,
          width: 120,
          options: [
            { label: '所有', value: '' },
            { label: '有工序', value: 0 },
            { label: '无工序', value: 1 }
          ]
        }
      ]
      this.getWarehouseTree(true)
      this.$nextTick(function () {
        this.$refs.treeBox.setCurrentKey(this.treeData[0].id)
        this.tableQuery.warehouseId = this.treeData[0].id
        this.getShelvesName()
      })
    },
    handleNodeClick(data, node) {
      if (this.tableQuery.warehouseId === data.id) return
      this.tableQuery.warehouseId = data.id
      const nodePath = this.getNodePath(node)
      this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      this.organizeIdTree = nodePath.map((o) => o.id)
      this.tableQuery.excludeProcessFlag = ''
      this.getShelvesName()
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
