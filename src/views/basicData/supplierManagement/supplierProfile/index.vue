<template>
  <div class="JNPF-common-layout">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%;background-color: #fff;">
      <el-tab-pane label="供应商页面" name="supplierPage" style="margin-bottom: 5px;height: 100%;">
        <div class="JNPF-common-layout"> -->
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0">
        <div class="title_box">
          <h2 v-if="!leftFlag">供应商分类</h2>
          <span class="options" v-if="!leftFlag">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree(true)">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div v-if="!leftFlag">
          <el-input placeholder="请输入" v-model="filterText" style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable></el-input>
        </div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i :class="[
              data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm'
            ]" />
            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract " style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand " style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.code" placeholder="编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.name" placeholder="名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.mobilePhone" placeholder="手机号" clearable />
            </el-form-item>
          </el-col> -->
          <template v-for="item in searchList">
            <el-col :span="item.searchType === 3 ? 6 : 4">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable @keyup.enter.native="search('basic')" />

                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label" clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label" :value="item2.value"></el-option>
                </el-select>
                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue" :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable :type="item.dateType" :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <div style="display:flex;">
            <topOpts @add="addSupplier()">
              <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary" icon="el-icon-download" @click="exportForm">
                导出
              </el-button>
              <el-button size="mini" v-has="'btn_import'" type="primary" icon="el-icon-plus" @click="importProductFun">导入</el-button>
            </topOpts>
          </div>

          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
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
        <JNPF-table ref="dataTable" v-loading="listLoading" highlight-current-row :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column :setColumnDisplayList="columnList" :element-loading-text="loadingText">
          <el-table-column prop="code" label="编码" width="140" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'true')">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="taxId" label="税号" min-width="200" />
          <el-table-column prop="name" label="名称" min-width="150" sortable="custom" />
          <el-table-column prop="regionCodeText" label="地区" width="80" />
          <el-table-column prop="countryText" label="国家" width="80" />
          <el-table-column prop="provinceText" label="省" width="90" />
          <el-table-column prop="cityText" label="市" width="90" />
          <el-table-column prop="areaText" label="区" width="90" />
          <el-table-column prop="address" label="地址" width="140" />
          <el-table-column prop="billingTypeText" label="开票类型" width="100" />
          <el-table-column prop="taxRate" label="税率" width="80" sortable="custom">
            <template slot-scope="scope">
              {{ scope.row.taxRate }}%
            </template>
          </el-table-column>
          <!-- <el-table-column prop="customerRecognitionTime" label="认定日期" width="160" sortable="custom" /> -->
          <el-table-column prop="personResponsible" label="负责人" width="90" />
          <el-table-column prop="contacts" label="联系人" width="90" />
          <el-table-column prop="phone" label="电话" width="100" />
          <el-table-column prop="mobilePhone" label="手机号" width="120" />
          <!-- <el-table-column prop="fax" label="传真" width="160" /> -->
          <!-- <el-table-column prop="zipCode" label="邮编" width="160" /> -->
          <el-table-column prop="email" label="邮箱" width="100" />
          <el-table-column prop="bank" label="开户银行" width="160" />
          <el-table-column prop="bankInfo" label="银行账号" width="160" />
          <el-table-column prop="gradeText" label="等级" width="100"></el-table-column>
          <el-table-column prop="reconciliationStartDate" label="对账开始日期" width="120"></el-table-column>
          <el-table-column prop="reconciliationEndDate" label="对账结束日期" width="130"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="100" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId)" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'true')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize" @pagination="initData" />
      </div>
    </div>
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" drag :auto-upload="false" :file-list="fileList" :limit="1" :on-exceed="handleFileexceed" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="submit()">
          提交</el-button>
      </span>
    </el-dialog>
    <!-- </div> -->

    <!-- </el-tab-pane> -->
    <!-- <el-tab-pane label="供应商表格" name="supplierTable">

      </el-tab-pane>

    </el-tabs> -->
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getcategoryTree, getCooperativeData, deleteCooperative, supplierupload } from '@/api/basicData/index'
import Form from './Form'
import UserRelationList from './userRelation'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { log } from 'mathjs'
export default {
  name: 'supplierProfile',
  components: { Form, UserRelationList, ExportForm, SuperQuery },
  data() {
    return {
      fileList: [],
      loadingText: '',
      file: {},
      uploadVisib: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '编码',
          type: 'input'
        },
        {
          prop: 'taxId',
          label: '税号',
          type: 'input'
        },
        {
          prop: 'name',
          label: '名称',
          type: 'input'
        },
        {
          prop: 'regionCodeText',
          label: '地区',
          type: 'input'
        },
        {
          prop: 'countryText',
          label: '国家',
          type: 'input'
        },
        {
          prop: 'provinceText',
          label: '省',
          type: 'input'
        },
        {
          prop: 'cityText',
          label: '市',
          type: 'input'
        },
        {
          prop: 'areaText',
          label: '区',
          type: 'input'
        },
        {
          prop: 'address',
          label: '地址',
          type: 'input'
        },
        {
          prop: 'billingTypeText',
          label: '开票类型',
          type: 'input'
        },
        {
          prop: 'taxRate',
          label: '税率%',
          type: 'select',
          options: []
        },
        {
          prop: 'contacts',
          label: '联系人',
          type: 'input'
        },
        {
          prop: 'phone',
          label: '电话',
          type: 'input'
        },
        {
          prop: 'mobilePhone',
          label: '手机号',
          type: 'input'
        },
        {
          prop: 'email',
          label: '邮箱',
          type: 'input'
        },
        {
          prop: 'bank',
          label: '开户银行',
          type: 'input'
        },
        {
          prop: 'bankInfo',
          label: '银行账号',
          type: 'input'
        },
        {
          prop: 'gradeText',
          label: '等级',
          type: 'input'
        },
        {
          prop: 'reconciliationStartDate',
          label: '对账开始日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'reconciliationEndDate',
          label: '对账结束日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
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
        }
      ],
      basicQuery: {},
      superQuery: {},
      searchList: [
        { field: 'code', fieldValue: '', label: '编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'name', fieldValue: '', label: '名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'mobilePhone', fieldValue: '', label: '手机号', symbol: 'like', searchType: 1, width: 120 },

      ],
      title: '更多查询',
      exportFormVisible: false,
      background: true, //分页器背景颜色
      activeName: 'supplierPage',
      visible: false,
      leftFlag: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      form: {
        code: '',
        taxId: '',
        name: '',
        customerRecognitionTime: [],
        customerRecognitionStartTime: '',
        customerRecognitionEndTime: '',
        personResponsible: '',
        contacts: '',
        phone: '',
        mobilePhone: '',
        email: '',
        grade: '',
        type: 'supplier',
        partnerCategoryId: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ]
      },
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
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },

      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      columnList: [
        'taxId',
        'regionCodeText',
        'countryText',
        'provinceText',
        'cityText',
        'areaText',
        'address',
        'billingTypeText',
        'taxRate',
        'personResponsible',
        'email',
        'bank',
        'bankInfo',
        'gradeText',
        'reconciliationStartDate',
        'reconciliationEndDate',
        'createByName'
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  created() {
    if (localStorage.getItem('supplierManagementFlag')) {
      let roleFlag = JSON.parse(localStorage.getItem('supplierManagementFlag'))
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
    this.superForm = this.form
    this.getcategoryTree(true)
    this.getDictionaryType()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    submit() {
      this.UploadProduct(this.file)
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    // handleFileChange(file) {
    //   this.file = file.raw
    // },
    handleFileChange(file, fileList) {
      // 当文件状态变为成功时，表示上传成功，可以替换文件
      console.log(file, fileList, '123123');
      this.file = file.raw
    },
    handleFileexceed(files) {
      this.$refs['uploadRef'].clearFiles()
      this.$nextTick(() => {
        this.$refs['uploadRef'].handleStart(files[0])
      })
    },
    // 导入产品
    importProductFun() {
      this.uploadVisib = true
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/供应商导入模板.xlsx')
      a.click()
    },
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.listLoading = true
      var formData = new FormData()
      formData.append("file", data)
      //调用上传文件接口
      supplierupload(formData, 'supplier').then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)
          this.listLoading = false
          this.loadingText = ''
        } else {
          this.handleMessage(res.data)
        }
        this.uploadVisib = false
        this.initData()
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.uploadVisib = false
        this.listLoading = false
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
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
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
    filterNode(value, data) {
      if (!value) return true
      return data.fullName.indexOf(value) !== -1
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    // // 设置默认展开
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem('supplierManagementFlag', expands)
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
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
          ...this.form,
          exportType: '1001',
          exportName: '供应商管理信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.form.pageSize : -1,
          totalRowFlag: true
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
    handleClick() { },
    moreQueries() {
      this.visible = true
    },
    dataFormSubmit() {
      this.form.pageNum = 1
      if (this.form.customerRecognitionTime && this.form.customerRecognitionTime.length > 0) {
        this.form.customerRecognitionStartTime = this.form.customerRecognitionTime[0]
        this.form.customerRecognitionEndTime = this.form.customerRecognitionTime[1]
      } else {
        this.form.customerRecognitionStartTime = ''
        this.form.customerRecognitionEndTime = ''
      }
      this.initData()
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.form.orderItems[0].asc = order === 'ascending'
      this.form.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    // 获取数据字典——等级
    getDictionaryType() {
      getDictionaryType().then((res) => {
        let data = res.data.list
        data.forEach((item) => {
          if (item.enCode == 'partnerArchives') {
            let children = item.children
            children.forEach((resp) => {
              if (resp.enCode == 'grade') {
                let id = resp.id
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then((response) => {
                  this.gradeList = response.data.list
                })
              }
            })
          }
        })
      })
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
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
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    getcategoryTree(isInit) {
      this.treeLoading = true
      let listQuery = {
        keyword: '',
        type: 'supplier'
      }
      getcategoryTree(listQuery)
        .then((res) => {
          this.treeData = res.data
          this.$nextTick(() => {
            this.treeLoading = false
            if (isInit) this.initData()
          })
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    initData() {
      this.listLoading = true

      getCooperativeData(this.superForm)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type) {
      if (this.form.customerRecognitionTime && this.form.customerRecognitionTime.length > 0) {
        this.form.customerRecognitionStartTime = this.form.customerRecognitionTime[0]
        this.form.customerRecognitionEndTime = this.form.customerRecognitionTime[1]
      } else {
        this.form.customerRecognitionStartTime = ''
        this.form.customerRecognitionEndTime = ''
      }
      this.form.pageNum = 1
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.form = {
        code: '',
        taxId: '',
        name: '',
        customerRecognitionTime: [],
        customerRecognitionStartTime: '',
        customerRecognitionEndTime: '',
        personResponsible: '',
        contacts: '',
        phone: '',
        mobilePhone: '',
        email: '',
        grade: '',
        type: 'supplier',
        partnerCategoryId: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ]
      }
      this.filterText = ''
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'code', fieldValue: '', label: '编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'name', fieldValue: '', label: '名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'mobilePhone', fieldValue: '', label: '手机号', symbol: 'like', searchType: 1, width: 120 },

      ]
      this.getcategoryTree(true)

      this.search('basic')
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map((o) => o.id)
      this.search('basic')
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init()
      })
    },
    addOrUpdateHandle(id, parentId) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, '', false, parentId)
        })
        // }, 600);
      }
    },
    removeUserRelationList(isRefresh) {
      this.userRelationListVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    removeAuthorizeForm(isRefresh) {
      this.authorizeFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteCooperative(id).then((res) => {
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
    handleUserRelation(id, parentId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType, false, parentId)
      })
    }
  }
}
</script>
<style scoped>
.JNPF-common-layout-left {
  /* margin-right: 0; */
  /* border-right: 1px solid #cacaca; */
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
}

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
</style>
<style scoped>
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
