<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-radio-group v-model="activeName" style="margin-bottom:5px;background-color:#fff;padding-left:8px">
        <el-radio-button label="all" style="margin:5px 0">全部</el-radio-button>
        <el-radio-button style="margin:2px 0;border-left:1px solid #DCDFE6" v-for="item in categoryList" :key="item.enCode" :label="item.enCode">{{ item.fullName }}</el-radio-button>
      </el-radio-group>
      <div class="JNPF-common-layout-center" v-show="activeName">
        <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="listQuery.fullName" placeholder="请输入流程名称" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="listQuery.enCode" placeholder="请输入流程编码" clearable @keyup.enter.native="search()" />
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
            <topOpts @add="dialogVisible = true">
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
            <el-table-column prop="fullName" label="流程名称" min-width="150" />
            <el-table-column prop="enCode" label="流程编码" min-width="200" />
            <!-- <el-table-column prop="visibleType" label="可见范围" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.visibleType ==  0 ? "全部可见" : "部分可见" }}</span>
            </template>
          </el-table-column> -->
            <el-table-column prop="enabledMark" label="启用状态" min-width="80" align="center">
              <template slot-scope="scope">
                <el-switch @change="changeState(scope.row.id)" v-model="scope.row.enabledMark == 1 ? true : false"
                  active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="400">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.formType)" @del="handleDel(scope.row.id)">
                  <el-button size="mini" type="text" @click.native="preview(scope.row)">表单预览</el-button>
                  <el-button size="mini" type="text" @click.native="copy(scope.row.id)">复制流程</el-button>
                  <el-button size="mini" type="text" @click.native="handleExport(scope.row.id)">导出流程</el-button>
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
    <preview v-if="previewVisible" ref="preview" @close="previewVisible = false" />
    <previewDialog :visible.sync="previewDialogVisible" :id="currRow.id" type="flow" @previewPc="previewPc" />
    <el-dialog title="新建表单" :visible.sync="dialogVisible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
      width="600px">
      <div class="add-main">
        <div class="add-item add-item-sys" @click="addFlow(1)">
          <i class="add-icon el-icon-document"></i>
          <div class="add-txt">
            <p class="add-title">系统表单</p>
            <p class="add-desc">关联系统表单便捷设计</p>
          </div>
        </div>
        <div class="add-item" @click="addFlow(2)">
          <i class="add-icon icon-ym icon-ym-generator-company"></i>
          <div class="add-txt">
            <p class="add-title">自定义表单</p>
            <p class="add-desc">自定义设计流程表单</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { FlowEngineList, Delete, Release, Stop, Copy, exportData, getFlowEngineList,changeFlowSwitch } from '@/api/workFlow/FlowEngine'
import Form from './Form'
import preview from '../components/Preview'
import previewDialog from '@/components/PreviewDialog'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'workFlow-flowEngine',
  components: { Form, preview, previewDialog, SuperQuery },
  data() {
    return {
      activeName: 'all',
      superQueryVisible: false,
      listQuery: {},
      initListQuery: {
        category: '',
        enCode: '',
        fullName: '',
        businessFlag: false,    // 1 是 3  0 是 1和2
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
      dialogVisible: false,
      formVisible: false,
      previewVisible: false,
      previewDialogVisible: false,
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
      this.dialogVisible = false
      this.addOrUpdateHandle('', formType)
    },
    // 新增 / 修改
    addOrUpdateHandle(id, formType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.categoryList, id, formType)
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
    preview(row) {
      this.currRow = row
      this.$nextTick(() => {
        this.previewDialogVisible = true
      })
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
<style lang="scss" scoped>
.JNPF-dialog {
  >>>.el-dialog__body {
    padding: 50px 30px !important;
  }
}

.add-main {
  display: flex;
  align-items: center;
  justify-content: space-around;

  .add-item {
    width: 230px;
    height: 136px;
    background: #eff9ff;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 20px;

    &:hover {
      opacity: 0.9;
    }

    &.add-item-sys {
      background: #f1f5ff;

      .add-icon {
        background: #ccd9ff;
        color: #537eff;
      }
    }

    .add-icon {
      width: 56px;
      height: 56px;
      margin-right: 10px;
      background: #ceeaff;
      border-radius: 10px;
      color: #46adfe;
      flex-shrink: 0;
      font-size: 30px;
      line-height: 56px;
      text-align: center;
    }

    .add-txt {
      height: 56px;

      P {
        line-height: 28px;
      }

      .add-title {
        font-size: 18px;
        font-weight: bold;
      }

      .add-desc {
        color: #8d8989;
        font-size: 12px;
      }
    }
  }
}
</style>