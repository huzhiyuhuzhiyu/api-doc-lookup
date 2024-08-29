<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', readOnly ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')" :content="title" />
        <div class="options" v-if="!readOnly">
          <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button> -->
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <el-tabs v-model="activeName">
              <el-tab-pane label="基础信息" name="jcInfo">
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode" />
                  </el-collapse-item>

                  <el-collapse-item title="检验项目" name="inspectionInfo">
                    <el-row :gutter="30" style="padding:0 15px">
                      <TableForm-ware :value="inspectionList" @input="contentChanges" ref="linesForm"
                        :tableItems="inspectionItems" :openMode="openMode" @addth="addOrDelInspectionItem"
                        @deleteth="addOrDelInspectionItem" :productsId="scope ? scope.productsId : ''" :num="rowNum"
                        :nowNum="nowNum" />
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="不良原因" name="adverseCausesInfo">
                    <el-row :gutter="30" style="padding:0 15px">
                      <TableForm-ware-two :value="linesListTwo" @input="contentChangesTwo" ref="linesFormTwo"
                        :tableItems="linesListItemsTwo" :openMode="openMode" @addth="addOrDelLinesItemTwo"
                        @deleteth="addOrDelLinesItemTwo" :productsId="scope ? scope.productsId : ''" :num="rowNum"
                        :nowNum="nowNumTwo" />
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="图纸信息" name="drawingcard">
                <JNPF-col-table v-model="productList" ref="sleeveForm" :tableItems="ProductTableItemss"
                  :openMode="openMode" />
              </el-tab-pane>
              <el-tab-pane label="流程卡" name="flowcard" v-if="typeflag">
                <JNPF-col v-model="flowCard" :tabContent="flowCardItems" ref="flowCardForm" />
              </el-tab-pane>
              <el-tab-pane label="附件" name="annex">
                <UploadWj v-model="datafilelist" :disabled="readOnly" :detailed="readOnly"></UploadWj>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>

      <WareSide v-if="wareVisibled" ref="wareSide" @confirm="sideConfirm" :openMode="openMode" />
      <Preview :visible.sync="previewVisible" :file="activeFile" />
    </div>
  </transition>
</template>

<script>
import {
  getpurPurchaseReceiptReturnGoodsdetail,
  detailpurPurchaseReceiptReturnGoods
} from '@/api/purchasingManagement/purchaseInquirySheet' // 单据详情
import {
  addInspectionData,
  updateInspectionData,
  detailInspectionData,
  detailInspectionDataByBizid
} from '@/api/inspectionManagement/index' // 产品检验项目列表
import { getQuotationsendlist } from '@/api/salesManagement/index' // 外协退料通知单
import { detailWithdrawal, detailordershengchan } from '@/api/productOrdes/index' // 生产退料
import { inspectionTypeList } from '../data.js'
import TableFormProduct from './TableForm-product.vue'
import TableFormWare from './TableForm-ware.vue'
import TableFormWareTwo from './TableForm-ware-two.vue'
import { getInspectionItem, getSamplingQuantityByProductId } from '@/api/inspectionManagement/index' // 产品检验项目列表
import WareSide from './WareSide.vue'
import { getbimDrawingData } from '@/api/basicData/index'
import Preview from '@/components/upload-wj/Preview.vue'
import { getDownloadUrl } from '@/api/common'
import { mapGetters } from 'vuex'
export default {
  components: { TableFormProduct, WareSide, Preview, TableFormWare, TableFormWareTwo },
  data() {
    return {
      activeFile: {},
      previewVisible: false,
      ProductListRequestObjs: {},
      ProductTableItemss: [
        { prop: 'drawingNo', label: '品名规格' },
        // { prop: 'name', label: '产品名称' },
        { prop: 'code', label: '产品编码' },
        { prop: 'sheetName', label: '图纸名称' },
        { prop: 'version', label: '版本' }
      ],
      getbimDrawingData,
      flowCard: {},
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo', 'inspectionInfo', 'adverseCausesInfo'],
      title: '',
      inspectionTypeList,
      visible: true,
      readOnly: false,
      wareVisibled: false,
      btnLoading: false,
      formLoading: true,
      typeflag: false,
      documentStatus: '',
      inspectionType: '',
      dataForm: {},
      dataFormItems: [
        /* 通过 this.setDataFormItems() 动态更改 */
      ],
      // 流转记录
      flowCardItems: [
        { prop: 'productCode', label: '产品编码', value: '', type: 'input', itemDisabled: true },
        { prop: 'productName', label: '产品名称', value: '', type: 'input', itemDisabled: true },
        { prop: 'productDrawingNo', label: '产品图号', value: '', type: 'input', itemDisabled: true },
        { prop: 'hoseLength', label: '软管净长', value: '', type: 'input', itemDisabled: true },
        { prop: 'leftCore', label: '左芯子（图号）', value: '', type: 'input', itemDisabled: true },
        { prop: 'leftCoreLength', label: '左芯子长', value: '', type: 'input', itemDisabled: true },
        { prop: 'rightCore', label: '右芯子（图号）', value: '', type: 'input', itemDisabled: true },
        { prop: 'rightCoreLength', label: '右芯子长', value: '', type: 'input', itemDisabled: true },
        { prop: 'sleeveModel', label: '套筒（图号）', value: '', type: 'input', itemDisabled: true },
        { prop: 'sheathModel', label: '护套（图号）', value: '', type: 'input', itemDisabled: true },
        { prop: 'innerRubberLength', label: '剥内胶长', value: '', type: 'input', itemDisabled: true },
        { prop: 'externalAdhesive', label: '剥外胶长', value: '', type: 'input', itemDisabled: true },
        { prop: 'compressionElongation', label: '扣压伸长量', value: '', type: 'input', itemDisabled: true },
        { prop: 'withhold', label: '扣压量', value: '', type: 'input', itemDisabled: true },
        { prop: 'withholdingTime', label: '扣压时间', value: '', type: 'input', itemDisabled: true },
        { prop: 'coreHoleDeformation', label: '芯孔变型量', value: '', type: 'input', itemDisabled: true },
        { prop: 'createTime', label: '创建时间', value: '', type: 'input', itemDisabled: true },
        { prop: 'createByName', label: '创建人', value: '', type: 'input', itemDisabled: true }
      ],
      linesList: [],
      linesListItems: [
        /* 通过 this.setLinesListItems() 动态更改 */
      ],
      spaceLines: [],
      productionLotList: [],
      batchFlag: false, // 是否读取的单据是批量检验单据
      scope: {},
      inspectionItems: this.initLinesListItems(),
      inspectionList: [],
      linesListTwo: [],
      linesListItemsTwo: [
        { prop: 'name', label: '不良原因名称', value: '', type: 'view', minWidth: 180 },
        {
          prop: 'unqualifiedQuantity',
          label: '不良品数量',
          value: '',
          type: 'input',
          itemRules: [
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate('positiveNumber', false, (errMsg) => {
                this.$message.error(`不良品数量：${errMsg}`)
              }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate({
                type: 'decimal',
                params: [
                  20,
                  4,
                  '',
                  (errMsg) => {
                    this.$message.error('不良品数量：' + errMsg)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ],
          minWidth: 180
        },
        { prop: 'remark', label: '备注', value: '', type: 'input', minWidth: 120 }
      ],
      productList: [],
      codeConfig: {}
    }
  },
  methods: {
    currentChangelook(data) {
      this.activeFile = {
        filename: data.filepath,
        id: data.id,
        name: data.filename,
        url: data.drawingPath
      }
      this.previewVisible = true
    },
    downloadtuzhi(row) {
      if (!row.filepath) return
      getDownloadUrl('document', row.filepath).then((res) => {
        this.jnpf.downloadFile(res.data.url, row.filename)
      })
    },

    // 设置主表结构
    setDataFormItems() {
      this.dataFormItems = [
        {
          prop: 'orderNo',
          label: '单号',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 12,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag
        },
        {
          prop: 'inspectorId',
          label: '检验人',
          value: undefined,
          type: 'custom',
          customComponent: 'user-select',
          itemRules: [{ required: true, trigger: 'change' }],
          change: () => {
            this.$nextTick(() => {
              this.$refs.dataForm.$refs.main.validateField('inspectorId')
            })
          },
          sm: 12
        },
        {
          prop: 'inspectionDate',
          label: '检验日期',
          value: undefined,
          type: 'date',
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 12
        },

        {
          prop: 'productDrawingNo',
          label: '品名规格',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 12,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag
        },
        {
          prop: 'mainUnit',
          label: '单位',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 12,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag
        },
        {
          prop: 'inspectionQuantity',
          label: '报检数量',
          value: '',
          type: 'input',
          sm: 12,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag
        },
        {
          prop: 'inspectionMethod',
          label: '检验方式',
          value: '',
          type: 'select',
          clearable: false,
          change: this.inspectionMethodChange,
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 12,
          // itemDisabled: (rowIndex) => this.dataForm.inspectionMethod === 'exempt' || this.openMode === '只读',
          options: [
            { label: '免检', value: 'exempt' },
            { label: '抽检', value: 'spot_check' },
            { label: '全检', value: 'all' }
          ]
        },
        // { prop: "inspectionMethod", label: "检验方式", value: undefined, type: "select", options: [{ label: '全检', value: 'all' }, { label: '抽检', value: 'spot_check' }], itemRules: [{ required: true, trigger: 'change' }], sm: 12 },
        {
          prop: 'samplingQuantity',
          label: '检验数量',
          value: '',
          type: 'input',
          sm: 12,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          itemDisabled: this.dataForm.inspectionMethod == 'all' || this.openMode === '只读',
          itemRules: [
            { required: true, trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value > Number(this.dataForm.inspectionQuantity)) {
                  callback(new Error('检验数量不能大于报检数量'))
                } else if (value < Number(this.autosamplingQuantity)) {
                  callback(new Error('检验数量不能小于规定的抽检数量'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        {
          prop: 'inspectionResults',
          label: '检验结果',
          value: undefined,
          type: 'select',
          options: [{ label: '合格', value: 'qualified' }, { label: '不合格', value: 'unqualified' }],
          change: this.inspectionResultsChange,
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 12
        },
        {
          prop: 'unqualifiedQuantity',
          label: '不合格数量',
          value: '',
          type: 'input',
          sm: 12,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          itemDisabled: this.dataForm.unqualifiedQuantity == '0' || this.openMode === '只读',
          itemRules: [
            { required: true, trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value > Number(this.dataForm.samplingQuantity)) {
                  callback(new Error('不合格数量不能大于检验数量'))
                } else if (value == 0 && this.dataForm.inspectionResults == 'unqualified') {
                  callback(new Error('不合格数量不能为0'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        // {
        //   prop: "liableList", label: "责任人", value: undefined, type: "custom", customComponent: "user-select", sm: 12, multiple: true,
        //   render: ['process', 'finished', 'finished_batch'].includes(this.inspectionType)
        // },
        { prop: 'remark', label: '备注', value: '', type: 'textarea' }
      ]
    },
    // 设置子表结构
    setLinesListItems() {
      this.linesListItems = [
        {
          prop: 'orderNo',
          label: '来源单号',
          type: 'view',
          minWidth: 180,
          render: this.inspectionType.indexOf('_batch') !== -1 || this.batchFlag
        },
        { prop: 'productCode', label: '产品编码', value: '', type: 'view', minWidth: 140 },
        { prop: 'productName', label: '产品名称', value: '', type: 'view', minWidth: 140 },
        {
          prop: 'productDrawingNo',
          label: '产品图号',
          value: '',
          type: 'view',
          minWidth: 140,
          render: ['procure', 'finished', 'sale_back', 'process', 'back_material', 'produce', 'external'].includes(
            this.inspectionType
          )
        },
        {
          prop: 'productSpec',
          label: '规格型号',
          value: '',
          type: 'view',
          minWidth: 140,
          render: ['procure', 'finished', 'sale_back', 'external'].includes(this.inspectionType)
        },
        {
          prop: 'productCategoryName',
          label: '产品分类',
          value: '',
          type: 'view',
          minWidth: 140,
          render: ['procure', 'finished', 'sale_back', 'process', 'back_material', 'produce', 'external'].includes(
            this.inspectionType
          )
        },
        {
          prop: 'routingName',
          label: '工艺路线名称',
          value: '',
          type: 'view',
          minWidth: 140,
          render: ['process', 'back_material', 'external', 'produce'].includes(this.inspectionType)
        },
        {
          prop: 'processName',
          label: '工序名称',
          value: '',
          type: 'view',
          minWidth: 140,
          render: ['process', 'back_material', 'external', 'produce'].includes(this.inspectionType)
        },
        {
          prop: 'inspectionMethod',
          label: '检验方式',
          value: '',
          type: 'select',
          clearable: false,
          change: this.inspectionMethodChange,
          width: 140,
          itemRules: [{ required: true, trigger: 'change' }],
          itemDisabled: (rowIndex) =>
            this.linesList[rowIndex].inspectionMethod === 'exempt' || this.openMode === '只读',
          options: [
            { label: '免检', value: 'exempt' },
            { label: '抽检', value: 'spot_check' },
            { label: '全检', value: 'all' }
          ]
        },
        { prop: 'inspectionQuantity', label: '报检数量', value: '', type: 'view', minWidth: 150 },
        { prop: 'mainUnit', label: '单位', value: '', type: 'view', width: 130 },
        {
          // 检验结果
          prop: 'inspectionResults',
          label: '检验结果',
          value: undefined,
          type: 'select',
          clearable: false,
          options: [{ label: '合格', value: 'qualified' }, { label: '不合格', value: 'unqualified' }],
          itemRules: [{ required: true, trigger: 'change' }],
          width: 150,
          change: this.inspectionResultsChange,
          itemDisabled: (rowIndex) => this.linesList[rowIndex].inspectionMethod === 'exempt' || this.openMode === '只读'
        },
        {
          // 检验数量
          prop: 'samplingQuantity',
          label: '检验数量',
          value: '',
          type: 'input',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：检验数量${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'decimal',
                params: [
                  20,
                  4,
                  '',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：检验数量${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate('positiveNumber', false, (errMsg, index) => {
                this.$message.error(`产品信息第${index + 1}行：检验数量${errMsg}`)
              }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [
                  (rowIndex) =>
                    Number(this.linesList[rowIndex].samplingQuantity) <=
                    Number(this.linesList[rowIndex].inspectionQuantity),
                  '不能超过对应报检数量',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：检验数量${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ],
          minWidth: 180,
          itemDisabled: (rowIndex) =>
            this.linesList[rowIndex].inspectionMethod === 'all' ||
            this.linesList[rowIndex].inspectionMethod === 'exempt' ||
            this.openMode === '只读'
        },
        {
          // 不合格数量
          prop: 'unqualifiedQuantity',
          label: '不合格数量',
          value: '',
          type: 'input',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：不合格数量${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'decimal',
                params: [
                  20,
                  4,
                  '',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：不合格数量${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [
                  (rowIndex) => {
                    let row = this.linesList[rowIndex]
                    if (row.inspectionResults !== 'unqualified') return true // 检验结果非不合格，忽略校验
                    return row.unqualifiedQuantity && Number(row.unqualifiedQuantity) > 0
                  },
                  '检验结果为不合格时，不合格数量必须大于0',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [
                  (rowIndex) =>
                    Number(this.linesList[rowIndex].unqualifiedQuantity) <=
                    Number(this.linesList[rowIndex].samplingQuantity),
                  '不能超过对应检验数量',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：不合格数量${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ],
          minWidth: 180,
          itemDisabled: (rowIndex) =>
            this.linesList[rowIndex].inspectionResults === 'qualified' || this.openMode === '只读'
        }
      ]
      this.$nextTick(() => {
        this.$refs.linesForm.setDefaultValue()
      })
    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)

        this.codeConfig = data
        if (flag) {
          this.dataForm.orderNo = data.number
        }
      } catch (error) { }
    },
    // 初始化
    async init(row, readOnly, inspectionType, type, businessCode) {
      this.scope = { ...row }

      this.fetchData(businessCode, true)
      this.dataForm = row

      this.dataForm.inspectorId = this.dataForm.inspectorId ? this.dataForm.inspectorId : this.userInfo.userId
      this.dataForm.inspectionDate = this.jnpf.toDate(new Date(), 'yyyy-MM-dd')
      this.dataForm.productDrawingNo = row.productDrawingNo
      this.dataForm.mainUnit = row.mainUnit
      if (inspectionType === 'procure' || inspectionType === 'external') {
        this.dataForm.inspectionQuantity = row.receivedQuantity
        this.dataForm.docId = row.purchaseReceiptReturnGoodsId
        this.dataForm.docLineId = row.id
        this.dataForm.docNo = row.orderNo
      } else if (inspectionType === 'sale_back') {
        this.dataForm.inspectionQuantity = row.deliveryQuantity
        this.dataForm.docId = row.id
        this.dataForm.docLineId = row.id
      } else if (inspectionType === 'process') {
        this.dataForm.inspectionQuantity = row.productionQuantity
      } else if (inspectionType === 'finished') {
        this.dataForm.inspectionQuantity = Number(row.qualifiedQuantity) + Number(row.unqualifiedQuantity)
      }

      this.ProductListRequestObjs = {
        code: this.scope.productCode,
        drawingNo: '',
        name: this.scope.productName,
        orderItems: [{ asc: false, column: '' }, { asc: false, column: 'create_time' }],
        pageNum: 1,
        pageSize: 20
      }
      await getbimDrawingData(this.ProductListRequestObjs)
        .then((res) => {
          this.productList = res.data.records
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
      await getInspectionItem({ id: this.scope.productsId, inspectionCategory: inspectionType })
        .then((res) => {
          this.inspectionList = res.data
          this.addOrDelInspectionItem(res.data)

          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
      let id = row.id
      this.inspectionType = inspectionType
      this.businessCode = businessCode
      this.visible = true
      this.formLoading = true
      this.readOnly = readOnly
      let option = this.inspectionTypeList.find((o) => o.value === inspectionType.replace('_batch', ''))
      option ? (this.title = readOnly ? `查看${option.label}检验单` : `检验${option.label}`) : ''
      this.title.includes('生产巡检') ? (this.title = this.title.replace('检验', '')) : ''
      this.setDataFormItems()
      if (inspectionType === 'process') {
        this.dataForm.submitMethod = 'add'
        this.formLoading = false
        // this.typeflag = true
        // detailordershengchan(typeof id === 'object' ? id.productionOrderId : type.productionOrderId).then(res => {
        //   this.flowCard = res.data.flowCard ? res.data.flowCard : {}
        // })
      }
      if (typeof id === 'object' && inspectionType === 'process') {
        // 生产巡检
        let rowData = id
        this.dataForm = {
          noticeId: rowData.id,
          orderNo: rowData.orderNo,
          originOrderNo: rowData.orderNo,
          inspectionDate: this.jnpf.getToday(),
          notificationType: 'process',
          submitMethod: 'add'
        }
        let tempLinesList = [
          {
            ordersLineId: rowData.id,
            productsId: rowData.productId,
            productCode: rowData.productCode,
            productName: rowData.productName,
            productDrawingNo: rowData.productDrawingNo,
            productCategoryName: rowData.productCategoryName,
            productSpec: rowData.productSpec,
            inspectionQuantity: rowData.dispatchQuantity,
            inspectionMethod: rowData.productInspectionMethod,
            mainUnit: rowData.mainUnit,
            inspectionResults: '',
            routingId: rowData.routingId,
            routingCode: rowData.routingCode,
            routingName: rowData.routingName,
            processId: rowData.processId,
            processCode: rowData.processCode,
            processName: rowData.processName,
            returnQuantity: 0
            // samplingQuantity: rowData.productInspectionMethod === 'all' || !rowData.productInspectionMethod ? rowData.dispatchQuantity : ''
          }
        ]
        this.linesListFormat(tempLinesList)
        this.linesList = tempLinesList
        this.setLinesListItems()
        this.formLoading = false
        return
      } else if (typeof id === 'object' && inspectionType === 'finished_batch') {
        // 批量完工检验
        let selectedData = id
        this.dataForm = { inspectionDate: this.jnpf.getToday(), notificationType: 'finished', submitMethod: 'add' }
        let tempLinesList = selectedData.map((rowData) => {
          return {
            orderNo: rowData.orderNo,
            ordersLineId: rowData.id,
            productsId: rowData.productsId,
            productCode: rowData.productCode,
            productName: rowData.productName,
            productDrawingNo: rowData.productDrawingNo,
            productSpec: rowData.productSpec,
            mainUnit: rowData.mainUnit,
            inspectionMethod: rowData.productInspectionMethod,
            routingCode: rowData.routingCode,
            routingName: rowData.routingName,
            routingLineId: rowData.routingLineId,
            inspectionQuantity: rowData.inspectionQuantity, // 检验数量 = 生产数量 - 合格数量 - 检验中数量
            inspectionResults: '',
            returnQuantity: 0
          }
        })
        this.linesListFormat(tempLinesList)
        this.linesList = tempLinesList
        this.setLinesListItems()
        this.formLoading = false
        return
      }
      // 获取详情
      let detailMethod = type === 'notice' ? detailInspectionDataByBizid : detailInspectionData
      let res = {}
      if (this.inspectionType === 'finished' && !readOnly) {
      } else {
        res = await detailMethod(typeof id === 'string' ? id : id.id).catch((err) => false)
        console.log(res, 'res123')
      }
      if (res.data) {
        if (res.data.attachmentList) {
          res.data.attachmentList.forEach((item) => {
            this.datafilelist.push({
              name: item.document.fullName,
              fileSize: item.document.fileSize,
              filename: item.document.filePath,
              id: item.document.id,
              url: item.url
            })
          })
        }
        this.dataForm = { ...res.data, orderNo: res.data.originOrderNo, approvalStatus: '' }
        this.linesList = res.data.lines
        delete this.dataForm.lines
        if (!this.dataForm.orderNo) {
          this.batchFlag = true
          this.setDataFormItems()
        }
        this.setLinesListItems()
        this.formLoading = false
      } else if (inspectionType === 'procure' || inspectionType === 'external') {
        // 采购收货、外协收货

        this.dataForm.submitMethod = 'add'
        // getpurPurchaseReceiptReturnGoodsdetail(id).then(res => {
        //   if (res.data.attachmentList) {
        //     res.data.attachmentList.forEach((item) => {
        //       this.datafilelist.push(
        //         {
        //           name: item.document.fullName,
        //           fileSize: item.document.fileSize,
        //           filename: item.document.filePath,
        //           id: item.document.id,
        //           url: item.url
        //         }
        //       )
        //     })
        //   }
        //   this.dataForm = {
        //     ...res.data,
        //     orderNo: res.data.orderNo,
        //     inspectionDate: this.jnpf.getToday(),
        //     noticeId: res.data.id,
        //     approvalStatus: '',
        //     originOrderNo: res.data.orderNo,
        //     id: '',
        //     submitMethod: 'add',
        //     notificationType: res.data.notificationType === 'external_process' ? 'external' : res.data.notificationType
        //   }
        //   detailpurPurchaseReceiptReturnGoods(id).then(res => {
        //     if (res.data.attachmentList) {
        //       res.data.attachmentList.forEach((item) => {
        //         this.datafilelist.push(
        //           {
        //             name: item.document.fullName,
        //             fileSize: item.document.fileSize,
        //             filename: item.document.filePath,
        //             id: item.document.id,
        //             url: item.url
        //           }
        //         )
        //       })
        //     }
        //     let tempLinesList = res.data.filter(line => line.receivingStatus !== 'stopped') // 过滤已停止的明细
        //     tempLinesList.forEach(line => {
        //       // line.samplingQuantity = Number(line.qualifiedQuantity) + Number(line.unqualifiedQuantity)
        //       line.inspectionQuantity = line.receivedQuantity
        //       line.ordersLineId = line.id
        //       line.samplingQuantity = ''
        //       line.unqualifiedQuantity = ''
        //       line.returnQuantity = 0
        //       line.routingName = line.lastFlag && (line.reworkType === 'product' || !line.reworkType) ? '' : line.routingIdName || ""
        //       line.processName = line.lastFlag && (line.reworkType === 'product' || !line.reworkType) ? '' : line.processIdName || ""
        //       line.routingLineId = line.lastFlag && (line.reworkType === 'product' || !line.reworkType) ? '' : line.routingLineId || ""
        //     })
        //     this.linesListFormat(tempLinesList)
        //     this.linesList = tempLinesList
        //     this.setLinesListItems()
        //     this.formLoading = false
        //   }).catch(err => {
        //     this.formLoading = false
        //   })
        // }).catch(errpr => {
        //   this.formLoading = false
        // })
        this.formLoading = false
      } else if (inspectionType === 'sale_back' || inspectionType === 'back_material') {
        this.dataForm.notificationType = inspectionType
        // 销售退货、外协退料
        // getQuotationsendlist(id).then((res) => {
        //   if (res.data.attachmentList) {
        //     res.data.attachmentList.forEach((item) => {
        //       this.datafilelist.push({
        //         name: item.document.fullName,
        //         fileSize: item.document.fileSize,
        //         filename: item.document.filePath,
        //         id: item.document.id,
        //         url: item.url
        //       })
        //     })
        //   }
        //   this.dataForm = {
        //     ...res.data.notice,
        //     orderNo: res.data.notice.orderNo,
        //     inspectionDate: this.jnpf.getToday(),
        //     noticeId: res.data.notice.id,
        //     notificationType: inspectionType,
        //     approvalStatus: '',
        //     originOrderNo: res.data.notice.orderNo,
        //     id: '',
        //     submitMethod: 'add'
        //   }
        //   let tempLinesList = res.data.noticeLineList.map((line) => {
        //     return {
        //       ...line,
        //       ordersLineId: line.id,
        //       inspectionQuantity: line.deliveryQuantity,
        //       inspectionResults: '',
        //       unqualifiedQuantity: '',
        //       productsId: line.productId,
        //       returnQuantity: 0
        //       // samplingQuantity: line.productInspectionMethod === 'all' ? line.deliveryQuantity : ''
        //     }
        //   })
        //   this.linesListFormat(tempLinesList)
        //   this.linesList = tempLinesList
        //   this.setLinesListItems()
        //   this.formLoading = false
        // })
        this.dataForm.submitMethod = 'add'
        this.formLoading = false
      } else if (inspectionType === 'produce') {
        // 生产退料
        detailWithdrawal(id).then((res) => {
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push({
                name: item.document.fullName,
                fileSize: item.document.fileSize,
                filename: item.document.filePath,
                id: item.document.id,
                url: item.url
              })
            })
          }
          this.dataForm = {
            ...res.data.collect,
            orderNo: res.data.collect.orderNo,
            inspectionDate: this.jnpf.getToday(),
            noticeId: res.data.collect.id,
            notificationType: inspectionType,
            approvalStatus: '',
            originOrderNo: res.data.collect.orderNo,
            id: '',
            submitMethod: 'add'
          }
          let tempLinesList = res.data.collectLineList.map((line) => {
            return {
              ...line,
              ordersLineId: line.id,
              inspectionQuantity: line.num,
              inspectionResults: '',
              unqualifiedQuantity: '',
              productsId: line.productId,
              returnQuantity: 0
              // samplingQuantity: line.productInspectionMethod === 'all' ? line.deliveryQuantity : ''
            }
          })
          this.linesListFormat(tempLinesList)
          this.linesList = tempLinesList
          this.setLinesListItems()
          this.formLoading = false
        })
      } else if (inspectionType === 'finished') {
        // 完工

        let rowData = id
        this.dataForm = {
          noticeId: rowData.id,
          orderNo: rowData.orderNo,
          originOrderNo: rowData.orderNo,
          inspectionDate: this.jnpf.getToday(),
          notificationType: 'finished',
          submitMethod: 'add'
        }
        let tempLinesList = [
          {
            ordersLineId: rowData.id,
            productsId: rowData.productsId,
            productCode: rowData.productCode,
            productName: rowData.productName,
            productDrawingNo: rowData.productDrawingNo,
            productSpec: rowData.productSpec,
            productCategoryName: rowData.productCategoryName,
            mainUnit: rowData.mainUnit,
            inspectionMethod: rowData.productInspectionMethod,
            routingCode: rowData.routingCode,
            routingName: rowData.routingName,
            routingLineId: rowData.routingLineId,
            inspectionQuantity: this.jnpf.math('subtract', [
              rowData.completedQuantity,
              rowData.qualifiedQuantity,
              rowData.underInspectionQuantity
            ]), // 检验数量 = 生产数量 - 合格数量 - 检验中数量
            inspectionResults: '',
            returnQuantity: 0
            // samplingQuantity: rowData.productInspectionMethod === 'all' || !rowData.productInspectionMethod ?
            //   this.jnpf.math('subtract', [rowData.completedQuantity, rowData.qualifiedQuantity, rowData.underInspectionQuantity]) : ''
          }
        ]
        this.linesListFormat(tempLinesList)
        this.linesList = tempLinesList
        this.setLinesListItems()
        this.formLoading = false
      }
    },
    // 子表数据通用处理
    linesListFormat(linesList) {
      linesList.forEach((line) => {
        line.inspectionMethod = line.productInspectionMethod || 'all' // 默认全检
        if (line.inspectionMethod === 'exempt') {
          // 免检
          line.inspectionResults = 'qualified'
          line.samplingQuantity = line.inspectionQuantity
          line.unqualifiedQuantity = 0
        } else if (line.inspectionMethod === 'all') {
          // 全检
          line.samplingQuantity = line.inspectionQuantity
        } else if (line.inspectionMethod === 'spot_check') {
          // 抽检
          if (line.spotCheckRatio && line.spotCheckRatio != '0') {
            // 有抽检比例自动设置检验数量
            let num = Math.ceil(line.inspectionQuantity * (line.spotCheckRatio / 100))
            if (num > Number(line.inspectionQuantity)) num = Number(line.inspectionQuantity)
            line.samplingQuantity = num
          }
        }
      })
    },
    // 提交
    async handleConfirm(submitModel) {
      if (this.nowNum !== 0) return this.$message.error('检验项目不合格数量与总不合格数量不匹配')
      if (this.nowNumTwo !== 0) return this.$message.error('不良原因不合格数量与总不合格数量不匹配')
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用

      // 校验表单
      let form_1 = this.$refs['dataForm'].$refs.main
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        this.jnpf.focusErrValidItem(form_1.fields)
        submitFlag = false
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['linesForm'].$refs.main
      let valid_2 = await form_2.validate().catch((err) => false)
      if (!valid_2 && submitFlag) {
        this.jnpf.focusErrValidItem(form_2.fields)
        submitFlag = false
      }

      // 判断子表是否有效
      // if (!this.linesList.length && submitFlag) {
      //   submitFlag = false
      //   this.$message.error('请至少选择一个产品')
      // }
      // if (this.linesList.length && submitFlag) {
      //   this.linesList.some((item, i) => {
      //     let num_1 = 0, num_2 = 0
      //     let hasItemList = item.itemList && item.itemList.length
      //     let hasCausesList = item.causesList && item.causesList.length
      //     if (hasItemList) {
      //       item.itemList.forEach(item2 => { num_1 = this.jnpf.math('add', [num_1, item2.unqualifiedQuantity]) })
      //     } else {
      //       item.itemList = []
      //     }
      //     if ((item.inspectionMethod !== 'exempt' && !hasItemList) || (item.unqualifiedQuantity != 0 && !num_1)) {
      //       this.$message.error(`产品信息第${i + 1}行：请先完善检验项目`)
      //       submitFlag = false
      //       return true
      //     }
      //     // let hasList = !!item.itemList && !!item.causesList
      //     // if (hasList) {
      //     //   item.itemList.forEach(item => { num_1 += Number(item.unqualifiedQuantity) || 0 })
      //     //   item.causesList.forEach(cause => { num_2 += Number(cause.unqualifiedQuantity) || 0 })
      //     // } else {
      //     //   item.itemList = []
      //     //   item.causesList = []
      //     // }
      //     // if (item.unqualifiedQuantity != 0 && !num_1) {
      //     //   this.$message.error(`产品信息第${i + 1}行：请先完善检验项目`)
      //     //   submitFlag = false
      //     //   return true
      //     // }
      //     // if (item.unqualifiedQuantity != num_1 || item.unqualifiedQuantity != num_2 || (item.unqualifiedQuantity != '0' && !hasList)) {
      //     //   submitFlag = false
      //     //   this.$message.error(`产品信息第${i + 1}行：请先完善检验明细`)
      //     //   return true
      //     // }
      //     return false
      //   })
      // }

      // 判断是否有line未完成自动获取的检验项目列表
      if (submitFlag) {
        let flag = this.linesList.some((line) => line.loadItemListFlag)
        if (flag) {
          submitFlag = false
          this.$message.error('正在获取产品信息的检验项目，请稍等')
        }
      }

      if (submitFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: '',
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        this.dataForm.documentStatus = submitModel
        this.dataForm.businessCode = this.businessCode
        this.dataForm.approvalCompletionDate = ''

        let dataObj = {
          inspection: this.dataForm,
          // lines: this.linesList,
          causesList: this.linesListTwo,
          itemList: this.inspectionList,
          attachmentList: this.datafilelist
        }

        let modifyFlag = dataObj.inspection.submitMethod !== 'add'
        const formMethod = modifyFlag ? updateInspectionData : addInspectionData
        // dataObj.documentStatus = submitModel
        // dataObj.businessCode = this.businessCode
        // dataObj.approvalCompletionDate = ''
        // dataObj.lines.forEach(line => { if (line.inspectionResults === 'qualified') { line.receiptQuantity = line.inspectionQuantity } })
        // dataObj.unqualifiedFlag = dataObj.lines.some(line => line.unqualifiedQuantity !== undefined && line.unqualifiedQuantity != '0')
        delete dataObj.active
        console.log(dataObj, 'dataObj')
        if (location.hostname === 'localhost' || location.href.indexOf('mode=dev') !== -1) {
          // 调试
          let flag = await confirm('确定提交吗？')
          if (!flag) {
            this.btnLoading = false
            return
          }
        }

        formMethod(dataObj)
          .then((res) => {
            let msg = res.msg
            if (res.msg === 'Success') {
              msg = submitModel == 'submit' ? '提交成功' : '保存成功'
            }
            this.visible = false
            this.$emit('close', true)
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.btnLoading = false
              }
            })
          })
          .catch(() => {
            this.btnLoading = false
          })
      } else {
        this.btnLoading = false
      }
    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let paramType = Array.isArray(data) ? 'Array' : 'Object'
      if (paramType === 'Object') {
        this.linesList.splice(data.$index, 1)
        this.spaceLines = this.spaceLines.filter((item) => item.productsId !== data.row.productsId)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          item.remark = ''
          item.productCode = item.code
          item.productsId = item.id
          const hasFlag = this.linesList.find((i) => item.productId === i.productsId)
          if (hasFlag) {
            hasItemList.push(item.productName)
          } else {
            tempList.push(item)
          }
          if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        }
        this.linesList = tempList.map((item) => {
          return { ...item, warehouseId: this.dataForm.warehouseId }
        })
        this.$nextTick(() => {
          this.$refs.linesForm.setDefaultValue()
        })
      }
    },
    // 检验项目
    addOrDelInspectionItem(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'

      if (type === 'Object') {
        this.inspectionList.splice(data.$index, 1)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.inspectionList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          // if (this.rowNum == "0") item.unqualifiedQuantity = 0
          const hasFlag = this.inspectionList.find((i) => item.id === i.id)
          if (hasFlag) {
            hasItemList.push(item.name)
          } else {
            tempList.push(item)
          }
        }
        // if (hasItemList.length) this.$message.error(`已经存在的检验项目：${hasItemList.join('、')}`)
        this.inspectionList = JSON.parse(JSON.stringify(tempList))

        this.$nextTick(() => {
          this.$refs.linesForm.setDefaultValue()
        })
      }
    },
    // 不良原因
    addOrDelLinesItemTwo(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'
      if (type === 'Object') {
        this.linesListTwo.splice(data.$index, 1)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.linesListTwo))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          const hasFlag = this.linesListTwo.find((i) => item.id === i.id)
          if (hasFlag) {
            hasItemList.push(item.name)
          } else {
            tempList.push(item)
          }
        }
        if (hasItemList.length) this.$message.error(`已经存在的不良原因：${hasItemList.join('、')}`)
        this.linesListTwo = JSON.parse(JSON.stringify(tempList))
        this.$nextTick(() => {
          this.$refs.linesFormTwo.setDefaultValue()
        })
      }
    },
    // 子表数据更改
    linesChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    // 打开抽屉
    openSide(scope) {
      this.wareVisibled = true
      this.$nextTick(() => {
        this.$refs['wareSide'].init({ ...scope }, this.readOnly)
      })
    },
    // 抽屉提交
    sideConfirm(data, scope) {
      this.linesList[scope.$index].causesList = data.causesList
      this.linesList[scope.$index].itemList = data.itemList
      this.$refs['wareSide'].drawerVisible = false
      this.$refs['wareSide'].btnLoading = false
      this.$message.success('配置成功')
    },
    // 检验结果更改
    inspectionResultsChange(val, scope) {
      this.$refs['dataForm'].$refs['main'].clearValidate('unqualifiedQuantity')
      if (val === 'qualified') {
        this.dataForm.unqualifiedQuantity = '0'
        !this.dataForm.itemList ? (this.dataForm.itemList = []) : ''
        !this.dataForm.causesList ? (this.dataForm.causesList = []) : ''
        // if (!this.dataForm.itemList.length) { // 自动设置检验项目
        //   this.dataForm.loadItemListFlag = true
        //   getInspectionItem({ id: this.dataForm.productsId, inspectionCategory: this.inspectionType.replace('_batch', '') }).then((res) => {
        //     const data = res.data
        //     let tempList = []
        //     for (let i = 0; i < data.length; i++) {
        //       let item = data[i];
        //       if (this.dataForm.unqualifiedQuantity == "0") item.unqualifiedQuantity = 0
        //       tempList.push(item)
        //     }
        //     this.dataForm.itemList = tempList
        //     this.dataForm.loadItemListFlag = false
        //   }).catch(err => {
        //     this.dataForm.loadItemListFlag = false
        //   })
        // }
      } else {
        this.dataForm.unqualifiedQuantity = ''
      }
      this.setDataFormItems()
    },
    // 检验方式更改
    async inspectionMethodChange(val, scope) {
      if (val === 'exempt') {
        // 免检
        this.dataForm.inspectionMethod = val
        this.dataForm.inspectionResults = 'qualified'
        this.dataForm.samplingQuantity = this.dataForm.inspectionQuantity
        // this.dataForm.unqualifiedQuantity = 0
        this.inspectionResultsChange('qualified', scope)
      } else if (val === 'spot_check') {
        const _data = [{ productsId: this.dataForm.productsId, num: this.dataForm.inspectionQuantity }]
        let res = await getSamplingQuantityByProductId(_data).catch(() => false)
        console.log(res.data[0].spotCheckNum, 'getRes.data[0].spotCheckNum')
        this.dataForm.samplingQuantity = res.data[0].spotCheckNum
        this.autosamplingQuantity = res.data[0].spotCheckNum
        console.log(res, 'res')
        // 抽检
        this.dataForm.inspectionMethod = val
      } else if (val === 'all') {
        // 全检
        this.dataForm.inspectionMethod = val
        this.dataForm.samplingQuantity = this.dataForm.inspectionQuantity
      }
      this.setDataFormItems()
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.inspectionList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.inspectionList[dataOrIndex][prop] = value
      }
    },
    contentChangesTwo(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesListTwo = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesListTwo[dataOrIndex][prop] = value
      }
    }
  },
  beforeCreate() {
    this.initLinesListItems = () => [
      { prop: 'name', label: '检验项目', value: '', type: 'view', minWidth: 120 },
      {
        prop: 'unqualifiedQuantity',
        label: '不合格数量',
        value: '0',
        type: 'input',
        itemRules: [
          { required: true, trigger: 'blur' },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('不合格数量：' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          }
        ],
        minWidth: 180
      },
      { prop: 'remark', label: '备注', value: '', type: 'input', minWidth: 120 }
    ]
  },

  computed: {
    rowNum() {
      // this.$nextTick(() => { this.linesListItems = this.initLinesListItems() }) // rowNum发生改变，重新渲染linesListItems
      // let tempUnqualifiedQuantity = this.$parent.title.includes('检') ? (this.scope.row ? this.scope.row.unqualifiedQuantity : 0) :
      //   (this.scope.row ? this.scope.row.inspectionUnqualifiedQuantity : 0)
      // return this.scope.row ? tempUnqualifiedQuantity ? tempUnqualifiedQuantity : 0 : 0
      return this.dataForm.unqualifiedQuantity
    },
    nowNum() {
      let tempNum = 0
      this.inspectionList.forEach((item) => {
        tempNum += item.unqualifiedQuantity ? Number(item.unqualifiedQuantity) : 0
      })

      let tempUnqualifiedQuantity = this.dataForm.unqualifiedQuantity ? this.dataForm.unqualifiedQuantity : 0

      let newNumber = this.scope ? this.jnpf.math('subtract', [tempUnqualifiedQuantity, tempNum]) : 0

      return this.jnpf.numberFormat(newNumber, 4)
    },
    nowNumTwo() {
      let tempNum = 0
      this.linesListTwo.forEach((item) => {
        tempNum += item.unqualifiedQuantity ? Number(item.unqualifiedQuantity) : 0
      })
      let tempUnqualifiedQuantity = this.dataForm.unqualifiedQuantity ? this.dataForm.unqualifiedQuantity : 0
      let newNumber = this.scope ? this.jnpf.math('subtract', [tempUnqualifiedQuantity, tempNum]) : 0
      return this.jnpf.numberFormat(newNumber, 4)
    },
    openMode() {
      this.$nextTick(() => {
        this.setLinesListItems()
      })
      // return this.dataForm.submitFlag === 'add' ? '新建' : this.title.includes('查看') ? '只读' : '编辑'
      if (this.title.includes('生产巡检')) {
        return this.title === '生产巡检' ? '新建' : '只读'
      }
      return this.title.substr(0, 2) == '检验' ? '新建' : '只读'
    },
    ...mapGetters(['userInfo'])
  }
}
</script>
<style lang="scss" scoped>
.contain {
  position: relative;
  height: calc(100% - 47px);
  overflow-y: auto;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
