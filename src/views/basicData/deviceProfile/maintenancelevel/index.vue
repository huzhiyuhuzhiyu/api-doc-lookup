<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="listQuery.level" placeholder="请选择保养等级" clearable>
                  <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value">
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
            <topOpts :isJudgePer="true" :addPerCode="'btn_add'" @add="addOrUpdateHandle('','add')">
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top">
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column>
            <el-table-column prop="level" label="保养等级" min-width="140">
              <template slot-scope="scope">
                <div><el-tag type="success" :color="colorfun(scope.row.level)" effect="dark">{{levelfunction(scope.row.level)}}</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="cycle" label="周期" min-width="120" />
            <el-table-column prop="unit" label="单位" min-width="110" />
            <!-- <el-table-column prop="frequency" label="保养频次" min-width="140">
              <template slot-scope="scope">
                <div>{{frequencyfunction(scope.row.frequency)}}</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="createByName" label="创建人" width="120" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
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
import { getequMaintenanceLevel, deleteequMaintenanceLevel } from "@/api/basicData/materialSettings";
import Form from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'maintenancelevel',
  components: { SuperQuery, Form },
  data() {
    return {
      levelList: [
        { label: "日常保养", value: "日常保养", color: "#EB5050" },
        { label: "二级保养", value: "二级保养", color: "#F0A800" },
        { label: "三级保养", value: "三级保养", color: "#46C26F" },
        { label: "四级保养", value: "四级保养", color: "#A2C204" },
        { label: "年度保养", value: "年度保养", color: "#00AED1" }
      ],
      frequencyList: [
        { label: "每天一次", value: "每天一次", color: "#EB5050" },
        { label: "每月一次", value: "每月一次", color: "#F0A800" },
        { label: "每季度一次", value: "每季度一次", color: "#46C26F" },
        { label: "每半年一次", value: "每半年一次", color: "#A2C204" },
        { label: "每年一次", value: "每年一次", color: "#00AED1" }
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
          prop: 'level',
          label: "保养等级",
          type: 'select',
          options: [{ label: "日常保养", value: "日常保养" }, { label: "二级保养", value: "二级保养" }, { label: "三级保养", value: "三级保养" }, { label: "四级保养", value: "四级保养" }, { label: "年度保养", value: "年度保养" }]
        },
        {
          prop: 'frequency',
          label: "保养频次",
          type: 'select',
          options: [{ label: "每天一次", value: "每天一次" }, { label: "每月一次", value: "每月一次" }, { label: "每季度一次", value: "每季度一次" }, { label: "每半年一次", value: "每半年一次" }, { label: "每年一次", value: "每年一次" }]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
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
    colorfun(val) {
      let _data = this.levelList.filter(item => item.value == val)[0]
      return _data ? _data.color : '#EB5050'
    },
    levelfunction(val) {
      let _data = this.levelList.filter(item => item.value == val)[0]
      return _data ? _data.label : val
    },
    frequencyfunction(val) {
      let _data = this.frequencyList.filter(item => item.value == val)[0]
      return _data ? _data.label : val
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type)
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
        deleteequMaintenanceLevel(id).then(res => {
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
      getequMaintenanceLevel(this.listQuery).then(res => {
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
<style scoped>
::v-deep .el-tag--dark.el-tag--success {
  border-color: rgb(0, 0, 0, 0);
}
</style>
