<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>


            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 3">
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
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTable')">
                导出
              </el-button>
            </div>
            <div class="JNPF-common-head-right" >
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
          <JNPF-table ref="dataTable"   :data="tableData" :fixedNO="true"
            header-cell-class-name="all-select" @sort-change="sortChange" custom-column
            :setColumnDisplayList="columnList">
            <el-table-column prop="moveOutNo" label="出库单号" min-width="220" sortable="custom" />
            <el-table-column prop="saleDeliveryNo" label="通知单号" min-width="220" sortable="custom"></el-table-column>
            <el-table-column prop="partnerName" label="客户名称" min-width="220" sortable="custom"></el-table-column>
            <el-table-column prop="productsCode" label="产品编码" min-width="140" sortable="custom" />
            <el-table-column prop="productsName" label="产品名称" sortable="custom" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productsDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom" />
            <el-table-column prop="num" label="出库数量" min-width="120" sortable="custom" />
            <el-table-column prop="costPrice" label="单价(含税)" width="160" sortable="custom" />
            <el-table-column prop="taxRate" label="税率" min-width="180" sortable="custom" />
            <el-table-column prop="totalAmount" label="金额" min-width="120" sortable="custom" />
            <AttributeColumns :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'sale'" />
            <el-table-column prop="remark" label="备注" min-width="120" sortable="custom" />
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" >
           <div class="text">
              <span style="margin-left: 10px">总出库数量：{{ totalSaleNum }}</span>
            </div>
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
import { saleDeliveryReport} from '@/api/salesManagement/assemblyOrders'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'

import userTransfer from '@/components/JNPF-userTransfer'
export default {
  name: 'saleShippRepot',
  components: { SuperQuery, ExportForm ,userTransfer},
  mixins: [getProjectList],
  data() {
    return {
      totalSaleNum:0,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      orderFormlist: {
        classAttribute: "",
        businessType: "outbound_sale_send",
        partnerName: "",
        productsName: "",
        moveOutNo: "",
        saleDeliveryNo: "",
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
          column: "sale_delivery_no"
        }],
      },

      searchList: [
        { field: 'moveOutNo', fieldValue: '', label: '出库单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'saleDeliveryNo', fieldValue: '', label: '通知单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productsName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      columnList: [],

      superQueryVisible: false,
      exportFormVisible: false,



      btnLoading: false,
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      selectData: [], // 选中的数据 带到form页
      totalQualifiedQuantity: 0,
      orderForm: {},



      totalData:{},
      total: 0,
      formVisible: false,

      superQueryJson: [
        {
          prop: 'moveOutNo',
          label: "出库单号",
          type: 'input'
        },

        {
          prop: '通知单号',
          label: "saleDeliveryNo",
          type: 'input'
        },
          {
          prop: '客户名称',
          label: "partnerName",
          type: 'input'
        },

          {
          prop: 'productsCode',
          label: "产品编码",
          type: 'input'
        },
          {
          prop: 'productsName',
          label: "产品名称",
          type: 'input'
        },
             {
          prop: 'productsDrawingNo',
          label: "品名规格",
          type: 'input'
        },
         {
          prop: 'projectName',
          label: "所属项目",
          type: 'input'
        },
         {
          prop: 'material',
          label: "保持架材质",
          type: 'input'
        },
         {
          prop: 'sealingCoverTyping',
          label: "打字内容",
          type: 'input'
        },
         {
          prop: 'accuracyLevel',
          label: "精度等级",
          type: 'input'
        },
         {
          prop: 'vibrationLevel',
          label: "振动等级",
          type: 'input'
        },

         {
          prop: 'oil',
          label: "油脂",
          type: 'input'
        },
          {
          prop: 'clearance',
          label: "游隙",
          type: 'input'
        },
          {
          prop: 'packagingMethod',
          label: "包装方式",
          type: 'input'
        },
         {
          prop: 'specialRequire',
          label: "特殊要求",
          type: 'input'
        },
            {
          prop: 'colour',
          label: "颜色",
          type: 'input'
        },

      ],
      requestArr: [
        {
          prop: "aperture",
          typeCode: "pa009"
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
        || prop == 'productCategoryName' || prop == 'processName' || prop == 'producerName'
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
     saleDeliveryReport(this.orderForm).then(res => {
        // res.data.records.forEach(item => {
        //   item.selectFlag = false
        // })
        this.tableData = res.data.page.records||[]
        this.total = res.data.page.total||0
        this.totalSaleNum=res.data.total.num||0
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
        this.orderForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.orderForm.superQuery = this.superQuery
      }
      this.orderForm.pageNum = 1 // 重置页码

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

      this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))

      this.searchList=[
        { field: 'moveOutNo', fieldValue: '', label: '出库单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'saleDeliveryNo', fieldValue: '', label: '通知单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productsName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.$refs.SuperQuery.conditionList = []
      this.search('basic')
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
        exportType: "1254",
        exportName: '销售发货',
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

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
