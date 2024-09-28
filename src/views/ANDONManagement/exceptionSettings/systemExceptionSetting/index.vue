<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <template v-for="item in searchList">
            <el-col :span="4" :key="item.prop">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="'请输入' + item.label"
                  clearable @keyup.enter.native="search('basic')" />
                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="'请选择' + item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">查询</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle('', 'add')"></topOpts>
          <div></div>
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
        <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange" class="dataTable" border
          ref="listTable" custom-column>
          <el-table-column prop="code" label="异常编码" min-width="120" sortable="custom" />
          <el-table-column prop="name" label="异常名称" min-width="120" sortable="custom" />
          <el-table-column prop="cron" label="执行周期" min-width="120" sortable="custom" />
          <el-table-column prop="remark" label="说明" min-width="160" sortable="custom" />

          <el-table-column prop="status" label="启用状态" min-width="80" align="center">
              <template slot-scope="scope">
                <el-switch @change="changeState(scope.row)" v-model="scope.row.status"
                active-value="enable" inactive-value="disabled">
                </el-switch>
              </template>
            </el-table-column>

          <el-table-column prop="createByName" label="创建人" min-width="120" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)" :delDisabled="scope.row.status === 'enable' ? true : false">
                  <el-button size="mini" type="text" @click.native="addOrUpdateHandle(scope.row.id,'look')">查看详情</el-button>
                </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>

        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData"
          class="pagination" style="text-align: left; padding-left: 20px;" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @close="refresh" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
  </div>
</template>

<script>
import JNPFForm from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getSystemAbnoramlData ,delSystemData, updateState} from '@/api/abnormalManagement/index.js'
export default {
  components: { SuperQuery,JNPFForm },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '异常编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '异常名称',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '说明',
          type: 'input'
        },
        {
          prop: 'status',
          label: '启用状态',
          type: 'select',
          options:[
            { value: 'enable', label: '启用' },
            { value: 'disabled', label: '禁用' },
          ],
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetime',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
        },
      ],
      visible: false,
      approvalBtnLoading: false,
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
        code: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        name: "",
        startTime: "",
        startUpdateTime: "",
        status: "",
        superQuery: {},
        totalRowFlag: false
      },
      formVisible: false,
      basicQuery: {},
      superQuery: {},
      searchList: [
        { fieldValue: '', field: 'code', label: '异常编码', prop: 'code', symbol: 'like', searchType: 1 },
        { fieldValue: '', field: 'name', label: '异常名称', prop: 'name', symbol: 'like', searchType: 1 },
      ],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.listTable.showDrawer()
    },
    changeState(row) {
      updateState(row).then(res => {
        if (res.msg === 'Success') {
          this.initData()
        }
      })
    },
    sortChange({ prop, order }) {
      let newProp = ''
      if (['equipmentName', 'productDrawingNo', 'createByName'].includes(prop)) {
        newProp = prop === 'createByName' ? 'create_by' : prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getSystemAbnoramlData(this.listQuery).then((res) => {
        this.list = res.data.records || []
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => this.listLoading = false)
    },
    // 新增数据
    addOrUpdateHandle(id,btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id,btnType)
      })
    },
    search(type) {
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList.filter(item => item.fieldValue).map(item => {
            return {
              ...item,
              fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
            }
          })
        }
        this.listQuery.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.listQuery.superQuery = this.superQuery
      }
      this.initData()
    },
    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.reset()
    },
    reset() {
      this.$refs['listTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.initListQuery.module = ''
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.searchList.forEach(item => { item.fieldValue = '' })
      this.search()
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delSystemData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        })
      }).catch(() => { });
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
