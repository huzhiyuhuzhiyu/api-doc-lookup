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
                    @keyup.enter.native="search('basic')" />
                  <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                    clearable>
                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.deliveryDateArr"
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
                </el-date-picker>-
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
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
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
          <JNPF-table ref="dataTable" :data="tableData" :fixedNO="true" v-if="tableDataFlag"
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column>
            <el-table-column prop="orderNo" label="订单号" width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.ordersId, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="客户编码" width="160" sortable="custom" />
            <el-table-column prop="cooperativePartnerName" label="客户名称" width="160" sortable="custom" />
            <el-table-column prop="departmentName" label="所属部门" width="160"></el-table-column>
            <el-table-column prop="salesName" label="所属销售" width="160" sortable="custom" />
            <el-table-column prop="customerProductNo" label="客户料号" width="160" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
              v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom" />
            <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
              v-if="isProjectSwitch == 1" />
            <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
            <el-table-column prop="num" :label="mainUnitFlag == 1 ? '数量(主)' : '数量'" min-width="120">
            </el-table-column>
            <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
            <el-table-column prop="deputyNum" label="数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
            <el-table-column prop="deliveryDate" label="交货日期" width="160" sortable="custom" />
            <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"
              v-if="sealingCoverTypingFlag == 1" />
            <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"
              v-if="accuracyLevelFlag == 1" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
              v-if="vibrationLevelFlag == 1" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
            <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" v-if="oilQuantityFlag == 1" />
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
              v-if="packagingMethodFlag == 1" />
            <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
              v-if="specialRequireFlag == 1" />
            <el-table-column prop="material" label="保持架材质" width="120" v-if="materialFlag == 1"></el-table-column>
            <el-table-column prop="colour" label="颜色" width="120" v-if="colourFlag == 1"></el-table-column>
            <el-table-column prop="remark" label="备注" width="160" sortable="custom" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click.native="handleUserRelation(scope.row.ordersId, 'look')">
                  查看详情</el-button>
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
import { excelExport, getOrderFiledMap } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, getSaleordersTotal, getOrderLineReport } from '@/api/salesManagement/assemblyOrders'
import Form from '../orderList/Form'
import OrderFollow from '../orderList/orderFollow'
import UserRelationList from '../orderList/userRelation'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import {
  getbimProductAttributesList,
  getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
export default {
  name: 'delayedShipment',
  components: { Form, UserRelationList, ExportForm, OrderFollow, SuperQuery },
  mixins: [getProjectList],
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '订单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      columnList: ["cooperativePartnerCode", "departmentName", "createTime",],
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
      orderNoS: "",
      orderForm: {
        approvalStatus: "ok",
        documentStatus: "submit",
        orderState: "not_finish",
        deliveryEndTime: "",
        deliveryStartTime: "",
        extensionFlag: 1,
        deliverQueryFlag: 1,
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        },
        {
          asc: false,
          column: "t1.create_time"
        }
        ],
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
      totalNum: 0,
      filterText: '',
      totalDataForm: {},
      dateRange: [null, new Date()], //
      superQueryJson: [{
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
        type: 'custom',
        component: 'user-select',
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
        label: "品名规格",
        type: 'input'
      },
      {
        prop: 'mainUnit',
        label: "单位",
        type: 'input'
      },
      {
        prop: 'deliveryDate',
        label: "交货日期",
        type: 'input'
      },
      {
        prop: 'taxRate',
        label: "税率",
        type: 'select',
        options: []
      },


      {
        prop: 'ordersRemark',
        label: "备注",
        type: 'input'
      },
      {
        prop: 'documentStatus',
        label: "单据状态",
        type: 'select',
        options: [{ label: "草稿", value: "draft" }, { label: "提交", value: "submit" }]
      },
      {
        prop: 'createTime',
        label: '创建时间',
        type: 'daterange',
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
      ],

      mainUnitFlag: null,
      tableDataFlag: false,
      isProjectSwitch: '',
      isProductNameSwitch: '',
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
    this.getMainUnitFun('deputyUnit', 'saleDeputyUnit')
  },
  async created() {
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    this.advancedQueryFun()
    this.isProjectSwitchFlag = true
    await this.getProductNameSwitch('product', 'enable_productName')
    // 默认设置为近3天  
    const end = new Date();
    const start = new Date();
    end.setDate(end.getDate() + 3);
    this.deliveryDateArr = ["", end];
    this.orderForm.deliveryStartTime = ""
    this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
    this.superForm = this.orderForm
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(7, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.search('basic')
  },
  methods: {

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
    advancedQueryFun() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式          
      //     specialRequire //特殊要求
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'taxRate')
      if (this.colourFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'colour',
          label: '颜色',
          type: 'select',
          options: this.bimProductAttributesList.pa010.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.materialFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'material',
          label: '保持架材质',
          type: 'select',
          options: this.bimProductAttributesList.pa021.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.specialRequireFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'specialRequire',
          label: '特殊要求',
          type: 'select',
          options: this.bimProductAttributesList.pa016.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.packagingMethodFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.bimProductAttributesList.pa015.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.clearanceFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: this.bimProductAttributesList.pa001.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilQuantityFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: this.bimProductAttributesList.pa003.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: this.bimProductAttributesList.pa002.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }

      if (this.vibrationLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: this.bimProductAttributesList.pa005.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.accuracyLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'select',
          options: this.bimProductAttributesList.pa006.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.sealingCoverTypingFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'select',
          options: this.bimProductAttributesList.pa007.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }

    },
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })

    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.tableDataFlag = true
      } catch (error) { }
    },
    async getMainUnitFun(code, type) {
      this.listLoading = true
      try {
        this.mainUnitFlag = await this.jnpf.getMainUnitFun(code, type);
        this.listLoading = false
      } catch (error) { }
    },

    // 获取合计数据
    getOrderLineReportFun() {
      getOrderLineReport(this.orderForm).then(res => {
        console.log("合计", res);
        this.totalNum = res.data.total ? res.data.total.num : 0
      })
    },
    dateFun(dateStr) {
      const date = new Date(dateStr);
      // 获取年份、月份和日期  
      const year = date.getFullYear(); // 获取年份  
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份 (注意：月份从0开始，因此加1，并补齐两位数)  
      const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补齐两位数  
      // 拼接成年月日格式  
      const formattedDate = `${year}-${month}-${day}`;
      console.log("forma", formattedDate);
      return formattedDate
    },
    btnsearch1() {
      let end = new Date();
      let start = new Date();
      this.deliveryDateArr = ["", end];
      this.orderForm.deliveryStartTime = ""
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.superForm = this.orderForm
      this.search('basic')
    },
    // 为近3天  
    btnsearch2() {
      const end = new Date();
      const start = new Date();;
      end.setDate(end.getDate() + 3);
      this.deliveryDateArr = ["", end];
      this.orderForm.deliveryStartTime = ""
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.search()
    },
    // 为近7天  
    btnsearch3() {
      let end = new Date()
      let start = new Date()
      end.setDate(end.getDate() + 7);
      this.deliveryDateArr = ["", end];
      this.orderForm.deliveryStartTime = ""
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.search()
    },
    // 为近30天  
    btnsearch4() {
      let end = new Date()
      let start = new Date()
      end.setDate(end.getDate() + 30);
      this.deliveryDateArr = ["", end];
      this.orderForm.deliveryStartTime = ""
      this.orderForm.deliveryEndTime = this.dateFun(this.deliveryDateArr[1])
      this.search()
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
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName'||prop=='pairingModeName'  || prop == 'projectName' || prop === 'productCode' || prop === 'documentStatus' || prop == 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop == 'salesName') {
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
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      if (this.orderNoS) {
        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("orderNo"));
          filteredData.push({ "field": "orderNo", "fieldValue": this.orderNoS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push({ "field": "orderNo", "fieldValue": this.orderNoS, "symbol": "like" })
        }
      }
      if (this.orderNoS) {
        this.$set(this.orderForm.superQuery, 'matchLogic', 'AND')
      } else {
        if (!this.orderForm.superQuery.condition.length) {
          this.orderForm.superQuery = {
            condition: [],
            matchLogic: ""
          }
        }
      }
      getsaleOrderDetailList(this.orderForm).then(res => {
        setTimeout(() => {
          res.data.records.forEach(item => {
            if (this.mainUnitFlag == 1) {
              if (item.calculationDirection == 'multiplication') {
                this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
              } else {
                this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
              }
            }
          });
          this.tableData = res.data.records
        }, 600);
        this.getOrderLineReportFun()
        this.total = res.data.total
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
      const start = new Date();
      end.setDate(end.getDate() + 3);
      this.deliveryDateArr = ["", end];
      this.orderForm.deliveryStartTime = ""
      this.superForm = this.orderForm = {
        approvalStatus: "ok",
        documentStatus: "submit",
        orderState: "not_finish",
        deliveryEndTime: this.dateFun(this.deliveryDateArr[1]),
        deliveryStartTime: "",
        extensionFlag: 1,
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
      }
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '订单号', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.$refs.SuperQuery.conditionList = []
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
        exportType: '1005',
        exportName: '延期发货预警',
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
