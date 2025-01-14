<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入类型编码" clearable maxlength="20" @keyup.enter.native="search()"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="请输入类型名称" clearable maxlength="20" @keyup.enter.native="search()"></el-input>
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
        <div class="JNPF-common-head" style="padding:8px">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click.native="addOrUpdateHandle('', 'add')" size="mini">
              新建
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
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
          <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange" highlight-current-row
            @current-change="handleCurrentChange" class="dataTable" border ref="listTable" custom-column>
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
          <JNPF-table v-loading="detailLoading" :data="dataDetail" class="dataTable" border :partentOrChild="'child'"
            custom-column>
            <el-table-column prop="code" min-width="120" label="内容编码" />
            <el-table-column prop="name" min-width="120" label="内容名称" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="flowSet(scope.row.id,scope.row.name)">流程设置</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
        </div>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData"
          class="pagination" style="text-align: left; padding-left: 20px;" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    <FlowForm v-if="flowFormVisible" ref="FlowForm" @close="flowFormVisible = false" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
  </div>
</template>

<script>
import JNPFForm from './Form'
import FlowForm from './FlowForm'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getAbnoramlTypeData, deleteAbnoramlTypeData, detailAbnoramlTypeData } from '@/api/abnormalManagement/index.js'
export default {
  components: { JNPFForm, SuperQuery ,FlowForm},
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '类型编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '类型名称',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ],
      list: [],
      listLoading: true,
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
      formVisible: false,
      dataDetail: [],
      detailLoading: false,
      selectedUnitId: undefined,
      lazyLoadFlag: true,
      flowFormVisible: false,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  mounted() {
    document.getElementsByClassName('el-table__body-wrapper')[1].onscroll = (event) => {
      const tableWrapper = event.target
      const isBottom = tableWrapper.scrollHeight - tableWrapper.scrollTop === tableWrapper.clientHeight
      if (isBottom && this.lazyLoadFlag) {
        this.lazyLoadFlag = false
        detailAbnoramlTypeData(this.selectedUnitId)
          .then((res) => {
            this.dataDetail.push(...(res.data.contentList || []))
            this.lazyLoadFlag = true
          })
          .catch((err) => {
            this.lazyLoadFlag = true
          })
      }
    }
  },
  methods: {
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.listTable.showDrawer()
    },
    // 内容选择事件
    handleCurrentChange(val) {
      if (!val || this.selectedUnitId == val.id) return
      this.selectedUnitId = val.id
      this.detailLoading = true
      detailAbnoramlTypeData(val.id).then((res) => {
        this.dataDetail = res.data.contentList || []
        this.detailLoading = false
      })
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = newProp
      this.initData()
    },
    initData() {
      this.detailLoading = true
      this.listLoading = true
      this.dataDetail = []
      getAbnoramlTypeData(this.listQuery).then((res) => {
        this.list = res.data.records || []
        this.total = res.data.total
        this.listLoading = false
        this.$nextTick(() => {
          this.$refs.listTable.$refs.JNPFTable.setCurrentRow(this.list[0]) // 自动选择第一项、
          this.detailLoading = false
          if (this.list.length !== 0) {
            detailAbnoramlTypeData(this.list[0].id).then((res) => {
              this.dataDetail = res.data.contentList || []
              this.detailLoading = false
            })
          }
        })
      })
    },
    // 删除数据
    handleDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteAbnoramlTypeData(id).then((res) => {
          if (res.msg === 'Success') res.msg = '删除成功'
          this.initData()
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
      }).catch(() => { })
    },
    // 新增数据
    addOrUpdateHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, btnType)
      })
    },
    search() {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.reset()
    },
    reset() {
      this.$refs['listTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },
    flowSet(id,name) {
      this.flowFormVisible = true
      this.$nextTick(() => {
        this.$refs.FlowForm.init(id,name)
      })
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
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
