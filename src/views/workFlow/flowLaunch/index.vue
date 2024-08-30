<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" style="height:auto">
        <el-tab-pane label="系统流程" name="system" />
        <el-tab-pane label="自定义流程" name="custom" />
      </el-tabs>
      <div class="JNPF-common-layout-center" v-show="activeName">
        <div class="tag-group JNPF-common-search-box treeBox_bot"
          style="display:flex;align-items:center;padding-left: 10px;">
          <span class="tag-group__title text" :style="{ 'minWidth' : listQuery.businessFlag ? '112px' : '80px'}">{{ activeName === 'system' ? '业务流程分类：' : '流程分类：'}}</span>
          <div style="display:flex;flex-wrap: wrap;">
            <el-tag @click="changeCategory(item, index)" v-for="(item, index) in categoryList" :key="item.id"
              :type="index === categoryIndex ? '' : 'info'" effect="plain"
              style="height:26px;line-height:25px;margin:5px 0 5px 10px;cursor: pointer;">
              {{ item.fullName }}
            </el-tag>
          </div>
        </div>
        <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="listQuery.status" placeholder="请选择流程状态" clearable>
                  <el-option v-for="(item, i) in statusList" :key="i" :label="item.fullName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="listQuery.pickerVal" type="daterange" start-placeholder="流程开始日期"
                  end-placeholder="流程结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd" clearable
                  :editable="false">
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="refresh()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head"
            :style="{ 'justify-content': activeName === 'system' ? 'flex-end' : 'space-between' }">
            <topOpts @add="addFlow()" addText="新建流程" v-show="activeName === 'custom'"></topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top">
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
          <JNPF-table v-loading="listLoading" :data="list" custom-column ref="dataTable">
            <el-table-column prop="fullName" label="流程标题" show-overflow-tooltip min-width="150" />
            <el-table-column prop="flowName" label="所属流程" width="130" />
            <el-table-column prop="startTime" label="发起时间" width="150" :formatter="jnpf.tableDateFormat" />
            <el-table-column prop="flowUrgent" label="紧急程度" width="100" align="center">
              <template slot-scope="scope">
                {{ scope.row.flowUrgent | urgentText() }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="流程状态" width="130" align="center">
              <template slot-scope="scope">
                <el-tag type="primary" v-if="scope.row.status == 1">等待审核</el-tag>
                <el-tag type="success" v-else-if="scope.row.status == 2">审核通过</el-tag>
                <el-tag type="danger" v-else-if="scope.row.status == 3">审核驳回</el-tag>
                <el-tag type="info" v-else-if="scope.row.status == 4">流程撤回</el-tag>
                <el-tag type="info" v-else-if="scope.row.status == 5">审核终止</el-tag>
                <el-tag type="warning" v-else>等待提交</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="completion" label="流程进度" width="150">
              <template slot-scope="scope">
                <p class="text-grey" v-if="scope.row.status == 5 || scope.row.completion == 0">----</p>
                <p v-else-if="scope.row.completion == 100">已完成</p>
                <el-progress :percentage="scope.row.completion" v-else></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="toDetail(scope.row, '-1')"
                  :disabled="[1, 2, 4, 5].indexOf(scope.row.status) > -1">编辑
                </el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  @click="handleDel(scope.$index, scope.row.id)"
                  :disabled="[1, 2, 3, 5].indexOf(scope.row.status) > -1">删除
                </el-button>
                <el-button size="mini" type="text" @click="toDetail(scope.row, 0)" :disabled="!scope.row.status">详情
                </el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
    <flow v-if="flowVisible" ref="flow" @close="flowVisible = false" @choiceFlow="choiceFlow" />
    <FlowBox v-if="formVisible" ref="FlowBox" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { FlowLaunchList, Delete, getFlowLaunchList } from '@/api/workFlow/FlowLaunch'
import { FlowEngineListAll } from '@/api/workFlow/FlowEngine'
import FlowBox from '../components/FlowBox'
import flow from './Flow'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'workFlow-flowLaunch',
  components: { FlowBox, flow, SuperQuery },
  data() {
    return {
      categoryIndex: -1,
      list: [],
      total: 0,
      listLoading: false,
      activeName: 'system',
      listQuery: {},
      initListQuery: {
        flowCategory: '',
        businessFlag: true,    // 1 是 3  0 是 1和2
        createByName: "",
        creatorUserId: "",
        endTime: "",
        endUpdateTime: "",
        flowId: "",
        orderItems: [{
          asc: false,
          column: "F_CreatorTime"
        }],
        keyword: "",
        nodeCode: "",
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        pickerVal: []
      },
      formVisible: false,
      flowVisible: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      statusList: [{
        id: 0,
        fullName: '等待提交'
      }, {
        id: 1,
        fullName: '等待审核'
      }, {
        id: 2,
        fullName: '审核通过'
      }, {
        id: 3,
        fullName: '审核驳回'
      }, {
        id: 4,
        fullName: '流程撤回'
      }, {
        id: 5,
        fullName: '审核终止'
      }],
      urgentList: [
        {
          id: 1,
          fullName: '普通'
        }, {
          id: 2,
          fullName: '重要'
        }, {
          id: 3,
          fullName: '紧急'
        }
      ],
      categoryList: [],
      flowEngineList: [],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'fullName',
          label: "流程标题",
          type: 'input'
        },
        {
          prop: 'flowName',
          label: "所属流程",
          type: 'input'
        },
        {
          prop: 'flowUrgent',
          label: "紧急程度",
          type: 'select',
          options: [
            {
              value: 1,
              label: '普通'
            }, {
              value: 2,
              label: '重要'
            }, {
              value: 3,
              label: '紧急'
            }
          ],
        },
        // {
        //   prop: 'creatorTime',
        //   label: "创建时间",
        //   type: 'daterange',
        //   valueFormat: "yyyy-MM-dd",
        // },
        {
          prop: 'status',
          label: "状态",
          type: 'select',
          options: [{
            value: 0,
            label: '等待提交'
          }, {
            value: 1,
            label: '等待审核'
          }, {
            value: 2,
            label: '审核通过'
          }, {
            value: 3,
            label: '审核驳回'
          }, {
            value: 4,
            label: '流程撤回'
          }, {
            value: 5,
            label: '审核终止'
          }],
        },
      ]
    }
  },
  filters: {
    getCategoryText(id, categoryList) {
      let item = categoryList.filter(o => o.enCode == id)[0]
      return item && item.fullName ? item.fullName : ''
    }
  },
  created() {
    this.getDictionaryData()
    this.getFlowEngineList()
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  watch: {
    activeName() {
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.categoryIndex = -1
      this.initData()
    }
  },
  methods: {
    changeCategory(item, index) {
      this.listQuery.flowCategory = item.enCode
      this.categoryIndex = index
      this.initData()
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    search() {
      this.initData()
    },
    getFlowEngineList() {
      FlowEngineListAll().then((res) => {
        this.flowEngineList = res.data.list
      })
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'WorkFlowCategory' }).then((res) => {
        this.categoryList = res
        console.log(this.categoryList);

      })
    },
    initData() {
      this.listLoading = true
      this.listQuery.businessFlag = this.activeName === 'system' ? true : false
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.jnpf.searchTimeFormat(this.listQuery, 'pickerVal', 'startTime', 'endTime')
      getFlowLaunchList(this.listQuery).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => this.listLoading = false)
    },
    handleDel(index, id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        this.asyncDel(index, id);
      }).catch(() => { });
    },
    asyncDel(index, id) {
      Delete(id).then(res => {
        this.list.splice(index, 1);
        this.$message({
          type: 'success',
          message: res.msg
        });
      })
    },
    addFlow() {
      this.flowVisible = true
      this.$nextTick(() => {
        this.$refs.flow.init()
      })
    },
    choiceFlow(item) {
      let data = {
        id: '',
        enCode: item.enCode,
        flowId: item.id,
        formType: item.formType,
        businessFlow: item.businessFlow,
        opType: '-1'
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.FlowBox.init(data)
        this.flowVisible = false
      })
    },
    toDetail(item, opType) {
      let data = {
        id: item.id,
        enCode: item.flowCode,
        flowId: item.flowId,
        formType: item.formType,
        opType,
        status: item.status,
        businessId: item.businessId,
        businessFlow: item.businessFlow,
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.FlowBox.init(data)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) this.refresh()
    },
    refresh() {
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.categoryIndex = -1
      this.initData()
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />