<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.maintenanceNo" placeholder="请输入维修单号" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.equipmentIdCode" placeholder="请输入工具编码" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="orderForm.equipmentIdName" placeholder="请输入工具名称" clearable @keydown.enter.native="dataFormSubmit()" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-select v-model="orderForm.state" placeholder="请选择状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in [{label:'待派工',value:'toBeMaintain'},{label:'正在维修',value:'maintaining'}]" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="dataFormSubmit()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <div>
            <el-button size="mini" type="success" icon="el-icon-s-claim" @click="handleBatchreview">批量审核派工</el-button>
            <!-- <el-button size="mini" type="primary" icon="icon-ym icon-ym-system" @click="Batchrepair">批量完成维修</el-button> -->
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table ref="dataTable" v-if="istable" hasC @selection-change="handeleInfoData" :data="tableData" @sort-change="sortChange" custom-column>
          <el-table-column prop="maintenanceNo" label="维修单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                                scope.row.maintenanceNo
                            }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" sortable="custom" />
          <el-table-column prop="equipmentIdName" label="工具名称" min-width="200" sortable="custom"></el-table-column>
          <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
          <el-table-column prop="usin" label="用途" min-width="140" />
          <el-table-column prop="frontPicList" label="故障情况照片" min-width="140">
            <template slot-scope="scope">
              <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.frontPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="faultStartTime" label="故障开始时间" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="reviewComments" label="审核意见" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.reviewComments == 'immediately'"><el-tag type="danger">立即维修</el-tag></div>
              <div v-else-if="scope.row.reviewComments == 'reject'"><el-tag type="warning">驳回</el-tag></div>
              <div v-else-if="scope.row.reviewComments == 'outsourcing'"><el-tag>转委外</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="rejectReason" label="驳回理由" min-width="160">
            <template slot-scope="scope">
              <div><el-tag type="success" v-if="scope.row.rejectReason">{{scope.row.rejectReason}}</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="degree" label="紧急程度" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.degree == '1'"><el-tag type="danger">特别紧急</el-tag></div>
              <div v-else-if="scope.row.degree == '2'"><el-tag type="warning">紧急</el-tag></div>
              <div v-else-if="scope.row.degree == '3'"><el-tag>一般</el-tag></div>
              <div v-else-if="scope.row.degree == '4'"><el-tag type="success">不急</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="maintenancePersonnelName" label="维修负责人" width="120"></el-table-column>
          <el-table-column prop="waitDuration" label="故障响应时长(小时)" min-width="180" />
          <el-table-column prop="sparePartsFlag" label="是否更换备件" width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.sparePartsFlag == '0'"><el-tag type="warning">否</el-tag></div>
              <div v-else-if="scope.row.sparePartsFlag == '1'"><el-tag type="success">是</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="故障原因" min-width="160" />
          <el-table-column prop="solutionMeasures" label="解决措施" min-width="200"></el-table-column>
          <el-table-column prop="afterPicList" label="维修完成拍照" min-width="160">
            <template slot-scope="scope">
              <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.afterPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="startMaintenanceTime" label="开始维修时间" width="180"></el-table-column>
          <el-table-column prop="repairCompletionTime" label="维修完成时间" width="180"></el-table-column>
          <el-table-column prop="maintenanceDuration" label="维修时长" min-width="160" sortable="custom"></el-table-column>
          <el-table-column prop="equipmentState" label="工具状态" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.equipmentState == 'normal'"><el-tag type="success">正常</el-tag></div>
              <div v-else-if="scope.row.equipmentState == 'repair'"><el-tag type="warning">维修</el-tag></div>
              <div v-else-if="scope.row.equipmentState == 'discard'"><el-tag type="info">报废</el-tag></div>
              <div v-else-if="scope.row.equipmentState == 'spare'"><el-tag>备用</el-tag></div>
              <div v-else-if="scope.row.equipmentState == 'stop'"><el-tag type="danger">停用</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="departmentIdName" label="申请部门" min-width="120" />
          <el-table-column prop="applicantIdName" label="申请人" width="120"></el-table-column>
          <el-table-column prop="applicationDate" label="申请日期" width="180" sortable="custom"></el-table-column>
          <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 'toBeMaintain'"><el-tag type="danger">待派工</el-tag></div>
              <div v-else-if="scope.row.state == 'maintaining'"><el-tag type="warning">正在维修</el-tag></div>
              <div v-else-if="scope.row.state == 'maintained'"><el-tag type="success">已维修</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" v-if="scope.row.state == 'toBeMaintain'" @click="handleUserRelation(scope.row.id, 'start')">审核派工</el-button>
              <!-- <el-button size="mini" type="text" v-if="scope.row.state == 'maintaining'&&scope.row.reviewComments == 'immediately'" @click="handleUserRelation(scope.row.id, 'end')">维修</el-button> -->
              <!-- <el-button size="mini" type="text" v-if="scope.row.reviewComments == 'outsourcing'" @click="outsourcedcompletion(scope.row.id)">委外维修完成</el-button> -->
              <!-- <el-button size="mini" type="text" :disabled="scope.row.state != 'toBeMaintain'" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button> -->
              <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.state === 'maintaining'" @click="handleDel(scope.row.id)">删除</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'edit')" :disabled="scope.row.state != 'toBeMaintain'">
                    编辑
                  </el-dropdown-item>
                  <!-- <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'start')" :disabled="scope.row.state !== 'toBeMaintain'">
                    审核派工
                  </el-dropdown-item> -->
                  <!-- <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'end')" :disabled="scope.row.state !== 'maintaining'||scope.row.reviewComments !== 'immediately'">
                    维修
                  </el-dropdown-item> -->
                  <!-- <el-dropdown-item @click.native="outsourcedcompletion(scope.row.id)" v-if="scope.row.reviewComments == 'outsourcing'">
                    委外维修完成
                  </el-dropdown-item> -->
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <depForm v-if="shareVisible" ref="depForm" @close="closeForm"></depForm>
    <sucForm v-if="sucFormVisible" ref="sucForm" @close="closeForm"></sucForm>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import depForm from './depForm'
import sucForm from './sucForm'
import { RepairRequestList, deleteRepairRequest, equEquipmentRepairOutsourcing } from '@/api/dailyManagement/Maintenance'
import Form from './Form'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from 'vuex'
export default {
  mixins: [getProjectList],
  // name: 'deviceservice',
  components: { Form, depForm, sucForm, SuperQuery },
  data() {
    return {
      istable: false,
      isProjectSwitch: '',
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'maintenanceNo',
          label: "维修单号",
          type: 'input'
        },
        {
          prop: 'equipmentIdCode',
          label: "工具编码",
          type: 'input'
        },
        {
          prop: 'equipmentIdName',
          label: "工具名称",
          type: 'input'
        },
        {
          prop: 'usin',
          label: "用途",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'faultStartTime',
          label: '故障开始时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        { // 下拉选
          prop: 'reviewComments',
          label: '审核意见',
          type: 'select',
          options: [
            { label: '立即维修', value: 'immediately' },
            { label: '驳回', value: 'reject' },
            { label: '转委外', value: 'outsourcing' }
          ]
        },
        {
          prop: 'rejectReason',
          label: "驳回理由",
          type: 'input'
        },
        { // 下拉选
          prop: 'degree',
          label: '紧急程度',
          type: 'select',
          options: [
            { label: '特别紧急', value: '1' },
            { label: '紧急', value: '2' },
            { label: '一般', value: '3' },
            { label: '不急', value: '4' }
          ]
        },
        {
          prop: 'maintenancePersonnelName',
          label: "维修负责人",
          type: 'input'
        },
        {
          prop: 'waitDuration',
          label: "故障响应时长(小时)",
          type: 'input'
        },
        { // 下拉选
          prop: 'sparePartsFlag',
          label: '是否更换备件',
          type: 'select',
          options: [
            { label: '否', value: 0 },
            { label: '是', value: 1 }
          ]
        },
        {
          prop: 'reason',
          label: "故障原因",
          type: 'input'
        },
        {
          prop: 'solutionMeasures',
          label: "解决措施",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'startMaintenanceTime',
          label: '开始维修时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        { // 日期时间选择器（区间）
          prop: 'repairCompletionTime',
          label: '维修完成时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'maintenanceDuration',
          label: "维修时长",
          type: 'input'
        },
        { // 下拉选
          prop: 'equipmentState',
          label: '工具状态',
          type: 'select',
          options: [
            { label: '正常', value: 'normal' },
            { label: '维修', value: 'repair' },
            { label: '报废', value: 'discard' },
            { label: '备用', value: 'spare' },
            { label: '停用', value: 'stop' }
          ]
        },
        {
          prop: 'departmentIdName',
          label: "申请部门",
          type: 'input'
        },
        {
          prop: 'applicantIdName',
          label: "申请人",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'applicationDate',
          label: '申请日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        { // 下拉选
          prop: 'state',
          label: '状态',
          type: 'select',
          options: [
            { label: '待派工', value: 'toBeMaintain' },
            { label: '正在维修', value: 'maintaining' },
            { label: '已维修', value: 'maintained' }
          ]
        },
        { // 日期时间选择器（区间）
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      shareVisible: false,
      sucFormVisible: false,
      selectData: [],
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      ],
      faultStartTime: [],
      submitDate: [],
      tableData: [],
      orderDateArr: [],
      listLoading: false,
      stateList: [
        { label: "待派工", value: "toBeMaintain" },
        { label: "正在维修", value: "maintaining" },
        { label: "已维修", value: "maintained" }
      ],
      orderForm: {
        projectId: '',
        state: 'toBeMaintain',
        // unState: 'maintained',
        classAttribute: "tool",
        maintenanceNo: '',
        equipmentIdCode: '',
        equipmentIdName: '',
        applicantIdName: '',
        applicationStartDate: '',
        applicationEndDate: '',
        faultStartTimeStart: '',
        faultStartTimeEnd: '',
        maintenancePersonnel: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      total: 0,
      formVisible: false,
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.initData()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    outsourcedcompletion(id) {
      equEquipmentRepairOutsourcing(id).then(res => {
        this.initData()
        this.$message({
          type: 'success',
          message: "提交成功",
          duration: 1500,
        })
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.dataFormSubmit()
    },
    handleBatchreview() {
      if (!this.selectData.length) return this.$message.error("请先选择你要审核的工具")
      let idList = this.selectData.map(item => item.id);
      this.shareVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(idList)
      })
    },
    Batchrepair() {
      if (!this.selectData.length) return this.$message.error("请先选择你要完成的工具")
      let idList = this.selectData.map(item => item.id);
      this.sucFormVisible = true
      this.$nextTick(() => {
        this.$refs.sucForm.init(idList)
      })
    },
    handeleInfoData(val) {
      this.selectData = val
    },
    bigimg(url) {
      this.srcList[0] = url
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName' || prop === 'equipmentIdCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    dataFormSubmit() {
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.orderForm.applicationStartDate = this.orderDateArr[0]
        this.orderForm.applicationEndDate = this.orderDateArr[1]
      } else {
        this.orderForm.applicationStartDate = ''
        this.orderForm.applicationEndDate = ''
      }
      if (this.submitDate && this.submitDate.length > 0) {
        this.orderForm.startTime = this.submitDate[0].replace(/ 0(?!0)/g, " ")
        this.orderForm.endTime = this.submitDate[1].replace(/ 0(?!0)/g, " ")
      } else {
        this.orderForm.startTime = ''
        this.orderForm.endTime = ''
      }
      if (this.faultStartTime && this.faultStartTime.length > 0) {
        this.orderForm.faultStartTimeStart = this.faultStartTime[0].replace(/ 0(?!0)/g, " ")
        this.orderForm.faultStartTimeEnd = this.faultStartTime[1].replace(/ 0(?!0)/g, " ")
      } else {
        this.orderForm.faultStartTimeStart = ''
        this.orderForm.faultStartTimeEnd = ''
      }
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.shareVisible = false
      this.sucFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    getTimes(time) {
      // 转换为式分秒
      let d = parseInt(time / 60 / 60 / 24)
      let h = parseInt(time / 60 / 60 % 24)
      let m = parseInt(time / 60 % 60)
      let s = parseInt(time % 60)
      // s = s < 10 ? '0' + s : s
      // 作为返回值返回
      // return `${h}时${m}分${s}秒`
      return d != '0' ? `${d} 天 ${h} 时 ${m} 分 ${s} 秒` : h != '0' ? `${h} 时 ${m} 分 ${s} 秒` : m != '0' ? `${m} 分 ${s} 秒` : `${s} 秒`
    },
    // console.log(`输入的秒数是${second}：，转换后是${res[0]}时${res[1]}分${res[2]}秒`)
    initData() {
      this.listLoading = true
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      RepairRequestList(this.orderForm).then(res => {
        this.istable = true
        this.tableData = res.data.records.map(item => {
          if (item.frontPic) {
            item.frontPicList = item.frontPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          if (item.afterPic) {
            item.afterPicList = item.afterPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          item.maintenanceDuration = this.getTimes(item.maintenanceDuration)
          item.waitDuration = this.getTimes(item.waitDuration)
          return item
        })
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.submitDate = []
      this.faultStartTime = []
      this.orderDateArr = []
      this.orderForm = {
        state: 'toBeMaintain',
        // unState: 'maintained',
        classAttribute: "tool",
        maintenanceNo: '',
        equipmentIdCode: '',
        equipmentIdName: '',
        applicantIdName: '',
        applicationStartDate: '',
        applicationEndDate: '',
        faultStartTimeStart: '',
        faultStartTimeEnd: '',
        maintenancePersonnel: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      }
      this.dataFormSubmit()
    },

    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype,)
        })
        // }, 600);
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteRepairRequest(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    }
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
  