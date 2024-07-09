<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <!-- <el-tabs v-model="activeName"> -->
      <!-- <el-tab-pane label="备份还原列表" name="dataTable"> -->
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addOrUpdateHandle()" addText="创建备份">
              <el-button  size="mini" type="success" icon="el-icon-timer" @click="handleSetTime()">定时备份</el-button>
              <el-button  size="mini" type="danger" icon="el-icon-delete" @click="handleDelData()">删除指定数据</el-button>
              <el-button  size="mini" type="primary" icon="el-icon-document" @click="handleRecord()">数据操作记录</el-button>
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>

          <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="dataTable" :data="tableDataList"
            @sort-change="sortChange" custom-column>
            <el-table-column prop="fileName" label="文件名称" min-width="140" />
            <el-table-column prop="filePath" label="文件路径" min-width="140" />
            <el-table-column prop="lastRestoreTime" label="上次还原时间" min-width="180" />
            <el-table-column prop="lastRestoredBy" label="上次还原人" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
            <el-table-column prop="createByName" label="创建人" />

            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts editText="还原" @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                  <el-button type="text" size="mini" @click="handleDownload(scope.row.id)">下载</el-button>
                </tableOpts>
              </template>
            </el-table-column>

          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
            :limit.sync="listQuery.pageSize" @pagination="initData" />
        </div>
      </div>
      <!-- </el-tab-pane> -->

      <!-- </el-tabs> -->
    </div>
    <!-- 数据操作记录-->
    <el-dialog title="数据操作记录" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="recordDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <JNPF-table ref="workerDialog" v-loading="recordLoading" :data="recordListData" border height="400">
        <el-table-column prop="operatingInstructions" label="操作说明" min-width="240" />
        <el-table-column prop="createByName" label="操作人" min-width="100" />
        <el-table-column prop="createTime" label="操作时间" min-width="180"></el-table-column>
      </JNPF-table>
      <pagination :total="recoedTotal" :page.sync="recordQuery.pageNum" :background="background"
        :limit.sync="recordQuery.pageSize" @pagination="handleRecord" />

    </el-dialog>
    <!-- 删除指定数据-->
    <el-dialog title="删除指定数据" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="delDataDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center record" width="800px">
      <div class="JNPF-common-head noLeftPad">
        <el-button type="danger" icon="el-icon-delete" @click="handleDelTableData()">删除</el-button>
      </div>
      <JNPF-table @selection-change="handeleTableInfoData" hasC ref="delDialog" v-loading="recordLoading"
        :data="delDataListData" border height="400">
        <el-table-column prop="enName" label="表英文名称" />
        <el-table-column prop="cnName" label="表中文名称" />
      </JNPF-table>
      <pagination :total="delTotal" :page.sync="delQuery.pageNum" :background="background" :limit.sync="delQuery.pageSize"
        @pagination="handleDelData" />

    </el-dialog>

    <JNPF-Form v-if="formVisible" ref="JNPFForm" @close="closeForm" />


  </div>
</template>
  
<script>
import { getBackupResList, addBackupRes, deleteBackupRes, restoreBackupRes, getOperateRecord, downloadTask, tableBackupList, removeBackupRes } from '@/api/systemData/dataBackupRestore'
import JNPFForm from './form'
export default {
  name: 'backupRestore',
  components: { JNPFForm },
  data() {
    return {
      activeName: 'dataTable',
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      recordListData: [],
      delDataListData: [],
      formVisible: false,
      recordDialog: false,
      delDataDialog: false,
      listLoading: false,
      recordLoading: false,
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
      recoedTotal: 0,
      recordQuery: {},
      initRecordQuery: {
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        fileName: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      delTotal: 0,
      delQuery: {},
      initDelQuery: {
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        fileName: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      delList: []
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.recordQuery = JSON.parse(JSON.stringify(this.initRecordQuery))
    this.initData()
  },
  methods: {
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productDrawingNo') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }

      if (this.activeName === 'dataTable') {
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (prop === 'createTime') {
          newProp = prop
        }
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
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


    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getBackupResList(this.listQuery).then(res => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
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

      this.initData()
    },

    addOrUpdateHandle(id) {
      this.listLoading = true
      if (!id) {
        addBackupRes().then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "创建成功",
            duration: 1500,
          })
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.$confirm('还原操作会导致丢失数据，请做好备份再还原，您确定继续吗?', '提示', {
          type: 'warning'
        }).then(() => {
          restoreBackupRes(id).then(res => {
            this.initData()
            this.$message({
              type: 'success',
              message: "还原成功",
              duration: 1500,
            })
          }).catch(() => {
            this.listLoading = false
          })
        }).catch(() => { this.listLoading = false })

      }

    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteBackupRes(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    // 定时备份
    handleSetTime() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs['JNPFForm'].initData()
      })
    },
    // 数据操作记录
    handleRecord() {
      this.recordDialog = true
      this.recordLoading = true
      getOperateRecord(this.recordQuery).then(res => {
        if (res.data.records.length) {
          this.recordListData = res.data.records
          this.recoedTotal = res.data.total
          this.recordLoading = false
        } else {
          this.$message.error("暂无操作记录")
        }
      }).catch(() => { this.recordLoading = false })
    },
    // 下载
    handleDownload(id) {
      downloadTask(id).then(res => {
        this.jnpf.downloadFile(res.data.url, res.data.name)
      }).catch(err => {
      })
    },
    // 删除指定数据
    handleDelData() {
      this.delDataDialog = true
      this.recordLoading = true
      tableBackupList(this.delQuery).then(res => {
        if (res.data.records.length) {
          this.delDataListData = res.data.records
          this.delTotal = res.data.total
          this.recordLoading = false
        } else {
          this.$message.error("暂无数据")
        }
      }).catch(() => { this.recordLoading = false })
    },
    // 选中
    handeleTableInfoData(val) {
      this.delList = val
    },
    // 删除表
    handleDelTableData() {
      if (this.delList.length) {
        let enNameList = this.delList.map(item => item.enName)
        this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
          type: 'warning'
        }).then(() => {
          removeBackupRes(enNameList).then(res => {
            this.handleDelData()
            this.$message({
              type: 'success',
              message: "删除成功",
              duration: 1500,
            })
          })
        }).catch(() => { })
      }
    },
  }
}
</script>

  
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
::v-deep .JNPF-dialog.record .el-dialog .el-dialog__body {
  padding: 0px 20px 10px !important;
}

::v-deep .noLeftPad {
  padding: 10px 10px 10px 0 !important;
}
</style>