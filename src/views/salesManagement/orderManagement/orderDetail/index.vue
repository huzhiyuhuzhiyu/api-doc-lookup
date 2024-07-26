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
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.customerProductNo" @keyup.enter.native="search()"
                  placeholder="请输入 客户料号" clearable />
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"  :setColumnDisplayList="columnList" 
            @sort-change="sortChange" custom-column>
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
            <el-table-column prop="salesName" label="所属销售" width="120" sortable="custom" />
            <el-table-column prop="customerProductNo" label=" 客户料号" width="160" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" width="120" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" width="120" sortable="custom" />
            <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom" />
            <el-table-column prop="num" label="数量" width="80" sortable="custom" />
            <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom" />
            <el-table-column prop="price" label="单价(含税)" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="taxRate" label="税率" width="120" sortable="custom"></el-table-column>
            <el-table-column prop="totalAmount" label="金额(含税)" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="contractNo" label="客户合同号" width="120"></el-table-column>
            <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom" />
            <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" />
            <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" />
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom" />
            <el-table-column prop="remark" label="备注" width="120" sortable="custom" />
            <el-table-column prop="documentStatus"  label="单据状态" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            
           
          
          
       
          
         
         
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="addOrUpdateHandle(scope.row.ordersId, 'edit')">编辑</el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="handleDel(scope.row.ordersId)">删除</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.ordersId, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="getCopyOrders(scope.row.ordersId, 'copy')">
                      复制订单
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="orderFollow(scope.row.ordersId)"
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
            <div class="text"><span>合计数量:{{totalNum}}</span></div>
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
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, getSaleordersTotal,getOrderLineReport } from '@/api/salesManagement/assemblyOrders'
import Form from '../orderList/Form'
import OrderFollow from '../orderList/orderFollow'
import UserRelationList from '../orderList/userRelation'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment' 
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  name: 'carrierProfile',
  components: { Form, UserRelationList, ExportForm, OrderFollow,SuperQuery},
  data() {
    return {
      totalNum:0,
      columnList:["cooperativePartnerCode","departmentName","productName","deputyUnit","assistantNum","taxRate","createTime",],
      orderFollowVisible: false,
      superQueryVisible:false,
      productFormVisible: false,
      exportFormVisible: false,
      customList: [], // 列表中显示的自定义属性
      tableData: [], 
      treeLoading: false,
      listLoading: false,  
      detailFlag: false, 
      orderForm: {
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
        
        superQuery:{},
      },
   
      detailTotal: 0, 
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
      totalDataForm: {},
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
          label: " 客户料号",
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
          label: "品名规格",
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


  created() {  
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
    // 获取合计数据
    getOrderLineReportFun(){
      getOrderLineReport(this.orderForm).then(res=>{
        console.log("合计",res);
        this.totalNum=res.data?res.data.total.num:0
      })
    },



    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun(){ 
      this.$refs.dataTable.showDrawer()
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
      }else if(prop==='createTime'){
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
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.orderForm.orderStartDate = this.orderDateArr[0]
        this.orderForm.orderEndDate = this.orderDateArr[1]
      } else {
        this.orderForm.orderStartDate = ""
        this.orderForm.orderEndDate = ""
      }
      if (this.CompletionDate && this.CompletionDate.length > 0) {
        this.orderForm.deliveryStartDate = this.CompletionDate[0]
        this.orderForm.deliveryEndDate = this.CompletionDate[1]
      } else {
        this.orderForm.deliveryStartDate = ""
        this.orderForm.deliveryEndDate = ""
      }
      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.orderForm.deliveryStartDate = this.deliveryDateArr[0]
        this.orderForm.deliveryEndDate = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartDate = ""
        this.orderForm.deliveryEndDate = ""
      }
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.orderForm.startTime = this.createTimeArr[0]
        this.orderForm.endTime = this.createTimeArr[1]
      } else {
        this.orderForm.startTime = ""
        this.orderForm.endTime = ""
      }
      this.initData()

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
        this.getOrderLineReportFun()
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
