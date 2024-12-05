<template>
  <!-- 销售订单创建 -->
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main"  v-if="!formVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
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
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading" >
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
          <JNPF-table ref="dataTable" :data="tableData" :fixedNO="true" v-if="isProjectSwitchFlag"
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column
            @selection-change="handleSelectionChange" hasC>
            <el-table-column prop="drawingNo" label="品名规格" min-width="160" sortable="custom" />
            <el-table-column prop="code" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="productCategoryName" label="产品分类" min-width="120" sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom" v-if="isProjectSwitch==1"/>
            <el-table-column prop="mainUnit" label="单位" min-width="80" />
            <el-table-column prop="availableQuantity" label="可用库存" min-width="120" />
            <el-table-column prop="safeInventory" label="安全库存" min-width="120" />
            <el-table-column prop="maxInventory" label="最高库存" min-width="120" />

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
import getProjectList from '@/mixins/generator/getProjectList'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'salesOrderCreation',
  components: { Form, ExportForm, SuperQuery },
  mixins:[getProjectList],
  data() {
    return {
      isProjectSwitch:'',
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'code', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
      ],

 
      columnList: ["cooperativePartnerName", "cooperativePartnerCode", "productCode", "createTime", 'createByName'],
      superQueryVisible: false,
      exportFormVisible: false,
      tableData: [],
      listLoading: false,
      form: {
        classAttribute: "semi_finished",
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
        // {
        //   prop: 'mainUnit',
        //   label: "单位",
        //   type: 'input'
        // },
        // {
        //   prop: 'safeInventory',
        //   label: "安全库存",
        //   type: 'input'
        // },
        // {
        //   prop: 'inventoryQuantity',
        //   label: "可用库存",
        //   type: 'input'
        // },




      ],
      selectList: [],
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
    this.superForm=this.form
    this.search('basic')
  },
  methods: {
    handleSelectionChange(val) {
      this.selectList = val
    },







    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName'||prop=='projectName' || prop === 'productCode' || prop === 'documentStatus'||prop=='productCategoryName') {
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
      console.log("this.isProjectSwitch",this.isProjectSwitch);
     this.form.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getProducts(this.form).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.getOrderLineReportFun()
      }).catch(() => {
        this.listLoading = false
      })

    },


    search(type) {
      this.form.pageNum = 1
      Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
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
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.superForm=this.form = {
        classAttribute: "semi_finished",
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
      this.searchList=[
      { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      { field: 'code', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
      ]
        this.search('basic')
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
