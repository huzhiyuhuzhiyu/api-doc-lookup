<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <el-page-header @back="goBack" :content="dialogTitle + `产线`" />
          <div class="options" v-if="type != 'look'">
            <!-- <el-button type="success" :disabled="dataForm.documentStatus == 'submit'" :loading="btnLoading"
              @click="handleSubmit('draft')">
              保存草稿
            </el-button> -->
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="产线信息" name="modelInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <template v-if="!loading">
                        <el-col :span="12">
                          <el-form-item label="产线编码" prop="code" ref="code">
                            <el-input v-model="dataForm.code" placeholder="请输入产线编码" clearable :style="{ width: '100%' }"
                              maxlength="20" :disabled="type == 'look'
                                ? true
                                : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag
                                  ? true
                                  : false
                                "></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="产线名称" prop="name" ref="name">
                            <el-input v-model="dataForm.name" placeholder="请输入产线名称" clearable :style="{ width: '100%' }"
                              maxlength="20" :disabled="type == 'look'"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="加工车间" prop="workshopId">
                            <el-select v-model="dataForm.workshopId" style="width:100%" :disabled="type == 'look'">
                              <el-option v-for="item in workshopIdOptions" :key="item.value" :label="item.fullName"
                                :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                          <el-form-item label="按产线顺序报工" prop="reportRulesFlag">
                            <el-select v-model="dataForm.reportRulesFlag" style="width:100%" :disabled="type == 'look'">
                              <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col> -->
                        <!-- <el-col :span="12">
                      <el-form-item label="产线状态" prop="state">
                        <el-select v-model="dataForm.state" style="width:100%" :disabled="type == 'look'">
                       
                          <el-option label="启用" value="enable" />
                          <el-option label="禁用" value="disable" />
                        </el-select>
                      </el-form-item>
                    </el-col> -->
                        <!-- <el-col :span="12">
                                    <el-form-item label="审批状态" prop="status">
                                        <el-select v-model="dataForm.status" style="width:100%">
                                            <el-option label="审批中" value="in_approval" />
                                            <el-option label="审批通过" value="approved" />
                                            <el-option label="审批未通过" value="review_failed" />
                                        </el-select>
                                    </el-form-item>
                                </el-col> -->
                        <!-- <el-col :span="12">
                                    <el-form-item label="单据状态" prop="documentStatus">
                                        <el-select v-model="dataForm.documentStatus">
                                            <el-option label="草稿" value="draft" />
                                            <el-option label="提交" value="submit" />
                                        </el-select>
                                    </el-form-item>
                                </el-col> -->
                        <el-col :span="24">
                          <el-form-item label="驳回理由" prop="documentStatus" v-if="dataForm.status === 'review_failed'">
                            <el-input v-model="dataForm.reasonRejection" placeholder="请输入驳回理由" clearable type="textarea"
                              maxlength="200" :disabled="type == 'look'"></el-input>
                          </el-form-item>
                        </el-col>

                        <el-col :span="24">
                          <el-form-item label="备注" prop="remark">
                            <el-input v-model="dataForm.remark" placeholder="请输入备注" clearable type="textarea"
                              maxlength="200" :disabled="type == 'look'"></el-input>
                          </el-form-item>
                        </el-col>

                        <!-- <el-col :span="12">
                      <el-form-item label="人员" prop="personName" >
                        <PersonSelect multiple v-model="dataForm.personName" placeholder="请选择所属人员"  style="width: 100%;"
                        @change="hangleSelectSales" />      
                      </el-form-item>
                    </el-col> -->
                      </template>
                    </el-form>
                    <!-- <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
              @select="addForSelect" @close="selectDialogVisible=false" /> -->
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="工序信息" name="processInfo">
                  <el-col :span="24">
                    <!-- <div
                            style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px"
                          >
                            <h5>工序信息</h5>
                          </div> -->
                    <div v-if="type !== 'look'">
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        icon="el-icon-plus" :disabled="type == 'look' ? true : false"
                        @click="openSeleceProcessDialog(dataFormTwo.length, 'add')">
                        选择工序
                      </el-button>
                      |
                      <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                        批量删除
                      </el-button>
                      |
                    </div>
                    <!-- <el-form-item label-width="0" ref="tableForm">  -->
                    <el-table hasC hasNO fixedNO style="border: 1px solid #e3e7ee;" ref="processRef"
                      v-loading="responseLoading" @selection-change="handeleProductInfoData" :data="dataFormTwo"
                      size="mini" id="table">
                      <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" />
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                      <el-table-column prop="name" label="工序名称" width="180" show-overflow-tooltip>
                        <template slot="header">
                          <span class="required">*</span>
                          工序名称
                        </template>
                        <template slot-scope="scope">
                          <div class="viewData">
                            <span>{{ scope.row.name }}</span>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="code" label="工序编码" min-width="140" />

                      <el-table-column prop="processType" label="工序类型" width="180">
                        <template slot-scope="scope">
                          <div class="viewData">
                            <div class="viewData" v-if="scope.row.processType == 'normal'">正常工序</div>
                            <div class="viewData" v-if="scope.row.processType == 'wait_assemble'">待装配工序</div>
                            <div class="viewData" v-if="scope.row.processType == 'vibrate'">测振工序</div>
                            <div class="viewData" v-if="scope.row.processType == 'heat_treatment'">热处理工序</div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="processingType" label="加工类型" width="180">
                        <template slot-scope="scope">
                          <div class="viewData">
                            <span v-if="scope.row.processingType === 'self_produced'">自制</span>
                            <span v-if="scope.row.processingType === 'external_production'">外协</span>
                          </div>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" min-width="180" fixed="right">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn" :disabled="type == 'look'"
                            @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                          <el-button type="text" @click="handlerOpenSource(scope.$index, type)">
                            产线资源配置
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- <div class="table-actions" @click="handlerOpenDialog(dataFormTwo.length, 'add')"
                          v-if="type != 'look'">
                          <el-button type="text" icon="el-icon-plus">添加</el-button>
                        </div> -->
                    <!-- </el-form-item>   -->
                  </el-col>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <!-- <el-tab-pane label="审批流程" name="approvalProcess">
            </el-tab-pane> -->
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type == 'look'" :detailed="type == 'look'"></UploadWj>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag" style="padding:10px 0">
              <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
            </el-tab-pane>
            <el-tab-pane v-if="type == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
              <recordList :list="flowTaskOperatorRecordList" :endTime="endTime" />
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
    </transition>
    <process-dialog v-if="processVisibled" ref="processRef" @dataFormSubmit="submit"></process-dialog>
    <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area>

    <ComSelect-page ref="ComSelect-page" @change="submit" :tableItems="ProductTableItems" title="选择工序" treeTitle="工序分类"
      :methodArr="ProductMethodArr" :listMethod="getBimProcessList" :listRequestObj="ProductListRequestObj"
      :searchList="ProductTableSearchList" :elementShow="false" multiple :listDataFormatting="listDataFormatting" />
  </div>
</template>
<script>

import ProcessDialog from '@/views/basicData/processSettings/processSettingss/process-dialog.vue'
import SourceArea from '@/views/basicData/processSettings/processSettingss/source.vue'
import { getCooperativeData } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getBimProcessList, getBimProcessDetail } from '@/api/bimProcess/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow'
import recordList from '@/views/workFlow/components/RecordList.vue'
import {
  addProductionLineData,
  editProductionLineData,
  getProductionLineInfo,
  checkProductionLineCode,
  bimWorkstationList,
  checkBimWorkstationCode,
  getDepartmentList
} from '@/api/basicData/index'
export default {
  components: {
    ProcessDialog,
    SourceArea,
    Process,
    recordList
  },
  mixins: [busFlow],
  props: [],
  data() {
    return {
      activeName: 'jcInfo',
      activeNames: ['modelInfo', 'processInfo'],
      datafilelist: [],
      getBimProcessList,
      options: [
        {
          value: true,
          label: '是'
        },
        {
          value: false,
          label: '否'
        }
      ],
      ProductMethodArr: [
        {
          label: '工序分类',
          classAttribute: 'process',
          method: getcategoryTree,
          requestObj: { classAttribute: 'process' }
        }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        name: '',
        code: '',
        processingType: '',
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
        productCategoryId: ''
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '工序编码', fixed: 'left' },
        { prop: 'name', label: '工序名称', fixed: 'left' },
        { prop: 'processTypeName', label: '工序类型', fixed: 'left' },
        { prop: 'processingTypeName', label: '加工类型', fixed: 'left' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'code', label: '工序编码', type: 'input' },
        { prop: 'name', label: '工序名称', type: 'input' }
      ], // 产品选择弹出框搜索条件

      getCooperativeData,
      activeName: 'jcInfo',
      dialogTitle: '',
      visible: false,
      processVisibled: false,
      sourceVisibled: false,
      loading: false,
      btnLoading: false,
      organizeIdTree: [],
      index: null,
      needDisabled: false,
      workshopIdOptions: [],
      dataForm: {
        id: '',
        code: '', //  编码
        name: '', //  名称
        state: 'enable', //  状态
        workshopId: '',
        reportRulesFlag: true,
        // status: "", //  状态
        documentStatus: '', //  状态
        reasonRejection: '', //  驳回原因
        personName: '', // 人员试验
        remark: '',
        approvalFlag: false
      },
      requestObj2: {
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: -1,
        type: 'outsourcing_suppliers'
      },
      // cooperativePartnerName: '',
      type: '',
      dataFormTwo: [],
      codeConfig: {},
      rules: {
        name: [
          {
            required: true,
            message: '请输入产线名称',
            trigger: ['blur']
          }
        ],
        code: [
          {
            required: true,
            message: '请输入产线编码',
            trigger: ['blur']
          },
          {
            validator: (rule, value, callback) => {
              checkProductionLineCode(value, this.dataForm.id)
                .then((res) => {
                  if (res.data) {
                    callback(new Error('产线编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ],
        state: [{ required: true, message: '请选择产线状态', trigger: 'change' }]
      },
      rulesTwo: {
        ratio: [
          {
            required: true,
            message: '请输入转换系数',
            trigger: ['blur']
          },
          {
            validator: (rule, value, callback) => {
              const num = parseFloat(value)
              if (!isNaN(num) && Math.abs(num) <= 9999999.999999) {
                callback()
              } else {
                this.$message.error('转换系数只能是数字')
                callback(new Error('请输入-9999999.999999到9999999.999999之间的值'))
              }
            },
            trigger: ['blur']
          }
        ],
        targetName: [
          {
            required: true,
            message: '请选择转换后单位名称',
            trigger: ['change']
          }
        ]
      },
      formItems: [{ ref: 'code', message: '请输入业务编码' }, { ref: 'name', message: '请输入单位名称' }],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      typeOptions: [],
      departmentList: [],
      cooperativeList: [],
      currntIndex: 0,
      types: '',
      sourceData: [],
      processArr: [],
      responseLoading: false,
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0
    }
  },
  created() { },
  methods: {
    getDepartmentList() {
      getDepartmentList('CJ').then(res => {
        this.workshopIdOptions = res.data
      })
    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (flag) {
          this.dataForm.code = data.number
        }
      } catch (error) { }
    },
    listDataFormatting(res) {
      let treeData = res.data.records.map((item) => {
        if (item.processingType == 'self_produced') {
          item.processingTypeName = '自制'
        } else if (item.processingType == 'external_production') {
          item.processingTypeName = '外协'
        }
        if (item.processType == 'normal') {
          item.processTypeName = '正常工序'
        } else if (item.processType == 'wait_assemble') {
          item.processTypeName = '待装配工序'
        } else if (item.processType == 'vibrate') {
          item.processTypeName = '测振工序'
        } else if (item.processType == 'heat_treatment') {
          item.processTypeName = '热处理工序'
        }
        return item
      })
      return treeData
    },

    handleNodeClick(value) { },

    // 可以多选工序
    openSeleceProcessDialog(e, type) {
      // this.index = e
      // this.types = type
      // this.processVisibled = true
      // this.$nextTick(() => {
      //   this.$refs.processRef.init()
      // })

      this.$refs['ComSelect-page'].openDialog()
    },
    handeleProductInfoData(val) {
      this.processArr = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.processArr.length < 1) {
        this.$message({
          message: '请选择你要删除的数据',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.processArr.length; i++) {
        const row = this.processArr[i]
        const index = this.dataFormTwo.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.processArr = [] // 清空选中的行的数据
      this.dataFormTwo.forEach((item, index) => {
        if (index == this.dataFormTwo.length - 1) {
          item.lastFlag = true
          item.stockFlag = true
          if (this.dataFormTwo[index].processingType == 'external_production') {
            item.reportFlag = false
          } else {
            item.reportFlag = true
          }
        } else {
          item.lastFlag = false
          item.stockFlag = false
          item.reportFlag = false
        }
        if (index === 0) {
          item.firstFlag = true
        } else {
          item.firstFlag = false
        }
        if (item.processingType === 'external_production') {
          if (index != 0 && this.dataFormTwo[index - 1].processingType != 'external_production') {
            this.dataFormTwo[index - 1].reportFlag = 1
            this.dataFormTwo[index - 1].stockFlag = 1
            // this.$set()
            this.dataFormTwo[index - 1].defaultFlag = true
          }
          this.dataFormTwo[index].defaultReport = true
        }
      })
      this.calcHeight()
    },

    // 提交校验
    equipment_process_relExist() {
      let isOk = true
      return isOk
    },
    clearData() {
      this.dataForm.id = ''
      this.dataForm.name = ''
      this.dataForm.code = ''
      this.dataForm.callbackMethod = ''
      this.dataFormTwo = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type, approvalFlag) {
      console.log(type, ';rr')
      // rowData = JSON.parse(rowData)
      // 此处判断用户选择新增还是编辑
      this.getDepartmentList()
      this.dataForm.id = id || ''
      this.approvalFlag = approvalFlag
      this.visible = true
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()

        if (!this.dataForm.id) {
          this.clearData()
          this.fetchData('bm_sc_cx', true)

        } else {
          this.loading = true
          // this.dataForm = rowData
          // 获取当前项详情
          this.fetchData('bm_sc_cx', false)
          getProductionLineInfo(this.dataForm.id).then((res) => {
            console.log(res, 'res')
            this.dataForm = {
              ...this.dataForm,
              ...res.data.prodLine
            }

            res.data.workstationList.forEach((item) => {
              console.log(item, 'uiuiuiu')
              item.name = item.processName
              item.code = item.processCode
              item.processType = item.processType
            })
            this.dataFormTwo = res.data.workstationList
            this.dataFormTwo = this.dataFormTwo.map((item) => {
              return {
                ...item,
                bimRoutingProcessResourceDTOList: item.workstationResList
              }
            })
            this.dataFormTwo.forEach((item) => {
              item.bimRoutingProcessResourceDTOList.forEach((it) => {
                console.log(it, 'iiii')
                it.jobNumber = it.resourceCode
              })
            })
            if (this.type === 'edit') {

            } else {

            }
            this.loading = false
            // if (res.data.attachmentList) {
            //   res.data.attachmentList.forEach((item) => {
            //     this.datafilelist.push({
            //       name: item.document.fullName,
            //       fileSize: item.document.fileSize,
            //       filename: item.document.filePath,
            //       id: item.document.id,
            //       url: item.url
            //     })
            //   })
            // }
          })
        }
      })
    },
    // 表单提交
    handleSubmit(type) {
      this.request(type)
    },
    // 校验与聚焦
    checkAndFocus() {
      let isOk = true // 决定是否满足发送请求的条件
      let focu = true // 判断自动聚焦是否已经使用了

      // 校验dataForm
      let checkDataForm = () => {
        this.$refs['elForm'].validate((valid) => {
          let focusFirstChild = (el) => {
            if (el && el.nodeType === 1) {
              if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.focus()
              } else {
                const children = el.childNodes
                for (let i = 0; i < children.length; i++) {
                  const child = children[i]
                  if (child.nodeType === 1) {
                    focusFirstChild(child)
                    break
                  }
                }
              }
            }
          }
          if (!valid) {
            isOk = false
            focu = false
            // 表单验证失败，聚焦到第一个验证失败的表单项
            for (let i = 0; i < this.formItems.length; i++) {
              const formItem = this.$refs[this.formItems[i].ref]
              if (formItem.validateState === 'error') {
                focusFirstChild(formItem.$children[1].$el)
                break
              }
            }
          }
        })
      }
      // checkDataForm()

      // 校验tableForm
      let checkTableForm = () => {
        // 生成一个对应多个ratio和targetName的数组
        let refTotal = this.dataFormTwo.length
        for (let i = 0; i < refTotal; i++) {
          let refList = [this.$refs['tableForm_1_' + i], this.$refs['tableForm_2_' + i]]
          refList.forEach((item) => {
            item.validate((valid) => {
              if (!valid) {
                if (focu) {
                  if (item.$children[0].validateMessage == '请选择转换后单位名称') {
                    // 聚焦并展开el-select
                    // item.$children[0].focus()
                    // item.$children[0].showPopper()
                    // item.$children[0].showMessage()
                  }
                  item.$el[0].focus()
                  focu = false
                }
                isOk = false
              }
            })
          })
        }
      }
      // checkTableForm()
      return isOk
    },
    request(type) {
      let flag = true
      this.btnLoading = true
      if (this.departmentList.length) {
        for (let i = 0; i < this.dataFormTwo.length; i++) {
          // const lastDepartmentId = this.dataFormTwo[i].departmentId[this.dataFormTwo[i].departmentId.length - 1];
          if (this.dataFormTwo[0].departmentName != 'undefined' && this.dataFormTwo[0].departmentName) {
            if (this.dataFormTwo[i].departmentName.indexOf(this.departmentList[i].departmentId)) {
              this.dataFormTwo[i].departmentId = this.departmentList[i].departmentId
            }
          }
        }
      }
      if (this.dataFormTwo.length == 1 && this.dataFormTwo[0].processingType === 'external_production') {
        this.$message.error('至少添加一道自制工序')
        this.btnLoading = false
        flag = false
        return
      }
      if (this.datafilelist.length) {
        this.datafilelist.map((item, index) => {
          item.bimAttachments = {
            businessType: 'customer',
            documentId: item.id,
            fileFlag: '',
            sort: index
          }
        })
      }

      this.dataFormTwo = this.dataFormTwo.map((item, index) => {
        // 复制当前的item
        let newItem = { ...item }
        newItem.sort = index
        // 如果存在下一个元素，则添加 nextId
        if (index < this.dataFormTwo.length - 1) {
          newItem.nextId = this.dataFormTwo[index + 1].processId
        }

        // 如果存在上一个元素，则添加 previousId
        if (index > 0) {
          newItem.previousId = this.dataFormTwo[index - 1].processId
        }

        return newItem // 返回修改后的对象
      })
      let newArr = []
      if (this.dataForm.id) {
        newArr = this.dataFormTwo.map((item) => {
          // Create a new object with the routingLine and bimRoutingProcessResourceDTOList
          return {
            workstation: {

              customColumn: item.customColumn,

              id: item.id,

              processId: item.processId,
              productionLineId: item.productionLineId,
              remark: item.remark,

            },
            workstationResList: item.bimRoutingProcessResourceDTOList || [] // Add this check for existing resources
          }
        })
      } else {
        newArr = this.dataFormTwo.map((item) => {
          console.log(item, 'pppppppppppppppp')
          // Create a new object with the routingLine and bimRoutingProcessResourceDTOList
          return {
            workstation: {

              customColumn: item.customColumn,

              id: item.id,

              processId: item.processId ? item.processId : item.id,
              productionLineId: item.productionLineId,
              remark: item.remark,
            },
            workstationResList: item.bimRoutingProcessResourceDTOList || [] // Add this check for existing resources
          }
        })
      }
      newArr.forEach(item => {
        console.log(item)
        item.workstationResList.forEach(it => {
          console.log(it, ';;;;')
          it.processId = item.workstation.processId
        })
      })
      this.dataForm.documentStatus = type
      let _data = {
        prodLine: this.dataForm,
        // documentStatus: type,
        workstationList: newArr,
        attachmentList: this.datafilelist,
        // flowData: this.flowData
      }

      let msgs = ''
      if (type === 'draft') {
        msgs = '保存成功'
      } else {
        msgs = '提交成功'
      }
      console.log(_data, '_data')
      if (flag) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.length === 0) {
              this.$message.error('请至少选择一条工序')
              this.btnLoading = false
            } else {
              if (!this.dataForm.id) {
                addProductionLineData(_data)
                  .then((res) => {
                    if (res.msg === 'Success') res.msg = '新建成功'
                    this.btnLoading = false
                    this.$message({
                      message: msgs,
                      type: 'success',
                      duration: 1000,
                      onClose: () => {
                        this.visible = false
                        this.btnLoading = false
                        this.$emit('close', true)
                      }
                    })
                    // this.visible = false
                  })
                  .catch(() => {
                    this.btnLoading = false
                  })
              } else {
                editProductionLineData(_data)
                  .then((res) => {
                    if (res.msg === 'Success') res.msg = '修改成功'
                    this.$message({
                      message: msgs,
                      type: 'success',
                      duration: 1000,
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
              }
            }
          } else {
            this.btnLoading = false
          }
        })
      }
    },

    submit(id, data) {
      let list = data.map((item) => item.all)
      if (list.length) {
        this.responseLoading = true
        let ind = list.length
        let responseFlag = null
        if (this.dataFormTwo.length) {
          this.dataFormTwo = this.dataFormTwo.filter((item) => {
            return !list.some((element) => element.id === item.processId)
          })
        }
        list = list.sort((a, b) => a._index - b._index)
        list.forEach((item, index) => {
          let obj = {
            index: item._index,
            name: item.name, // 工序名称
            code: item.code,
            processType: item.processType,
            // routingId:
            processId: item.id,
            // bimRoutingProcessResourceDTOList: [],
            reportFlag: 0, // 是否报工
            checkFlag: 0, // 是否检验
            processingType: item.processingType, // 加工类型
            cooperativePartnerId: null, // 合作伙伴id
            cooperativePartnerName: '',
            departmentId: null, // 部门id
            stockFlag: 0, // 是否入库
            firstInspection: 0, // 是否首检
            firstFlag: false, //是否首道工序
            lastFlag: false // 是否末道工序
          }
          responseFlag = true

          this.dataFormTwo.push(obj)
          this.$nextTick(() => {
            this.dataFormTwo.forEach((item, index) => {
              item.defaultFlag = false
              item.defaultReport = false
              if (index == this.dataFormTwo.length - 1) {
                item.lastFlag = true
                item.stockFlag = true
                if (this.dataFormTwo[index].processingType == 'external_production') {
                  item.reportFlag = false
                } else {
                  item.reportFlag = true
                }
              } else {
                item.lastFlag = false
                item.stockFlag = false
                item.reportFlag = false
              }
              if (index === 0) {
                item.firstFlag = true
              } else {
                item.firstFlag = false
              }
              if (item.processingType === 'external_production') {
                item.stockFlag = true
                item.defaultFlag = true
                item.reportFlag = false

                if (index != 0 && this.dataFormTwo[index - 1].processingType != 'external_production') {
                  this.dataFormTwo[index - 1].reportFlag = 1
                  this.dataFormTwo[index - 1].stockFlag = 1
                  // this.$set()
                  this.dataFormTwo[index - 1].defaultFlag = true
                }
                this.dataFormTwo[index].defaultReport = true
              }
            })
          })
        })
        this.dataFormTwo.forEach((item) => {
          getBimProcessDetail(item.processId)
            .then((res) => {
              console.log(res, 'ooooo')
              if (res.data.resourceList.length) {
                item.bimRoutingProcessResourceDTOList = res.data.resourceList
              }
            })
            .catch((error) => {
              responseFlag = false
            })
        })
        if (responseFlag === false) {
          this.responseLoading = true
        } else {
          this.responseLoading = false
        }
      } else {
        let ind = 0
        this.dataFormTwo = []
      }
      this.calcHeight()
    },
    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.splice(index, 1)
      this.dataFormTwo.forEach((item, i) => {
        if (i == 0) {
          item.firstFlag = true
        } else {
          item.firstFlag = false
          item.stockFlag = false
          item.reportFlag = false
        }
        if (i == this.dataFormTwo.length - 1) {
          item.lastFlag = true
          item.stockFlag = true
          if (this.dataFormTwo[i].processingType == 'external_production') {
            item.reportFlag = false
          } else {
            item.reportFlag = true
          }
        } else {
          item.lastFlag = false
          item.stockFlag = false
          item.reportFlag = false
        }
        if (item.processingType === 'external_production') {
          item.stockFlag = true
          item.defaultFlag = true
          if (i != 0 && this.dataFormTwo[i - 1].processingType != 'external_production') {
            this.dataFormTwo[i - 1].reportFlag = 1
            this.dataFormTwo[i - 1].stockFlag = 1
            // this.$set()
            this.dataFormTwo[i - 1].defaultFlag = true
          }
          this.dataFormTwo[i].defaultReport = true
        }
      })
      this.calcHeight()
    },
    // 产线资源
    handlerOpenSource(index, type) {
      console.log(type, 'uuuuuu')
      // if (!this.dataFormTwo[index].resourceType) {
      //     this.$message({
      //         message: '请选择产线资源类型',
      //         type: 'warning',
      //         duration: 1000,
      //     })
      //     return
      // }

      this.currntIndex = index
      this.sourceVisibled = true
      this.$nextTick(() => {
        this.$refs['sourceRef'].init([this.dataFormTwo[index]], type)
      })
    },
    // 抽屉提交
    handlerConfirm(data) {
      data.forEach(item => {
        console.log(item, '[[[]]]')
      })
      this.dataFormTwo[this.currntIndex].bimRoutingProcessResourceDTOList = data
      this.sourceVisibled = false
    },
    // 高度
    calcHeight() {
      this.$nextTick(() => {
        let tBody = document.querySelectorAll('.el-table')[1]
        tBody.style.height = 'auto'
        tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
      })
    },


  }
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.main {
  padding: 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
}

::v-deep .el-table__body-wrapper.is-scrolling-left {
  height: auto !important;
}

::v-deep .JNPF-preview-main .el-table--mini td {
  padding: 8px 0 !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}
</style>
<style lang="scss" scoped>
// .main {
//   padding: 0px 20px;
// }

.el-button--small {
  padding: 1;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
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

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep #sleeve .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  // margin-bottom: 10px;
  border-bottom: none !important;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
</style>
