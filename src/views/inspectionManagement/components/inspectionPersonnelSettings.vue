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
          <template v-for="item in tableItems">
            <el-table-column v-if="item.prop == 'effectiveDate'" :prop="item.prop" :key="item.prop" :label="item.label"
              :fixed="item.fixed || false" :min-width="item.minWidth || 130" align="center" :sortable="item.sortable"
              :formatter="jnpf.tableDateFormatStrDay"></el-table-column>
            <el-table-column v-else-if="item.prop == 'pricingType'" :prop="item.prop" :key="item.prop"
              :label="item.label" :fixed="item.fixed || false" :min-width="item.minWidth || 130"
              :sortable="item.sortable">
              <template slot-scope="{ row }">
                <template v-if="row.pricingType == 'by_time'">
                  计时
                </template>
                <template v-else-if="row.pricingType == 'by_piece'">
                  计件
                </template>
                <template v-else-if="row.pricingType == 'no_piece'">
                  不计价
                </template>
              </template>
            </el-table-column>
            <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label" :fixed="item.fixed || false"
              :min-width="item.minWidth || 130" :sortable="item.sortable" />
          </template>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="!scope.row.effectiveDate"
                @click="addOrUpdateHandle(scope.row, 'look')">
                查看价格
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <!-- 批量设置价格 -->
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
              <el-form-item prop="staffingId" label="人员">
                <el-select v-model="dataForm.staffingId" @focus="roleChange" placeholder="请选择角色" clearable
                  style="width: 100%;">
                  <el-option v-for="(item, index) in personData" :key="index" :label="item.realName"
                    :value="item.id"></el-option>
                </el-select>
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

    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <!-- <div style="margin-bottom: 10px;" v-if="isProjectSwitch === '1'">
        <el-select v-model="importProjectId" placeholder="请选择所属项目" style="width: 100%;" filterable
          :disabled="!userInfo.projectId ? false : userInfo.projectId === '1' ? false : true">
          <el-option v-for="item in projectIdDataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div> -->

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
    <depForm :priceType="priceType" :listMethod="listMethod" :delMethod="delMethod" :tableItems="detailTableItems"
      :superQueryJson="superQueryJson" :columnList="columnList" v-if="depVisibled" ref="depForm" @close="closeForms" />
  </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import getProjectList from '@/mixins/generator/getProjectList'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getRoleList } from '@/api/permission/role'
import { getUsersByUserCondition } from '@/api/permission/user'
export default {
  components: { SuperQuery, ExportForm },
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
    /* 上传数据请求方法 */
    uploadMethod: {
      required: true
    },
    /* 删除数据请求方法 */
    delMethod: {
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
        staffingId: '',
        effectiveDate: '',
        timePrice: '',
        unitPrice: ''
      },
      dataFormRules: {
        roleIds: [{ required: true, message: '角色不能为空', trigger: 'change' }],

        effectiveDate: [{ required: true, message: '生效日期不能为空', trigger: 'change' }]
      },
      selectedData: [],
      basicQuery: {},
      superQuery: {},
      detailTableItems: []
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
    // 判断是产品类型
    if (this.priceType === 'process') {
      this.priceTypeName = '工序'
      this.processFlag = true
    } else if (this.priceType === 'inspection') {
      this.priceTypeName = '工序质量'
      this.inspectionFlag = true
      this.dataForm.pricingType = 'by_piece'
      this.dataFormRules.unitPrice = [
        { validator: this.formValidate({ type: 'decimal', params: [10, 4, '', (errMsg) => { }] }), trigger: 'blur' },
        {
          validator: this.formValidate('noZero', '', (errMsg) => {
            this.$message.error('人工检验价格不能为0')
          }),
          trigger: 'blur'
        },
        { required: true, message: '人工检验价格不能为空', trigger: 'blur' }
      ]
    } else if (this.priceType === 'packaging') {
      this.priceTypeName = '包装'
      this.processFlag = false
    } else if (this.priceType === 'vibrate') {
      this.priceTypeName = '振动'
      this.processFlag = false
    }
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

    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      if (this.processFlag) {
        columnList = columnList.filter((item) => item.prop !== 'price')
        columnList = [...columnList, { label: '正品单价', prop: 'unitPrice' }, { label: '计时单价', prop: 'timePrice' }]
      }
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
          exportType: this.processFlag ? '1231' : '1230',
          exportName: `产品${this.priceTypeName}价格信息`,
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
      // if (this.userInfo.projectId !== '1') {
      //   this.importProjectId = this.userInfo.projectId
      // } else {
      //   this.importProjectId = ''
      // }
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

      a.setAttribute('href', location.origin + `/static/产品${this.priceTypeName}单价导入模板.xlsx`)

      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      // if (this.isProjectSwitch === '1') {
      //   formData.append('projectId', this.importProjectId)
      // }
      if (this.processFlag) {
        formData.append('priceType', this.priceType)
      } else {
        formData.append('attributeType', this.priceType)
      }
      //调用上传文件接口
      this.uploadMethod(formData)
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
      // if (this.isProjectSwitch === '1') {
      //   if (!this.importProjectId) return this.$message.error('请选择所属项目')
      // }
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
        let arr = this.selectedData.map(item=>{
          return item.id
        })
        let obj = {
          lineIdList: arr,
          staffingId:this.dataForm.staffingId
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
      let query = {
        pagination: {
          currentPage: 1,
          keyword: '',
          pageSize: -1,
          projectId: 0,
          sidx: '',
          sort: ''
        },
        roleIds: this.dataForm.roleIds
      }
      getUsersByUserCondition(query)
        .then((res) => {
          if (res.data.list.length) {
            this.personData = res.data.list
          } else {

          }
        })
        .catch(() => { })
    },
    addOrUpdateHandle(row, type) {
      this.depVisibled = true
      let listDetailQuery = { ...this.listQuery }
      delete listDetailQuery.effectFlag
      listDetailQuery.productsId = row.productsId
      listDetailQuery.processId = row.processId
      listDetailQuery.pricingFlag = ''
      listDetailQuery.orderItems = [
        {
          asc: true,
          column: 'effective_date'
        }
      ]
      console.log(this.tableItems, 'this.tableItems')
      this.detailTableItems = []
      this.detailTableItems = [...this.tableItems]
      console.log(this.detailTableItems, 'deee')
      let index = this.detailTableItems.findIndex((obj) => obj.prop === 'effectiveDate')
      this.detailTableItems.splice(index + 1, 0, { prop: 'expiringDate', label: '失效日期', minWidth: '160' })
      this.$nextTick(() => {
        this.$refs.depForm.init(JSON.stringify(listDetailQuery), type)
      })
    },
    // 关闭 收款新建、编辑页面
    closeForms(isRefresh) {
      this.collectionVisibled = false
      this.makeVisibled = false
      this.depVisibled = false
      if (isRefresh) {
        this.initData()
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
