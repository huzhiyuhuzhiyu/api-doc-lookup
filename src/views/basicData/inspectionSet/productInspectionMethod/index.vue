<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title">
        <h2 v-if="!leftFlag">产品分类</h2>
        <span class="options" v-if="!leftFlag">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
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
            <span class="text" :title="data.name">{{ data.name }}</span>
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
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productCode" placeholder="产品编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="isProductNameSwitch === '1'">
            <el-form-item>
              <el-input v-model="listQuery.productName" placeholder="产品名称" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productDrawingNo" placeholder="品名规格" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>


          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:10px">
          <el-button size="mini" @click="handleBatch" type="primary">设置检验方式</el-button>
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
          ref="dataTable" hasC @selection-change="currentChange" :checkSelectable="checkSelectable"
          :setColumnDisplayList="columnList" customKey="JNPFTableKey_468843">
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="code" label="产品编码" width="140" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row, true)">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="drawingNo" label="品名规格" min-width="200" sortable="custom" />

          <el-table-column prop="productCategoryName" label="产品分类" width="130" sortable="custom" />
          <el-table-column prop="mainUnit" label="单位" width="60" />
          <el-table-column prop="inspectionMethod" label="检验方式" width="110" sortable="custom" align="center">
            <template slot-scope="{ row }">
              <template v-if="row.inspectionMethod == 'exempt'">
                <el-tag type="success">免检</el-tag>
              </template>
              <template v-else-if="row.inspectionMethod == 'spot_check'">
                <el-tag type="warning">抽检</el-tag>
              </template>
              <template v-else-if="row.inspectionMethod == 'all'">
                <el-tag>全检</el-tag>
              </template>
              <template v-else>
                {{ row.inspectionMethod }}
              </template>
            </template>
          </el-table-column>

          <el-table-column prop="productSource" label="产品来源" width="110" sortable="custom">
            <template slot-scope="{ row }">
              <template v-if="row.productSource == 'produce'">
                自制
              </template>
              <template v-else-if="row.productSource == 'purchase'">
                采购
              </template>
              <template v-else-if="row.productSource == 'out'">
                外协
              </template>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建日期" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="100" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :busSetId="'CPBM'" />
    <finishedProductForm v-if="finishedProductFormVisible" ref="finishedProductForm" @refreshDataList="initData"
      @close="closeForm" :busSetId="'CPBM'" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />

    <InspectionSettingForm ref="InspectionSettingForm" v-if="batchVisible" @close="closeForm"
      :selectedData="selectedData" />
  </div>
</template>

<script>
import {
  getProductList,
  deleteProductData,
  getDynamicConditions,
  batchSetInspectionMethod
} from '@/api/basicData/materialFiles'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import Form from '@/views/masterDataManagement/productManagement/components/Form.vue'
import finishedProductForm from '@/views/masterDataManagement/productManagement/finished_product/Form.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import InspectionSettingForm from './InspectionSettingForm.vue'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: { Form, SuperQuery, InspectionSettingForm, finishedProductForm },
  mixins: [getProjectList],
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  data() {
    return {
      filterText: '',
      isProjectSwitch: '',
      tableDataFlag: false,
      leftFlag: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'productCategoryName',
          label: '产品分类',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },

        {
          prop: 'inspectionMethod',
          label: '单据状态',
          type: 'select',
          options: [
            { label: '免检', value: 'exempt' },
            { label: '抽检', value: 'spot_check' },
            { label: '全检', value: 'all' }
          ]
        },
        {
          prop: 'productSource',
          label: '产品来源',
          type: 'select',
          options: [
            { label: '自制', value: 'produce' },
            { label: '采购', value: 'purchase' },
            { label: '外协', value: 'out' }
          ]
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
      columnList: ['productSource', 'createByName'],
      title: '更多查询',
      background: true, //分页器背景颜色
      visible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      userRelationListVisible: false,
      listQuery: {
        code: '',
        name: '',
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
        drawingNo: '', // 图号
        productSource: '', // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: '', // 类型id
        productStatus: '', // 产品状态
        customerQueryFields: [],
        showExtra: true
      },
      productStatusList: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }], // 产品状态
      productSourceList: [
        { label: '自制', value: 'produce' },
        { label: '采购', value: 'purchase' },
        { label: '外协', value: 'out' }
      ], // 产品来源
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },

      total: 0,
      formVisible: false,
      finishedProductFormVisible: false,
      expands: true,
      refreshTree: true,
      customList: [], // 列表中显示的自定义属性
      searchList: [], // 作为搜索条件的自定义属性
      customerQueryFields: [], // 保存作为查询条件的自定义属性，防止reset时被清掉
      attributeLines: [],
      selectedData: [],

      batchBtnLoading: false,
      batchVisible: false,
      batchDataForm: {},
      inspectionMethodList: [
        { label: '免检', value: 'exempt' },
        { label: '抽检', value: 'spot_check' },
        { label: '全检', value: 'all' }
      ],
      batchDataFormRules: {
        inspectionMethod: [{ required: true, message: '请选择检验方式', trigger: 'change' }],
        spotCheckRatio: [
          { required: false, message: '请输入抽检比例', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [5, 2] }), trigger: 'blur' },
          {
            validator: this.formValidate({
              type: 'calc',
              params: [() => Number(this.batchDataForm.spotCheckRatio) <= 100, '抽检比例不能超过100%']
            }),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isDeputyUnitSwitch === '1') {
      this.superQueryJson.forEach(item => {
        if (item.prop === 'mainUnit') {
          item.label = '单位(主)'
        }
      })
      this.superQueryJson.splice(7, 0, {
        prop: 'deputyUnit',
        label: '单位(副)',
        type: 'input'
      })

    }
    if (this.isProductNameSwitch === '1') {
      this.superQueryJson.splice(1, 0, {
        prop: 'name',
        label: '产品名称',
        type: 'input'
      })
    }
    this.tableDataFlag = true

    if (localStorage.getItem('finishedFlag')) {
      let roleFlag = JSON.parse(localStorage.getItem('finishedFlag'))
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
    this.getcategoryTree()
    this.getDynamicConditions()
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 获取动态搜索条件
    getDynamicConditions() {
      getDynamicConditions({
        classAttribute: 'material',
        pageNum: 1,
        pageSize: -1,
        type: 1
      }).then((res) => {
        this.attributeLines = res.data
        res.data.forEach((item) => {
          let options = []
          if (item.attributeItemName) {
            let nameList = item.attributeItemName.split(',')
            let valList = item.attributeItemVal.split(',')
            nameList.forEach((item2, index2) => {
              options.push({ label: nameList[index2], value: valList[index2] })
            })
          }
          // 添加动态搜索元素（过滤重复attributeColumn的项）
          let propExists = this.searchList.some((item2) => item2.prop === item.attributeColumn)
          if (!propExists) {
            this.searchList.push({ prop: item.attributeColumn, label: item.name, type: item.type, value: '', options })
          }
          // 向列表请求参数添加自定义搜索条件
          this.customerQueryFields.push({ attributeColumn: item.attributeColumn, attributeValue: '' })
        })
        this.listQuery.customerQueryFields = JSON.parse(JSON.stringify(this.customerQueryFields))
      })
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
    // // 设置默认展开
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem('finishedFlag', expands)
      })
    },

    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.batchVisible = false
      this.formVisible = false
      this.finishedProductFormVisible = false
      if (isRefresh) {
        this.initData()
      }
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
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取指定树状列表
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = '' // 重置数据类型id筛选
      getcategoryTree({ classAttribute: '', type: 'material' })
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
      // 根据column获取type
      function getTypeByColumn(array, value) {
        for (let i = 0; i < array.length; i++) {
          let obj = array[i]
          if (obj.attributeColumn === value) {
            return obj.type
          }
        }
        return null
      }
      // 根据column和值获取键
      function getKeyByValueAndColumn(array, value, prop) {
        const obj = array.find((item) => item.prop === prop)
        if (obj) {
          const option = obj.options.find((po) => po.value === value)
          return option ? option.label : null
        }
        return null
      }
      // 自定义属性进行排序与排空
      function sortMethod(fields) {
        let newFields = fields.filter((item) => item.attributeValue !== '' && item.attributeValue !== '[]')
        newFields.forEach((item) => {
          const attributeValue = item.attributeValue
          const keyValuePairs = attributeValue.split(',').map((item) => item.split(':'))
          const sortedKeyValuePairs = keyValuePairs.sort((a, b) => a[1].charCodeAt() - b[1].charCodeAt())
          const sortedData = sortedKeyValuePairs.map((item) => item.join(':')).join(',')
          item.attributeValue = sortedData
        })
        return newFields
      }
      this.listLoading = true
      if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
        this.listQuery.startTime = this.listQuery.startAndEndTime[0] + ' 00:00:00'
        this.listQuery.endTime = this.listQuery.startAndEndTime[1] + ' 23:59:59'
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }

      let listQuery = JSON.parse(JSON.stringify(this.listQuery))
      listQuery.customerQueryFields.forEach((item) => {
        if (Array.isArray(item.attributeValue)) {
          item.attributeValue = JSON.stringify(item.attributeValue)
        }
        item.type = getTypeByColumn(this.attributeLines, item.attributeColumn) // 根据Column获取type

        if (item.type === 'select' && item.attributeValue) {
          let label = getKeyByValueAndColumn(this.searchList, item.attributeValue, item.attributeColumn)
          item.attributeValue = `${label}:${item.attributeValue}`
        } else if (item.type === 'multiple' && item.attributeValue) {
          let tempAttributeValue = ''
          let temp = JSON.parse(item.attributeValue)
          temp.forEach((valueItem) => {
            let label = getKeyByValueAndColumn(this.searchList, valueItem, item.attributeColumn)
            if (!!tempAttributeValue) tempAttributeValue += ','
            tempAttributeValue += `${label}:${valueItem}`
          })
          item.attributeValue = tempAttributeValue
        }
      })
      if (this.isProjectSwitch === '1') {
        listQuery.projectId = this.userInfo.projectId
      }
      listQuery.customerQueryFields = sortMethod(listQuery.customerQueryFields)
      getProductList(listQuery)
        .then((res) => {
          // this.customList = []
          // res.data.columnShowList.forEach((column) => {
          //   // 列表中显示
          //   let propExists = this.customList.some((item2) => item2.prop === column.attributeColumn)
          //   if (!propExists) {
          //     this.customList.push({ prop: column.attributeColumn, label: column.name })
          //   }
          // })
          this.tableData = res.data.records
          this.selectedData = []
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
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
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = {
        code: '',
        name: '',
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
        drawingNo: '', // 图号
        productSource: '', // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: '', // 类型id
        productStatus: '', // 产品状态
        customerQueryFields: JSON.parse(JSON.stringify(this.customerQueryFields))
      }
      this.filterText = ''
      // this.search()
      this.getcategoryTree()
    },
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.listQuery.productCategoryCode = data.code
      this.search()
    },
    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init()
      })
    },
    addOrUpdateHandle(id, parentId) {
      this.formVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.Form.init(id)
        })
      }
    },
    handleUserRelation(row, btnType) {
      if (row.classAttribute == 'finish_product') {
        this.finishedProductFormVisible = true
        this.$nextTick(() => {
          this.$refs.finishedProductForm.init(row.id, btnType)
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row.id, btnType)
        })
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteProductData(id).then((res) => {
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
    // 只保留label
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ''
      if (cellValue.includes(':')) {
        return cellValue.replace(/:(.*?)(,|$)/g, '$2')
      } else {
        return cellValue
      }
    },
    currentChange(data) {
      this.selectedData = data
    },
    // 批量操作
    async handleBatch(batchType) {
      if (!this.selectedData.length) return this.$message.error('请先选择批量处理的数据')
      this.batchDataForm = {}
      this.batchVisible = true
      this.$nextTick(() => this.$refs.InspectionSettingForm.init(id, btnType))
    },
    // 行是否可选
    checkSelectable(row) {
      return true
      return !row.inspectionMethod || row.inspectionMethod === 'spot_check' // 仅可选择检验方式抽选数据
    },
    // 关闭批量处理
    closeBatch() {
      this.batchVisible = false
    }
  }
}
</script>
<!-- <style src="@/assets/scss/index-list.scss" lang="scss" scoped /> -->