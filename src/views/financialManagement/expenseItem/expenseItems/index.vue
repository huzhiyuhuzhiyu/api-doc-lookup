<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.itemName" placeholder="请输入项目名称" @keyup.enter.native="search()" clearable />
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
          <!-- <el-dropdown> -->
          <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('add')">
            新建
          </el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <Sort-table row-key="id" fixedNO v-loading="listLoading" ref="tableForm" :data="tableDataList"
          @sort-change="sortChange" custom-column>
          <el-table-column prop="itemName" label="项目名称" sortable="custom" min-width="120"></el-table-column>
          <el-table-column prop="itemType" label="项目类型" sortable="custom" min-width="120">
            <template slot-scope="scope">

              <div v-if="scope.row.itemType == 'ordinary'">普通项目</div>
              <div v-if="scope.row.itemType == 'drill'">深钻孔</div>
              <div v-if="scope.row.itemType == 'cutter'">普通刀具</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" sortable="custom" />
          <el-table-column prop="unit" label="单位"></el-table-column>
          <!-- <el-table-column prop="sort" label="排序"></el-table-column> -->
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="180" />
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)" />
            </template>
          </el-table-column>
        </Sort-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>


    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
  </div>
</template>
  
<script>
import { getFinExpenseItem, deleteFinExpenseItem, editFinExpensemodifySort } from '@/api/expenseItem/index'
import DepForm from './depForm'
import moment from 'moment'
import Sortable from 'sortablejs';
import SortTable from '@/components/no_mount/Sort-table/index' // 产品选择组件
export default {
  name: 'quality',
  components: { DepForm, SortTable },
  data() {
    return {
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      listLoading: false,
      listQuery: {
        orderItems: [{
          asc: true,
          column: "sort"
        }, {
          asc: true,
          column: ""
        }],
        createByName: "",
        endTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },

      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    rowDrop() {
      const el = document.querySelector('.el-table__body-wrapper tbody')
      console.log(el);
      let _this = this
      Sortable.create(el, {
        onEnd({ to, newIndex, oldIndex }) {
          console.log('TabsTreeTable -> onEnd -> newIndex, oldIndex', to, newIndex, oldIndex);
          let tableData = _.cloneDeep(_this.tableDataList);
          //交换处理
          console.log(tableData);
          const newsort = tableData[newIndex].sort
          const oldsort = tableData[oldIndex].sort
          let _data = [
            {
              id: tableData[oldIndex].id,
              sort: newsort,
            },
            {
              id: tableData[newIndex].id,
              sort: oldsort
            }
          ]
          if (newsort !== oldsort) {
            editFinExpensemodifySort(_data).then(res => {
              console.log(res, '1111');
              if (res.data) {
                _this.tableDataList = []
                _this.initData()
              }
            })
          }
        },
      })
    },

    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = newProp
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

      getFinExpenseItem(this.listQuery).then(res => {
        console.log(res, '费用');
        // this.$forceUpdate()
        this.tableDataList = res.data.records
        console.log(this.tableDataList, '列表数据');
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
        createByName: "",
        endTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
        this.search()
    },
    addSupplier(type) {

      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init("", type)
      })
    },
    addOrUpdateHandle(id, type) {
      this.depFormVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
        // }, 600);
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteFinExpenseItem(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
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
  