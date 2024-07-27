<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" style="display: block;padding:0">
        <div class="title_box">
          <h2 v-if="!leftFlag">客户分类</h2>
          <!-- <span class="options" v-if="!leftFlag">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span> -->
        </div>
        <div v-if="!leftFlag"> <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable>
          </el-input></div>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="true" highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node }">
            <i class="el-icon-notebook-2" />
            <span class="text">{{ node.label }}</span>
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
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="treeBox_bot gjsearch" ref="fangan">
          <div style="width: 200px;">
            <el-input v-model="listQuery.name" placeholder="请输入客户名称" clearable @keyup.enter.native="search()" />
          </div>
          <div style="width: 190px;margin-left: 10px;">
            <el-button type="primary" icon="el-icon-search" @click="search()" class="commonBox">
              {{$t('common.search')}}</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset()" class="commonBox">{{$t('common.reset')}}
            </el-button>
          </div>
          <div ref="programmes" style="flex:1;overflow: auto;white-space: nowrap;">
            <div v-if="programmelist.length">
              <span class="text">方案：</span>
              <el-button :class="[programmetitle==item.fullName?'is-reverse':'']" size="mini" v-for="item in programmelist" :key="item.id" @click="actionreverse(item)">{{item.fullName}}</el-button>
              <el-popover placement="bottom-end" trigger="click" v-if="programmelist1.length" style="margin-left: 10px;">
                <el-button slot="reference" icon="el-icon-arrow-down" size="mini"></el-button>
                <div :class="['plan-list-item',programmetitle==o.fullName?'is-reverse':'']" v-for="(o, i) in programmelist1" :key="i" @click="actionreverse(o)">
                  <el-link class="plan-list-name" :underline="false">{{ o.fullName }}
                  </el-link>
                </div>
              </el-popover>
            </div>
          </div>
          <!-- <div style="width: 82px;">
            <el-button style="border:none;padding: 7px 8px;" size="mini" icon="icon-ym icon-ym-filter" @click="superQueryVisible = true">高级查询</el-button>
          </div> -->
        </div>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts :isJudgePer="true" :addPerCode="'btn_add'" @add="addSupplier('', 'add')">
              <el-button type="primary" size="mini" icon="iconfont icon-lingqu" @click="receiveFun()" :loading="btnLoading" :disabled="btnLoading">领取</el-button>
              <!-- <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button> -->
              <el-button size="mini" v-has="'btn_import'" type="primary" icon="el-icon-plus" @click="importProductFun">导入</el-button>
              <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary" icon="el-icon-download" @click="exportForm">导出</el-button>
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip content="高级查询" placement="top">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column hasC @selection-change="selectCustomerFun">
            <el-table-column prop="name" label="客户名称" sortable="custom" min-width="160">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'look')">{{
                  scope.row.name
                  }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="客户编码" sortable="custom" width="160" />

            <el-table-column prop="contacts" label="联系人" sortable="custom" width="120" />
            <el-table-column prop="phone" label="电话" sortable="custom" width="120" />
            <el-table-column prop="mobilePhone" label="手机" sortable="custom" width="120" />
            <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
            <el-table-column prop="createByName" label="创建人" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'" @edit="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId, 'edit')" @del="handleDel(scope.row.id)">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'look')">
                        查看详情
                      </el-dropdown-item>

                    </el-dropdown-menu>
                  </el-dropdown>
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData">

          </pagination>
        </div>
      </div>

    </div>
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" drag :auto-upload="false" :limit="1" :on-change="handleFileChange" ref="uploadRef">
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
    <programme :columnOptions="superQueryJson" :programmefrom="programmefrom" @superQuery="superQuerySearch" v-show="false"></programme>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" @saveproject="initData" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct" :http-request="UploadProduct" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />

  </div>
</template>

<script>
import { getAdvancedQueryList } from "@/api/system/advancedQuery";
import programme from "../components/programme.vue";
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getPartnerList, uploadProduct, deletePartner, receiveCustomer } from '@/api/customerManagement'
import { UserListAll, } from '@/api/permission/user'
import ExportForm from '@/components/no_mount/ExportBox/index'

import { excelExport, getcategoryTree } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getSaleordersTotal } from '@/api/salesManagement/assemblyOrders'
import Form from './Form'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'carrierProfile',
  components: { Form, ExportForm, programme, SuperQuery },
  data() {
    return {
      file:{},
      uploadVisib: false,
      superQueryJson: [
        {
          prop: 'name',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'code',
          label: "客户编码",
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
          label: "手机",
          type: 'input'
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        }
      ],
      superQueryVisible: false,
      programmefrom: {},
      partentOrChild: 'partent',
      programmetitle: '',
      datalist: [],
      programmelist1: [],
      programmelist: [],
      treeLoading: false,
      treeData: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      filterText: "",
      leftFlag: false,
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      treeLoading: false,
      listLoading: false,
      btnLoading: false,
      exportFormVisible: false,


      dataForm: {
        categoryId: '',
        code: "",
        name: "",
        contacts: "",
        phone: "",
        mobilePhone: "",
        startTime: "",
        endTime: "",
        customerStatus: "high_seas",
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
      formVisible: false,
      selectArr: [],
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
    currMenuId() {
      return (this.$route.meta.modelId || '') + this.partentOrChild
    }
  },
  beforeDestroy() {
    window.onresize = null
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.dataForm))
    this.getcategoryTree()
    // this.initData()
  },
  methods: {
    submit() {
      this.UploadProduct(this.file)
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    // 导入产品
    importProductFun() {
      this.uploadVisib = true
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    actionreverse(item) {
      this.programmefrom = item
      this.programmetitle = item.fullName
      this.isopen = false
    },
    async switchStyle() {
      await this.$nextTick();
      const programmes = this.$refs.programmes.offsetWidth
      if (programmes <= 100) {
        this.programmelist = []
        this.programmelist1 = this.datalist.slice(0)
        Math.floor(programmes / 100)
      } else {
        let num = Math.floor(programmes / 100)
        if (num - 1 > this.datalist.length) {
          num = this.datalist.length + 1
        }
        this.programmelist = this.datalist.slice(0, num - 1)
        this.programmelist1 = this.datalist.slice(num - 1)
      }
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      this.listQuery.categoryId = node.data.id
      this.search();
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      getcategoryTree({
        keyword: "",
        type: "customer"
      }).then(res => {
        this.treeData = res.data.length ? res.data : []
        this.listLoading = false
        this.$nextTick(() => {
          // this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
          this.listQuery.categoryId = ''
          this.treeLoading = false
          this.listLoading = false
          this.initData()
        })
      }).catch(() => {
        this.listLoading = false
        this.treeLoading = false
      })
    },
    columnSetFun() {
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
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1201',
          exportName: '公海客户',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },




    selectCustomerFun(val) {
      console.log("领取", val);
      this.selectArr = val
    },
    receiveFun() {
      if (!this.selectArr.length) return this.$message.error("请先选择你要领取的客户")
      let idList = this.selectArr.map(item => item.id);
      console.log("id", idList);
      this.btnLoading = true
      receiveCustomer(idList).then(res => {
        this.$message.success("领取成功")
        this.selectArr = []
        this.btnLoading = false
        this.initData()
      }).catch(error => {
        this.btnLoading = false

      })

    },

    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/公海客户导入模板.xlsx')
      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data)
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
        this.uploadVisib = false
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
      this.orderFollowVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      getPartnerList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
      getAdvancedQueryList(this.currMenuId).then(row => {
        this.datalist = row.data.list
        this.switchStyle()
      })
    },


    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.listQuery = JSON.parse(JSON.stringify(this.dataForm))
      this.programmetitle = ''
      this.getcategoryTree()
    },



    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, '', btntype)
      })
    },

    addOrUpdateHandle(id, catrGoryId, btntype) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, catrGoryId, btntype)
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
    handleUserRelation(id, catrGoryId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, catrGoryId, btnType)
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

.JNPF-common-search-box {
  padding-top: 8px;
  padding-bottom: 8px;
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
  margin-right: 8px;
}
</style>
<style scoped lang="scss">
.is-reverse {
  color: #fff !important;
  background-color: #3fb9f8;
}
.plan-list-item {
  & + & {
    margin-top: 5px;
  }
  height: 34px;
  align-items: center;
  line-height: 34px;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  &:hover {
    background-color: #3fb9f8;
  }
  .plan-list-name {
    &:hover {
      color: #606266;
    }
    .el-link--inner {
      // width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.gjsearch {
  display: flex;
  background-color: #fff;
  padding: 8px 10px;
  justify-content: space-between;
  align-items: center;
}
.treeBox_bot {
  .search-button {
    float: right;
    margin-right: 0;
    border: none;
    background-color: #fff;
    color: #606266;
  }
  .is-reverse {
    color: #fff;
    background-color: #3fb9f8;
  }
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
