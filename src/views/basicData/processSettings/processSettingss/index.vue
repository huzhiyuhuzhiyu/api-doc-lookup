<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code"  @keyup.enter.native="search()" placeholder="请输入工艺路线编码" clearable maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" @keyup.enter.native="search()" placeholder="请输入工艺路线名称" clearable maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.state" placeholder="工艺状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>

          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click.native="addOrUpdateHandle('', 'add')" size="mini">
              新建
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <div class="tableBox">
          <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange" highlight-current-row :fixedNO="true"
            class="dataTable" border ref="listTable" custom-column>
            <el-table-column prop="code" label="工艺路线编码" align="left" sortable="custom" fixed="left"
              min-width="180"><template slot-scope="scope">
                <el-link type="primary" @click.native="updateHandle(scope.row, 'look')">{{
                  scope.row.code
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="工艺路线名称" align="left" sortable="custom" fixed="left" min-width="180" />
        
      
            <el-table-column prop="reasonRejection" label="驳回理由" align="left" min-width="180" />
            <el-table-column prop="approvalCompletionDate" label="审批完成时间" align="left" min-width="180" />
            <el-table-column prop="createTime" label="创建时间" align="left" min-width="180" sortable="custom" />
            <el-table-column prop="createName" label="创建人" align="left" min-width="180" />
            <el-table-column prop="remark" label="备注" align="left" min-width="180" />
            <el-table-column prop="state" label="工艺状态" align="center" sortable="custom" width="120" fixed="right">
              <template slot-scope="scope">
                <!-- <span v-if="scope.row.state == 'enable'">启用</span> -->
                <!-- <span v-if="scope.row.state == 'disabled'">禁用</span> -->
                <div v-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag></div>
                <div v-if="scope.row.state == 'disable'"><el-tag type="danger">禁用</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="documentStatus" label="单据状态" 
             align="center" sortable="custom" width="120" fixed="right">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                    <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column  prop="approvalStatus" label="审批状态" align="center" sortable="custom" width="120" fixed="right">
              <template slot-scope="scope">
                <div v-if="scope.row.approvalStatus == 'ing'"><el-tag type="warning">审批中</el-tag> </div>
                <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
                <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180" fixed="right">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : scope.row.approvalStatus == 'ok'" -->
                <el-button size="mini" type="text"  @click="updateHandle(scope.row, 'edit')">编辑</el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' ? false :
                  scope.row.approvalStatus == 'ok'"
                  @click="handleDel(scope.$index, scope.row.id)">删除</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="updateHandle(scope.row, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
        </div>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData"
          class="pagination" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="工艺路线编码">
              <el-input v-model="listQuery.code" placeholder="请输入工艺路线编码" clearable maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺路线名称">
              <el-input v-model="listQuery.name" placeholder="请输入工艺路线名称" clearable maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺状态">
              <el-select v-model="listQuery.state" placeholder="工艺状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="单据状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="审批状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="创建时间">
              <!-- <el-date-picker v-model="customerRecognitionTime" type="datetimerange" format="yyyy-MM-dd hh:mm:ss"
                value-format="yyyy-MM-dd hh:mm:ss" style="width: 100%;" :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始时间" end-placeholder="结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker> -->
              <el-date-picker v-model="customerRecognitionTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
            
          </el-col>


        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()">
          搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import JNPFForm from './Form'
import { getProcessList, detailProcess, deleteProcess } from '@/api/basicData/processSettingss'

export default {
  components: { JNPFForm },
  data() {
    return {
      title: "更多查询",
      list: [],
      stateList: [{
        label: "启用",
        value: "enable"
      }, {
        label: "禁用",
        value: "disable"
      },],
      documentStatusList: [{
        label: "草稿",
        value: "draft"
      }, {
        label: "提交",
        value: "submit"
      },],
      statusList: [{
        label: "审批中",
        value: "ing"
      }, {
        label: "审批通过",
        value: "ok"
      }, {
        label: "审批拒绝",
        value: "rebut"
      },],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick(picker) {
            const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      listLoading: true,
      total: 0,
      listQuery: {

        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        code: "",
        name: "",
        state: "",
        approvalStatus: "",
        documentStatus: "",
        createEndTime: "",
        createStartTime: ""
      },
      formVisible: false,
      dataDetail: [],
      detailLoading: false,
      visible: false,
      customerRecognitionTime: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    moreQueries() {
      this.visible = true
    },
    dataFormSubmit() {
      this.listQuery.pageNum = 1
      if (this.customerRecognitionTime && this.customerRecognitionTime.length > 0) {
        this.listQuery.createStartTime = this.customerRecognitionTime[0] + " 00:00:00"
        this.listQuery.createEndTime = this.customerRecognitionTime[1] + " 23:59:59"
      } else {
        this.listQuery.createStartTime = ""
        this.listQuery.createEndTime = ""
      }
      this.initData()

    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    // 内容选择事件
    handleCurrentChange(val) {
      console.log('1111111111111111', val)
      if (!val && data.length) return
      this.detailLoading = true
      detailProcess(val.id).then(res => {
        this.dataDetail = res.data || []
        this.detailLoading = false
      })
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      this.detailLoading = false
      this.dataDetail = []
      getProcessList(this.listQuery).then(res => {
        console.log(res);
        this.list = res.data.records || []
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
        // this.$nextTick(() => {
        //   this.$refs.listTable.$refs.JNPFTable.setCurrentRow(this.list[0]) // 自动选择第一项
        // })
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 删除数据
    handleDel(index, id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteProcess(id).then(res => {
          if (res.msg === 'Success') res.msg = '删除成功'
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    // 新增数据
    addOrUpdateHandle(id, type) {
      console.log(id, type);
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    // 编辑数据
    updateHandle(id, type) {
      this.formVisible = true
      console.log(id, type);
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
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
        code: "",
        name: "",
        state: "",
        approvalStatus: "",
        documentStatus: "",
        createEndTime: "",
        createStartTime: ""
      },
        this.customerRecognitionTime = []
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
<style scoped>
/* .JNPF-common-layout-left {
    margin-right: 0;
    border-right: 1px solid #cacaca;
  }
  
  ::v-deep .el-tabs__content {
    height: calc(100vh - 163px);
  } */

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>