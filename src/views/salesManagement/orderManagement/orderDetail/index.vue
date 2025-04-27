<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6" v-if="abProjectSwitchVisible" >
                    <el-form-item>
                      <el-select v-model="orderForm.projectId" placeholder="请选择所属项目" style="width: 100%;" filterable>
                        <el-option v-for="item in abProjectList" :key="item.id" :label="item.name"
                          :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
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
            <el-table-column prop="productCode" label="产品编码" width="140" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
              v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom" />
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />

            <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" v-if="isPairingModeSwitch === '1'" />
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
              v-if="abProjectSwitchVisible" />
            <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
            <el-table-column prop="num" :label="mainUnitFlag == 1 ? '数量(主)' : '数量'" min-width="120">
            </el-table-column>
            <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
            <el-table-column prop="assistantNum" label="数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
            <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom" />
            <el-table-column prop="price" label="单价(含税)" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="taxRate" label="税率" width="120" sortable="custom"></el-table-column>
            <el-table-column prop="totalAmount" label="金额(含税)" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="140" sortable="custom"></el-table-column>
            <el-table-column prop="contractNo" label="客户合同号" width="120"></el-table-column>
            <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping" min-width="150" sortable="custom"
              v-if="sealingCoverTypingFlag == 1" />
            <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel" width="120" sortable="custom"
              v-if="accuracyLevelFlag == 1" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
              v-if="vibrationLevelFlag == 1" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
            <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" v-if="oilQuantityFlag == 1" />
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
              v-if="packagingMethodFlag == 1" />
            <el-table-column prop="specialRequire" :label="$store.getters.specialRequire" width="120" sortable="custom"
              v-if="specialRequireFlag == 1" />
            <el-table-column prop="material" label="保持架材质" width="130" sortable="custom"
              v-if="materialFlag == 1"></el-table-column>
            <el-table-column prop="colour" :label="$store.getters.colour" width="120" sortable="custom"
              v-if="colourFlag == 1"></el-table-column>
            <el-table-column prop="receivingAddress" label="收货地址" min-width="120" :key="10201"></el-table-column>

            <el-table-column prop="remark" label="备注" width="120" sortable="custom" />
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom">
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
                    <!-- <el-dropdown-item @click.native="orderFollow(scope.row.ordersId)"
                      v-if="scope.row.documentStatus == 'submit'">
                      订单跟踪
                    </el-dropdown-item> -->
                  </el-dropdown-menu>
                </el-dropdown>
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

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList"
      :saleContractNoSwitch="saleContractNoSwitch" />


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
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";

export default {
  name: 'orderDetails',
  components: { Form, UserRelationList, ExportForm, OrderFollow, SuperQuery },
  mixins: [AbProjectMixin],
  data() {
    return { 
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
      
        { field: 'orderNo', fieldValue: '', label: '订单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },

      ],



      totalNum: 0,
      columnList: ["cooperativePartnerCode", "departmentName", "assistantNum", "taxRate", "createTime",],
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
          prop: 'projectId',
          label: '所属项目',
          type: 'select',
          options: []
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
          label: " 客户料号",
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
          label: '交货日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'contractNo',
          label: '客户合同号',
          type: 'input',
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
          pickerOptions: this.global.timePickerOptions
        },





      ],
      mainUnitFlag: null,
      tableDataFlag: false,
      isProductNameSwitch: '',
      isPairingModeSwitch: '', // 配对方式显示隐藏
      pairingModeList: [], // 配对方式数据来源
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
      saleContractNoSwitch: null,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  mounted() {
    this.getMainUnitFun('deputyUnit', 'saleDeputyUnit')
  
  },
  computed: {
    ...mapGetters(['userInfo'])
  },


  async created() {
    await Promise.all([
      this.jnpf.getMainUnitFun('orderField', 'customerContractNo'),
    ]).then(([
      saleContractNoSwitch,
    ]) => {
      this.saleContractNoSwitch = saleContractNoSwitch
    }).catch(error => {
      console.error('请求失败:', error);
    });
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getPairingModeSwitch('product', 'enable_show_pairing_mode') // 配对方式显示隐藏
    await this.getpairingModeListFun()
    await this.getProjectSwitch()
    this.advancedQueryFun()
    this.tableDataFlag = true
    let arr=[]
    console.log("this.abProjectList",this.abProjectList);
    this.abProjectList.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.id
          }
          arr.push(obj)
        })
        let classAttributeObj = this.superQueryJson.find((item) => item.prop === 'projectId')

if (classAttributeObj) {
  classAttributeObj.options = arr
}
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(7, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    if (this.isPairingModeSwitch == 1) {
      this.superQueryJson.splice(7, 0, {
        prop: 'pairingModeName',
        label: '配对方式',
        type: 'select',
        options: this.pairingModeList.map(item=>{
          return {label:item.name,value:item.name}
        })
      })
    }
    if (this.$store.getters.configData.sale.salePersonFlag) {
      this.orderForm.salesPersonFlag = 1
    }
    this.superForm = this.orderForm
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
      //     material //保持架材质          
      //     colour //颜色
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'contractNo')
      if (this.colourFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'colour',
          label: this.$store.getters.colour,
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
          label: this.$store.getters.specialRequire,
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
          label: this.$store.getters.accuracyLevel,
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
          label: this.$store.getters.sealingCoverTyping,
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
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        // this.tableDataFlag = true
      } catch (error) { }
    },
    // 配对方式显示隐藏
    async getPairingModeSwitch(code, type) {
      try {
        this.isPairingModeSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    // 获取配对方式数据来源
    async getpairingModeListFun() {
      try {
        this.pairingModeList = await this.jnpf.getpairingModeListFun()
        console.log("this.par", this.pairingModeList);
      } catch (error) { }
    },
    async getMainUnitFun(code, type) {
      this.listLoading = true
      try {
        this.mainUnitFlag = await this.jnpf.getMainUnitFun(code, type);
        this.listLoading = false


      } catch (error) {
      }
    },
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })







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
    // 获取合计数据
    getOrderLineReportFun() {
      getOrderLineReport(this.orderForm).then(res => {
        console.log("合计", res);
        this.totalNum = res.data.total ? res.data.total.num : 0
      })
    },



    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
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
      if (prop === 'productName' || prop == 'pairingModeName' || prop == 'projectName' || prop === 'productCode' || prop === 'documentStatus' || prop == 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop == 'salesName') {
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
        this.search('basic')
      }
    },
    initData() {
      if (localStorage.getItem('loginTenant')) {
        this.orderForm.tenant = localStorage.getItem('loginTenant')
      }
      getsaleOrderDetailList(this.orderForm).then(res => {
        console.log("5555");

        setTimeout(() => {
          res.data.records.forEach(item => {
            if (this.mainUnitFlag == 1) {
              if (item.calculationDirection == 'multiplication') {
                this.$set(item, 'assistantNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))

              } else {

                this.$set(item, 'assistantNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
              }
            }
          });
          this.tableData = res.data.records
        }, 600);
        this.total = res.data.total
        this.getOrderLineReportFun()
      }).catch(() => {
        this.listLoading = false
      })

    },


    search(type) {
      console.log(66666);
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

      this.superForm = this.orderForm = {
        cooperativePartnerName: "",
        customerProductDrawingNo: "",

        orderNo: "",

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
        { field: 'cooperativePartnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },

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
        exportName: '销售订单明细',
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
</style>
