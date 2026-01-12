<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <template v-for="item in lastSearchList">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="search('basic')" />

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

                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                      {{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
              <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle('', 'add')">
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click="importProductFun">导入</el-button>
                  <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
                    icon="el-icon-download" @click="exportForm">
                    导出
                  </el-button>
                </topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top" v-if="true">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="lastSuperQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnList()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-if="tableDataFlag" highlight-current-row :fixedNO="true" ref="tableForm"
                :data="tableDataList" @sort-change="sortChange" custom-column :setColumnDisplayList="lastColumnList" customKey="JNPFTableKey_995482">
                <el-table-column prop="partnerName" label="供应商名称" min-width="160" sortable="custom" />
                <el-table-column prop="partnerCode" label="供应商编码" min-width="160" sortable="custom" />
                <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"
                  v-if="isProjectSwitch === '1'"></el-table-column>
                <el-table-column prop="productName" label="产品名称" width="120"
                  v-if="isProductNameSwitch === '1'"></el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" min-width="160" />
                <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
                <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />

                <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom" />
                <el-table-column prop="price" label="协议价(含税)" width="140" sortable="custom" />
                <el-table-column prop="excludingTaxPrice" label="协议价(不含税)" width="160" sortable="custom" />
                <el-table-column prop="taxRate" label="税率" width="80" sortable="custom">
                  <template slot-scope="scope">
                    {{ scope.row.taxRate }}%
                  </template>
                </el-table-column>


                <AttributeColumns :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'purchase'" />
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                  <el-table-column label="操作" width="180" fixed="right">
                      <template slot-scope="scope">
                          <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                     @click="handleDel(scope.row.id)">删除</el-button>
                      </template>
                  </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="lastListQuery.pageNum" :background="background"
                :limit.sync="lastListQuery.pageSize" @pagination="initData" />
            </div>
          </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="lastSuperQueryVisible" ref="SuperQuery" :columnOptions="lastSuperQueryJson"
      @superQuery="lastSuperQuerySearch" @close="lastSuperQueryVisible = false" />
    <SuperQuery :show="historySuperQueryVisible" ref="SuperQuery" :columnOptions="historySuperQueryJson"
      @superQuery="historySuperQuerySearch" @close="historySuperQueryVisible = false" />
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
import {
    getBimVehicleTypeData,
    deleteBimVehicleType,
    getPartnerOrProductData,
    uploadPartnerOrProductData, delPartnerOrProductData
} from '@/api/basicData/index'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { buyFixedPointPricingDetailList } from '@/api/purchasingManagement/purchaseInquirySheet'
import JNPFForm from './Form'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'supplierProduct',
  components: { JNPFForm, ExportForm, SuperQuery },
  mixins: [getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      uploadVisib: false,
      basicQuery: {},
      superQuery: {},
      lastSearchList: [
        { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 }
      ],
      historySearchList: [
        {
          field: 'cooperativePartnerName',
          fieldValue: '',
          label: '供应商名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 }
      ],
      exportFormVisible: false,
      depFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],

      listLoading: false,
      lastListQuery: {
        partnerType: 'supplier',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_Time'
          }
        ],
        createByName: '',
        customerProductDrawingNo: '',
        customerProductNo: '',
        drawingNo: '',
        endTime: '',
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        partnerCode: '',
        partnerId: null,
        partnerName: '',
        productCode: '',
        productName: '',
        productStatus: '',
        startEndDate: '',
        startStartDate: '',
        startTime: '',
        stopEndDate: '',
        stopStartDate: '',
        historyFlag: false,
        priceDateArr: [],
        priceDateArr2: [],
        startAndEndTime: []
      },
      historyListQuery: {
        classAttribute: '',
        approvalStatus: 'ok',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        approvalStatus: '', // 审批状态 审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: '', //	供应商编码
        cooperativePartnerId: '', // 供应商id
        cooperativePartnerName: '', // 	供应商名称

        documentStatus: '', // 单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
        startAndEndTime: '',
        listPriceFlag: '', // 是否设置牌价:0否1是
        orderNo: '', // 单号
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        submitEndTime: '', //提交时间-结束
        submitStartTime: ''
        // startAndEndTime: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上个月',
            onClick(picker) {
              const end = new Date(moment(new Date().getTime()).format('YYYY-MM-01 00:00:00'))
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      total: 0,
      formVisible: false,
      lastColumnList: [
        'partnerCode',
        'productCode',
        'sealingCoverTyping',
        'accuracyLevel',
        'vibrationLevel',
        'oil',
        'oilQuantity',
        'clearance',
        'packagingMethod',
        'specialRequire',
        'createTime'
      ],
      lastSuperQueryVisible: false,
      lastSuperQueryJson: [
        {
          prop: 'cooperativePartnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: '供应商编码',
          type: 'input'
        },

        {
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'productsCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'select',
          options: []
        },


        {
          prop: 'standardValue',
          label: '规值',
          type: 'select',
          options: []
        },
        {
          prop: 'sealingCoverTyping',
          label: this.$store.getters.sealingCoverTyping,
          type: 'select',
          options: []
        },
        {
          prop: 'accuracyLevel',
          label: this.$store.getters.accuracyLevel,
          type: 'select',
          options: []
        },
        {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: []
        },
        {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: []
        },
        {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: []
        },
        {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: []
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: []
        },
        {
          prop: 'specialRequire',
          label: this.$store.getters.specialRequire,
          type: 'select',
          options: []
        },
        {
          prop: 'colour',
          label: this.$store.getters.colour,
          type: 'select',
          options: []
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
      ],

    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isProductNameSwitch === '1') {
      this.lastSearchList.unshift({
        field: 'productName',
        fieldValue: '',
        label: '产品名称',
        symbol: 'like',
        searchType: 1,
        width: 120
      })
      this.historySearchList.unshift({
        field: 'productName',
        fieldValue: '',
        label: '产品名称',
        symbol: 'like',
        searchType: 1,
        width: 120
      })
    }
    this.tableDataFlag = true

    // if (this.activeName == 'latestprice') {
    //   this.superForm = this.lastListQuery
    // } else {
    //   this.superForm = this.historyListQuery
    // }

    this.initData()
  },
  watch: {

  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    columnList() {
      this.$refs.tableForm.showDrawer()

    },
    lastSuperQuerySearch(query) {
      this.superQuery = query
      this.lastSuperQueryVisible = false
      this.search('super')
    },

    // 导入
    importProductFun() {
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

      a.setAttribute('href', location.origin + '/static/供应商价格导入模板.xlsx')

      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      // formData.append('productCategoryId', this.listQuery.productCategoryId)
      // formData.append('classAttribute', this.listQuery.classAttribute)
      //调用上传文件接口

      uploadPartnerOrProductData(formData)
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
            h('p', { style: 'font-size:14px;' }, '导入成功，存在供应商产品相关错误！'),
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
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList
      columnList = this.$refs.tableForm.columnList.filter((item) => !!item.label && !!item.prop)

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
        console.log(includeFieldMap)
        let name = ''
          name = '最新价格'
          let _data = {
            ...this.superForm,
            exportType: '1009',
            exportName: '供应商产品' + '-' + name,
            includeFieldMap,
            pageSize: data.dataType == 0 ? this.superForm.pageSize : -1
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

    sortChange({ prop, order }) {
      if (prop === 'createTime') {
        prop = 'create_Time'
      }
      if (prop === 'dateOrderStart') {
        prop = 'date_Order_Start'
      }
      if (prop === 'dateOrderStop') {
        prop = 'date_Order_Stop'
      }
      if (prop === 'customerProductDrawingNo') {
        prop = 'customer_Product_Drawing_No'
      }
      if (prop === 'productCategoryName') {
        prop = 'product_category_name'
      }
      this.lastListQuery.orderItems[0].asc = order !== 'descending'
      this.lastListQuery.orderItems[0].column = order === null ? '' : prop
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },

    initData() {
      this.listLoading = true
      console.log(this.superForm, 'this.superForm')
        this.superForm = this.lastListQuery
        getPartnerOrProductData(this.superForm)
          .then((res) => {
            console.log(res, '供应商产品列表')
            this.tableDataList = res.data.records
            this.total = res.data.total
            this.listLoading = false
            this.visible = false
          })
          .catch(() => {
            this.listLoading = false
          })

    },
    search(type) {
      Object.keys(this.lastListQuery).forEach((key) => {
        let item = this.lastListQuery[key]
        this.lastListQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.lastListQuery.pageNum = 1
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
        this.searchList = this.lastSearchList

      console.log(this.searchList, 'this.searchList')
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
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.lastListQuery.priceDateArr2 = []
      this.lastListQuery.priceDateArr = []
      this.lastListQuery.startAndEndTime = []
      this.lastListQuery = {
        partnerType: 'supplier',
        partnerId: null,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_Time'
          }
        ],
        historyFlag: false,
        code: '',
        name: ''
      }

      this.lastSearchList = [
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 }
      ]

      if (this.isProductNameSwitch === '1') {
        this.lastSearchList.unshift({
          field: 'productName',
          fieldValue: '',
          label: '产品名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        })

      }
      this.search()
    },
    addSupplier(type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init('', type)
      })
    },
    addOrUpdateHandle(id, type) {
      console.log(this.superForm.classAttribute, 'this.listQuery.classAttribute')
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type, false, 'other')
      })
    },
      handleDel(id) {
          this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
              type: 'warning'
          }).then(() => {
              delPartnerOrProductData(id).then(res => {
                  this.initData()
                  this.$message({
                      type: 'success',
                      message: "删除成功",
                      duration: 1500,
                  })
              })
          }).catch(() => { })
      },
    handleUserRelation(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    }
  }
}
</script>
<style scoped>
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
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
