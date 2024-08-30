<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" style="height:auto">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane :label="item.fullName" :name="item.enCode" v-for="item in categoryList" :key="item.enCode" />
      </el-tabs>
      <div class="JNPF-common-layout-center" v-show="activeName">
        <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addFlow(3)">
              <!-- <upload-btn url="/api/workflow/Engine/FlowEngine/Actions/ImportData" @on-success="reset()" /> -->
            </topOpts>
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
            <el-table-column prop="fullName" label="流程名称" min-width="120" />
            <el-table-column prop="enCode" label="流程编码" min-width="120" />
            <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" min-width="150" />
            <!-- <el-table-column prop="enabledMark" label="状态" min-width="80" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                  {{ scope.row.enabledMark == 1 ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column> -->
            <el-table-column prop="enabledMark" label="状态" min-width="80" align="center">
              <template slot-scope="scope">
                <el-switch @change="changeState(scope.row.id)" v-model="scope.row.enabledMark == 1 ? true : false"
                  active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.formType)" @del="handleDel(scope.row.id)">
                  <el-button size="mini" type="text"
                    @click="addOrUpdateHandle(scope.row.id, scope.row.formType, 'flowDesign')">流程设计</el-button>
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">{{ $t('common.moreBtn') }}<i
                          class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="copy(scope.row.id)">
                        复制流程</el-dropdown-item>
                      <el-dropdown-item @click.native="handleExport(scope.row.id)">
                        导出流程</el-dropdown-item>
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
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { FlowEngineList, Delete, Release, Stop, Copy, exportData, getFlowEngineList, changeFlowSwitch } from '@/api/workFlow/FlowEngine'
import Form from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'workFlow-system',
  components: { Form, SuperQuery },
  data() {
    return {
      activeName: 'all',
      superQueryVisible: false,
      listQuery: {},
      initListQuery: {
        category: '',
        businessFlag: true,    // 1 是 3  0 是 1和2
        createByName: "",
        creatorUserId: "",
        endTime: "",
        endUpdateTime: "",
        flowCategory: "",
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
        totalRowFlag: false
      },
      total: 0,
      list: [],
      listLoading: true,
      formVisible: false,
      currRow: {},
      categoryList: [],
      superQueryJson: [
        {
          prop: 'fullName',
          label: "流程名称",
          type: 'input'
        },
        {
          prop: 'enCode',
          label: "流程编码",
          type: 'input'
        },
        {
          prop: 'creatorTime',
          label: "创建时间",
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
        },
        {
          prop: 'enabledMark',
          label: "状态",
          type: 'select',
          options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]
        },
      ]
    }
  },
  created() {
    this.getDictionaryData()
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  methods: {
    changeState(id) {
      changeFlowSwitch(id).then(res => {
        if (res.msg === 'Success') {
          this.initData()
        }
      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    reset() {
      this.activeName = 'all'
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
    search() {
      this.initData()
    },
    initData() {
      this.listLoading = true
      this.listQuery.category = this.activeName === 'all' ? '' : this.activeName
      getFlowEngineList(this.listQuery).then((res) => {
        this.list = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
    },
    getDictionaryData() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'WorkFlowCategory' }).then((res) => {
        this.categoryList = res
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: res.msg
          });
        })
      }).catch(() => { });
    },
    addFlow(formType) {
      this.addOrUpdateHandle('', formType)
    },
    // 新增 / 修改
    addOrUpdateHandle(id, formType, flowDesign) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.categoryList, id, formType, flowDesign)
      })
    },
    copy(id) {
      this.$confirm('您确定要复制该流程, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        Copy(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => { });
    },
    handleExport(id) {
      this.$confirm('您确定要导出该流程, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        exportData(id).then(res => {
          this.jnpf.downloadFile(res.data.url)
        })
      }).catch(() => { });
    },

    previewPc() {
      let data = {
        enCode: this.currRow.enCode,
        fullName: this.currRow.fullName,
        formType: this.currRow.formType,
        flowId: this.currRow.id
      }
      this.previewVisible = true
      this.$nextTick(() => {
        this.$refs.preview.init(data)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleUpdate(row) {
      if (row.enabledMark) {
        this.$confirm('您确定要停止当前流程吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          Stop(row.id).then(res => {
            row.enabledMark = 0
            this.$message({
              type: 'success',
              message: res.msg
            });
          })
        }).catch(() => { });
      } else {
        this.$confirm('您确定要发布当前流程吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          Release(row.id).then(res => {
            row.enabledMark = 1
            this.$message({
              type: 'success',
              message: res.msg
            });
          })
        }).catch(() => { });
      }
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />