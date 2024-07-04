<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入业务编码" clearable maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="请输入业务名称" clearable maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <!-- <el-input v-model="listQuery.mobilePhone" placeholder="请输入手机" clearable /> -->
              <el-select v-model="listQuery.state" placeholder="请选择业务状态" clearable style="width: 100%;">
                <el-option v-for="( item, index ) in  stateList " :key="index" :label="item.label"
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
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click.native="addOrUpdateHandle()" size="mini">
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
          <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange" highlight-current-row
            @current-change="handleCurrentChange" class="dataTable" border ref="listTable">
            <el-table-column prop="code" label="业务编码" align="left" sortable="custom" min-width="180" />
            <el-table-column prop="name" label="业务名称" align="left" sortable="custom" min-width="180" />
            <el-table-column prop="callbackMethod" label="回调方法" align="left" min-width="180" />
            <el-table-column prop="createTime" label="创建时间" align="left" min-width="180" />
            <el-table-column prop="createByName" label="创建人" align="left" min-width="140" />
            <el-table-column prop="state" label="状态" min-width="120" align="center" sortable="custom" fixed="right">
              <template slot-scope="scope">
                <div v-if="scope.row.state === 'enable'"><el-tag type="success">直接启用</el-tag></div>
                <div v-else-if="scope.row.state === 'disabled'"><el-tag type="danger">直接停用</el-tag></div>
                <div v-else-if="scope.row.state === 'condition'"><el-tag>条件启用</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="updateState(scope.row)">设置状态</el-button>
                <el-button size="mini" type="text" @click="updateHandle(scope.row)">编辑</el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  @click="handleDel(scope.$index, scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <JNPF-table v-loading="detailLoading" :data="dataDetail" class="dataTable" border custom-column>
            <!-- <el-table-column prop="id" label="业务id" align="left" /> -->
            <el-table-column prop="code" label="条件编码" align="left" min-width="120" />
            <el-table-column prop="name" label="条件名称" align="left" min-width="120" />
            <el-table-column prop="dataType" label="数据类型" align="left" min-width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.dataType == 'number'">
                  数字类型
                </div>
                <div v-else-if="scope.row.dataType == 'string'">字符串</div>
              </template>
            </el-table-column>
            <el-table-column prop="optionNames" label="值显示名称" align="left" min-width="180" />
            <el-table-column prop="optionValues" label="值范围值" align="left" min-width="180" />
          </JNPF-table>
        </div>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData"
          class="pagination" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    <depForm v-if="depFormVisible" ref="depForm" @refresh="refresh" />
  </div>
</template>

<script>
import JNPFForm from './Form'
import depForm from './depForm'
import { getApprovalList, deleteApproval, getApprovalDetail } from '@/api/basicData/approvalBusinessConditions'

export default {
  components: { JNPFForm,depForm },
  data() {
    return {

      list: [],
      listLoading: true,
      depFormVisible: false,
      total: 0,
      listQuery: {
        code: "",
        name: "",
        orderItems: [{
          asc: true,
          column: ""
        }],
        pageNum: 1,
        pageSize: 20,
        state: ""
      },
      formVisible: false,
      dataDetail: [],
      detailLoading: false,
      stateList: [
        { label: '启用', value: 'enable' },
        { label: '停用', value: 'disabled' },
      ],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 内容选择事件
    handleCurrentChange(val) {
      console.log('1111111111111111', val)
      if (!val) return
      this.detailLoading = true
      getApprovalDetail(val.id).then(res => {
        this.dataDetail = res.data || []
        this.detailLoading = false
      })
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = newProp
      this.initData()
    },
    initData() {
      this.detailLoading = false
      this.dataDetail = []
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getApprovalList(this.listQuery).then(res => {
        this.list = res.data.records || []
        this.total = res.data.total
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.listTable.$refs.JNPFTable.setCurrentRow(this.list[0]) // 自动选择第一项
        })
      })
    },
    // 删除数据
    handleDel(index, id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteApproval(id).then(res => {
          if (res.msg === 'Success') res.msg = '删除成功'
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    // 新增数据
    addOrUpdateHandle() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init("{}", 'add')
      })
    },
    // 编辑数据
    updateHandle(rowData) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(JSON.stringify(rowData), 'edit')
      })
    },
    updateState(row){
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(row)
      })
    },
    search() {
      this.initData()
    },
    refresh() {
      this.formVisible = false
      this.depFormVisible = false
      this.initData()
    },
    reset() {
      this.listQuery = {
        code: "",
        name: "",
        orderItems: [{
          asc: true,
          column: ""
        }],
        pageNum: 1,
        pageSize: 20,
        state: ""
      },
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