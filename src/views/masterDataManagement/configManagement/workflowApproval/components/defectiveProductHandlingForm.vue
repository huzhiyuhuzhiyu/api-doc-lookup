<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', readOnly ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')" content="审批" />
        <div class="options" v-if="isShow != 'disabled'">
          <el-button type="success" :loading="btnLoading" @click="confirmOk('审批同意', 'ok', row)">
            审批同意</el-button>
          <el-button type="danger" :loading="btnLoading" @click="confirmOk('审批拒绝', 'rebut', row)">
            审批拒绝</el-button>
          <el-button type="primary" :loading="btnLoading" @click="confirmTrans('转审', 'transferred', row)">
            转审</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <el-tabs v-model="activeName">
              <el-tab-pane label="基础信息" name="jcInfo">
                <div class="subtitle">
                  <h5>基本信息</h5>
                </div>
                <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode" />
                <div class="subtitle">
                  <h5>产品信息</h5>
                </div>
                <TableForm-product :value="linesList" @input="linesChange" ref="linesForm" :tableItems="linesListItems"
                  :openMode="openMode" @openSide="openSide" />
              </el-tab-pane>
              <el-tab-pane label="附件" name="annex">
                <UploadWj v-model="datafilelist" :disabled="readOnly" :detailed="readOnly"></UploadWj>
              </el-tab-pane>
              <el-tab-pane label="流程信息" name="approvalFlow">
                <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="readOnly"
                  :nodeConfig.sync="busNodeConfig" ref="workflowRef" />
                <div class="noDataTip" v-if="!workVisible">
                  <span class="el-table__empty-text">
                    <div data-v-4d190d64="" class="el-empty">
                      <div class="el-empty__image" style="width: 120px;"><svg viewBox="0 0 79 86" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <defs>
                            <linearGradient id="linearGradient-1-48" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%">
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
              <el-tab-pane v-if="readOnly" label="流转记录" name="transferList">
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
      <okOrNo v-if="okOrNoVisible" ref="okForm" @close="closeForm" :approvalType="'defective'" />
      <transferForm v-if="transferFormVisible" ref="transferForm" @close="closeForm" />
      <WareSide v-if="wareVisibled" ref="wareSide" :openMode="'只读'" />
    </div>
  </transition>
</template>

<script>
import { addQcUnqualifiedData, updateQcUnqualifiedData, detailQcUnqualifiedData, detailInspectionData } from '@/api/inspectionManagement/index' // 产品检验项目列表
import { getInspectionList } from '@/api/inspectionManagement/index' // 检验单
import { inspectionTypeList } from '../data.js'
import TableFormProduct from "./TableForm-product.vue"
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
import { mapGetters, mapState } from 'vuex'
import okOrNo from './okOrNoForm.vue'
import transferForm from './transferForm.vue'
import WareSide from '@/views/inspectionManagement/components/WareSide.vue'
export default {
  components: { TableFormProduct, workFlow, okOrNo, transferForm, WareSide },
  data() {
    return {
      okOrNoVisible: false,
      transferFormVisible: false,
      datafilelist: [],
      activeName: "jcInfo",
      title: "新建不良品处理单",
      inspectionTypeList,
      visible: true,
      readOnly: false,
      btnLoading: false,
      formLoading: true,
      documentStatus: "",
      inspectionMethodList: [{ label: "免检", value: "exempt" }, { label: "抽检", value: "spot_check" }, { label: "全检", value: "all" }],
      dataForm: {},
      dataFormItems: [],

      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      dialogRequestObj: {
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
      isAnew: '',
      isShow: '',
      row: {},
      dataObj: {},
      wareVisibled: false,
    }
  },
  methods: {
    refeshDataFormItems() {
      this.dataFormItems = [
        {
          prop: "inspectionOrderNo", label: "检验单号", value: "", type: "custom", customComponent: "ComSelect-page", placeholder: '请选择检验单',
          dialogTitle: "选择检验单", renderTree: false, tableItems: [
            { prop: "orderNo", label: "检验单号", minWidth: 200 },
            { prop: "originOrderNo", label: "来源单号", minWidth: 200 },
            { prop: "inspectorName", label: "检验人" },
            { prop: "inspectionDate", label: "检验日期", width: 120 },
            { prop: "remark", label: "备注" }
          ], searchList: [{ prop: "orderNo", label: "检验单号", type: "input" }, { prop: "originOrderNo", label: "来源单号", type: "input" }],
          listMethod: getInspectionList, listRequestObj: this.dialogRequestObj, listDataFormatting: this.dialogListDataFormatting,
          change: this.inspectionOrderNoChange, placeholder: "请选择检验单", itemRules: [{ required: true, trigger: 'change' }], sm: 12
        },
        { prop: "description", label: "处理说明", value: "", type: "input", itemRules: [{ required: true, trigger: 'blur' }], sm: 12 },
        { prop: "remark", label: "备注", value: "", type: "textarea" }
      ]
    },
    refeshLinesListItems() {
      function generateTreatmentResultsList(inspectionType) { // 动态生成处理结果
        // 采购收货、外协收货、外协退料、生产退料 不良处理结果：合格、不合格、让步接收、挑选
        // 销售退货、生产巡检、生产完工检验 不良处理结果：合格、报废、返工返修、报废和返修
        return [
          { label: '合格', value: 'qualified', disabled: !['procure', 'external', 'sale_back', 'back_material', 'produce', 'process', 'finished'].includes(inspectionType) },
          { label: '不合格', value: 'unqualified', disabled: !['procure', 'external', 'back_material', 'produce'].includes(inspectionType) },
          { label: '让步接收', value: 'concessive_acceptance', disabled: !['procure', 'external', 'back_material', 'produce'].includes(inspectionType) },
          { label: '报废', value: 'discard', disabled: !['sale_back', 'process', 'finished'].includes(inspectionType) },
          { label: '挑选', value: 'select', disabled: !['procure', 'external', 'back_material', 'produce'].includes(inspectionType) },
          { label: '返工返修', value: 'repair', disabled: !['sale_back', 'process', 'finished'].includes(inspectionType) },
          { label: '报废和返修', value: 'discard_repair', disabled: !['sale_back', 'process', 'finished'].includes(inspectionType) },
        ].filter(o => !o.disabled)
      }
      this.linesListItems = [
        { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 120 },
        { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 120 },
        { prop: "productDrawingNo", label: "产品图号", value: "", type: 'view', minWidth: 200 },
        // { prop: "productInspectionMethod", label: "检验方式", value: "", type: 'select', options: [{ label: "免检", value: "exempt" }, { label: "抽检", value: "spot_check" }, { label: "全检", value: "all" }], minWidth: 120, itemDisabled: true },
        { prop: "routingName", label: "工艺路线名称", value: "", type: 'view', minWidth: 140, render: ['process', 'back_material', 'external', 'produce'].includes(this.inspectionType) },
        { prop: "processName", label: "工序名称", value: "", type: 'view', minWidth: 140, render: ['process', 'back_material', 'external', 'produce'].includes(this.inspectionType) },
        { prop: "inspectionQuantity", label: "报检数量", value: "", type: 'view', minWidth: 120 },
        { prop: "inspectionUnqualifiedQuantity", label: "检验不合格数量", value: "", type: 'view', minWidth: 150 },
        { prop: "mainUnit", label: "单位", value: "", type: "view", minWidth: 100 },
        {
          prop: "treatmentResults", label: "处理结果", value: undefined, type: "select", change: this.treatmentResultsChange,
          options: generateTreatmentResultsList(this.inspectionType), clearable: false,
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：处理结果${errMsg}`) }] }), trigger: 'change' },
            { required: true, trigger: 'change' },
          ], minWidth: 180, itemDisabled: this.userInfo.deptType !== 'JSB' || this.isShow === 'disabled',
          render: this.treatmentEffect()
        },
        {
          prop: "qualifiedQuantity", label: "合格数量", value: "", type: "input", minWidth: 180, itemDisabled: true,
          render: this.treatmentEffect()
        },
        {
          prop: "unqualifiedQuantity", label: "不合格数量", value: "", type: "input", minWidth: 180, itemDisabled: true,
          render: this.treatmentEffect()
        },
        { // 报废数量
          prop: "scrapQuantity", label: "报废数量", value: "", type: "input",
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：报废数量${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：报废数量${errMsg}`) }] }), trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'calc', params: [
                  this.numCalcMethod,
                  "报废数量+返工返修数量要等于对应不合格数量",
                  (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }]
              }), trigger: 'no'
            },
            {
              validator: this.formValidate({
                type: 'calc', params: [
                  (rowIndex) => {
                    let row = this.linesList[rowIndex]
                    if (!['discard', 'discard_repair'].includes(row.treatmentResults)) return true // 处理结果非报废或报废和返修，忽略校验
                    return row.scrapQuantity && Number(row.scrapQuantity) > 0
                  },
                  "处理结果为报废或报废和返修时，报废数量不能为0",
                  (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }
                ]
              }), trigger: 'blur'
            },
          ], minWidth: 180, itemDisabled: (rowIndex) => this.linesList[rowIndex].scrapQuantityDisabled || this.userInfo.deptType !== 'JSB',
          render: !['procure', 'external', 'produce', 'back_material'].includes(this.inspectionType) && this.treatmentEffect(),
        },
        { // 返工返修数量
          prop: "repairQuantity", label: "返工返修数量", value: "", type: "input",
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：返工返修数量${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：返工返修数量${errMsg}`) }] }), trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'calc', params: [
                  this.numCalcMethod,
                  "报废数量+返工返修数量要等于对应不合格数量",
                  (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }]
              }), trigger: 'no'
            },
            {
              validator: this.formValidate({
                type: 'calc', params: [
                  (rowIndex) => {
                    let row = this.linesList[rowIndex]
                    if (!['repair', 'discard_repair'].includes(row.treatmentResults)) return true // 处理结果非返工返修或报废和返修，忽略校验
                    return row.repairQuantity && Number(row.repairQuantity) > 0
                  },
                  "处理结果为返工返修或报废和返修时，返工返修数量不能为0",
                  (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }
                ]
              }), trigger: 'blur'
            },
          ], minWidth: 180, itemDisabled: (rowIndex) => this.linesList[rowIndex].repairQuantityDisabled || this.userInfo.deptType !== 'JSB',
          render: !['procure', 'external', 'produce', 'back_material'].includes(this.inspectionType) && this.treatmentEffect()
        },
      ]
      this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
    },
    // 处理结果更改
    treatmentResultsChange(val, scope) {
      // qualifiedQuantityDisabled   合格数量是否禁用
      // unqualifiedQuantityDisabled 不合格数量是否禁用
      // scrapQuantityDisabled       报废数量是否禁用
      // repairQuantityDisabled      返工返修数量是否禁用
      if (val === 'qualified' || val === 'concessive_acceptance') { // 合格、让步接收
        scope.row.qualifiedQuantity = scope.row.inspectionUnqualifiedQuantity
        scope.row.unqualifiedQuantity = 0
        scope.row.scrapQuantity = 0
        scope.row.repairQuantity = 0
        scope.row.qualifiedQuantityDisabled = true
        scope.row.unqualifiedQuantityDisabled = true
        scope.row.scrapQuantityDisabled = true
        scope.row.repairQuantityDisabled = true
      } else if (val === 'unqualified') { // 不合格
        scope.row.qualifiedQuantity = 0
        scope.row.unqualifiedQuantity = scope.row.inspectionUnqualifiedQuantity
        scope.row.scrapQuantity = 0
        scope.row.repairQuantity = 0
        scope.row.qualifiedQuantityDisabled = true
        scope.row.unqualifiedQuantityDisabled = true
        scope.row.scrapQuantityDisabled = true
        scope.row.repairQuantityDisabled = true
      } else if (val === 'select') { // 挑选
        scope.row.qualifiedQuantity = ''
        scope.row.unqualifiedQuantity = ''
        scope.row.scrapQuantity = 0
        scope.row.repairQuantity = 0
        scope.row.qualifiedQuantityDisabled = true
        scope.row.unqualifiedQuantityDisabled = true
        scope.row.scrapQuantityDisabled = true
        scope.row.repairQuantityDisabled = true
      } else if (val === 'discard') { // 报废
        scope.row.qualifiedQuantity = 0
        scope.row.unqualifiedQuantity = scope.row.inspectionUnqualifiedQuantity
        scope.row.scrapQuantity = scope.row.inspectionUnqualifiedQuantity
        scope.row.repairQuantity = 0
        scope.row.qualifiedQuantityDisabled = true
        scope.row.unqualifiedQuantityDisabled = true
        scope.row.scrapQuantityDisabled = true
        scope.row.repairQuantityDisabled = true
      } else if (val === 'repair') { // 返工返修
        scope.row.qualifiedQuantity = 0
        scope.row.unqualifiedQuantity = scope.row.inspectionUnqualifiedQuantity
        scope.row.scrapQuantity = 0
        scope.row.repairQuantity = scope.row.inspectionUnqualifiedQuantity
        scope.row.qualifiedQuantityDisabled = true
        scope.row.unqualifiedQuantityDisabled = true
        scope.row.scrapQuantityDisabled = true
        scope.row.repairQuantityDisabled = true
      } else if (val === 'discard_repair') { // 报废和返修
        scope.row.qualifiedQuantity = 0
        scope.row.unqualifiedQuantity = scope.row.inspectionUnqualifiedQuantity

        scope.row.qualifiedQuantityDisabled = true
        scope.row.unqualifiedQuantityDisabled = true
        scope.row.scrapQuantityDisabled = false
        scope.row.repairQuantityDisabled = false
      }
      console.log(val);
    },
    // 判断是否显示不良品审批时专属内容
    treatmentEffect() {
      if (!this.linesList.length) return false
      return this.userInfo.deptType === 'JSB' || this.linesList[0].treatmentResults // JSB技术部
    },
    // 计算校验(报废和返修)
    numCalcMethod(rowIndex) {
      let row = this.linesList[rowIndex]
      if (row.treatmentResults !== 'discard_repair') return true // 处理结果非报废和返修，忽略校验
      return this.jnpf.math('add', [row.scrapQuantity, row.repairQuantity]) === Number(row.unqualifiedQuantity)
    },
    init(row, readOnly, isShow, inspectionType) {
      console.log(row, readOnly, isShow, inspectionType);
      this.visible = true
      this.formLoading = true
      this.row = row
      this.isShow = isShow
      this.readOnly = readOnly == 'look' ? true : false
      let option = this.inspectionTypeList.find(o => o.label === inspectionType)
      this.inspectionType = option.value
      this.dialogRequestObj = { ...this.dialogRequestObj, notificationType: option.value }
      this.refeshDataFormItems()
      if (row.documentId && !this.isAnew) {
        this.title = readOnly ? '查看不良品处理单' : '编辑不良品处理单'
        // 获取详情
        detailQcUnqualifiedData(row.documentId).then(res => {
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
          let tempLinesList = res.data.lines
          tempLinesList.forEach(line => {
            if (line.treatmentResults === 'qualified' || line.treatmentResults === 'concessive_acceptance' || line.treatmentResults === 'unqualified') {
              line.qualifiedQuantityDisabled = true
              line.unqualifiedQuantityDisabled = true
            }
            line.realUnaualifiedQuantity = line.unqualifiedQuantity // 不良品处理单带出的不合格数量

            line.scrapQuantity = line.scrapQuantity || ''
            line.repairQuantity = line.repairQuantity || ''

            line.qualifiedQuantityDisabled = true
            line.unqualifiedQuantityDisabled = true
            line.scrapQuantityDisabled = true
            line.repairQuantityDisabled = true

          })
          console.log(this.linesList);
          this.linesList = tempLinesList
          this.refeshLinesListItems()
          this.formLoading = false
        }).catch(err => {
          this.formLoading = false
        })
        getSaleBusDetail(row.documentId).then(res => {
          console.log(res, '业务详情');
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
            }
            if (this.readOnly) {
              console.log(this.approvalForm, '++++++++++');
              this.transferQuery.documentId = row.documentId
              approvalTransferList(this.transferQuery).then(res => {
                console.log(res, '流转记录');
                this.transferData = res.data.records
              })
            }
          } else {
            this.busNodeConfig.childNode = null
          }
        })
      }
    },
    linesChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    dialogListDataFormatting(res) {
      let tempList = res.data.records
      tempList = tempList.map(item => {
        let inspectionMethod = this.inspectionMethodList.find(item2 => item2.value === item.inspectionMethod)
        inspectionMethod = inspectionMethod ? inspectionMethod.label : item.inspectionMethod
        return { ...item, inspectionMethod }
      })
      return tempList
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      console.log(obj);
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
    async confirmOk(title, state, row) {
      if (title === '审批同意') {

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

        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
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
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList ? item.nodeUserList[0].targetId : '',
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
            documentStatus: 'submit',
          }
        }

        // 校验表单表格（子数据列表）
        let form_2 = this.$refs['linesForm'].$children[0]
        let valid_2 = await form_2.validate().catch(err => false)
        if (!valid_2) {
          this.jnpf.focusErrValidItem(form_2.fields)
          this.btnLoading = false
          return
        }

        this.dataObj = {
          attachmentList: this.datafilelist,
          unqualified: this.dataForm,
          lines: this.linesList,
          form: form,
          formNodeList,
          nodeCondList: nodeJudg,
          ccList: ccLists,
        }
        // console.log(this.dataObj);
      }
      this.okOrNoVisible = true
      this.$nextTick(() => {
        this.$refs.okForm.init(title, state, row)
      })
    },
    confirmTrans(title, state, row) {
      this.transferFormVisible = true
      this.$nextTick(() => {
        this.$refs.transferForm.init(title, state, row)
      })
    },
    closeForm(isRefresh) {
      if (isRefresh) {
        this.$emit('close', true)
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
      this.$nextTick(() => { this.refeshLinesListItems() });
      return this.title.includes("新建") ? '新建' : this.title.includes("编辑") ? '编辑' : '只读'
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
  padding: 10px 30px;
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

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  padding: 0 20px;
}

::v-deep .workNode {
  // min-height: 1035px !important;
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
</style>