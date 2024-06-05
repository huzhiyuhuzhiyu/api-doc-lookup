<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <!-- <el-row class="JNPF-common-search-box" :gutter="16">

      </el-row> -->
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <!-- <el-dropdown> -->
          <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('', 'add')">
            新建
          </el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableDataList" ref="dataTable" custom-column>
          <el-table-column prop="layerCount" label="胶管层数" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.layerCount == '1-2'">1-2层</div>
              <div v-else-if="scope.row.layerCount == '3-4'">3-4层</div>
              <div v-else-if="scope.row.layerCount == '6'">6层</div>
              <div v-else-if="scope.row.layerCount == 'other'">其他</div>
            </template>
          </el-table-column>
          <el-table-column prop="hoseDiameterRange" label="区间规则" min-width="260">
            <!-- <template slot-scope="scope">
              <div>{{ scope.row.hoseNoStart+scope.row.startSymbol+" ? "+scope.row.endSymbol+scope.row.hoseNoEnd }}</div>
            </template> -->
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" />
          <el-table-column prop="createByName" label="创建人" min-width="110"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="300" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除</el-button>
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
import { delIntervalmanagement, getIntervalmanagementList, } from '@/api/financialManagement/index'
import DepForm from './depForm'
export default {
  name: 'midlirhoses',
  components: { DepForm, },
  data () {
    return {
      depFormVisible: false,
      background: true,//分页器背景颜色
      tableDataList: [],
      listLoading: false,
      tableQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: true,
          column: "layer_count"
        }],
        productType: "",
      },
      createTimeArr: [],
      total: 0,
      filterText: ''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created () {
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    // 关闭新建、编辑页面
    closeForm (isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData () {
      getIntervalmanagementList(this.tableQuery).then(res => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    addSupplier (id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    handleDel (id) {
      this.$confirm(this.$t('删除该内径标号区间，将会把计件价格表中的价格一起删除，是否继续？'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delIntervalmanagement(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
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
