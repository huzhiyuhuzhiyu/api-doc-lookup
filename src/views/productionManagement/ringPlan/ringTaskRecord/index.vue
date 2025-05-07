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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" v-if="isProjectSwitchFlag"
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_199723">
            <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" sortable="custom" />
            <el-table-column prop="orderNo" label="生产任务单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id)">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="任务类型" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderType == 'normal'">正常任务</div>
                <div v-if="scope.row.orderType == 'rework'">返工任务</div>
                <div v-if="scope.row.orderType == 'manually'">手动新建任务</div>

              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="120" sortable="custom" 
              v-if="$store.getters.configData.produce.production_related_customers" />
            <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
            <el-table-column prop="mainUnit" label="单位" width="160" />
            <el-table-column prop="productionQuantity" label="总生产数量" min-width="160" sortable="custom" />
            <el-table-column prop="completedQuantity" label="已完成数量" min-width="160" sortable="custom" />
            <el-table-column prop="routingName" label="工艺路线名称" min-width="160" sortable="custom" />
            <el-table-column prop="routingCode" label="工艺路线编码" min-width="160" sortable="custom" />
            
            <el-table-column prop="batchNumber" label="批次号" min-width="180" sortable="custom" />
            <el-table-column prop="orderStatus" label="状态" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderStatus == 'normal'"><el-tag >正常</el-tag> </div>
                <div v-if="scope.row.orderStatus == 'suspend'"><el-tag type="info">暂停</el-tag></div>
                <div v-if="scope.row.orderStatus == 'closed'"><el-tag type="danger">关闭</el-tag></div>
                <div v-if="scope.row.orderStatus == 'finish'"><el-tag type="success">已完成</el-tag></div>
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
import Form from '../ringTaskManagement/taskFormCopy.vue'
// import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'assemblyTaskRecord',
  components: { Form, SuperQuery },
  mixins: [getProjectList],
  data() {
    return {
      superQueryVisible:false,
      isProjectSwitch: '',
      isProjectSwitchFlag: false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],
      columnList: ["productCode", "routingCode", "planStartDate", "planEndDate", "createByName",],
       
     
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
            { label: "正常任务", value: "normal" },
            { label: "返工任务", value: "rework" },
            { label: "手动新建任务", value: "manually" },

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
      isProductNameSwitch:"",

    }
  },
 
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(3, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.isProjectSwitchFlag = true
       this.superForm= this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  }, 
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
 
      } catch (error) { }
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' ||prop=='productName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName'||prop=='productDrawingNo'||prop=='productCode'||prop=='routingName'||prop=='routingCode') {
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
      this.search('basic')
    },
    initData() {
      this.listLoading = true

      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
  
      ordershengchanList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
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

    this.superForm=  this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))

   
      this.$refs.SuperQuery.conditionList = []
      
      this.searchList= [
        { field: 'productionPlanNo', fieldValue: '', label: '生产计划单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.search('basic')
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
