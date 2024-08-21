<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="addOrUpdateHandle()">
            新建
          </el-button>
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
                :class="[scope.row.childrenList.length >= 1 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']"></i>
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="parentName" label="上级分类" />
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="remark" label="备注" width="300">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.parentId)"
                @del="handleDel(scope.row.id, scope.row.parentId)"/>

               
             
              <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id, scope.row.parentId)">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                style=" color: #ff3a3a">删除</el-button> -->
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
  </div>
</template>

<script>
import { getcategoryTree, deleteCategory } from '@/api/basicData/materialSettings'
import DepForm from './depForm'
export default {
  name: 'row-classification',
  components: { DepForm },
  data() {
    return {
      listQuery: {
        classAttribute: "ispection_tools",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20
      },
      treeList: [],
      expands: true,
      refreshTable: true,
      btnLoading: false,
      listLoading: true,
      depFormVisible: false,
    }
  },
  
  
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.loading = true
      getcategoryTree(this.listQuery).then(res => {
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
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
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
      this.listQuery = {
        classAttribute: "ispection_tools",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20
      }

      this.initData()
    },
    addOrUpdateHandle(id, parentId) {
      this.addOrUpdateDep(id, parentId)

    },
    addOrUpdateDep(id, parentId) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, parentId)
      })
    },
    closeDepForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
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
          if (res.msg === "Success") {
            this.initData();
            this.$message({
              type: "success",
              message: "删除成功",
              duration: 1500
            });
          }
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