<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 4">
                <el-form-item>
                  <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                    @keyup.enter.native="search('basic')"/>
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
            <el-col :span="4">
              <el-form-item>
                <el-date-picker v-model="orderForm.deliveryStartTime" type="date" value-format="yyyy-MM-dd"
                  style="width: 100%;" placeholder="交货开始日期" clearable>
                </el-date-picker>
                -
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-date-picker v-model="orderForm.deliveryEndTime" type="date" value-format="yyyy-MM-dd"
                  style="width: 100%;" placeholder="交货结束日期" clearable>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button class="btnBox" size="mini" @click="btnsearch1()">已延期</el-button>
                <el-button class="btnBox" size="mini" @click="btnsearch2()">近3天</el-button>
                <el-button class="btnBox" size="mini" @click="btnsearch3()">近7天</el-button>
                <el-button class="btnBox" size="mini" @click="btnsearch4()">近30天</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier('', 'add')">
              <!--              <el-button type="primary" size="mini" icon="el-icon-download"-->
              <!--                @click="exportForm('dataTable')">导出</el-button>-->
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()"/>
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" :data="tableData" :fixedNO="true" hasC
            @selection-change="selectCustomerFun" :setColumnDisplayList="columnList" @sort-change="sortChange"
            custom-column customKey="JNPFTableKey_796109">
            <el-table-column prop="orderNo" label="订单号" width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.ordersId, 'look')">{{
                    scope.row.orderNo
                  }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="客户编码" width="160" sortable="custom"/>
            <el-table-column prop="cooperativePartnerName" label="客户名称" width="160" sortable="custom"/>
            <el-table-column prop="departmentName" label="所属部门" width="160"></el-table-column>
            <el-table-column prop="salesName" label="所属销售" width="120" sortable="custom"/>
            <el-table-column prop="customerProductNo" label="客户料号" width="160" sortable="custom"/>
            <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom"/>
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="drawingNo" label="型号" width="300" sortable="custom"/>
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom"/>
            <el-table-column prop="oil" label="机型" width="160" sortable="custom"/>
            <el-table-column prop="accuracyLevel" label="制令号" width="160" sortable="custom"/>
            <el-table-column prop="clearance" label="品牌" width="160" sortable="custom"/>
            <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom"/>
            <el-table-column prop="specialRequire" label="包装要求" width="160" sortable="custom"/>
            <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom"/>
            <el-table-column prop="mainUnit" label="单位" min-width="120"/>
            <el-table-column prop="num" label="数量" min-width="120"/>
            <el-table-column prop="waitDeliverNum" label="待发货数量" width="140" sortable="custom"/>
            <el-table-column prop="inventoryQuantity" label="库存数量" width="140" sortable="custom"/>
            <el-table-column prop="deliveryDate" label="交货日期" width="140" sortable="custom"/>

            <el-table-column prop="orderDate" label="下单日期" min-width="140" sortable="custom"/>
            <el-table-column prop="plannedDeliveryDate" label="计划交期" min-width="140" sortable="custom"/>
            <el-table-column prop="packagingMethod" label="包装方式" min-width="140" sortable="custom"/>
            <el-table-column prop="purchaseReplyDate" label="采购回复交期" min-width="140" sortable="custom"/>
            <el-table-column prop="orderQuantity" label="订单数量" min-width="140" sortable="custom"/>
            <el-table-column prop="currentInventory" label="当前库存" min-width="140" sortable="custom"/>
            <el-table-column prop="onlineQuantity" label="线上数量" min-width="140" sortable="custom"/>
            <el-table-column prop="issuedQuantity" label="已下达" min-width="140" sortable="custom"/>
            <el-table-column prop="pendingQuantity" label="待下达" min-width="140" sortable="custom"/>
            <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="140" sortable="custom"/>
            <el-table-column prop="specialRequire" label="包装要求" min-width="140" sortable="custom"/>
            <el-table-column prop="typingNotification" label="是否通知打字" min-width="140" sortable="custom"/>

            <el-table-column prop="remark" label="备注" width="160" sortable="custom"/>
            <el-table-column prop="receivingAddress" label="收货地址" min-width="120" :key="10201"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"/>
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click.native="handleUserRelation(scope.row.ordersId, 'look')">查看详情
                </el-button>
                <!--                <el-button size="mini" type="text" :disable="scope.row.documentStatus === 'draft'"-->
                <!--                  @click.native="printFun(scope.row.ordersId)">打印</el-button>-->
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData">
            <div class="text"><span>合计数量:{{ totalNum }}</span></div>
          </pagination>
        </div>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList"/>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download"/>
    <OrderFollow v-if="orderFollowVisible" ref="orderFollow" @refreshDataList="initData" @close="closeForm"/>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
    <AddForm v-if="addFormVisible" ref="addForm" @refreshDataList="initData" @close="closeForm"
      :customList="customList"/>
    <ViewForm v-if="formVisible" ref="ViewForm"></ViewForm>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body/>
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm"/>
  </div>
</template>
<script>
import {excelExport, getOrderFiledMap} from '@/api/basicData/index'
import {deleteOrders, getOrderLineReport, getsaleOrderDetailList} from '@/api/salesManagement/assemblyOrders'
import Form from '@/views/salesManagement/orderManagement/orderList/Form.vue'
import OrderFollow from '@/views/salesManagement/orderManagement/orderList/orderFollow.vue'
import UserRelationList from '@/views/salesManagement/orderManagement/orderList/userRelation.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import AddForm from "@/views/salesManagement/shippingnotice/saleMetalworking/Form.vue"
import ExportForm from '@/components/no_mount/ExportBox/index'
import ViewForm from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventory/Form.vue'
import {mapGetters} from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import {getPrintBusInfo} from '@/api/system/printDev'
import {getbimProductAttributes, getbimProductAttributesListMap} from "@/api/masterDataManagement/index"

export default {
  name: 'carrierProfile',
  components: {
    Form, UserRelationList, AddForm, ExportForm, OrderFollow, SuperQuery, ViewForm, PrintBrowse,
    PrintDialog,
  },
  mixins: [getProjectList],
  data() {
    return {
      prindId: '',
      formId: '',
      enCode: "",
      printVisible: false,
      printBrowseVisible: false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        {field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120},
      ],
      addFormVisible: false,
      btnsearchFlag: true,
      columnList: ["cooperativePartnerCode", "departmentName",],
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
      orderForm: {
        approvalStatus: "ok",
        documentStatus: "submit",
        deliveryEndTime: "",
        deliveryStartTime: "",
        extensionFlag: 0,
        shipmentStatus: "not_finish",
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
        superQuery: {
          condition: [],
          matchLogic: ""
        },
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
          label: "所属销售",
          type: 'input',
        },
        {
          prop: 'customerProductNo',
          label: "客户料号",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: "型号",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        // {
        //   prop: 'num',
        //   label: "数量",
        //   type: 'input'
        // },
        // {
        //   prop: "waitDeliverNum",
        //   label: "待发货数量",
        //   type: "input"
        // },
        {
          prop: 'deliveryDate',
          label: '交货日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'ordersRemark',
          label: "备注",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
      ],
      list: [],
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag: '',
      colourFlag: '',
      bimProductAttributesList: [],
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
  mounted() {
  },
  async created() {
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    // 默认设置为近3天
    const end = new Date();
    const start = new Date();
    end.setDate(end.getDate() + 3);
    this.deliveryDateArr = ["", end];
    this.orderForm.deliveryStartTime = ""
    this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
    this.superForm = this.orderForm
    this.search('basic')
  },
  methods: {
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.printBrowseVisible = true
          this.printVisible = false

          this.printVisible = false
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    closePrint() {
      this.printVisible = false
    },
    printFun(id) {
      this.enCode = 'p002' // 筛选出 businessType 等于 type 的项
      this.formId = id
      this.fullName = "销售单" // 筛选出 businessType 等于 type 的项
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    getOrderFiledMap() {
      getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
    },
    async getProductClassFun() {
      // 产品属性
      const res = await getbimProductAttributesListMap()
      this.bimProductAttributesList = res.data

      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        let arr = []
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
          let obj = {
            label: item.taxRate,
            value: item.taxRate,
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find(item => item.prop === 'taxRate');
        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr;
        }
      })
    },
    // 查看库存明细
    viewFun(id, type, warehouseId) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.ViewForm.init(id, type, "", 'product')
      })
    },
    selectCustomerFun(val) {
      this.list = val
    },
    dateFun(dateStr) {
      const date = new Date(dateStr);
      // 获取年份、月份和日期
      const year = date.getFullYear(); // 获取年份
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份 (注意：月份从0开始，因此加1，并补齐两位数)
      const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补齐两位数
      // 拼接成年月日格式
      const formattedDate = `${ year }-${ month }-${ day }`;
      console.log("forma", formattedDate);
      return formattedDate
    },
    btnsearch1() {
      let end = new Date();
      let start = "";
      this.deliveryDateArr = ["", end];
      this.orderForm.deliveryStartTime = ""
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.orderForm.extensionFlag = 1
      this.search('basic')
    },
    // 为近3天
    btnsearch2() {
      const end = new Date();
      const start = "";
      end.setDate(end.getDate() + 3);
      this.deliveryDateArr = ["", end];
      this.orderForm.deliveryStartTime = ""
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.orderForm.extensionFlag = 0
      this.search('basic')
    },
    // 为近7天
    btnsearch3() {
      let end = new Date()
      let start = ""
      end.setDate(end.getDate() + 7);
      this.deliveryDateArr = ["", end];
      this.orderForm.deliveryStartTime = ""
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.orderForm.extensionFlag = 0
      this.search('basic')
    },
    // 为近30天
    btnsearch4() {
      let end = new Date()
      let start = ""
      end.setDate(end.getDate() + 30);
      this.deliveryDateArr = ["", end];
      this.deliveryDateArr[0] = ""
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.orderForm.extensionFlag = 0
      this.search('basic')
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    //
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ""
      if (cellValue.includes(":")) {
        return cellValue.replace(/:(.*?)(,|$)/g, "$2");
      } else {
        return cellValue;
      }
    },
    sortChange({prop, order}) {
      let newProp;
      if (prop === 'productName' || prop == 'pairingModeName' || prop == 'projectName' || prop === 'productCode' || prop === 'documentStatus' || prop == 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop == 'salesName' || prop == 'waitDeliverNum') {
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
      if (this.orderNoS) {
        this.orderForm.superQuery.condition.push(
          {"field": "orderNo", "fieldValue": this.orderNoS, "symbol": "like"}
        )
      }
      if (this.orderNoS) {
        this.$set(this.orderForm.superQuery, 'matchLogic', 'AND')
      }
      if (this.$store.getters.configData.sale.salePersonFlag) {
        this.orderForm.salesPersonFlag = 1
      }
      if (localStorage.getItem('loginTenant')) {
        this.orderForm.tenant = localStorage.getItem('loginTenant')
      }
      getOrderLineReport(this.orderForm).then(res => {
        const { page, total } = res.data
        this.tableData = page.records
        this.total = page.total
        this.totalNum = total.num || 0
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      this.orderForm.pageNum = 1
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
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      // 默认设置为近3天
      const end = new Date();
      const start = "";
      end.setDate(end.getDate() + 3);
      this.deliveryDateArr = ["", end];
      this.orderForm.deliveryStartTime = ""
      this.superForm = this.orderForm = {
        approvalStatus: "ok",
        documentStatus: "submit",
        deliveryEndTime: this.dateFun(this.deliveryDateArr[1]),
        deliveryStartTime: "",
        extensionFlag: 0,
        deliverQueryFlag: 1,
        pageNum: 1,
        pageSize: 20,
        shipmentStatus: "not_finish",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      }
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        {field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120},
      ]
      this.search('basic')
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
      if (!this.list.length) return this.$message.error("请选择您要发货的产品")
      let flag = this.hasDifferentCooperativePartnerCode(this.list)
      if (flag) return this.$message.error("只能选择相同客户的明细订单")
      console.log(111, this.list);
      this.addFormVisible = true
      // this.list.forEach(item => {
      //   this.$set(item, 'ordersNo', item.orderNo)
      // });
      this.$nextTick(() => {
        this.$refs.addForm.init("", btntype, false, this.list)
      })
    },
    hasDifferentCooperativePartnerCode(arr) {
      const codes = new Set();
      for (const item of arr) {
        codes.add(item.cooperativePartnerCode);
      }
      return codes.size > 1; // 如果有多个不同的代码，则返回 true
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
      }).catch(() => {
      })
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
      columnList = columnList.map(item => {
        return {label: item.label, prop: item.prop}
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
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
        exportType: '1005',
        exportName: '待发货订单',
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

.JNPF-common-head {
  padding: 8px !important;
}
</style>
