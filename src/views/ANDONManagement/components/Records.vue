<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4" v-for="item in searchList" :key="item.prop">
            <el-form-item>
              <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="'请输入' + item.label" clearable
                @keyup.enter.native="search('basic')" />
              <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="'请输入' + item.label"
                clearable>
                <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="height:48px">
          <!-- <topOpts @add="addOrUpdateHandle('', 'add')" /> -->
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

        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO @sort-change="sortChange"  custom-column>
          <template v-for="item in tableItems">
            <el-table-column v-if="item.prop == 'type'" :prop="item.prop" :key="item.prop" :label="item.label"
              :fixed="item.fixed || false" :min-width="item.minWidth || 120">
              <template slot-scope="scope">
                <el-tag type='warning' v-if="scope.row.type === 'custom'">自定义异常</el-tag>
                <el-tag type='danger' v-else>系统异常</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.prop == 'abnormalType'" :prop="item.prop" :key="item.prop" :label="item.label"
              :fixed="item.fixed || false" :min-width="item.minWidth || 120">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.abnormalType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.prop == 'abnormalContent'" :prop="item.prop" :key="item.prop" :label="item.label"
              :fixed="item.fixed || false" :min-width="item.minWidth || 120">
              <template slot-scope="scope">
                <el-tag  type="success">{{ scope.row.abnormalContent }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label" :fixed="item.fixed || false"
              :min-width="item.minWidth || 120" :sortable="item.sortable" />
          </template>

          <!-- <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id, 'look')">
                查看详情
              </el-button>
            </template>
          </el-table-column> -->
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
  </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'cancelsAndHistoryRecord',
  components: { SuperQuery },
  props: {
    tableItems: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    searchList: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    searchListMore: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    /* 列表数据请求方法 */
    listMethod: {
      required: true
    },
    /* 列表数据请求体 */
    listRequestObj: {
      type: Object | Function,
      required: true
      /* 
        对象写法：{ code: "", name: "", orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        函数写法：(rowIndex) => {
          let id = this.linesList[rowIndex].id
          return { id, orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        }
      */
    }
  },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '申请单号',
          type: 'input'
        },
        {
          prop: 'type',
          label: '申请类型',
          type: 'select',
          options: [
            { label: '自定义异常', value: 'custom' },
            { label: '系统异常', value: 'system' }
          ]
        },
        {
          prop: 'abnormalType',
          label: '异常类型',
          type: 'input'
        },
        {
          prop: 'abnormalContent',
          label: '异常内容',
          type: 'input'
        },
        {
          prop: 'equipmentName',
          label: '关联设备',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '关联产品',
          type: 'input'
        },
        {
          prop: 'createByName',
          label: '发起人',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '发起时间',
          type: 'datetime',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
        },
        {
          prop: 'personId',
          label: '响应人',
          type: 'input'
        },
      ],
      title: '更多查询',
      tableData: [],
      listLoading: false,
      visible: false,
      listQuery: {},
      total: 0,
      formVisible: false,
      basicQuery: {},
      superQuery: {},
    }
  },
  created() {
    this.getData()
  },
  methods: {
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp = ''
      if (['equipmentName', 'productDrawingNo', 'createByName','personName'].includes(prop)) {
        newProp = prop === 'createByName' ? 'create_by' : prop === 'personName' ? 'person_id' : prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    getData() {
      this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      this.visible = false
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listMethod(this.listQuery).then((res) => {
        this.tableData = res.data.records
        this.total = res.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
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
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.getData()
    },
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
