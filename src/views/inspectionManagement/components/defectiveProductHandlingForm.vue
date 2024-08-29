<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')" :content="title" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')"
            v-if="btnType !== 'setLoss'">保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            {{ btnType === 'setLoss' ? $t('common.submitButton') : '保存并提交' }}
          </el-button>
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

                    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
                      :btnType="btnType === 'setLoss' ? 'look' : btnType" />
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
              <el-tab-pane label="附件" name="annex">
                <UploadWj v-model="datafilelist" :disabled="btnType === 'look' || btnType === 'setLoss'"
                  :detailed="btnType === 'look' || btnType === 'setLoss'"></UploadWj>
              </el-tab-pane>
              <el-tab-pane label="流程信息" name="approvalFlow">
                <workFlow v-if="workVisible" :nodeFirst="firstOneNode"
                  :btnType="btnType === 'look' || btnType === 'setLoss'" :nodeConfig.sync="busNodeConfig"
                  ref="workflowRef" />
                <div class="noDataTip" v-if="!workVisible">
                  <span class="el-table__empty-text">
                    <div data-v-4d190d64="" class="el-empty">
                      <div class="el-empty__image" style="width: 120px;"><svg viewBox="0 0 79 86" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <defs>
                            <linearGradient id="linearGradient-1-48" x1="38.8503086%" y1="0%" x2="61.1496914%"
                              y2="100%">
                              <stop stop-color="#FCFCFD" offset="0%"></stop>
                              <stop stop-color="#EEEFF3" offset="100%"></stop>
                            </linearGradient>
                            <linearGradient id="linearGradient-2-48" x1="0%" y1="9.5%" x2="100%" y2="90.5%">
                              <stop stop-color="#FCFCFD" offset="0%"></stop>
                              <stop stop-color="#E9EBEF" offset="100%"></stop>
                            </linearGradient>
                            <rect id="path-3-48" x="0" y="0" width="17" height="36"></rect>
                          </defs>
                          <g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="B-type" transform="translate(-1268.000000, -535.000000)">
                              <g id="Group-2" transform="translate(1268.000000, 535.000000)">
                                <path id="Oval-Copy-2"
                                  d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z"
                                  fill="#F7F8FC"></path>
                                <polygon id="Rectangle-Copy-14" fill="#E5E7E9"
                                  transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) "
                                  points="13 58 53 58 42 45 2 45"></polygon>
                                <g id="Group-Copy"
                                  transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)">
                                  <polygon id="Rectangle-Copy-10" fill="#E5E7E9"
                                    transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) "
                                    points="2.84078316e-14 3 18 3 23 7 5 7"></polygon>
                                  <polygon id="Rectangle-Copy-11" fill="#EDEEF2"
                                    points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon>
                                  <rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-48)"
                                    transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) "
                                    x="38" y="7" width="17" height="36"></rect>
                                  <polygon id="Rectangle-Copy-13" fill="#F8F9FB"
                                    transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) "
                                    points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon>
                                </g>
                                <rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-48)" x="13" y="45" width="40"
                                  height="36"></rect>
                                <g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)">
                                  <mask id="mask-4-48" fill="white">
                                    <use xlink:href="#path-3-48"></use>
                                  </mask>
                                  <use id="Mask" fill="#E0E3E9"
                                    transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) "
                                    xlink:href="#path-3-48"></use>
                                  <polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-48)"
                                    transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) "
                                    points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon>
                                </g>
                                <polygon id="Rectangle-Copy-18" fill="#F8F9FB"
                                  transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) "
                                  points="62 45 79 45 70 58 53 58"></polygon>
                              </g>
                            </g>
                          </g>
                        </svg></div>
                      <div class="el-empty__description">
                        <p>暂无流程信息</p>
                      </div><!---->
                    </div>
                  </span>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="btnType === 'look' || btnType === 'setLoss'" label="流转记录" name="transferList">
                <el-table v-loading="formLoading" :data="transferData">
                  <el-table-column prop="businessName" label="审批业务名称" min-width="160" />
                  <el-table-column prop="processedName" label="办理人名称" min-width="160" />
                  <el-table-column prop="remark" label="备注" min-width="160" />
                  <el-table-column prop="startDate" label="开始时间" min-width="160" />
                  <el-table-column prop="endDate" label="结束时间" min-width="160" />
                  <el-table-column prop="consumingTime" label="耗时" min-width="160" />
                </el-table>
              </el-tab-pane>
            </el-tabs>
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
import { getbimDrawingData } from "@/api/basicData/index";
import Preview from "@/components/upload-wj/Preview.vue";
import { addQcUnqualifiedData, updateQcUnqualifiedData, detailQcUnqualifiedData, detailInspectionData, lossQcUnqualifiedData } from '@/api/inspectionManagement/index' // 产品检验项目列表
import { getInspectionList } from '@/api/inspectionManagement/index' // 检验单
import { inspectionTypeList, inspectionResultsList, inspectionMethodList } from '../data.js'
import TableFormProduct from "./TableForm-product.vue"
import workFlow from '@/components/WorkFlow/settingBus.vue'
import TableFormWare from "./TableForm-ware.vue"
import TableFormWareTwo from "./TableForm-ware-two.vue"
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
import { mapGetters, mapState } from 'vuex'
import WareSide from './WareSide.vue'
export default {
  components: { TableFormProduct, workFlow, WareSide, Preview, TableFormWare, TableFormWareTwo },
  data() {
    return {
      datafilelist: [],
      activeName: "jcInfo",
      activeNames: ['productInfo', 'basicInfo', 'inspectionInfo', 'adverseCausesInfo'],
      title: "新建不良品处理单",
      inspectionTypeList,
      inspectionResultsList,
      inspectionMethodList,
      visible: true,
      btnLoading: false,
      btnType: '',
      formLoading: true,
      documentStatus: "",
      dataForm: {},
      dataFormItems: [],

      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      dialogRequestObj: {
        inspectStatus: 'unInspect', // 排除已经生成不良品处理单的检验单
        handleFlag: false,
        unqualifiedFlag: true,
        approvalStatus: "ok",
        createByName: "",
        documentStatus: "submit",
        notificationType: null,
        inspectionMethod: "",
        inspectorId: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        orderNo: "",
        originOrderNo: "",
        pageNum: 1,
        pageSize: 20,
      },
      spaceLines: [],
      productionLotList: [],
      inspectionType: '',
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: "发起人",
        nodeType: 0,
        type: 'node',
        priorityLevel: "",
        approvalType: "appoint",
        selectMode: "",
        selectRange: "",
        directorLevel: "",
        examineMode: "",
        whenEmpty: "",
        examineEndDirectorLevel: "",
        ccSelfSelectFlag: "",
        conditionList: [],
        nodeUserList: [],
        childNode: null,
        conditionNodes: []
      },
      approvalForm: {},
      firstOneNode: [],
      // 审批 转审记录参数
      transferQuery: {
        approvalFormId: '',
        createByName: "",
        documentId: '',
        endTime: "",
        keyword: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
      transferData: [],
      formLoading: false,
      wareVisibled: false,
      ProductListRequestObjs: {},
      ProductTableItemss: [
        { prop: 'code', label: '产品编码' },
        { prop: 'name', label: '产品名称' },
        { prop: 'drawingNo', label: '产品图号' },
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
        { prop: "name", label: "不良原因名称", value: "", type: 'view', minWidth: 180 },
        {
          prop: "unqualifiedQuantity", label: "不良品数量", value: "", type: "input", itemRules: [
            { required: true, trigger: "blur" },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`不良品数量：${errMsg}`) }), trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('不良品数量：' + errMsg) }] }), trigger: 'blur' }
          ], minWidth: 180
        },
        { prop: "remark", label: "备注", value: "", type: 'input', minWidth: 120 },
      ],
      productList: [],
      codeConfig: {}
    }
  },
  beforeCreate() {
    this.initLinesListItems = () => [
      { prop: "name", label: "检验项目", value: "", type: 'view', minWidth: 120 },
      {
        prop: "unqualifiedQuantity", label: "不合格数量", value: "0", type: "input", itemRules: [
          { required: true, trigger: "blur" },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('不合格数量：' + errMsg) }] }), trigger: 'blur' }
        ], minWidth: 180
      },
      { prop: "remark", label: "备注", value: "", type: 'input', minWidth: 120 },
    ]
  },
  methods: {
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
      getDownloadUrl('document', row.filepath).then(res => {
        this.jnpf.downloadFile(res.data.url, row.filename)
      })
    },
    //查看图纸
    viewdrawings({ row }) {
      this.ProductListRequestObjs = {
        code: row.productCode,
        drawingNo: "",
        name: row.productName,
        orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }],
        pageNum: 1,
        pageSize: 20,
      }
      this.$refs['ComSelect-page'].openDialog()
    },
    // 刷新主表结构
    refeshDataFormItems() {
      this.dataFormItems = [
        {
          prop: 'orderNo',
          label: '处理单号',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 12
        },
        {
          prop: 'inspectionOrderNo',
          label: '检验单号',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 12
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
          sm: 12
        },
        {
          prop: 'unqualifiedQuantity',
          label: '不合格数量',
          value: '',
          type: 'input',
          sm: 12,
          render: this.inspectionType.indexOf('_batch') === -1 && !this.batchFlag,
          itemDisabled: this.dataForm.unqualifiedQuantity == '0' || this.openMode === '只读'
        },
        // { prop: "description", label: "处理说明", value: "", type: "input", itemRules: [{ required: true, trigger: 'blur' }], sm: 12 },
        { prop: "description", label: "处理说明", value: "", type: "textarea" }
      ]
    },
    // 刷新子表结构
    refeshLinesListItems() {
      this.linesListItems = [
        { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 140 },
        { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 140 },
        { prop: "productDrawingNo", label: "产品图号", value: "", type: 'view', minWidth: 300 },
        // { prop: "productInspectionMethod", label: "检验方式", value: "", type: 'select', options: [{ label: "免检", value: "exempt" }, { label: "抽检", value: "spot_check" }, { label: "全检", value: "all" }], minWidth: 120, itemDisabled: true },
        { prop: "routingName", label: "工艺路线名称", value: "", type: 'view', minWidth: 140, render: ['process', 'back_material', 'external', 'produce'].includes(this.inspectionType) },
        { prop: "processName", label: "工序名称", value: "", type: 'view', minWidth: 140, render: ['process', 'back_material', 'external', 'produce'].includes(this.inspectionType) },
        { prop: "inspectionQuantity", label: "报检数量", value: "", type: 'view', minWidth: 120 },
        { prop: "inspectionUnqualifiedQuantity", label: "检验不合格数量", value: "", type: 'view', minWidth: 150 },
        { prop: "mainUnit", label: "单位", value: "", type: "view", minWidth: 100 },
        { // 处理结果
          prop: "treatmentResults", label: "处理结果", value: "", type: "select", options: this.inspectionResultsList,
          itemRules: [{ required: true, trigger: 'blur' }], minWidth: 180, itemDisabled: true, render: this.dataForm.approvalStatus === 'ok'
        },
        { // 合格数量
          prop: "qualifiedQuantity", label: "合格数量", value: "", type: "input",
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：合格数量${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：合格数量${errMsg}`) }] }), trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'calc', params: [
                  (rowIndex) => this.jnpf.math('add', [this.linesList[rowIndex].qualifiedQuantity, this.linesList[rowIndex].unqualifiedQuantity]) === Number(this.linesList[rowIndex].inspectionUnqualifiedQuantity),
                  "合格数量+不合格数量要等于对应检验不合格数量",
                  (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }]
              }), trigger: 'no'
            },
            {
              validator: this.formValidate({
                type: 'calc', params: [
                  (rowIndex) => !(this.linesList[rowIndex].treatmentResults === 'select' && this.linesList[rowIndex].qualifiedQuantity == 0),
                  "处理结果为挑选时合格数量不能等于0",
                  (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }]
              }), trigger: 'no'
            }
          ], minWidth: 180,
          itemDisabled: (rowIndex) => this.linesList[rowIndex].treatmentResults !== 'select' || this.btnType === 'look',
          render: this.dataForm.approvalStatus === 'ok'
        },
        { // 不合格数量
          prop: "unqualifiedQuantity", label: "不合格数量", value: "", type: "input",
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：不合格数量${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：不合格数量${errMsg}`) }] }), trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'calc', params: [
                  (rowIndex) => this.jnpf.math('add', [this.linesList[rowIndex].qualifiedQuantity, this.linesList[rowIndex].unqualifiedQuantity]) === Number(this.linesList[rowIndex].inspectionUnqualifiedQuantity),
                  "合格数量+不合格数量要等于对应检验不合格数量",
                  (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }]
              }), trigger: 'no'
            },
            {
              validator: this.formValidate({
                type: 'calc', params: [
                  (rowIndex) => !(this.linesList[rowIndex].treatmentResults === 'select' && this.linesList[rowIndex].unqualifiedQuantity == 0),
                  "处理结果为挑选时不合格数量不能等于0",
                  (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }]
              }), trigger: 'no'
            },
          ], minWidth: 180, input: this.calcLossPrice,
          itemDisabled: (rowIndex) => this.linesList[rowIndex].treatmentResults !== 'select' || this.btnType === 'look',
          render: this.dataForm.approvalStatus === 'ok'
        },
        { // 报废数量
          prop: "scrapQuantity", label: "报废数量", value: "", type: "input", minWidth: 180, itemDisabled: true,
          render: !['procure', 'external', 'produce', 'back_material'].includes(this.inspectionType) && this.dataForm.approvalStatus === 'ok'
        },
        { // 返工返修数量
          prop: "repairQuantity", label: "返工返修数量", value: "", type: "input", minWidth: 180, itemDisabled: true,
          render: !['procure', 'external', 'produce', 'back_material'].includes(this.inspectionType) && this.dataForm.approvalStatus === 'ok'
        },
        { // 损失单价
          prop: "lossUnitPrice", label: "损失单价", value: "", type: "view", minWidth: 180,
          itemDisabled: (rowIndex) => this.btnType === 'look' || ['qualified', 'concessive_acceptance'].includes(this.linesList[rowIndex].treatmentResults),
          render: this.inspectionType !== 'process' && this.dataForm.approvalStatus === 'ok'
        },
        { // 损失金额
          prop: "lossAmount", label: "损失金额", value: "",
          type: this.btnType === 'setLoss' || (this.btnType === 'look' && this.dataForm.lossFlag) ? this.inspectionType === 'process' ? 'input' : "view" : 'view',
          minWidth: 180, itemRules: [
            { validator: this.formValidate({ type: 'decimal', params: [20, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：损失金额${errMsg}`) }] }), trigger: 'blur' },
          ], input: this.calcLossPrice,
          itemDisabled: (rowIndex) => this.btnType === 'look' || ['qualified', 'concessive_acceptance'].includes(this.linesList[rowIndex].treatmentResults),
          render: this.dataForm.approvalStatus === 'ok'
        },
        { // 其他损失金额
          prop: "otherLossAmount", label: "其他损失金额", value: "", type: this.btnType === 'setLoss' || (this.btnType === 'look' && this.dataForm.lossFlag) ? "input" : 'view',
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：其他损失金额${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：其他损失金额${errMsg}`) }] }), trigger: 'blur' },
          ], minWidth: 180,
          input: this.calcLossPrice,
          itemDisabled: (rowIndex) => this.btnType === 'look' || ['qualified', 'concessive_acceptance'].includes(this.linesList[rowIndex].treatmentResults),
          render: this.dataForm.approvalStatus === 'ok'
        },
        { // 损失总金额
          prop: "totalLossAmount", label: "损失总金额", value: "0", type: "view", minWidth: 180, render: this.dataForm.approvalStatus === 'ok'
        },
        { // 索赔金额
          prop: "claimAmount", label: "索赔金额", value: "", type: this.btnType === 'setLoss' || (this.btnType === 'look' && this.dataForm.lossFlag) ? "input" : 'view',
          itemRules: [
            { validator: this.formValidate({ type: 'decimal', params: [20, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：索赔金额${errMsg}`) }] }), trigger: 'blur' }
          ], minWidth: 180,
          itemDisabled: (rowIndex) => this.btnType === 'look' || ['qualified', 'concessive_acceptance'].includes(this.linesList[rowIndex].treatmentResults),
          render: this.dataForm.approvalStatus === 'ok'
        },
      ]
      this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
    },
    // 计算损失金额与损失总金额
    async calcLossPrice(val, scope) {
      await this.$nextTick();
      if (this.inspectionType !== 'process') {
        scope.row.lossAmount = this.jnpf.numberFormat(scope.row.unqualifiedQuantity * scope.row.lossUnitPrice, 6)
      }
      scope.row.totalLossAmount = this.jnpf.math('add', [scope.row.lossAmount, scope.row.otherLossAmount])
    },
    // 初始化
    init(row, btnType, inspectionType, businessCode) {
      let id = row.id
      // this.inspectionOrderNoChange(row.id)
      this.dataForm = row
      this.dataForm.inspectionOrderNo = row.orderNo
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      let option = this.inspectionTypeList.find(o => o.value === inspectionType)
      this.inspectionType = inspectionType
      this.businessCode = businessCode
      this.dialogRequestObj = { ...this.dialogRequestObj, notificationType: option.value, businessCode }

      // this.$nextTick(() => { this.dataFormFlag = true })
      this.fetchData('UQDH', true)
      this.refeshDataFormItems()
      this.refeshLinesListItems()
      this.title = '新建不良品处理单'
      this.getApproverData()
      this.formLoading = false
      if (id) {
        if (btnType === 'anew') { // 重新提交
          this.title = '新建不良品处理单'
        } else if (btnType === 'edit') {
          this.title = '编辑不良品处理单'
        } else if (btnType === 'look') {
          this.title = '查看不良品处理单'
        } else if (btnType === 'setLoss') {
          this.title = '损失上报'
        }
        // 获取详情
        detailQcUnqualifiedData(id).then(async res => {
          console.log(res, 'res1998')
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push(
                {
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                }
              )
            })
          }

          this.dataForm = res.data.unqualified
          this.inspectionList = res.data.itemList
          this.linesListTwo = res.data.causesList
          let tempLinesList = res.data.lines

          tempLinesList.forEach(line => {
            if (line.treatmentResults === 'qualified' || line.treatmentResults === 'concessive_acceptance' || line.treatmentResults === 'unqualified') {
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
            if (!this.dataForm.lossFlag) { // 没有设置过损失，查看时损失相关显示为空内容
              tempLinesList.forEach(line => {
                line.lossUnitPrice = ' '
                line.lossAmount = ' '
                line.otherLossAmount = ' '
                line.totalLossAmount = ' '
                line.claimAmount = ' '
              })
            }
          } else if (btnType === 'anew') { // 重新提交
            this.$nextTick(() => { this.getApproverData() }) // 审批
          }

          this.linesList = tempLinesList
          this.refeshDataFormItems()
          this.refeshLinesListItems()
          this.formLoading = false
        }).catch(err => {
          this.formLoading = false
        })

        // 编辑或查看，获取保存的审批单详情
        if (btnType === 'edit' || btnType === 'look' || btnType === 'setLoss') {
          getSaleBusDetail(id).then(res => {
            if (res.data) {
              this.firstOneNode = []
              this.approvalForm = res.data.form
              this.transferQuery.approvalFormId = this.approvalForm.id
              this.firstOneNode.push({
                name: res.data.form.createByName
              })
              let data = res.data.formNodeTree.childNode
              if (data) {
                this.addNodeTypeAndNodeName(data)

                this.busNodeConfig.childNode = data
                this.workVisible = true
                // this.$nextTick(() => {
                //   this.$refs.workflowRef.initData('busing', this.btnType)
                // })
              } else { // 新建草稿时没有设置审批流程
                this.busNodeConfig.childNode = null
                this.getApproverData()
              }
              if (this.btnType === 'look' || this.btnType === 'setLoss') {
                this.transferQuery.documentId = id
                approvalTransferList(this.transferQuery).then(res => {
                  this.transferData = res.data.records // 流转记录
                })
              }
            } else {
              this.busNodeConfig.childNode = null
              this.getApproverData() // 临时补偿 移动端保存的单据没有审批
            }
          })
        }
      } else {
        this.fetchData('UQDH', true)
        this.refeshDataFormItems()
        this.refeshLinesListItems()
        this.title = '新建不良品处理单'
        this.getApproverData()
        this.formLoading = false
      }
    },
    // 提交
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用
      // 审批条件参数列表
      let nodeCondList = []
      // 审批抄送人列表
      let ccList = []
      let ccLists = []
      let nodeJudg = []
      // 业务审批单流程节点列表
      let formNodeList = []
      // 业务审批单
      let form = {}
      // 限制审批人员 和 抄送人员 离职情况 节点值空的时候限制提交
      let templateLineList = []
      // 新增时审批
      if (this.btnType === 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map(item => {
            return {
              ...item,
              nodeUserList: item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')

          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }
          if (templateLineList.length && submitModel === 'submit') {
            submitFlag = templateLineList.every(item => item.nodeUserList.length)
            if (!submitFlag) {
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && submitModel === 'submit') {
            submitFlag = ccList.every(item => item.nodeUserList.length)
            if (!submitFlag) {
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          }
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: item.name == '审核人' ? 'no' : '',
              adminId: '',
              id: '',
              previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
              ccToId: item.targetId,
              approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
              id: '',
              defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1,
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: submitModel,
            documentId: '',
            id: ''
          }
        }
      } else {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map(item => {
            return {
              ...item,
              nodeUserList: item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }
          if (templateLineList.length && submitModel === 'submit') {
            submitFlag = templateLineList.every(item => item.nodeUserList.length)
            if (!submitFlag) {
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && submitModel === 'submit') {
            submitFlag = ccList.every(item => item.nodeUserList.length)
            if (!submitFlag) {
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          }
          // return
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              // previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              // name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalFormId: item.approvalFormId ? item.approvalFormId : this.approvalForm.id,
              approvalFormNodeCode: item.approvalFormNodeCode ? item.approvalFormNodeCode : item.code,
              ccToId: item.targetId,
              id: item.id ? item.id : ''
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: submitModel,
          }
        }
      }

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
              this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
              break
            }
          }
        }
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['linesForm'].$children[0]
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.activeName = 'jcInfo'
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }

      // // 判断子表是否有效
      // if (!this.linesList.length && submitFlag) {
      //   submitFlag = false
      //   this.$message.error('请至少选择一个产品')
      // }

      // 是否配置好审批
      if (submitModel === 'submit' && this.dataForm.approvalFlag && submitFlag) {
        if (!this.busNodeConfig.childNode) {
          submitFlag = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach(item => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                this.activeName = 'approvalFlow'
                submitFlag = false
                this.$message.error('未配置发起人自选！')
              }
            }
          })
        }
      }

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
        this.dataForm.businessCode = this.businessCode
        this.dataForm.inspectionId = this.dataForm.id
        let formMethod = ''
        console.log(this.btnType, 'btn')
        if (!this.btnType || this.btnType === 'add' || this.btnType === 'anew') {
          formMethod = addQcUnqualifiedData
        } else if (this.btnType === 'edit') {
          formMethod = updateQcUnqualifiedData
        } else if (this.btnType === 'setLoss') { // 损失上报
          formMethod = lossQcUnqualifiedData
        }
        let dataObj = {
          attachmentList: this.datafilelist,
          unqualified: this.dataForm,
          // lines: this.linesList,
          // form: form,
          // formNodeList,
          // nodeCondList: nodeJudg,
          // ccList: ccLists,
        }


        if (location.hostname === 'localhost' || location.href.indexOf('mode=dev') !== -1) { // 调试
          let flag = await confirm('确定提交吗？')
          if (!flag) {
            console.log(dataObj)
            this.btnLoading = false
            return
          }
        }

        formMethod(dataObj).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
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
        }).catch(() => {
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
        this.spaceLines = this.spaceLines.filter(item => item.productsId !== data.row.productsId)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          item.remark = ""
          item.productCode = item.code
          item.productsId = item.id
          const hasFlag = this.linesList.find(i => item.productId === i.productsId)
          if (hasFlag) { hasItemList.push(item.productName) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        }
        this.linesList = tempList.map(item => { return { ...item, warehouseId: this.dataForm.warehouseId } })
        this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() });
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
      detailInspectionData(id).then(res => {
        console.log(res, 'res123')
        this.inspectionList = res.data.itemList
        this.linesListTwo = res.data.causesList
        let tempLinesList = res.data.lines.filter(line => line.unqualifiedQuantity != '0')
        tempLinesList.forEach(line => {
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
          tempLinesList.forEach(line => {
            line.unqualifiedQuantity = line.inspectionUnqualifiedQuantity
            line.qualifiedQuantity = this.jnpf.math('subtract', [line.inspectionQuantity, line.unqualifiedQuantity])
          })
        }

        this.linesList = tempLinesList
        // 获取审批模版
        this.$nextTick(() => { this.getApproverData() })
        this.formLoading = false
      }).catch(err => { this.formLoading = false })
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      if (obj) {
        if (obj.name === "审核人") {
          obj.nodeType = 1;
          obj.nodeName = obj.name;
          obj.directorLevel = obj.approvalType == "manager" ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == "multilevel" ? obj.levelSupervisor : ''
        }
        if (obj.name === "路由") {
          obj.nodeType = 4;
        }
        if (obj.name === "抄送人") {
          obj.nodeType = 2;
          obj.nodeName = obj.name;
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode);
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map(item => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(','); // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',');
                  var resultArr = [];
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      };
                      resultArr.push(option);
                    }
                  }
                }
                return {
                  ...item,
                  columnDbname: item.name,
                  columnType: item.dataType,
                  showName: item.name,
                  tjCode: item.code,
                  zdy1: item.comparisonValue,
                  columnId: item.approvalBusinessId,
                  options: resultArr,
                  optType: item.dataType == 'number' ? (item.operationalFormula == 'lt' ? '1' : item.operationalFormula == 'gt' ? '2' : item.operationalFormula == 'eq' ? '4' : item.operationalFormula == 'ge' ? '5' : item.operationalFormula == 'le' ? '3' : '') : ''

                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode);
            }
          }
        }
      }
    },
    // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null });
        if (node.type === 'node') {

          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {

              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code);
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
        }
      }
      return flattenedNodes;
    },
    // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = ''  // 条件符号
      let result = null     // 判断条件是否成立
      let condList = []
      let code
      if (this.inspectionType === 'procure') code = 'b003'
      else if (this.inspectionType === 'external') code = 'b004'
      else if (this.inspectionType === 'produce') code = 'b008'
      else if (this.inspectionType === 'sale_back') code = 'b006'
      else if (this.inspectionType === 'back_material') code = 'b007'
      else if (this.inspectionType === 'process') code = 'b005'
      else if (this.inspectionType.replace('_batch', '') === 'finished') code = 'b022'
      if (code) {
        getBusDetail(code).then(res => {
          state = res.data.business.state
          condExpress = res.data.business.condExpress
          // if (res.data.businessConditionList.length) {
          //   res.data.businessConditionList.forEach(item => {
          //     condList.push({
          //       code: item.code,
          //       val: item.code === 'numCode' ? this.totalNum : this.totalPrice
          //     })
          //   })
          // }
          if (state === 'condition') {
            this.dataForm.approvalFlag = 1
            for (var i = 0; i < condArr.length; i++) {
              if (condExpress.includes(condArr[i])) {
                foundSymbol = condArr[i];
                break;
              }
            }
            // 找到符号并进行销售报价业务判断
            if (foundSymbol) {
              const parts = condExpress.split(foundSymbol); // 使用 ">" 符号拆分字符串
              const leftValue = parts[0]; // 提取 ">" 符号左边的值
              const rightValue = parts[1]; // 提取 ">" 符号右边的值
              // if (leftValue == 'numCode') {
              //   const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
              //   result = eval(condition); // 执行条件判断
              // } else {
              //   const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
              //   result = eval(condition); // 执行条件判断
              // }
              if (result) {
                let query = {
                  businessCode: code,
                  condList,
                }
                busApprovalFlowTree(query).then(res => {
                  if (res.data) {
                    this.firstOneNode = []
                    this.approvalForm = res.data.template
                    this.firstOneNode.push({
                      name: this.userInfo.userName
                    })
                    let data = res.data.tempLineTree.childNode
                    if (data) {
                      this.addNodeTypeAndNodeName(data)
                      this.busNodeConfig.childNode = data
                      this.workVisible = true
                      this.$nextTick(() => {
                        this.$refs.workflowRef.initData('busing', this.type)
                      })
                    }
                  } else {
                    this.busNodeConfig.childNode = null
                  }
                })
              } else {
                this.busNodeConfig.childNode = null
              }
            }
          }
          if (state === 'enable') {
            this.dataForm.approvalFlag = 1
            let query = {
              businessCode: code,
              condList,
            }
            busApprovalFlowTree(query).then(res => {
              if (res.data) {
                this.firstOneNode = []
                this.approvalForm = res.data.template
                this.firstOneNode.push({
                  name: this.userInfo.userName
                })
                let data = res.data.tempLineTree.childNode
                if (data) {
                  this.addNodeTypeAndNodeName(data)
                  this.busNodeConfig.childNode = data
                  this.workVisible = true
                  this.$nextTick(() => {
                    this.$refs.workflowRef.initData('busing', this.type)
                  })
                }
              } else {
                this.busNodeConfig.childNode = null
              }
            })
          }
          if (state === 'disabled') {
            this.dataForm.approvalFlag = 0
            this.busNodeConfig.childNode = null
          }
        })
      }

    },
    // 打开抽屉
    openSide(scope) {
      this.wareVisibled = true
      this.$nextTick(() => {
        this.$refs['wareSide'].init({ ...scope }, true)
      })
    },
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
    ...mapGetters(['userInfo']),
  },
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
  padding-bottom: 0px
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}
</style>