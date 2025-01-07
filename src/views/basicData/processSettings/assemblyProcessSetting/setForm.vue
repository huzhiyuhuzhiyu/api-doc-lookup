<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" content="批量设置工艺" />
          <div class="options" v-if="type != 'look'">
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main" ref="main" v-loading="responseLoading">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="modelInfo" class="orderInfo">
                  <el-row :gutter="15" style="padding: 0 10px;">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <template v-if="!loading">
                        <el-col :span="24">
                          <el-form-item label="工艺路线" prop="routingId">
                            <el-select v-model="dataForm.routingId" filterable placeholder="请选择工艺路线" clearable
                              style="width: 100%;" @change="routingChange">
                              <el-option v-for="(item, index) in routingIdOptions" :key="index" :label="item.name"
                                :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </template>
                    </el-form>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="工序信息" name="processInfo">
                  <el-col :span="24">
                    <div v-if="type !== 'look'">
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        icon="el-icon-plus" :disabled="type == 'look' ? true : false"
                        @click="openSeleceProcessDialog(dataFormTwo.length, 'add')">
                        选择工序
                      </el-button>
                      |
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                        批量删除
                      </el-button>
                      |
                    </div>

                    <JNPF-table :hasC="type !== 'look'" hasNO style="border: 1px solid #e3e7ee;" ref="processRef"
                      @selection-change="handeleProductInfoData" :data="dataFormTwo" size="mini" id="table"
                      row-key="code" :hasMove="type !== 'look'" @changeMove="changeMove" :height="customStyleData">
                      <!-- <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" />
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" /> -->
                      <el-table-column prop="name" label="工序名称" width="180" show-overflow-tooltip>
                        <template slot="header">
                          <span class="required">*</span>
                          工序名称
                        </template>
                        <template slot-scope="scope">
                          {{ scope.row.name }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="code" label="工序编码" min-width="140" />
                      <el-table-column prop="projectName" label="所属项目" width="120"
                        v-if="isProjectSwitch === '1'"></el-table-column>
                      <el-table-column prop="processType" label="工序类型" width="120">
                        <template slot-scope="scope">
                          <template v-if="scope.row.processType == 'normal'">
                            正常工序
                          </template>
                          <template v-if="scope.row.processType == 'vibrate'">
                            测振工序
                          </template>
                          <template v-if="scope.row.processType == 'heat_treatment'">
                            热工工序
                          </template>
                          <template v-if="scope.row.processType == 'packing'">
                            包装工序
                          </template>
                          <template v-if="scope.row.processType == 'pairs'">
                            配对工序
                          </template>
                          <template v-if="scope.row.processType == 'grinding'">
                            磨孔工序
                          </template>
                          <template v-if="scope.row.processType == 'accuracy'">
                            精度工序
                          </template>
                        </template>
                      </el-table-column>
                      <el-table-column prop="processingType" label="加工类型" width="100">
                        <template slot-scope="scope">
                          <template v-if="scope.row.processingType === 'self_produced'">
                            自制
                          </template>
                          <template v-if="scope.row.processingType === 'external_production'">
                            外协
                          </template>
                        </template>
                      </el-table-column>
                      <el-table-column prop="technicalRequirement" label="技术要求" width="180" show-overflow-tooltip
                        v-if="isTechnicalSwitch === '1'">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.technicalRequirement" placeholder="请输入技术要求"
                            :disabled="disabled"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="inspectionInformation" label="检验信息" width="180" show-overflow-tooltip
                        v-if="isCheckingSwitch === '1'">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.inspectionInformation" placeholder="请输入检验信息"
                            :disabled="disabled"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="firstFlag" label="是否首道工序" width="120">
                        <template slot-scope="scope">
                          <el-form :ref="`tableForm_1_${scope.$index}`" :model="scope.row">
                            <el-form-item prop="firstFlag" ref="firstFlag">
                              <el-checkbox :label="true" v-model="scope.row.firstFlag" :true-label="1" disabled>
                                {{ scope.row.firstFlag ? '是' : '否' }}
                              </el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="pickingFlag" label="是否领料" width="90">
                        <template slot-scope="{ row }">
                          <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                            <el-form-item prop="pickingFlag" ref="pickingFlag">
                              <el-checkbox v-model="row.pickingFlag" :true-label="1" :disabled="type == 'look'"
                                :false-label="0">
                                {{ row.pickingFlag ? '是' : '否' }}
                              </el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="firstInspection" label="是否首检" width="90">
                        <template slot-scope="{ row }">
                          <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                            <el-form-item prop="firstInspection" ref="firstInspection">
                              <el-checkbox v-model="row.firstInspection" :true-label="1"
                                :disabled="type == 'look' || row.processingType === 'external_production'"
                                :false-label="0">
                                {{ row.firstInspection ? '是' : '否' }}
                              </el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="checkFlag" label="是否检验" width="90">
                        <template slot-scope="{ row }">
                          <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                            <el-form-item prop="checkFlag" ref="checkFlag">
                              <el-checkbox v-model="row.checkFlag" :true-label="1"
                                :disabled="type == 'look' || row.processingType === 'external_production'"
                                :false-label="0">
                                {{ row.checkFlag ? '是' : '否' }}
                              </el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="reportFlag" label="是否报工" width="90">
                        <template slot-scope="scope">
                          <el-form :ref="`tableForm_1_${scope.$index}`" :model="scope.row" :rules="rulesTwo">
                            <el-form-item prop="reportFlag" ref="reportFlag">
                              <el-checkbox v-model="scope.row.reportFlag" :true-label="1" :disabled="scope.row.defaultReport ||
                                scope.row.defaultFlag ||
                                scope.$index === dataFormTwo.length - 1 ||
                                type === 'look'
                                " :false-label="0">
                                {{ scope.row.reportFlag ? '是' : '否' }}
                              </el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>

                      <!-- <el-table-column prop="checkFlag" label="是否检验工序" min-width="140">
                          <template slot-scope="{row}">
                            <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                              <el-form-item prop="checkFlag" ref="checkFlag">
                                <el-checkbox v-model="row.checkFlag" :true-label="1" :disabled="type == 'look'"
                                  :false-label="0"></el-checkbox>
                              </el-form-item>
                            </el-form>
                          </template>
                        </el-table-column> -->

                      <el-table-column prop="stockFlag" label="是否入库" width="90">
                        <template slot-scope="scope">
                          <el-form :ref="`tableForm_1_${scope.$index}`" :model="scope.row" :rules="rulesTwo">
                            <el-form-item prop="stockFlag" ref="stockFlag">
                              <el-checkbox v-model="scope.row.stockFlag" :disabled="scope.$index === dataFormTwo.length - 1 ||
                                type === 'look'
                                ">
                                {{ scope.row.stockFlag ? '是' : '否' }}
                              </el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>

                      <el-table-column prop="lastFlag" label="是否末道工序" width="120">
                        <template slot-scope="scope">
                          <el-form :ref="`tableForm_1_${scope.row.index}`" :model="scope.row">
                            <el-form-item prop="lastFlag" ref="lastFlag">
                              <el-checkbox :label="true" v-model="scope.row.lastFlag" disabled>
                                {{ scope.row.lastFlag ? '是' : '否' }}
                              </el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="workOrderFlag" label="是否生成工单" width="130">
                        <template slot-scope="{ row }">
                          <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                            <el-form-item prop="workOrderFlag" ref="workOrderFlag">
                              <el-checkbox v-model="row.workOrderFlag" :true-label="1"
                                :disabled="type == 'look' || row.processingType === 'self_produced'" :false-label="0">
                                {{ row.workOrderFlag ? '是' : '否' }}
                              </el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            :disabled="type == 'look' || dataForm.documentStatus == 'submit'"
                            @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                          <el-button type="text" @click="handlerOpenSource(scope.$index, type)"
                            :disabled="scope.row.processingType === 'external_production'">
                            工艺资源配置
                          </el-button>
                        </template>
                      </el-table-column>
                    </JNPF-table>
                  </el-col>
                </el-collapse-item>
              </el-collapse>
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
import { getProcessList, batchProcess, detailProcess, checkBimRoutingCode, updateProcess } from '@/api/basicData/processSettingss'
import ProcessDialog from '../processSettingss/process-dialog.vue'
import SourceArea from '../processSettingss/source.vue'
import { getCooperativeData, getBimBusinessDetail } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getBimProcessList, getBimProcessDetail } from '@/api/bimProcess/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow'
import recordList from '@/views/workFlow/components/RecordList.vue'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: {
    ProcessDialog,
    SourceArea,
    Process,
    recordList
  },
  mixins: [busFlow, getProjectList],
  props: [],
  data() {
    return {
      isProjectSwitch: '',
      isTechnicalSwitch: '',
      isCheckingSwitch: '',
      projectIdData: [],
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
      selectedData: [],
      projectId: '',
      ProductMethodArr: [
        {
          label: '工序分类',
          type: 'process',
          method: getcategoryTree,
          requestObj: { type: 'process' }
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
      dataForm: {
        projectId: '',
        id: '',
        routingId: '', //  工艺路线Id
      },
      // cooperativePartnerName: '',
      type: '',
      dataFormTwo: [],
      codeConfig: {},
      rules: {
        routingId: [
          {
            required: true,
            message: '请选择工艺路线',
            trigger: ['change']
          }
        ],

        projectId: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
      },

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
      responseLoading: true,
      flowTemplateJson: {},
      flowData: {},
      flowTaskOperatorRecordList: [],
      endTime: 0,
      isattachmentswitch: '',
      categoryId: '',
      customStyleData: 0,
      customStyleData2: 0
    }
  },
  mounted() {

    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.processRef) return
      this.$nextTick(() => {
        this.$refs.processRef.doLayout()
      })
    }
    window.addEventListener('resize', this.clientResize)
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
    await this.getTechnicalSwitch('produce', 'technical_requirement')
    await this.getCheckingSwitch('produce', 'checking_information')

    await this.switchStyleheight()
    this.responseLoading = false
 
    if (this.isProjectSwitch === '1') {
      this.projectIdData = this.projectIdData.filter(item => item.id !== '1')
      this.ProductTableItems.unshift({ prop: 'projectName', label: '所属项目', fixed: 'left' })
    } else {
      this.dataForm.projectId = this.userInfo.projectId
    }
    if (this.isCheckingSwitch === '1') {
      this.ProductTableItems.push({ prop: 'inspectionInformation', label: '检验信息', fixed: 'left' })
    }
    if (this.isTechnicalSwitch === '1') {
      this.ProductTableItems.push({ prop: 'technicalRequirement', label: '技术要求', fixed: 'left' })
    }
    this.getBimBusinessDetail()
  },
  methods: {

    routingChange(val) {
      this.dataForm.routingId = val

      if (this.dataForm.routingId) {
        detailProcess(val).then((res) => {
          this.dataForm = {
            ...this.dataForm,
            ...res.data.routing
          }
          res.data.routingLineList.forEach((item) => {
            item.name = item.processName
            item.code = item.processCode
            item.processType = item.processType
          })
          this.dataFormTwo = res.data.routingLineList

          this.dataFormTwo = this.dataFormTwo.map((item) => {
            return {
              ...item,
              bimRoutingProcessResourceDTOList: item.routingProResList
            }
          })
          this.dataFormTwo.forEach((item) => {
            item.bimRoutingProcessResourceDTOList.forEach((it) => {
              it.jobNumber = it.resourceCode
            })
          })

          this.dataFormTwo.sort((a, b) => a.sort - b.sort);
        })
      } else {
        this.dataFormTwo = []
      }
    },
    switchStyleheight() {
      const mainRegion1 = this.$refs.main // 表单页面区域

      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight = mainHeight1 - 350
      console.log(maxHeight, 'maxHeight')
      this.customStyleData = maxHeight
      this.customStyleData2 = maxHeight + 70
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },
    async getTechnicalSwitch(code, type) {
      try {
        this.isTechnicalSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getCheckingSwitch(code, type) {
      try {
        this.isCheckingSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    projectIdChange(val) {
      this.dataForm.projectId = val
      if (this.isProjectSwitch === '1') {
        this.dataFormTwo = []
      }
    },
    changeMove(data) {
      data.forEach((item) => {
        item.sort = item.sortCode

      })
      this.dataFormTwo = this.dataFormTwo.map((item, index) => {
        // 复制当前的item
        let newItem = { ...item }
        newItem.sort = index
        // 如果存在下一个元素，则添加 nextId
        if (index === 0) {

          newItem.firstFlag = true
          newItem.lastFlag = false
          newItem.reportFlag = false
          newItem.stockFlag = false
        }
        if (index === this.dataFormTwo.length - 1) {

          newItem.firstFlag = false
          newItem.lastFlag = true
          newItem.reportFlag = true
          newItem.stockFlag = true
        }
        if (index < this.dataFormTwo.length - 1 && index !== 0) {

          newItem.firstFlag = false
          newItem.lastFlag = false
          newItem.reportFlag = false
          newItem.stockFlag = false
        }

        // 如果存在上一个元素，则添加 previousId
        if (index > 0 && index !== this.dataFormTwo.length - 1) {

          newItem.firstFlag = false
          newItem.lastFlag = false
          newItem.reportFlag = false
          newItem.stockFlag = false
        }

        return newItem // 返回修改后的对象
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
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_gylx'
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
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
        } else if (item.processType == 'vibrate') {
          item.processTypeName = '测振工序'
        } else if (item.processType == 'heat_treatment') {
          item.processTypeName = '热工工序'
        } else if (item.processType == 'packing') {
          item.processTypeName = '包装工序'
        } else if (item.processType == 'pairs') {
          item.processTypeName = '配对工序'
        } else if (item.processType == 'grinding') {
          item.processTypeName = '磨孔工序'
        } else if (item.processType == 'accuracy') {
          item.processTypeName = '精度工序'
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
      if (this.isProjectSwitch === '1') {
        if (!this.dataForm.routingId) {
          this.$message.error('请先选择工艺路线')
          return
        }
        this.ProductListRequestObj.projectId = this.selectedData[0].projectId
      }
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
    init(data, type, routingIdOptions) {
      this.selectedData = data
  
      this.routingIdOptions = JSON.parse(routingIdOptions)
      // 此处判断用户选择新增还是编辑
      this.visible = true
      this.type = type
    },
    // 表单提交
    handleSubmit(type) {
      this.request(type)
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
      if (this.dataFormTwo.length > 1) {
        // 判断是否存在 "vibrate" 和 "accuracy"  
        let hasVibrate = this.dataFormTwo.some(item => item.processType === "vibrate");
        let hasAccuracy = this.dataFormTwo.some(item => item.processType === "accuracy");

        let bothExist = hasVibrate && hasAccuracy;
        if (bothExist) {
          this.$message.error('测振工序与精度工序不能同时存在，请检查后重试')
          this.btnLoading = false
          flag = false
          return
        }
        // 筛选出 processType 为 "vibrate" 的元素  
        let vibrateItems = this.dataFormTwo.filter(item => item.processType === "vibrate");
        // 判断是否有两条及以上  
        let hasTwoOrMoreVibrate = vibrateItems.length >= 2;
        if (hasTwoOrMoreVibrate) {
          this.$message.error('存在多条测振工序的数据，请检查后重试')
          this.btnLoading = false
          flag = false
          return
        }


        let heatTrearmentItems = this.dataFormTwo.filter(item => item.processType === "heat_treatment");
        // 判断是否有两条及以上  
        let hasTwoOrMoreHeatTrearmentItems = heatTrearmentItems.length >= 2;
        if (hasTwoOrMoreHeatTrearmentItems) {
          this.$message.error('存在多条热工工序的数据，请检查后重试')
          this.btnLoading = false
          flag = false
          return
        }


        let packingItems = this.dataFormTwo.filter(item => item.processType === "packing");
        // 判断是否有两条及以上  
        let hasTwoOrMorepacking = packingItems.length >= 2;
        if (hasTwoOrMorepacking) {
          this.$message.error('存在多条包装工序的数据，请检查后重试')
          this.btnLoading = false
          flag = false
          return
        }

        let pairsItems = this.dataFormTwo.filter(item => item.processType === "pairs");
        // 判断是否有两条及以上  
        let hasTwoOrMorepairs = pairsItems.length >= 2;
        if (hasTwoOrMorepairs) {
          this.$message.error('存在多条配对工序的数据，请检查后重试')
          this.btnLoading = false
          flag = false
          return
        }

        let grindingItems = this.dataFormTwo.filter(item => item.processType === "grinding");
        // 判断是否有两条及以上  
        let hasTwoOrMoregrinding = grindingItems.length >= 2;
        if (hasTwoOrMoregrinding) {
          this.$message.error('存在多条磨孔工序的数据，请检查后重试')
          this.btnLoading = false
          flag = false
          return
        }

        let accuracyItems = this.dataFormTwo.filter(item => item.processType === "accuracy");
        // 判断是否有两条及以上  
        let hasTwoOrMoreaccuracy = accuracyItems.length >= 2;
        if (hasTwoOrMoreaccuracy) {
          this.$message.error('存在多条精度工序的数据，请检查后重试')
          this.btnLoading = false
          flag = false
          return
        }

      }


      if (this.datafilelist.length) {
        this.datafilelist.map((item, index) => {
          item.bimAttachments = {
            businessType: 'system_attachment',
            configKey: 'fj_gylx',
            categoryId: this.categoryId,
            documentId: item.id,
            fileFlag: '',
            sort: index
          }
        })
      }
      if (this.dataFormTwo.length > 1) {
        this.dataFormTwo = this.dataFormTwo.map((item, index) => {
          // 复制当前的item
          let newItem = { ...item }
          newItem.sort = index
          // 如果存在下一个元素，则添加 nextId
          if (index === 0) {
            newItem.previousId = ''
            newItem.nextId = this.dataFormTwo[index + 1].processId
            newItem.firstFlag = true
            newItem.lastFlag = false
          }
          if (index === this.dataFormTwo.length - 1) {
            newItem.previousId = this.dataFormTwo[index - 1].processId
            newItem.nextId = ''
            newItem.firstFlag = false
            newItem.lastFlag = true
          }
          if (index < this.dataFormTwo.length - 1 && index !== 0) {
            newItem.nextId = this.dataFormTwo[index + 1].processId
            newItem.firstFlag = false
            newItem.lastFlag = false
          }

          // 如果存在上一个元素，则添加 previousId
          if (index > 0 && index !== this.dataFormTwo.length - 1) {
            newItem.previousId = this.dataFormTwo[index - 1].processId
            newItem.firstFlag = false
            newItem.lastFlag = false
          }

          return newItem // 返回修改后的对象
        })
      }

      this.btnLoading = false
      // return
      let newArr = []
   
      if (this.dataForm.id) {
        newArr = this.dataFormTwo.map((item) => {
          // Create a new object with the routingLine and bimRoutingProcessResourceDTOList
          return {
            routingLine: {
              checkFlag: item.checkFlag,
              customColumn: item.customColumn,
              firstFlag: item.firstFlag,
              firstInspection: item.firstInspection,
              id: item.id,
              lastFlag: item.lastFlag,
              workOrderFlag: item.workOrderFlag,
              nextId: item.nextId,
              pickingFlag: item.pickingFlag,
              previousId: item.previousId,
              processId: item.processId,
              processType: item.processType,
              processingType: item.processingType,
              remark: item.remark,
              reportFlag: item.reportFlag,
              routingId: item.routingId,
              sort: item.sort,
              stockFlag: item.stockFlag,
              technicalRequirement: item.technicalRequirement,
              inspectionInformation: item.inspectionInformation
            },
            routingProcResList: item.bimRoutingProcessResourceDTOList || [] // Add this check for existing resources
          }
        })
      } else {
        newArr = this.dataFormTwo.map((item) => {
          // Create a new object with the routingLine and bimRoutingProcessResourceDTOList
          return {
            routingLine: {
              index: item.index,
              name: item.name,
              code: item.code,
              processType: item.processType,
              processId: item.processId,
              reportFlag: item.reportFlag,
              checkFlag: item.checkFlag,
              processingType: item.processingType,
              cooperativePartnerId: item.cooperativePartnerId,
              cooperativePartnerName: item.cooperativePartnerName,
              departmentId: item.departmentId,
              stockFlag: item.stockFlag,
              firstInspection: item.firstInspection,
              pickingFlag: item.pickingFlag,
              firstFlag: item.firstFlag,
              lastFlag: item.lastFlag,
              workOrderFlag: item.workOrderFlag,
              defaultFlag: item.defaultFlag,
              defaultReport: item.defaultReport,
              sort: item.sort,
              nextId: item.nextId,
              previousId: item.previousId,
              technicalRequirement: item.technicalRequirement,
              inspectionInformation: item.inspectionInformation
            },
            routingProcResList: item.bimRoutingProcessResourceDTOList || [] // Add this check for existing resources
          }
        })
      }

      this.dataForm.documentStatus = type
      this.productsIds = this.selectedData.map(item => {
        return item.productsId
      })
      let _data = {
        routing: this.dataForm,
        // documentStatus: type,
        productsIds: this.productsIds,
        routingLineList: newArr,
        attachmentList: this.datafilelist,
        flowData: this.flowData
      }

      let msgs = ''
      if (type === 'draft') {
        msgs = '保存成功'
      } else {
        msgs = '提交成功'
      }
      if (flag) {
        if (this.dataFormTwo.length === 0) {
          this.$message.error('请至少选择一条工序')
          this.btnLoading = false
        } else {

          batchProcess(_data)
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

        }
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
            projectName: item.projectName, // 所属项目名称
            projectId: item.projectId, // 所属项目Id
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
            lastFlag: false, // 是否末道工序
            workOrderFlag: 1, // 是否生成工单
            technicalRequirement: item.technicalRequirement,
            inspectionInformation: item.inspectionInformation
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
    // 工艺资源
    handlerOpenSource(index, type) {
      // if (!this.dataFormTwo[index].resourceType) {
      //     this.$message({
      //         message: '请选择工艺资源类型',
      //         type: 'warning',
      //         duration: 1000,
      //     })
      //     return
      // }
      console.log(this.dataFormTwo[index], 'this.dataFormTwo[index]')
      this.currntIndex = index
      this.sourceVisibled = true
      this.$nextTick(() => {
        this.$refs['sourceRef'].init([this.dataFormTwo[index]], 'edit')
      })
    },
    // 抽屉提交
    handlerConfirm(data) {
      console.log('抽屉提交');
      console.log(this.dataFormTwo[this.currntIndex], data);
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

/* ::v-deep .el-table__body-wrapper.is-scrolling-left {
  height: auto !important;
} */

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
  // padding: 0 10px 0px;
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
