<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <!-- <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item :label="$t('common.keyword')">
              <el-input v-model="listQuery.keyword" :placeholder="$t('common.enterKeyword')"
                clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row> -->
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <!-- <el-dropdown> -->
          <el-button type="primary" size="mini" icon="el-icon-plus" @click.native="addOrUpdateHandle()">
            新建
          </el-button>
          <!-- <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addOrUpdateHandle('','company')">新建公司
              </el-dropdown-item>
              <el-dropdown-item >新建部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="treeList" row-key="id" v-if="refreshTable"
          :default-expand-all="expands" :tree-props="{ children: 'childrenList', hasChildren: '' }" custom-column>
          <el-table-column prop="name" label="名称">
            <template slot-scope="scope">
              <i
                :class="[scope.row.childrenList.length >= 1 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']"></i>{{
                  scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="parentName" label="上级分类" min-width="100" />
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="sortCode" label="排序" width="100" align="center">
            <template slot-scope="scope">
              <el-input @change="switchShow(scope.row, 'sortCode')" @blur="sortCodeBlur(scope.row)"
                v-model="scope.row.sortCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="300">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id, scope.row.parentId)">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                style=" color: #ff3a3a">删除</el-button> -->
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.parentId)"
                @del="handleDel(scope.row.id, scope.row.parentId)" />

            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
    <CheckUser v-if="checkUserFormVisible" ref="checkUserForm" @close="checkUserFormVisible = false" />
  </div>
</template>

<script>
import { getOrganizeList, delOrganize } from '@/api/permission/organize'
import { getcategoryTree, deleteCategory, editCategory } from '@/api/basicData/index'
import DepForm from './depForm'
import CheckUser from './checkUser.vue'
export default {
  // name: 'supplierCategory',
  components: { DepForm, CheckUser },
  data() {
    return {
      listQuery: {
        classAttribute: "equipment",
        keyword: '',
        type: "equipment_supplier",
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
      },
      treeList: [],
      expands: true,
      refreshTable: true,
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
    switchShow(row) {
      if (!row.sortCode) return this.$message.error('请修改排序值')
      let obj = row
      delete obj.burdenSortCode
      editCategory(obj)
        .then((response) => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    sortCodeBlur(row) {
      if (!row.sortCode) this.initData()
    },
    initData() {
      this.loading = true
      getcategoryTree(this.listQuery).then(res => {
        console.log("树形", res);
        this.treeList = res.data
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
      console.log("arr", arr, index);
      arr.forEach((item, key) => {
        item.index = key + 1;
        if (index) {
          item.index = index + 1;
        }
        if (item.childrenList.length > 0) {
          this.setTableIndex(item.childrenList, item.index);
        }
      });
    },
    reset() {
      this.listQuery.keyword = ''
      this.initData()
    },
    addOrUpdateHandle(id, parentId) {
      console.log("id", id, parentId);
      this.addOrUpdateDep(id, parentId)

    },
    addOrUpdateDep(id, parentId) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, parentId)
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
        type: 'warning',
      }).then(() => {
        deleteCategory(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        }).catch((error) => {
          if (error == "Error: 当前标签分类存在子标签分类") {
            this.$message({
              message: "当前供应商分类存在档案数据，不允许删除！",
              type: "error"
            })
          }
        })
      }).catch((error) => {
        console.log(error);
      })
    }
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
</style>