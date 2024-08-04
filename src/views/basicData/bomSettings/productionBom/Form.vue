<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form" ref="main">

      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="title" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-left treeBox" v-if="title !== '新建BOM' && !statusFlag">
            <div class="JNPF-common-title">
              <h2>BOM树</h2>
              <span class="options">
                <el-dropdown>
                  <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="init(firstId, btnType)">刷新数据</el-dropdown-item>
                    <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                    <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
            <el-scrollbar class="JNPF-common-el-tree-scrollbar">
              <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                v-loading="treeLoading" highlight-current :current-node-key="selectedNodeKey"
                :expand-on-click-node="false" node-key="productId" @node-click="handleNodeClick"
                class="JNPF-common-el-tree" v-if="refreshTree">
                <span
                  :class="[(data.childrenList && data.childrenList.length > 0) ? 'custom-tree-node' : 'disabled-span']"
                  slot-scope="{ data }" :title="data.name">
                  <i
                    :class="[(data.childrenList && data.childrenList.length > 0) ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                  <span class="text" :title="data.productName">{{ data.productName }}</span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
          <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="jcInfo" class="jcInfo">
                  <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :btnType="btnType" />
                </el-collapse-item>



                <el-collapse-item title="产品信息" name="productInfo">
                  <TableForm-product :value="linesList" @input="contentChanges" ref="tableForm"
                    :tableItems="linesListItems" :btnType="btnType" @addth="addOrDelLinesItem"
                    @deleteth="addOrDelLinesItem" customStyle />
                </el-collapse-item>

              </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="附件" name="annex">
                  <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'">
                  </UploadWj>
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow">
                  <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="btnType"
                    :nodeConfig.sync="busNodeConfig" ref="workflowRef" />
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
                <el-tab-pane v-if="btnType == 'look'" label="流转记录" name="transferList">
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
      </div>
    </div>
  </transition>
</template>

<script>
import { addBomData, updateBomData, detailBomData, checkBomCodeExist, getBomByProductId, checkLoopBug, getBomTree } from "@/api/basicData/index"

import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import TableFormProduct from '@/components/no_mount/TableForm-product/index' // 产品选择组件
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
import { mapGetters, mapState } from 'vuex'
export default {
  components: { TableFormProduct, workFlow },
  data() {
    return {
      activeNames: ["productInfo", "basicInfo"],
      datafilelist: [],
      activeName: "jcInfo",
      btnType: 'add',
      visible: true,
      btnLoading: false,
      treeLoading: true,
      formLoading: true,
      title: "",
      autoCode: undefined,
      refreshTree: true,
      treeData: [],
      selectedNodeKey: "",
      defaultProps: {
        children: 'childrenList',
        label: 'name',
      },
      expands: true,
      firstId: "",
      dataForm: {},
      documentStatus: "",
      dataFormItems: [
        // { prop: "code", label: "BOM编码", value: "", type: "input", itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate('enCode'), trigger: 'blur' }], sm: 12 },
        // { prop: "name", label: "BOM名称", value: "", type: "input", itemRules: [{ required: true, trigger: "blur" }], sm: 12 },
        { prop: "productName", label: "产品名称", value: "", type: 'custom', customComponent: "ComSelect-page", itemRules: [{ required: true, trigger: "blur" }], sm: 12, readOnly: true },
        {
          prop: "pickingWay", label: "领料方式", value: "", type: "select", options: [{ label: "按生产订单领料", value: "production_order" }, { label: "按派工单领料", value: "dispatch_list" }],
          itemRules: [{ required: true, trigger: "change" }], sm: 12
        },
        { prop: "drawNo", label: "品名规格", value: "", type: 'input', itemDisabled: true, sm: 24, placeholder: ' ' },
        { prop: "remark", label: "备注", value: "", type: 'textarea' }
      ],
      linesList: [],

      linesListItems: [
        { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 160 },
        { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 160 },
        { prop: "drawingNo", label: "品名规格", value: "", type: 'view', minWidth: 340 },
        { prop: "qty", label: "数量", value: "1", type: "input", itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量：' + errMsg) }] }), trigger: 'blur' }], minWidth: 120 },
        { prop: "mainUnit", label: "单位", value: "", type: "view", minWidth: 120 },
        { prop: "lossRate", label: "损耗率(%)", value: "0", type: "input", placeholder: "请输入损耗率", itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('损耗率：' + errMsg) }] }), trigger: 'blur' }], minWidth: 120 },
        { prop: "fixedLoss", label: "固定损耗", value: "0", type: "input", itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('固定损耗：' + errMsg) }] }), trigger: 'blur' }], minWidth: 120 },
        { prop: "reduceType", label: "扣减料方式", value: "picking", type: "select", options: [{ label: "生成领料单", value: "picking" }, { label: "自动扣减料", value: "auto" }, { label: "都不是", value: "none" }], itemRules: [{ required: true, trigger: "change" }], minWidth: 160 },
        { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200, minWidth: 160 },
      ],
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "accessories", "semi_finished", "finish_product"],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号' },
        { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeText', label: '产品分类' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input', },
        { prop: "name", label: "产品名称", type: 'input', },
        { prop: "drawingNo", label: "品名规格", type: 'input' }
      ], // 产品选择弹出框搜索条件
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
      isDoubleFlag:false,
      approvalStatus:'',
      statusFlag:false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.dataFormItems.forEach(tc => {
      this.dataForm[tc.prop] = tc.value || ""; // 设置默认value
      // 添加自定义表单元素方法和参数
      if (tc.type == "custom") {
        // 若干需要选择的产品
        if (tc.prop === 'productName') {
          tc.dialogTitle = '选择产品'
          tc.placeholder = '请选择产品'
          tc.treeTitle = '产品分类'
          tc.methodArr = this.ProductMethodArr
          tc.listMethod = getProductList
          tc.listRequestObj = this.ProductListRequestObj
          tc.tableItems = this.ProductTableItems
          tc.searchList = this.ProductTableSearchList
          tc.change = this.ProductChange
          tc.paramsObj = { prop: tc.prop, oldVal: this.dataForm[tc.prop.slice(0, -4) + 'Id'] }
          // if (!tc.itemRules) { line.itemRules = [] }
          // tc.itemRules.push({
          //   validator: (rule, value, callback) => {
          //     let flag = this.linesList.find(item => item.id === this.dataForm.productId)
          //     if (flag) {
          //       callback(new Error('父产品不能与子产品相同'))
          //       // this.$message.error(`子产品不能与父产品相同：${value}`)
          //     }
          //     else { callback() }
          //   },
          //   trigger: 'change'
          // })
        }
        else { console.warn(tc.prop + "不在判断条件内") }
      }
      // 添加校验编码唯一性的规则
      if (tc.prop === 'code') {
        if (!tc.itemRules) { tc.itemRules = [] }
        tc.itemRules.push({
          validator: (rule, value, callback) => {
            if (!value) { callback() }
            else if (this.dataForm.code === this.autoCode) { callback() }
            else {
              checkBomCodeExist(this.dataForm.code).then((res) => {
                if (!res.data) { callback() }
                else { callback(new Error('此BOM编码已存在')) }
              }).catch((err) => { callback(new Error(" ")) })
            }
          },
          trigger: 'blur'
        })
      }
    })
  },
  methods: {
    async init(productId, btnType, approvalStatus,nodeData) {
      console.log(approvalStatus,'approvalStatus')
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.approvalStatus = approvalStatus ?  approvalStatus.approvalStatus : ''
      this.statusFlag = this.approvalStatus == 'rebut' || this.approvalStatus == 'withdrawn' || this.approvalStatus == 'ing' ? true : false
      let loadTotal = 0
      if (productId && this.btnType != 'add' && !this.statusFlag) {
        console.log('12121212')
        this.firstId = this.firstId ? this.firstId : productId
        this.title = btnType === 'look' ? '查看BOM' : '编辑BOM'
        // 获取详情
        let bomId = (await getBomByProductId(productId)).data
        detailBomData(bomId).then(res => {
          this.autoCode = res.data.bom.code
          this.dataForm = JSON.parse(JSON.stringify(res.data.bom))
          // btnType !== 'look' ? this.getApproverData() : ''
          this.documentStatus = res.data.bom.documentStatus
          this.linesList = res.data.lines.map(line => {
            return {
              ...line,
              drawingNo: line.drawingNo ? line.drawingNo : line.drawNo
            }
          })
          if (++loadTotal === 2) {
            this.formLoading = false
            this.treeLoading = false
          }

          // 整理BOM树
          // let tempObj = JSON.parse(JSON.stringify(this.dataForm))
          // tempObj.children = JSON.parse(JSON.stringify(res.data.lines))
          // if (!nodeData) {
          //   this.selectedNodeKey = this.firstId
          //   this.treeData = [tempObj]
          // }
          // else if (!nodeData.children) { this.$set(nodeData, 'children', tempObj.children) }

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
        }).catch(() => { this.btnLoading = false })
        getSaleBusDetail(bomId).then(res => {
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
                if (this.btnType == 'look') {
                  console.log(this.approvalForm, '++++++++++');
                  this.transferQuery.documentId = bomId
                  approvalTransferList(this.transferQuery).then(res => {
                    console.log(res, '流转记录');
                    this.transferData = res.data.records
                  })
                }
              } else {
                this.busNodeConfig.childNode = null
              }
            })
        // 获取bom树
        if (!this.treeData.length) {
          getBomTree(bomId).then(res => {
            this.treeData = res.data
            if (!nodeData) this.selectedNodeKey = this.firstId
            if (++loadTotal === 2) {
              this.formLoading = false
              this.treeLoading = false
            }
            this.$nextTick(() => { this.toggleExpand(true) })
          })
        } else {
          this.formLoading = false
        }
      }else  if (productId && this.btnType != 'add' && this.statusFlag) {
        this.firstId = this.firstId ? this.firstId : productId
        this.title = btnType === 'look' ? '查看BOM' : '编辑BOM'
        detailBomData(approvalStatus.id).then(res => {
          this.autoCode = res.data.bom.code
          this.dataForm = JSON.parse(JSON.stringify(res.data.bom))
          // btnType !== 'look' ? this.getApproverData() : ''
          this.documentStatus = res.data.bom.documentStatus
          this.linesList = res.data.lines.map(line => {
            return {
              ...line,
              drawingNo: line.drawingNo ? line.drawingNo : line.drawNo
            }
          })
          if (++loadTotal === 2) {
            this.formLoading = false
            this.treeLoading = false
          }
          this.formLoading = false
          this.treeLoading = false
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
        }).catch(() => { this.btnLoading = false })
        getSaleBusDetail(approvalStatus.id).then(res => {
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
                if (this.btnType == 'look') {
                  console.log(this.approvalForm, '++++++++++');
                  this.transferQuery.documentId = approvalStatus.id
                  approvalTransferList(this.transferQuery).then(res => {
                    console.log(res, '流转记录');
                    this.transferData = res.data.records
                  })
                }
              } else {
                this.busNodeConfig.childNode = null
              }
            })
      }else if (productId && this.btnType == 'add') {
        this.firstId = this.firstId ? this.firstId : productId
        this.title = '新建BOM'
        this.isDoubleFlag = true
        // 获取详情
        // let bomId = (await getBomByProductId(productId)).data
        detailBomData(approvalStatus.id).then(res => {
          this.autoCode = res.data.bom.code
          this.dataForm = JSON.parse(JSON.stringify(res.data.bom))
          // this.getApproverData()
          this.documentStatus = res.data.bom.documentStatus
          this.linesList = res.data.lines.map(line => {
            return {
              ...line,
              drawingNo: line.drawingNo ? line.drawingNo : line.drawNo,
              id:''
            }
          })
          if (++loadTotal === 2) {
            this.formLoading = false
            this.treeLoading = false
          }
          this.dataForm.approvalStatus = ''
          this.dataForm.submitDate = ''
          this.dataForm.approvalCompletionDate = ''
          this.dataForm.id = ''
          this.dataForm.documentStatus = ''

          // 整理BOM树
          // let tempObj = JSON.parse(JSON.stringify(this.dataForm))
          // tempObj.children = JSON.parse(JSON.stringify(res.data.lines))
          // if (!nodeData) {
          //   this.selectedNodeKey = this.firstId
          //   this.treeData = [tempObj]
          // }
          // else if (!nodeData.children) { this.$set(nodeData, 'children', tempObj.children) }

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
        }).catch(() => { this.btnLoading = false })
        // 审批
        // this.$nextTick(() => { this.getApproverData() })
        // 获取bom树
        if (!this.treeData.length) {
          getBomTree(approvalStatus.id).then(res => {
            this.treeData = res.data
            if (!nodeData) this.selectedNodeKey = this.firstId
            if (++loadTotal === 2) {
              this.formLoading = false
              this.treeLoading = false
            }
            this.$nextTick(() => { this.toggleExpand(true) })
          })
        } else {
          this.formLoading = false
        }
      }else {
        this.title = '新建BOM'
        this.treeLoading = false
        this.formLoading = false
         // 审批
        //  this.$nextTick(() => { this.getApproverData() })
      }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true
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
      // 增加审批限制  yc 1.30
      let templateLineList = []
      if (this.btnType === 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map(item=>{
            return {
              ...item,
              nodeUserList:item.nodeUserList ? item.nodeUserList : []
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
            submitFlag = templateLineList.every(item=>item.nodeUserList.length)
            if (!submitFlag) { 
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && submitModel === 'submit') {
            submitFlag = ccList.every(item=>item.nodeUserList.length)
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

      }
      if (this.btnType === 'edit' || this.btnType === 'look') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map(item=>{
            return {
              ...item,
              nodeUserList:item.nodeUserList ? item.nodeUserList : []
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
            submitFlag = templateLineList.every(item=>item.nodeUserList.length)
            if (!submitFlag) { 
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && submitModel === 'submit') {
            submitFlag = ccList.every(item=>item.nodeUserList.length)
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
      if (submitModel === 'submit' && this.dataForm.approvalFlag) {
        if (!this.busNodeConfig.childNode) {
          submitFlag = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach(item => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                submitFlag = false
                this.btnLoading = false
                this.$message.error('未配置发起人自选！')
              }
            }
          })
        }
      }


      // 校验表单
      let form_1 = this.$refs['dataForm'].$refs.main
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['tableForm'].$refs.main
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      // 判断是否有子件
      if (!this.linesList.length && submitFlag) {
        submitFlag = false
        this.$message.error('请至少添加一个子产品')
      } else if ((!this.linesList.some(item => item.reduceType === "picking") && submitFlag)) {
        submitFlag = false
        this.$message.error('至少有一个子产品的扣减料方式为生成领料单')
      }

      if (submitFlag) {
        let index = this.linesList.findIndex(line => line.productId === this.dataForm.productId)
        if (index !== -1) {
          this.$message.error(`产品信息第${index + 1}行：子产品不能与父产品相同`)
          submitFlag = false
        }
      }

      // 自动聚焦未使用则提交
      if (submitFlag) {
        // this.dataForm.version = this.dataForm.hasOwnProperty('version') ? (this.dataForm.version + 1) : 1
        // this.dataForm.approvalStatus = this.dataForm.documentStatus === "submit" ? this.dataForm.approvalStatus : ""
        this.dataForm.documentStatus = submitModel

        const formMethod = this.dataForm.id ? updateBomData : addBomData
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
        let dataObj = {
          attachmentList: this.datafilelist,
          bom: this.dataForm,
          lines: this.linesList,
          form: form,
          formNodeList,
          nodeCondList: nodeJudg,
          ccList: ccLists,
          doubleSubmitFlag:this.isDoubleFlag
        }
        // 检查是否有循环问题
        let loopBugRes = await checkLoopBug(dataObj).catch(err => { })
        if (!loopBugRes) { this.btnLoading = false }
        else if (loopBugRes.data.length) {
          let loopArr = []
          loopBugRes.data.forEach(item => {
            let temp = this.linesList.find(o => o.productId === item)
            temp ? loopArr.push(temp.name) : ""
          })
          this.$message.error("子件与BOM树产生冲突：" + loopArr.join('、'))
          this.btnLoading = false
        } else {
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
        }
      } else {
        this.btnLoading = false
      }

    },
    handleNodeClick(nodeData, node) {
      const msgArr = ["选择节点"]
      if (nodeData.productId === this.selectedNodeKey) {
        msgArr.push("和现节点相同")
      } else if (nodeData.childrenList.length || nodeData.productId === this.firstId) {
        msgArr.push("切换节点")
        this.selectedNodeKey = nodeData.productId
        this.init(nodeData.productId, this.btnType, nodeData)
      } else {
        msgArr.push("点击的节点没有BOM")
        this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      }
      // console.log(msgArr.join(' - '));
    },
    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox ? this.$refs.treeBox.setCurrentKey(this.selectedNodeKey) : ""
        })
      })
    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'
      if (type === 'Object') { this.linesList.splice(data.$index, 1) }
      else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          item.productCode = item.code
          item.remark = ""
          const hasFlag = this.linesList.some(i => item.productId === i.productId)
          if (hasFlag) { hasItemList.push(item.productName) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        }
        this.linesList = JSON.parse(JSON.stringify(tempList))
        this.$nextTick(() => { 
          this.$refs.tableForm.setDefaultValue() 
          // 审批
          // this.getApproverData()
        });
      }
    },
    ProductChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField(paramsObj.prop) })
      if (!data || !data.length) return
      this.dataForm[paramsObj.prop.slice(0, -4) + 'Id'] = data[0].id
      this.dataForm[paramsObj.prop] = data[0].name
      this.dataForm.drawNo = data[0].all.drawingNo
    },
    goBack() {
      this.$emit('close')
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
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
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        console.log(node, '提交数1');
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
    // // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = ''  // 条件符号
      let result = null     // 判断条件是否成立
      let condList = []
      getBusDetail('b018').then(res => {
        console.log(res);
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
            console.log(leftValue);
            console.log(rightValue);
            // if (leftValue == 'numCode') {
            //   const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // } else {
            //   const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // }
            if (result) {
              let query = {
                businessCode: "b018",
                condList,
              }
              busApprovalFlowTree(query).then(res => {
                console.log(res, '树详情');
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
            businessCode: "b018",
            condList,
          }
          busApprovalFlowTree(query).then(res => {
            console.log(res, '树详情');
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

    },
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
::v-deep .el-tabs {
  height: 100%!important;
}
::v-deep .el-tabs__content {
  height: calc(100% - 47px) !important;
  overflow:auto!important;
}
.required {
  color: red;
  margin-right: 4px;
}

.disabled-span {
  pointer-events: none;
  color: #999;
  /* 添加其他禁用样式 */
}

::v-deep .workNode {
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
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
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

</style>