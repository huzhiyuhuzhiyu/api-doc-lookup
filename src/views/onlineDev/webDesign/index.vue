<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:5px 0 5px 0">
        <el-radio-group v-model="listQuery.category" style="background-color:#fff;">
          <el-radio-button label="" style="margin:3px 0">全部</el-radio-button>
          <el-radio-button style="margin:2px 0" v-for="item in categoryList"
            :key="item.enCode" :label="item.id">{{ item.fullName }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="JNPF-common-layout-center">
        <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item label="关键词">
                <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size=mini icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button icon="el-icon-refresh-right" size=mini @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <topOpts @add="openAddBox()">
              <upload-btn url="/api/visualdev/OnlineDev/Model/Actions/ImportData" @on-success="initData" />
            </topOpts>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table v-loading="listLoading" :data="list" custom-column ref="tabForm" :setColumnDisplayList="columnList">
            <el-table-column prop="fullName" label="名称" show-overflow-tooltip min-width="120" />
            <el-table-column prop="enCode" label="编码" min-width="120" />
            <el-table-column prop="webType" label="模式" min-width="70" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.webType == 1">表单</span>
                <span v-if="scope.row.webType == 2">列表</span>
                <span v-if="scope.row.webType == 3">流程</span>
              </template>
            </el-table-column>

            <el-table-column prop="state" label="状态" min-width="80" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.state == 1 ? 'success' : 'danger'" disable-transitions>
                  {{ scope.row.state == 1 ? '启用' : '禁用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="520">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                  <el-button type="text" size="mini" @click.native="toggleWebType(scope.row)">更改模式</el-button>
                  <el-button type="text" size="mini" @click.native="openReleaseDialog(scope.row)">同步菜单</el-button>
                  <el-button type="text" size="mini" @click.native="preview(scope.row.id)">预览模板</el-button>
                  <el-button type="text" size="mini" @click.native="copy(scope.row.id)">复制模板</el-button>
                  <el-button type="text" size="mini" @click.native="exportModel(scope.row.id)">导出模板</el-button>

                  <!-- <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{ $t('common.moreBtn') }}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="toggleWebType(scope.row)">更改模式
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="openReleaseDialog(scope.row)">同步菜单
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="preview(scope.row.id)">预览模板</el-dropdown-item>
                    <el-dropdown-item @click.native="copy(scope.row.id)">复制模板</el-dropdown-item>
                    <el-dropdown-item @click.native="exportModel(scope.row.id)">导出模板
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <AddBox :visible.sync="addVisible" :webType="currWebType" @add="handleAdd" />
    <el-dialog title="同步菜单" :visible.sync="releaseDialogVisible" class="JNPF-dialog JNPF-dialog_center release-dialog"
      lock-scroll width="600px">
      <el-alert title="将该功能的按钮、列表、表单及数据权限同步至系统菜单" type="warning" :closable="false" show-icon />
      <div class="dialog-main">
        <div class="item" :class="{ 'active': releaseQuery.pc === 1 }" @click="selectToggle('pc')">
          <i class="item-icon icon-ym icon-ym-pc"></i>
          <p class="item-title">同步Web端菜单</p>
          <div class="icon-checked">
            <i class="el-icon-check"></i>
          </div>
        </div>
        <div class="item" :class="{ 'active': releaseQuery.app === 1 }" @click="selectToggle('app')">
          <i class="item-icon icon-ym icon-ym-mobile"></i>
          <p class="item-title">同步APP端菜单</p>
          <div class="icon-checked">
            <i class="el-icon-check"></i>
          </div>
        </div>
      </div>
      <el-form class="dialog-form-main" :model="releaseQuery" :rules="releaseQueryRule" label-position="right"
        label-width="60px" ref="releaseForm">
        <template v-if="!currRow.pcIsRelease">
          <el-form-item label="上级" prop="pcModuleParentId" v-if="releaseQuery.pc">
            <JNPF-TreeSelect v-model="releaseQuery.pcModuleParentId" :options="treeData" placeholder="选择上级菜单" />
          </el-form-item>
        </template>
        <template v-if="!currRow.appIsRelease">
          <el-form-item label="" v-if="(!releaseQuery.pc || currRow.pcIsRelease) && releaseQuery.app">
          </el-form-item>
          <el-form-item label="上级" prop="appModuleParentId" v-if="releaseQuery.app">
            <JNPF-TreeSelect v-model="releaseQuery.appModuleParentId" :options="appTreeData" placeholder="选择上级菜单" />
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="releaseDialogVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="releaseBtnLoading" @click="release">
          {{ $t('common.confirmButton') }}</el-button>
      </span>
    </el-dialog>
    <previewDialog :visible.sync="previewDialogVisible" :id="currId" type="webDesign" />
  </div>
</template>

<script>
import Form from './Form'
import AddBox from '@/views/generator/AddBox'
import mixin from '@/mixins/generator/index'
import previewDialog from '@/components/PreviewDialog'
import { Release } from '@/api/onlineDev/visualDev'
import { getMenuSelector } from '@/api/system/menu'
import { getVisualDevList, Delete, Copy, exportData } from '@/api/onlineDev/visualDev'
import {
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delBimProductAttributes,
  addBimProductAttributes,
  getbimProductAttributesList,
  getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'onlineDev-webDesign',
  mixins: [mixin],
  components: { Form, AddBox, previewDialog },
  data() {
    return {
      defaultProps: {
        children: "childrenList",
        label: "fullName",
      },
      columnList: ["sortCode", "lastModifyTime", "creatorTime", "creatorUser", "webType", "category"],
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: '',
        keyword: "",
        category: "",
        type:1,
      },
      total: 0,
      sort: 'webDesign',
      previewDialogVisible: false,
      releaseDialogVisible: false,
      releaseBtnLoading: false,
      currRow: {},
      filterText: "",
      releaseQuery: {
        pc: 1,
        app: 1,
        pcModuleParentId: '',
        appModuleParentId: '',
      },
      releaseQueryRule: {
        pcModuleParentId: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        appModuleParentId: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
      },
      treeData: [],
      appTreeData: [],
      refreshTree: true,
      leftFlag: false,
      expands: true,
      treeLoading: false,

    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
    'listQuery.category':function(newVal){
      this.initData()
    },
  },
  mounted() {
    // this.getcategoryTree()
  },
  methods: {
    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      this.listQuery.category = node.data.id
      this.search();
    },
    // getcategoryTree() {
    //   this.treeLoading = true
    //   this.listLoading = true
    //   getbimProductAttributes('765929a127f44a5b80e773d65d58f96c').then(res => {
    //     this.treeData = res.data.list.length ? res.data.list : []
    //     this.listLoading = false
    //     this.$nextTick(() => {
    //       this.$refs.treeBox.setCurrentKey(this.treeData[0].id) // 默认选中节点第一个
    //       this.listQuery.category = this.treeData[0].id
    //       this.treeLoading = false
    //       this.listLoading = false
    //       this.initData()
    //     })
    //   }).catch(() => {
    //     this.listLoading = false
    //     this.treeLoading = false
    //   })
    // },
    initData() {
      this.listLoading = true

      getVisualDevList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    search() {
      this.listQuery.currentPage = 1
      this.initData()
    },
    reset() {
      this.listQuery.keyword = ''
      this.listQuery.currentPage = 1
      this.listQuery.category = ''
      this.search()
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    preview(id) {
      this.currId = id
      this.$nextTick(() => {
        this.previewDialogVisible = true
      })
    },
    openReleaseDialog(row) {
      this.currRow = row
      this.releaseDialogVisible = true
      this.releaseQuery = {
        pc: 1,
        app: 1,
        pcModuleParentId: '',
        appModuleParentId: '',
      }
      this.$nextTick(() => {
        this.$refs['releaseForm'].resetFields()
      })
      this.getMenuSelector()
      this.getAPPMenuSelector()
    },
    selectToggle(key) {
      this.releaseQuery[key] = this.releaseQuery[key] === 1 ? 0 : 1
    },
    // 发布菜单
    release() {
      this.$refs['releaseForm'].validate((valid) => {
        if (!valid) return
        if (!this.releaseQuery.pc && !this.releaseQuery.app) return this.$message.error('请至少选择一种菜单同步方式')
        this.releaseBtnLoading = true
        Release(this.currRow.id, this.releaseQuery).then(res => {
          this.releaseBtnLoading = false
          this.releaseDialogVisible = false
          this.initData()
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
          });
        }).catch(() => { this.releaseBtnLoading = false })
      })
    },
    getMenuSelector() {
      getMenuSelector({ category: 'Web' }, 0).then(res => {
        let topItem = {
          fullName: "顶级节点",
          hasChildren: true,
          id: "-1",
          children: res.data.list
        }
        this.treeData = [topItem]
      })
    },
    getAPPMenuSelector() {
      getMenuSelector({ category: 'App' }, 0).then(res => {
        this.appTreeData = res.data.list
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.release-dialog {
  >>>.el-dialog {
    .el-dialog__body {
      padding: 12px 55px;
    }
  }

  .dialog-form-main {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    >>>.el-form-item {
      width: 215px;
    }
  }

  .dialog-main {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .item {
      position: relative;
      width: 215px;
      height: 127px;
      cursor: pointer;
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      text-align: center;
      padding-top: 20px;
      color: #606266;

      &.active {
        border-color: #1890ff;
        color: #1890ff;
        box-shadow: 0 0 6px rgba(6, 58, 108, 0.1);

        .item-icon {
          border-color: #1890ff;
        }

        .icon-checked {
          display: block;
        }
      }

      .item-icon {
        display: inline-block;
        width: 44px;
        height: 44px;
        margin-bottom: 16px;
        border: 2px solid #606266;
        line-height: 40px;
        font-size: 24px;
        text-align: center;
        border-radius: 50%;
      }

      .item-title {
        font-size: 16px;
        font-weight: 400;
      }

      .icon-checked {
        display: none;
        width: 18px;
        height: 18px;
        border: 18px solid #1890ff;
        border-left: 18px solid transparent;
        border-top: 18px solid transparent;
        border-bottom-right-radius: 4px;
        position: absolute;
        right: 0px;
        bottom: 0px;

        i {
          font-size: 16px;
          position: absolute;
          top: 0;
          left: -2px;
          color: #fff;
        }
      }
    }
  }
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
