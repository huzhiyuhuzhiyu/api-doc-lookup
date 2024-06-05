<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>承运商分类</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>

      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i
              :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.code" placeholder="请输入承运商编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.name" placeholder="请输入名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.taxId" placeholder="请输入税号" clearable />
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
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier()" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column>
          <el-table-column prop="code" label="承运商编码" width="200" fixed="left" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'true')">{{
                  scope.row.code
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" width="150" fixed="left" sortable="custom" />
          <el-table-column prop="taxId" label="税号" width="200" />
          <el-table-column prop="regionCodeText" label="地区" width="100" />
          <el-table-column prop="countryText" label="国家" min-width="150" />
          <el-table-column prop="provinceText" label="省" width="160" />
          <el-table-column prop="cityText" label="市" width="160" />
          <el-table-column prop="areaText" label="区" width="160" />
          <el-table-column prop="address" label="地址" width="160" />
          <el-table-column prop="billingTypeText" label="开票类型" width="160" />
          <el-table-column prop="taxRate" label="税率%" width="100" />
          <el-table-column prop="customerRecognitionTime" label="认定日期" width="160" sortable="custom" />
          <el-table-column prop="personResponsible" label="负责人" width="160" />
          <el-table-column prop="contacts" label="联系人" width="160" />
          <el-table-column prop="phone" label="电话" width="160" />
          <el-table-column prop="mobilePhone" label="手机号" width="160" />
          <el-table-column prop="fax" label="传真" width="160" />
          <el-table-column prop="zipCode" label="邮编" width="160" />
          <el-table-column prop="email" label="邮箱" width="160" />
          <el-table-column prop="bank" label="开户银行" width="160" />
          <el-table-column prop="bankInfo" label="银行账号" width="160" />
          <el-table-column prop="salespersonIdText" label="所属销售人员" width="160" />
          <el-table-column prop="gradeText" label="等级" width="160"></el-table-column>
          <el-table-column prop="idNo" label="身份证号" width="160"></el-table-column>
          <el-table-column prop="licensePlateNumber" label="车牌号" width="160"></el-table-column>
          <el-table-column prop="driverLicense" label="驾驶证号" width="160"></el-table-column>
          <el-table-column prop="drivingLicense" label="行驶证号" width="160"></el-table-column>
          <el-table-column prop="tonnageUnitPrice" label="吨数单价" width="160"></el-table-column>
          <el-table-column prop="cubicUnitPrice" label="立方数单价" width="160"></el-table-column>
          <el-table-column prop="unitPricePieces" label="件数单价" width="160"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="160" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId)"
                @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'true')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getcategoryTree" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="form" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="承运商编码">
              <el-input v-model="form.code" placeholder="请输入承运商编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input v-model="form.name" placeholder="请输入名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税号">
              <el-input v-model="form.taxId" placeholder="请输入税号" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人">
              <el-input v-model="form.personResponsible" placeholder="请输入负责人" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="form.contacts" placeholder="请输入联系人" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="form.phone" placeholder="请输入电话" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="form.mobilePhone" placeholder="请输入手机号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等级">
              <el-select v-model="form.grade" placeholder="请选择等级" clearable>
                <el-option v-for="(item, index) in gradeList" :key="index" :label="item.fullName"
                  :value="item.enCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号">
              <el-input v-model="form.idNo" placeholder="请输入身份证号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号">
              <el-input v-model="form.licensePlateNumber" placeholder="请输入车牌号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶证号">
              <el-input v-model="form.driverLicense" placeholder="请输入驾驶证号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行驶证号">
              <el-input v-model="form.drivingLicense" placeholder="请输入行驶证号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="认定日期">
              <el-date-picker v-model="form.customerRecognitionTime" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
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
  </div>
</template>

<script>
import { UserListAll, } from '@/api/permission/user'
import { getcategoryTree, getCooperativeData, deleteCooperative } from '@/api/basicData/index'
import Form from './Form'
import UserRelationList from './userRelation'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
export default {
  name: 'carrierProfile',
  components: { Form, UserRelationList, },
  data() {
    return {
      title: "更多查询",
      visible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      form: {
        code: "",
        taxId: "",
        name: "",
        customerRecognitionTime: [],
        customerRecognitionStartTime: "",
        customerRecognitionEndTime: "",
        personResponsible: "",
        contacts: "",
        phone: "",
        mobilePhone: "",
        email: '',
        grade: "",
        type: "carrier",
        partnerCategoryId: "",
        salespersonId: "",
        idNo: "",
        licensePlateNumber: "",
        driverLicense: "",
        drivingLicense: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
      },
      salespersonList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick(picker) {
            const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
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
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.getcategoryTree(true)
    this.getDictionaryType()
    this.getUserList()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.form.orderItems[0].asc = order === "ascending"
      this.form.orderItems[0].column = newProp
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    dataFormSubmit() {
      this.form.pageNum = 1
      if (this.form.customerRecognitionTime && this.form.customerRecognitionTime.length > 0) {
        this.form.customerRecognitionStartTime = this.form.customerRecognitionTime[0]
        this.form.customerRecognitionEndTime = this.form.customerRecognitionTime[1]
      }else{
        this.form.customerRecognitionStartTime = ""
        this.form.customerRecognitionEndTime = ""
      }
      this.initData()

    },
    // 获取销售人员
    getUserList() {
      let obj = {
        currentPage: 1,
        pageSize: -1
      }
      UserListAll(obj).then(res => {
        console.log("销售人员", res);
        this.salespersonList = res.data.list
      })
    },


    // 获取数据字典——等级
    getDictionaryType() {
      getDictionaryType().then(res => {
        console.log("rescc", res);
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "grade") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  console.log("response", response);
                  this.gradeList = response.data.list
                })
              }
            });

          }
        });
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
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getcategoryTree(isInit) {
      this.treeLoading = true
      let listQuery = {
        keyword: '',
        type: "carrier"
      };
      getcategoryTree(listQuery).then(res => {
        console.log(99, res);
        this.treeData = res.data
        this.$nextTick(() => {
          this.treeLoading = false
          if (isInit) this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    initData() {
      this.listLoading = true

      getCooperativeData(this.form).then(res => {
        console.log("res++", res);
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      if (this.form.customerRecognitionTime && this.form.customerRecognitionTime.length > 0) {
        this.form.customerRecognitionStartTime = this.form.customerRecognitionTime[0]
        this.form.customerRecognitionEndTime = this.form.customerRecognitionTime[1]
      } else {
        this.form.customerRecognitionStartTime = ""
        this.form.customerRecognitionEndTime = ""
      }
      this.form.pageNum = 1
      this.initData()
    },
    reset() {
      this.form.pageNum = 1
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.form = {
        code: "",
        taxId: "",
        name: "",
        customerRecognitionTime: [],
        customerRecognitionStartTime: "",
        customerRecognitionEndTime: "",
        personResponsible: "",
        contacts: "",
        phone: "",
        mobilePhone: "",
        email: '',
        grade: "",
        type: "carrier",
        partnerCategoryId: "",
        salespersonId: "",
        idNo: "",
        licensePlateNumber: "",
        driverLicense: "",
        drivingLicense: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],

      }
      this.getcategoryTree(true)

    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.search()
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
      console.log("121342134", id, parentId);
      this.formVisible = true
      if (id) {
        console.log(4444444);
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, parentId,)
        })
        // }, 600);
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteCooperative(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, parentId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, btnType)
      })
    }
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

</style>

