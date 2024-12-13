<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent :rules="rules">
          <!-- <template v-for="(item, index) in searchList">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                  @keyup.enter.native="search('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                  :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                  :type="item.dateType"
                  :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template> -->
          <el-col :span="4">
            <el-form-item label="">
              <el-input v-model="form.name" placeholder="名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <topOpts @add="addSupplier()" />

          <div class="JNPF-common-head-right">
            <!-- <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip> -->
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" row-key="id" highlight-current-row :data="tableData"
          custom-column :setColumnDisplayList="columnList" @sort-change="sortChange" @changeMove="changeMove">
          <el-table-column prop="name" label="名称" width="250" sortable="custom" />
          <el-table-column prop="quantity" label="配对数量" min-width="150" sortable="custom" />
          <el-table-column prop="remark" label="备注" width="250" />
          <el-table-column label="操作" width="110" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row)" @del="handleDel(scope.row.id)">
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <WarehouseForm v-if="warehouseFormVisible" ref="warehouseForm" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import {
  delBimPairingMode,
  getBimPairingModeList,

} from '@/api/masterDataManagement/index'
import Form from './Form'
import moment from 'moment'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { updateSortBatch } from '@/api/masterDataManagement/index'
export default {
  name: 'supplierProfile',
  components: { Form, SuperQuery },
  data() {
    return {
      searchList: [
        { field: 'name', fieldValue: '', label: '名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      activeName: 'supplierPage',
      visible: false,

      treeData: [],
      leftFlag: false,
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      form: {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 20,

        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ]
      },
      defaultProps: {
        children: 'childrenList',
        label: 'fullName'
      },
      rules: {
        code: [{}]
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      columnList: [],
      createTimeArr: [],

      superQueryJson: [
        {
          prop: 'name',
          label: '类别名称',
          type: 'input'
        },
        {
          prop: 'quantity',
          label: '配对数量',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },

  created() {
    this.form = this.form
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    changeMove(data) {
      data.forEach(item => {
        item.sort = item.sortCode
      })
      updateSortBatch(data).then(res => {
        this.$message.success("排序修改成功")
        this.initData()
      })
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.form.orderItems[0].asc = order !== 'descending'
      this.form.orderItems[0].column = newProp
      this.initData()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },


    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },

    filterNode(value, data) {
      if (!value) return true
      return data.fullName.indexOf(value) !== -1
    },
    initData() {
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.form.startTime = this.createTimeArr[0] + ' 00:00:00'
        this.form.endTime = this.createTimeArr[1] + ' 23:59:59'
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
      this.listLoading = true
      getBimPairingModeList(this.form)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type) {
      Object.keys(this.form).forEach((key) => {
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
      this.form.pageNum = 1
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.form.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.form.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.form = {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          },
          {
            asc: false,
            column: ''
          }
        ]
      }
      this.searchList = [
        { field: 'name', fieldValue: '', label: '名称', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.$refs.SuperQuery.conditionList = []

      this.search('basic')
    },
    handleNodeClick(data, node) {
      this.form.typeCode = node.data.enCode
      this.search('basic')
    },

    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init('', 'add')
      })
    },
    addOrUpdateHandle(row) {
      this.formVisible = true
      if (row) {
        this.$nextTick(() => {
          this.$refs.Form.init(row, 'edit')
        })
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          delBimPairingMode(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    handleUserRelation(id, parentId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, btnType)
      })
    },

  }
}
</script>
<style scoped>
::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
}

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
  height: 40px !important;
  line-height: 40px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
<style scoped>
.title_box {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
