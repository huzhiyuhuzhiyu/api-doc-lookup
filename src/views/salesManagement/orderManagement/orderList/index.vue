<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.orderNo" @keyup.enter.native="search()" placeholder="请输入订单号" clearable />
              </el-form-item>
            </el-col>
          
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.cooperativePartnerName" @keyup.enter.native="search()"
                  placeholder="请输入客户名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="交货开始日期" end-placeholder="交货结束日期" clearable>
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
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier('', 'add')">
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('dataTable')">导出</el-button>
            </topOpts>
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="订单号" width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="客户编码"    />
            <el-table-column prop="cooperativePartnerName" label="客户名称" width="160"  sortable="custom" />
            <el-table-column prop="orderType" label="订单类型" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-for="(item, index) in orderList" :key="index">
                  <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                </div>
              </template>
            </el-table-column> 
            <el-table-column prop="departmentName" label="所属部门" width="160"  sortable="custom"></el-table-column>
            <el-table-column prop="salesName" label="所属销售 " width="140" sortable="custom"/>
            <el-table-column prop="workOrderNo" label="工作令号" ></el-table-column>
            <el-table-column prop="orderDate" label="订单日期" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="contractNo" label="客户合同号"  sortable="custom"></el-table-column>
            <el-table-column prop="deliveryDate" label="交货日期" width="140" sortable="custom"></el-table-column>
          
            <el-table-column prop="orderState" label="订单状态" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderState == 'not_finish'"><el-tag type="danger">未完成</el-tag></div>
                <div v-else-if="scope.row.orderState == 'finish'"><el-tag type="success">已完成</el-tag></div>
                <div v-else-if="scope.row.orderState == 'part_finish'"><el-tag type="warning">部分完成</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="documentStatus"  label="单据状态" width="140" sortable="custom"
              :showOverflowTooltip="false" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
          
            <el-table-column prop="changesCount" label="变更次数" >
              <template slot-scope="scope">
                <div>{{ scope.row.changesCount ? scope.row.changesCount : 0 }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人"  sortable="custom" />
           
         
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="handleDel(scope.row.id)">删除</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="getCopyOrders(scope.row.id, 'copy')">
                      复制订单
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="orderFollow(scope.row.id)"
                      v-if="scope.row.documentStatus == 'submit'">
                      订单跟踪
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
import Form from './Form'
import OrderFollow from './orderFollow'
import UserRelationList from './userRelation'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'carrierProfile',
  components: { Form, UserRelationList, ExportForm, OrderFollow ,SuperQuery },
  data() {
    return {
      superQueryVisible:false,
            columnList:["cooperativePartnerCode","departmentName","workOrderNo","contractNo","changesCount","createByName",],
      orderFollowVisible: false,
      productFormVisible: false,
      exportFormVisible: false,
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      treeData: [],
      tableData: [],
      tableData1: [],
      detailTableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      activeName: "orderList",
      salespersonList: [],
      detailFlag: false,
      orderStateList: [
        { label: "未完成", value: "not_finish" },
        { label: "已完成", value: "finish" },
        { label: "部分完成", value: "part_finish" },
      ],
      partialList: [
        { label: "未完成", value: "not_finish" },
        { label: "已完成", value: "finish" },
        { label: "已停止", value: "stopped" },
      ],
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],
      orderProduceStateList: [
        { label: "未开始", value: "not_started" },
        { label: "已排计划", value: "planned" },
        { label: "已开始生产", value: "start_production" },
        { label: "已生产完成", value: "production_completed" },

      ],
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],

      departMentList: [
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" },
      ],
      paymentMethodList: [],
      paymentCycleList: [],
      orderForm: {
        orderNo: "",
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        orderType: "",
        salesName: "",
        workOrderNo: "",
        sourceOrderNo: "",
        orderStartDate: "",
        orderEndDate: "",
        contractNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        orderCategory: "assembly",
        shipmentStatus: "",
        orderState: "",
        productionStatus: "",
        documentStatus: "",
        approvalStatus: "",
        startTime: "",
        endTime: "",
        superQuery:{},

        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
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
      deliveryDateArr: [],
      orderDateArr: [],
      CompletionDate: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      filterText: '',
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
          prop: 'orderType',
          label: "订单类型",
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
          prop: 'workOrderNo',
          label: "工作令号",
          type: 'input'
        },
        {
          prop: 'orderDate',
          label: "订单日期",
          type: 'input'
        },
        {
          prop: 'contractNo',
          label: "客户合同号",
          type: 'input'
        },
        {
          prop: 'deliveryDate',
          label: "交货日期",
          type: 'input'
        }, {
          prop: 'orderState',
          label: "订单状态",
          type: 'input'
        },

       
    
      ],
      totalDataForm: {}, 
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  computed: {
    totalNum: function () {
      var totalNum = 0;
      for (var i = 0; i < this.tableData1.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.tableData1[i].num])
      }
      return totalNum
    },
   
   

  },

  created() {
    this.getDictionaryType()
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
    columnSetFun(){ 
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
  
  
    // 获取等级付款方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              // 付款方式
              if (resp.enCode == "paymentMethod") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.paymentMethodList = response.data.list
                })
              }
              // 付款周期
              if (resp.enCode == "paymentCycle") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.paymentCycleList = response.data.list
                })
              }

            });

          }

        });
      })
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'salesName' || prop === 'cooperativePartnerCode' || prop === 'sealingRingName') {
        newProp = prop
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
    superQuerySearch(query) {
      this.orderfo.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    initData() {
      this.listLoading = true
      getsaleOrderList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
      
    },


    search() {
      this.initData() 
    },
  
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.orderDateArr = []
      this.deliveryDateArr = []
      this.CompletionDate = []
      this.orderForm = {
        orderNo: "",
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        orderType: "",
        salesName: "",
        workOrderNo: "",
        sourceOrderNo: "",
        orderStartDate: "",
        orderEndDate: "",
        contractNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        orderCategory: "assembly",
        shipmentStatus: "",
        orderState: "",
        productionStatus: "",
        documentStatus: "",
        approvalStatus: "",
        startTime: "",
        endTime: "",

        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
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
        exportType: '1004',
        exportName:  '销售订单',
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
