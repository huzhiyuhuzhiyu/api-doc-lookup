<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2>部门</h2>
          <span class="options">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getOrganizeList(true)">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
                <el-dropdown-item @click.native="showDiagram">架构图</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div>
          <el-input placeholder="输入关键字" v-model="filterText" suffix-icon="el-icon-search" clearable
            style="width:200px;margin:10px auto;display:block" />
        </div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="filteredTree" :props="defaultProps" :default-expand-all="expands"
          highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
          class="JNPF-common-el-tree" v-if="refreshTree">
          <span class="custom-tree-node" slot-scope="{ data, node }" :title="data.fullName">
            <i :class="data.icon" />
            <span class="text" :title="data.fullName">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="请输入姓名" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">{{ $t('common.search')
                }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:6px 10px">
          <topOpts @add="addOrUpdateHandle()">
            <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download"
              :disabled="!tableData.length" @click="exportForm">导出</el-button>
            <el-button size="mini" v-has="'btn_import'" type="primary" icon="el-icon-plus"
              @click="uploadForm">导入</el-button>
            <el-button size="mini" type="primary" icon="el-icon-printer" @click="printView('p041')">打印员工二维码</el-button>
            <el-button size="mini" type="primary" icon="el-icon-printer" @click="printView('p042')">打印员工工牌</el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-if="tableFlag"  :data="tableData" custom-column fixedNO
          @sort-change="sortChange" @selection-change="handleSelectionChange" hasC ref="dataTable"
          :setColumnDisplayList="columnList" row-key="id">
          <el-table-column prop="jobNumber" label="工号" min-width="140" sortable="custom" />
          <!-- 这里的 width 会被转成 min-width -->
          <el-table-column prop="name" label="姓名" width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">{{
                scope.row.name
              }}</el-link>
            </template>
          </el-table-column>
          <!-- 这里的 width 会被转成 min-width -->
          <el-table-column prop="sex" label="性别" width="90" sortable="custom">
            <template slot-scope="scope">
              <span>{{ genderTreeDatafun(scope.row.sex) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectName" label="所属项目" width="140" sortable="custom" v-if="isProjectSwitch === '1'">
          </el-table-column>
          <el-table-column prop="organizeName" label="所属部门" width="160" sortable="custom" />
          <el-table-column prop="birthday" label="出生日期" width="160" sortable="custom" />
          <el-table-column prop="nativePlace" label="籍贯" min-width="140" sortable="custom" />
          <el-table-column prop="nation" label="民族" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <span>{{ DictionaryDatafun(scope.row.nation) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="politicalOutlook" label="政治面貌" min-width="120" sortable="custom" />
          <el-table-column prop="education" label="学历" min-width="140" sortable="custom">
            <template slot-scope="scope">
              <span>{{ educationfun(scope.row.education) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="health" label="健康状况" min-width="130" sortable="custom" />
          <el-table-column prop="maritalStatus" label="婚姻状况" width="110" sortable="custom" />
          <el-table-column prop="criminalRecords" label="有无刑事记录" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row.criminalRecords == 1 ? '有' : '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="infectiousDisease" label="有无传染病或职业病史" min-width="210" sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row.infectiousDisease == 1 ? '有' : '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="driverLicenseType" label="驾照类型" min-width="130" sortable="custom" />
          <el-table-column prop="driverLicenseGrade" label="驾照职称" min-width="160" sortable="custom" />
          <el-table-column prop="languageProficiency" label="语言能力" min-width="160" sortable="custom" />
          <el-table-column prop="idCardNo" label="身份证号" min-width="200" sortable="custom" />
          <el-table-column prop="email" label="电子邮箱" width="180" sortable="custom" />
          <el-table-column prop="residentialAddress" label="居住地址" min-width="200" sortable="custom" />
          <el-table-column prop="homeLandlineTelephone" label="家庭固定电话" min-width="160" sortable="custom" />
          <el-table-column prop="emergencyContact" label="紧急联系人" width="130" sortable="custom" />
          <el-table-column prop="emergencyPhoneNumber" label="紧急联系人电话" width="160" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="120" sortable="custom" />
          <!-- <el-table-column prop="organizeName" label="所属组织" min-width="280" />
          <el-table-column prop="employeeType" label="员工类型" width="120" sortable="custom" />
          <el-table-column prop="employeeStatus" label="员工状态" width="120" align="center" sortable="custom">
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.employeeStatus == 'on_job'">在职</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="row.employeeStatus == 'off_job'">离职</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="entryDate" label="入职日期" :formatter="jnpf.tableDateFormatDay" width="140"
            sortable="custom" />
          <el-table-column prop="resignationDate" label="离职日期" :formatter="jnpf.tableDateFormatDay" width="140"
            sortable="custom" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" width="180"
            sortable="custom" />
          <el-table-column prop="sortCode" label="排序" width="80" align="center" sortable="custom" />
          <el-table-column prop="enabledMark" label="状态" width="80" align="center" sortable="custom">
            <template slot-scope="scope">
              <el-tag type="success" disable-transitions v-if="scope.row.enabledMark == 1">启用</el-tag>
              <el-tag type="warning" disable-transitions v-else-if="scope.row.enabledMark == 2">锁定</el-tag>
              <el-tag type="danger" disable-transitions v-else>禁用</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope" v-if="!scope.row.isAdministrator">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button size="mini" type="text">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="scope.row.employeeStatus != 'off_job' || !scope.row.employeeStatus">
                      <el-dropdown-item @click.native="jobTransfer(scope.row, scope)">岗位调动</el-dropdown-item>
                      <el-dropdown-item @click.native="jobQuit(scope.row.id)">办理离职</el-dropdown-item>
                      <el-dropdown-item @click.native="jobtransferrecord(scope.row.id)">调岗记录</el-dropdown-item>
                    </template>
                    <!-- <el-dropdown-item v-else @click.native="jobEntry(scope.row.id)">重新入职</el-dropdown-item> -->
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">查看简历</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <!-- 选择打印模版弹窗 -->
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" />
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <div style="margin-bottom: 10px;" v-if="isProjectSwitch === '1'">
        <el-select v-model="importProjectId" placeholder="请选择所属项目" style="width: 100%;" filterable
          :disabled="!userInfo.projectId ? false : userInfo.projectId === '1' ? false : true">
          <el-option v-for="item in projectIdData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" drag :auto-upload="false"
        :limit="1" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton"
            icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="formLoading" @click="submit()">
          提交</el-button>
      </span>
    </el-dialog>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" @saveproject="getAdvancedQuery" />
    <Form v-if="formVisible" ref="Form" @close="removeForm" />
    <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
    <!-- <ExportForm v-if="exportFormVisible" ref="exportForm" /> -->
    <!-- <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()" /> -->
    <JobTransfer v-if="jobTransferFormVisible" ref="JobTransfer" @close="removeForm" />
    <JobQuit v-if="jobQuitFormVisible" ref="JobQuit" @close="removeForm" />
    <JobCode v-if="JobCodeFormVisible" ref="JobCode" @close="removeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- <JobEntry v-if="jobEntryFormVisible" ref="JobEntry" @close="removeForm" /> -->
  </div>
</template>
<script>
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport, salecooperativepoolModel, getBimBusinessSwitchConfigList } from "@/api/basicData/index";
import { getAdvancedQueryList } from "@/api/system/advancedQuery";
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import {
  delbaseEmployee,
  getbaseEmployee
} from '@/api/permission/user'
import Form from './Form' // 新建
import Diagram from './Diagram' // 树状列表-组织机构
// import ImportForm from './ImportForm' // 导入数据
// import ExportForm from './ExportForm' // 导出数据
import JobTransfer from './JobTransfer' // 岗位调动
import JobQuit from './JobQuit' // 办理离职
import JobCode from './JobCode' // 调岗记录
// import JobEntry from './JobEntry' // 重新入职
import { mapGetters } from "vuex"
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'permission-user',
  mixins: [getProjectList],
  components: {
    Form,
    Diagram,
    ExportForm,
    // ImportForm,
    JobTransfer,
    JobQuit,
    SuperQuery,
    PrintBrowse,
    PrintDialog,
    JobCode
  },
  data() {
    return {
      isProjectSwitch: '',
      importProjectId:'',
      tableFlag: false,
      JobCodeFormVisible: false,
      printQuery: {
        category: 'Humanresources'   // 对应数据字典 分类编码
      },
      enCode: '',
      printVisible: false,
      printList: [],
      genderTreeData: [],
      educationTreeData: [],
      nationTreeData: [],
      formLoading: false,
      uploadVisib: false,
      superQueryJson: [
        {
          prop: 'jobNumber',
          label: "工号",
          type: 'input'
        },
        {
          prop: 'name',
          label: "姓名",
          type: 'input'
        },
        { // 下拉选
          prop: 'sex',
          label: '性别',
          type: 'select',
          options: [] // 注意，此options从接口异步获取，改变值时注意内存地址
        },
        { // 日期时间选择器（区间）
          prop: 'birthday',
          label: '出生日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: {}
        },
        {
          prop: 'nativePlace',
          label: "籍贯",
          type: 'input'
        },
        {
          prop: 'nation',
          label: "民族",
          type: 'select',
          options: []
        },
        {
          prop: 'politicalOutlook',
          label: "政治面貌",
          type: 'input'
        },
        {
          prop: 'education',
          label: "学历",
          type: 'select',
          options: []
        },
        {
          prop: 'health',
          label: "健康状况",
          type: 'input'
        },
        { // 下拉选
          prop: 'maritalStatus',
          label: '婚姻状况',
          type: 'select',
          options: [
            { label: '已婚', value: '已婚' },
            { label: '未婚', value: '未婚' }
          ] // 注意，此options从接口异步获取，改变值时注意内存地址
        },
        { // 下拉选
          prop: 'criminalRecords',
          label: '有无刑事记录',
          type: 'select',
          options: [
            { label: '有', value: 1 },
            { label: '无', value: 0 }
          ] // 注意，此options从接口异步获取，改变值时注意内存地址
        },
        { // 下拉选
          prop: 'infectiousDisease',
          label: '有无传染病或职业病史',
          type: 'select',
          options: [
            { label: '有', value: 1 },
            { label: '无', value: 0 }
          ] // 注意，此options从接口异步获取，改变值时注意内存地址
        },
        {
          prop: 'driverLicenseType',
          label: "驾照类型",
          type: 'input'
        },
        {
          prop: 'driverLicenseGrade',
          label: "驾照职称",
          type: 'input'
        },
        {
          prop: 'languageProficiency',
          label: "语言能力",
          type: 'input'
        },
        {
          prop: 'idCardNo',
          label: "身份证号",
          type: 'input'
        },
        {
          prop: 'email',
          label: "电子邮箱",
          type: 'input'
        },
        {
          prop: 'residentialAddress',
          label: "居住地址",
          type: 'input'
        },
        {
          prop: 'homeLandlineTelephone',
          label: "家庭固定电话",
          type: 'input'
        },
        {
          prop: 'emergencyContact',
          label: "紧急联系人",
          type: 'input'
        },
        {
          prop: 'emergencyPhoneNumber',
          label: "紧急联系人电话",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          pickerOptions: {}
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        }
      ],
      superQueryVisible: false,
      columnList: ["createByName", "emergencyPhoneNumber", "emergencyContact", "homeLandlineTelephone", "residentialAddress", "email", "idCardNo", "languageProficiency", "driverLicenseGrade", "driverLicenseType", "infectiousDisease", "criminalRecords", "nativePlace", "nation", "politicalOutlook"],
      filterText: "",
      tableData: [],
      treeLoading: false,
      listLoading: true,
      listQuery: {
        account: "",
        employeeStatus: "",
        employeeType: "",
        orderItems: [
          {
            asc: true,
            column: ""
          },
          {
            asc: false,
            column: "create_time"
          }
        ],
        organizeId: "",
        pageNum: 1,
        pageSize: 20,
        name: "",
        superQuery: {}
      },
      employeeTypeList: [{ label: "劳务派遣", value: "labor_dispatch" }, { label: "正式员工", value: "formal" }, { label: "兼职", value: "sideline" }, { label: "实习", value: "pratice" }, { label: "试用", value: "trial" }, { label: "学徒", value: "apprentice" }],
      employeeStatusList: [{ label: "在职", value: "on_job" }, { label: "离职", value: "off_job" }],
      total: 0,
      type: '',
      formVisible: false,
      diagramVisible: false,
      resetFormVisible: false,
      authorizeFormVisible: false,
      importFormVisible: false,
      exportFormVisible: false,
      jobTransferFormVisible: false,
      jobQuitFormVisible: false,
      jobEntryFormVisible: false,
      treeData: [], //树形结构所有的数据
      filterText: '',
      refreshTree: true,
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      expands: true,
      filteredTree: [],
      selectArr: [],
      leftFlag: false,
    }
  },
  watch: {
    filterText(val) {
      this.filterTree();
    },
    // 监听树形数据变化
    treeData: {
      handler: function (val) {
        this.filterTree();
      },
      deep: true,
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
 async created() {
    console.log(this.userInfo.projectId)
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
    this.getOrganizeList(true)
    if (localStorage.getItem("userFlag")) {
      let userFlag = JSON.parse(localStorage.getItem('userFlag'))
      this.expands = userFlag
      console.log("userFlag", userFlag);
      this.toggleExpand(userFlag)

    }
  },
  mounted() {
    this.getAdvancedQuery()
  },
  methods: {
    async getProjectSwitch() {
      let obj = {
        businessCode: 'system',
        pageSize: -1
      }
      const res = await getBimBusinessSwitchConfigList(obj)
      res.data.system.forEach((item) => {
        if (item.configKey == 'project') {
          this.isProjectSwitch = item.configValue1
        }
      })
    },
    //调岗记录
    jobtransferrecord(id) {
      this.JobCodeFormVisible = true
      this.$nextTick(() => {
        this.$refs.JobCode.init(id)
      })
    },
    closePrint() {
      this.printVisible = false
    },
    // 选择模版弹窗
    printView(enCode) {
      this.enCode = enCode
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(enCode)
      })
    },
    // 打印 员工二维码
    printOrder(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectArr.length > 1) return this.$message.error("打印只支持单条数据操作！")
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectArr[0].id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.listQuery,
          exportType: '1222',
          exportName: '员工档案',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    // 上传
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data)
      if (this.isProjectSwitch === '1') {
        formData.append('projectId', this.importProjectId)
      }
      //调用上传文件接口
      salecooperativepoolModel(formData).then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)
          this.formLoading = false
          this.loadingText = ''
        } else {
          this.loadingText = ''
          this.formLoading = false
          this.handleMessage(res.data)
        }
        this.uploadVisib = false
        this.initData()
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.uploadVisib = false
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: "error",
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h('div',
          {
            style: "padding-right:20px;display:flex;align-items:center;color:#f56c6c;"
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在信息错误！'),
            h('el-button', {
              props: {
                type: 'text',
                size: "mini",
                icon: 'el-icon-download'
              },
              on: {
                click: () => {
                  this.downNoProduct(data)
                }
              },
              style: {
                border: "none",
                textAlign: "center",
                // width:"20%",
                margin: "0 5px 0 5px ",
              },
            }, '下载导入错误数据')
          ]
        ),
      })
      return
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    submit() {
      if (this.isProjectSwitch === '1') {
        if (!this.importProjectId) return this.$message.error('请选择所属项目');
      }
      if (!this.file) return this.$message.error('请上传文件');
      this.UploadProduct(this.file)
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/员工档案导入模板.xlsx')
      a.click()
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    getAdvancedQuery() {
      getAdvancedQueryList(this.currMenuId).then(row => {
        this.datalist = row.data.list
      })
      // 获取民族
      this.$store.dispatch('base/getDictionaryData', { sort: 'Nation' }).then(res => {
        this.nationTreeData = res
        this.superQueryJson.forEach(item => {
          if (item.prop == 'nation') {
            item.options = res.map(o => {
              return { label: o.fullName, value: o.id }
            })
          }
        })
        // 获取学历
        this.$store.dispatch('base/getDictionaryData', { sort: 'Education' }).then(res => {
          this.educationTreeData = res
          this.superQueryJson.forEach(item => {
            if (item.prop == 'education') {
              item.options = res.map(o => {
                return { label: o.fullName, value: o.id }
              })
            }
          })
        })
        // 获取性别
        this.$store.dispatch('base/getDictionaryData', { sort: 'sex' }).then(res => {
          this.genderTreeData = res
          this.superQueryJson.forEach(item => {
            if (item.prop == 'sex') {
              item.options = res.map(o => {
                return { label: o.fullName, value: o.enCode }
              })
            }
          })
        })
      })
    },
    educationfun(val) {
      let _data = this.educationTreeData.filter(item => item.id == val)[0]
      return _data ? _data.fullName : val
    },
    DictionaryDatafun(val) {
      let _data = this.nationTreeData.filter(item => item.id == val)[0]
      return _data ? _data.fullName : val
    },
    genderTreeDatafun(val) {
      let _data = this.genderTreeData.filter(item => item.enCode == val)[0]
      return _data ? _data.fullName : val
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    // // 设置默认展开
    setexpand(expands) {
      console.log("expands", expands);
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("userFlag", expands)

      })
    },
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    // 选中得数据
    handleSelectionChange(val) {
      this.selectArr = val
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    showDiagram() {
      this.diagramVisible = true
      this.$nextTick(() => {
        this.$refs.Diagram.init()
      })
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = {
        account: "",
        employeeStatus: "",
        employeeType: "",
        orderItems: [{
          asc: true,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        organizeId: this.listQuery.organizeId,
        pageNum: 1,
        pageSize: 20,
        name: ""
      }
      this.getOrganizeList(true)
    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    filterNode(value, data) {
      return !value || data.fullName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    filterNodes(node) {
      let matched = this.filterNode(this.filterText, node);
      if (!matched && node.children) {
        node.children = node.children.filter(childNode => {
          const matchedChild = this.filterNodes(childNode);
          return matchedChild;
        });
        matched = node.children.length > 0;
      }
      return matched;
    },
    filterTree() {
      if (!this.filterText) {
        // 如果搜索框内容为空，展示全部树形结构数据
        this.filteredTree = this.treeData;
        return;
      }
      const filteredTreeData = JSON.parse(JSON.stringify(this.treeData));
      this.filteredTree = filteredTreeData.filter(node => {
        return this.filterNodes(node);
      });
    },
    getOrganizeList(isInit) {
      this.filterText = ''
      this.treeLoading = true
      this.listQuery.organizeId = ''
      // this.initData()
      getDepartmentSelectorByAuth().then(res => {
        this.treeData = res.data.list
        this.treeLoading = false
        if (isInit) this.initData()
      }).catch(() => {
        this.treeLoading = false
      })
    },
    initData() {
      this.getProjectSwitch()
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      getbaseEmployee(this.listQuery).then(res => {
        this.tableFlag = true
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleNodeClick(data) {
      if (this.listQuery.organizeId === data.id) return
      this.listQuery.organizeId = data.id
      this.type = data.type
      this.initData()
    },
    addOrUpdateHandle(id, onlyRead) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, this.type === 'department' ? this.listQuery.organizeId : '', onlyRead)
      })
    },
    // 岗位调动
    jobTransfer(row, scope) {
      this.jobTransferFormVisible = true
      this.$nextTick(() => {
        this.$refs.JobTransfer.init({ id: row.id, departmentName: row.organize })
      })
    },
    // 办理离职
    jobQuit(id) {
      this.jobQuitFormVisible = true
      this.$nextTick(() => {
        this.$refs.JobQuit.init(id)
      })
    },
    // // 重新入职
    // jobEntry(id) {
    //   this.jobEntryFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.JobEntry.init(id)
    //   })
    // },
    removeForm(isRefresh) {
      this.JobCodeFormVisible = false
      this.formVisible = false
      this.resetFormVisible = false
      this.jobTransferFormVisible = false
      this.jobQuitFormVisible = false
      this.jobEntryFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        delbaseEmployee(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    // exportForm() {
    //   this.exportFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.exportForm.init(this.listQuery)
    //   })
    // },
    uploadForm() {
      // this.importFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs.importForm.init()
      // })
      this.importProjectId = ''
      this.uploadVisib = true
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop == 'jobNumber' || prop == 'criminalRecords' || prop == 'driverLicenseGrade' || prop == 'driverLicenseType' || prop == 'emergencyContact' || prop == 'emergencyPhoneNumber' || prop == 'homeLandlineTelephone' || prop == 'idCardNo' || prop == 'infectiousDisease' || prop == 'languageProficiency' || prop == 'maritalStatus' || prop == 'nativePlace' || prop == 'politicalOutlook' || prop == 'residentialAddress') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      else newProp = prop.toLowerCase()
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = newProp
      this.initData()
    },
  }
}
</script>

<style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px;
}

.title_box {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
