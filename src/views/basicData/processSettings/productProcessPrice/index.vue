<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.priceStatus" placeholder="计价类型" clearable style="width: 100%;">
                <el-option v-for="(item, index) in [
                  { label: '无单价', value: '0' },
                  { label: '有单价', value: '1' },
                  { label: '所有', value: '2' }
                ]" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <template v-for="item in searchList">
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
              <el-input v-model="listQuery.drawingNo" placeholder="品名规格" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-input v-model="listQuery.processName" placeholder="工序名称" clearable @keyup.enter.native="search()" />
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
            <el-button size="mini" type="primary" @click="handleBatch">批量设置价格</el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="importForm">导入</el-button>
            <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </div>

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
        <JNPF-table v-if="tableDataFlag" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          ref="dataTable" hasC @selection-change="currentChange" :setColumnDisplayList="columnList">
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="drawingNo" label="品名规格" min-width="180" sortable="custom" />
          <el-table-column prop="productsName" label="产品名称" min-width="180" v-if="isProductNameSwitch === '1'"
            sortable="custom" />
          <el-table-column prop="productsCode" label="产品编码" min-width="160" sortable="custom"></el-table-column>
          <el-table-column prop="processName" label="工序名称" min-width="180" sortable="custom" />
          <el-table-column prop="processCode" label="工序编码" min-width="160" sortable="custom"></el-table-column>

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
          <el-table-column prop="price" label="单价(元)" width="130"></el-table-column>
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
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 导入产品 -->
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <div style="margin-bottom: 10px;" v-if="isProjectSwitch === '1'">
        <el-select v-model="importProjectId" placeholder="请选择所属项目" style="width: 100%;" filterable
          :disabled="!userInfo.projectId ? false : userInfo.projectId === '1' ? false : true">
          <el-option v-for="item in projectIdDataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>

      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
        :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传.xls/.xlsx文件
          <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">
            下载模板
          </el-button>
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="saveSubmit()">
          提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBimProductProcessPrice, batchAddBimProductProcessPrice, uploadBimProductProcessPrice } from '@/api/bimProcess/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import getProjectList from '@/mixins/generator/getProjectList'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  components: { SuperQuery, ExportForm },
  mixins: [getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      uploadVisib: false,
      exportFormVisible: false,
      searchList: [
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 }
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
      columnList: ['productsCode', 'processCode'],
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {
        priceStatus: '2',
        drawingNo: '',
        processName: '',
        orderItems: [
          {
            asc: false,
            column: 'processName'
          }
        ],
        pageNum: 1,
        pageSize: 20
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
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getProjectList()
    this.tableDataFlag = true
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

    this.getcategoryTree()
  },
  methods: {
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

    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.listQuery,
          exportType: '1230',
          exportName: '产品工序价格信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },

    // 导入
    importForm() {
      // this.$refs.UploadProduct.$el.querySelector('input').click()
      if (this.userInfo.projectId !== '1') {
        this.importProjectId = this.userInfo.projectId
      } else {
        this.importProjectId = ''
      }
      this.uploadVisib = true
    },
    handleRemove(file, fileList) { },
    handlePreview(file) { },
    handleFileChange(file) {
      this.file = file.raw
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')

      a.setAttribute('href', location.origin + '/static/产品工序单价导入模板.xlsx')


      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      if (this.isProjectSwitch === '1') {
        formData.append('projectId', this.importProjectId)
      }
      //调用上传文件接口
      uploadBimProductProcessPrice(formData)
        .then((res) => {
          if (!res.data) {
            this.$message.success(`导入成功`)
            this.uploadVisib = false
            this.$refs['UploadProduct']
            this.initData()
          } else {
            this.uploadVisib = false
            this.handleMessage(res.data)
          }

          this.formLoading = false
          this.loadingText = ''
        })
        .catch((err) => {
          this.uploadVisib = false
          // this.$message.error(`导入数据超过最大限制：500`)
          this.$message.error(`导入失败`)
          this.formLoading = false
          this.loadingText = ''
        })

    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    saveSubmit() {
      if (this.isProjectSwitch === '1') {
        if (!this.importProjectId) return this.$message.error('请选择所属项目')
      }
      if (!this.file) return this.$message.error('请上传文件')
      this.UploadProduct(this.file)
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: 'error',
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h(
          'div',
          {
            style: 'padding-right:20px;display:flex;align-items:center;color:#f56c6c;'
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在产品工序单价导入相关错误！'),
            h(
              'el-button',
              {
                props: {
                  type: 'text',
                  size: 'mini',
                  icon: 'el-icon-download'
                },
                on: {
                  click: () => {
                    this.downNoProduct(data)
                  }
                },
                style: {
                  border: 'none',
                  textAlign: 'center',
                  // width:"20%",
                  margin: '0 5px 0 5px '
                }
              },
              '下载导入错误数据'
            )
          ]
        )
      })
      return
    },
    sortChange({ prop, order }) {
      let newProp
      if (['productsName',].includes(prop)) {
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
      getBimProductProcessPrice(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.tableData.forEach((item) => {
            if (item.pricingType === 'by_time') {
              item.price = item.timePrice
            } else if (item.pricingType === 'by_piece') {
              item.price = item.unitPrice
            }
          })
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
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 }
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
        this.selectedData.forEach((item) => {
          if (item.pricingType === 'by_time') {
            item.timePrice = this.dataForm.timePrice
          } else if (item.pricingType === 'by_piece') {
            item.unitPrice = this.dataForm.unitPrice
          }
        })

        batchAddBimProductProcessPrice(this.selectedData)
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
