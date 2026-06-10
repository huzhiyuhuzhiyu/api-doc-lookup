<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.name" @keyup.enter.native="search()" placeholder="请输入系列名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.code" @keyup.enter.native="search()" placeholder="请输入系列代号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                              $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('', 'add')">
            新建
          </el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableDataList" ref="dataTable" @sort-change="sortChange" custom-column customKey="JNPFTableKey_490325">
          <el-table-column prop="name" label="系列名称" width="200" />
          <el-table-column prop="code" label="系列代号" width="200" />
          <el-table-column prop="price" label="系列单价" width="180" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="140"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handle(scope.row.id,'edit')">编辑</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background" :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
  </div>
</template>

<script>
import { assemblyseriesList } from '@/api/financialManagement/index'
import DepForm from './depForm'
export default {
  name: 'assemblyseries',
  components: { DepForm, },
  data() {
    return {
      depFormVisible: false,
      background: true,//分页器背景颜色
      tableDataList: [],
      listLoading: false,
      tableQuery1: {
        name: '',
        code: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "create_time"
        }]
      },
      tableQuery: {},
      total: 0,
    }
  },
  created() {
    this.tableQuery = JSON.parse(JSON.stringify(this.tableQuery1))
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.tableQuery.orderItems[0].asc = order !== "descending"
      this.tableQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      Object.keys(this.tableQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.tableQuery[key]
        this.tableQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      assemblyseriesList(this.tableQuery).then(res => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    addSupplier(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    search() {
      this.tableQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.tableQuery = JSON.parse(JSON.stringify(this.tableQuery1))
      this.search()
    },
    handle(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },

  }
}
</script>
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}
::v-deep .el-table .cell.el-tooltip {
  min-width: 120px;
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
