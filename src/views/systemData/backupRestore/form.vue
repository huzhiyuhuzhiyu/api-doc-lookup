<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="$emit('close', true)" content="定时任务" />
        </div>
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle()" addText="创建定时任务">
                </topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table :partentOrChild="'child'" v-loading="listLoading" highlight-current-row :fixedNO="true"
                ref="dataTable" :data="tableDataList" custom-column>
                <el-table-column prop="taskName" label="任务名称" min-width="140" />
                <el-table-column prop="cron" label="cron表达式" min-width="140" />
                <el-table-column prop="effectiveStartTime" label="生效开始时间" min-width="180" />
                <el-table-column prop="effectiveEndTime" label="生效结束时间" min-width="180" />
                <el-table-column prop="lastExecutionTime" label="上次执行时间" width="180" />
                <el-table-column label="操作" min-width="100" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts editText="修改" @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                      <el-button type="text" size="mini" @click="handleEdit(scope.row.id)">执行</el-button>
                    </tableOpts>
                  </template>
                </el-table-column>

              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </div>
        <TaskForm v-if="formVisible" ref="TaskForm" @close="closeForm" />
      </div>
    </transition>
  </div>
</template>
  
<script>
import { getTaskList,addBackupRes, removeTask ,executeTask } from '@/api/systemData/dataBackupRestore'
import TaskForm from './taskForm'
import idGenerator from 'element-resize-detector/src/id-generator'
export default {
  name: 'backupRestoreForm',
  components: { TaskForm },
  data() {
    return {
      background: true,//分页器背景颜色
      tableDataList: [
      ],
      formVisible: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false
      },
      total: 0,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getTaskList(this.listQuery).then(res => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },

    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(()=>{
        this.$refs.TaskForm.init(id)
      })

    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        removeTask(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    // 执行
    handleEdit(id) {
      executeTask(id).then(res => {
            this.initData()
            this.$message({
              type: 'success',
              message: "执行成功",
              duration: 1500,
            })
          }).catch(() => {
            this.listLoading = false
          })
    },
  }
}
</script>

  
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />