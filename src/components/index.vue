<template>
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-left">
        <div class="JNPF-common-title">
          <h2>{{ $t('common.organization') }}</h2>
          <span class="options">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getOrganizeList()">刷新数据</el-dropdown-item>
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
              <i :class="data.icon" />
              <span class="text" :title="data.name">{{ data.name }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item label="编号">
                <el-input v-model="form.code" placeholder="请输入编号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="税号">
                <el-input v-model="form.taxId" placeholder="请输入税号" clearable />
              </el-form-item>
  
            </el-col>
            <el-col :span="4">
              <el-form-item label="名称">
                <el-input v-model="form.name" placeholder="请输入名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="认定日期">
                <el-date-picker v-model="form.customerRecognitionTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
  
            </el-col>
            <el-col :span="4">
              <el-form-item label="负责人">
                <el-input v-model="form.personResponsible" placeholder="请输入负责人" clearable />
              </el-form-item>
  
            </el-col>
            <el-col :span="4">
              <el-form-item label="联系人">
                <el-input v-model="form.contacts" placeholder="请输入联系人" clearable />
              </el-form-item>
  
            </el-col>
            <el-col :span="4">
              <el-form-item label="电话">
                <el-input v-model="form.phone" placeholder="请输入电话" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="手机">
                <el-input v-model="form.mobliePhone" placeholder="请输入手机" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="邮箱">
                <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="等级">
                <el-select v-model="form.grade" placeholder="请选择等级" clearable>
                  <el-option v-for="(item, index) in gradeList" :key="index" :label="item.fullName"
                    :value="item.enCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="addOrUpdateHandle()" />
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table v-loading="listLoading" :data="tableData">
            <el-table-column prop="code" label="编号" width="200" />
            <el-table-column prop="taxId" label="税号" width="200" />
            <el-table-column prop="name" label="名称" width="150" />
            <el-table-column prop="regionCodeText" label="地区" width="100" />
            <el-table-column prop="department" label="国家" min-width="150" show-overflow-tooltip />
            <el-table-column prop="provinceText" label="省" width="160" />
            <el-table-column prop="cityText" label="市" width="160" />
            <el-table-column prop="areaText" label="区" width="160" />
            <el-table-column prop="address" label="地址" width="160" />
            <el-table-column prop="areaText" label="开票类型" width="160" />
            <el-table-column prop="taxRate" label="税率" width="160" />
            <el-table-column prop="customerRecognitionTime" label="认定日期" width="160" />
            <el-table-column prop="personResponsible" label="负责人" width="160" />
            <el-table-column prop="contacts" label="联系人" width="160" />
            <el-table-column prop="phone" label="电话" width="160" />
            <el-table-column prop="mobilePhone" label="手机" width="160" />
            <el-table-column prop="fax" label="传真" width="160" />
            <el-table-column prop="zipCode" label="邮编" width="160" />
            <el-table-column prop="email" label="邮箱" width="160" />
            <el-table-column prop="bank" label="开户银行" width="160" />
            <el-table-column prop="bankInfo" label="银行账号" width="160" />
            <el-table-column prop="createTime" label="创建时间" width="160" />
            <el-table-column prop="createBy" label="创建人" width="160" />
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="handleUserRelation(scope.row.id, scope.row.fullName)">
                        {{ $t('position.postMember') }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
      <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm"/>
      <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
      <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" />
    </div>
  </template>
  
  <script>
  import { getPositionList, delPosition } from '@/api/permission/position'
  import { getcategoryTree, getCooperativeData } from '@/api/basicData/index'
  import Form from './Form'
  import Diagram from '@/views/permission/user/Diagram'
  import UserRelationList from './userRelation'
  import moment from 'moment'
  import {getDictionaryType,getDictionaryDataList} from '@/api/systemData/dictionary'
  export default {
    name: 'permission-position',
    components: { Form, UserRelationList, Diagram },
    data() {
      return {
        treeData: [],
        tableData: [],
        treeLoading: false,
        listLoading: false,
        authorizeFormVisible: false,
        userRelationListVisible: false,
        organizeIdTree: [],
        listQuery: {
          type: 'supplier',
          keyword: '',
          currentPage: 1,
          pageSize: 20
        },
        form: {
          code: "",
          taxId: "",
          name: "",
          customerRecognitionTime: undefined,
          personResponsible: "",
          contacts: "",
          phone: "",
          mobliePhone: "",
          email: '',
          grade: "",
          type: "supplier",
          partnerCategoryId: "",
        },
        pickerOptions: {
                  disabledDate(time) {
                      return time.getTime() > Date.now()
                  }
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
      this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
    },
    methods: {
      // 获取数据字典——等级
      getDictionaryType(){
        getDictionaryType().then(res=>{
          console.log("rescc",res);
          let data=res.data.list
          data.forEach(item => {
            if(item.enCode=="partnerArchives"){
              let children=item.children
              children.forEach(resp => {
                if(resp.enCode=="grade"){
                  let id=resp.id;
                  let obj={
                    keyword: '',
                    isTree: 0
                  }
                  getDictionaryDataList(id,obj).then(response=>{
                    console.log("response",response);
                    this.gradeList=response.data.list
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
  
  
      showDiagram() {
        this.diagramVisible = true
        this.$nextTick(() => {
          this.$refs.Diagram.init()
        })
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
          type: "supplier"
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
        }).catch(() => {
          this.listLoading = false
        })
      },
      search() {
        this.listQuery = {
          ...this.form,
          currentPage: 1,
          pageSize: 20
        }
        this.initData()
      },
      reset() {
        this.form={
          code: "",
          taxId: "",
          name: "",
          customerRecognitionTime: undefined,
          personResponsible: "",
          contacts: "",
          phone: "",
          mobliePhone: "",
          email: '',
          grade: "",
          type: "supplier",
          partnerCategoryId: "",
        }
        this.search()
      },
      handleNodeClick(data, node) {
        console.log("选择节点", node);
        if (this.form.partnerCategoryId === data.id) return
        this.form.partnerCategoryId = data.id
        const nodePath = this.getNodePath(node)
        this.organizeIdTree = nodePath.map(o => o.id)
        this.reset()
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
      
      addOrUpdateHandle(id, type, parentId) {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(id, parentId)
        })
  
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
        }).then(() => {
          delPosition(id).then(res => {
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
      handleUserRelation(id, name) {
        this.userRelationListVisible = true
        this.$nextTick(() => {
          this.$refs.UserRelationList.init(id, name)
        })
      }
    }
  }
  </script>
  