<template>
  <div class="JNPF-common-layout">
    <div v-if="!formVisible" class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.lineCode" @keyup.enter.native="search()" placeholder="产线编码" clearable
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.lineName" @keyup.enter.native="search()" placeholder="产线名称" clearable
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:8px">
          <div>
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
        <JNPF-table v-if="tableDataFlag" :data="list" @sort-change="sortChange" highlight-current-row :fixedNO="true"
          class="dataTable" border ref="listTable" custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_454446">
          <el-table-column prop="lineCode" label="产线编码" align="left" sortable="custom" min-width="120">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="updateHandle(scope.row.id, 'look')">
                {{ scope.row.lineCode }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="lineName" label="产线名称" align="left" sortable="custom" min-width="120" />
          <el-table-column prop="className" label="班次" width="80"></el-table-column>
          <el-table-column prop="proDate" label="生产日期" align="left" min-width="120" sortable="custom" />
          <el-table-column prop="innerBlankConsumeQuantity" label="内圈毛坯耗料数量" align="right" min-width="180" />
          <el-table-column prop="innerQualifiedQuantity" label="内圈合格数量" align="right" min-width="180" />
          <el-table-column prop="innerUnqualifiedQuantity" label="内圈不合格数量" align="right" min-width="180" />
          <el-table-column prop="outerBlankConsumeQuantity" label="外圈毛坯耗料数量" align="right" min-width="180" />
          <el-table-column prop="outerQualifiedQuantity" label="外圈合格数量" align="right" min-width="180" />
          <el-table-column prop="outerUnqualifiedQuantity" label="外圈不合格数量" align="right" min-width="180" />
          <el-table-column prop="ballRetainerConsumeQuantity" label="钢球保持器耗料基准数量" align="right" min-width="180" />
          <el-table-column prop="lidConsumeQuantity" label="盖子耗料基准数量" align="right" min-width="180" />
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="updateHandle(scope.row.id, 'edit')" :disabled="scope.row.confirmStatus">
                确定
              </el-button>
              <el-button size="mini" type="text" @click="updateHandle(scope.row.id, 'look')">
                详情
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" class="pagination" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import JNPFForm from './Form'
import { getProcessList, detailProcess, importProcess, deleteProcess } from '@/api/basicData/processSettingss'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import getProjectList from '@/mixins/generator/getProjectList'
import { getProductionLineOutputData, detailProProductionLineOutput, getWorkList, addWorkReport } from '@/api/productOrdes/index.js'
export default {
  name: 'processSettingss',
  components: { JNPFForm, ExportForm, SuperQuery },
  mixins: [getProjectList],
  data() {
    return {
      uploadVisib: false,
      importProjectId: '',
      isProjectSwitch: '',
      tableDataFlag: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '工艺路线编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '工艺路线名称',
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
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ],
      exportFormVisible: false,
      title: '更多查询',
      list: [],
      stateList: [
        {
          label: '启用',
          value: 'enable'
        },
        {
          label: '禁用',
          value: 'disable'
        }
      ],
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上个月',
            onClick(picker) {
              const end = new Date(moment(new Date().getTime()).format('YYYY-MM-01 00:00:00'))
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      listLoading: true,
      total: 0,
      listQuery: {
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
        pageNum: 1,
        pageSize: 20,
      },
      formVisible: false,
      dataDetail: [],
      detailLoading: false,
      visible: false,
      customerRecognitionTime: [],
      columnList: ['reasonRejection', 'remark', 'createByName', 'createTime'],
      showAppCodeFlag: true
    }
  },
  async created() {
    const res = await this.jnpf.getBusInfo('b024')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
    this.tableDataFlag = true
    this.initData()
  },
  methods: {
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'createByName') {
        newProp = 'create_by'
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.listTable.showDrawer()
    },

    initData() {
      this.listLoading = true
      this.detailLoading = false
      // if (this.isProjectSwitch === '1') {
      //   this.listQuery.projectId = this.userInfo.projectId
      // }
      this.dataDetail = []
      getProductionLineOutputData(this.listQuery)
        .then((res) => {
          this.list = res.data.records || []
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
          // this.$nextTick(() => {
          //   this.$refs.listTable.$refs.JNPFTable.setCurrentRow(this.list[0]) // 自动选择第一项
          // })
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 新增数据
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    // 编辑数据
    updateHandle(id, type) {
      this.formVisible = true

      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },
    reset() {
      this.$refs['listTable'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        code: '',
        name: '',
        state: '',
        approvalStatus: '',
        documentStatus: '',
        createEndTime: '',
        createStartTime: ''
      }
      this.customerRecognitionTime = []
      this.$refs.SuperQuery.conditionList = []
      this.search()
    }
  }
}
</script>
<style scoped lang="scss">
.tableBox {
  flex: auto;
  display: flex;
  position: relative;

  // border: 1px solid #dedede;
  // box-shadow: inset 0 0 0 1px #dedede;
  >.dataTable:first-child {
    flex: 3;
    margin: 0 3px 0 0;
  }

  >.dataTable:last-child {
    flex: 2;
  }
}
</style>
