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
              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="addSupplier('', 'add')">
                新建
              </el-button>
              <el-button size="mini" type="danger" icon="el-icon-close" @click.native="Cancelshipment()"
                :loading="qxbtnLoading">
                取消发货
              </el-button>
              <el-button type="primary" size="mini" icon="el-icon-download"
                @click="exportForm('dataTable')">导出</el-button>
            </div>
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
          <JNPF-table ref="dataTable" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
            v-if="tableDataFlag" :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" hasC customKey="JNPFTableKey_779868">
            <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.returnDeliveryNoticeId, 'look')">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerName" label="客户名称" width="200" sortable="custom" />
            <el-table-column prop="deliverDate" label="发货日期" width="180" sortable="custom"></el-table-column>
            <el-table-column prop="recipient" label="收件人" width="140" sortable="custom" />
            <el-table-column prop="phone" label="收件人电话" width="160" sortable="custom" />
            <el-table-column prop="customerProductNo" label="客户料号" width="160" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" width="160" sortable="custom"
              v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" width="300" sortable="custom" />
            
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
            <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" v-if="isPairingModeSwitch === '1'" />


            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
              v-if="isProjectSwitch == 1" />
            <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
            <el-table-column prop="deliveryQuantity" :label="mainUnitFlag == 1 ? '发货数量(主)' : '发货数量'" min-width="120">
            </el-table-column>
            <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
            <el-table-column prop="deputyNum" label="数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
            <el-table-column prop="outboundQuantity" label="已发出库数量" min-width="150" />

            <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  width="140" sortable="custom"
              v-if="sealingCoverTypingFlag == 1" />
            <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  width="120" sortable="custom"
              v-if="accuracyLevelFlag == 1" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
              v-if="vibrationLevelFlag == 1" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
            <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" v-if="oilQuantityFlag == 1" />
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
              v-if="packagingMethodFlag == 1" />
            <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  width="120" sortable="custom"
              v-if="specialRequireFlag == 1" />
            <el-table-column prop="material" label="保持架材质" width="130" sortable="custom" v-if="materialFlag == 1"></el-table-column>
            <el-table-column prop="colour" :label="$store.getters.colour"  width="120" sortable="custom" v-if="colourFlag == 1"></el-table-column>
            <el-table-column prop="ordersNo" label="订单号" width="180" sortable="custom" />
            <!-- <el-table-column prop="exchangeGoodsFlag" label="发货标识" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.exchangeGoodsFlag">
                  换货发货
                </div>
                <div v-else>
                  正常发货
                </div>
              </template>
            </el-table-column> -->
            <el-table-column prop="deliveryStatus" label="发货状态" width="120" sortable="custom" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.deliveryStatus == 'not_finished'">
                  <el-tag type="primary">未完成</el-tag>
                </div>
                <div v-else-if="scope.row.deliveryStatus == 'finished'">
                  <el-tag type="success">已完成 </el-tag>
                </div>
                <div v-else-if="scope.row.deliveryStatus == 'canceled'">
                  <el-tag type="danger">已取消</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
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
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.returnDeliveryNoticeId, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="addSupplier(scope.row.id, 'copy')">
                      复制通知单
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getQuotationdatasendlist, deleteQuotationsendlist, getQuotationdatasenddatalist, Cancelshipmentlist, Cancelshipmentlinelist, mergelist, splitlist } from '@/api/salesManagement'
import { UserListAll, } from '@/api/permission/user'
import Form from '../saleMetalworking/Form'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport, getOrderFiledMap } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
export default {
  name: 'foreigntradenotice',
  components: { Form, SuperQuery, ExportForm },
  mixins: [getProjectList],
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

      ],


      tableDataFlag: false,
      mainUnitFlag: null,

      superQueryVisible: false,
      exportFormVisible: false,
      qxbtnLoading: false,
      hbbtnLoading: false,
      btnLoading: false,
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      deliveryDatefahuo: [],
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      detailVisible: false,
      treeData: [],
      tableData: [],
      detailTableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      activeName: "orderList",
      salespersonList: [],
      detailFlag: false,
      exchangeList: [
        { label: "正常发货", value: false },
        { label: "换货发货", value: true }
      ],
      shipmentsStateList: [
        { label: "未完成", value: "undelivered" },
        { label: "已完成", value: "delivered" }
      ],
      orderStateList: [
        { label: "待检验", value: "unInspect" },
        { label: "已检验", value: "inspected" },
      ],
      isfullReceiptFlag: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: " 审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],


      paymentMethodList: [],
      paymentCycleList: [],
      orderForm: {},
      orderFormlist: {
        notifyType: 'sale',
        returnDeliveryType: 'delivery',
        orderNo: "",
        partnerCode: "",
        partnerName: "",
        rdsDate: '',
        rdeDate: '',
        inspectionStatus: '',
        documentStatus: '',
        createByName: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
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
          column: "create_time"
        }],
      },
      linesQuery: {},

      detailTotal: 0,
      salespersonList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      createTimeArr: [],
      deliveryDateArr: [],
      orderDateArr: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "单号",
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'deliverDate',
          label: '发货日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'recipient',
          label: "收件人",
          type: 'input'
        },
        {
          prop: 'phone',
          label: "收件人电话",
          type: 'input'
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
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        // {
        //   prop: 'deliveryQuantity',
        //   label: "发货数量",
        //   type: 'input'
        // },


        {
          prop: 'ordersNo',
          label: "订单号",
          type: 'input',
        }, 
        // {
        //   prop: 'exchangeGoodsFlag',
        //   label: "发货标识",
        //   type: 'select',
        //   options: [{ label: "换货发货", value: true }, { label: "正常发货", value: false },]
        // },
        {
          prop: 'deliveryStatus',
          label: "发货状态",
          type: 'select',
          options: [{ label: "未完成", value: "not_finished" }, { label: "已完成", value: "finished" }, { label: "已取消", value: "canceled" }]
        },

        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'select',
          options: [{ label: "草稿", value: "draft" }, { label: "提交", value: "submit" },]
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
      isProjectSwitch: '',
      isProductNameSwitch: "",
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag:'',
      colourFlag:'',
      bimProductAttributesList: [],
      isPairingModeSwitch: '', // 配对方式显示隐藏
    }
  },

  async created() {
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getPairingModeSwitch('product', 'enable_show_pairing_mode') // 配对方式显示隐藏
    this.advancedQueryFun()
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(7, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.superForm = this.orderForm
    this.search('basic')
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getMainUnitFun('deputyUnit', 'saleDeputyUnit')

  },
  methods: {
     // 配对方式显示隐藏
     async getPairingModeSwitch(code, type) {
      try {
        this.isPairingModeSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.tableDataFlag = true
      } catch (error) { }
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
    advancedQueryFun() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式          
      //     specialRequire //特殊要求
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'mainUnit')
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

    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    //明细列表取消发货
    Cancelshipmentline(id) {
      this.$confirm('您确认取消选中的发货通知单吗（已备货商品需手动处理）？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Cancelshipmentlinelist(id).then(res => {
          this.$message.success('取消成功')
          this.initData()
        })
      }).catch(() => { })
    },
    //禁用复选框
    checkSelectable(row) {
      if (row.deliveryStatus !== 'not_finished' || row.documentStatus == 'draft') return false
      return true
    },
    // 选中得数据
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //批量取消发货
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error("请先选择数据")
      let hasItemList = []
      this.selectArr.map(i => {
        if (i.outboundQuantity > 0) hasItemList.push(i.orderNo)
      })
      if (hasItemList.length) return this.$message.error(`已出库的订单：${hasItemList.join('、')}不能取消发货`)
      this.$confirm('您确认取消选中的发货通知单吗（已备货商品需手动处理）？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        let a = this.selectArr.map(item => {
          return item.returnDeliveryNoticeId
        })
        this.qxbtnLoading = true
        Cancelshipmentlist(a).then(res => {
          this.qxbtnLoading = false
          this.$message.success('取消成功')
          this.initData()
        }).catch(() => {
          this.qxbtnLoading = false
        })
      }).catch(() => { })
    },
    //合并订单
    mergeorderNo() {
      if (this.selectArr.length < 2) return this.$message.error("请先选择多条订单数据")
      let hasItemList = []
      this.selectArr.map(i => {
        if (i.stockStatus == 'finished') hasItemList.push(i.orderNo)
      })
      if (hasItemList.length) return this.$message.error(`已经备货的订单：${hasItemList.join('、')}不能合并`)
      if (this.selectArr.some(item => item.partnerCode !== this.selectArr[0].partnerCode)) return this.$message.error("所选订单客户不同")
      this.$confirm('确定合并所选订单', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        let a = this.selectArr.map(item => {
          return item.id
        })
        this.hbbtnLoading = true
        mergelist(a).then(res => {
          this.hbbtnLoading = false
          this.$message.success('合并成功')
          this.initData()
        }).catch(() => {
          this.hbbtnLoading = false
        })
      }).catch(() => { })
    },
    //拆分订单
    splitorderNo(row) {
      if (row.stockStatus == 'finished') return this.$message.error(`该订单已经备货不能拆分`)
      this.$confirm('确定拆分所选订单', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        splitlist(row.id).then(res => {
          this.$message.success('拆分成功')
          this.initData()
        })
      }).catch(() => { })
    },
    handleClick(e) {
      this.activeName = e.name
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode'  ||prop=='pairingModeName'  || prop == 'productName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName'
        || prop == 'ordersNo' || prop == 'oilQuantity' || prop == 'vibrationLevel' || prop == 'accuracyLevel' || prop == 'sealingCoverTyping' ||
        prop == 'productCode' || prop == 'productDrawingNo') {
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

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.search('basic')
      }
    },
    initData() {
      if (this.$store.getters.configData.sale.salePersonFlag) {
        this.orderForm.salesPersonFlag = 1
      }
      if (localStorage.getItem('loginTenant')) {
        this.orderForm.tenant = localStorage.getItem('loginTenant')
      }
      getQuotationdatasenddatalist(this.orderForm).then(res => {
        setTimeout(() => {
          res.data.records.forEach(item => {
            if (this.mainUnitFlag == 1) {
              if (item.calculationDirection == 'multiplication') {
                this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.deliveryQuantity, item.ratio]), 6))
              } else {
                this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.deliveryQuantity, item.ratio]), 6))
              }
            }
          });
          this.tableData = res.data.records
        }, 600);
        this.tableData = res.data.records
        this.total = res.data.total
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

      this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

      ]
      this.$refs.SuperQuery.conditionList = []
      this.search('basic')
    },
    addSupplier(id, btntype) {
      console.log(id, btntype);
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        console.log(id);
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
        deleteQuotationsendlist(id).then(res => {
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
    //确认收货
    confirmreceipt(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.filter(item => item.prop !== "deputyNum"); 
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      delete columnList.deputyNum
      console.log("columnList1",columnList);
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
        exportType: '1061',
        exportName: '销售发货通知单明细',
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
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
