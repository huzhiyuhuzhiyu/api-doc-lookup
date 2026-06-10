<template>
  <div class="JNPF-common-layout">










    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
        <div class="title_box">
          <h2>{{ $t('common.organization') }}</h2>
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
              <el-input v-model="listQuery.account" placeholder="请输入账户" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.realName" placeholder="请输入姓名" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.enabledMark" placeholder="请选择状态" clearable>
                <el-option
                  v-for="item in [{ label: '禁用', value: 0 }, { label: '启用', value: 1 }, { label: '锁定', value: 2 }]"
                  :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
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
          <div>
            <el-dropdown style="margin-right:10px;">
              <el-button size="mini" type="primary" icon="el-icon-plus">
                新建
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="addOrUpdateHandle('', false, true)">从员工新建</el-dropdown-item>
                <el-dropdown-item @click.native="addOrUpdateHandle('', false, false)">直接新建</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button icon="el-icon-lock" type="warning" size="mini" @click="plhandleResetPwd">重置密码</el-button>
            <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download"
              :disabled="!tableData.length" @click="exportForm">导出</el-button>
            <el-button size="mini" v-has="'btn_import'" type="primary" icon="el-icon-plus"
              @click="uploadForm">导入</el-button>
            <el-button style="margin-left:10px" type="primary" icon="el-icon-plus" @click.native="toDingHandle('')">
              阿里钉钉同步到系统
            </el-button>
            <!-- <el-dropdown style="margin:0 10px;">
                <el-button  type="primary" icon="el-icon-plus">
                  同步到系统
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="toDingHandle('')">阿里钉钉同步到系统</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            <el-dropdown style="margin:0 10px;">
              <el-button type="primary" icon="el-icon-plus">
                同步到第三方
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="toWxHandle('sync')">同步到企业微信</el-dropdown-item>
                <el-dropdown-item @click.native="toDingHandle('sync')">同步到阿里钉钉</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
        <JNPF-table v-if="tableFlag" :data="tableData" custom-column fixedNO @sort-change="sortChange"
          @selection-change="handleSelectionChange" hasC ref="dataTable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_556108">
          <el-table-column prop="account" label="账户" width="100" fixed /> <!-- 这里的 width 会被转成 min-width -->
          <el-table-column prop="realName" label="姓名" width="100" fixed="left" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">{{
                scope.row.realName
              }}</el-link>
            </template>
          </el-table-column>
          <!-- 这里的 width 会被转成 min-width -->
          <el-table-column prop="projectName" label="所属项目" width="140" sortable="custom" v-if="isProjectSwitch === '1'">
          </el-table-column>
          <el-table-column prop="mobilePhone" label="手机号码" width="160" />
          <el-table-column prop="departmentName" v-if="isApprovalwitch" label="所属部门" min-width="160" />
          <el-table-column prop="organizeName" v-else label="所属部门" min-width="280" />
          <el-table-column prop="roleName" label="角色" min-width="140" />
          <!-- <el-table-column prop="employeeStatus" label="员工状态" width="120" align="center" sortable="custom">
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.employeeStatus == 'on_job'">在职</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="row.employeeStatus == 'off_job'">离职</el-tag>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="entryDate" label="入职日期" :formatter="jnpf.tableDateFormatDay" width="140"
            sortable="custom" /> -->
          <!-- <el-table-column prop="resignationDate" label="离职日期" :formatter="jnpf.tableDateFormatDay" width="140"
            sortable="custom" /> -->
          <!-- <el-table-column prop="sortCode" label="排序" width="80" align="center" sortable="custom" /> -->
          <el-table-column prop="enabledMark" label="状态" width="80" align="center" sortable="custom">
            <template slot-scope="scope">
              <el-tag type="success" disable-transitions v-if="scope.row.enabledMark == 1">启用</el-tag>
              <el-tag type="warning" disable-transitions v-else-if="scope.row.enabledMark == 2">锁定</el-tag>
              <el-tag type="danger" disable-transitions v-else>禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat" width="180"
            sortable="custom" />
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
                      <!-- <el-dropdown-item @click.native="jobTransfer(scope.row, scope)">岗位调动</el-dropdown-item>
                      <el-dropdown-item @click.native="jobQuit(scope.row.id)">办理离职</el-dropdown-item> -->
                    </template>
                    <el-dropdown-item v-else @click.native="jobEntry(scope.row.id)">重新入职</el-dropdown-item>
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">查看详情</el-dropdown-item>
                    <el-dropdown-item @click.native="handleResetPwd(scope.row.id)"> {{ $t('user.resetPassword') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="unlockUser(scope.row.id)"
                      v-if="scope.row.enabledMark == 2">解除锁定</el-dropdown-item>
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
    <Form v-if="formVisible" ref="Form" @close="removeForm" />
    <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
    <ResetPwdForm v-if="resetFormVisible" ref="ResetPwdForm" @refreshDataList="initData" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" />
    <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()" />
    <JobTransfer v-if="jobTransferFormVisible" ref="JobTransfer" @close="removeForm" />
    <JobQuit v-if="jobQuitFormVisible" ref="JobQuit" @close="removeForm" />
    <JobEntry v-if="jobEntryFormVisible" ref="JobEntry" @close="removeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <!-- <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" /> -->
    <el-dialog title="数据同步" :visible.sync="dataVisible" class="JNPF-dialog JNPF-dialog_center sync-dialog" lock-scroll
      width="450px">
      <el-alert title="注意：尽量使用单向同步，避免双向同步造成数据重复" type="warning" :closable="false" show-icon />
      <div class="add-main" v-if="syncType">
        <div class="add-item add-item-sys">
          <i class="add-icon icon-ym icon-ym-upload"></i>
          <div class="add-txt">
            <p class="add-title">{{ name }}</p>
            <p class="add-desc">{{ names }}</p>
          </div>
          <div class="add-button">
            <el-button type="primary" size="small" @click="name === '同步到企业微信' ? syncQy(0) : syncDing(0)"
              :loading="wechatLoading" :disabled="dingLoading">
              同步</el-button>
          </div>
        </div>
      </div>
      <div class="add-main" v-if="synchronization !== '把企业微信数据同步到系统' && !syncType">
        <div class="add-item add-item-sys">
          <i class="add-icons icon-ym icon-ym-download"></i>
          <div class="add-txt">
            <p class="add-title">同步到系统</p>
            <p class="add-desc">{{ synchronization }}</p>
          </div>
          <div class="add-button">
            <el-button type="primary" size="small" @click="name === '同步到企业微信' ? syncQy(1) : syncDing(1)"
              :loading="dingLoading" :disabled="wechatLoading">
              同步</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getBimBusinessDetail, excelExport, salecooperativeUsers, getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import {
  updateUserState,
  unlockUser,
  delUser,
  getUserListPost
} from '@/api/permission/user'
import Form from './Form' // 新建
import Diagram from './Diagram' // 树状列表-组织机构
import ResetPwdForm from './ResetPassword' // 重设密码
import ImportForm from './ImportForm' // 导入数据
import ExportForm from './ExportForm' // 导出数据
// import ExportForm from '@/components/no_mount/ExportBox/index'
import JobTransfer from './JobTransfer' // 岗位调动
import JobQuit from './JobQuit' // 办理离职
import JobEntry from './JobEntry' // 重新入职
import {
  synAllOrganizeDingToSys,
  synAllUserDingToSys,
  synAllOrganizeQyToSys,
  synAllUserQyToSys,
  getOrganizeToDing,
  getUserToWx,
  getUserToDing

} from '@/api/system/sysConfig'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from "vuex"
export default {
  name: 'permission-user',
  mixins: [getProjectList],
  components: {
    Form,
    Diagram,
    ResetPwdForm,
    ExportForm,
    ImportForm,
    JobTransfer,
    JobQuit,
    JobEntry,
    SuperQuery
  },
  data() {
    return {
      isApprovalwitch: '',
      isProjectSwitch: '',
      importProjectId: '',
      tableFlag: false,
      syncType: '',
      superQueryJson: [
        {
          prop: 'account',
          label: "账户",
          type: 'input'
        },
        {
          prop: 'realName',
          label: "姓名",
          type: 'input'
        },
        {
          prop: 'mobilePhone',
          label: "手机号码",
          type: 'input'
        },
        {
          prop: 'roleName',
          label: "角色",
          type: 'input'
        },
        {
          prop: 'enabledMark',
          label: "状态",
          type: 'select',
          options: [
            { label: "启用", value: 1 },
            { label: "锁定", value: 2 },
            { label: "禁用", value: 3 }
          ]
        },
        {
          prop: 'creatorTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'timestamp',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        }
      ],
      superQueryVisible: false,
      dataVisible: false,
      wechatLoading: false,
      dingLoading: false,
      uploadVisib: false,
      columnList: [],
      filterText: "",
      tableData: [],
      treeLoading: false,
      listLoading: true,
      listQuery: {
        account: "",
        employeeStatus: "",
        enabledMark: "",
        orderItems: [
          {
            asc: true,
            column: ""
          },
          {
            asc: false,
            column: "f_entrydate"
          }
        ],
        organizeId: "",
        pageNum: 1,
        pageSize: 20,
        realName: ""
      },
      employeeTypeList: [{ label: "劳务派遣", value: "labor_dispatch" }, { label: "正式员工", value: "formal" }, { label: "兼职", value: "sideline" }, { label: "实习", value: "pratice" }, { label: "试用", value: "trial" }, { label: "学徒", value: "apprentice" }],
      employeeStatusList: [{ label: "在职", value: "on_job" }, { label: "离职", value: "off_job" }],
      total: 0,
      type: '',
      visible: false,
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
      name: '',
      names: '',
      synchronization: ''
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
    await this.getProjectSwitch()
    this.getSwitch()
    await this.getProjectList()
    this.getOrganizeList(true)
    if (localStorage.getItem("userFlag")) {
      let userFlag = JSON.parse(localStorage.getItem('userFlag'))
      this.expands = userFlag
      this.toggleExpand(userFlag)

    }
  },
  methods: {
    getSwitch() {
      let obj = {
        businessCode: 'departmentalset',
        configKey: `bmzz_departmentalset`
      }
      getBimBusinessDetail(obj).then(res => {
        this.isApprovalwitch = res.data.configValue1 == '1' ? true : false
      })
    },
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
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
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
      salecooperativeUsers(formData).then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)
          this.formLoading = false
          this.loadingText = ''
        } else {
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
    //下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    handleFileChange(file) {
      this.file = file.raw
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
      a.setAttribute('href', location.origin + '/static/用户信息导入模板.xlsx')
      a.click()
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
      this.visible = false
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = {
        account: "",
        employeeStatus: "",
        enabledMark: "",
        orderItems: [{
          asc: true,
          column: ""
        }, {
          asc: false,
          column: "f_entrydate"
        }],
        organizeId: this.listQuery.organizeId,
        pageNum: 1,
        pageSize: 20,
        realName: ""
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
      getDepartmentSelectorByAuth().then(res => {
        this.treeData = res.data.list
        this.treeLoading = false
        if (isInit) this.initData()
      }).catch(() => {
        this.treeLoading = false
      })
    },
    initData() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      getUserListPost(this.listQuery).then(res => {
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
    addOrUpdateHandle(id, onlyRead, val) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, this.type === 'department' ? this.listQuery.organizeId : '', onlyRead, val)
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
    // 重新入职
    jobEntry(id) {
      this.jobEntryFormVisible = true
      this.$nextTick(() => {
        this.$refs.JobEntry.init(id)
      })
    },
    removeForm(isRefresh) {
      this.formVisible = false
      this.resetFormVisible = false
      this.jobTransferFormVisible = false
      this.jobQuitFormVisible = false
      this.jobEntryFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleUpdateState(row) {
      const txt = row.enabledMark ? '禁用' : '开启'
      this.$confirm(`您确定要${txt}当前用户吗, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        updateUserState(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              row.enabledMark = row.enabledMark ? 0 : 1
            }
          })
        })
      }).catch(() => { })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        delUser(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功',
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    unlockUser(id) {
      this.$confirm('此操作将解除该账户锁定, 是否继续?', '解除锁定', {
        type: 'warning'
      }).then(() => {
        unlockUser(id).then(res => {
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
    exportForm() {
      this.exportFormVisible = true
      this.$nextTick(() => {
        this.$refs.exportForm.init(this.listQuery)
      })
    },
    // 导出
    // exportForm() {
    //   this.exportFormVisible = true
    //   let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
    //   columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
    //   this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    // },
    // download(data) {
    //   if (data) {
    //     this.exportFormVisible = false
    //     let includeFieldMap = {}
    //     for (let i = 0; i < data.selectKey.length; i++) {
    //       includeFieldMap[data.selectKey[i]] = data.selectVal[i];
    //     }
    //     let _data = {
    //       ...this.listQuery,
    //       exportType: '1223',
    //       exportName: '用户信息',
    //       includeFieldMap,
    //       pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
    //     }
    //     excelExport(_data).then(res => {
    //       this.exportFormVisible = false
    //       if (!res.data.url) return
    //       this.jnpf.downloadFile(res.data.url)
    //     }).catch(() => { })
    //   }
    // },
    uploadForm() {
      // this.importFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs.importForm.init()
      // })
      this.uploadVisib = true
    },
    plhandleResetPwd() {
      if (!this.selectArr.length) return this.$message.error('请先选择数据')
      this.resetFormVisible = true
      let a = this.selectArr.map(item => item.id)
      this.$nextTick(() => {
        this.$refs.ResetPwdForm.init('', a, 'Multiple')
      })
    },
    handleResetPwd(id, account) {
      this.resetFormVisible = true
      this.$nextTick(() => {
        this.$refs.ResetPwdForm.init(id, account, 'single')
      })
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop == 'employeeStatus' || prop == 'resignationDate' || prop == 'employeeType') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      else newProp = 'f_' + prop.toLowerCase()
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = newProp
      this.initData()
    },
    // 同步到钉钉
    toDingHandle(syncType) {
      this.syncType = syncType
      if (!this.selectArr.length && this.syncType) return this.$message.warning('请选择您要同步的用户数据')
      this.name = '同步到阿里钉钉'
      this.names = '用户数据同步到阿里钉钉'
      this.synchronization = '把阿里钉钉数据同步到系统'
      this.dataVisible = true
    },
    // 同步到企微
    toWxHandle(syncType) {
      this.syncType = syncType
      if (!this.selectArr.length && this.syncType) return this.$message.warning('请选择您要同步的用户数据')
      this.name = '同步到企业微信'
      this.names = '用户数据同步到企业微信'
      this.synchronization = '把企业微信数据同步到系统'
      this.dataVisible = true
    },
    syncQy(type) {
      let ids = this.selectArr.map(item => item.id)
      this.$confirm('同步以后会丢失现有数据，是否继续？', '提示', {
        type: 'warning'
      }).then(() => {
        type == 0 ? this.wechatLoading = true : this.dingLoading = true
        const method = type === 0 ? getUserToWx : synAllUserQyToSys
        let obj = type == 0 ? ids : type
        method(obj).then(res => {
          type == 0 ? this.wechatLoading = false : this.dingLoading = false
          this.dataVisible = false
          if (res.msg === '正在进行同步,请稍等') {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
            })
            return
          }
          this.$message({
            message: '同步成功',
            type: 'success',
            duration: 1500,
          })
        }).catch(() => { type == 0 ? this.wechatLoading = false : this.dingLoading = false })
      })
    },
    syncDing(type) {
      let ids = this.selectArr.map(item => item.id)
      this.$confirm('同步以后会丢失现有数据，是否继续？', '提示', {
        type: 'warning'
      }).then(() => {
        type == 0 ? this.wechatLoading = true : this.dingLoading = true
        const method = type == 0 ? getUserToDing : synAllUserDingToSys
        let obj = type == 0 ? ids : type
        method(obj).then(res => {
          type == 0 ? this.wechatLoading = false : this.dingLoading = false
          this.dataVisible = false
          if (res.msg === '正在进行同步,请稍等') {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
            })
            return
          }
          this.$message({
            message: '同步成功',
            type: 'success',
            duration: 1500,
          })
        }).catch(() => { type == 0 ? this.wechatLoading = false : this.dingLoading = false })
      })
    },
  }
}
</script>

<style scoped lang="scss">
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

.add-main {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .add-item {
    width: 450px;
    height: 100px;
    display: flex;
    align-items: center;
    cursor: pointer;

    &.add-item-sys {
      .add-icon {
        background: #75d8f791;
        color: #08c0f8;
      }
    }

    .add-icon {
      width: 56px;
      height: 56px;
      margin-right: 10px;
      background: #cefae2;
      border-radius: 50%;
      color: #0eac5c;
      flex-shrink: 0;
      font-size: 30px;
      line-height: 56px;
      text-align: center;
    }

    .add-button {
      margin-left: 80px;
    }

    .add-icons {
      width: 56px;
      height: 56px;
      margin-right: 10px;
      background: #cefae2;
      border-radius: 50%;
      color: #0eac5c;
      flex-shrink: 0;
      font-size: 30px;
      line-height: 56px;
      text-align: center;
    }

    .add-txt {
      height: 56px;

      P {
        line-height: 28px;
      }

      .add-title {
        font-size: 18px;
        font-weight: bold;
      }

      .add-desc {
        color: #8d8989;
        font-size: 12px;
        width: 150px;
      }
    }
  }
}
</style>
