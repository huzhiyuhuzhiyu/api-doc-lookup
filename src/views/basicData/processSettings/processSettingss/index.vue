<template>
  <div class="JNPF-common-layout">
    <div v-if="!formVisible" class="JNPF-common-layout-center">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="listTable" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:8px">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click.native="addOrUpdateHandle('', 'add')" size="mini">
              新建
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="importForm">导入</el-button>
            <el-button :disabled="list.length > 0 ? false : true" size="mini" type="primary" icon="el-icon-download"
              @click="exportForm">
              导出
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.listTable.showSortDrawer()" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()"/>
            </el-tooltip>
          </div>
        </div>
        <JNPF-table :data="list" highlight-current-row :fixedNO="true"
          class="dataTable" border ref="listTable" custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_548188" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="code" label="工艺路线编码" align="left" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="updateHandle(scope.row.id, 'look')">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="工艺路线名称" align="left" min-width="180"/>
          <el-table-column prop="processNames" label="工艺路线" align="left" min-width="220"/>
          <el-table-column prop="source" label="工艺类型" align="center" min-width="180">
            <template slot-scope="scope">
              <el-tag>{{ global.getDictLabelGlobal('craftType', scope.row.source) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reportRulesFlag" label="按工艺顺序报工" align="center" width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.reportRulesFlag == '0'">否</div>
              <div v-if="scope.row.reportRulesFlag == '1'">是</div>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" align="left" min-width="180"/>
          <el-table-column prop="createByName" label="创建人" align="left" width="100"/>
          <el-table-column prop="remark" label="备注" align="left" min-width="180"/>
          <!-- <el-table-column prop="state" label="工艺状态" align="center" sortable="custom" width="120" >
              <template slot-scope="scope">
                <div v-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag></div>
                <div v-if="scope.row.state == 'disable'"><el-tag type="danger">禁用</el-tag></div>
              </template>
            </el-table-column> -->
          <el-table-column prop="documentStatus" label="单据状态" align="center" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.documentStatus == 'draft'">
                <el-tag type="warning">草稿</el-tag>
              </div>
              <div v-if="scope.row.documentStatus == 'submit'">
                <el-tag type="success">提交</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="120" align="center"
            v-if="showAppCodeFlag">
            <template slot-scope="scope">
              <el-tag disable-transitions
                v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus !== 'draft'">
                审批中
              </el-tag>
              <el-tag type="success" disable-transitions
                v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus !== 'draft'">
                审批通过
              </el-tag>
              <el-tag type="danger" disable-transitions
                v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus !== 'draft'">
                审批拒绝
              </el-tag>
              <el-tag type="warning" disable-transitions
                v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus !== 'draft'">
                审批撤回
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : scope.row.approvalStatus == 'ok'" -->
              <el-button size="mini" type="text" @click="updateHandle(scope.row.id, 'edit')">
                编辑
              </el-button>
              <el-button size="mini" type="text" class="JNPF-table-delBtn"
                :disabled="scope.row.documentStatus !== 'draft'" @click="handleDel(scope.$index, scope.row.id)">
                删除
              </el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag"
                    @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                    审批撤回
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="updateHandle(scope.row.id, 'copy')">
                    复制
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="updateHandle(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()" class="pagination"/>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm"/>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download"/>
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <div style="margin-bottom: 10px;" v-if="isProjectSwitch === '1'">
        <el-select v-model="importProjectId" placeholder="请选择所属项目" style="width: 100%;" filterable
          :disabled="!userInfo.projectId ? false : userInfo.projectId === '1' ? false : true">
          <el-option v-for="item in projectIdDataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
        :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传.xls/.xlsx文件
          <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">
            下载模板
          </el-button>
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="saveSubmit()">
          提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import JNPFForm from './Form'
import {deleteProcess, detailProcess, getProcessList, importProcess} from '@/api/basicData/processSettingss'
import ExportForm from '@/components/no_mount/ExportBox/index'
import {excelExport} from '@/api/basicData/index'
import {withdrawn} from '@/api/basicData/approvalAdministrator'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  name: 'processSettingss',
  components: {JNPFForm, ExportForm},
  mixins: [getProjectList],
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            { prop: 'code', symbol: 'like', fixed: true },
            { prop: 'name', symbol: 'like', fixed: true },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      uploadVisib: false,
      importProjectId: '',
      isProjectSwitch: '',
      superQueryJson: [
        {
          prop: 'reportRulesFlag',
          label: '按工艺顺序报工',
          type: 'select',
          options: [
            {
              label: '是',
              value: '1'
            },
            {
              label: '否',
              value: '0'
            }
          ]
        },
        {
          prop: 'source',
          label: '工艺类型',
          type: 'select',
          options: this.global.craftType
        }
      ],
      exportFormVisible: false,
      title: '更多查询',
      list: [],
      stateList: [
        {
          label: '启用',
          value: 'enable'
        },
        {
          label: '禁用',
          value: 'disable'
        }
      ],
      documentStatusList: [
        {
          label: '草稿',
          value: 'draft'
        },
        {
          label: '提交',
          value: 'submit'
        }
      ],
      statusList: [
        {
          label: '审批中',
          value: 'ing'
        },
        {
          label: '审批通过',
          value: 'ok'
        },
        {
          label: '审批拒绝',
          value: 'rebut'
        }
      ],
      listLoading: true,
      total: 0,
      listQuery: {
        routeType: 'processLibrary',
      },
      formVisible: false,
      dataDetail: [],
      detailLoading: false,
      visible: false,
      customerRecognitionTime: [],
      columnList: ['reasonRejection', 'remark', 'createByName', 'createTime'],
      showAppCodeFlag: true
    }
  },
  async created() {
    const res = await this.jnpf.getBusInfo('b024')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
  },
  methods: {
    // 导入
    importForm() {
      if (this.userInfo.projectId !== '1') {
        this.importProjectId = this.userInfo.projectId
      } else {
        this.importProjectId = ''
      }
      this.uploadVisib = true

    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')

      a.setAttribute('href', location.origin + '/static/工艺路线导入模板.xlsx')


      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      if (this.isProjectSwitch === '1') {
        formData.append('projectId', this.importProjectId)
      }
      //调用上传文件接口

      importProcess(formData)
        .then((res) => {
          if (!res.data) {
            this.$message.success(`导入成功`)
            this.uploadVisib = false
            this.$refs['UploadProduct']
            this.initData()
          } else {
            this.uploadVisib = false
            this.handleMessage(res.data)
          }

          this.formLoading = false
          this.loadingText = ''
        })
        .catch((err) => {
          console.log(err, 'err')
          this.uploadVisib = false
          console.log(err, 'err')
          this.formLoading = false
          this.loadingText = ''
        })
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    saveSubmit() {
      if (this.isProjectSwitch === '1') {
        if (!this.importProjectId) return this.$message.error('请选择所属项目');
      }
      if (!this.file) return this.$message.error('请上传文件');
      this.UploadProduct(this.file)
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: 'error',
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h(
          'div',
          {
            style: 'padding-right:20px;display:flex;align-items:center;color:#f56c6c;'
          },
          [
            h('p', {style: 'font-size:14px;'}, '导入成功，存在工艺路线相关信息错误！'),
            h(
              'el-button',
              {
                props: {
                  type: 'text',
                  size: 'mini',
                  icon: 'el-icon-download'
                },
                on: {
                  click: () => {
                    this.downNoProduct(data)
                  }
                },
                style: {
                  border: 'none',
                  textAlign: 'center',
                  // width:"20%",
                  margin: '0 5px 0 5px '
                }
              },
              '下载导入错误数据'
            )
          ]
        )
      })
      return
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          withdrawn(_data).then((res) => {
            this.$message({
              type: 'success',
              message: '撤回成功',
              duration: 1500,
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => {
        })
    },

    moreQueries() {
      this.visible = true
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    // 内容选择事件
    handleCurrentChange(val) {
      if (!val && data.length) return
      this.detailLoading = true
      detailProcess(val.id).then((res) => {
        this.dataDetail = res.data || []
        this.detailLoading = false
      })
    },

    columnSetFun() {
      this.$refs.listTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.listTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return {label: item.label, prop: item.prop}
      })

      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.listQuery,
          exportType: '1033',
          exportName: '工艺路线信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => {
          })
      }
    },
    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.listLoading = true
      this.detailLoading = false
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      this.dataDetail = []
      getProcessList(this.listQuery)
        .then((res) => {
          this.list = res.data.records || []
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
          // this.$nextTick(() => {
          //   this.$refs.listTable.$refs.JNPFTable.setCurrentRow(this.list[0]) // 自动选择第一项
          // })
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 删除数据
    handleDel(index, id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      })
        .then(() => {
          deleteProcess(id).then((res) => {
            if (res.msg === 'Success') res.msg = '删除成功'
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => {
        })
    },
    // 新增数据
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    // 编辑数据
    updateHandle(id, type) {
      this.formVisible = true

      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },

    refresh() {
      this.formVisible = false
      this.initData()
    },

  }
}
</script>
<style scoped lang="scss">
.tableBox {
  flex: auto;
  display: flex;
  position: relative;

  // border: 1px solid #dedede;
  // box-shadow: inset 0 0 0 1px #dedede;
  > .dataTable:first-child {
    flex: 3;
    margin: 0 3px 0 0;
  }

  > .dataTable:last-child {
    flex: 2;
  }
}
</style>
