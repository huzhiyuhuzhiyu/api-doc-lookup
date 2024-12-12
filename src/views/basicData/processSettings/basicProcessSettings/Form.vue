<template>
  <div name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="dialogTitle" />
        <div class="options" v-if="!disabled">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="140px" label-position="top">
                  <el-row :gutter="20" class="custom-row">
                    <el-col :span="12" v-if="isProjectSwitch === '1'">
                      <el-form-item label="所属项目" prop="projectId">
                        <el-select v-model="dataForm.projectId" placeholder="请选择所属项目" @change="projectIdChange"
                          :disabled="type === 'look' || type === 'edit' || userInfo.projectId !== '1'"
                          style="width:100%">
                          <el-option v-for="item in projectIdData" :key="item.id" :label="item.label"
                            :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="工序名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入工序名称" maxlength="20"
                          :disabled="disabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="工序编码" prop="code">
                        <el-input oninput="value = value.replace(/[\p{P}\p{C}\p{S}\p{M}]/gu,'')" v-model="dataForm.code"
                          placeholder="请输入工序编码" maxlength="20" :disabled="btntype ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false
                            "></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="工序分类" prop="productCategoryIdText">
                        <ComSelect-list :placeholder="placeholder" :requestObj="{ type: 'process' }"
                          :dialogTitle="'选择工序分类'" v-model="dataForm.productCategoryIdText" :isdisabled="disabled"
                          :method="getcategoryTree" :paramsObj="{}" @change="changeProductCategory"></ComSelect-list>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="加工类型" prop="processingType">
                        <el-select v-model="dataForm.processingType" placeholder="请选择加工类型" :disabled="disabled"
                          style="width:100%">
                          <el-option v-for="item in processingTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="工序类型" prop="processType">
                        <el-select v-model="dataForm.processType" placeholder="请选择工序类型" :disabled="disabled"
                          style="width:100%">
                          <el-option v-for="item in process_typeList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="技术要求" v-if="isTechnicalSwitch === '1'">
                        <el-input v-model="dataForm.name" placeholder="请输入技术要求" maxlength="20"
                          :disabled="disabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="检验信息" v-if="isCheckingSwitch === '1'">
                        <el-input v-model="dataForm.name" placeholder="请输入检验信息" maxlength="20"
                          :disabled="disabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="报工排序" prop="reportingSort">
                        <el-input v-model="dataForm.reportingSort" placeholder="请输入报工排序" maxlength="20"
                          :disabled="disabled"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="备注">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" maxlength="200" show-word-limit
                          type="textarea" :disabled="disabled"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>

            <div class="box"></div>
          </el-tab-pane>
          <el-tab-pane label="工序资源配置" name="zypz" v-if="dataForm.processingType !== 'external_production'">
            <div>
              <el-tabs v-model="configurationName" @tab-click="handleClickFun" stretch style="margin-top:-10px">
                <div v-if="type !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    icon="el-icon-plus" :disabled="type == 'look' ? true : false"
                    @click="openSeleceProcessDialog(personData.length, configurationName)">
                    选择{{ actTitle }}
                  </el-button>
                  |
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    :disabled="type == 'look' ? true : false" icon="el-icon-delete"
                    @click="batchDelete(configurationName)">
                    批量删除
                  </el-button>
                  |
                </div>
                <el-tab-pane label="人员" name="personnel" :key="Math.random()">
                  <!-- 人员配置 -->
                  <JNPF-table :hasC="type != 'look'" @selection-change="handelepersonInfoData" :data="personData"
                    style="width: 100%">
                    <el-table-column prop="resourceId" label="人员名称">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.resourceName" placeholder="请输入人员名称" :disabled="type === 'look'"
                          readonly />
                      </template>
                    </el-table-column>
                    <el-table-column prop="resourceType" label="人员工号">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.jobNumber" :disabled="type === 'look'" placeholder="" readonly />
                      </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作" width="90" v-if="type != 'look'" :key="8">
                      <template slot-scope="scope">
                        <el-button type="text" :disabled="type === 'look'" style="color:rgb(245,108,108)"
                          @click="handlerDelete(scope.$index, 'personnel')">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                </el-tab-pane>

                <el-tab-pane label="班组" name="work_group">
                  <JNPF-table :hasC="type != 'look'" @selection-change="handeleworkgroupInfoData" :data="classData"
                    style="width: 100%" :key="Math.random()">
                    <el-table-column prop="resourceId" label="班组名称" ref="workGroup">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.resourceName" placeholder="请输入班组名称" :disabled="type === 'look'"
                          readonly />
                      </template>
                    </el-table-column>
                    <el-table-column prop="resourceType" label="班组编码">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.resourceCode" placeholder="请输入班组编码" :disabled="type === 'look'"
                          readonly />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="90" v-if="type != 'look'">
                      <template slot-scope="scope">
                        <el-button type="text" :disabled="type === 'look'" style="color:rgb(245,108,108)"
                          @click="handlerDelete(scope.$index, 'work_group')">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                </el-tab-pane>

                <el-tab-pane label="设备" name="device" :key="Math.random()">
                  <JNPF-table :hasC="type != 'look'" @selection-change="handeledeviceInfoData" :data="equipData"
                    style="width: 100%">
                    <el-table-column prop="resourceId" label="设备名称">
                      <template slot-scope="scope">
                        <el-input :disabled="type === 'look'" v-model="scope.row.resourceName" placeholder="请输入设备名称"
                          readonly />
                      </template>
                    </el-table-column>
                    <el-table-column prop="resourceType" label="设备编码">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.resourceCode" placeholder="请输入设备编码" :disabled="type === 'look'"
                          readonly />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="90" v-if="type != 'look'">
                      <template slot-scope="scope">
                        <el-button type="text" :disabled="type === 'look'" style="color:rgb(245,108,108)"
                          @click="handlerDelete(scope.$index, 'device')">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                </el-tab-pane>
                <el-tab-pane label="工具" name="tool" :key="Math.random()">
                  <JNPF-table :hasC="type != 'look'" @selection-change="handeletoolInfoData" :data="toolData"
                    style="width: 100%">
                    <el-table-column prop="resourceId" label="工具名称">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.resourceName" placeholder="请输入工具名称" :disabled="type === 'look'"
                          readonly />
                      </template>
                    </el-table-column>
                    <el-table-column prop="resourceType" label="工具编码">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.resourceCode" placeholder="请输入工具编码" :disabled="type === 'look'"
                          readonly />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="90" v-if="type != 'look'">
                      <template slot-scope="scope">
                        <el-button type="text" :disabled="type === 'look'" style="color:rgb(245,108,108)"
                          @click="handlerDelete(scope.$index, 'tool')">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <PersonSelect v-if="personnelVisibled" ref="personnelRef" multiple placeholder="请选择所属人员" style="width: 100%;"
      @change="submit" :projectId="dataForm.projectId" />

    <ComSelect-page ref="ComSelect-page3" @change="WorkgroupSubmit" :tableItems="WorkgroupTableItems" title="选择班组"
      :listMethod="getGroupList" :listRequestObj="WorkgroupRequestObj" :renderTree="false"
      :searchList="WorkgroupTableSearchList" :elementShow="false" multiple />
    <ComSelect-page ref="ComSelect-page" @change="DeviceSubmit" :tableItems="DeviceTableItems" title="选择设备"
      treeTitle="设备分类" :methodArr="DeviceMethodArr" :listMethod="stateEquEquipment" :listRequestObj="DeviceRequestObj"
      :searchList="DeviceTableSearchList" :elementShow="false" multiple />
    <ComSelect-page ref="ComSelect-page2" @change="ToolSubmit" :tableItems="ToolTableItems" title="选择工具"
      treeTitle="工具分类" :methodArr="ToolMethodArr" :listMethod="stateEquEquipment" :listRequestObj="ToolRequestObj"
      :searchList="ToolTableSearchList" :elementShow="false" multiple />
  </div>
</template>
<script>
import {
  updateArrange,
  addArrange,
  detailArrange,
  checkArrange,
  checkArrangeArr
} from '@/api/basicData/materialSettings'
import { inflateRawSync } from 'zlib'
import { getBimProcessDetail, addBimProcess, updateBimProcess, checkBimProcessCode } from '@/api/bimProcess/index'

import { getBimBusinessInfo } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getGroupList, editEquEquipmentAll, getEquEquipmentList, stateEquEquipment } from '@/api/basicData/index'
import PersonnelDialog from './personnel-dialog.vue'
import PersonSelect from './personSelect.vue'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: {
    PersonnelDialog,
    PersonSelect
  },
  mixins: [getProjectList],
  data() {
    var checkReportingSort = (rule, value, callback) => {
      console.log(value, 'kkkk')
      console.log(Number.isInteger(value), 'jjjj')
      if (/^(?:[0-9]\d*)$/.test(value) == false) {
        callback(new Error('请输入整数'))
      } else if (Number(value) == 0) {
        callback(new Error('报工排序不能为0'))
      } else {
        callback()
      }
    };
    return {
      isProjectSwitch: '',
      isTechnicalSwitch: '',
      isCheckingSwitch: '',
      tableFlag: false,
      projectIdData: [],
      process_typeList: [
        { label: '正常工序', value: 'normal' },
        { label: '测振工序', value: 'vibrate' },
        { label: '热工工序', value: 'heat_treatment' },
        { label: '包装工序', value: 'packing' },
        { label: '配对工序', value: 'pairs' }
      ],
      getcategoryTree,
      configurationName: '',
      dialogTitle: '',
      visible: false,
      loading: false,
      activeName: 'jcInfo',
      activeNames: ['jcInfo', 'basicInfo'],
      actTitle: '人员',
      configurationName: 'personnel',
      btnLoading: false,
      dataForm: {
        projectId: '',
        id: '', // 工序id
        name: null, //  工序名称
        code: null, // 工序编码
        processingType: null, // 工序类型
        unitPrice: null, // 正品单价
        rejectUnitPrice: null, // 次品单价
        scrapUnitPrice: null, // 废品单价
        timePrice: null, // 计价单价
        remark: null, // 备注
        pricingType: 'by_time',
        productCategoryIdText: '',
        productCategoryId: '',
        processType: 'normal'
      },
      placeholder: '请选择工序分类',
      pricingTypeList: [
        {
          label: '计时',
          value: 'by_time'
        },
        {
          label: '计件',
          value: 'by_piece'
        }
      ],
      disabled: false,
      rules: {
        name: [
          {
            required: true,
            message: '请输入工序名称',
            trigger: ['blur']
          }
        ],
        code: [
          {
            required: true,
            message: '请输入工序编码',
            trigger: ['blur']
          },
          {
            validator: (rule, value, callback) => {
              checkBimProcessCode(value, this.dataForm.id)
                .then((res) => {
                  if (res.data) {
                    callback(new Error('工序编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ],
        productCategoryIdText: [{ required: true, message: '请选择所属分类', trigger: ['change'] }],
        processingType: [
          {
            required: true,
            message: '请选择加工类型',
            trigger: ['change']
          }
        ],
        reportingSort: [
          {
            required: true,
            message: '请输入报工排序',
            trigger: ['blur']
          },
          { validator: checkReportingSort, trigger: 'blur' }
        ],
      },
      processingTypeOptions: [
        { label: '自制', value: 'self_produced' },
        { label: '外协', value: 'external_production' }
      ],
      businessType: '', // 业务开关获取类型

      getGroupList, //班组
      editEquEquipmentAll, //设备
      getEquEquipmentList, //工具
      type: '',
      personnelVisibled: false,

      personArr: [],
      classArr: [],
      equipArr: [],
      toolArr: [],
      personData: [],
      classData: [],
      equipData: [],
      toolData: [],
      btntype: false,
      codeConfig: {},
      requestObj2: {
        //班组参数
        pageNum: 1,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        state: 'enable',
        code: '',
        name: ''
      },
      requestObj3: {
        //设备参数
        classAttribute: 'equipment'
      },
      requestObj4: {
        // 工具参数
        name: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        code: '',
        classAttribute: 'tool'
      },
      getGroupList,
      WorkgroupRequestObj: {
        code: '',
        name: '',
        pageNum: 1,
        pageSize: 20,
        state: 'enable'
      }, // 产品选择弹出框列表请求参数
      WorkgroupTableItems: [
        { prop: 'code', label: '班组编码', fixed: 'left' },
        { prop: 'name', label: '班组名称', fixed: 'left' }
      ], // 产品选择弹出框表单展示字段
      WorkgroupTableSearchList: [
        { prop: 'code', label: '班组编码', type: 'input' },
        { prop: 'name', label: '班组名称', type: 'input' }
      ], // 产品选择弹出框搜索条件
      stateEquEquipment,
      getcategoryTree,
      DeviceMethodArr: [
        { label: '设备', classAttribute: 'tool', method: getcategoryTree, requestObj: { classAttribute: 'equipment' } }
      ], // 产品选择弹出框树状列表
      DeviceRequestObj: {
        classAttribute: 'equipment',
        drawingNo: '',

        code: '',
        name: '',
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
        state: ''
      }, // 产品选择弹出框列表请求参数
      DeviceTableItems: [
        { prop: 'code', label: '设备编码', fixed: 'left' },
        { prop: 'name', label: '设备名称', fixed: 'left' }
      ], // 产品选择弹出框表单展示字段
      DeviceTableSearchList: [
        { prop: 'code', label: '设备编码', type: 'input' },
        { prop: 'name', label: '设备名称', type: 'input' }
      ], // 产品选择弹出框搜索条件
      ToolMethodArr: [
        { label: '工具', classAttribute: 'tool', method: getcategoryTree, requestObj: { classAttribute: 'tool' } }
      ], // 产品选择弹出框树状列表
      ToolRequestObj: {
        classAttribute: 'tool',
        drawingNo: '',

        code: '',
        name: '',
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
        state: ''
      }, // 产品选择弹出框列表请求参数
      ToolTableItems: [
        { prop: 'code', label: '工具编码', fixed: 'left' },
        { prop: 'name', label: '工具名称', fixed: 'left' }
      ], // 产品选择弹出框表单展示字段
      ToolTableSearchList: [
        { prop: 'code', label: '工具编码', type: 'input' },
        { prop: 'name', label: '工具名称', type: 'input' }
      ], // 产品选择弹出框搜索条件
      resourceList: []
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getTechnicalSwitch('produce', 'technical_requirement')
    await this.getCheckingSwitch('produce', 'checking_information')
    await this.getProjectList()
    console.log(this.isProjectSwitch)
    if (this.userInfo.projectId === '1') {
      console.log(this.projectIdData, 'lllljj')
      this.projectIdData = this.projectIdData.filter(item => item.id !== '1')
    } else {
      this.$set(this.dataForm, 'projectId', this.userInfo.projectId)
    }
    // this.getBusinessType()
  },
  methods: {
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
    projectIdChange(e) {
      console.log(e, 'e')

      this.personData = []
      this.classData = []
      this.equipData = []
      this.toolData = []
      this.dataForm.projectId = e

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
    // 单个删除
    handlerDelete(index, type) {
      if (type == 'personnel') {
        this.personData.splice(index, 1)
      } else if (type == 'work_group') {
        this.classData.splice(index, 1)
      } else if (type == 'device') {
        this.equipData.splice(index, 1)
      } else if (type == 'tool') {
        this.toolData.splice(index, 1)
      }
    },
    handleClickFun(tab, event) {
      this.configurationName = tab.name
      if (this.configurationName == 'personnel') {
        this.actTitle = '人员'
      }
      if (this.configurationName == 'work_group') {
        this.actTitle = '班组'
      }
      if (this.configurationName == 'device') {
        this.actTitle = '设备'
      }
      if (this.configurationName == 'tool') {
        this.actTitle = '工具'
      }
    },
    // 可以多选
    openSeleceProcessDialog(e, type) {
      if (this.isProjectSwitch === '1') {
        if (!this.dataForm.projectId) {
          this.$message.error('请先选择所属项目');
          return
        }
      }

      this.index = e
      this.types = type
      if (type === 'personnel') {
        this.personnelVisibled = true
        this.$nextTick(() => {
          this.$refs['personnelRef'].openDialog()
        })
      }
      if (type === 'work_group') {
        if (this.isProjectSwitch === '1') {
          this.WorkgroupRequestObj.projectId = this.dataForm.projectId
        }
        this.$nextTick(() => {
          this.$refs['ComSelect-page3'].openDialog()
        })
      }
      if (type === 'device') {
        if (this.isProjectSwitch === '1') {
          this.DeviceRequestObj.projectId = this.dataForm.projectId
        }
        this.$nextTick(() => {
          this.$refs['ComSelect-page'].openDialog()
        })
      }
      if (type === 'tool') {
        if (this.isProjectSwitch === '1') {
          this.ToolRequestObj.projectId = this.dataForm.projectId
        }
        this.$nextTick(() => {
          this.$refs['ComSelect-page2'].openDialog()
        })
      }
    },
    // 选中人员的数据
    handelepersonInfoData(val) {
      this.personArr = val
    },
    // 选中班组的数据
    handeleworkgroupInfoData(val) {
      this.classArr = val
    },
    // 选中设备的数据
    handeledeviceInfoData(val) {
      this.equipArr = val
    },
    // 选中工具的数据
    handeletoolInfoData(val) {
      this.toolArr = val
    },
    // 批量删除
    batchDelete(type) {
      // 遍历选中的行的数据
      if (type === 'personnel') {
        if (this.personArr.length === 0) {
          this.$message({
            message: '请选择你要删除的数据',
            type: 'error',
            duration: 1500
          })
        }
        for (let i = 0; i < this.personArr.length; i++) {
          const row = this.personArr[i]
          const index = this.personData.indexOf(row)
          if (index > -1) {
            this.personData.splice(index, 1) // 从tableData中删除选中的行
          }
        }
        this.personArr = [] // 清空选中的行的数据
      }
      if (type === 'work_group') {
        if (this.classArr.length === 0) {
          this.$message({
            message: '请选择你要删除的数据',
            type: 'error',
            duration: 1500
          })
        }
        for (let i = 0; i < this.classArr.length; i++) {
          const row = this.classArr[i]
          const index = this.classData.indexOf(row)
          if (index > -1) {
            this.classData.splice(index, 1) // 从tableData中删除选中的行
          }
        }
        this.classArr = [] // 清空选中的行的数据
      }
      if (type === 'device') {
        if (this.equipArr.length === 0) {
          this.$message({
            message: '请选择你要删除的数据',
            type: 'error',
            duration: 1500
          })
        }
        for (let i = 0; i < this.equipArr.length; i++) {
          const row = this.equipArr[i]
          const index = this.equipData.indexOf(row)
          if (index > -1) {
            this.equipData.splice(index, 1) // 从tableData中删除选中的行
          }
        }

        this.equipArr = [] // 清空选中的行的数据
      }
      if (type === 'tool') {
        if (this.toolArr.length === 0) {
          this.$message({
            message: '请选择你要删除的数据',
            type: 'error',
            duration: 1500
          })
        }
        for (let i = 0; i < this.toolArr.length; i++) {
          const row = this.toolArr[i]
          const index = this.toolData.indexOf(row)
          if (index > -1) {
            this.toolData.splice(index, 1) // 从tableData中删除选中的行
          }
        }
        this.toolArr = [] // 清空选中的行的数据
      }
    },
    // 人员数据
    submit(id, data) {
      // let type = Array.isArray(data) ? 'Array' : 'Object'
      // if (type === 'Object') {}
      if (data.length === 0) {
      } else {
        let tempList = JSON.parse(JSON.stringify(this.personData))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          const hasFlag = this.personData.find((i) => item.id === i.resourceId)
          if (hasFlag) {
            hasItemList.push(item.fullName.split('/')[0])
          } else {
            tempList.push(item)
          }
          if (hasItemList.length) this.$message.error(`已经存在的人员：${hasItemList.join('、')}`)
        }
        this.personData = tempList.map((item, index) => {
          return {
            index: index,
            resourceId: item.resourceId ? item.resourceId : item.id,
            resourceName: item.resourceName ? item.resourceName : item.fullName.split('/')[0],
            jobNumber: item.jobNumber,
            resourceType: 'personnel',
            processId: this.dataForm.id
          }
        })
      }
    },
    // 班组
    WorkgroupSubmit(id, data) {
      if (data.length === 0) {
      } else {
        let list = data.map((item) => item.all)
        let tempList = JSON.parse(JSON.stringify(this.classData))
        let hasItemList = []
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          const hasFlag = this.classData.find((i) => item.id === i.resourceId)
          if (hasFlag) {
            hasItemList.push(item.name)
          } else {
            tempList.push(item)
          }
          if (hasItemList.length) this.$message.error(`已经存在的班组：${hasItemList.join('、')}`)
        }
        this.classData = tempList.map((item, index) => {
          return {
            index: index,
            resourceId: item.resourceId ? item.resourceId : item.id,
            resourceName: item.resourceName ? item.resourceName : item.name,
            resourceCode: item.resourceCode ? item.resourceCode : item.code,
            resourceType: 'work_group',
            processId: this.dataForm.id
          }
        })
      }
    },
    // 设备
    DeviceSubmit(id, data) {
      if (data.length === 0) {
      } else {
        let list = data.map((item) => item.all)
        let tempList = JSON.parse(JSON.stringify(this.equipData))
        let hasItemList = []
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          const hasFlag = this.equipData.find((i) => item.id === i.resourceId)
          if (hasFlag) {
            hasItemList.push(item.name)
          } else {
            tempList.push(item)
          }
          if (hasItemList.length) this.$message.error(`已经存在的设备：${hasItemList.join('、')}`)
        }
        this.equipData = tempList.map((item, index) => {
          return {
            index: index,
            resourceId: item.resourceId ? item.resourceId : item.id,
            resourceName: item.resourceName ? item.resourceName : item.name,
            resourceCode: item.resourceCode ? item.resourceCode : item.code,
            resourceType: 'device',
            processId: this.dataForm.id
          }
        })
      }
    },
    // 工具
    ToolSubmit(id, data) {
      if (data.length === 0) {
      } else {
        let list = data.map((item) => item.all)
        let tempList = JSON.parse(JSON.stringify(this.toolData))
        let hasItemList = []
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          const hasFlag = this.toolData.find((i) => item.id === i.resourceId)
          if (hasFlag) {
            hasItemList.push(item.name)
          } else {
            tempList.push(item)
          }
          if (hasItemList.length) this.$message.error(`已经存在的工具：${hasItemList.join('、')}`)
        }
        this.toolData = tempList.map((item, index) => {
          return {
            index: index,
            resourceId: item.resourceId ? item.resourceId : item.id,
            resourceName: item.resourceName ? item.resourceName : item.name,
            resourceCode: item.resourceCode ? item.resourceCode : item.code,
            resourceType: 'tool',
            processId: this.dataForm.id
          }
        })
      }
    },

    handleClick(tab, event) { },
    goBack() {
      this.$emit('close')
    },
    getBusinessType() {
      getBimBusinessInfo(6).then((res) => {
        this.businessType = res.data.currentValue
      })
    },

    changeProductCategory(val, data, params) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('productCategoryIdText')
      })
      if (!val && data.length) return
      if (!data) return
      this.dataForm.productCategoryIdText = data[0].name
      this.dataForm.productCategoryId = data[0].id
    },
    handlepricingType(e) {
      if (e == 'by_piece') {
        this.dataForm = {
          id: this.dataForm.id, // 工序id
          name: this.dataForm.name, //  工序名称
          code: this.dataForm.code, // 工序编码
          productCategoryId: this.dataForm.productCategoryId,
          processingType: this.dataForm.processingType, // 工序类型
          unitPrice: this.dataForm.unitPrice, // 正品单价
          rejectUnitPrice: this.dataForm.rejectUnitPrice, // 次品单价
          scrapUnitPrice: this.dataForm.scrapUnitPrice, // 废品单价
          timePrice: null, // 计价单价
          remark: this.dataForm.remark, // 备注
          pricingType: 'by_piece'
        }
      } else {
        this.dataForm = {
          id: this.dataForm.id, // 工序id
          name: this.dataForm.name, //  工序名称
          code: this.dataForm.code, // 工序编码
          productCategoryId: this.dataForm.productCategoryId,
          processingType: this.dataForm.processingType, // 工序类型
          unitPrice: null, // 正品单价
          rejectUnitPrice: null, // 次品单价
          scrapUnitPrice: null, // 废品单价
          timePrice: this.dataForm.timePrice, // 计价单价
          remark: this.dataForm.remark, // 备注
          pricingType: 'by_time'
        }
      }
    },
    validateInput(rule, value, callback) {
      const regex = /^\d+(\.\d{0,2})?$/
      if (!regex.test(value)) {
        callback(new Error('请输入两位小数'))
      } else {
        callback()
      }
    },
    onClose() {
      this.visible = false
      setTimeout(() => {
        this.clearData()
      }, 200)
    },

    clearData() {
      this.dataForm = {
        id: '', // 工序id
        name: null, //  工序名称
        code: null, // 工序编码
        processingType: null, // 工序类型
        unitPrice: null, // 正品单价
        rejectUnitPrice: null, // 次品单价
        scrapUnitPrice: null, // 废品单价
        timePrice: null, // 计价单价
        remark: null, // 备注
        pricingType: 'by_time',
        processType: 'normal'
      }
    },
    // 初始化内容
    init(id, type) {
      this.autoCode = []
      this.dataForm.id = id ? id : ''
      // this.disabled = type === "true"
      this.dialogTitle = id ? (type == 'edit' ? '编辑工序' : '查看工序') : '新建工序'
      this.visible = true
      this.type = type

      if (this.type == 'look') {
        this.disabled = true
      } else {
        this.disabled = false
      }

      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.type === 'add') {
          this.clearData()
          this.fetchData('bm_gy_gx', true)
        } else {
          this.loading = true
          this.fetchData('bm_gy_gx', false)
          // 获取当前项详情
          getBimProcessDetail(id).then((res) => {
            this.dataForm = res.data.process
            this.resourceList = res.data.resourceList
            this.loading = false
            if (type == 'add') {
              if (resourceList.length) {
                const filteredData = this.resourceList.filter((item) => item.resourceType === 'personnel')
                this.personData = filteredData

                this.personData.forEach((item, index) => {
                  this.personData[index].resourceId = item.resourceId
                  this.personData[index].jobNumber = item.jobNumber
                  this.personData[index].processId = item.processId
                  this.personData[index].resourceClass = item.resourceClass
                })

                const filteredData2 = this.resourceList.filter((item) => item.resourceType === 'work_group')
                this.classData = filteredData2
                this.classData.forEach((item, index) => {
                  this.classData[index].resourceId = item.resourceId
                  this.classData[index].resourceCode = item.resourceCode
                  this.classData[index].recourceName = item.recourceName
                  this.classData[index].processId = item.processId
                  this.personData[index].resourceClass = item.resourceClass
                })

                const filteredData3 = this.resourceList.filter((item) => item.resourceType === 'device')
                this.equipData = filteredData3
                this.equipData.forEach((item, index) => {
                  this.equipData[index].resourceId = item.resourceId
                  this.equipData[index].resourceCode = item.resourceCode
                  this.equipData[index].recourceName = item.recourceName
                  this.equipData[index].processId = item.processId
                  this.personData[index].resourceClass = item.resourceClass
                })

                const filteredData4 = this.resourceList.filter((item) => item.resourceType === 'tool')
                this.toolData = filteredData4
                this.toolData.forEach((item, index) => {
                  this.toolData[index].resourceId = item.resourceId
                  this.toolData[index].resourceCode = item.resourceCode
                  this.toolData[index].recourceName = item.recourceName
                  this.toolData[index].processId = item.processId
                  this.personData[index].resourceClass = item.resourceClass
                })
              }
            }
            if (type === 'edit' || type === 'look') {
              if (this.resourceList.length) {
                const filteredData = this.resourceList.filter((item) => item.resourceType === 'personnel')
                this.personData = filteredData

                const filteredData2 = this.resourceList.filter((item) => item.resourceType === 'work_group')
                this.classData = filteredData2

                const filteredData3 = this.resourceList.filter((item) => item.resourceType === 'device')
                this.equipData = filteredData3

                const filteredData4 = this.resourceList.filter((item) => item.resourceType === 'tool')
                this.toolData = filteredData4
              }
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      if (this.activeName == 'zypz') {
        if (!this.dataForm.name) return this.$message.error('工序名称为空')
        if (!this.dataForm.code) return this.$message.error('工序编码为空')
        if (!this.dataForm.productCategoryIdText) return this.$message.error('工序分类为空')
        if (!this.dataForm.processingType) return this.$message.error('工序类型为空')
      }
      this.btnLoading = true
      let data = [...this.personData, ...this.classData, ...this.equipData, ...this.toolData]
      if (data.length) {
        data.forEach((item) => {
          item.resourceClass = 'process'
        })
      }
      let obj = {}
      if (this.dataForm.processingType !== 'external_production') {
        obj = {
          process: this.dataForm,
          resourceList: data
        }
      } else {
        obj = {
          process: this.dataForm,
          resourceList: []
        }
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.id) {
            updateBimProcess(obj)
              .then((res) => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1500
                })
                this.onClose()
                this.$emit('close', true)
                this.btnLoading = false
              })
              .catch((err) => {
                this.btnLoading = false
              })
          } else {
            addBimProcess(obj)
              .then((res) => {
                this.btnLoading = false
                this.$message.success('新建成功')
                this.onClose()
                this.$emit('close', true)
              })
              .catch((err) => {
                this.btnLoading = false
              })
          }
        } else {
          this.btnLoading = false
        }
      })
    }
  }
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

::v-deep .el-tabs__nav {
  display: block !important;
}
</style>
<style lang="scss" scoped>
::v-deep .el-tabs__header {
  padding: 0 !important;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
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

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}

.JNPF-preview-main .main {
  padding-top: 0;
}
</style>
