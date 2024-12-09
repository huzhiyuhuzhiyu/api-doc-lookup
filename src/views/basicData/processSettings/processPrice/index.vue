<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" v-if="!leftFlag">
        <h2>工序分类</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <div v-if="!leftFlag">
        <el-input placeholder="请输入" v-model="filterText" style="width:200px;margin:10px auto;display:block"
          suffix-icon="el-icon-search" clearable></el-input>
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i :class="[
              data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm'
            ]" />
            <span class="text" :title="data.name">{{ `${data.name}` }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="工序编码" clearable @keyup.enter.native="search('basic')" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="工序名称" clearable @keyup.enter.native="search('basic')" />
            </el-form-item>
          </el-col> -->
          <template v-for="item in searchList">
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
          </template>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.pricingType" placeholder="计价类型" clearable style="width: 100%;">
                <el-option
                  v-for="(item, index) in [{ label: '计时', value: 'by_time' }, { label: '计件', value: 'by_piece' }]"
                  :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
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
          <el-button type="primary" @click="handleBatch">批量设置价格</el-button>
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
          <el-table-column prop="name" label="工序名称" min-width="180" sortable="custom" />
          <el-table-column prop="code" label="工序编码" min-width="160" sortable="custom"></el-table-column>
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="pricingType" label="计价类型" width="120" sortable="custom">
            <template slot-scope="{ row }">
              <template v-if="row.pricingType == 'by_time'">
                计时
              </template>
              <template v-else-if="row.pricingType == 'by_piece'">
                计件
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" label="计件单价(元)" width="130">
            <template slot-scope="scope">
              <div>{{ scope.row.unitPrice ? scope.row.unitPrice : 0 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="timePrice" label="计时单价(元)" width="130">
            <template slot-scope="scope">
              <div>{{ scope.row.timePrice ? scope.row.timePrice : 0 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="100" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <!-- 批量设置价格 -->
    <el-dialog v-if="analyseDialog" title="批量设置单价" :close-on-click-modal="false" append-to-body
      :visible.sync="analyseDialog" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
      <el-row :gutter="15" style="margin-top: 0px;">
        <el-form ref="elForm" :model="dataForm" label-position="top" :rules="dataFormRules">
          <el-row :gutter="30">
            <el-col :sm="24">
              <el-form-item prop="pricingType" label="计价类型">
                <el-select v-model="dataForm.pricingType" placeholder="请选择计价类型" clearable style="width: 100%;">
                  <el-option
                    v-for="(item, index) in [{ label: '计时', value: 'by_time' }, { label: '计件', value: 'by_piece' }]"
                    :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="24" v-if="dataForm.pricingType == 'by_time'">
              <el-form-item prop="timePrice" label="计时单价">
                <el-input v-model="dataForm.timePrice" placeholder="请输入计时单价" />
              </el-form-item>
            </el-col>
            <el-col :sm="24" v-if="dataForm.pricingType == 'by_piece'">
              <el-form-item prop="unitPrice" label="计件单价">
                <el-input v-model="dataForm.unitPrice" placeholder="请输入计件单价" />
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
import { getBimProcessList, updatebimProcessPrice } from '@/api/bimProcess/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: { SuperQuery },
  mixins: [getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      tableDataFlag: false,
      searchList: [
        { field: 'code', fieldValue: '', label: '工序编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'name', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      leftFlag: false,
      filterText: '',
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '工序编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '工序名称',
          type: 'input'
        },
        {
          prop: 'pricingType',
          label: '计价类型',
          type: 'select',
          options: [{ label: '计时', value: 'by_time' }, { label: '计件', value: 'by_piece' }]
        },

        {
          prop: 'unitPrice',
          label: '计件单价(元)',
          type: 'input'
        },
        {
          prop: 'timePrice',
          label: '计时单价(元)',
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
      ],
      columnList: ['createByName', 'createTime'],
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {
        code: '',
        name: '',
        pricingType: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        processingType: '',
        productCategoryId: ''
      },
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
      dataForm: {
        pricingType: '',
        timePrice: '',
        unitPrice: ''
      },
      dataFormRules: {
        pricingType: [{ required: true, message: '计价类型不能为空', trigger: 'change' }],
        timePrice: [
          { validator: this.formValidate({ type: 'decimal', params: [10, 4, '', (errMsg) => { }] }), trigger: 'blur' },
          { required: true, message: '计时单价不能为空', trigger: 'blur' }
        ],
        unitPrice: [
          { validator: this.formValidate({ type: 'decimal', params: [10, 4, '', (errMsg) => { }] }), trigger: 'blur' },
          { required: true, message: '正品单价不能为空', trigger: 'blur' }
        ]
      },
      selectedData: [],
      basicQuery: {},
      superQuery: {}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.tableDataFlag = true
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

    this.getcategoryTree()
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
      let newProp
      if (prop === 'productCategoryIdText') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
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
    // 获取指定树状列表
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = '' // 重置数据类型id筛选
      let query = {
        type: 'process',
        pageNum: 1,
        pageSize: 20
      }
      getcategoryTree(query)
        .then((res) => {
          this.treeData = res.data.length ? res.data : []
          this.$nextTick(() => {
            this.treeLoading = false
            this.initData()
          })
        })
        .catch(() => {
          this.treeLoading = false
          this.listLoading = false
        })
    },
    initData() {
      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      getBimProcessList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
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
      this.searchList = [
        { field: 'code', fieldValue: '', label: '工序编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'name', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        // {
        //   field: 'pricingType',
        //   fieldValue: 'by_time',
        //   label: '计价类型',
        //   symbol: 'like',
        //   searchType: 4,
        //   width: 120,
        //   options: [{ label: '计时', value: 'by_time' }, { label: '计件', value: 'by_piece' }]
        // }
      ]
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
      this.filterText = ''
      this.getcategoryTree()
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
      this.dataForm.pricingType = this.selectedData[0].pricingType
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
        let idList = this.selectedData.map((item) => {
          return item.id
        })
        let _data = {
          idList: idList,
          ...this.dataForm
        }
        updatebimProcessPrice(_data)
          .then((res) => {
            this.$message.success('单价设置成功')
            this.selectedData = []
            this.$refs.dataTable.$refs.JNPFTable.clearSelection()
            this.analyseDialog = false
            this.dataForm = {
              pricingType: '',
              timePrice: '',
              unitPrice: ''
            }
            this.search()
          })
          .catch((err) => {
            this.btnLoading = false
          })
      } else {
        this.btnLoading = false
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
