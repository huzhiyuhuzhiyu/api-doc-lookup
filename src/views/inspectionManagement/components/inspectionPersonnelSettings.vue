<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4" v-for="item in searchList" :key="item.prop">
            <el-form-item>
              <el-input @keyup.native.enter="search()" v-if="item.type === 'input'" v-model="listQuery[item.prop]"
                :placeholder="'请输入' + item.label" clearable />
              <el-select v-else-if="item.type === 'select'" @change="selectChange" v-model="listQuery[item.prop]"
                :placeholder="'请选择' + item.label" style="width: 100%;" clearable>
                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                  :value="item2.value"></el-option>
              </el-select>

              <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery.reconciliationDateArr"
                type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" :start-placeholder="item.label + '开始日期'"
                :end-placeholder="item.label + '结束日期'"></el-date-picker>
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
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:10px">
          <div>
            <el-button size="mini" type="primary" @click="handleBatch">批量设置检验人员</el-button>
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
        <JNPF-table v-if="tableDataFlag" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          ref="dataTable" hasC @selection-change="currentChange" :setColumnDisplayList="columnList">
          <template v-for="item in tableItems">
            <el-table-column v-if="item.prop == 'effectiveDate'" :prop="item.prop" :key="item.prop" :label="item.label"
              :fixed="item.fixed || false" :min-width="item.minWidth || 130" align="center" :sortable="item.sortable"
              :formatter="jnpf.tableDateFormatStrDay"></el-table-column>
            <el-table-column v-else-if="item.prop == 'productSource'" :prop="item.prop" :key="item.prop"
              :label="item.label" :fixed="item.fixed || false" :min-width="item.minWidth || 130"
              :sortable="item.sortable">
              <template slot-scope="{ row }">
                <template v-if="row.productSource == 'produce'">
                  生产
                </template>
                <template v-else-if="row.productSource == 'purchase'">
                  采购
                </template>
                <template v-else-if="row.productSource == 'out'">
                  外协
                </template>
                <template v-else-if="row.productSource == 'assemble'">
                  组装
                </template>
              </template>
            </el-table-column>
            <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label" :fixed="item.fixed || false"
              :min-width="item.minWidth || 130" :sortable="item.sortable" />
          </template>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <!-- 批量设置检验人员 -->
    <el-dialog v-if="analyseDialog" title="批量设置人员" :close-on-click-modal="false" append-to-body
      :visible.sync="analyseDialog" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
      <el-row :gutter="15" style="margin-top: 0px;">
        <el-form ref="elForm" :model="dataForm" label-position="top" :rules="dataFormRules">
          <el-row :gutter="30">
            <el-col :sm="24">
              <el-form-item prop="roleIds" label="角色">
                <el-select v-model="dataForm.roleIds" placeholder="请选择角色" clearable multiple collapse-tags
                  style="width: 100%;">
                  <el-option v-for="(item, index) in roleData" :key="index" :label="item.fullName"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="24">
              <el-form-item prop="staffingName" label="人员">
                <InspectComSelectPpage clearable :isdisabled="type === 'look'" :renderTree="false"
                  v-model="dataForm.staffingName" @change="supplierdata" :tableItems="staffingTableItems"
                  :placeholder="'请选择人员'" title="选择人员" :listMethod="getUsersByUserCondition"
                  :listRequestObj="staffingListRequestObj" :searchList="staffingTableSearchList"
                  :listDataFormatting="listDataFormatting" :totalFormatting="totalFormatting"
                  :beforeOpen="beforeOpen" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="analyseDialog = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
          {{ $t('common.submitButton') }}
        </el-button>
      </span>
    </el-dialog>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />

  </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { getRoleList } from '@/api/permission/role'
import { getUsersByUserCondition } from '@/api/permission/user'
import InspectComSelectPpage from "./ComSelect-page/index.vue";
export default {
  components: { SuperQuery, InspectComSelectPpage },
  mixins: [getProjectList],
  props: {
    priceType: {
      type: String,
      required: true
    },
    /* 列表数据请求方法 */
    listMethod: {
      required: true
    },
    /* 设置数据请求方法 */
    batchMethod: {
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
    },
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

    superQueryJson: {
      type: Array,
      default: () => []
    },
    columnList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      priceTypeName: '',
      importProjectId: '',

      roleData: [],
      personData: [],
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      depVisibled: false,
      uploadVisib: false,
      exportFormVisible: false,
      searchList: [],
      leftFlag: false,
      filterText: '',
      superQueryVisible: false,
      tableDetailItems: [],
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      listQuery: {},
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      listQuery: {},
      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      attributeLines: [],
      analyseDialog: false,
      btnLoading: false,
      processFlag: false,
      inspectionFlag: false,
      dataForm: {
        roleIds: [],
        staffingName: '',
        staffingId: '',
        effectiveDate: '',
        timePrice: '',
        unitPrice: ''
      },
      dataFormRules: {
        roleIds: [{ required: true, message: '角色不能为空', trigger: 'change' }],

        staffingName: [{ required: true, message: '检验人员不能为空', trigger: 'change' }]
      },
      selectedData: [],
      basicQuery: {},
      superQuery: {},
      detailTableItems: [],
      getUsersByUserCondition,
      staffingListRequestObj: {
        pagination: {
          currentPage: 1,
          keyword: '',
          pageSize: -1,
          projectId: 0,
          sidx: '',
          sort: ''
        },
        roleIds: []
      },
      staffingTableSearchList: [
        { prop: 'realName', label: '姓名', type: 'input' },
      ],
      staffingTableItems: [
        { prop: 'realName', label: '姓名' },
        { prop: 'organize', label: '组织' },
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  computed: {
    effectiveDatePickerOptions() {
      return {
        disabledDate: (date) => {
          // 禁用早于第一个时间的日期
          return date < new Date() - 8.64e7
        }
      }
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getRoleList()
    await this.getProjectList()
    this.tableDataFlag = true
    this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))


    this.initData()
  },
  methods: {
    getRoleList() {
      let obj = {
        organizeId: '',
        keyword: '',
        currentPage: 1,
        pageSize: -1,
        sort: 'desc',
        sidx: ''
      }
      getRoleList(obj)
        .then((res) => {
          this.roleData = res.data.list
        })
        .catch(() => { })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp
      if (this.processFlag) {
        if (['productsCode', 'productsName', 'processName', 'processCode'].includes(prop)) {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
        }
      } else {
      }

      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    initData() {
      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      this.listMethod(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    selectChange(val) {
      this.initData()
    },
    search(type) {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
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
        this.listQuery.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.listQuery.superQuery = this.superQuery
      }

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
      this.initData()
    },
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.search('basic')
    },
    currentChange(data) {
      this.selectedData = data
    },
    async handleBatch() {
      if (!this.selectedData.length) return this.$message.error('请至少选择一条工序数据')

      let flag = this.hasDifferentPricingType(this.selectedData)
      if (flag) return this.$message.error('只能选择相同计价类型的工序数据')

      this.btnLoading = false
      this.analyseDialog = true
    },
    hasDifferentPricingType(arr) {
      const codes = new Set()

      for (const item of arr) {
        codes.add(item.pricingType)
      }

      return codes.size > 1 // 如果有多个不同的代码，则返回 true
    },
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true

      const form_1 = this.$refs.elForm
      const valid_1 = await form_1.validate().catch((err) => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      if (submitFlag) {
        let arr = this.selectedData.map(item => {
          return item.id
        })
        let obj = {
          lineIdList: arr,
          staffingId: this.dataForm.staffingId
        }

        this.batchMethod(obj)
          .then((res) => {
            this.$message.success('单价设置成功')
            this.selectedData = []
            this.$refs.dataTable.$refs.JNPFTable.clearSelection()
            this.analyseDialog = false
            this.dataForm = {
              staffingId: '',
            }
            this.search()
          })
          .catch((err) => {
            this.btnLoading = false
          })
      } else {
        this.btnLoading = false
      }
    },
    roleChange(data) {
      this.staffingListRequestObj.roleIds = this.dataForm.roleIds
    },
    listDataFormatting(res) {
      res.data.list.forEach((item, index) => {
        if (item.classType === 'packaging') {
          item.classTypeName = '包装物'
        } else if (item.classType === 'inner_ring_blank') {
          item.classTypeName = '内圈毛坯'
        } else if (item.classType === 'outer_ring_blank') {
          item.classTypeName = '外圈毛坯'
        } else if (item.classType === 'inner_ring') {
          item.classTypeName = '内圈'
        } else if (item.classType === 'outer_ring') {
          item.classTypeName = '外圈'
        } else if (item.classType === 'abrasive') {
          item.classTypeName = '磨料'
        } else if (item.classType === 'oil') {
          item.classTypeName = '油料'
        } else if (item.classType === 'accessory') {
          item.classTypeName = '配件'
        } else if (item.classType === 'turnover_box') {
          item.classTypeName = '周转箱'
        } else if (item.classType === 'holder') {
          item.classTypeName = '保持架'
        } else if (item.classType === 'sealing_cap') {
          item.classTypeName = '密封盖'
        }
      })

      return res.data.list
    },
    totalFormatting(res) {
      return res.data.pagination.total
    },
    async beforeOpen(paramsObj) {
      this.staffingListRequestObj.roleIds = this.dataForm.roleIds
      return true
    },
    supplierdata(val, data) {
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.staffingName = data[0].all.realName
        this.dataForm.staffingId = data[0].all.id
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.staffingName = ''
        this.dataForm.staffingId = ''
      }
    }
  }
}
</script>
<style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

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
