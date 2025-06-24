<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!MRPForm">
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
                <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                  style="width: 100%;" start-placeholder="计划开始日期" end-placeholder="计划结束日期" clearable>
                </el-date-picker>
              </el-form-item>
            </el-col>
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
            <topOpts @add="calculationFun()" :addText="'计算'">
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
          <JNPF-table ref="dataTable" :data="tableData" :fixedNO="true" v-if="isProjectSwitchFlag"
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column
            @selection-change="handleSelectionChange" hasC customKey="JNPFTableKey_831347">
            <el-table-column prop="planNo" label="计划单号" min-width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row, 'look')">{{
                  scope.row.planNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="classAttribute" label="类别属性" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.classAttribute == 'finish_product'">成品</div>
                <div v-if="scope.row.classAttribute == 'raw_material'">原材料</div>
                <div v-if="scope.row.classAttribute == 'semi_finished'">半成品</div>
                <div v-if="scope.row.classAttribute == 'accessories'">配件</div>
              </template>
            </el-table-column>
            <el-table-column prop="planType" label="计划类型" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.planType == 'order_plan'">订单计划</div>
                <div v-if="scope.row.planType == 'add_plan'">添加计划</div>
                <div v-if="scope.row.planType == 'safety_stock_plan'">安全库存计划</div>
              </template>
            </el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
              v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
            <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" v-if="isPairingModeSwitch === '1'" />


            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
              v-if="isProjectSwitch == 1" />
            <el-table-column prop="productSource" label="产品来源" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.productSource == 'purchase'">采购</div>
                <div v-if="scope.row.productSource == 'out'">外协</div>
                <div v-if="scope.row.productSource == 'produce'">生产</div>
                <div v-if="scope.row.productSource == 'assemble'">组装</div>
              </template>
            </el-table-column>
            <el-table-column prop="bomFlag" label="是否有BOM" min-width="140" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.bomFlag">有BOM</div>
                <div v-else>无BOM</div>
              </template>
            </el-table-column>
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" sortable="custom" />
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="80" />
            <el-table-column prop="planQuantity" label="计划数量" min-width="120" sortable="custom" />
            <el-table-column prop="qualificationRate" label="合格率(%)" min-width="120" sortable="custom" />
            <el-table-column prop="relaxQuantity" label="宽放计划数量" min-width="160" sortable="custom" />
            <el-table-column prop="finalPlanQuantity" label="最终计划数量" min-width="150" sortable="custom" />
            <AttributeColumns :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'sale'" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" sortable="custom" />
            <el-table-column prop="replaceStatus" label="替换状态" sortable="custom" width="120" align="center">
               <template slot-scope="scope">
                   <div v-if="scope.row.replaceStatus === 'not_replace'"><el-tag type="warning">未替换</el-tag>
                   </div>
                   <div v-else-if="scope.row.replaceStatus === 'replacing'"><el-tag>替换中</el-tag></div>
                   <div v-else-if="scope.row.replaceStatus === 'replaced'"><el-tag type="success">已替换</el-tag></div>
               </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220" fixed="right">
              <template slot-scope="scope">
                <el-button v-has="'btn_replaceApply'" size="mini" type="text" :disabled="scope.row.replaceStatus === 'replacing' || !scope.row.bomFlag"
                  @click.native="sendReplaceRequest(scope.row)">发起替换申请</el-button>
                <el-button size="mini" type="text"
                  @click.native="handleUserRelation(scope.row, 'look')">查看详情</el-button>

              </template>
            </el-table-column>
          </JNPF-table>

          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData">

          </pagination>

        </div>
      </div>

    </div>



    <PlanForm v-if="formVisible" ref="orderForm" @refreshDataList="initData" @close="closeForm" />
    <Form v-if="mrpForm" ref="MRPForm" @refreshDataList="initData" @close="closeForm" />


    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ReplaceRulesForm v-if="ReplaceRulesFormVisible" ref="ReplaceRulesForm" @refreshDataList="initData"
                        @close="closeForm" />
  </div>
</template>

<script>
import { excelExport, getOrderFiledMap } from '@/api/basicData/index'
import PlanForm from '../../assemblyPlan/salesOrderCreation/Form.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment'
import Form from './Form.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { addPlanList, updatePlanList, deletePlanList, getPlanList, detailPlanList } from '@/api/calculationList/calculationList.js'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import ReplaceRulesForm from '@/views/planManagement/MRPoperation/pendClculationPlan/ReplaceRulesForm.vue'
export default {
  name: 'pendClculationPlan',
  components: { ReplaceRulesForm, PlanForm, Form, ExportForm, SuperQuery },
  mixins: [getProjectList],
  data() {
    return {
        /**设置替换规则表单 */
      replaceRulesVisibie: false,
      ReplaceRulesFormVisible: false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      columnList: ["classAttribute", "planType", "planQuantity", "qualificationRate", "relaxQuantity", 'createByName','replaceStatus'],
      superQueryVisible: false,
      exportFormVisible: false,
      tableData: [],
      listLoading: false,
      orderForm: {
        planNo: "",
        documentStatus: "submit",
        productDrawingNo: "",
        planSsd: "",
        planSed: "",
        pageNum: 1,
        pageSize: 20,
        planState: "not_finished",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

        superQuery: {
          condition: [],
          matchLogic: ""
        },
      },
      mrpForm: false,

      deliveryDateArr: [],
      total: 0,
      formVisible: false,
      filterText: '',
      superQueryJson: [
        {
          prop: 'planNo',
          label: "计划单号",
          type: 'input'
        },
        {
          prop: 'classAttribute',
          label: "类别属性",
          type: 'select',
          options: [
            { label: "成品", value: "finish_product" },
            { label: "原材料", value: "raw_material" },
            { label: "半成品", value: "semi_finished" },
            { label: "配件", value: "accessories" },
          ]
        },
        {
          prop: 'planType',
          label: "计划类型",
          type: 'select',
          options: [
            { label: "订单计划", value: "order_plan" },
            { label: "添加计划", value: "add_plan" },
            { label: "安全库存计划", value: "safety_stock_plan" },
          ]
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
          prop: 'productSource',
          label: "产品来源",
          type: 'select',
          options: [
            { label: "采购", value: "purchase" },
            { label: "外协", value: "out" },
            { label: "生产", value: "produce" },
            { label: "组装", value: "assemble" },
          ]
        },
        {
          prop: 'bomFlag',
          label: "是否有BOM",
          type: 'select',
          options: [
            { label: "有", value: true },
            { label: "无", value: false },
          ]
        },
        {
          prop: 'planStartDate',
          label: '计划开始日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'planEndDate',
          label: '计划结束日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },

        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },




        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
      ],
      selectList: [],
      isProjectSwitch: '',
      isProjectSwitchFlag: false,
      isProductNameSwitch: "",
      isPairingModeSwitch: '', // 配对方式显示隐藏
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


  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getPairingModeSwitch('product', 'enable_show_pairing_mode') // 配对方式显示隐藏
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(4, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.superForm = this.orderForm
    this.search('basic')

  },
  methods: {
     // 配对方式显示隐藏
     async getPairingModeSwitch(code, type) {
      try {
        this.isPairingModeSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.tableDataFlag = true
      } catch (error) { }
    },



    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
    },
    calculationFun() {
      if (!this.selectList.length) return this.$message.error("请选择您要进行计算的计划数据")
      let replacingFlag = this.selectList.some((item) => item.replaceStatus === 'replacing')
      if (replacingFlag) return this.$message.error("您选择的计划数据存在产品正在替换中，请检查！")
      this.mrpForm = true
      this.$nextTick(() => {
        this.$refs.MRPForm.init(this.selectList)
      })
    },

    handleSelectionChange(val) {
      this.selectList = val
    },







    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },





    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName'||prop=='pairingModeName'  || prop == 'projectName' || prop === 'productCode' || prop === 'documentStatus' || prop == 'productDrawingNo') {
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
      console.log(1111);
      this.formVisible = false
      this.ReplaceRulesFormVisible = false
      this.mrpForm = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''

      getPlanList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
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

      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.orderForm.planSsd = this.deliveryDateArr[0]
        this.orderForm.planSed = this.deliveryDateArr[1]
      } else {
        this.orderForm.planSsd = ""
        this.orderForm.planSed = ""
      }
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
       this.deliveryDateArr = []
       this.superForm =this.orderForm = {
        planNo: "",
        documentStatus: "submit",
        productDrawingNo: "",
        planSsd: "",
        planSed: "",
        pageNum: 1,
        pageSize: 20,
        planState: "not_finished",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

        superQuery: {
          condition: [],
          matchLogic: ""
        },
      }
      this.searchList = [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.search('basic')
    },




    handleUserRelation(data, btnType) {
      console.log(data, btnType);
      // 订单创建计划
      detailPlanList(data.id).then(res => {
        console.log("订单计划详情", res);
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.orderForm.init(data.id, btnType, res.data, data.planType)
        })
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
        exportType: '1014',
        exportName: '计划管理',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
      /**发起替代申请 */
      sendReplaceRequest(planData) {
          this.ReplaceRulesFormVisible = true
          this.$nextTick(() => { this.$refs.ReplaceRulesForm.init(planData, 'add') })
      },
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
  background-color: #f5f5f5;
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
