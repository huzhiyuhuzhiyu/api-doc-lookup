<template>
  <div class="JNPF-common-layout">
    <div v-if="!formVisible" class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.orderNo" placeholder="请购单号" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="listQuery.documentStatus" placeholder="单据状态" clearable style="width: 100%;">
                  <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
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
          <div class="JNPF-common-head">

            <div>

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

          <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="dataTable"
            :data="tableDataList" @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="请购单号" min-width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="applicationReason" label="申请理由" min-width="180" />

            <el-table-column prop="reasonRejection" label="驳回理由" align="left" min-width="180" />

            <el-table-column prop="approvalCompletionDate" label="审批完成时间" align="left" min-width="180"
              sortable="custom" />

            <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
            <el-table-column prop="createByName" label="创建人" />
            <el-table-column prop="documentStatus" label="单据状态" align="center" sortable="custom" min-width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>

            <el-table-column prop="approvalStatus" label="审批状态" align="center" sortable="custom" min-width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag></div>
                <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
                <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
                <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                  <el-tag type="warning">审批撤回</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus !== 'draft'"
                  @click="addOrUpdateHandle(scope.row.id, 'edit')">
                  编辑
                </el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  :disabled="scope.row.documentStatus !== 'draft'" @click="handleDel(scope.row.id)">
                  删除
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
                      v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                      @click.native="addOrUpdateHandle(scope.row.id, 'add')">
                      重新提交
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                      @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                      审批撤回
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
            :limit.sync="listQuery.pageSize" @pagination="initData" />
        </div>
      </div>
    </div>

    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import {
  getPurProcurementRequirementsList,
  deletepurProcurementRequire,
  linesRequirements
} from '@/api/purchasingManagement/purchaseInquirySheet'
import JNPFForm from '../buyingRequisition/Form.vue'
import moment from 'moment'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'myPurchaseRequisition',
  components: { JNPFForm, SuperQuery },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'applicationReason',
          label: '产品编码',
          type: 'input'
        },

        {
          prop: 'reasonRejection',
          label: '驳回理由',
          type: 'input'
        },


        {
          prop: 'deliveryDate',
          label: '审批完成时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
        },

        {
          prop: 'approvalStatus',
          label: '审批状态',
          type: 'select',
          options: [
            { label: '审批中', value: 'ing' },
            { label: '审批通过', value: 'ok' },
            { label: '审批拒绝', value: 'rebut' },
            { label: '审批撤回', value: 'withdrawn' }
          ]
        }
      ],
      columnList: ['createByName', 'mainUnit'],
      title: '更多查询',
      activeName: 'dataTable',
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],
      linesTableData: [],
      formVisible: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {
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
        userFlag: true,
        approvalStatus: '', // 审批状态
        createByName: '',
        documentStatus: '', // 单据状态
        endTime: '',
        keyword: '',
        applicationReason: '', // 申请理由
        orderNo: '', // 申请单号
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        deliveryDate: [],
        startAndEndTime: []
      },
      documentStatusList: [
        {
          label: '草稿',
          value: 'draft'
        },
        {
          label: '提交',
          value: 'submit'
        }
      ],
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

      total: 0,
      detailVisible: false,
      linesTotal: 0,
      linesQuery: {},

      initLinesQuery: {
        createByName: '',
        deliveryDate: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        endTime: '',
        keyword: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        userFlag: true,
        orderNo: '',
        pageNum: 1,
        pageSize: 20,
        productCode: '',
        productDrawingNo: '',
        productName: '',
        startTime: '',
        startAndEndTime: [],
        deliveryDateArr: []
      },

      formVisible: false
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productName' || prop === 'productDrawingNo') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }

      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp

      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },

    initData() {
      this.listLoading = true

      if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
        this.listQuery.startTime = this.listQuery.startAndEndTime[0] + ' 00:00:00'
        this.listQuery.endTime = this.listQuery.startAndEndTime[1] + ' 23:59:59'
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      getPurProcurementRequirementsList(this.listQuery)
        .then((res) => {
          console.log(res, '请购单列表')
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

      this.initData()
    },
    // 点击切换明细
    handleClick(e) {
      console.log(e)
      this.activeName = e.name
      this.initData()
    },

    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deletepurProcurementRequire(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          withdrawn(_data).then((res) => {
            this.$message({
              type: 'success',
              message: '撤回成功',
              duration: 1500,
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => { })
    }
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
