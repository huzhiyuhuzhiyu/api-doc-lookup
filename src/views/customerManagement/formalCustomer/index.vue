<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>

            <el-col :span="5">
              <el-form-item>
                <el-input v-model="dataForm.code" @keyup.enter.native="search()" clearable placeholder="请输入客户编码" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-input v-model="dataForm.name" @keyup.enter.native="search()" clearable placeholder="请输入客户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="salespersonId" ref="euqPeople">
                <user-select v-model="dataForm.salespersonId" placeholder="请选择所属销售" @change="changePerple" clearable
                  style="width: 100%;">
                </user-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
              @click="moreQueries()">更多查询</el-button>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier('', 'add')" :isJudgePer="true" :addPerCode="'btn_add'">
              <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button>
              <el-button size="mini" type="primary" v-has="'btn_import'" icon="el-icon-plus"
                @click="importFun">导入</el-button>
              <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
                icon="el-icon-download" @click="exportForm">导出</el-button>
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column hasC>
            <el-table-column prop="name" label="客户名称" sortable="custom" min-width="120">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'look')">{{
                  scope.row.name
                  }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="客户编码" sortable="custom" min-width="120" />
           
            <el-table-column prop="taxId" label="税号" min-width="120" />
            <el-table-column prop="contacts" label="联系人" sortable="custom" min-width="100" />
            <el-table-column prop="phone" label="电话" sortable="custom" min-width="120" />
            <el-table-column prop="mobilePhone" label="手机" sortable="custom" min-width="120" />
            <el-table-column prop="departmentIdText" label="所属部门" sortable="custom" min-width="120" />
            <el-table-column prop="salespersonIdText" label="所属销售" sortable="custom" min-width="120" />
            <el-table-column prop="internalStaffIdText" label="内勤人员" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
            <el-table-column label="操作" width="220" fixed="right">
              <template slot-scope="scope">
                <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                  @edit="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId, 'edit')">
                  <el-button size="mini" type="text" @click="handleRecord(scope.row)">写记录</el-button>
                  <el-button size="mini" type="text"
                    @click.native="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'look')">查看详情</el-button>

                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize"
            @pagination="initData">

          </pagination>
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">

        <el-form ref="dataForm" :model="dataForm" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="dataForm.code" placeholder="请输入客户编码" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="dataForm.name" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税号">
              <el-input v-model="dataForm.taxId" placeholder="请输入税号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="dataForm.contacts" placeholder="请输入联系人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="dataForm.phone" placeholder="请输入电话" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机">
              <el-input v-model="dataForm.mobilePhone" placeholder="请输入手机" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门">
              <ComSelect v-model="organizeIdTrees" placeholder="请选择所属部门" auth @change="onOrganizeChangeHandle"
                :currOrgId="dataForm.departmentId || '0'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属销售">
              <el-select v-model="dataForm.salespersonIdText" placeholder="请选择所属销售人员" clearable style="width: 100%;"
                filterable @change="selectsales">
                <el-option v-for="(item, index) in salesList" :key="index" :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内勤人员">
              <user-select v-model="dataForm.internalStaffId" placeholder="请选择内勤人员" @change="changeNQ" clearable
                style="width: 100%;">
              </user-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createTimeArr" type="datetimerange" format="yyyy-MM-dd hh:mm:ss"
                value-format="yyyy-MM-dd hh:mm:ss" style="width: 100%;" start-placeholder="开始时间" end-placeholder="结束时间"
                clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()">
          搜索</el-button>
      </span>
    </el-dialog>
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <RecordForm v-if="recordFormVisible" ref="RecordForm" @close="closeForm" />
     <!-- 高级查询 -->
     <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getPartnerList, deletePartner, uploadPartner } from '@/api/customerManagement'
import ExportForm from '@/components/no_mount/ExportBox/index'
import RecordForm from '../myCustomer/RecordForm.vue'
import { UserListAll, } from '@/api/permission/user'
import { excelExport, getCooperativeData } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getSaleordersTotal } from '@/api/salesManagement/assemblyOrders'
import { getOrganization } from '@/api/permission/user'
import Form from './Form'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { mapGetters, mapState } from 'vuex'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'formalCustomer',
  components: { Form, ExportForm, RecordForm ,SuperQuery},
  data() {
    return {
      exportFormVisible: false,
      recordFormVisible: false,
      organizeIdTrees: [],
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      treeLoading: false,
      listLoading: false,
      salesList: [],


      dataForm: {
        code: "",
        name: "",
        taxId: "",
        contacts: "",
        phone: "",
        mobilePhone: "",
        departmentId: "",
        salespersonIdText: "",
        salespersonId: "",
        internalStaffId: "",
        startTime: "",
        endTime: "",
        type: "customer",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery:{}
      },



      createTimeArr: [],
      total: 0,
      formVisible: false,
      filterText: '',
      selectArr: [],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'name',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'taxId',
          label: "税号",
          type: 'input'
        },
        {
          prop: 'contacts',
          label: "联系人",
          type: 'input'
        },
        {
          prop: 'phone',
          label: "电话",
          type: 'input'
        },
        {
          prop: 'mobilePhone',
          label: "手机号",
          type: 'input'
        },
        {
          prop: 'email',
          label: "邮箱",
          type: 'input'
        },
        { // 自定义选择器
          prop: 'salespersonId',
          label: '所属销售人员',
          type: 'custom',
          component: 'user-select',
        },
        // { // 下拉选
        //   prop: 'grade',
        //   label: '等级',
        //   type: 'select',
        //   options: this.gradeList // 注意，此options从接口异步获取，改变值时注意内存地址
        // },
        // { // 日期选择器（区间）
        //   prop: 'customerRecognitionTime',
        //   label: '认定日期',
        //   type: 'daterange',
        //   valueFormat: "yyyy-MM-dd",
        //   startPlaceholder: '开始日期',
        //   endPlaceholder: '结束日期',
        //   pickerOptions: this.global.timePickerOptions
        // },
      ],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },

  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.dataForm))
    this.initData()
  },
  methods: {
    columnSetFun(){ 
      console.log("this.$refs.dataTable",this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef);
        let columnList = domRef.columnList.filter(item => !!item.label && !!item.prop)
        columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
        this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
      } else {
        this.$message({
          message: "暂无数据导出",
          type: "error",
          duration: 1500,
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableData, 'dataTable')


    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let query = this.dataForm
        let _data = {
          ...query,
          exportType: '1001',
          exportName: '正式客户',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.dataForm.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    handleRecord(row) {
      this.recordFormVisible = true
      this.$nextTick(() => {
        this.$refs.RecordForm.init(row.id)
      })
    },
    selectsales(val) {
      console.log(val);
      this.dataForm.salespersonId = val
      // this.dataForm.salespersonIdText = val

    },
    onOrganizeChangeHandle(val) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('departmentId') })
      console.log("val,val", val);
      this.dataForm.salespersonIdText = ""
      this.dataForm.salespersonId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.departmentId = ''
      this.dataForm.departmentId = val[val.length - 1]

      getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
        console.log("用户", res);
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        console.log(this.salesList);
        this.salesList = res.data

      })
    },

    changeNQ(internalStaffId, data) {
      if (!data) return
      this.$refs['dataForm'].validateField('internalStaffId')
      if (data) {

      } else {
        this.$refs['dataForm'].fields[0].resetField()
        this.dataForm.internalStaffId = data.internalStaffId
      }

    },

    changePerple(salespersonId, data) {
      if (!data) return
      if (data) {

      } else {
        this.$refs['dataForm'].fields[0].resetField()
        this.dataForm.salespersonId = data.salespersonId
      }

    },


    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/客户导入模板.xlsx')
      a.click()
    },



    importFun() {

      this.$refs.UploadProduct.$el.querySelector('input').click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data.file)
      formData.append("customerSea", "formal")
      //调用上传文件接口
      uploadPartner(formData).then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)
          this.initData()
          this.formLoading = false
          this.loadingText = ''
        } else {
          this.handleMessage(res.data)
        }

      }).catch(err => {
        this.$message.error(`文件上传失败`)
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
            h('p', { style: 'font-size:14px;' }, '导入成功，存在潜在客户信息错误！'),
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





    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'departmentIdText' || prop === 'salespersonIdText' || prop === 'sealingRingName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.dataForm.orderItems[0].asc = order === "ascending"
      this.dataForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    moreQueries() {
      this.visible = true
    },
    dataFormSubmit() {
      this.dataForm.pageNum = 1
      Object.keys(this.dataForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.dataForm[key]
        this.dataForm[key] = typeof item === 'string' ? item.trim() : item
      })

      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.dataForm.startTime = this.createTimeArr[0]
        this.dataForm.endTime = this.createTimeArr[1]
      } else {
        this.dataForm.startTime = ""
        this.dataForm.endTime = ""
      }
      this.initData()

    },


    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.orderFollowVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      getCooperativeData(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })

    },


    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.listQuery = JSON.parse(JSON.stringify(this.dataForm))
      this.search()
    },



    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, '', btntype)
      })
    },

    addOrUpdateHandle(id, partnerCategoryId, btntype) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, partnerCategoryId, btntype)
        })
        // }, 600);
      }
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletePartner(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })

    },
    handleUserRelation(id, partnerCategoryId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, partnerCategoryId, btnType)
      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
  }
}
</script>
<style scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-head {
  padding: 10px;
}

.JNPF-common-search-box {
  padding-top: 5px;
  padding-bottom: 10px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

.aaa ::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}

::v-deep .icon-lingqu {
  margin-right: 8px
}
</style>
