<template>
  <el-drawer title="异常类型管理" :visible.sync="drawer" :wrapperClosable="false" ref="drawer" size="820px"
    :before-close="handleDrawerClose" class="JNPF-common-drawer" append-to-body>
    <div class="JNPF-flex-main">
      <div class="JNPF-common-head">
        <topOpts  @add="addOrUpdateHandle('','add')">
        </topOpts>
        <div class="JNPF-common-head-right">
          <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
            <el-link icon="icon-ym icon-ym-Refresh
              JNPF-common-head-icon" :underline="false" @click="reset()" />
          </el-tooltip>
        </div>
      </div>
      <JNPF-table v-loading="listLoading" :data="tableData" @sort-change="sortChange">

        <el-table-column prop="code" label="类型编码" min-width="120" sortable="custom" />
        <el-table-column prop="name" label="类型名称" min-width="120" sortable="custom" />
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </JNPF-table>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" :category="'type'" />
  </el-drawer>
</template>
<script>
import { getAbnoramlTypeData, deleteAbnoramlTypeData, detailAbnoramlTypeData } from '@/api/abnormalManagement/index.js'
import JNPFForm from './Form'
export default {
  components: { JNPFForm },
  data() {
    return {
      formVisible:false,
      drawer: false,
      listLoading: false,
      btnLoading: false,
      tableData: [],
      total: 0,
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        category: "type",
        code: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        name: "",
        parentId: '',
        startTime: "",
        startUpdateTime: "",
        superQuery: {},
        totalRowFlag: false
      },
    }
  },
  methods: {
    init() {
      this.drawer = true
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.$nextTick(() => {
        this.initData()
      })
    },
    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.init()
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      getAbnoramlTypeData(this.listQuery).then(res => {
        this.tableData = res.data.records || []
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
   // 新增数据
   addOrUpdateHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, btnType)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteAbnoramlTypeData(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.init()
            }
          })
        })
      }).catch(() => { })
    },
    reset() {
      this.init()
    },
    handleDrawerClose(done) {
      done();
      this.$emit('refreshDataList')
    },
  }
}
</script>
<style scoped>
.JNPF-common-drawer ::v-deep .el-drawer__header {
  font-size: 18px
}
</style>
