<template>
  <!-- 检验单 -->
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
                  <el-collapse-item title="检验信息" name="inspectionInfo" class="orderInfo">
                    <JNPF-col v-model="dataForm" :tabContent="inspectionInfo" ref="dataForm" :openMode="openMode" />
                  </el-collapse-item>

                  <el-collapse-item title="检验项目" name="inspectionItem">
                    <el-row :gutter="30" style="padding: 0 0 10px 0;">
                      <TableForm-ware :value="inspectionList" @input="contentChanges" ref="linesForm"
                        :tableItems="inspectionItems" :openMode="openMode" @addth="addOrDelInspectionItem"
                        @deleteth="addOrDelInspectionItem" :productsId="scope ? scope.productsId : ''" :num="rowNum"
                        :nowNum="nowNum" />
                    </el-row>
                  </el-collapse-item>

                  <el-collapse-item title="不良原因" name="adverseCausesInfo">
                    <el-row :gutter="30" style="padding: 0 0 10px 0;">
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
              <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                <UploadWj v-model="datafilelist" :disabled="readOnly" :detailed="readOnly"></UploadWj>
              </el-tab-pane>
              <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
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
  addInspectionData,
  updateInspectionData,
  detailInspectionData,
  detailInspectionDataByBizid
} from '@/api/inspectionManagement/index' // 产品检验项目列表
import { detailWithdrawal, detailordershengchan } from '@/api/productOrdes/index' // 生产退料
import { inspectionTypeList } from '../data.js'
import TableFormProduct from './TableForm-product.vue'
import TableFormWare from './TableForm-ware.vue'
import TableFormWareTwo from './TableForm-ware-two.vue'
import { getInspectionItem, getSamplingQuantityByProductId, getSamplingQuantityByProcessId } from '@/api/inspectionManagement/index' // 产品检验项目列表
import WareSide from './WareSide.vue'
import { getbimDrawingData, getBimBusinessDetail } from '@/api/basicData/index'
import Preview from '@/components/upload-wj/Preview.vue'
import { getDownloadUrl } from '@/api/common'
import { mapGetters } from 'vuex'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: { TableFormProduct, WareSide, Preview, TableFormWare, TableFormWareTwo, Process },
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      tableDataFlag: false,
      isattachmentswitch: '',
      categoryId: '',
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
      activeNames: ['inspectionItem', 'basicInfo', 'inspectionInfo', 'adverseCausesInfo'],
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
      inspectionInfo: [
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
      codeConfig: {},
      flowTemplateJson: {},
      flowData: {}
    }
  },
  methods: {
    getBimBusinessDetail(inspectionType) {
      let obj = {
        businessCode: 'attachment',
        configKey: `fj_${inspectionType}jyd`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
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
      function generateInspectionMethodList(inspectionType) {
        // 动态生成处理结果
        // 采购收货、外协收货、外协退料、生产退料 不良处理结果：合格、不合格、让步接收、挑选
        // 销售退货、生产巡检、生产完工检验 不良处理结果：合格、报废、返工返修、报废和返修
        return [
          {
            label: '全检',
            value: 'all',
            disabled: !['procure', 'external', 'sale_back', 'back_material', 'produce', 'process', 'finished'].includes(
              inspectionType
            )
          },
          {
            label: '抽检',
            value: 'spot_check',
            disabled: !['procure', 'external', 'sale_back', 'back_material', 'produce', 'process', 'finished'].includes(inspectionType)
          },
          {
            label: '免检',
            value: 'exempt',
            disabled: !['procure', 'external', 'sale_back', 'back_material', 'produce', 'process', 'finished'].includes(inspectionType)
          }
        ].filter((o) => !o.disabled)
      }
      this.dataFormItems = [
        {
          prop: 'orderNo',
          label: '单号',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6,
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
          sm: 6
        },
        {
          prop: 'inspectionDate',
          label: '检验日期',
          value: undefined,
          type: 'date',
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 6
        },
        {
          prop: 'projectName',
          label: '所属项目',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6,
          render: this.isProjectSwitch === '1',
          itemDisabled: true
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          itemDisabled: true
        },
        {
          prop: 'processName',
          label: '工序名称',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6,
          render: this.dataForm.processName,
          itemDisabled: true
        },
        {
          prop: 'mainUnit',
          label: '单位',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          itemDisabled: true
        },
        {
          prop: 'inspectionQuantity',
          label: '报检数量',
          value: '',
          type: 'input',
          sm: 6,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          itemDisabled: true
        }
      ]
      this.inspectionInfo = [
        {
          prop: 'inspectionMethod',
          label: '检验方式',
          value: '',
          type: 'select',
          clearable: false,
          change: this.inspectionMethodChange,
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 6,
          // itemDisabled: (rowIndex) => this.dataForm.inspectionMethod === 'exempt' || this.openMode === '只读',
          options: generateInspectionMethodList(this.inspectionType)
        },

        {
          prop: 'samplingQuantity',
          label: '检验数量',
          value: '',
          type: 'input',
          sm: 6,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          itemDisabled:
            this.dataForm.inspectionMethod == 'all' ||
            this.dataForm.inspectionMethod == 'exempt' ||
            this.openMode === '只读',
          itemRules: [
            { required: true, trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value > Number(this.dataForm.inspectionQuantity)) {
                  callback(new Error('检验数量不能大于报检数量'))
                } else if (value < Number(this.autosamplingQuantity)) {
                  callback(new Error('检验数量不能小于规定的抽检数量'))
                } else if (/^(?:[0-9]\d*)$/.test(value) == false) {
                  callback(new Error('请输入整数'))
                } else if (Number(value) == 0) {
                  callback(new Error('检验数量不能为0'))
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
          itemDisabled: this.dataForm.inspectionMethod == 'exempt' || this.openMode === '只读',
          change: this.inspectionResultsChange,
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 6
        },
        {
          prop: 'unqualifiedQuantity',
          label: '不合格数量',
          value: '',
          type: 'input',
          sm: 6,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          // itemDisabled: this.dataForm.inspectionResults == 'qualified' || this.openMode === '只读',
          itemDisabled: this.openMode === '只读',
          itemRules: [
            { required: true, trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value > Number(this.dataForm.samplingQuantity)) {
                  callback(new Error('不合格数量不能大于检验数量'))
                } else if (value == 0 && this.dataForm.inspectionResults == 'unqualified') {
                  callback(new Error('不合格数量不能为0'))
                } else if (/^(?:[0-9]\d*)$/.test(value) == false) {
                  callback(new Error('请输入整数'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        },
        // {
        //   prop: "liableList", label: "责任人", value: undefined, type: "custom", customComponent: "user-select", sm: 6, multiple: true,
        //   render: ['process', 'finished', 'finished_batch'].includes(this.inspectionType)
        // },
        { prop: 'remark', label: '备注', value: '', type: 'textarea', sm: 12 }
      ]
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
      await this.getProjectSwitch('system', 'project')
      this.getBimBusinessDetail(inspectionType)

      this.scope = { ...row }

      this.fetchData(businessCode, true)
      this.dataForm = { ...row, approvalFlag: false, approvalStatus: 'ing' }

      this.dataForm.inspectorId = this.dataForm.inspectorId ? this.dataForm.inspectorId : this.userInfo.userId
      this.dataForm.inspectionDate = this.jnpf.toDate(new Date(), 'yyyy-MM-dd')
      this.dataForm.productDrawingNo = row.productDrawingNo
      this.dataForm.mainUnit = row.mainUnit
      console.log(inspectionType, 'inspectionType')
      if (inspectionType === 'procure' || inspectionType === 'external') {
        this.dataForm.inspectionQuantity = this.scope.receivedQuantity
        this.dataForm.docId = this.scope.purchaseReceiptReturnGoodsId
        this.dataForm.docLineId = this.scope.id
        this.dataForm.docNo = this.scope.orderNo
      } else if (inspectionType === 'sale_back') {
        this.dataForm.inspectionQuantity = this.scope.deliveryQuantity
        this.dataForm.docId = this.scope.returnDeliveryNoticeId
        this.dataForm.inspectionMethod = 'all'
        this.dataForm.samplingQuantity = this.dataForm.inspectionQuantity
        this.dataForm.docLineId = this.scope.id
        this.dataForm.docNo = this.scope.orderNo
      } else if (inspectionType === 'process') {
        this.dataForm.inspectionQuantity = this.scope.productionQuantity
        this.dataForm.docId = this.scope.productionOrderId
        this.dataForm.docLineId = this.scope.id
        this.dataForm.docNo = this.scope.orderNo
      } else if (inspectionType === 'finished') {
        this.dataForm.inspectionQuantity = Number(this.scope.qualifiedQuantity) + Number(this.scope.unqualifiedQuantity)
        this.dataForm.docId = this.scope.productionOrderId
        this.dataForm.docLineId = this.scope.id
        this.dataForm.docNo = this.scope.orderNo
      } else if (inspectionType === 'produce') {
        this.dataForm.inspectionQuantity = this.scope.num
        this.dataForm.docId = this.scope.materialCollectId
        this.dataForm.docLineId = this.scope.id
        this.dataForm.docNo = this.scope.orderNo
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
      this.getBusInfo()
      this.businessCode = businessCode
      this.visible = true
      this.formLoading = true
      this.readOnly = readOnly
      let option = this.inspectionTypeList.find((o) => o.value === inspectionType.replace('_batch', ''))
      option ? (this.title = readOnly ? `查看${option.label}检验单` : `检验${option.label}`) : ''
      this.title.includes('生产巡检') ? (this.title = this.title.replace('检验', '')) : ''
      this.setDataFormItems()
      if (this.dataForm.processId) {
        this.dataForm.inspectionMethod = this.scope.processInspectionMethod
      } else {
        this.dataForm.inspectionMethod = this.scope.productInspectionMethod
      }

      if (this.dataForm.inspectionMethod) {
        if (this.dataForm.inspectionMethod === 'all') {
          this.dataForm.samplingQuantity = this.dataForm.inspectionQuantity
          this.inspectionInfo.forEach(tc => {
            if (tc.prop === 'inspectionMethod') {
              tc.itemDisabled = true
            } else if (tc.prop === 'samplingQuantity') {
              tc.itemDisabled = true
            }
          })
        } else if (this.dataForm.inspectionMethod === 'exempt') {
          this.dataForm.samplingQuantity = this.dataForm.inspectionQuantity
          this.dataForm.inspectionResults = 'qualified'
          this.inspectionInfo.forEach(tc => {
            if (tc.prop === 'inspectionMethod') {
              tc.itemDisabled = true
            } else if (tc.prop === 'samplingQuantity') {
              tc.itemDisabled = true
            } else if (tc.prop === 'inspectionResults') {

              tc.itemDisabled = true
            }

          })
        } else if (this.dataForm.inspectionMethod === 'spot_check') {
          console.log(this.dataForm.processId, 'id')
          if (this.dataForm.processId) {
            const _data = { processId: this.dataForm.processId, num: this.dataForm.inspectionQuantity }
            let res = await getSamplingQuantityByProcessId(_data).catch(() => false)
            this.$set(this.dataForm, 'samplingQuantity', res.data)
          } else {
            const _data = [{ productsId: this.dataForm.productsId, num: this.dataForm.inspectionQuantity }]
            let res = await getSamplingQuantityByProductId(_data).catch(() => false)
            this.$set(this.dataForm, 'samplingQuantity', res.data[0].spotCheckNum)
          }

        } else {

        }
      }
      if (inspectionType === 'process') {
        // 生产巡检

        this.dataForm.notificationType = inspectionType
        this.dataForm.submitMethod = 'add'
        this.formLoading = false
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

        this.formLoading = false
        return
      }
      // 获取详情
      let detailMethod = type === 'notice' ? detailInspectionDataByBizid : detailInspectionData
      let res = {}
      if (this.inspectionType === 'finished' && !readOnly) {
      } else {
        res = await detailMethod(typeof id === 'string' ? id : id.id).catch((err) => false)
      }

      if (inspectionType === 'procure' || inspectionType === 'external') {
        // 采购收货、外协收货

        this.dataForm.notificationType = inspectionType
        this.dataForm.submitMethod = 'add'
        this.formLoading = false
      } else if (inspectionType === 'sale_back' || inspectionType === 'back_material') {
        // 销售退货、外协退料

        this.dataForm.notificationType = inspectionType
        this.dataForm.submitMethod = 'add'
        this.formLoading = false
      } else if (inspectionType === 'produce') {
        // 生产退料

        this.dataForm.notificationType = inspectionType
        this.dataForm.submitMethod = 'add'
        this.formLoading = false
      } else if (inspectionType === 'finished') {
        // 完工

        this.dataForm.notificationType = inspectionType
        this.dataForm.submitMethod = 'add'
        this.formLoading = false
      }
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
              businessType: 'system_attachment',
              configKey: `fj_${this.inspectionType}jyd`,
              categoryId: this.categoryId,
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
          attachmentList: this.datafilelist,
          flowData: this.flowData
        }

        let modifyFlag = dataObj.inspection.submitMethod !== 'add'
        const formMethod = modifyFlag ? updateInspectionData : addInspectionData
        // dataObj.documentStatus = submitModel
        // dataObj.businessCode = this.businessCode
        // dataObj.approvalCompletionDate = ''
        // dataObj.lines.forEach(line => { if (line.inspectionResults === 'qualified') { line.receiptQuantity = line.inspectionQuantity } })
        // dataObj.unqualifiedFlag = dataObj.lines.some(line => line.unqualifiedQuantity !== undefined && line.unqualifiedQuantity != '0')
        delete dataObj.active
        console.log(dataObj, 'obj')

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

        // this.inspectionItems = [
        //   { prop: 'name', label: '检验项目', value: '', type: 'view', minWidth: 120 },
        //   { prop: 'unqualifiedQuantity', label: '不合格数量', value: '0', type: 'view', minWidth: 180 },

        //   { prop: 'remark', label: '备注', value: '', type: 'input', minWidth: 120 }
        // ]
        this.activeNames = ['basicInfo', 'inspectionInfo', 'adverseCausesInfo']
        this.activeNames = ['inspectionItem', 'basicInfo', 'inspectionInfo', 'adverseCausesInfo']
      } else {
        this.dataForm.unqualifiedQuantity = '0'
        this.inspectionItems = [
          { prop: 'name', label: '检验项目', value: '', type: 'view', minWidth: 120 },
          {
            prop: 'unqualifiedQuantity',
            label: '不合格数量',
            value: '0',
            type: 'input',
            itemDisabled: false,
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

        if (this.dataForm.processId) {
          const _data = { processId: this.dataForm.processId, num: this.dataForm.inspectionQuantity }
          let res = await getSamplingQuantityByProcessId(_data).catch(() => false)
          this.$set(this.dataForm, 'samplingQuantity', res.data)
          this.autosamplingQuantity = res.data
        } else {
          const _data = [{ productsId: this.dataForm.productsId, num: this.dataForm.inspectionQuantity }]
          let res = await getSamplingQuantityByProductId(_data).catch(() => false)
          this.$set(this.dataForm, 'samplingQuantity', res.data[0].spotCheckNum)
          this.autosamplingQuantity = res.data[0].spotCheckNum
        }

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
    },
    // 测试审批流
    getBusInfo() {
      let code =
        this.inspectionType === 'procure'
          ? 'b040'
          : this.inspectionType === 'external'
            ? 'b041'
            : this.inspectionType === 'sale_back'
              ? 'b042'
              : this.inspectionType === 'process'
                ? 'b043'
                : this.inspectionType === 'finished'
                  ? 'b044'
                  : 'b061'
      getBusinessFlowInfo(code)
        .then((res) => {
          if (res.data) {
            if (res.data.enabledMark) {
              this.flowData = res.data
              this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
              this.dataForm.approvalFlag = res.data.enabledMark
            } else {
              this.flowTemplateJson = {}
              this.dataForm.approvalFlag = false
              this.$message.error('未找到审批流程！')
            }
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
          }
        })
        .catch(() => { })
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
        itemDisabled: false,
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
  padding: 0 10px 10px;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 5px 10px;
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

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}

.el-table {
  border: 1px solid #ebeef5;
  /* 默认边框颜色 */
}
</style>
