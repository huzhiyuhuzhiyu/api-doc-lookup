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
      <div class="JNPF-common-layout-main JNPF-flex-main"  v-loading="listLoading">
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
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableData" custom-column row-key="id" :fixedNo="true"  v-if="isProjectSwitchFlag"
          @sort-change="sortChange" >
         

          <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" width="160" sortable="custom" />
          <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" sortable="custom" />
          <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
          <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
          v-if="isProjectSwitch == 1" />
       
          <el-table-column prop="mainUnit" label="单位" min-width="80" />
          <el-table-column prop="inventoryQuantity" label="库存数量" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"  @click.native="viewFun(scope.row.productsId, 'inventoryFlag',scope.row.warehouseId )">
                {{scope.row.inventoryQuantity}}
              </el-link>
            </template>

          </el-table-column>
          <el-table-column prop="availableQuantity" label="可用数量" width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"  @click.native="viewFun(scope.row.productsId, 'availableFlag',scope.row.warehouseId )">
                {{scope.row.availableQuantity}}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="occupancyQuantity" label="占用数量" width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"  @click.native="viewFun(scope.row.productsId, 'occupancyFlag',scope.row.warehouseId )">
                {{scope.row.occupancyQuantity}}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="safeInventory" label="安全库存" width="120" sortable="custom"/>
          <el-table-column prop="warehouseName" label="仓库名称" min-width="120" sortable="custom"/>
          <el-table-column prop="latestStorageTime" label="最新入库时间" min-width="180" sortable="custom"/>
          
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
import Form from './Form'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'semi_finishedInventory',
  components: { Form, SuperQuery,ExportForm},
  mixins: [getProjectList],
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'productCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 }, 
        { field: 'warehouseName', fieldValue: '', label: '仓库名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      exportFormVisible:false,
      superQueryVisible:false, 
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
        warehouseName:"",
        pageNum: 1,
        pageSize: 20,
        
        scrapFlag: false,
        virtuallyFlag: false,
        warehouseId: '',
        productDrawingNo: "",
        productCode: "",
        superQuery:{},
        classAttribute:"semi_finished",
        inventoryFlag :1,
      },
      selectedNodeKey: "",
      totalData: {
        totalInventory:0,
        totalAvailable:0,
        totalOccupancy:0,
      },
      superQueryJson: [
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        }, 
        {
          prop: 'productName',
          label: "产品名称",
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
          options:[{label:"成品",value:"finish_product",},{label:"原材料",value:"raw_material",},{label:"半成品",value:"semi_finished",},{label:"配件",value:"accessories",}]
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
      isProjectSwitch:"",
      isProjectSwitchFlag:false,
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
    this.isProjectSwitchFlag=true
    this.superForm = this.tableQuery
    this.search('basic')
    
    
  },
  methods: {
       // 导出
    exportForm(exportTableRef) {
      console.log("object,",exportTableRef);
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      console.log(this.$refs[exportTableRef]);
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      console.log("columnList",columnList);
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
        exportName: "半成品库存",
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
      this.search('super')
    },
    // 查看产品明细
    viewFun(id,type,warehouseId){
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id,type,warehouseId)
      })
    },
    
    
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },

    
    
    initData() {

      this.tableQuery.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      inventoryWarehouseList(this.tableQuery).then((res) => {
        console.log(res);
        this.tableData = res.data.whPage.records
        this.totalData = res.data.stockSts||{
        totalInventory:0,
        totalAvailable:0,
        totalOccupancy:0,
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
      this.superForm=this.tableQuery = {
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        warehouseName:"",
        pageNum: 1,
        pageSize: 20,
        
        scrapFlag: false,
        virtuallyFlag: false,
        warehouseId: '',
        productDrawingNo: "",
        productCode: "",
        superQuery:{},
        classAttribute:"semi_finished",
        inventoryFlag :1,
      } 
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'productCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },

        { field: 'warehouseName', fieldValue: '', label: '仓库名称', symbol: 'like', searchType: 1, width: 120 },
      ]
    this.initData()
  },
 
    


    sortChange({ prop, order }) {
      let newProp
      if(prop=='productDrawingNo'||prop=='mainUnit'||prop=='projectName'||prop=='productCode'||prop=='warehouseName'){
        newProp=prop
      }else{
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())

      }
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
  padding: 8px!important
}
.JNPF-common-search-box {
  padding: 8px 0 0 0 !important;
  margin-left: 0!important; 
}
</style>
