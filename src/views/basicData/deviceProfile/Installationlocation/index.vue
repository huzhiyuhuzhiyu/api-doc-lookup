<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="listQuery.type" placeholder="请选择类型" clearable>
                  <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <!-- <topOpts :isJudgePer="true" :addPerCode="'btn_add'" @add="addOrUpdateHandle('','add')">
            </topOpts> -->
            <div>
              <el-dropdown style="margin-right:10px;">
                <el-button v-has="'btn_add'" size="mini" type="primary" icon="el-icon-plus">
                  新建
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addOrUpdateHandle('','add','workshop')">新建车间</el-dropdown-item>
                  <el-dropdown-item @click.native="addOrUpdateHandle('','add','location')">新建安装地点</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column customKey="JNPFTableKey_862286">
            <el-table-column prop="type" label="类型" width="160">
              <template slot-scope="scope">
                <div v-if="scope.row.type=='workshop'"><el-tag effect="dark">车间</el-tag></div>
                <div v-else-if="scope.row.type=='location'"><el-tag type="success" effect="dark">安装地点</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="车间/安装地点" min-width="180" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="createByName" label="创建人" width="120" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit',scope.row.type)" @del="handleDel(scope.row.id)">
                  <!-- <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                        查看详情
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData">
          </pagination>
        </div>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getequMountedPlaces, deleteequMountedPlaces } from "@/api/basicData/materialSettings";
import Form from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'Installationlocation',
  components: { SuperQuery, Form },
  data() {
    return {
      typeList: [
        { label: '车间', value: 'workshop' },
        { label: '安装地点', value: 'location' },
      ],
      formVisible: false,
      listLoading: false,
      tableData: [],
      superQueryVisible: false,
      initListQuery: {
        level: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      listQuery: {},
      superQueryJson: [
        {
          prop: 'type',
          label: "类型",
          type: 'select',
          options: [
            { label: '车间', value: 'workshop' },
            { label: '安装地点', value: 'location' },
          ]
        },
        {
          prop: 'name',
          label: "车间/安装地点",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        }
      ]
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    addOrUpdateHandle(id, type, value) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type, value)
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.$refs.SuperQuery.conditionList = []
      this.initData()
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteequMountedPlaces(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getequMountedPlaces(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
