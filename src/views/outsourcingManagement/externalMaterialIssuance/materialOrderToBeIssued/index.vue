<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="orderForm.cooperativePartnerName" @keyup.enter.native="search()" placeholder="订单号"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.cooperativePartnerName" @keyup.enter.native="search()" placeholder="供应商名称"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="orderForm.cooperativePartnerName" @keyup.enter.native="search()" placeholder="料品名规格"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="ordeDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                  start-placeholder="产品交货开始日期" end-placeholder="产品交货结束日期" clearable></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier('', 'add')" :addText="'创建发料'">
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('dataTable')">
                导出
              </el-button>
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" hasC
            @selection-change="selectCustomerFun" :setColumnDisplayList="columnList" @sort-change="sortChange"
            custom-column>
            <el-table-column prop="orderNo" label="订单号" min-width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.purchaseOrderId, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="160" sortable="custom" />
            <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="160" sortable="custom" />
            <el-table-column prop="deliveryDate" label="交货日期" min-width="160" sortable="custom" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="180" sortable="custom" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click.native="handleUserRelation(scope.row.purchaseOrderId, 'look')">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData">
            <div class="text">
              <span>合计数量:{{ totalNum }}</span>
            </div>
          </pagination>
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <OrderFollow v-if="orderFollowVisible" ref="orderFollow" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <AddForm v-if="addFormVisible" ref="addForm" @refreshDataList="initData" @close="closeForm"
      :customList="customList" />
  </div>
</template>

<script>
import { UserListAll } from '@/api/permission/user'
import { excelExport } from '@/api/basicData/index'
import {
  getsaleOrderList,
  getsaleOrderDetailList,
  deleteOrders,
  getAttributeline,
  getSaleordersTotal,
  getOrderLineReport
} from '@/api/salesManagement/assemblyOrders'
// import Form from '../../orderManagement/orderList/Form.vue'
// import OrderFollow from '../../orderManagement/orderList/orderFollow.vue'
// import UserRelationList from '../../orderManagement/orderList/userRelation.vue'
import { shipmentReport } from '@/api/purchasingAndOutsourcingOrders/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment'
import AddForm from './AddForm.vue'
import Form from "../../productOutsourcingOrder/orderList/Form.vue";
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  name: 'materialOrderToBeIssued',
  components: {
    AddForm,
    Form,
    ExportForm,
    //  OrderFollow,
    SuperQuery
  },
  data() {
    return {
      addFormVisible: false,
      btnsearchFlag: true,
      columnList: ['cooperativePartnerCode', 'createByName'],
      deliveryDateArr: [],
      orderFollowVisible: false,
      superQueryVisible: false,
      productFormVisible: false,
      exportFormVisible: false,
      customList: [], // 列表中显示的自定义属性
      tableData: [],
      treeLoading: false,
      listLoading: false,
      detailFlag: false,
      ordeDateArr: [],
      orderForm: {
        orderType: 'external',
        shipmentStatus: 'not_finish',
        deliveryEndDate: '',
        deliveryStartTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          }
        ],

        superQuery: {}
      },

      detailTotal: 0,

      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      filterText: '',
      totalDataForm: {},
      totalNum: 0,
      dateRange: [null, new Date()], //
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '订单号',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: '供应商编码',
          type: 'input'
        },
        {
          prop: 'deliveryDate',
          label: '交货日期',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
      ],
      list: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },

  mounted() { },
  created() {
    // 默认设置为近3天
    const end = new Date()
    const start = ''
    end.setDate(end.getDate() + 3)
    this.deliveryDateArr = ['', end]
    // this.orderForm.deliveryStartTime = ""
    // this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
    this.dataFormSubmit()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    selectCustomerFun(val) {
      this.list = val
    },
    // 获取合计数据
    getOrderLineReportFun() {
      getOrderLineReport(this.orderForm).then((res) => {
        this.totalNum = res.data.total ? res.data.total.num : 0
      })
    },
    dateFun(dateStr) {
      const date = new Date(dateStr)

      // 获取年份、月份和日期
      const year = date.getFullYear() // 获取年份
      const month = String(date.getMonth() + 1).padStart(2, '0') // 获取月份 (注意：月份从0开始，因此加1，并补齐两位数)
      const day = String(date.getDate()).padStart(2, '0') // 获取日期，并补齐两位数

      // 拼接成年月日格式
      const formattedDate = `${year}-${month}-${day}`

      return formattedDate
    },
    btnsearch1() {
      let end = new Date()
      let start = ''
      this.deliveryDateArr = ['', end]
      this.orderForm.deliveryStartTime = ''
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.dataFormSubmit()
    },

    // 为近3天
    btnsearch2() {
      const end = new Date()
      const start = ''
      end.setDate(end.getDate() + 3)
      this.deliveryDateArr = ['', end]
      this.orderForm.deliveryStartTime = ''
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.search()
    },
    // 为近7天
    btnsearch3() {
      let end = new Date()
      let start = ''

      end.setDate(end.getDate() + 7)

      this.deliveryDateArr = ['', end]
      this.orderForm.deliveryStartTime = ''
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.search()
    },
    // 为近30天
    btnsearch4() {
      let end = new Date()
      let start = ''
      end.setDate(end.getDate() + 30)

      this.deliveryDateArr = ['', end]
      this.deliveryDateArr[0] = ''
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.search()
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    //
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ''
      if (cellValue.includes(':')) {
        return cellValue.replace(/:(.*?)(,|$)/g, '$2')
      } else {
        return cellValue
      }
    },

    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      if (prop == 'createByName') {
        newProp = 'create_by'
      }
      this.orderForm.orderItems[0].asc = order === 'ascending'
      this.orderForm.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },

    dataFormSubmit() {
      this.orderForm.pageNum = 1
      Object.keys(this.orderForm).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.orderFollowVisible = false
      this.addFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      shipmentReport(this.orderForm)
        .then((res) => {
          this.tableData = res.data.page.records
          this.total = res.data.page.total
          this.listLoading = false
          this.getOrderLineReportFun()
        })
        .catch(() => {
          this.listLoading = false
        })
    },

    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      // 默认设置为近3天
      const end = new Date()
      const start = new Date()

      end.setDate(end.getDate() + 3)
      this.deliveryDateArr = [start, end]
      this.orderForm = {
        approvalStatus: 'ok',
        documentStatus: 'submit',
        orderState: 'not_finish',
        deliveryEndTime: '',
        deliveryStartTime: '',
        extensionFlag: 1,
        deliverQueryFlag: 1,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 't1.create_time'
          }
        ],

        superQuery: {}
      }

      this.search()
    },

    // 订单跟踪
    orderFollow(id) {
      this.orderFollowVisible = true
      this.$nextTick(() => {
        this.$refs.orderFollow.init(id)
      })
    },
    addSupplier(id, btntype) {
      // this.formVisible = true
      // this.$nextTick(() => {
      //   this.$refs.Form.init(id, btntype)
      // })
      if (!this.list.length) return this.$message.error('请选择您要发料的产品')
      let flag = this.hasDifferentCooperativePartnerCode(this.list)
      if (flag) return this.$message.error('只能选择相同客户的明细订单')

      this.addFormVisible = true
      this.$nextTick(() => {
        this.$refs.addForm.init('', btntype, this.list)
      })
    },
    hasDifferentCooperativePartnerCode(arr) {
      const codes = new Set()

      for (const item of arr) {
        codes.add(item.cooperativePartnerCode)
      }

      return codes.size > 1 // 如果有多个不同的代码，则返回 true
    },
    getCopyOrders(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype)
        })
        // }, 600);
      }
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteOrders(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
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
      const targetListQuery = this.orderForm
      let _data = {
        ...targetListQuery,
        exportType: '1209',
        exportName: '待发料订单',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then((res) => {
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
  padding: 8px !important;

  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
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

.btnBox {
  padding: 7px 10px;
}
</style>
