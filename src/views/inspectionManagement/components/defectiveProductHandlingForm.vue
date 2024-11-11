<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="$emit('close')" :content="title" />
        <div class="options" v-if="btnType !== 'look'">
          <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')"
            v-if="btnType !== 'setLoss'">保存草稿</el-button> -->
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            {{ btnType === 'setLoss' ? $t('common.submitButton') : '保存并提交' }}
          </el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <el-tabs v-model="activeName" v-if="!approvalFlag">
              <el-tab-pane label="基础信息" name="jcInfo">
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="处理信息" name="basicInfo" class="orderInfo">
                    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
                      :btnType="btnType === 'setLoss' ? 'look' : btnType" />
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
              <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                <UploadWj v-model="datafilelist" :disabled="btnType === 'look' || btnType === 'setLoss'"
                  :detailed="btnType === 'look' || btnType === 'setLoss'"></UploadWj>
              </el-tab-pane>

              <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
              </el-tab-pane>
              <el-tab-pane v-if="btnType == 'look' || btnType === 'setLoss'" label="流转记录" name="transferList">
                <recordList :list="flowTaskOperatorRecordList" :endTime="endTime" />
              </el-tab-pane>
            </el-tabs>
            <el-collapse v-model="activeNames" v-else>
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
                  :btnType="btnType === 'setLoss' ? 'look' : btnType" />
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
          </div>
        </div>
      </div>

      <WareSide v-if="wareVisibled" ref="wareSide" :openMode="'只读'" />
      <ComSelect-page ref="ComSelect-page" :tableItems="ProductTableItemss" title="查看图纸" :listMethod="getbimDrawingData"
        :listRequestObj="ProductListRequestObjs" :searchList="[]" :elementShow="false" :renderTree="false">
        <template slot="table-action">
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="currentChangelook(scope.row)" size="mini">查看</el-button>
              <el-button type="text" @click="downloadtuzhi(scope.row)" size="mini">下载</el-button>
            </template>
          </el-table-column>
        </template>
      </ComSelect-page>
      <Preview :visible.sync="previewVisible" :file="activeFile" />
    </div>
  </transition>
</template>

<script>
import { getDownloadUrl } from '@/api/common'
import { getbimDrawingData, getBimBusinessDetail } from '@/api/basicData/index'
import Preview from '@/components/upload-wj/Preview.vue'
import {
  addQcUnqualifiedData,
  updateQcUnqualifiedData,
  detailQcUnqualifiedData,
  detailInspectionData,
  lossQcUnqualifiedData
} from '@/api/inspectionManagement/index' // 产品检验项目列表
import { inspectionTypeList, inspectionResultsList, inspectionMethodList } from '../data.js'
import TableFormProduct from './TableForm-product.vue'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import TableFormWare from './TableForm-ware.vue'
import TableFormWareTwo from './TableForm-ware-two.vue'
import { mapGetters, mapState } from 'vuex'
import WareSide from './WareSide.vue'
import Process from '@/components/Process/Preview'
import recordList from '@/views/workFlow/components/RecordList.vue'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import busFlow from '@/mixins/generator/busFlow'
export default {
  components: { TableFormProduct, workFlow, WareSide, Preview, TableFormWare, TableFormWareTwo, Process, recordList },
  mixins: [busFlow],
  data() {
    return {
      isattachmentswitch: '',
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'inspectionInfo'],
      title: '新建不良品处理单',
      inspectionTypeList,
      inspectionResultsList,
      inspectionMethodList,
      visible: true,
      btnLoading: false,
      btnType: '',
      formLoading: true,
      documentStatus: '',
      dataForm: {},
      dataFormItems: [],
      inspectionInfo: [
        /* 通过 this.setDataFormItems() 动态更改 */
      ],
      linesList: [],
      linesListItems: [
        /* 通过 this.refeshLinesListItems() 动态更改 */
      ],
      dialogRequestObj: {
        inspectStatus: 'unInspect', // 排除已经生成不良品处理单的检验单
        handleFlag: false,
        unqualifiedFlag: true,
        approvalStatus: 'ok',
        createByName: '',
        documentStatus: 'submit',
        notificationType: null,
        inspectionMethod: '',
        inspectorId: '',
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
        orderNo: '',
        originOrderNo: '',
        pageNum: 1,
        pageSize: 20
      },
      spaceLines: [],
      productionLotList: [],
      inspectionType: '',
      formLoading: false,
      wareVisibled: false,
      ProductListRequestObjs: {},
      ProductTableItemss: [
        { prop: 'code', label: '产品编码' },
        { prop: 'name', label: '产品名称' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'sheetName', label: '图纸名称' },
        { prop: 'version', label: '版本' }
      ],
      getbimDrawingData,
      activeFile: {},
      previewVisible: false,
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
      flowData: {},
      formLoading: false,
      flowTemplateJson: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      qualifiedQuantityDisabled: false,
      endNode: false
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
  methods: {
    getBimBusinessDetail(inspectionType) {
      console.log(inspectionType, 'businessCode')
      let obj = {
        businessCode: 'attachment',
        configKey: `fj_${inspectionType}jyd`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isattachmentswitch = res.data.configValue1
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
    //查看图纸
    viewdrawings({ row }) {
      this.ProductListRequestObjs = {
        code: row.productCode,
        drawingNo: '',
        name: row.productName,
        orderItems: [{ asc: false, column: '' }, { asc: false, column: 'create_time' }],
        pageNum: 1,
        pageSize: 20
      }
      this.$refs['ComSelect-page'].openDialog()
    },
    // 刷新主表结构
    refeshDataFormItems() {
      function generateTreatmentResultsList(inspectionType) {
        // 动态生成处理结果
        // 采购收货、外协收货、外协退料、生产退料 不良处理结果：合格、不合格、让步接收、挑选
        // 销售退货、生产巡检、生产完工检验 不良处理结果：合格、报废、返工返修、报废和返修
        return [
          {
            label: '合格',
            value: 'qualified',
            disabled: !['procure', 'external', 'back_material', 'produce', 'process', 'finished'].includes(
              inspectionType
            )
          },
          {
            label: '不合格',
            value: 'unqualified',
            disabled: !['procure', 'external', 'back_material', 'produce'].includes(inspectionType)
          },
          {
            label: '让步接收',
            value: 'concessive_acceptance',
            disabled: !['procure', 'external', 'back_material', 'produce'].includes(inspectionType)
          },
          { label: '报废', value: 'discard', disabled: !['sale_back', 'process', 'finished'].includes(inspectionType) },
          {
            label: '挑选',
            value: 'select',
            disabled: !['procure', 'external', 'back_material', 'produce'].includes(inspectionType)
          },
          {
            label: '返工返修',
            value: 'repair',
            disabled: !['sale_back', 'process', 'finished'].includes(inspectionType)
          },
          {
            label: '报废和返修',
            value: 'discard_repair',
            disabled: !['sale_back', 'process', 'finished'].includes(inspectionType)
          }
        ].filter((o) => !o.disabled)
      }
      this.dataFormItems = [
        {
          prop: 'orderNo',
          label: '处理单号',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'treatmentResults',
          label: '处理结果',
          value: undefined,
          type: 'select',
          options: generateTreatmentResultsList(this.inspectionType),
          change: this.treatmentResultsChange,
          render: this.userInfo.deptType === 'JSB' || this.dataForm.approvalStatus === 'ok',
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 6,
          itemDisabled: this.btnType === 'look' ? true : false
        },

        {
          prop: 'qualifiedQuantity',
          label: '合格数量',
          value: '',
          type: 'input',
          sm: 6,
          render: this.userInfo.deptType === 'JSB' || this.dataForm.approvalStatus === 'ok',
          itemDisabled: this.qualifiedQuantityDisabled || this.btnType === 'look' ? true : false
        },

        {
          prop: 'unqualifiedQuantity',
          label: '不合格数量',
          value: '',
          type: 'input',
          sm: 6,
          render: this.userInfo.deptType === 'JSB' || this.dataForm.approvalStatus === 'ok',
          itemDisabled: this.unqualifiedQuantityDisabled || this.btnType === 'look' ? true : false
        },
        {
          prop: 'scrapQuantity',
          label: '报废数量',
          value: '',
          type: 'input',
          sm: 6,
          render:
            this.userInfo.deptType === 'JSB'
              ? !['procure', 'external', 'produce', 'back_material'].includes(this.inspectionType)
              : false || this.dataForm.approvalStatus === 'ok'
          // itemDisabled: this.unqualifiedQuantityDisabled || this.dataForm.approvalStatus === 'ok' ? true : false
        },
        {
          prop: 'repairQuantity',
          label: '返修数量',
          value: '',
          type: 'input',
          sm: 6,
          render:
            this.userInfo.deptType === 'JSB'
              ? !['procure', 'external', 'produce', 'back_material'].includes(this.inspectionType)
              : false || this.dataForm.approvalStatus === 'ok'
          // itemDisabled: this.unqualifiedQuantityDisabled || this.dataForm.approvalStatus === 'ok' ? true : false
        },
        {
          prop: 'description',
          label: '处理说明',
          value: '',
          type: 'textarea',
          render: this.userInfo.deptType === 'JSB' || this.dataForm.approvalStatus === 'ok'
        }

        // { prop: "description", label: "处理说明", value: "", type: "input", itemRules: [{ required: true, trigger: 'blur' }], sm: 6 },
      ]
      this.inspectionInfo = [
        {
          prop: 'inspectionOrderNo',
          label: '检验单号',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'inspectorId',
          label: '检验人',
          value: undefined,
          type: 'custom',
          customComponent: 'user-select',
          itemDisabled: true,
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
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 6
        },

        {
          prop: 'productDrawingNo',
          label: '品名规格',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6,
          itemDisabled: true
          // render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag
        },
        {
          prop: 'mainUnit',
          label: '单位',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6,
          itemDisabled: true
          // render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag
        },
        {
          prop: 'inspectionQuantity',
          label: '报检数量',
          value: '',
          type: 'input',
          sm: 6,
          itemDisabled: true
          // render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag
        },
        {
          prop: 'inspectionMethod',
          label: '检验方式',
          value: '',
          type: 'select',
          clearable: false,
          itemDisabled: true,
          change: this.inspectionMethodChange,
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 6,
          // itemDisabled: (rowIndex) => this.dataForm.inspectionMethod === 'exempt' || this.openMode === '只读',
          options: [
            { label: '免检', value: 'exempt' },
            { label: '抽检', value: 'spot_check' },
            { label: '全检', value: 'all' }
          ]
        },
        // { prop: "inspectionMethod", label: "检验方式", value: undefined, type: "select", options: [{ label: '全检', value: 'all' }, { label: '抽检', value: 'spot_check' }], itemRules: [{ required: true, trigger: 'change' }], sm: 6 },
        {
          prop: 'samplingQuantity',
          label: '检验数量',
          value: '',
          type: 'input',
          sm: 6,
          // render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          itemDisabled: this.dataForm.inspectionMethod == 'all' || this.openMode === '只读'
        },
        {
          prop: 'inspectionResults',
          label: '检验结果',
          value: undefined,
          type: 'select',
          options: [{ label: '合格', value: 'qualified' }, { label: '不合格', value: 'unqualified' }],
          change: this.inspectionResultsChange,
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 6,
          itemDisabled: true
        },
        {
          prop: 'inspectionUnqualifiedQuantity',
          label: '检验不合格数量',
          value: '',
          type: 'input',
          sm: 6,
          // render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          itemDisabled: true
        }
      ]
    },
    // 刷新子表结构
    refeshLinesListItems() {
      this.linesListItems = [
        { prop: 'productCode', label: '产品编码', value: '', type: 'view', minWidth: 140 },
        { prop: 'productName', label: '产品名称', value: '', type: 'view', minWidth: 140 },
        { prop: 'productDrawingNo', label: '产品图号', value: '', type: 'view', minWidth: 300 },
        // { prop: "productInspectionMethod", label: "检验方式", value: "", type: 'select', options: [{ label: "免检", value: "exempt" }, { label: "抽检", value: "spot_check" }, { label: "全检", value: "all" }], minWidth: 120, itemDisabled: true },
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
        { prop: 'inspectionQuantity', label: '报检数量', value: '', type: 'view', minWidth: 120 },
        { prop: 'inspectionUnqualifiedQuantity', label: '检验不合格数量', value: '', type: 'view', minWidth: 150 },
        { prop: 'mainUnit', label: '单位', value: '', type: 'view', minWidth: 100 },
        {
          // 处理结果
          prop: 'treatmentResults',
          label: '处理结果',
          value: '',
          type: 'select',
          options: this.inspectionResultsList,
          itemRules: [{ required: true, trigger: 'blur' }],
          minWidth: 180,
          itemDisabled: true,
          render: this.dataForm.approvalStatus === 'ok'
        },
        {
          // 合格数量
          prop: 'qualifiedQuantity',
          label: '合格数量',
          value: '',
          type: 'input',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：合格数量${errMsg}`)
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
                    this.$message.error(`产品信息第${index + 1}行：合格数量${errMsg}`)
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
                    this.jnpf.math('add', [
                      this.linesList[rowIndex].qualifiedQuantity,
                      this.linesList[rowIndex].unqualifiedQuantity
                    ]) === Number(this.linesList[rowIndex].inspectionUnqualifiedQuantity),
                  '合格数量+不合格数量要等于对应检验不合格数量',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
                  }
                ]
              }),
              trigger: 'no'
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [
                  (rowIndex) =>
                    !(
                      this.linesList[rowIndex].treatmentResults === 'select' &&
                      this.linesList[rowIndex].qualifiedQuantity == 0
                    ),
                  '处理结果为挑选时合格数量不能等于0',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
                  }
                ]
              }),
              trigger: 'no'
            }
          ],
          minWidth: 180,
          itemDisabled: (rowIndex) => this.linesList[rowIndex].treatmentResults !== 'select' || this.btnType === 'look',
          render: this.dataForm.approvalStatus === 'ok'
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
                  (rowIndex) =>
                    this.jnpf.math('add', [
                      this.linesList[rowIndex].qualifiedQuantity,
                      this.linesList[rowIndex].unqualifiedQuantity
                    ]) === Number(this.linesList[rowIndex].inspectionUnqualifiedQuantity),
                  '合格数量+不合格数量要等于对应检验不合格数量',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
                  }
                ]
              }),
              trigger: 'no'
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [
                  (rowIndex) =>
                    !(
                      this.linesList[rowIndex].treatmentResults === 'select' &&
                      this.linesList[rowIndex].unqualifiedQuantity == 0
                    ),
                  '处理结果为挑选时不合格数量不能等于0',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
                  }
                ]
              }),
              trigger: 'no'
            }
          ],
          minWidth: 180,
          input: this.calcLossPrice,
          itemDisabled: (rowIndex) => this.linesList[rowIndex].treatmentResults !== 'select' || this.btnType === 'look',
          render: this.dataForm.approvalStatus === 'ok'
        },
        {
          // 报废数量
          prop: 'scrapQuantity',
          label: '报废数量',
          value: '',
          type: 'input',
          minWidth: 180,
          itemDisabled: true,
          render:
            !['procure', 'external', 'produce', 'back_material'].includes(this.inspectionType) &&
            this.dataForm.approvalStatus === 'ok'
        },
        {
          // 返工返修数量
          prop: 'repairQuantity',
          label: '返工返修数量',
          value: '',
          type: 'input',
          minWidth: 180,
          itemDisabled: true,
          render:
            !['procure', 'external', 'produce', 'back_material'].includes(this.inspectionType) &&
            this.dataForm.approvalStatus === 'ok'
        },
        {
          // 损失单价
          prop: 'lossUnitPrice',
          label: '损失单价',
          value: '',
          type: 'view',
          minWidth: 180,
          itemDisabled: (rowIndex) =>
            this.btnType === 'look' ||
            ['qualified', 'concessive_acceptance'].includes(this.linesList[rowIndex].treatmentResults),
          render: this.inspectionType !== 'process' && this.dataForm.approvalStatus === 'ok'
        },
        {
          // 损失金额
          prop: 'lossAmount',
          label: '损失金额',
          value: '',
          type:
            this.btnType === 'setLoss' || (this.btnType === 'look' && this.dataForm.lossFlag)
              ? this.inspectionType === 'process'
                ? 'input'
                : 'view'
              : 'view',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal',
                params: [
                  20,
                  6,
                  '',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：损失金额${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ],
          input: this.calcLossPrice,
          itemDisabled: (rowIndex) =>
            this.btnType === 'look' ||
            ['qualified', 'concessive_acceptance'].includes(this.linesList[rowIndex].treatmentResults),
          render: this.dataForm.approvalStatus === 'ok'
        },
        {
          // 其他损失金额
          prop: 'otherLossAmount',
          label: '其他损失金额',
          value: '',
          type: this.btnType === 'setLoss' || (this.btnType === 'look' && this.dataForm.lossFlag) ? 'input' : 'view',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：其他损失金额${errMsg}`)
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
                  6,
                  '',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：其他损失金额${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ],
          minWidth: 180,
          input: this.calcLossPrice,
          itemDisabled: (rowIndex) =>
            this.btnType === 'look' ||
            ['qualified', 'concessive_acceptance'].includes(this.linesList[rowIndex].treatmentResults),
          render: this.dataForm.approvalStatus === 'ok'
        },
        {
          // 损失总金额
          prop: 'totalLossAmount',
          label: '损失总金额',
          value: '0',
          type: 'view',
          minWidth: 180,
          render: this.dataForm.approvalStatus === 'ok'
        },
        {
          // 索赔金额
          prop: 'claimAmount',
          label: '索赔金额',
          value: '',
          type: this.btnType === 'setLoss' || (this.btnType === 'look' && this.dataForm.lossFlag) ? 'input' : 'view',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal',
                params: [
                  20,
                  6,
                  '',
                  (errMsg, index) => {
                    this.$message.error(`产品信息第${index + 1}行：索赔金额${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ],
          minWidth: 180,
          itemDisabled: (rowIndex) =>
            this.btnType === 'look' ||
            ['qualified', 'concessive_acceptance'].includes(this.linesList[rowIndex].treatmentResults),
          render: this.dataForm.approvalStatus === 'ok'
        }
      ]
      this.$nextTick(() => {
        this.$refs.linesForm.setDefaultValue()
      })
    },
    // 计算损失金额与损失总金额
    async calcLossPrice(val, scope) {
      await this.$nextTick()
      if (this.inspectionType !== 'process') {
        scope.row.lossAmount = this.jnpf.numberFormat(scope.row.unqualifiedQuantity * scope.row.lossUnitPrice, 6)
      }
      scope.row.totalLossAmount = this.jnpf.math('add', [scope.row.lossAmount, scope.row.otherLossAmount])
    },
    // 初始化
    init(id, btnType, approvalFlag, inspectionType) {
      this.getBimBusinessDetail(inspectionType)
      this.dataForm.unqualifiedQuantity = 0
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      let option = this.inspectionTypeList.find((o) => o.value === inspectionType)
      this.inspectionType = inspectionType
      this.approvalFlag = approvalFlag
      // this.$nextTick(() => { this.dataFormFlag = true })

      if (id) {
        if (btnType === 'add') {
          this.inspectionOrderNoChange(id)
          // this.fetchData('UQDH', true)
          this.refeshDataFormItems()
          this.refeshLinesListItems()
          this.title = '新建不良品处理单'

          this.formLoading = false
        }
        if (btnType === 'anew') {
          // 重新提交
          this.inspectionOrderNoChange(id)
          this.fetchData('UQDH', true)
          this.refeshDataFormItems()
          this.refeshLinesListItems()
          this.title = '新建不良品处理单'
        } else if (btnType === 'edit') {
          this.title = '编辑不良品处理单'
        } else if (btnType === 'look') {
          this.fetchData('UQDH', false)
          // this.refeshDataFormItems()
          this.refeshLinesListItems()
          this.title = '查看不良品处理单'
          // 获取详情
          detailQcUnqualifiedData(id)
            .then(async (res) => {
              if (res.data.attachmentList.length !== 0) {
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

              this.dataForm = res.data.unqualified
              this.dataForm.inspectionMethod = res.data.inspection.inspectionMethod

              this.dataForm.inspectionResults = res.data.inspection.inspectionResults
              this.dataForm.inspectionUnqualifiedQuantity = res.data.inspection.unqualifiedQuantity
              this.inspectionList = res.data.itemList
              this.linesListTwo = res.data.causesList
              // 流程信息和流转记录
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
              this.refeshDataFormItems()
              this.refeshLinesListItems()
              let tempLinesList = res.data.lines

              tempLinesList.forEach((line) => {
                if (
                  line.treatmentResults === 'qualified' ||
                  line.treatmentResults === 'concessive_acceptance' ||
                  line.treatmentResults === 'unqualified'
                ) {
                  line.qualifiedQuantityDisabled = true
                  line.unqualifiedQuantityDisabled = true
                }

                // 损失相关处理
                if (this.inspectionType !== 'process') {
                  line.lossAmount = this.jnpf.numberFormat(line.lossUnitPrice * line.unqualifiedQuantity, 6)
                } else {
                  line.lossUnitPrice = 0
                  line.lossAmount = 0
                }
                if (line.treatmentResults === 'qualified' || line.treatmentResults === 'concessive_acceptance') {
                  line.otherLossAmount = 0
                  line.claimAmount = 0
                } else {
                  if (btnType === 'setLoss') {
                    line.otherLossAmount = '' // 设置损失时，其他损失金额默认空，需要手动输入
                  }
                }
              })

              if (btnType === 'look') {
                if (!this.dataForm.lossFlag) {
                  // 没有设置过损失，查看时损失相关显示为空内容
                  tempLinesList.forEach((line) => {
                    line.lossUnitPrice = ' '
                    line.lossAmount = ' '
                    line.otherLossAmount = ' '
                    line.totalLossAmount = ' '
                    line.claimAmount = ' '
                  })
                }
              } else if (btnType === 'anew') {
                // 重新提交
                this.$nextTick(() => {
                  this.getBusInfo()
                }) // 审批
              }

              this.linesList = tempLinesList

              this.formLoading = false
            })
            .catch((err) => {
              this.formLoading = false
            })
        } else if (btnType === 'setLoss') {
          this.title = '损失上报'
        }

        // 编辑或查看，获取保存的审批单详情

        if (btnType === 'edit' || btnType === 'look' || btnType === 'setLoss') {
          // 流程信息和流转记录
          // if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
        }
      } else {
        this.fetchData('UQDH', true)
        this.refeshDataFormItems()
        this.refeshLinesListItems()
        this.title = '新建不良品处理单'

        this.getBusInfo()
        this.formLoading = false
      }
    },
    // 处理结果更改
    treatmentResultsChange(val, scope) {
      // qualifiedQuantityDisabled   合格数量是否禁用
      // unqualifiedQuantityDisabled 不合格数量是否禁用
      // scrapQuantityDisabled       报废数量是否禁用
      // repairQuantityDisabled      返工返修数量是否禁用
      if (val === 'qualified' || val === 'concessive_acceptance') {
        // 合格、让步接收
        this.dataForm.qualifiedQuantity = this.dataForm.inspectionUnqualifiedQuantity
        this.dataForm.unqualifiedQuantity = 0
        this.dataForm.scrapQuantity = 0
        this.dataForm.repairQuantity = 0
        this.qualifiedQuantityDisabled = true
        this.unqualifiedQuantityDisabled = true
        this.scrapQuantityDisabled = true
        this.repairQuantityDisabled = true
      } else if (val === 'unqualified') {
        // 不合格
        this.dataForm.qualifiedQuantity = 0
        this.dataForm.unqualifiedQuantity = this.dataForm.inspectionUnqualifiedQuantity
        this.dataForm.scrapQuantity = 0
        this.dataForm.repairQuantity = 0
        this.qualifiedQuantityDisabled = true
        this.unqualifiedQuantityDisabled = true
        this.scrapQuantityDisabled = true
        this.repairQuantityDisabled = true
      } else if (val === 'select') {
        // 挑选
        this.dataForm.qualifiedQuantity = ''
        this.dataForm.unqualifiedQuantity = ''
        this.dataForm.scrapQuantity = 0
        this.dataForm.repairQuantity = 0
        this.qualifiedQuantityDisabled = false
        this.unqualifiedQuantityDisabled = false
        this.scrapQuantityDisabled = true
        this.repairQuantityDisabled = true
      } else if (val === 'discard') {
        // 报废
        this.dataForm.qualifiedQuantity = 0
        this.dataForm.unqualifiedQuantity = this.dataForm.inspectionUnqualifiedQuantity
        this.dataForm.scrapQuantity = this.dataForm.inspectionUnqualifiedQuantity
        this.dataForm.repairQuantity = 0
        this.qualifiedQuantityDisabled = true
        this.unqualifiedQuantityDisabled = true
        this.scrapQuantityDisabled = true
        this.repairQuantityDisabled = true
      } else if (val === 'repair') {
        // 返工返修
        this.dataForm.qualifiedQuantity = 0
        this.dataForm.unqualifiedQuantity = this.dataForm.inspectionUnqualifiedQuantity
        this.dataForm.scrapQuantity = 0
        this.dataForm.repairQuantity = this.dataForm.inspectionUnqualifiedQuantity
        this.qualifiedQuantityDisabled = true
        this.unqualifiedQuantityDisabled = true
        this.scrapQuantityDisabled = true
        this.repairQuantityDisabled = true
      } else if (val === 'discard_repair') {
        // 报废和返修
        this.dataForm.qualifiedQuantity = 0
        this.dataForm.unqualifiedQuantity = this.dataForm.inspectionUnqualifiedQuantity
        this.dataForm.scrapQuantity = 0
        this.dataForm.repairQuantity = 0
        this.qualifiedQuantityDisabled = true
        this.unqualifiedQuantityDisabled = true
        this.scrapQuantityDisabled = false
        this.repairQuantityDisabled = false
      }

      this.refeshDataFormItems()
    },
    // 提交
    async handleConfirm(submitModel) {
      if (this.dataForm.treatmentResults == 'select') {
        if (
          Number(this.dataForm.unqualifiedQuantity) + Number(this.dataForm.qualifiedQuantity) !==
          Number(this.dataForm.inspectionUnqualifiedQuantity)
        )
          return this.$message.error('合格数量+不合格数量不等于检验不合格数量。')
      }
      if (this.dataForm.treatmentResults == 'discard_repair') {
        if (
          Number(this.dataForm.scrapQuantity) + Number(this.dataForm.repairQuantity) !==
          Number(this.dataForm.inspectionUnqualifiedQuantity)
        )
          return this.$message.error('报废数量+返修数量不等于检验不合格数量。')
      }
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用

      // 校验主表
      let form_1 = this.$refs['dataForm'].$children[0]
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        // 校验失败，聚焦第一失败项，继续校验后续项
        if (submitFlag) {
          // 聚焦第一个失败的表单元素
          let formItems = form_1.$children[0].$children
          for (let j = 0; j < formItems.length; j++) {
            let formItem = formItems[j].$children[0].$children[0]
            if (formItem.validateState === 'error') {
              this.activeName = 'jcInfo'
              submitFlag = false
              this.jnpf.focusItem(formItem.$children[1].$el)
              this.$nextTick(() => {
                this.jnpf.formItemValidate(formItem)
              })
              break
            }
          }
        }
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['linesForm'].$children[0]
      let valid_2 = await form_2.validate().catch((err) => false)
      if (!valid_2 && submitFlag) {
        let formItems = form_2.fields
        formItems.some((formItem) => {
          if (formItem.validateState === 'error') {
            this.activeName = 'jcInfo'
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => {
              this.jnpf.formItemValidate(formItem)
            })
            return true
          }
        })
      }

      // // 判断子表是否有效
      // if (!this.linesList.length && submitFlag) {
      //   submitFlag = false
      //   this.$message.error('请至少选择一个产品')
      // }

      // 自动聚焦未使用则提交
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
        this.dataForm.inspectionId = this.dataForm.id
        let formMethod = ''

        if (!this.btnType || this.btnType === 'add' || this.btnType === 'anew') {
          formMethod = addQcUnqualifiedData
        } else if (this.btnType === 'edit') {
          formMethod = updateQcUnqualifiedData
        } else if (this.btnType === 'setLoss') {
          // 损失上报
          formMethod = lossQcUnqualifiedData
        }
        if (this.userInfo.deptType === 'JSB') {
          this.dataForm.treatmentDescription = this.dataForm.description
          this.dataForm.treatmentResults = this.dataForm.treatmentResults
          this.dataForm.treatmentQualifiedQuantity = this.dataForm.qualifiedQuantity
          this.dataForm.treatmentUnqualifiedQuantity = this.dataForm.unqualifiedQuantity
          this.dataForm.treatmentScrapQuantity = this.dataForm.scrapQuantity
          this.dataForm.treatmentRepairQuantity = this.dataForm.repairQuantity
        }

        let dataObj = {
          attachmentList: this.datafilelist,
          unqualified: this.dataForm,
          flowData: this.flowData
        }

        formMethod(dataObj)
          .then((res) => {
            let msg = res.msg
            if (res.msg === 'Success') {
              msg = submitModel == 'submit' ? '提交成功' : '保存成功'
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
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
    // 子表数据更改
    linesChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    // 检验单更改
    inspectionOrderNoChange(id) {
      this.formLoading = true
      detailInspectionData(id)
        .then((res) => {
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
          let oldObj = { ...res.data.inspection, approvalFlag: false }
          delete oldObj.treatmentResults
          this.dataForm = oldObj
          this.dataForm.orderNo = ''
          this.dataForm.inspectionOrderNo = res.data.inspection.orderNo
          this.dataForm.inspectionUnqualifiedQuantity = this.dataForm.unqualifiedQuantity
          // this.dataForm.inspectionUnqualifiedQuantity = res.data.inspection.unqualifiedQuantity

          this.inspectionList = res.data.itemList
          this.linesListTwo = res.data.causesList
          // 获取审批模版
          this.getBusInfo()
          let tempLinesList = res.data.lines.filter((line) => line.unqualifiedQuantity != '0')

          tempLinesList.forEach((line) => {
            line.inspectionUnqualifiedQuantity = line.unqualifiedQuantity
            line.qualifiedQuantity = ''
            line.unqualifiedQuantity = ''
            line.scrapQuantity = ''
            line.repairQuantity = ''
            line.inspectionLineId = line.id
            line.id = ''

            line.scrapQuantityDisabled = true
            line.repairQuantityDisabled = true
          })

          if (['sale_back', 'process', 'finished'].includes(this.inspectionType.replace('_batch', ''))) {
            tempLinesList.forEach((line) => {
              line.unqualifiedQuantity = line.inspectionUnqualifiedQuantity
              line.qualifiedQuantity = this.jnpf.math('subtract', [line.inspectionQuantity, line.unqualifiedQuantity])
            })
          }

          this.linesList = tempLinesList
          this.formLoading = false
        })
        .catch((err) => {
          this.formLoading = false
        })
    },

    // 打开抽屉
    openSide(scope) {
      this.wareVisibled = true
      this.$nextTick(() => {
        this.$refs['wareSide'].init({ ...scope }, true)
      })
    },
    // 测试审批流
    getBusInfo() {
      let code =
        this.inspectionType === 'procure'
          ? 'b003'
          : this.inspectionType === 'sale_back'
            ? 'b006'
            : this.inspectionType === 'produce'
              ? 'b047'
              : 'b004'
      getBusinessFlowInfo(code)
        .then((res) => {
          if (res.data) {
            if (res.data.enabledMark) {
              this.flowData = res.data
              this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
              this.dataForm.approvalFlag = res.data.enabledMark
              console.log(this.dataForm.approvalFlag)
              console.log(this.dataForm.orderNo, 'no')
              if (!this.dataForm.orderNo) {
                this.fetchData('UQDH', true)
              }
            } else {
              this.flowTemplateJson = {}
              this.dataForm.approvalFlag = false
              this.$message.error('未找到审批流程！')
            }
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
            if (!this.dataForm.orderNo) {
              this.fetchData('UQDH', true)
            }
          }
        })
        .catch(() => { })
    },
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id)
        .then((res) => {
          if (res.data) {
            this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson
              ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson)
              : null
            this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
            let nodeCode = res.data.flowTaskInfo.thisStepId
            let nodeList = res.data.flowTaskNodeList
            let findItem = nodeList.find((item) => item.nodeCode === nodeCode)
            if (findItem) {
              if (findItem.nodeNext === 'end') {
                this.endNode = true
              }
            }
            this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
            let flowTaskNodeList = res.data.flowTaskNodeList
            if (flowTaskNodeList.length) {
              for (let i = 0; i < flowTaskNodeList.length; i++) {
                const nodeItem = flowTaskNodeList[i]
                const loop = (data) => {
                  if (Array.isArray(data)) data.forEach((d) => loop(d))
                  if (data.nodeId === nodeItem.nodeCode) {
                    if (nodeItem.type == 0) data.state = 'state-past'
                    if (nodeItem.type == 1) data.state = 'state-curr'
                    if (
                      nodeItem.nodeType === 'approver' ||
                      nodeItem.nodeType === 'start' ||
                      nodeItem.nodeType === 'subFlow'
                    )
                      data.content = nodeItem.userName
                    if (nodeItem.nodeType === 'approver') data.processingTime = nodeItem.processingTime
                    return
                  }
                  if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                  if (data.childNode) loop(data.childNode)
                }
                loop(this.flowTemplateJson)
              }
            }
          }
        })
        .catch(() => { })
    }
  },
  computed: {
    openMode() {
      // return this.dataForm.submitFlag === 'add' ? '新建' : this.title.includes('查看') ? '只读' : '编辑'
      if (this.title.includes('不良品')) {
        return this.title === '生产巡检' ? '新建' : '只读'
      }
      return this.title.substr(0, 2) == '检验' ? '新建' : '只读'
    },
    rowNum() {
      // this.$nextTick(() => { this.linesListItems = this.initLinesListItems() }) // rowNum发生改变，重新渲染linesListItems
      // let tempUnqualifiedQuantity = this.$parent.title.includes('检') ? (this.scope.row ? this.scope.row.unqualifiedQuantity : 0) :
      //   (this.scope.row ? this.scope.row.inspectionUnqualifiedQuantity : 0)
      // return this.scope.row ? tempUnqualifiedQuantity ? tempUnqualifiedQuantity : 0 : 0

      return this.dataForm.inspectionUnqualifiedQuantity
        ? this.dataForm.inspectionUnqualifiedQuantity
        : this.dataForm.unqualifiedQuantity
    },
    nowNum() {
      let tempNum = 0
      this.inspectionList.forEach((item) => {
        tempNum += item.inspectionUnqualifiedQuantity ? Number(item.inspectionUnqualifiedQuantity) : 0
      })

      let tempUnqualifiedQuantity = this.dataForm.inspectionUnqualifiedQuantity
        ? this.dataForm.inspectionUnqualifiedQuantity
        : 0

      let newNumber = this.scope ? this.jnpf.math('subtract', [tempUnqualifiedQuantity, tempNum]) : 0

      return this.jnpf.numberFormat(newNumber, 4)
    },
    nowNumTwo() {
      let tempNum = 0
      this.linesListTwo.forEach((item) => {
        tempNum += item.inspectionUnqualifiedQuantity ? Number(item.inspectionUnqualifiedQuantity) : 0
      })
      let tempUnqualifiedQuantity = this.dataForm.inspectionUnqualifiedQuantity
        ? this.dataForm.inspectionUnqualifiedQuantity
        : 0
      let newNumber = this.scope ? this.jnpf.math('subtract', [tempUnqualifiedQuantity, tempNum]) : 0
      return this.jnpf.numberFormat(newNumber, 4)
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
  padding: 11px 10px;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  // padding: 0 20px;
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

::v-deep .workNode {
  // min-height: 1045px !important;
  background-color: #f5f5f7 !important;
}

.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
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

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 0 10px 10px;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
</style>
