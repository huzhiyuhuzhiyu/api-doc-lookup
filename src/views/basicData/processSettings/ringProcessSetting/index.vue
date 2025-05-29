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
              <el-select v-model="listQuery.routingFlag" placeholder="请选择" @change="routingFlagChange">
                <el-option v-for="item in routingFlagOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productName" placeholder="产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productCode" placeholder="产品编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model.trim="listQuery.productDrawingNo" placeholder="品名规格" clearable
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
      <div class="JNPF-common-layout-main JNPF-flex-main" :element-loading-text="loadingText" v-loading="listLoading">
        <div class="JNPF-common-head">
          <div>
            <el-button type="primary" size="mini" @click="handleBatch">批量设置工艺</el-button>
            <el-button type="danger" size="mini" @click="handleBatchDelete" v-if="listQuery.routingFlag">
              批量清空工艺
            </el-button>
            <el-button type="primary" size="mini" icon="el-icon-upload2" @click="importForm">导入</el-button>
            <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
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

        <JNPF-table v-if="tableDataFlag" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList"
          border @sort-change="sortChange" custom-column :setColumnDisplayList="columnList" hasC
          @selection-change="currentChange" customKey="JNPFTableKey_427702">
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="productDrawingNo" label="品名规格" min-width="240" sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom" />
          <el-table-column prop="name" label="工艺路线名称" min-width="180" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
          <el-table-column prop="createByName" label="创建人" width="100" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="handleUserRelation(scope.row, 'edit')" :hasDel="false"
                :editDisabled="!scope.row.routingFlag">
                <el-button type="text" :disabled="!scope.row.routingFlag"
                  @click="handleUserRelation(scope.row, 'look')">
                  查看详情
                </el-button>
                <el-button type="text" :disabled="!scope.row.routingFlag"
                  @click="PrintFun(scope.row, 'look')">
                  打印
                </el-button>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>

    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
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
        <el-button type="primary" :loading="btnLoading" @click="saveSubmit()">
          提交
        </el-button>
      </span>
    </el-dialog>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <SetForm v-if="setFormVisible" ref="setForm" @refresh="refresh" @close="closeForm" />
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
  </div>
</template>

<script>
import {

  batchProductionResource,

  importRoutingModel,

} from '@/api/basicData/productionResourceSetting'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { mapState } from 'vuex'
import SuperQuery from '@/components/SuperQuery/index.vue'
import JNPFForm from '../assemblyProcessSetting/Form.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getProcessList, detailProcess, delProcess } from '@/api/basicData/processSettingss'
import getProjectList from '@/mixins/generator/getProjectList'
import SetForm from '../assemblyProcessSetting/setForm.vue'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo } from '@/api/system/printDev'
export default {
  name: 'ringProcessSetting',
  components: { ExportForm, SuperQuery, JNPFForm, SetForm, PrintBrowse, PrintDialog, },
  mixins: [getProjectList],
  data() {
    return {
      printVisible: false,
      printBrowseVisible:false,
      isProjectSwitch: '',
      tableDataFlag: false,
      routingLineList: [],
      analyseDialogWidth: '',
      btnLoading: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },

        {
          prop: 'productName',
          label: '产品分类',
          type: 'input'
        },
        {
          prop: 'routingName',
          label: '工艺路线名称',
          type: 'input'
        },
        {
          prop: 'routingCode',
          label: '工艺路线编码',
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
      columnList: ['productCode', 'routingCode', 'createTime', 'createByName'],
      filterText: '',
      leftFlag: false,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      selectedData: [],
      routingIdOptions: [],
      dataForm: {
        routingId: '',
        remark: ''
      },
      analyseDialog: false,
      exportFormVisible: false,
      treeData: [],
      customerRecognitionTime: [],
      title: '更多查询',
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],
      formVisible: false,
      setFormVisible: false,
      listLoading: false,
      routingFlagOptions: [
        {
          value: 0,
          label: '未设置工艺'
        },
        {
          value: 1,
          label: '已设置工艺'
        }
      ],
      listQuery: {
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        classAttribute: 'semi_finished',
        routeType: 'productProcess',
        productCode: '',
        productName: '',
        productDrawingNo: '',
        routingFlag: 0,
        routingCode: '',
        routingName: '',
        pageNum: 1,
        pageSize: 20,
        endTime: '',
        startTime: ''
      },
      total: 0,
      formVisible: false,
      loadingText: '',
      uploadVisib: false,
      file: ''
    }
  },
  computed: {
    ...mapState('user', ['token'])
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  async created() {
    if (localStorage.getItem('ringProcessSettingFlag')) {
      let roleFlag = JSON.parse(localStorage.getItem('ringProcessSettingFlag'))
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
    await this.getTechnicalSwitch('produce', 'technical_requirement')
    await this.getCheckingSwitch('produce', 'checking_information')
    if (this.isTechnicalSwitch === '1' || this.isCheckingSwitch === '1') {
      this.analyseDialogWidth = '60%'
    } else {
      this.analyseDialogWidth = '30%'
    }
    this.tableDataFlag = true
    this.getcategoryTree()
    this.initData()
  },
  methods: {
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.printBrowseVisible = true
          this.printVisible = false

          this.printVisible = false
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    // 打印
    PrintFun(row) {
      console.log(this.arr, row);
      this.enCode = 'p044' // 打印的编码  
      this.formId = row.id
      this.fullName = '工艺' // 打印名称
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    closePrint() {
      this.printVisible = false
    },
    async getProcessList() {
      let obj = {
        approvalStatus: 'ok',
        routeType: 'processLibrary',
        pageNum: 1,
        pageSize: -1
      }
      console.log(this.isProjectSwitch, 'is')

      if (this.isProjectSwitch === '1') {
        obj.projectId = this.projectId
      }
      console.log(obj, 'obb')
      const res = await getProcessList(obj)
      console.log(res, 'res98877')
      this.routingIdOptions = res.data.records

    },
    handleBatchDelete() {
      if (!this.selectedData.length) return this.$message.error('请至少选择一条工艺数据')
      if (this.selectedData.some((item) => !item.routingFlag)) return this.$message.error('所选数据没有工艺路线')
      let idList = this.selectedData.map((item) => item.id)
      delProcess(idList).then((res) => {
        this.$message.success('清空成功')
        this.initData()
      })
    },
    async getTechnicalSwitch(code, type) {
      try {
        this.isTechnicalSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getCheckingSwitch(code, type) {
      try {
        this.isCheckingSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    routingChange(val) {
      this.dataForm.routingId = val
      if (this.dataForm.routingId) {
        detailProcess(val).then((res) => {
          console.log(res, 'kkk')
          this.routingLineList = res.data.routingLineList
          this.routingLineList.sort((a, b) => a.sort - b.sort);
        })
      } else {
        this.routingLineList = []
      }
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
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
        localStorage.setItem('ringProcessSettingFlag', expands)
      })
    },
    // 获取指定树状列表
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = '' // 重置数据类型id筛选
      getcategoryTree({ classAttribute: 'semi_finished' })
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
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.listQuery.productCategoryCode = data.code
      this.search()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tableForm.columnList.filter((item) => !!item.label && !!item.prop)
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
          exportType: '1042',
          exportName: '套圈工艺设置信息',
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
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/产品工艺导入模板.xlsx')
      a.click()
    },
    // 导入
    importForm() {
      // this.$refs.UploadProduct.$el.querySelector('input').click()
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

      a.setAttribute('href', location.origin + '/static/产品工艺导入模板.xlsx')

      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      //调用上传文件接口

      importRoutingModel(formData)
        .then((res) => {
          if (!res.data) {
            this.$message.success(`导入成功`)
            this.uploadVisib = false
            this.btnLoading = false
            this.$refs['UploadProduct']
            this.initData()
          } else {
            this.uploadVisib = false
            this.btnLoading = false
            this.handleMessage(res.data)
          }

          this.formLoading = false
          this.loadingText = ''
          this.$refs['uploadRef'].clearFiles()
        })
        .catch((err) => {
          console.log(err, 'err')
          this.uploadVisib = false
          console.log(err, 'err')
          this.formLoading = false
          this.btnLoading = false
          this.loadingText = ''
          this.$refs['uploadRef'].clearFiles()
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
      if (!this.file) return this.$message.error('请上传文件')
      this.btnLoading = true
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
            h('p', { style: 'font-size:14px;' }, '导入成功，存在套圈工艺设置相关信息错误！'),
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
    currentChange(data) {
      this.selectedData = data
    },
    async handleBatch() {
      if (!this.selectedData.length) return this.$message.error('请至少选择一条工艺数据')
      console.log(this.selectedData, 'selectedData')
      let flag = this.hasDifferentProjectId(this.selectedData)
      if (flag) return this.$message.error('只能选择相同所属项目的工艺数据')
      this.projectId = this.selectedData[0].projectId
      await this.getProcessList()
      this.dataForm.routingId = ''
      this.routingLineList = []
      // this.analyseDialog = true
      this.setFormVisible = true

      this.$nextTick(() => {
        this.$refs.setForm.init(this.selectedData, '', JSON.stringify(this.routingIdOptions))
      })
    },
    hasDifferentProjectId(arr) {
      const codes = new Set()

      for (const item of arr) {
        codes.add(item.projectId)
      }

      return codes.size > 1 // 如果有多个不同的代码，则返回 true
    },

    sortChange({ prop, order }) {
      let newProp
      if (prop === 'createByName') {
        newProp = 'create_by'
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      console.log(newProp)
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.setFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },

    initData() {
      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      getProcessList(this.listQuery)
        .then((res) => {
          console.log(res, '生产资源列表')
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    routingFlagChange(val) {
      this.listQuery.routingFlag = val
      this.initData()
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
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.$refs.treeBox.setCurrentKey(null);
      this.listQuery = {
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        classAttribute: 'semi_finished',
        routeType: 'productProcess',
        routingFlag: 0,
        productCode: '',
        productName: '',
        productDrawingNo: '',
        routingCode: '',
        routingName: '',
        pageNum: 1,
        pageSize: 20,
        endTime: '',
        startTime: ''
      }
      this.customerRecognitionTime = []
      this.filterText = ''
      this.search()
    },
    addSupplier(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(id, type)
        })
      }
    },
    handleUserRelation(row, type) {
      // if (!row.routingId) return this.$message.error('请先设置工艺');
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(row.id, type)
      })
    }
  }
}
</script>
