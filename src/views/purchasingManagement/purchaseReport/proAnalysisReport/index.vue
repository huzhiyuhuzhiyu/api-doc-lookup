<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
               <el-col :span="4">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="orderForm.cooperativePartnerName" placeholder="请输入供应商名称" clearable />
                  </el-form-item>
                </el-col>
                   <el-col :span="4">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="orderForm.productsName" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                   <el-col :span="4">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="orderForm.productsDrawingNo" placeholder="请输入型号" clearable />
                  </el-form-item>
                </el-col>
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
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTable')">
                导出
              </el-button>


            </div>
            <div class="JNPF-common-head-right" >
              <!-- <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip> -->
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable"  :data="tableData" :fixedNO="true"    @sort-change="sortChange" custom-column
            :setColumnDisplayList="columnList">
            <el-table-column prop="projectName" label="所属项目"  sortable="custom" />
            <el-table-column prop="cooperativePartnerName" label="供应商名称"  sortable="custom"></el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="供应商编码"  sortable="custom"></el-table-column>
            <el-table-column prop="productsName" label="产品名称" sortable="custom"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="productsCode" label="产品编码" sortable="custom" />
            <el-table-column prop="productsDrawingNo" label="型号"  sortable="custom"></el-table-column>
            <el-table-column prop="productSourceName" label="产品来源"  ></el-table-column>
            <el-table-column prop="receiptQuantity" label="累计采购总量"  sortable="custom" />
            <el-table-column prop="returnQuantity" label="累计退货总量" sortable="custom" />
            <el-table-column prop="rate" label="有效采购百分比"  sortable="custom" >
              <template slot-scope="scope">
                    <el-progress :percentage="scope.row.rate.replace('%','') || 0"></el-progress>
                  </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" >
          </pagination>
        </div>
      </div>

    </div>

    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { purchaseAnalysis } from '@/api/purchasingManagement/purchaseInquirySheet'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";

import userTransfer from '@/components/JNPF-userTransfer'

export default {
  name: 'proAnalysisReport',
  components: { SuperQuery, ExportForm ,userTransfer,},
  mixins: [AbProjectMixin],
  data() {
    return {
      inspectionDetailVisible:false,
      superQuery: {},
      superForm: {},
      basicQuery: {},

      columnList: [],

      superQueryVisible: false,
      exportFormVisible: false,
      analyseDialog: false,
      dataForm:{
        producerId:'',
        qualifiedQuantity:null,
        responsibilityWasteQuantity:null,
        materialWasteQuantity:null,
        unqualifiedQuantity:null,
        reportingQuantity:null
      },

      btnLoading: false,
      reportDate: [],
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      selectData: [], // 选中的数据 带到form页
      totalQualifiedQuantity: 0,
      orderForm: {},
      orderFormlist: {
        cooperativePartnerName: "",
        productsName:"",
        productsDrawingNo:"",
        projectId:"",
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
          column: ""
        }],
      },


      totalData:{},
      total: 0,
      formVisible: false,
      selectArr: [],

      superQueryJson: [
        {
          prop: '所属项目',
          label: "所属项目",
          type: 'input'
        },

        {
          prop: 'workNo',
          label: "供应商名称",
          type: 'input'
        },
        {
          prop: 'orderNo',
          label: "供应商编码",
          type: 'input'
        },
           {
          prop: 'productsName',
          label: "产品名称",
          type: 'input'
        },
        {
          prop: 'productsCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'productsDrawingNo',
          label: "型号",
          type: 'input'
        },






      ],

      isProjectSwitchFlag: false,
      isProjectSwitch: '',
    }
  },

  computed: {
    ...mapGetters(['userInfo'])
  },

  async created() {

    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  },
  mounted() {
  },
  methods: {
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode'||prop=='projectName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'workNo' || prop == 'productDrawingNo' || prop == 'productionOrderNo' || prop == 'productCode'
        || prop == 'productCategoryName'||prop=='productSourceName' || prop == 'processName' || prop == 'producerName'
      ) {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp

      this.initData()
    },
    initData() {
      this.listLoading = true
        this.orderForm.projectId = this.abIsCommonUser ? '' : this.abProjectId
     purchaseAnalysis(this.orderForm).then(res => {
        console.log("报工记录", res);
        // res.data.records.forEach(item => {
        //   item.selectFlag = false
        // })
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    search(type) {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

      this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
      this.search('basic')
    },
     // 选中列表的数据 将其带到生成订单下面表单表格中
     handeleProductInfoData(val) {
      console.log(val)
      this.selectData = val
      this.totalQualifiedQuantity = this.selectData.reduce((sum, e) => sum + Number(e.qualifiedQuantity || 0), 0)
    },




    columnSetFun() {
      this.$refs.dataTable.showDrawer()
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
      const targetListQuery = this.orderForm
      let _data = {
        ...targetListQuery,
        exportType: "1249",
        exportName: '采购分析报表',
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
::v-deep .all-select .cell .el-checkbox__inner {
  display: none;
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}
</style>
<style lang="scss" scoped>
::v-deep .el-progress-bar{
  width: 80%;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
