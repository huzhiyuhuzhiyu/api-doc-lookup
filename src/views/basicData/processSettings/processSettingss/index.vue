<template>
  <div class="JNPF-common-layout">
    <div v-if="!formVisible" class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.code" @keyup.enter.native="search()" placeholder="工艺路线编码" clearable
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="listQuery.name" @keyup.enter.native="search()" placeholder="工艺路线名称" clearable
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.state" placeholder="工艺状态" clearable style="width: 100%;">
                <el-option
                  v-for="(item, index) in stateList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
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
            <el-tooltip content="高级查询" placement="top" v-if="true">
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
        <div class="tableBox" v-loading="listLoading">
          <JNPF-table v-if="tableDataFlag" :data="list" @sort-change="sortChange" highlight-current-row :fixedNO="true"
            class="dataTable" border ref="listTable" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="code" label="工艺路线编码" align="left" sortable="custom" min-width="180">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="updateHandle(scope.row.id, 'look')">
                  {{ scope.row.code }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="工艺路线名称" align="left" sortable="custom" min-width="180" />
            <el-table-column prop="projectName" label="所属项目" width="120"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="reportRulesFlag" label="按工艺顺序报工" align="center" sortable="custom" width="160">
              <template slot-scope="scope">
                <div v-if="scope.row.reportRulesFlag == '0'">否</div>
                <div v-if="scope.row.reportRulesFlag == '1'">是</div>
              </template>
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间" align="left" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" align="left" width="100" sortable="custom" />
            <el-table-column prop="remark" label="备注" align="left" min-width="180" />
            <!-- <el-table-column prop="state" label="工艺状态" align="center" sortable="custom" width="120" >
              <template slot-scope="scope">
                <div v-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag></div>
                <div v-if="scope.row.state == 'disable'"><el-tag type="danger">禁用</el-tag></div>
              </template>
            </el-table-column> -->
            <el-table-column prop="documentStatus" label="单据状态" align="center" sortable="custom" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center"
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
                    <el-dropdown-item @click.native="updateHandle(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
        </div>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" class="pagination" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />

    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
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
        <!-- <el-button type="primary" @click="saveSubmit()">
          提交
        </el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import JNPFForm from './Form'
import { getProcessList, detailProcess, deleteProcess } from '@/api/basicData/processSettingss'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: { JNPFForm, ExportForm, SuperQuery },
  mixins: [getProjectList],
  data() {
    return {
      uploadVisib: false,
      isProjectSwitch: '',
      tableDataFlag: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '工艺路线编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '工艺路线名称',
          type: 'input'
        },
        {
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
        },
        {
          prop: 'approvalStatus',
          label: '审批状态',
          type: 'select',
          options: [
            { label: '审批中', value: 'ing' },
            { label: '审批通过', value: 'ok' },
            { label: '审批拒绝', value: 'rebut' },
            { label: '审批撤回', value: 'withdrawn' }
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上个月',
            onClick(picker) {
              const end = new Date(moment(new Date().getTime()).format('YYYY-MM-01 00:00:00'))
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      listLoading: true,
      total: 0,
      listQuery: {
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
        code: '',
        name: '',
        state: '',
        approvalStatus: '',
        documentStatus: '',
        createEndTime: '',
        createStartTime: ''
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
  mounted() {
    this.getProductClassFun()
  },
  async created() {
    const res = await this.jnpf.getBusInfo('b024')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    await this.getProjectSwitch('system', 'project')
    this.tableDataFlag = true
    this.initData()
  },
  methods: {
    // 导入
    importForm() {

      // this.$refs.UploadProduct.$el.querySelector('input').click()
      this.uploadVisib = true

    },
    handleRemove(file, fileList) { },
    handlePreview(file) { },
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
      //调用上传文件接口

      uploadBomData(formData)
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
            h('p', { style: 'font-size:14px;' }, '导入成功，存在BOM相关信息错误！'),
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
        .catch(() => { })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa007',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj1).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverTyping')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa006',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj2).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'accuracyLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa005',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj3).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'vibrationLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa002',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj4).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oil')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa003',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj5).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oilQuantity')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa001',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj6).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'clearance')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa015',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj7).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'packagingMethod')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    moreQueries() {
      this.visible = true
    },
    dataFormSubmit() {
      this.listQuery.pageNum = 1
      if (this.customerRecognitionTime && this.customerRecognitionTime.length > 0) {
        this.listQuery.createStartTime = this.customerRecognitionTime[0] + ' 00:00:00'
        this.listQuery.createEndTime = this.customerRecognitionTime[1] + ' 23:59:59'
      } else {
        this.listQuery.createStartTime = ''
        this.listQuery.createEndTime = ''
      }
      this.initData()
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
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'createByName') {
        newProp = 'create_by'
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.listTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.listTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
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
          .catch(() => { })
      }
    },
    initData() {
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
        .catch(() => { })
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
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },
    reset() {
      this.$refs['listTable'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        code: '',
        name: '',
        state: '',
        approvalStatus: '',
        documentStatus: '',
        createEndTime: '',
        createStartTime: ''
      }
      this.customerRecognitionTime = []
      this.$refs.SuperQuery.conditionList = []
      this.search()
    }
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
  >.dataTable:first-child {
    flex: 3;
    margin: 0 3px 0 0;
  }

  >.dataTable:last-child {
    flex: 2;
  }
}
</style>
