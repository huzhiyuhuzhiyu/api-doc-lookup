<template>
  <transition name="el-zoom-in-center">
    <div style="height:100%">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main org-form" ref="main">
            <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
              <el-page-header @back="goBack" :content="content" v-if="content" />
              <div style="font-size: 20px;" v-else>BOM创建</div>
              <div class="options" v-if="btnType !== 'look'">
                <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
                <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')"
                  :disabled="btnDisabled">
                  保存并提交
                </el-button>
                <el-button @click="goBack" v-if="content">{{ $t('common.cancelButton') }}</el-button>
              </div>
            </div>
            <div class="contain">
              <div class="JNPF-common-layout">
                <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
                  <div class="JNPF-common-layout-main JNPF-flex-main">
                    <el-tabs v-model="activeName">
                      <el-tab-pane label="基础信息" name="jcInfo" class="jcInfo">
                        <el-collapse v-model="activeNames">
                          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                            <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
                              :btnType="btnType" />
                          </el-collapse-item>

                          <el-collapse-item title="子件信息" name="productInfo">
                            <TableForm-product :hasReplace="true" :value="linesList" @input="contentChanges" ref="tableForm"
                              :tableItems="linesListItems" :btnType="btnType" @addth="addOrDelLinesItem"
                              @deleteth="addOrDelLinesItem" customStyle :isProjectSwitch="isProjectSwitch"
                              :projectId="this.dataForm.projectId" :isProductNameSwitch="isProductNameSwitch"
                              @replaceBom="replaceBom"
                            />
                          </el-collapse-item>
                        </el-collapse>
                      </el-tab-pane>
                      <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                        <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'">
                        </UploadWj>
                      </el-tab-pane>
                      <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                        <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </div>
              </div>
            </div>
            <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
              :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
              width="500px">
              <div>
                <img src="@/assets/images/importSuccess.gif" alt="" style="width:100px" />
                <span class="import_t">{{ submitmethodsTitle }}啦！</span>
                <span class="import_b">您还可以进行如下操作：</span>
              </div>

              <span slot="footer" class="dialog-footer">
                <el-button @click="goBom">返回列表</el-button>
                <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()">{{ btnText }}</el-button>
                <el-button v-else type="primary" @click="continueAdd()">{{ btnText }}</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
      <BomReplace @submitBomReplace="submitBomReplace" ref="BomReplace" v-if="bomReplaceVisible" :dataForm="dataForm" :projectId="dataForm.projectId" :btnType="btnType" :isProjectSwitch="isProjectSwitch" :isProductNameSwitch="isProductNameSwitch"></BomReplace>
    </div>
  </transition>
</template>

<script>
import {
  addBomData,
  updateBomData,
  detailBomData,
  checkBomCodeExist,
  getBomByProductId,
  checkLoopBug,
  getBomTree,
  getBimBusinessDetail
} from '@/api/basicData/index'

import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import TableFormProduct from '../BOMCreate/component/TableForm-product/index.vue' // 产品选择组件
import { getProductWithOut } from '@/api/purchasingManagement/purchaseInquirySheet'
import { mapGetters, mapState } from 'vuex'
import { getclassAttributeList } from '@/api/masterDataManagement/index'
import { getLabel } from '@/utils/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
Vue.prototype.$getLabel = getLabel
import getProjectList from '@/mixins/generator/getProjectList'
import BomReplace from '@/views/basicData/bomSettings/BOMCreate/bomReplace.vue'
export default {
  name: 'BOMCreate',
  components: { BomReplace, TableFormProduct, Process },
  mixins: [getProjectList],
  data() {
    return {
      bomReplaceVisible: false,
      isProjectSwitch: '',
      isProductNameSwitch: '',
      projectIdData: [],
      btnDisabled: false,
      activeNames: ['productInfo', 'basicInfo'],
      datafilelist: [],
      activeName: 'jcInfo',
      btnType: 'add',
      visible: true,
      btnLoading: false,
      treeLoading: false,
      formLoading: false,
      title: '',
      autoCode: undefined,
      refreshTree: true,
      treeData: [],
      selectedNodeKey: '',
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      expands: true,
      firstId: '',
      dataForm: {
        projectId: ''
      },
      documentStatus: '',
      dataFormItems: [
        // { prop: "code", label: "BOM编码", value: "", type: "input", itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate('enCode'), trigger: 'blur' }], sm: 12 },
        {
          prop: 'projectId',
          label: '所属项目',
          value: '',
          type: 'select',
          options: [],
          itemRules: [],
          sm: 12,
          itemDisabled: false,
          render: true
        },
        {
          prop: 'drawNo',
          label: '型号',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-page',
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 12,
          readOnly: true
        },
        {
          prop: 'pickingWay',
          label: '领料方式',
          value: 'production_order',
          type: 'select',
          options: [
            { label: '按生产订单领料', value: 'production_order' },
            { label: '按工单领料', value: 'dispatch_list' },
            { label: '无需领料', value: 'none' }
          ],
          itemRules: [{ required: true, trigger: 'change' }],
          sm: 12,
          change:(e)=>{
             const item = this.linesListItems.find(item=>item.prop === 'reduceType')
              if(!item){
                  return ;
              }
                if(e === 'none') {
                    item.options = [
                        {label: '不扣减料', value: 'none'}
                    ]
                    item.value = "none"
                }else{
                    item.options = [
                        {label: '生成领料单', value: 'picking'},
                        {label: '自动扣减料', value: 'auto'},
                        {label: '不扣减料', value: 'none'}
                    ]
                }
              const arr =item.options.map(item=>item.value)
              this.linesList.forEach(item=>{
                  if(!arr.includes(item.reduceType)){
                      item.reduceType = ""
                  }
              })
          },
        },
        // { prop: "drawNo", label: "型号", value: "", type: 'input', itemDisabled: true, sm: 24, placeholder: ' ' },
        { prop: 'remark', label: '备注', value: '', type: 'textarea', sm: 12 }
      ],
      linesList: [],

      linesListItems: [
        { prop: 'drawingNo', label: '子件规格', value: '', type: 'view', minWidth: 340 },
        { prop: 'classTypeName', label: '子件类型', value: '', type: 'view', minWidth: 160 },
        { prop: 'productCode', label: '子件编码', value: '', type: 'view', minWidth: 160 },
        { prop: 'productCategoryName', label: '产品分类', value: '', type: 'view', minWidth: 160 },
        {
          prop: 'qty',
          label: '数量',
          value: '1',
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
                    this.$message.error('数量：' + errMsg)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ],
          minWidth: 120
        },
        { prop: 'mainUnit', label: '单位', value: '', type: 'view', minWidth: 60 },
        {
          prop: 'lossRate',
          label: '损耗率(%)',
          value: '0',
          type: 'input',
          placeholder: '请输入损耗率',
          itemRules: [
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'decimal',
                params: [
                  10,
                  2,
                  '',
                  (errMsg) => {
                    this.$message.error('损耗率：' + errMsg)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ],
          minWidth: 120
        },
        {
          prop: 'fixedLoss',
          label: '固定损耗',
          value: '0',
          type: 'input',
          itemRules: [
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'decimal',
                params: [
                  10,
                  2,
                  '',
                  (errMsg) => {
                    this.$message.error('固定损耗：' + errMsg)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ],
          minWidth: 120
        },
        {
          prop: 'reduceType',
          label: '扣减料方式',
          value: 'picking',
          type: 'select',
          options: [
            { label: '生成领料单', value: 'picking' },
            { label: '自动扣减料', value: 'auto' },
            { label: '不扣减料', value: 'none' }
          ],
          itemRules: [{ required: true, trigger: 'change' }],
          minWidth: 160,
        },
        { prop: 'remark', label: '备注', value: '', type: 'input', maxlength: 200, minWidth: 160 }
      ],
      getProductWithOut, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        {
          label: '产品分类',
          classAttribute: '',
          method: getcategoryTree,
          requestObj: { classAttribute: '', type: 'material' }
        }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        createByName: '',
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        productDrawingNo: '',
        productName: '',
        productCode: '',
        startTime: '',
        endTime: '',
        productWithout: 'price',
        productWithout: 'bom',
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
        createTimeArr: []
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码' },
        // { prop: 'name', label: '产品名称'},
        { prop: 'drawingNo', label: '型号' },
        // { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeName', label: '类别属性' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '型号', type: 'input' }
      ], // 产品选择弹出框搜索条件
      isDoubleFlag: false,
      approvalStatus: '',
      statusFlag: false,
      tipsvisible: false,
      submitmethodsTitle: '',
      btnText: '继续新建',
      classAttributeList: [],
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      isattachmentswitch: '',
      categoryId: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getclassAttributeList()
  },
  async created() {
    this.$unsavedGuard.set(true, this.$route.fullPath);

    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getProjectList()

    if (this.isProductNameSwitch === '1') {
      this.ProductTableItems.splice(1, 0, { prop: 'name', label: '产品名称' })
      this.ProductTableSearchList.splice(1, 0, { prop: "productName", label: "产品名称", type: 'input', })
      this.linesListItems.splice(1, 0, { prop: 'productName', label: '产品名称', value: '', type: 'view', minWidth: 160 })
    } else {

    }
    if (this.isProjectSwitch === '1') {
      this.linesListItems.unshift({ prop: 'projectName', label: '所属项目', value: '', type: 'view', minWidth: 150 })
    } else {

    }
    console.log(this.linesListItems)
    this.dataFormItems.forEach((tc) => {
      // 添加所属项目
      if (tc.prop === 'projectId') {
        console.log(this.isProjectSwitch, 'ojjj')
        tc.options = this.projectIdData
        if (this.isProjectSwitch === '1') {
          console.log(this.userInfo.projectId, 'this.userInfo.projectId')
          if (this.userInfo.projectId === '1') {
            tc.options = tc.options.filter((item) => item.value !== '1')
            tc.itemDisabled = false
          } else {
            this.dataForm.projectId = this.userInfo.projectId
            this.ProductListRequestObj.projectId = this.dataForm.projectId
            this.dataForm.drawNo = ''
            this.linesList = []
            tc.itemDisabled = true
          }
          tc.change = (val) => {
            this.ProductListRequestObj.projectId = this.dataForm.projectId
            this.dataForm.drawNo = ''
            this.linesList = []
          }

          console.log(this.ProductListRequestObj, '4')
          tc.itemRules.push({ required: true, trigger: 'change' })
          console.log(tc, 'this.projectIdData')

          console.log('000')
        } else {
          tc.render = false
        }
      }
      // 添加自定义表单元素方法和参数
      if (tc.type == 'custom') {
        // 若干需要选择的产品
        if (tc.prop === 'drawNo') {
          console.log(tc, '1')
          console.log(this.ProductListRequestObj, '3')
          tc.dialogTitle = '选择型号'
          tc.placeholder = '请选择产品'
          // tc.treeTitle = '产品分类'
          // tc.methodArr = this.ProductMethodArr
          tc.renderTree = false
          tc.listMethod = getProductWithOut
          tc.listRequestObj = this.ProductListRequestObj
          tc.tableItems = this.ProductTableItems
          tc.searchList = this.ProductTableSearchList
          tc.listDataFormatting = this.listDataFormatting
          tc.change = this.ProductChange
          tc.paramsObj = { prop: tc.prop, oldVal: this.dataForm.drawNo }
          tc.beforeOpen = this.ProductBeforeOpen
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
        } else {
          console.warn(tc.prop + '不在判断条件内')
        }
      }
      // 添加校验编码唯一性的规则
      if (tc.prop === 'code') {
        if (!tc.itemRules) {
          tc.itemRules = []
        }
        tc.itemRules.push({
          validator: (rule, value, callback) => {
            if (!value) {
              callback()
            } else if (this.dataForm.code === this.autoCode) {
              callback()
            } else {
              checkBomCodeExist(this.dataForm.code)
                .then((res) => {
                  if (!res.data) {
                    callback()
                  } else {
                    callback(new Error('此BOM编码已存在'))
                  }
                })
                .catch((err) => {
                  callback(new Error(' '))
                })
            }
          },
          trigger: 'blur'
        })
      }
      if (tc.prop === 'pickingWay') {
        if (this.$store.getters.configData.produce.bom) {
          this.dataForm.pickingWay = 'dispatch_list'
          this.$set(tc,'itemDisabled',true)
        }

      }
    })
    if (this.$store.getters.configData.produce.bom) {
        this.linesListItems.forEach((tc) => {
          if (tc.prop === 'reduceType') {
            tc.value = 'auto'
            this.$set(tc,'itemDisabled',true)
          }
        })
    }


    this.dataForm.approvalFlag = false
    this.getBusInfo()
    this.getBimBusinessDetail()

  },
  methods: {
    async init(productId, btnType, approvalStatus, nodeData) {
      console.log(666)
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.approvalStatus = approvalStatus ? approvalStatus.approvalStatus : ''
      this.statusFlag =
        this.approvalStatus == 'rebut' || this.approvalStatus == 'withdrawn' || this.approvalStatus == 'ing'
          ? true
          : false
      let loadTotal = 0
      if (productId && this.btnType != 'add' && !this.statusFlag) {
        this.firstId = this.firstId ? this.firstId : productId
        this.title = btnType === 'look' ? '查看BOM' : '编辑BOM'
        // 获取详情
        let bomId = (await getBomByProductId(productId)).data
        detailBomData(bomId)
          .then((res) => {
            this.autoCode = res.data.bom.code
            this.dataForm = JSON.parse(JSON.stringify(res.data.bom))
            // btnType !== 'look' ? this.getApproverData() : ''
            this.documentStatus = res.data.bom.documentStatus
            this.linesList = res.data.lines.map((line) => {
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
                this.datafilelist.push({
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                })
              })
            }
          })
          .catch(() => {
            this.btnLoading = false
          })
        // 获取bom树
        if (!this.treeData.length) {
          getBomTree(bomId).then((res) => {
            this.treeData = res.data
            if (!nodeData) this.selectedNodeKey = this.firstId
            if (++loadTotal === 2) {
              this.formLoading = false
              this.treeLoading = false
            }
            this.$nextTick(() => {
              this.toggleExpand(true)
            })
          })
        } else {
          this.formLoading = false
        }
      } else if (productId && this.btnType != 'add' && this.statusFlag) {
        this.firstId = this.firstId ? this.firstId : productId
        this.title = btnType === 'look' ? '查看BOM' : '编辑BOM'
        detailBomData(approvalStatus.id)
          .then((res) => {
            this.autoCode = res.data.bom.code
            this.dataForm = JSON.parse(JSON.stringify(res.data.bom))
            // btnType !== 'look' ? this.getApproverData() : ''
            this.documentStatus = res.data.bom.documentStatus
            this.linesList = res.data.lines.map((line) => {
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
                this.datafilelist.push({
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                })
              })
            }
          })
          .catch(() => {
            this.btnLoading = false
          })
      } else if (productId && this.btnType == 'add') {
        this.firstId = this.firstId ? this.firstId : productId
        this.title = '新建BOM'
        this.isDoubleFlag = true
        // 获取详情
        // let bomId = (await getBomByProductId(productId)).data
        detailBomData(approvalStatus.id)
          .then((res) => {
            this.autoCode = res.data.bom.code
            this.dataForm = JSON.parse(JSON.stringify(res.data.bom))
            // this.getApproverData()
            this.documentStatus = res.data.bom.documentStatus
            this.linesList = res.data.lines.map((line) => {
              return {
                ...line,
                drawingNo: line.drawingNo ? line.drawingNo : line.drawNo,
                id: ''
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
                this.datafilelist.push({
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                })
              })
            }
          })
          .catch(() => {
            this.btnLoading = false
          })
        // 审批
        // this.$nextTick(() => { this.getApproverData() })
        // 获取bom树
        if (!this.treeData.length) {
          getBomTree(approvalStatus.id).then((res) => {
            this.treeData = res.data
            if (!nodeData) this.selectedNodeKey = this.firstId
            if (++loadTotal === 2) {
              this.formLoading = false
              this.treeLoading = false
            }
            this.$nextTick(() => {
              this.toggleExpand(true)
            })
          })
        } else {
          this.formLoading = false
        }
      } else {
        this.title = '新建BOM'
        this.treeLoading = false
        this.formLoading = false
        // 审批
        //  this.$nextTick(() => { this.getApproverData() })
        this.getBusInfo()
      }
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_bomgl'
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true
      this.btnDisabled = true
      // 校验表单
      let form_1 = this.$refs['dataForm'].$refs.main
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
        this.btnLoading = false
        this.btnDisabled = false
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['tableForm'].$refs.main
      let valid_2 = await form_2.validate().catch((err) => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
        this.btnLoading = false
        this.btnDisabled = false
      }

      // 判断是否有子件
      if (!this.linesList.length && submitFlag) {
        submitFlag = false
        this.$message.error('请至少添加一个子产品')
      }
      if (this.dataForm.classAttribute == 'semi_finished') {
        if (this.linesList.length > 1) {
          this.linesList.forEach((item) => {
            console.log(item, 'p')

            if (item.classType === 'inner_ring_blank' || item.classType === 'outer_ring_blank') {
              submitFlag = false
              this.btnLoading = false
              this.btnDisabled = false

              return this.$message.error('半成品产品，创建BOM的子件，子件选择内外圈毛坯，只能有一个子件')
            }
          })
        }
      }
      if (submitFlag) {
        let index = this.linesList.findIndex((line) => line.productId === this.dataForm.productId)
        if (index !== -1) {
          this.$message.error(`产品信息第${index + 1}行：子产品不能与父产品相同`)
          submitFlag = false
          this.btnDisabled = false
          this.btnLoading = false
        }
      }

      // // 自动聚焦未使用则提交
      if (submitFlag) {
        // this.dataForm.version = this.dataForm.hasOwnProperty('version') ? (this.dataForm.version + 1) : 1
        // this.dataForm.approvalStatus = this.dataForm.documentStatus === "submit" ? this.dataForm.approvalStatus : ""
        this.dataForm.documentStatus = submitModel
        // this.dataForm.pickingWay = 'production_order'
        const formMethod = this.dataForm.id ? updateBomData : addBomData
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'system_attachment',
              configKey: 'fj_bomgl',
              categoryId: this.categoryId,
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
          doubleSubmitFlag: this.isDoubleFlag,
          flowData: this.flowData,
        }
        // 检查是否有循环问题
        let loopBugRes = await checkLoopBug(dataObj).catch((err) => { })
        if (!loopBugRes) {
          this.btnLoading = false
          this.btnDisabled = false
        } else if (loopBugRes.data.length) {
          let loopArr = []
          loopBugRes.data.forEach((item) => {
            console.log(item, 'iiii')
            let temp = this.linesList.find((o) => o.productId === item)
            temp ? loopArr.push(temp.name) : ''
          })
          this.$message.error('子件与BOM树产生冲突：' + loopArr.join('、'))
          this.btnDisabled = false
          this.btnLoading = false
        } else {
          console.log(dataObj, 'dataObj')
          formMethod(dataObj)
            .then((res) => {
              let msg = res.msg
              if (res.msg === 'Success') {
                msg = submitModel == 'submit' ? '提交成功' : '保存成功'
              }
              // this.$message({
              //   message: msg,
              //   type: 'success',
              //   duration: 1500,
              //   onClose: () => {
              //     this.visible = false
              //     this.btnLoading = false
              //     this.$emit('close', true)
              //   }
              // })
              this.visible = false
              if (submitModel == 'submit') {
                this.submitmethodsTitle = '保存成功'
              } else {
                this.submitmethodsTitle = '提交成功'
              }
              this.tipsvisible = true
              this.btnDisabled = false
            })
            .catch(() => {
              this.btnLoading = false
              this.btnDisabled = false
            })
        }
      } else {
        this.btnLoading = false
      }
      this.btnLoading = false
    },
    handleNodeClick(nodeData, node) {
      const msgArr = ['选择节点']
      if (nodeData.productId === this.selectedNodeKey) {
        msgArr.push('和现节点相同')
      } else if (nodeData.childrenList.length || nodeData.productId === this.firstId) {
        msgArr.push('切换节点')
        this.selectedNodeKey = nodeData.productId
        this.init(nodeData.productId, this.btnType, nodeData)
      } else {
        msgArr.push('点击的节点没有BOM')
        this.$refs.treeBox.setCurrentKey(this.selectedNodeKey)
      }
    },
    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox ? this.$refs.treeBox.setCurrentKey(this.selectedNodeKey) : ''
        })
      })
    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'

      if (type === 'Object') {
        this.linesList.splice(data.$index, 1)
      } else {
        if (this.dataForm.classAttribute == 'semi_finished' && this.dataForm.productSource == 'out') {
          if (this.linesList.length == 0) {
            if (data.length > 1) return this.$message.error('半成品产品来源是外协时，创建BOM的子件，只能选择一个子件')
          } else {
            return this.$message.error('半成品产品来源是外协时，创建BOM的子件，只能选择一个子件')
          }
        }
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          item.productCode = item.code
          item.remark = ''
          const hasFlag = this.linesList.some((i) => item.productId === i.productId)
          if (hasFlag) {
            hasItemList.push(item.productName)
          } else {
            tempList.push(item)
          }
          if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        }
        this.linesList = tempList.map(item=>{
            return {
                ...item,
                replaceLines:[]
            }
        })
        this.$nextTick(() => {
          this.$refs.tableForm.setDefaultValue()
          // 审批
          // this.getApproverData()
        })
      }
    },
    ProductChange(val, data, paramsObj) {
      this.$nextTick(() => {
        this.$refs['dataForm'].$children[0].validateField(paramsObj.prop)
      })
      if (!data || !data.length) return

      this.dataForm[paramsObj.prop] = data[0].name
      this.dataForm.classAttribute = data[0].all.classAttribute
      this.dataForm.drawNo = data[0].all.drawingNo
      this.dataForm.productSource = data[0].all.productSource
      this.dataForm.productId = data[0].id
    },
    goBack() {
      if (this.$route.query.alert) {
        this.$router.push({
          path: '/basicData/bomSettings/productionBom'
        })
      } else {
        this.$router.push({
          path: '/basicData/bomSettings/productNoBomQuery'
        })
      }
    },
    goBom() {
      this.tipsvisible = false
      this.btnLoading = false
      this.$router.push({
        path: '/basicData/bomSettings/productionBom'
      })
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
    },
    // 继续新增
    continueAdd() {
      this.init('', 'add')
      this.dataForm = {}
      if (this.isProjectSwitch === '1') {
        this.dataForm.projectId = this.userInfo.projectId
      }
      this.linesList = []
      this.tipsvisible = false
      this.btnLoading = false
    },
    listDataFormatting(res) {
      res.data.records.forEach((item, index) => {
        item.classAttributeName = this.$getLabel(this.classAttributeList, item.classAttribute, 'value', 'label')
      })

      return res.data.records
    },
    getclassAttributeList() {
      let obj = {
        pageNum: 1,
        pageSize: 20
      }
      getclassAttributeList(obj).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.code
          }
          arr.push(obj)
        })
        this.classAttributeList = arr
      })
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b023')
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
    },
    replaceBom(data){
        console.log(data,'替换子件')
        this.bomReplaceVisible = true
        this.$nextTick(() => {
            this.$refs.BomReplace.init(data,this.linesList[data.$index].replaceLines)
        })
    },
    submitBomReplace(replaceLines,index){
        this.linesList[index].replaceLines = replaceLines
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
  height: calc(100% - 47px) !important;
  overflow-y: auto;
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

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
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
  padding-bottom: 0px;
}

::v-deep .selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 0px !important;
}

.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
</style>
