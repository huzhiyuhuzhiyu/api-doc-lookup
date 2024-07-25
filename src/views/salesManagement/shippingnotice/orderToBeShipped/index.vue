<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.cooperativePartnerName" @keyup.enter.native="search()" placeholder="请输入订单号"
                  clearable />
              </el-form-item>
            </el-col>

            <el-col :span="4">

              <el-form-item>
                <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                  style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期"
                  :picker-options="global.timePickerOptionsArr" clearable>
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
          <el-col :span="4">
            <el-form-item>
              <el-button  @click="btnsearch1()">已延期</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button  @click="btnsearch2()">近三天</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button  @click="btnsearch3()">近7天</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button  @click="btnsearch4()">近30天</el-button>
          </el-col>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier('', 'add')">
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column>
            <el-table-column prop="orderNo" label="订单号" width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.ordersId, 'look')">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="客户编码" width="160" sortable="custom" />
            <el-table-column prop="cooperativePartnerName" label="客户名称" width="160" sortable="custom" />
            <el-table-column prop="departmentName" label="所属部门" width="160"></el-table-column>
            <el-table-column prop="salesName" label="所属销售" width="160" sortable="custom" />
            <el-table-column prop="customerProductNo" label="客户货号" width="160" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" width="160" sortable="custom" />
            <el-table-column prop="drawingNo" label="规格型号" width="160" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="160" sortable="custom" />
            <el-table-column prop="num" label="数量" width="160" sortable="custom" />
            <el-table-column prop="deliveryDate" label="交货日期" width="160" sortable="custom" />

            <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom" />
            <el-table-column prop="accuracyLevel" label="精度等级" width="160" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="160" sortable="custom" />
            <el-table-column prop="oil" label="油脂" width="160" sortable="custom" />
            <el-table-column prop="oilQuantity" label="油脂量" width="160" sortable="custom" />
            <el-table-column prop="clearance" label="游隙" width="160" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom" />
            <el-table-column prop="remark" label="备注" width="160" sortable="custom" />

            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click.native="handleUserRelation(scope.row.ordersId, 'look')">查看详情</el-button>

              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData">
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
  </div>
</template>

<script>
import { UserListAll, } from '@/api/permission/user'
import { excelExport } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, getSaleordersTotal } from '@/api/salesManagement/assemblyOrders'
import Form from '../../orderManagement/orderList/Form'
import OrderFollow from '../../orderManagement/orderList/orderFollow'
import UserRelationList from '../../orderManagement/orderList/userRelation'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  name: 'carrierProfile',
  components: { Form, UserRelationList, ExportForm, OrderFollow, SuperQuery },
  data() {
    return {
      columnList: ["cooperativePartnerCode", "departmentName", "productName", "createTime",],
      deliveryDateArr: [],
      orderFollowVisible: false,
      superQueryVisible: false,
      productFormVisible: false,
      exportFormVisible: false,
      customList: [], // 列表中显示的自定义属性
      tableData: [],
      treeLoading: false,
      listLoading: false,
      salespersonList: [],
      detailFlag: false,

      orderForm: {

        approvalStatus: "ok",
        documentStatus: "submit",
        orderState: "not_finish",
        approvalStatus: "",
        approvalStatus: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        deliverQueryFlag: 1,
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],

        superQuery: {},
      },

      detailTotal: 0,
      salespersonList: [],
      pickerOptions: {
        disabledDate(time) {
          // 获取当前日期
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // 获取6个月前的日期
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          sixMonthsAgo.setHours(0, 0, 0, 0);
          // 如果选择的日期范围超过6个月，或者结束日期不是当前日期，则禁用
          return time.getTime() < sixMonthsAgo || time.getTime() > today;
        }
      },
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      createTimeArr: [],
      orderDateArr: [],
      CompletionDate: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      filterText: '',
      totalDataForm: {},
      btnType1: "",
      btnType2: "primary",
      btnType3: "",
      btnType4: "",
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "订单号",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: "客户名称",
          type: 'input'
        },

        {
          prop: 'departmentName',
          label: "所属部门",
          type: 'input'
        },

        {
          prop: 'salesName',
          label: "所属销售人员",
          type: 'custom',
          component: 'user-select',
        },
        {
          prop: 'customerProductNo',
          label: "客户货号",
          type: 'input'
        },
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
          prop: 'drawingNo',
          label: "规格型号",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位(主)",
          type: 'input'
        },
        {
          prop: 'num',
          label: "数量(主)",
          type: 'input'
        },
        {
          prop: 'deputyUnit',
          label: "单位(副)",
          type: 'input'
        },
        {
          prop: 'assistantNum',
          label: "数量(副)",
          type: 'input'
        },
        {
          prop: 'deliveryDate',
          label: "交货日期",
          type: 'input'
        },

        {
          prop: 'price',
          label: "单价(含税)",
          type: 'input'
        },
        {
          prop: 'taxRate',
          label: "税率",
          type: 'input'
        },
        {
          prop: 'totalAmount',
          label: "金额(含税)",
          type: 'input'
        },
        {
          prop: 'excludingTaxPrice',
          label: "单价(不含税)",
          type: 'input'
        },
        {
          prop: 'excludingTaxAmount',
          label: "金额(不含税)",
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
          prop: 'oilQuantity',
          label: "油脂量",
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
          prop: 'ordersRemark',
          label: "备注",
          type: 'input'
        },
        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: "创建时间",
          type: 'input'
        },





      ],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },

  mounted() {
    // 默认设置为近3天  
    const end = new Date();
    const start = new Date();

    end.setDate(end.getDate() + 3);
    this.deliveryDateArr = [start, end];
  },
  created() {
    this.getUserList()
    this.getAttributeline()
    let endDate = new Date().toISOString().slice(0, 10);
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().slice(0, 10);
    this.orderDateArr[0] = startDate
    this.orderDateArr[1] = endDate
    this.orderForm.orderStartDate = startDate
    this.orderForm.orderEndDate = endDate
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    btnsearch1(e) {
      this.btnType1 = "primary"
      this.btnType2 = ""
      this.btnType3 = ""
      this.btnType4 = ""
    },
    btnsearch2(e) {
      this.btnType1 = ""
      this.btnType2 = "primary"
      this.btnType3 = ""
      this.btnType4 = ""
    },
    btnsearch3(e) {
      this.btnType1 = ""
      this.btnType2 = ""
      this.btnType3 = "primary"
      this.btnType4 = ""
    },
    btnsearch4(e) {
      this.btnType1 = ""
      this.btnType2 = ""
      this.btnType3 = ""
      this.btnType4 = "primary"
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },


    // 获取产品列表字段 编排属性
    getAttributeline() {
      getAttributeline('product').then(res => {
        this.customList = []
        res.data.forEach(column => {
          // 列表中显示
          let propExists = this.customList.some(item2 => item2.prop === column.attributeColumn);
          if (!propExists) { this.customList.push({ prop: column.attributeColumn, label: column.name }) }
        })
      })
    },
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ""
      if (cellValue.includes(":")) {
        return cellValue.replace(/:(.*?)(,|$)/g, "$2");
      } else {
        return cellValue;
      }
    },



    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },


    dataFormSubmit() {
      this.orderForm.pageNum = 1
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })

      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.orderForm.deliveryStartDate = this.deliveryDateArr[0]
        this.orderForm.deliveryEndDate = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartDate = ""
        this.orderForm.deliveryEndDate = ""
      }

      this.initData()

    },

    // 获取销售人员
    getUserList() {
      let obj = {
        currentPage: 1,
        pageSize: -1
      }
      UserListAll(obj).then(res => {
        this.salespersonList = res.data.list
      })
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.orderFollowVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      getsaleOrderDetailList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },


    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.orderDateArr = []
      this.deliveryDateArr = []
      this.CompletionDate = []
      this.orderForm = {
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        customerProductDrawingNo: "",
        // customerProductNo: "",
        orderType: "",
        drawingNo: "",
        orderNo: "",
        productCode: "",
        productName: "",
        shipmentStatus: '',
        orderStartDate: "",
        orderEndDate: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],

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
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
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
      }).then(() => {
        deleteOrders(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
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
        exportType: this.exportTableRef === '1005',
        exportName: this.exportTableRef === '销售订单明细',
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
  padding-top: 8px;
  padding-bottom: 8px;
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
</style>
