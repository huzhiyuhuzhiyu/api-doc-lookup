<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item :label="$t('common.keyword')">
              <el-input v-model="listQuery.keyword" :placeholder="$t('common.enterKeyword')"
                clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()"  class="commonBox">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()"  class="commonBox">{{$t('common.reset')}} 
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-dropdown>
              <el-button type="primary" icon="el-icon-plus">
                新建<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="addOrUpdateHandle('','company')">新建公司
                </el-dropdown-item>
                <el-dropdown-item @click.native="addOrUpdateHandle()">新建部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown style="margin:0 10px;">
                <el-button  type="primary" icon="el-icon-plus">
                  同步
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="toWxHandle">同步到企业微信</el-dropdown-item>
                  <el-dropdown-item @click.native="toDingHandle">同步到阿里钉钉</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="架构图" placement="top">
              <el-link   type="text"
                icon="icon-ym icon-ym-generator-section JNPF-common-head-icon"   :underline="false"
                @click="showDiagram()" />
            </el-tooltip>
            <!-- <el-tooltip effect="dark" content="列表" placement="top">
              <el-link   type="text"
                icon="icon-ym icon-ym-generator-table JNPF-common-head-icon" v-show="!isTableFlag" :underline="false"
                @click="changeMode()" />
            </el-tooltip> -->
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text"
                icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon" :underline="false"
                @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text"
                icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon" :underline="false"
                @click="toggleExpand()" />
            </el-tooltip>
           
            
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" hasC  ref="dataTable" :data="treeList" row-key="id" v-if="refreshTable&&isTableFlag"
          :default-expand-all="expands" :tree-props="{children: 'children', hasChildren: ''}" custom-column>
          <el-table-column prop="fullName" label="名称">
            <template slot-scope="scope">
              <i :class="'table-icon icon-my '+scope.row.icon"></i>{{scope.row.fullName}}
            </template>
          </el-table-column>
          <el-table-column prop="enCode" label="编码" />
          <!-- <el-table-column type="index" label="层级" width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="type" label="类型" width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.type==='company'?'公司':'部门'}}
            </template>
          </el-table-column>
          <el-table-column prop="creatorTime" :formatter="jnpf.tableDateFormatDayTime" label="创建时间"
            width="180" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id,scope.row.type,scope.row.parentId)"
                @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="checkMembers(scope.row.id,scope.row.fullName)">
                      复制</el-dropdown-item>
                    <el-dropdown-item @click.native="checkMembers(scope.row.id,scope.row.fullName)">
                      查看成员</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <Diagram v-if="diagramVisible" ref="Diagram" @close="diagramVisible = false" />
    <Form v-show="formVisible" ref="Form" @close="closeForm" />
    <DepForm v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
    <CheckUser v-if="checkUserFormVisible" ref="checkUserForm"
      @close="checkUserFormVisible=false" />
    <el-dialog title="数据同步" :visible.sync="dataVisible" class="JNPF-dialog JNPF-dialog_center sync-dialog" lock-scroll
      width="450px">
      <el-alert title="注意：尽量使用单向同步，避免双向同步造成数据重复" type="warning" :closable="false" show-icon />
      <div class="add-main">
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
      <div class="add-main">
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
import { getOrganizeList, delOrganize } from '@/api/permission/organize'
import Form from './Form'
import DepForm from './depForm'
import CheckUser from './checkUser.vue'
import Diagram from '@/views/permission/user/Diagram'
import {
  synAllOrganizeDingToSys,
  synAllUserDingToSys,
  synAllOrganizeQyToSys,
  synAllUserQyToSys,
  getOrganizeToDing,
  getUserToDing

} from '@/api/system/sysConfig'
export default {
  name: 'permission-organize',
  components: { Form, DepForm, CheckUser,Diagram },
  data() {
    return {
      diagramVisible:false,
      dataVisible:false,
      wechatLoading:false,
      dingLoading:false,
      name: '',
      names: '',
      synchronization:'',
      listQuery: {
        keyword: ''
      },
      treeList: [],
      expands: true,
      refreshTable: true,
      isTableFlag:true,
      btnLoading: false,
      listLoading: true,
      formVisible: false,
      depFormVisible: false,
      checkUserFormVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    showDiagram() {
      this.diagramVisible = true
      this.$nextTick(() => {
        this.$refs.Diagram.init()
      })
    },
    // changeMode(){
    //   this.isTableFlag=!this.isTableFlag
    // },
    columnSetFun(){ 
      console.log("this.$refs.dataTable",this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    initData() {
      this.loading = true
      getOrganizeList(this.listQuery).then(res => {
        this.treeList = res.data.list
        if (this.treeList.length > 0) this.setTableIndex(this.treeList);
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    search() {
      this.initData()
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        item.index = key + 1;
        if (index) {
          item.index = index + 1;
        }
        if (item.children) {
          this.setTableIndex(item.children, item.index);
        }
      });
    },
    reset() {
      this.listQuery.keyword = ''
      this.initData()
    },
    addOrUpdateHandle(id, type, parentId) {
      if (type === 'company') {
        this.addOrUpdateOrganize(id, parentId)
      } else {
        this.addOrUpdateDep(id)
      }
    },
    addOrUpdateOrganize(id, parentId) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId)
      })
    },
    addOrUpdateDep(id) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    closeDepForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    checkMembers(id, name) {
      this.checkUserFormVisible = true
      this.$nextTick(() => {
        this.$refs.checkUserForm.init(id, name)
      })
    },
    checkUser() {

    },
    toggleExpand() {
      this.refreshTable = false;
      this.expands = !this.expands;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delOrganize(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.$store.commit('generator/SET_COMPANY_TREE', [])
              this.$store.commit('generator/SET_DEP_TREE', [])
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    // 同步到钉钉
    toDingHandle(){
      if (!this.$refs.dataTable.getCurrentSelection().length) return this.$message.warning('请选择您要同步的组织数据')
      this.name = '同步到阿里钉钉'
      this.names = '用户数据同步到阿里钉钉'
      this.synchronization = '把阿里钉钉数据同步到系统'
      this.dataVisible = true
    },
    syncQy(type) {
      this.$confirm('同步以后会丢失现有数据，是否继续？', '提示', {
        type: 'warning'
      }).then(() => {
        type == 0 ? this.wechatLoading = true : this.dingLoading = true
        const method = this.row.synType == '组织' ? synAllOrganizeQyToSys : synAllUserQyToSys
        method(type).then(res => {
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
      let selectArr = this.$refs.dataTable.getCurrentSelection()
      let ids = selectArr.map(item=>item.id)
      this.$confirm('同步以后会丢失现有数据，是否继续？', '提示', {
        type: 'warning'
      }).then(() => {
        type == 0 ? this.wechatLoading = true : this.dingLoading = true
        const method = type == 0 ? getOrganizeToDing : synAllOrganizeDingToSys
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
<style lang="scss" scoped>
.table-icon {
  vertical-align: bottom;
  font-size: 16px;
  margin-right: 6px;
  line-height: 23px;
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