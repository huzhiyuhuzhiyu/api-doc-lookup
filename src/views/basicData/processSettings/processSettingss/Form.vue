<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="dialogTitle + `工艺`" />
          <div class="options" v-if="type != 'look'">
            <el-button type="success" :disabled="dataForm.documentStatus == 'submit'" :loading="btnLoading"
              @click="dataFormSubmit('draft')">
              保存草稿
            </el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo" style="padding:10px 0">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="型号信息" name="modelInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <template v-if="!loading">
                        <el-col :span="12">
                          <el-form-item label="工艺路线编码" prop="code" ref="code">
                            <el-input v-model="dataForm.code" placeholder="请输入工艺路线编码" clearable
                              :style="{ width: '100%' }" maxlength="20"
                              :disabled="type == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="工艺路线名称" prop="name" ref="name">
                            <el-input v-model="dataForm.name" placeholder="请输入工艺路线名称" clearable
                              :style="{ width: '100%' }" maxlength="20" :disabled="type == 'look'"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="按工艺顺序报工" prop="reportRulesFlag">
                            <el-select v-model="dataForm.reportRulesFlag" style="width:100%" :disabled="type == 'look'">
                              <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">
                              </el-option>

                            </el-select>
                          </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                      <el-form-item label="工艺状态" prop="state">
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
                          <!-- <el-input v-model="scope.row.name" readonly maxlength="20" placeholder="请输入"
                              :disabled="type == 'look'">{{
                                scope.row.name }}
                            </el-input> -->
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
                            <div class="viewData" v-if="scope.row.processType == 'vibrate'">振工序</div>
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

                      <!-- <el-table-column prop="departmentId" label="组织管理" width="340" fixed="left">
                            <template slot-scope="{row}" v-if="row.processingType == 'self_produced'">
                              <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                                <el-form-item prop="departmentId" ref="departmentId">
                                  <ComSelect ref="department" v-model="row.departmentName" placeholder="请选择所属组织" auth
                                    @change="onOrganizeChangeHandle" :currOrgId="row.departmentId || '0'"
                                    :disabled="type == 'look' ? true : false" />

                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                          <el-table-column prop="cooperativePartnerName" label="外协供应商"  width="120" fixed="left">
                            <template slot-scope="{row}" v-if="row.processingType == 'external_production'">
                              <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                                <el-form-item prop="cooperativePartnerName" ref="cooperativePartnerName">
                                  <ComSelect-list :isdisabled="type == 'look' ? true : false"
                                    v-model="row.cooperativePartnerName" placeholder="请选择外协供应商" auth
                                    @change="onOrganizeChangeThree" :title="'选择外协供应商'" :method="getCooperativeData"
                                    :requestObj="requestObj2" :paramsObj="{ row }" />
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column> -->
                      <el-table-column prop="firstFlag" label="是否首道工序" min-width="140">
                        <template slot-scope="scope">
                          <el-form :ref="`tableForm_1_${scope.$index}`" :model="scope.row">
                            <el-form-item prop="firstFlag" ref="firstFlag">
                              <!-- <el-radio-group v-model="scope.row.firstFlag">
                                    <el-radio :label="true" :disabled="type == 'look' || scope.$index != 0">{{
                                      scope.row.firstFlag ? '是' : '否' }}</el-radio>
                                  </el-radio-group> -->
                              <el-checkbox :label="true" v-model="scope.row.firstFlag" :true-label="1" disabled>
                                {{ scope.row.firstFlag ? '是' : '否' }}
                              </el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="pickingFlag" label="是否领料" min-width="130">
                        <template slot-scope="{ row }">
                          <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                            <el-form-item prop="pickingFlag" ref="pickingFlag">
                              <el-checkbox v-model="row.pickingFlag" :true-label="1" :disabled="type == 'look'"
                                :false-label="0"></el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="firstInspection" label="是否首检" min-width="130">
                        <template slot-scope="{ row }">
                          <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                            <el-form-item prop="firstInspection" ref="firstInspection">
                              <el-checkbox v-model="row.firstInspection" :true-label="1"
                                :disabled="type == 'look' || row.processingType === 'external_production'"
                                :false-label="0"></el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="checkFlag" label="是否检验" min-width="130">
                        <template slot-scope="{ row }">
                          <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                            <el-form-item prop="checkFlag" ref="checkFlag">
                              <el-checkbox v-model="row.checkFlag" :true-label="1"
                                :disabled="type == 'look' || row.processingType === 'external_production'"
                                :false-label="0"></el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="reportFlag" label="是否报工" min-width="130">
                        <template slot-scope="scope">
                          <el-form :ref="`tableForm_1_${scope.$index}`" :model="scope.row" :rules="rulesTwo">
                            <el-form-item prop="reportFlag" ref="reportFlag">
                              <el-checkbox v-model="scope.row.reportFlag" :true-label="1" :disabled="scope.row.defaultReport ||
                                scope.row.defaultFlag ||
                                scope.$index === dataFormTwo.length - 1 ||
                                type === 'look'
                                " :false-label="0"></el-checkbox>
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

                      <el-table-column prop="stockFlag" label="是否入库" min-width="130">
                        <template slot-scope="scope">
                          <el-form :ref="`tableForm_1_${scope.$index}`" :model="scope.row" :rules="rulesTwo">
                            <el-form-item prop="stockFlag" ref="stockFlag">
                              <el-checkbox v-model="scope.row.stockFlag" :true-label="1" :disabled="scope.row.defaultFlag ||
                                scope.$index === dataFormTwo.length - 1 ||
                                type === 'look' ||
                                scope.row.processingType === 'external_production'
                                " :false-label="0"></el-checkbox>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>

                      <el-table-column prop="lastFlag" label="是否末道工序" min-width="140">
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
                      <el-table-column label="操作" min-width="180" fixed="right">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            :disabled="type !== 'add' && dataForm.documentStatus == 'submit'"
                            @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                          <el-button type="text" @click="handlerOpenSource(scope.$index, type)">
                            工艺资源配置
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
            <el-tab-pane label="附件" name="annex" style="padding:10px 0">
              <UploadWj v-model="datafilelist" :disabled="type == 'look'" :detailed="type == 'look'"></UploadWj>
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
import { updateApproval } from '@/api/basicData/approvalBusinessConditions'
import { addProcess, detailProcess, checkBimRoutingCode, updateProcess } from '@/api/basicData/processSettingss'
import ProcessDialog from './process-dialog.vue'
import SourceArea from './source.vue'
import { getOrganizeInfo, getOrganizeList } from '@/api/permission/organize'
import { getCooperativeData } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getBimProcessList, getBimProcessDetail } from '@/api/bimProcess/index'
export default {
  components: {
    ProcessDialog,
    SourceArea
  },
  props: [],
  data() {
    return {
      activeName: 'jcInfo',
      activeNames: ['modelInfo', 'processInfo'],
      datafilelist: [],
      getBimProcessList,
      options: [{
        value: true,
        label: '是'
      }, {
        value: false,
        label: '否'
      }],
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
      dataForm: {
        id: '',
        code: '', //  编码
        name: '', //  名称
        state: 'enable', //  状态
        reportRulesFlag: false,
        // status: "", //  状态
        documentStatus: '', //  状态
        reasonRejection: '', //  驳回原因
        personName: '', // 人员试验
        remark: ''
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
            message: '请输入工艺路线名称',
            trigger: ['blur']
          }
        ],
        code: [
          {
            required: true,
            message: '请输入工艺路线编码',
            trigger: ['blur']
          },
          {
            validator: (rule, value, callback) => {
              checkBimRoutingCode(value, this.dataForm.id)
                .then((res) => {
                  if (res.data) {
                    callback(new Error('工艺路线编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ],
        state: [{ required: true, message: '请选择工艺状态', trigger: 'change' }]
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
      responseLoading: false
    }
  },
  created() { },
  methods: {
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.code = data.number
        }
      } catch (error) {
      }
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
    init(id, type) {
      // rowData = JSON.parse(rowData)
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.visible = true
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()

        if (!this.dataForm.id) {
          this.clearData()
          this.fetchData('bm_gy_gylx', true)
        } else {
          this.loading = true
          // this.dataForm = rowData
          // 获取当前项详情
          this.fetchData('bm_gy_gylx', false)
          detailProcess(this.dataForm.id).then((res) => {

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
            // this.dataFormTwo.forEach((item, index) => {
            //   if (item.departmentName) {
            //     this.dataFormTwo[index].departmentName = [
            //       item.departmentName
            //         .replace('[', '')
            //         .replace(']', '')
            //         .replace(/, /g, '/')
            //     ]
            //   }
            //   if (item.supplierName) {
            //     this.dataFormTwo[index].cooperativePartnerName = item.supplierName
            //   }
            //   if (item.processingType === 'external_production') {
            //     if (index != 0 && this.dataFormTwo[index - 1].processingType != 'external_production') {
            //       this.dataFormTwo[index - 1].defaultFlag = true
            //     }
            //     this.dataFormTwo[index].defaultReport = true
            //   } else {
            //     item.defaultReport = false
            //     item.defaultFlag = false
            //   }
            // })

            // let ind = 0
            // this.dataFormTwo.forEach((item) => {
            //   item.index = ind++
            // })
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
    dataFormSubmit(type) {
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
            routingLine: {
              checkFlag: item.checkFlag,
              customColumn: item.customColumn,
              firstFlag: item.firstFlag,
              firstInspection: item.firstInspection,
              id: item.id,
              lastFlag: item.lastFlag,
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
              stockFlag: item.stockFlag
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
              firstFlag: item.firstFlag,
              lastFlag: item.lastFlag,
              defaultFlag: item.defaultFlag,
              defaultReport: item.defaultReport,
              sort: item.sort,
              nextId: item.nextId,
              previousId: item.previousId
            },
            routingProcResList: item.bimRoutingProcessResourceDTOList || [] // Add this check for existing resources
          }
        })
      }

      // Filter out the routingLine information if no bimRoutingProcessResourceDTOList exists
      // newArr = newArr.map((item) => {
      //   if (item.routingProcResList.length === 0) {
      //     delete item.routingLine // Optional step to clean up
      //   }
      //   return item
      // })

      // let arr = [
      //   {
      //     index: 0,
      //     name: '工序3',
      //     code: '工序3',
      //     processType: 'normal',
      //     processId: '1816731039093555202',
      //     reportFlag: false,
      //     checkFlag: 0,
      //     processingType: 'self_produced',
      //     cooperativePartnerId: null,
      //     cooperativePartnerName: '',
      //     departmentId: null,
      //     stockFlag: false,
      //     firstInspection: 0,
      //     firstFlag: true,
      //     lastFlag: false,
      //     defaultFlag: false,
      //     defaultReport: false,
      //     routingProcResList: [
      //       { index: 0, resourceId: 'admin', resourceName: '管理员', jobNumber: 'admin', resourceType: 'personnel' },
      //       {
      //         index: 1,
      //         resourceId: '364336330752131525',
      //         resourceName: 'iot',
      //         jobNumber: null,
      //         resourceType: 'personnel'
      //       },
      //       {
      //         index: 2,
      //         resourceId: '486912121137796677',
      //         resourceName: '胡辉',
      //         jobNumber: '15641684168',
      //         resourceType: 'personnel'
      //       }
      //     ],
      //     sort: 0,
      //     nextId: '1816730955354275842'
      //   },
      //   {
      //     index: 1,
      //     name: '工序2',
      //     code: 'gongxu2',
      //     processType: 'normal',
      //     processId: '1816730955354275842',
      //     reportFlag: false,
      //     checkFlag: 0,
      //     processingType: 'self_produced',
      //     cooperativePartnerId: null,
      //     cooperativePartnerName: '',
      //     departmentId: null,
      //     stockFlag: false,
      //     firstInspection: 0,
      //     firstFlag: false,
      //     lastFlag: false,
      //     defaultFlag: false,
      //     defaultReport: false,
      //     sort: 1,
      //     nextId: '1816439653391728641',
      //     previousId: '1816731039093555202',
      //     routingProcResList: [
      //       { index: 0, resourceId: 'admin', resourceName: '管理员', jobNumber: 'admin', resourceType: 'personnel' },
      //       {
      //         index: 1,
      //         resourceId: '364336330752131525',
      //         resourceName: 'iot',
      //         jobNumber: null,
      //         resourceType: 'personnel'
      //       },
      //       {
      //         index: 2,
      //         resourceId: '486912121137796677',
      //         resourceName: '胡辉',
      //         jobNumber: '15641684168',
      //         resourceType: 'personnel'
      //       }
      //     ]
      //   },
      //   {
      //     index: 2,
      //     name: '工序',
      //     code: 'gongxu',
      //     processType: 'normal',
      //     processId: '1816439653391728641',
      //     reportFlag: true,
      //     checkFlag: 0,
      //     processingType: 'self_produced',
      //     cooperativePartnerId: null,
      //     cooperativePartnerName: '',
      //     departmentId: null,
      //     stockFlag: true,
      //     firstInspection: 0,
      //     firstFlag: false,
      //     lastFlag: true,
      //     defaultFlag: false,
      //     defaultReport: false,
      //     sort: 2,
      //     previousId: '1816730955354275842'
      //   }
      // ]
      // 变成 newArr = [
      //   {
      //     routingLine: {
      //       index: 0,
      //       name: '工序3',
      //       code: '工序3',
      //       processType: 'normal',
      //       processId: '1816731039093555202',
      //       reportFlag: false,
      //       checkFlag: 0,
      //       processingType: 'self_produced',
      //       cooperativePartnerId: null,
      //       cooperativePartnerName: '',
      //       departmentId: null,
      //       stockFlag: false,
      //       firstInspection: 0,
      //       firstFlag: true,
      //       lastFlag: false,
      //       defaultFlag: false,
      //       defaultReport: false,

      //       sort: 0,
      //       nextId: '1816730955354275842'
      //     },
      //     routingProcResList: [
      //       { index: 0, resourceId: 'admin', resourceName: '管理员', jobNumber: 'admin', resourceType: 'personnel' },
      //       {
      //         index: 1,
      //         resourceId: '364336330752131525',
      //         resourceName: 'iot',
      //         jobNumber: null,
      //         resourceType: 'personnel'
      //       },
      //       {
      //         index: 2,
      //         resourceId: '486912121137796677',
      //         resourceName: '胡辉',
      //         jobNumber: '15641684168',
      //         resourceType: 'personnel'
      //       }
      //     ]
      //   },
      //   {
      //     routingLine: {
      //       index: 1,
      //       name: '工序2',
      //       code: 'gongxu2',
      //       processType: 'normal',
      //       processId: '1816730955354275842',
      //       reportFlag: false,
      //       checkFlag: 0,
      //       processingType: 'self_produced',
      //       cooperativePartnerId: null,
      //       cooperativePartnerName: '',
      //       departmentId: null,
      //       stockFlag: false,
      //       firstInspection: 0,
      //       firstFlag: false,
      //       lastFlag: false,
      //       defaultFlag: false,
      //       defaultReport: false,
      //       sort: 1,
      //       nextId: '1816439653391728641',
      //       previousId: '1816731039093555202'
      //     },
      //     routingProcResList: [
      //       { index: 0, resourceId: 'admin', resourceName: '管理员', jobNumber: 'admin', resourceType: 'personnel' },
      //       {
      //         index: 1,
      //         resourceId: '364336330752131525',
      //         resourceName: 'iot',
      //         jobNumber: null,
      //         resourceType: 'personnel'
      //       },
      //       {
      //         index: 2,
      //         resourceId: '486912121137796677',
      //         resourceName: '胡辉',
      //         jobNumber: '15641684168',
      //         resourceType: 'personnel'
      //       }
      //     ]
      //   },
      //   {
      //     routingLine: {
      //       index: 2,
      //       name: '工序',
      //       code: 'gongxu',
      //       processType: 'normal',
      //       processId: '1816439653391728641',
      //       reportFlag: true,
      //       checkFlag: 0,
      //       processingType: 'self_produced',
      //       cooperativePartnerId: null,
      //       cooperativePartnerName: '',
      //       departmentId: null,
      //       stockFlag: true,
      //       firstInspection: 0,
      //       firstFlag: false,
      //       lastFlag: true,
      //       defaultFlag: false,
      //       defaultReport: false,
      //       sort: 2,
      //       previousId: '1816730955354275842'
      //     }
      //   }
      // ]
      this.dataForm.documentStatus = type
      let _data = {
        routing: this.dataForm,
        // documentStatus: type,
        routingLineList: newArr,
        attachmentList: this.datafilelist
      }

      let msgs = ''
      if (type === 'draft') {
        msgs = '保存成功'
      } else {
        msgs = '提交成功'
      }
      if (flag) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.length === 0) {
              this.$message.error('请至少选择一条工序')
              this.btnLoading = false
            } else {
              if (!this.dataForm.id) {
                addProcess(_data)
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
                updateProcess(_data)
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
    // checkRepart(dataTwo,data){
    //   dataTwo.forEach((item,index)=>{
    //     data.forEach((e)=>{
    //       if (item.processId === e.id){
    //         this.dataFormTwo.splice(index,1)
    //       }
    //     })
    //   })
    // },
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

      this.currntIndex = index
      this.sourceVisibled = true
      this.$nextTick(() => {
        this.$refs['sourceRef'].init([this.dataFormTwo[index]], type)
      })
    },
    // 抽屉提交
    handlerConfirm(data) {

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
    }
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

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
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

::v-deep .el-tabs__header {
  padding: 0 !important;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
}

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
</style>
