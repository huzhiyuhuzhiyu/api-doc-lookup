<template>
  <div class="JNPF-common-layout" :element-loading-text="loadingText">
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
            </el-dropdown-menu>
          </el-dropdown>
        </span>
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
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入品名规格" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable
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
          <!-- <el-button
            style="float: right;margin-right: 20px;"
            size="mini"
            type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting"
            @click="moreQueries()"
          >
            更多查询
          </el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <div>
            <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成采购订单</el-button>
            <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
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
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" hasC @sort-change="sortChange"
          custom-column ref="dataTable" :setColumnDisplayList="columnList" @selection-change="handeleProductInfoData">
          <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
          <el-table-column prop="name" label="产品名称" min-width="140" sortable="custom" />
          <el-table-column prop="code" label="产品编码" min-width="100"></el-table-column>
          <el-table-column prop="productCategoryName" label="产品分类" width="100" sortable="custom" />
          <el-table-column prop="mainUnit" label="单位" min-width="120" />
          <el-table-column prop="safeInventory" label="安全库存" min-width="100" />
          <el-table-column prop="availableQuantity" label="可用库存" min-width="130" sortable="custom" />
          <!-- <el-table-column prop="inventoryQuantity" label="库存数量(主)" min-width="130" sortable="custom" />
          <el-table-column prop="occupancyQuantity" label="占用数量(主)" min-width="130" sortable="custom" />
          <el-table-column prop="deputyUnit" label="副单位" min-width="130" />
          <el-table-column prop="deputyAvailableQuantity" label="可用库存(副)" min-width="130" sortable="custom" />
          <el-table-column prop="deputyInventoryQuantity" label="库存数量(副)" min-width="130" sortable="custom" />
          <el-table-column prop="deputyOccupancyQuantity" label="占用数量(副)" min-width="130" sortable="custom" /> -->
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <aiForm v-if="aiformVisible" ref="aiForm" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.code" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品名规格">
              <el-input v-model="listQuery.drawingNo" placeholder="请输入品名规格" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.name" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品来源">
              <el-select v-model="listQuery.productSource" placeholder="请选择产品来源" clearable style="width: 100%;">
                <el-option v-for="item in productSourceList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品状态">
              <el-select v-model="listQuery.productStatus" placeholder="请选择产品状态" clearable style="width: 100%;">
                <el-option v-for="item in productStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 导入产品 -->
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
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
        <el-button type="primary" @click="saveSubmit()">
          提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getProductList, deleteProduct, uploadCpProductData } from '@/api/masterDataManagement/productManage'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import Form from './Form'
import { mapState } from 'vuex'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  components: { Form, ExportForm, SuperQuery },
  name: 'safetyInventoryWarning',
  data() {
    return {
      columnList: [
        // 'code',
        'productCategoryName',
        // 'deputyUnit',
        // 'deputyAvailableQuantity',
        // 'deputyInventoryQuantity',
        // 'deputyOccupancyQuantity'
      ],
      exportFormVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      visible: false,
      aiformVisible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      loadingText: false,
      leftFlag: false,
      selectData: [], // 选中的数据 带到form页
      initListQuery: {
        code: '',
        name: '',
        safeInventoryWarnFlag: 1,
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
        productSource: 'purchase', // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: '', // 类型id
        productStatus: '', // 产品状态
        customerQueryFields: [],
        createTimeArr: [],
        classAttribute: ''
      },
      listQuery: {},
      productStatusList: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }], // 产品状态
      productSourceList: [
        { label: '自制', value: 'produce' },
        { label: '采购', value: 'purchase' },
        { label: '外协', value: 'out' }
      ], // 产品来源
      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
   
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
          prop: 'name',
          label: '产品名称',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '主单位',
          type: 'select',
          options: []
        },
        {
          prop: 'safeInventory',
          label: '安全库存',
          type: 'input'
        },
        {
          prop: 'availableQuantity',
          label: '可用库存(主)',
          type: 'input'
        },
        {
          prop: 'inventoryQuantity',
          label: '库存数量(主)',
          type: 'input'
        },
        {
          prop: 'occupancyQuantity',
          label: '占用数量(主)',
          type: 'input'
        },
        {
          prop: 'deputyUnit',
          label: '副单位',
          type: 'select',
          options: []
        },
        {
          prop: 'deputyAvailableQuantity',
          label: '可用库存(副)',
          type: 'input'
        },
        {
          prop: 'deputyInventoryQuantity',
          label: '库存数量(副)',
          type: 'input'
        },
        {
          prop: 'deputyOccupancyQuantity',
          label: '占用数量(副)',
          type: 'input'
        }
      ],
      uploadVisib: false
    }
  },
  created() {
    this.getcategoryTree()
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    console.log(this.listQuery,'qiery')
    this.initData()
  },
  computed: {
    ...mapState('user', ['token'])
  },
  methods: {
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      this.selectData = val
    },

    changeLeft() {
      this.leftFlag = !this.leftFlag
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
          exportType: '1200',
          exportName: '安全库存预警信息',
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
      getcategoryTree({ classAttribute: '' })
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
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
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

    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      // this.listQuery.pageNum = 1
      this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
      getProductList(this.listQuery)
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
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },

    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle() {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择你要生成的采购订单',
          type: 'error',
          duration: 1500
        })
      } else {
        let msg = true
        let tempList = JSON.parse(JSON.stringify(this.selectData))
        let hasItemList = []
        for (let i = 0; i < this.selectData.length; i++) {
          let item = this.selectData[i]

          if (item.orderedQuantity != null) {
            if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
              hasItemList.push(item.productName)
              if (hasItemList.length) {
                this.$message.error(`已下单数量已大于或等于计划需求数的产品：${hasItemList.join('、')}`)
                msg = false
              } else {
                msg = true
              }
            }
          }
        }
        if (msg) {
          this.selectData.forEach((item, index) => {
            item.purchaseQuantity = item.planDemandQuantity - item.orderedQuantity * 1
            if (item.calculationDirection === 'multiplication') {
              this.$set(
                this.selectData[index],
                'purchaseQuantity2',
                this.jnpf.numberFormat(item.purchaseQuantity * item.ratio)
              )
            } else {
              this.$set(
                this.selectData[index],
                'purchaseQuantity2',
                this.jnpf.numberFormat(item.purchaseQuantity / item.ratio)
              )
            }
          })
          // var maxDate = null; // 最大日期初始值设为null
          // // 遍历列表中的数据 找到最大交期
          // for (var i = 0; i < this.selectData.length; i++) {
          //   var currentDate = new Date(this.selectData[i].deliveryDate);
          //   if (maxDate === null || currentDate > maxDate) {
          //     maxDate = currentDate;
          //   }
          // }
          // let demandDelivery = null
          // demandDelivery = maxDate.toISOString().split('T')[0];
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.Form.init(this.selectData)
          })
        }
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteProduct(id).then((res) => {
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
    // 导入
    importForm() {
      if (!this.listQuery.productCategoryId) {
        this.$message.warning('请先选择产品分类')
      } else {
        // this.$refs.UploadProduct.$el.querySelector('input').click()
        this.uploadVisib = true
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleFileChange(file) {
      console.log('所选文件:', file)
      this.file = file.raw
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/成品导入模板.xlsx')
      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      console.log(data.file, 'filr')
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      formData.append('productCategoryId', this.listQuery.productCategoryId)
      formData.append('classAttribute', this.listQuery.classAttribute)
      //调用上传文件接口
      uploadCpProductData(formData)
        .then((res) => {
          if (!res.data) {
            this.$message.success(`导入成功`)
          } else {
            this.handleMessage(res.data)
          }

          this.formLoading = false
          this.loadingText = ''
        })
        .catch((err) => {
          this.$message.error(`导入数据超过最大限制：500`)
          this.formLoading = false
          this.loadingText = ''
        })
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    saveSubmit() {
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
            h('p', { style: 'font-size:14px;' }, '导入成功，存在成品产品档案错误！'),
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
    // 智能新建
    aiAdd() {
      this.aiformVisible = true
      this.$nextTick(() => {
        this.$refs.aiForm.init()
      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {

      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa007",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };

      getbimProductAttributesList(obj1).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'sealingCoverTyping');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa006",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };


      getbimProductAttributesList(obj2).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'accuracyLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj3).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'vibrationLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa002",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj4).then(res => {



        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oil');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa003",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj5).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oilQuantity');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa001",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };

      getbimProductAttributesList(obj6).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'clearance');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa015",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj7).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'packagingMethod');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })


      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log("税率", this.taxRateList);
      })

    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
