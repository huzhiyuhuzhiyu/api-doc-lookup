<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>客户分类</h2>
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
              <el-input v-model="form.code" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.name" placeholder="请输入客户名称" clearable />
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
          <topOpts @add="addOrUpdateHandle('', 'add')">
            <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
          custom-column>
          <el-table-column prop="code" label="客户编码" width="200" fixed="left" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId, 'true')">{{
                  scope.row.code
                }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="客户名称" width="150" fixed="left" sortable="custom" />
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
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="160" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
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
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :basicData="basicData" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="form" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="form.code" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="form.name" placeholder="请输入客户名称" clearable />
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
            <el-form-item label="所属销售人员">
              <user-select v-model="form.salespersonId" placeholder="请选择所属销售人员" clearable style="width: 100%;">
              </user-select>
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
import { getcategoryTree, getCooperativeData, deleteCooperative, excelExport } from '@/api/basicData/index'
import Form from './Form'
import UserRelationList from './userRelation'
import moment from 'moment'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import ExportForm from '@/components/no_mount/ExportBox/index'
import tabs from './params'
import { detailVisualDevInfo } from '@/api/system/system'
import formValidate from "@/utils/formValidate";
import request from "@/utils/request";
export default {
  name: 'customerFlies',
  components: { Form, UserRelationList, ExportForm },
  data() {
    return {
      tabs: tabs(),
      exportFormVisible: false,
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
        type: "customer",
        partnerCategoryId: "",
        salespersonId: "",
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
      filterText: '',
      basicData: [],
      formValidate,
      request,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.getDevDetail()
    this.getcategoryTree(true)
    this.getDictionaryType()
    this.getUserList()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    getDevDetail() {
      function getQueryString() {
        const url_string = location.href;
        return url_string.split('?')[1] || void ('');
      }
      let queryString = getQueryString()
      detailVisualDevInfo(queryString).then(res => {
        console.log(res);
        let formData = JSON.parse(res.data.formData)
        let fields = formData.fields[0].__config__.children
        console.log(fields);
        let that = this

        /**传入的方法花括号内容从this中解构，并返回 */
        function vEvalTransfer(params) {
          let copyparams = params
          let match = copyparams.substring(copyparams.indexOf('{'), copyparams.indexOf('}') + 1)
          // copyparams = copyparams.replace(match, match + ' = that')
          copyparams = copyparams.replace(match, '')
          function insertString(originalStr, newStr, index) {
            // 在索引位置插入新字符串
            return `${originalStr.slice(0, index)}${newStr}${originalStr.slice(index)}`;
          }

          var index1 = copyparams.indexOf('{') + 1;
          // 示例使用
          const newStr = '\nvar ' + match + ' = that;\n';

          const result = insertString(copyparams, newStr, index1);
          console.log('result', result)
          return result
        }

        function transformData(data) {
          return data.map(section => {
            // 处理每个 section 下的 children
            const processChildren = (children) => {
              return children.map(child => {
                const { jnpfKey, label, showLabel, tag, tagIcon, required, layout, span, dragDisabled, visibility, tableName, noShow, unique, regList, trigger, formId, renderKey } = child.__config__;
                const { prepend = "", append = "" } = child.__slot__ || {};
                const { __vModel__ } = child;
                const clearable = child.clearable || false;
                const readonly = child.readonly || false;
                const disabled = child.disabled || false;
                let itemRules = []
                let message = child.placeholder
                // eval(validate)
                // eval('console.log(\'=====================================\')')
                // eval('console.log(that)')
                console.log(regList);
                if (required) {
                  itemRules.push(
                    { required: true, message: message, trigger: 'blur' }
                  )
                }
                if (regList && Array.isArray(regList)) {
                  regList.forEach(item => {
                    if (item.pattern) {
                      itemRules.push(
                        // { pattern: `${eval(item.pattern)}`, message: item.message, trigger: 'blur' },
                      )
                    }
                    if (item.validate) {
                      // 如果是formValidate开头的自定义校验，把formValidate添加that标记
                      if (item.validate.trim().startsWith('formValidate')) {
                        item.validate = item.validate.replace('formValidate', 'that.formValidate')
                      } else { // 传入的方法花括号内容从this中解构，并返回
                        item.validate = vEvalTransfer(item.validate)
                      }
                      console.log(item.validate)
                      itemRules.push(
                        { validator: eval(item.validate), trigger: 'blur' }
                      )
                    }
                  })
                }

                return {
                  jnpfKey,
                  type: jnpfKey === 'comInput' ? 'input' : jnpfKey === 'select' ? 'select' : 'custom',
                  customComponent: jnpfKey,
                  selectClassifyType: child.selectClassifyType || '',
                  itemRules,
                  label,
                  showLabel,
                  tag,
                  tagIcon,
                  required,
                  layout,
                  span,
                  dragDisabled,
                  visibility,
                  tableName,
                  noShow,
                  unique,
                  regList,
                  trigger,
                  formId,
                  renderKey,
                  __slot__: { prepend, append },
                  clearable,
                  readonly,
                  disabled,
                  prop: that.getToLowerCase(__vModel__)
                };
              });
            };

            let children = section.__config__.children;

            // 如果是联系人信息，且包含 table 类型的子项，需要特殊处理
            if (section.title === "联系人信息") {
              children = section.__config__.children.flatMap(child => {
                if (child.__config__.jnpfKey === "table") {
                  return processChildren(child.__config__.children);
                } else {
                  return processChildren([child]);
                }
              });
            } else {
              children = processChildren(children);
            }

            return {
              title: section.title,
              __config__: {
                children
              }
            };
          });
        }
        let devData = transformData(fields)
        console.log(devData);
        that.basicData = devData
        console.log(that.basicData);
      })

    },
    getToLowerCase(val) {
      return val.replace(/_(.)/g, (match, group) => group.toUpperCase())
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
        console.log(includeFieldMap);
        let _data = {
          ...this.form,
          exportType: '1001',
          exportName: '客户档案',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.form.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.form.orderItems[0].asc = order === "ascending"
      this.form.orderItems[0].column = order === null ? "" : newProp
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
      } else {
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
        type: "customer"
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
        type: "customer",
        partnerCategoryId: "",
        salespersonId: "",
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
    addOrUpdateHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
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

