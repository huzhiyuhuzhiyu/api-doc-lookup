<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="productionPlanNoS" placeholder="生产计划单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderNoS" placeholder="生产任务单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="productDrawingNoS" placeholder="品名规格" clearable @keyup.enter.native="search()" />
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
            <div> </div>
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
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="生产任务单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id)">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="任务类型" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderType == 'normal'">正常订单</div>
                <div v-if="scope.row.orderType == 'rework'">返工订单</div>
              </template>
            </el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="160" />
            <el-table-column prop="productionQuantity" label="总生产数量" min-width="160" sortable="custom" />
            <el-table-column prop="completedQuantity" label="已完成数量" min-width="160" sortable="custom" />
            <el-table-column prop="routingName" label="工艺路线名称" min-width="160" sortable="custom" />
            <el-table-column prop="routingCode" label="工艺路线编码" min-width="160" sortable="custom" />
            
            <el-table-column prop="batchNumber" label="批次号" min-width="180" sortable="custom" />
            <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" sortable="custom" />
            <el-table-column prop="orderStatus" label="状态" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderStatus == 'normal'"> 正常 </div>
                <div v-if="scope.row.orderStatus == 'suspend'"> 暂停 </div>
                <div v-if="scope.row.orderStatus == 'closed'"> 关闭 </div>
                <div v-if="scope.row.orderStatus == 'finish'"> 已完成 </div>
              </template>
            </el-table-column>


            <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="urgentFlag" label="是否紧急" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.urgentFlag ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id)">查看详情</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <!-- <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" /> -->
  </div>
</template>

<script>
import { ordershengchanList, prodOrderClose } from '@/api/productOrdes/index.js'
import Form from '../ringTaskManagement/Form.vue'
// import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'assemblyTaskRecord',
  components: { Form, SuperQuery },
  data() {
    return {
      columnList: ["productCode", "routingCode", "planStartDate", "planEndDate", "createByName",],
      orderNoS: "",
      productDrawingNoS: "",
      productionPlanNoS: "",
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      orderForm: {},
      orderFormlist: {
        productsDrawingNo: "",
        productionPlanNo: "",
        orderNo: "",
        finishFlag: 1,
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
        classAttribute:"semi_finished",
      },
      total: 0,
      formVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "生产任务单号",
          type: 'input'
        },
        {
          prop: 'orderType',
          label: "任务类型",
          type: 'select',
          options: [
            { label: "正常订单", value: "normal" },
            { label: "返工订单", value: "rework" },
          ]
        },
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'productionQuantity',
          label: "总生产数量",
          type: 'input'
        },
        {
          prop: 'completedQuantity',
          label: "已完成数量",
          type: 'input'
        },
        {
          prop: 'routingName',
          label: "工艺路线名称",
          type: 'input'
        },
        {
          prop: 'routingCode',
          label: "工艺路线编码",
          type: 'input'
        },
        {
          prop: 'routingName',
          label: "工艺路线名称",
          type: 'input'
        },
        {
          prop: 'routingName',
          label: "工艺路线名称",
          type: 'input'
        },
         
        {
          prop: 'productionPlanNo',
          label: "生产计划单号",
          type: 'input'
        },
        {
          prop: 'orderStatus',
          label: "状态",
          type: 'select',
          options: [
            { label: "正常", value: "normal" },
            { label: "暂停", value: "suspend" },
            { label: "关闭", value: "closed" },
            { label: "已完成", value: "finish" },
          ]
        },
        {
          prop: 'urgentFlag',
          label: "是否紧急",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
      ],
 
    }
  },
  created() {
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search()
  },

  mounted() {
  },
  methods: {
   
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName'||prop=='productDrawingNo'||prop=='productCode'||prop=='routingName'||prop=='routingCode') {
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
      this.search()
    },
    initData() {
      this.listLoading = true

      if (this.orderNoS) {
        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("orderNo"));
          filteredData.push({ "field": "orderNo", "fieldValue": this.orderNoS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push(
            { "field": "orderNo", "fieldValue": this.orderNoS, "symbol": "like" }
          )
        }
      }
      if (this.productionPlanNoS) {

        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("productionPlanNo"));
          filteredData.push({ "field": "productionPlanNo", "fieldValue": this.productionPlanNoS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push(
            { "field": "productionPlanNo", "fieldValue": this.productionPlanNoS, "symbol": "like" }
          )
        }
      }
      if (this.productDrawingNoS) {

        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("productDrawingNo"));
          filteredData.push({ "field": "productDrawingNo", "fieldValue": this.productDrawingNoS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push(
            { "field": "productDrawingNo", "fieldValue": this.productDrawingNoS, "symbol": "like" }
          )
        }
      }
      if (this.orderNoS || this.customerDrawingNumberS || this.productDrawingNoS) {
        this.$set(this.orderForm.superQuery, 'matchLogic', 'AND')
      }
      ordershengchanList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    search() {

      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

      this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))

      this.orderNoS = ""
      this.productionPlanNoS = ""
      this.productDrawingNoS = ""
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },


    handleUserRelation(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, 'all')
      })
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

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
