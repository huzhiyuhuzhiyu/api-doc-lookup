<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.orderNo" @keyup.enter.native="search()" placeholder="请输入生产订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productName" @keyup.enter.native="search()" placeholder="请输入产品名称"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.workOrderNo" @keyup.enter.native="search()" placeholder="请输入工作令号"
                clearable />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <!-- <el-button size="mini" @click="handleBatch()" type="primary">批量检验</el-button> -->
          </div>
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
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
          custom-column @selection-change="currentChange" :setColumnDisplayList="columnList">
          <el-table-column prop="orderNo" label="任务单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                {{ scope.row.orderNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="workNo" label="工单单号" width="120" sortable="custom" />
          <el-table-column prop="orderNo" label="报工单号" width="160" sortable="custom" />
          <el-table-column prop="productDrawingNo" label="品名规格" min-width="400" sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" width="120" sortable="custom" />
          <el-table-column prop="mainUnit" label="单位" width="120" />
          <el-table-column prop="productionQuantity" label="生产数量" width="120" sortable="custom" />
          <el-table-column prop="completedQuantity" label="已完成数量" width="120" />
          <el-table-column prop="qualifiedQuantity" label="合格数量" width="120" sortable="custom" />
          <el-table-column prop="unqualifiedQuantity" label="不合格数量" width="120" sortable="custom" />
          <el-table-column prop="responsibilityWasteQuantity" label="责废数量" width="120" sortable="custom" />
          <el-table-column prop="materialWasteQuantity" label="料废数量" width="120" sortable="custom" />
          <el-table-column prop="utilizeQuantity" label="利用数量" width="120" sortable="custom" />
          <el-table-column prop="reworkQuantity" label="返工数量" width="120" sortable="custom" />
          <el-table-column prop="producerName" label="生产人" width="120" sortable="custom" />
          <el-table-column prop="reportingTime" label="报工时间" width="120" sortable="custom" />
          <el-table-column prop="reporterName" label="报工人" width="120" sortable="custom" />
          <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
          <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row)" editText="检验" :hasDel="false">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" :startingStatusList="startingStatusList"
      :workOrderStatusList="workOrderStatusList" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getprodOrderList } from '@/api/productOrdes/finishedProductOrders' // 生产订单列表
import Form from '../components/inspectionNoticeForm.vue'
import DetailForm from '@/views/productionOrders/productOrdersMan/finishedOrdersManage/Form.vue'
// import DetailForm from './DetailForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  components: { Form, DetailForm, SuperQuery },
  data() {
    return {
      columnList: ['productCode', 'planStartDate', 'planEndDate'],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '单号',
          type: 'input'
        },
        {
          prop: 'workNo',
          label: '工单单号',
          type: 'input'
        },
        {
          prop: 'orderNo',
          label: '单号',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },

        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'processName',
          label: '工序名称',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'productionQuantity',
          label: '生产数量',
          type: 'input'
        },
        {
          prop: 'completedQuantity',
          label: '已完成数量',
          type: 'input'
        },
        {
          prop: 'unqualifiedQuantity',
          label: '不合格数量',
          type: 'input'
        },
        {
          prop: 'responsibilityWasteQuantity',
          label: '责废数量',
          type: 'input'
        },
        {
          prop: 'materialWasteQuantity',
          label: '料废数量',
          type: 'input'
        },
        {
          prop: 'utilizeQuantity',
          label: '利用数量',
          type: 'input'
        },
        {
          prop: 'reworkQuantity',
          label: '返工数量',
          type: 'input'
        },
        {
          prop: 'producerName',
          label: '生产人',
          type: 'input'
        },
        {
          prop: 'reportingTime',
          label: '报工时间',
          type: 'input'
        },
        {
          prop: 'reporterName',
          label: '报工人',
          type: 'input'
        },
        {
          prop: 'planStartDate',
          label: '计划开始日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'planEndDate',
          label: '计划结束日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        }
      ],

      visible: false,
      detailFormVisible: false,
      activeName: 'dataTable',
      tableData: [],
      listLoading: false,
      startingStatusList: [
        { label: '未开工', value: 'not_started' },
        { label: '开工中', value: 'in_progress' },
        { label: '已完工', value: 'finished' }
      ], // 开工状态
      workOrderStatusList: [
        { label: '正常', value: 'normal' },
        { label: '暂停', value: 'suspend' },
        { label: '关闭', value: 'closed' },
        { label: '已完成', value: 'finish' }
      ], // 派工单状态
      listQuery: {},
      initListQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        orderNo: '',
        workOrderNo: '',
        productCode: '',
        productName: '',
        productDrawingNo: '',
        orderType: 'normal',
        planSsd: '',
        planSed: '',
        planEsd: '',
        planEed: '',
        receiveStatus: '',
        businessCode: 'metalworking',
        // "productionStatus": "production_completed", // 生产状态：已完成
        // "orderStatus": "finish", // 订单状态：已完成
        // inspectionStatus: "unInspect", // 检验状态：未检验
        inspectFlag: true, // 仅保留需要检验的数据
        insertOrderFlag: '',
        demandType: '',
        documentStatus: 'submit'
      },
      planStartArr: [],
      planEndArr: [],
      total: 0,
      formVisible: false,
      selectedData: []
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.jnpf.searchTimeFormat(this.listQuery, this.planStartArr, 'planSsd', 'planSed')
      this.jnpf.searchTimeFormat(this.listQuery, this.planEndArr, 'planEsd', 'planEed')
      getprodOrderList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records.map((row) => ({
            ...row,
            inspectionQuantity: this.jnpf.math('subtract', [
              row.completedQuantity,
              row.qualifiedQuantity,
              row.underInspectionQuantity
            ])
          }))
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.planStartArr = []
      this.planEndArr = []
      this.search()
    },
    addOrUpdateHandle(id, readOnly) {
      if (readOnly) {
        this.detailFormVisible = true
        console.log(id)
        this.$nextTick(() => {
          this.$refs.DetailForm.init(id, readOnly)
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(id, readOnly, 'finished', 'notice', 'QCDH','QCDH')
        })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if ([].includes(prop)) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    currentChange(val) {
      this.selectedData = val
    },
    handleBatch() {
      if (!this.selectedData.length) return this.$message.error('请先选择要检验的生产订单')
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.selectedData, false, 'finished_batch')
      })
    }
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
