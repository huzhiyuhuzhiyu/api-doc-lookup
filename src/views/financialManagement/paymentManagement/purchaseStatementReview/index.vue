<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="请输入审批单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="listQuery.submitDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;" start-placeholder="审批开始时间" end-placeholder="审批结束时间"
                  :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.businessName" placeholder="请输入所属业务" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>

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
            <el-table-column prop="orderNo" label="审批单号" min-width="180">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="addOrUpdateHandle(scope.row, 'look', 'disabled', scope.row.approvalBusinessCode)">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="documentNo" label="业务单号" min-width="180" />
            <el-table-column prop="businessName" label="流程标题" min-width="180">
              <template slot-scope="scope">
                <div>{{ scope.row.createByName }} {{ scope.row.businessName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="businessName" label="所属业务" min-width="160" />
            <el-table-column prop="createByName" label="发起人" min-width="160" />
            <el-table-column prop="submitDate" label="发起时间" min-width="180" />
            <!-- <el-table-column prop="finishTime" label="完成时间"min-width="180" />
                <el-table-column prop="approvalFormStatus" label="流程状态" align="center" min-width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalFormStatus == 'ing'">
                      <el-tag>审批中</el-tag>
                    </div>
                    <div v-else-if="scope.row.approvalFormStatus == 'ok'">
                      <el-tag type="success">审批通过</el-tag>
                    </div>
                    <div v-else-if="scope.row.approvalFormStatus == 'rebut'">
                      <el-tag type="danger">审批拒绝</el-tag>
                    </div>
                  </template>
                </el-table-column> -->
            <el-table-column label="操作" min-width="140">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click="addOrUpdateHandle(scope.row, 'look', '', scope.row.approvalBusinessCode)">
                  审批
                </el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="addOrUpdateHandle(scope.row, 'look', 'disabled', scope.row.approvalBusinessCode)">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>


    <component :is="listPageComponent" v-if="depFormVisible" ref="depForm" @close="close" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { approvalCenterList, transfer } from '@/api/basicData/approvalAdministrator'

import purReconciliationForm from '../components/purReconciliationForm.vue'
import moment from 'moment'
import findPage from '../findPage.js'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'quality',
  components: {
    purReconciliationForm, SuperQuery
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
        },

      ],
      activeName: 'dont',
      depFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        createByName: '',
        endTime: '',
        keyword: '',
        label: 'dont', // 待处理
        businessCode: 'b013',
        orderNo: '',
        orderItems: [
          {
            asc: true,
            column: ''
          },
          {
            asc: false,
            column: 'create_time' /* 使用倒序日期作为默认排序 */
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        approvalFormStatus: '',
        submitStartDate: '',
        submitEndDate: '',
        submitDate: [],
        finishStartDate: '',
        finishEndDate: '',
        finishDate: []
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
    initData() {
      this.listLoading = true
      this.visible = false
      this.jnpf.searchTimeFormat(this.listQuery, 'submitDate', 'submitStartDate', 'submitEndDate')
      this.jnpf.searchTimeFormat(this.listQuery, 'finishDate', 'finishStartDate', 'finishEndDate')
      approvalCenterList(this.listQuery)
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
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
