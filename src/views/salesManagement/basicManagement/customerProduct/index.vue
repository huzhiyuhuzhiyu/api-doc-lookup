<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
        <el-tab-pane label="产品价格" name="latestprice">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <template v-for="item in searchList">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="search('basic')" />

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

                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.partnerName" placeholder="请输入客户名称" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.customerProductNo" placeholder="请输入客户料号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.drawingNo" placeholder="请输入品名规格" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col> -->



                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                      $t('common.reset') }}
                    </el-button>

                  </el-form-item>

                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm">导出</el-button>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top" v-if="true">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('tableForm')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm"
                :data="tableDataList" @sort-change="sortChange" custom-column :setColumnDisplayList="columnLists">
                <el-table-column prop="partnerName" label="客户名称" min-width="260" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="viewPartner(scope.row.cooperativePartnerId, 'look')">{{
                      scope.row.partnerName
                      }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="partnerCode" label="客户编码" min-width="160" sortable="custom" />
                <el-table-column prop="customerProductNo" label="客户料号" min-width="180" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="400" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" min-width="160" />
                <el-table-column prop="price" min-width="140" label="销售单价(含税)" />
                <el-table-column prop="excludingTaxPrice" label="销售单价(不含税)" width="160" />
                <el-table-column prop="dateOrderStart" label="有效日期起" sortable="custom" min-width="160" />
                <el-table-column prop="dateOrderStop" label="有效日期止" sortable="custom" min-width="160" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />

              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史价格" name="historicalprice">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.partnerName" placeholder="请输入客户名称" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.customerProductNo" placeholder="请输入客户料号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.drawingNo" placeholder="请输入品名规格" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col> -->
                <template v-for="item in searchList1">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="search('basic')" />

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
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                      $t('common.reset') }}
                    </el-button>

                  </el-form-item>

                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm">导出</el-button>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top" v-if="true">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('tableForms')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForms"
                :data="tableDataList" @sort-change="sortChange" custom-column :setColumnDisplayList="columnLists">
                <el-table-column prop="cooperativePartnerIdText" label="客户名称" min-width="260" sortable="custom" />
                <el-table-column prop="cooperativePartnerCode" label="客户编码" min-width="160" sortable="custom" />
                <el-table-column prop="customerDrawingNumber" label="客户料号" min-width="180" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="400" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" min-width="160" />
                <el-table-column prop="unitPrice" min-width="140" label="销售单价(含税)" />

                <el-table-column prop="excludingTaxUnitPrice" label="销售单价(不含税)" width="160" />
                <el-table-column prop="validEnd" label="有效日期止" sortable="custom" min-width="160" />
                <el-table-column prop="ask" label="要求" sortable="custom" min-width="160" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />

              </JNPF-table>
              <pagination :total="total" :page.sync="historyForm.pageNum" :background="background"
                :limit.sync="historyForm.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
      <CustomerForm v-if="customerVisible" ref="customerForm" @close="closePage"></CustomerForm>
  </div>
</template>

<script>
import { getQuotationLists, deleteQuotationData, getQuotationmxLists, exportSaleQuotation } from '@/api/salesManagement/index'
import { getBimVehicleTypeData, deleteBimVehicleType, getPartnerOrProductData } from '@/api/basicData/index'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import CustomerForm from '../customerManagement/Officialcustomer/Form.vue'
export default {
  name: 'PartnerProduct',
  components: { ExportForm, SuperQuery,CustomerForm },
  data() {
    return {
      customerVisible:false,
      searchList: [
        { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

      ],
      searchList1: [
        { field: 'cooperativePartnerIdText', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerDrawingNumber', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

      ],
      superQueryVisible: false,
      columnLists: ["partnerCode", "productName"],
      exportFormVisible: false,
      depFormVisible: false,
      background: true,//分页器背景颜色
      tableDataList: [
      ],

      listLoading: false,
      listQuery: {
        partnerType: "customer",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        customerProductNo: "",
        drawingNo: "",
        partnerName: "",



        pageNum: 1,
        pageSize: 20,
      },
      superQuery: {},
      superForm: {},
      basicQuery: {},
      historyForm: {
        productDrawingNo: "",
        cooperativePartnerIdText: "",
        customerDrawingNumber: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      formVisible: false,
      activeName: 'latestprice',
      superQueryJson: [
        {
          prop: 'partnerName',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: "客户编码",
          type: 'input'
        },


        {
          prop: 'customerProductNo',
          label: "客户料号",
          type: 'input',
        },

        {
          prop: 'drawingNo',
          label: "品名规格 ",
          type: 'custom',
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input',
        },
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input',
        },
        {
          prop: 'price',
          label: "销售单价(含税)",
          type: 'input',
        },
        {
          prop: 'excludingTaxPrice',
          label: "销售单价(不含税)",
          type: 'input',
        },
        {
          prop: 'workOrderNo',
          label: "工作令号",
          type: 'input'
        },

        {
          prop: 'dateOrderStop',
          label: "要求",
          type: 'input'
        },




      ],
    }
  },
  created() {
    this.superForm = this.listQuery
    this.initData()
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
    closePage(){
      this.customerVisible=false
    },
    viewPartner(id,type){
      this.customerVisible=true
      this.$nextTick(()=>{
        this.$refs.customerForm.init(id,'',type)
      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun(ref) {
      this.$refs[ref].showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tableForm.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        console.log(includeFieldMap);
        let name = ''
        if (this.activeName == 'latestprice') {
          name = '最新报价'
        } else {
          name = '历史报价'
        }
        let _data = {
          ...this.listQuery,
          exportType: '1009',
          exportName: '客户产品' + '-' + name,
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    handleClick(e) {
      this.activeName = e.name
      // this.reset()
    },
    sortChange({ prop, order }) {
      console.log(prop);
      // let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      // console.log(newProp);
      if (prop === 'createTime') {
        prop = "create_Time"
      }
      if (prop === 'dateOrderStart') {
        prop = "date_Order_Start"
      }
      if (prop === 'dateOrderStop') {
        prop = "date_Order_Stop"
      }
      if (prop === 'customerProductDrawingNo') {
        prop = "customer_Product_Drawing_No"
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : prop
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },


    initData() {
      this.listLoading = true
      if (this.activeName == "historicalprice") {
        getQuotationmxLists(this.superForm).then(res => {
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
      } else {
        this.superForm.historyFlag = false

        getPartnerOrProductData(this.superForm).then(res => {
          console.log(res, '客户产品列表');
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    search(type) {
      if (this.activeName == 'latestprice') {

        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
      } else {
        Object.keys(this.historyForm).forEach(key => {
          let item = this.historyForm[key]
          this.historyForm[key] = typeof item === 'string' ? item.trim() : item
        })
      }
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.activeName == 'latestprice' ? this.searchList : this.searchList1
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
      this.superForm.pageNum = 1
      this.initData()
    },
    reset() {
      if (this.activeName == 'latestprice') {

        this.$refs['tableForm'].$refs.JNPFTable.clearSort()

        this.superForm = this.listQuery = {
          partnerType: "customer",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
          partnerId: null,
          historyFlag: false,
          customerProductNo: "",
          pageNum: 1,
          pageSize: 20,
          code: "",
          name: "",
        },
          this.searchList = [
            { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
            { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

          ]
        this.$refs.SuperQuery.conditionList = []
        this.search('basic')
      } else {
        this.superForm = this.historyForm = {
          productDrawingNo: "",
          cooperativePartnerIdText: "",
          customerDrawingNumber: "",
          pageNum: 1,
          pageSize: 20,
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "createTime"
          }],
        }
        this.searchList = [
          { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
          { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
          { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

        ]
        this.$refs.SuperQuery.conditionList = []
        this.search('basic')
      }

    },
    addSupplier(type) {

      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init("", type)
      })
    },
    addOrUpdateHandle(id, type) {
      this.depFormVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
        // }, 600);
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteBimVehicleType(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    }
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style scoped>
::v-deep .el-tabs__item {
  padding: 0 10px;
}

 

::v-deep .el-tabs__nav-wrap {
  margin-bottom: 0px;
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
}
.tabs ::v-deep .el-tabs__header{
  padding: 0 8px;
}
</style>