<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
            <el-button type="primary" icon="el-icon-plus" @click.native="addOrUpdateHandle()">
              新建
            </el-button>
          <div class="JNPF-common-head-right">
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
        <JNPF-table v-loading="listLoading" :data="treeList" row-key="id" v-if="refreshTable"
          :default-expand-all="expands" :tree-props="{children: 'childrenList', hasChildren: ''}" custom-column>
          <el-table-column prop="name" label="分类名称">
            <template slot-scope="scope">
              <i :class="[scope.row.childrenList.length>=1?'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']"></i>{{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="分类编码" />
          <el-table-column prop="parentName" label="上级分类" />
          <el-table-column prop="createTime" label="创建时间" width="180" ></el-table-column>
          <el-table-column prop="remark" label="备注" width="300" >
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope" >
              <tableOpts @edit="addOrUpdateHandle(scope.row.id,scope.row.parentId)"
                @del="handleDel(scope.row.id, scope.row.parentId)"/>
              <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id,scope.row.parentId)" >编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id,scope.row.parentId)" style=" color: #ff3a3a">删除</el-button> -->
            </template>
          </el-table-column>
        </JNPF-table>
        <!-- <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                    :limit.sync="listQuery.pageSize" @pagination="initData" /> -->
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
    <CheckUser v-if="checkUserFormVisible" ref="checkUserForm"
      @close="checkUserFormVisible=false" />
  </div>
</template>

<script>
import {getcategoryTree,deleteCategory} from '@/api/basicData/materialSettings'
import DepForm from './depForm'
import CheckUser from './checkUser.vue'
export default {
  name: 'supplierCategory',
  components: {  DepForm, CheckUser },
  data() {
    return {
      listQuery: {
        keyword: '',
        classAttribute:"inspection_items",
        orderItems: [
          {
            asc: true,
            column: ""
          }
        ],
        pageNum: 1,
        pageSize: 20
      },
      total:0,
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
    initData() {
      this.loading = true
      getcategoryTree(this.listQuery).then(res => {
        console.log("树形",res);
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
      console.log("arr",arr,index);
      arr.forEach((item, key) => {
        item.index = key + 1;
        if (index) {
          item.index = index + 1;
        }
        if (item.childrenList.length>0) {
          this.setTableIndex(item.childrenList, item.index);
        }
      });
    },
    reset() {
      this.listQuery.keyword = ''
      this.initData()
    },
    addOrUpdateHandle(id, parentId) {
      console.log("id",id,parentId);
      this.addOrUpdateDep(id,parentId)

    },
    addOrUpdateDep(id,parentId) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id,parentId)
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
        deleteCategory(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
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