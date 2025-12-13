<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="listTable" />
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:8px">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click.native="addOrUpdateHandle()" size="mini">
              新建
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
              <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                       @click="$refs.listTable.showSortDrawer()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <div class="tableBox">
          <JNPF-table v-loading="listLoading" :data="list" highlight-current-row
            @current-change="handleCurrentChange" class="dataTable" border ref="listTable" custom-column customKey="JNPFTableKey_223694" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
            <!-- <el-table-column prop="unitCode" label="单位编码" min-width="120" sortable="custom" /> -->
            <el-table-column prop="name" label="单位名称" min-width="120" />
            <el-table-column prop="unitType" label="分类" min-width="120" >
              <template slot-scope="{ row }">
                <span>
                   {{ global.getDictLabelGlobal('uom', row.unitType) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="120" />
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="updateHandle(scope.row, 'edit')">编辑</el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  @click="handleDel(scope.$index, scope.row.id)">
                  删除
                </el-button>
                <!-- <el-button size="mini" type="text" @click="updateHandle(scope.row,'copy')">复制</el-button> -->
              </template>
            </el-table-column>
          </JNPF-table>
          <JNPF-table v-loading="detailLoading" :data="dataDetail" class="dataTable" border :partentOrChild="'child'"
            custom-column :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
            <el-table-column prop="sourceName" min-width="120" label="主单位" />
            <el-table-column prop="ratio" min-width="120" label="转换系数" />
            <el-table-column prop="calculationDirection" min-width="120" label="计算方向">
              <template slot-scope="{ row }">
                <template v-if="row.calculationDirection == 'multiplication'">
                  乘
                </template>
                <template v-else-if="row.calculationDirection == 'division'">
                  除
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="targetName" min-width="120" label="副单位" />
          </JNPF-table>
        </div>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()" class="pagination" style="text-align: right; padding-right: 60%;" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
  </div>
</template>

<script>
import JNPFForm from './Form'
import { getUnitData, detailUnitData, deleteUnitData } from '@/api/basicData/materialSettings'
import SuperQuery from '@/components/SuperQuery/index.vue'

export default {
  components: { JNPFForm, SuperQuery },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            {prop: 'name', symbol: 'like', fixed: true},
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      superQueryVisible: false,
      superQueryJson: [],
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {},
      // 右侧列表请求参数
      listQueryTwo: {
        pageSize: 50
      },
      formVisible: false,
      dataDetail: [],
      detailLoading: false,
      selectedUnitId: undefined,
      lazyLoadFlag: true
    }
  },
  created() {

  },
  mounted() {
    document.getElementsByClassName('el-table__body-wrapper')[1].onscroll = (event) => {
      const tableWrapper = event.target
      const isBottom = tableWrapper.scrollHeight - tableWrapper.scrollTop === tableWrapper.clientHeight
      if (isBottom && this.lazyLoadFlag) {
        this.lazyLoadFlag = false
        this.listQueryTwo.pageNum++
        detailUnitData({ id: this.selectedUnitId, ...this.listQueryTwo })
          .then((res) => {
            this.dataDetail.push(...(res.data.records || []))
            this.lazyLoadFlag = true
          })
          .catch((err) => {
            this.lazyLoadFlag = true
          })
      }
    }
  },
  methods: {
    columnSetFun() {
      this.$refs.listTable.showDrawer()
    },
    // 内容选择事件
    handleCurrentChange(val) {
      if (!val || this.selectedUnitId == val.id) return
      this.selectedUnitId = val.id
      this.detailLoading = true
      this.listQueryTwo.pageNum = 1
      detailUnitData(val.name).then((res) => {
        this.dataDetail = res.data.unitRelList || []
        this.detailLoading = false
      })
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = newProp
      this.initData()
    },
    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.detailLoading = true
      this.listLoading = true
      this.dataDetail = []
      getUnitData(this.listQuery).then((res) => {
        this.list = res.data.records || []
        this.total = res.data.total
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.listTable.$refs.JNPFTable.setCurrentRow(this.list[0]) // 自动选择第一项、

          if (this.list.length !== 0) {
            detailUnitData(this.list[0].name).then((res) => {
              this.dataDetail = res.data.unitRelList || []
              this.detailLoading = false
            })
          }
        })
      })
    },
    // 删除数据
    handleDel(index, id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      })
        .then(() => {
          deleteUnitData(id).then((res) => {
            if (res.msg === 'Success') res.msg = '删除成功'
            this.initData()
            this.$message({
              type: 'success',
              message: res.msg
            })
          })
        })
        .catch(() => { })
    },
    // 新增数据
    addOrUpdateHandle() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init('{}', 'add')
      })
    },
    // 编辑数据
    updateHandle(rowData, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(JSON.stringify(rowData), btntype)
      })
    },

    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.initData()
    },

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
    flex: 2;
    margin: 0 3px 0 0;
  }

  >.dataTable:last-child {
    flex: 3;
  }
}
</style>
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
