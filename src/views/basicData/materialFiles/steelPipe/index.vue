<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.outsideDiameter" placeholder="请输入钢管外径" @keyup.enter.native="search()"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier()" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
          fixedNO >
          <el-table-column prop="outsideDiameter" label="钢管外径" sortable="custom" min-width="180" />
          <el-table-column prop="nutName" label="螺母" sortable="custom" min-width="180" />
          <el-table-column prop="ferruleName" label="卡套" sortable="custom" min-width="180" />
          <el-table-column prop="sealingRingName" label="密封圈" sortable="custom" min-width="180" />
          <el-table-column prop="plasticCapName" label="塑料帽" sortable="custom" min-width="180" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit', scope)" @del="handleDel(scope.row.id)" />
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>


    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
  </div>
</template>
  
<script>
import { getSteelList, deleteSteelData } from '@/api/basicData/materialFiles'
import DepForm from './depForm'
export default {
  name: 'quality',
  components: { DepForm },
  data() {
    return {
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [],
      listQuery: {
        outsideDiameter: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      listLoading: false,
      total: 0,
      formVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'nutName' || prop === 'ferruleName' || prop === 'sealingRingName' || prop === 'plasticCapName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
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
      getSteelList(this.listQuery).then(res => {
        this.tableDataList = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        outsideDiameter: "",
        pageNum: 1,
        pageSize: 20,
      }
      this.search()
    },
    addSupplier() {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init()
      })
    },
    addOrUpdateHandle(id, btnType, scope) {
      this.depFormVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, btnType)
        })
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteSteelData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, btnType)
      })
    }
  }
}
</script>
<style scoped>
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
  