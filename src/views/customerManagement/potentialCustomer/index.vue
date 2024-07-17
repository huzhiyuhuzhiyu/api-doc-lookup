<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>

            <el-col :span="5">
              <el-form-item>
                <el-input v-model="listQuery.code" @keyup.enter.native="search()" placeholder="请输入客户编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-input v-model="listQuery.name" @keyup.enter.native="search()" placeholder="请输入客户名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.mobilePhone" @keyup.enter.native="search()" placeholder="请输入手机"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
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
        <div class="JNPF-common-layout-main JNPF-flex-main" :element-loading-text="loadingText">
          <div class="JNPF-common-head">
            <topOpts  :isJudgePer="true" :addPerCode="'btn_add'" @add="addSupplier('', 'add')">
              <el-button type="primary" size="mini" icon="iconfont  icon-fenpei" @click="distributionFun()">分配</el-button>
              <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button>
              <el-button v-has="'btn_import'" size="mini" type="primary" icon="el-icon-plus" @click="importFun">导入</el-button>
              <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
                icon="el-icon-download" @click="exportForm">导出</el-button>
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                @click="columnSetFun()" />
            </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column hasC @selection-change="handleProduce">
            <el-table-column prop="name" label="客户名称" sortable="custom" width="120" >
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id,scope.row.partnerCategoryId, 'look')">{{
                  scope.row.name
                  }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="客户编码" sortable="custom" width="120"/>
          
            <el-table-column prop="contacts" label="联系人" sortable="custom" width="120"/>
            <el-table-column prop="phone" label="电话" sortable="custom" width="120"/>
            <el-table-column prop="mobilePhone" label="手机" sortable="custom" width="120"/>
            <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="180" />
            <el-table-column prop="createByName" label="创建人" width="120"/>
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"  @edit="editPotentialCustomer(scope.row.id, scope.row.partnerCategoryId,'edit')"
                @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id)">转正式</el-dropdown-item>
                    <el-dropdown-item @click.native="handleRecord(scope.row)">写记录</el-dropdown-item>
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id,scope.row.partnerCategoryId, 'look')">查看详情</el-dropdown-item>

                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>

              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData">

          </pagination>
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
    <deForm v-if="deFormVisi" ref="deForm" @refreshDataList="initData" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="listQuery.code" placeholder="请输入客户编码" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="listQuery.name" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="listQuery.contacts" placeholder="请输入联系人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="listQuery.phone" placeholder="请输入电话" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机">
              <el-input v-model="listQuery.mobilePhone" placeholder="请输入手机" clearable />
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
    <el-dialog title="选择指定人员" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisi"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="customerDataForm" label-width="120px" label-position="top" :rules=customerRules>
          <el-col :span="12">
            <el-form-item label="指定人员" prop="userId" ref="euqPeople">
              <user-select v-model="customerDataForm.userId" placeholder="请选择指定人员" @change="changePerple" clearable
                style="width: 100%;">
              </user-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="customerVisi = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="submit()">
          提交</el-button>
      </span>
    </el-dialog>
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <RecordForm v-if="recordFormVisible" ref="RecordForm" @close="closeForm" />

  </div>
</template>

<script>
import { getPartnerList, uploadProduct, deletePartner, distributionCustomer } from '@/api/customerManagement'
import ExportForm from '@/components/no_mount/ExportBox/index'

import { UserListAll, } from '@/api/permission/user'
import { excelExport } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getSaleordersTotal } from '@/api/salesManagement/assemblyOrders'
import Form from './Form'
import RecordForm from '../myCustomer/RecordForm.vue'
import deForm from './deForm'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'potentialCustomer',
  components: { Form, deForm, ExportForm,RecordForm },
  data() {
    return {
      customerDataForm: {
        userId: "",
        idList: [],
      },
      exportFormVisible: false,
      recordFormVisible:false,
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      deFormVisi: false,
      tableData: [],
      treeLoading: false,
      listLoading: false,
      customerRules: {
        userId: [
          { required: true, message: '请选择指定人员', trigger: 'change' }

        ]
      },

      listQuery: {},
      dataForm: {
        code: "",
        name: "",
        contacts: "",
        phone: "",
        mobilePhone: "",
        startTime: "",
        endTime: "",
        customerStatus: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      createTimeArr: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      filterText: '',
      selectArr: [],
      customerVisi: false,
      loadingText: ""
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
    handleRecord(row){
      this.recordFormVisible = true
      this.$nextTick(()=>{
        this.$refs.RecordForm.init(row.id)
      })
    },
    // 提交分配客户
    submit() {
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          let idList = this.selectArr.map(item => item.id);
          this.customerDataForm.idList=idList
          distributionCustomer(this.customerDataForm).then(res => {
            this.customerVisi = false
            this.initData()
            this.$message.success("分配成功")
          })
        }
      })
    },
    changePerple(userId, data) {
      // console.log(data);
      if (!data) return
      this.$refs['diaForm'].validateField('userId')
      if (data) {

      } else {
        this.$refs['diaForm'].fields[0].resetField()
        this.customerDataForm.userId = data.userId
      }

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
          exportType: '1201',
          exportName: '潜在客户',
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

    distributionFun() {
      if (!this.selectArr.length) return this.$message.error("请先选择要分配的数据")
      this.customerVisi = true
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/公海客户导入模板.xlsx')
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
      formData.append("customerSea", "high_seas")
      //调用上传文件接口
      uploadProduct(formData).then(res => {
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
    handleProduce(val) {
      console.log("val>", val);
      this.selectArr = val
    },


    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop === 'sealingRingName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    moreQueries() {
      this.visible = true
    },
    dataFormSubmit() {
      this.listQuery.pageNum = 1
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })

      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.listQuery.startTime = this.createTimeArr[0]
        this.listQuery.endTime = this.createTimeArr[1]
      } else {
        this.listQuery.startTime = ""
        this.listQuery.endTime = ""
      }
      this.initData()

    },


    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.deFormVisi = false
      this.recordFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      getPartnerList(this.listQuery).then(res => {
        console.log("潜在客户", res);
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
        this.tableData = res.data.records
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
      this.listQuery = JSON.parse(JSON.stringify(this.listQuery))


      this.search()
    },



    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, '', btntype)
      })
    },

    addOrUpdateHandle(id) {
      this.deFormVisi = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.deForm.init(id)
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
    handleUserRelation(id,partnerCategoryId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, partnerCategoryId, btnType)
      })
    },
    editPotentialCustomer(id,partnerCategoryId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, partnerCategoryId, btnType)
      })
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

z .main {
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

::v-deep .icon-fenpei {
  margin-right: 8px
}
</style>
