<template>
  <!-- 检验单详情 -->
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="$emit('close')" :content="title" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')" v-if="btnType !== 'setLoss'">
            保存草稿
          </el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            {{ btnType === 'setLoss' ? $t('common.submitButton') : '保存并提交' }}
          </el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
                  :btnType="btnType === 'setLoss' ? 'look' : btnType" />
              </el-collapse-item>
              <el-collapse-item title="检验信息" name="inspectionInfo" class="orderInfo">
                <JNPF-col v-model="dataForm" :tabContent="inspectionInfo" ref="dataForm" :openMode="openMode" />
              </el-collapse-item>
            </el-collapse>

          </div>
        </div>
      </div>
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
    </div>
  </transition>
</template>

<script>
import { getDownloadUrl } from '@/api/common'
import { getbimDrawingData, getBimBusinessDetail } from '@/api/basicData/index'

import {
  addQcUnqualifiedData,
  updateQcUnqualifiedData,
  detailQcUnqualifiedData,
  detailInspectionData,
  lossQcUnqualifiedData
} from '@/api/inspectionManagement/index' // 产品检验项目列表
import { inspectionTypeList, inspectionResultsList, inspectionMethodList } from '../data.js'
import { mapGetters, mapState } from 'vuex'
import { getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import busFlow from '@/mixins/generator/busFlow'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: {},
  mixins: [busFlow, getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      isattachmentswitch: '',
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['inspectionItem', 'basicInfo', 'inspectionInfo', 'adverseCausesInfo'],
      title: '查看检验单',
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
      inspectionInfo: [],
      linesList: [],
      linesListItems: [
        /* 通过 this.refeshLinesListItems() 动态更改 */
      ],
      dialogRequestObj: {
        inspectStatus: 'unInspect', // 排除已经生成检验单的检验单
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
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'code', label: '产品编码' },
        // { prop: 'name', label: '产品名称' },
        { prop: 'sheetName', label: '图纸名称' },
        { prop: 'version', label: '版本' }
      ],
      getbimDrawingData,
      activeFile: {},
      previewVisible: false,
      inspectionList: [],
      productList: [],
      codeConfig: {},
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0
    }
  },
  beforeCreate() {
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
      this.dataFormItems = [
        {
          prop: 'productionOrderNo',
          label: '生产任务单号',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'workNo',
          label: '工单单号',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'createByName',
          label: '报工人',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'reportingTime',
          label: '报工时间',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'reportingQuantity',
          label: '报工数量',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
      ]
      this.inspectionInfo = [
        {
          prop: 'qualifiedQuantity',
          label: '合格数量',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'actualConcessionQuantity',
          label: '让步接收数量',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'actualReworkQuantity',
          label: '返工数量',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'actualResponsibilityWasteQuantity',
          label: '责废数量',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
        {
          prop: 'actualMaterialQuantity',
          label: '料废数量',
          value: '',
          type: 'input',
          itemDisabled: true,
          itemRules: [{ required: true, trigger: 'blur' }],
          sm: 6
        },
      ]
    },
    // 初始化
    async init(id, btnType, approvalFlag, inspectionType, businessCode) {
      await this.getProjectSwitch('system', 'project')
      await this.getProductNameSwitch('product', 'enable_productName')

      this.getBimBusinessDetail(inspectionType)
      this.inspectionOrderNoChange(id)
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.approvalFlag = approvalFlag
      let option = this.inspectionTypeList.find((o) => o.value === inspectionType)
      this.inspectionType = inspectionType
      this.businessCode = businessCode
      this.dialogRequestObj = { ...this.dialogRequestObj, notificationType: option.value, businessCode }
      this.ProductListRequestObjs = {
        code: this.dataForm.productCode,
        drawingNo: '',
        name: this.dataForm.productName,
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
      // this.$nextTick(() => { this.dataFormFlag = true })
      this.fetchData('UQDH', true)
      this.refeshDataFormItems()
      this.refeshLinesListItems()
      this.title = '查看检验单'
      this.formLoading = false
      if (id) {
        if (btnType === 'anew') {
          // 重新提交
          this.title = '新建检验单'
        } else if (btnType === 'edit') {
          this.title = '编辑检验单'
        } else if (btnType === 'look') {
          this.title = '查看检验单'
        } else if (btnType === 'setLoss') {
          this.title = '损失上报'
        }
      } else {
        this.fetchData('UQDH', true)
        this.refeshDataFormItems()
        this.refeshLinesListItems()
        this.title = '新建检验单'
        this.formLoading = false
      }
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    // 提交
    async handleConfirm(submitModel) {
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

      // 是否配置好审批
      if (submitModel === 'submit' && this.dataForm.approvalFlag && submitFlag) {
        if (!this.busNodeConfig.childNode) {
          submitFlag = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach((item) => {
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
        } else if (this.btnType === 'setLoss') {
          // 损失上报
          formMethod = lossQcUnqualifiedData
        }
        let dataObj = {
          attachmentList: this.datafilelist,
          unqualified: this.dataForm
          // lines: this.linesList,
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

    // 检验单更改
    inspectionOrderNoChange(id) {
      this.formLoading = true
      detailInspectionData(id)
        .then((res) => {
          console.log(res, 'res123')
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
          this.inspectionList = res.data.itemList
          this.linesListTwo = res.data.causesList
          this.dataForm = res.data.inspection
          console.log(this.dataForm, 'oooooo')
          this.dataForm.inspectionOrderNo = this.dataForm.orderNo
          this.refeshDataFormItems()
          // 流程信息和流转记录
          if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
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
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id)
        .then((res) => {
          if (res.data) {
            this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson
              ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson)
              : null
            this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
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
      console.log(this.title.substr(0, 2), 'this.title.substr(0, 2)')
      // return this.dataForm.submitFlag === 'add' ? '新建' : this.title.includes('查看') ? '只读' : '编辑'
      if (this.title.includes('检验单')) {
        return this.title === '生产巡检' ? '新建' : '只读'
      }
      console.log(this.title.substr(0, 2), 'this.title.substr(0, 2)33333333333333')
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
  padding: 0px 14px 0 14px;
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
  padding: 5px 10px 10px;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
</style>
