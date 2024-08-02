<template>
  <div class="JNPF-common-layout" :element-loading-text="loadingText">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <template v-for="item in searchList">
            <el-col :span="item.searchType === 3 ? 6 :4" :key="item.prop">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="'请输入' + item.label"
                  clearable @keyup.enter.native="search('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue"
                  :placeholder="'请输入' + item.label" clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="'请选择' + item.label + '开始'" :end-placeholder="'请选择' + item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <topOpts @add="addOrUpdateHandle('','add')">
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="columnData.hasSuperQuery">
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
        <JNPF-table class="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
          ref="dataTable" custom-column v-if="tableItems.length">
          <template v-if="tableItems">
            <el-table-column v-for="item in tableItems" :key="item.prop" :prop="item.prop" :label="item.label"
              :formatter="item.formatter || toFormatter" :sortable="item.sortable ? 'custom' : false"
              :align="item.align || 'left'" v-bind="{ minWidth: item.hasOwnProperty('minWidth') ? item.width : 140 }">
            </el-table-column>
          </template>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'copy')">
                      复制订单
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination v-if="columnData.hasPage" :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { detailVisualDevInfo, getDocData } from '@/api/system/system'
import { deleteOrders} from '@/api/salesManagement/assemblyOrders'
import Form from './form'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'testSaleOrder',
  components: { SuperQuery , Form },
  data() {
    return {
      superQueryVisible: false,
      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      tableData: [],
      tableLineData: [],
      listLoading: false,
      loadingText: false,
      initListQuery: {
        type: "master",
        visualId: "",
        condList: [],
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {},
      customQuery:{

      },
      productStatusList: [{ label: "启用", value: "enable" }, { label: "禁用", value: "disabled" }], // 产品状态
      productSourceList: [{ label: "自制", value: "produce" }, { label: "采购", value: "purchase" }, { label: "外协", value: "out" }], // 产品来源
      total: 0,
      formVisible: false,

      columnData: [],
      formatterFunction: null,
      tableItems: [],
      tableLineItems: [],
      listCondList: [],
      listLineCondList: [],
      detailLoading: false,
      searchList: [],
      superQueryJson: [],
      basicQuery: {},
      superQuery: {},
    }
  },
  async created() {
    this.getDevData()
  },
  computed: {
    ...mapState('user', ['token']),
  },
  methods: {
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.aiformVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    getToLowerCase(val) {
      return val.replace(/_(.)/g, (match, group) => group.toUpperCase())
    },
    getDevData() {
      let queryString = this.jnpf.getQueryString()
      detailVisualDevInfo(queryString).then(res => {
        this.columnData = JSON.parse(res.data.columnData)
        console.log(this.columnData);
        this.initListQuery.visualId = res.data.id
        this.initListQuery.pageSize = this.columnData.pageSize
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
        console.log(this.listQuery);
        this.searchList = this.columnData.searchList.map(item=>{
          return {
            ...item,
            fieldValue:item.searchType === 3 ? [] :'',
            field:item.prop,
            symbol:item.searchType === 1 ? '==' : item.searchType === 2 ? 'like' : item.searchType === 3 ? 'between' : '=='
          }
        })
        this.listCondList = this.columnData.master.condList
        this.tableItems = this.columnData.columnList.map(item => {
          let formatterFunction = null
          if (item.formatter) {
            formatterFunction = new Function('return ' + item.formatter)
          }
          return {
            ...item,
            minWidth: item.width ? item.width : 120,
            formatter: item.formatter ? formatterFunction.bind(this)() : ''
          }
        })
        this.superQueryJson = this.columnData.searchOptions.map(item => {
          return {
            ...item,
            type: item.searchType === 1 || item.searchType === 2 ? 'input' : item.searchType === 3 ? 'date' : 'select',
            valueFormat: item.searchType === 3 && item.dateType ? 'yyyy-MM-dd' : null

          }
        })
        this.initData()

      }).catch(() => { })
    },
    toFormatter(row, column, cellValue, index) {
      return cellValue
    },
    initData() {
      this.listLoading = true
      console.log(this.listQuery, 'list');

      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      // this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
      getDocData(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic'){
        console.log(this.searchList);
        this.basicQuery = {
          matchLogic:'AND',
          condition: this.searchList.filter(item => item.fieldValue).map(item=>{
            return {
              ...item,
              fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
            }
          })
        }
        this.listQuery.superQuery =  this.basicQuery
      }
      if (type === 'super'){
        this.listQuery.superQuery =  this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.searchList.forEach(item => {
        item.fieldValue = ''
      })
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },

    addOrUpdateHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteOrders(id).then(res => {
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
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />