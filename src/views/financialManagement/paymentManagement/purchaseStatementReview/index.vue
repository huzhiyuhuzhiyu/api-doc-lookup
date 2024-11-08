<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head" style="padding: 8px">
            <div></div>
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
          <JNPF-table v-loading="listLoading" :data="tableData" @sort-change="sortChange" ref="dataTable" custom-column>
            <el-table-column prop="fullName" label="流程标题" show-overflow-tooltip min-width="150" />
            <el-table-column prop="startTime" label="发起时间" min-width="150" :formatter="jnpf.tableDateFormat" />
            <el-table-column prop="userName" label="发起人员" min-width="130" />
            <el-table-column prop="flowUrgent" label="紧急程度" min-width="100" align="center">
              <template slot-scope="scope">
                {{ scope.row.flowUrgent | urgentText() }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="流程状态" min-width="130" align="center">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status == 2">审核通过</el-tag>
                <el-tag type="danger" v-else-if="scope.row.status == 3">审核驳回</el-tag>
                <el-tag type="info" v-else-if="scope.row.status == 4">流程撤回</el-tag>
                <el-tag type="info" v-else-if="scope.row.status == 5">审核终止</el-tag>
                <el-tag type="primary" v-else>等待审核</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="creatorTime" label="接收时间" min-width="150">
              <template slot-scope="scope">
                {{ scope.row.creatorTime | toDate() }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="60" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="toDetail(scope.row)">审批</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>

    <component :is="listPageComponent" v-if="depFormVisible" ref="depForm" @close="close" />
    <FlowBox v-if="formVisible" ref="FlowBox" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getFlowBeforeList } from '@/api/workFlow/FlowBefore'
import purReconciliationForm from '../components/purReconciliationForm.vue'
import moment from 'moment'
import findPage from '../findPage.js'
import SuperQuery from '@/components/SuperQuery/index.vue'
import FlowBox from '@/views/workFlow/components/FlowBox.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  name: 'quality',
  components: {
    purReconciliationForm,
    SuperQuery,
    FlowBox
  },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '审批单号',
          type: 'input'
        },
        {
          prop: 'documentNo',
          label: '业务单号',
          type: 'input'
        },

        {
          prop: 'businessName',
          label: '流程标题',
          type: 'input'
        },
        {
          prop: 'businessName',
          label: '所属业务',
          type: 'input'
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'submitDate',
          label: '发起时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        }
      ],
      activeName: 'dont',
      depFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        businessFlow: 'b012',
        flowCategory: '',
        businessFlag: true, // 1 是 3  0 是 1和2
        createByName: '',
        creatorUserId: '',
        endTime: '',
        endUpdateTime: '',
        flowCategory: '',
        flowId: '',
        orderItems: [
          {
            asc: false,
            column: 'F_CreatorTime'
          }
        ],
        keyword: '',
        nodeCode: '',
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        startUpdateTime: '',
        totalRowFlag: false,
        pickerVal: []
      },
      total: 0,
      formVisible: false,
      statusList: [
        {
          label: '审批中',
          value: 'ing'
        },
        {
          label: '审批通过',
          value: 'ok'
        },
        {
          label: '审批拒绝',
          value: 'rebut'
        }
      ],
      findPageList: findPage.approvalList,
      listPageComponent: ''
    }
  },
  watch: {},
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
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    close(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) this.initData()
    },
    refresh() {
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.categoryIndex = -1
      this.getCount()
      this.initData()
    },
    initData() {
      this.listLoading = true
      this.visible = false
      this.jnpf.searchTimeFormat(this.listQuery, 'submitDate', 'submitStartDate', 'submitEndDate')
      this.jnpf.searchTimeFormat(this.listQuery, 'finishDate', 'finishStartDate', 'finishEndDate')
      getFlowBeforeList(1, this.listQuery)
        .then((res) => {
          console.log('货位表格', res)
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      // if (this.activeName === 'dont') {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      // }
      //  else {
      //   Object.keys(this.linesQuery).forEach(key => {
      //     let item = this.linesQuery[key]
      //     this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
      //   })
      //   this.linesQuery.pageNum = 1
      // }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },
    addOrUpdateHandle(id, type, btnType, pageType) {
      let targetPage = this.findPageList.find((item) => item.label === pageType)
      this.listPageComponent = targetPage.value
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type, btnType, targetPage.label)
      })
    },
    toDetail(item) {
      let data = {
        id: item.processId,
        enCode: item.flowCode,
        flowId: item.flowId,
        formType: item.formType,
        opType: 1,
        taskNodeId: item.thisStepId,
        taskId: item.id,
        businessId: item.businessId,
        businessFlow: item.businessFlow
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.FlowBox.init(data)
      })
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
