<!-- 成品结存 -->
<template>
  <div class="JNPF-common-layout">

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
            <!-- <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="advancedQueryFun()" />
            </el-tooltip> -->
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
          <el-table-column prop="productCode" label="物料编号" min-width="130" sortable="custom" />
          <el-table-column prop="accuracyLevel" label="精度等级" width="130" sortable="custom" />
          <el-table-column prop="pairingMode" label="配对方式" width="130" sortable="custom" />
          <el-table-column prop="mainUnit" label="期初" width="120" />
          <el-table-column prop="mainUnit" label="生产入库" width="120" />
          <el-table-column prop="mainUnit" label="形态入库" width="120" />
          <el-table-column prop="mainUnit" label="采购入库" width="120" />
          <el-table-column prop="mainUnit" label="其他入库" width="120" />
          <el-table-column prop="mainUnit" label="入库合计" width="120" />
          <el-table-column prop="mainUnit" label="销售出库" width="120" />
          <el-table-column prop="mainUnit" label="形态出库" width="120" />
          <el-table-column prop="mainUnit" label="其他出库" width="120" />
          <el-table-column prop="mainUnit" label="出库合计" width="120" />
          <el-table-column prop="mainUnit" label="本期结存" width="120" />
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
import { inventoryWarehouseTotalReport } from '@/api/warehouseManagement/inventory'
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
        warehouseId: '1853746613401468930',
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
          prop: 'pairingMode',
          label: '配对方式',
          type: 'input'
        },
        {
          prop: 'accuracyLevel',
          label: '精度等级',
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
          label: '工序名称',
          type: 'input',
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
    await this.getProjectList()
    this.isProjectSwitchFlag = true
    this.$nextTick(function () {
  
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
            column: 'name'
          }
        ],
        pageNum: 1,
        pageSize: -1,
        warehouseId: '1853746613401468930'
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
        exportType: '1244',
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
      this.search('super','search')
    },
    shelfSpaceChange(){
      this.search('basic', 'search')
    },
    excludeProcessFlagChange(){
      this.search('basic', 'search')
    },
 
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    initData() {
      this.listLoading = true
      this.tableQuery.projectId='1862314935462182913'
      inventoryWarehouseTotalReport(this.tableQuery)
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
    async reset() {
 
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
        warehouseId: '1853746613401468930',
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
      this.$nextTick(function () {

        this.getShelvesName()
      })
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
